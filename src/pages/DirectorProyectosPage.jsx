import { useMemo, useState } from "react";
import {
  Download,
  Filter,
  GraduationCap,
  Search,
} from "lucide-react";
import {
  AppShell,
  EmptyState,
  PageIntro,
  Section,
  SelectField,
  StatCard,
  StatusBadge,
  TextInput,
} from "../components/VcmUI";
import {
  carreras,
  ensureVcmData,
  escuelas,
  getProjects,
  getSession,
  modalidades,
  projectStatuses,
  sedes,
} from "../data/vcmPlatform";

const phaseOptions = ["Fase inicial", "Disponible", "Comenzado", "Realizado", "No continuado"];
const finishedStatuses = ["Finalizado exitosamente", "Publicado como proyecto realizado"];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getProjectPhase(project) {
  if (finishedStatuses.includes(project.status)) return "Realizado";
  if (["Cancelado", "Rechazado"].includes(project.status)) return "No continuado";
  if (project.status === "Disponible para docentes") return "Disponible";
  if (
    [
      "Postulada / Tomada por docente",
      "En revisión VCM",
      "Proyecto en ejecución",
      "Hito registrado",
      "Hito observado",
      "Hito aprobado",
      "En cierre",
      "Cierre observado",
    ].includes(project.status)
  ) {
    return "Comenzado";
  }
  return "Fase inicial";
}

function formatDate(value) {
  if (!value) return "Pendiente";
  return new Date(value).toLocaleDateString("es-CL");
}

function getTeacher(project) {
  return project.application?.teacher || "Sin docente";
}

