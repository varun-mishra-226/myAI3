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
      const brandedPrompt = `${prompt}. Style: Minimalist, professional, academic. Colors: Deep Blue (#003366) and Gold (#FFCC00). No text.`;
      
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
      return { error: "Failed to generate image." };
    }
  },
});
