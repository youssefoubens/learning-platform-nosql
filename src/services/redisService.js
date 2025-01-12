// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :

const redisClient = require('../config/db').redisClient;

// Fonction utilitaire pour mettre en cache des données dans Redis
async function cacheData(key, data, ttl) {
    try {
        if (!key || !data) {
            throw new Error('Key and data are required for caching.');
        }

        // Convert data to string for Redis
        const dataString = JSON.stringify(data);

        // Set data with optional time-to-live (TTL)
        if (ttl) {
            await redisClient.set(key, dataString, 'EX', ttl);
        } else {
            await redisClient.set(key, dataString);
        }

        console.log(`Data cached successfully with key: ${key}`);
    } catch (error) {
        console.error('Error caching data:', error);
        throw error;
    }
}

// Fonction utilitaire pour récupérer des données depuis le cache Redis
async function getCachedData(key) {
    try {
        if (!key) {
            throw new Error('Key is required to retrieve cached data.');
        }

        const dataString = await redisClient.get(key);
        if (!dataString) {
            return null; 
        }

        // Parse and return the cached data
        return JSON.parse(dataString);
    } catch (error) {
        console.error('Error retrieving cached data:', error);
        throw error;
    }
}

// Fonction utilitaire pour supprimer une clé du cache Redis
async function deleteCachedData(key) {
    try {
        if (!key) {
            throw new Error('Key is required to delete cached data.');
        }

        await redisClient.del(key);
        console.log(`Data with key: ${key} deleted from cache successfully.`);
    } catch (error) {
        console.error('Error deleting cached data:', error);
        throw error;
    }
}

// Fonction utilitaire pour vérifier l'existence d'une clé dans le cache Redis
async function isKeyExists(key) {
    try {
        if (!key) {
            throw new Error('Key is required to check existence.');
        }

        const exists = await redisClient.exists(key);
        return exists === 1;
    } catch (error) {
        console.error('Error checking key existence in cache:', error);
        throw error;
    }
}

// Export des fonctions utilitaires
module.exports = {
    cacheData,
    getCachedData,
    deleteCachedData,
    isKeyExists
};
