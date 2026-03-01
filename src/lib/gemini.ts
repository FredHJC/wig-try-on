import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateTryOn(
  userImageBase64: string,
  userImageMimeType: string,
  wigImageBase64: string,
  wigImageMimeType: string
): Promise<{ imageBase64: string; mimeType: string }> {
  const prompt = `Take the person in the first image and show them wearing the wig/hairstyle from the second image. Keep the person's face, skin tone, and features exactly the same. Only change their hair to match the wig style and color from the second image. Generate a realistic photo of this person with that wig on.`;

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
