import { createClient } from 'redis';

let client = null;

export async function getRedisClient() {
    if (client === null || !client.isOpen) {
        client = createClient({
            url: `redis://${process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD + '@' : ''}${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'}`,
            socket: {
                tls: process.env.REDIS_TLS === 'true'
            }
        });
    
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();
    }
  
    return client;
}

export async function closeRedisConnection() {
    if (client && client.isOpen) {
        await client.disconnect();
    }
}