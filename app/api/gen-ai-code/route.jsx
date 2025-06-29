import { NextResponse } from "next/server";
import { GenAiCode, openRouterCodeSessions } from '@/configs/AiModel';

export async function POST(req) {
    const { prompt, model = 'gemini' } = await req.json();
    
    try {
        let result;
        
        switch (model) {
            case 'deepseek-chat':
                result = await openRouterCodeSessions.deepseekChat.sendMessage(prompt);
                break;
            case 'deepseek-r1':
                result = await openRouterCodeSessions.deepseekR1.sendMessage(prompt);
                break;
            case 'gemini-openrouter':
                result = await openRouterCodeSessions.geminiFlash.sendMessage(prompt);
                break;
            case 'qwen':
                result = await openRouterCodeSessions.qwen.sendMessage(prompt);
                break;
            case 'gemini':
            default:
                result = await GenAiCode.sendMessage(prompt);
                break;
        }

        const resp = result.response.text();
        
        // Try to parse JSON response
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(resp);
        } catch (parseError) {
            // If parsing fails, try to extract JSON from the response
            const jsonMatch = resp.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                parsedResponse = JSON.parse(jsonMatch[1]);
            } else {
                throw new Error('Invalid JSON response from AI model');
            }
        }
        
        return NextResponse.json(parsedResponse);
    } catch (e) {
        console.error('Code Generation Error:', e);
        return NextResponse.json({ 
            error: e.message || 'An error occurred while generating code' 
        }, { status: 500 });
    }
}