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

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'news', label: 'News' },
  { id: 'publications', label: 'Publications' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'awards', label: 'Awards' },
];

const PROFILE_LINKS = [
  ['scholar', 'Google Scholar'],
  ['github', 'GitHub'],
  ['huggingface', 'Hugging Face'],
  ['linkedin', 'LinkedIn'],
  ['orcid', 'ORCID'],
  ['cv', 'CV'],
];
const PUB_LINKS = [['url', 'Paper'], ['pdf', 'PDF'], ['arxiv', 'arXiv'], ['code', 'Code'], ['slides', 'Slides']];
const PROJECT_LINKS = [['code', 'Code'], ['model', 'Model'], ['demo', 'Demo'], ['paper', 'Paper']];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ---------- helpers ----------

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const has = (value) => (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== '');

const list = (value) => (Array.isArray(value) ? value : []);

const isExternal = (url) => /^(https?:)?\/\//.test(url);

function link(url, text, cls) {
  const rel = isExternal(url) ? ' rel="noopener"' : '';
  const klass = cls ? ` class="${cls}"` : '';
  return `<a href="${esc(url)}"${klass}${rel}>${text}</a>`;
}

function maybeLink(url, text) {
  return has(url) ? link(url, esc(text)) : esc(text);
}

function formatMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

function formatRange(start, end) {
  if (!has(start)) return has(end) ? formatMonth(end) : '';
  return `${formatMonth(start)} – ${has(end) ? formatMonth(end) : 'Present'}`;
}

function linkButtons(links, spec) {
  const items = spec.filter(([key]) => has(links && links[key])).map(([key, label]) => link(links[key], label, 'btn-link'));
  return items.join('\n');
}

const indent = (html, spaces) =>
  html
    .split('\n')
    .map((line) => (line.trim() ? ' '.repeat(spaces) + line : ''))
    .join('\n');

// ---------- validation ----------

function validate(data) {
  const errors = [];
  const ym = /^\d{4}-(0[1-9]|1[0-2])$/;
  const need = (obj, field, where) => {
    if (!obj || !has(obj[field])) errors.push(`${where}.${field} is required`);
  };
  const month = (obj, field, where) => {
    if (has(obj[field]) && !ym.test(obj[field])) errors.push(`${where}.${field} must be "YYYY-MM" (got "${obj[field]}")`);
  };

  const p = data.profile;
  if (!p) errors.push('profile is required');
  else ['name', 'headline', 'email'].forEach((f) => need(p, f, 'profile'));
  if (p && (!p.seo || !has(p.seo.url))) errors.push('profile.seo.url is required');

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
  return `<section id="${id}" class="section" aria-labelledby="${id}-title">\n  <h2 id="${id}-title">${title}</h2>`;
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
  const sameAs = ['scholar', 'github', 'huggingface', 'linkedin', 'orcid'].filter((k) => has(links[k])).map((k) => links[k]);
  if (sameAs.length) person.sameAs = sameAs;
  if (has(p.interests)) person.knowsAbout = p.interests;
  const current = list(data.experience).find((e) => !has(e.end));
  if (current) person.worksFor = { '@type': 'Organization', name: current.org };
  const schools = list(data.education).map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school }));
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

function renderNav(data, present) {
  const p = data.profile;
  const items = SECTIONS.filter((s) => present.has(s.id) && s.id !== 'education' && s.id !== 'awards').map(
    (s) => `<li><a href="#${s.id}">${s.label}</a></li>`,
  );
  if (has(p.links && p.links.cv)) items.push(`<li>${link(p.links.cv, 'CV')}</li>`);
  return [
    `<a class="brand" href="#top">${esc(p.name)}</a>`,
    '<nav class="site-nav" aria-label="Primary">',
    '  <ul>',
    indent(items.join('\n'), 4),
    '  </ul>',
    '</nav>',
  ].join('\n');
}

