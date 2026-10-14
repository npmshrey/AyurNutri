// src/config/site.js
// Details that appear in the legal pages and footer. Set the contact email
// with VITE_CONTACT_EMAIL (Vercel > Settings > Environment Variables) so it
// isn't hardcoded; until then the pages point people to their practitioner.
export const SITE = {
  name: "AyurNutri",
  owner: "the AyurNutri project team, ABES Institute of Technology, Ghaziabad",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "",
  legalUpdated: "14 October 2026",
};
