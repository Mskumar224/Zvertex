const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`${new Date().toISOString()} - MongoDB Connected`);
  } catch (err) {
    console.error(`${new Date().toISOString()} - MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;