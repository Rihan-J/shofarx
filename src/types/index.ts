export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  image?: string;
}

export interface WebProject {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  project_link: string | null;
  category: string;
  created_at: string;
}

export interface Skill {
  name: string;
  icon: string;
  level: 'Learning' | 'Comfortable' | 'Confident' | 'Basics';
  category: 'language' | 'framework';
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  year: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
