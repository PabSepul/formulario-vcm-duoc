import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileUp,
  Save,
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
  SelectField,
  StatusBadge,
  TextArea,
  TextInput,
} from "../components/VcmUI";
import {
  StudentRosterCompactSummary,
  StudentRosterEditor,
  StudentRosterSummary,
} from "../components/StudentRoster";
import {
  areMilestonesComplete,
  getNextActionableMilestone,
  submitMilestoneForReview,
} from "../utils/projectMilestones";
import { createEmptyStudentRow } from "../utils/studentRoster";
import {
  addNotification,
  addProjectEvent,
  canEditProjectStudentRoster,
  ensureVcmData,
  getProjects,
  getProjectsForSession,
  getSession,
  getStudentParticipationsForProject,
  isTeacherApplicationApproved,
  replaceProjectStudentParticipations,
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
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [milestone, setMilestone] = useState(initialMilestone);
  const [closure, setClosure] = useState(initialClosure);
  const [cancelReason, setCancelReason] = useState("");
  const [studentRows, setStudentRows] = useState(null);
  const [isEditingRoster, setIsEditingRoster] = useState(false);
  const [message, setMessage] = useState(null);
  const isAdmin = session?.role === "admin";

  const teacherOptions = useMemo(() => {
    const teachers = projects
      .map((project) => project.application?.teacher)
      .filter(Boolean);
    return [...new Set(teachers)].map((teacher) => ({ value: teacher, label: teacher }));
  }, [projects]);

  const solicitudes = useMemo(() => {
    const sourceProjects = ["admin", "jc"].includes(session?.role) ? getProjectsForSession(projects, session) : projects;
    const withTeacher = sourceProjects.filter((project) => project.application);
    if (isAdmin) return selectedTeacher ? withTeacher.filter((project) => project.application?.teacher === selectedTeacher) : withTeacher;
    if (session?.role === "jc") return withTeacher;
    return withTeacher.filter((project) => project.application?.teacher === session?.name);
  }, [isAdmin, projects, selectedTeacher, session]);

  const selectedProject = solicitudes.find((project) => project.id === selectedId) || solicitudes[0];
  const participants = useMemo(
    () => (selectedProject ? getStudentParticipationsForProject(selectedProject.id) : []),
    [selectedProject],
  );
  const rosterRows = studentRows || (participants.length
    ? participants.map((participant) => ({ rowId: participant.id, rut: participant.rut, teamNumber: participant.teamNumber ? String(participant.teamNumber) : "" }))
    : [createEmptyStudentRow()]);
  const rosterApproved = isTeacherApplicationApproved(selectedProject);
  const canEditRoster = canEditProjectStudentRoster(selectedProject);
  const applicationRejected = selectedProject?.application?.reviewStatus === "RECHAZADA" || selectedProject?.status === "Disponible para docentes";

  const refresh = (notice) => {
    setProjects(getProjects());
    if (notice) setMessage(notice);
  };

  const mutate = (updater, notice) => {
    if (!selectedProject) return;
    updateProject(selectedProject.id, updater);
    refresh(notice);
  };

  const saveStudentRoster = () => {
    if (!selectedProject?.application) return;
    const startsExecution = selectedProject.status === "Docente aprobado / Nómina pendiente";

    try {
      const savedParticipants = replaceProjectStudentParticipations(
        selectedProject.id,
        rosterRows,
        session?.name || "Docente",
        selectedProject.execution?.teamCount,
      );
      mutate(
        (project) => {
          const next = addProjectEvent(
            {
              ...project,
              status: startsExecution ? "Proyecto en ejecución" : project.status,
              application: {
                ...project.application,
                students: String(savedParticipants.length),
                studentCount: savedParticipants.length,
              },
            },
            session?.role === "admin" ? "admin" : "docente",
            startsExecution ? "Nómina registrada e inicio de ejecución" : "Nómina de alumnos actualizada",
            `${savedParticipants.length} alumno(s) activo(s) registrados por RUT${startsExecution ? ". El proyecto inicia su ejecución." : "."}`,
          );
          return startsExecution
            ? addNotification(next, "Socio formador y Validador", "El docente registró la nómina y el proyecto inició su ejecución.")
            : next;
        },
        { type: "success", text: startsExecution ? "Nómina guardada. El proyecto ya está en ejecución." : "Nómina de alumnos guardada correctamente." },
      );
      setStudentRows(savedParticipants.map((participant) => ({
        rowId: participant.id,
        rut: participant.rut,
        teamNumber: participant.teamNumber ? String(participant.teamNumber) : "",
      })));
      setIsEditingRoster(false);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "No fue posible guardar la nómina." });
    }
  };

  const sendMilestone = () => {
    if (participants.length === 0) {
      setMessage({ type: "error", text: "Registra y guarda la nómina de alumnos antes de enviar hitos." });
      return;
    }

    const required = [milestone.title, milestone.comments, milestone.evidence].every(Boolean);
    if (!required) {
      setMessage({ type: "error", text: "Completa título, comentarios y evidencia mínima del hito." });
      return;
    }

    try {
      mutate(
        (project) =>
          addNotification(
            addProjectEvent(
              {
                ...project,
                status: "Hito registrado",
                milestones: submitMilestoneForReview(project.milestones, milestone),
              },
              "docente",
              "Hito registrado",
              `${milestone.title}: ${milestone.comments}`,
            ),
            "Socio formador",
            "Hay un hito pendiente de validación.",
          ),
        { type: "success", text: "Hito enviado a validación del Socio formador." },
      );
    } catch (error) {
      setMessage({ type: "error", text: error.message || "No fue posible registrar el hito." });
      return;
    }
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
    if (!areMilestonesComplete(selectedProject?.milestones)) {
      const nextMilestone = getNextActionableMilestone(selectedProject?.milestones);
      setMessage({
        type: "error",
        text: nextMilestone
          ? `Debes completar y obtener la aprobación del hito "${nextMilestone.title}" antes de solicitar el cierre.`
          : "Todos los hitos deben estar aprobados antes de solicitar el cierre.",
      });
      return;
    }

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
          "Validador y Director de carrera",
          "El docente solicitó cancelar el proyecto y requiere revisión.",
        ),
      { type: "warning", text: "Solicitud de cancelación enviada al Validador o Director responsable." },
    );
    setCancelReason("");
  };

  return (
    <AppShell active="mis-solicitudes-docente">
      <PageIntro
        eyebrow={isAdmin ? "Administrador" : "Docente"}
        title="Mis solicitudes tomadas"
        description={isAdmin ? "Vista administrativa para revisar solicitudes tomadas como un docente específico." : "Seguimiento y gestión directa de los proyectos tomados por el docente."}
      />

      {message && (
        <div className="mb-5">
          <Notice type={message.type}>{message.text}</Notice>
        </div>
      )}

      {isAdmin && (
        <div className="mb-5">
          <Section title="Vista como docente" subtitle="Selecciona el docente para revisar o corregir sus solicitudes tomadas.">
            <SelectField
              label="Docente"
              value={selectedTeacher}
              onChange={(value) => {
                setSelectedTeacher(value);
                setSelectedId("");
                setStudentRows(null);
                setIsEditingRoster(false);
              }}
              options={teacherOptions}
              placeholder="Todos los docentes"
            />
          </Section>
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
                  onClick={() => {
                    setSelectedId(project.id);
                    setStudentRows(null);
                    setIsEditingRoster(false);
                  }}
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
                <Info
                  icon={<Users className="h-5 w-5" />}
                  label="Alumnos registrados"
                  value={rosterApproved ? (participants.length || "Nómina pendiente") : "Se habilita tras la aprobación"}
                />
                <Info label="Fecha inicio" value={selectedProject.application?.startDate} />
                <Info label="Fecha término" value={selectedProject.application?.endDate} />
                <Info label="Hitos comprometidos" value={selectedProject.application?.milestonesText} />
                <Info label="Último hito" value={lastMilestone(selectedProject)} />
              </div>
            </Section>

            {selectedProject.application && (
              <Section
                title="Nómina de alumnos"
                subtitle={
                  !rosterApproved
                    ? "Los alumnos se registran después de aprobar la postulación docente."
                    : canEditRoster
                      ? "Registra los RUT participantes y, si corresponde, el equipo de cada alumno."
                      : "Registro consolidado del proyecto."
                }
              >
                {!rosterApproved ? (
                  <Notice type={applicationRejected ? "warning" : "info"}>
                    {applicationRejected
                      ? `La postulación fue rechazada. No se pueden asignar alumnos${selectedProject.application.rejectionReason ? `: ${selectedProject.application.rejectionReason}` : "."}`
                      : "La nómina permanecerá bloqueada hasta que el Validador o Director apruebe la ejecución del proyecto."}
                  </Notice>
                ) : participants.length > 0 && !isEditingRoster ? (
                  <StudentRosterCompactSummary
                    participants={participants}
                    onUpdate={canEditRoster ? () => {
                      setStudentRows(participants.map((participant) => ({
                        rowId: participant.id,
                        rut: participant.rut,
                        teamNumber: participant.teamNumber ? String(participant.teamNumber) : "",
                      })));
                      setIsEditingRoster(true);
                    } : undefined}
                  />
                ) : canEditRoster ? (
                  <>
                    <div className="mb-5">
                      <Notice type="info">
                        El Socio formador solicitó {selectedProject.execution?.teamCount || "una cantidad pendiente de"} equipo(s) con {selectedProject.execution?.peoplePerTeam || "una cantidad pendiente de"} persona(s) por equipo.
                      </Notice>
                    </div>
                    <StudentRosterEditor
                      rows={rosterRows}
                      onChange={setStudentRows}
                      teamCount={selectedProject.execution?.teamCount}
                    />
                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      {participants.length > 0 && (
                        <ActionButton
                          variant="outline"
                          onClick={() => {
                            setStudentRows(null);
                            setIsEditingRoster(false);
                          }}
                        >
                          Cancelar
                        </ActionButton>
                      )}
                      <ActionButton icon={<Save className="h-5 w-5" />} onClick={saveStudentRoster}>
                        {participants.length > 0 ? "Guardar cambios" : "Guardar nómina"}
                      </ActionButton>
                    </div>
                  </>
                ) : participants.length > 0 ? (
                  <StudentRosterCompactSummary participants={participants} />
                ) : (
                  <StudentRosterSummary participants={participants} />
                )}
              </Section>
            )}

            {["Postulada / Tomada por docente", "En revisión VCM"].includes(selectedProject.status) && (
              <Section title="Postulación en revisión" subtitle="El Validador o Director responsable debe aprobar la ejecución antes de registrar hitos.">
                <Notice type="info">Tu solicitud fue enviada correctamente y está pendiente de revisión del Validador o Director responsable.</Notice>
              </Section>
            )}

            {selectedProject.status === "Proyecto en ejecución" && participants.length === 0 && (
              <Section title="Ejecución pendiente de nómina" subtitle="El docente fue aprobado, pero todavía no hay alumnos registrados.">
                <Notice type="warning">Guarda al menos un RUT en la nómina para habilitar el registro de hitos y el cierre.</Notice>
              </Section>
            )}

            {selectedProject.status === "Proyecto en ejecución" && participants.length > 0 && (
              <Section title="Gestionar ejecución" subtitle="Registra hitos, solicita cierre o pide cancelación desde esta solicitud.">
                <div className="space-y-5">
                  {getNextActionableMilestone(selectedProject.milestones) && (
                    <Notice type="info">Próximo hito comprometido: {getNextActionableMilestone(selectedProject.milestones).title}</Notice>
                  )}
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
                    {!areMilestonesComplete(selectedProject.milestones) && (
                      <Notice type="warning">El cierre se habilita cuando todos los hitos comprometidos estén aprobados.</Notice>
                    )}
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
                <Notice type="info">El hito está pendiente en el Portal socio formador. Cuando sea aprobado podrás continuar con el siguiente hito o solicitar cierre.</Notice>
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
                <Notice type="warning">El Socio formador registró observaciones sobre un hito. Corrige evidencias y reenvía desde esta misma solicitud.</Notice>
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
                    ? "El Socio formador aprobó el cierre. Queda pendiente la validación administrativa del Validador o Director responsable."
                    : "El cierre fue enviado al Socio formador para revisión."}
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
