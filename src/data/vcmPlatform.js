export const roles = {
  admin: {
    label: "Administrador",
    short: "ADM",
    route: "/dashboard",
    description: "Supervisa todas las vistas, estados y correcciones del flujo.",
  },
  vcm: {
    label: "Validador",
    short: "VAL",
    route: "/dashboard",
    description: "Revisa, valida y gestiona propuestas desde su panel operativo.",
  },
  ee: {
    label: "Socio formador",
    short: "SF",
    route: "/formulario",
    description: "Revisa propuestas, entrega V°B°, valida hitos y revisa cierre.",
  },
  jc: {
    label: "Director de carrera",
    short: "DIR",
    route: "/director-proyectos",
    description: "Consulta proyectos de su escuela, filtra estados y exporta reportes.",
  },
  docente: {
    label: "Docente",
    short: "DOC",
    route: "/catalogo-docente",
    description: "Toma proyectos, registra estudiantes, hitos, evidencias y cierre.",
  },
};

export const roleStyles = {
  admin: "border-neutral-800 bg-neutral-950 text-white",
  vcm: "border-[#185FA5] bg-[#E6F1FB] text-[#042C53]",
  ee: "border-[#993C1D] bg-[#FAECE7] text-[#4A1B0C]",
  jc: "border-[#3B6D11] bg-[#EAF3DE] text-[#173404]",
  docente: "border-[#534AB7] bg-[#EEEDFE] text-[#26215C]",
  sis: "border-[#5F5E5A] bg-[#F1EFE8] text-[#2C2C2A]",
};

