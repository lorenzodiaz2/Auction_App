const { MongoClient } = require("mongodb");
const MONGODB_URI = process.env.MONGODB_URI; 
let cachedDb;

module.exports = {
  connectToDatabase: async () => {
    if (cachedDb) {
      return cachedDb;
    }
    try {
      const client = await MongoClient.connect(MONGODB_URI);
      const db = client.db();
      cachedDb = db;
      return db;
    } catch (error) {
      console.log("ERROR aquiring DB Connection!");
      console.log(error);
      throw error;
    }
  }
};
