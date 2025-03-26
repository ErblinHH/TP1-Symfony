# Gestion d'Évènements Musicaux

Application Symfony de gestion d'évènements musicaux, comportant une partie **fullstack** et une partie **API**.

---

## Fonctionnalités

- **Partie Fullstack :**
    - **Accueil public** (le reste de l'application est protégé et requiert une connexion).
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
   git clone https://github.com/ErblinHH/TP1-Symfony.git
   cd TP1-Symfony
   ```

2. **Installer les dépendances :**

   ```bash
   composer install
   ```

3. **Configurer l'environnement :**
    - Copier le fichier `.env` en `.env.local` et ajuster la variable `DATABASE_URL` selon vos besoins.

4. **Exécuter les migrations :**

   ```bash
   php bin/console doctrine:migrations:migrate
   ```

5. **Générer les clés JWT :**

   ```bash
   php bin/console lexik:jwt:generate-keypair
   ```

6. **Lancer le serveur backend :**

   ```bash
   symfony serve
   ```

7. **Lancer le serveur frontend :**
    - Se rendre dans le dossier `React` :

      ```bash
      cd React
      npm install    # Si ce n'est pas déjà fait
      npm run dev
      ```

---

Cela devrait vous permettre de démarrer à la fois le backend Symfony et le frontend React.