export const projectStatuses = [
  "Borrador",
  "En revisión por Socio formador",
  "Correcciones solicitadas por Validador",
  "Aprobada por Validador",
  "Con observaciones de Socio formador",
  "Aprobada por Socio formador",
  "Asignada a Escuela / Carrera / Sede / Director de carrera",
  "Asignada a asignatura",
  "Disponible para docentes",
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

export const statusMeta = {
  Borrador: { tone: "neutral", description: "Propuesta creada, aún no enviada al Socio formador." },
  "En revisión por Socio formador": { tone: "warning", description: "Propuesta enviada a revisión del Socio formador." },
  "Correcciones solicitadas por Validador": { tone: "danger", description: "El Validador solicitó ajustes antes de aceptar la propuesta." },
  "Aprobada por Validador": { tone: "success", description: "El Validador aceptó la propuesta para continuar el flujo interno." },
  "Con observaciones de Socio formador": { tone: "danger", description: "El Socio formador solicitó ajustes." },
  "Aprobada por Socio formador": { tone: "success", description: "El Socio formador entregó V°B°." },
  "Asignada a Escuela / Carrera / Sede / Director de carrera": { tone: "info", description: "El Validador asignó la propuesta internamente." },
  "Asignada a asignatura": { tone: "info", description: "El Director de carrera vinculó asignatura, sección y semestre." },
  "Disponible para docentes": { tone: "success", description: "Visible en catálogo docente." },
  "Postulada / Tomada por docente": { tone: "warning", description: "Un docente tomó el proyecto y registró ejecución inicial." },
  "En revisión VCM": { tone: "warning", description: "El Validador debe revisar una postulación o solicitud." },
  "Proyecto en ejecución": { tone: "success", description: "Proyecto aprobado para ejecución." },
  "Hito registrado": { tone: "warning", description: "Hito enviado a validación del Socio formador." },
  "Hito observado": { tone: "danger", description: "El Socio formador registró observaciones sobre el hito." },
  "Hito aprobado": { tone: "success", description: "El Socio formador validó el hito." },
  "En cierre": { tone: "warning", description: "Docente solicitó cierre o el Socio formador aprobó resultado final." },
  "Cierre observado": { tone: "danger", description: "El Socio formador solicitó evidencias finales adicionales." },
  "Finalizado exitosamente": { tone: "success", description: "El Validador validó cierre administrativo." },
  "Publicado como proyecto realizado": { tone: "success", description: "Disponible en repositorio de experiencias realizadas." },
  Cancelado: { tone: "danger", description: "Proyecto detenido antes de finalizar." },
  Rechazado: { tone: "danger", description: "Propuesta o postulación rechazada definitivamente." },
};

export const entityTypes = ["Empresa", "Fundación", "Institución pública", "Comunidad", "ONG", "Otra"];
export const sedes = ["Alameda", "Antonio Varas", "Concepción", "Maipú", "Plaza Norte", "Puente Alto", "San Bernardo", "San Carlos de Apoquindo", "Valparaíso", "Viña del Mar", "Online"];
export const escuelas = ["Administración y Negocios", "Comunicación", "Construcción", "Diseño", "Gastronomía", "Informática y Telecomunicaciones", "Ingeniería y Recursos Naturales", "Salud y Bienestar", "Turismo y Hospitalidad"];
export const carreras = ["Analista Programador", "Ingeniería en Informática", "Administración de Empresas", "Diseño Gráfico", "Gastronomía Internacional", "Técnico en Enfermería", "Turismo y Hotelería"];
export const asignaturas = ["Proyecto de Integración", "Taller de Vinculación con el Medio", "Innovación Aplicada", "Levantamiento de Requerimientos", "Seminario de Especialidad"];
export const semestres = ["2026-1", "2026-2", "2027-1"];
export const modalidades = ["Presencial", "Híbrido", "Online"];

export const demoUsers = [
  { role: "admin", email: "admin@duoc.cl", password: "demo123", name: "Administradora Demo" },
  { role: "vcm", email: "vcm@duoc.cl", password: "demo123", name: "Validadora Demo" },
  { role: "ee", email: "socio@demo.cl", password: "demo123", name: "Socio formador" },
  {
    role: "jc",
    email: "jc@duoc.cl",
    password: "demo123",
    name: "Andrés Rojas",
    school: "Informática y Telecomunicaciones",
    careers: ["Ingeniería en Informática"],
    subjects: ["Proyecto de Integración", "Levantamiento de Requerimientos"],
  },
  { role: "docente", email: "docente@duoc.cl", password: "demo123", name: "Docente Demo" },
];

const adminNavigation = [
  { label: "Administrador", to: "/dashboard", active: "dashboard" },
  { label: "Vista director", to: "/director-proyectos", active: "director-proyectos" },
  { label: "Formulario", to: "/formulario", active: "formulario" },
  { label: "Portal socio formador", to: "/portal-entidad", active: "entidad" },
  { label: "Solicitudes socio formador", to: "/solicitudes-entidad", active: "solicitudes-entidad" },
  { label: "Toma proyectos", to: "/catalogo-docente", active: "docente" },
  { label: "Mis solicitudes", to: "/mis-solicitudes-docente", active: "mis-solicitudes-docente" },
];

const directorNavigation = [
  { label: "Proyectos escuela", to: "/director-proyectos", active: "director-proyectos" },
];

export const roleNavigation = {
  admin: adminNavigation,
  vcm: [
    { label: "Panel validador", to: "/dashboard", active: "dashboard" },
    { label: "Formulario", to: "/formulario", active: "formulario" },
  ],
  jc: directorNavigation,
  ee: [
    { label: "Formulario", to: "/formulario", active: "formulario" },
    { label: "Portal socio formador", to: "/portal-entidad", active: "entidad" },
    { label: "Mis solicitudes", to: "/solicitudes-entidad", active: "solicitudes-entidad" },
  ],
  docente: [
    { label: "Toma proyectos", to: "/catalogo-docente", active: "docente" },
    { label: "Formulario", to: "/formulario", active: "formulario" },
    { label: "Mis solicitudes", to: "/mis-solicitudes-docente", active: "mis-solicitudes-docente" },
  ],
};

export const routeAccess = {
  "/dashboard": ["admin", "vcm"],
  "/director-proyectos": ["admin", "jc"],
  "/formulario": ["admin", "vcm", "ee", "docente"],
  "/portal-entidad": ["admin", "ee"],
  "/solicitudes-entidad": ["admin", "ee"],
  "/catalogo-docente": ["admin", "docente"],
  "/actividades-aprobadas": ["admin", "docente"],
  "/mis-solicitudes-docente": ["admin", "docente"],
};

export function getNavigationForRole(role) {
  return roleNavigation[role] || [];
}

export function getRoleHome(role) {
  return roles[role]?.route || "/login";
}

export function canAccessRoute(role, pathname) {
  const allowedRoles = routeAccess[pathname];
  if (!allowedRoles) return true;
  return allowedRoles.includes(role);
}

const STORAGE_KEYS = {
  entities: "vcmEntities",
  projects: "vcmProjects",
  session: "vcmSession",
  version: "vcmDataVersion",
};

const DATA_VERSION = "vcm-rich-demo-projects-v2";

const now = () => new Date().toISOString();

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}`;
}

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function readCollection(key, fallback) {
  if (!canUseStorage()) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeCollection(key, value) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function projectMatchesDirectorScope(project, session) {
  if (!project || session?.role !== "jc") return true;

  const assignment = project.assignment || {};
  const schoolMatches = normalize(assignment.school) === normalize(session.school);
  const careerMatches = (session.careers || [session.career]).filter(Boolean).some((career) => normalize(career) === normalize(assignment.career));
  const subjectMatches = (session.subjects || []).some((subject) => normalize(subject) === normalize(assignment.subject));
  const leadMatches = normalize(assignment.careerLead) === normalize(session.name);
  const createdByMatches = normalize(project.createdBy) === normalize(session.name);

  return createdByMatches || (Boolean(project.assignment) && (leadMatches || (schoolMatches && (careerMatches || subjectMatches))));
}

export function getProjectsForSession(projects, session) {
  if (session?.role !== "jc") return projects;
  return projects.filter((project) => projectMatchesDirectorScope(project, session));
}

function event(actor, title, detail) {
  return {
    id: createId("evt"),
    actor,
    title,
    detail,
    date: now(),
  };
}

const seedEntities = [
  {
    id: "ent-demo-001",
    name: "ODOOCOOP SPA",
    rut: "76.883.241-2",
    type: "Empresa",
    contactName: "Carolina Silva",
    contactEmail: "socio@demo.cl",
    phone: "+56 9 5555 1234",
    address: "Santiago",
    city: "Santiago",
    region: "Región Metropolitana",
    verified: true,
    createdAt: now(),
  },
  {
    id: "ent-demo-002",
    name: "Fundación Puente Digital",
    rut: "65.412.980-7",
    type: "Fundación",
    contactName: "Paula Contreras",
    contactEmail: "puentedigital@demo.cl",
    phone: "+56 9 6200 4421",
    address: "Av. Concha y Toro 1800",
    city: "Puente Alto",
    region: "Región Metropolitana",
    verified: true,
    createdAt: now(),
  },
  {
    id: "ent-demo-003",
    name: "Municipalidad de Maipú",
    rut: "69.070.700-6",
    type: "Institución pública",
    contactName: "Rodrigo Campos",
    contactEmail: "maipu@demo.cl",
    phone: "+56 2 2677 6000",
    address: "Av. 5 de Abril 0260",
    city: "Maipú",
    region: "Región Metropolitana",
    verified: true,
    createdAt: now(),
  },
  {
    id: "ent-demo-004",
    name: "Centro Salud Norte",
    rut: "61.908.000-4",
    type: "Institución pública",
    contactName: "Marcela Torres",
    contactEmail: "saludnorte@demo.cl",
    phone: "+56 9 7001 1188",
    address: "Los Alerces 1510",
    city: "Santiago",
    region: "Región Metropolitana",
    verified: true,
    createdAt: now(),
  },
  {
    id: "ent-demo-005",
    name: "Red Emprende Valparaíso",
    rut: "76.119.532-0",
    type: "ONG",
    contactName: "Ignacio Vidal",
    contactEmail: "emprendevalpo@demo.cl",
    phone: "+56 9 8112 4520",
    address: "Brasil 2021",
    city: "Valparaíso",
    region: "Valparaíso",
    verified: true,
    createdAt: now(),
  },
  {
    id: "ent-demo-006",
    name: "Corporación Cultura Viva",
    rut: "65.778.210-9",
    type: "Comunidad",
    contactName: "Valentina Paredes",
    contactEmail: "culturaviva@demo.cl",
    phone: "+56 9 6400 4412",
    address: "San Martín 840",
    city: "Viña del Mar",
    region: "Valparaíso",
    verified: true,
    createdAt: now(),
  },
];

const seedEntitiesById = Object.fromEntries(seedEntities.map((entity) => [entity.id, entity]));

const approvedBySocioStatuses = [
  "Aprobada por Socio formador",
  "Asignada a Escuela / Carrera / Sede / Director de carrera",
  "Asignada a asignatura",
  "Disponible para docentes",
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
];

function makeAssignment({
  school = "Informática y Telecomunicaciones",
  career = "Ingeniería en Informática",
  campus = "Maipú",
  careerLead = "Andrés Rojas",
  subject = "Proyecto de Integración",
  section = "001D",
  semester = "2026-2",
} = {}) {
  return { school, career, campus, careerLead, subject, section, semester };
}

function makeApplication({
  teacher = "Docente Demo",
  students = "24",
  startDate = "2026-08-10",
  endDate = "2026-11-20",
  milestonesText = "Diagnóstico inicial\nDesarrollo de solución\nEntrega final",
} = {}) {
  return { teacher, students, startDate, endDate, milestonesText };
}

function makeExecution({
  teamCount = 4,
  peoplePerTeam = 5,
  modality = "Híbrido",
  targetCampus = "Maipú",
} = {}) {
  return { teamCount, peoplePerTeam, modality, targetCampus };
}

function makeMilestone({
  id,
  title,
  status = "Pendiente",
  comments = "",
  evidence = "",
  observation = "",
  reviewComment = "",
  reviewedAt = "",
}) {
  const milestone = { id, title, status, comments, evidence };
  if (observation) milestone.observation = observation;
  if (reviewComment) milestone.reviewComment = reviewComment;
  if (reviewedAt) milestone.reviewedAt = reviewedAt;
  return milestone;
}

function makeClosure({ summary, evidence, eeApproved = false, observation = "" }) {
  const closure = { summary, evidence, eeApproved };
  if (observation) closure.observation = observation;
  return closure;
}

function makeCancellation(reason, cancelledBy = "Validadora Demo") {
  return { reason, cancelledBy, cancelledAt: now() };
}

function makeProject({
  id,
  title,
  description,
  objective,
  expectedResults,
  status,
  entityId = "ent-demo-001",
  observations = "",
  eeApproved,
  createdBy = "Validadora Demo",
  assignment = null,
  application = null,
  execution,
  milestones = [],
  closure = null,
  cancellation = null,
  history = [],
  notifications = [],
}) {
  const entity = seedEntitiesById[entityId] || seedEntities[0];
  return {
    id,
    title,
    description,
    objective,
    expectedResults,
    status,
    entityId: entity.id,
    entityName: entity.name,
    observations,
    eeApproved: eeApproved ?? approvedBySocioStatuses.includes(status),
    createdBy,
    createdAt: now(),
    assignment,
    application,
    execution: makeExecution(execution),
    milestones,
    closure,
    cancellation,
    history: history.length ? history : [event("vcm", "Proyecto demo cargado", `Estado inicial para pruebas: ${status}.`)],
    notifications,
  };
}

const seedProjects = [
  makeProject({
    id: "proy-demo-001",
    title: "Tablero de indicadores para gestión comunitaria",
    description: "El socio formador requiere ordenar información de atención y seguimiento para priorizar acciones con la comunidad.",
    objective: "Desarrollar una experiencia aplicada donde estudiantes levanten requerimientos y propongan un tablero inicial de indicadores.",
    expectedResults: "Diagnóstico, prototipo de tablero, acta de validación y transferencia básica a la contraparte.",
    status: "Disponible para docentes",
    assignment: makeAssignment({
      campus: "Maipú",
      careerLead: "María González",
      section: "003D",
    }),
    execution: {
      teamCount: 4,
      peoplePerTeam: 5,
      modality: "Híbrido",
      targetCampus: "Maipú",
    },
    history: [
      event("vcm", "Propuesta demo creada", "Registro inicial para probar catálogo docente."),
      event("ee", "V°B° entregado por Socio formador", "La propuesta fue aprobada por el socio formador."),
      event("jc", "Asignación académica registrada", "Proyecto publicado para docentes de Proyecto de Integración."),
    ],
    notifications: [
      {
        id: "notif-demo-001",
        to: "Docente",
        message: "Proyecto disponible en catálogo docente.",
        date: now(),
        read: false,
      },
    ],
  }),
  makeProject({
    id: "proy-demo-002",
    title: "Programa de apoyo digital para emprendedores locales",
    description: "El socio formador necesita levantar requerimientos digitales y priorizar iniciativas de apoyo a emprendedores de la comuna.",
    objective: "Diseñar una propuesta VCM con estudiantes para diagnosticar brechas, proponer mejoras y validar un plan de acción inicial.",
    expectedResults: "Diagnóstico, matriz de priorización, propuesta de solución y acta de validación con el Socio formador.",
    status: "En revisión por Socio formador",
    execution: {
      teamCount: 3,
      peoplePerTeam: 4,
      modality: "Presencial",
      targetCampus: "Puente Alto",
    },
    history: [
      event("vcm", "Propuesta enviada al Socio formador", "El Socio formador debe revisar y entregar V°B° u observaciones."),
      event("vcm", "Propuesta creada", "Se registró la necesidad inicial junto a la contraparte."),
    ],
    notifications: [
      {
        id: "notif-demo-002",
        to: "Socio formador",
        message: "Tiene una propuesta VCM pendiente de revisión.",
        date: now(),
        read: false,
      },
    ],
  }),
  makeProject({
    id: "proy-demo-003",
    title: "Levantamiento de procesos para centro comunitario",
    description: "La organización requiere documentar sus procesos de atención, derivación y seguimiento para mejorar la coordinación interna.",
    objective: "Ejecutar un proyecto aplicado donde estudiantes levanten procesos, documenten hallazgos y propongan mejoras priorizadas.",
    expectedResults: "Mapa de procesos, informe de oportunidades de mejora, evidencia de reuniones y cierre validado por la contraparte.",
    status: "Proyecto en ejecución",
    assignment: makeAssignment({
      campus: "Puente Alto",
      subject: "Levantamiento de Requerimientos",
      section: "002D",
    }),
    application: makeApplication({
      milestonesText: "Diagnóstico inicial\nMapa de procesos\nEntrega final",
    }),
    execution: {
      teamCount: 6,
      peoplePerTeam: 4,
      modality: "Presencial",
      targetCampus: "Puente Alto",
    },
    milestones: [
      makeMilestone({
        id: "hito-demo-001",
        title: "Diagnóstico inicial",
      }),
    ],
    history: [
      event("vcm", "Ejecución aprobada", "El proyecto fue aprobado para ejecución."),
      event("docente", "Postulación registrada", "Docente Demo registró estudiantes, fechas e hitos comprometidos."),
      event("jc", "Asignación académica registrada", "Levantamiento de Requerimientos · 002D · 2026-2"),
      event("ee", "V°B° entregado por Socio formador", "La propuesta fue aprobada por el socio formador."),
    ],
    notifications: [
      {
        id: "notif-demo-003",
        to: "Docente",
        message: "Proyecto en ejecución. Puede registrar hitos, cierre o cancelación.",
        date: now(),
        read: false,
      },
    ],
  }),
  makeProject({
    id: "proy-demo-004",
    title: "Mesa de ayuda para organizaciones vecinales",
    description: "Necesidad inicial para canalizar consultas frecuentes de vecinos y dirigentes sociales.",
    objective: "Levantar requerimientos y preparar una propuesta inicial de servicio digital comunitario.",
    expectedResults: "Ficha de necesidad, actores involucrados y primera delimitación del alcance.",
    status: "Borrador",
    execution: { teamCount: 2, peoplePerTeam: 4, modality: "Online", targetCampus: "Online" },
  }),
  makeProject({
    id: "proy-demo-005",
    title: "Portal de reservas para talleres comunitarios",
    description: "La contraparte requiere ordenar inscripciones y cupos para talleres de capacitación.",
    objective: "Ajustar la propuesta antes de su envío formal al Socio formador.",
    expectedResults: "Alcance corregido, responsables definidos y criterios de éxito verificables.",
    status: "Correcciones solicitadas por Validador",
    observations: "Precisar beneficiarios, fechas tentativas y responsable de validación en terreno.",
    execution: { teamCount: 3, peoplePerTeam: 5, modality: "Híbrido", targetCampus: "Maipú" },
  }),
  makeProject({
    id: "proy-demo-006",
    title: "Aplicación web para inscripción de voluntariado",
    description: "El socio formador necesita una forma simple de registrar voluntarios y horarios disponibles.",
    objective: "Validar la pertinencia de la propuesta y preparar su derivación académica.",
    expectedResults: "Ficha aprobada por Validador y lista para V°B° del Socio formador.",
    status: "Aprobada por Validador",
    entityId: "ent-demo-002",
    assignment: makeAssignment({ campus: "Puente Alto", section: "004D" }),
    execution: { teamCount: 4, peoplePerTeam: 4, modality: "Presencial", targetCampus: "Puente Alto" },
  }),
  makeProject({
    id: "proy-demo-007",
    title: "Sistema de inventario para banco de alimentos",
    description: "El socio formador observa que la propuesta debe incorporar trazabilidad de vencimientos.",
    objective: "Recibir observaciones del Socio formador para ajustar alcance técnico y operativo.",
    expectedResults: "Propuesta corregida con criterios de stock, vencimiento y entrega.",
    status: "Con observaciones de Socio formador",
    entityId: "ent-demo-002",
    observations: "Agregar control de vencimientos y registro de beneficiarios por entrega.",
    execution: { teamCount: 5, peoplePerTeam: 4, modality: "Híbrido", targetCampus: "San Bernardo" },
  }),
  makeProject({
    id: "proy-demo-008",
    title: "Plataforma de seguimiento para tutorías escolares",
    description: "La fundación requiere visualizar asistencia y avances de tutorías semanales.",
    objective: "Continuar con asignación interna después del V°B° del Socio formador.",
    expectedResults: "Proyecto listo para asignación de escuela, carrera, sede y Director.",
    status: "Aprobada por Socio formador",
    entityId: "ent-demo-002",
    execution: { teamCount: 4, peoplePerTeam: 5, modality: "Online", targetCampus: "Online" },
  }),
  makeProject({
    id: "proy-demo-009",
    title: "Monitoreo de asistencia para talleres barriales",
    description: "La municipalidad necesita consolidar asistencia y alertas de baja participación.",
    objective: "Asignar el proyecto a la escuela y carrera responsable para evaluación académica.",
    expectedResults: "Asignación académica inicial registrada y lista para vincular asignatura.",
    status: "Asignada a Escuela / Carrera / Sede / Director de carrera",
    entityId: "ent-demo-003",
    assignment: makeAssignment({ campus: "Maipú", careerLead: "Andrés Rojas", section: "", subject: "" }),
    execution: { teamCount: 3, peoplePerTeam: 6, modality: "Presencial", targetCampus: "Maipú" },
  }),
  makeProject({
    id: "proy-demo-010",
    title: "Prototipo de agenda para atenciones sociales",
    description: "La contraparte requiere agendar atenciones y registrar derivaciones con mayor orden.",
    objective: "Vincular el proyecto con una asignatura y sección para su posterior publicación docente.",
    expectedResults: "Asignatura, sección y semestre definidos.",
    status: "Asignada a asignatura",
    entityId: "ent-demo-003",
    assignment: makeAssignment({
      campus: "Maipú",
      subject: "Levantamiento de Requerimientos",
      section: "005D",
    }),
    execution: { teamCount: 5, peoplePerTeam: 4, modality: "Híbrido", targetCampus: "Maipú" },
  }),
  makeProject({
    id: "proy-demo-011",
    title: "Alfabetización digital para adultos mayores",
    description: "Se requiere acompañar a adultos mayores en el uso seguro de trámites digitales.",
    objective: "Disponibilizar un proyecto para docentes de informática con foco formativo y comunitario.",
    expectedResults: "Plan de talleres, material de apoyo y registro de participación.",
    status: "Disponible para docentes",
    entityId: "ent-demo-003",
    assignment: makeAssignment({
      career: "Analista Programador",
      campus: "Maipú",
      subject: "Taller de Vinculación con el Medio",
      section: "006D",
    }),
    execution: { teamCount: 6, peoplePerTeam: 5, modality: "Presencial", targetCampus: "Maipú" },
  }),
  makeProject({
    id: "proy-demo-012",
    title: "Optimización de registro de donaciones",
    description: "La fundación necesita mejorar el registro de donaciones recibidas, clasificadas y entregadas.",
    objective: "Permitir que el docente tome el proyecto y formalice equipo, fechas e hitos.",
    expectedResults: "Plan de ejecución docente y calendario de hitos comprometidos.",
    status: "Postulada / Tomada por docente",
    entityId: "ent-demo-002",
    assignment: makeAssignment({ campus: "Puente Alto", section: "007D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "28",
      startDate: "2026-08-17",
      endDate: "2026-11-28",
      milestonesText: "Diagnóstico de datos\nPrototipo de registro\nValidación con contraparte",
    }),
    execution: { teamCount: 7, peoplePerTeam: 4, modality: "Híbrido", targetCampus: "Puente Alto" },
  }),
  makeProject({
    id: "proy-demo-013",
    title: "Automatización de reportes para comunidad educativa",
    description: "El socio formador solicita reportes periódicos de participación y resultados de talleres.",
    objective: "Revisar la postulación del docente antes de aprobar la ejecución.",
    expectedResults: "Validación VCM de fechas, estudiantes, hitos y evidencias esperadas.",
    status: "En revisión VCM",
    entityId: "ent-demo-001",
    assignment: makeAssignment({ campus: "Maipú", section: "008D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "22",
      startDate: "2026-08-20",
      endDate: "2026-11-15",
      milestonesText: "Modelo de datos\nReporte piloto\nEntrega final",
    }),
    execution: { teamCount: 5, peoplePerTeam: 4, modality: "Online", targetCampus: "Online" },
  }),
  makeProject({
    id: "proy-demo-014",
    title: "Trazabilidad de derivaciones sociales",
    description: "La contraparte requiere registrar derivaciones y estados de atención de casos sociales.",
    objective: "Validar con el Socio formador el primer hito registrado por el docente.",
    expectedResults: "Hito aprobado u observado para continuar ejecución.",
    status: "Hito registrado",
    entityId: "ent-demo-001",
    assignment: makeAssignment({
      campus: "Puente Alto",
      subject: "Levantamiento de Requerimientos",
      section: "009D",
    }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "26",
      startDate: "2026-08-12",
      endDate: "2026-11-25",
      milestonesText: "Levantamiento inicial\nFlujo de derivación\nPrototipo funcional",
    }),
    execution: { teamCount: 6, peoplePerTeam: 4, modality: "Presencial", targetCampus: "Puente Alto" },
    milestones: [
      makeMilestone({
        id: "hito-demo-014-1",
        title: "Levantamiento inicial",
        status: "En revisión",
        comments: "Se completaron entrevistas con tres equipos de atención.",
        evidence: "Acta de reunión, matriz de procesos y formulario de hallazgos.",
      }),
      makeMilestone({ id: "hito-demo-014-2", title: "Flujo de derivación" }),
    ],
    notifications: [
      {
        id: "notif-demo-014",
        to: "Socio formador",
        message: "Hito pendiente de validación.",
        date: now(),
        read: false,
      },
    ],
  }),
  makeProject({
    id: "proy-demo-015",
    title: "Repositorio de evidencias para talleres VCM",
    description: "La organización requiere centralizar evidencias, fotografías, actas y documentos de talleres.",
    objective: "Mostrar un caso donde el Socio formador observó un hito y el docente debe corregir.",
    expectedResults: "Hito observado con comentario claro para nueva entrega.",
    status: "Hito observado",
    entityId: "ent-demo-001",
    assignment: makeAssignment({ campus: "Maipú", section: "010D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "20",
      startDate: "2026-08-05",
      endDate: "2026-11-10",
      milestonesText: "Estructura documental\nCarga piloto\nEntrega final",
    }),
    execution: { teamCount: 4, peoplePerTeam: 5, modality: "Híbrido", targetCampus: "Maipú" },
    milestones: [
      makeMilestone({
        id: "hito-demo-015-1",
        title: "Estructura documental",
        status: "Observado",
        comments: "Se propone una estructura inicial de carpetas y metadatos.",
        evidence: "Enlace a carpeta piloto y tabla de clasificación.",
        observation: "Falta diferenciar evidencias por sede y actividad.",
      }),
    ],
  }),
  makeProject({
    id: "proy-demo-016",
    title: "Kit de capacitación en ciberseguridad comunitaria",
    description: "La contraparte necesita material simple sobre prevención de fraudes digitales.",
    objective: "Continuar el flujo luego de un hito aprobado por el Socio formador.",
    expectedResults: "Material validado y siguiente hito habilitado para ejecución.",
    status: "Hito aprobado",
    entityId: "ent-demo-002",
    assignment: makeAssignment({ campus: "Puente Alto", section: "011D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "25",
      startDate: "2026-08-18",
      endDate: "2026-11-22",
      milestonesText: "Diseño de contenidos\nTaller piloto\nCierre con contraparte",
    }),
    execution: { teamCount: 5, peoplePerTeam: 5, modality: "Online", targetCampus: "Online" },
    milestones: [
      makeMilestone({
        id: "hito-demo-016-1",
        title: "Diseño de contenidos",
        status: "Aprobado",
        comments: "Se entregó guion y láminas de capacitación.",
        evidence: "Presentación, pauta de taller y registro de revisión.",
        reviewComment: "Contenido aprobado para taller piloto.",
        reviewedAt: now(),
      }),
    ],
  }),
  makeProject({
    id: "proy-demo-017",
    title: "Digitalización de ficha de usuarios",
    description: "El socio formador busca reemplazar planillas manuales por una ficha digital.",
    objective: "Revisar el cierre enviado por el docente desde el portal del Socio formador.",
    expectedResults: "Cierre aprobado u observado por la contraparte.",
    status: "En cierre",
    entityId: "ent-demo-001",
    assignment: makeAssignment({
      campus: "Puente Alto",
      subject: "Levantamiento de Requerimientos",
      section: "012D",
    }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "24",
      startDate: "2026-07-30",
      endDate: "2026-10-30",
      milestonesText: "Diagnóstico\nFicha piloto\nCierre",
    }),
    execution: { teamCount: 6, peoplePerTeam: 4, modality: "Presencial", targetCampus: "Puente Alto" },
    milestones: [
      makeMilestone({
        id: "hito-demo-017-1",
        title: "Ficha piloto",
        status: "Aprobado",
        comments: "Ficha validada con usuarios clave.",
        evidence: "Prototipo y acta de validación.",
      }),
    ],
    closure: makeClosure({
      summary: "Se implementó una ficha digital piloto para la toma de datos de atención.",
      evidence: "Informe final, prototipo navegable y acta de cierre con contraparte.",
    }),
  }),
  makeProject({
    id: "proy-demo-018",
    title: "Mapa de servicios sociales para vecinos",
    description: "Se levantó un mapa de servicios y derivaciones disponibles para vecinos de la comuna.",
    objective: "Mostrar un cierre observado por el Socio formador.",
    expectedResults: "Docente debe corregir evidencias finales antes de cerrar.",
    status: "Cierre observado",
    entityId: "ent-demo-003",
    assignment: makeAssignment({ campus: "Maipú", section: "013D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "30",
      startDate: "2026-07-18",
      endDate: "2026-10-25",
      milestonesText: "Levantamiento de servicios\nMapa preliminar\nCierre",
    }),
    execution: { teamCount: 6, peoplePerTeam: 5, modality: "Híbrido", targetCampus: "Maipú" },
    closure: makeClosure({
      summary: "Mapa de servicios listo para revisión final.",
      evidence: "Mapa interactivo y ficha de servicios.",
      observation: "Agregar fecha de actualización y responsable por cada servicio.",
    }),
  }),
  makeProject({
    id: "proy-demo-019",
    title: "CRM básico para organización territorial",
    description: "La organización requiere ordenar contactos, compromisos y seguimiento de reuniones.",
    objective: "Mostrar cierre ya aprobado por el Socio formador y pendiente de validación final del Validador.",
    expectedResults: "El Validador puede finalizar administrativamente el proyecto.",
    status: "En cierre",
    entityId: "ent-demo-001",
    assignment: makeAssignment({ campus: "Maipú", section: "014D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "23",
      startDate: "2026-07-10",
      endDate: "2026-10-20",
      milestonesText: "Modelo de contacto\nCarga piloto\nCierre",
    }),
    execution: { teamCount: 5, peoplePerTeam: 5, modality: "Online", targetCampus: "Online" },
    closure: makeClosure({
      summary: "CRM piloto entregado y validado por la contraparte.",
      evidence: "Manual de uso, respaldo de datos de prueba y acta de cierre.",
      eeApproved: true,
    }),
  }),
  makeProject({
    id: "proy-demo-020",
    title: "Panel de seguimiento de tutorías",
    description: "Proyecto ejecutado para visualizar asistencia, sesiones y alertas de estudiantes tutorados.",
    objective: "Mostrar proyecto finalizado administrativamente.",
    expectedResults: "Proyecto cerrado y disponible para reporte académico.",
    status: "Finalizado exitosamente",
    entityId: "ent-demo-002",
    assignment: makeAssignment({ campus: "Puente Alto", section: "015D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "21",
      startDate: "2026-04-08",
      endDate: "2026-07-08",
      milestonesText: "Diseño tablero\nPiloto\nCierre",
    }),
    execution: { teamCount: 4, peoplePerTeam: 5, modality: "Híbrido", targetCampus: "Puente Alto" },
    closure: makeClosure({
      summary: "Panel validado con indicadores de asistencia y avance.",
      evidence: "Reporte final, enlace a tablero y encuesta de satisfacción.",
      eeApproved: true,
    }),
  }),
  makeProject({
    id: "proy-demo-021",
    title: "Sitio informativo para programa municipal",
    description: "Sitio web informativo para difundir requisitos, fechas y preguntas frecuentes del programa.",
    objective: "Mostrar proyecto publicado como experiencia realizada.",
    expectedResults: "Proyecto visible para repositorio de experiencias VCM.",
    status: "Publicado como proyecto realizado",
    entityId: "ent-demo-003",
    assignment: makeAssignment({ campus: "Maipú", section: "016D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "18",
      startDate: "2026-03-20",
      endDate: "2026-06-30",
      milestonesText: "Arquitectura de información\nSitio piloto\nPublicación",
    }),
    execution: { teamCount: 3, peoplePerTeam: 6, modality: "Presencial", targetCampus: "Maipú" },
    closure: makeClosure({
      summary: "Sitio publicado y entregado a la contraparte.",
      evidence: "URL, manual de actualización y acta final.",
      eeApproved: true,
    }),
  }),
  makeProject({
    id: "proy-demo-022",
    title: "App móvil de turnos para ferias locales",
    description: "La propuesta no fue tomada por docentes dentro del periodo definido.",
    objective: "Probar caso de cancelación desde mantenedor por falta de toma docente.",
    expectedResults: "Proyecto cancelado con motivo trazable.",
    status: "Cancelado",
    entityId: "ent-demo-003",
    assignment: makeAssignment({
      career: "Analista Programador",
      campus: "Maipú",
      subject: "Innovación Aplicada",
      section: "017D",
    }),
    execution: { teamCount: 4, peoplePerTeam: 4, modality: "Presencial", targetCampus: "Maipú" },
    cancellation: makeCancellation("No fue tomado por docentes dentro del plazo de publicación."),
  }),
  makeProject({
    id: "proy-demo-023",
    title: "Chatbot de orientación ciudadana",
    description: "La propuesta fue rechazada por no contar con datos ni responsables mínimos para ejecución.",
    objective: "Probar estado rechazado y trazabilidad de observaciones.",
    expectedResults: "Solicitud cerrada sin continuidad.",
    status: "Rechazado",
    entityId: "ent-demo-001",
    observations: "No se cuenta con responsable de contraparte ni disponibilidad para validaciones.",
    execution: { teamCount: 3, peoplePerTeam: 4, modality: "Online", targetCampus: "Online" },
  }),
  makeProject({
    id: "proy-demo-024",
    title: "Solicitud de cancelación de sistema de turnos comunitarios",
    description: "El docente solicita cancelar por cambio de prioridades del Socio formador.",
    objective: "Probar revisión VCM de cancelaciones desde el mantenedor.",
    expectedResults: "Validador puede aprobar o rechazar la cancelación.",
    status: "En revisión VCM",
    entityId: "ent-demo-001",
    assignment: makeAssignment({ campus: "Puente Alto", section: "018D" }),
    application: makeApplication({
      teacher: "Docente Demo",
      students: "19",
      startDate: "2026-08-01",
      endDate: "2026-11-01",
      milestonesText: "Diagnóstico\nPrototipo\nCierre",
    }),
    execution: { teamCount: 4, peoplePerTeam: 5, modality: "Híbrido", targetCampus: "Puente Alto" },
    cancellation: { reason: "La contraparte pausó la actividad por cambio de calendario institucional." },
  }),
  makeProject({
    id: "proy-demo-025",
    title: "Plan de formalización financiera para emprendedores",
    description: "Emprendedores requieren apoyo para organizar costos, precios y formalización básica.",
    objective: "Proyecto de Administración y Negocios para contrastar filtros por escuela.",
    expectedResults: "Diagnóstico financiero, plan de acción y taller de cierre.",
    status: "Proyecto en ejecución",
    entityId: "ent-demo-005",
    assignment: makeAssignment({
      school: "Administración y Negocios",
      career: "Administración de Empresas",
      campus: "Valparaíso",
      careerLead: "Daniela Núñez",
      subject: "Taller de Vinculación con el Medio",
      section: "101D",
    }),
    application: makeApplication({
      teacher: "Paula Herrera",
      students: "32",
      startDate: "2026-08-14",
      endDate: "2026-11-18",
      milestonesText: "Diagnóstico financiero\nTaller de costos\nCierre con emprendedores",
    }),
    execution: { teamCount: 8, peoplePerTeam: 4, modality: "Presencial", targetCampus: "Valparaíso" },
  }),
  makeProject({
    id: "proy-demo-026",
    title: "Identidad visual para feria de oficios",
    description: "La comunidad necesita piezas gráficas para comunicar una feria de oficios locales.",
    objective: "Proyecto de Diseño disponible para docentes de otra escuela.",
    expectedResults: "Sistema gráfico, piezas digitales e instructivo de uso.",
    status: "Disponible para docentes",
    entityId: "ent-demo-006",
    assignment: makeAssignment({
      school: "Diseño",
      career: "Diseño Gráfico",
      campus: "Viña del Mar",
      careerLead: "Camila Espinoza",
      subject: "Innovación Aplicada",
      section: "201D",
    }),
    execution: { teamCount: 5, peoplePerTeam: 4, modality: "Híbrido", targetCampus: "Viña del Mar" },
  }),
  makeProject({
    id: "proy-demo-027",
    title: "Campaña preventiva de salud comunitaria",
    description: "Centro de salud solicita apoyo para una campaña educativa de prevención.",
    objective: "Proyecto de Salud y Bienestar con hito pendiente del Socio formador.",
    expectedResults: "Material preventivo validado y plan de difusión.",
    status: "Hito registrado",
    entityId: "ent-demo-004",
    assignment: makeAssignment({
      school: "Salud y Bienestar",
      career: "Técnico en Enfermería",
      campus: "San Bernardo",
      careerLead: "Natalia Fuentes",
      subject: "Seminario de Especialidad",
      section: "301D",
    }),
    application: makeApplication({
      teacher: "Carlos Muñoz",
      students: "35",
      startDate: "2026-08-11",
      endDate: "2026-11-16",
      milestonesText: "Revisión bibliográfica\nMaterial educativo\nJornada comunitaria",
    }),
    execution: { teamCount: 7, peoplePerTeam: 5, modality: "Presencial", targetCampus: "San Bernardo" },
    milestones: [
      makeMilestone({
        id: "hito-demo-027-1",
        title: "Material educativo",
        status: "En revisión",
        comments: "Se preparó díptico y pauta de conversación preventiva.",
        evidence: "Borradores de material, pauta y cronograma de jornada.",
      }),
    ],
  }),
  makeProject({
    id: "proy-demo-028",
    title: "Ruta patrimonial para visitantes escolares",
    description: "Organización turística requiere una ruta patrimonial con estaciones y contenidos educativos.",
    objective: "Proyecto de Turismo finalizado para probar exportación histórica.",
    expectedResults: "Ruta documentada, guion de mediación y material para visitas.",
    status: "Finalizado exitosamente",
    entityId: "ent-demo-006",
    assignment: makeAssignment({
      school: "Turismo y Hospitalidad",
      career: "Turismo y Hotelería",
      campus: "Valparaíso",
      careerLead: "Matías Leiva",
      subject: "Taller de Vinculación con el Medio",
      section: "401D",
    }),
    application: makeApplication({
      teacher: "Fernanda Salinas",
      students: "27",
      startDate: "2026-04-22",
      endDate: "2026-07-12",
      milestonesText: "Levantamiento patrimonial\nRuta piloto\nCierre",
    }),
    execution: { teamCount: 6, peoplePerTeam: 4, modality: "Presencial", targetCampus: "Valparaíso" },
    closure: makeClosure({
      summary: "Ruta piloto ejecutada con visitantes escolares y validada por la contraparte.",
      evidence: "Guion, mapa de ruta, fotografías y acta de cierre.",
      eeApproved: true,
    }),
  }),
  makeProject({
    id: "proy-demo-029",
    title: "Manual de manipulación segura para comedor comunitario",
    description: "Comedor comunitario requiere material práctico sobre manipulación e higiene alimentaria.",
    objective: "Proyecto de Gastronomía en fase de cierre con encuesta disponible al aprobar.",
    expectedResults: "Manual, capacitación breve y evidencia de transferencia.",
    status: "En cierre",
    entityId: "ent-demo-006",
    assignment: makeAssignment({
      school: "Gastronomía",
      career: "Gastronomía Internacional",
      campus: "San Carlos de Apoquindo",
      careerLead: "Lorena Pérez",
      subject: "Seminario de Especialidad",
      section: "501D",
    }),
    application: makeApplication({
      teacher: "Javier Morales",
      students: "24",
      startDate: "2026-08-03",
      endDate: "2026-11-05",
      milestonesText: "Diagnóstico de cocina\nManual piloto\nCierre",
    }),
    execution: { teamCount: 6, peoplePerTeam: 4, modality: "Presencial", targetCampus: "San Carlos de Apoquindo" },
    closure: makeClosure({
      summary: "Manual y taller de transferencia completados.",
      evidence: "Manual PDF, lista de asistencia y fotografías de capacitación.",
    }),
  }),
  makeProject({
    id: "proy-demo-030",
    title: "Guía de comunicación para campaña barrial",
    description: "La organización requiere ordenar mensajes, canales y piezas de difusión.",
    objective: "Proyecto de Comunicación en fase inicial para probar filtros del Administrador.",
    expectedResults: "Estrategia de comunicación, calendario editorial y kit de piezas base.",
    status: "Asignada a asignatura",
    entityId: "ent-demo-006",
    assignment: makeAssignment({
      school: "Comunicación",
      career: "Diseño Gráfico",
      campus: "Alameda",
      careerLead: "Sofía Araya",
      subject: "Innovación Aplicada",
      section: "601D",
    }),
    execution: { teamCount: 4, peoplePerTeam: 5, modality: "Híbrido", targetCampus: "Alameda" },
  }),
];

export function ensureVcmData() {
  if (!canUseStorage()) return;

  if (window.localStorage.getItem(STORAGE_KEYS.version) !== DATA_VERSION) {
    writeCollection(STORAGE_KEYS.entities, seedEntities);
    writeCollection(STORAGE_KEYS.projects, seedProjects);
    window.localStorage.setItem(STORAGE_KEYS.version, DATA_VERSION);
    return;
  }

  readCollection(STORAGE_KEYS.entities, seedEntities);
  readCollection(STORAGE_KEYS.projects, seedProjects);
}

export function getSession() {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.session);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    return null;
  }
}

export function setSession(session) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEYS.session);
}

export function getEntities() {
  return readCollection(STORAGE_KEYS.entities, seedEntities);
}

export function saveEntity(entity) {
  const entities = getEntities();
  const nextEntity = {
    id: entity.id || createId("ent"),
    createdAt: entity.createdAt || now(),
    ...entity,
  };
  const next = [nextEntity, ...entities.filter((item) => item.id !== nextEntity.id)];
  writeCollection(STORAGE_KEYS.entities, next);
  return nextEntity;
}

export function getProjects() {
  return readCollection(STORAGE_KEYS.projects, seedProjects);
}

export function saveProject(project) {
  const projects = getProjects();
  const nextProject = {
    id: project.id || createId("proy"),
    createdAt: project.createdAt || now(),
    history: project.history || [],
    notifications: project.notifications || [],
    ...project,
  };
  const next = [nextProject, ...projects.filter((item) => item.id !== nextProject.id)];
  writeCollection(STORAGE_KEYS.projects, next);
  return nextProject;
}

export function updateProject(projectId, updater) {
  const projects = getProjects();
  let updatedProject = null;
  const next = projects.map((project) => {
    if (project.id !== projectId) return project;
    updatedProject = typeof updater === "function" ? updater(project) : { ...project, ...updater };
    return updatedProject;
  });
  writeCollection(STORAGE_KEYS.projects, next);
  return updatedProject;
}

export function addProjectEvent(project, actor, title, detail) {
  return {
    ...project,
    history: [event(actor, title, detail), ...(project.history || [])],
  };
}

export function addNotification(project, to, message) {
  return {
    ...project,
    notifications: [
      {
        id: createId("notif"),
        to,
        message,
        date: now(),
        read: false,
      },
      ...(project.notifications || []),
    ],
  };
}

export function createProjectDraft(values, entity, sendToEe = false) {
  const status = sendToEe ? "En revisión por Socio formador" : "Borrador";
  const project = {
    id: createId("proy"),
    title: values.title,
    description: values.description,
    objective: values.objective,
    expectedResults: values.expectedResults,
    status,
    entityId: entity.id,
    entityName: entity.name,
    observations: "",
    eeApproved: false,
    createdBy: values.createdBy || "Validador",
    createdAt: now(),
    assignment: null,
    application: null,
    execution: {
      teamCount: Number(values.teamCount) || 1,
      peoplePerTeam: Number(values.peoplePerTeam) || 1,
      modality: values.modality,
      targetCampus: values.targetCampus,
    },
    milestones: [],
    closure: null,
    cancellation: null,
    history: [
      event("vcm", sendToEe ? "Propuesta enviada a revisión del Socio formador" : "Borrador de propuesta creado", sendToEe ? "El Socio formador debe revisar la propuesta." : "La propuesta quedó guardada como borrador."),
    ],
    notifications: sendToEe
      ? [
          {
            id: createId("notif"),
            to: "Socio formador",
            message: "Tiene una propuesta VCM pendiente de revisión.",
            date: now(),
            read: false,
          },
        ]
      : [],
  };

  return saveProject(project);
}
