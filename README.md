#1. Comment installer et lancer le projet:

            1.Comment installer et lancer le projet
               #Cloner le projet
               git clone https://github.com/pr-daaif/learning-platform-template.git

               #Renommez le dépôt origin
               cd learning-platform-template
               git remote remove origin

               # Ajoutez votre dépôt comme nouvelle origine
               git remote add origin https://github.com/[votre-compte]/learning-platform-nosql

               # Poussez le code vers votre dépôt
               git push -u origin main

            2. Installer les dépendances avec
               `npm install`

            3. Lancer le projet avec
               `npm start`

#2. La structure du projet
Le projet est composé de 3 dossiers principaux :

            - env : contient les variables d'environnement
            -package.json : contient les packages utilisés dans le projet
            - src :

                        - controllers : contient les controlleurs de l'application
                                 -courseController.js : controlleur de la route /course


                        - routes : contient les routes de l'application
                                 -courseRoutes.js : route /course
                        - services : contient les services de l'application
                                 -mongoService.js : service de connexion à la base de données
                                 -redisService.js : service de connexion à redis(cache)

            - app.js: fichier principal de l'application

#3. Les choix techniques que vous avez faits
#4. Les réponses aux questions posées dans les commentaires

    4.1 les questions de db.js

          Question:
             Pourquoi créer un module séparé pour les connexions aux bases de données ?
          Réponse:
             on peut cree tous les connexions dans un seul fichier mais il est plus propre
             de les separer pour une meilleur lisibilite et facilite de maintenance
             aussi l'operation de connexion peut etre coteuse en performance lorsqu'on cree une connexion a chaque fois
             Si on utilise des connexions multiples on va charger notre processeur en notr memoire .

          Question :
             Comment gérer proprement la fermeture des connexions ?
          Réponse :
             On doit fermer les connexions lorsqu'on a fini de les utiliser pour liberer les ressources(memorie,cpu)

    4.2 les questions de env.js.

          Question:
             Pourquoi est-il important de valider les variables d'environnement au démarrage ?
          Réponse:
             Il est essentiel de valider les variables d'environnement pour s'assurer que toutes
             les configurations nécessaires sont fournies avant le démarrage de l'application.
             Cela évite des erreurs inattendues ou des comportements imprévisibles.
          Question:
             Que se passe-t-il si une variable requise est manquante ?
             Si une variable d'environnement requise est absente l'application risque de ne pas démarrer
             correctement, de mal se connecter aux services ou de produire des erreurs pendant l'exécution.

4.3 les questions courseController.js

         Question:

            Quelle est la différence entre un contrôleur et une route ?

         Réponse:
               Route :
                  C'est une configuration qui définit l'URL et la méthode HTTP (GET, POST, etc.)
                  pour une action spécifique de l'application.Elle détermine quel contrôleur et quelle
                  fonction doivent être exécutés lorsqu'un utilisateur fait une requête vers cette URL.

               Contrôleur :
                   C'est un fichier ou un module qui contient la logique métier pour traiter la requête.
                   Il reçoit les données de la requête.



         Question :
            Pourquoi séparer la logique métier des routes ?

         Réponse :
             Réutilisation : Une même logique métier peut être utilisée dans plusieurs routes ou même
             dans d'autres parties de l'application, ce qui évite de dupliquer le code et simplifie
             les évolutions futures
