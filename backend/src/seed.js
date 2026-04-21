require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Question = require('./models/Question');
const Exam = require('./models/Exam');
const Attempt = require('./models/Attempt');
const { hashPassword } = require('./utils/password');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Subject.deleteMany({});
    await Question.deleteMany({});
    await Exam.deleteMany({});
    await Attempt.deleteMany({});

    console.log('Cleared existing data');

    const adminPassword = await hashPassword('Admin@123');
    const teacherPassword = await hashPassword('Teacher@123');
    const userPassword = await hashPassword('User@123');

    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: adminPassword,
      role: 'admin',
      status: 'active'
    });

    const teacher = await User.create({
      fullName: 'Teacher User',
      email: 'teacher@demo.com',
      passwordHash: teacherPassword,
      role: 'teacher',
      status: 'active'
    });

    const user = await User.create({
      fullName: 'Regular User',
      email: 'user@demo.com',
      passwordHash: userPassword,
      role: 'user',
      status: 'active'
    });

    console.log('Created users');

    const mathSubject = await Subject.create({
      name: 'Mathematics',
      description: 'Math questions and exams',
      status: 'active'
    });

    const scienceSubject = await Subject.create({
      name: 'Science',
      description: 'Science questions and exams',
      status: 'active'
    });

    console.log('Created subjects');

    const questions = [];
    
    for (let i = 1; i <= 5; i++) {
      questions.push(await Question.create({
        subjectId: mathSubject._id,
        content: `What is ${i} + ${i}?`,
        options: {
          A: `${i * 2}`,
          B: `${i * 2 + 1}`,
          C: `${i * 2 - 1}`,
          D: `${i * 3}`
        },
        correctOption: 'A',
        createdBy: teacher._id
      }));
    }

    for (let i = 1; i <= 5; i++) {
      questions.push(await Question.create({
        subjectId: scienceSubject._id,
        content: `Science question ${i}: Which is a planet?`,
        options: {
          A: 'Sun',
          B: 'Moon',
          C: 'Earth',
          D: 'Asteroid'
        },
        correctOption: 'C',
        createdBy: teacher._id
      }));
    }

    console.log('Created 10 questions');

    const mathExam = await Exam.create({
      title: 'Basic Math Exam',
      subjectId: mathSubject._id,
      questionIds: questions.slice(0, 5).map(q => q._id),
      timeLimit: 30,
      isPublished: true,
      createdBy: teacher._id
    });

    const scienceExam = await Exam.create({
      title: 'Science Quiz',
      subjectId: scienceSubject._id,
      questionIds: questions.slice(5, 10).map(q => q._id),
      timeLimit: 20,
      isPublished: false,
      createdBy: teacher._id
    });

    console.log('Created 2 exams (1 published)');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log('Users created:');
    console.log('  Admin: admin@demo.com / Admin@123');
    console.log('  Teacher: teacher@demo.com / Teacher@123');
    console.log('  User: user@demo.com / User@123');
    console.log('\nSubjects: 2 (Mathematics, Science)');
    console.log('Questions: 10 (5 per subject)');
    console.log('Exams: 2 (1 published, 1 unpublished)');
    console.log('\n=== SEED COMPLETED SUCCESSFULLY ===');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
