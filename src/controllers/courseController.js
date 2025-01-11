// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const { title, description, instructor, duration, price, category, level } = req.body;

    // Validate required fields
    if (!title || !description || !instructor || !duration || !price || !category || !level) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new course object
    const course = {
      title,
      description,
      instructor,
      duration,
      price,
      category,
      level,
      createdAt: new Date(),
    };

    // Insert the course into the database
    const result = await mongoService.insertOne('courses', course);

    // Respond with the created course
    res.status(201).json({ message: 'Course created successfully.', courseId: result.insertedId });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Failed to create course.', error: error.message });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID.' });
    }

    // Retrieve the course from the database
    const course = await mongoService.findOneById('courses', id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error retrieving course:', error);
    res.status(500).json({ message: 'Failed to retrieve course.', error: error.message });
  }
}

async function getCourseStats(req, res) {
  try {
    // Example: Get total number of courses
    const totalCourses = await mongoService.countDocuments('courses', {});

    res.status(200).json({ totalCourses });
  } catch (error) {
    console.error('Error retrieving course stats:', error);
    res.status(500).json({ message: 'Failed to retrieve course stats.', error: error.message });
  }
}

// Export the controllers
module.exports = {
  createCourse,
  getCourse,
  getCourseStats,
};