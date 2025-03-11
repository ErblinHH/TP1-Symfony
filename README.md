# Gestion d'Évènements Musicaux

Application Symfony de gestion d'évènements musicaux, comportant une partie **fullstack** et une partie **API**.

---

## Fonctionnalités

- **Partie Fullstack :**
  - **Accueil public** ; le reste de l'application est protégé et requiert une connexion.
  - **Utilisateurs :**
    - Inscription / connexion.
    - Le premier utilisateur devient `ROLE_ADMIN`, les autres `ROLE_USER`.
  - **Artistes :**
    - Seul l'admin peut créer et modifier.
    - Chaque artiste possède un nom, une description et une image.
  - **Évènements :**
    - Création, modification et suppression par l'utilisateur qui l'a créé.
    - Inscription/désinscription aux évènements.
    - Recherche d'artistes (via GET) et filtrage d'évènements par date (via GET).

- **Partie API :**
  - Endpoints publics pour :
    - Liste et détail des artistes.
    - Liste et détail des évènements.
  - Documentation Swagger accessible via `/api/doc`.

---

## Installation

1. **Cloner le repository :**

   ```bash
   git clone https://github.com/ErblinHH/TP1-Symfony
   cd TP1-Symfony
   ```

2. **Installer les dépendances :**

   ```bash
   composer install
   ```

3. **Configurer l'environnement :**
   - Copier `.env` en `.env.local` et ajuster `DATABASE_URL`.

4. **Exécuter les migrations :**

   ```bash
   php bin/console doctrine:migrations:migrate
   ```

5. **Lancer le serveur :**

   ```bash
   symfony serve
   ```

6. **Rajouter un compte admin**

   ```bash
   php bin/console app:create-admin
   ```
---

## Remise du Projet

- **Date limite :** 07 mars 2025
- **Repository public** (ne pas inclure la base de données, uniquement les migrations)

---
