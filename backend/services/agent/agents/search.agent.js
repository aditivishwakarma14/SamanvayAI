import { searchTool } from "../config/tavily.js";
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent = async (state) => {
  try {
    const results = await searchTool.invoke({
      query: state.prompt,
    });

    await deductCredits(state.userId, "search");

    const images = Array.isArray(results?.images)
      ? results.images.filter(
          (image) => typeof image === "string" && image.trim()
        )
      : [];

    return {
      ...state,
      searchResults: results,
      images,
    };
  } catch (error) {
    console.error("Search agent error:", error);

    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};