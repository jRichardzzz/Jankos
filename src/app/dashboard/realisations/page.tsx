"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useProjects, Project } from "@/context/ProjectsContext";
import { 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FolderOpen,
  Calendar,
  ImageIcon
} from "lucide-react";

// Import Alice image
import AliceImage from "@/Alice-removebg.png";

export default function RealisationsPage() {
  const { projects, deleteProject } = useProjects();
  const [filter, setFilter] = useState<'all' | 'completed' | 'generating' | 'failed'>('all');

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  // Calculate days remaining
  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Download image
  const downloadImage = (url: string, projectName: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all images from a project
  const downloadAllImages = (project: Project) => {
    project.images.forEach((img, idx) => {
      setTimeout(() => {
        downloadImage(img.imageUrl, project.name, idx);
      }, idx * 500);
    });
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Terminé
          </span>
        );
      case 'generating':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            En cours
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Échoué
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Mes Réalisations</h1>
        <p className="text-gray-500 mt-1">
          Retrouvez toutes vos miniatures générées (disponibles pendant 15 jours)
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-3 mb-8"
      >
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Tous ({projects.length})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'completed' 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Terminés ({projects.filter(p => p.status === 'completed').length})
        </button>
        <button 
          onClick={() => setFilter('generating')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'generating' 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          En cours ({projects.filter(p => p.status === 'generating').length})
        </button>
      </motion.div>

      {/* Projects grid */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-6">
          {filteredProjects.map((project, index) => {
            const daysRemaining = getDaysRemaining(project.expiresAt);
            const isExpiringSoon = daysRemaining <= 7;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Project Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12">
                        <Image
                          src={AliceImage}
                          alt="Alice"
                          fill
                          className="object-contain object-bottom"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(project.status)}
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {project.images.length} miniature{project.images.length > 1 ? 's' : ''}
                    </span>
                    <span className={`flex items-center gap-1 ${isExpiringSoon ? 'text-orange-500 font-medium' : ''}`}>
                      <Clock className="w-3 h-3" />
                      {daysRemaining > 0 ? `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}` : 'Expire bientôt'}
                    </span>
                    <span className="text-amber-500">
                      {project.creditsUsed} crédit{project.creditsUsed > 1 ? 's' : ''} utilisé{project.creditsUsed > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Images Grid */}
                {project.images.length > 0 && (
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.images.map((image, imgIndex) => (
                        <div 
                          key={image.id} 
                          className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden"
                        >
                          <img
                            src={image.imageUrl}
                            alt={`Miniature ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => downloadImage(image.imageUrl, project.name, imgIndex)}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Télécharger
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Download all button */}
                    {project.images.length > 1 && (
                      <button
                        onClick={() => downloadAllImages(project)}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger toutes les miniatures
                      </button>
                    )}
                  </div>
                )}

                {/* Loading state for generating projects */}
                {project.status === 'generating' && project.images.length === 0 && (
                  <div className="p-8 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-sm">Génération en cours...</p>
                  </div>
                )}

                {/* Message si les images ont expiré de la session */}
                {project.status === 'completed' && project.images.length === 0 && (
                  <div className="p-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm text-center">
                      Les miniatures de cette session ont expiré.<br />
                      <span className="text-xs">Les images sont disponibles uniquement pendant la session de création.</span>
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
          <p className="text-gray-500 mb-6">Commencez à créer avec nos agents IA pour retrouver vos réalisations ici</p>
          <Link
            href="/dashboard/alice"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            Créer mon premier projet
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
