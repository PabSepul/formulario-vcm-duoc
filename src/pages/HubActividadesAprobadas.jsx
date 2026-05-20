import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Eye,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Paperclip,
  Search,
  Send,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";

const actividadesFicticias = [
  {
    id: "demo-aprobada-001",
    nombreActividad: "Charla de innovación con empresa tecnológica",
    tipo: "Charla",
    escuela: "Informática y Telecomunicaciones",
    carrera: "Ingeniería en Informática",
    sede: "Maipú",
    fecha: "2026-04-18",
    horaInicio: "10:00",
    horaTermino: "12:00",
    ubicacion: "Auditorio sede Maipú",
    origen: "Externa",
    responsable: "Coordinación de carrera",
    contraparteExterna: "Empresa tecnológica invitada",
    alumnosParticipantes: "45",
    estado: "Aprobada",
    descripcion:
      "Actividad orientada a acercar a los estudiantes a experiencias reales de innovación, transformación digital y desarrollo tecnológico dentro de la industria.",
    objetivoGeneral:
      "Fortalecer la vinculación entre estudiantes y el sector tecnológico mediante una experiencia formativa centrada en innovación aplicada.",
    objetivoEspecifico:
      "Reconocer tendencias actuales del sector tecnológico, relacionar aprendizajes de la carrera con casos reales y promover la participación estudiantil en espacios de vinculación externa.",
    evidenciaNombre: "evidencia_charla_innovacion.pdf",
    modalidad: "Presencial",
    competencias: ["Innovación", "Vinculación con la industria", "Comunicación profesional"],
    asignaturasSugeridas: ["Arquitectura de Software", "Innovación y Emprendimiento", "Gestión de Proyectos TI"],
  },
  {
    id: "demo-aprobada-002",
    nombreActividad: "Visita técnica a centro de operaciones",
    tipo: "Visita técnica",
    escuela: "Ingeniería y Recursos Naturales",
    carrera: "Ingeniería en Electricidad y Automatización",
    sede: "Concepción",
    fecha: "2026-03-22",
    horaInicio: "09:00",
    horaTermino: "13:30",
    ubicacion: "Centro de operaciones externo",
    origen: "Mixta",
    responsable: "Docente de especialidad",
    contraparteExterna: "Centro de operaciones asociado",
    alumnosParticipantes: "30",
    estado: "Aprobada",
    descripcion:
      "Experiencia práctica en terreno donde los estudiantes observan procesos operacionales, protocolos de seguridad y aplicación de tecnologías industriales.",
    objetivoGeneral:
      "Complementar la formación académica mediante una experiencia práctica en un entorno productivo real.",
    objetivoEspecifico:
      "Observar procesos técnicos vinculados a la especialidad, identificar buenas prácticas de seguridad y relacionar contenidos de aula con actividades profesionales reales.",
    evidenciaNombre: "registro_visita_tecnica_centro_operaciones.docx",
    modalidad: "Presencial",
    competencias: ["Seguridad operacional", "Análisis de procesos", "Aplicación técnica"],
    asignaturasSugeridas: ["Automatización Industrial", "Seguridad Industrial", "Mantenimiento Eléctrico"],
  },
  {
    id: "demo-aprobada-003",
    nombreActividad: "Taller de empleabilidad y preparación laboral",
    tipo: "Taller",
    escuela: "Administración y Negocios",
    carrera: "Ingeniería en Administración",
    sede: "Antonio Varas",
    fecha: "2026-05-06",
    horaInicio: "15:00",
    horaTermino: "17:00",
    ubicacion: "Sala multipropósito sede Antonio Varas",
    origen: "Interna",
    responsable: "Área de apoyo estudiantil",
    contraparteExterna: "No aplica",
    alumnosParticipantes: "35",
    estado: "Aprobada",
    descripcion:
      "Taller enfocado en fortalecer habilidades de empleabilidad, preparación de entrevistas, comunicación profesional y construcción de perfil laboral.",
    objetivoGeneral:
      "Desarrollar competencias de empleabilidad en los estudiantes mediante una instancia práctica de preparación laboral.",
    objetivoEspecifico:
      "Reconocer herramientas para búsqueda laboral, fortalecer habilidades de comunicación profesional y preparar a los estudiantes para procesos de entrevista y postulación.",
    evidenciaNombre: "fotografias_taller_empleabilidad.zip",
    modalidad: "Presencial",
    competencias: ["Empleabilidad", "Comunicación", "Preparación laboral"],
    asignaturasSugeridas: ["Ética Profesional", "Gestión de Personas", "Taller de Integración Laboral"],
  },
];

