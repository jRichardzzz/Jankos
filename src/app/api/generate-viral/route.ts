import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const MODEL_NAME = 'gemini-3-pro-preview';

const SYSTEM_PROMPT_TEMPLATE = `
RÔLE :
Tu es le "Viral Market Fit Agent". Ta spécialité est l'arbitrage de contenu : tu repères ce qui fonctionne massivement (Tendances) et tu l'importes dans des secteurs inexploités (Niche Client).

CONTEXTE CLIENT :
- NICHE : {{NICHE}}
- NOM CHAINE : {{CHANNEL_NAME}}
- AUDIENCE : {{AUDIENCE}}

ACTION REQUISE :
1. UTILISATION DE L'OUTIL DE RECHERCHE (OBLIGATOIRE) : Cherche activement les formats de vidéos les plus viraux sur YouTube (US & FR) ces 7 derniers jours (toutes catégories : Tech, Entertainment, Challenge, MrBeast, Ryan Trahan, Airrack, etc.).
2. ADAPTATION : Adapte ces formats viraux spécifiquement pour la NICHE et l'AUDIENCE ci-dessus.
3. VÉRIFICATION DE MARCHÉ (SATURATION CHECK) : Estime si ce concept précis existe déjà dans cette niche.
4. GÉNÉRATION : Crée une liste des 10 meilleures idées de vidéos.

RÈGLES D'ÉCRITURE DES TITRES :
- Structure : [Action Immédiate] + [Enjeu Visuel/Chiffré].
- Pas de gérondif, pas de "Comment faire". Utilise le "JE" ou le "ON".
- Doit susciter une curiosité immédiate (Information Gap).

SCORING DE VITALITÉ (0-100) :
- Note basée sur le CTR potentiel.
- 80+ : Titre impossible à ignorer.

OUTPUT FORMAT (JSON STRICT) :
Génère une liste de 10 objets JSON selon le schéma défini.
`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée' },
        { status: 500 }
      );
    }

    const { niche, channelName, audience } = await request.json();

    if (!niche || !audience) {
      return NextResponse.json(
        { error: 'Niche et audience sont requis' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = SYSTEM_PROMPT_TEMPLATE
      .replace('{{NICHE}}', niche)
      .replace('{{CHANNEL_NAME}}', channelName || 'Non spécifié')
      .replace('{{AUDIENCE}}', audience);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              titre_viral: { type: Type.STRING },
              tendance_source: { type: Type.STRING },
              adaptation_niche: { type: Type.STRING },
              saturation_check: { type: Type.STRING },
              score_vitalite: { type: Type.INTEGER },
              raison_potentiel: { type: Type.STRING },
              statut: { type: Type.STRING, enum: ['VALIDÉ', 'REJETÉ'] },
            },
            required: [
              'titre_viral',
              'tendance_source',
              'adaptation_niche',
              'saturation_check',
              'score_vitalite',
              'raison_potentiel',
              'statut',
            ],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Aucune réponse reçue de Gemini');
    }

    const concepts = JSON.parse(text);
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return NextResponse.json({
      concepts,
      groundingChunks: groundingMetadata?.groundingChunks || [],
    });

  } catch (error) {
    console.error('Viral generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
