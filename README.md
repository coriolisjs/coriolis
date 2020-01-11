# Coriolis

Rules about Coriolis

- Un event doit avoir un format standard:

  - un type
  - optionnel: un payload
  - des meta-données (optionnel mais coriolis va systématiquement en ajouter certaines)
  - si c'est une erreur, error: true

- Events du passé

  - Event du passé, joués à l'initialisation du store et alimentant les projections mais sans alimenter leurs
    abonnements ni les effets

- EventSubject

  - Entité interne à Coriolis accessible uniquement indirectement via l'API Effect
  - Subject selon la terminologie RxJS: entité pouvant à la fois recevoir et émettre des événements
  - Émet un ensemble d'events initiaux, PUIS retransmet les events qu'il reçoit
  - Transmet tous les events qu'il reçoit aux loggers
  - Assure que les events sont valide
  - Assure une protection contre les boucles d'events
  - Assure que chaque event dispose d'un timestamp en meta
  - Fait passer tous les évents par un enhancer (si défini)

- On ne défini pas une projection global unique regroupant l'ensemble des projections (à la redux).
  Pour accéder au contenu d'une projection, on utilise une référence à la définition de cette projection.
  Pour qu'une projection soit alimenté il faut, soit que sa définition est été "connectée", soit
  qu'il y ait des abonements à cette définition.

- Une définition de projection peut prendre deux formes

  - simple sous forme d'un reducer
  - complexe en utilisant l'API projection

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
    - Accéder au contenu d'une projection
    - Récupérer des snapshots (contenu de l'ensemble des projections)

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

  - mise en cache du premier event non passé
  - mise en cache des tout event émit dans un premier temps
  - diffusion aux aggrégateurs et via l'observable pastEvent\$ des "events du passé"
  - log puis transmission (aux aggregateurs et via eventSubject d'effet) des events buffurisés
  - log puis transmission (aux aggregateurs et via eventSubject d'effet) des nouveaux events

  - un eventSubject d'effet n'émet donc jamais aucun "event passé"
  - les aggregateurs voient passer tous les events, même les "passés"

- La ré-émition directe d'un event émit par eventSubject cause une erreur (prévention de boucle)

- EventBuilder
  - metaBuilder est optionel
  - payloadBuilder est optionel, on peut uniquement définir un type
  - payloadBuilder par défaut est identity

## Définition de projection

La définition d'une projection se fait par une règle de projection

Quel que soit la forme de définition, Coriolis construira à partir de cette définition un
aggrégateur qui pourra être alimenté par les events de l'eventSubject.

### Définition de projection sous forme de reducer:

Pour cette forme, on défini la nouvelle valeur de la projection (nouvel état) à partir de:

- state: dernière valeur de cette projection
- event: dernier evenement emit

### Définition de projection sous forme complexe:

Pour cette forme, on défini dans un premier temps les sources de données dont a besoin l'aggrégateur:

- useState: dernière valeur de cette projection (on peut spécifier une valeur initial)
- useEvent: dernier evenement emit (on peut spécifier quels événements on souhaite traiter)
- useProjection/lazyProjection: utiliser la valeur d'une projection
- useValue: Utiliser une valeur static (cela est surtout utile pour étendre l'API)
- setName: Attribue un nom à l'aggregateur, dans un but de debug

ensuite on défini le résultat en fonction de ces sources de données

#### Pour une meilleur compréhension du fonctionnement

Chaque définition de projection complexe peut être transformée en une définition de projection de type reducer

Ce reducer operera en deux étapes:

- premièrement il collectera les données d'input attendues en fonction de l'event, ce qui revient à exécuter un
  aggregateur pour chaque input
- ensuite, si les données d'input ainsi obtenu sont différentes de la précédente itération, il exécutera la fonction
  de projection avec ces inputs.

## Aggrégateur

Un aggrégateur est une fonction qui reçoit un événement et retourne une valeure de projection selon cet événement et
les précédents reçu

Les aggrégateurs ne sont normalement pas manipulés lors de l'usage de Coriolis. Ils sont utilisés en interne par
la librairie, mais cette définition apporte une meilleure compréhension du fonctionnement global.

Chaque Projection est converti en interne par Coriolis en aggregateur, auquel sera
transmi chaque event traité par Coriolis

Chaque aggrégateur expose sont état courant par le biais d'une méthode "getValue" et également d'un getter "value"

### memoization

Si l'aggrégateur est appelé plusieurs fois de suite avec strictement le même événement, seul le premier appel
aura un effet sur la valeur de la projection. Les appels suivant retourneront directement la valeur de
la projection sans la modifier.

Cette spécificité permet d'utiliser les aggregateurs dans de multiples usages, sans pour autant multiplié
les exécutions de processus de projection
