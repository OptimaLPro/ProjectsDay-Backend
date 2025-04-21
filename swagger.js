import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProjectsDay Backend API',
      version: '1.0.0',
      description: 'API documentation for ProjectsDay Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Project: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The project ID'
            },
            title: {
              type: 'string',
              description: 'The project title'
            },
            description: {
              type: 'string',
              description: 'The project description'
            },
            image: {
              type: 'string',
              description: 'URL to the project image'
            },
            gallery: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of gallery image URLs'
            },
            assignedTo: {
              type: 'string',
              description: 'ID of the user assigned to the project'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Project creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Project last update timestamp'
            }
          }
        },
        Instructor: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The instructor ID'
            },
            name: {
              type: 'string',
              description: 'The instructor name'
            },
            image: {
              type: 'string',
              description: 'URL to the instructor image'
            },
            description: {
              type: 'string',
              description: 'The instructor description'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Instructor creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Instructor last update timestamp'
            }
          }
        },
        Internship: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The internship ID'
            },
            title: {
              type: 'string',
              description: 'The internship title'
            },
            company: {
              type: 'string',
              description: 'The company name'
            },
            description: {
              type: 'string',
              description: 'The internship description'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Internship start date'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Internship end date'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Internship creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Internship last update timestamp'
            }
          }
        },
        Yearbook: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The yearbook ID'
            },
            year: {
              type: 'string',
              description: 'The yearbook year'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether this yearbook is currently active'
            },
            description: {
              type: 'string',
              description: 'The yearbook description'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Yearbook creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Yearbook last update timestamp'
            }
          }
        },
        Award: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The award ID'
            },
            title: {
              type: 'string',
              description: 'The award title'
            },
            description: {
              type: 'string',
              description: 'The award description'
            },
            image: {
              type: 'string',
              description: 'URL to the award image'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Award creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Award last update timestamp'
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}; 