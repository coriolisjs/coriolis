# Coriolis

English documentation coming soon

## Qu'est-ce que c'est ?

C'est une librairie Javascript permettant de mettre en place un store d'events alimentant des effets s'appuyant sur des projections (état déduit de différents events)

Cette librairie vous aidera à créer vos applications selon les concepts d'Event Sourcing et de Domain Driven Design.

Cette approche aide à obtenir une application au comportement prédictible, modulaire, évolutif et debuggable.
Elle permet entre autre à distinguer différentes typologies de logiques:

- comportement
- organisation des données
- interface utilisateur
  ...

## Motivations

Une motivation majeur avec Coriolis est d'aider à construire un code d'application lisible, en cherchant à se focaliser sur l'expression des logiques du domaine métier. Cela se manifeste à plusieurs niveaux:

- La définition d'une projection est réduite à sa plus simple expression: de quoi elle a besoin et la logique de rangement des données.

- La définition d'un effet peut appliquer d'autres effets, favorisant ainsi une construction modulaire.

- La définition d'un effet a accès directement a toute projection et tout event (passé ou nouveau), et peut invoquer des events passés, déclarer de nouveaux events, appliquer des stratégies de stockage d'events et ajouter d'autres effets

## Influences

La conception de Coriolis a été inspirée par Redux, en cherchant à donnée le rôle de single source of truth non pas au state mais au flux d'events, et ainsi rejoindre le concept d'Event Sourcing

## Installation

Pour installer Coriolis:

```javascript
npm install --save coriolis
```

Le module est fourni sous deux formes: CommonJS ou ES modules, suivant la manière dont vous le chargez

ESModule:
```javascript
import { createStore } from '@coriolis/coriolis'

const currentCount = ({ useState, useEvent }) => (
  useState(0),
  useEvent(),
  (state, event) => {
    switch (event.type) {
      case 'incremented':
        return state + 1

      case 'decremented':
        return state - 1

      default:
        return state
    }
  }
)

createStore(({ withProjection, eventSubject }) => {
  withProjection(currentCount).subscribe(count => console.log(count))
  // 0

  eventSubject.next({ type: 'incremented' })
  // 1

  eventSubject.next({ type: 'incremented' })
  // 2

  eventSubject.next({ type: 'decremented' })
  // 1
})
```

CommonJS:
```javascript
const { createStore } = require('@coriolis/coriolis')

const currentCount = ({ useState, useEvent }) => (
  useState(0),
  useEvent(),
  (state, event) => {
    switch (event.type) {
      case 'incremented':
        return state + 1

      case 'decremented':
        return state - 1

      default:
        return state
    }
  }
)

createStore(({ withProjection, eventSubject }) => {
  withProjection(currentCount).subscribe(count => console.log(count))
  // 0

  eventSubject.next({ type: 'incremented' })
  // 1

  eventSubject.next({ type: 'incremented' })
  // 2

  eventSubject.next({ type: 'decremented' })
  // 1
})
```

## Utilisation

## API documentation

## Plus en détails

Rules about Coriolis

- Un event doit avoir un format standard:

  - un type
  - optionnel: un payload
  - des meta-données (optionnel mais coriolis va systématiquement en ajouter certaines)
  - si c'est une erreur, error: true et payload le detail de l'erreur

- Events du passé

  - Event du passé, joués à l'initialisation du store et alimentant les projections mais sans alimenter leurs
    abonnements ni les effets

- EventSubject

  - Entité interne à Coriolis accessible uniquement indirectement via l'API Effect
  - C'est un Subject selon la terminologie RxJS: entité pouvant à la fois recevoir et émettre des événements
  - Émet un ensemble d'events du passé, PUIS retransmet les events qu'il reçoit
  - Transmet également tous les events qu'il reçoit aux loggers
  - Assure que les events sont valide
  - Assure une protection contre les boucles d'events
  - Assure que chaque event dispose d'un timestamp en meta
  - Fait passer tous les évents par un enhancer (si défini)

