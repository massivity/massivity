const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clients',
            version: '1.0.0',
            description: 'Documentation de l’API Clients avec authentification sécurisée',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            {
                name: 'Auth',
                description: 'Routes d’authentification (inscription, connexion)',
            },
            {
                name: 'Changelogs',
                description: 'Historique des modifications',
            },
            {
                name: 'Admin',
                description: 'Routes réservées aux administrateurs',
            },
        ],
        paths: {
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Inscription d’un nouvel utilisateur',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                example: {
                                    nom: 'Doe',
                                    prenom: 'John',
                                    email: 'john.doe@email.com',
                                    adresse: '123 rue Exemple',
                                    telephone: '0612345678',
                                    mot_de_passe: 'motdepasse123'
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Compte créé avec succès',
                        },
                        500: {
                            description: 'Erreur lors de l’inscription',
                        },
                    },
                },
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Connexion d’un utilisateur',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                example: {
                                    email: 'john.doe@email.com',
                                    mot_de_passe: 'motdepasse123'
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Connexion réussie avec token JWT',
                        },
                        401: {
                            description: 'Identifiants invalides',
                        },
                    },
                },
            },
            '/api/auth/logout': {
                post: {
                    tags: ['Auth'],
                    summary: 'Déconnexion',
                    description: 'Invalide le refresh token de l’utilisateur connecté.',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Déconnexion réussie',
                            content: {
                                'application/json': {
                                    example: { message: 'Déconnexion réussie 📴' },
                                },
                            },
                        },
                        401: {
                            description: 'Non authentifié',
                        },
                    },
                },
            },
            '/api/auth/account': {
                delete: {
                    tags: ['Auth'],
                    summary: 'Supprimer son compte',
                    description: 'Permet à l’utilisateur connecté de supprimer définitivement son compte.',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Compte supprimé avec succès',
                            content: {
                                'application/json': {
                                    example: { message: 'Compte supprimé 👋' },
                                },
                            },
                        },
                        401: {
                            description: 'Non authentifié',
                        },
                    },
                },
            },
            '/api/auth/refresh': {
                post: {
                    tags: ['Auth'],
                    summary: 'Rafraîchir le token',
                    description: 'Renvoie un nouveau token d’accès en échange d’un refresh token valide.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                example: {
                                    refreshToken: '{{refreshToken}}',
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Nouveau token généré avec succès',
                            content: {
                                'application/json': {
                                    example: { accessToken: 'new.jwt.token.here' },
                                },
                            },
                        },
                        401: {
                            description: 'Token invalide ou expiré',
                        },
                    },
                },
            },

            '/api/changelogs': {
                get: {
                    tags: ['Changelogs'],
                    summary: 'Liste des changelogs',
                    responses: {
                        200: {
                            description: 'Liste récupérée avec succès',
                        },
                        500: {
                            description: 'Erreur lors de la récupération',
                        },
                    },
                },
                post: {
                    tags: ['Changelogs'],
                    summary: 'Créer un nouveau changelog',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                example: {
                                    titre: 'Nouvelle fonctionnalité',
                                    description: 'Ajout de la route changelog',
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Changelog créé avec succès',
                        },
                        500: {
                            description: 'Erreur lors de la création',
                        },
                    },
                },
            },
            '/api/admin/dashboard': {
                get: {
                    tags: ['Admin'],
                    summary: 'Dashboard admin (accès restreint)',
                    description: 'Route réservée aux administrateurs.',
                    responses: {
                        200: {
                            description: 'Accès autorisé (admin)',
                            content: {
                                'application/json': {
                                    example: { message: 'Bienvenue dans le dashboard admin 🛠️' },
                                },
                            },
                        },
                        403: {
                            description: 'Accès interdit : rôle insuffisant',
                        },
                        401: {
                            description: 'Non authentifié',
                        },
                    },
                },
            },
        },
    },
    apis: [], // on n’utilise pas de JSDoc ici car tout est défini inline
};

const swaggerSpec = swaggerJSDoc(options);

function setupDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupDocs;
