#!/bin/bash
echo "📦 Installation des dépendances..."

# Nettoyage
rm -rf node_modules package-lock.json

# Installation
npm install
npm install react-router-dom axios @stripe/stripe-js @stripe/react-stripe-js
npm install socket.io-client react-hot-toast zustand framer-motion
npm install @headlessui/react @heroicons/react
npm install -D tailwindcss postcss autoprefixer

# Initialisation
npx tailwindcss init -p

echo "✅ Installation terminée!"