export default function DirectorProyectosPage() {
  ensureVcmData();
  const session = getSession();
  const [projects] = useState(getProjects);
  const [filters, setFilters] = useState({
    school: session?.role === "admin" ? "" : session?.school || "",
    status: "",
    phase: "",
    career: "",
    campus: "",
    teacher: "",
    modality: "",
    search: "",
  });

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const scopedProjects = useMemo(() => {
    if (session?.role === "admin") return projects;
    return projects.filter((project) => normalize(project.assignment?.school) === normalize(session?.school));
  }, [projects, session]);

  const teacherOptions = useMemo(() => {
    const teachers = scopedProjects.map((project) => project.application?.teacher).filter(Boolean);
    return [...new Set(teachers)].sort();
  }, [scopedProjects]);

  const filteredProjects = useMemo(() => {
    const search = normalize(filters.search);

    return scopedProjects.filter((project) => {
      const assignment = project.assignment || {};
      const execution = project.execution || {};
      const valuesForSearch = [
        project.title,
        project.entityName,
        project.description,
        project.objective,
        assignment.school,
        assignment.career,
        assignment.subject,
        assignment.campus,
        project.application?.teacher,
        project.status,
      ];

      return (
        (!filters.school || normalize(assignment.school) === normalize(filters.school)) &&
        (!filters.status || project.status === filters.status) &&
        (!filters.phase || getProjectPhase(project) === filters.phase) &&
        (!filters.career || assignment.career === filters.career) &&
        (!filters.campus || assignment.campus === filters.campus || execution.targetCampus === filters.campus) &&
        (!filters.teacher || project.application?.teacher === filters.teacher) &&
        (!filters.modality || execution.modality === filters.modality) &&
        (!search || valuesForSearch.some((value) => normalize(value).includes(search)))
      );
    });
  }, [filters, scopedProjects]);

  const stats = useMemo(
    () => ({
      total: filteredProjects.length,
      available: filteredProjects.filter((project) => getProjectPhase(project) === "Disponible").length,
      started: filteredProjects.filter((project) => getProjectPhase(project) === "Comenzado").length,
      finished: filteredProjects.filter((project) => getProjectPhase(project) === "Realizado").length,
    }),
    [filteredProjects],
  );

  const selectedSchool = filters.school || session?.school || "Todas las escuelas";
  const excelFileName = `proyectos-vcm-${slugify(selectedSchool)}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  const excelHref = useMemo(() => createXlsxDataUri(filteredProjects, selectedSchool, filters), [filteredProjects, filters, selectedSchool]);

  return (
    <AppShell active="director-proyectos">
      <PageIntro
        eyebrow={session?.role === "admin" ? "Vista director" : "Director de carrera"}
        title="Proyectos de escuela"
        description={`Seguimiento académico de proyectos VCM asociados a ${selectedSchool}.`}
        actions={
          <a
            href={excelHref}
            download={excelFileName}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f5b400] px-5 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#d99d00]"
          >
            <Download className="h-5 w-5" />
            Descargar Excel
          </a>
        }
      />

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Total filtrado" value={stats.total} />
        <StatCard icon={<Filter className="h-5 w-5" />} label="Disponibles" value={stats.available} />
        <StatCard icon={<Filter className="h-5 w-5" />} label="Comenzados" value={stats.started} />
        <StatCard icon={<Filter className="h-5 w-5" />} label="Realizados" value={stats.finished} />
      </div>

      <Section title="Filtros" subtitle="Acota la vista por etapa, estado académico, docente, sede o texto libre.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {session?.role === "admin" && (
            <SelectField label="Escuela" value={filters.school} onChange={(value) => updateFilter("school", value)} options={escuelas} placeholder="Todas las escuelas" />
          )}
          <SelectField label="Etapa" value={filters.phase} onChange={(value) => updateFilter("phase", value)} options={phaseOptions} placeholder="Todas las etapas" />
          <SelectField label="Estado" value={filters.status} onChange={(value) => updateFilter("status", value)} options={projectStatuses} placeholder="Todos los estados" />
          <SelectField label="Carrera" value={filters.career} onChange={(value) => updateFilter("career", value)} options={carreras} placeholder="Todas las carreras" />
          <SelectField label="Sede" value={filters.campus} onChange={(value) => updateFilter("campus", value)} options={sedes} placeholder="Todas las sedes" />
          <SelectField label="Docente" value={filters.teacher} onChange={(value) => updateFilter("teacher", value)} options={teacherOptions} placeholder="Todos los docentes" />
          <SelectField label="Modalidad" value={filters.modality} onChange={(value) => updateFilter("modality", value)} options={modalidades} placeholder="Todas las modalidades" />
          <TextInput label="Buscar" value={filters.search} onChange={(value) => updateFilter("search", value)} placeholder="Título, socio, docente o estado" icon={<Search className="h-5 w-5" />} />
        </div>
      </Section>

      <div className="mt-6">
        <Section title="Proyectos del área" subtitle="Incluye disponibles, comenzados, fase inicial, terminados y no continuados.">
          {filteredProjects.length === 0 ? (
            <EmptyState title="Sin proyectos" description="No hay proyectos que coincidan con los filtros seleccionados." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-neutral-500">
                    <HeaderCell>Proyecto</HeaderCell>
                    <HeaderCell>Etapa</HeaderCell>
                    <HeaderCell>Estado</HeaderCell>
                    <HeaderCell>Socio formador</HeaderCell>
                    <HeaderCell>Carrera / sede</HeaderCell>
                    <HeaderCell>Docente</HeaderCell>
                    <HeaderCell>Fechas</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="align-top">
                      <BodyCell>
                        <p className="font-black text-neutral-950">{project.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{project.objective || project.description}</p>
                      </BodyCell>
                      <BodyCell>{getProjectPhase(project)}</BodyCell>
                      <BodyCell>
                        <StatusBadge status={project.status} />
                      </BodyCell>
                      <BodyCell>{project.entityName || "Pendiente"}</BodyCell>
                      <BodyCell>
                        <p className="font-bold text-neutral-900">{project.assignment?.career || "Pendiente"}</p>
                        <p className="mt-1 text-xs text-neutral-500">{project.assignment?.campus || project.execution?.targetCampus || "Sin sede"}</p>
                      </BodyCell>
                      <BodyCell>{getTeacher(project)}</BodyCell>
                      <BodyCell>
                        <p>{formatDate(project.application?.startDate)}</p>
                        <p className="mt-1 text-xs text-neutral-500">{formatDate(project.application?.endDate)}</p>
                      </BodyCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </AppShell>
  );
}

function HeaderCell({ children }) {
  return <th className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 font-black">{children}</th>;
}

function BodyCell({ children }) {
  return <td className="border-b border-neutral-100 px-4 py-4 text-neutral-700">{children}</td>;
}

function buildExportRows(projects) {
  return projects.map((project) => {
    const phase = getProjectPhase(project);
    return {
    "ID": project.id,
    "Proyecto": project.title,
    "Socio formador": project.entityName || "",
    "Estado": project.status,
    "Etapa": phase,
    "Escuela": project.assignment?.school || "",
    "Carrera": project.assignment?.career || "",
    "Sede academica": project.assignment?.campus || "",
    "Asignatura": project.assignment?.subject || "",
    "Seccion": project.assignment?.section || "",
    "Semestre": project.assignment?.semester || "",
    "Docente": project.application?.teacher || "",
    "Estudiantes": project.application?.students || "",
    "Fecha inicio": project.application?.startDate || "",
    "Fecha termino": project.application?.endDate || "",
    "Modalidad": project.execution?.modality || "",
    "Sede destino": project.execution?.targetCampus || "",
    "Equipos": project.execution?.teamCount || "",
    "Personas por equipo": project.execution?.peoplePerTeam || "",
    "Creado": project.createdAt || "",
    "Necesidad": project.description || "",
    "Objetivo": project.objective || "",
    "Resultados esperados": project.expectedResults || "",
    "Lectura rapida": getPhaseRecommendation(phase),
  };
  });
}

function escapeXml(value) {
  return stripInvalidXmlChars(String(value ?? ""))
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripInvalidXmlChars(value) {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || code >= 32;
    })
    .join("");
}

function slugify(value) {
  return normalize(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "proyectos";
}

function getPhaseRecommendation(phase) {
  const messages = {
    "Fase inicial": "Revisar definición, validaciones y asignación pendiente.",
    Disponible: "Disponible para toma docente; monitorear plazo de postulación.",
    Comenzado: "Revisar docente, fechas, hitos y evidencias de avance.",
    Realizado: "Proyecto cerrado o publicado; útil para reporte de resultados.",
    "No continuado": "Revisar motivo de cancelación o rechazo.",
  };
  return messages[phase] || "Revisar seguimiento general.";
}

function createXlsxDataUri(projects, school, filters) {
  const files = buildWorkbookFiles(projects, school, filters);
  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${createZipBase64(files)}`;
}

