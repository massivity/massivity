#!/bin/bash

# Couleurs pour un peu de fun 🌈
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Lancement du backend...${NC}"
cd backend
yarn dev &

echo -e "${GREEN}🧼 Retour au dossier parent...${NC}"
cd ..

echo -e "${GREEN}🎨 Lancement du frontend...${NC}"
cd frontend
yarn dev
