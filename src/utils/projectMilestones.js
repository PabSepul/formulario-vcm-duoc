const actionableStatuses = new Set(["Pendiente", "Observado"]);

function normalizeTitle(value) {
  return String(value || "").trim().toLocaleLowerCase("es-CL");
}

export function getNextActionableMilestone(milestones = []) {
  return milestones.find((milestone) => actionableStatuses.has(milestone.status)) || null;
}

export function areMilestonesComplete(milestones = []) {
  return milestones.length > 0 && milestones.every((milestone) => milestone.status === "Aprobado");
}

export function submitMilestoneForReview(milestones = [], draft, createdAt = new Date().toISOString()) {
  const nextMilestone = getNextActionableMilestone(milestones);

  if (!nextMilestone) {
    throw new Error("Todos los hitos comprometidos ya fueron aprobados. Puedes solicitar el cierre.");
  }

  if (normalizeTitle(nextMilestone.title) !== normalizeTitle(draft.title)) {
    throw new Error(`El próximo hito comprometido es "${nextMilestone.title}".`);
  }

  const submittedMilestone = {
    ...nextMilestone,
    comments: draft.comments.trim(),
    evidence: draft.evidence.trim(),
    status: "En revisión",
    createdAt,
  };
  delete submittedMilestone.observation;
  delete submittedMilestone.reviewedAt;
  delete submittedMilestone.reviewComment;

  return [
    submittedMilestone,
    ...milestones.filter((milestone) => milestone.id !== nextMilestone.id),
  ];
}
