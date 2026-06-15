import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  ExternalLink,
  Users,
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
  getProjects,
  getSession,
} from "../data/vcmPlatform";

export default function MisSolicitudesDocentePage() {
  ensureVcmData();
  const session = getSession();
  const [projects] = useState(getProjects);

  const solicitudes = useMemo(() => {
    const withTeacher = projects.filter((project) => project.application);
    if (["vcm", "jc"].includes(session?.role)) return withTeacher;
    return withTeacher.filter((project) => project.application?.teacher === session?.name);
  }, [projects, session?.name, session?.role]);

  const [selectedId, setSelectedId] = useState(solicitudes[0]?.id || "");
  const selectedProject = solicitudes.find((project) => project.id === selectedId) || solicitudes[0];

  return (
    <AppShell active="mis-solicitudes-docente">
      <PageIntro
        eyebrow="Docente"
        title="Mis solicitudes tomadas"
        description="Seguimiento de proyectos tomados por el docente, con acceso directo a la gestión de hitos, cierre o cancelación."
      />

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Section title="Solicitudes tomadas" subtitle="Proyectos donde existe postulación o ejecución docente.">
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
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <StatusBadge status={selectedProject.status} />
                <Link
                  to={`/catalogo-docente?proyecto=${selectedProject.id}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-4 text-sm font-extrabold text-neutral-950 transition hover:bg-[#d99d00]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Gestionar
                </Link>
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
