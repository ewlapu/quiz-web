module.exports = {
  '/api/subjects': {
    get: {
      tags: ['Subjects'],
      summary: 'Get all subjects',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of subjects',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  subjects: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Subject' }
                  }
                }
              }
            }
          }
        },
        401: { description: 'Not authenticated' },
        500: { description: 'Server error' }
      }
    },
    post: {
      tags: ['Subjects'],
      summary: 'Create subject (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string', enum: ['active', 'inactive'] }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Subject created successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/subjects/{id}': {
    put: {
      tags: ['Subjects'],
      summary: 'Update subject (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string', enum: ['active', 'inactive'] }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Subject updated successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Subject not found' },
        500: { description: 'Server error' }
      }
    },
    delete: {
      tags: ['Subjects'],
      summary: 'Delete subject (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Subject deleted successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Subject not found' },
        500: { description: 'Server error' }
      }
    }
  }
};
