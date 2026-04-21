const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const routes = require('./routes');
const authSwagger = require('./swagger/paths/auth');
const usersSwagger = require('./swagger/paths/users');
const subjectsSwagger = require('./swagger/paths/subjects');
const questionsSwagger = require('./swagger/paths/questions');
const examsSwagger = require('./swagger/paths/exams');
const attemptsSwagger = require('./swagger/paths/attempts');
const exportSwagger = require('./swagger/paths/export');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

swaggerSpec.paths = {
  ...authSwagger,
  ...usersSwagger,
  ...subjectsSwagger,
  ...questionsSwagger,
  ...examsSwagger,
  ...attemptsSwagger,
  ...exportSwagger
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Quiz/Exam System API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
