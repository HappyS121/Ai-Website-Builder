import { chatSession, openRouterChatSessions } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt, model = 'gemini', environment = 'react' } = await req.json();

    try {
        // Use the same chat prompt for both environments, but could be customized if needed
        const chatPrompt = JSON.stringify([{ role: 'user', content: prompt }]) + Prompt.CHAT_PROMPT;
        
        let result;
        
        switch (model) {
            case 'deepseek-chat':
                result = await openRouterChatSessions.deepseekChat.sendMessage(chatPrompt);
                break;
            case 'deepseek-r1':
                result = await openRouterChatSessions.deepseekR1.sendMessage(chatPrompt);
                break;
            case 'gemini-openrouter':
                result = await openRouterChatSessions.geminiFlash.sendMessage(chatPrompt);
                break;
            case 'qwen':
                result = await openRouterChatSessions.qwen.sendMessage(chatPrompt);
                break;
            case 'gemini':
            default:
                result = await chatSession.sendMessage(chatPrompt);
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