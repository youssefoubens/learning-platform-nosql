// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?

const express = require('express');
const config = require('./config/env');
const db = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');



const app = express();

async function initialiserConnection() {
  try {
    // Initialize MongoDB connection
    await db.connectMongo();
    // Initialize Redis connection
    const redisClient = await db.connectRedis(); 
    console.log('Databases connected successfully.');
    app.locals.redis = redisClient;
  } catch (error) {
    console.error('Error initializing database connections:', error);
    process.exit(1); // Exit the process if initialization fails
  }
}



async function startServer() {
  try {
    // TODO: Initialiser les connexions aux bases de données
    await initialiserConnection();
    // TODO: Configurer les middlewares Express
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
  
    // Import course routes
    app.use('/api/courses', courseRoutes);
    // TODO: Démarrer le serveur
    const PORT = process.env.PORT; // Use the port from .env 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process if the server fails to start
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  // TODO: Implémenter la fermeture propre des connexions
});

startServer();