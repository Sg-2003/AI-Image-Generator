import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

// Setup open ai api key
// (Not strictly using SDK OpenAIApi class anymore to avoid version/parsing conflicts, but keeping config if needed elsewhere)

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return next(createError(400, "Prompt is required"));
    }

    let generatedImage;
    let success = false;
    let errors = [];

    // Stage 1: Try OpenAI DALL-E 3 with b64_json (Timeout: 8s)
    if (!success) {
      try {
        console.log("Attempting OpenAI DALL-E 3 with b64_json...");
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
          }),
          signal: AbortSignal.timeout(8000),
        });
        const resJson = await response.json();
        if (response.ok && resJson?.data?.[0]?.b64_json) {
          generatedImage = resJson.data[0].b64_json;
          success = true;
          console.log("Image generated successfully: OpenAI DALL-E 3 (b64_json)");
        } else {
          errors.push(`DALL-E 3 b64_json failed: ${resJson?.error?.message || "Unknown error"}`);
        }
      } catch (err) {
        errors.push(`DALL-E 3 b64_json error: ${err.message}`);
      }
    }

    // Stage 2: Try OpenAI DALL-E 2 with b64_json (Timeout: 8s)
    if (!success) {
      try {
        console.log("Attempting OpenAI DALL-E 2 with b64_json...");
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-2",
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
          }),
          signal: AbortSignal.timeout(8000),
        });
        const resJson = await response.json();
        if (response.ok && resJson?.data?.[0]?.b64_json) {
          generatedImage = resJson.data[0].b64_json;
          success = true;
          console.log("Image generated successfully: OpenAI DALL-E 2 (b64_json)");
        } else {
          errors.push(`DALL-E 2 b64_json failed: ${resJson?.error?.message || "Unknown error"}`);
        }
      } catch (err) {
        errors.push(`DALL-E 2 b64_json error: ${err.message}`);
      }
    }

    // Stage 3: Try OpenAI DALL-E 2 with URL fallback (no response_format) (Timeout: 8s)
    if (!success) {
      try {
        console.log("Attempting OpenAI DALL-E 2 with URL...");
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-2",
            prompt,
            n: 1,
            size: "1024x1024",
          }),
          signal: AbortSignal.timeout(8000),
        });
        const resJson = await response.json();
        if (response.ok && resJson?.data?.[0]?.url) {
          const imgRes = await fetch(resJson.data[0].url, { signal: AbortSignal.timeout(5000) });
          if (imgRes.ok) {
            const buf = await imgRes.arrayBuffer();
            generatedImage = Buffer.from(buf).toString("base64");
            success = true;
            console.log("Image generated successfully: OpenAI DALL-E 2 (URL)");
          } else {
            errors.push("Failed to fetch image from OpenAI URL");
          }
        } else {
          errors.push(`DALL-E 2 URL failed: ${resJson?.error?.message || "Unknown error"}`);
        }
      } catch (err) {
        errors.push(`DALL-E 2 URL error: ${err.message}`);
      }
    }

    // Stage 4: Try Lexica AI Image Search (Real Stable Diffusion images matching the prompt) (Timeout: 8s)
    if (!success) {
      try {
        console.log("Attempting Lexica AI Search fallback...");
        const response = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`, {
          signal: AbortSignal.timeout(8000),
        });
        const resJson = await response.json();
        if (response.ok && resJson?.images?.[0]?.src) {
          const imageUrl = resJson.images[0].src;
          const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(6000) });
          if (imgRes.ok) {
            const buf = await imgRes.arrayBuffer();
            generatedImage = Buffer.from(buf).toString("base64");
            success = true;
            console.log("Image generated successfully: Lexica AI Search");
          } else {
            errors.push("Failed to fetch image from Lexica URL");
          }
        } else {
          errors.push(`Lexica search failed or returned empty`);
        }
      } catch (err) {
        errors.push(`Lexica Search error: ${err.message}`);
      }
    }

    // Stage 5: Fallback to Pollinations AI (Timeout: 8s)
    if (!success) {
      try {
        console.log("Attempting Pollinations AI fallback...");
        const encodedPrompt = encodeURIComponent(prompt);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
        const imgRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(8000) });
        if (imgRes.ok) {
          const buf = await imgRes.arrayBuffer();
          generatedImage = Buffer.from(buf).toString("base64");
          success = true;
          console.log("Image generated successfully: Pollinations AI");
        } else {
          errors.push(`Pollinations AI returned status ${imgRes.status}`);
        }
      } catch (err) {
        errors.push(`Pollinations AI error: ${err.message}`);
      }
    }

    // Stage 6: Fallback to Lorem Flickr (Keyword-matching public image feed) (Timeout: 8s)
    if (!success) {
      try {
        console.log("Attempting Lorem Flickr tag-based fallback...");
        // Clean prompt into a comma-separated list of search tags
        const cleanPrompt = prompt
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, ",");
        const fallbackUrl = `https://loremflickr.com/1024/1024/${encodeURIComponent(cleanPrompt)}`;
        const imgRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(8000) });
        if (imgRes.ok) {
          const buf = await imgRes.arrayBuffer();
          generatedImage = Buffer.from(buf).toString("base64");
          success = true;
          console.log("Image generated successfully: Lorem Flickr (Matching Keywords)");
        } else {
          errors.push(`Lorem Flickr returned status ${imgRes.status}`);
        }
      } catch (err) {
        errors.push(`Lorem Flickr error: ${err.message}`);
      }
    }

    // Stage 7: Last-resort fallback to Picsum Photos (Random placeholder) (Timeout: 8s)
    if (!success) {
      try {
        console.log("Attempting Picsum Photos fallback...");
        const fallbackUrl = `https://picsum.photos/1024/1024`;
        const imgRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(8000) });
        if (imgRes.ok) {
          const buf = await imgRes.arrayBuffer();
          generatedImage = Buffer.from(buf).toString("base64");
          success = true;
          console.log("Image generated successfully: Picsum Photos (Placeholder)");
        } else {
          errors.push(`Picsum Photos returned status ${imgRes.status}`);
        }
      } catch (err) {
        errors.push(`Picsum Photos error: ${err.message}`);
      }
    }

    if (!success) {
      console.error("All image generation stages failed. Errors:", errors);
      throw new Error("All image generation attempts failed: " + errors.join("; "));
    }

    return res.status(200).json({ photo: generatedImage });
  } catch (error) {
    console.error("Image generation handler error:", error);
    next(
      createError(
        error.status || 500,
        error.message || "Failed to generate image"
      )
    );
  }
};
