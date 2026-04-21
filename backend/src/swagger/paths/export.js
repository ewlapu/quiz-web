module.exports = {
  '/api/export/users.xlsx': {
    get: {
      tags: ['Export'],
      summary: 'Export users to Excel (Admin only)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Excel file',
          content: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
              schema: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/export/exams.xlsx': {
    get: {
      tags: ['Export'],
      summary: 'Export exams to Excel (Admin only)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Excel file',
          content: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
              schema: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/export/attempts.xlsx': {
    get: {
      tags: ['Export'],
      summary: 'Export attempts to Excel (Admin only)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Excel file',
          content: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
              schema: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  }
};
