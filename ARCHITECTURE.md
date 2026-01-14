# Architecture du Projet JDOM2

## Vue d'Ensemble

JDOM2 est une application frontend-only construite avec Next.js 15, TypeScript, et Tailwind CSS. L'architecture suit les principes de séparation des responsabilités (SRP) et de composition.

## Structure des Dossiers

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (dashboard)/        # Route group pour dashboard
│   │   ├── layout.tsx      # Layout dashboard
│   │   ├── page.tsx        # Dashboard principal
│   │   ├── datasets/       # Page datasets
│   │   ├── users/          # Page users
│   │   ├── organizations/  # Page organizations
│   │   ├── themes/         # Page themes
│   │   ├── licenses/       # Page licenses
│   │   ├── analytics/      # Page analytics
│   │   └── settings/       # Page settings
│   ├── login/              # Page de connexion
│   └── register/           # Page d'inscription
├── components/             # Composants React
│   ├── ui/                 # Composants shadcn/ui
│   ├── layout/             # Composants de layout
│   ├── dashboard/          # Composants dashboard
│   ├── datasets/           # Composants datasets
│   ├── users/              # Composants users
│   ├── organizations/     # Composants organizations
│   ├── themes/             # Composants themes
│   └── licenses/           # Composants licenses
├── hooks/                  # Hooks personnalisés
│   ├── useAuth.ts          # Hook d'authentification
│   ├── useDatasets.ts      # Hook pour datasets
│   ├── useUsers.ts         # Hook pour users
│   ├── useOrganizations.ts # Hook pour organizations
│   ├── useThemes.ts        # Hook pour themes
│   ├── useLicenses.ts      # Hook pour licenses
│   ├── useDebounce.ts      # Hook debounce
│   ├── useLocalStorage.ts  # Hook localStorage
│   ├── usePagination.ts    # Hook pagination
│   ├── useInitializeStores.ts # Hook d'initialisation centralisée des stores
│   └── useEntityModal.ts   # Hook générique pour gestion des modales
├── store/                  # Stores Zustand
│   ├── authStore.ts        # Store authentification
│   ├── datasetStore.ts     # Store datasets
│   ├── userStore.ts        # Store users
│   ├── organizationStore.ts # Store organizations
│   ├── themeStore.ts       # Store themes
│   ├── licenseStore.ts     # Store licenses
│   └── uiStore.ts          # Store UI
├── services/               # Services métier
│   ├── api/                # Services API
│   │   ├── datasetService.ts
│   │   ├── userService.ts
│   │   ├── organizationService.ts
│   │   ├── themeService.ts
│   │   ├── licenseService.ts
│   │   └── statsService.ts
│   └── mock/               # Services mock
│       ├── mockApi.ts       # API mock unifiée
│       └── mockData.ts     # Données mock
└── lib/                    # Utilitaires et config
    ├── types/              # Types TypeScript
    ├── utils/               # Utilitaires
    ├── validation/          # Schémas Zod
    └── config/              # Configuration
```

## Flux de Données

### Architecture State Management

```
Component → Hook → Store → Service → Mock API → localStorage
```

1. **Composants**: Affichent l'UI et déclenchent les actions
2. **Hooks**: Interface entre composants et stores, logique métier
3. **Stores (Zustand)**: État global, actions synchrones
4. **Services**: Logique métier, appels API (mock pour l'instant)
5. **Mock API**: Simulation d'API avec localStorage

### Exemple de Flux

**Création d'un Dataset:**
```
User clicks "Create" 
  → DatasetForm.onSubmit()
  → useDatasets.createDataset()
  → datasetStore.createDataset()
  → Service (future: API call)
  → Store update
  → Component re-render
```

## Patterns Utilisés

### 1. Container/Presentational Pattern
- **Containers**: Pages qui gèrent la logique (app/(dashboard)/*.tsx)
- **Presentational**: Composants UI purs (components/*)

### 2. Custom Hooks Pattern
- Encapsule la logique réutilisable
- Expose une API simple aux composants
- Gère les effets de bord (fetching, subscriptions)
- **useInitializeStores**: Initialise tous les stores une seule fois au niveau du layout
- **useEntityModal**: Hook générique pour gérer les modales CRUD (create/edit/delete)

### 3. Store Pattern (Zustand)
- État global centralisé
- Actions pures
- Selectors pour optimiser les re-renders

### 4. Service Layer Pattern
- Abstraction de la couche API
- Facilite la migration vers vraie API
- Gestion d'erreurs centralisée

## Types et Validation

### Types TypeScript
- Types stricts dans `lib/types/`
- Pas de `any` (sauf pour migrations temporaires)
- Interfaces readonly où approprié

### Validation Zod
- Schémas dans `lib/validation/`
- Validation côté client
- Messages d'erreur personnalisés

## Bonnes Pratiques

### 1. Séparation des Responsabilités
- Chaque fichier a une responsabilité unique
- Logique métier dans services/hooks
- UI dans components

### 2. Réutilisabilité
- Composants composables
- Hooks réutilisables (useEntityModal pour factoriser la logique des modales)
- Utilitaires génériques

### 3. Performance
- Memoization avec React.memo, useMemo, useCallback
- Code splitting avec dynamic imports
- Selectors Zustand pour souscriptions granulaires
- Initialisation unique des stores via useInitializeStores dans le layout

### 4. Maintenabilité
- Noms explicites
- Structure claire
- Documentation inline (JSDoc)
- Code DRY (Don't Repeat Yourself) - logique des modales centralisée

## Optimisations Récentes

### Initialisation Centralisée des Stores
- **useInitializeStores**: Hook qui initialise tous les stores une seule fois au niveau du layout
- Évite la duplication de code d'initialisation dans chaque page
- Vérifie si les stores sont déjà initialisés pour éviter les réinitialisations multiples

### Factorisation de la Logique des Modales
- **useEntityModal**: Hook générique qui gère la logique CRUD pour toutes les entités
- Réduit la duplication de code dans les pages (organizations, themes, licenses, etc.)
- Standardise la gestion des modales, toasts, et erreurs

## Migration Future

L'architecture est conçue pour faciliter la migration vers une vraie API:

1. **Services**: Remplacer les appels mock par de vrais appels API
2. **Stores**: Ajouter la gestion d'erreurs réseau
3. **Hooks**: Ajouter retry logic, cache, etc.

## Technologies

- **Next.js 15**: Framework React avec App Router
- **TypeScript 5**: Typage statique
- **Zustand**: State management léger
- **Zod**: Validation de schémas
- **Tailwind CSS**: Styling utility-first
- **shadcn/ui**: Composants UI accessibles
- **React Hook Form**: Gestion de formulaires

