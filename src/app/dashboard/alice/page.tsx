"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  X, 
  User, 
  Package,
  ArrowLeft,
  ImageIcon,
  FolderOpen,
  Settings2,
  Zap
} from 'lucide-react';
import { useCredits } from '@/context/CreditsContext';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useProjects } from '@/context/ProjectsContext';
import { useHistory } from '@/context/HistoryContext';

// Types
interface Actor {
  id: string;
  file: File;
  previewUrl: string;
  emotion: string;
}

interface SceneObject {
  id: string;
  file: File;
  previewUrl: string;
  style: string;
}

enum Emotion {
  CHOQUE = "Choqué",
  EXCITE = "Excité",
  PENSIF = "Pensif",
  SERIEUX = "Sérieux",
  JOYEUX = "Joyeux"
}

enum VisualStyle {
  TECH = "Tech/Moderne",
  BUSINESS = "Business",
  FUN = "Fun/Coloré",
  MINIMALISTE = "Minimaliste",
  DRAMATIQUE = "Dramatique"
}

type ImageSize = '1K' | '2K' | '4K';

interface GenerationSettings {
  description: string;
  title: string;
  emotion: Emotion;
  style: VisualStyle;
  textIntensity: number;
  count: number;
  imageSize: ImageSize;
}

interface GeneratedThumbnail {
  id: string;
  imageUrl: string;
  settings: GenerationSettings;
}

// Constants
const EMOTIONS = Object.values(Emotion);
const VISUAL_STYLES = Object.values(VisualStyle);
// Résolution fixée à 2K (VHQ) - invisible pour le client
const TEXT_INTENSITY_LABELS: Record<number, string> = {
  1: 'Discret',
  5: 'Équilibré',
  10: 'Imposant'
};

// Helper to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

// Import Alice image
import AliceImage from '@/Alice-removebg.png';

