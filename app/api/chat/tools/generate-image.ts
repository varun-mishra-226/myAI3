import { tool } from "ai";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Define the schema explicitly
const ImageGenerationSchema = z.object({
  prompt: z.string().describe("The detailed description of the image to generate."),
});

export const generateImage = tool({
  description: "Generate an image for event posters or social media backgrounds using DALL-E 3. Adheres to brand colors.",
  parameters: ImageGenerationSchema,
  
  // 2. Use z.infer to match the types perfectly
  execute: async ({ prompt }: z.infer<typeof ImageGenerationSchema>) => {
    try {
      // Inject brand constraints
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
      // Return a safe error string if generation fails
      return { 
        error: "Failed to generate image. Please try again." 
      };
    }
  },
});
