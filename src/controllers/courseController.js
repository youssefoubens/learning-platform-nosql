// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');

const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const db = require('../config/db');

async function createCourse(req, res) {
  try {
    const { title, description, instructor, duration, price, category, level } = req.body;
    console.log(req.body);

    if (!title || !description || !instructor || !duration || !price || !category || !level) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    
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

    
    const result = await mongoService.insertOne('courses', course);

    await redisService.deleteCachedData('course:stats'); 
    await redisService.deleteCachedData('course:list'); 
    res.status(201).json({ message: 'Course created successfully.', courseId: result.insertedId });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Failed to create course.', error: error.message });
  }
}


async function getAllCourses(req, res) {
  try {
    const cacheKey = 'course:list';
    let courses = await redisService.getCachedData(cacheKey);

    if (!courses) {
      // Récupérer tous les cours de la base de données
      courses = await mongoService.findAll('courses', {});

      // Cacher les cours pendant 10 minutes
      await redisService.cacheData(cacheKey, courses, 600);
    }

    res.status(200).json(courses); // Send the courses as the response
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({ message: 'Failed to retrieve courses.', error: error.message });
  }
}



async function getCourse(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID.' });
    }

    const cacheKey = `course:${id}`;

    let course = await redisService.getCachedData(cacheKey);

    if (!course) {
     
      course = await mongoService.findOneById('courses', id);

      if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
      }

      await redisService.cacheData(cacheKey, course, 3600);
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error retrieving course:', error);
    res.status(500).json({ message: 'Failed to retrieve course.', error: error.message });
  }
}


async function getCourseStats(req, res) {
  try {
    const cacheKey = 'course:stats';

    // Check for cached stats
    let stats = await redisService.getCachedData(cacheKey);

    if (!stats) {
      // Calculate stats if not cached
      const totalCourses = await mongoService.countDocuments('courses', {});
      const avgPriceCursor = await db.getDb().collection('courses').aggregate([
        { $group: { _id: null, avgPrice: { $avg: '$price' } } },
      ]);
      const coursesByCategoryCursor = await db.getDb().collection('courses').aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
      const coursesByLevelCursor = await db.getDb().collection('courses').aggregate([
        { $group: { _id: '$level', count: { $sum: 1 } } },
      ]);

      // Convert cursors to arrays
      const avgPrice = await avgPriceCursor.toArray();
      const coursesByCategory = await coursesByCategoryCursor.toArray();
      const coursesByLevel = await coursesByLevelCursor.toArray();

      // Assemble stats
      stats = {
        totalCourses,
        avgPrice: avgPrice[0]?.avgPrice || 0,
        coursesByCategory: coursesByCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        coursesByLevel: coursesByLevel.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      };

      // Cache the calculated stats
      await redisService.cacheData(cacheKey, stats, 600); // Cache for 10 minutes
    }

    // Send response
    res.status(200).json(stats);
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
  getAllCourses,
};