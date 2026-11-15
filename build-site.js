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
  ['demo', 'Demo', 'external'],
  ['paper', 'Paper', 'file'],
];
const AFFILIATION_ICONS = { work: 'briefcase', study: 'cap', lab: 'flask' };
const ENTRY_LINK_LABELS = { results: 'Official results', website: 'Website' };
const SECTION_ICONS = {
  about: 'user',
  news: 'news',
  publications: 'book',
  projects: 'code',
  experience: 'briefcase',
  education: 'cap',
  awards: 'trophy',
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Inline SVG icons, one stroke family (Lucide, ISC licence) so every glyph matches.
const ICONS = {
  user: { body: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>' },
  news: {
    body: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
  },
  book: {
    body: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  },
  code: { body: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>' },
  cap: {
    body: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  },
  trophy: {
    body: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
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
  external: { body: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' },
  github: {
    body: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  },
  linkedin: {
    body: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
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

function icon(name, size = 18) {
  return `<svg class="icon" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name].body}</svg>`;
}

function link(url, text, cls) {
  const rel = isExternal(url) ? ' rel="noopener"' : '';
  const klass = cls ? ` class="${cls}"` : '';
  return `<a href="${esc(url)}"${klass}${rel}>${text}</a>`;
}

function maybeLink(url, text) {
  return has(url) ? link(url, esc(text)) : esc(text);
}

function chipList(items, cls = '') {
  const chips = list(items).map((t) => `<li class="chip${cls ? ` ${cls}` : ''}">${esc(t)}</li>`);
  return `<ul class="chip-list">${chips.join('')}</ul>`;
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

  return errors;
}

// ---------- renderers ----------

function sectionOpen(id, title) {
  return `<section id="${id}" class="section" aria-labelledby="${id}-title">\n  <h2 id="${id}-title"><span class="section-icon">${icon(SECTION_ICONS[id], 16)}</span>${title}</h2>`;
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
  if (has(p.photo)) person.image = abs(p.photo);
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

function renderSidebar(data) {
  const p = data.profile;
  const links = p.links || {};

  const avatar = has(p.photo)
    ? `<img class="avatar" src="${esc(p.photo)}" alt="Portrait of ${esc(p.name)}" width="400" height="400">`
    : `<div class="avatar avatar-fallback" aria-hidden="true">${esc(initialsOf(p))}</div>`;

  const ident = [`<h1 class="name">${esc(p.name)}</h1>`];
  if (has(p.nameNative)) ident.push(`<p class="name-native" lang="vi">${esc(p.nameNative)}</p>`);
  ident.push(`<p class="headline">${esc(p.headline)}</p>`);

  const meta = list(p.affiliations).map((a) => `<li>${icon(AFFILIATION_ICONS[a.kind])}<span>${maybeLink(a.url, a.label)}</span></li>`);
  if (has(p.location)) meta.push(`<li>${icon('pin')}<span>${esc(p.location)}</span></li>`);

  const profileLinks = [`<li>${link(`mailto:${p.email}`, `${icon('mail')}<span>Email</span>`)}</li>`].concat(
    PROFILE_LINKS.filter(([k]) => has(links[k])).map(([k, label, ic]) => `<li>${link(links[k], `${icon(ic)}<span>${label}</span>`)}</li>`),
  );

  const out = [
    '<div class="profile-head">',
    `  ${avatar}`,
    `  <div class="profile-ident">\n${indent(ident.join('\n'), 4)}\n  </div>`,
    '</div>',
  ];
  if (meta.length) out.push(`<ul class="profile-meta">\n${indent(meta.join('\n'), 2)}\n</ul>`);
  out.push(`<ul class="profile-links">\n${indent(profileLinks.join('\n'), 2)}\n</ul>`);
  if (has(links.cv)) out.push(link(links.cv, `${icon('file')}<span>Download CV</span>`, 'btn-primary'));
  return out.join('\n');
}

function renderAbout(data) {
  const p = data.profile;
  const out = [sectionOpen('about', 'About'), `  <div class="bio">\n${indent(list(p.bioHtml).join('\n'), 4)}\n  </div>`];
  if (has(p.interests)) out.push(`  <h3 class="eyebrow">Research interests</h3>\n  ${chipList(p.interests, 'chip-accent')}`);
  if (has(p.stack)) out.push(`  <h3 class="eyebrow">Stack</h3>\n  ${chipList(p.stack)}`);
  if (has(p.languages)) out.push(`  <h3 class="eyebrow">Languages</h3>\n  <p class="languages">${esc(p.languages)}</p>`);
  out.push('</section>');
  return out.join('\n');
}

function renderNewsItem(n) {
  return `<li><time datetime="${n.date}">${formatMonth(n.date)}</time><span>${n.textHtml}</span></li>`;
}

function renderNews(items) {
  const visible = items.slice(0, NEWS_VISIBLE).map(renderNewsItem);
  const older = items.slice(NEWS_VISIBLE).map(renderNewsItem);
  const out = [sectionOpen('news', 'News'), `  <ul class="news">\n${indent(visible.join('\n'), 4)}\n  </ul>`];
  if (older.length) {
    out.push(
      `  <details class="more">\n    <summary>Older news</summary>\n    <ul class="news">\n${indent(older.join('\n'), 6)}\n    </ul>\n  </details>`,
    );
  }
  out.push('</section>');
  return out.join('\n');
}

function renderPublication(pub) {
  const authors = pub.authors.map((a) => (a.me ? `<strong>${esc(a.name)}</strong>` : esc(a.name))).join(', ');
  const titleUrl = pub.links && (pub.links.url || pub.links.arxiv || pub.links.pdf);
  const venueLine = [has(pub.venue) ? esc(pub.venue) : esc(pub.venueShort), esc(pub.year)].join(', ');
  const lines = [
    `<h3 class="pub-title">${has(titleUrl) ? link(titleUrl, esc(pub.title)) : esc(pub.title)}</h3>`,
    `<p class="pub-authors">${authors}</p>`,
    `<p class="pub-venue"><em>${venueLine}</em>${has(pub.note) ? ` · <span class="pub-note">${esc(pub.note)}</span>` : ''}</p>`,
  ];
  const buttons = PUB_LINKS.filter(([key]) => has(pub.links && pub.links[key])).map(([key, label]) => link(pub.links[key], label, 'btn-link'));
  if (has(pub.doi)) buttons.push(link(`https://doi.org/${pub.doi}`, 'DOI', 'btn-link'));
  const details = [];
  if (has(pub.abstract)) {
    details.push(`<details class="pub-extra">\n  <summary>Abstract</summary>\n  <p>${esc(pub.abstract)}</p>\n</details>`);
  }
  if (has(pub.bibtex)) {
    details.push(
      `<details class="pub-extra">\n  <summary>BibTeX</summary>\n  <pre class="bibtex"><code>${esc(pub.bibtex.trim())}</code></pre>\n</details>`,
    );
  }
  if (buttons.length || details.length) {
    lines.push(`<div class="pub-actions">\n${indent([...buttons, ...details].join('\n'), 2)}\n</div>`);
  }
  return [
    '<article class="pub">',
    `  <span class="venue-badge">${esc(pub.venueShort)}</span>`,
    `  <div class="pub-body">\n${indent(lines.join('\n'), 4)}\n  </div>`,
    '</article>',
  ].join('\n');
}

function renderPublications(pubs) {
  const sorted = [...pubs].sort((a, b) => Number(b.year) - Number(a.year));
  const years = [...new Set(sorted.map((p) => String(p.year)))];
  const out = [sectionOpen('publications', 'Publications')];
  if (years.length > 1) {
    years.forEach((y) => {
      out.push(`  <h3 class="eyebrow year-heading">${esc(y)}</h3>`);
      out.push(indent(sorted.filter((p) => String(p.year) === y).map(renderPublication).join('\n'), 2));
    });
  } else {
    out.push(indent(sorted.map(renderPublication).join('\n'), 2));
  }
  out.push('</section>');
  return out.join('\n');
}

function renderProjects(projects) {
  const sorted = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const cards = sorted.map((pr) => {
    const lines = [`<h3>${esc(pr.title)}</h3>`, `<p>${esc(pr.description)}</p>`];
    if (has(pr.stack)) lines.push(chipList(pr.stack));
    const links = PROJECT_LINKS.filter(([key]) => has(pr.links && pr.links[key])).map(([key, label, ic]) =>
      link(pr.links[key], `${icon(ic, 16)}<span>${label}</span>`),
    );
    if (links.length) lines.push(`<div class="project-links">\n${indent(links.join('\n'), 2)}\n</div>`);
    return `<article class="project">\n${indent(lines.join('\n'), 2)}\n</article>`;
  });
  return [sectionOpen('projects', 'Projects'), `  <div class="project-grid">\n${indent(cards.join('\n'), 4)}\n  </div>`, '</section>'].join(
    '\n',
  );
}

function renderTimelineEntry({ title, org, orgUrl, location, start, end, bullets, stack, links, durationEnabled }, homeLocation) {
  const range = formatRange(start, end);
  const when = range ? [`<span class="dates">${esc(range)}</span>`] : [];
  if (durationEnabled && hasMonth(start) && (!has(end) || hasMonth(end))) {
    when.push(`<span class="duration" data-start="${start}"${has(end) ? ` data-end="${end}"` : ''}></span>`);
  }
  const head = [`<h3>${esc(title)}</h3>`];
  if (when.length) head.push(`<p class="when">${when.join('')}</p>`);

  const orgLine = [`<span class="org-name">${maybeLink(orgUrl, org)}</span>`];
  if (has(location) && location !== homeLocation) orgLine.push(`<span class="muted">${esc(location)}</span>`);
  const body = [`<div class="entry-head">\n${indent(head.join('\n'), 2)}\n</div>`, `<p class="org">${orgLine.join(' · ')}</p>`];
  if (has(bullets)) body.push(`<ul class="bullets">\n${indent(list(bullets).map((b) => `<li>${esc(b)}</li>`).join('\n'), 2)}\n</ul>`);
  if (has(stack)) body.push(chipList(stack));
  const entryLinks = Object.entries(links || {})
    .filter(([, url]) => has(url))
    .map(([key, url]) => link(url, `<span>${esc(ENTRY_LINK_LABELS[key] || key)}</span>${icon('external', 14)}`));
  if (entryLinks.length) body.push(`<p class="entry-links">${entryLinks.join('')}</p>`);

  const current = has(start) && !has(end);
  return `<article class="entry${current ? ' is-current' : ''}">\n${indent(body.join('\n'), 2)}\n</article>`;
}

function renderTimeline(id, title, entries) {
  return [sectionOpen(id, title), `  <div class="timeline">\n${indent(entries.join('\n'), 4)}\n  </div>`, '</section>'].join('\n');
}

function renderExperience(items, homeLocation) {
  const entries = items.map((e) =>
    renderTimelineEntry(
      {
        title: e.role,
        org: e.org,
        orgUrl: e.orgUrl,
        location: e.location,
        start: e.start,
        end: e.end,
        bullets: e.bullets,
        stack: e.stack,
        links: e.links,
        durationEnabled: true,
      },
      homeLocation,
    ),
  );
  return renderTimeline('experience', 'Experience', entries);
}

function renderEducation(items, homeLocation) {
  const entries = items.map((e) =>
    renderTimelineEntry({ title: e.degree, org: e.school, orgUrl: e.schoolUrl, start: e.start, end: e.end, bullets: e.notes }, homeLocation),
  );
  return renderTimeline('education', 'Education', entries);
}

function renderAwards(items) {
  const entries = items.map((a) => {
    const body = [`<div class="entry-head">\n  <h3>${esc(a.title)}</h3>\n  <p class="when">${esc(a.year)}</p>\n</div>`];
    if (has(a.description)) body.push(`<p class="award-desc">${esc(a.description)}</p>`);
    if (has(a.images)) {
      const imgs = list(a.images).map(
        (img) =>
          `<a href="${esc(img.src)}"><img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${Number(img.width)}" height="${Number(img.height)}" loading="lazy" decoding="async"></a>`,
      );
      body.push(`<div class="award-images">\n${indent(imgs.join('\n'), 2)}\n</div>`);
    }
    return `<article class="award">\n${indent(body.join('\n'), 2)}\n</article>`;
  });
  return [sectionOpen('awards', 'Awards'), indent(entries.join('\n'), 2), '</section>'].join('\n');
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
  const regions = {
    about: renderAbout(data),
    news: has(data.news) ? renderNews(data.news) : '',
    publications: has(data.publications) ? renderPublications(data.publications) : '',
    projects: has(data.projects) ? renderProjects(data.projects) : '',
    experience: has(data.experience) ? renderExperience(data.experience, home) : '',
    education: has(data.education) ? renderEducation(data.education, home) : '',
    awards: has(data.awards) ? renderAwards(data.awards) : '',
  };
  const present = new Set(Object.keys(regions).filter((k) => regions[k]));
  regions['head-meta'] = renderHeadMeta(data);
  regions.sidebar = renderSidebar(data);
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
    console.log(`index.html rebuilt (${[...present].join(', ')}).`);
  }
}

try {
  main();
} catch (err) {
  console.error(`build-site failed: ${err.message}`);
  process.exit(1);
}
