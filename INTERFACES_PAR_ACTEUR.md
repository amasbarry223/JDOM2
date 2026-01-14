# Analyse des Interfaces selon les Acteurs - JDOM2

## Vue d'Ensemble des Acteurs

L'application JDOM2 définit **3 rôles principaux** :

1. **Administrateur (admin)** - Accès complet à toutes les fonctionnalités
2. **Contributeur (contributor)** - Peut soumettre et gérer ses propres datasets
3. **Public (public)** - Accès en lecture seule aux données publiques

---

## 1. 👑 ADMINISTRATEUR (admin)

### Interfaces Accessibles

#### Dashboard Principal (`/`)
- **Vue d'ensemble complète** de la plateforme
- Statistiques globales :
  - Total des datasets
  - Datasets publiés
  - Total des téléchargements
  - Total des vues
  - Nombre d'utilisateurs
  - Nombre d'organisations
  - Utilisateurs actifs
- Graphiques de visualisation
- Top datasets les plus téléchargés
- Datasets récents

#### Gestion des Jeux de Données (`/datasets`)
- ✅ **CRUD complet** (Créer, Lire, Modifier, Supprimer)
- ✅ **Publier/Dépublier** des datasets
- ✅ **Approuver/Rejeter** les soumissions de contributeurs
- ✅ **Filtres avancés** (statut, thème, format, producteur)
- ✅ **Gestion des versions** de datasets
- ✅ **Modification des métadonnées**

#### Gestion des Utilisateurs (`/users`)
- ✅ **CRUD complet** des utilisateurs
- ✅ **Gestion des rôles** (admin, contributor, public)
- ✅ **Activer/Désactiver** des comptes
- ✅ **Assigner des organisations** aux utilisateurs
- ✅ **Voir l'historique** de connexion
- ✅ **Gérer les permissions**

#### Gestion des Organisations (`/organizations`)
- ✅ **CRUD complet** des organisations
- ✅ **Associer des datasets** aux organisations
- ✅ **Gérer les producteurs** de données

#### Gestion des Thèmes (`/themes`)
- ✅ **CRUD complet** des catégories/thèmes
- ✅ **Organiser la taxonomie** des datasets

#### Gestion des Licences (`/licenses`)
- ✅ **CRUD complet** des licences
- ✅ **Gérer les types de licences** (ODbL, CC-BY, CC0, etc.)

#### Analytics (`/analytics`)
- ✅ **Tableaux de bord avancés**
- ✅ **Statistiques détaillées**
- ✅ **Rapports d'utilisation**
- ✅ **Métriques de performance**

#### Paramètres (`/settings`)
- ✅ **Configuration de la plateforme**
- ✅ **Paramètres de sécurité**
- ✅ **Gestion des notifications**
- ✅ **Configuration API**

### Fonctionnalités Spécifiques

- **Accès illimité** à toutes les fonctionnalités
- **Modération** des soumissions de contributeurs
- **Gestion des utilisateurs** et permissions
- **Configuration système**
- **Export de données**

---

## 2. 📝 CONTRIBUTEUR (contributor)

### Interfaces Accessibles

#### Dashboard Contributeur (`/dashboard/contributor`)
- **Vue personnalisée** pour les contributeurs
- Statistiques personnelles :
  - Total de mes datasets
  - Datasets publiés
  - Datasets soumis (en attente)
  - Datasets en brouillon
  - Datasets rejetés
  - Total des téléchargements de mes datasets
  - Total des vues de mes datasets
- **Tableau de bord** avec onglets :
  - Mes Datasets
  - Soumissions
  - Statistiques

#### Gestion de Mes Datasets
- ✅ **Créer** de nouveaux datasets
- ✅ **Modifier** mes datasets (brouillons uniquement)
- ✅ **Soumettre** des datasets pour validation
- ✅ **Créer de nouvelles versions** de datasets existants
- ✅ **Voir le statut** de mes soumissions
- ✅ **Télécharger** mes datasets
- ❌ **Ne peut pas publier** directement (nécessite validation admin)
- ❌ **Ne peut pas supprimer** des datasets publiés

#### Fonctionnalités de Soumission
- **Formulaire de soumission** avec :
  - Métadonnées complètes (titre, description, format, etc.)
  - Sélection du thème
  - Sélection de l'organisation productrice
  - Choix de la licence
  - Fréquence de mise à jour
  - Couverture spatiale/temporelle
- **Validation** des données avant soumission
- **Prévisualisation** avant soumission

#### Filtres et Recherche
- ✅ **Recherche** dans mes datasets
- ✅ **Filtres par statut** (draft, submitted, published, rejected)
- ✅ **Filtres par thème**

### Restrictions

