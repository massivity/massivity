# 📘 Documentation API Fonctionnelle

Cette API permet la gestion d’un système de comptes clients avec authentification sécurisée (JWT), historique des mises à jour (changelog), et rôles utilisateur (`user`, `admin`).

## 1. Authentification et Autorisation

- Authentification par JWT
- Rafraîchissement de token via refreshToken
- Middleware `verifyToken`
- Middleware `authorizeRole('admin')` pour les routes restreintes

## 2. Rôles disponibles

| Rôle   | Description                      |
|--------|----------------------------------|
| user   | Rôle par défaut à l’inscription |
| admin  | Droits avancés (dashboard, etc.)|

## 3. Routes disponibles

| Fonction                    | Méthode | URL                          | Authentification          |
|-----------------------------|---------|-------------------------------|---------------------------|
| S’inscrire                  | POST    | /api/auth/register            | ❌                         |
| Se connecter                | POST    | /api/auth/login               | ❌                         |
| Rafraîchir le token         | POST    | /api/auth/refresh             | ❌ (via refreshToken)      |
| Obtenir son profil          | GET     | /api/auth/profil              | ✅ `accessToken`           |
| Se déconnecter              | POST    | /api/auth/logout              | ✅ `accessToken`           |
| Supprimer son compte        | DELETE  | /api/auth/account             | ✅ `accessToken`           |
| Voir le changelog           | GET     | /api/changelogs               | ❌                         |
| Ajouter un changelog        | POST    | /api/changelogs               | ❌ *(à sécuriser si besoin)*|
| Dashboard Admin             | GET     | /api/admin/dashboard          | ✅ `accessToken` + rôle `admin` |
| Promouvoir un utilisateur   | PATCH   | /api/admin/promote/:userId    | ✅ `accessToken` + rôle `admin` |

## 4. Exemple : Dashboard admin

### 🛠️ `GET /api/admin/dashboard`

- **Auth requise** : Oui (JWT + rôle admin)
- **Réponse (200)** :
```json
{
  "message": "Bienvenue dans le dashboard admin 🛠️"
}
```

- **Réponse (403)** :
```json
{
  "error": "Accès interdit : rôle insuffisant"
}
```

## 5. Rafraîchissement du token

### `POST /api/auth/refresh`

Permet de récupérer un nouveau `accessToken` à partir d’un `refreshToken` stocké côté client.

Exemple de payload :
```json
{
  "refreshToken": "xxx.yyy.zzz"
}
```

## 6. Structure des tokens

- **accessToken** : expire rapidement (ex : 15 min)
- **refreshToken** : stocké côté client, renouvelable

## 7. Swagger

La documentation Swagger est disponible sur :  
**http://localhost:3000/api-docs**

## 8. Changelog API

Disponible via :  
**GET /api/changelogs**

---

👍 *Dernière mise à jour : ajout du système de rôles, route admin, et sécurisation du logout/suppression/refresh*