export const roles = {
  vcm: {
    label: "Encargado VCM",
    short: "VCM",
    route: "/dashboard",
    description: "Crea propuestas, asigna internamente, aprueba ejecución y gestiona cierre.",
  },
  ee: {
    label: "Entidad Externa",
    short: "EE",
    route: "/formulario",
    description: "Revisa propuestas, entrega V°B°, valida hitos y revisa cierre.",
  },
  jc: {
    label: "Jefe de Carrera",
    short: "JC",
    route: "/dashboard",
    description: "Asocia propuesta a asignatura, sección y semestre.",
  },
  docente: {
    label: "Docente",
    short: "DOC",
    route: "/catalogo-docente",
    description: "Toma proyectos, registra estudiantes, hitos, evidencias y cierre.",
  },
};

export const roleStyles = {
  vcm: "border-[#185FA5] bg-[#E6F1FB] text-[#042C53]",
  ee: "border-[#993C1D] bg-[#FAECE7] text-[#4A1B0C]",
  jc: "border-[#3B6D11] bg-[#EAF3DE] text-[#173404]",
  docente: "border-[#534AB7] bg-[#EEEDFE] text-[#26215C]",
  sis: "border-[#5F5E5A] bg-[#F1EFE8] text-[#2C2C2A]",
};

export const projectStatuses = [
  "Borrador",
  "En revisión por EE",
  "Correcciones solicitadas por mantenedor",
  "Aprobada por mantenedor",
  "Con observaciones de EE",
  "Aprobada por EE",
  "Asignada a Escuela / Sede / Jefe de Carrera",
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
  Borrador: { tone: "neutral", description: "Propuesta creada, aún no enviada a la Entidad Externa." },
  "En revisión por EE": { tone: "warning", description: "Propuesta enviada a revisión de la Entidad Externa." },
  "Correcciones solicitadas por mantenedor": { tone: "danger", description: "El mantenedor solicitó ajustes antes de aceptar la propuesta." },
  "Aprobada por mantenedor": { tone: "success", description: "El mantenedor aceptó la propuesta para continuar el flujo interno." },
  "Con observaciones de EE": { tone: "danger", description: "La Entidad Externa solicitó ajustes." },
  "Aprobada por EE": { tone: "success", description: "La Entidad Externa entregó V°B°." },
  "Asignada a Escuela / Sede / Jefe de Carrera": { tone: "info", description: "VCM asignó la propuesta internamente." },
  "Asignada a asignatura": { tone: "info", description: "JC vinculó asignatura, sección y semestre." },
  "Disponible para docentes": { tone: "success", description: "Visible en catálogo docente." },
  "Postulada / Tomada por docente": { tone: "warning", description: "Un docente tomó el proyecto y registró ejecución inicial." },
  "En revisión VCM": { tone: "warning", description: "VCM debe revisar una postulación o solicitud." },
  "Proyecto en ejecución": { tone: "success", description: "Proyecto aprobado para ejecución." },
  "Hito registrado": { tone: "warning", description: "Hito enviado a validación de EE." },
  "Hito observado": { tone: "danger", description: "EE registró observaciones sobre el hito." },
  "Hito aprobado": { tone: "success", description: "EE validó el hito." },
  "En cierre": { tone: "warning", description: "Docente solicitó cierre o EE aprobó resultado final." },
  "Cierre observado": { tone: "danger", description: "EE solicitó evidencias finales adicionales." },
  "Finalizado exitosamente": { tone: "success", description: "VCM validó cierre administrativo." },
  "Publicado como proyecto realizado": { tone: "success", description: "Disponible en repositorio de experiencias realizadas." },
  Cancelado: { tone: "danger", description: "Proyecto detenido antes de finalizar." },
  Rechazado: { tone: "danger", description: "Propuesta o postulación rechazada definitivamente." },
};

