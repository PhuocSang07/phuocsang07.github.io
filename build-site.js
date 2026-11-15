#!/usr/bin/env node

/**
 * Render content/site-data.js into the marker regions of index.html.
 *
 * Usage: node build-site.js
 *
 * Each region looks like:
 *   <!-- build:news -->  ...generated...  <!-- /build:news -->
 * Everything between a pair of markers is replaced. Running twice is a no-op.
 * Invalid data aborts with exit code 1 and names the offending field.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_PATH = path.join(ROOT, 'content', 'site-data.js');
const INDEX_PATH = path.join(ROOT, 'index.html');
const NEWS_VISIBLE = 5;

// [links key, label, icon]
const PROFILE_LINKS = [
  ['scholar', 'Google Scholar', 'scholar'],
  ['github', 'GitHub', 'github'],
  ['huggingface', 'Hugging Face', 'huggingface'],
  ['linkedin', 'LinkedIn', 'linkedin'],
  ['orcid', 'ORCID', 'orcid'],
];
const PUB_LINKS = [['url', 'Paper'], ['pdf', 'PDF'], ['arxiv', 'arXiv'], ['code', 'Code'], ['slides', 'Slides']];
const PROJECT_LINKS = [
  ['code', 'Code', 'github'],
  ['model', 'Model', 'huggingface'],
  ['dataset', 'Dataset', 'file'],
  ['demo', 'Demo', 'external'],
  ['paper', 'Paper', 'file'],
];
// [region / section id, title]. Page order; also drives the top navigation.
const SECTIONS = [
  ['about', 'About'],
  ['news', 'News'],
  ['publications', 'Publications'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['awards', 'Awards'],
];
const SECTION_TITLES = Object.fromEntries(SECTIONS);
const AFFILIATION_ICONS = { work: 'briefcase', study: 'cap', lab: 'flask' };
const ENTRY_LINK_LABELS = { results: 'Official results', website: 'Website' };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Inline SVG icons, one stroke family (Lucide, ISC licence) so every glyph matches.
const ICONS = {
  cap: {
    body: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  },
  smile: {
    body: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
  },
  id: { body: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 8v8"/><path d="M12 8h1.5a4 4 0 0 1 0 8H12z"/>' },
  mail: { body: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' },
  pin: { body: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>' },
  briefcase: { body: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' },
  flask: {
    body: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  },
  file: {
    body: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  },
  external: { body: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>' },
  github: {
    body: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  },
  linkedin: {
    body: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  },
  moon: { body: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' },
  sun: {
    body: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  },
};
ICONS.scholar = ICONS.cap;
ICONS.orcid = ICONS.id;
ICONS.huggingface = ICONS.smile;

// ---------- helpers ----------

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const has = (value) => (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== '');

const list = (value) => (Array.isArray(value) ? value : []);

const isExternal = (url) => /^(https?:)?\/\//.test(url);

function icon(name, size = 16, cls = 'icon') {
  return `<svg class="${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name].body}</svg>`;
}

function link(url, text, cls) {
  const rel = isExternal(url) ? ' rel="noopener"' : '';
  const klass = cls ? ` class="${cls}"` : '';
  return `<a href="${esc(url)}"${klass}${rel}>${text}</a>`;
}

function maybeLink(url, text) {
  return has(url) ? link(url, esc(text)) : esc(text);
}

// Plain text list; separators are drawn in CSS.
function inlineList(items, cls = '') {
  const lis = list(items).map((t) => `<li>${esc(t)}</li>`);
  return `<ul class="inline-list${cls ? ` ${cls}` : ''}">${lis.join('')}</ul>`;
}

function bulletList(items) {
  return `<ul class="bullets">\n${indent(list(items).map((b) => `<li>${esc(b)}</li>`).join('\n'), 2)}\n</ul>`;
}

// "YYYY-MM" -> "Jun 2025"; "YYYY" -> "2025".
function formatMonth(ym) {
  const [y, m] = String(ym).split('-').map(Number);
  return m ? `${MONTHS[m - 1]} ${y}` : String(y);
}

const hasMonth = (ym) => /^\d{4}-\d{2}$/.test(String(ym));

function formatRange(start, end) {
  if (!has(start)) return has(end) ? formatMonth(end) : '';
  return `${formatMonth(start)} – ${has(end) ? formatMonth(end) : 'Present'}`;
}

const indent = (html, spaces) =>
  html
    .split('\n')
    .map((line) => (line.trim() ? ' '.repeat(spaces) + line : ''))
    .join('\n');

function initialsOf(p) {
  if (has(p.initials)) return p.initials;
  const words = p.name.trim().split(/\s+/);
  return words
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// ---------- validation ----------

function validate(data) {
  const errors = [];
  const ym = /^\d{4}(-(0[1-9]|1[0-2]))?$/;
  const need = (obj, field, where) => {
    if (!obj || !has(obj[field])) errors.push(`${where}.${field} is required`);
  };
  const month = (obj, field, where) => {
    if (has(obj[field]) && !ym.test(obj[field])) errors.push(`${where}.${field} must be "YYYY-MM" or "YYYY" (got "${obj[field]}")`);
  };

  const p = data.profile;
  if (!p) errors.push('profile is required');
  else ['name', 'headline', 'email'].forEach((f) => need(p, f, 'profile'));
  if (p && (!p.seo || !has(p.seo.url))) errors.push('profile.seo.url is required');
  if (p) {
    list(p.affiliations).forEach((a, i) => {
      const w = `profile.affiliations[${i}]`;
      need(a, 'label', w);
      if (!AFFILIATION_ICONS[a && a.kind]) errors.push(`${w}.kind must be one of: ${Object.keys(AFFILIATION_ICONS).join(', ')}`);
    });
  }

  list(data.news).forEach((n, i) => {
    const w = `news[${i}]`;
    need(n, 'date', w);
    need(n, 'textHtml', w);
    month(n, 'date', w);
  });
  list(data.publications).forEach((pub, i) => {
    const w = `publications[${i}]`;
    ['title', 'venueShort', 'year'].forEach((f) => need(pub, f, w));
    if (!has(pub.authors)) errors.push(`${w}.authors must be a non-empty array`);
    list(pub.authors).forEach((a, j) => need(a, 'name', `${w}.authors[${j}]`));
  });
  list(data.projects).forEach((pr, i) => ['title', 'description'].forEach((f) => need(pr, f, `projects[${i}]`)));
  list(data.experience).forEach((e, i) => {
    const w = `experience[${i}]`;
    ['role', 'org', 'start'].forEach((f) => need(e, f, w));
    month(e, 'start', w);
    month(e, 'end', w);
  });
  list(data.education).forEach((e, i) => {
    const w = `education[${i}]`;
    ['degree', 'school'].forEach((f) => need(e, f, w));
    month(e, 'start', w);
    month(e, 'end', w);
  });
  list(data.awards).forEach((a, i) => {
    const w = `awards[${i}]`;
    ['year', 'title'].forEach((f) => need(a, f, w));
    list(a.images).forEach((img, j) => ['src', 'alt', 'width', 'height'].forEach((f) => need(img, f, `${w}.images[${j}]`)));
  });
  list(data.projects).forEach((pr, i) => {
    if (pr.image && has(pr.image.src)) ['alt', 'width', 'height'].forEach((f) => need(pr.image, f, `projects[${i}].image`));
  });
  if (p && p.photo && has(p.photo.src)) ['width', 'height'].forEach((f) => need(p.photo, f, 'profile.photo'));

  return errors;
}

// ---------- renderers ----------

// Sections are numbered in page order; main() renders them top to bottom.
let sectionNo = 0;

const photoOf = (p) => (p.photo && has(p.photo.src) ? p.photo : null);

function section(id, bodyHtml) {
  const title = SECTION_TITLES[id];
  sectionNo += 1;
  const no = String(sectionNo).padStart(2, '0');
  return [
    `<section id="${id}" class="section" aria-labelledby="${id}-title">`,
    `  <h2 id="${id}-title" class="section-label"><span class="section-no" aria-hidden="true">${no}</span><span>${title}</span></h2>`,
    `  <div class="section-body">\n${indent(bodyHtml, 4)}\n  </div>`,
    '</section>',
  ].join('\n');
}

function renderHeadMeta(data) {
  const p = data.profile;
  const seo = p.seo;
  const base = seo.url.endsWith('/') ? seo.url : `${seo.url}/`;
  const abs = (u) => (isExternal(u) ? u : base + u.replace(/^\//, ''));
  const lines = [
    `<title>${esc(seo.title || p.name)}</title>`,
    `<meta name="description" content="${esc(seo.description || '')}">`,
    `<meta name="author" content="${esc(p.name)}">`,
    `<link rel="canonical" href="${esc(base)}">`,
    `<meta property="og:type" content="profile">`,
    `<meta property="og:title" content="${esc(seo.title || p.name)}">`,
    `<meta property="og:description" content="${esc(seo.description || '')}">`,
    `<meta property="og:url" content="${esc(base)}">`,
  ];
  if (has(seo.ogImage)) {
    lines.push(`<meta property="og:image" content="${esc(abs(seo.ogImage))}">`);
    lines.push(`<meta name="twitter:card" content="summary_large_image">`);
  } else {
    lines.push(`<meta name="twitter:card" content="summary">`);
  }

  const links = p.links || {};
  const person = {
    '@type': 'Person',
    '@id': `${base}#person`,
    name: p.name,
    url: base,
    email: `mailto:${p.email}`,
    jobTitle: p.headline,
  };
  if (has(p.nameNative)) person.alternateName = p.nameNative;
  if (photoOf(p)) person.image = abs(photoOf(p).src);
  if (has(p.location)) person.homeLocation = { '@type': 'Place', name: p.location };
  const sameAs = PROFILE_LINKS.map(([k]) => links[k]).filter(has);
  if (sameAs.length) person.sameAs = sameAs;
  if (has(p.interests)) person.knowsAbout = p.interests;
  const current = list(data.experience).find((e) => !has(e.end));
  if (current) person.worksFor = { '@type': 'Organization', name: current.org };
  const schools = [...new Set(list(data.education).map((e) => e.school))].map((name) => ({ '@type': 'CollegeOrUniversity', name }));
  if (schools.length) person.alumniOf = schools;

  const articles = list(data.publications).map((pub) => {
    const article = {
      '@type': 'ScholarlyArticle',
      headline: pub.title,
      name: pub.title,
      datePublished: String(pub.year),
      author: pub.authors.map((a) => (a.me ? { '@id': `${base}#person` } : { '@type': 'Person', name: a.name })),
    };
    if (has(pub.venue || pub.venueShort)) article.isPartOf = { '@type': 'PublicationEvent', name: pub.venue || pub.venueShort };
    const url = pub.links && (pub.links.url || pub.links.arxiv || pub.links.pdf);
    if (has(url)) article.url = abs(url);
    return article;
  });

  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, ...articles] }, null, 2).replace(/</g, '\\u003c');
  lines.push(`<script type="application/ld+json">\n${jsonLd}\n</script>`);
  return lines.join('\n');
}

function renderMasthead(data) {
  const p = data.profile;
  const links = p.links || {};

  const ident = [`<h1 class="name">${esc(p.name)}</h1>`];
  if (has(p.nameNative)) ident.push(`<p class="name-native" lang="vi">${esc(p.nameNative)}</p>`);
  ident.push(`<p class="headline">${esc(p.headline)}</p>`);

  const meta = list(p.affiliations).map((a) => `<li>${icon(AFFILIATION_ICONS[a.kind])}<span>${maybeLink(a.url, a.label)}</span></li>`);
  if (has(p.location)) meta.push(`<li>${icon('pin')}<span>${esc(p.location)}</span></li>`);
  if (meta.length) ident.push(`<ul class="masthead-meta">\n${indent(meta.join('\n'), 2)}\n</ul>`);

  const contact = [`<li>${link(`mailto:${p.email}`, `${icon('mail')}<span>Email</span>`)}</li>`].concat(
    PROFILE_LINKS.filter(([k]) => has(links[k])).map(([k, label, ic]) => `<li>${link(links[k], `${icon(ic)}<span>${label}</span>`)}</li>`),
  );
  if (has(links.cv)) contact.push(`<li>${link(links.cv, `${icon('file')}<span>CV</span>`, 'is-primary')}</li>`);
  ident.push(`<ul class="masthead-links">\n${indent(contact.join('\n'), 2)}\n</ul>`);

  const photo = photoOf(p);
  const out = [
    `<div class="masthead-body${photo ? ' has-photo' : ''}">`,
    `  <div class="masthead-text">\n${indent(ident.join('\n'), 4)}\n  </div>`,
  ];
  if (photo) {
    out.push(
      `  <img class="portrait" src="${esc(photo.src)}" alt="Portrait of ${esc(p.name)}" width="${Number(photo.width)}" height="${Number(photo.height)}">`,
    );
  }
  out.push('</div>');
  return out.join('\n');
}

// Sticky bar: monogram, one link per rendered section, theme toggle.
function renderTopbar(data, sectionIds) {
  const p = data.profile;
  const navLinks = sectionIds.map((id) => `<li><a href="#${id}">${SECTION_TITLES[id]}</a></li>`);
  return [
    '<div class="topbar">',
    `  <a class="monogram" href="#top" aria-label="${esc(p.name)}, back to top">${esc(initialsOf(p))}</a>`,
    `  <nav class="site-nav" aria-label="Sections">\n    <ul>\n${indent(navLinks.join('\n'), 6)}\n    </ul>\n  </nav>`,
    `  <button type="button" class="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false">${icon('moon', 18, 'icon-moon')}${icon('sun', 18, 'icon-sun')}</button>`,
    '</div>',
  ].join('\n');
}

function renderAbout(data) {
  const p = data.profile;
  const body = [`<div class="bio">\n${indent(list(p.bioHtml).join('\n'), 2)}\n</div>`];
  const facts = [];
  if (has(p.interests)) facts.push(['Interests', inlineList(p.interests)]);
  if (has(p.stack)) facts.push(['Stack', inlineList(p.stack)]);
  if (has(p.languages)) facts.push(['Languages', esc(p.languages)]);
  if (facts.length) {
    const rows = facts.map(([k, v]) => `<div>\n  <dt>${k}</dt>\n  <dd>${v}</dd>\n</div>`);
    body.push(`<dl class="facts">\n${indent(rows.join('\n'), 2)}\n</dl>`);
  }
  return section('about', body.join('\n'));
}

function renderNewsItem(n) {
  return `<li><time datetime="${n.date}">${formatMonth(n.date)}</time><span>${n.textHtml}</span></li>`;
}

function renderNews(items) {
  const visible = items.slice(0, NEWS_VISIBLE).map(renderNewsItem);
  const older = items.slice(NEWS_VISIBLE).map(renderNewsItem);
  const body = [`<ul class="news">\n${indent(visible.join('\n'), 2)}\n</ul>`];
  if (older.length) {
    body.push(`<details class="more">\n  <summary>Older news</summary>\n  <ul class="news">\n${indent(older.join('\n'), 4)}\n  </ul>\n</details>`);
  }
  return section('news', body.join('\n'));
}

const extLabel = (label) => `<span>${label}</span>${icon('external', 13)}`;

function renderPublication(pub) {
  const authors = pub.authors.map((a) => (a.me ? `<strong>${esc(a.name)}</strong>` : esc(a.name))).join(', ');
  const titleUrl = pub.links && (pub.links.url || pub.links.arxiv || pub.links.pdf);
  const venue = has(pub.venue) ? pub.venue : pub.venueShort;
  const lines = [
    '<div class="pub-head">',
    `  <p class="pub-tag">${esc(pub.venueShort)}</p>`,
    `  <h3 class="pub-title">${has(titleUrl) ? link(titleUrl, esc(pub.title)) : esc(pub.title)}</h3>`,
    '</div>',
    `<p class="pub-authors">${authors}</p>`,
    `<p class="pub-venue">${esc(venue)}, ${esc(pub.year)}${has(pub.note) ? ` · <span class="pub-note">${esc(pub.note)}</span>` : ''}</p>`,
  ];
  if (has(pub.summary)) lines.push(`<p class="pub-summary">${esc(pub.summary)}</p>`);
  if (has(pub.highlights)) lines.push(bulletList(pub.highlights));
  const actions = PUB_LINKS.filter(([key]) => has(pub.links && pub.links[key])).map(([key, label]) =>
    link(pub.links[key], extLabel(label), 'tag-link'),
  );
  if (has(pub.doi)) actions.push(link(`https://doi.org/${pub.doi}`, extLabel('DOI'), 'tag-link'));
  if (has(pub.abstract)) {
    actions.push(`<details class="pub-extra">\n  <summary class="tag-link">Abstract</summary>\n  <p>${esc(pub.abstract)}</p>\n</details>`);
  }
  if (has(pub.bibtex)) {
    actions.push(
      `<details class="pub-extra">\n  <summary class="tag-link">BibTeX</summary>\n  <pre class="bibtex"><code>${esc(pub.bibtex.trim())}</code></pre>\n</details>`,
    );
  }
  if (actions.length) lines.push(`<div class="pub-actions">\n${indent(actions.join('\n'), 2)}\n</div>`);
  return `<article class="pub">\n${indent(lines.join('\n'), 2)}\n</article>`;
}

function renderPublications(pubs) {
  const sorted = [...pubs].sort((a, b) => Number(b.year) - Number(a.year));
  return section('publications', sorted.map(renderPublication).join('\n'));
}

function renderProjects(projects) {
  const sorted = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const items = sorted.map((pr, i) => {
    const lines = [];
    if (pr.featured) lines.push('<p class="project-flag">Featured</p>');
    lines.push(`<h3 class="project-title">${esc(pr.title)}</h3>`, `<p class="project-desc">${esc(pr.description)}</p>`);
    if (has(pr.highlights)) lines.push(bulletList(pr.highlights));
    if (has(pr.stack)) lines.push(inlineList(pr.stack, 'stack'));
    const links = PROJECT_LINKS.filter(([key]) => has(pr.links && pr.links[key])).map(([key, label, ic]) =>
      link(pr.links[key], `${icon(ic, 15)}<span>${label}</span>`),
    );
    if (links.length) lines.push(`<p class="project-links">${links.join('')}</p>`);
    const parts = [`<div class="project-text">\n${indent(lines.join('\n'), 2)}\n</div>`];
    const img = pr.image;
    if (img && has(img.src)) {
      parts.unshift(
        `<img class="project-image" src="${esc(img.src)}" alt="${esc(img.alt)}" width="${Number(img.width)}" height="${Number(img.height)}" loading="lazy" decoding="async">`,
      );
    }
    const lead = i === 0 && pr.featured && sorted.length > 2;
    return `<article class="project${lead ? ' is-lead' : ''}">\n${indent(parts.join('\n'), 2)}\n</article>`;
  });
  return section('projects', `<div class="project-grid">\n${indent(items.join('\n'), 2)}\n</div>`);
}

// Shared by experience, education and awards. `when` overrides the computed date range.
function renderEntry(e, homeLocation) {
  const range = has(e.when) ? String(e.when) : formatRange(e.start, e.end);
  const whenParts = range ? [`<span class="dates">${esc(range)}</span>`] : [];
  if (e.durationEnabled && hasMonth(e.start) && (!has(e.end) || hasMonth(e.end))) {
    whenParts.push(`<span class="duration" data-start="${e.start}"${has(e.end) ? ` data-end="${e.end}"` : ''}></span>`);
  }
  const head = [`<h3 class="entry-title">${esc(e.title)}</h3>`];
  if (whenParts.length) head.push(`<p class="entry-when">${whenParts.join('')}</p>`);
  const body = [`<div class="entry-head">\n${indent(head.join('\n'), 2)}\n</div>`];

  if (has(e.org)) {
    const orgLine = [maybeLink(e.orgUrl, e.org)];
    if (has(e.location) && e.location !== homeLocation) orgLine.push(`<span class="muted">${esc(e.location)}</span>`);
    body.push(`<p class="entry-org">${orgLine.join(' · ')}</p>`);
  }
  if (has(e.description)) body.push(`<p class="entry-desc">${esc(e.description)}</p>`);
  if (has(e.bullets)) body.push(bulletList(e.bullets));
  if (has(e.stack)) body.push(inlineList(e.stack, 'stack'));
  const entryLinks = Object.entries(e.links || {})
    .filter(([, url]) => has(url))
    .map(([key, url]) => link(url, extLabel(esc(ENTRY_LINK_LABELS[key] || key))));
  if (entryLinks.length) body.push(`<p class="entry-links">${entryLinks.join('')}</p>`);
  if (has(e.images)) {
    const imgs = list(e.images).map(
      (img) =>
        `<a href="${esc(img.src)}"><img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${Number(img.width)}" height="${Number(img.height)}" loading="lazy" decoding="async"></a>`,
    );
    body.push(`<div class="award-images">\n${indent(imgs.join('\n'), 2)}\n</div>`);
  }

  const current = e.current !== undefined ? e.current : has(e.start) && !has(e.end) && !has(e.when);
  return `<article class="entry${current ? ' is-current' : ''}">\n${indent(body.join('\n'), 2)}\n</article>`;
}

function renderExperience(items, homeLocation) {
  const entries = items.map((e) => renderEntry({ ...e, title: e.role, durationEnabled: true }, homeLocation));
  return section('experience', entries.join('\n'));
}

function renderEducation(items, homeLocation) {
  const entries = items.map((e) => {
    const entry = { title: e.degree, org: e.school, orgUrl: e.schoolUrl, start: e.start, end: e.end, bullets: e.notes };
    if (e.endExpected && has(e.end)) {
      entry.when = `${formatRange(e.start, e.end)} (expected)`;
      entry.current = true;
    }
    return renderEntry(entry, homeLocation);
  });
  return section('education', entries.join('\n'));
}

function renderAwards(items) {
  const entries = items.map((a) => renderEntry({ title: a.title, when: a.year, description: a.description, images: a.images }));
  return section('awards', entries.join('\n'));
}

function renderFooter(data) {
  const p = data.profile;
  const today = new Date().toISOString().slice(0, 10);
  return [
    '<footer class="site-footer">',
    `  <p>© ${new Date().getFullYear()} ${esc(p.name)} · ${link(`mailto:${p.email}`, esc(p.email))}</p>`,
    `  <p>Last updated <time datetime="${today}">${today}</time></p>`,
    '</footer>',
  ].join('\n');
}

// ---------- main ----------

function replaceRegion(html, name, content) {
  const re = new RegExp(`([ \\t]*)<!-- build:${name} -->[\\s\\S]*?<!-- /build:${name} -->`);
  const match = html.match(re);
  if (!match) throw new Error(`Marker pair <!-- build:${name} --> ... <!-- /build:${name} --> not found in index.html`);
  const pad = match[1];
  const body = content ? `\n${indent(content, pad.length)}\n${pad}` : '';
  return html.replace(re, () => `${pad}<!-- build:${name} -->${body}<!-- /build:${name} -->`);
}

function main() {
  delete require.cache[require.resolve(DATA_PATH)];
  const data = require(DATA_PATH);

  const errors = validate(data);
  if (errors.length) {
    console.error(`content/site-data.js has ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  const home = data.profile.location;
  sectionNo = 0;
  const regions = {
    about: renderAbout(data),
    news: has(data.news) ? renderNews(data.news) : '',
    publications: has(data.publications) ? renderPublications(data.publications) : '',
    projects: has(data.projects) ? renderProjects(data.projects) : '',
    experience: has(data.experience) ? renderExperience(data.experience, home) : '',
    education: has(data.education) ? renderEducation(data.education, home) : '',
    awards: has(data.awards) ? renderAwards(data.awards) : '',
  };
  const present = SECTIONS.map(([id]) => id).filter((id) => regions[id]);
  regions['head-meta'] = renderHeadMeta(data);
  regions.topbar = renderTopbar(data, present);
  regions.masthead = renderMasthead(data);
  regions.footer = renderFooter(data);

  const original = fs.readFileSync(INDEX_PATH, 'utf8');
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  let html = original.replace(/\r\n/g, '\n');
  for (const [name, content] of Object.entries(regions)) html = replaceRegion(html, name, content);
  html = html.replace(/\n/g, eol);

  if (html === original) {
    console.log('index.html is up to date.');
  } else {
    fs.writeFileSync(INDEX_PATH, html);
    console.log(`index.html rebuilt (${present.join(', ')}).`);
  }
}

try {
  main();
} catch (err) {
  console.error(`build-site failed: ${err.message}`);
  process.exit(1);
}
