import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmModel.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {
    try {

        await checkAgentLimit(state.userId, "coding");

        const intentLlm = await getModel("intent");
        const llm = await getModel("coding");

        const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
`);

        const intent = intentRes.content
            .trim()
            .toUpperCase();

        if (intent === "CODE_GENERATION") {

            const prompt = `
You are Samanvay AI Coding Agent.

Generate the requested project.

Default stack:

- HTML
- CSS
- JavaScript

Use React, Next.js, or Vue ONLY if explicitly requested.

Rules:

- Generate a complete working project.
- Responsive design.
- Modern professional UI.
- Use CSS variables.
- Use Flexbox/Grid.
- Add hover effects.
- Use good spacing.
- Use good typography.
- Use semantic HTML.
- Make the UI responsive.
- Single page unless the user asks for multiple pages.
- All generated files must work together.
- Do not leave TODOs.
- Do not leave incomplete code.

Images:

- Use real Unsplash images when images are needed.
- Never use placeholder images.
- Never use data:image URLs.
- Never use example.com.
- Never use placeholder.com.
- Every image must have a meaningful alt attribute.
- Image should match the website content.

Return ONLY valid JSON.

Schema:

{
  "files": [
    {
      "name": "index.html",
      "content": "complete HTML code"
    },
    {
      "name": "style.css",
      "content": "complete CSS code"
    },
    {
      "name": "script.js",
      "content": "complete JavaScript code"
    }
  ]
}

Important:

- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No code fences
- No extra text
- Response must be directly parseable using JSON.parse()
- Never mention intent

User Request:

${state.prompt}
`;

            const res = await llm.invoke(prompt);

            console.log(res);

            const data = JSON.parse(res.content);

            await deductCredits(state.userId, "coding");

            return {
                ...state,
                aiResponse: "Code Generated Successfully.",
                artifacts: [
                    {
                        id: Date.now(),
                        type: "Project",
                        files: data.files || [],
                        title: state.prompt
                    }
                ]
            };
        }

        const res = await llm.invoke(`
The user's request is:

${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code

User Request:

${state.prompt}
`);

        const data = res.content;

        await deductCredits(state.userId, "coding");

        return {
            ...state,
            aiResponse: data,
            artifacts: []
        };

    } catch (error) {

        console.log("CODING AGENT ERROR:", error);

        return {
            ...state,
            aiResponse:
                error?.message ||
                "Failed to generate code",
            artifacts: []
        };
    }
};