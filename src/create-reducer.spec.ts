import * as T from './type-helpers'; // type-tests global
import { ActionType } from './type-helpers';
import { createStandardAction } from './create-standard-action';
import { createReducer } from './create-reducer';
import { getType } from './get-type';

const add = createStandardAction('ADD')<number>();
const increment = createStandardAction('INCREMENT')();
const decrement = createStandardAction('DECREMENT')();
const actions = {
  add,
  increment,
  decrement,
};

declare module './type-helpers' {
  interface Types {
    RootAction: ActionType<typeof actions>;
  }
}

const initialState = 0;

// @dts-jest:group With Action Creators
{
  const emptyReducer = createReducer(initialState);

  const counterReducer1 = emptyReducer.handleAction(
    [add, increment],
    (state, action) => state + (action.type === 'ADD' ? action.payload : 1)
  );
  // @dts-jest:pass:snap
  counterReducer1.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer1.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  const counterReducer2 = emptyReducer
    .handleAction([add], (state, action) => state + action.payload)
    .handleAction([increment], (state, _) => state + 1);
  // @dts-jest:pass:snap
  counterReducer2.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer2.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  const counterReducer3 = emptyReducer.handleAction(
    add,
    (state, action) => state + action.payload
  );
  // @dts-jest:pass:snap
  counterReducer3.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer3.handlers }); // => [ "ADD"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  const counterReducer4 = emptyReducer.handleAction(
    increment,
    (state, _) => state + 1
  );
  // @dts-jest:pass:snap
  counterReducer4.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer4.handlers }); // => [ "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  {
    [
      counterReducer1,
      counterReducer2,
      createReducer(initialState, {
        [getType(add)]: counterReducer3.handlers.ADD,
        [getType(increment)]: counterReducer4.handlers.INCREMENT,
      }),
      createReducer(initialState, {
        [getType(add)]: (state: any, action: any) => state + action.payload,
        [getType(increment)]: (state: any, _: any) => state + 1,
      }),
      createReducer<number, ActionType<typeof actions>>(initialState, {
        [getType(add)]: (state: any, action: any) => state + action.payload,
        [getType(increment)]: (state: any, _: any) => state + 1,
      }),
    ].forEach(fn => {
      // @dts-jest:pass
      fn(0, {} as any); // => 0
      // @dts-jest:pass
      fn(0, increment()); // => 1
      // @dts-jest:pass
      fn(0, add(4)); // => 4
    });
  }
}

// @dts-jest:group Type refinement checks
{
  type State = {
    foo: string | null;
  };

  const defaultState: State = {
    foo: null,
  };

  const actions2 = {
    foo1: createStandardAction('foo1')<string>(),
    foo2: createStandardAction('foo2')<string>(),
    foo3: createStandardAction('foo3')(),
    foo4: createStandardAction('foo4')(),
  };

  type Action = ActionType<typeof actions2>;

  const reducer = createReducer<State, Action>(defaultState)
    .handleAction(actions2.foo1, (state, action) => {
      // @dts-jest:pass:snap
      state;
      // @dts-jest:pass:snap
      action;

      return {
        ...state,
        foo: action.payload,
      };
    })
    .handleAction(actions2.foo2, (state, action) => {
      // @dts-jest:pass:snap
      state;
      // @dts-jest:pass:snap
      action;

      return {
        ...state,
        foo: action.payload,
      };
    })
    .handleAction(actions2.foo3, (state, action) => {
      // @dts-jest:pass:snap
      state;
      // @dts-jest:pass:snap
      action;

      return {
        ...state,
        foo: 'empty',
      };
    })
    .handleAction(actions2.foo4, (state, action) => {
      // @dts-jest:pass:snap
      state;
      // @dts-jest:pass:snap
      action;

      return {
        ...state,
        foo: 'empty',
      };
    });

  // @dts-jest:pass:snap
  reducer.handlers;

  {
    [
      reducer(defaultState, actions2.foo1('check')),
      reducer(defaultState, actions2.foo2('check')),
    ].forEach(reducerResult => {
      // @dts-jest:pass:snap
      reducerResult; // => { foo: "check" }
    });

    [
      reducer(defaultState, actions2.foo3()),
      reducer(defaultState, actions2.foo4()),
    ].forEach(reducerResult => {
      // @dts-jest:pass:snap
      reducerResult; // => { foo: "empty" }
    });
  }
}

// @dts-jest:group With Action Types
{
  const reducerTest = createReducer(initialState);

  const counterReducer1 = reducerTest.handleAction(
    ['ADD', 'INCREMENT'],
    (state, action) => state + (action.type === 'ADD' ? action.payload : 1)
  );
  // @dts-jest:pass:snap
  counterReducer1.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer1.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer2 = reducerTest
    .handleAction(['ADD'], (state, action) => state + action.payload)
    .handleAction(['INCREMENT'], (state, _) => state + 1);
  // @dts-jest:pass:snap
  counterReducer2.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer2.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer3 = reducerTest.handleAction(
    'ADD',
    (state, action) => state + action.payload
  );
  // @dts-jest:pass:snap
  counterReducer3.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer3.handlers }); // => ["ADD"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer4 = reducerTest.handleAction(
    'INCREMENT',
    (state, _) => state + 1
  );
  // @dts-jest:pass:snap
  counterReducer4.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer4.handlers }); // => [ "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  {
    [
      counterReducer1,
      counterReducer2,
      createReducer(initialState, {
        ADD: counterReducer3.handlers.ADD,
        INCREMENT: counterReducer4.handlers.INCREMENT,
      }),
      createReducer(initialState, {
        ADD: (state, action) => state + action.payload,
        INCREMENT: (state, action) => state + 1,
      }),
      createReducer<number, ActionType<typeof actions>>(initialState, {
        ADD: (state, action) => state + action.payload,
        INCREMENT: (state, action) => state + 1,
      }),
    ].forEach(fn => {
      // @dts-jest:pass
      fn(0, {} as any); // => 0
      // @dts-jest:pass
      fn(0, increment()); // => 1
      // @dts-jest:pass
      fn(0, add(4)); // => 4
    });
  }
}
