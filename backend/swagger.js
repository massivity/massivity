const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clients',
            version: '1.0.0',
            description: 'Documentation de l’API Clients avec authentification sécurisée (JWT), gestion du profil, dashboard admin, changelog, et plus.',
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
            { bearerAuth: [] }
        ],
        tags: [
            { name: 'Auth', description: 'Routes d’authentification (inscription, connexion, profil)' },
            { name: 'Changelogs', description: 'Historique des modifications' },
            { name: 'Admin', description: 'Fonctions avancées (dashboard, gestion utilisateurs, promotion)' },
            { name: 'Healthcheck', description: 'Vérification de l’état de l’API' }
        ],
        paths: {
            // ----------------- AUTH ---------------------
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
                        201: { description: 'Compte créé avec succès' },
                        500: { description: 'Erreur lors de l’inscription' },
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
                            description: 'Connexion réussie',
                            content: {
                                'application/json': {
                                    example: {
                                        accessToken: 'xxx.yyy.zzz',
                                        refreshToken: 'aaa.bbb.ccc',
                                        user: {
                                            id: 1,
                                            nom: 'Doe',
                                            prenom: 'John',
                                            email: 'john.doe@email.com',
                                            role: 'user'
                                        }
                                    }
                                }
                            }
                        },
                        401: { description: 'Identifiants invalides' },
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
                        401: { description: 'Non authentifié' },
                    },
                },
            },
            '/api/auth/profil': {
                get: {
                    tags: ['Auth'],
                    summary: 'Obtenir les infos du profil connecté',
                    description: 'Retourne les informations du client connecté',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Profil utilisateur',
                            content: {
                                'application/json': {
                                    example: {
                                        user: {
                                            id: 1,
                                            nom: 'Veeraragoo',
                                            prenom: 'Darren',
                                            email: 'd.veeraragoo@hotmail.com',
                                            role: 'admin'
                                        }
                                    },
                                },
                            },
                        },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Token invalide' },
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
                        401: { description: 'Non authentifié' },
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
                                    example: {
                                        accessToken: 'new.jwt.token.here',
                                        refreshToken: 'nouveau.refresh.token.here'
                                    },
                                },
                            },
                        },
                        401: { description: 'Token invalide ou expiré' },
                    },
                },
            },

            // ----------------- CHANGELOGS ---------------------
            '/api/changelogs': {
                get: {
                    tags: ['Changelogs'],
                    summary: 'Liste des changelogs',
                    responses: {
                        200: {
                            description: 'Liste récupérée avec succès',
                            content: {
                                'application/json': {
                                    example: [
                                        {
                                            id: 1,
                                            titre: 'Connexion sécurisée',
                                            description: 'Connexion stylée avec gestion du token',
                                            date: '2025-06-30T22:00:00.000Z'
                                        },
                                        {
                                            id: 2,
                                            titre: 'Initialisation du frontend',
                                            description: 'Base Next.js avec Tailwind',
                                            date: '2025-06-29T22:00:00.000Z'
                                        }
                                    ]
                                }
                            }
                        },
                        500: { description: 'Erreur lors de la récupération' },
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
                        201: { description: 'Changelog créé avec succès' },
                        500: { description: 'Erreur lors de la création' },
                    },
                },
            },

            // ----------------- ADMIN ---------------------
            '/api/admin/dashboard': {
                get: {
                    tags: ['Admin'],
                    summary: 'Dashboard admin (accès restreint)',
                    description: 'Route réservée aux administrateurs.',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Accès autorisé (admin)',
                            content: {
                                'application/json': {
                                    example: { message: 'Bienvenue dans le dashboard admin 🛠️' },
                                },
                            },
                        },
                        403: { description: 'Accès interdit : rôle insuffisant' },
                        401: { description: 'Non authentifié' },
                    },
                },
            },
            '/api/admin/users': {
                get: {
                    tags: ['Admin'],
                    summary: 'Liste tous les utilisateurs (admin uniquement)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Liste des utilisateurs',
                            content: {
                                'application/json': {
                                    example: {
                                        users: [
                                            {
                                                id: 1,
                                                nom: 'Veeraragoo',
                                                prenom: 'Darren',
                                                email: 'd.veeraragoo@hotmail.com',
                                                role: 'admin'
                                            },
                                            {
                                                id: 2,
                                                nom: 'Dupont',
                                                prenom: 'Jean',
                                                email: 'jean.dupont@email.com',
                                                role: 'user'
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        403: { description: 'Accès interdit : admin uniquement' },
                        401: { description: 'Non authentifié' }
                    }
                }
            },
            '/api/admin/promote/{userId}': {
                patch: {
                    tags: ['Admin'],
                    summary: 'Promouvoir ou rétrograder un utilisateur',
                    description: 'Permet à un admin de changer le rôle d’un utilisateur.',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'userId',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'ID de l’utilisateur à modifier'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                example: {
                                    role: 'admin'
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Rôle modifié',
                            content: {
                                'application/json': {
                                    example: { message: 'Rôle modifié avec succès' }
                                }
                            }
                        },
                        403: { description: 'Accès interdit : admin uniquement' },
                        401: { description: 'Non authentifié' }
                    }
                }
            },
            // ----------------- HEALTHCHECK ---------------------
            '/api/healthcheck': {
                get: {
                    tags: ['Healthcheck'],
                    summary: 'Vérifie si l’API est en ligne',
                    responses: {
                        200: {
                            description: 'API opérationnelle',
                            content: {
                                'application/json': {
                                    example: {
                                        status: 'ok',
                                        message: 'API opérationnelle ✅'
                                    },
                                },
                            },
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
