INSERT INTO changelogs (date, titre, description) VALUES
                                                      ('2025-07-02', 'Ajout des rôles utilisateurs', 'Rajout des rôles admin et utilisateurs dans le backend.'),
                                                      ('2025-07-02', 'Gestion JWT et refresh token', 'Mise en place de l''authentification sécurisée avec accessToken et refreshToken.'),
                                                      ('2025-07-02', 'Déconnexion sécurisée', 'Le refreshToken est supprimé de la base à la déconnexion pour plus de sécurité.'),
                                                      ('2025-07-02', 'Route profil sécurisée', 'Ajout de la route /api/auth/profil qui retourne les infos utilisateur protégées par accessToken.'),
                                                      ('2025-07-02', 'Dashboard admin frontend', 'Mise en place d''un dashboard React Next.js pour les admins, avec menu latéral et gestion dynamique.'),
                                                      ('2025-07-02', 'Redirection selon le rôle', 'Le frontend redirige vers la page Dashboard (admin) ou Profil (user) en fonction du rôle.'),
                                                      ('2025-07-02', 'Protection responsive', 'Blocage de l''affichage du dashboard si la taille de l''écran est trop petite (MinimumScreenSize).'),
                                                      ('2025-07-02', 'Changelog dynamique', 'Affichage automatique de l''historique des changements (backend → frontend) sur la page dashboard.'),
                                                      ('2025-07-02', 'Standardisation des endpoints API', 'Tous les endpoints backend sont désormais accessibles via /api/... pour plus de clarté.'),
                                                      ('2025-07-02', 'Contrôle d''accès avancé', 'Le frontend vérifie le token et le rôle pour l''accès aux routes sensibles.');
