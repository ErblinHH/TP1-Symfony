# Gestion d'Évènements Musicaux

Application Symfony de gestion d'évènements musicaux, comportant une partie **fullstack** et une partie **API**.

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

4. **Installer doctrine et créer la base de donnée :**

   ```bash
    composer require symfony/orm-pack
    composer require --dev symfony/maker-bundle
    php bin/console doctrine:database:create
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