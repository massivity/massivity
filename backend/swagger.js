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
            '/api/admin/import-avis': {
                post: {
                    tags: ['Admin'],
                    summary: 'Importer les fichiers AVIS (.xlsx)',
                    description: 'Déclenche l’importation des fichiers Excel AVIS depuis le dossier `/data/avis`. Seules les lignes non présentes en base sont insérées.',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Importation terminée',
                            content: {
                                'application/json': {
                                    example: {
                                        message: 'Importation AVIS terminée ✅'
                                    }
                                }
                            }
                        },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Accès interdit : admin uniquement' },
                        500: { description: 'Erreur lors de l’import' }
                    }
                }
            },
            '/api/admin/avis': {
                get: {
                    tags: ['Admin'],
                    summary: 'Lister les locations AVIS',
                    description: 'Liste paginée des locations AVIS avec filtres optionnels.',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'ville',
                            in: 'query',
                            description: 'Filtrer par ville',
                            required: false,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'modele',
                            in: 'query',
                            description: 'Filtrer par modèle de véhicule',
                            required: false,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'agence',
                            in: 'query',
                            description: 'Filtrer par nom de l’agence',
                            required: false,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'date',
                            in: 'query',
                            description: 'Filtrer par date (format YYYY-MM-DD)',
                            required: false,
                            schema: { type: 'string', format: 'date' }
                        },
                        {
                            name: 'limit',
                            in: 'query',
                            description: 'Nombre de résultats à retourner',
                            required: false,
                            schema: { type: 'integer', default: 50 }
                        },
                        {
                            name: 'offset',
                            in: 'query',
                            description: 'Décalage de pagination',
                            required: false,
                            schema: { type: 'integer', default: 0 }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Liste des données AVIS',
                            content: {
                                'application/json': {
                                    example: {
                                        count: 2,
                                        data: [
                                            {
                                                id: 101,
                                                pays: 'France',
                                                ville: 'Paris',
                                                agence: 'Paris Gare de Lyon',
                                                modele: 'Peugeot 208',
                                                categorie: 'Citadine',
                                                prix: 57.99,
                                                date_location: '2025-08-27'
                                            },
                                            {
                                                id: 102,
                                                pays: 'France',
                                                ville: 'Lyon',
                                                agence: 'Lyon Part-Dieu',
                                                modele: 'Clio',
                                                categorie: 'Citadine',
                                                prix: 63.50,
                                                date_location: '2025-08-28'
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Accès interdit : admin uniquement' }
                    }
                }
            },

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
    apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

function setupDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupDocs;
