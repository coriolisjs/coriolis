# Coriolis

English documentation coming soon

## Qu'est-ce que c'est ?

Coriolis est une librairie Javascript permettant de mettre en place un *store d'events* alimentant des *effets* s'appuyant sur des *projections* (une projection est un état déduit de différents *events*)

Cette librairie vous aidera à créer vos applications selon les concepts d'Event Sourcing et de Domain Driven Design.

Cette approche aide à obtenir une application au comportement prédictible, modulaire, évolutif et debuggable.
Elle permet entre autre de distinguer proprement différentes typologies de logiques:

- organisation des données
- comportement
- interface utilisateur
  ...

## Influences

La conception de Coriolis a été inspirée par Redux, en cherchant à donner le rôle de *single source of truth* non pas au state mais au flux d'events, et ainsi rejoindre le concept d'Event Sourcing.

## Installation

Pour installer Coriolis:

```javascript
npm install --save @coriolis/coriolis
```

Le module est fourni sous deux formes: CommonJS ou ES modules, suivant la manière dont vous le chargez

ESModule:

```javascript
// {!examples/count-esmodule/entry.js}

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

createStore(({ withProjection, dispatch }) => {
  withProjection(currentCount).subscribe(count => console.log(count))
  // 0

  dispatch({ type: 'incremented' })
  // 1

  dispatch({ type: 'incremented' })
  // 2

  dispatch({ type: 'decremented' })
  // 1
})

```

CommonJS:

```javascript
// {!examples/count-comonjs/entry.js}

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

createStore(({ withProjection, dispatch }) => {
  withProjection(currentCount).subscribe(count => console.log(count))
  // 0

  dispatch({ type: 'incremented' })
  // 1

  dispatch({ type: 'incremented' })
  // 2

  dispatch({ type: 'decremented' })
  // 1
})

```

## Utilisation

### Définition d'un event

Un event est un simple objet respectant les critères suivant:

- un type
- une valeur utile, ou "payload" (optionel)
- des méta-données (optionel)
- un indicatif d'erreur booléen (si true, le payload devrait être l'erreur correspondant)

Voici donc des events valide:

```javascript
const minimum = { type: 'sent a minimal event' }

const simple = {
  type: 'sent a simple event',
  payload: 'simple'
}

const simpleError = {
  type: 'sent a simple event',
  payload: new Error('Could not be that simple'),
  error: true
}

const withMeta = {
  type: 'sent a simple event',
  payload: 'answer me if you got it'
  meta: {
    // note that using meta for this data could be a wrong idea, let's keep this place only for meta-data
    sender: 'Nico'
  }
}

```

Très simple. Mais il vous sera rapidement necessaire de créer des fonctions de création d'event, de pouvoir référencer les
types de ces events, de parametrer la définition du payload ou des meta de ces events.

Vous aurez donc besoin de `createEventBuilder`:

```javascript
// {!examples/readme-samples/events.js}

import { createEventBuilder } from '@coriolis/coriolis'

export const createMinimumEvent = createEventBuilder('sent a minimal event')

export const createSimpleEvent = createEventBuilder(
  'sent a simple event',
  ({ message }) => message,
  ({ sender }) => sender && { sender }
)

export const incremented = createEventBuilder('user incremented count')
export const decremented = createEventBuilder('user decremented count')

```

```javascript
createMinimumEvent()
// {
//   type: 'sent a minimal event'
// }

createSimpleEvent({ message: 'simple' })
// {
//   type: 'sent a simple event',
//   payload: 'simple'
// }

createSimpleEvent({ message: new Error('Could not be that simple') })
// {
//   type: 'sent a simple event',
//   payload: <Error: 'Could not be that simple'>,
//   error: true
// }

createSimpleEvent({
  message: 'answer me if you got it',
  sender: 'Nico'
})
// {
//   type: 'sent a simple event',
//   payload: 'answer me if you got it',
//   meta: {
//     sender: 'Nico'
//   }
// }

createMinimumEvent.toString()
// 'sent a minimal event'

createSimpleEvent.toString()
// 'sent a simple event'

```

Les builder d'event créés par `createEventBuilder` exposent le type d'event associé via la méthode `toString()`. Il est donc facile d'utiliser ces types d'events dans une projection par exemple.

