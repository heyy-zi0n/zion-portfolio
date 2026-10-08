export type ContentStatus = "draft" | "published" | "archived";

export type ProjectDecision = {
  id: number;
  title: string;
  detail: string;
};

export type SystemFlowStep = {
  id?: string;
  label: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  fullTitle: string | null;
  description: string;
  problem: string | null;
  outcome: string | null;
  technologies: string[];
  decisions: ProjectDecision[];
  systemFlow: SystemFlowStep[];
  imagePath: string | null;
  repositoryUrl: string | null;
  liveUrl: string | null;
  status: ContentStatus;
  sortOrder: number;
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ExperienceRole = {
  id: number;
  title: string;
  period: string; // Used for UI display, keeping it consistent with the fallback
  highlights: string[];
};

export type Experience = {
  id: string;
  organization: string;
  organizationUrl: string | null;
  role: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  highlights: string[];
  status: ContentStatus;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type SiteSettings = {
  id: string;
  cvPath: string | null;
  updatedAt?: string;
};

export type MediaAsset = {
  id: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number | null;
  altText: string | null;
  createdAt: string;
};
