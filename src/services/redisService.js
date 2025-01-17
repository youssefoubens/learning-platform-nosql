// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :

const { connectRedis } = require('../config/db');

let redisClient;

// Initialize the Redis client
async function initializeRedisClient() {
    if (!redisClient) {
        redisClient = await connectRedis();
    }
    return redisClient;
}

// Cache data in Redis
async function cacheData(key, data, ttl) {
    try {
        if (!key || !data) {
            throw new Error('Key and data are required for caching.');
        }

        const client = await initializeRedisClient();
        const dataString = JSON.stringify(data);

        if (ttl) {
            await client.set(key, dataString, 'EX', ttl);
        } else {
            await client.set(key, dataString);
        }

        console.log(`Data cached successfully with key: ${key}`);
    } catch (error) {
        console.error('Error caching data:', error);
        throw error;
    }
}

// Retrieve data from Redis cache
async function getCachedData(key) {
    try {
        if (!key) {
            throw new Error('Key is required to retrieve cached data.');
        }

        const client = await initializeRedisClient();
        const dataString = await client.get(key);

        if (!dataString) {
            return null;
        }

        return JSON.parse(dataString);
    } catch (error) {
        console.error('Error retrieving cached data:', error);
        throw error;
    }
}

// Delete cached data by key
async function deleteCachedData(key) {
    try {
        if (!key) {
            throw new Error('Key is required to delete cached data.');
        }

        const client = await initializeRedisClient();
        await client.del(key);

        console.log(`Data with key: ${key} deleted from cache successfully.`);
    } catch (error) {
        console.error('Error deleting cached data:', error);
        throw error;
    }
}

// Check if a key exists in Redis
async function isKeyExists(key) {
    try {
        if (!key) {
            throw new Error('Key is required to check existence.');
        }

        const client = await initializeRedisClient();
        const exists = await client.exists(key);
        return exists === 1;
    } catch (error) {
        console.error('Error checking key existence in cache:', error);
        throw error;
    }
}

module.exports = {
    cacheData,
    getCachedData,
    deleteCachedData,
    isKeyExists,
};
