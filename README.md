# Coriolis

Rules about Coriolis

- un event doit avoir un format standard:
  - un type
  - optionel: un payload
  - si c'est une erreur, error: true
  - des meta-données

- La définition d'aggrégats peut se faire sous deux formes
  - simples sous forme de reducer
  - complexes sous forme de selecteur

- Les définitions d'aggregats peuvent être utilisées tel quel à tout moment.
  La liste des aggregats n'est pas un pré-requis pour la définition du store

- Définition d'un effet
  - Un effet peut :
    - Ajouter une source d'event initiaux
    - Ajouter un logger d'event
    - S'abonner aux events initiaux
    - S'abonner aux events autres que initiaux (via eventSource)
    - Émettre des events (via eventSource)
      - Émission d'event invalide -> erreur générale
      - Émission d'erreur -> erreur générale
      - Émission de complétion -> complétion générale // CHECK IF REALLY EXPECTING THIS...
    - initialiser un aggrégateur
    - S'abonner à un aggrégateur
    - Récupérer des snapshots
    - Ajouter d'autres effets

  - Un effet doit retourner une fonction de désactivation

- Définition d'un logger
  - reçoit des event via une propriété next
  - peut être un observable d'event
  - erreur émise par logger -> erreur de event source -> erreur générale

- Définition d'une source d'event initiaux
  - peut être un array d'events
  - peut être un observable d'events

  - Doit se compléter pour que le store puisse passer à la suite
  - Erreur sur une source -> erreur générale
  - Il n'est pas possible de définir une source d'events initiaux après que tous les events initiaux aient étés émits

- L'instanciation d'un store suit la procédure suivante:
  - mise en cache du premier event non initial
  - mise en cache des tout event émit dans un premier temps
  - diffusion aux aggrégateurs et via l'observable initialEvent$ des "events initiaux"
  - log puis transmission (aux aggregateurs et via eventSource d'effet) des événements buffurisés
  - log puis transmission (aux aggregateurs et via eventSource d'effet) des nouveaux events

  - un eventSource d'effet n'émet donc jamais aucun "event initial"
  - les aggregateurs voient passer tous les events, même les "initiaux"

- La ré-émition d'un event émit par event store cause une erreur


- EventBuilder
  - metaBuilder est optionel
  - payloadBuilder est optionel, on peut uniquement définir un type
  - payloadBuilder par défaut est identity

## Définition des aggrégats

Quel que soit la forme de définition de l'aggrégat, le résultat sera memorisé afin de
garantir que pour des données d'entrée consécutives identiques, le résultat soit retourné
immédiatement sans calcul supplémentaire

### Définition d'un aggrégat sous forme de reducer:

Pour cette forme, on défini le résultat en fonction de sources de données suivantes:
- state: dernière valeur obtenue via cet aggrégat
- event: dernier evenement emit

### Définition d'un aggrégat sous forme de selecteur:

Pour cette forme, on défini dans un premier temps les sources de données:
- state: dernière valeur obtenue via cet aggrégat
- event: dernier evenement emit
- (multiple) aggregat: résultat d'un autre aggrégat pour l'event

ensuite on défini le résultat en fonction de ces sources de données
