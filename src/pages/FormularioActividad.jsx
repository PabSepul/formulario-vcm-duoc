import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FileUp,
  RotateCcw,
  Save,
  SearchCheck,
  Send,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";
import { fetchCompanyFromSii } from "../services/siiCompany";

const escuelas = [
  "Administración y Negocios",
  "Comunicación",
  "Construcción",
  "Diseño",
  "Gastronomía",
  "Informática y Telecomunicaciones",
  "Ingeniería y Recursos Naturales",
  "Salud y Bienestar",
  "Turismo y Hospitalidad",
];

const carrerasPorEscuela = {
  "Administración y Negocios": ["Ingeniería en Administración", "Contador Auditor", "Técnico en Administración"],
  Comunicación: ["Publicidad", "Comunicación Audiovisual", "Relaciones Públicas"],
  Construcción: ["Construcción Civil", "Dibujo y Modelamiento Arquitectónico"],
  Diseño: ["Diseño Gráfico", "Diseño de Vestuario", "Animación Digital"],
  Gastronomía: ["Gastronomía Internacional", "Administración Gastronómica"],
  "Informática y Telecomunicaciones": [
    "Ingeniería en Informática",
    "Analista Programador Computacional",
    "Ingeniería en Ciberseguridad",
    "Ingeniería en Conectividad y Redes",
  ],
  "Ingeniería y Recursos Naturales": [
    "Ingeniería en Mecánica Automotriz",
    "Ingeniería en Electricidad y Automatización",
    "Técnico en Energías Renovables",
  ],
  "Salud y Bienestar": ["Técnico en Enfermería", "Preparador Físico", "Técnico en Odontología"],
  "Turismo y Hospitalidad": ["Turismo y Hotelería", "Técnico en Turismo"],
};

const sedes = [
  "Alameda",
  "Antonio Varas",
  "Concepción",
  "Maipú",
  "Plaza Norte",
  "Puente Alto",
  "San Bernardo",
  "San Carlos de Apoquindo",
  "Valparaíso",
  "Viña del Mar",
  "Online",
];

const tiposActividad = ["Proyecto", "Otro"];

const actividadesAnteriores = [
  {
    id: "actividad-innovacion-001",
    nombre: "Charla de innovación con empresa tecnológica",
    escuela: "Informática y Telecomunicaciones",
    carrera: "Ingeniería en Informática",
    sede: "Maipú",
    tipo: "Charla",
    descripcion:
      "Instancia académica orientada a acercar a los estudiantes a experiencias reales de innovación, transformación digital y desarrollo tecnológico en la industria.",
    origen: "Externa",
    responsable: "Coordinación de carrera",
    contraparteExterna: "Empresa tecnológica invitada",
    objetivoGeneral:
      "Fortalecer la vinculación entre estudiantes y el sector tecnológico mediante una actividad formativa centrada en innovación aplicada.",
    objetivoEspecifico: `1. Reconocer tendencias actuales del sector tecnológico.
2. Relacionar aprendizajes de la carrera con casos reales de la industria.
3. Promover la participación estudiantil en espacios de vinculación externa.`,
    fecha: "",
    horaInicio: "",
    horaTermino: "",
    ubicacion: "Auditorio sede Maipú",
  },
  {
    id: "taller-empleabilidad-002",
    nombre: "Taller de empleabilidad y preparación laboral",
    escuela: "Administración y Negocios",
    carrera: "Ingeniería en Administración",
    sede: "Antonio Varas",
    tipo: "Taller",
    descripcion:
      "Taller orientado a fortalecer habilidades de empleabilidad, preparación de entrevistas, comunicación profesional y construcción de perfil laboral.",
    origen: "Interna",
    responsable: "Área de apoyo estudiantil",
    contraparteExterna: "",
    objetivoGeneral:
      "Desarrollar competencias de empleabilidad en los estudiantes mediante una instancia práctica de preparación laboral.",
    objetivoEspecifico: `1. Reconocer herramientas para la búsqueda laboral.
2. Fortalecer habilidades de comunicación profesional.
3. Preparar a los estudiantes para procesos de entrevista y postulación.`,
    fecha: "",
    horaInicio: "",
    horaTermino: "",
    ubicacion: "Sala multipropósito",
  },
];

