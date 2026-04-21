module.exports = {
  '/api/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'role', schema: { type: 'string', enum: ['admin', 'teacher', 'user'] } },
        { in: 'query', name: 'status', schema: { type: 'string', enum: ['active', 'locked'] } },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
      ],
      responses: {
        200: { description: 'List of users' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    },
    post: {
      tags: ['Users'],
      summary: 'Create new user (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['fullName', 'email', 'password'],
              properties: {
                fullName: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 },
                role: { type: 'string', enum: ['admin', 'teacher', 'user'] }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'User created successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/users/{id}': {
    put: {
      tags: ['Users'],
      summary: 'Update user (Admin only)',
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
                fullName: { type: 'string' },
                role: { type: 'string', enum: ['admin', 'teacher', 'user'] }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'User updated successfully' },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'User not found' },
        500: { description: 'Server error' }
      }
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete user (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'User deleted successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'User not found' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/users/{id}/lock': {
    patch: {
      tags: ['Users'],
      summary: 'Lock user (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'User locked successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'User not found' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/users/{id}/unlock': {
    patch: {
      tags: ['Users'],
      summary: 'Unlock user (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'User unlocked successfully' },
        401: { description: 'Not authenticated' },
        403: { description: 'Access denied' },
        404: { description: 'User not found' },
        500: { description: 'Server error' }
      }
    }
  }
};