export default function AlicePage() {
  // Use shared contexts
  const { credits, deductCredits, addCredits, isHydrated } = useCredits();
  const { addProject, updateProject, addImageToProject } = useProjects();
  const { addHistoryItem } = useHistory();

  // Data State
  const [actors, setActors] = useState<Actor[]>([]);
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [useActors, setUseActors] = useState(true);
  const [useObjects, setUseObjects] = useState(true);

  // Settings State
  const [settings, setSettings] = useState<GenerationSettings>({
    description: '',
    title: '',
    emotion: Emotion.EXCITE,
    style: VisualStyle.TECH,
    textIntensity: 5,
    count: 1,
    imageSize: '2K'
  });

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<GeneratedThumbnail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Refs
  const actorInputRef = useRef<HTMLInputElement>(null);
  const objectInputRef = useRef<HTMLInputElement>(null);

  // Calculate required credits
  const requiredCredits = settings.count;

  // Request generation - opens confirmation modal
  const handleRequestGenerate = () => {
    if (!settings.description) {
      setError("Veuillez fournir une description de la miniature.");
      return;
    }

    if (credits < requiredCredits) {
      setError(`Crédits insuffisants. Vous avez besoin de ${requiredCredits} crédit(s) mais vous n'en avez que ${credits}.`);
      return;
    }

    setError(null);
    setShowConfirmModal(true);
  };

  // Handle generation after confirmation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowForm(false);
    setError(null);
    setGeneratedThumbnails([]);
    setProgress(0);
    setCurrentStep('Débit des crédits...');

    // 1. DÉBITER LES CRÉDITS IMMÉDIATEMENT
    const success = await deductCredits(requiredCredits);
    if (!success) {
      setError("Erreur lors de la déduction des crédits.");
      setIsGenerating(false);
      setShowForm(true);
      return;
    }

    // 2. CRÉER LE PROJET IMMÉDIATEMENT
    const projectName = settings.title || `Miniature du ${new Date().toLocaleDateString('fr-FR')}`;
    const projectId = addProject({
      name: projectName,
      description: settings.description,
      images: [],
      status: 'generating',
      creditsUsed: requiredCredits,
    });

    setProgress(5);
    setCurrentStep('Préparation des données...');

    try {
      // Prepare actors data
      setProgress(10);
      setCurrentStep('Conversion des images...');
      
      const actorsData = useActors ? await Promise.all(
        actors.map(async (actor) => ({
          base64: await fileToBase64(actor.file),
          mimeType: actor.file.type,
          emotion: actor.emotion
        }))
      ) : [];

      // Prepare objects data
      setProgress(20);
      
      const objectsData = useObjects ? await Promise.all(
        objects.map(async (obj) => ({
          base64: await fileToBase64(obj.file),
          mimeType: obj.file.type,
          style: obj.style
        }))
      ) : [];

      setProgress(30);
      setCurrentStep('Envoi à l\'IA...');

      let successCount = 0;
      let failedCount = 0;

      // Generate each thumbnail one by one and display immediately
      for (let i = 0; i < settings.count; i++) {
        setCurrentStep(`Génération de la miniature ${i + 1}/${settings.count}...`);
        setProgress(30 + ((i / settings.count) * 60));

        try {
          const response = await fetch('/api/generate-thumbnail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              actors: actorsData,
              objects: objectsData,
              settings: {
                description: settings.description,
                title: settings.title,
                emotion: settings.emotion,
                style: settings.style,
                textIntensity: settings.textIntensity,
                imageSize: settings.imageSize
              }
            })
          });

          const data = await response.json();

          if (!response.ok) {
            // Erreur sur cette miniature, on rembourse 1 crédit et on continue
            failedCount++;
            await addCredits(1);
            console.error(`Miniature ${i + 1} échouée:`, data.error);
            // Continue avec la suivante
            continue;
          }

          const newImage = {
            id: `thumb-${Date.now()}-${i}`,
            imageUrl: data.imageUrl,
            createdAt: new Date().toISOString()
          };

          // Ajouter l'image au projet
          addImageToProject(projectId, newImage);

          // AFFICHER IMMÉDIATEMENT la miniature générée
          setGeneratedThumbnails(prev => [...prev, {
            id: newImage.id,
            imageUrl: data.imageUrl,
            settings: { ...settings }
          }]);

          successCount++;
          setProgress(30 + (((i + 1) / settings.count) * 60));

        } catch (err) {
          // Erreur réseau ou autre, rembourser et continuer
          failedCount++;
          await addCredits(1);
          console.error(`Miniature ${i + 1} erreur:`, err);
        }
      }

      // Marquer le projet comme terminé (ou partiellement)
      setProgress(95);
      setCurrentStep('Finalisation...');
      updateProject(projectId, { 
        status: successCount > 0 ? 'completed' : 'failed' 
      });

      // Ajouter à l'historique
      if (successCount > 0) {
        addHistoryItem({
          action: 'Miniature créée',
          description: `${successCount} miniature${successCount > 1 ? 's' : ''} générée${successCount > 1 ? 's' : ''} - ${projectName}${failedCount > 0 ? ` (${failedCount} échec${failedCount > 1 ? 's' : ''}, crédits remboursés)` : ''}`,
          agent: 'Alice',
          credits: -successCount,
          projectId: projectId,
        });
      }

      if (failedCount > 0 && successCount === 0) {
        // Toutes ont échoué
        throw new Error(`La génération a échoué. Vos ${failedCount} crédit${failedCount > 1 ? 's ont été remboursés' : ' a été remboursé'}.`);
      }

      setProgress(100);
      setCurrentStep(failedCount > 0 
        ? `Terminé ! ${successCount} réussie${successCount > 1 ? 's' : ''}, ${failedCount} échouée${failedCount > 1 ? 's' : ''} (remboursé${failedCount > 1 ? 's' : ''})`
        : 'Terminé !'
      );

    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la génération.";
      setError(errorMessage);
      setShowForm(true);
      
      // REMBOURSER LES CRÉDITS
      await addCredits(requiredCredits);
      
      // Marquer le projet comme échoué
      updateProject(projectId, { status: 'failed' });
      
      // Ajouter l'échec à l'historique (avec remboursement)
      addHistoryItem({
        action: 'Génération échouée - Crédits remboursés',
        description: `Erreur: ${errorMessage}`,
        agent: 'Alice',
        credits: 0, // Net = 0 car remboursé
        projectId: projectId,
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  // Reset for new generation
  const handleNewGeneration = () => {
    setGeneratedThumbnails([]);
    setShowForm(true);
    setSettings({
      description: '',
      title: '',
      emotion: Emotion.EXCITE,
      style: VisualStyle.TECH,
      textIntensity: 5,
      count: 1,
      imageSize: '2K'
    });
    setActors([]);
    setObjects([]);
  };

  // Actor handlers
  const handleActorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newActors: Actor[] = files.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
        emotion: 'Neutre'
      }));
      setActors(prev => [...prev, ...newActors]);
    }
    if (actorInputRef.current) actorInputRef.current.value = '';
  };

  const removeActor = (id: string) => {
    setActors(prev => prev.filter(a => a.id !== id));
  };

  const updateActorEmotion = (id: string, emotion: string) => {
    setActors(prev => prev.map(a => a.id === id ? { ...a, emotion } : a));
  };

  // Object handlers
  const handleObjectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newObjects: SceneObject[] = files.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
        style: 'Standard'
      }));
      setObjects(prev => [...prev, ...newObjects]);
    }
    if (objectInputRef.current) objectInputRef.current.value = '';
  };

  const removeObject = (id: string) => {
    setObjects(prev => prev.filter(o => o.id !== id));
  };

  const updateObjectStyle = (id: string, style: string) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, style } : o));
  };

  // Download handler
  const downloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail_jankos_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Afficher les résultats dès qu'il y en a (même pendant la génération)
  const hasResults = generatedThumbnails.length > 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleGenerate}
        title="Générer les miniatures"
        description={`Alice va créer ${settings.count} miniature${settings.count > 1 ? 's' : ''} basée${settings.count > 1 ? 's' : ''} sur votre description et vos paramètres.`}
        credits={requiredCredits}
        agentName="Alice - Générateur de Miniatures"
        agentColor="from-pink-500 to-rose-500"
        confirmText="Générer"
      />

      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Retour aux agents</span>
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 ${hasResults ? 'pb-4 border-b border-gray-200' : 'mb-8'}`}
      >
        <div className={`flex items-center ${hasResults ? 'justify-between' : 'flex-col justify-center text-center'}`}>
          <div className={`flex items-center gap-4 ${!hasResults ? 'flex-col' : ''}`}>
            <div className={`relative ${hasResults ? 'w-12 h-14' : 'w-20 h-24'}`}>
              <Image
                src={AliceImage}
                alt="Alice"
                fill
                className="object-contain object-bottom"
              />
            </div>
            <div className={!hasResults ? 'text-center' : ''}>
              <h1 className={`font-bold text-gray-900 ${hasResults ? 'text-xl' : 'text-3xl'}`}>
                Alice - Générateur de Miniatures
              </h1>
              {!hasResults && (
                <p className="text-gray-500 mt-2">Créez des miniatures YouTube professionnelles</p>
              )}
            </div>
          </div>

          {hasResults && (
            <button
              onClick={handleNewGeneration}
              className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-xl transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Nouvelle génération
            </button>
          )}
        </div>

        {/* Credits indicator - only when no results */}
        {!hasResults && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-xl border border-pink-200">
              <Zap className="w-4 h-4 text-pink-600" />
              <span className="font-bold text-pink-700">{requiredCredits} crédit{requiredCredits > 1 ? 's' : ''} par génération</span>
            </div>
            <span className="text-sm text-gray-500">
              Solde: <span className="font-semibold text-gray-900">{isHydrated ? credits : '--'} crédits</span>
            </span>
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Show form when no results or explicitly shown */}
        {(showForm && !hasResults) && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            {/* CONTROLS */}
            <div className="space-y-6">
          
          {/* Acteurs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                id="useActors" 
                checked={useActors} 
                onChange={(e) => setUseActors(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="useActors" className="text-sm text-gray-700 font-medium cursor-pointer">
                Activer les acteurs
              </label>
            </div>
            
            {useActors && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-500" />
                    Acteurs / Sujets
                  </h3>
                  <button 
                    onClick={() => actorInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Ajouter
                  </button>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={actorInputRef} 
                    onChange={handleActorUpload}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {actors.map(actor => (
                    <div key={actor.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 relative group">
                      <button 
                        onClick={() => removeActor(actor.id)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors z-10 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="aspect-square w-full bg-gray-200 rounded-lg overflow-hidden mb-2">
                        <img src={actor.previewUrl} alt="Actor" className="w-full h-full object-cover" />
                      </div>
                      <input 
                        type="text" 
                        value={actor.emotion}
                        onChange={(e) => updateActorEmotion(actor.id, e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:border-amber-500 focus:outline-none"
                        placeholder="Émotion..."
                      />
                    </div>
                  ))}
                  {actors.length === 0 && (
                    <div className="col-span-2 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                      Aucun acteur ajouté
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Objets */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                id="useObjects" 
                checked={useObjects} 
                onChange={(e) => setUseObjects(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="useObjects" className="text-sm text-gray-700 font-medium cursor-pointer">
                Activer les objets
              </label>
            </div>
            
            {useObjects && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    Objets / Produits
                  </h3>
                  <button 
                    onClick={() => objectInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Ajouter
                  </button>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={objectInputRef} 
                    onChange={handleObjectUpload}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {objects.map(obj => (
                    <div key={obj.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 relative group">
                      <button 
                        onClick={() => removeObject(obj.id)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors z-10 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="aspect-square w-full bg-gray-200 rounded-lg overflow-hidden mb-2">
                        <img src={obj.previewUrl} alt="Object" className="w-full h-full object-cover" />
                      </div>
                      <input 
                        type="text" 
                        value={obj.style}
                        onChange={(e) => updateObjectStyle(obj.id, e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                        placeholder="Style..."
                      />
                    </div>
                  ))}
                  {objects.length === 0 && (
                    <div className="col-span-2 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                      Aucun objet ajouté
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5"
          >
            <h3 className="text-lg font-semibold text-gray-900">Paramètres de génération</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description de la miniature *</label>
              <textarea 
                value={settings.description}
                onChange={(e) => setSettings({...settings, description: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-700 focus:border-amber-500 focus:outline-none min-h-[180px] resize-none"
                placeholder={`Un homme d'affaire déçu devant un chantier immobilier

