module.exports = {
  '/api/questions': {
    get: {
      tags: ['Questions'],
      summary: 'Get questions (Admin/Teacher)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'subjectId', schema: { type: 'string' } },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
      ],
      responses: {
        200: { description: 'List of questions' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    },
    post: {
      tags: ['Questions'],
      summary: 'Create question (Admin/Teacher)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['subjectId', 'content', 'options', 'correctOption'],
              properties: {
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
                correctOption: { type: 'string', enum: ['A', 'B', 'C', 'D'] }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Question created successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/questions/{id}': {
    put: {
      tags: ['Questions'],
      summary: 'Update question (Admin/Teacher - ownership)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Question' }
          }
        }
      },
      responses: {
        200: { description: 'Question updated successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Question not found' },
        500: { description: 'Server error' }
      }
    },
    delete: {
      tags: ['Questions'],
      summary: 'Delete question (Admin/Teacher - ownership)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Question deleted successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Question not found' },
        500: { description: 'Server error' }
      }
    }
  }
};
