# Déployer Danni'Shawarma sur un VPS OVH

Guide pas à pas pour Ubuntu 22.04 / 24.04 sur VPS OVH.

---

## 1. Commander le VPS OVH

1. [ovh.com](https://www.ovhcloud.com/fr/vps/) → **VPS**
2. Offre conseillée : **VPS Starter** ou **VPS Value** (2 Go RAM minimum)
3. OS : **Ubuntu 24.04**
4. Notez l’**IP publique** et le **mot de passe root** (email OVH)

---

## 2. Pointer le domaine (optionnel mais recommandé)

Dans la zone DNS OVH (ou votre registrar) :

| Type | Nom | Cible |
|------|-----|--------|
| A | `@` | IP du VPS |
| A | `www` | IP du VPS |

Propagation : 5 min à 24 h.

Sans domaine : utilisez `http://IP_DU_VPS` (sans HTTPS simple).

---

## 3. Se connecter au VPS

Depuis **Ubuntu WSL** sur votre PC :

```bash
ssh root@IP_DU_VPS
```

Première connexion : changez le mot de passe root si demandé.

Créer un utilisateur (recommandé) :

```bash
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Puis : `ssh deploy@IP_DU_VPS`

---

## 4. Installer Docker sur le VPS

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git ufw

# Docker officiel
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

docker compose version
```

---

## 5. Pare-feu (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Ne ouvrez **pas** les ports 5000 ni 5432 (API et Postgres restent internes).

---

## 6. Cloner le projet

```bash
cd ~
git clone https://github.com/VOTRE_USERNAME/shawarma-fixed.git
cd shawarma-fixed
```

Remplacez `VOTRE_USERNAME` par votre compte GitHub.

---

## 7. Configurer les secrets

```bash
cp .env.example .env
nano .env
```

Exemple :

```env
POSTGRES_PASSWORD=MonMotDePasseFort2026!
JWT_SECRET=une_cle_secrete_tres_longue_et_aleatoire
FRONTEND_URL=https://danni-shawarma.fr
DOMAIN=danni-shawarma.fr
```

Enregistrer : `Ctrl+O`, `Entrée`, `Ctrl+X`.

---

## 8. Lancer l’application

```bash
chmod +x deploy-ovh.sh
./deploy-ovh.sh
```

Vérification sur le VPS :

```bash
curl -I http://127.0.0.1:8080
docker logs shawarma-backend --tail 20
```

---

## 9. Nginx + HTTPS (Let’s Encrypt)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Remplacer votredomaine.com par votre DOMAIN
sudo cp deploy/nginx-ovh.conf /etc/nginx/sites-available/danni-shawarma
sudo sed -i "s/votredomaine.com/VOTRE_DOMAINE/g" /etc/nginx/sites-available/danni-shawarma

sudo ln -sf /etc/nginx/sites-available/danni-shawarma /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Certificat SSL gratuit
sudo certbot --nginx -d VOTRE_DOMAINE -d www.VOTRE_DOMAINE
```

Suivre les questions Certbot (email, accepter les CGU).

Site en ligne : **https://VOTRE_DOMAINE**

---

## 10. Mises à jour après modification du code

Sur le VPS :

```bash
cd ~/shawarma-fixed
git pull
./deploy-ovh.sh
```

---

## Commandes utiles

| Action | Commande |
|--------|----------|
| Voir les logs backend | `docker logs -f shawarma-backend` |
| Voir les logs frontend | `docker logs -f shawarma-frontend` |
| Arrêter tout | `docker compose -f docker-compose.ovh.yml down` |
| Redémarrer | `./deploy-ovh.sh` |
| Espace disque | `docker system df` |

---

## Dépannage

**Site inaccessible**
- `docker ps` → les 3 conteneurs doivent être `Up`
- `curl http://127.0.0.1:8080` sur le VPS
- `sudo nginx -t`
- DNS : `ping VOTRE_DOMAINE` doit renvoyer l’IP du VPS

**Erreur CORS / connexion**
- `FRONTEND_URL` dans `.env` = URL exacte du site (`https://...`)
- Puis : `./deploy-ovh.sh`

**Menu vide**
- `docker logs shawarma-backend` → chercher « Base de données initialisée »

---

## Coût indicatif OVH

- VPS Starter : ~3–5 €/mois
- Domaine .fr : ~7 €/an (optionnel)
- Pas de limite de crédit comme Railway

---

## Architecture sur le VPS

```
Internet → Nginx (80/443) → 127.0.0.1:8080 (frontend Docker)
                                    ↓ proxy /api
                              backend Docker :5000
                                    ↓
                              postgres Docker (interne)
```
