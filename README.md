# 🚀 JDOM2 - Jeux de Données Ouverts du Mali

Plateforme de gestion de données ouvertes pour le Mali. Application frontend-only avec architecture moderne et optimisée.

## ✨ Stack Technologique

L'application utilise:

### 🎯 Framework Principal
- **⚡ Next.js 15** - Framework React avec App Router
- **📘 TypeScript 5** - JavaScript typé pour une meilleure expérience développeur
- **🎨 Tailwind CSS 4** - Framework CSS utility-first

### 🧩 Composants UI
- **🧩 shadcn/ui** - Composants accessibles basés sur Radix UI
- **🎯 Lucide React** - Bibliothèque d'icônes
- **📋 React Hook Form** - Formulaires performants
- **✅ Zod** - Validation de schémas TypeScript-first

### 🔄 Gestion d'État
- **🐻 Zustand** - State management simple et scalable
- **💾 Mock Data** - Gestion de données frontend-only avec localStorage
- **🔐 Mock Authentication** - Système d'authentification côté client

### 📊 Visualisation
- **📊 Recharts** - Bibliothèque de graphiques React

## 🎯 Caractéristiques

- **🏗️ Architecture Moderne** - Structure layered avec séparation des responsabilités
- **🎨 UI Moderne** - Composants shadcn/ui avec interactions avancées
- **🔒 Type Safety** - TypeScript strict avec validation Zod
- **📱 Responsive** - Design mobile-first
- **💾 Mock Data** - Gestion de données frontend-only avec localStorage
- **🔐 Authentification Mock** - Système d'authentification côté client
- **📊 Visualisation** - Graphiques et tableaux interactifs
- **🚀 Production Ready** - Build optimisé et prêt pour le déploiement
- **🧩 Maintenable** - Code organisé et documenté

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Lancer le serveur de production
npm start
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## 📁 Structure du Projet

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour une description détaillée de l'architecture.

## 🏗️ Architecture

L'application suit une architecture layered avec:

- **Pages**: Composants minces qui orchestrent les vues
- **Composants**: UI réutilisable et composable
- **Hooks**: Logique métier réutilisable
- **Stores**: État global avec Zustand
- **Services**: Couche d'abstraction API
- **Types**: Types TypeScript stricts
- **Validation**: Schémas Zod pour la validation

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour plus de détails.

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (dashboard)/        # Route group dashboard
│   ├── login/             # Page de connexion
│   └── register/          # Page d'inscription
├── components/             # Composants React
│   ├── ui/                # Composants shadcn/ui
│   ├── layout/            # Composants de layout
│   ├── dashboard/         # Composants dashboard
│   ├── datasets/          # Composants datasets
│   └── ...                # Autres composants
├── hooks/                 # Hooks personnalisés
├── store/                 # Stores Zustand
├── services/              # Services métier
└── lib/                   # Utilitaires et config
```

## 🎨 Fonctionnalités

### 📊 Gestion de Données
- **Datasets**: CRUD complet pour les jeux de données
- **Utilisateurs**: Gestion des utilisateurs avec rôles
- **Organisations**: Gestion des organisations productrices
- **Thèmes**: Catégorisation des datasets
- **Licences**: Gestion des licences d'utilisation

### 🔐 Authentification
- Authentification mock avec localStorage
- Gestion de sessions
- Rôles: admin, contributor, public

### 📈 Analytics
- Statistiques de la plateforme
- Graphiques de visualisation
- Métriques de performance

### ⚙️ Paramètres
- Configuration de la plateforme
- Paramètres de sécurité
- Configuration API
- Gestion des notifications

## 🛠️ Développement

### Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter ESLint
```

## 📝 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture détaillée

## 🚀 Déploiement

L'application est prête pour le déploiement sur:
- Vercel (recommandé pour Next.js)
- Netlify
- Tout hébergeur Node.js

---

Développé avec ❤️ pour le Mali 🇲🇱
