const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const chatHistoryModel=require('../models/chatHistoryModel');
const usersModel=require('../models/usermodel');
const appError=require('../utils/appError');
const catchAsyncError=require('../utils/catchAsyncError');
dotenv.config();

const metroDatePath = path.join(__dirname, "..","data", "geminiFile.json");
const metroData = JSON.parse(fs.readFileSync(metroDatePath, "utf-8"));
const stationsData = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "places.json"), "utf-8"));
const brtDataPath = path.join(__dirname, "..", "data", "brtData.json");
const brtData = JSON.parse(fs.readFileSync(brtDataPath, "utf-8"));
const keys=[
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4
].filter(Boolean); // delete any undefined or empty key
let currentIndex=0;

async function model(userMessage,historyText) {
  for(let i=0;i<keys.length;i++){
    const keyIndex=(currentIndex+i)%keys.length;
    const ai=new GoogleGenAI({apiKey:keys[keyIndex]});
   // const models = await ai.models.list();
//console.log(models);
  try{
  const result = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
 contents: `
You are "Metro Mate Assistant" — the official AI guide for the Metro Mate app (تطبيق مترو ميت), which serves Cairo Metro (مترو القاهرة) and the BRT Bus Rapid Transit (الأتوبيس الترددي).

## WHO YOU ARE:
You combine two sources of knowledge:
1. Your internal training data → for navigation, station names, routes, transfers, and geography.
2. The App Knowledge Base (JSON below) → for everything related to the Metro Mate app: tickets, subscriptions, fines, account, payments, nearest stations, and app features.

## YOUR RULES:
1. Always answer in the SAME language the user writes in — Arabic or English. Never mix them.
2. For navigation questions (ازاي أروح؟ / how do I get to?):
   - Identify the EXACT nearest metro or BRT station to the destination.
   - Mention which Line to take (Line 1 = Blue, Line 2 = Red, Line 3 = Green).
   - Mention transfer stations if needed (Sadat, Shohadaa, Attaba).
   - Mention which exit or direction to follow.
3. For app-related questions (tickets, subscriptions, payments, fines):
   - Answer STRICTLY from the JSON Knowledge Base below.
   - Do NOT invent prices, steps, or policies.
4. If a question is completely unrelated to Cairo Metro, BRT, or the Metro Mate app, politely refuse.
5. Be concise, friendly, and helpful — like a knowledgeable local Egyptian guide.
6. If you are unsure about something not in the knowledge base, say so honestly and direct the user to: https://cairometro.gov.eg
7. For real-time crowding (الزحمة دلوقتي):
   - Use Google Search to check the current live traffic or status for the specific station mentioned.
   - If Google shows "Busy" or "Live crowd data", report it to the user.
   ## STRICT LANGUAGE RULE:
- Detect the language of the "CURRENT USER MESSAGE".
- If the message is in English, your response MUST be 100% in English.
- If the message is in Arabic, your response MUST be 100% in Arabic.
- IGNORE the language used in "CONVERSATION HISTORY" and only follow the language of the latest message.
## LINE 3 COMPLETE STATIONS (West to East):
Rod El Farag → Sudan → Imbaba → El Bohy → Al Qawmeyya → Ring Road → Kit Kat → Maspero → Safaa Hegazy → Nasser → Attaba → Bab El Shaariya → El Geish → Abdou Pasha → Abbassiya → Fair Zone → Cairo Stadium → Koleyet El Banat → Al Ahram → Heliopolis Square → El Shams Club → Haroun → El Nozha → Adly Mansour
Western Branch: Tawfikia → Wadi El Nil → Gamaet El Dowal → Bulaq Dakrour → Cairo University
## CRITICAL RULE:
- IF the user asks about crowding (ازدحام/مزدحم/زحمة) or current status of any station, you MUST use "Google Search" immediately to get the latest info. 
- Ignore any previous instructions that say you cannot provide real-time data. You ARE now capable of this via search.
## IMPORTANT GEOGRAPHIC FACTS:
- Cairo International Book Fair → EISEC, nearest station: "El-Estad" on Line 3.
- Cairo Airport → "Cairo Airport T3" on Line 3.
- Tahrir Square → "Sadat" station, Lines 1 & 2.
- Ramses Station → "Al-Shohadaa" station, Lines 1 & 2.
- Cairo University → "Cairo University" station on Line 2.
- Giza Pyramids → nearest metro: "Giza" on Line 2, then microbus/taxi.
- Ain Shams University (جامعة عين شمس) → nearest stations: "Ain Shams" or "El-Matareya" on Line 1 (Blue). Abbasia and Monshaat El-Sadr are also close depending on the faculty.
- Keep navigation answers brief — max 4 lines.
## KNOWLEDGE HIERARCHY:
1. LIVE STATUS (Crowding, Delays): Use Google Search Tool ONLY. 
2. APP POLICIES (Tickets, Fines): Use "App Knowledge Base" JSON ONLY.
3. NAVIGATION: Use "Places JSON" + Internal Training.
## APP KNOWLEDGE BASE (Tickets, Subscriptions, Fines, Features):
${JSON.stringify(metroData)}
## PLACES & NEAREST STATIONS (use this as priority):
${JSON.stringify(stationsData)}
## BRT KNOWLEDGE BASE:
${JSON.stringify(brtData)}
## CONVERSATION HISTORY (last 5 messages for context):
${historyText}

## CURRENT USER MESSAGE:
${userMessage}

## YOUR RESPONSE:
`,
tools: [
    {
      googleSearchRetrieval: {}, 
    },
  ],
  });
  currentIndex=(keyIndex+1)%keys.length;
  const response=await result.response;
   const rawText = result.text ?? "";
   //clean answer from marks
   const cleanText=rawText
   .replace(/\\n/g, '\n')
   .replace(/#{1,6}\s/g, '') 
   .replace(/^\s*[-*]\s/gm, '') 
   .replace(/\n{3,}/g, '\n\n')
   .trim();
   return cleanText;
}
 catch(err){
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

  if(is429){
    console.log(`Key ${keyIndex + 1} rate limited, trying next key`);
    continue;
  }

  if(is503){
    console.log(`Model busy (503), retrying in 2 seconds...`);
    await new Promise(res => setTimeout(res, 2000));
    continue;
  }

  throw err;
}
}
throw new Error("All API keys tokens exceeded for today");
}
 async function createChatHistory(userId,question,answer){
  const chatHistory=await chatHistoryModel.create({userId:userId,question:question,answer:answer});
  return chatHistory;
 }

exports.chatBotController=catchAsyncError(async(req,res,next)=>{
  const user=await usersModel.findById(req.user.id);
  const {question}=req.body;
  if(!question)
    return next(new appError("Question is required",400));
  const history=await chatHistoryModel
  .find({userId:user._id})
  .sort({createdAt:-1})
  .limit(5)
  .lean();
  const formattedHistory=history.reverse().map(m=>
    `User:${m.question}\nAssistant:${m.answer}`
  ).join("\n");
  const answer=await model(question,formattedHistory);
 
  createChatHistory(user._id, question,answer),
  res.status(200).json({
    status:'success',
    data:{
      answer:answer
    }
  })
});

exports.getChatHistory=catchAsyncError(async(req,res,next)=>{
    const user=await usersModel.findById(req.user.id);
    const chatHistory=await chatHistoryModel.find({userId:user._id}).sort({createdAt:-1});
    if(!chatHistory){
      return next(new appError('No chat history found',400));
    }
    res.status(200).json({
      status:'success',
      results: chatHistory.length,
      data:{
        History:chatHistory
      }
    });
});