import { getModel } from "../config/llmModel.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";

import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imageGenAgent = async (state) => {

  try {

    await checkAgentLimit(state.userId, "image");

    const llm = await getModel("image");

    const response = await llm.invoke(`
You are an AI image prompt generator.

Convert the user's request into a detailed image generation prompt.

Make the prompt:
- descriptive
- visually clear
- realistic
- high quality
- suitable for image generation

Return only the final image prompt.

User request:
${state.prompt}
    `);

    const prompt = response.content.trim();

    console.log("Generated image prompt:", prompt);

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    console.log("Image URL:", imageUrl);

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer"
    });

    const buffer = Buffer.from(imageResponse.data);

    const filename = `image-${Date.now()}.png`;

    await uploadToS3(
      filename,
      buffer,
      "image/png"
    );

    const downloadUrl = await getFromS3(
      filename,
      60*10
    );

    await deductCredits(state.userId, "imageGen");

    return {
      ...state,

      aiResponse: `
![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})
`
    };

  } catch (error) {

    console.log(
      "Image generation error:",
      error?.response?.data || error?.message || error
    );

    return {
      ...state,

      aiResponse:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to generate image"
    };
  }
};