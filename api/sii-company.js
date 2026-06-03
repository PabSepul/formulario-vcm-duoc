const SRE_API_URL = process.env.SII_API_URL || "https://sre.cl/api/company_info";
const SRE_API_TOKEN = process.env.SII_API_TOKEN;
const SII_DTE_URL = "https://palena.sii.cl/cvc_cgi/dte/ee_empresa_rut";
const REQUEST_TIMEOUT_MS = 8000;

function normalizeRut(value = "") {
  return String(value).replace(/[^0-9kK]/g, "").toUpperCase();
}

function splitRut(value = "") {
  const cleanRut = normalizeRut(value);
  if (cleanRut.length < 2) return null;

  return {
    cuerpo: cleanRut.slice(0, -1),
    dv: cleanRut.slice(-1),
  };
}

function calculateRutDv(cuerpo) {
  let suma = 0;
  let multiplo = 2;

  for (let index = cuerpo.length - 1; index >= 0; index -= 1) {
    suma += Number(cuerpo[index]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resultado = 11 - (suma % 11);
  if (resultado === 11) return "0";
  if (resultado === 10) return "K";
  return String(resultado);
}

function isValidRut(value = "") {
  const parts = splitRut(value);
  if (!parts || !/^\d+$/.test(parts.cuerpo)) return false;

  return calculateRutDv(parts.cuerpo) === parts.dv;
}

function formatRut(value = "") {
  const parts = splitRut(value);
  if (!parts) return "";

  const cuerpoFormateado = parts.cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpoFormateado}-${parts.dv}`;
}

function jsonResponse(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function cleanText(value = "") {
  return decodeHtml(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value = "") {
  const namedEntities = {
    aacute: "á",
    eacute: "é",
    iacute: "í",
    oacute: "ó",
    uacute: "ú",
    Aacute: "Á",
    Eacute: "É",
    Iacute: "Í",
    Oacute: "Ó",
    Uacute: "Ú",
    ntilde: "ñ",
    Ntilde: "Ñ",
    nbsp: " ",
    deg: "°",
    ordm: "°",
    amp: "&",
    quot: "\"",
    apos: "'",
    lt: "<",
    gt: ">",
  };

  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-zA-Z]+);/g, (match, entity) => namedEntities[entity] || match);
}

function extractSiiTableValue(html, label) {
  const decodedHtml = decodeHtml(html);
  const pattern = new RegExp(
    `${label}[\\s\\S]*?<\\/td>\\s*<td[^>]*>[\\s\\S]*?<font[^>]*>([\\s\\S]*?)<\\/font>`,
    "i",
  );
  const match = decodedHtml.match(pattern);

  return match ? cleanText(match[1]) : "";
}

async function lookupViaSre(rut) {
  if (!SRE_API_TOKEN || process.env.SII_API_PROVIDER === "sii-dte") return null;

  const response = await fetchWithTimeout(SRE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: SRE_API_TOKEN,
      rut: formatRut(rut).replace(/\./g, ""),
      version: "2.0",
    }),
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok || typeof payload !== "object") {
    throw new Error(typeof payload === "string" ? payload : payload?.message || "No fue posible consultar SRE.");
  }

  const data = payload.data || payload.company || payload;
  const razonSocial =
    data.razon_social ||
    data.razonSocial ||
    data.nombre ||
    data.nombre_fantasia ||
    data.nombreFantasia ||
    "";
  const giro =
    data.giro ||
    data.glosa_giro ||
    data.actividad_economica ||
    data.actividadEconomica ||
    data.actividades?.[0]?.glosa ||
    "";

  if (!razonSocial) {
    throw new Error(payload.message || "La respuesta tributaria no incluyó razón social.");
  }

  return {
    rut: formatRut(rut),
    razonSocial: cleanText(razonSocial),
    giroEmpresa: cleanText(giro),
    fuente: "SII vía SRE",
  };
}

async function lookupViaSiiDte(rut) {
  const parts = splitRut(rut);
  if (!parts) return null;

  const url = new URL(SII_DTE_URL);
  url.searchParams.set("RUT_EMP", parts.cuerpo);
  url.searchParams.set("DV_EMP", parts.dv);

  const response = await fetchWithTimeout(url);
  const buffer = await response.arrayBuffer();
  const html = new TextDecoder("latin1").decode(buffer);

  if (!response.ok) {
    throw new Error("El SII no respondió correctamente.");
  }

  const razonSocial = extractSiiTableValue(html, "Razón Social/Nombres");
  if (!razonSocial || /no registra|no se encuentra|no autorizado/i.test(cleanText(html))) {
    return null;
  }

  const numeroResolucion = extractSiiTableValue(html, "N° Resolución");
  const fechaResolucion = extractSiiTableValue(html, "Fecha Resolución");
  const direccionRegional = extractSiiTableValue(html, "Dirección Regional");

  return {
    rut: formatRut(rut),
    razonSocial,
    giroEmpresa: "Registro público SII: contribuyente autorizado para documentos tributarios electrónicos",
    fuente: "SII DTE",
    metadata: {
      numeroResolucion,
      fechaResolucion,
      direccionRegional,
    },
  };
}

export async function lookupCompanyByRut(rut) {
  if (!isValidRut(rut)) {
    return {
      ok: false,
      statusCode: 400,
      message: "El RUT ingresado no es válido según el dígito verificador.",
    };
  }

  const errors = [];

  try {
    const company = await lookupViaSre(rut);
    if (company) return { ok: true, statusCode: 200, company };
  } catch (error) {
    errors.push(error.message);
  }

  try {
    const company = await lookupViaSiiDte(rut);
    if (company) return { ok: true, statusCode: 200, company };
  } catch (error) {
    errors.push(error.message);
  }

  return {
    ok: false,
    statusCode: 404,
    message:
      errors.length > 0
        ? "No fue posible obtener datos tributarios públicos para este RUT. Revisa el RUT o configura SII_API_TOKEN."
        : "No se encontró información tributaria pública para este RUT.",
  };
}

export async function handleSiiCompanyRequest(req, res) {
  if (req.method && !["GET", "OPTIONS"].includes(req.method)) {
    jsonResponse(res, 405, { message: "Método no permitido." });
    return;
  }

  if (req.method === "OPTIONS") {
    jsonResponse(res, 204, {});
    return;
  }

  const requestUrl = new URL(req.url || "/", "http://localhost");
  const rut = requestUrl.searchParams.get("rut") || "";
  const result = await lookupCompanyByRut(rut);

  jsonResponse(res, result.statusCode, result.ok ? { company: result.company } : { message: result.message });
}

export default async function handler(req, res) {
  try {
    await handleSiiCompanyRequest(req, res);
  } catch (error) {
    jsonResponse(res, 500, {
      message: "No fue posible consultar la información tributaria en este momento.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
