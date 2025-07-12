INSERT INTO changelogs (date, titre, description) VALUES
                                                      ('2025-07-11', 'CRUD complet agences de scrapping', 'Ajout des routes CRUD sécurisées pour gérer les agences de scrapping concurrentiel, activation/désactivation, suppression, modification.'),
                                                      ('2025-07-11', 'Import agences par Excel', 'Ajout d’une route pour importer massivement des agences de scrapping via un fichier Excel (.xlsx), avec détection et skip des doublons.'),
                                                      ('2025-07-11', 'Sécurisation des routes admin', 'Protection des routes critiques avec authentification JWT et contrôle strict du rôle admin.'),
                                                      ('2025-07-11', 'Documentation Swagger enrichie', 'Documentation OpenAPI 3 mise à jour : endpoints scrapping, sécurité, exemples, tags.'),
                                                      ('2025-07-11', 'Logs backend détaillés', 'Ajout de logs backend pour toutes les actions sur les agences : import, création, modification, suppression, activation, désactivation.'),
                                                      ('2025-07-11', 'Refonte documentation API', 'Ajout de toutes les nouvelles routes scrapping dans la doc API, et harmonisation des rôles/authentifications.');
