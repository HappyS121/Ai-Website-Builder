import { chatSession, openRouterChatSessions } from "@/configs/AiModel";
import { NextResponse } from "next/server";
import Prompt from "@/data/Prompt";

export async function POST(req) {
    const { prompt, model = 'gemini', environment = 'react' } = await req.json();

    try {
        let result;
        
        // Select the appropriate chat prompt based on environment
        const chatPrompt = environment === 'html' 
            ? Prompt.CHAT_PROMPT.HTML 
            : Prompt.CHAT_PROMPT.REACT;
        
        const fullPrompt = prompt + " " + chatPrompt;
        
        switch (model) {
            case 'deepseek-chat':
                result = await openRouterChatSessions.deepseekChat.sendMessage(fullPrompt);
                break;
            case 'deepseek-r1':
                result = await openRouterChatSessions.deepseekR1.sendMessage(fullPrompt);
                break;
            case 'gemini-openrouter':
                result = await openRouterChatSessions.geminiFlash.sendMessage(fullPrompt);
                break;
            case 'qwen':
                result = await openRouterChatSessions.qwen.sendMessage(fullPrompt);
                break;
            case 'gemini':
            default:
                result = await chatSession.sendMessage(fullPrompt);
                break;
        }

        const AIResp = result.response.text();
        return NextResponse.json({ result: AIResp });
    } catch (e) {
        console.error('AI Chat Error:', e);
        return NextResponse.json({ 
            error: e.message || 'An error occurred while processing your request' 
        }, { status: 500 });
    }
}