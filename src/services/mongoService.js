// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');

const db = require('../config/db');



async function findOneById(collectionName, id) {
  try {
    const collection = db.getDb().collection(collectionName);
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId.');
    }
    const result = await collection.findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error('Error finding document by ID:', error);
    throw error;
  }
}


async function insertOne(collectionName, document) {
  try {
    const collection = db.getDb().collection(collectionName);
    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    console.error('Error inserting document:', error);
    throw error;
  }
}

async function countDocuments(collectionName, query = {}) {
  try {
    const collection = db.getDb().collection(collectionName);
    const count = await collection.countDocuments(query);
    return count;
  } catch (error) {
    console.error('Error counting documents:', error);
    throw error;
  }
}

async function findAll(collectionName, query = {}, options = {}) {
  try {
    const collection = db.getDb().collection(collectionName);
    const documents = await collection.find(query, options).toArray();
    return documents;
  } catch (error) {
    console.error('Error finding documents:', error);
    throw error;
  }
}

// Export the utility functions
module.exports = {
  findOneById,
  insertOne,
  countDocuments,
  findAll,
};
