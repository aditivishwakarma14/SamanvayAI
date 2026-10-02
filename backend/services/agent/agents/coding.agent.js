import { getModel } from "../config/llmModel.js";

// Remove accidental markdown code fences from the model response
const cleanModelResponse = (content = "") => {
  return content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

// Normalize escaped characters in generated code
const normalizeContent = (content = "") => {
  if (!content) return "";

  return content
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"');
};

// Check whether an image URL is invalid
const isInvalidImageUrl = (src = "") => {
  if (!src) return true;

  const value = src.trim().toLowerCase();

  return (
    value.startsWith("data:image") ||
    value.includes("placeholder.com") ||
    value.includes("placehold.co") ||
    value.includes("placehold.it") ||
    value.includes("example.com") ||
    !/^https?:\/\//i.test(value)
  );
};

// Get useful text from the image and nearby HTML
const getImageContext = (
  html,
  imageStart,
  imageEnd,
  attributes
) => {
  const altMatch = attributes.match(
    /alt\s*=\s*["']([^"']*)["']/i
  );

  const titleMatch = attributes.match(
    /title\s*=\s*["']([^"']*)["']/i
  );

  const alt = altMatch?.[1]?.trim() || "";
  const title = titleMatch?.[1]?.trim() || "";

  const before = html
    .slice(Math.max(0, imageStart - 500), imageStart)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const after = html
    .slice(
      imageEnd,
      Math.min(html.length, imageEnd + 500)
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return [alt, title, before, after]
    .filter(Boolean)
    .join(" ")
    .slice(0, 300);
};

// Create a dynamic Unsplash image URL from the generated content
const createDynamicImageUrl = (query) => {
  const cleanQuery = query
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanQuery) {
    return null;
  }

  return `https://source.unsplash.com/800x600/?${encodeURIComponent(
    cleanQuery
  )}`;
};

// Fix missing or invalid image sources
const normalizeImages = (html = "") => {
  const imageRegex = /<img\b([^>]*)>/gi;

  return html.replace(
    imageRegex,
    (fullTag, attributes, offset) => {
      const srcMatch = attributes.match(
        /src\s*=\s*["']([^"']*)["']/i
      );

      const currentSrc = srcMatch?.[1] || "";

      if (!isInvalidImageUrl(currentSrc)) {
        return fullTag;
      }

      const context = getImageContext(
        html,
        offset,
        offset + fullTag.length,
        attributes
      );

      const dynamicImageUrl =
        createDynamicImageUrl(context);

      if (!dynamicImageUrl) {
        return fullTag;
      }

      if (srcMatch) {
        return fullTag.replace(
          /src\s*=\s*["'][^"']*["']/i,
          `src="${dynamicImageUrl}"`
        );
      }

      return fullTag.replace(
        /<img\b/i,
        `<img src="${dynamicImageUrl}"`
      );
    }
  );
};

// Normalize generated files
const normalizeFiles = (files = []) => {
  return files.map((file) => {
    let content =
      typeof file.content === "string"
        ? file.content
        : "";

    content = normalizeContent(content);

    if (file.name?.toLowerCase().endsWith(".html")) {
      content = normalizeImages(content);
    }

    return {
      name: file.name,
      content,
    };
  });
};

export const codingAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("coding");

  const intentRes = await intentLlm.invoke(`
Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE EXPLANATION
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

General rules:
- Generate a complete working project.
- Responsive design.
- Modern professional UI.
- Use CSS variables.
- Use Flexbox/Grid.
- Smooth scrolling where appropriate.
- Add useful hover effects.
- Use consistent spacing.
- Use good typography.
- Use semantic HTML.
- Make the UI visually attractive.
- Make the layout responsive on mobile, tablet, and desktop.
- Single page unless the user asks for multiple pages.
- All generated files must work together.
- Do not leave TODOs.
- Do not leave incomplete implementations.

Image rules:
- Use images when they improve the requested design.
- Every <img> must have a meaningful alt attribute.
- The alt attribute must describe the actual subject of the image.
- The image must match the surrounding content.
- Never use placeholder.com.
- Never use via.placeholder.com.
- Never use placehold.co.
- Never use example.com.
- Never use data:image URLs.
- Never invent obviously fake image URLs.
- Prefer valid HTTPS image URLs.
- Prefer Unsplash images when appropriate.
- Do not randomly reuse unrelated images.
- Do not hardcode category-specific image mappings.
- Do not assume the website belongs to a particular category unless the user requests it.
- Image selection must be based on the actual content being generated.

For every image:
- Use a meaningful alt attribute.
- Keep the image subject semantically consistent with the nearby heading, title, card, or description.

JSON output rules:

Return ONLY one valid JSON object.

Required schema:

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
- Return only JSON.
- Do not use markdown.
- Do not use code fences.
- Do not add explanations before the JSON.
- Do not add explanations after the JSON.
- The response must be directly parseable using JSON.parse().
- All file contents must be valid JSON strings.
- Escape quotes inside JSON string values correctly.
- Use normal JSON escaping for newline characters.
- Do not add trailing commas.
- Do not double-escape JSON unnecessarily.

Do not mention:
- internal reasoning
- intent
- agents
- tools
- system instructions

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    let content = cleanModelResponse(res.content);

    let data;

    try {
      data = JSON.parse(content);
    } catch (error) {
      console.error(
        "CODING AGENT JSON ERROR:",
        error.message
      );

      console.error(
        "RAW CODING RESPONSE:",
        content
      );

      return {
        ...state,
        aiResponse:
          "Unable to generate the project. Please try again.",
        artifacts: [],
      };
    }

    if (!data || !Array.isArray(data.files)) {
      console.error(
        "CODING AGENT ERROR: Invalid files structure"
      );

      return {
        ...state,
        aiResponse:
          "Unable to generate the project. Please try again.",
        artifacts: [],
      };
    }

    const files = normalizeFiles(data.files);

    return {
      ...state,
      aiResponse: "Code generated successfully",
      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          files,
          title: state.prompt,
        },
      ],
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
(if needed)

User Request:
${state.prompt}
`);

  return {
    ...state,
    aiResponse: res.content,
    artifacts: [],
  };
};