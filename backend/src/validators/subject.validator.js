const { z } = require('zod');

const subjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional()
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
  validateSubject: validate(subjectSchema)
};
