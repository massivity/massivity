This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🎨 Documentation Frontend (Next.js)

L’interface web cliente a été développée avec **Next.js 15**, **Tailwind CSS**, et suit une esthétique moderne, fluide et responsive.

### 📁 Pages disponibles

| URL               | Fichier                             | Description                                                |
|-------------------|-------------------------------------|------------------------------------------------------------|
| `/login`          | `src/app/login/page.js`             | Page de connexion avec envoi des identifiants via Axios.   |
| `/register`       | `src/app/register/page.js`          | Formulaire d’inscription avec tous les champs requis.      |
| `/changelog`      | `src/app/changelog/page.js`         | Affichage dynamique du journal des modifications (changelog). |

---

### 🔒 Authentification côté client

- Le token d’accès (`accessToken`) est stocké via `localStorage`.
- L’authentification se fait via un appel `POST /api/auth/login` avec `axios`.
- En cas de succès : redirection vers `/profil` (ou page protégée).

```js
const res = await api.post('/auth/login', { email, mot_de_passe });
localStorage.setItem('accessToken', res.data.accessToken);
router.push('/profil');
```

> La fonction `api` provient de `utils/api.js` et injecte automatiquement le token si présent.

---

### ✨ Design UI

- Utilisation de Tailwind CSS (`@tailwind base/components/utilities`)
- Arrière-plan en **dégradé violet-indigo**, cards `white` avec `rounded-2xl` et `shadow-xl`
- Focus visuel sur les champs de formulaire et transitions animées sur les boutons
- Liens entre pages via `next/link`

---

### 🧱 Structure du code (extrait)

```
src/
├── app/
│   ├── login/
│   │   └── page.js
│   ├── register/
│   │   └── page.js
│   └── changelog/
│       └── page.js
├── utils/
│   └── api.js  ← client Axios avec token
```