import { Mistral } from '@mistralai/mistralai';
import { getQuery } from 'h3';

export default defineEventHandler(async (e) => {
    const { songs } = getQuery(e);
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
        content: `${songs}`
    }];

    try {
        const mistral = new Mistral({ apiKey: config.mistralAiApiKey });

        const stream = await mistral.chat.stream({
            model: 'mistral-small-latest',
            messages
        });

        setHeader(e, 'Content-Type', 'text/event-stream');
        setHeader(e, 'Cache-Control', 'no-cache');
        setHeader(e, 'Connection', 'keep-alive');
console.log('---');
        for await (const chunk of stream) {
            e.node.res.write(`data: ${JSON.stringify({ message: chunk.data.choices[0].delta.content })}\n\n`);
            
            //const streamText = `${chunk.data.choices[0].delta.content}`;
            //e.node.res.write(streamText);
            //process.response.write(streamText);
        }

        e.node.res.end();
    } 
    catch (error) {
        console.error(error);
            
        throw createError({
            statusCode: 500,
            message: error
        });
    }
});