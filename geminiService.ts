import { GoogleGenAI } from "@google/genai";
import { StickerStyle } from "../types";

const API_KEY = process.env.API_KEY;

// Enhanced prompts for better sticker results
const STYLE_PROMPTS: Record<StickerStyle, string> = {
  [StickerStyle.CARTOON]: "clean flat vector cartoon style, thick outlines, vibrant pop colors, simple shading",
  [StickerStyle.PIXEL_ART]: "authentic 8-bit pixel art, defined grid, limited color palette, retro game asset",
  [StickerStyle.VECTOR]: "professional vector illustration, adobe illustrator style, smooth curves, flat shading, minimal detail",
  [StickerStyle.WATERCOLOR]: "watercolor illustration, artistic hand-painted look, soft blended edges inside the border",
  [StickerStyle.THREE_D]: "3D rendered character, blender cycles render, clay material, soft studio lighting, cute 3d toy",
  [StickerStyle.HOLOGRAPHIC]: "holographic sticker effect, prismatic color gradients, metallic foil finish, shiny reflection",
  [StickerStyle.VINTAGE]: "retro 70s badge aesthetics, distressed texture, muted earth tones, vintage label",
  [StickerStyle.KAWAII]: "kawaii aesthetic, pastel colors, simple cute features, blush stickers, sanrio style",
  [StickerStyle.GRAFFITI]: "urban street art style, spray paint texture, drip effects, bold dynamic lines, wildstyle"
};

export const generateSticker = async (prompt: string, style: StickerStyle): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Construct a prompt optimized for sticker generation
  // We use forceful instruction for the die-cut border and background to ensure post-processing (removing background) is easier for the user if they choose to do so elsewhere.
  const fullPrompt = `
    Create a single, isolated die-cut sticker design of ${prompt}.
    Style: ${STYLE_PROMPTS[style]}.
    
    CRITICAL DESIGN REQUIREMENTS:
    1. The subject MUST be surrounded by a wide, solid white border (contour).
    2. The background MUST be a solid, flat black color (#000000) for high contrast.
    3. The image should be centered with breathing room around the edges.
    4. NO text, NO watermarks, NO cropped edges. 
    5. High resolution, vector-like clarity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        // Explicitly requesting 1:1 aspect ratio for square stickers
        // This helps the model frame the "center" subject better.
        imageConfig: {
          aspectRatio: "1:1"
        }
      },
    });

    // Check for inline data (image)
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Sticker generation failed:", error);
    throw error;
  }
};