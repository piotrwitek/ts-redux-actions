import { PayloadAction } from '.';

export type ActionCreatorFunction<TS extends string> =
  | ((...args: any[]) => { type: TS, payload?: any, meta?: any, error?: boolean });

export type TSActionCreator<AC, T extends string> = AC & {
  readonly type: T,
};

export function createAction<TS extends string, AC extends (() => { type: TS })>(
  typeString: TS,
): TSActionCreator<AC, TS>;

export function createAction<TS extends string, AC extends ActionCreatorFunction<TS>>(
  typeString: TS,
  creatorFunction: AC,
): TSActionCreator<AC, TS>;

export function createAction<TS extends string, AC extends ActionCreatorFunction<TS>>(
  typeString: TS,
  creatorFunction?: AC,
): TSActionCreator<AC, TS> {
  if (creatorFunction) {
    if (typeof creatorFunction !== 'function') {
      throw new Error('second argument is not a function');
    }

    const actionCreator: any = creatorFunction;
    actionCreator.type = typeString;

    return actionCreator;
  } else {
    const actionCreator: any =
      () => ({ type: typeString });
    actionCreator.type = typeString;

    return actionCreator;
  }
}

export function createPayloadAction<TS extends string, T extends {}>(typeString: TS, props: T) {
    function creator(val: T): PayloadAction<TS, T> {
       return {
         type: typeString,
         payload: {...props as object, ...val as object} as T,
       };
    }
    return createAction(typeString, creator);
  }
