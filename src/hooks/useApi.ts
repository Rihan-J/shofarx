import { useQuery } from '@tanstack/react-query';
import type { Project, Skill, Achievement, SocialLink, WebProject } from '../types';

// Removed static fallback data imports as strict DB loading is required

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`/api/${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/**
 * Maps DB row (snake_case) to frontend type (camelCase).
 */

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description),
    techStack: Array.isArray(row.tech_stack) ? row.tech_stack.map(String) : [],
    liveUrl: String(row.live_url),
    githubUrl: row.github_url ? String(row.github_url) : undefined,
    image: row.image ? String(row.image) : undefined,
  };
}

function mapSkill(row: Record<string, unknown>): Skill {
  return {
    name: String(row.name),
    icon: String(row.icon),
    level: row.level as Skill['level'],
    category: row.category as Skill['category'],
  };
}

function mapAchievement(row: Record<string, unknown>): Achievement {
  return {
    id: String(row.id),
    emoji: String(row.emoji),
    title: String(row.title),
    description: String(row.description),
    year: String(row.year),
  };
}

function mapSocialLink(row: Record<string, unknown>): SocialLink {
  return {
    name: String(row.name),
    url: String(row.url),
    icon: String(row.icon),
  };
}

/**
 * Custom hook wrapper: tries API first, falls back to static data on error.
 * Uses `initialData` so content is always visible even if API fails.
 */

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const rows = await fetchApi<Record<string, unknown>[]>('projects');
      return rows.map(mapProject);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const rows = await fetchApi<Record<string, unknown>[]>('skills');
      return rows.map(mapSkill);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      const rows = await fetchApi<Record<string, unknown>[]>('achievements');
      return rows.map(mapAchievement);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useSocialLinks() {
  return useQuery<SocialLink[]>({
    queryKey: ['social'],
    queryFn: async () => {
      const rows = await fetchApi<Record<string, unknown>[]>('social');
      return rows.map(mapSocialLink);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useWebProjects() {
  return useQuery<WebProject[]>({
    queryKey: ['web-projects'],
    queryFn: () => fetchApi<WebProject[]>('web-projects'),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useSocialProjects() {
  return useQuery<WebProject[]>({
    queryKey: ['social-projects'],
    queryFn: () => fetchApi<WebProject[]>('social-projects'),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });
}
