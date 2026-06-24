import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  FileUp,
  Send,
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

const initialApplication = {
  teacher: "",
  students: "",
  startDate: "",
  endDate: "",
  milestonesText: "",
};

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

export default function CatalogoDocentePage() {
  ensureVcmData();
  const session = getSession();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState(getProjects);
  const [selectedId, setSelectedId] = useState(searchParams.get("proyecto") || "");
  const [application, setApplication] = useState({ ...initialApplication, teacher: session?.name || "Docente Demo" });
  const [milestone, setMilestone] = useState(initialMilestone);
  const [closure, setClosure] = useState(initialClosure);
  const [cancelReason, setCancelReason] = useState("");
  const [message, setMessage] = useState(null);

  const teacherProjects = useMemo(
    () => {
      const visibleStatuses = [
        "Disponible para docentes",
        "Postulada / Tomada por docente",
        "En revisión VCM",
        "Proyecto en ejecución",
        "Hito registrado",
        "Hito observado",
        "Hito aprobado",
        "Cierre observado",
      ];

      const sourceProjects = ["admin", "jc"].includes(session?.role) ? getProjectsForSession(projects, session) : projects;

      return sourceProjects.filter((project) => {
        if (!visibleStatuses.includes(project.status)) return false;
        if (["admin", "jc"].includes(session?.role)) return true;
        return project.status === "Disponible para docentes";
      });
    },
    [projects, session],
  );
  const selectedProject = teacherProjects.find((project) => project.id === selectedId) || teacherProjects[0];

  const refresh = (notice) => {
    setProjects(getProjects());
    if (notice) setMessage(notice);
  };

  const mutate = (updater, notice) => {
    if (!selectedProject) return;
    updateProject(selectedProject.id, updater);
    refresh(notice);
  };

  const submitApplication = () => {
    const required = [application.teacher, application.students, application.startDate, application.endDate, application.milestonesText].every(Boolean);
    if (!required) {
      setMessage({ type: "error", text: "Completa docente, estudiantes, fechas e hitos antes de postular." });
      return;
    }

    const milestones = application.milestonesText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((title, index) => ({
        id: `hito-${Date.now()}-${index}`,
        title,
        status: "Pendiente",
        comments: "",
        evidence: "",
      }));

    mutate(
      (project) =>
        addNotification(
          addProjectEvent(
            {
              ...project,
              status: "En revisión VCM",
              application,
              milestones,
            },
            "docente",
            "Proyecto tomado por docente",
            `${application.teacher} registró estudiantes, fechas e hitos comprometidos.`,
          ),
          "Validador",
          "Un docente postuló para ejecutar el proyecto.",
        ),
      { type: "success", text: "Postulación enviada a revisión del Validador. Puedes seguirla en Mis solicitudes." },
    );
    setApplication({ ...initialApplication, teacher: session?.name || "Docente Demo" });
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
          "Socio formador",
          "Hay un hito pendiente de validación.",
        );
      },
      { type: "success", text: "Hito enviado a validación del Socio formador." },
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
          "Socio formador",
          "El docente solicitó el cierre del proyecto.",
        ),
      { type: "success", text: "Cierre enviado a revisión del Socio formador." },
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
    <AppShell active="docente">
      <PageIntro
        eyebrow="Catálogo docente"
        title="Proyectos VCM disponibles"
        description="El docente revisa el catálogo y toma proyectos disponibles. Las solicitudes ya tomadas se gestionan en Mis solicitudes."
      />

      {message && (
        <div className="mb-5">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Section title="Proyectos docente" subtitle="Disponibles para toma docente.">
          <div className="space-y-3">
            {teacherProjects.length === 0 ? (
              <EmptyState title="Sin proyectos" description="No hay proyectos disponibles para docentes en este momento." />
            ) : (
              teacherProjects.map((project) => (
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
                  <p className="mt-1 text-sm text-neutral-500">{project.assignment?.subject || "Asignatura pendiente"}</p>
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
                <Info label="Necesidad" value={selectedProject.description} />
                <Info label="Objetivo" value={selectedProject.objective} />
                <Info label="Asignatura" value={selectedProject.assignment?.subject} />
                <Info label="Sección / semestre" value={[selectedProject.assignment?.section, selectedProject.assignment?.semester].filter(Boolean).join(" · ")} />
              </div>
            </Section>

            {selectedProject.status === "Disponible para docentes" && (
              <Section title="Tomar proyecto y postular" subtitle="RN-06: registra estudiantes, fechas e hitos antes de enviar al Validador.">
                <div className="grid gap-5 md:grid-cols-2">
                  <TextInput label="Docente responsable" required value={application.teacher} onChange={(value) => setApplication((prev) => ({ ...prev, teacher: value }))} placeholder="Nombre docente" />
                  <TextInput label="Estudiantes participantes" required type="number" value={application.students} onChange={(value) => setApplication((prev) => ({ ...prev, students: value }))} placeholder="Ej: 28" />
                  <TextInput label="Fecha de inicio" required type="date" icon={<Calendar className="h-5 w-5" />} value={application.startDate} onChange={(value) => setApplication((prev) => ({ ...prev, startDate: value }))} />
                  <TextInput label="Fecha de término" required type="date" icon={<Calendar className="h-5 w-5" />} value={application.endDate} onChange={(value) => setApplication((prev) => ({ ...prev, endDate: value }))} />
                </div>
                <div className="mt-5">
                  <TextArea label="Hitos comprometidos" required value={application.milestonesText} onChange={(value) => setApplication((prev) => ({ ...prev, milestonesText: value }))} placeholder={"Un hito por línea.\nEj: Diagnóstico inicial\nPrototipo validado\nEntrega final"} />
                </div>
                <div className="mt-5 flex justify-end">
                  <ActionButton icon={<Send className="h-5 w-5" />} onClick={submitApplication}>Enviar postulación</ActionButton>
                </div>
              </Section>
            )}

            {selectedProject.status === "En revisión VCM" && (
              <Section title="Postulación en revisión" subtitle="El Validador debe aprobar la ejecución o devolver la solicitud.">
                <Notice type="info">La postulación fue enviada correctamente y queda pendiente de revisión del Validador.</Notice>
              </Section>
            )}

            {selectedProject.status === "Proyecto en ejecución" && (
              <Section title="Registrar hito o solicitar cierre" subtitle="Cada hito requiere evidencia mínima antes de validación del Socio formador.">
                <div className="space-y-5">
                  <TextInput label="Título del hito" required value={milestone.title} onChange={(value) => setMilestone((prev) => ({ ...prev, title: value }))} placeholder="Ej: Diagnóstico inicial" />
                  <TextArea label="Comentarios de avance" required value={milestone.comments} onChange={(value) => setMilestone((prev) => ({ ...prev, comments: value }))} placeholder="Reuniones, avance, acuerdos o antecedentes relevantes." />
                  <TextArea label="Evidencias" required value={milestone.evidence} onChange={(value) => setMilestone((prev) => ({ ...prev, evidence: value }))} placeholder="Archivos, enlaces, actas, fotografías o documentos." />
                  <div className="flex justify-end">
                    <ActionButton icon={<FileUp className="h-5 w-5" />} onClick={sendMilestone}>Enviar hito al Socio formador</ActionButton>
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
              <Section title="Hito enviado al Socio formador" subtitle="La contraparte debe validar u observar el hito antes de continuar.">
                <Notice type="info">El hito quedó pendiente en el Portal socio formador. Cuando el Socio formador lo apruebe, podrás continuar con el siguiente hito o solicitar cierre.</Notice>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Info label="Hito en revisión" value={getPendingMilestone(selectedProject)?.title} />
                  <Info label="Comentarios enviados" value={getPendingMilestone(selectedProject)?.comments} />
                  <Info label="Evidencia enviada" value={getPendingMilestone(selectedProject)?.evidence} />
                <Info label="Estado" value="Pendiente de validación del Socio formador" />
                </div>
              </Section>
            )}

            {selectedProject.status === "Hito observado" && (
              <Section title="Hito observado" subtitle="Revisa observaciones del Socio formador, complementa información y vuelve a registrar el hito.">
                <Notice type="warning">El Socio formador registró observaciones sobre un hito. Corrige evidencias y reenvía.</Notice>
                <div className="mt-5">
                  <ActionButton icon={<ArrowIcon />} onClick={correctObservedMilestone}>Corregir hito</ActionButton>
                </div>
              </Section>
            )}

            {selectedProject.status === "Hito aprobado" && (
              <Section title="Hito aprobado" subtitle="Puedes continuar ejecución, registrar nuevos hitos o solicitar cierre.">
                <ActionButton icon={<BookOpen className="h-5 w-5" />} onClick={continueAfterApprovedMilestone}>Continuar ejecución</ActionButton>
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
          </div>
        ) : (
          <EmptyState title="Selecciona un proyecto" description="El detalle aparecerá en esta zona." />
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

function ArrowIcon() {
  return <Send className="h-5 w-5" />;
}
