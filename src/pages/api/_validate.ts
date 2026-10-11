import { z } from 'zod';

// Reusable validators
const url = z.string().url('Must be a valid URL');
const shortText = (max = 100) => z.string().min(1).max(max);

export const ProjectSchema = z.object({
  name: shortText(100),
  description: shortText(1000),
  tech_stack: z.array(z.string().min(1)).min(1),
  live_url: url,
  github_url: url.optional().or(z.literal('')),
  image: z.string().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

export const WebProjectSchema = z.object({
  title: shortText(200),
  description: shortText(2000),
  image_url: z.string().optional().or(z.literal('')),
  project_link: z.string().optional().or(z.literal('')),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

export const AchievementSchema = z.object({
  emoji: shortText(10),
  title: shortText(200),
  description: shortText(500),
  year: shortText(20),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

export const SkillSchema = z.object({
  name: shortText(50),
  icon: shortText(100),
  level: z.enum(['Learning', 'Basics', 'Comfortable', 'Confident']),
  category: z.enum(['language', 'framework']),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

export const SocialSchema = z.object({
  name: shortText(50),
  url: z.string().regex(/^https?:\/\/|^mailto:/, 'Must be http/https/mailto URL'),
  icon: shortText(50),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

export const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  service_type: z.enum(['portfolio', 'web', 'social']).default('portfolio'),
});

export const LoginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(1),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type WebProjectInput = z.infer<typeof WebProjectSchema>;
export type AchievementInput = z.infer<typeof AchievementSchema>;
export type SkillInput = z.infer<typeof SkillSchema>;
export type SocialInput = z.infer<typeof SocialSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;



