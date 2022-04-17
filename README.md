# <img src='https://user-images.githubusercontent.com/67515/79127184-b6e6b100-7da1-11ea-96c7-c6e17e152ede.png' height='40' alt='Coriolis logo' aria-label='Coriolis' /> Coriolis

![latest version](https://img.shields.io/npm/v/@coriolis/coriolis?style=flat-square)
![license](https://img.shields.io/npm/l/@coriolis/coriolis?style=flat-square)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/coriolisjs/coriolis.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/coriolisjs/coriolis/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/coriolisjs/coriolis.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/coriolisjs/coriolis/context:javascript)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4144c518ea0d4ef8af2d8061c94e6788)](https://www.codacy.com/gh/coriolisjs/coriolis?utm_source=github.com&utm_medium=referral&utm_content=coriolisjs/coriolis&utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/coriolisjs/coriolis/badge.svg?targetFile=package.json)](https://snyk.io/test/github/coriolisjs/coriolis?targetFile=package.json)

English documentation coming soon, any help welcome :wink:

## Qu'est-ce que c'est ?

Coriolis est une librairie Javascript permettant de mettre en place un **store d'events** alimentant des **effets** s'appuyant sur des **projections** (une projection est un état déduit de différents **events**)

Cette librairie vous aidera à créer vos applications selon les concepts d'Event Sourcing et de Domain Driven Design.

Cette approche aide à obtenir une application au comportement prédictible, modulaire, évolutif et debuggable.
Elle permet entre autre de distinguer proprement différentes typologies de logiques:

- organisation des données
- comportement
- interface utilisateur
  ...

## Influences

La conception de Coriolis a été inspirée par Redux, en cherchant à donner le rôle de **single source of truth** non pas au state mais au flux d'events, et ainsi rejoindre le concept d'Event Sourcing.

## Installation

:information_source: Le cycle de vie respectera (dès la période alpha finie) la [logique de version semver](https://semver.org/lang/fr/)

Pour installer Coriolis:

```javascript
npm install --save @coriolis/coriolis
```

Le module est fourni sous deux formes: CommonJS ou ES modules.

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
  withProjection(currentCount).subscribe((count) => console.log(count))
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
  withProjection(currentCount).subscribe((count) => console.log(count))
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

Un event doit représenter de manière factuelle une variation ayant eu lieu dans l'application. Ces informations factuelles sont donc immuables (ce fait a eu lieu, cela ne peut pas changer). L'accumulation de ces faits immuables sera la source de toute vérité dans notre application et garantira une lisibilité et une grande capacité d'évolution.

:joke_icon: Un event pourrait aussi être désigné comme un fait. Event sourcing pourrait être traduit en français par programation par les fait.

Étant donné qu'un event représente une variation ayant eu lieu, il est préférable de toujours nommer les events sous forme d'un verbe au passé.

Un event est un simple objet respectant les critères suivant:

- un type
- une valeur utile, ou "payload" (optionel)
- des méta-données (optionel)
- un indicatif d'erreur booléen (si true, le payload devrait être l'erreur correspondant)

Voici donc des events valides:

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

Très simple. Mais il vous sera rapidement nécessaire de créer des fonctions de création d'event, de pouvoir référencer les
types de ces events, de paramétrer la définition du payload ou des meta de ces events.

Vous aurez donc besoin de `createEventBuilder`:

```javascript
// {!examples/readme-samples/events.js}

import { createEventBuilder } from '@coriolis/coriolis'

export const createMinimumEvent = createEventBuilder('sent a minimal event')

export const createSimpleEvent = createEventBuilder(
  'sent a simple event',
  ({ message }) => message,
  ({ sender }) => sender && { sender },
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
  sender: 'Nico',
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

### Définition d'une commande

Nous avons vu la création d'objets events. Il faut maintenant s'intéresser aux règles métier aboutissant à la création de ces events.

L'exemple classique est lors d'une action utilisateur: Avant d'aboutir à un event, il est sûrement nécessaire de faire quelques validations. Ces validations suivent des règles métier que votre application doit prendre en charge, c'est donc une part essentielle de votre code source.

Il est important d'écrire ces règles de manière claire et isolée. C'est le rôle des commandes.

Une comande est une simple fonction destinée à créer (ou non) des events. Cette fonction peut être asynchrone (peut retourner une promesse ou un Observable) et aboutie à un ou plusieurs events (ou commandes).

```javascript
// {!examples/readme-samples/commands.js}

import { incremented } from './events'
import { currentCount } from './projections'

const arrayOf = (length, builder) => Array.from({ length }).map(builder)

export const double = ({ getProjectionValue }) => {
  const count = getProjectionValue(currentCount)

  return arrayOf(count, incremented)
}
```

Une commande sera exécutée en respectant l'ordre d'émission dans le flux d'events. Donc les events émis en synchrone par une commande se positionneront à la place de cette commande dans le flux d'events.

#### API des commandes

Lors de son exécution, une commande recevra en paramètre les fonctions suivantes:

- getProjectionValue(projection): cette fonction retourne la valeur courante de la projection donnée
- addEffect(effect): cette fonction permet d'activer un effet par le biais d'une commande (voir définition des effets plus bas)

Une commande doit retourner un event, un tableau d'events, une promesse d'event ou un observable d'events.
Dans tous ces cas il est également possible de retourner d'autres commandes plutôt que des events.

### Définition d'une projection

Une projection permet de construire un état (un jeu de données) collecté à partir des events d'un event store.
Cet état pourra être utilisé dans des effets, des commandes, ou pour construire d'autres projections.

Pour définir une projection, on commence par préciser les sources de données nécessaires à la projection.
Pour cela un ensemble d'outils est à notre disposition, nous permettant de définir les paramètres que la projection attend:

- useState: utiliser la dernière valeur obtenue par cette projection (on peut spécifier une valeur initiale)
- useEvent: utiliser le dernier événement émis (on peut filtrer quels types d'événements on souhaite traiter)
- useProjection: utiliser la valeur obtenue d'une projection (voir détails plus loin)
- useValue: Utiliser une valeur statique (cela est surtout utile pour étendre l'API, voir projections paramétrées)
- setName: Attribue un nom à la projection, dans un but de debug et de lisibilité

Ensuite on défini l'algorythme de rangement des données en utilisant ces sources de données.

Ce code est incomplet mais présente le format de définition d'une projection:

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
  (count, { type }) => (type === incremented.toString() ? count + 1 : count - 1)
)

export const eventsNumber = ({ useState, useEvent }) => (
  // Let's start counting from 0
  useState(0),
  // needs each event just to trigger the projection
  useEvent(),
  (state) => state + 1
)

export const lastEventType = ({ useEvent }) => (
  // For this projection, no need for a state, just events
  useEvent(), (event) => event.type
)

export const moreComplexProjection = ({ useProjection }) => (
  useProjection(currentCount),
  useProjection(eventsNumber),
  useProjection(lastEventType),
  (currentCountValue, eventsNumber, lastType) => ({
    currentCountValue,
    eventsNumber,
    lastType,
  })
)
```

Vous noterez que dans la définition d'une projection on utilise une syntaxe un peu particulière utilisant le concept de séquence avec l'opérateur ",".

Dans une séquence, un ensemble d'instruction est exécutée, mais seule la dernière est retournée. C'est exactement ce que nous souhaitons pour une projection: exécuter des instructions de configuration de la projection, mais ne retourner que la fonction définissant cette projection.

Pour les utilisateurs d'eslint, il sera alors probablement nécessaire de désactiver la règle no-sequence quand vous utilisez coriolis.

Pour résumer, lors de la définition d'une projection on commence par décrire les données dont on a besoin, et ensuite on définit la
fonction qui, avec ces données, va construire un nouvel état.

Il reste sûrement bien des choses à dire sur les fonctions de projection. Ça viendra bientôt.

### Définition d'un effet

Un effet est définit par une fonction recevant en paramètre les outils suivants :

- addSource
- addLogger
- addEventEnhancer
- addPastEventEnhancer
- addAllEventsEnhancer
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
  withProjection(currentCount).subscribe(
    (count) => console.log('Current count', count),
    // Immediately logs "Current count 0", than other count values on each change
  )
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

- La définition d'une commande permet de qualifier la logique de comportement d'une manière claire

- La définition d'un effet peut faire appel à d'autres effets, favorisant ainsi une construction modulaire.

- La définition d'un effet a accès directement à toute projection et tout event (passé ou nouveau), et peut invoquer des events passés, déclarer de nouveaux events, appliquer des stratégies de stockage d'events et ajouter d'autres effets

## Crédits

[Icon made by Freepik from www.flaticon.com](https://www.flaticon.com/authors/freepik)
