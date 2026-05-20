#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Déploiement Danni'Shawarma sur VPS OVH${NC}"

if [ ! -f .env ]; then
    echo -e "${RED}❌ Fichier .env manquant.${NC}"
    echo -e "${YELLOW}   cp .env.example .env && nano .env${NC}"
    exit 1
fi

# shellcheck disable=SC1091
source .env

if [ "$POSTGRES_PASSWORD" = "CHANGE_ME_postgres_password" ] || [ "$JWT_SECRET" = "CHANGE_ME_jwt_secret_long_random" ]; then
    echo -e "${RED}❌ Modifiez POSTGRES_PASSWORD et JWT_SECRET dans .env${NC}"
    exit 1
fi

if docker compose version &> /dev/null; then
    DC="docker compose"
elif command -v docker-compose &> /dev/null; then
    DC="docker-compose"
else
    echo -e "${RED}❌ Docker Compose V2 requis (docker compose)${NC}"
    exit 1
fi

echo -e "${YELLOW}🛑 Arrêt des anciens conteneurs...${NC}"
$DC -f docker-compose.ovh.yml --env-file .env down 2>/dev/null || true

echo -e "${GREEN}🐳 Build et démarrage...${NC}"
$DC -f docker-compose.ovh.yml --env-file .env up -d --build

echo -e "${YELLOW}⏳ Attente des services (15s)...${NC}"
sleep 15

echo -e "${GREEN}✅ Conteneurs :${NC}"
docker ps --filter "name=shawarma"

if curl -sf http://127.0.0.1:8080/ >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend répond sur http://127.0.0.1:8080${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend pas encore prêt — vérifiez : docker logs shawarma-frontend${NC}"
fi

if curl -sf http://127.0.0.1:8080/api/products >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API /api/products OK${NC}"
else
    echo -e "${YELLOW}⚠️  API — vérifiez : docker logs shawarma-backend${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Docker est lancé.${NC}"
echo -e "   Site local (sur le VPS) : http://127.0.0.1:8080"
echo -e "   Prochaine étape : Nginx + SSL (voir DEPLOY-OVH.md)"
echo -e "   FRONTEND_URL dans .env : ${FRONTEND_URL:-non défini}"
