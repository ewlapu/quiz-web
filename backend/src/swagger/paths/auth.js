module.exports = {
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
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
                password: { type: 'string', minLength: 6 }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  token: { type: 'string' },
                  user: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        },
        400: { description: 'Validation error or email already exists' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  token: { type: 'string' },
                  user: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        },
        401: { description: 'Invalid credentials' },
        403: { description: 'Account is locked' },
        500: { description: 'Server error' }
      }
    }
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get current user profile',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User profile',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        },
        401: { description: 'Not authenticated' },
        500: { description: 'Server error' }
      }
    },
    put: {
      tags: ['Auth'],
      summary: 'Update current user profile',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Profile updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  user: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        },
        400: { description: 'Validation error' },
        401: { description: 'Not authenticated' },
        500: { description: 'Server error' }
      }
    }
  }
};
