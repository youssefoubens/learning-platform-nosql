const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const config = require('./env');

let mongoClient, redisClient, db;

// MongoDB connection
async function connectMongo() {
    try {
        mongoClient = new MongoClient(config.mongodb.uri);
        await mongoClient.connect();
        db = mongoClient.db(config.mongodb.dbName);
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call connectMongo first.');
    }
    return db;
}

// Redis connection
async function connectRedis() {
    const redisUri = config.redis.uri;

    redisClient = new Redis(redisUri, {
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            console.log(`Retrying Redis connection in ${delay}ms...`);
            return delay;
        },
    });

    redisClient.on('connect', () => {
        console.log('Connected to Redis successfully!');
    });

    redisClient.on('error', (err) => {
        console.error('Error connecting to Redis:', err);
    });

    try {
        await redisClient.ping();
        console.log('Redis connection is ready.');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        process.exit(1);
    }

    return redisClient;
}

module.exports = {
    connectMongo,
    connectRedis,
    getDb,
    redisClient,
    mongoClient,
};
