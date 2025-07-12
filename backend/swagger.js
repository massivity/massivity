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
            { name: 'Healthcheck', description: 'Vérification de l’état de l’API' },
            { name: 'Scrapping', description: 'Gestion des agences pour le scrapping concurrentiel (admin)' }
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
            // ----------------- SCRAPPING AGENCIES ---------------------
            '/api/scrapping/agencies': {
                get: {
                    tags: ['Scrapping'],
                    summary: 'Liste les agences de scrapping',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'concurrent',
                            in: 'query',
                            description: 'Filtrer par concurrent (Avis, Europcar, etc.)',
                            required: false,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Liste récupérée avec succès',
                            content: {
                                'application/json': {
                                    example: [
                                        {
                                            id: 1,
                                            concurrent: 'Avis',
                                            ville: 'Paris',
                                            agence: 'Paris Gare de Lyon',
                                            active: true,
                                            meta: null,
                                            created_at: '2025-07-10T22:00:00.000Z',
                                            updated_at: '2025-07-10T22:00:00.000Z'
                                        }
                                    ]
                                }
                            }
                        },
                        401: { description: 'Non authentifié' },
                    }
                },
                post: {
                    tags: ['Scrapping'],
                    summary: 'Créer une agence de scrapping (admin uniquement)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                example: {
                                    concurrent: 'Avis',
                                    ville: 'Nantes',
                                    agence: 'Nantes Gare Nord',
                                    meta: { note: 'Point relais' }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Agence créée',
                            content: { 'application/json': { example: { /*...agence...*/ } } }
                        },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Accès interdit : admin uniquement' },
                        409: { description: 'Agence déjà existante' }
                    }
                }
            },
            '/api/scrapping/agencies/import': {
                post: {
                    tags: ['Scrapping'],
                    summary: 'Importer des agences depuis un fichier Excel (.xlsx) (admin uniquement)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        file: {
                                            type: 'string',
                                            format: 'binary',
                                            description: 'Fichier .xlsx à importer'
                                        },
                                        concurrent: {
                                            type: 'string',
                                            description: 'Nom du concurrent à affecter à toutes les agences importées'
                                        }
                                    },
                                    required: ['file', 'concurrent']
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Import réalisé',
                            content: {
                                'application/json': {
                                    example: { imported: 35, skipped: 1, total: 36 }
                                }
                            }
                        },
                        400: { description: 'Concurrent manquant' },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Accès interdit : admin uniquement' }
                    }
                }
            },
            '/api/scrapping/agencies/{id}': {
                patch: {
                    tags: ['Scrapping'],
                    summary: 'Modifier une agence (admin uniquement)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'ID de l’agence à modifier'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                example: {
                                    ville: 'Nantes',
                                    agence: 'Nantes Centre',
                                    meta: { note: 'Maj nom' }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Agence modifiée', content: { 'application/json': { example: { /*...agence...*/ } } } },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Accès interdit : admin uniquement' },
                        404: { description: 'Agence non trouvée' }
                    }
                },
                delete: {
                    tags: ['Scrapping'],
                    summary: 'Supprimer une agence (admin uniquement)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'ID de l’agence à supprimer'
                        }
                    ],
                    responses: {
                        204: { description: 'Agence supprimée' },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Accès interdit : admin uniquement' },
                        404: { description: 'Agence non trouvée' }
                    }
                }
            },
            '/api/scrapping/agencies/{id}/activate': {
                patch: {
                    tags: ['Scrapping'],
                    summary: 'Activer ou désactiver une agence (admin uniquement)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'ID de l’agence à activer/désactiver'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Agence activée/désactivée',
                            content: { 'application/json': { example: { /*...agence...*/ } } }
                        },
                        401: { description: 'Non authentifié' },
                        403: { description: 'Accès interdit : admin uniquement' },
                        404: { description: 'Agence non trouvée' }
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
