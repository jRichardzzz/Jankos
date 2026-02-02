import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const MODEL_NAME = 'gemini-3-flash-preview';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée' },
        { status: 500 }
      );
    }

    const { niche } = await request.json();

    if (!niche) {
      return NextResponse.json(
        { error: 'La niche est requise' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    RÔLE : Tu es le "Keyword-to-Video Alchemist" et un expert SEO YouTube.
    
    TACHE :
    Je te donne une NICHE : "${niche}".
    
    TA MISSION (3 ÉTAPES) :
    1. Identifie les 10 mots-clés (ou sujets) les plus recherchés et pertinents pour cette niche en France.
    2. Pour chaque mot-clé, estime un Volume de Recherche Mensuel réaliste (basé sur ta connaissance du marché).
    3. Transforme chaque mot-clé en concept vidéo viral (Éducatif, Curiosité, Storytelling) et analyse l'intention.

    RÈGLES DE TITRES :
    1. **Type "Éducatif/Tuto" :** Promesse de résultat clair.
    2. **Type "Curiosité/Choc" :** Utilise un biais cognitif (Erreur, Secret, Danger, Contre-intuitif).
    3. **Type "Storytelling" :** "J'ai testé...", "J'ai arrêté...", "Mon expérience...".
    
    OUTPUT:
    Retourne UNIQUEMENT un JSON structuré (Array) respectant le schema fourni.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              mot_cle_origine: { type: Type.STRING },
              volume_mensuel: { type: Type.NUMBER },
              intention_detectee: { type: Type.STRING },
              titres_generes: {
                type: Type.OBJECT,
                properties: {
                  educatif: { type: Type.STRING },
                  curiosite: { type: Type.STRING },
                  storytelling: { type: Type.STRING },
                },
                required: ['educatif', 'curiosite', 'storytelling']
              },
              potentiel_viral: { type: Type.STRING, enum: ['FAIBLE', 'MOYEN', 'ÉLEVÉ'] }
            },
            required: ['mot_cle_origine', 'volume_mensuel', 'intention_detectee', 'titres_generes', 'potentiel_viral']
          }
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Aucune réponse reçue de Gemini');
    }

    const concepts = JSON.parse(text);

    return NextResponse.json({ concepts });

  } catch (error) {
    console.error('Keyword generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
