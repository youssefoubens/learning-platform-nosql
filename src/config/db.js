// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
//Réponse:on peut cree tous les connexions dans un seul fichier mais il est plus propre 
// de les separer pour une meilleur lisibilite et facilite de maintenance
// aussi l'operation de connexion peut etre coteuse en performance lorsqu'on cree une connexion a chaque fois
//Si on utilise des connexions multiples on va charger notre processeur en notr memoire .

// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : On doit fermer les connexions lorsqu'on a fini de les utiliser pour liberer les ressources(memorie,cpu)

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo(){
  try {
    mongoClient = new MongoClient(config.mongodb.uri);
    // Connexion à MongoDB
    await mongoClient.connect();
    // Sélection de la base de données
    db = mongoClient.db(config.mongodb.dbName); 

    console.log('Connexion MongoDB réussie');
    
  } catch (error) {
    console.error('Erreur lors de la connexion à MongoDB :', error);
    process.exit(1); // Quitter l'application en cas d'échec
  }
}

// Getter for the database instance
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectMongo first.');
  }
  return db;
}

async function connectRedis() {
  const redisUri = config.redis.uri; 

  const redis = require('ioredis'); 

  const redisClient = new redis(redisUri, {
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
    // Test connection using PING command
    await redisClient.ping();
    console.log('Redis connection is ready.');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }

  return redisClient; // Return the Redis client
}


// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  mongoClient,
  redisClient,
  getDb,
};