export const entityTypes = ["Empresa", "Fundación", "Institución pública", "Comunidad", "ONG", "Otra"];
export const sedes = ["Alameda", "Antonio Varas", "Concepción", "Maipú", "Plaza Norte", "Puente Alto", "San Bernardo", "San Carlos de Apoquindo", "Valparaíso", "Viña del Mar", "Online"];
export const escuelas = ["Administración y Negocios", "Comunicación", "Construcción", "Diseño", "Gastronomía", "Informática y Telecomunicaciones", "Ingeniería y Recursos Naturales", "Salud y Bienestar", "Turismo y Hospitalidad"];
export const asignaturas = ["Proyecto de Integración", "Taller de Vinculación con el Medio", "Innovación Aplicada", "Levantamiento de Requerimientos", "Seminario de Especialidad"];
export const semestres = ["2026-1", "2026-2", "2027-1"];

export const demoUsers = [
  { role: "vcm", email: "vcm@duoc.cl", password: "demo123", name: "Encargada VCM" },
  { role: "ee", email: "empresa@demo.cl", password: "demo123", name: "Entidad Externa" },
  { role: "jc", email: "jc@duoc.cl", password: "demo123", name: "Jefe de Carrera" },
  { role: "docente", email: "docente@duoc.cl", password: "demo123", name: "Docente Demo" },
];

const fullNavigation = [
  { label: "Mantenedor", to: "/dashboard", active: "dashboard" },
  { label: "Formulario", to: "/formulario", active: "formulario" },
  { label: "Portal EE", to: "/portal-entidad", active: "entidad" },
  { label: "Solicitudes EE", to: "/solicitudes-entidad", active: "solicitudes-entidad" },
  { label: "Toma proyectos", to: "/catalogo-docente", active: "docente" },
  { label: "Mis solicitudes", to: "/mis-solicitudes-docente", active: "mis-solicitudes-docente" },
];

export const roleNavigation = {
  vcm: fullNavigation,
  jc: fullNavigation,
  ee: [
    { label: "Formulario", to: "/formulario", active: "formulario" },
    { label: "Portal EE", to: "/portal-entidad", active: "entidad" },
    { label: "Mis solicitudes", to: "/solicitudes-entidad", active: "solicitudes-entidad" },
  ],
  docente: [
    { label: "Toma proyectos", to: "/catalogo-docente", active: "docente" },
    { label: "Formulario", to: "/formulario", active: "formulario" },
    { label: "Mis solicitudes", to: "/mis-solicitudes-docente", active: "mis-solicitudes-docente" },
  ],
};

export const routeAccess = {
  "/dashboard": ["vcm", "jc"],
  "/formulario": ["vcm", "jc", "ee", "docente"],
  "/portal-entidad": ["vcm", "jc", "ee"],
  "/solicitudes-entidad": ["vcm", "jc", "ee"],
  "/catalogo-docente": ["vcm", "jc", "docente"],
  "/actividades-aprobadas": ["vcm", "jc", "docente"],
  "/mis-solicitudes-docente": ["vcm", "jc", "docente"],
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

const DATA_VERSION = "vcm-role-access-v1";

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
    contactEmail: "empresa@demo.cl",
    phone: "+56 9 5555 1234",
    address: "Santiago",
    city: "Santiago",
    region: "Región Metropolitana",
    verified: true,
    createdAt: now(),
  },
];