- On ne défini pas une projection global unique regroupant l'ensemble des projections (à la redux).
  Pour accéder au contenu d'une projection, on utilise une référence à la définition de cette projection.
  Pour qu'une projection soit alimenté il faut, soit que sa définition est été "connectée", soit
  qu'il y ait des abonements à cette projection.

- Une définition de projection peut prendre deux formes

  - simple sous forme d'un reducer
  - complexe en utilisant l'API projection

- EventStore
  Un eventStore met en relation un eventSubject et des effets

- Définition d'un effet

  - Un effet peut :

    - Ajouter d'autres effets
    - Ajouter une source d'events du passé
    - Ajouter un logger d'events
    - S'abonner aux events du passé
    - S'abonner aux nouveaux events (via eventSubject)
    - Émettre des events (via eventSubject)
      - Émission d'event invalide -> erreur générale
      - Émission d'erreur -> erreur générale
      - Émission d'une complétion de stream rx -> complétion générale, fin du process // WE HAVE TO CHECK IF WE ARE REALLY EXPECTING THIS...
    - S'abonner à une projection
    - Connecter une projection
    - Accéder au contenu d'une projection
    - Récupérer des snapshots (contenu de l'ensemble des projections)

  - Un effet doit retourner une fonction de désactivation

- Définition d'un logger

  - reçoit des events via une méthode next
  - peut être un observable d'event
  - erreur émise par logger -> erreur de eventSubject -> erreur générale

- Définition d'une source d'event du passé

  - peut être un array d'events
  - peut être un observable d'events

  - Doit se compléter pour que le store puisse passer à la suite (le passé est fini)
  - Erreur sur une source -> erreur générale
  - Lorsque toutes les sources d'events du passées sont complétées la relecture du passé est finie
    - Il n'est pas possible de définir une source d'events du passé après que toutes les sources d'events du passé aient étés complétées

- L'instanciation d'un store suit la procédure suivante:

  - mise en cache du premier event non passé
  - mise en cache de tout event émit dans un premier temps
  - diffusion aux projections et aux effets (via l'observable pastEvent\$) des "events du passé"
  - log puis transmission (aux projections et aux effets) des events buffurisés
  - log puis transmission (aux projections et aux effet) des nouveaux events

  - un eventSubject d'effet n'émet donc jamais aucun "event passé"
  - les projections voient passer tous les events, même les "passés"

- La ré-émition tel-quel d'un event émit par eventSubject cause une erreur (prévention de boucle)

- EventBuilder
  - metaBuilder est optionel
  - payloadBuilder est optionel, on peut uniquement définir un type
  - payloadBuilder par défaut est identity

## Définition d'une projection

Quel que soit la forme de définition, Coriolis construira à partir de cette définition un
"aggrégateur" qui pourra être alimenté par les events de l'eventSubject.

### Définition de projection sous forme de reducer:

Pour cette forme, on défini la nouvelle valeur de la projection (nouvel état) à partir de:

- state: dernière valeur de cette projection
- event: dernier evenement emit

### Définition de projection sous forme complexe:

Pour cette forme, on défini dans un premier temps les sources de données nécessaires:

- useState: utiliser la dernière valeur obtenue par cette projection (on peut spécifier une valeur initiale)
- useEvent: utiliser le dernier événement émit (on peut filtrer quels types d'événements on souhaite traiter)
- useProjection/lazyProjection: utiliser la valeur obtenue d'une projection (voir détails plus loin)
- useValue: Utiliser une valeur static (cela est surtout utile pour étendre l'API, voir projections parametrées)
- setName: Attribue un nom à la projection, dans un but de debug et de lisibilité

Ensuite on défini l'algorythme de calcul du résultat en fonction de ces sources de données

#### Pour une meilleur compréhension du fonctionnement

Chaque définition de projection complexe peut être transformée en une définition de projection de type reducer

Ce reducer operera en deux étapes:

- premièrement il collectera les données d'input attendues en fonction de l'event, ce qui revient à exécuter un
  aggregateur de projection pour chaque input
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
l'exécution des processus de projection