function renderAbout(data) {
  const p = data.profile;
  const links = p.links || {};
  const linkRow = [link(`mailto:${p.email}`, 'Email')]
    .concat(PROFILE_LINKS.filter(([k]) => has(links[k])).map(([k, label]) => link(links[k], label)))
    .join('<span aria-hidden="true"> · </span>');

  const text = [`<h1 id="about-title" class="name">${esc(p.name)}</h1>`];
  if (has(p.nameNative)) text.push(`<p class="name-native" lang="vi">${esc(p.nameNative)}</p>`);
  text.push(`<p class="headline">${esc(p.headline)}</p>`);
  if (has(p.affiliations)) {
    text.push(
      `<p class="affiliations">${list(p.affiliations).map((a) => maybeLink(a.url, a.label)).join('<br>')}</p>`,
    );
  }
  text.push(`<div class="bio">\n${indent(list(p.bioHtml).join('\n'), 2)}\n</div>`);
  const facts = [];
  if (has(p.interests)) facts.push(`<dt>Research interests</dt><dd>${list(p.interests).map(esc).join(' · ')}</dd>`);
  if (has(p.stack)) facts.push(`<dt>Stack</dt><dd>${list(p.stack).map(esc).join(' · ')}</dd>`);
  if (has(p.languages)) facts.push(`<dt>Languages</dt><dd>${esc(p.languages)}</dd>`);
  if (facts.length) text.push(`<dl class="facts">\n${indent(facts.join('\n'), 2)}\n</dl>`);
  text.push(`<p class="profile-links">${linkRow}</p>`);

  const body = [`<div class="about-text">\n${indent(text.join('\n'), 2)}\n</div>`];
  if (has(p.photo)) {
    body.push(
      `<img class="portrait" src="${esc(p.photo)}" alt="Portrait of ${esc(p.name)}" width="400" height="400">`,
    );
  }
  const cls = has(p.photo) ? 'about has-photo' : 'about';
  return `<section id="about" class="${cls}" aria-labelledby="about-title">\n${indent(body.join('\n'), 2)}\n</section>`;
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
  const buttons = linkButtons(pub.links, PUB_LINKS);
  const details = [];
  if (has(pub.abstract)) {
    details.push(`<details class="pub-extra">\n  <summary>Abstract</summary>\n  <p>${esc(pub.abstract)}</p>\n</details>`);
  }
  if (has(pub.bibtex)) {
    details.push(
      `<details class="pub-extra">\n  <summary>BibTeX</summary>\n  <pre class="bibtex"><code>${esc(pub.bibtex.trim())}</code></pre>\n</details>`,
    );
  }
  if (buttons || details.length) {
    lines.push(`<div class="pub-actions">\n${indent([buttons, ...details].filter(Boolean).join('\n'), 2)}\n</div>`);
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
  const out = [sectionOpen('publications', 'Publications'), '  <p class="section-note"><strong>Bold</strong> marks my name.</p>'];
  if (years.length > 1) {
    years.forEach((y) => {
      out.push(`  <h3 class="year-heading">${esc(y)}</h3>`);
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
    if (has(pr.stack)) lines.push(`<p class="stack">${list(pr.stack).map(esc).join(' · ')}</p>`);
    const buttons = linkButtons(pr.links, PROJECT_LINKS);
    if (buttons) lines.push(`<div class="pub-actions">\n${indent(buttons, 2)}\n</div>`);
    return `<article class="project">\n${indent(lines.join('\n'), 2)}\n</article>`;
  });
  return [sectionOpen('projects', 'Projects'), `  <div class="project-grid">\n${indent(cards.join('\n'), 4)}\n  </div>`, '</section>'].join(
    '\n',
  );
}

function renderTimelineEntry({ title, org, orgUrl, location, start, end, bullets, stack, durationEnabled }) {
  const range = formatRange(start, end);
  const when = range ? [`<span class="dates">${esc(range)}</span>`] : [];
  if (durationEnabled && has(start)) {
    when.push(`<span class="duration" data-start="${start}"${has(end) ? ` data-end="${end}"` : ''}></span>`);
  }
  const body = [`<h3>${esc(title)}</h3>`];
  const orgLine = [maybeLink(orgUrl, org)];
  if (has(location)) orgLine.push(`<span class="muted">${esc(location)}</span>`);
  body.push(`<p class="org">${orgLine.join(' · ')}</p>`);
  if (has(bullets)) body.push(`<ul>\n${indent(list(bullets).map((b) => `<li>${esc(b)}</li>`).join('\n'), 2)}\n</ul>`);
  if (has(stack)) body.push(`<p class="stack">${list(stack).map(esc).join(' · ')}</p>`);
  return [
    '<article class="entry">',
    when.length ? `  <p class="when">${when.join('')}</p>` : '',
    `  <div class="entry-body">\n${indent(body.join('\n'), 4)}\n  </div>`,
    '</article>',
  ]
    .filter(Boolean)
    .join('\n');
}

function renderExperience(items) {
  const entries = items.map((e) =>
    renderTimelineEntry({
      title: e.role,
      org: e.org,
      orgUrl: e.orgUrl,
      location: e.location,
      start: e.start,
      end: e.end,
      bullets: e.bullets,
      stack: e.stack,
      durationEnabled: true,
    }),
  );
  return [sectionOpen('experience', 'Experience'), indent(entries.join('\n'), 2), '</section>'].join('\n');
}

function renderEducation(items) {
  const entries = items.map((e) =>
    renderTimelineEntry({ title: e.degree, org: e.school, orgUrl: e.schoolUrl, start: e.start, end: e.end, bullets: e.notes }),
  );
  return [sectionOpen('education', 'Education'), indent(entries.join('\n'), 2), '</section>'].join('\n');
}

function renderAwards(items) {
  const entries = items.map((a) => {
    const body = [`<h3>${esc(a.title)}</h3>`];
    if (has(a.description)) body.push(`<p>${esc(a.description)}</p>`);
    if (has(a.images)) {
      const imgs = list(a.images).map(
        (img) =>
          `<img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${Number(img.width)}" height="${Number(img.height)}" loading="lazy" decoding="async">`,
      );
      body.push(`<div class="award-images">\n${indent(imgs.join('\n'), 2)}\n</div>`);
    }
    return [
      '<article class="entry">',
      `  <p class="when"><span class="dates">${esc(a.year)}</span></p>`,
      `  <div class="entry-body">\n${indent(body.join('\n'), 4)}\n  </div>`,
      '</article>',
    ].join('\n');
  });
  return [sectionOpen('awards', 'Awards'), indent(entries.join('\n'), 2), '</section>'].join('\n');
}

function renderFooter(data) {
  const p = data.profile;
  const today = new Date().toISOString().slice(0, 10);
  return [
    '<footer class="site-footer">',
    '  <div class="container">',
    `    <p>© ${new Date().getFullYear()} ${esc(p.name)} · ${link(`mailto:${p.email}`, esc(p.email))}</p>`,
    `    <p class="muted">Last updated <time datetime="${today}">${today}</time></p>`,
    '  </div>',
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

  const regions = {
    about: renderAbout(data),
    news: has(data.news) ? renderNews(data.news) : '',
    publications: has(data.publications) ? renderPublications(data.publications) : '',
    projects: has(data.projects) ? renderProjects(data.projects) : '',
    experience: has(data.experience) ? renderExperience(data.experience) : '',
    education: has(data.education) ? renderEducation(data.education) : '',
    awards: has(data.awards) ? renderAwards(data.awards) : '',
  };
  const present = new Set(Object.keys(regions).filter((k) => regions[k]));
  regions['head-meta'] = renderHeadMeta(data);
  regions.nav = renderNav(data, present);
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
