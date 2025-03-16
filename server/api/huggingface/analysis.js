import { HfInference } from '@huggingface/inference';

export default defineEventHandler(async (e) => {
    const { songs } = await readBody(e);
    const config = useRuntimeConfig();

    const messages = [{ 
        role: 'system', 
        content: 'You are a helpful creative psychiatrist who determines peoples personalities by looking at the songs they listen to. Besides that, give an in-depth analasys of who I might prefer as a romantic partner and why.'
    },{ 
        role: 'user', 
        content: songs
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
                temperature: 0.7,
                top_p: 0.95,
                return_full_text: false
            }
        });

        console.log(response);

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