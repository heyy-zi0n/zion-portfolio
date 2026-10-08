-- Seed data for projects
INSERT INTO projects (slug, title, full_title, description, problem, outcome, technologies, decisions, system_flow, image_path, repository_url, live_url, status, sort_order)
VALUES
(
  'emms',
  'Examination Management System',
  'Examination Question Lifecycle Management System with Moderation, Approval, Audit and Controlled Printing for LASU FCIT',
  'A role-based web application to securely manage the entire lifecycle of examination questions—from submission by lecturers, through moderation and approval by HODs, to secure, audited printing.',
  'Examination processes involved physical flash drives and emails, creating severe security vulnerabilities and making it difficult to maintain an accurate audit trail of who modified or approved questions before printing.',
  'Replaced insecure manual processes with a unified, role-based platform. Achieved a secure audit trail, isolated final printing access, and reduced question leakage risks by introducing encrypted, localized digital workflows.',
  ARRAY['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
  '[
    {"id": 1, "title": "Role-Based Access Control (RBAC)", "detail": "Implemented strict role definitions (Lecturer, Moderator, HOD, Exam Officer) ensuring users only see and interact with questions relevant to their specific clearance level."},
    {"id": 2, "title": "Secure Printing Lockdown", "detail": "Built a lockdown state that restricts final document generation to authorized Exam Officers using a time-sensitive, audit-logged secure portal."}
  ]'::jsonb,
  '[
    { "label": "Lecturer" },
    { "label": "Moderator" },
    { "label": "HOD" },
    { "label": "Exam Officer" },
    { "label": "Lockdown" },
    { "label": "Print" }
  ]'::jsonb,
  '/images/projects/emms.png',
  NULL,
  NULL,
  'published',
  1
),
(
  'shoheed-schools',
  'Shoheed Schools',
  NULL,
  'A comprehensive school management system designed to track student progress, manage staff records, and streamline administrative workflows for educators and administrators.',
  'School administration relied heavily on physical paperwork and disconnected spreadsheets, leading to lost records, slow report generation, and poor communication between teachers and management.',
  'Delivered a unified portal that centralized student records and staff management. Reduced administrative time spent on report card generation by over 40% and improved data accuracy across the institution.',
  ARRAY['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
  '[
    {"id": 1, "title": "Centralized Database Architecture", "detail": "Designed a relational database schema that interconnected student profiles, academic records, and staff assignments, preventing data duplication."},
    {"id": 2, "title": "Automated Report Generation", "detail": "Engineered a dynamic PDF generation module that instantly compiles student grades and teacher remarks into printable terminal reports."}
  ]'::jsonb,
  '[
    { "label": "Draft" },
    { "label": "Submitted" },
    { "label": "Class Teacher Verified" },
    { "label": "Principal Approved" },
    { "label": "Published" }
  ]'::jsonb,
  '/images/projects/shoheed.png',
  'https://github.com/heyy-zi0n/shoheed',
  'https://shoheedschools.com.ng/',
  'published',
  2
),
(
  'icapes',
  'ICAPES',
  NULL,
  'A web-based platform for the International Conference on Advanced Power and Energy Systems, facilitating attendee registration, schedule management, and speaker coordination.',
  'Managing conference attendees, schedules, and speaker submissions via email threads became chaotic, making it difficult for organizers to track who was attending which sessions.',
  'Created a streamlined registration flow and dynamic schedule dashboard. Reduced organizer workload significantly and provided attendees with an always-up-to-date, mobile-responsive conference agenda.',
  ARRAY['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
  '[
    {"id": 1, "title": "Dynamic Scheduling System", "detail": "Built an interactive, database-driven agenda that organizers could update in real-time without modifying code, ensuring attendees always had accurate session times."},
    {"id": 2, "title": "Streamlined Registration Flow", "detail": "Developed a frictionless, multi-step registration form with automated email confirmations, reducing drop-offs and administrative follow-up."}
  ]'::jsonb,
  '[
    { "label": "Analyze" },
    { "label": "Decide" },
    { "label": "Enhance" },
    { "label": "Compare" }
  ]'::jsonb,
  '/images/projects/icapes.png',
  NULL,
  'https://icapes.lasu.edu.ng/',
  'published',
  3
),
(
  'bizboost',
  'BizBoost',
  NULL,
  'A modern, high-performance landing page aimed at helping small businesses establish an immediate and professional online presence.',
  'Small business owners often struggle with the technical barrier and high cost of entry to get a clean, fast, and conversion-optimized website launched quickly.',
  'Delivered a lightweight, highly-optimized template that scores 90+ on Core Web Vitals. Provided a plug-and-play architecture allowing rapid deployment for new business clients.',
  ARRAY['React', 'Tailwind CSS', 'Vite', 'Framer Motion'],
  '[
    {"id": 1, "title": "Component-Driven Architecture", "detail": "Structured the landing page into reusable React components (Hero, Features, Pricing, Testimonials) to allow rapid customization for different clients."},
    {"id": 2, "title": "Performance Optimization", "detail": "Utilized Vite for aggressive bundling and Tailwind CSS for minimal stylesheet payload, ensuring near-instant load times even on slow mobile networks."}
  ]'::jsonb,
  '[]'::jsonb,
  '/images/projects/bizboost.png',
  'https://github.com/heyy-zi0n/bizboost',
  'https://bizboost.netlify.app/',
  'published',
  4
);

-- Seed data for experiences
INSERT INTO experiences (organization, role, organization_url, start_date, is_current, highlights, status, sort_order)
VALUES
(
  'Independent',
  'Freelance Software / Frontend Developer',
  NULL,
  '2026-01-01',
  true,
  ARRAY[
    'Built responsive websites and web applications for client and academic use.',
    'Developed frontend interfaces as well as PHP/MySQL application workflows where required.',
    'Worked with modern responsive design, Git-based development, and web deployment.'
  ],
  'published',
  1
);

INSERT INTO experiences (organization, role, organization_url, start_date, end_date, is_current, highlights, status, sort_order)
VALUES
(
  'LASU FCIT',
  'Frontend Development Intern',
  NULL,
  '2025-10-01',
  '2025-12-31',
  false,
  ARRAY[
    'Assisted during HTML, CSS, and jQuery practical sessions.',
    'Built responsive web pages and a landing-page project.',
    'Supported students during practical classes while gaining experience with jQuery and basic PHP.'
  ],
  'published',
  2
);

-- Seed Site Settings
INSERT INTO site_settings (cv_path) VALUES (NULL);
