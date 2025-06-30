# 📘 Documentation Fonctionnelle – API Clients

## 1. 🔍 Présentation générale

Cette API permet de gérer la création de comptes clients avec authentification sécurisée via JWT.  
Elle est conçue pour être utilisée par une application front ou mobile dans un contexte de gestion de clients (inscription, connexion, accès aux infos perso).

- **Nom du projet** : API Clients Sécurisée
- **Stack** : Node.js, PostgreSQL, Docker, JWT, Flyway, Swagger
- **Public cible** : développeurs, PO, QA

---

## 2. 🧱 Architecture de l’API

- Architecture **RESTful**
- Authentification avec **JSON Web Token**
- Base de données PostgreSQL (2 environnements : dev et test)
- Gestion de schéma via **Flyway**
- Documentation interactive via **Swagger**

**Arborescence simplifiée** :
```
.
├── controllers/
├── routes/
├── middleware/
├── models/
├── migrations/
├── .env
├── index.js
├── swagger.js
└── docker-compose.yml
```

---

## 3. 👤 Fonctionnalités principales

| Fonction               | Méthode | URL                         | Authentification |
|------------------------|---------|------------------------------|------------------|
| Créer un compte        | POST    | /api/auth/register           | ❌                |
| Se connecter           | POST    | /api/auth/login              | ❌                |
| Rafraîchir le token    | POST    | /api/auth/refresh            | ❌                |
| Voir son profil        | GET     | /api/auth/profil             | ✅ `accessToken`  |

---

## 4. 🔐 Sécurité & Authentification

- JWT signé avec `JWT_SECRET`
- `accessToken` (valide 15 min)
- `refreshToken` (valide 7 jours, stocké en base)
- Vérification par middleware `verifyToken`
- Gestion des statuts : 401 (non authentifié), 403 (token invalide)

---

## 5. 🧪 Environnements

- **Développement** :
  - Base : `monapiclient` (port 5432)
  - Docker service : `db`

- **Test** :
  - Base : `monapiclient_test` (port 5433)
  - Docker service : `db_test`
  - Flyway synchronisé avec les mêmes migrations

- Variable : `NODE_ENV=test` → bascule automatique vers `DB_URL_TEST`

---

## 6. 📚 Documentation Swagger

- Accessible sur : `http://localhost:3000/api-docs`
- Généree automatiquement avec `swagger-jsdoc`
- Annotations présentes dans `routes/*.js`

---

## 7. 🔧 Prochaines évolutions possibles

- Gestion des rôles (admin/client)
- Route de déconnexion
- Suppression de compte
- Tests automatisés (Jest + Supertest)
- CI/CD avec GitHub Actions
- Déploiement cloud (Railway, Render...)

---

## 8. ▶️ Lancer le projet (rappel)

```bash
docker compose up --build
```

Puis accéder à l'API et à la doc sur :
- `http://localhost:3000/api/auth/register`
- `http://localhost:3000/api-docs`
