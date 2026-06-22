import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileUp,
  Send,
  Users,
  XCircle,
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
  TextInput,
} from "../components/VcmUI";
import {
  addNotification,
  addProjectEvent,
  ensureVcmData,
  getProjects,
  getProjectsForSession,
  getSession,
  updateProject,
} from "../data/vcmPlatform";

const initialMilestone = {
  title: "",
  comments: "",
  evidence: "",
};

const initialClosure = {
  summary: "",
  evidence: "",
};

function getPendingMilestone(project) {
  return (project?.milestones || []).find((milestone) => milestone.status === "En revisión");
}

export default function MisSolicitudesDocentePage() {
  ensureVcmData();
  const session = getSession();
  const [projects, setProjects] = useState(getProjects);
  const [selectedId, setSelectedId] = useState("");
  const [milestone, setMilestone] = useState(initialMilestone);
  const [closure, setClosure] = useState(initialClosure);
  const [cancelReason, setCancelReason] = useState("");
  const [message, setMessage] = useState(null);

  const solicitudes = useMemo(() => {
    const sourceProjects = ["vcm", "jc"].includes(session?.role) ? getProjectsForSession(projects, session) : projects;
    const withTeacher = sourceProjects.filter((project) => project.application);
    if (["vcm", "jc"].includes(session?.role)) return withTeacher;
    return withTeacher.filter((project) => project.application?.teacher === session?.name);
  }, [projects, session]);

  const selectedProject = solicitudes.find((project) => project.id === selectedId) || solicitudes[0];

  const refresh = (notice) => {
    setProjects(getProjects());
    if (notice) setMessage(notice);
  };

  const mutate = (updater, notice) => {
    if (!selectedProject) return;
    updateProject(selectedProject.id, updater);
    refresh(notice);
  };

  const sendMilestone = () => {
    const required = [milestone.title, milestone.comments, milestone.evidence].every(Boolean);
    if (!required) {
      setMessage({ type: "error", text: "Completa título, comentarios y evidencia mínima del hito." });
      return;
    }

    mutate(
      (project) => {
        const nextMilestone = {
          id: `hito-${Date.now()}`,
          title: milestone.title,
          comments: milestone.comments,
          evidence: milestone.evidence,
          status: "En revisión",
          createdAt: new Date().toISOString(),
        };

        return addNotification(
          addProjectEvent(
            {
              ...project,
              status: "Hito registrado",
              milestones: [nextMilestone, ...(project.milestones || [])],
            },
            "docente",
            "Hito registrado",
            `${milestone.title}: ${milestone.comments}`,
          ),
          "Entidad Externa",
          "Hay un hito pendiente de validación.",
        );
      },
      { type: "success", text: "Hito enviado a validación de EE." },
    );
    setMilestone(initialMilestone);
  };

  const continueAfterApprovedMilestone = () => {
    mutate(
      (project) => addProjectEvent({ ...project, status: "Proyecto en ejecución" }, "docente", "Ejecución continúa", "El docente continúa con próximos hitos o cierre."),
      { type: "success", text: "Proyecto disponible para registrar nuevos hitos o cierre." },
    );
  };

  const correctObservedMilestone = () => {
    mutate(
      (project) => addProjectEvent({ ...project, status: "Proyecto en ejecución" }, "docente", "Hito corregido", "El docente preparará nuevo envío de hito corregido."),
      { type: "success", text: "Puedes registrar el hito corregido nuevamente." },
    );
  };

  const submitClosure = () => {
    const required = [closure.summary, closure.evidence].every(Boolean);
    if (!required) {
      setMessage({ type: "error", text: "Completa resumen y evidencias finales antes de solicitar cierre." });
      return;
    }

    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "En cierre", closure: { ...closure, eeApproved: false } }, "docente", "Solicitud de cierre registrada", closure.summary),
          "Entidad Externa",
          "El docente solicitó el cierre del proyecto.",
        ),
      { type: "success", text: "Cierre enviado a revisión de Entidad Externa." },
    );
    setClosure(initialClosure);
  };

  const submitCancellation = () => {
    if (!cancelReason.trim()) {
      setMessage({ type: "error", text: "Registra motivo de cancelación." });
      return;
    }

    mutate(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "En revisión VCM", cancellation: { reason: cancelReason } }, "docente", "Solicitud de cancelación registrada", cancelReason),
          "Validador",
          "El docente solicitó cancelar el proyecto.",
        ),
      { type: "warning", text: "Solicitud de cancelación enviada al Validador." },
    );
    setCancelReason("");
  };

  return (
    <AppShell active="mis-solicitudes-docente">
      <PageIntro
        eyebrow="Docente"
        title="Mis solicitudes tomadas"
        description="Seguimiento y gestión directa de los proyectos tomados por el docente."
      />

      {message && (
        <div className="mb-5">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Section title="Solicitudes tomadas" subtitle="Solo proyectos donde existe postulación o ejecución docente.">
          <div className="space-y-3">
            {solicitudes.length === 0 ? (
              <EmptyState title="Sin solicitudes tomadas" description="Cuando tomes un proyecto desde el catálogo aparecerá acá." />
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
                  <p className="mt-1 text-sm text-neutral-500">{project.entityName}</p>
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
                <Info icon={<ClipboardList className="h-5 w-5" />} label="Asignatura" value={selectedProject.assignment?.subject} />
                <Info icon={<Users className="h-5 w-5" />} label="Estudiantes" value={selectedProject.application?.students} />
                <Info label="Fecha inicio" value={selectedProject.application?.startDate} />
                <Info label="Fecha término" value={selectedProject.application?.endDate} />
                <Info label="Hitos comprometidos" value={selectedProject.application?.milestonesText} />
                <Info label="Último hito" value={lastMilestone(selectedProject)} />
              </div>
            </Section>

            {["Postulada / Tomada por docente", "En revisión VCM"].includes(selectedProject.status) && (
              <Section title="Postulación en revisión" subtitle="El Validador debe aprobar la ejecución antes de registrar hitos.">
                <Notice type="info">Tu solicitud fue enviada correctamente y está pendiente de revisión del Validador.</Notice>
              </Section>
            )}

            {selectedProject.status === "Proyecto en ejecución" && (
              <Section title="Gestionar ejecución" subtitle="Registra hitos, solicita cierre o pide cancelación desde esta solicitud.">
                <div className="space-y-5">
                  <TextInput label="Título del hito" required value={milestone.title} onChange={(value) => setMilestone((prev) => ({ ...prev, title: value }))} placeholder="Ej: Diagnóstico inicial" />
                  <TextArea label="Comentarios de avance" required value={milestone.comments} onChange={(value) => setMilestone((prev) => ({ ...prev, comments: value }))} placeholder="Reuniones, avance, acuerdos o antecedentes relevantes." />
                  <TextArea label="Evidencias" required value={milestone.evidence} onChange={(value) => setMilestone((prev) => ({ ...prev, evidence: value }))} placeholder="Archivos, enlaces, actas, fotografías o documentos." />
                  <div className="flex justify-end">
                    <ActionButton icon={<FileUp className="h-5 w-5" />} onClick={sendMilestone}>Enviar hito a EE</ActionButton>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="mb-3 text-sm font-black text-neutral-950">Solicitar cierre</p>
                    <TextArea label="Resumen final" value={closure.summary} onChange={(value) => setClosure((prev) => ({ ...prev, summary: value }))} placeholder="Resultado final del proyecto." rows={3} />
                    <div className="mt-3">
                      <TextArea label="Evidencias finales" value={closure.evidence} onChange={(value) => setClosure((prev) => ({ ...prev, evidence: value }))} placeholder="Respaldos finales." rows={3} />
                    </div>
                    <div className="mt-4">
                      <ActionButton icon={<CheckCircle2 className="h-5 w-5" />} onClick={submitClosure}>Solicitar cierre</ActionButton>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="mb-3 text-sm font-black text-neutral-950">Solicitar cancelación</p>
                    <TextArea label="Motivo" value={cancelReason} onChange={setCancelReason} placeholder="Motivos de cancelación del proyecto." rows={5} />
                    <div className="mt-4">
                      <ActionButton variant="danger" icon={<XCircle className="h-5 w-5" />} onClick={submitCancellation}>Enviar cancelación</ActionButton>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {selectedProject.status === "Hito registrado" && (
              <Section title="Hito enviado a Entidad Externa" subtitle="La contraparte debe validar u observar el hito antes de continuar.">
                <Notice type="info">El hito está pendiente en el Portal EE. Cuando sea aprobado podrás continuar con el siguiente hito o solicitar cierre.</Notice>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Info label="Hito en revisión" value={getPendingMilestone(selectedProject)?.title} />
                  <Info label="Comentarios enviados" value={getPendingMilestone(selectedProject)?.comments} />
                  <Info label="Evidencia enviada" value={getPendingMilestone(selectedProject)?.evidence} />
                  <Info label="Estado" value="Pendiente de validación EE" />
                </div>
              </Section>
            )}

            {selectedProject.status === "Hito observado" && (
              <Section title="Hito observado" subtitle="Revisa observaciones de EE, complementa información y vuelve a registrar el hito.">
                <Notice type="warning">La Entidad Externa registró observaciones sobre un hito. Corrige evidencias y reenvía desde esta misma solicitud.</Notice>
                <div className="mt-5">
                  <ActionButton icon={<Send className="h-5 w-5" />} onClick={correctObservedMilestone}>Corregir hito</ActionButton>
                </div>
              </Section>
            )}

            {selectedProject.status === "Hito aprobado" && (
              <Section title="Hito aprobado" subtitle="Puedes continuar ejecución, registrar nuevos hitos o solicitar cierre.">
                <ActionButton icon={<BookOpen className="h-5 w-5" />} onClick={continueAfterApprovedMilestone}>Continuar ejecución</ActionButton>
              </Section>
            )}

            {selectedProject.status === "En cierre" && (
              <Section title="Cierre en revisión" subtitle="El cierre queda pendiente de validación externa o administrativa.">
                <Notice type="info">
                  {selectedProject.closure?.eeApproved
                    ? "La Entidad Externa aprobó el cierre. Queda pendiente la validación administrativa del Validador."
                    : "El cierre fue enviado a Entidad Externa para revisión."}
                </Notice>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Info label="Resumen final" value={selectedProject.closure?.summary} />
                  <Info label="Evidencias finales" value={selectedProject.closure?.evidence} />
                </div>
              </Section>
            )}

            {selectedProject.status === "Cierre observado" && (
              <Section title="Cierre observado" subtitle="Complementa evidencias finales y vuelve a solicitar cierre.">
                <div className="grid gap-5 md:grid-cols-2">
                  <TextArea label="Resumen final corregido" value={closure.summary} onChange={(value) => setClosure((prev) => ({ ...prev, summary: value }))} placeholder="Resultado final actualizado." />
                  <TextArea label="Evidencias finales corregidas" value={closure.evidence} onChange={(value) => setClosure((prev) => ({ ...prev, evidence: value }))} placeholder="Respaldos complementarios." />
                </div>
                <div className="mt-5 flex justify-end">
                  <ActionButton icon={<Send className="h-5 w-5" />} onClick={submitClosure}>Reenviar cierre</ActionButton>
                </div>
              </Section>
            )}

            {["Finalizado exitosamente", "Publicado como proyecto realizado"].includes(selectedProject.status) && (
              <Section title="Proyecto finalizado" subtitle="El proyecto completó su flujo de ejecución y cierre.">
                <Notice type="success">La solicitud ya fue cerrada correctamente.</Notice>
              </Section>
            )}

            {["Cancelado", "Rechazado"].includes(selectedProject.status) && (
              <Section title="Solicitud cerrada" subtitle="El proyecto no continuará su ejecución.">
                <Notice type="warning">La solicitud quedó cerrada con estado {selectedProject.status.toLowerCase()}.</Notice>
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

function lastMilestone(project) {
  const current = project.milestones?.[0];
  if (!current) return "Sin hitos registrados";
  return `${current.title} · ${current.status}`;
}