const seedProjects = [
  {
    id: "proy-demo-001",
    title: "Tablero de indicadores para gestión comunitaria",
    description: "La entidad requiere ordenar información de atención y seguimiento para priorizar acciones con la comunidad.",
    objective: "Desarrollar una experiencia aplicada donde estudiantes levanten requerimientos y propongan un tablero inicial de indicadores.",
    expectedResults: "Diagnóstico, prototipo de tablero, acta de validación y transferencia básica a la contraparte.",
    status: "Disponible para docentes",
    entityId: "ent-demo-001",
    entityName: "ODOOCOOP SPA",
    observations: "",
    eeApproved: true,
    createdBy: "Encargada VCM",
    createdAt: now(),
    assignment: {
      school: "Informática y Telecomunicaciones",
      campus: "Maipú",
      careerLead: "María González",
      subject: "Proyecto de Integración",
      section: "003D",
      semester: "2026-2",
    },
    application: null,
    milestones: [],
    closure: null,
    cancellation: null,
    history: [
      event("vcm", "Propuesta demo creada", "Registro inicial para probar catálogo docente."),
      event("ee", "V°B° entregado por EE", "La propuesta fue aprobada por la entidad externa."),
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
  },
  {
    id: "proy-demo-002",
    title: "Programa de apoyo digital para emprendedores locales",
    description: "La entidad necesita levantar requerimientos digitales y priorizar iniciativas de apoyo a emprendedores de la comuna.",
    objective: "Diseñar una propuesta VCM con estudiantes para diagnosticar brechas, proponer mejoras y validar un plan de acción inicial.",
    expectedResults: "Diagnóstico, matriz de priorización, propuesta de solución y acta de validación con la Entidad Externa.",
    status: "En revisión por EE",
    entityId: "ent-demo-001",
    entityName: "ODOOCOOP SPA",
    observations: "",
    eeApproved: false,
    createdBy: "Encargada VCM",
    createdAt: now(),
    assignment: null,
    application: null,
    milestones: [],
    closure: null,
    cancellation: null,
    history: [
      event("vcm", "Propuesta enviada a Entidad Externa", "La Entidad Externa debe revisar y entregar V°B° u observaciones."),
      event("vcm", "Propuesta creada", "Se registró la necesidad inicial junto a la contraparte."),
    ],
    notifications: [
      {
        id: "notif-demo-002",
        to: "Entidad Externa",
        message: "Tiene una propuesta VCM pendiente de revisión.",
        date: now(),
        read: false,
      },
    ],
  },
  {
    id: "proy-demo-003",
    title: "Levantamiento de procesos para centro comunitario",
    description: "La organización requiere documentar sus procesos de atención, derivación y seguimiento para mejorar la coordinación interna.",
    objective: "Ejecutar un proyecto aplicado donde estudiantes levanten procesos, documenten hallazgos y propongan mejoras priorizadas.",
    expectedResults: "Mapa de procesos, informe de oportunidades de mejora, evidencia de reuniones y cierre validado por la contraparte.",
    status: "Proyecto en ejecución",
    entityId: "ent-demo-001",
    entityName: "ODOOCOOP SPA",
    observations: "",
    eeApproved: true,
    createdBy: "Encargada VCM",
    createdAt: now(),
    assignment: {
      school: "Informática y Telecomunicaciones",
      campus: "Puente Alto",
      careerLead: "Andrés Rojas",
      subject: "Levantamiento de Requerimientos",
      section: "002D",
      semester: "2026-2",
    },
    application: {
      teacher: "Docente Demo",
      students: "24",
      startDate: "2026-08-10",
      endDate: "2026-11-20",
      milestonesText: "Diagnóstico inicial\nMapa de procesos\nEntrega final",
    },
    milestones: [
      {
        id: "hito-demo-001",
        title: "Diagnóstico inicial",
        status: "Pendiente",
        comments: "",
        evidence: "",
      },
    ],
    closure: null,
    cancellation: null,
    history: [
      event("vcm", "Ejecución aprobada", "El proyecto fue aprobado para ejecución."),
      event("docente", "Postulación registrada", "Docente Demo registró estudiantes, fechas e hitos comprometidos."),
      event("jc", "Asignación académica registrada", "Levantamiento de Requerimientos · 002D · 2026-2"),
      event("ee", "V°B° entregado por EE", "La propuesta fue aprobada por la entidad externa."),
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
  },
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
  const status = sendToEe ? "En revisión por EE" : "Borrador";
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
    createdBy: values.createdBy || "Encargado VCM",
    createdAt: now(),
    assignment: null,
    application: null,
    milestones: [],
    closure: null,
    cancellation: null,
    history: [
      event("vcm", sendToEe ? "Propuesta enviada a revisión EE" : "Borrador de propuesta creado", sendToEe ? "La Entidad Externa debe revisar la propuesta." : "La propuesta quedó guardada como borrador."),
    ],
    notifications: sendToEe
      ? [
          {
            id: createId("notif"),
            to: "Entidad Externa",
            message: "Tiene una propuesta VCM pendiente de revisión.",
            date: now(),
            read: false,
          },
        ]
      : [],
  };

  return saveProject(project);
}
