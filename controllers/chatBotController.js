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

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function model(userMessage,historyText) {
  try{
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
 contents: `
You are "Metro Mate Assistant" — the official AI guide for the Metro Mate app (تطبيق مترو ميت), which serves Cairo Metro (مترو القاهرة) and the BRT Bus Rapid Transit (الأتوبيس الترددي).

## WHO YOU ARE:
You combine two sources of knowledge:
1. Your internal training data → for navigation, station names, routes, transfers, and geography.
2. The App Knowledge Base (JSON below) → for everything related to the Metro Mate app: tickets, subscriptions, fines, account, payments, nearest stations, and app features.

## YOUR RULES:
1. Always answer in the SAME language the user writes in — Arabic or English. Never mix them.
2. For navigation questions (كيف أروح؟ / how do I get to?):
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

## IMPORTANT GEOGRAPHIC FACTS:
- Cairo International Book Fair (معرض القاهرة الدولي للكتاب) new location → EISEC, nearest station: "El-Estad" or "fair zone" on Line 3.
- Cairo Airport → "Cairo Airport T3" on Line 3.
- Tahrir Square → "Sadat" station, Lines 1 & 2 (interchange).
- Ramses Station (train) → "Al-Shohadaa" station, Lines 1 & 2 (interchange).
- Cairo University → "Cairo University" station on Line 2.
- Giza Pyramids → nearest metro: "Giza" on Line 2, then microbus/taxi.
-Keep navigation answers brief — max 4 lines. No need to cover every possible starting point, just give the direct route.
## APP KNOWLEDGE BASE (Tickets, Subscriptions, Fines, Features):
${JSON.stringify(metroData)}

## CONVERSATION HISTORY (last 10 messages for context):
${historyText}

## CURRENT USER MESSAGE:
${userMessage}

## YOUR RESPONSE:
`
  });
   const rawText= response.text;
   //clean answer from marks
   const cleanText=rawText.replace(/\*\*(.*?)\*\*/g, '$1')
   .replace(/\*(.*?)\*/g, '$1')
   .replace(/\\n/g, '\n')
   .replace(/#{1,6}\s/g, '') 
   .replace(/^\s*[-*]\s/gm, '') 
   .replace(/\n{3,}/g, '\n\n')
   .trim();
   return cleanText;
}
  catch(err){
    console.error(err);
    throw new Error("AI service failed");
  }
}
 async function createChatHistory(userId,role,message){
  const chatHistory=await chatHistoryModel.create({userId:userId,role:role,text:message});
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
  .limit(10)
  .lean();
  const formattedHistory=history.reverse().map(m=>
    `${m.role==="user"?"User":"Assistant"}:${m.text}`
  ).join("\n");
  const answer=await model(question,formattedHistory);
  await Promise.all([
  createChatHistory(user._id, "user", question),
  createChatHistory(user._id, "assistant", answer),
]);
  res.status(200).json({
    status:'success',
    data:{
      answer:answer
    }
  })
});