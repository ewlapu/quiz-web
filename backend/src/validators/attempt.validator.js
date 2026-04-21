const { z } = require('zod');

const attemptSchema = z.object({
  examId: z.string().min(1, 'Exam ID is required'),
  answers: z.array(z.object({
    questionId: z.string().min(1, 'Question ID is required'),
    selectedOption: z.enum(['A', 'B', 'C', 'D'])
  })).min(1, 'At least one answer is required')
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
  validateAttempt: validate(attemptSchema)
};
