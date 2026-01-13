# Gestion des Utilisateurs et des Rôles - JDOM

## Vue d'ensemble

Le système de gestion des utilisateurs et des rôles de JDOM permet une gestion fine des droits d'accès à la plateforme. Il offre une approche par rôles (RBAC - Role-Based Access Control) avec trois niveaux de permissions prédéfinis.

## Rôles Disponibles

### 1. Administrateur (Admin)
- **Accès** : Complet à toutes les fonctionnalités
- **Permissions** : 23 permissions
- **Responsabilités** :
  - Gestion complète des utilisateurs (CRUD)
  - Gestion complète des datasets (CRUD + publication)
  - Gestion complète des organisations
  - Gestion complète des thèmes
  - Gestion complète des licences
  - Accès aux statistiques
  - Gestion des paramètres de la plateforme

### 2. Contributeur
- **Accès** : Création et modification des datasets
- **Permissions** : 9 permissions
- **Responsabilités** :
  - Lire les informations des utilisateurs
  - Créer, modifier et publier des datasets
  - Lire les organisations
  - Lire les thèmes et les licences
  - Accéder aux statistiques

### 3. Public
- **Accès** : Lecture seule des données publiques
- **Permissions** : 4 permissions
- **Responsabilités** :
  - Consulter les datasets publiques
  - Lire les organisations
  - Lire les thèmes
  - Lire les licences

## Permissions Détaillées par Catégorie

### Utilisateurs
- `users:read` - Voir les utilisateurs
- `users:create` - Créer des utilisateurs
- `users:update` - Modifier des utilisateurs
- `users:delete` - Supprimer des utilisateurs

### Datasets
- `datasets:read` - Voir les datasets
- `datasets:create` - Créer des datasets
- `datasets:update` - Modifier des datasets
- `datasets:delete` - Supprimer des datasets
- `datasets:publish` - Publier des datasets

### Organisations
- `organizations:read` - Voir les organisations
- `organizations:create` - Créer des organisations
- `organizations:update` - Modifier les organisations
- `organizations:delete` - Supprimer les organisations

### Thèmes
- `themes:read` - Voir les thèmes
- `themes:create` - Créer des thèmes
- `themes:update` - Modifier les thèmes
- `themes:delete` - Supprimer les thèmes

### Licences
- `licenses:read` - Voir les licences
- `licenses:create` - Créer des licences
- `licenses:update` - Modifier les licences
- `licenses:delete` - Supprimer les licences

### Statistiques
- `stats:read` - Voir les statistiques

### Paramètres
- `settings:read` - Voir les paramètres
- `settings:update` - Modifier les paramètres

## API Endpoints

### Gestion des Utilisateurs

#### `GET /api/users`
Récupérer la liste des utilisateurs avec pagination et filtres.

**Query Parameters :**
- `page` (number) - Page actuelle (défaut: 1)
- `limit` (number) - Nombre d'utilisateurs par page (défaut: 10)
- `role` (string) - Filtrer par rôle (admin, contributor, public)
- `organizationId` (string) - Filtrer par organisation
- `search` (string) - Rechercher par nom ou email

**Réponse :**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### `POST /api/users`
Créer un nouvel utilisateur.

**Corps de la requête :**
```json
{
  "name": "Nom Complet",
  "email": "email@exemple.com",
  "password": "motdepasse",
  "role": "contributor",
  "organizationId": "org_id"
}
```

#### `GET /api/users/[id]`
Récupérer les détails d'un utilisateur spécifique.

#### `PUT /api/users/[id]`
Mettre à jour un utilisateur.

#### `DELETE /api/users/[id]`
Supprimer un utilisateur.

**Note :** Un utilisateur avec des datasets publiés ne peut pas être supprimé.

### Gestion des Rôles

#### `PUT /api/users/[id]/role`
Changer le rôle d'un utilisateur.

**Corps de la requête :**
```json
{
  "role": "admin"
}
```

