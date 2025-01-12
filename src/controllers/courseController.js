// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');

const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const { title, description, instructor, duration, price, category, level } = req.body;

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
   
    let stats = await redisService.getCachedData(cacheKey);

    if (!stats) {
    
      const totalCourses = await mongoService.countDocuments('courses', {});
      stats = { totalCourses };

  
      await redisService.cacheData(cacheKey, stats, 600);
    }

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
};