import { tool } from "ai";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage = tool({
  description: "Generate an image for event posters or social media backgrounds using DALL-E 3.",
  
  // 1. THIS IS THE CRITICAL PART FOR OPENAI
  // It must be a z.object({}) to avoid the 'type: None' error
  parameters: z.object({
    prompt: z.string().describe("The detailed description of the image to generate."),
  }),

  // 2. THIS FIXES THE TYPESCRIPT ERROR
  // We explicitly type the argument as 'any' to prevent the inference issues
  // that were breaking your build earlier.
  execute: async (args: any) => {
    const { prompt } = args;

    try {
      // Inject brand constraints
      const brandedPrompt = `${prompt}. Style: Minimalist, professional, academic. Colors: Deep Blue (#003366) and Gold (#FFCC00). No text in the image.`;
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: brandedPrompt,
        n: 1,
        size: "1024x1024",
      });

      // Safety check for the response data
      if (!response.data || !response.data[0]) {
        throw new Error("No image data received from OpenAI.");
      }

      return {
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
      };
    } catch (error) {
      console.error("Image generation error:", error);
      return { 
        error: "Failed to generate image.", 
        details: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
});