`createEventBuilder` est très fortement inspiré de [redux-actions](https://github.com/redux-utilities/redux-actions)


## Définition d'une projection

Une projection permet de recueillir des données provenant des events afin de disposer de toutes les données nécessaire pour ensuite définir les comportements de votre application dans les effets.

On défini dans un premier temps les sources de données nécessaires à la projection:

- useState: utiliser la dernière valeur obtenue par cette projection (on peut spécifier une valeur initiale)
- useEvent: utiliser le dernier événement émit (on peut filtrer quels types d'événements on souhaite traiter)
- useProjection/lazyProjection: utiliser la valeur obtenue d'une projection (voir détails plus loin)
- useValue: Utiliser une valeur static (cela est surtout utile pour étendre l'API, voir projections parametrées)
- setName: Attribue un nom à la projection, dans un but de debug et de lisibilité

Ensuite on défini l'algorythme de rangement des données en utilisant ces sources de données.

Ce code est incorrecte mais présente le format de définition d'une projection:

```javascript
const projection = ({ setName, useState, useEvent, useProjection }) => (
  setName('A custom name for this projection'), // Naming a projection is optional, usefull sometimes for debug
  useState({}), // Using a state is not mandatory, but it is usually necessary
  useEvent(), // You'll need to get events in at least one projection
  useProjection(anyProjection), // other projections are aggregating great states, let's use those

  // Here comes the function that defines the projection
  // This function will receive all we defined above
  (state, event, anyProjectionCurrentValue) => {
    // Build a great data structure with data I got
    // and return it as the current value of that projection
  }
)
```

Petits exemples de projections de différents types:

```javascript
// {!examples/readme-samples/projections.js}

import { incremented, decremented } from './events'

export const currentCount = ({ useState, useEvent }) => (
  // Initial value for state should be defined here
  useState(0),
  // Here we filter events we will get
  useEvent(incremented, decremented),
  (count, { type }) => type === incremented.toString()
    ? count + 1
    : count - 1
)

export const eventsNumber = ({ useState, useEvent }) => (
  // Let's start counting from 0
  useState(0),
  // needs each event just to trigger the projection
  useEvent(),
  state => state + 1
)

export const lastEventType = ({ useEvent }) => (
  // For this projection, no need for a state, just events
  useEvent(),
  event => event.type
)

export const moreComplexProjection = ({ useProjection }) => (
  useProjection(currentCount),
  useProjection(eventsNumber),
  useProjection(lastEventType),
  (currentCountValue, eventsNumber, lastType) => ({
    currentCountValue,
    eventsNumber,
    lastType
  })
)

```

Il faudrait ici expliquer le choix du format de définition des fonctions de projection. Ça viendra bientôt.


### Définition d'un effet

Un effet est défini par une fonction recevant en paramètre les outils suivant:

- addSource
- addLogger
- pastEvent\$
- event\$
- dispatch
- withProjection
- addEffect

Cette fonction sera en charge de définir le comportement de l'application en fonction des events et des projections qu'elle utilisera.

```javascript
// {!examples/readme-samples/effects.js}

import { currentCount } from './projections'
import { incremented, decremented } from './events'
import { double } from './commands'

export const myDisplayEffect = ({ withProjection }) => {
  withProjection(currentCount).subscribe(count => console.log('Current count', count))
  // Immediately logs "Current count 0", than other count values on each change
}

export const myUserEffect = ({ dispatch }) => {
  dispatch(incremented())
  // Current count 1

  dispatch(incremented())
  // Current count 2

  dispatch(double)
  // Current count 3
  // Current count 4

  dispatch(decremented())
  // Current count 3
}

```

## Motivations

Une motivation majeur avec Coriolis est d'aider à construire un code d'application lisible, en cherchant à se focaliser sur l'expression des logiques du domaine métier. Cela se manifeste à plusieurs niveaux:

- La définition d'une projection est réduite à sa plus simple expression: de quoi elle a besoin et la logique de rangement des données.

- La définition d'un effet peut faire appel à d'autres effets, favorisant ainsi une construction modulaire.

- La définition d'un effet a accès directement à toute projection et tout event (passé ou nouveau), et peut invoquer des events passés, déclarer de nouveaux events, appliquer des stratégies de stockage d'events et ajouter d'autres effets



## A la suite, un ensemble de brouillon qu'il reste à clarifier (coming as soon as possible)

## API documentation

## Plus en détails

### Projection

Pour expliquer le fonctionnement des projection:

Coriolis construira à partir de la définition d'une projection un
"aggrégateur" qui pourra être alimenté par les events de l'eventSubject.

### Some rules about Coriolis

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

- Une définition de projection se fait par l'intermediaire d'une API dédiée

- EventStore
  Un eventStore met en relation un eventSubject et des effets

- Définition d'un effet

  - Un effet peut :

    - Ajouter d'autres effets
    - Ajouter une source d'events du passé
    - Ajouter un logger d'events
    - S'abonner aux events du passé
    - S'abonner aux nouveaux events
    - Émettre des events
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

  - les projections voient passer tous les events, même les "passés"

- La ré-émition tel-quel d'un event cause une erreur (prévention de boucle)

- EventBuilder
  - metaBuilder est optionnel
  - payloadBuilder est optionnel, on peut uniquement définir un type
  - payloadBuilder par défaut est identity


### Définition de projection sous forme de reducer:

Pour cette forme, on défini la nouvelle valeur de la projection (nouvel état) à partir de:

- state: dernière valeur de cette projection
- event: dernier evenement emit

Pour ce faire, il faut utiliser un helper "fromReducer" permettant de

#### Pour une meilleur compréhension du fonctionnement

Chaque définition de projection peut être transformée en une définition de projection de type reducer

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
