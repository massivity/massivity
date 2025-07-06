🐳 Commandes Docker pour ton projet (frontend + backend)
📦 1. Construire les images
bash
Copier
Modifier
# Depuis la racine (avec un Dockerfile dans chaque dossier)
docker build -t mon-backend ./backend
docker build -t mon-frontend ./frontend
🚀 2. Lancer les conteneurs
bash
Copier
Modifier
# Lancer le backend
docker run -d -p 3000:3000 --name backend-container mon-backend

# Lancer le frontend (ex: React/Next/Vite)
docker run -d -p 3001:3000 --name frontend-container mon-frontend
⚠️ Adapte les ports si ton frontend écoute sur 5173, 3001, etc.

🧼 3. Arrêter les conteneurs
bash
Copier
Modifier
docker stop backend-container
docker stop frontend-container
🔄 4. Rebuilder une image après modif
bash
Copier
Modifier
docker build -t mon-backend ./backend --no-cache
🗑️ 5. Supprimer un conteneur et une image
bash
Copier
Modifier
docker rm backend-container
docker rmi mon-backend
🕵️‍♂️ 6. Voir ce qui tourne
bash
Copier
Modifier
docker ps            # conteneurs actifs
docker ps -a         # tous les conteneurs (y compris arrêtés)
docker images        # toutes les images
🧪 7. Tester en interactif
bash
Copier
Modifier
docker exec -it backend-container sh     # ou bash si dispo
💡 Bonus : Docker Compose (optionnel)
Si tu veux gérer les deux en même temps (backend + frontend + db), crée un docker-compose.yml et utilise :

bash
Copier
Modifier
docker-compose up --build
et

bash
Copier
Modifier
docker-compose down