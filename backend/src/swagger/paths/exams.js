module.exports = {
  '/api/exams': {
    get: {
      tags: ['Exams'],
      summary: 'Get exams (Admin/Teacher)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'subjectId', schema: { type: 'string' } },
        { in: 'query', name: 'isPublished', schema: { type: 'boolean' } },
        { in: 'query', name: 'createdBy', schema: { type: 'string' } },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
      ],
      responses: {
        200: { description: 'List of exams' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    },
    post: {
      tags: ['Exams'],
      summary: 'Create exam (Admin/Teacher)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'subjectId', 'questionIds', 'timeLimit'],
              properties: {
                title: { type: 'string' },
                subjectId: { type: 'string' },
                questionIds: { type: 'array', items: { type: 'string' } },
                timeLimit: { type: 'number' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Exam created successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/exams/{id}': {
    put: {
      tags: ['Exams'],
      summary: 'Update exam (Admin/Teacher - ownership)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Exam' }
          }
        }
      },
      responses: {
        200: { description: 'Exam updated successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Exam not found' },
        500: { description: 'Server error' }
      }
    },
    delete: {
      tags: ['Exams'],
      summary: 'Delete exam (Admin/Teacher - ownership)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Exam deleted successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Exam not found' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/exams/{id}/publish': {
    patch: {
      tags: ['Exams'],
      summary: 'Publish exam (Admin/Teacher - ownership)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Exam published successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Exam not found' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/exams/{id}/unpublish': {
    patch: {
      tags: ['Exams'],
      summary: 'Unpublish exam (Admin/Teacher - ownership)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Exam unpublished successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'Exam not found' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/exams/public': {
    get: {
      tags: ['Exams'],
      summary: 'Get published exams (All authenticated users)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'subjectId', schema: { type: 'string' } },
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
      ],
      responses: {
        200: { description: 'List of published exams' },
        401: { description: 'Not authenticated' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/exams/{id}/public': {
    get: {
      tags: ['Exams'],
      summary: 'Get published exam details with questions (All authenticated users)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Exam details with questions' },
        401: { description: 'Not authenticated' },
        403: { description: 'Exam is not published' },
        404: { description: 'Exam not found' },
        500: { description: 'Server error' }
      }
    }
  }
};
