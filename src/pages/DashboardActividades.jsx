import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  History,
  Inbox,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Paperclip,
  Search,
  Send,
  TrendingUp,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { mockActivities, mockTeacherRequests } from "../data/mockDatabase";

const ESTADOS = [
  "Todos",
  "Pendiente de revisión",
  "Observada",
  "Rechazada",
  "Publicada en Hub",
];

const TABS = [
  { id: "revision", label: "Actividades por revisar" },
  { id: "publicadas", label: "Publicadas en Hub" },
  { id: "solicitudes", label: "Solicitudes docentes" },
  { id: "historial", label: "Historial" },
];

function formatDateTime(dateString) {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "Tamaño no disponible";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function buildHistoryEntry(accion, usuario = "Encargado VcM") {
  return {
    fecha: new Date().toISOString(),
    accion,
    usuario,
  };
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "No informado";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function topValue(items, key) {
  const counts = countBy(items, key);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return { label: "Sin datos", value: 0 };
  return { label: entries[0][0], value: entries[0][1] };
}

function topFromRequests(requests, key) {
  const counts = requests.reduce((acc, request) => {
    const value = request[key] || "No informado";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return { label: "Sin datos", value: 0 };
  return { label: entries[0][0], value: entries[0][1] };
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
          <Link to="/dashboard" className="rounded-xl bg-[#f5b400] px-4 py-2 text-neutral-950">
            Revisión
          </Link>
          <Link to="/actividades-aprobadas" className="rounded-xl px-4 py-2 text-neutral-600 hover:bg-neutral-100">
            Hub docente
          </Link>
        </nav>
      </div>
    </header>
  );
}

function StatusBadge({ estado }) {
  const styles = {
    "Pendiente de revisión": "bg-[#fff8df] text-[#8b6500]",
    Observada: "bg-blue-50 text-blue-700",
    Rechazada: "bg-red-50 text-red-700",
    "Publicada en Hub": "bg-green-50 text-green-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[estado] || "bg-neutral-100 text-neutral-700"}`}>
      {estado}
    </span>
  );
}

function MetricCard({ label, value, icon, helper }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">{value}</p>
          {helper && <p className="mt-1 text-xs font-semibold text-neutral-400">{helper}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff8df] text-[#8b6500]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InsightCard({ label, title, detail, icon }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
        <div className="text-[#b68400]">{icon}</div>
      </div>
      <p className="text-lg font-black text-neutral-950">{title}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-500">{detail}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-semibold text-neutral-900">{value || "No informado"}</p>
    </div>
  );
}

function StatusMessage({ status }) {
  if (!status) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm shadow-sm ${
        status.type === "success"
          ? "border-green-200 bg-green-50 text-green-900"
          : status.type === "error"
            ? "border-red-200 bg-red-50 text-red-900"
            : "border-blue-200 bg-blue-50 text-blue-900"
      }`}
    >
      {status.type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
      ) : status.type === "error" ? (
        <XCircle className="mt-0.5 h-5 w-5 flex-none" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
      )}
      <p className="font-semibold">{status.message}</p>
    </div>
  );
}

function MetricsPanel({ metrics }) {
  const [showMetrics, setShowMetrics] = useState(false);
  const [metricsTab, setMetricsTab] = useState("impacto");

  const metricTabs = [
    { id: "impacto", label: "Impacto" },
    { id: "rankings", label: "Rankings" },
    { id: "gestion", label: "Gestión" },
  ];

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#b68400]" />
            <h2 className="text-xl font-black text-neutral-950">Resumen del dashboard</h2>
          </div>
          <p className="text-sm leading-6 text-neutral-500">
            Vista resumida de los indicadores principales. Puedes desplegar las métricas completas si necesitas analizar el detalle.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowMetrics((prev) => !prev)}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
        >
          {showMetrics ? "Ocultar métricas detalladas" : "Ver métricas detalladas"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pendientes" value={metrics.totalPendientes} icon={<Clock3 className="h-6 w-6" />} helper="Requieren revisión" />
        <MetricCard label="Publicadas" value={metrics.totalPublicadas} icon={<Megaphone className="h-6 w-6" />} helper="Visibles en Hub" />
        <MetricCard label="Solicitudes docentes" value={metrics.totalSolicitudes} icon={<BookOpen className="h-6 w-6" />} helper="Desde el Hub" />
        <MetricCard label="Alumnos impactados" value={metrics.alumnosImpactados} icon={<GraduationCap className="h-6 w-6" />} helper="Impacto potencial" />
      </div>

      {showMetrics && (
        <div className="mt-6 border-t border-neutral-200 pt-5">
          <div className="mb-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-2">
            <div className="grid gap-2 sm:grid-cols-3">
              {metricTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMetricsTab(tab.id)}
                  className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                    metricsTab === tab.id
                      ? "bg-[#f5b400] text-neutral-950"
                      : "text-neutral-600 hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {metricsTab === "impacto" && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#b68400]" />
                <h3 className="text-lg font-black text-neutral-950">Indicadores de impacto institucional</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Registradas" value={metrics.totalRegistradas} icon={<Inbox className="h-6 w-6" />} helper="Total del sistema" />
                <MetricCard label="Profesores" value={metrics.profesoresParticipantes} icon={<UserCheck className="h-6 w-6" />} helper="Con solicitudes" />
                <MetricCard label="Alumnos" value={metrics.alumnosImpactados} icon={<GraduationCap className="h-6 w-6" />} helper="Potencial impacto" />
                <MetricCard label="Con solicitud" value={metrics.actividadesConSolicitudes} icon={<Users className="h-6 w-6" />} helper="Interés docente" />
              </div>
            </div>
          )}

          {metricsTab === "rankings" && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#b68400]" />
                <h3 className="text-lg font-black text-neutral-950">Rankings rápidos</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InsightCard
                  label="Escuela con más actividades"
                  title={metrics.topEscuela.label}
                  detail={`${metrics.topEscuela.value} actividad${metrics.topEscuela.value === 1 ? "" : "es"}`}
                  icon={<Building2 className="h-5 w-5" />}
                />
                <InsightCard
                  label="Sede con más actividades"
                  title={metrics.topSede.label}
                  detail={`${metrics.topSede.value} actividad${metrics.topSede.value === 1 ? "" : "es"}`}
                  icon={<MapPin className="h-5 w-5" />}
                />
                <InsightCard
                  label="Tipo más frecuente"
                  title={metrics.topTipo.label}
                  detail={`${metrics.topTipo.value} registro${metrics.topTipo.value === 1 ? "" : "s"}`}
                  icon={<ClipboardCheck className="h-5 w-5" />}
                />
                <InsightCard
                  label="Contraparte más vinculada"
                  title={metrics.topContraparte.label}
                  detail={`${metrics.topContraparte.value} actividad${metrics.topContraparte.value === 1 ? "" : "es"}`}
                  icon={<Award className="h-5 w-5" />}
                />
                <InsightCard
                  label="Profesor más activo"
                  title={metrics.topProfesor.label}
                  detail={`${metrics.topProfesor.value} solicitud${metrics.topProfesor.value === 1 ? "" : "es"}`}
                  icon={<UserCheck className="h-5 w-5" />}
                />
                <InsightCard
                  label="Asignatura con más solicitudes"
                  title={metrics.topAsignatura.label}
                  detail={`${metrics.topAsignatura.value} solicitud${metrics.topAsignatura.value === 1 ? "" : "es"}`}
                  icon={<BookOpen className="h-5 w-5" />}
                />
              </div>
            </div>
          )}

          {metricsTab === "gestion" && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#b68400]" />
                <h3 className="text-lg font-black text-neutral-950">Indicadores de gestión operativa</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                <MetricCard label="Sin evidencia" value={metrics.sinEvidencia} icon={<Paperclip className="h-6 w-6" />} helper="Revisar respaldo" />
                <MetricCard label="Observadas" value={metrics.totalObservadas} icon={<AlertCircle className="h-6 w-6" />} helper="Esperan corrección" />
                <MetricCard label="Rechazadas" value={metrics.totalRechazadas} icon={<XCircle className="h-6 w-6" />} helper="No publicadas" />
                <MetricCard label="Publicadas" value={metrics.totalPublicadas} icon={<Megaphone className="h-6 w-6" />} helper="En Hub docente" />
                <MetricCard label="Regulares" value={metrics.solicitudesRegulares} icon={<CheckCircle2 className="h-6 w-6" />} helper="Solicitudes directas" />
                <MetricCard label="Adaptaciones" value={metrics.solicitudesAdaptacion} icon={<LayoutDashboard className="h-6 w-6" />} helper="Piden ajuste" />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ActivityDetailModal({ activity, onClose, onPublish, onReject, onObserve }) {
  if (!activity) return null;

  const canReview = activity.estado === "Pendiente de revisión" || activity.estado === "Observada";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b68400]">Detalle de revisión</p>
            <h2 className="mt-1 text-2xl font-black text-neutral-950">{activity.nombreActividad}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge estado={activity.estado} />
              {activity.evidenciaNombre ? (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">Con evidencia</span>
              ) : (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">Sin evidencia</span>
              )}
            </div>
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

        <div className="max-h-[calc(90vh-190px)] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailRow label="Escuela" value={activity.escuela} />
            <DetailRow label="Carrera" value={activity.carrera} />
            <DetailRow label="Sede" value={activity.sede} />
            <DetailRow label="Tipo" value={activity.tipo} />
            <DetailRow label="Origen" value={activity.origen} />
            <DetailRow label="Responsable" value={activity.responsable} />
            <DetailRow label="Contraparte externa" value={activity.contraparteExterna || "No aplica"} />
            <DetailRow label="Participantes" value={`${activity.alumnosParticipantes || "-"} alumnos`} />
            <DetailRow label="Fecha tentativa" value={activity.fecha} />
            <DetailRow label="Horario" value={`${activity.horaInicio || "--:--"} a ${activity.horaTermino || "--:--"}`} />
            <DetailRow label="Ubicación" value={activity.ubicacion} />
            <DetailRow label="Evidencia" value={activity.evidenciaNombre || "Sin archivo adjunto"} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <DetailRow label="Descripción" value={activity.descripcion} />
            <DetailRow label="Objetivo general" value={activity.objetivoGeneral} />
            <DetailRow label="Objetivo específico" value={activity.objetivoEspecifico} />
          </div>

          {activity.observacion && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
              <p className="text-sm font-black">Observación registrada</p>
              <p className="mt-1 text-sm leading-6">{activity.observacion}</p>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="mb-3 text-sm font-black text-neutral-950">Historial de acciones</p>
            <div className="space-y-3">
              {(activity.historial || []).map((item, index) => (
                <div key={`${item.fecha}-${index}`} className="flex gap-3 rounded-xl bg-neutral-50 p-3">
                  <History className="mt-0.5 h-5 w-5 flex-none text-[#b68400]" />
                  <div>
                    <p className="text-sm font-bold text-neutral-950">{item.accion}</p>
                    <p className="text-xs text-neutral-500">
                      {formatDateTime(item.fecha)} · {item.usuario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:flex-row sm:justify-end">
          {canReview && (
            <>
              <button
                type="button"
                onClick={() => onReject(activity)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 text-sm font-extrabold text-red-700 transition hover:bg-red-50"
              >
                <XCircle className="h-5 w-5" />
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => onObserve(activity)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-5 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50"
              >
                <AlertCircle className="h-5 w-5" />
                Observar
              </button>
              <button
                type="button"
                onClick={() => onPublish(activity)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-6 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]"
              >
                <Megaphone className="h-5 w-5" />
                Aprobar y publicar en Hub
              </button>
            </>
          )}
          {!canReview && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ObservationModal({ activity, onClose, onSave }) {
  const [comment, setComment] = useState(activity?.observacion || "");

  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Registrar observación</p>
            <h2 className="mt-1 text-2xl font-black text-neutral-950">Solicitar corrección</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Esta observación quedará asociada a la actividad antes de que pueda publicarse.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Cerrar observación"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="mb-2 text-sm font-black text-neutral-950">Actividad</p>
          <div className="mb-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-sm font-bold text-neutral-900">
            {activity.nombreActividad}
          </div>

          <label className="mb-2 block text-sm font-black text-neutral-950">Comentario de observación</label>
          <textarea
            rows={6}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Ej: Falta precisar mejor el objetivo específico y adjuntar evidencia más clara de la contraparte externa."
            className="w-full resize-none rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
          />
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
            onClick={() => onSave(activity, comment)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
            Guardar observación
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityReviewCard({ activity, onView, onPublish, onReject, onObserve }) {
  const canReview = activity.estado === "Pendiente de revisión" || activity.estado === "Observada";

  return (
    <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-neutral-200 bg-neutral-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge estado={activity.estado} />
              {!activity.evidenciaNombre && (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">Sin evidencia</span>
              )}
              {activity.observacion && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Con observación</span>
              )}
            </div>
            <h3 className="mt-3 text-xl font-black text-neutral-950">{activity.nombreActividad}</h3>
            <p className="mt-1 text-sm font-semibold text-neutral-500">
              {activity.tipo || "Sin tipo"} · {activity.origen || "Sin origen"} · {activity.sede}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
            <Calendar className="ml-auto h-5 w-5 text-[#b68400]" />
            <p className="mt-1 text-sm font-black text-neutral-950">{activity.fecha || "Sin fecha"}</p>
            <p className="text-xs text-neutral-500">
              {activity.horaInicio || "--:--"} a {activity.horaTermino || "--:--"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="line-clamp-3 text-sm leading-6 text-neutral-600">
          {activity.descripcion || "Sin descripción registrada."}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 p-3">
            <FileText className="h-5 w-5 text-[#b68400]" />
            <p className="mt-2 text-xs font-black uppercase tracking-wide text-neutral-400">Escuela</p>
            <p className="mt-1 text-sm font-bold text-neutral-950">{activity.escuela}</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-3">
            <Users className="h-5 w-5 text-[#b68400]" />
            <p className="mt-2 text-xs font-black uppercase tracking-wide text-neutral-400">Participantes</p>
            <p className="mt-1 text-sm font-bold text-neutral-950">{activity.alumnosParticipantes} alumnos</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-[#b68400]" />
            <p className="text-sm font-black text-neutral-950">Documento de evidencia</p>
          </div>
          {activity.evidenciaNombre ? (
            <div className="flex flex-col gap-1 rounded-xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-950">{activity.evidenciaNombre}</p>
                <p className="text-xs text-neutral-500">{formatFileSize(activity.evidenciaSize)}</p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">Adjuntado</span>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-3 text-sm font-semibold text-neutral-500">
              Sin documento adjunto en este registro.
            </div>
          )}
        </div>

        {activity.observacion && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-black">Observación</p>
            <p className="mt-1 leading-6">{activity.observacion}</p>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => onView(activity)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
          >
            <Eye className="h-5 w-5" />
            Ver detalle
          </button>
          {canReview && (
            <>
              <button
                type="button"
                onClick={() => onObserve(activity)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50"
              >
                <AlertCircle className="h-5 w-5" />
                Observar
              </button>
              <button
                type="button"
                onClick={() => onReject(activity)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-extrabold text-red-700 transition hover:bg-red-50"
              >
                <XCircle className="h-5 w-5" />
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => onPublish(activity)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-4 text-sm font-extrabold text-neutral-950 transition hover:bg-[#d99d00]"
              >
                <Megaphone className="h-5 w-5" />
                Publicar
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function RequestCard({ request }) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
            {request.estado}
          </span>
          <h3 className="mt-3 text-xl font-black text-neutral-950">{request.nombreActividad}</h3>
          <p className="mt-1 text-sm font-semibold text-neutral-500">
            {request.asignatura} · Sección {request.seccion}
          </p>
        </div>
        <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-right">
          <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Fecha propuesta</p>
          <p className="text-sm font-black text-neutral-950">{request.fechaPropuesta}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <DetailRow label="Profesor" value={request.profesor} />
        <DetailRow label="Estudiantes" value={request.cantidadEstudiantes} />
        <DetailRow label="Contraparte" value={request.contraparteExterna} />
      </div>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Comentario docente</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">{request.comentario}</p>
      </div>
    </article>
  );
}

export default function DashboardActividades() {
  const [activities, setActivities] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [activeTab, setActiveTab] = useState("revision");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [observationActivity, setObservationActivity] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("registeredActivities") || "[]");
    const savedRequests = JSON.parse(localStorage.getItem("teacherRequests") || "[]");

    const normalizedSaved = saved.map((activity) => ({
      ...activity,
      estado: activity.estado || "Pendiente de revisión",
      enviadoEn: activity.enviadoEn || activity.creadoEn || new Date().toISOString(),
      historial:
        activity.historial ||
        [buildHistoryEntry("Actividad enviada a revisión", "Responsable interno")],
    }));

    const savedIds = new Set(normalizedSaved.map((activity) => activity.id));
    const seededActivities = mockActivities.filter(
      (activity) => !savedIds.has(activity.id)
    );

    const mergedActivities = [...normalizedSaved, ...seededActivities];

    const savedRequestIds = new Set(savedRequests.map((request) => request.id));
    const seededRequests = mockTeacherRequests.filter(
      (request) => !savedRequestIds.has(request.id)
    );

    const mergedRequests = [...savedRequests, ...seededRequests];

    setActivities(mergedActivities);
    setTeacherRequests(mergedRequests);

    const savedApproved = JSON.parse(localStorage.getItem("approvedActivities") || "[]");
    const savedApprovedIds = new Set(savedApproved.map((activity) => activity.id));

    const publishedSeeds = mergedActivities.filter(
      (activity) =>
        (activity.estado === "Publicada en Hub" || activity.publicadoEnHub) &&
        !savedApprovedIds.has(activity.id)
    );

    localStorage.setItem(
      "approvedActivities",
      JSON.stringify([...savedApproved, ...publishedSeeds])
    );
  }, []);

  const saveActivities = (nextActivities) => {
    setActivities(nextActivities);
    localStorage.setItem("registeredActivities", JSON.stringify(nextActivities));
  };

  const publishApprovedActivity = (activity) => {
    const savedApproved = JSON.parse(localStorage.getItem("approvedActivities") || "[]");
    const alreadyExists = savedApproved.some((item) => item.id === activity.id);

    const activityForHub = {
      ...activity,
      estado: "Publicada en Hub",
      aprobadoEn: new Date().toISOString(),
      publicadoEnHub: true,
    };

    const nextApproved = alreadyExists
      ? savedApproved.map((item) => (item.id === activity.id ? activityForHub : item))
      : [activityForHub, ...savedApproved];

    localStorage.setItem("approvedActivities", JSON.stringify(nextApproved));
  };

  const updateActivity = (activity, changes, historyAction) => {
    const nextActivities = activities.map((item) => {
      if (item.id !== activity.id) return item;

      return {
        ...item,
        ...changes,
        historial: [
          ...(item.historial || []),
          buildHistoryEntry(historyAction),
        ],
      };
    });

    saveActivities(nextActivities);

    const updated = nextActivities.find((item) => item.id === activity.id);
    return updated;
  };

  const handlePublish = (activity) => {
    const updated = updateActivity(
      activity,
      {
        estado: "Publicada en Hub",
        observacion: "",
        publicadoEnHub: true,
      },
      "Actividad aprobada y publicada en Hub docente"
    );

    publishApprovedActivity(updated);
    setSelectedActivity(null);
    setStatus({
      type: "success",
      message: "Actividad aprobada y publicada en el Hub docente.",
    });
  };

  const handleReject = (activity) => {
    updateActivity(activity, { estado: "Rechazada" }, "Actividad rechazada por encargado");
    setSelectedActivity(null);
    setStatus({
      type: "error",
      message: "Actividad rechazada. No será publicada en el Hub docente.",
    });
  };

  const handleObserve = (activity) => {
    setObservationActivity(activity);
  };

  const handleSaveObservation = (activity, comment) => {
    updateActivity(
      activity,
      {
        estado: "Observada",
        observacion: comment || "Se solicita revisar y corregir la información registrada.",
      },
      "Actividad observada por encargado"
    );
    setObservationActivity(null);
    setSelectedActivity(null);
    setStatus({
      type: "info",
      message: "Actividad observada. Quedó pendiente de corrección antes de publicarse.",
    });
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const normalized = `${activity.nombreActividad} ${activity.escuela} ${activity.sede} ${activity.tipo} ${activity.descripcion} ${activity.responsable}`.toLowerCase();
      const matchesQuery = normalized.includes(query.toLowerCase());
      const matchesEstado = estadoFilter === "Todos" || activity.estado === estadoFilter;
      return matchesQuery && matchesEstado;
    });
  }, [activities, query, estadoFilter]);

  const pendingActivities = filteredActivities.filter(
    (activity) => activity.estado === "Pendiente de revisión" || activity.estado === "Observada"
  );

  const publishedActivities = filteredActivities.filter(
    (activity) => activity.estado === "Publicada en Hub"
  );

  const allHistory = activities
    .flatMap((activity) =>
      (activity.historial || []).map((item) => ({
        ...item,
        activityName: activity.nombreActividad,
        activityId: activity.id,
      }))
    )
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const metrics = useMemo(() => {
    const profesores = new Set(teacherRequests.map((request) => request.profesor).filter(Boolean));
    const alumnosDesdeSolicitudes = teacherRequests.reduce(
      (total, request) => total + Number(request.cantidadEstudiantes || 0),
      0
    );
    const alumnosDesdeActividades = activities.reduce(
      (total, activity) => total + Number(activity.alumnosParticipantes || 0),
      0
    );
    const actividadesConSolicitudes = new Set(teacherRequests.map((request) => request.activityId)).size;

    return {
      totalRegistradas: activities.length,
      totalPendientes: activities.filter((activity) => activity.estado === "Pendiente de revisión").length,
      totalObservadas: activities.filter((activity) => activity.estado === "Observada").length,
      totalRechazadas: activities.filter((activity) => activity.estado === "Rechazada").length,
      totalPublicadas: activities.filter((activity) => activity.estado === "Publicada en Hub").length,
      totalSolicitudes: teacherRequests.length,
      profesoresParticipantes: profesores.size,
      alumnosImpactados: alumnosDesdeSolicitudes || alumnosDesdeActividades,
      sinEvidencia: activities.filter((activity) => !activity.evidenciaNombre).length,
      actividadesConSolicitudes,
      solicitudesRegulares: teacherRequests.filter((request) => request.tipoSolicitud !== "Adaptación solicitada").length,
      solicitudesAdaptacion: teacherRequests.filter((request) => request.tipoSolicitud === "Adaptación solicitada").length,
      topEscuela: topValue(activities, "escuela"),
      topSede: topValue(activities, "sede"),
      topTipo: topValue(activities, "tipo"),
      topContraparte: topValue(activities, "contraparteExterna"),
      topProfesor: topFromRequests(teacherRequests, "profesor"),
      topAsignatura: topFromRequests(teacherRequests, "asignatura"),
    };
  }, [activities, teacherRequests]);

  const renderActivityList = (list, emptyText) => {
    if (list.length === 0) {
      return (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
          <Inbox className="mx-auto h-12 w-12 text-neutral-400" />
          <h2 className="mt-4 text-xl font-black text-neutral-950">{emptyText}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
            Ajusta los filtros o revisa otro estado para visualizar más registros.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-5 lg:grid-cols-2">
        {list.map((activity) => (
          <ActivityReviewCard
            key={activity.id}
            activity={activity}
            onView={setSelectedActivity}
            onPublish={handlePublish}
            onReject={handleReject}
            onObserve={handleObserve}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-neutral-950">
      <Header />

      <section className="mx-auto max-w-7xl space-y-5 px-6 py-9">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f5b400]">Panel del encargado</p>
              <h1 className="text-3xl font-black tracking-tight lg:text-4xl">Dashboard de Revisión y Métricas</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-300">
                Gestiona actividades enviadas, revisa solicitudes docentes y analiza el impacto institucional del flujo de vinculación.
              </p>
            </div>

            <Link
              to="/formulario"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-6 text-sm font-extrabold text-neutral-950 transition hover:bg-[#d99d00]"
            >
              <ClipboardCheck className="h-5 w-5" />
              Registrar actividad
            </Link>
          </div>
        </div>

        <MetricsPanel metrics={metrics} />

        <StatusMessage status={status} />

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre, escuela, sede, tipo, responsable o descripción..."
                className="h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 pl-10 text-sm outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
              <select
                value={estadoFilter}
                onChange={(event) => setEstadoFilter(event.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-neutral-300 bg-white px-4 pl-10 text-sm font-bold text-neutral-700 outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
              >
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
          <div className="grid gap-2 md:grid-cols-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                  activeTab === tab.id
                    ? "bg-[#f5b400] text-neutral-950"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "revision" && renderActivityList(pendingActivities, "No hay actividades pendientes u observadas")}

        {activeTab === "publicadas" && renderActivityList(publishedActivities, "No hay actividades publicadas en el Hub")}

        {activeTab === "solicitudes" &&
          (teacherRequests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
              <UserCheck className="mx-auto h-12 w-12 text-neutral-400" />
              <h2 className="mt-4 text-xl font-black text-neutral-950">No hay solicitudes docentes todavía</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
                Cuando un profesor solicite una actividad desde el Hub docente, aparecerá en esta bandeja.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {teacherRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ))}

        {activeTab === "historial" &&
          (allHistory.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
              <History className="mx-auto h-12 w-12 text-neutral-400" />
              <h2 className="mt-4 text-xl font-black text-neutral-950">No hay historial registrado</h2>
            </div>
          ) : (
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="space-y-3">
                {allHistory.map((item, index) => (
                  <div key={`${item.activityId}-${item.fecha}-${index}`} className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <History className="mt-0.5 h-5 w-5 flex-none text-[#b68400]" />
                    <div>
                      <p className="text-sm font-black text-neutral-950">{item.accion}</p>
                      <p className="mt-1 text-sm text-neutral-600">{item.activityName}</p>
                      <p className="mt-1 text-xs font-semibold text-neutral-400">
                        {formatDateTime(item.fecha)} · {item.usuario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </section>

      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onPublish={handlePublish}
        onReject={handleReject}
        onObserve={handleObserve}
      />

      <ObservationModal
        activity={observationActivity}
        onClose={() => setObservationActivity(null)}
        onSave={handleSaveObservation}
      />
    </main>
  );
}
