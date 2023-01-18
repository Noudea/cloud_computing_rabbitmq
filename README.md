### AMPQ RabbitMQ ###

Ceci est un projet scolaire pour le cours de cloud computing.  

## Installation ##
Pour installer le projet :
 - Cloner le projet
 - docker compose -f production.docker-compose.yml up

## Utilisation ##
Pour utiliser le projet :
 - Methode POST : http://localhost:8000/commande
   - Aucun body
   - Cet appel créer une commande dans la BDD avec le status "pending" et envoie un message dans la queue qui déclenche un worker qui va passer le status de la commande de "pending" à "delivered".  
 - Methode GET : http://localhost:8000/commande/:id
    - Cet appel retourne la commande avec l'id passé en paramètre. Permet de vérifier le status plus facilement.

## Autre ##  
-Les consoles logs sont laissés intentionnellement pour faciliter la vérification du bon fonctionnement du projet.
