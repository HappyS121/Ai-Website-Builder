import { chatSession, openRouterChatSessions } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, environment = 'react', model = 'gemini' } = await request.json();
        
        // Select the appropriate enhancement rules based on environment
        const enhanceRules = environment === 'html' 
            ? Prompt.HTML_ENHANCE_PROMPT_RULES 
            : Prompt.REACT_ENHANCE_PROMPT_RULES;
        
        let result;
        
        switch (model) {
            case 'deepseek-chat':
                result = await openRouterChatSessions.deepseekChat.sendMessage([
                    enhanceRules,
                    `Original prompt: ${prompt}`
                ]);
                break;
            case 'deepseek-r1':
                result = await openRouterChatSessions.deepseekR1.sendMessage([
                    enhanceRules,
                    `Original prompt: ${prompt}`
                ]);
                break;
            case 'gemini-openrouter':
                result = await openRouterChatSessions.geminiFlash.sendMessage([
                    enhanceRules,
                    `Original prompt: ${prompt}`
                ]);
                break;
            case 'qwen':
                result = await openRouterChatSessions.qwen.sendMessage([
                    enhanceRules,
                    `Original prompt: ${prompt}`
                ]);
                break;
            case 'gemini':
            default:
                result = await chatSession.sendMessage([
                    enhanceRules,
                    `Original prompt: ${prompt}`
                ]);
                break;
        }
        
        const text = result.response.text();
        
        return NextResponse.json({
            enhancedPrompt: text.trim()
        });
    } catch (error) {
        console.error('Enhance Prompt Error:', error);
        return NextResponse.json({ 
            error: error.message,
            success: false 
        }, { status: 500 });
    }
}