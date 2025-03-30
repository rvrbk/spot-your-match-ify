import { HfInference } from '@huggingface/inference';

export default defineEventHandler(async (e) => {
    const { profile } = await readBody(e);
    const config = useRuntimeConfig();

    const messages = [{ 
        role: 'system', 
        content: `
        You are a color mood expert and suggest colors based on a profile of someone. Suggest 3 colors in hex codes based on the profile profived to you
        by the user. Respond only in json format, for example: 
        [{
            description: \'Golden Beige\',
            color: #7d7356
        }, {
            description: \'Army Green\',
            color: #7fba93
        }, {
            description: \'Baby Purple\',
            color: #a672a8
        }]
        `
    },{ 
        role: 'user', 
        content: profile
    }];
      
    const formattedMessages = messages.map((message) => {
        return `<${message.role}>\n${message.content}\n</${message.role}>`
    }).join('\n');
    
    try {
        const hf = new HfInference(config.huggingFaceApiKey);
        
        const response = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            inputs: formattedMessages,
            parameters: {
                max_new_tokens: 1024,
                temperature: 0.3,
                top_p: 0.95,
                return_full_text: false
            }
        });

        return response;
    } 
    catch (error) {
        console.error('Error calling Hugging Face API:', error)
            
        throw createError({
            statusCode: 500,
            message: 'Failed to generate text from model'
        });
    }
});