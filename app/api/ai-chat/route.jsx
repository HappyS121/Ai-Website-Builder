import { chatSession, openRouterChatSessions } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt, model = 'gemini' } = await req.json();

    try {
        let result;
        
        switch (model) {
            case 'deepseek-chat':
                result = await openRouterChatSessions.deepseekChat.sendMessage(prompt);
                break;
            case 'deepseek-r1':
                result = await openRouterChatSessions.deepseekR1.sendMessage(prompt);
                break;
            case 'gemini-openrouter':
                result = await openRouterChatSessions.geminiFlash.sendMessage(prompt);
                break;
            case 'qwen':
                result = await openRouterChatSessions.qwen.sendMessage(prompt);
                break;
            case 'gemini':
            default:
                result = await chatSession.sendMessage(prompt);
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