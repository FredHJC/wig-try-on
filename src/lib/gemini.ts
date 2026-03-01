import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateTryOn(
  userImageBase64: string,
  userImageMimeType: string,
  wigImageBase64: string,
  wigImageMimeType: string
): Promise<{ imageBase64: string; mimeType: string }> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-image-preview",
    generationConfig: {
      // @ts-expect-error - responseModalities is supported but not in types yet
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  const prompt = `Take the person in the first image and show them wearing the wig/hairstyle from the second image. Keep the person's face, skin tone, and features exactly the same. Only change their hair to match the wig style and color from the second image. Generate a realistic photo of this person with that wig on.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: userImageBase64,
        mimeType: userImageMimeType,
      },
    },
    {
      inlineData: {
        data: wigImageBase64,
        mimeType: wigImageMimeType,
      },
    },
  ]);

  const response = result.response;
  const parts = response.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error("No response from Gemini API");
  }

  for (const part of parts) {
    if (part.inlineData) {
      return {
        imageBase64: part.inlineData.data,
        mimeType: part.inlineData.mimeType || "image/png",
      };
    }
  }

  throw new Error("No image generated in Gemini response");
}
