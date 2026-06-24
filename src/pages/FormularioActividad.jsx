import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  FileText,
  Save,
  Send,
} from "lucide-react";
import {
  ActionButton,
  AppShell,
  EmptyState,
  Notice,
  PageIntro,
  Section,
  SelectField,
  TextArea,
  TextInput,
} from "../components/VcmUI";
import {
  canAccessRoute,
  createProjectDraft,
  ensureVcmData,
  getEntities,
  getRoleHome,
  getSession,
  modalidades,
  sedes,
} from "../data/vcmPlatform";

const initialForm = {
  entityId: "",
  title: "",
  description: "",
  objective: "",
  expectedResults: "",
  teamCount: "1",
  peoplePerTeam: "1",
  modality: "",
  targetCampus: "",
  createdBy: "",
};

export default function FormularioActividad() {
  const navigate = useNavigate();
  ensureVcmData();

  const session = getSession();
  const isSocioFormador = session?.role === "ee";
  const reviewTargetLabel = isSocioFormador ? "Validador" : "Socio formador";
  const [entities] = useState(getEntities);
  const ownEntity = useMemo(
    () => entities.find((entity) => entity.contactEmail?.toLowerCase() === session?.email?.toLowerCase()),
    [entities, session?.email],
  );
  const visibleEntities = useMemo(
    () => (session?.role === "ee" && ownEntity ? [ownEntity] : entities),
    [entities, ownEntity, session?.role],
  );
  const [form, setForm] = useState({
    ...initialForm,
    entityId: session?.role === "ee" && ownEntity ? ownEntity.id : "",
    createdBy: session?.name || "Validador",
  });
  const [message, setMessage] = useState(null);

  const selectedEntity = useMemo(() => visibleEntities.find((entity) => entity.id === form.entityId), [visibleEntities, form.entityId]);

  const entityOptions = visibleEntities.map((entity) => ({
    value: entity.id,
    label: `${entity.name} · ${entity.rut}`,
  }));

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const validate = () => {
    const required = [
      ["Socio formador asociado", selectedEntity?.id],
      ["Título de la propuesta", form.title],
      ["Descripción de la necesidad", form.description],
      ["Objetivo general", form.objective],
      ["Resultados esperados", form.expectedResults],
      ["Cantidad de equipos", form.teamCount],
      ["Personas por equipo", form.peoplePerTeam],
      ["Modalidad", form.modality],
      ["Sede destino", form.targetCampus],
    ];
    const missing = required.filter(([, value]) => !String(value || "").trim());

    if (missing.length > 0) {
      setMessage({ type: "error", text: `Faltan campos obligatorios: ${missing.map(([label]) => label).join(", ")}.` });
      return false;
    }
    if (Number(form.teamCount) < 1 || Number(form.peoplePerTeam) < 1) {
      setMessage({ type: "error", text: "La cantidad de equipos y personas por equipo debe ser mínimo 1." });
      return false;
    }
    return true;
  };

  const save = (sendToReview) => {
    if (!validate()) return;

    const project = createProjectDraft(form, selectedEntity, sendToReview, session?.role);
    setMessage({
      type: "success",
      text: sendToReview
        ? `Propuesta enviada a revisión del ${reviewTargetLabel}. Se generó notificación para el ${reviewTargetLabel}.`
        : "Propuesta guardada como borrador.",
    });
    const nextRoute = canAccessRoute(session?.role, "/dashboard")
      ? `/dashboard?proyecto=${project.id}`
      : isSocioFormador && sendToReview
        ? "/solicitudes-entidad"
        : getRoleHome(session?.role);
    window.setTimeout(() => navigate(nextRoute), 700);
  };

  return (
    <AppShell active="formulario">
      <PageIntro
        eyebrow="Registro y validación de propuesta"
        title="Formulario de propuesta VCM"
        description={
          isSocioFormador
            ? "Registra una propuesta como Socio formador. Al enviarla, pasa directamente al Validador para decidir si se ejecuta y se asigna académicamente."
            : "Crea una propuesta asociada a un Socio formador. Si nace desde la institución, no puede avanzar sin contraparte y V°B° del Socio formador."
        }
        actions={
          canAccessRoute(session?.role, "/dashboard") ? (
            <Link to="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100">
              <ArrowLeft className="h-5 w-5" />
              Volver al dashboard
            </Link>
          ) : null
        }
      />

      {message && (
        <div className="mb-5">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Section number="1" title="Socio formador asociado" subtitle="La propuesta no puede crearse sin un socio registrado.">
            {entities.length === 0 ? (
              <EmptyState
                title="No hay socios formadores registrados"
                description="Registra un Socio formador antes de crear la propuesta VCM."
                action={
                  <Link to="/registro" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#f5b400] px-5 text-sm font-extrabold text-neutral-950">
                    Registrar socio formador
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <SelectField
                  label="Socio formador"
                  required
                  value={form.entityId}
                  onChange={(value) => update("entityId", value)}
                  options={entityOptions}
                  placeholder="Seleccione socio formador"
                />
                <Link to="/registro" className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100">
                  Nuevo socio formador
                </Link>
              </div>
            )}
          </Section>

          <Section number="2" title="Información inicial de la propuesta" subtitle="Campos mínimos sugeridos para una propuesta de proyecto VCM.">
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="Título de la propuesta"
                  required
                  value={form.title}
                  onChange={(value) => update("title", value)}
                  placeholder="Ej: Mejora de procesos digitales para socio formador"
                />
                <TextInput
                  label={isSocioFormador ? "Responsable Socio formador" : "Validador responsable"}
                  value={form.createdBy}
                  onChange={(value) => update("createdBy", value)}
                  placeholder={isSocioFormador ? "Nombre contraparte" : "Validador"}
                />
              </div>
              <TextArea
                label="Descripción de la necesidad"
                required
                maxLength={900}
                value={form.description}
                onChange={(value) => update("description", value)}
                placeholder="Problema, oportunidad o requerimiento planteado por el Socio formador."
              />
              <TextArea
                label="Objetivo general"
                required
                maxLength={600}
                value={form.objective}
                onChange={(value) => update("objective", value)}
                placeholder="Propósito principal del proyecto."
              />
              <TextArea
                label="Resultados esperados"
                required
                maxLength={700}
                value={form.expectedResults}
                onChange={(value) => update("expectedResults", value)}
                placeholder="Productos, entregables o beneficios esperados."
              />
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="Cantidad de equipos"
                  required
                  type="number"
                  value={form.teamCount}
                  onChange={(value) => update("teamCount", value)}
                  placeholder="Mínimo 1"
                />
                <TextInput
                  label="Personas por equipo"
                  required
                  type="number"
                  value={form.peoplePerTeam}
                  onChange={(value) => update("peoplePerTeam", value)}
                  placeholder="Mínimo 1"
                />
                <SelectField
                  label="Modalidad"
                  required
                  value={form.modality}
                  onChange={(value) => update("modality", value)}
                  options={modalidades}
                  placeholder="Seleccione modalidad"
                />
                <SelectField
                  label="Sede destino"
                  required
                  value={form.targetCampus}
                  onChange={(value) => update("targetCampus", value)}
                  options={sedes}
                  placeholder="Seleccione sede"
                />
              </div>
            </div>
          </Section>

          <div className="flex flex-col-reverse gap-3 pb-10 sm:flex-row sm:justify-end">
            <ActionButton variant="outline" icon={<Save className="h-5 w-5" />} onClick={() => save(false)}>
              Guardar borrador
            </ActionButton>
            <ActionButton icon={<Send className="h-5 w-5" />} onClick={() => save(true)}>
              Enviar a revisión del {reviewTargetLabel}
            </ActionButton>
          </div>
        </div>

        <aside className="h-fit space-y-4 xl:sticky xl:top-6">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-5 text-white shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#f5b400]" />
              <div>
                <h3 className="text-lg font-black">Resumen</h3>
                <p className="text-sm text-neutral-300">Estado previo al envío.</p>
              </div>
            </div>
            <div className="space-y-3">
              <Summary label="Socio formador" value={selectedEntity?.name || "Pendiente"} />
              <Summary label="RUT" value={selectedEntity?.rut || "Pendiente"} />
              <Summary label="Título" value={form.title || "Pendiente"} />
              <Summary label="Equipos" value={`${form.teamCount || "0"} equipo(s) · ${form.peoplePerTeam || "0"} persona(s)`} />
              <Summary label="Modalidad" value={form.modality || "Pendiente"} />
              <Summary label="Sede destino" value={form.targetCampus || "Pendiente"} />
              <Summary label="Estado inicial" value={`Borrador / En revisión por ${reviewTargetLabel}`} />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#b68400]" />
              <h3 className="text-lg font-black text-neutral-950">Reglas aplicadas</h3>
            </div>
            <ul className="space-y-2 text-sm leading-6 text-neutral-600">
              <li>No se crea propuesta sin Socio formador.</li>
              {isSocioFormador ? (
                <>
                  <li>El envío genera notificación al Validador.</li>
                  <li>El Validador decide si la propuesta se acepta, se corrige o se rechaza.</li>
                  <li>Si se acepta, el Validador puede asignarla a escuela, carrera, sede y asignatura.</li>
                </>
              ) : (
                <>
                  <li>El envío genera notificación al Socio formador.</li>
                  <li>La asignación académica se bloquea hasta V°B° del Socio formador.</li>
                </>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Summary({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}