function normalizeApprovedActivity(activity) {
  return {
    modalidad: activity.modalidad || "Por definir",
    competencias: activity.competencias || ["Vinculación con el medio", "Aprendizaje aplicado"],
    asignaturasSugeridas: activity.asignaturasSugeridas || ["Asignatura por definir"],
    objetivoGeneral: activity.objetivoGeneral || "Objetivo general registrado en la propuesta original.",
    objetivoEspecifico: activity.objetivoEspecifico || "Objetivos específicos registrados en la propuesta original.",
    contraparteExterna: activity.contraparteExterna || "No aplica",
    carrera: activity.carrera || "Carrera no especificada",
    estado: "Aprobada",
    ...activity,
  };
}

function Header() {
  return (
    <header className="border-b-2 border-[#f5b400] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-3xl font-black tracking-tight">
          <span className="text-[#f5b400]">Duoc</span>
          <span className="text-neutral-950">UC</span>
        </div>

        <nav className="hidden items-center gap-3 text-sm font-bold sm:flex">
          <Link to="/formulario" className="rounded-xl px-4 py-2 text-neutral-600 hover:bg-neutral-100">
            Formulario
          </Link>
          <Link to="/dashboard" className="rounded-xl px-4 py-2 text-neutral-600 hover:bg-neutral-100">
            Revisión
          </Link>
          <Link to="/actividades-aprobadas" className="rounded-xl bg-[#f5b400] px-4 py-2 text-neutral-950">
            Hub docente
          </Link>
        </nav>
      </div>
    </header>
  );
}

function StatusMessage({ status }) {
  if (!status) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 shadow-sm">
      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
      <p className="font-semibold">{status.message}</p>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff8df] text-[#8b6500]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SelectFilter({ value, onChange, options, label }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 pr-10 text-sm font-bold text-neutral-700 outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-neutral-400" />
      </div>
    </div>
  );
}

