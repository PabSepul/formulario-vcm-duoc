import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
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
  StatusBadge,
  TextArea,
} from "../components/VcmUI";
import {
  addNotification,
  addProjectEvent,
  ensureVcmData,
  getProjects,
  updateProject,
} from "../data/vcmPlatform";

const relevantStatuses = ["En revisión por EE", "Hito registrado", "En cierre"];

function getPendingMilestone(project) {
  return (project?.milestones || []).find((milestone) => milestone.status === "En revisión");
}

export default function PortalEntidadPage() {
  ensureVcmData();
  const [projects, setProjects] = useState(getProjects);
  const [selectedId, setSelectedId] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(null);

  const pendingProjects = useMemo(
    () => projects.filter((project) => relevantStatuses.includes(project.status) && !(project.status === "En cierre" && project.closure?.eeApproved)),
    [projects],
  );
  const selectedProject = projects.find((project) => project.id === selectedId) || pendingProjects[0];
  const selectedPendingMilestone = getPendingMilestone(selectedProject);

  const refresh = (notice) => {
    setProjects(getProjects());
    setComment("");
    if (notice) setMessage(notice);
  };

  const mutate = (updater, notice) => {
    if (!selectedProject) return;
    updateProject(selectedProject.id, updater);
    refresh(notice);
  };

  const approveProposal = () => {
    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "Aprobada por EE", eeApproved: true, observations: "" }, "ee", "V°B° entregado por EE", "La propuesta fue aprobada por la Entidad Externa."),
          "Encargado VCM",
          "La propuesta fue aprobada por la Entidad Externa.",
        ),
      { type: "success", text: "V°B° registrado. VCM podrá asignar Escuela / Sede / JC." },
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
          addProjectEvent({ ...project, status: "Con observaciones de EE", observations: comment }, "ee", "Observaciones registradas por EE", comment),
          "Encargado VCM",
          "La Entidad Externa registró observaciones sobre la propuesta.",
        ),
      { type: "warning", text: "Observaciones enviadas a VCM." },
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
          addProjectEvent({ ...project, status: "Hito aprobado", milestones }, "ee", "Hito aprobado", `La Entidad Externa validó el hito "${milestoneInReview.title}".`),
          "Docente y Encargado VCM",
          "El hito fue aprobado por la Entidad Externa. El docente puede continuar con el siguiente avance.",
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
          addProjectEvent({ ...project, status: "Hito observado", milestones }, "ee", "Hito observado por EE", `${milestoneInReview.title}: ${comment}`),
          "Docente",
          "La Entidad Externa registró observaciones sobre el hito.",
        );
      },
      { type: "warning", text: "Observación de hito enviada al docente." },
    );
  };

  const approveClosure = () => {
    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "En cierre", closure: { ...(project.closure || {}), eeApproved: true } }, "ee", "Cierre aprobado por EE", "VCM debe validar el término administrativo."),
          "Encargado VCM",
          "La Entidad Externa aprobó el cierre del proyecto.",
        ),
      { type: "success", text: "Cierre aprobado. Queda pendiente validación administrativa VCM." },
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
          "La Entidad Externa solicitó antecedentes adicionales para el cierre.",
        ),
      { type: "warning", text: "Observaciones de cierre enviadas al docente." },
    );
  };

  return (
    <AppShell active="entidad">
      <PageIntro
        eyebrow="Portal Entidad Externa"
        title="Revisión y validaciones EE"
        description="Bandeja para entregar V°B°, observar propuestas, validar hitos y revisar el resultado final del proyecto."
      />

      {message && (
        <div className="mb-5">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Section title="Pendientes EE" subtitle="Propuestas, hitos y cierres que requieren acción.">
          <div className="space-y-3">
            {pendingProjects.length === 0 ? (
              <EmptyState title="Sin pendientes" description="No hay propuestas, hitos o cierres pendientes de Entidad Externa." />
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
            <Section title={selectedProject.title} subtitle="Detalle enviado por VCM o docente.">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedProject.status} />
                <span className="text-sm font-semibold text-neutral-500">{selectedProject.entityName}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Necesidad" value={selectedProject.description} />
                <Info label="Objetivo" value={selectedProject.objective} />
                <Info label="Resultados esperados" value={selectedProject.expectedResults} />
                <Info label="Último hito / cierre" value={lastEvidence(selectedProject)} />
              </div>
            </Section>

            <Section title="Acción de Entidad Externa" subtitle="Elige una resolución según el estado actual.">
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
                {selectedProject.status === "En revisión por EE" && (
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
