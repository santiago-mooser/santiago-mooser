const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

const MONTHS = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

// Feather icons (MIT), 24x24 stroke outlines
const ICONS = {
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v1.5A6 6 0 0 1 16 8z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
};

function icon(name) {
  const body = ICONS[name] || ICONS.globe;
  return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

function fmtDate(d) {
  if (!d) return null;
  const y = d.slice(0, 4);
  const m = MONTHS[d.slice(5, 7)];
  return m ? `${m} ${y}` : y;
}

function dateRange(start, end) {
  const a = fmtDate(start);
  if (!a) return null;
  return `${a} – ${end ? fmtDate(end) : 'Present'}`;
}

function profileIcon(network) {
  const n = (network || '').toLowerCase();
  if (n === 'github') return icon('github');
  if (n === 'linkedin') return icon('linkedin');
  if (n === 'cv' || n === 'resume') return icon('file');
  return icon('globe');
}

function render(resume) {
  const basics = resume.basics || {};
  const view = {};

  view.basics = basics;
  view.pageTitle = basics.label ? `${basics.name} — ${basics.label}` : basics.name;
  view.metaDescription = [
    basics.name,
    basics.label ? ` — ${basics.label}` : null,
    basics.location && basics.location.city ? `, based in ${basics.location.city}.` : '.',
    ' Resume, projects, and contact.',
  ].filter(Boolean).join('');
  view.city = basics.location && basics.location.city;
  view.canonical = basics.url && !basics.url.endsWith('/') ? `${basics.url}/` : basics.url;

  view.profiles = (basics.profiles || []).map((p) => ({
    label: p.network === 'CV' ? (p.username || 'CV') : p.network,
    url: p.url,
    iconSvg: profileIcon(p.network),
    cssClass: (p.network || '').toLowerCase() === 'cv' ? 'cv-link' : '',
  }));
  view.mailIcon = icon('mail');
  view.pinIcon = icon('pin');
  view.extIcon = icon('external');

  view.work = (resume.work || []).map((w) => ({
    ...w,
    dates: dateRange(w.startDate, w.endDate),
    hasHighlights: Boolean(w.highlights && w.highlights.length),
  }));
  view.hasWork = view.work.length > 0;

  view.projects = (resume.projects || []).map((p) => ({
    ...p,
    hasUrl: Boolean(p.url),
    hasKeywords: Boolean(p.keywords && p.keywords.length),
  }));
  view.hasProjects = view.projects.length > 0;

  view.education = (resume.education || []).map((e) => ({
    ...e,
    degree: [e.studyType, e.area].filter(Boolean).join(', '),
    dates: dateRange(e.startDate, e.endDate),
    hasCourses: Boolean(e.courses && e.courses.length),
    hasHighlights: Boolean(e.highlights && e.highlights.length),
  }));
  view.hasEducation = view.education.length > 0;

  view.skills = resume.skills || [];
  view.hasSkills = view.skills.length > 0;

  view.certificates = (resume.certificates || []).map((c) => ({
    ...c,
    year: c.date ? c.date.slice(0, 4) : null,
    hasUrl: Boolean(c.url),
  }));
  view.hasCertificates = view.certificates.length > 0;

  view.languages = resume.languages || [];
  view.hasLanguages = view.languages.length > 0;

  view.interests = resume.interests || [];
  view.hasInterests = view.interests.length > 0;

  view.references = (resume.references || []).filter((r) => r.reference && r.reference.trim() !== '');
  view.hasReferences = view.references.length > 0;

  view.lastModified = resume.meta && resume.meta.lastModified
    ? fmtDate(resume.meta.lastModified) : null;

  view.jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: basics.name,
    jobTitle: basics.label,
    email: basics.email ? `mailto:${basics.email}` : undefined,
    url: basics.url,
    image: basics.image,
    address: view.city ? { '@type': 'PostalAddress', addressLocality: view.city } : undefined,
    sameAs: (basics.profiles || []).filter((p) => p.network !== 'CV').map((p) => p.url),
    alumniOf: (resume.education || []).map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
    worksFor: resume.work && resume.work[0] ? { '@type': 'Organization', name: resume.work[0].name } : undefined,
  });

  view.css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
  view.printcss = fs.readFileSync(path.join(__dirname, 'print.css'), 'utf-8');

  const template = fs.readFileSync(path.join(__dirname, 'resume.template'), 'utf-8');
  return Mustache.render(template, view);
}

module.exports = { render };
