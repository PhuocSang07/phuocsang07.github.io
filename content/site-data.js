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
 * - A project may carry `image: { src, alt, width, height }` (screenshot or diagram) and
 *   `featured: true`. The first featured project is laid out across the full row.
 * - Publications take an optional `summary` (one or two sentences, always visible) and
 *   `highlights` (key results). Projects take optional `highlights` too. Only state what
 *   the paper, repository or model card actually says.
 * - Empty strings / empty arrays are skipped: a section with no entries is not
 *   rendered. Never put placeholder text here.
 */

module.exports = {
  profile: {
    name: 'Tran Phuoc Sang',
    nameNative: 'Trần Phước Sang',
    headline: 'AI Agent Developer · LLM Researcher',
    // Shown under the name with an icon. Keep these short; the role is in `headline`.
    // kind: 'work' (briefcase), 'study' (graduation cap) or 'lab' (flask).
    affiliations: [
      { kind: 'work', label: 'CodePresso', url: '' },
      { kind: 'study', label: 'M.Sc. in Computer Science, Ton Duc Thang University', url: 'https://www.tdtu.edu.vn/' },
    ],
    location: 'Ho Chi Minh City, Vietnam',
    initials: 'PS', // monogram in the top-left corner and favicon
    bioHtml: [
      '<p>I build and study systems based on large language models: AI agents that run in production at <strong>CodePresso</strong>, and research on making <strong>small language models</strong> more capable through <strong>knowledge distillation</strong>.</p>',
      '<p>My research covers knowledge distillation for LLMs, reasoning optimisation for small language models, foundation models and transfer learning. My latest paper, accepted at <strong>KSE 2026</strong>, uses distillation to make Vietnamese language models decline questions about specific entities without collecting newly labelled refusals. Earlier work includes retrieval-augmented generation for Vietnamese legal documents, parameter-efficient fine-tuning for domain-specific question answering, and persona-driven synthetic data for depression screening (<strong>SOICT 2025</strong>).</p>',
      '<p>At CodePresso, I design AI agents that automate workflows in education and take them from prototype to production on AWS, with a close eye on performance and operating cost.</p>',
      '<p>I am pursuing an M.Sc. in Computer Science at Ton Duc Thang University, where I also coach the university&rsquo;s teams for the Vietnam Student AI Olympiad. My own team won 2nd Prize at the 2025 national finals.</p>',
    ],
    interests: ['LLM Distillation', 'Reasoning in Small Language Models', 'Foundation Models', 'Transfer Learning'],
    stack: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'AWS (S3, Lambda, ECS)', 'Docker', 'PostgreSQL', 'Qdrant', 'LoRA / PEFT'],
    languages: 'Vietnamese (native) · English (B2)',
    // 4:5 portrait, ideally a cut-out with a transparent background. Empty `src` = no photo.
    photo: { src: 'assets/images/profile.webp', width: 560, height: 700 },
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
        'Tran Phuoc Sang: AI Agent Developer at CodePresso and M.Sc. student in Computer Science at Ton Duc Thang University, researching LLM distillation, reasoning in small language models, foundation models and transfer learning.',
      url: 'https://phuocsang07.github.io/',
      ogImage: '', // TODO(owner): 1200x630 image, e.g. 'assets/images/og.png'
    },
  },

  // Newest first ({ date: 'YYYY-MM', textHtml }). Currently hidden: an empty list is not rendered.
  news: [],

  publications: [
    {
      title:
        'Steering Refusal via Knowledge Distillation: A Practical Recipe for Entity-Conditioned Unlearning in Vietnamese Language Models',
      authors: [{ name: 'Anh-Cuong Le' }, { name: 'Phuoc-Sang Tran', me: true }, { name: 'Thang V. Q. Le' }],
      venueShort: 'KSE 2026',
      venue: '18th International Conference on Knowledge and Systems Engineering (KSE), Kanazawa, Japan',
      year: 2026,
      note: 'Accepted, to appear',
      summary:
        'A label-free way to make a language model decline questions about a chosen set of entities while keeping its other capabilities: a frozen teacher that is prompted to refuse supplies the training signal for the student.',
      highlights: [
        'Forget refusal reaches 61% on Qwen3-4B and 72% on Qwen3-8B across three seeds, with VMLU within 3.0 points and perplexity within 0.3 of the original model.',
        'Two implementation choices decide whether the method works at all: leaving the reply wording unconstrained and delivering the prefix through the chat system role.',
        'Introduces a Vietnamese entity-conditioned refusal benchmark built from UIT-ViQuAD 2.0.',
        'Reports the limits as well: the suppression is behavioural, and a few relearning steps remove it.',
      ],
      // TODO(owner): add `url` (publisher page) and `doi` once the proceedings are out
      links: { url: '', pdf: 'https://drive.google.com/file/d/1K4s_01s2NAkXeZuQk_ikieH62jRrXAi6/view', arxiv: '', code: '', slides: '' },
      doi: '',
      abstract:
        'Deployers sometimes need a language model to decline questions about a specific set of entities without losing other capabilities, for instance after a takedown request or across a licensing boundary. Fine-tuning on freshly labelled refusals can do this, but it needs new supervision each time the target set changes. Distillation offers a label-free alternative: a prompt already induces the refusal, so a frozen teacher shown that prompt supplies the training signal directly. We retarget this idea from whole domains to individual entities and to Vietnamese, and ablate four implementation choices invisible when the target is a whole domain. Two decide whether it works at all: leaving the reply wording unconstrained and delivering the prefix through the chat system role; without either, the student refuses nearly everything or nearly nothing. Filtering the distillation set by the teacher’s measured refusal adds five points, while naming only the entity each question concerns does not help. On a Vietnamese entity-conditioned refusal benchmark we build from UIT-ViQuAD 2.0, whose residual tier separability is measured rather than assumed away, forget refusal reaches 61% and 72% on Qwen3-4B and 8B (three seeds, SD at most 2 points) with VMLU within 3.0 points and perplexity within 0.3, at the cost of 18–19% erroneous refusal on retained topics; an NPO baseline under the same budget instead degrades retained answers and doubles perplexity. ROUGE-L recall, the metric most of this literature reports, cannot detect the 2–2.8-fold output-length increase that steering induces, so we recommend F-measure or exact match alongside it. The suppression is behavioural, not permanent: a few relearning steps remove the refusal at 4B and 8B, and vulnerability to prompt-only jailbreaks grows with scale.',
      bibtex: '',
    },
    {
      title: 'Addressing Data Scarcity and Imbalance in Depression Screening with Persona-Driven Synthetic Data',
      authors: [{ name: 'Luyen Vo' }, { name: 'Phuoc-Sang Tran', me: true }, { name: 'Anh-Cuong Le' }],
      venueShort: 'SOICT 2025',
      venue: 'Springer CCIS · 14th International Symposium on Information and Communication Technology (SOICT), Nha Trang, Vietnam',
      year: 2025,
      note: '',
      summary:
        'A three-stage pipeline in which an LLM, guided by the PHQ-8 clinical scale and diverse user personas, generates realistic narrative synopses of clinical interviews, giving depression-screening models more and better-balanced training data.',
      highlights: [
        'A model trained on the combined synthetic and real data reaches an F1-score of 0.84 on the DAIC test set, approaching models trained on real data.',
        'Embedding-space analysis shows the synthetic data closely mirrors the semantic features and label distribution of real data, which mitigates label imbalance.',
        'Contributes a validated generation framework and a dataset released to the research community.',
      ],
      links: { url: 'https://link.springer.com/chapter/10.1007/978-981-92-2584-2_47', pdf: '', arxiv: '', code: '', slides: '' },
      doi: '10.1007/978-981-92-2584-2_47',
      abstract:
        'Data scarcity and privacy concerns are significant barriers to developing machine learning models for depression screening. This research introduces and validates a novel framework for generating high-quality synthetic data to address this challenge. The core of the methodology is a three-stage pipeline where a Large Language Model (LLM), guided by clinical scales (PHQ-8) and diverse user personas, generates realistic narrative synopses from clinical interviews. Empirical validation demonstrates the framework’s efficacy: a model trained on our combined synthetic and real data achieved a high F1-score of 0.84 on the DAIC test set, indicating a more stable and reliable training process compared to prior methods while approaching the performance of models trained on real data. Further analysis, including embedding space visualization, confirms that our synthetic data closely mirrors the semantic features and label distribution of real-world data, thereby mitigating the risks of label imbalance and enhancing model generalization. This study contributes (1) a validated framework for synthetic data generation and (2) a high-quality dataset released to the research community. Our work lays the groundwork for developing more robust and equitable AI-driven tools for mental health screening, underscoring that the quality of synthetic data is paramount for building reliable applications.',
      bibtex: '', // TODO(owner): paste "Cite this paper" BibTeX from the Springer page
    },
  ],

  projects: [
    {
      title: 'Legal Chatbot with Advanced RAG',
      description:
        'Legal question-answering system for Vietnamese law built on retrieval-augmented generation, with hierarchical document retrieval and a Streamlit interface.',
      highlights: [
        'Parent–child retrieval over legal documents stored in PostgreSQL, so an answer keeps the context of the passage it came from.',
        'Semantic routing sends each query to the processing pipeline that fits it.',
        'A grading step scores retrieved documents for relevance before the answer is generated.',
        'The whole pipeline, from ingestion to response generation, is orchestrated with LangGraph and backed by a result cache.',
      ],
      stack: ['Python', 'LangChain', 'LangGraph', 'Qdrant', 'PostgreSQL', 'Streamlit'],
      links: { code: 'https://github.com/PhuocSang07/legal-chatbot' },
      featured: true,
    },
    {
      title: 'Qwen2.5-3B Fine-tuned for Vietnamese Law',
      description:
        'Fine-tuned Qwen2.5-3B on a Vietnamese legal corpus and QA dataset for a legal chatbot, using Unsloth with LoRA.',
      highlights: [
        'Two stages: the base model is first adapted to a Vietnamese legal corpus, then fine-tuned on question–answer pairs.',
        'Question–answer data comes from hoidap-tvpl-20k, a Vietnamese legal QA dataset I published on Hugging Face.',
        'LoRA adapter of rank 128 with rank-stabilised scaling on every attention and MLP projection; the embeddings and output head are trained as well.',
        'Released as a PEFT adapter under the MIT licence.',
      ],
      stack: ['Python', 'PyTorch', 'Hugging Face', 'Unsloth', 'LoRA'],
      links: {
        model: 'https://huggingface.co/phuocsang/qwen2.5-3B-Finetune-Vietnamese-Law',
        dataset: 'https://huggingface.co/datasets/phuocsang/hoidap-tvpl-20k',
      },
      featured: true,
    },
    {
      title: 'Vistral-7B Fine-tuned for a Travel Chatbot',
      description:
        'Loaded Viet-Mistral-7B-Chat in 4-bit precision and fine-tuned it with LoRA on a Vietnamese travel QA dataset generated by Gemini 1.5 Pro.',
      highlights: [
        'Dataset of 4,500 Vietnamese question–answer pairs on destinations, travel costs, local food, culture and festivals.',
        '4-bit NF4 quantisation keeps the 7B model within the memory of two T4 GPUs during training.',
        'Three epochs of supervised fine-tuning with LoRA; training loss ends at 0.56.',
      ],
      stack: ['Python', 'PyTorch', 'Hugging Face', 'PEFT', 'LoRA', 'bitsandbytes'],
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
        'Design and build AI agent systems that automate workflows in education, from architecture to deployment.',
        'Develop the knowledge layer that agents rely on: an Agent Wiki and a Knowledge Base Agent, currently in development.',
        'Improve agent pipelines for higher performance and lower operating cost.',
        'Deploy and operate agent services on AWS (S3, Lambda, ECS).',
      ],
      stack: ['Python', 'LangChain', 'AI Agents', 'AWS S3', 'AWS Lambda', 'AWS ECS'],
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
      end: '2027',
      endExpected: true, // still in progress: shown as "2025 – 2027 (expected)"
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
      title: '2nd Prize — Olympic AI Ho Chi Minh City 2025 (OAI HCMC 2025)',
      description:
        'Team award from the Ho Chi Minh City Computer Association (HCA). The competition was held at Ho Chi Minh City University of Technology (HUTECH).',
      images: [
        {
          src: 'assets/images/awards/oai-hcmc-2025-certificate.jpg',
          alt: 'Certificate of merit for 2nd Prize, Olympic AI Ho Chi Minh City 2025, from the Ho Chi Minh City Computer Association',
          width: 1572,
          height: 1083,
        },
      ],
    },
  ],
};
