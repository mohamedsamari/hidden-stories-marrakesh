import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hidden Stories of Marrakesh API',
      version: '1.0.0',
      description:
        "API du backend de Hidden Stories of Marrakesh. Les routes publiques (sans préfixe /admin) sont consommées par l'application mobile et ne nécessitent aucune authentification. Les routes sous /admin nécessitent un token Kinde valide (Authorization: Bearer <token>).",
    },
    servers: [{ url: 'http://localhost:3000', description: 'Serveur de développement local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT émis par Kinde. Requis pour toutes les routes /admin/*.',
        },
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
          description: 'Numéro de page (commence à 1).',
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10 },
          description: "Nombre d'éléments par page.",
        },
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'Identifiant UUID de la ressource.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Une erreur est survenue.' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Données invalides.' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'string', example: 'titleFr' },
                  message: { type: 'string', example: 'Invalid input: expected string, received undefined' },
                },
              },
            },
          },
        },

        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nameEn: { type: 'string', example: 'Palace' },
            nameFr: { type: 'string', example: 'Palais' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CategoryInput: {
          type: 'object',
          required: ['nameEn', 'nameFr'],
          properties: {
            nameEn: { type: 'string', maxLength: 100, example: 'Palace' },
            nameFr: { type: 'string', maxLength: 100, example: 'Palais' },
          },
        },

        HistoricalPeriod: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nameEn: { type: 'string', example: 'Almohad period' },
            nameFr: { type: 'string', example: 'Période almohade' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        HistoricalPeriodInput: {
          type: 'object',
          required: ['nameEn', 'nameFr'],
          properties: {
            nameEn: { type: 'string', maxLength: 100 },
            nameFr: { type: 'string', maxLength: 100 },
          },
        },

        Dynasty: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nameEn: { type: 'string', example: 'Almoravid dynasty' },
            nameFr: { type: 'string', example: 'Dynastie almoravide' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        DynastyInput: {
          type: 'object',
          required: ['nameEn', 'nameFr'],
          properties: {
            nameEn: { type: 'string', maxLength: 100 },
            nameFr: { type: 'string', maxLength: 100 },
          },
        },

        Location: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nameEn: { type: 'string' },
            nameFr: { type: 'string' },
            descriptionEn: { type: 'string', nullable: true },
            descriptionFr: { type: 'string', nullable: true },
            addressEn: { type: 'string', nullable: true },
            addressFr: { type: 'string', nullable: true },
            latitude: { type: 'number', format: 'double', example: 31.6295 },
            longitude: { type: 'number', format: 'double', example: -7.9811 },
            categoryId: { type: 'string', format: 'uuid', nullable: true },
            openingHours: {
              type: 'object',
              nullable: true,
              description: 'One entry per weekday; null means closed that day.',
              additionalProperties: {
                type: 'object',
                nullable: true,
                properties: {
                  open: { type: 'string', example: '09:00' },
                  close: { type: 'string', example: '17:00' },
                },
              },
            },
            isFreeEntry: { type: 'boolean' },
            entryPriceLabel: { type: 'string', nullable: true, example: '100 DH (30 DH résidents)' },
            planImageUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LocationInput: {
          type: 'object',
          required: ['nameEn', 'nameFr', 'latitude', 'longitude'],
          properties: {
            nameEn: { type: 'string', maxLength: 100 },
            nameFr: { type: 'string', maxLength: 100 },
            descriptionEn: { type: 'string', maxLength: 1000 },
            descriptionFr: { type: 'string', maxLength: 1000 },
            addressEn: { type: 'string', maxLength: 200 },
            addressFr: { type: 'string', maxLength: 200 },
            latitude: { type: 'number', minimum: -90, maximum: 90 },
            longitude: { type: 'number', minimum: -180, maximum: 180 },
            categoryId: { type: 'string', format: 'uuid' },
            openingHours: { type: 'object', nullable: true },
            isFreeEntry: { type: 'boolean' },
            entryPriceLabel: { type: 'string', maxLength: 50 },
            planImageUrl: { type: 'string', maxLength: 500 },
          },
        },
        LocationPlanPoint: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            locationId: { type: 'string', format: 'uuid' },
            xPercent: { type: 'number', format: 'double', example: 42 },
            yPercent: { type: 'number', format: 'double', example: 29 },
            labelEn: { type: 'string' },
            labelFr: { type: 'string' },
            descriptionEn: { type: 'string', nullable: true },
            descriptionFr: { type: 'string', nullable: true },
            position: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        Story: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titleEn: { type: 'string' },
            titleFr: { type: 'string' },
            shortDescriptionEn: { type: 'string' },
            shortDescriptionFr: { type: 'string' },
            fullStoryEn: { type: 'string' },
            fullStoryFr: { type: 'string' },
            coverImageUrl: { type: 'string' },
            audioUrlEn: { type: 'string', nullable: true },
            audioUrlFr: { type: 'string', nullable: true },
            century: { type: 'integer', nullable: true, example: 12 },
            categoryId: { type: 'string', format: 'uuid' },
            locationId: { type: 'string', format: 'uuid' },
            historicalPeriodId: { type: 'string', format: 'uuid', nullable: true },
            dynastyId: { type: 'string', format: 'uuid', nullable: true },
            isPublished: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        StoryInput: {
          type: 'object',
          required: [
            'titleEn', 'titleFr', 'shortDescriptionEn', 'shortDescriptionFr',
            'fullStoryEn', 'fullStoryFr', 'coverImageUrl', 'categoryId', 'locationId',
          ],
          properties: {
            titleEn: { type: 'string', maxLength: 200 },
            titleFr: { type: 'string', maxLength: 200 },
            shortDescriptionEn: { type: 'string', maxLength: 300 },
            shortDescriptionFr: { type: 'string', maxLength: 300 },
            fullStoryEn: { type: 'string' },
            fullStoryFr: { type: 'string' },
            coverImageUrl: { type: 'string', maxLength: 500 },
            audioUrlEn: { type: 'string', maxLength: 500 },
            audioUrlFr: { type: 'string', maxLength: 500 },
            century: { type: 'integer' },
            categoryId: { type: 'string', format: 'uuid' },
            locationId: { type: 'string', format: 'uuid' },
            historicalPeriodId: { type: 'string', format: 'uuid' },
            dynastyId: { type: 'string', format: 'uuid' },
            isPublished: { type: 'boolean', default: false },
          },
        },
        StoryUpdateInput: {
          type: 'object',
          description: 'Comme StoryInput, mais tous les champs sont optionnels (au moins un requis).',
        },

        StoryImage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            storyId: { type: 'string', format: 'uuid' },
            imageUrl: { type: 'string' },
            altTextEn: { type: 'string', nullable: true },
            altTextFr: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        StoryImageInput: {
          type: 'object',
          required: ['storyId', 'imageUrl'],
          properties: {
            storyId: { type: 'string', format: 'uuid' },
            imageUrl: { type: 'string', maxLength: 500 },
            altTextEn: { type: 'string', maxLength: 200 },
            altTextFr: { type: 'string', maxLength: 200 },
          },
        },

        StoryReference: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            storyId: { type: 'string', format: 'uuid' },
            label: { type: 'string' },
            url: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        LocationImage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            locationId: { type: 'string', format: 'uuid' },
            imageUrl: { type: 'string' },
            altTextEn: { type: 'string', nullable: true },
            altTextFr: { type: 'string', nullable: true },
            isCover: { type: 'boolean' },
            position: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LocationImageInput: {
          type: 'object',
          required: ['locationId', 'imageUrl'],
          properties: {
            locationId: { type: 'string', format: 'uuid' },
            imageUrl: { type: 'string', maxLength: 500 },
            altTextEn: { type: 'string', maxLength: 200 },
            altTextFr: { type: 'string', maxLength: 200 },
            position: { type: 'integer', minimum: 0 },
          },
        },

        UploadResponse: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              example: 'http://localhost:3000/uploads/36691c7b-5622-4caf-8438-63dd4bbac16b.png',
            },
          },
        },
      },
    },
    security: [],
  },
  // glob patterns require forward slashes even on Windows, where path.join
  // would otherwise produce backslashes and silently match zero files.
  apis: [path.join(__dirname, '../routes/*.{ts,js}').replace(/\\/g, '/')],
};

export const swaggerSpec = swaggerJsdoc(options);
