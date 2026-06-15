import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  MessageSquare,
  Send,
  XCircle,
} from "lucide-react";
import {
  ActionButton,
  AppShell,
  EmptyState,
  Notice,
  PageIntro,
  RoleBadge,
  Section,
  SelectField,
  StatCard,
  StatusBadge,
  TextArea,
  TextInput,
} from "../components/VcmUI";
import {
  addNotification,
  addProjectEvent,
  asignaturas,
  escuelas,
  ensureVcmData,
  getProjects,
  getSession,
  projectStatuses,
  sedes,
  semestres,
  statusMeta,
  updateProject,
} from "../data/vcmPlatform";

const initialAssignment = {
  school: "",
  campus: "",
  careerLead: "",
};

const initialAcademic = {
  subject: "",
  section: "",
  semester: "",
};

const proposalReviewStatuses = ["Borrador", "En revisión por EE", "Correcciones solicitadas por mantenedor"];

function needsMaintainerReview(project) {
  return project && proposalReviewStatuses.includes(project.status) && !project.application && !project.cancellation;
}

export default function DashboardMantenedor() {
  ensureVcmData();
  const session = getSession();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState(getProjects);
  const firstPriorityProject = projects.find(needsMaintainerReview) || projects[0];
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState(searchParams.get("proyecto") || firstPriorityProject?.id || "");
  const [assignment, setAssignment] = useState(initialAssignment);
  const [academic, setAcademic] = useState(initialAcademic);
  const [proposalReviewComment, setProposalReviewComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [availabilityCancelReason, setAvailabilityCancelReason] = useState("");
  const [message, setMessage] = useState(null);

  const selectedProject = projects.find((project) => project.id === selectedId) || firstPriorityProject;

  const filteredProjects = useMemo(() => {
    const base = statusFilter ? projects.filter((project) => project.status === statusFilter) : projects;
    return [...base].sort((left, right) => Number(needsMaintainerReview(right)) - Number(needsMaintainerReview(left)));
  }, [projects, statusFilter]);

  const stats = useMemo(() => {
    const pendingMaintainer = projects.filter(needsMaintainerReview).length;
    const active = projects.filter((project) => project.status === "Proyecto en ejecución").length;
    const readyToAssign = projects.filter((project) => ["Aprobada por mantenedor", "Aprobada por EE"].includes(project.status)).length;
    const finished = projects.filter((project) => project.status === "Finalizado exitosamente" || project.status === "Publicado como proyecto realizado").length;
    return { active, pendingMaintainer, readyToAssign, finished };
  }, [projects]);

  const refresh = (notice) => {
    const next = getProjects();
    setProjects(next);
    if (notice) setMessage(notice);
  };

  const mutateSelected = (updater, notice) => {
    if (!selectedProject) return;
    updateProject(selectedProject.id, updater);
    refresh(notice);
  };

  const reviewProposal = (decision) => {
    const comment = proposalReviewComment.trim();
    if (decision !== "approve" && !comment) {
      setMessage({ type: "error", text: "Agrega una observación antes de denegar o pedir correcciones." });
      return;
    }

    const decisions = {
      approve: {
        status: "Aprobada por mantenedor",
        title: "Propuesta aceptada por mantenedor",
        detail: comment || "La propuesta cumple las condiciones iniciales para continuar el flujo.",
        notification: "Su propuesta fue aceptada para continuar revisión interna.",
        notice: "Propuesta aceptada. Ya puede asignarse internamente.",
        type: "success",
      },
      corrections: {
        status: "Correcciones solicitadas por mantenedor",
        title: "Correcciones solicitadas",
        detail: comment,
        notification: "El mantenedor solicitó correcciones sobre la propuesta.",
        notice: "Correcciones enviadas a la Entidad Externa.",
        type: "warning",
      },
      reject: {
        status: "Rechazado",
        title: "Propuesta denegada",
        detail: comment,
        notification: "La propuesta fue denegada por el mantenedor.",
        notice: "Propuesta denegada.",
        type: "warning",
      },
    };
    const config = decisions[decision];
    const actor = session?.role === "jc" ? "jc" : "vcm";

    mutateSelected(
      (project) =>
        addNotification(
          addProjectEvent(
            {
              ...project,
              status: config.status,
              observations: decision === "approve" ? "" : comment,
              maintainerReview: {
                decision,
                comment,
                reviewedAt: new Date().toISOString(),
                reviewedBy: session?.name || "Mantenedor",
              },
            },
            actor,
            config.title,
            config.detail,
          ),
          "Entidad Externa",
          config.notification,
        ),
      { type: config.type, text: config.notice },
    );
    setProposalReviewComment("");
  };

  const assignInternal = () => {
    const required = [assignment.school, assignment.campus, assignment.careerLead].every(Boolean);
    if (!required) {
      setMessage({ type: "error", text: "Completa Escuela, Sede y Jefe de Carrera para asignar la propuesta." });
      return;
    }

    mutateSelected(
      (project) =>
        addNotification(
          addProjectEvent(
            {
              ...project,
              status: "Asignada a Escuela / Sede / Jefe de Carrera",
              assignment: {
                ...(project.assignment || {}),
                ...assignment,
              },
            },
            "vcm",
            "Propuesta asignada internamente",
            `${assignment.school} · ${assignment.campus} · ${assignment.careerLead}`,
          ),
          "Jefe de Carrera",
          "Tiene una propuesta VCM asignada para revisión académica.",
        ),
      { type: "success", text: "Propuesta asignada a Escuela / Sede / JC." },
    );
    setAssignment(initialAssignment);
  };

  const publishCatalog = () => {
    const required = [academic.subject, academic.section, academic.semester].every(Boolean);
    if (!required) {
      setMessage({ type: "error", text: "Completa asignatura, sección y semestre antes de publicar en catálogo docente." });
      return;
    }

    mutateSelected(
      (project) =>
        addNotification(
          addProjectEvent(
            {
              ...project,
              status: "Disponible para docentes",
              assignment: {
                ...(project.assignment || {}),
                ...academic,
              },
            },
            "jc",
            "Asignatura asociada a propuesta",
            `${academic.subject} · ${academic.section} · ${academic.semester}`,
          ),
          "Docente",
          "Hay un proyecto VCM disponible para su asignatura.",
        ),
      { type: "success", text: "Proyecto publicado en catálogo docente." },
    );
    setAcademic(initialAcademic);
  };

  const reviewApplication = (approved) => {
    if (!approved && !rejectionReason.trim()) {
      setMessage({ type: "error", text: "Indica motivo de rechazo antes de rechazar la postulación." });
      return;
    }

    mutateSelected(
      (project) => {
        const status = approved ? "Proyecto en ejecución" : "Disponible para docentes";
        const eventTitle = approved ? "Ejecución aprobada" : "Postulación docente rechazada";
        const next = addProjectEvent({ ...project, status }, "vcm", eventTitle, approved ? "El proyecto fue aprobado para ejecución." : rejectionReason);
        return addNotification(next, approved ? "Entidad Externa y Docente" : "Docente", approved ? "El proyecto fue aprobado para ejecución." : "La postulación fue rechazada por VCM.");
      },
      { type: approved ? "success" : "warning", text: approved ? "Proyecto en ejecución." : "Postulación rechazada y proyecto disponible nuevamente." },
    );
    setRejectionReason("");
  };

  const cancelAvailableProject = () => {
    const reason = availabilityCancelReason.trim();
    if (!reason) {
      setMessage({ type: "error", text: "Registra el motivo antes de cancelar un proyecto disponible para docentes." });
      return;
    }

    mutateSelected(
      (project) =>
        addNotification(
          addProjectEvent(
            {
              ...project,
              status: "Cancelado",
              cancellation: {
                reason,
                cancelledAt: new Date().toISOString(),
                cancelledBy: session?.name || "Mantenedor",
                source: "Sin toma docente",
              },
            },
            session?.role === "jc" ? "jc" : "vcm",
            "Proyecto cancelado sin toma docente",
            reason,
          ),
          "Entidad Externa, Jefe de Carrera y Encargado VCM",
          "El proyecto fue cancelado porque no fue tomado por un docente en el periodo correspondiente.",
        ),
      { type: "warning", text: "Proyecto cancelado por falta de toma docente." },
    );
    setAvailabilityCancelReason("");
  };

  const resendObservedProposal = () => {
    mutateSelected(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "En revisión por EE" }, "vcm", "Propuesta corregida y reenviada", "VCM incorporó observaciones de EE."),
          "Entidad Externa",
          "La propuesta corregida está disponible para nueva revisión.",
        ),
      { type: "success", text: "Propuesta reenviada a EE." },
    );
  };

  const validateClosure = () => {
    mutateSelected(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "Finalizado exitosamente" }, "vcm", "Cierre administrativo validado", "El proyecto queda finalizado exitosamente."),
          "Entidad Externa, Docente y Encargado VCM",
          "El proyecto fue finalizado exitosamente.",
        ),
      { type: "success", text: "Proyecto finalizado exitosamente." },
    );
  };

  const publishFinishedProject = () => {
    mutateSelected(
      (project) => addProjectEvent({ ...project, status: "Publicado como proyecto realizado" }, "sis", "Proyecto publicado", "Disponible en repositorio de experiencias realizadas."),
      { type: "success", text: "Proyecto publicado como realizado." },
    );
  };

  const cancelProject = () => {
    mutateSelected(
      (project) =>
        addNotification(
          addProjectEvent({ ...project, status: "Cancelado" }, "vcm", "Proyecto cancelado", project.cancellation?.reason || "Cancelación aprobada por VCM."),
          "Entidad Externa, Docente y Encargado VCM",
          "El proyecto fue cancelado.",
        ),
      { type: "warning", text: "Proyecto cancelado." },
    );
  };

  return (
    <AppShell active="dashboard">
      <PageIntro
        eyebrow="Mantenedor VCM"
        title="Dashboard de gestión"
        description="Bandeja central para revisar propuestas, estados, asignaciones, postulaciones, hitos, cierre y cancelaciones."
        actions={
          <Link to="/formulario" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-[#d99d00]">
            <FilePlus2 className="h-5 w-5" />
            Nueva propuesta
          </Link>
        }
      />

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Bell className="h-5 w-5" />} label="Por revisar" value={stats.pendingMaintainer} />
        <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Para asignar" value={stats.readyToAssign} />
        <StatCard icon={<Briefcase className="h-5 w-5" />} label="En ejecución" value={stats.active} />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Finalizados/publicados" value={stats.finished} />
      </div>

      {message && (
        <div className="mb-8">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      <div className="grid gap-7 xl:grid-cols-[minmax(360px,440px)_minmax(0,1fr)]">
        <Section title="Proyectos" subtitle="Filtro por estado recomendado del documento." className="p-6" headerClassName="mb-6">
          <div className="mb-6">
            <SelectField
              label="Filtrar estado"
              value={statusFilter}
              onChange={setStatusFilter}
              options={projectStatuses}
              placeholder="Todos los estados"
            />
          </div>

          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <EmptyState title="Sin proyectos" description="No hay proyectos para el filtro seleccionado." />
            ) : (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    selectedProject?.id === project.id ? "border-[#f5b400] bg-[#fff8df]" : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <StatusBadge status={project.status} />
                    <RoleBadge role={project.status === "Asignada a Escuela / Sede / Jefe de Carrera" ? "jc" : "vcm"} />
                  </div>
                  <p className="text-base font-black leading-6 text-neutral-950">{project.title}</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-500">{project.entityName}</p>
                </button>
              ))
            )}
          </div>
        </Section>

        {selectedProject ? (
          <div className="space-y-7">
            <Section title={selectedProject.title} subtitle={statusMeta[selectedProject.status]?.description} className="p-6" headerClassName="mb-6">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <StatusBadge status={selectedProject.status} />
                <span className="text-sm font-semibold text-neutral-500">{selectedProject.entityName}</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Info label="Necesidad" value={selectedProject.description} />
                <Info label="Objetivo" value={selectedProject.objective} />
                <Info label="Resultados esperados" value={selectedProject.expectedResults} />
                <Info label="Asignación académica" value={formatAssignment(selectedProject)} />
              </div>
            </Section>

            <ActionPanel
              project={selectedProject}
              assignment={assignment}
              setAssignment={setAssignment}
              academic={academic}
              setAcademic={setAcademic}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              availabilityCancelReason={availabilityCancelReason}
              setAvailabilityCancelReason={setAvailabilityCancelReason}
              proposalReviewComment={proposalReviewComment}
              setProposalReviewComment={setProposalReviewComment}
              reviewProposal={reviewProposal}
              assignInternal={assignInternal}
              publishCatalog={publishCatalog}
              reviewApplication={reviewApplication}
              cancelAvailableProject={cancelAvailableProject}
              resendObservedProposal={resendObservedProposal}
              validateClosure={validateClosure}
              publishFinishedProject={publishFinishedProject}
              cancelProject={cancelProject}
            />

            <Section title="Bitácora y notificaciones" subtitle="Todo cambio de estado relevante registra evento y notificación." className="p-6" headerClassName="mb-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-4">
                  {(selectedProject.history || []).map((item) => (
                    <div key={item.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <RoleBadge role={item.actor} />
                        <span className="text-xs font-semibold text-neutral-400">{new Date(item.date).toLocaleString("es-CL")}</span>
                      </div>
                      <p className="text-sm font-black text-neutral-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-5 text-neutral-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {(selectedProject.notifications || []).map((item) => (
                    <div key={item.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{item.to}</p>
                      <p className="mt-1 text-sm font-semibold text-neutral-800">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        ) : (
          <EmptyState title="Selecciona un proyecto" description="El detalle y acciones aparecerán en esta zona." />
        )}
      </div>
    </AppShell>
  );
}

function ActionPanel({
  project,
  assignment,
  setAssignment,
  academic,
  setAcademic,
  proposalReviewComment,
  setProposalReviewComment,
  rejectionReason,
  setRejectionReason,
  availabilityCancelReason,
  setAvailabilityCancelReason,
  reviewProposal,
  assignInternal,
  publishCatalog,
  reviewApplication,
  cancelAvailableProject,
  resendObservedProposal,
  validateClosure,
  publishFinishedProject,
  cancelProject,
}) {
  if (needsMaintainerReview(project)) {
    return (
      <Section
        title="Revisión de propuesta"
        subtitle="Antes de aceptarla, el mantenedor puede aprobar, denegar o solicitar correcciones a la contraparte."
        className="p-6"
        headerClassName="mb-6"
      >
        <TextArea
          label="Observación para la resolución"
          value={proposalReviewComment}
          onChange={setProposalReviewComment}
          placeholder="Indica el motivo si vas a denegar o solicitar correcciones. Para aceptar, puedes dejarlo como respaldo opcional."
          rows={5}
        />
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:justify-end">
          <ActionButton variant="danger" icon={<XCircle className="h-5 w-5" />} onClick={() => reviewProposal("reject")}>Denegar</ActionButton>
          <ActionButton variant="outline" icon={<MessageSquare className="h-5 w-5" />} onClick={() => reviewProposal("corrections")}>Solicitar correcciones</ActionButton>
          <ActionButton icon={<CheckCircle2 className="h-5 w-5" />} onClick={() => reviewProposal("approve")}>Aceptar propuesta</ActionButton>
        </div>
      </Section>
    );
  }

  if (project.status === "Con observaciones de EE") {
    return (
      <Section title="Corrección de propuesta" subtitle={project.observations || "La Entidad Externa solicitó ajustes."} className="p-6" headerClassName="mb-6">
        <ActionButton icon={<ArrowRight className="h-5 w-5" />} onClick={resendObservedProposal}>Reenviar a EE</ActionButton>
      </Section>
    );
  }

  if (["Aprobada por mantenedor", "Aprobada por EE"].includes(project.status)) {
    return (
      <Section title="Asignar Escuela / Sede / Jefe de Carrera" subtitle="La propuesta ya fue aceptada y puede pasar a asignación interna." className="p-6" headerClassName="mb-6">
        <div className="grid gap-5 md:grid-cols-3">
          <SelectField label="Escuela" value={assignment.school} onChange={(value) => setAssignment((prev) => ({ ...prev, school: value }))} options={escuelas} placeholder="Seleccione escuela" required />
          <SelectField label="Sede" value={assignment.campus} onChange={(value) => setAssignment((prev) => ({ ...prev, campus: value }))} options={sedes} placeholder="Seleccione sede" required />
          <TextInput label="Jefe de Carrera" value={assignment.careerLead} onChange={(value) => setAssignment((prev) => ({ ...prev, careerLead: value }))} placeholder="Nombre JC" required />
        </div>
        <div className="mt-5 flex justify-end">
          <ActionButton icon={<Send className="h-5 w-5" />} onClick={assignInternal}>Notificar a JC</ActionButton>
        </div>
      </Section>
    );
  }

  if (project.status === "Asignada a Escuela / Sede / Jefe de Carrera") {
    return (
      <Section title="Asignación académica JC" subtitle="RN-05: debe existir asignatura, sección y semestre antes de publicar." className="p-6" headerClassName="mb-6">
        <div className="grid gap-5 md:grid-cols-3">
          <SelectField label="Asignatura" value={academic.subject} onChange={(value) => setAcademic((prev) => ({ ...prev, subject: value }))} options={asignaturas} placeholder="Seleccione asignatura" required />
          <TextInput label="Sección" value={academic.section} onChange={(value) => setAcademic((prev) => ({ ...prev, section: value }))} placeholder="Ej: 003D" required />
          <SelectField label="Semestre" value={academic.semester} onChange={(value) => setAcademic((prev) => ({ ...prev, semester: value }))} options={semestres} placeholder="Seleccione semestre" required />
        </div>
        <div className="mt-5 flex justify-end">
          <ActionButton icon={<BookOpenCheck className="h-5 w-5" />} onClick={publishCatalog}>Publicar en catálogo</ActionButton>
        </div>
      </Section>
    );
  }

  if (project.status === "Disponible para docentes") {
    return (
      <Section
        title="Disponibilidad docente"
        subtitle="Si el proyecto no fue tomado dentro del periodo definido, el mantenedor puede cancelarlo."
        className="p-6"
        headerClassName="mb-6"
      >
        <Notice type="warning">Esta acción retira el proyecto del catálogo docente y deja el motivo registrado en la bitácora.</Notice>
        <div className="mt-5">
          <TextArea
            label="Motivo de cancelación"
            value={availabilityCancelReason}
            onChange={setAvailabilityCancelReason}
            placeholder="Ej: No fue tomado por docentes dentro del plazo definido para el semestre."
            rows={4}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <ActionButton variant="danger" icon={<XCircle className="h-5 w-5" />} onClick={cancelAvailableProject}>Cancelar proyecto</ActionButton>
        </div>
      </Section>
    );
  }

  if (project.status === "En revisión VCM" && project.application) {
    return (
      <Section title="Revisar postulación docente" subtitle="RN-07: VCM debe aprobar antes de iniciar ejecución." className="p-6" headerClassName="mb-6">
        <div className="mb-6 grid gap-5 md:grid-cols-3">
          <Info label="Docente" value={project.application.teacher} />
          <Info label="Estudiantes" value={project.application.students} />
          <Info label="Fechas" value={`${project.application.startDate} a ${project.application.endDate}`} />
        </div>
        <TextArea label="Motivo de rechazo" value={rejectionReason} onChange={setRejectionReason} placeholder="Completar solo si se rechaza." />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <ActionButton variant="outline" icon={<XCircle className="h-5 w-5" />} onClick={() => reviewApplication(false)}>Rechazar</ActionButton>
          <ActionButton icon={<CheckCircle2 className="h-5 w-5" />} onClick={() => reviewApplication(true)}>Aprobar ejecución</ActionButton>
        </div>
      </Section>
    );
  }

  if (project.status === "En revisión VCM" && project.cancellation) {
    return (
      <Section title="Revisar cancelación" subtitle={project.cancellation.reason} className="p-6" headerClassName="mb-6">
        <ActionButton variant="danger" icon={<XCircle className="h-5 w-5" />} onClick={cancelProject}>Cambiar a Cancelado</ActionButton>
      </Section>
    );
  }

  if (project.status === "En cierre" && project.closure?.eeApproved) {
    return (
      <Section title="Validar cierre administrativo" subtitle="RN-12: solo VCM puede finalizar administrativamente." className="p-6" headerClassName="mb-6">
        <ActionButton icon={<CheckCircle2 className="h-5 w-5" />} onClick={validateClosure}>Finalizar exitosamente</ActionButton>
      </Section>
    );
  }

  if (project.status === "Finalizado exitosamente") {
    return (
      <Section title="Publicación de experiencia realizada" subtitle="Publica el proyecto en el repositorio de experiencias." className="p-6" headerClassName="mb-6">
        <ActionButton icon={<CheckCircle2 className="h-5 w-5" />} onClick={publishFinishedProject}>Publicar proyecto realizado</ActionButton>
      </Section>
    );
  }

  return (
    <Section title="Sin acción pendiente del mantenedor" subtitle="El estado actual espera acción de otro actor o ya fue resuelto." className="p-6" headerClassName="mb-6">
      <Notice>Revisa la bitácora y notificaciones para seguimiento.</Notice>
    </Section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-semibold text-neutral-900">{value || "Pendiente"}</p>
    </div>
  );
}

function formatAssignment(project) {
  const assignment = project.assignment || {};
  return [assignment.school, assignment.campus, assignment.careerLead, assignment.subject, assignment.section, assignment.semester].filter(Boolean).join(" · ") || "Pendiente";
}
