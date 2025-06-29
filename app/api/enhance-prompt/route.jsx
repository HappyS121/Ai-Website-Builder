import { chatSession } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, environment = 'react' } = await request.json();
        
        // Select the appropriate prompt rules based on environment
        const promptRules = environment === 'html' 
            ? Prompt.ENHANCE_PROMPT_RULES.HTML 
            : Prompt.ENHANCE_PROMPT_RULES.REACT;
        
        const result = await chatSession.sendMessage([
            promptRules,
            `Original prompt: ${prompt}`
        ]);
        
        const text = result.response.text();
        
        return NextResponse.json({
            enhancedPrompt: text.trim()
        });
    } catch (error) {
        return NextResponse.json({ 
            error: error.message,
            success: false 
        }, { status: 500 });
    }
}