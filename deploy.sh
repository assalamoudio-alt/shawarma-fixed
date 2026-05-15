#!/bin/bash

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Démarrage du déploiement Shawarma App${NC}"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé${NC}"
    exit 1
fi

# Arrêter les conteneurs existants
echo -e "${YELLOW}🛑 Arrêt des conteneurs existants...${NC}"
docker-compose down

# Build et démarrage
echo -e "${GREEN}🐳 Build des images Docker...${NC}"
docker-compose build

echo -e "${GREEN}🚀 Démarrage des conteneurs...${NC}"
docker-compose up -d

# Attendre que les services soient prêts
echo -e "${YELLOW}⏳ Attente du démarrage des services...${NC}"
sleep 10

# Vérification
echo -e "${GREEN}✅ Vérification des conteneurs...${NC}"
docker ps

echo -e "${GREEN}"
echo "🎉 Déploiement terminé avec succès !"
echo "📱 Application disponible sur: http://localhost"
echo "🔧 Backend API: http://localhost:5000"
echo "❤️ Health check: http://localhost:5000/health"
echo -e "${NC}"
