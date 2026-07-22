import { useMemo, useState } from "react";
import {
  Building2,
  ExternalLink,
  GraduationCap,
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
  StatusBadge,
  TextArea,
  TextInput,
} from "../components/VcmUI";
import {
  addNotification,
  addProjectEvent,
  ensureVcmData,
  getEntities,
  getProjects,
  getProjectsForSession,
  getSession,
  modalidades,
  sedes,
  updateProject,
} from "../data/vcmPlatform";

const trackedStatuses = [
  "En revisión por Validador",
  "En revisión por Socio formador",
  "Correcciones solicitadas por Validador",
  "Aprobada por Validador",
  "Aprobada por Socio formador",
  "Asignada a Escuela / Carrera / Sede / Director de carrera",
  "Asignada a asignatura",
  "Disponible para docentes",
  "Postulada / Tomada por docente",
  "En revisión VCM",
  "Docente aprobado / Nómina pendiente",
  "Proyecto en ejecución",
  "Hito registrado",
  "Hito observado",
  "Hito aprobado",
  "En cierre",
  "Cierre observado",
  "Finalizado exitosamente",
  "Publicado como proyecto realizado",
  "Cancelado",
  "Rechazado",
];

const SOCIO_FORMADOR_SURVEY_URL = "https://survey.alchemer.com/s3/8848039/Evaluaci-n-de-actividades-extracurricular-Socio-Formador";

