import { NextResponse } from "next/server";
import { GenAiCode, openRouterCodeSessions } from '@/configs/AiModel';
import Prompt from '@/data/Prompt';

export async function POST(req) {
    const { prompt, model = 'gemini', environment = 'react' } = await req.json();
    
    try {
        // Select the appropriate code generation prompt based on environment
        const codeGenPrompt = environment === 'html' 
            ? Prompt.HTML_CODE_GEN_PROMPT 
            : Prompt.REACT_CODE_GEN_PROMPT;
        
        const fullPrompt = JSON.stringify([{ role: 'user', content: prompt }]) + " " + codeGenPrompt;
        
        let result;
        
        switch (model) {
            case 'deepseek-chat':
                result = await openRouterCodeSessions.deepseekChat.sendMessage(fullPrompt);
                break;
            case 'deepseek-r1':
                result = await openRouterCodeSessions.deepseekR1.sendMessage(fullPrompt);
                break;
            case 'gemini-openrouter':
                result = await openRouterCodeSessions.geminiFlash.sendMessage(fullPrompt);
                break;
            case 'qwen':
                result = await openRouterCodeSessions.qwen.sendMessage(fullPrompt);
                break;
            case 'gemini':
            default:
                result = await GenAiCode.sendMessage(fullPrompt);
                break;
        }

        const resp = result.response.text();
        
        // Try to parse JSON response with improved logic
        let parsedResponse;
        
        // First, try to extract JSON from markdown code block
        const jsonMatch = resp.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            try {
                parsedResponse = JSON.parse(jsonMatch[1].trim());
            } catch (parseError) {
                console.warn('Failed to parse JSON from markdown block:', parseError.message);
                // Fall through to try parsing the entire response
            }
        }
        
        // If no markdown block found or parsing failed, try parsing the entire response
        if (!parsedResponse) {
            try {
                parsedResponse = JSON.parse(resp.trim());
            } catch (parseError) {
                console.error('Failed to parse AI response as JSON:', parseError.message);
                console.error('Raw response:', resp);
                throw new Error('Invalid JSON response from AI model. The AI model returned malformed JSON.');
            }
        }
        
        return NextResponse.json(parsedResponse);
    } catch (e) {
        console.error('Code Generation Error:', e);
        
        // Provide more specific error messages
        let errorMessage = 'An error occurred while generating code';
        if (e.message.includes('rate-limited') || e.message.includes('429')) {
            errorMessage = 'The AI model is temporarily rate-limited. Please try again in a few moments or select a different model.';
        } else if (e.message.includes('Invalid JSON')) {
            errorMessage = e.message;
        }
        
        return NextResponse.json({ 
            error: errorMessage
        }, { status: 500 });
    }
}