function buildWorkbookFiles(projects, school, filters) {
  return {
    "[Content_Types].xml": contentTypesXml(),
    "_rels/.rels": packageRelsXml(),
    "xl/workbook.xml": workbookXml(),
    "xl/_rels/workbook.xml.rels": workbookRelsXml(),
    "xl/styles.xml": stylesXml(),
    "xl/worksheets/sheet1.xml": summarySheetXml(projects, school, filters),
    "xl/worksheets/sheet2.xml": projectsSheetXml(projects, school),
    "xl/worksheets/sheet3.xml": dictionarySheetXml(),
  };
}

function contentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;
}

function packageRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
}

function workbookXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Resumen" sheetId="1" r:id="rId1"/>
    <sheet name="Proyectos" sheetId="2" r:id="rId2"/>
    <sheet name="Diccionario" sheetId="3" r:id="rId3"/>
  </sheets>
</workbook>`;
}

function workbookRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
}

function stylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4">
    <font><sz val="10"/><color rgb="FF111111"/><name val="Arial"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>
    <font><b/><sz val="15"/><color rgb="FF111111"/><name val="Arial"/></font>
    <font><b/><sz val="10"/><color rgb="FF111111"/><name val="Arial"/></font>
  </fonts>
  <fills count="10">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF5B400"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF111111"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE6F1FB"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFF8DF"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE8F5E9"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFEBEE"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFEEF2FF"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FFD9D9D9"/></left><right style="thin"><color rgb="FFD9D9D9"/></right><top style="thin"><color rgb="FFD9D9D9"/></top><bottom style="thin"><color rgb="FFD9D9D9"/></bottom><diagonal/></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="13">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="3" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="3" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="3" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="3" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFill="1" applyBorder="1"/>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
}

function summarySheetXml(projects, school, filters) {
  const stats = phaseOptions.map((phase) => [phase, projects.filter((project) => getProjectPhase(project) === phase).length]);
  const filterText = Object.entries(filters)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ") || "Sin filtros adicionales";
  const rows = [
    row(1, [cell("A1", "Reporte VCM por escuela", 1)]),
    row(3, [cell("A3", "Escuela", 11), cell("B3", school, 10)]),
    row(4, [cell("A4", "Generado", 11), cell("B4", new Date().toLocaleString("es-CL"), 10)]),
    row(5, [cell("A5", "Filtros", 11), cell("B5", filterText, 10)]),
    row(7, [cell("A7", "Indicador", 2), cell("B7", "Cantidad", 2), cell("C7", "Lectura", 2)]),
    row(8, [cell("A8", "Total de proyectos", 4), numberCell("B8", projects.length, 4), cell("C8", "Base filtrada exportada", 10)]),
    ...stats.map(([phase, count], index) =>
      row(9 + index, [cell(`A${9 + index}`, phase, phaseStyle(phase)), numberCell(`B${9 + index}`, count, phaseStyle(phase)), cell(`C${9 + index}`, getPhaseRecommendation(phase), 10)]),
    ),
  ];
  return worksheetXml({
    cols: [22, 16, 70, 18],
    rows,
    mergeCells: ["A1:D1"],
    autoFilter: "A7:C13",
  });
}

function projectsSheetXml(projects, school) {
  const rows = buildExportRows(projects);
  const headers = Object.keys(rows[0] || buildExportRows([{}])[0]);
  const headerRowIndex = 4;
  const sheetRows = [
    row(1, [cell("A1", `Proyectos VCM - ${school}`, 1)]),
    row(2, [cell("A2", `Exportado: ${new Date().toLocaleString("es-CL")}`, 12)]),
    row(headerRowIndex, headers.map((header, index) => cell(`${columnName(index + 1)}${headerRowIndex}`, header, 2))),
    ...rows.map((item, rowIndex) => {
      const excelRow = headerRowIndex + rowIndex + 1;
      return row(excelRow, headers.map((header, colIndex) => cell(`${columnName(colIndex + 1)}${excelRow}`, item[header], header === "Etapa" ? phaseStyle(item[header]) : 10)));
    }),
  ];
  const lastColumn = columnName(headers.length);
  const lastRow = Math.max(headerRowIndex + rows.length, headerRowIndex + 1);
  return worksheetXml({
    cols: [16, 34, 24, 28, 18, 28, 24, 18, 24, 12, 12, 24, 12, 14, 14, 14, 16, 10, 16, 22, 40, 42, 42, 48],
    rows: sheetRows,
    mergeCells: [`A1:${lastColumn}1`, `A2:${lastColumn}2`],
    autoFilter: `A${headerRowIndex}:${lastColumn}${lastRow}`,
    freezePane: true,
  });
}

function dictionarySheetXml() {
  const rows = [
    row(1, [cell("A1", "Diccionario de lectura", 1)]),
    row(3, [cell("A3", "Etapa", 2), cell("B3", "Qué significa", 2), cell("C3", "Uso sugerido", 2)]),
    row(4, [cell("A4", "Fase inicial", phaseStyle("Fase inicial")), cell("B4", "Propuesta en revisión, validación o asignación inicial.", 10), cell("C4", getPhaseRecommendation("Fase inicial"), 10)]),
    row(5, [cell("A5", "Disponible", phaseStyle("Disponible")), cell("B5", "Proyecto publicado para toma docente.", 10), cell("C5", getPhaseRecommendation("Disponible"), 10)]),
    row(6, [cell("A6", "Comenzado", phaseStyle("Comenzado")), cell("B6", "Proyecto tomado o en ejecución con docente.", 10), cell("C6", getPhaseRecommendation("Comenzado"), 10)]),
    row(7, [cell("A7", "Realizado", phaseStyle("Realizado")), cell("B7", "Proyecto finalizado o publicado como experiencia.", 10), cell("C7", getPhaseRecommendation("Realizado"), 10)]),
    row(8, [cell("A8", "No continuado", phaseStyle("No continuado")), cell("B8", "Proyecto cancelado o rechazado.", 10), cell("C8", getPhaseRecommendation("No continuado"), 10)]),
  ];
  return worksheetXml({
    cols: [22, 52, 60],
    rows,
    mergeCells: ["A1:C1"],
    autoFilter: "A3:C8",
  });
}

function phaseStyle(phase) {
  const styles = {
    "Fase inicial": 4,
    Disponible: 5,
    Comenzado: 9,
    Realizado: 6,
    "No continuado": 7,
  };
  return styles[phase] || 8;
}

function worksheetXml({ cols, rows, mergeCells = [], autoFilter, freezePane = false }) {
  const colsXml = cols.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join("");
  const paneXml = freezePane ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' : "";
  const mergeXml = mergeCells.length ? `<mergeCells count="${mergeCells.length}">${mergeCells.map((ref) => `<mergeCell ref="${ref}"/>`).join("")}</mergeCells>` : "";
  const filterXml = autoFilter ? `<autoFilter ref="${autoFilter}"/>` : "";
  const dimension = inferDimension(rows);
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="${dimension}"/>
  ${paneXml}
  <cols>${colsXml}</cols>
  <sheetData>${rows.join("")}</sheetData>
  ${filterXml}
  ${mergeXml}
</worksheet>`;
}

