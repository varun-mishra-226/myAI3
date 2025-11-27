// app/api/chat/tools/generate-image.ts
import { tool } from "ai";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage = tool({
  description: "Generate an image for event posters or social media backgrounds using DALL-E 3.",
  parameters: z.object({
    prompt: z.string().describe("The description of the image."),
  }),
  // @ts-ignore
  execute: async ({ prompt }) => {
    try {
      // Injects brand constraints into every prompt
      const brandedPrompt = `${prompt}. Style: Minimalist, professional, academic. Colors: Deep Blue (#003366) and Gold (#FFCC00). No text.`;
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: brandedPrompt,
        n: 1,
        size: "1024x1024",
      });

      // Check for valid data before accessing
      if (!response.data || !response.data[0]) {
        throw new Error("No image data received from OpenAI.");
      }

      return {
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
      };
    } catch (error) {
      console.error("Image generation failed:", error);
      return { 
        error: "Failed to generate image. Please try again later.",
        details: error instanceof Error ? error.message : String(error)
      };
    }
  },
});