function ContextBlock({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-[#b68400]">{icon}</div>
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-neutral-950">{value || "No informado"}</p>
    </div>
  );
}

function DetailModal({ activity, onClose, onRequest }) {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b68400]">Detalle de actividad disponible</p>
            <h2 className="mt-1 text-2xl font-black text-neutral-950">{activity.nombreActividad}</h2>
            <p className="mt-1 text-sm text-neutral-500">{activity.escuela} · {activity.carrera}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Cerrar detalle"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-180px)] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ContextBlock icon={<Building2 className="h-5 w-5" />} label="Escuela" value={activity.escuela} />
            <ContextBlock icon={<BookOpen className="h-5 w-5" />} label="Carrera" value={activity.carrera} />
            <ContextBlock icon={<MapPin className="h-5 w-5" />} label="Sede" value={activity.sede} />
            <ContextBlock icon={<CalendarDays className="h-5 w-5" />} label="Fecha" value={activity.fecha || "Por definir"} />
            <ContextBlock icon={<Users className="h-5 w-5" />} label="Cupos estimados" value={`${activity.alumnosParticipantes || "-"} alumnos`} />
            <ContextBlock icon={<UserCheck className="h-5 w-5" />} label="Contraparte" value={activity.contraparteExterna} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 lg:col-span-1">
              <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Descripción</p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{activity.descripcion}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 lg:col-span-1">
              <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Objetivo general</p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{activity.objetivoGeneral}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 lg:col-span-1">
              <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Objetivo específico</p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{activity.objetivoEspecifico}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onRequest(activity)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-6 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]"
          >
            <ClipboardCheck className="h-5 w-5" />
            Solicitar para mi sección
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestModal({ activity, onClose, onSubmit }) {
  const [form, setForm] = useState({
    profesor: "",
    asignatura: "",
    seccion: "",
    cantidadEstudiantes: "",
    fechaPropuesta: "",
    comentario: "",
  });

  if (!activity) return null;

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b68400]">Solicitud docente</p>
            <h2 className="mt-1 text-2xl font-black text-neutral-950">Solicitar actividad para mi sección</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Completa los datos para vincular esta actividad con una asignatura y sección.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Cerrar solicitud"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Actividad seleccionada</p>
            <p className="mt-1 text-lg font-black text-neutral-950">{activity.nombreActividad}</p>
            <p className="mt-1 text-sm font-semibold text-neutral-500">
              {activity.escuela} · {activity.carrera}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black text-neutral-950">Profesor responsable *</label>
              <input
                value={form.profesor}
                onChange={(event) => update("profesor", event.target.value)}
                placeholder="Ej: Pablo Sepúlveda"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-neutral-950">Asignatura *</label>
              <input
                value={form.asignatura}
                onChange={(event) => update("asignatura", event.target.value)}
                placeholder="Ej: Gestión de Proyectos TI"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-neutral-950">Sección *</label>
              <input
                value={form.seccion}
                onChange={(event) => update("seccion", event.target.value)}
                placeholder="Ej: 005D"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-neutral-950">Cantidad de estudiantes *</label>
              <input
                type="number"
                min="1"
                value={form.cantidadEstudiantes}
                onChange={(event) => update("cantidadEstudiantes", event.target.value)}
                placeholder="Ej: 28"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-neutral-950">Fecha propuesta</label>
              <input
                type="date"
                value={form.fechaPropuesta}
                onChange={(event) => update("fechaPropuesta", event.target.value)}
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-neutral-950">Comentario para la contraparte o encargado</label>
              <textarea
                rows={4}
                value={form.comentario}
                onChange={(event) => update("comentario", event.target.value)}
                placeholder="Ej: Esta actividad calza con la unidad de proyectos reales de la asignatura."
                className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSubmit(activity, form)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-6 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]"
          >
            <Send className="h-5 w-5" />
            Enviar solicitud
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity, requestCount, onOpenDetail, onRequest }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onOpenDetail(activity)}
        className="block w-full border-b border-neutral-200 bg-neutral-50 p-5 text-left transition hover:bg-[#fff8df]"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Disponible
              </span>
              <span className="rounded-full bg-[#fff8df] px-3 py-1 text-xs font-black text-[#8b6500]">
                {activity.tipo}
              </span>
              <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-black text-neutral-600">
                {activity.modalidad}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-neutral-950">
              {activity.nombreActividad}
            </h3>
            <p className="mt-2 text-sm font-semibold text-neutral-500">
              {activity.escuela} · {activity.carrera}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm xl:text-right">
            <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Fecha sugerida</p>
            <p className="mt-1 text-sm font-black text-neutral-950">{activity.fecha || "Por definir"}</p>
            <p className="text-xs font-semibold text-neutral-500">
              {activity.horaInicio || "--:--"} a {activity.horaTermino || "--:--"}
            </p>
          </div>
        </div>
      </button>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Descripción breve</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{activity.descripcion}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ContextBlock icon={<Building2 className="h-5 w-5" />} label="Sede" value={activity.sede} />
          <ContextBlock icon={<MapPin className="h-5 w-5" />} label="Ubicación" value={activity.ubicacion} />
          <ContextBlock icon={<Users className="h-5 w-5" />} label="Cupos estimados" value={`${activity.alumnosParticipantes || "-"} alumnos`} />
          <ContextBlock icon={<UserCheck className="h-5 w-5" />} label="Solicitudes" value={`${requestCount} docente${requestCount === 1 ? "" : "s"}`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Asignaturas sugeridas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activity.asignaturasSugeridas.map((asignatura) => (
                <span key={asignatura} className="rounded-full bg-white px-3 py-1 text-xs font-black text-neutral-700">
                  {asignatura}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Competencias asociadas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activity.competencias.map((competencia) => (
                <span key={competencia} className="rounded-full bg-white px-3 py-1 text-xs font-black text-neutral-700">
                  {competencia}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-[#b68400]" />
            <p className="text-sm font-black text-neutral-950">Documento de evidencia</p>
          </div>
          {activity.evidenciaNombre ? (
            <div className="rounded-xl bg-white p-3">
              <p className="text-sm font-bold text-neutral-950">{activity.evidenciaNombre}</p>
              <p className="text-xs text-neutral-500">Material de respaldo de la actividad</p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-3 text-sm font-semibold text-neutral-500">
              Sin documento adjunto.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            Contraparte: <span className="font-bold text-neutral-700">{activity.contraparteExterna}</span>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onOpenDetail(activity)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
            >
              <Eye className="h-5 w-5" />
              Ver detalle
            </button>
            <button
              type="button"
              onClick={() => onRequest(activity)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-6 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]"
            >
              <ClipboardCheck className="h-5 w-5" />
              Solicitar para mi sección
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function HubActividadesAprobadas() {
  const [approvedActivities, setApprovedActivities] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedEscuela, setSelectedEscuela] = useState("Todas");
  const [selectedSede, setSelectedSede] = useState("Todas");
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const [detailActivity, setDetailActivity] = useState(null);
  const [requestActivity, setRequestActivity] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const savedApproved = JSON.parse(localStorage.getItem("approvedActivities") || "[]");
    const savedRequests = JSON.parse(localStorage.getItem("teacherRequests") || "[]");

    const normalizedSaved = savedApproved.map(normalizeApprovedActivity);
    const savedIds = new Set(normalizedSaved.map((activity) => activity.id));
    const demos = actividadesFicticias.filter((activity) => !savedIds.has(activity.id));

    setApprovedActivities([...normalizedSaved, ...demos]);
    setTeacherRequests(savedRequests);
  }, []);

  const escuelas = useMemo(
    () => ["Todas", ...Array.from(new Set(approvedActivities.map((item) => item.escuela).filter(Boolean)))],
    [approvedActivities]
  );

  const sedes = useMemo(
    () => ["Todas", ...Array.from(new Set(approvedActivities.map((item) => item.sede).filter(Boolean)))],
    [approvedActivities]
  );

  const tipos = useMemo(
    () => ["Todos", ...Array.from(new Set(approvedActivities.map((item) => item.tipo).filter(Boolean)))],
    [approvedActivities]
  );

  const filteredActivities = useMemo(() => {
    return approvedActivities.filter((activity) => {
      const matchesText = `${activity.nombreActividad} ${activity.descripcion} ${activity.escuela} ${activity.carrera} ${activity.sede}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesEscuela = selectedEscuela === "Todas" || activity.escuela === selectedEscuela;
      const matchesSede = selectedSede === "Todas" || activity.sede === selectedSede;
      const matchesTipo = selectedTipo === "Todos" || activity.tipo === selectedTipo;

      return matchesText && matchesEscuela && matchesSede && matchesTipo;
    });
  }, [approvedActivities, query, selectedEscuela, selectedSede, selectedTipo]);

  const totalParticipantes = approvedActivities.reduce(
    (total, activity) => total + Number(activity.alumnosParticipantes || 0),
    0
  );

  const handleRequestSubmit = (activity, form) => {
    const newRequest = {
      id: crypto.randomUUID(),
      activityId: activity.id,
      nombreActividad: activity.nombreActividad,
      contraparteExterna: activity.contraparteExterna,
      profesor: form.profesor || "Profesor no informado",
      asignatura: form.asignatura || "Asignatura no informada",
      seccion: form.seccion || "Sección no informada",
      cantidadEstudiantes: form.cantidadEstudiantes || "No informado",
      fechaPropuesta: form.fechaPropuesta || "Por definir",
      comentario: form.comentario || "Sin comentario adicional",
      estado: "Solicitud enviada",
      creadoEn: new Date().toISOString(),
    };

    const nextRequests = [newRequest, ...teacherRequests];
    setTeacherRequests(nextRequests);
    localStorage.setItem("teacherRequests", JSON.stringify(nextRequests));
    setRequestActivity(null);
    setDetailActivity(null);
    setStatus({
      type: "success",
      message:
        "Solicitud enviada. La actividad quedó vinculada al profesor, asignatura y sección indicados.",
    });
  };

  const countRequestsByActivity = (activityId) =>
    teacherRequests.filter((request) => request.activityId === activityId).length;

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-neutral-950">
      <Header />

      <section className="mx-auto max-w-7xl space-y-5 px-6 py-9">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f5b400]">
                Catálogo docente
              </p>
              <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
                Hub de Actividades Disponibles
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-300">
                Revisa actividades aprobadas por el encargado y solicita aquellas que calcen con tu
                asignatura, sección y planificación académica.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-[#f5b400]" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-neutral-300">Flujo actual</p>
                  <p className="text-lg font-black text-white">Aprobada → Solicitable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatusMessage status={status} />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Actividades disponibles"
            value={approvedActivities.length}
            icon={<CheckCircle2 className="h-6 w-6" />}
          />
          <MetricCard
            label="Alumnos potenciales"
            value={totalParticipantes}
            icon={<GraduationCap className="h-6 w-6" />}
          />
          <MetricCard
            label="Solicitudes docentes"
            value={teacherRequests.length}
            icon={<BookOpen className="h-6 w-6" />}
          />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 xl:grid-cols-[1fr_220px_220px_180px]">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-neutral-400">Buscar</p>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por actividad, descripción, escuela, carrera o sede..."
                  className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-4 pl-10 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
                />
              </div>
            </div>

            <SelectFilter label="Escuela" value={selectedEscuela} onChange={setSelectedEscuela} options={escuelas} />
            <SelectFilter label="Sede" value={selectedSede} onChange={setSelectedSede} options={sedes} />
            <SelectFilter label="Tipo" value={selectedTipo} onChange={setSelectedTipo} options={tipos} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-neutral-600">
            Mostrando {filteredActivities.length} de {approvedActivities.length} actividades disponibles.
          </p>
          <div className="hidden items-center gap-2 rounded-full bg-[#fff8df] px-4 py-2 text-xs font-black text-[#8b6500] sm:flex">
            <Sparkles className="h-4 w-4" />
            Vista pensada para docentes
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
            <LayoutDashboard className="mx-auto h-12 w-12 text-neutral-400" />
            <h2 className="mt-4 text-xl font-black text-neutral-950">
              No hay actividades disponibles con esos filtros
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
              Ajusta la búsqueda o cambia los filtros para volver a visualizar actividades aprobadas.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                requestCount={countRequestsByActivity(activity.id)}
                onOpenDetail={setDetailActivity}
                onRequest={setRequestActivity}
              />
            ))}
          </div>
        )}
      </section>

      <DetailModal
        activity={detailActivity}
        onClose={() => setDetailActivity(null)}
        onRequest={setRequestActivity}
      />

      <RequestModal
        activity={requestActivity}
        onClose={() => setRequestActivity(null)}
        onSubmit={handleRequestSubmit}
      />
    </main>
  );
}
