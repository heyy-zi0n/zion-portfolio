export type SocialLink = {
  id: number;
  name: string;
  url: string;
  detail?: string;
  target?: "_self" | "_blank";
};

export type ExperienceRole = {
  id: number;
  title: string;
  period: string;
  highlights: string[];
};

export type Experience = {
  id: number;
  company: string;
  url?: string;
  roles: ExperienceRole[];
};

export type ProjectDecision = {
  id: number;
  title: string;
  detail: string;
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  fullTitle?: string;
  description: string;
  techUsed: string[];
  url?: string;
  repo?: string;
  img: string;
  caseStudy: {
    problem: string;
    decisions: ProjectDecision[];
    outcome: string;
  };
};

export const SOCIAL_LINKS: SocialLink[] = [
  { id: 1, name: "email", detail: "zionomosanya485@gmail.com", url: "mailto:zionomosanya485@gmail.com" },
  { id: 2, name: "github", detail: "github.com/heyy-zi0n", url: "https://github.com/heyy-zi0n", target: "_blank" },
  { id: 3, name: "fiverr", detail: "fiverr.com/ziondatapro", url: "https://www.fiverr.com/ziondatapro?public_mode=true", target: "_blank" },
  { id: 4, name: "whatsapp", detail: "wa.me/2347037234590", url: "https://wa.me/2347037234590", target: "_blank" }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    company: "Independent",
    roles: [
      {
        id: 1,
        title: "Freelance Software / Frontend Developer",
        period: "2026 — Present",
        highlights: [
          "Build responsive websites and web applications for client and academic use.",
          "Develop frontend interfaces as well as PHP/MySQL application workflows where required.",
          "Work with modern responsive design, Git-based development and web deployment."
        ]
      }
    ]
  },
  {
    id: 2,
    company: "LASU FCIT",
    roles: [
      {
        id: 1,
        title: "Frontend Development Intern",
        period: "Oct 2025 — Dec 2025",
        highlights: [
          "Assisted during HTML, CSS and jQuery practical sessions.",
          "Built responsive web pages and a landing-page project.",
          "Supported students during practical classes while gaining experience with jQuery and basic PHP."
        ]
      }
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "emms",
    title: "Examination Management System",
    fullTitle: "Examination Question Lifecycle Management System with Moderation, Approval, Audit and Controlled Printing for LASU FCIT",
    description: "A secure examination-question workflow system for LASU FCIT that manages question submission, moderation, approval, lockdown, audit history and controlled printing across multiple staff roles.",
    techUsed: ["PHP 8+", "MySQL", "PDO", "Tailwind CSS", "JavaScript"],
    repo: "https://github.com/heyy-zi0n/FCIT-Examination-Management-Moderation-System",
    img: "/images/projects/emms.png",
    caseStudy: {
      problem: "Managing examination questions requires more than uploading documents. The process must preserve accountability from lecturer submission through moderation and final approval while preventing unauthorized access or premature printing.",
      decisions: [
        {
          id: 1,
          title: "role-based examination lifecycle",
          detail: "Model the workflow around Lecturer → Moderator → HOD and Exam Officer responsibilities rather than treating every user as a generic administrator."
        },
        {
          id: 2,
          title: "dual approval and controlled lockdown",
          detail: "Require the necessary approvals before an examination paper reaches its locked state and use AES-256-GCM-based protection for the controlled document lifecycle."
        },
        {
          id: 3,
          title: "printing tied to examination timing",
          detail: "Restrict normal printing to the approved period near the scheduled examination date while supporting an authorized emergency override flow."
        },
        {
          id: 4,
          title: "versioning and auditability",
          detail: "Track revisions, moderation actions, approvals, print history and important system actions so the lifecycle can be reviewed later."
        }
      ],
      outcome: "A working role-based examination management system that formalizes the paper lifecycle and combines moderation, approval, security controls and printing governance in one application."
    }
  },
  {
    id: 2,
    slug: "shoheed-schools",
    title: "Shoheed Schools",
    fullTitle: "Shoheed Private Schools Management System",
    description: "A multi-role school management platform for managing students, staff, academic sessions, classes, subject assignments, results, attendance, finance and school administration.",
    techUsed: ["PHP", "MySQL", "PDO", "JavaScript", "Tailwind CSS"],
    repo: "https://github.com/heyy-zi0n/shoheed-school-portal",
    img: "/images/projects/shoheed-schools.svg",
    caseStudy: {
      problem: "School operations such as student records, subject allocation, results, attendance and fee management can become fragmented when they are handled independently or manually.",
      decisions: [
        {
          id: 1,
          title: "workflow-driven results",
          detail: "Model result processing as DRAFT → SUBMITTED → CLASS_TEACHER_VERIFIED → PRINCIPAL_APPROVED → PUBLISHED instead of allowing marks to become final immediately."
        },
        {
          id: 2,
          title: "capabilities separate from portal roles",
          detail: "Allow staff such as the Principal or Proprietor to teach subjects based on explicit teaching capabilities rather than assuming job title alone determines every permission."
        },
        {
          id: 3,
          title: "session-aware assignments",
          detail: "Tie class-teacher and subject-teacher assignments to academic sessions and enforce constraints that prevent conflicting assignments."
        },
        {
          id: 4,
          title: "centralized application bootstrap",
          detail: "Centralize sessions, authentication helpers, CSRF handling and shared application initialization so portal behavior remains consistent across modules."
        }
      ],
      outcome: "A structured school portal architecture covering core academic and administrative workflows while preserving role-based access and session-aware school data."
    }
  },
  {
    id: 3,
    slug: "icapes",
    title: "ICAPES",
    fullTitle: "Intelligent Context-Aware Photo Enhancement System",
    description: "A context-aware photo enhancement application that analyzes image characteristics and selects appropriate enhancement operations instead of applying one fixed filter to every image.",
    techUsed: ["Python", "Flask", "OpenCV", "scikit-image", "NumPy", "Pillow", "MySQL", "JavaScript"],
    img: "/images/projects/icapes.png",
    caseStudy: {
      problem: "Generic enhancement pipelines often apply similar adjustments to every photo even though exposure, contrast, noise, sharpness and saturation problems vary significantly between images.",
      decisions: [
        {
          id: 1,
          title: "measure before enhancing",
          detail: "Analyze brightness, contrast, noise, sharpness, saturation and clipping using normalized image metrics before deciding what corrections are needed."
        },
        {
          id: 2,
          title: "rule-based context decisions",
          detail: "Use a dedicated decision layer to map measured image conditions to suitable enhancement actions instead of blindly applying the entire pipeline."
        },
        {
          id: 3,
          title: "ordered enhancement pipeline",
          detail: "Apply selected operations in a controlled sequence such as denoising, exposure correction, contrast adjustment, color correction and sharpening."
        },
        {
          id: 4,
          title: "secure media and history",
          detail: "Keep original/enhanced media paths controlled through the application and store analysis metrics and applied actions so previous enhancement sessions can be reviewed."
        }
      ],
      outcome: "A working Flask-based system supporting individual and batch enhancement, before/after previews, downloads and enhancement history while adapting processing decisions to the input image."
    }
  },
  {
    id: 4,
    slug: "bizboost",
    title: "BizBoost",
    fullTitle: "BizBoost Business Landing Page",
    description: "A responsive business landing page focused on clean presentation, accessible navigation and a conversion-oriented frontend experience.",
    techUsed: ["HTML5", "Tailwind CSS", "JavaScript"],
    repo: "https://github.com/heyy-zi0n/bizboost-website",
    url: "https://bizboost-website.vercel.app/",
    img: "/images/projects/bizboost.png",
    caseStudy: {
      problem: "Build a polished business landing page that presents the brand clearly across desktop and mobile without relying on a heavy frontend framework.",
      decisions: [
        {
          id: 1,
          title: "responsive from the beginning",
          detail: "Structure sections and typography to adapt cleanly across mobile, tablet and desktop rather than treating responsiveness as a final patch."
        },
        {
          id: 2,
          title: "lightweight frontend",
          detail: "Use HTML, Tailwind CSS and focused JavaScript interactions instead of introducing application-level complexity that the project does not require."
        },
        {
          id: 3,
          title: "clear hierarchy",
          detail: "Keep content, calls to action and navigation visually clear so visitors can quickly understand the offering and move through the page."
        }
      ],
      outcome: "A deployed responsive landing page demonstrating lightweight frontend implementation and responsive UI work."
    }
  }
];
