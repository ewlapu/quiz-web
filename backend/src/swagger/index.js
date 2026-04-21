const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz/Exam System API',
      version: '1.0.0',
      description: 'Backend API for Quiz/Exam Management System'
    },
    servers: [
      {
        url: 'http://localhost:2409',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'teacher', 'user'] },
            status: { type: 'string', enum: ['active', 'locked'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Subject: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Question: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            subjectId: { type: 'string' },
            content: { type: 'string' },
            options: {
              type: 'object',
              properties: {
                A: { type: 'string' },
                B: { type: 'string' },
                C: { type: 'string' },
                D: { type: 'string' }
              }
            },
            correctOption: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Exam: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            subjectId: { type: 'string' },
            questionIds: { type: 'array', items: { type: 'string' } },
            timeLimit: { type: 'number' },
            isPublished: { type: 'boolean' },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Attempt: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            examId: { type: 'string' },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionId: { type: 'string' },
                  selectedOption: { type: 'string', enum: ['A', 'B', 'C', 'D'] }
                }
              }
            },
            score: { type: 'number' },
            submittedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Subjects', description: 'Subject management endpoints' },
      { name: 'Questions', description: 'Question management endpoints' },
      { name: 'Exams', description: 'Exam management endpoints' },
      { name: 'Attempts', description: 'Attempt management endpoints' },
      { name: 'Export', description: 'Export endpoints' }
    ]
  },
  apis: ['./src/swagger/paths/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