function row(index, cells) {
  return `<row r="${index}">${cells.join("")}</row>`;
}

function cell(reference, value, style = 0) {
  const text = escapeXml(value);
  const preserveSpace = /^\s|\s$|\n|\r/.test(String(value ?? "")) ? ' xml:space="preserve"' : "";
  return `<c r="${reference}" s="${style}" t="inlineStr"><is><t${preserveSpace}>${text}</t></is></c>`;
}

function numberCell(reference, value, style = 0) {
  return `<c r="${reference}" s="${style}"><v>${Number(value) || 0}</v></c>`;
}

function columnName(index) {
  let name = "";
  let current = index;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

function inferDimension(rows) {
  const references = rows.join("").match(/<c r="([A-Z]+[0-9]+)"/g) || [];
  const cells = references.map((match) => match.replace('<c r="', "").replace('"', ""));
  if (!cells.length) return "A1";

  let maxColumn = 1;
  let maxRow = 1;
  for (const reference of cells) {
    const [, column, rowNumber] = reference.match(/^([A-Z]+)(\d+)$/) || [];
    if (!column || !rowNumber) continue;
    maxColumn = Math.max(maxColumn, columnIndex(column));
    maxRow = Math.max(maxRow, Number(rowNumber));
  }

  return `A1:${columnName(maxColumn)}${maxRow}`;
}

function columnIndex(name) {
  return name.split("").reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0);
}

function createZipBase64(files) {
  const encoder = new TextEncoder();
  const fileEntries = Object.entries(files).map(([path, content]) => ({ path, data: encoder.encode(content) }));
  const chunks = [];
  const centralDirectory = [];
  let offset = 0;

  for (const entry of fileEntries) {
    const nameBytes = encoder.encode(entry.path);
    const crc = crc32(entry.data);
    const localHeader = concatBytes(
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(entry.data.length),
      u32(entry.data.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
    );
    chunks.push(localHeader, entry.data);
    centralDirectory.push(
      concatBytes(
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(entry.data.length),
        u32(entry.data.length),
        u16(nameBytes.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        nameBytes,
      ),
    );
    offset += localHeader.length + entry.data.length;
  }

  const centralOffset = offset;
  const centralBytes = concatBytes(...centralDirectory);
  const endRecord = concatBytes(
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(fileEntries.length),
    u16(fileEntries.length),
    u32(centralBytes.length),
    u32(centralOffset),
    u16(0),
  );

  return bytesToBase64(concatBytes(...chunks, centralBytes, endRecord));
}

function u16(value) {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function u32(value) {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
}

function concatBytes(...arrays) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
