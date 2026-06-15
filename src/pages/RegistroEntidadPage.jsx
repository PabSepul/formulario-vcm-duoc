import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Save,
  SearchCheck,
} from "lucide-react";
import {
  ActionButton,
  AuthShell,
  Notice,
  SelectField,
  TextInput,
} from "../components/VcmUI";
import { entityTypes, saveEntity } from "../data/vcmPlatform";
import { fetchCompanyFromSii } from "../services/siiCompany";

const initialEntity = {
  name: "",
  rut: "",
  type: "Empresa",
  contactName: "",
  contactEmail: "",
  phone: "",
  address: "",
  city: "",
  region: "",
  verified: false,
};

function normalizeRut(value) {
  return value.replace(/[^0-9kK]/g, "").toUpperCase();
}

function formatRut(value) {
  const cleanRut = normalizeRut(value).slice(0, 9);
  if (cleanRut.length <= 1) return cleanRut;
  const cuerpo = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
}

export default function RegistroEntidadPage() {
  const navigate = useNavigate();
  const [entity, setEntity] = useState(initialEntity);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setEntity((prev) => ({
      ...prev,
      [field]: field === "rut" ? formatRut(value) : value,
      verified: field === "rut" ? false : prev.verified,
    }));
    setMessage(null);
  };

  const verifyRut = async () => {
    if (!entity.rut.trim()) {
      setMessage({ type: "error", text: "Ingresa el RUT antes de verificar." });
      return;
    }

    setLoading(true);
    setMessage({ type: "info", text: "Consultando datos tributarios públicos..." });

    try {
      const company = await fetchCompanyFromSii(entity.rut);
      setEntity((prev) => ({
        ...prev,
        rut: company.rut,
        name: company.razonSocial,
        address: prev.address || company.giroEmpresa || "",
        verified: true,
      }));
      setMessage({ type: "success", text: `Entidad verificada desde ${company.fuente || "SII"}.` });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "No fue posible verificar el RUT." });
    } finally {
      setLoading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const required = [
      ["Nombre de la entidad", entity.name],
      ["RUT o identificador", entity.rut],
      ["Tipo de entidad", entity.type],
      ["Nombre de contacto", entity.contactName],
      ["Correo de contacto", entity.contactEmail],
    ];
    const missing = required.filter(([, value]) => !String(value).trim());

    if (missing.length > 0) {
      setMessage({ type: "error", text: `Faltan campos obligatorios: ${missing.map(([label]) => label).join(", ")}.` });
      return;
    }

    saveEntity(entity);
    setMessage({ type: "success", text: "Entidad registrada correctamente. Ya puede asociarse a propuestas VCM." });
    window.setTimeout(() => navigate("/login"), 700);
  };

  return (
    <AuthShell>
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-extrabold text-neutral-600 hover:text-neutral-950">
          <ArrowLeft className="h-4 w-4" />
          Volver al login
        </Link>

        <div className="mt-5 flex items-start gap-3">
          <div className="rounded-2xl bg-[#fff8df] p-3 text-[#b68400]">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b68400]">Registro de contraparte</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-neutral-950">Entidad Externa</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Campos mínimos según el documento: identificación, tipo, contacto y ubicación.
            </p>
          </div>
        </div>

        {message && (
          <div className="mt-5">
            <Notice type={message.type}>{message.text}</Notice>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <TextInput label="RUT o identificador" required value={entity.rut} onChange={(value) => update("rut", value)} placeholder="Ej: 76.883.241-2" />
            <ActionButton variant="dark" icon={<SearchCheck className="h-5 w-5 text-[#f5b400]" />} onClick={verifyRut} disabled={loading}>
              {loading ? "Verificando..." : "Verificar SII"}
            </ActionButton>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <TextInput label="Nombre de la entidad" required value={entity.name} onChange={(value) => update("name", value)} placeholder="Nombre formal" />
            <SelectField label="Tipo de entidad" required value={entity.type} onChange={(value) => update("type", value)} options={entityTypes} placeholder="Seleccione tipo" />
            <TextInput label="Nombre de contacto" required value={entity.contactName} onChange={(value) => update("contactName", value)} placeholder="Persona responsable" />
            <TextInput label="Correo de contacto" required type="email" value={entity.contactEmail} onChange={(value) => update("contactEmail", value)} placeholder="contacto@entidad.cl" />
            <TextInput label="Teléfono de contacto" value={entity.phone} onChange={(value) => update("phone", value)} placeholder="+56 9 0000 0000" />
            <TextInput label="Dirección / comuna / región" value={entity.address} onChange={(value) => update("address", value)} placeholder="Dirección institucional" />
            <TextInput label="Comuna" value={entity.city} onChange={(value) => update("city", value)} placeholder="Comuna" />
            <TextInput label="Región" value={entity.region} onChange={(value) => update("region", value)} placeholder="Región" />
          </div>

          {entity.verified && (
            <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-900">
              <CheckCircle2 className="h-5 w-5" />
              RUT verificado y razón social completada.
            </div>
          )}

          <div className="flex justify-end">
            <ActionButton type="submit" icon={<Save className="h-5 w-5" />}>
              Crear registro
            </ActionButton>
          </div>
        </form>
      </section>
    </AuthShell>
  );
}
