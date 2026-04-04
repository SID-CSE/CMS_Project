const STORAGE_KEYS = {
  admin: "contify_content_admin",
  editor: "contify_content_editor",
  stakeholder: "contify_content_stakeholder",
};

const AUDIT_KEYS = {
  admin: "contify_content_audit_admin",
  editor: "contify_content_audit_editor",
  stakeholder: "contify_content_audit_stakeholder",
};

const defaultItems = {
  admin: [
    { id: "admin-1", title: "Homepage hero update", owner: "Admin Desk", summary: "Refresh CTA copy and visuals.", status: "Draft", updatedAt: "2026-04-03T08:00:00.000Z" },
    { id: "admin-2", title: "Editor onboarding guide", owner: "Contify Team", summary: "Document workflow steps for new editors.", status: "In Progress", updatedAt: "2026-04-03T08:20:00.000Z" },
    { id: "admin-3", title: "Stakeholder approval notes", owner: "Stakeholder Desk", summary: "Collect sign-off on final release.", status: "In Review", updatedAt: "2026-04-03T08:35:00.000Z" },
    { id: "admin-4", title: "April content calendar", owner: "Admin Desk", summary: "Planned editorial schedule for the month.", status: "Approved", updatedAt: "2026-04-03T08:42:00.000Z" },
    { id: "admin-5", title: "Archived campaign draft", owner: "Contify Team", summary: "Needs rework before resubmission.", status: "Rejected", updatedAt: "2026-04-03T08:50:00.000Z" },
  ],
  editor: [
    { id: "editor-1", title: "AI trends explainer", owner: "Editor Team", summary: "Initial article draft in progress.", status: "Draft", updatedAt: "2026-04-03T08:00:00.000Z" },
    { id: "editor-2", title: "Launch page copy", owner: "Editor Team", summary: "Working through copy blocks.", status: "In Progress", updatedAt: "2026-04-03T08:20:00.000Z" },
    { id: "editor-3", title: "SEO checklist review", owner: "Admin Desk", summary: "Needs editorial and stakeholder review.", status: "In Review", updatedAt: "2026-04-03T08:35:00.000Z" },
    { id: "editor-4", title: "Newsletter edition", owner: "Contify", summary: "Approved and scheduled.", status: "Approved", updatedAt: "2026-04-03T08:42:00.000Z" },
    { id: "editor-5", title: "Old blog rewrite", owner: "Editor Team", summary: "Rejected pending restructure.", status: "Rejected", updatedAt: "2026-04-03T08:50:00.000Z" },
  ],
  stakeholder: [
    { id: "stakeholder-1", title: "Product launch approval", owner: "Stakeholder Desk", summary: "Draft waiting for editing.", status: "Draft", updatedAt: "2026-04-03T08:00:00.000Z" },
    { id: "stakeholder-2", title: "Customer success guide", owner: "Stakeholder Desk", summary: "Preparing content for review.", status: "In Progress", updatedAt: "2026-04-03T08:20:00.000Z" },
    { id: "stakeholder-3", title: "Quarterly report copy", owner: "Admin Desk", summary: "Ready for final approval.", status: "In Review", updatedAt: "2026-04-03T08:35:00.000Z" },
    { id: "stakeholder-4", title: "Approved case study", owner: "Contify", summary: "Live and published.", status: "Approved", updatedAt: "2026-04-03T08:42:00.000Z" },
    { id: "stakeholder-5", title: "Rejected product note", owner: "Stakeholder Desk", summary: "Needs revisions before publish.", status: "Rejected", updatedAt: "2026-04-03T08:50:00.000Z" },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getKey(role) {
  return STORAGE_KEYS[role];
}

function getAuditKey(role) {
  return AUDIT_KEYS[role];
}

export function getInitialContentItems(role) {
  return clone(defaultItems[role] || []);
}

export function loadContentItems(role) {
  const key = getKey(role);
  const raw = localStorage.getItem(key);
  if (!raw) {
    const seed = getInitialContentItems(role);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : getInitialContentItems(role);
}

export function saveContentItems(role, items) {
  localStorage.setItem(getKey(role), JSON.stringify(items));
}

export function loadAuditLog(role) {
  const key = getAuditKey(role);
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify([]));
    return [];
  }
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function appendAuditEntry(role, entry) {
  const current = loadAuditLog(role);
  const next = [
    {
      id: `${role}-audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    },
    ...current,
  ];
  localStorage.setItem(getAuditKey(role), JSON.stringify(next));
  return next;
}

export function updateContentStatus(role, itemId, nextStatus, actorLabel) {
  const items = loadContentItems(role);
  const item = items.find((entry) => entry.id === itemId);
  if (!item) return { items, audit: loadAuditLog(role) };

  const previousStatus = item.status;
  const updatedItems = items.map((entry) =>
    entry.id === itemId
      ? { ...entry, status: nextStatus, updatedAt: new Date().toISOString() }
      : entry
  );

  saveContentItems(role, updatedItems);
  const audit = appendAuditEntry(role, {
    itemId,
    itemTitle: item.title,
    previousStatus,
    nextStatus,
    actor: actorLabel,
    message: `${item.title} moved from ${previousStatus} to ${nextStatus}`,
  });

  return { items: updatedItems, audit };
}

export function createContentDraft(role, draft) {
  const items = loadContentItems(role);
  const next = [
    {
      id: `${role}-${Date.now()}`,
      title: draft.title,
      owner: draft.owner,
      summary: draft.summary,
      status: "Draft",
      updatedAt: new Date().toISOString(),
    },
    ...items,
  ];
  saveContentItems(role, next);
  appendAuditEntry(role, {
    itemId: next[0].id,
    itemTitle: draft.title,
    previousStatus: null,
    nextStatus: "Draft",
    actor: draft.actor || role,
    message: `${draft.title} created in Draft`,
  });
  return next;
}

export const contentRoles = {
  admin: {
    roleLabel: "Admin",
    basePath: "/admin/content",
    nextStep: {
      Draft: "In Progress",
      "In Progress": "In Review",
      "In Review": "Approved",
    },
    canReject: true,
    canCreate: false,
    canEditAny: true,
  },
  editor: {
    roleLabel: "Editor",
    basePath: "/editor/content",
    nextStep: {
      Draft: "In Progress",
      "In Progress": "In Review",
    },
    canReject: false,
    canCreate: true,
    canEditAny: false,
  },
  stakeholder: {
    roleLabel: "Stakeholder",
    basePath: "/stakeholder/content",
    nextStep: {
      Draft: "In Progress",
      "In Progress": "In Review",
      "In Review": "Approved",
    },
    canReject: true,
    canCreate: false,
    canEditAny: false,
  },
};
