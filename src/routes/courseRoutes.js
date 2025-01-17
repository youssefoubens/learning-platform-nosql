// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : 
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: 

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/getcourse/:id', courseController.getCourse);
router.get('/stats', courseController.getCourseStats);
router.get('/all', courseController.getAllCourses);

module.exports = router;