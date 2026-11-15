/**
 * Single source of truth for the home page (index.html).
 *
 * Workflow: edit this file -> run `node build-site.js` -> commit -> push.
 * The build script rewrites the regions between <!-- build:* --> markers in
 * index.html. Never edit those regions by hand; they are overwritten.
 *
 * Rules:
 * - Plain-text fields are HTML-escaped. Fields ending in `Html` are inserted
 *   as-is, so keep them to simple inline markup (<a>, <em>, <strong>).
 * - Dates use "YYYY-MM" (or "YYYY" when the month is unknown). Omit `end` for
 *   an ongoing role.
 * - Empty strings / empty arrays are skipped: a section with no entries is not
 *   rendered. Never put placeholder text here.
 */

module.exports = {
  profile: {
    name: 'Tran Phuoc Sang',
    nameNative: 'Trần Phước Sang',
    headline: 'AI Agent Developer · LLM Researcher',
    // Shown in the sidebar with an icon. Keep these short; the role is in `headline`.
    // kind: 'work' (briefcase), 'study' (graduation cap) or 'lab' (flask).
    affiliations: [
      { kind: 'work', label: 'CodePresso', url: '' },
      { kind: 'study', label: 'M.Sc. in Computer Science, Ton Duc Thang University', url: 'https://www.tdtu.edu.vn/' },
    ],
    location: 'Ho Chi Minh City, Vietnam',
    initials: 'PS', // shown in the avatar block until `photo` is set
    bioHtml: [
      '<p>I am an AI engineer and researcher working on large language models. I build LLM-based agents at <strong>CodePresso</strong> and am pursuing an <strong>M.Sc. in Computer Science</strong> at Ton Duc Thang University.</p>',
      '<p>My research focuses on adapting LLMs to specialised, low-resource settings: retrieval-augmented generation over legal documents, parameter-efficient fine-tuning for domain-specific question answering, and persona-driven synthetic data for imbalanced tasks such as depression screening (SOICT 2025). In industry, I work on agents for assessment content generation, automated code scoring and code-interview analysis, and on lowering serving cost with open-source models.</p>',
      '<p>I also coach Ton Duc Thang University&rsquo;s teams for the Vietnam Student AI Olympiad.</p>',
    ],
    interests: [
      'Large Language Models',
      'Retrieval-Augmented Generation',
      'Parameter-efficient fine-tuning',
      'Synthetic data',
      'AI Agents',
    ],
    stack: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'LoRA / PEFT', 'Qdrant', 'PostgreSQL', 'Docker', 'Streamlit'],
    languages: 'Vietnamese (native) · English (B2)',
    // TODO(owner): square portrait >= 400px, e.g. 'assets/images/profile.jpg'. Empty = no photo.
    photo: '',
    email: 'transhack09@gmail.com',
    links: {
      scholar: '', // TODO(owner): Google Scholar profile URL
      github: 'https://github.com/PhuocSang07',
      huggingface: 'https://huggingface.co/phuocsang',
      linkedin: 'https://www.linkedin.com/in/phuocsang2412/',
      orcid: '', // TODO(owner): ORCID URL
      cv: '', // TODO(owner): e.g. 'assets/files/cv.pdf'
    },
    seo: {
      title: 'Tran Phuoc Sang — AI Agent Developer & LLM Researcher',
      description:
        'Tran Phuoc Sang: AI Agent Developer at CodePresso and M.Sc. student in Computer Science at Ton Duc Thang University, researching large language models.',
      url: 'https://phuocsang07.github.io/',
      ogImage: '', // TODO(owner): 1200x630 image, e.g. 'assets/images/og.png'
    },
  },

  // Newest first ({ date: 'YYYY-MM', textHtml }). Currently hidden: an empty list is not rendered.
  news: [],

  publications: [
    {
      title: 'Addressing Data Scarcity and Imbalance in Depression Screening with Persona-Driven Synthetic Data',
      authors: [{ name: 'Luyen Vo' }, { name: 'Phuoc-Sang Tran', me: true }, { name: 'Anh-Cuong Le' }],
      venueShort: 'SOICT 2025',
      venue: 'Springer CCIS · 14th International Symposium on Information and Communication Technology (SOICT), Nha Trang, Vietnam',
      year: 2025,
      note: '',
      links: { url: 'https://link.springer.com/chapter/10.1007/978-981-92-2584-2_47', pdf: '', arxiv: '', code: '', slides: '' },
      doi: '10.1007/978-981-92-2584-2_47',
      abstract: '', // TODO(owner): paste the abstract from the Springer page
      bibtex: '', // TODO(owner): paste "Cite this paper" BibTeX from the Springer page
    },
  ],

  projects: [
    {
      title: 'Legal Chatbot with Advanced RAG',
      description:
        'Legal question-answering system for Vietnamese law built on retrieval-augmented generation, with hierarchical document retrieval and a Streamlit interface.',
      stack: ['Python', 'LangChain', 'Qdrant', 'PostgreSQL', 'Streamlit'],
      links: { code: 'https://github.com/PhuocSang07/legal-chatbot' },
      featured: true,
    },
    {
      title: 'Qwen2.5-3B Fine-tuned for Vietnamese Law',
      description:
        'Fine-tuned Qwen2.5-3B on a Vietnamese legal corpus and QA dataset for a legal chatbot, using Unsloth with LoRA.',
      stack: ['Python', 'PyTorch', 'Hugging Face', 'Unsloth', 'LoRA'],
      links: { model: 'https://huggingface.co/phuocsang/qwen2.5-3B-Finetune-Vietnamese-Law' },
      featured: true,
    },
    {
      title: 'Vistral-7B Fine-tuned for a Travel Chatbot',
      description:
        'Loaded Viet-Mistral-7B-Chat in 4-bit precision and fine-tuned it with LoRA on a Vietnamese travel QA dataset generated by Gemini 1.5 Pro.',
      stack: ['Python', 'PyTorch', 'Hugging Face', 'PEFT', 'LoRA'],
      links: { code: 'https://github.com/PhuocSang07/FineTuning-Vistral7B-q4-travel-dataset' },
    },
  ],

  experience: [
    {
      role: 'AI Agent Developer',
      org: 'CodePresso',
      orgUrl: '',
      location: 'Ho Chi Minh City, Vietnam',
      start: '2025-06',
      bullets: [
        'Develop and enhance an automatic generation system that keeps pace with the consumption cycle of assessment content.',
        'Improve the scoring function of a competency assessment service, evaluating logic, code quality and output.',
        'Build automatic error-description generation to support efficient learning.',
        'Reduce service cost by introducing open-source LLM and sLLM models.',
        'Implement a code-interview performance and analysis system.',
      ],
      stack: ['Python', 'PyTorch', 'LangChain', 'Hugging Face', 'AI Agents'],
    },
    {
      role: 'Team Coach, Vietnam Student AI Olympiad 2026',
      org: 'Ton Duc Thang University',
      orgUrl: 'https://www.tdtu.edu.vn/',
      location: 'Ho Chi Minh City, Vietnam',
      start: '2026-10',
      bullets: [
        'Coach Ton Duc Thang University teams for the Vietnam Student AI Olympiad 2026 (OlpAI’26).',
        'Team TDTU_A1 won 2nd Prize in the Southern regional round, placing 9th in the region and 14th nationwide.',
      ],
      links: { results: 'https://www.olp.vn/olympic-ai-sinh-vi%C3%AAn/k%E1%BA%BFt-qu%E1%BA%A3' },
    },
    {
      role: 'Research Assistant',
      org: 'Natural Language Processing & Knowledge Discovery Lab, Ton Duc Thang University',
      orgUrl: '',
      location: 'Ho Chi Minh City, Vietnam',
      start: '2025-01',
      end: '2026-01',
      bullets: [
        'Researched advanced RAG techniques for legal document analysis.',
        'Fine-tuned large language models for domain-specific question answering.',
        'Built and maintained data-processing pipelines for NLP tasks.',
      ],
      stack: ['Python', 'PyTorch', 'LangChain', 'RAG', 'LoRA', 'Hugging Face'],
    },
  ],

  education: [
    {
      degree: 'M.Sc. in Computer Science',
      school: 'Ton Duc Thang University',
      schoolUrl: 'https://www.tdtu.edu.vn/',
      start: '2025',
      notes: [],
    },
    {
      degree: 'B.Sc. in Computer Science', // TODO(owner): confirm degree name
      school: 'Ton Duc Thang University',
      schoolUrl: 'https://www.tdtu.edu.vn/',
      start: '', // TODO(owner): 'YYYY'
      end: '', // TODO(owner): 'YYYY'
      notes: ['GPA: 8.1 / 10'],
    },
  ],

  awards: [
    {
      year: 2025,
      title: '2nd Prize — Vietnam Student AI Olympiad 2025, National Finals',
      description: 'Team TDTU_Les Secrets Haches, Ton Duc Thang University.',
      images: [
        {
          src: 'assets/images/awards/olpai-2025-team.jpg',
          alt: 'The TDTU team at the Vietnam Student AI Olympiad 2025 finals, HUTECH',
          width: 1200,
          height: 800,
        },
        {
          src: 'assets/images/awards/olpai-2025-certificate.jpg',
          alt: '2nd Prize certificate, Vietnam Student AI Olympiad 2025',
          width: 1200,
          height: 917,
        },
      ],
    },
    {
      year: 2025,
      title: 'Top 2 — Olympic AI Ho Chi Minh City 2025',
      description: 'Held at HUTECH University.',
    },
  ],
};
