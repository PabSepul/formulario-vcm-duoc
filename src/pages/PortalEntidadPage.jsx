import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  MessageSquare,
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
} from "../components/VcmUI";
import {
  addNotification,
  addProjectEvent,
  ensureVcmData,
  getEntities,
  getProjects,
  getProjectsForSession,
  getSession,
  updateProject,
} from "../data/vcmPlatform";

const relevantStatuses = ["En revisión por Socio formador", "Hito registrado", "En cierre"];
const SOCIO_FORMADOR_SURVEY_URL = "https://survey.alchemer.com/s3/8848039/Evaluaci-n-de-actividades-extracurricular-Socio-Formador";

function getPendingMilestone(project) {
  return (project?.milestones || []).find((milestone) => milestone.status === "En revisión");
}

export default function PortalEntidadPage() {
  ensureVcmData();
  const session = getSession();
  const [projects, setProjects] = useState(getProjects);
  const [entities] = useState(getEntities);
  const [selectedEntityId, setSelectedEntityId] = useState(() => getEntities()[0]?.id || "");
  const [selectedId, setSelectedId] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(null);
  const isAdmin = session?.role === "admin";
  const entityOptions = useMemo(() => entities.map((entity) => ({ value: entity.id, label: `${entity.name} · ${entity.rut}` })), [entities]);
  const ownedEntityIds = useMemo(
    () =>
      entities
        .filter((entity) => entity.contactEmail?.toLowerCase() === session?.email?.toLowerCase())
        .map((entity) => entity.id),
    [entities, session?.email],
  );

  const scopedProjects = useMemo(() => {
    const base = getProjectsForSession(projects, session);
    if (isAdmin) return selectedEntityId ? base.filter((project) => project.entityId === selectedEntityId) : base;
    if (session?.role === "ee") return base.filter((project) => ownedEntityIds.includes(project.entityId));
    return base;
  }, [isAdmin, ownedEntityIds, projects, selectedEntityId, session]);

  const pendingProjects = useMemo(
    () => scopedProjects.filter((project) => relevantStatuses.includes(project.status) && !(project.status === "En cierre" && project.closure?.eeApproved)),
    [scopedProjects],
  );
  const selectedProject = scopedProjects.find((project) => project.id === selectedId) || pendingProjects[0];
  const selectedPendingMilestone = getPendingMilestone(selectedProject);

  const refresh = (notice) => {
    setProjects(getProjects());
    setComment("");
    if (notice) setMessage(notice);
  };

  const mutate = (updater, notice) => {
    if (!selectedProject) return;
    setSelectedId(selectedProject.id);
    updateProject(selectedProject.id, updater);
    refresh(notice);
  };

  const approveProposal = () => {
    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "Aprobada por Socio formador", eeApproved: true, observations: "" }, "ee", "V°B° entregado por Socio formador", "La propuesta fue aprobada por el Socio formador."),
          "Validador",
          "La propuesta fue aprobada por el Socio formador.",
        ),
      { type: "success", text: "V°B° registrado. El Validador podrá asignar Escuela / Carrera / Sede / Director." },
    );
  };

  const observeProposal = () => {
    if (!comment.trim()) {
      setMessage({ type: "error", text: "Registra observaciones antes de devolver la propuesta." });
      return;
    }

    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "Con observaciones de Socio formador", observations: comment }, "ee", "Observaciones registradas por Socio formador", comment),
          "Validador",
          "El Socio formador registró observaciones sobre la propuesta.",
        ),
      { type: "warning", text: "Observaciones enviadas al Validador." },
    );
  };

  const approveMilestone = () => {
    const milestoneInReview = getPendingMilestone(selectedProject);
    if (!milestoneInReview) {
      setMessage({ type: "error", text: "No hay un hito pendiente de validación en esta solicitud." });
      return;
    }

    mutate(
      (project) => {
        const milestones = (project.milestones || []).map((milestone) =>
          milestone.id === milestoneInReview.id
            ? { ...milestone, status: "Aprobado", reviewedAt: new Date().toISOString(), reviewComment: comment.trim() }
            : milestone,
        );
        return addNotification(
          addProjectEvent({ ...project, status: "Hito aprobado", milestones }, "ee", "Hito aprobado", `El Socio formador validó el hito "${milestoneInReview.title}".`),
          "Docente y Validador",
          "El hito fue aprobado por el Socio formador. El docente puede continuar con el siguiente avance.",
        );
      },
      { type: "success", text: "Hito aprobado. El docente ya puede continuar con el siguiente hito o cierre." },
    );
  };

  const observeMilestone = () => {
    const milestoneInReview = getPendingMilestone(selectedProject);
    if (!milestoneInReview) {
      setMessage({ type: "error", text: "No hay un hito pendiente de validación en esta solicitud." });
      return;
    }

    if (!comment.trim()) {
      setMessage({ type: "error", text: "Registra observaciones antes de observar el hito." });
      return;
    }

    mutate(
      (project) => {
        const milestones = (project.milestones || []).map((milestone) =>
          milestone.id === milestoneInReview.id ? { ...milestone, status: "Observado", observation: comment, reviewedAt: new Date().toISOString() } : milestone,
        );
        return addNotification(
          addProjectEvent({ ...project, status: "Hito observado", milestones }, "ee", "Hito observado por Socio formador", `${milestoneInReview.title}: ${comment}`),
          "Docente",
          "El Socio formador registró observaciones sobre el hito.",
        );
      },
      { type: "warning", text: "Observación de hito enviada al docente." },
    );
  };

  const approveClosure = () => {
    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "En cierre", closure: { ...(project.closure || {}), eeApproved: true } }, "ee", "Cierre aprobado por Socio formador", "El Validador debe validar el término administrativo."),
          "Validador",
          "El Socio formador aprobó el cierre del proyecto.",
        ),
      { type: "success", text: "Cierre aprobado. Conteste la encuesta de vinculación con el medio para finalizar su participación." },
    );
  };

  const observeClosure = () => {
    if (!comment.trim()) {
      setMessage({ type: "error", text: "Registra observaciones antes de devolver el cierre." });
      return;
    }

    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "Cierre observado", closure: { ...(project.closure || {}), observation: comment, eeApproved: false } }, "ee", "Cierre observado", comment),
          "Docente",
          "El Socio formador solicitó antecedentes adicionales para el cierre.",
        ),
      { type: "warning", text: "Observaciones de cierre enviadas al docente." },
    );
  };

  return (
    <AppShell active="entidad">
      <PageIntro
        eyebrow="Portal del Socio formador"
        title="Revisión y validaciones"
        description="Bandeja para entregar V°B°, observar propuestas, validar hitos y revisar el resultado final del proyecto."
      />

      {message && (
        <div className="mb-5">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      {isAdmin && (
        <div className="mb-5">
          <Section title="Vista de Socio formador" subtitle="Selecciona el socio que quieres revisar o corregir desde este portal.">
            <SelectField
              label="Socio formador"
              value={selectedEntityId}
              onChange={(value) => {
                setSelectedEntityId(value);
                setSelectedId("");
                setComment("");
              }}
              options={entityOptions}
              placeholder="Todos los socios formadores"
            />
          </Section>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Section title="Pendientes del Socio formador" subtitle="Propuestas, hitos y cierres que requieren acción.">
          <div className="space-y-3">
            {pendingProjects.length === 0 ? (
              <EmptyState title="Sin pendientes" description="No hay propuestas, hitos o cierres pendientes del Socio formador." />
            ) : (
              pendingProjects.map((project) => (
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
                  <p className="mt-1 text-sm text-neutral-500">{project.entityName}</p>
                </button>
              ))
            )}
          </div>
        </Section>

        {selectedProject ? (
          <div className="space-y-5">
            <Section title={selectedProject.title} subtitle="Detalle enviado por Validador o docente.">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedProject.status} />
                <span className="text-sm font-semibold text-neutral-500">{selectedProject.entityName}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Necesidad" value={selectedProject.description} />
                <Info label="Objetivo" value={selectedProject.objective} />
                <Info label="Resultados esperados" value={selectedProject.expectedResults} />
                <Info label="Equipos" value={formatTeams(selectedProject)} />
                <Info label="Modalidad / sede destino" value={formatExecution(selectedProject)} />
                <Info label="Último hito / cierre" value={lastEvidence(selectedProject)} />
              </div>
            </Section>

            <Section title="Acción del Socio formador" subtitle="Elige una resolución según el estado actual.">
              {selectedProject.status === "Hito registrado" && (
                <div className="mb-5">
                  <MilestoneReview milestone={selectedPendingMilestone} />
                </div>
              )}

              <TextArea
                label="Observaciones"
                value={comment}
                onChange={setComment}
                placeholder="Comentarios de ajuste para propuesta, hito o cierre."
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                {selectedProject.status === "En revisión por Socio formador" && (
                  <>
                    <ActionButton variant="outline" icon={<MessageSquare className="h-5 w-5" />} onClick={observeProposal}>Registrar observaciones</ActionButton>
                    <ActionButton icon={<CheckCircle2 className="h-5 w-5" />} onClick={approveProposal}>Entregar V°B°</ActionButton>
                  </>
                )}
                {selectedProject.status === "Hito registrado" && (
                  <>
                    <ActionButton variant="outline" icon={<MessageSquare className="h-5 w-5" />} onClick={observeMilestone} disabled={!selectedPendingMilestone}>Observar hito</ActionButton>
                    <ActionButton icon={<ClipboardCheck className="h-5 w-5" />} onClick={approveMilestone} disabled={!selectedPendingMilestone}>Validar hito</ActionButton>
                  </>
                )}
                {selectedProject.status === "En cierre" && !selectedProject.closure?.eeApproved && (
                  <>
                    <ActionButton variant="outline" icon={<MessageSquare className="h-5 w-5" />} onClick={observeClosure}>Observar cierre</ActionButton>
                    <ActionButton icon={<Send className="h-5 w-5" />} onClick={approveClosure}>Aprobar cierre</ActionButton>
                  </>
                )}
              </div>

              {selectedProject.status === "En cierre" && selectedProject.closure?.eeApproved && (
                <div className="mt-5">
                  <SurveyCallout />
                </div>
              )}
            </Section>
          </div>
        ) : (
          <EmptyState title="Selecciona un pendiente" description="El detalle aparecerá en esta zona." />
        )}
      </div>
    </AppShell>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-semibold text-neutral-900">{value || "Pendiente"}</p>
    </div>
  );
}

function SurveyCallout() {
  return (
    <div className="rounded-2xl border border-[#f5b400]/40 bg-[#fff8df] p-4">
      <p className="text-sm font-black text-neutral-950">Cierre aprobado por el Socio formador</p>
      <p className="mt-1 text-sm leading-6 text-neutral-700">
        Para completar la experiencia, conteste la encuesta de vinculación con el medio.
      </p>
      <a
        href={SOCIO_FORMADOR_SURVEY_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-5 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]"
      >
        <ExternalLink className="h-5 w-5" />
        Conteste la encuesta de vinculación con el medio
      </a>
    </div>
  );
}

function MilestoneReview({ milestone }) {
  if (!milestone) {
    return <Notice type="error">Esta solicitud está marcada con hito registrado, pero no tiene un hito en revisión para validar.</Notice>;
  }

  return (
    <div className="rounded-2xl border border-[#f5b400]/40 bg-[#fff8df] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#8a6500]">Hito enviado por docente</p>
          <p className="mt-1 text-lg font-black text-neutral-950">{milestone.title}</p>
        </div>
        <StatusBadge status="Hito registrado" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Info label="Comentarios del docente" value={milestone.comments} />
        <Info label="Evidencia enviada" value={milestone.evidence} />
      </div>
    </div>
  );
}

function lastEvidence(project) {
  if (project.status === "En cierre") return project.closure?.summary || "Solicitud de cierre registrada.";
  const current = getPendingMilestone(project);
  return current ? `${current.title}: ${current.evidence}` : "Sin evidencia pendiente.";
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