export default function SolicitudesEntidadPage() {
  ensureVcmData();
  const session = getSession();
  const [projects, setProjects] = useState(getProjects);
  const [entities] = useState(getEntities);
  const [selectedEntityId, setSelectedEntityId] = useState(() => getEntities()[0]?.id || "");
  const [message, setMessage] = useState(null);
  const isAdmin = session?.role === "admin";
  const entityOptions = useMemo(() => entities.map((entity) => ({ value: entity.id, label: `${entity.name} · ${entity.rut}` })), [entities]);

  const entityIds = useMemo(
    () =>
      entities
        .filter((entity) => entity.contactEmail?.toLowerCase() === session?.email?.toLowerCase())
        .map((entity) => entity.id),
    [entities, session?.email],
  );

  const solicitudes = useMemo(() => {
    const base = ["admin", "jc"].includes(session?.role)
      ? getProjectsForSession(projects, session)
      : projects.filter((project) => entityIds.includes(project.entityId));
    const scopedBase = isAdmin && selectedEntityId ? base.filter((project) => project.entityId === selectedEntityId) : base;

    return scopedBase.filter((project) => project.application || trackedStatuses.includes(project.status));
  }, [entityIds, isAdmin, projects, selectedEntityId, session]);

  const [selectedId, setSelectedId] = useState(solicitudes[0]?.id || "");
  const selectedProject = solicitudes.find((project) => project.id === selectedId) || solicitudes[0];

  return (
    <AppShell active="solicitudes-entidad">
      <PageIntro
        eyebrow="Socio formador"
        title="Mis solicitudes"
        description="Seguimiento de solicitudes asociadas al Socio formador cuando ya fueron tomadas por un docente o avanzaron de estado."
      />

      {message && (
        <div className="mb-5">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      {isAdmin && (
        <div className="mb-5">
          <Section title="Vista de Socio formador" subtitle="Selecciona de qué socio quieres revisar las solicitudes.">
            <SelectField
              label="Socio formador"
              value={selectedEntityId}
              onChange={(value) => {
                setSelectedEntityId(value);
                setSelectedId("");
              }}
              options={entityOptions}
              placeholder="Todos los socios formadores"
            />
          </Section>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Section title="Solicitudes" subtitle="Proyectos vinculados al Socio formador y su estado actual.">
          <div className="space-y-3">
            {solicitudes.length === 0 ? (
              <EmptyState title="Sin solicitudes tomadas" description="Aún no hay solicitudes tomadas por docentes para este Socio formador." />
            ) : (
              solicitudes.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedProject?.id === project.id ? "border-[#f5b400] bg-[#fff8df]" : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="mb-3">
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="font-black text-neutral-950">{project.title}</p>
                  <p className="mt-1 text-sm text-neutral-500">{project.application?.teacher || "Docente pendiente"}</p>
                </button>
              ))
            )}
          </div>
        </Section>

        {selectedProject ? (
          <div className="space-y-5">
            <Section title={selectedProject.title} subtitle={selectedProject.entityName}>
              <div className="mb-5">
                <StatusBadge status={selectedProject.status} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Info icon={<Building2 className="h-5 w-5" />} label="Socio formador" value={selectedProject.entityName} />
                <Info icon={<GraduationCap className="h-5 w-5" />} label="Docente" value={selectedProject.application?.teacher || "Pendiente"} />
                <Info label="Asignatura" value={selectedProject.assignment?.subject} />
                <Info label="Sección / semestre" value={[selectedProject.assignment?.section, selectedProject.assignment?.semester].filter(Boolean).join(" · ")} />
                <Info label="Fechas ejecución" value={formatDates(selectedProject)} />
                <Info label="Equipos" value={formatTeams(selectedProject)} />
                <Info label="Modalidad / sede destino" value={formatExecution(selectedProject)} />
                <Info label="Último hito" value={lastMilestone(selectedProject)} />
              </div>
            </Section>

            {selectedProject.status === "Correcciones solicitadas por Validador" && (
              <CorrectionPanel
                key={selectedProject.id}
                project={selectedProject}
                session={session}
                onProjectUpdated={(notice) => {
                  setProjects(getProjects());
                  setMessage(notice);
                }}
              />
            )}

            <Section title="Resumen de avance" subtitle="Vista de seguimiento para la contraparte.">
              <div className="grid gap-4 md:grid-cols-3">
                <Info label="Estado actual" value={selectedProject.status} />
                <Info label="Estudiantes" value={selectedProject.application?.students} />
                <Info label="Cierre" value={selectedProject.closure?.summary || "Pendiente"} />
              </div>
            </Section>

            {shouldShowSurvey(selectedProject) && (
              <Section title="Encuesta de satisfacción" subtitle="Disponible al cierre del flujo del Socio formador.">
                <a
                  href={SOCIO_FORMADOR_SURVEY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-5 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]"
                >
                  <ExternalLink className="h-5 w-5" />
                  Conteste la encuesta de vinculación con el medio
                </a>
              </Section>
            )}
          </div>
        ) : (
          <EmptyState title="Selecciona una solicitud" description="El detalle aparecerá en esta zona." />
        )}
      </div>
    </AppShell>
  );
}

function buildCorrectionForm(project) {
  return {
    title: project?.title || "",
    description: project?.description || "",
    objective: project?.objective || "",
    expectedResults: project?.expectedResults || "",
    teamCount: String(project?.execution?.teamCount || "1"),
    peoplePerTeam: String(project?.execution?.peoplePerTeam || "1"),
    modality: project?.execution?.modality || "",
    targetCampus: project?.execution?.targetCampus || "",
    response: "",
  };
}

function CorrectionPanel({ project, session, onProjectUpdated }) {
  const [correctionForm, setCorrectionForm] = useState(() => buildCorrectionForm(project));
  const [localMessage, setLocalMessage] = useState(null);

  const updateCorrection = (field, value) => {
    setCorrectionForm((prev) => ({ ...prev, [field]: value }));
    setLocalMessage(null);
  };

  const resendCorrection = () => {
    const required = [
      ["Título", correctionForm.title],
      ["Necesidad", correctionForm.description],
      ["Objetivo", correctionForm.objective],
      ["Resultados esperados", correctionForm.expectedResults],
      ["Cantidad de equipos", correctionForm.teamCount],
      ["Personas por equipo", correctionForm.peoplePerTeam],
      ["Modalidad", correctionForm.modality],
      ["Sede destino", correctionForm.targetCampus],
    ];
    const missing = required.filter(([, value]) => !String(value || "").trim());
    if (missing.length > 0) {
      setLocalMessage({ type: "error", text: `Faltan campos para reenviar: ${missing.map(([label]) => label).join(", ")}.` });
      return;
    }
    if (Number(correctionForm.teamCount) < 1 || Number(correctionForm.peoplePerTeam) < 1) {
      setLocalMessage({ type: "error", text: "La cantidad de equipos y personas por equipo debe ser mínimo 1." });
      return;
    }

    const actor = session?.role === "admin" ? "admin" : "ee";
    const actorLabel = session?.role === "admin" ? "Administrador" : "Socio formador";
    updateProject(project.id, (currentProject) =>
      addNotification(
        addProjectEvent(
          {
            ...currentProject,
            title: correctionForm.title,
            description: correctionForm.description,
            objective: correctionForm.objective,
            expectedResults: correctionForm.expectedResults,
            status: "En revisión por Validador",
            observations: "",
            execution: {
              ...(currentProject.execution || {}),
              teamCount: Number(correctionForm.teamCount) || 1,
              peoplePerTeam: Number(correctionForm.peoplePerTeam) || 1,
              modality: correctionForm.modality,
              targetCampus: correctionForm.targetCampus,
            },
            maintainerReview: {
              ...(currentProject.maintainerReview || {}),
              correctionResponse: correctionForm.response,
              correctionSubmittedAt: new Date().toISOString(),
              correctionSubmittedBy: session?.name || actorLabel,
            },
          },
          actor,
          "Correcciones reenviadas",
          correctionForm.response || `El ${actorLabel} ajustó la propuesta solicitada por el Validador.`,
        ),
        "Validador",
        "El Socio formador reenvió una propuesta corregida para revisión.",
      ),
    );
    onProjectUpdated({ type: "success", text: "Correcciones reenviadas al Validador. La propuesta quedó nuevamente en revisión." });
  };

  return (
    <Section title="Corregir propuesta" subtitle="Edita la misma solicitud y reenvíala al Validador para una nueva revisión.">
      {localMessage && (
        <div className="mb-5">
          <Notice type={localMessage.type}>{localMessage.text}</Notice>
        </div>
      )}
      <Notice type="warning">
        Observación del Validador: {project.observations || project.maintainerReview?.comment || "Sin detalle registrado."}
      </Notice>

      <div className="mt-5 space-y-5">
        <TextInput
          label="Título de la propuesta"
          required
          value={correctionForm.title}
          onChange={(value) => updateCorrection("title", value)}
          placeholder="Título de la propuesta"
        />
        <TextArea
          label="Descripción de la necesidad"
          required
          value={correctionForm.description}
          onChange={(value) => updateCorrection("description", value)}
          placeholder="Problema, oportunidad o requerimiento actualizado."
        />
        <TextArea
          label="Objetivo general"
          required
          value={correctionForm.objective}
          onChange={(value) => updateCorrection("objective", value)}
          placeholder="Propósito principal actualizado."
        />
        <TextArea
          label="Resultados esperados"
          required
          value={correctionForm.expectedResults}
          onChange={(value) => updateCorrection("expectedResults", value)}
          placeholder="Productos, entregables o beneficios esperados."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput
            label="Cantidad de equipos"
            required
            type="number"
            value={correctionForm.teamCount}
            onChange={(value) => updateCorrection("teamCount", value)}
            placeholder="Mínimo 1"
          />
          <TextInput
            label="Personas por equipo"
            required
            type="number"
            value={correctionForm.peoplePerTeam}
            onChange={(value) => updateCorrection("peoplePerTeam", value)}
            placeholder="Mínimo 1"
          />
          <SelectField
            label="Modalidad"
            required
            value={correctionForm.modality}
            onChange={(value) => updateCorrection("modality", value)}
            options={modalidades}
            placeholder="Seleccione modalidad"
          />
          <SelectField
            label="Sede destino"
            required
            value={correctionForm.targetCampus}
            onChange={(value) => updateCorrection("targetCampus", value)}
            options={sedes}
            placeholder="Seleccione sede"
          />
        </div>
        <TextArea
          label="Respuesta al Validador"
          value={correctionForm.response}
          onChange={(value) => updateCorrection("response", value)}
          placeholder="Describe brevemente qué se corrigió."
          rows={3}
        />
        <div className="flex justify-end">
          <ActionButton icon={<Send className="h-5 w-5" />} onClick={resendCorrection}>
            Reenviar correcciones
          </ActionButton>
        </div>
      </div>
    </Section>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-neutral-500">
        {icon}
        <p className="text-xs font-black uppercase tracking-wide">{label}</p>
      </div>
      <p className="whitespace-pre-line text-sm font-semibold text-neutral-900">{value || "Pendiente"}</p>
    </div>
  );
}

function formatDates(project) {
  if (!project.application?.startDate || !project.application?.endDate) return "Pendiente";
  return `${project.application.startDate} a ${project.application.endDate}`;
}

function lastMilestone(project) {
  const current = project.milestones?.[0];
  if (!current) return "Sin hitos registrados";
  return `${current.title} · ${current.status}`;
}

function shouldShowSurvey(project) {
  return Boolean(
    project?.closure?.eeApproved ||
      ["Finalizado exitosamente", "Publicado como proyecto realizado"].includes(project?.status),
  );
}

function formatTeams(project) {
  const execution = project.execution || {};
  if (!execution.teamCount || !execution.peoplePerTeam) return "Pendiente";
  return `${execution.teamCount} equipo(s) · ${execution.peoplePerTeam} persona(s) por equipo`;
}

function formatExecution(project) {
  const execution = project.execution || {};
  return [execution.modality, execution.targetCampus].filter(Boolean).join(" · ") || "Pendiente";
}