Au premier plan nous avons un homme d'affaire en costume tenant un classeur

Au second plan nous retrouvons un texte "Ai-je bien fait ?"

En arrière plan un chantier immobilier l'air délabré`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texte de la miniature</label>
              <input 
                type="text" 
                value={settings.title}
                onChange={(e) => setSettings({...settings, title: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-700 focus:border-amber-500 focus:outline-none"
                placeholder="Entrez le texte (ou 969 pour aucun texte)"
              />
              <p className="text-xs text-gray-400 mt-1">Code &quot;969&quot; = Aucun texte sur la miniature.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Émotion globale</label>
                <select 
                  value={settings.emotion}
                  onChange={(e) => setSettings({...settings, emotion: e.target.value as Emotion})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 focus:border-amber-500 focus:outline-none"
                >
                  {EMOTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style Visuel</label>
                <select 
                  value={settings.style}
                  onChange={(e) => setSettings({...settings, style: e.target.value as VisualStyle})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 focus:border-amber-500 focus:outline-none"
                >
                  {VISUAL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Intensité du texte</label>
                <span className="text-xs text-amber-600 font-bold">{TEXT_INTENSITY_LABELS[settings.textIntensity] || settings.textIntensity}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={settings.textIntensity}
                onChange={(e) => setSettings({...settings, textIntensity: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                disabled={settings.title === '969' || !settings.title}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de miniatures</label>
              <select
                value={settings.count}
                onChange={(e) => setSettings({...settings, count: parseInt(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 focus:border-amber-500 focus:outline-none"
              >
                <option value={1}>1 miniature (1 crédit)</option>
                <option value={2}>2 miniatures (2 crédits)</option>
                <option value={3}>3 miniatures (3 crédits)</option>
              </select>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleRequestGenerate}
            disabled={isGenerating || credits < requiredCredits}
            className={`
              w-full py-4 rounded-2xl font-bold text-lg
              flex items-center justify-center gap-2
              transition-all duration-300
              ${isGenerating || credits < requiredCredits
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02]'
              }
            `}
          >
            {isGenerating ? (
              <span>Génération en cours...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                GÉNÉRER MA MINIATURE
              </>
            )}
          </motion.button>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
          </motion.div>
        )}

        {/* Loading State - Only shown when generating AND no results yet */}
        {isGenerating && generatedThumbnails.length === 0 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-pink-600 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-4 bg-pink-600 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute inset-8 bg-pink-500 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Génération en cours...</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Alice crée vos miniatures avec les paramètres choisis.
            </p>
            {/* Progress bar */}
            <div className="w-full max-w-md bg-gray-200 rounded-full h-3 mb-2">
              <motion.div 
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-500">{currentStep || 'Initialisation...'}</p>
          </motion.div>
        )}

        {/* Results - Shown as soon as we have at least one thumbnail */}
        {hasResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Results header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                      {generatedThumbnails.length}/{settings.count} miniature{generatedThumbnails.length > 1 ? 's' : ''} générée{generatedThumbnails.length > 1 ? 's' : ''}...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      {generatedThumbnails.length} miniature{generatedThumbnails.length > 1 ? 's' : ''} générée{generatedThumbnails.length > 1 ? 's' : ''}
                    </>
                  )}
                </h2>
                <p className="text-sm text-gray-500">
                  Style: <span className="text-pink-600 font-medium">{settings.style}</span> • 
                  Émotion: <span className="text-pink-600 font-medium">{settings.emotion}</span>
                  {isGenerating && <span className="ml-2 text-pink-500 font-medium animate-pulse">• {currentStep}</span>}
                </p>
              </div>
              {!isGenerating && (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/realisations"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Voir dans mes réalisations
                  </Link>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    <Settings2 className="w-4 h-4" />
                    {showForm ? "Masquer" : "Modifier"}
                  </button>
                </div>
              )}
            </div>

            {/* Collapsible Form Summary */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        type="text"
                        value={settings.description}
                        onChange={(e) => setSettings({...settings, description: e.target.value})}
                        placeholder="Description"
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 outline-none text-sm"
                      />
                      <select
                        value={settings.style}
                        onChange={(e) => setSettings({...settings, style: e.target.value as VisualStyle})}
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 outline-none text-sm"
                      >
                        {VISUAL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select
                        value={settings.count}
                        onChange={(e) => setSettings({...settings, count: parseInt(e.target.value)})}
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 outline-none text-sm"
                      >
                        <option value={1}>1 miniature</option>
                        <option value={2}>2 miniatures</option>
                        <option value={3}>3 miniatures</option>
                      </select>
                      <button
                        onClick={handleRequestGenerate}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors text-sm"
                      >
                        Relancer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Grid - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Miniatures générées */}
              {generatedThumbnails.map((thumb, idx) => (
                <motion.div
                  key={thumb.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-video w-full relative bg-gray-200">
                    <img 
                      src={thumb.imageUrl} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                      <div>
                        <p className="text-white font-bold">Variation {idx + 1}</p>
                        <p className="text-gray-300 text-xs">{thumb.settings.imageSize} • {thumb.settings.style}</p>
                      </div>
                      <button 
                        onClick={() => downloadImage(thumb.imageUrl, idx)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Placeholders pour les miniatures en cours de génération */}
              {isGenerating && Array.from({ length: settings.count - generatedThumbnails.length }).map((_, idx) => (
                <motion.div
                  key={`placeholder-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 border-dashed"
                >
                  <div className="aspect-video w-full relative bg-gray-100 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-gray-500 font-medium">Génération {generatedThumbnails.length + idx + 1}/{settings.count}...</p>
                    <p className="text-gray-400 text-sm">Alice travaille dessus</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
