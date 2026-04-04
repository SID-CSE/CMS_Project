export const roleProfileConfig = {
  admin: {
    roleLabel: "Admin",
    storageKey: "contify_profile_admin",
    accent: "blue",
    defaultProfile: {
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      bio: "",
      team: "Operations",
      responsibilities: "",
      governanceNotes: "",
      profileImage: "",
    },
    infoSections: [
      { key: "team", label: "Team" },
      { key: "responsibilities", label: "Core Responsibilities" },
      { key: "governanceNotes", label: "Governance Notes" },
    ],
    formSections: [
      {
        title: "Basic Information",
        fields: [
          { key: "firstName", label: "First Name", type: "text", required: true },
          { key: "lastName", label: "Last Name", type: "text" },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "location", label: "Location", type: "text" },
        ],
      },
      {
        title: "Administrative Details",
        fields: [
          { key: "team", label: "Team", type: "text" },
          { key: "responsibilities", label: "Core Responsibilities", type: "textarea" },
          { key: "governanceNotes", label: "Governance Notes", type: "textarea" },
          { key: "bio", label: "Professional Bio", type: "textarea" },
        ],
      },
    ],
  },
  editor: {
    roleLabel: "Editor",
    storageKey: "contify_profile_editor",
    accent: "emerald",
    defaultProfile: {
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      bio: "",
      specialization: "",
      skills: "",
      currentFocus: "",
      portfolioNotes: "",
      profileImage: "",
    },
    infoSections: [
      { key: "specialization", label: "Specialization" },
      { key: "skills", label: "Skills" },
      { key: "currentFocus", label: "Current Focus" },
      { key: "portfolioNotes", label: "Portfolio Notes" },
    ],
    formSections: [
      {
        title: "Basic Information",
        fields: [
          { key: "firstName", label: "First Name", type: "text", required: true },
          { key: "lastName", label: "Last Name", type: "text" },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "location", label: "Location", type: "text" },
        ],
      },
      {
        title: "Editorial Profile",
        fields: [
          { key: "specialization", label: "Specialization", type: "text" },
          { key: "skills", label: "Skills (comma separated)", type: "textarea" },
          { key: "currentFocus", label: "Current Focus", type: "textarea" },
          { key: "portfolioNotes", label: "Portfolio Notes", type: "textarea" },
          { key: "bio", label: "Professional Bio", type: "textarea" },
        ],
      },
    ],
  },
  stakeholder: {
    roleLabel: "Stakeholder",
    storageKey: "contify_profile_stakeholder",
    accent: "violet",
    defaultProfile: {
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      bio: "",
      company: "",
      designation: "",
      priorities: "",
      decisionNotes: "",
      profileImage: "",
    },
    infoSections: [
      { key: "company", label: "Organization" },
      { key: "designation", label: "Designation" },
      { key: "priorities", label: "Strategic Priorities" },
      { key: "decisionNotes", label: "Decision Notes" },
    ],
    formSections: [
      {
        title: "Basic Information",
        fields: [
          { key: "firstName", label: "First Name", type: "text", required: true },
          { key: "lastName", label: "Last Name", type: "text" },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "location", label: "Location", type: "text" },
        ],
      },
      {
        title: "Stakeholder Profile",
        fields: [
          { key: "company", label: "Organization", type: "text" },
          { key: "designation", label: "Designation", type: "text" },
          { key: "priorities", label: "Strategic Priorities", type: "textarea" },
          { key: "decisionNotes", label: "Decision Notes", type: "textarea" },
          { key: "bio", label: "Professional Bio", type: "textarea" },
        ],
      },
    ],
  },
};