**Réponse :**
```json
{
  "message": "Rôle mis à jour avec succès: admin",
  "user": {...}
}
```

#### `GET /api/roles`
Récupérer la liste des rôles et leurs permissions.

**Réponse :**
```json
{
  "roles": [...],
  "permissions": {
    "Utilisateurs": [...],
    "Datasets": [...],
    ...
  }
}
```

## Fonctionnalités de l'Interface

### Liste des Utilisateurs
- Affichage en tableau avec toutes les informations
- Avatars avec initiales
- Badges de rôle colorés et iconographiques
- Statistiques de datasets par utilisateur
- Filtres par rôle et organisation
- Recherche par nom ou email

### Actions Disponibles

#### Modifier Profil
- Mettre à jour le nom
- Mettre à jour l'email
- Changer l'organisation

#### Voir Permissions
- Affichage détaillé de toutes les permissions du rôle de l'utilisateur
- Comparaison avec les autres rôles
- Permissions organisées par catégorie
- Indicateurs visuels (✓ ou ✗)

#### Changer Rôle
- Sélection du nouveau rôle
- Affichage du nombre de permissions
- Confirmation avant modification

#### Supprimer Utilisateur
- Suppression avec confirmation
- Protection contre la suppression d'utilisateurs avec des datasets publiés

### Gestion des Rôles et Permissions
- Vue en grille des trois rôles
- Description détaillée de chaque rôle
- Compteur de permissions par rôle
- Affichage des principales catégories d'accès
- Vue détaillée de toutes les permissions

### Création d'Utilisateur
- Formulaire complet avec :
  - Nom complet
  - Email (unique)
  - Mot de passe
  - Sélection du rôle
  - Sélection de l'organisation
- Validation des champs requis

## Sécurité

### Règles de Gestion
1. **Unicité de l'email** : Chaque email ne peut être associé qu'à un seul utilisateur
2. **Protection contre l'auto-suppression** : Un admin ne peut pas changer son propre rôle (optionnel)
3. **Protection des datasets** : Un utilisateur avec des datasets publiés ne peut pas être supprimé
4. **Validation des rôles** : Seuls les rôles admin, contributor et public sont autorisés

### Recommandations
- Utiliser des mots de passe forts avec hachage bcrypt
- Implémenter l'authentification à deux facteurs pour les admins
- Logger toutes les modifications de rôle
- Surveiller les activités des utilisateurs sensibles

## Composants

### UserManagement
Composant principal de gestion des utilisateurs.

**Props :** Aucun (gestion d'état interne)

**Fonctionnalités :**
- Liste des utilisateurs avec filtres
- Gestion des rôles
- Modales de création/édition
- Vue détaillée des permissions
- Statistiques par rôle

## Intégration avec le Dashboard

La gestion des utilisateurs est intégrée dans le dashboard principal :

1. **Navigation** : Accessible via le menu sidebar "Utilisateurs"
2. **Consistance** : Utilise le même design que les autres sections
3. **Responsive** : Adapté pour mobile et desktop
4. **Performance** : Chargement optimisé avec pagination

## Bonnes Pratiques

### Pour les Administrateurs
- Réviser régulièrement les utilisateurs inactifs
- Attribuer le niveau de permissions minimum requis
- Documenter les changements de rôle
- Former les nouveaux contributeurs

### Pour les Contributeurs
- Ne partager que les données publiées
- Mettre à jour régulièrement leurs datasets
- Respecter les licences des données

## Statistiques

L'interface affiche des statistiques en temps réel :
- Total des utilisateurs
- Nombre d'administrateurs
- Nombre de contributeurs
- Nombre d'utilisateurs publics
- Datasets par utilisateur

## Future Extensions

- Authentification via LDAP/Active Directory
- Gestion des équipes et des groupes
- Audit trail complet
- Notifications par email
- SSO (Single Sign-On)
- Gestion des permissions personnalisées
