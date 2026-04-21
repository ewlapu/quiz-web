const { z } = require('zod');

const questionSchema = z.object({
  subjectId: z.string().min(1, 'Subject ID is required'),
  content: z.string().min(1, 'Content is required'),
  options: z.object({
    A: z.string().min(1, 'Option A is required'),
    B: z.string().min(1, 'Option B is required'),
    C: z.string().min(1, 'Option C is required'),
    D: z.string().min(1, 'Option D is required')
  }),
  correctOption: z.enum(['A', 'B', 'C', 'D'])
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
  validateQuestion: validate(questionSchema)
};