- ❌ **Pas d'accès** au dashboard admin (`/`)
- ❌ **Pas d'accès** à la gestion des utilisateurs (`/users`)
- ❌ **Pas d'accès** à la gestion des organisations (`/organizations`)
- ❌ **Pas d'accès** à la gestion des thèmes (`/themes`)
- ❌ **Pas d'accès** à la gestion des licences (`/licenses`)
- ❌ **Pas d'accès** aux analytics (`/analytics`)
- ❌ **Pas d'accès** aux paramètres (`/settings`)
- ❌ **Ne peut pas publier** ses propres datasets (soumission uniquement)
- ❌ **Ne peut pas modifier** les datasets déjà publiés (création de version uniquement)

---

## 3. 👁️ PUBLIC (public)

### Interfaces Accessibles

#### Page d'Accueil (`/`)
- **Vue publique** de la plateforme
- **Liste des datasets publiés**
- **Recherche** dans les datasets publics
- **Filtres** par thème, format, organisation
- **Consultation** des métadonnées

#### Consultation des Datasets
- ✅ **Voir** les datasets publiés uniquement
- ✅ **Télécharger** les datasets publics
- ✅ **Consulter** les métadonnées complètes
- ✅ **Voir** les statistiques de téléchargement/vues
- ❌ **Ne peut pas créer** de datasets
- ❌ **Ne peut pas modifier** quoi que ce soit

### Restrictions

- ❌ **Pas d'accès** au dashboard admin
- ❌ **Pas d'accès** au dashboard contributeur
- ❌ **Pas d'accès** aux fonctionnalités de gestion
- ❌ **Pas d'accès** aux datasets non publiés
- ❌ **Pas d'accès** aux statistiques détaillées
- ❌ **Lecture seule** - aucune action de modification

---

## Tableau Récapitulatif des Accès

| Interface | Admin | Contributor | Public |
|-----------|-------|-------------|--------|
| **Dashboard Admin** (`/`) | ✅ | ❌ | ❌ |
| **Dashboard Contributeur** (`/dashboard/contributor`) | ✅ | ✅ | ❌ |
| **Datasets - Gestion** (`/datasets`) | ✅ CRUD complet | ✅ Créer/Soumettre uniquement | ❌ |
| **Datasets - Consultation** | ✅ Tous | ✅ Mes datasets | ✅ Publiés uniquement |
| **Utilisateurs** (`/users`) | ✅ CRUD complet | ❌ | ❌ |
| **Organisations** (`/organizations`) | ✅ CRUD complet | ❌ | ❌ |
| **Thèmes** (`/themes`) | ✅ CRUD complet | ❌ | ❌ |
| **Licences** (`/licenses`) | ✅ CRUD complet | ❌ | ❌ |
| **Analytics** (`/analytics`) | ✅ Accès complet | ❌ | ❌ |
| **Paramètres** (`/settings`) | ✅ Accès complet | ❌ | ❌ |
| **Publier datasets** | ✅ | ❌ | ❌ |
| **Approuver soumissions** | ✅ | ❌ | ❌ |
| **Modérer contenu** | ✅ | ❌ | ❌ |

---

## Routes et Redirections

### Après Connexion

- **Admin** → Redirigé vers `/` (Dashboard admin)
- **Contributor** → Redirigé vers `/dashboard/contributor` (Dashboard contributeur)
- **Public** → Redirigé vers `/` (Vue publique)

### Routes Publiques (sans authentification)

- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/forgot-password` - Réinitialisation de mot de passe

### Routes Protégées

Toutes les routes sous `/dashboard` et `/` nécessitent une authentification.

---

## Permissions Détaillées par Rôle

### Administrateur

```typescript
Permissions: [
  'users:read', 'users:create', 'users:update', 'users:delete',
  'datasets:read', 'datasets:create', 'datasets:update', 'datasets:delete', 'datasets:publish',
  'organizations:read', 'organizations:create', 'organizations:update', 'organizations:delete',
  'themes:read', 'themes:create', 'themes:update', 'themes:delete',
  'licenses:read', 'licenses:create', 'licenses:update', 'licenses:delete',
  'analytics:read', 'settings:read', 'settings:update'
]
```

### Contributeur

```typescript
Permissions: [
  'datasets:read', 'datasets:create', 'datasets:submit',
  // Accès limité à ses propres datasets uniquement
]
```

### Public

```typescript
Permissions: [
  'datasets:read', // Datasets publiés uniquement
]
```

---

## Recommandations d'Amélioration

### Sécurité
1. **Implémenter un système de permissions granulaire** au lieu de simples rôles
2. **Ajouter des middlewares de vérification** de rôle sur chaque route
3. **Masquer les éléments UI** non accessibles selon le rôle
4. **Valider les permissions** côté serveur (quand API sera implémentée)

### UX
1. **Messages d'erreur clairs** quand un utilisateur tente d'accéder à une ressource non autorisée
2. **Redirections automatiques** vers la page appropriée selon le rôle
3. **Indicateurs visuels** du rôle actuel de l'utilisateur

### Fonctionnalités Manquantes
1. **Gestion des rôles personnalisés**
2. **Permissions par ressource** (ex: contributeur peut gérer certaines organisations)
3. **Audit trail** des actions des administrateurs
4. **Notifications** pour les contributeurs (validation/rejet de soumissions)

