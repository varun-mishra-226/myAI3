import { tool } from "ai";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage = tool({
  description: "Generate an image for event posters or social media backgrounds using DALL-E 3. Adheres to brand colors.",
  parameters: z.object({
    prompt: z.string().describe("The detailed description of the image to generate."),
  }),
  // FIX: We cast 'args' to 'any' to stop the TypeScript inference error.
  execute: async (args: any) => {
    const { prompt } = args;

    try {
      const brandedPrompt = `${prompt}. Style: Minimalist, professional, academic. Colors: Deep Blue (#003366) and Gold (#FFCC00). No text in the image.`;
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: brandedPrompt,
        n: 1,
        size: "1024x1024",
      });

      return {
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
      };
    } catch (error) {
      return { 
        error: "Failed to generate image.",
        details: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
});
