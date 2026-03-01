import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateTryOn(
  userImageBase64: string,
  userImageMimeType: string,
  wigImageBase64: string,
  wigImageMimeType: string
): Promise<{ imageBase64: string; mimeType: string }> {
  const prompt = `You are a professional hair stylist photo editor. Your task is to seamlessly place the wig/hairstyle from the second image onto the person in the first image.

CRITICAL RULES for natural blending:
- The hairline must merge naturally with the forehead — no visible edge or gap between hair and skin.
- Hair should fall realistically around the face, ears, and shoulders following natural gravity and the person's head angle.
- Match the lighting, shadows, and color temperature of the original photo so the hair looks like it belongs.
- Add subtle shadows where the hair meets the forehead and temples.
- Keep the person's face, skin tone, expression, and all features 100% identical.
- The output should look like a real photograph, not a collage. A viewer should not be able to tell the hair was edited.

Only change the hair. Output a single photorealistic image.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: [
      { text: prompt },
      {
        inlineData: {
          mimeType: userImageMimeType,
          data: userImageBase64,
        },
      },
      {
        inlineData: {
          mimeType: wigImageMimeType,
          data: wigImageBase64,
        },
      },
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error("No response from Gemini API");
  }

  for (const part of parts) {
    if (part.inlineData) {
      return {
        imageBase64: part.inlineData.data!,
        mimeType: part.inlineData.mimeType || "image/png",
      };
    }
  }

  throw new Error("No image generated in Gemini response");
}
