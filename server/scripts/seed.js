import mongoose from 'mongoose';
import College from '../models/college.model.js';
import dotenv from 'dotenv';
dotenv.config();

const seedColleges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lostandfound");
    console.log('Connected to MongoDB');

    const colleges = [
      { name: "ABC Engineering College", domains: ["@abc.edu", "@student.abc.edu"] },
      { name: "Global Tech University", domains: ["@gtu.edu", "@alumni.gtu.edu"] },
      { name: "State Arts College", domains: ["@statearts.edu", "@mail.statearts.edu"] },
      { name: "City Medical Institute", domains: ["@cmi.med.edu", "@student.cmi.med.edu"] }
    ];

    await College.deleteMany({}); // clear existing
    await College.insertMany(colleges);
    console.log('Colleges seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedColleges();
