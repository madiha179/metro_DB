const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function model(userLng, userLat,nearestStation) {
  const key = process.env.GEMINI_API_KEY_CROWD;
  const ai = new GoogleGenAI({ apiKey: key });
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const prompt = `
Check Google Maps RIGHT NOW for the busyness of this Cairo Metro station:
Station: "${nearestStation}"
Current time: ${hour}:00, Day: ${day}.

Google Maps popular times bar uses these colors:
- Dark RED/ORANGE bar = very busy (busier than usual)
- YELLOW bar = moderate (not too busy)
- No bar or very small = not busy (less than usual)

Based on what Google Maps shows for THIS station at THIS exact hour:
RED    → bar is Orange = Busy / Usually busy at this time / Dark Red or very tall = Busier than usual / As busy as it gets
YELLOW → bar is Yellow or medium = Not too busy / Normal crowd
GREEN  → bar is very small or none = Less busy than usual / Not busy

Respond with ONLY one word: RED, YELLOW, or GREEN.
`;

  const MAX_RETRIES = 10;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          tools: [{ googleMaps: {} }],       
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: parseFloat(userLat),
                longitude: parseFloat(userLng),
              },
            },
          },
        },
      });

      const response = result.text.trim().toUpperCase();
      return response;

    } catch (err) {
      const errMsg = err.message || "";

      const is429 =
        err.status === 429 ||
        err.statusCode === 429 ||
        errMsg.includes("429") ||
        errMsg.includes("quota") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      const is503 =
        err.status === 503 ||
        err.statusCode === 503 ||
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand");

      const is500 =
        err.status === 500 ||
        err.statusCode === 500 ||
        errMsg.includes("500") ||
        errMsg.includes("INTERNAL");

      if ((is429 || is503 || is500) && i < MAX_RETRIES - 1) {
        const waitTime = (i + 1) * 2000;
        console.log(`Retrying in ${waitTime / 1000}s... (attempt ${i + 1})`);
        await new Promise(res => setTimeout(res, waitTime));
        continue;
      }

      throw err;
    }
  }

  throw new Error("Model unavailable, please try again later");
}

module.exports = model;