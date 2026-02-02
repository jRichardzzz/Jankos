"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: string;
}

// Version pour le stockage localStorage (avec URLs Supabase)
interface StoredProject {
  id: string;
  name: string;
  description: string;
  imageUrls: string[]; // URLs Supabase (pas base64)
  createdAt: string;
  expiresAt: string;
  status: 'generating' | 'completed' | 'failed';
  creditsUsed: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  images: GeneratedImage[];
  createdAt: string;
  expiresAt: string; // 30 jours après création
  status: 'generating' | 'completed' | 'failed';
  creditsUsed: number;
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'expiresAt'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addImageToProject: (projectId: string, image: GeneratedImage) => void;
  getProject: (id: string) => Project | undefined;
  deleteProject: (id: string) => void;
  cleanExpiredProjects: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = 'jankos_projects_v2';
const EXPIRATION_DAYS = 15; // 15 jours de conservation

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load projects from localStorage on mount (avec URLs Supabase)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Nettoyer les anciens storages
      localStorage.removeItem('jankos_projects');
      localStorage.removeItem('jankos_projects_meta');
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed: StoredProject[] = JSON.parse(stored);
          // Recréer les projets avec les images depuis les URLs Supabase
          const projectsWithImages: Project[] = parsed.map(p => ({
            ...p,
            images: (p.imageUrls || []).map((url, idx) => ({
              id: `img-${p.id}-${idx}`,
              imageUrl: url,
              createdAt: p.createdAt
            }))
          }));
          setProjects(projectsWithImages);
        } catch (e) {
          console.error('Failed to parse stored projects:', e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save projects to localStorage (avec URLs Supabase)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        // Sauvegarder avec les URLs Supabase (pas les base64)
        const projectsToStore: StoredProject[] = projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          imageUrls: p.images.map(img => img.imageUrl).filter(url => url.startsWith('http')), // Only Supabase URLs
          createdAt: p.createdAt,
          expiresAt: p.expiresAt,
          status: p.status,
          creditsUsed: p.creditsUsed
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToStore));
      } catch (e) {
        console.error('Failed to save projects:', e);
      }
    }
  }, [projects, isLoaded]);

  // Clean expired projects on load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isLoaded) {
      cleanExpiredProjects();
    }
  }, [isLoaded]);

  const addProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt' | 'expiresAt'>): string => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
    
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    setProjects(prev => [newProject, ...prev]);
    return newProject.id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  }, []);

  const addImageToProject = useCallback((projectId: string, image: GeneratedImage) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, images: [...p.images, image] }
        : p
    ));
  }, []);

  const getProject = useCallback((id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const cleanExpiredProjects = useCallback(() => {
    const now = new Date();
    setProjects(prev => prev.filter(p => new Date(p.expiresAt) > now));
  }, []);

  return (
    <ProjectsContext.Provider value={{ 
      projects, 
      addProject, 
      updateProject, 
      addImageToProject,
      getProject, 
      deleteProject,
      cleanExpiredProjects 
    }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
