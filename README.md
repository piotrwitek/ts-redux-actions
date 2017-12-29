# typesafe-actions
### Typesafe Action Creators for Redux / Flux Architectures (in TypeScript)

Clean and simple functional API that's specifically designed to reduce repetition and complexity of type annotations in "Redux" and to guarantee complete type-safety.

> This lib is part of [React & Redux TypeScript Guide](https://github.com/piotrwitek/react-redux-typescript-guide). 

- Thoroughly tested both logic and type correctness
- No third-party dependencies
- Semantic Versioning
- Output separate bundles for different workflow needs (es5-commonjs, es5-module, jsnext)

---

## Table of Contents

- [Installation](#installation)
- [Motivation](#motivation)
- [Tutorial](#tutorial)
- [API](#api)
  - [`createAction`](#createaction)
  - [`getType`](#gettype)
  - [`isActionOf`](#isactionof)
- [Compare to others](#compare-to-others)
  - [redux-actions](#redux-actions)

---

## Installation

For NPM users

```bash
$ npm install --save typesafe-actions
```

For Yarn users

```bash
$ yarn add typesafe-actions
```

[⇧ back to top](#table-of-contents)

---

## Motivation

While trying to use [redux-actions](https://redux-actions.js.org/) with TypeScript I wasn't really satisfied because of it's API (separate payload & meta mapping functions) which makes it non-idiomatic with static typing.  
What I mean specifically is that named arguments in returned "action creators" will be renamed to some generic "non-descriptive" arguments like a1, a2, etc..., moreover function arity with optional parameters will break "type soundness" of your function signature.  
In the end it will force you to do an extra effort for explicit type annotations and probably result in even more boilerplate when trying to work around it.

**That's why in `typesafe-actions` I created API specifically designed to retain complete "type soundness" with static-typing of TypeScript.**

[⇧ back to top](#table-of-contents)

---

## Tutorial

To highlight the benefits of type inference leveraged in this solution, let me show you how to handle the most common use-cases found in Redux Architecture:

### create union type of actions (a.k.a. `RootAction`)
```ts
import { getReturnOfExpression } from 'react-redux-typescript';
import { createAction } from 'typesafe-actions';

export const actions = {
  increment: createAction('INCREMENT'),
  add: createAction('ADD', (amount: number) => ({
    type: 'ADD',
    payload: amount,
  })),
};

const returnOfActions =
  Object.values(actions).map(getReturnOfExpression);
type AppAction = typeof returnOfActions[number];

// third-party actions
type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootAction =
  | AppAction
  | ReactRouterAction;
```  

[⇧ back to top](#table-of-contents)

### reducer switch cases
Use `getType` to reduce common boilerplate and to narrow `RootAction` union type to a specific action
```ts
import { getType } from 'typesafe-actions';

import { RootState, RootAction } from '@src/redux';
import { add } from './actions';

const reducer = (state: RootState, action: RootAction) => {
  switch (action.type) {
    case getType(add):
      return state + action.payload; // action is narrowed to a type of "add" action (payload: number)
  ...
```

[⇧ back to top](#table-of-contents)

### epics from `redux-observable`
Use `isActionOf` to narrow `RootAction` union type to a specific action down the stream of actions
```ts
import { isActionOf, isActionOneOf } from 'typesafe-actions';

import { RootState, RootAction } from '@src/redux';
import { addTodo, toggleTodo } from './actions';

// single action
const addTodoToast: Epic<RootAction, RootState> =
  (action$, store) => action$
    .filter(isActionOf(addTodo))
    .concatMap((action) => { // action is asserted as: { type: "ADD_TODO", payload: string }
      const toast = `Added new todo: ${action.payload}`;
...

// multiple actions
const logTodoAction: Epic<RootAction, RootState> =
  (action$, store) => action$
    .filter(isActionOf([addTodo, toggleTodo]))
    .switchMap((action) => { // action is asserted as: { type: "ADD_TODO", payload: string } | { type: "TOGGLE_TODO", payload: string }
      const log = `Dispatched action: ${action.type}`;
...
```

[⇧ back to top](#table-of-contents)

---

## API

### createAction
> creates action creator function with type helper

[> Advanced Usage](src/create-action.spec.ts)

```ts
function createAction(typeString: T, creatorFunction?: CF): CF

// CF extends (...args: any[]) => { type: T, payload?: P, meta?: M, error?: boolean }
```

Examples:
```ts
// no payload
const increment = createAction('INCREMENT');
// same as:
// const increment = createAction('INCREMENT', () => ({ type: 'INCREMENT' }));

expect(increment()).toEqual({ type: 'INCREMENT' });

// with payload
const add = createAction('ADD',
  (amount: number) => ({ type: 'ADD', payload: amount }),
);

expect(add(10)).toEqual({ type: 'ADD', payload: 10 });

// with payload and meta
const notify = createAction('NOTIFY',
  (username: string, message: string) => ({
    type: 'NOTIFY',
    payload: { message: `${username}: ${message}` },
    meta: { username, message },
  }),
);

expect(notify('Piotr', 'Hello!'))
  .toEqual({
    type: 'NOTIFY',
    payload: { message: 'Piotr: Hello!' },
    meta: { username: 'Piotr', message: 'Hello!' },
  });
```

[⇧ back to top](#table-of-contents)

---

### getType
> get "type literal" from action creator

[> Advanced Usage](src/get-type.spec.ts)

```ts
function getType(actionCreator: AC<T>): T

// AC<T> extends (...args: any[]) => { type: T }
```

Examples:
```ts
const increment = createAction('INCREMENT');
const type: 'INCREMENT' = getType(increment);
expect(type).toBe('INCREMENT');

// in reducer
switch (action.type) {
  case getType(increment):
    return state + 1;

  default: return state;
}
```

[⇧ back to top](#table-of-contents)

---

### isActionOf
> assert specific action from union type

[> Advanced Usage](src/is-action-of.spec.ts)

```ts
function isActionOf(actionCreator: AC<T>): (action: any) => action is T
function isActionOf(actionCreators: AC<T>[]): (action: any) => action is T

// AC<T> extends (...args: any[]) => T
```

Examples:
```ts
// in epics
import { addTodo } from './actions';
const addTodoToast: Epic<RootAction, RootState> =
  (action$, store) => action$
    .filter(isActionOf(addTodo))
    .concatMap((action) => { // action is asserted as addTodo Action Type
      const toast = `Added new todo: ${action.payload}`;

// multiple actions
import { addTodo, toggleTodo } from './actions';
const logTodoAction: Epic<RootAction, RootState> =
  (action$, store) => action$
    .filter(isActionOf([addTodo, toggleTodo]))
    .concatMap((action) => { // action is asserted as: { type: "ADD_TODO", payload: string } | { type: "TOGGLE_TODO", payload: string }
      const log = `Dispatched action: ${action.type}`;
...
```
```

[⇧ back to top](#table-of-contents)

---

## Compare to others
Here you can find out the differences compared to other solutions.

### `redux-actions`
> tested with "@types/redux-actions": "2.2.3"

#### no payload
```ts
const notify1 = createAction('NOTIFY')
// resulting type:
// const notify1: () => {
//   type: string;
//   payload: void | undefined;
//   error: boolean | undefined;
// }
```
> with `redux-actions` notice excess "nullable" properties `payload` and `error`, also the action `type` property is widened to string (🐼 is really sad!)

- typesafe-actions
```ts
const notify1 = createAction('NOTIFY')
// resulting type:
// const notify1: () => {
//   type: "NOTIFY";
// }
```
> with `typesafe-actions` there is no nullable types, only the data that is really there, also the action "type" property is correct narrowed to literal type (great success!)


#### with payload
```ts
// redux-actions
const notify2 = createAction('NOTIFY',
  (username: string, message?: string) => ({
    message: `${username}: ${message || ''}`
  })
)
// resulting type:
// const notify2: (t1: string) => {
//   type: string;
//   payload: { message: string; } | undefined;
//   error: boolean | undefined;
// }
```
> notice the missing optional `message` parameter in resulting function also `username` param name is changed to `t1`, action `type` property is widened to string and incorrect nullable properties

- typesafe-actions
```ts
const notify2 = createAction('NOTIFY',
  (username: string, message?: string) => ({
    type: 'NOTIFY'
    payload: { message: `${username}: ${message || ''}` },
  })
)
// resulting type:
// const notify2: (username: string, message?: string | undefined) => {
//   type: "NOTIFY";
//   payload: { message: string; };
// }
```
> `typesafe-actions` retain complete type soundness

#### with payload and meta
- redux-actions
```ts
const notify3 = createAction('NOTIFY',
  (username: string, message?: string) => ({ message: `${username}: ${message || ''}` }),
  (username: string, message?: string) => ({ username, message })
)
// resulting type:
// const notify3: (...args: any[]) => {
//   type: string;
//   payload: { message: string; } | undefined;
//   meta: { username: string; message: string | undefined; };
//   error: boolean | undefined;
// }
```
> notice complete loss of arguments arity and types in resulting function, moreover action `type` property is again widened to string with nullable `payload` and `error`

- typesafe-actions
```ts
const notify3 = createAction('NOTIFY',
    (username: string, message?: string) => ({
      type: 'NOTIFY',
      payload: { message: `${username}: ${message || ''}` },
      meta: { username, message },
    }),
  )
// resulting type:
// const notify3: (username: string, message?: string | undefined) => {
//   type: "NOTIFY";
//   payload: { message: string; };
//   meta: { username: string; message: string | undefined; };
// }
```
> `typesafe-actions` makes 🐼 happy once again

[⇧ back to top](#table-of-contents)

---

MIT License

Copyright (c) 2017 Piotr Witek <piotrek.witek@gmail.com> (http://piotrwitek.github.io)
