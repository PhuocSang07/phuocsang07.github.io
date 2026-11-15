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
 * - Dates use "YYYY-MM". Omit `end` for an ongoing role.
 * - Empty strings / empty arrays are skipped: a section with no entries is not
 *   rendered and its nav link disappears. Never put placeholder text here.
 */

module.exports = {
  profile: {
    name: 'Tran Phuoc Sang',
    nameNative: 'Trần Phước Sang',
    headline: 'AI Agent Developer · LLM Researcher',
    // Shown in the sidebar with an icon. Organisation names only; the role is in `headline`.
    // kind: 'work' (briefcase icon) or 'lab' (flask icon).
    affiliations: [
      { kind: 'work', label: 'CodePresso', url: '' },
      { kind: 'lab', label: 'NLP & KD Lab, Ton Duc Thang University', url: '' },
    ],
    location: 'Ho Chi Minh City, Vietnam',
    initials: 'PS', // shown in the avatar block until `photo` is set
    // TODO(owner): rewrite the bio in your own words.
    bioHtml: [
      '<p>My research focuses on large language models: retrieval-augmented generation for legal documents, domain-specific fine-tuning, and synthetic data for low-resource tasks. At CodePresso I build LLM-based agents for automatic assessment content generation, code scoring, and code-interview analysis.</p>',
    ],
    interests: [
      'Large Language Models',
      'Retrieval-Augmented Generation',
      'Parameter-efficient fine-tuning',
      'Synthetic data',
      'AI Agents',
    ],
    stack: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'LoRA / PEFT', 'Qdrant', 'PostgreSQL', 'Docker', 'Streamlit'],
    languages: 'Vietnamese (native) · English, Aptis B2 (L: C1, S: B1, R: B2, W: B2)',
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
        'Tran Phuoc Sang: AI Agent Developer at CodePresso and LLM researcher at NLP & KD Lab, Ton Duc Thang University. Publications, projects and experience.',
      url: 'https://phuocsang07.github.io/',
      ogImage: '', // TODO(owner): 1200x630 image, e.g. 'assets/images/og.png'
    },
  },

  // Newest first. Shows 5, the rest go under "Older news".
  news: [
    {
      date: '2025-12',
      textHtml: 'Our team <em>TDTU_Les Secrets Haches</em> won <strong>2nd Prize</strong> at the National Finals of the Vietnam Student AI Olympics 2025.',
    },
    // TODO(owner): add the SOICT 2025 acceptance and other dated news here.
    { date: '2025-06', textHtml: 'Joined <strong>CodePresso</strong> as an AI Agent Developer.' },
    { date: '2025-01', textHtml: 'Started as a Research Assistant at the NLP &amp; KD Lab, Ton Duc Thang University.' },
  ],

  publications: [
    {
      title: 'Addressing Data Scarcity and Imbalance in Depression Screening with Persona-Driven Synthetic Data',
      authors: [{ name: 'Luyen Vo' }, { name: 'Phuoc-Sang Tran', me: true }, { name: 'Anh-Cuong Le' }],
      venueShort: 'SOICT 2025',
      venue: 'International Symposium on Information and Communication Technology (SOICT)',
      year: 2025,
      note: '',
      // TODO(owner): fill pdf / arxiv / code / slides / url when available.
      links: { pdf: '', arxiv: '', code: '', slides: '', url: '' },
      abstract: '', // TODO(owner)
      bibtex: '', // TODO(owner)
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
      role: 'Research Assistant',
      org: 'Natural Language Processing & Knowledge Discovery Lab, Ton Duc Thang University',
      orgUrl: '',
      location: 'Ho Chi Minh City, Vietnam',
      start: '2025-01',
      bullets: [
        'Research advanced RAG techniques for legal document analysis.',
        'Fine-tune large language models for domain-specific question answering.',
        'Develop and maintain data-processing pipelines for NLP tasks.',
      ],
      stack: ['Python', 'PyTorch', 'LangChain', 'RAG', 'LoRA', 'Hugging Face'],
    },
  ],

  education: [
    {
      degree: 'B.Sc. in Computer Science', // TODO(owner): confirm degree name
      school: 'Ton Duc Thang University',
      schoolUrl: 'https://www.tdtu.edu.vn/',
      start: '', // TODO(owner): 'YYYY-MM'
      end: '', // TODO(owner): 'YYYY-MM' or leave empty if ongoing
      notes: ['GPA: 8.1 / 10'],
    },
  ],

  awards: [
    {
      year: 2025,
      title: '2nd Prize — Vietnam Student AI Olympics 2025 (National Finals)',
      description: 'Team TDTU_Les Secrets Haches, Ton Duc Thang University.',
      images: [
        {
          src: 'assets/images/awards/olpai-2025-team.jpg',
          alt: 'The TDTU team at the Vietnam Student AI Olympics 2025 finals, HUTECH',
          width: 1200,
          height: 800,
        },
        {
          src: 'assets/images/awards/olpai-2025-certificate.jpg',
          alt: '2nd Prize certificate, Vietnam Student AI Olympics 2025',
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
