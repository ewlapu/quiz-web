const { z } = require('zod');

const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subjectId: z.string().min(1, 'Subject ID is required'),
  questionIds: z.array(z.string()).min(1, 'At least one question is required'),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute')
});

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
  };
};

module.exports = {
  validateExam: validate(examSchema)
};
