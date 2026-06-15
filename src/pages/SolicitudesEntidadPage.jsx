import { useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
} from "lucide-react";
import {
  AppShell,
  EmptyState,
  PageIntro,
  Section,
  StatusBadge,
} from "../components/VcmUI";
import {
  ensureVcmData,
  getEntities,
  getProjects,
  getSession,
} from "../data/vcmPlatform";

const trackedStatuses = [
  "En revisión por EE",
  "Correcciones solicitadas por mantenedor",
  "Aprobada por mantenedor",
  "Postulada / Tomada por docente",
  "En revisión VCM",
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

export default function SolicitudesEntidadPage() {
  ensureVcmData();
  const session = getSession();
  const [projects] = useState(getProjects);
  const [entities] = useState(getEntities);

  const entityIds = useMemo(
    () =>
      entities
        .filter((entity) => entity.contactEmail?.toLowerCase() === session?.email?.toLowerCase())
        .map((entity) => entity.id),
    [entities, session?.email],
  );

  const solicitudes = useMemo(() => {
    const base = ["vcm", "jc"].includes(session?.role)
      ? projects
      : projects.filter((project) => entityIds.includes(project.entityId));

    return base.filter((project) => project.application || trackedStatuses.includes(project.status));
  }, [entityIds, projects, session?.role]);

  const [selectedId, setSelectedId] = useState(solicitudes[0]?.id || "");
  const selectedProject = solicitudes.find((project) => project.id === selectedId) || solicitudes[0];

  return (
    <AppShell active="solicitudes-entidad">
      <PageIntro
        eyebrow="Entidad Externa"
        title="Mis solicitudes"
        description="Seguimiento de solicitudes asociadas a la entidad cuando ya fueron tomadas por un docente o avanzaron de estado."
      />

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Section title="Solicitudes" subtitle="Proyectos vinculados a la entidad y su estado actual.">
          <div className="space-y-3">
            {solicitudes.length === 0 ? (
              <EmptyState title="Sin solicitudes tomadas" description="Aún no hay solicitudes tomadas por docentes para esta entidad." />
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
                <Info icon={<Building2 className="h-5 w-5" />} label="Entidad" value={selectedProject.entityName} />
                <Info icon={<GraduationCap className="h-5 w-5" />} label="Docente" value={selectedProject.application?.teacher || "Pendiente"} />
                <Info label="Asignatura" value={selectedProject.assignment?.subject} />
                <Info label="Sección / semestre" value={[selectedProject.assignment?.section, selectedProject.assignment?.semester].filter(Boolean).join(" · ")} />
                <Info label="Fechas ejecución" value={formatDates(selectedProject)} />
                <Info label="Último hito" value={lastMilestone(selectedProject)} />
              </div>
            </Section>

            <Section title="Resumen de avance" subtitle="Vista de seguimiento para la contraparte.">
              <div className="grid gap-4 md:grid-cols-3">
                <Info label="Estado actual" value={selectedProject.status} />
                <Info label="Estudiantes" value={selectedProject.application?.students} />
                <Info label="Cierre" value={selectedProject.closure?.summary || "Pendiente"} />
              </div>
            </Section>
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

function formatDates(project) {
  if (!project.application?.startDate || !project.application?.endDate) return "Pendiente";
  return `${project.application.startDate} a ${project.application.endDate}`;
}

function lastMilestone(project) {
  const current = project.milestones?.[0];
  if (!current) return "Sin hitos registrados";
  return `${current.title} · ${current.status}`;
}
