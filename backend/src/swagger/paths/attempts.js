module.exports = {
  '/api/attempts': {
    post: {
      tags: ['Attempts'],
      summary: 'Submit exam attempt (User)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['examId', 'answers'],
              properties: {
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
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Attempt submitted successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Exam is not published' },
        404: { description: 'Exam not found' },
        500: { description: 'Server error' }
      }
    },
    get: {
      tags: ['Attempts'],
      summary: 'Get all attempts (Admin/Teacher)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
      ],
      responses: {
        200: { description: 'List of attempts' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/attempts/me': {
    get: {
      tags: ['Attempts'],
      summary: 'Get my attempts (Current user)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
      ],
      responses: {
        200: { description: 'List of user attempts' },
        401: { description: 'Not authenticated' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/attempts/{id}': {
    get: {
      tags: ['Attempts'],
      summary: 'Get attempt by ID (Admin/Teacher - ownership)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Attempt details' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Attempt not found' },
        500: { description: 'Server error' }
      }
    },
    delete: {
      tags: ['Attempts'],
      summary: 'Delete attempt (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Attempt deleted successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Attempt not found' },
        500: { description: 'Server error' }
      }
    }
  }
};
