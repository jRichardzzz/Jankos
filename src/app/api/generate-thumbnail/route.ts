import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { uploadImageToSupabase } from "@/lib/supabase";

// Exactement comme ton logiciel original
const MODEL_NAME = "gemini-3-pro-image-preview";
const ASPECT_RATIO = "16:9";

interface ActorData {
  base64: string;
  mimeType: string;
  emotion: string;
}

interface ObjectData {
  base64: string;
  mimeType: string;
  style: string;
}

interface GenerationRequest {
  actors: ActorData[];
  objects: ObjectData[];
  settings: {
    description: string;
    title: string;
    emotion: string;
    style: string;
    textIntensity: number;
    imageSize: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { actors, objects, settings } = body;

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API Gemini non configurée. Ajoutez GEMINI_API_KEY dans .env.local" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    // System/Context Prompt
    parts.push({
      text: `You are an expert YouTube Thumbnail designer. Create a high-quality, clickable thumbnail.
      
      DETAILS:
      - Theme/Description: ${settings.description}
      - Visual Style: ${settings.style}
      - Global Emotion: ${settings.emotion}
      - Aspect Ratio: ${ASPECT_RATIO}
      `
    });

    // Text Overlay
    if (settings.title === "969") {
      parts.push({ text: "Do NOT include any text on this thumbnail. Pure visual." });
    } else if (settings.title) {
      parts.push({
        text: `Overlay Text: "${settings.title}"
        Text Style: Big, bold, readable.
        Text Intensity (1-10): ${settings.textIntensity} (where 10 is massive, dominant text).
        Make sure the text pops against the background.`
      });
    }

    // Actors
    if (actors && actors.length > 0) {
      parts.push({ text: "Include the following people in the thumbnail, adapting them to the requested emotion:" });
      for (const actor of actors) {
        parts.push({
          inlineData: {
            data: actor.base64,
            mimeType: actor.mimeType
          }
        });
        parts.push({ text: `Person above should express emotion: ${actor.emotion}` });
      }
    } else {
      parts.push({ text: "No specific people provided. Generate generic characters if the description implies it, or focus on objects/scenery." });
    }

    // Objects
    if (objects && objects.length > 0) {
      parts.push({ text: "Integrate the following objects naturally into the scene:" });
      for (const obj of objects) {
        parts.push({
          inlineData: {
            data: obj.base64,
            mimeType: obj.mimeType
          }
        });
        parts.push({ text: `Object above style/context: ${obj.style}` });
      }
    }

    // Generate with Gemini - exactement comme ton logiciel original
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: ASPECT_RATIO,
          imageSize: settings.imageSize
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      const partWithData = part as { inlineData?: { data: string } };
      if (partWithData.inlineData) {
        const base64Data = partWithData.inlineData.data;
        
        // Upload to Supabase Storage
        const fileName = `thumbnail-${Date.now()}`;
        const supabaseUrl = await uploadImageToSupabase(base64Data, fileName);
        
        if (supabaseUrl) {
          // Return Supabase URL (persistent for 15 days)
          return NextResponse.json({
            success: true,
            imageUrl: supabaseUrl,
            isSupabase: true
          });
        } else {
          // Fallback to base64 if Supabase upload fails
          console.warn("Supabase upload failed, returning base64");
          return NextResponse.json({
            success: true,
            imageUrl: `data:image/png;base64,${base64Data}`,
            isSupabase: false
          });
        }
      }
    }

    return NextResponse.json(
      { error: "Aucune image générée par Gemini." },
      { status: 500 }
    );

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    
    // Gestion des erreurs avec messages clairs pour l'utilisateur
    let userMessage = "Une erreur est survenue lors de la génération.";
    let shouldRefund = true;
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes("overloaded") || errorMsg.includes("503") || errorMsg.includes("unavailable")) {
        userMessage = "Nos serveurs sont actuellement surchargés. Veuillez réessayer dans quelques minutes. Vos crédits ont été remboursés.";
      } else if (errorMsg.includes("quota") || errorMsg.includes("rate limit")) {
        userMessage = "Limite de requêtes atteinte. Veuillez réessayer dans quelques minutes. Vos crédits ont été remboursés.";
      } else if (errorMsg.includes("invalid") || errorMsg.includes("safety")) {
        userMessage = "Votre requête n'a pas pu être traitée. Essayez de modifier votre description. Vos crédits ont été remboursés.";
        shouldRefund = true;
      } else if (errorMsg.includes("timeout")) {
        userMessage = "La génération a pris trop de temps. Veuillez réessayer. Vos crédits ont été remboursés.";
      } else {
        userMessage = "Une erreur technique est survenue. Veuillez réessayer. Vos crédits ont été remboursés.";
      }
    }
    
    return NextResponse.json(
      { error: userMessage, shouldRefund },
      { status: 500 }
    );
  }
}
