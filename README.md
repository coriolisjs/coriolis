# Coriolis

Rules about Coriolis

- Un event doit avoir un format standard:
  - un type
  - optionnel: un payload
  - des meta-données (optionnel mais coriolis va systématiquement en ajouter)
  - si c'est une erreur, error: true

- Event initial
  - Event du passé, alimentant les aggrégats mais sans alimenter leurs abonnements

- EventSubject
  - Entité interne à Coriolis accessible uniquement indirectement via l'API Effect
  - Subject selon la terminologie RxJS: entité pouvant à la fois recevoir et émettre des événements
  - Émet un ensemble d'events initiaux, PUIS retransmet les events qu'il reçoit
  - Transmet tous les events qu'il reçoit aux loggers
  - Assure que les events sont valide
  - Assure une protection contre les boucles d'events
  - Assure que chaque event dispose d'un timestamp en meta
  - Fait passer tous les évents par un enhancer (si défini)

- On ne défini pas un aggrégat global unique regroupant l'ensemble des aggregats (à la redux).
  Pour accéder au contenu d'un aggrégat, on utilise une référence à la définition de cet aggrégat.
  Pour qu'un aggrégat soit alimenté il faut, soit que sa définition est été "connectée", soit
  qu'il y ait des abonements à cette définition.

- Une définition d'aggrégat peut prendre deux formes
  - simple sous forme d'un reducer
  - complexe en utilisant l'API aggr

- EventStore
  Un eventStore met en relation un eventSubject et des effets

- Définition d'un effet
  - Un effet peut :
    - Ajouter d'autres effets
    - Ajouter une source d'events initiaux
    - Ajouter un logger d'events
    - S'abonner aux events initiaux
    - S'abonner aux nouveaux events (via eventSubject)
    - Émettre des events (via eventSubject)
      - Émission d'event invalide -> erreur générale
      - Émission d'erreur -> erreur générale
      - Émission de complétion -> complétion générale // CHECK IF REALLY EXPECTING THIS...
    - S'abonner à un aggrégateur
    - Connecter un aggrégateur
    - Accéder au contenu d'un aggrégat
    - Récupérer des snapshots (contenu de l'ensemble des aggrégats)

  - Un effet doit retourner une fonction de désactivation

- Définition d'un logger
  - reçoit des event via une méthode next
  - peut être un observable d'event
  - erreur émise par logger -> erreur de eventSubject -> erreur générale

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
  - log puis transmission (aux aggregateurs et via eventSubject d'effet) des événements buffurisés
  - log puis transmission (aux aggregateurs et via eventSubject d'effet) des nouveaux events

  - un eventSubject d'effet n'émet donc jamais aucun "event initial"
  - les aggregateurs voient passer tous les events, même les "initiaux"

- La ré-émition directe d'un event émit par eventSubject cause une erreur (prévention de boucle)


- EventBuilder
  - metaBuilder est optionel
  - payloadBuilder est optionel, on peut uniquement définir un type
  - payloadBuilder par défaut est identity

## Définition d'aggrégat

Quel que soit la forme de définition, Coriolis construira à partir de cette définition un
aggrégateur qui pourra être alimenté par les events de l'eventSubject.

### Définition d'aggrégat sous forme de reducer:

Pour cette forme, on défini la nouvelle valeur de l'aggrégat à partir de:
- state: dernière valeur de cet aggrégat
- event: dernier evenement emit

### Définition d'aggrégat sous forme complexe:

Pour cette forme, on défini dans un premier temps les sources de données dont a besoin l'aggrégateur:
- useState: dernière valeur de cet aggrégat (on peut spécifier la valeur initial)
- useEvent: dernier evenement emit (on peut spécifier quels événements on souhaite traiter)
- useAggr/lazyAggr: utiliser la valeur d'un aggrégat, désigné par sa fonction de définition

ensuite on défini le résultat en fonction de ces sources de données

## Aggrégateur

Un aggrégateur est une fonction qui reçoit un événement et retourne une valeure d'aggrégat selon cet événement et
les précédents reçu

Les aggrégateurs ne sont normalement pas manipulés lors de l'usage de Coriolis. Ils sont utilisés en interne par
la librairie, mais cette définition apporte une meilleure compréhension du fonctionnement global.

### memoization

Si l'aggrégateur est appelé plusieurs fois de suite avec strictement le même événement, seul le premier appel
aura un effet sur la valeur de l'aggrégat. Les appels suivant retourneront directement la valeur sans la modifier.
