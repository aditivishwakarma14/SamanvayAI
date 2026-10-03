import { searchTool } from "../config/tavily.js";
import {deductCredits} from "../utils/deductCredits.js"

export const searchAgent = async (state) => {
    try {

        const results = await searchTool.invoke({
            query: state.prompt
        });

        await deductCredits(state.userId , "search")

        console.log("TAVILY RESULTS:", results);

        return {
            ...state,
            searchResults: results,
            images: results.images
        };

    } catch (error) {

        console.error("SEARCH AGENT ERROR:", error);

        return {
            ...state,
            searchResults: [],
            images: []
        };
    }
};