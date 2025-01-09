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

3. Les choix techniques que vous avez faits
4. Les réponses aux questions posées dans les commentaires

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