const initialForm = {
  tipoSolicitante: "empresa",
  rutEmpresa: "",
  razonSocial: "",
  giroEmpresa: "",
  rutVerificado: false,
  escuela: "",
  carrera: "",
  sede: "",
  actividadAnteriorId: "",
  nombreActividad: "",
  tipo: "Proyecto",
  descripcion: "",
  origen: "Interna",
  responsable: "",
  contraparteExterna: "",
  objetivoGeneral: "",
  objetivoEspecifico: "",
  fecha: "",
  fechaTerminoTentativa: "",
  horaInicio: "",
  horaTermino: "",
  ubicacion: "",
  evidencia: null,
  aceptaTerminos: false,
};

function normalizeRut(value) {
  return value.replace(/[^0-9kK]/g, "").toUpperCase();
}

function formatRut(value) {
  const cleanRut = normalizeRut(value).slice(0, 9);

  if (cleanRut.length <= 1) {
    return cleanRut;
  }

  const cuerpo = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${cuerpoFormateado}-${dv}`;
}

function calculateRutDv(cuerpo) {
  let suma = 0;
  let multiplo = 2;

  for (let index = cuerpo.length - 1; index >= 0; index -= 1) {
    suma += Number(cuerpo[index]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resultado = 11 - (suma % 11);
  if (resultado === 11) return "0";
  if (resultado === 10) return "K";
  return String(resultado);
}

function isValidRut(value) {
  const cleanRut = normalizeRut(value);
  if (cleanRut.length < 2) return false;

  const cuerpo = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  return /^\d+$/.test(cuerpo) && calculateRutDv(cuerpo) === dv;
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-sm font-bold text-neutral-950">
      {children} {required && <span className="text-red-600">*</span>}
    </label>
  );
}

function Section({ number, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5b400] text-sm font-extrabold text-neutral-950">
          {number}
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-950">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function TextInput({ label, value, onChange, placeholder, required, type = "text", icon, min, max, readOnly }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-neutral-500">{icon}</div>}
        <input
          min={min}
          max={max}
          readOnly={readOnly}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30 ${icon ? "pl-10" : ""} ${readOnly ? "bg-neutral-100 font-bold" : ""}`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder, required, disabled }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-lg border border-neutral-300 bg-white px-4 pr-10 text-sm text-neutral-800 outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30 disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const activity = actividadesAnteriores.find((item) => item.id === option);
            return (
              <option key={option} value={option}>
                {activity ? activity.nombre : option}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-neutral-500" />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, required, rows = 4, maxLength }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel required={required}>{label}</FieldLabel>
        {maxLength && (
          <span className="mb-2 text-xs font-semibold text-neutral-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
      />
    </div>
  );
}

function ErrorText({ children = "Campo obligatorio." }) {
  return <p className="mt-1 text-xs font-semibold text-red-600">{children}</p>;
}

function SummaryItem({ icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3">
      <div className="mt-0.5 text-[#b68400]">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">{label}</p>
        <p className="truncate text-sm font-bold text-neutral-950">{value || "Pendiente"}</p>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-semibold text-neutral-900">{value || "No informado"}</p>
    </div>
  );
}

function ReviewModal({ form, isEmpresa, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b68400]">Revisión previa</p>
            <h2 className="mt-1 text-2xl font-black text-neutral-950">Confirmar datos del registro</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Revisa la información antes de enviar la propuesta a revisión.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-170px)] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ReviewRow label="Tipo de solicitante" value={isEmpresa ? "Empresa / contraparte externa" : "Usuario Duoc UC"} />
            {isEmpresa ? (
              <>
                <ReviewRow label="RUT empresa" value={form.rutEmpresa} />
                <ReviewRow label="Razón social" value={form.razonSocial} />
                <ReviewRow label="Giro" value={form.giroEmpresa} />
              </>
            ) : (
              <>
                <ReviewRow label="Escuela" value={form.escuela} />
                <ReviewRow label="Carrera" value={form.carrera} />
                <ReviewRow label="Sede" value={form.sede} />
              </>
            )}
            <ReviewRow label="Nombre actividad" value={form.nombreActividad} />
            <ReviewRow label="Tipo" value={form.tipo} />
            <ReviewRow label="Responsable" value={form.responsable} />
            {!isEmpresa && <ReviewRow label="Contraparte externa" value={form.contraparteExterna} />}
            <ReviewRow label={isEmpresa ? "Fecha tentativa de término" : "Fecha"} value={isEmpresa ? form.fechaTerminoTentativa : form.fecha} />
            {!isEmpresa && <ReviewRow label="Horario" value={form.horaInicio && form.horaTermino ? `${form.horaInicio} a ${form.horaTermino}` : ""} />}
            {!isEmpresa && <ReviewRow label="Ubicación" value={form.ubicacion} />}
            <ReviewRow label="Evidencia" value={form.evidencia?.name || "Sin archivo adjunto"} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <ReviewRow label="Descripción" value={form.descripcion} />
            <ReviewRow label="Objetivo general" value={form.objetivoGeneral} />
            <ReviewRow label="Objetivo específico" value={form.objetivoEspecifico} />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100">
            Volver a editar
          </button>
          <button type="button" onClick={onConfirm} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-7 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]">
            <Send className="h-5 w-5" />
            Confirmar envío
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormularioActividad() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [siiLoading, setSiiLoading] = useState(false);

  const isEmpresa = form.tipoSolicitante === "empresa";

  const carrerasDisponibles = useMemo(() => {
    if (!form.escuela) return [];
    return carrerasPorEscuela[form.escuela] ?? [];
  }, [form.escuela]);

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "tipoSolicitante") {
        if (value === "empresa") {
          next.tipo = "Proyecto";
          next.origen = "Externa";
          next.escuela = "";
          next.carrera = "";
          next.sede = "";
          next.actividadAnteriorId = "";
          next.horaInicio = "";
          next.horaTermino = "";
          next.ubicacion = "";
        } else {
          next.rutEmpresa = "";
          next.razonSocial = "";
          next.giroEmpresa = "";
          next.rutVerificado = false;
          next.tipo = "";
          next.fechaTerminoTentativa = "";
        }
      }

      if (field === "escuela") next.carrera = "";
      if (field === "rutEmpresa") {
        next.razonSocial = "";
        next.giroEmpresa = "";
        next.rutVerificado = false;
      }
      if (field === "origen" && value === "Interna") next.contraparteExterna = "";

      return next;
    });
    setStatus(null);
  };

  const handleVerifyRut = async () => {
    const rut = normalizeRut(form.rutEmpresa);

    if (!rut) {
      setForm((prev) => ({ ...prev, razonSocial: "", giroEmpresa: "", rutVerificado: false }));
      setStatus({
        type: "error",
        message: "Ingresa un RUT de empresa antes de verificar.",
      });
      return;
    }

    if (!isValidRut(rut)) {
      setForm((prev) => ({ ...prev, razonSocial: "", giroEmpresa: "", rutVerificado: false }));
      setStatus({
        type: "error",
        message: "El RUT ingresado no es válido según su dígito verificador.",
      });
      return;
    }

    setSiiLoading(true);
    setStatus({ type: "draft", message: "Consultando datos tributarios públicos..." });

    try {
      const company = await fetchCompanyFromSii(rut);

      setForm((prev) => ({
        ...prev,
        rutEmpresa: company.rut,
        razonSocial: company.razonSocial,
        giroEmpresa: company.giroEmpresa || "",
        rutVerificado: true,
        contraparteExterna: company.razonSocial,
        origen: "Externa",
        tipo: "Proyecto",
      }));

      setStatus({
        type: "success",
        message: `Empresa verificada correctamente desde ${company.fuente || "SII"}.`,
      });
    } catch (error) {
      setForm((prev) => ({ ...prev, razonSocial: "", giroEmpresa: "", rutVerificado: false }));
      setStatus({
        type: "error",
        message: error.message || "No fue posible verificar el RUT en este momento.",
      });
    } finally {
      setSiiLoading(false);
    }
  };

  const handlePreviousActivityChange = (activityId) => {
    if (!activityId) {
      update("actividadAnteriorId", "");
      return;
    }

    const activity = actividadesAnteriores.find((item) => item.id === activityId);
    if (!activity) return;

    setForm((prev) => ({
      ...prev,
      actividadAnteriorId: activity.id,
      escuela: activity.escuela,
      carrera: activity.carrera,
      sede: activity.sede,
      nombreActividad: activity.nombre,
      tipo: activity.tipo,
      descripcion: activity.descripcion,
      origen: activity.origen,
      responsable: activity.responsable,
      contraparteExterna: activity.contraparteExterna,
      objetivoGeneral: activity.objetivoGeneral,
      objetivoEspecifico: activity.objetivoEspecifico,
      ubicacion: activity.ubicacion,
      fecha: "",
      horaInicio: "",
      horaTermino: "",
      evidencia: null,
    }));

    setStatus({
      type: "success",
      message: "Actividad anterior cargada. Revisa los datos y completa la planificación para este nuevo registro.",
    });
  };

  const requiresExternalCounterpart = !isEmpresa && (form.origen === "Externa" || form.origen === "Mixta");

  const requiredFields = isEmpresa
    ? [
        "rutEmpresa",
        "razonSocial",
        "nombreActividad",
        "tipo",
        "descripcion",
        "responsable",
        "objetivoGeneral",
        "objetivoEspecifico",
        "fechaTerminoTentativa",
      ]
    : [
        "escuela",
        "carrera",
        "sede",
        "nombreActividad",
        "tipo",
        "descripcion",
        "origen",
        "responsable",
        "objetivoGeneral",
        "objetivoEspecifico",
        "fecha",
        "horaInicio",
        "horaTermino",
        "ubicacion",
      ];

  const missingFields = requiredFields.filter((field) => !String(form[field] ?? "").trim());
  const completedFields = requiredFields.length - missingFields.length;
  const hasError = (field) => showErrors && missingFields.includes(field);

  const timeIsInvalid = !isEmpresa && Boolean(form.horaInicio && form.horaTermino && form.horaTermino <= form.horaInicio);

  const handleAIGenerateObjectives = () => {
    setAiLoading(true);
    setStatus({ type: "draft", message: "IA simulada generando objetivos según la información ingresada..." });

    window.setTimeout(() => {
      const actividad = form.nombreActividad || "el proyecto propuesto";
      const contexto = isEmpresa ? form.razonSocial || "la empresa solicitante" : form.carrera || form.escuela || "la comunidad académica";

      setForm((prev) => ({
        ...prev,
        objetivoGeneral: `Vincular a estudiantes con ${contexto} mediante ${actividad}, promoviendo una experiencia aplicada que permita resolver una necesidad real o fortalecer aprendizajes vinculados al entorno.`,
        objetivoEspecifico: `1. Comprender el contexto y necesidad asociada a la propuesta.
2. Aplicar conocimientos disciplinares en una experiencia práctica o proyecto real.
3. Generar una instancia de vinculación entre la comunidad académica y la contraparte participante.`,
      }));

      setAiLoading(false);
      setStatus({ type: "success", message: "Objetivos generados automáticamente en modo demostración. Puedes editarlos manualmente." });
    }, 900);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowErrors(true);

    if (missingFields.length > 0 || !form.aceptaTerminos) {
      setStatus({
        type: "error",
        message:
          "Faltan campos obligatorios o debes aceptar los términos y condiciones antes de enviar.",
      });
      return;
    }

    if (isEmpresa && !form.rutVerificado) {
      setStatus({ type: "error", message: "Debes verificar el RUT de la empresa antes de enviar el formulario." });
      return;
    }

    if (timeIsInvalid) {
      setStatus({ type: "error", message: "La hora de término debe ser posterior a la hora de inicio." });
      return;
    }

    setShowReview(true);
  };

  const handleConfirmSubmit = () => {
    const newActivity = {
      id: crypto.randomUUID(),
      tipoSolicitante: form.tipoSolicitante,
      rutEmpresa: isEmpresa ? form.rutEmpresa : "",
      razonSocial: isEmpresa ? form.razonSocial : "",
      giroEmpresa: isEmpresa ? form.giroEmpresa : "",
      nombreActividad: form.nombreActividad,
      escuela: isEmpresa ? "Por asignar por encargado" : form.escuela,
      carrera: isEmpresa ? "Por asignar por encargado" : form.carrera,
      sede: isEmpresa ? "Por asignar" : form.sede,
      fecha: isEmpresa ? form.fechaTerminoTentativa : form.fecha,
      fechaTerminoTentativa: isEmpresa ? form.fechaTerminoTentativa : "",
      horaInicio: isEmpresa ? "" : form.horaInicio,
      horaTermino: isEmpresa ? "" : form.horaTermino,
      ubicacion: isEmpresa ? "Por definir" : form.ubicacion,
      alumnosParticipantes: "",
      estado: "Pendiente de revisión",
      tipo: isEmpresa ? "Proyecto" : form.tipo,
      origen: isEmpresa ? "Externa" : form.origen,
      descripcion: form.descripcion,
      responsable: form.responsable,
      contraparteExterna: isEmpresa ? form.razonSocial : form.contraparteExterna,
      objetivoGeneral: form.objetivoGeneral,
      objetivoEspecifico: form.objetivoEspecifico,
      evidenciaNombre: form.evidencia?.name || "",
      evidenciaSize: form.evidencia?.size || 0,
      enviadoEn: new Date().toISOString(),
      historial: [
        {
          fecha: new Date().toISOString(),
          accion: isEmpresa ? "Proyecto enviado por empresa a revisión" : "Actividad enviada por usuario Duoc a revisión",
          usuario: isEmpresa ? form.razonSocial : "Usuario Duoc",
        },
      ],
    };

    const savedActivities = JSON.parse(localStorage.getItem("registeredActivities") || "[]");
    localStorage.setItem("registeredActivities", JSON.stringify([newActivity, ...savedActivities]));

    setShowReview(false);
    setStatus({
      type: "success",
      message: "Registro enviado correctamente. Quedó pendiente de revisión por la persona encargada.",
    });
    setForm(initialForm);
    setShowErrors(false);
  };

  const handleSaveDraft = () => {
    setStatus({ type: "draft", message: "Borrador guardado para pruebas. En producción se almacenaría con estado pendiente." });
  };

  const handleReset = () => {
    setForm(initialForm);
    setStatus(null);
    setShowErrors(false);
  };

  const totalRequiredItems = requiredFields.length + 1;
  const completedRequiredItems = completedFields + (form.aceptaTerminos ? 1 : 0);
  const progressPercent = Math.round((completedRequiredItems / totalRequiredItems) * 100);

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-neutral-950">
      <header className="border-b-2 border-[#f5b400] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-3xl font-black tracking-tight">
            <span className="text-[#f5b400]">Duoc</span>
            <span className="text-neutral-950">UC</span>
          </div>

          <nav className="hidden items-center gap-3 text-sm font-bold sm:flex">
            <Link to="/formulario" className="rounded-xl bg-[#f5b400] px-4 py-2 text-neutral-950">
              Registro de actividad
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 hover:bg-neutral-100" aria-label="Notificaciones">
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-1 hover:bg-neutral-100" aria-label="Usuario">
              <UserCircle className="h-7 w-7" />
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-9">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#b68400]">Registro institucional</p>
            <h1 className="text-4xl font-black tracking-tight text-neutral-950">Formulario de Proyecto o Actividad</h1>
            <p className="mt-2 text-base text-neutral-500">
              Permite registrar propuestas desde empresas externas o desde equipos internos de Duoc UC.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:w-80">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-neutral-950">Avance del formulario</span>
              <span className="font-extrabold text-neutral-950">{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full rounded-full bg-[#f5b400] transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              {completedRequiredItems} de {totalRequiredItems} requisitos obligatorios completados.
            </p>
          </div>
        </div>

        {status && (
          <div
            className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm shadow-sm ${
              status.type === "success"
                ? "border-green-200 bg-green-50 text-green-900"
                : status.type === "error"
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-neutral-200 bg-white text-neutral-800"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" /> : <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />}
            <p className="font-semibold">{status.message}</p>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Section
              number="1"
              title={isEmpresa ? "Identificación de Empresa" : "Información Académica"}
              subtitle={
                isEmpresa
                  ? "Verifica el RUT de la empresa para completar automáticamente su razón social con datos tributarios públicos."
                  : "Datos base para relacionar la actividad con una escuela, carrera y sede específica."
              }
            >
              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => update("tipoSolicitante", "empresa")}
                  className={`rounded-2xl border p-4 text-left transition ${isEmpresa ? "border-[#f5b400] bg-[#fff8df]" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                >
                  <p className="text-sm font-black text-neutral-950">Empresa / contraparte externa</p>
                  <p className="mt-1 text-sm text-neutral-500">La propuesta queda como proyecto para revisión interna.</p>
                </button>
                <button
                  type="button"
                  onClick={() => update("tipoSolicitante", "duoc")}
                  className={`rounded-2xl border p-4 text-left transition ${!isEmpresa ? "border-[#f5b400] bg-[#fff8df]" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                >
                  <p className="text-sm font-black text-neutral-950">Usuario Duoc UC</p>
                  <p className="mt-1 text-sm text-neutral-500">Mantiene el flujo académico con escuela, carrera y sede.</p>
                </button>
              </div>

              {isEmpresa ? (
                <div className="space-y-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                      <TextInput
                        label="RUT Empresa"
                        required
                        value={form.rutEmpresa}
                        onChange={(value) => update("rutEmpresa", formatRut(value))}
                        placeholder="Ej: 76.123.456-7"
                      />
                      {hasError("rutEmpresa") && <ErrorText />}
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyRut}
                      disabled={siiLoading}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-extrabold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <SearchCheck className="h-5 w-5 text-[#f5b400]" />
                      {siiLoading ? "Verificando..." : "Verificar RUT"}
                    </button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <TextInput
                        label="Nombre / Razón Social"
                        required
                        readOnly
                        value={form.razonSocial}
                        onChange={() => {}}
                        placeholder="Se completará al verificar el RUT"
                      />
                      {hasError("razonSocial") && <ErrorText>Debes verificar un RUT válido de empresa.</ErrorText>}
                    </div>
                    <TextInput
                      label="Giro asociado"
                      readOnly
                      value={form.giroEmpresa}
                      onChange={() => {}}
                      placeholder="Se completará si la fuente entrega actividad o referencia tributaria"
                    />
                  </div>

                  <div className="rounded-2xl border border-[#f5b400]/40 bg-[#fff8df] p-4 text-sm text-neutral-700">
                    <p className="font-black text-neutral-950">Validación tributaria</p>
                    <p className="mt-1">Puedes ingresar el RUT con o sin puntos. El sistema valida el dígito verificador y consulta datos públicos antes de permitir el envío.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <SelectField
                      label="Escuela"
                      required
                      value={form.escuela}
                      onChange={(value) => update("escuela", value)}
                      options={escuelas}
                      placeholder="Seleccione una escuela"
                    />
                    {hasError("escuela") && <ErrorText />}
                  </div>
                  <div>
                    <SelectField
                      label="Carrera"
                      required
                      value={form.carrera}
                      onChange={(value) => update("carrera", value)}
                      options={carrerasDisponibles}
                      placeholder={form.escuela ? "Seleccione una carrera" : "Primero seleccione escuela"}
                      disabled={!form.escuela}
                    />
                    {hasError("carrera") && <ErrorText />}
                  </div>
                  <div>
                    <SelectField
                      label="Sede"
                      required
                      value={form.sede}
                      onChange={(value) => update("sede", value)}
                      options={sedes}
                      placeholder="Seleccione una sede"
                    />
                    {hasError("sede") && <ErrorText />}
                  </div>
                </div>
              )}
            </Section>

            <Section
              number="2"
              title="Datos de la Actividad"
              subtitle={isEmpresa ? "Describe el proyecto que la empresa desea proponer a Duoc UC." : "Información descriptiva que permite clasificar y comprender la actividad."}
            >
              {!isEmpresa && (
                <div className="mb-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <SelectField
                      label="Actividad registrada anteriormente"
                      value={form.actividadAnteriorId}
                      onChange={handlePreviousActivityChange}
                      options={actividadesAnteriores.map((activity) => activity.id)}
                      placeholder="Seleccione una actividad para autocompletar datos"
                    />
                    <button
                      type="button"
                      onClick={() => handlePreviousActivityChange("")}
                      className="h-12 rounded-lg border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
                    >
                      No reutilizar
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    Este campo solo está disponible para usuarios Duoc UC.
                  </p>
                </div>
              )}

              <div className="grid gap-5 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <TextInput
                    label="Nombre Actividad"
                    required
                    value={form.nombreActividad}
                    onChange={(value) => update("nombreActividad", value)}
                    placeholder={isEmpresa ? "Ej: Proyecto de mejora de sistema interno" : "Ej: Charla de innovación con empresa tecnológica"}
                  />
                  {hasError("nombreActividad") && <ErrorText />}
                </div>

                <div className="lg:col-span-5">
                  {isEmpresa ? (
                    <TextInput label="Tipo" required readOnly value="Proyecto" onChange={() => {}} />
                  ) : (
                    <SelectField
                      label="Tipo"
                      required
                      value={form.tipo}
                      onChange={(value) => update("tipo", value)}
                      options={tiposActividad}
                      placeholder="Seleccione un tipo"
                    />
                  )}
                  {hasError("tipo") && <ErrorText />}
                </div>

                {!isEmpresa && (
                  <div className="lg:col-span-6">
                    <FieldLabel required>Origen</FieldLabel>
                    <div className="grid gap-3 rounded-lg border border-neutral-200 p-3 sm:grid-cols-3">
                      {["Interna", "Externa", "Mixta"].map((option) => (
                        <label key={option} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-neutral-800">
                          <input
                            type="radio"
                            name="origen"
                            value={option}
                            checked={form.origen === option}
                            onChange={() => update("origen", option)}
                            className="h-4 w-4 accent-[#f5b400]"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className={isEmpresa ? "lg:col-span-12" : "lg:col-span-6"}>
                  <TextInput
                    label={isEmpresa ? "Responsable del proyecto en la empresa" : "Responsable"}
                    required
                    value={form.responsable}
                    onChange={(value) => update("responsable", value)}
                    placeholder={isEmpresa ? "Ingrese nombre del contacto responsable" : "Ingrese nombre del responsable interno"}
                  />
                  {hasError("responsable") && <ErrorText />}
                </div>

                {requiresExternalCounterpart && (
                  <div className="lg:col-span-6">
                    <TextInput
                      label="Contraparte Externa"
                      value={form.contraparteExterna}
                      onChange={(value) => update("contraparteExterna", value)}
                      placeholder="Opcional: empresa, fundación, municipalidad u organización"
                    />
                    <p className="mt-1 text-xs font-semibold text-neutral-500">
                      Campo opcional para usuarios Duoc UC.
                    </p>
                  </div>
                )}

                <div className="lg:col-span-12">
                  <TextArea
                    label="Descripción"
                    required
                    rows={4}
                    maxLength={900}
                    value={form.descripcion}
                    onChange={(value) => update("descripcion", value)}
                    placeholder={isEmpresa ? "Describa el problema, necesidad o proyecto que desea proponer a Duoc UC." : "Describa brevemente la actividad, su propósito, participantes y alcance esperado."}
                  />
                  {hasError("descripcion") && <ErrorText />}
                </div>
              </div>
            </Section>

            <Section number="3" title="Objetivos" subtitle="Define qué busca lograr la propuesta y qué resultados concretos se esperan.">
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#f5b400]/40 bg-[#fff8df] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-neutral-950">Asistente de redacción con IA</p>
                  <p className="text-sm text-neutral-600">Simula la generación automática de objetivos usando los datos ya ingresados.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAIGenerateObjectives}
                  disabled={aiLoading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-extrabold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Sparkles className="h-5 w-5 text-[#f5b400]" />
                  {aiLoading ? "Generando..." : "Generar con IA"}
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <TextArea
                    label="Objetivo General"
                    required
                    maxLength={600}
                    value={form.objetivoGeneral}
                    onChange={(value) => update("objetivoGeneral", value)}
                    placeholder="Ej: Fortalecer la vinculación entre estudiantes y el sector productivo mediante una experiencia práctica."
                  />
                  {hasError("objetivoGeneral") && <ErrorText />}
                </div>
                <div>
                  <TextArea
                    label="Objetivo Específico"
                    required
                    maxLength={700}
                    value={form.objetivoEspecifico}
                    onChange={(value) => update("objetivoEspecifico", value)}
                    placeholder="Ej: Identificar oportunidades de colaboración, aplicar conocimientos técnicos y generar evidencia de aprendizaje."
                  />
                  {hasError("objetivoEspecifico") && <ErrorText />}
                </div>
              </div>
            </Section>

            <Section
              number="4"
              title="Planificación"
              subtitle={isEmpresa ? "La empresa solo informa la fecha tentativa de término del proyecto." : "Permite coordinar fecha, horario y lugar de ejecución de la actividad."}
            >
              {isEmpresa ? (
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <TextInput
                      label="Fecha tentativa de término del proyecto"
                      required
                      type="date"
                      value={form.fechaTerminoTentativa}
                      onChange={(value) => update("fechaTerminoTentativa", value)}
                      icon={<Calendar className="h-5 w-5" />}
                    />
                    {hasError("fechaTerminoTentativa") && <ErrorText />}
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-sm font-black text-neutral-950">Importante</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      La fecha indicada es tentativa. La planificación detallada, horarios, cupos y sede serán definidos posteriormente por el encargado y los docentes interesados.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-12">
                  <div className="lg:col-span-3">
                    <TextInput
                      label="Fecha"
                      required
                      type="date"
                      value={form.fecha}
                      onChange={(value) => update("fecha", value)}
                      icon={<Calendar className="h-5 w-5" />}
                    />
                    {hasError("fecha") && <ErrorText />}
                  </div>
                  <div className="lg:col-span-4">
                    <FieldLabel required>Horario</FieldLabel>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={form.horaInicio}
                        onChange={(event) => update("horaInicio", event.target.value)}
                        className="h-12 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
                      />
                      <input
                        type="time"
                        value={form.horaTermino}
                        onChange={(event) => update("horaTermino", event.target.value)}
                        className="h-12 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
                      />
                    </div>
                    {(hasError("horaInicio") || hasError("horaTermino")) && <ErrorText>Debe indicar hora de inicio y término.</ErrorText>}
                    {showErrors && timeIsInvalid && <ErrorText>La hora de término debe ser posterior a la de inicio.</ErrorText>}
                  </div>
                  <div className="lg:col-span-5">
                    <TextInput
                      label="Ubicación"
                      required
                      value={form.ubicacion}
                      onChange={(value) => update("ubicacion", value)}
                      placeholder="Ej: Auditorio sede Maipú / Sala B203 / Online"
                    />
                    {hasError("ubicacion") && <ErrorText />}
                  </div>
                </div>
              )}
            </Section>

            <Section number="5" title="Evidencia" subtitle="Adjunta documentos de respaldo, brief, requerimientos, invitaciones o material relacionado.">
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center transition hover:border-[#f5b400] hover:bg-[#fff8df]">
                <FileUp className="mb-3 h-10 w-10 text-neutral-700" />
                <span className="text-base font-black text-neutral-950">Adjuntar evidencia</span>
                <span className="text-sm text-neutral-500">PDF, imagen o documento</span>
                <span className="mt-4 rounded-lg border border-neutral-300 bg-white px-5 py-2 text-sm font-bold text-neutral-950 shadow-sm">Seleccionar archivo</span>
                <input type="file" className="hidden" onChange={(event) => update("evidencia", event.target.files?.[0] ?? null)} />
              </label>
              <div className="mt-2 flex flex-col gap-1 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
                <p>Tamaño máximo sugerido por archivo: 20 MB.</p>
                <p>{form.evidencia ? `Archivo seleccionado: ${form.evidencia.name}` : "No se ha seleccionado archivo."}</p>
              </div>
            </Section>

            <div className="flex flex-col-reverse gap-3 pb-10 sm:flex-row sm:justify-end">
              <button type="button" onClick={handleReset} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100">
                <RotateCcw className="h-5 w-5" />
                Limpiar
              </button>
              <button type="button" onClick={handleSaveDraft} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white px-6 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100">
                <Save className="h-5 w-5" />
                Guardar borrador
              </button>
              <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-7 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]">
                <Send className="h-5 w-5" />
                Enviar a revisión
              </button>
            </div>
          </form>

          <aside className="h-fit space-y-4 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-5 text-white shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-[#f5b400]" />
                <div>
                  <h3 className="text-lg font-black">Resumen</h3>
                  <p className="text-sm text-neutral-300">Vista rápida antes del envío.</p>
                </div>
              </div>
              <div className="space-y-3">
                <SummaryItem icon={<Building2 className="h-5 w-5" />} label="Solicitante" value={isEmpresa ? form.razonSocial : form.escuela} />
                <SummaryItem icon={<FileText className="h-5 w-5" />} label="Proyecto / Actividad" value={form.nombreActividad} />
                <SummaryItem icon={<Calendar className="h-5 w-5" />} label={isEmpresa ? "Término tentativo" : "Fecha"} value={isEmpresa ? form.fechaTerminoTentativa : form.fecha} />
                <SummaryItem icon={<UserCircle className="h-5 w-5" />} label="Responsable" value={form.responsable} />
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-black text-neutral-950">
                Términos y condiciones
              </h3>

              <div className="max-h-44 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
                <p>
                  Al enviar este formulario, la empresa o usuario declara que la información
                  registrada es verídica y que la propuesta será revisada por la persona
                  encargada antes de ser publicada o vinculada con docentes.
                </p>

                <p className="mt-3">
                  El envío de esta solicitud no garantiza la aprobación automática del
                  proyecto o actividad. Duoc UC podrá observar, solicitar ajustes, rechazar
                  o aprobar la propuesta según su pertinencia académica, disponibilidad y
                  criterios institucionales.
                </p>

                <p className="mt-3">
                  En caso de adjuntar documentos, estos serán utilizados únicamente como
                  respaldo para la evaluación de la propuesta dentro del flujo de vinculación.
                </p>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:bg-neutral-50">
                <input
                  type="checkbox"
                  checked={form.aceptaTerminos}
                  onChange={(event) => update("aceptaTerminos", event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#f5b400]"
                />
                <span className="text-sm font-semibold leading-6 text-neutral-700">
                  Acepto los términos y condiciones para enviar esta propuesta a revisión.
                </span>
              </label>

              {showErrors && !form.aceptaTerminos && (
                <p className="mt-2 text-xs font-semibold text-red-600">
                  Debes aceptar los términos y condiciones antes de enviar.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {showReview && <ReviewModal form={form} isEmpresa={isEmpresa} onClose={() => setShowReview(false)} onConfirm={handleConfirmSubmit} />}
    </main>
  );
}
