import { HfInference } from '@huggingface/inference';

export default defineEventHandler(async (e) => {
    const { songs } = await readBody(e);
    const config = useRuntimeConfig();

    const messages = [{ 
        role: 'system', 
        content: `
        You are a helpful creative psychiatrist who determines peoples personalities by looking at the songs they listen to. Besides that, 
        give an in-depth analasys of who I might prefer as a romantic partner and why. Mention a few songs on which you based the analysis.
        Respond in markdown and do not ask if you can assist any further.
        `
    },{ 
        role: 'user', 
        content: songs
    }];
      
    const formattedMessages = messages.map((message) => {
        return `<${message.role}>\n${message.content}\n</${message.role}>`
    }).join('\n');
    
    try {
        const hf = new HfInference(config.huggingFaceApiKey);
        
        // const response = await hf.textGeneration({
        //     model: 'mistralai/Mistral-7B-Instruct-v0.2',
        //     inputs: formattedMessages,
        //     parameters: {
        //         max_new_tokens: 1024,
        //         temperature: 0.3,
        //         top_p: 0.95,
        //         return_full_text: false
        //     }
        // });

        const generatedText = `
Based on the songs you've shared, it seems that you have a complex and multifaceted personality. You appear to have a strong affinity for music that evokes emotions, particularly those related to love, longing, and nostalgia. Here are a few observations about the type of romantic partner you might prefer, based on the songs in your playlist:

Introspective and Emotional: Many of the songs you've listed are deeply emotional and introspective. This suggests that you might be drawn to partners who are also deeply emotional and introspective. You might appreciate someone who is able to connect with you on a deep emotional level and who is not afraid to express their feelings.

Creative and Artistic: Several of the songs on your playlist are by artists known for their creativity and artistic expression. This suggests that you might be attracted to partners who are also creative and artistic. You might enjoy someone who is able to express themselves through various forms of art, whether it be music, painting, writing, or another medium.

Loyal and Committed: Many of the songs you've shared are about long-term love and commitment. This suggests that you might be looking for a partner who is loyal and committed to the relationship. You might appreciate someone who is reliable and who is able to provide a sense of stability and security.

Passionate and Energetic: Several of the songs on your playlist are upbeat and energetic, suggesting that you might be attracted to partners who are passionate and energetic. You might enjoy someone who is able to bring excitement and adventure into your life.

Based on these observations, some potential romantic partners for you might include artists or creatives who are deeply emotional, introspective, and committed to their relationships. They might be passionate and energetic, and they might be able to connect with you on a deep emotional level through their art or music.

Some specific artists or songs that might resonate with you include:

Lana Del Rey: Her music is deeply emotional and introspective, and it often explores themes of love, longing, and nostalgia. Some of her songs that might particularly resonate with you include "hope is a dangerous thing for a woman like me to have - but I have it," "Margaret (feat. Bleachers)," "Mariners Apartment Complex," and "Say Yes To Heaven."
Eminem: While his music can be quite raw and explicit, it also often explores deep emotional themes. Some of his songs that might resonate with you include "Legacy," "The Ringer," and "Heaven Must Have Sent You - Mono Single."
Selena: Her music is passionate and energetic, and it often explores themes of love and commitment. Some of her songs that might particularly resonate with you include "Bidi Bidi Bom Bom" and "El Chico Del Apartamento 512."
Cigarettes After Sex: Their music is deeply emotional and introspective, and it often explores themes of longing and desire. Some of their songs that might particularly resonate with you include "Heavenly" and "Opera House."
I hope this analysis provides some insight into the type of romantic partner you might be drawn to, based on the songs in your playlist. Let me know if you have any questions or if there's anything else I can help you with!
            `;

        return {
            generated_text: generatedText
        }

        return response;
    } 
    catch (error) {
        console.error(error);
            
        throw createError({
            statusCode: 500,
            message: error
        });
    }
});