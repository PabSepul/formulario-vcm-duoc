export async function fetchCompanyFromSii(rut) {
  const response = await fetch(`/api/sii-company?rut=${encodeURIComponent(rut)}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "No fue posible verificar el RUT en este momento.");
  }

  return payload.company;
}
