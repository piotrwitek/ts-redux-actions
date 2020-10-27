import { getType } from './get-type';
import {
  checkValidActionCreator,
  checkValidActionType,
  throwInvalidActionTypeOrActionCreator,
} from './utils/validation';
import { Reducer, Action, Types } from './type-helpers';

export type HandleActionChainApi<
  TState,
  TInputAction extends Action,
  TRootAction extends Action
> = <
  TActionCreator extends (...args: any[]) => TInputAction,
  THandledAction extends ReturnType<TActionCreator>,
  TOutputAction extends Exclude<TInputAction, THandledAction>
>(
  singleOrMultipleCreatorsAndTypes: TActionCreator | TActionCreator[],
  reducer: (state: TState, action: THandledAction) => TState
) => [TOutputAction] extends [Action]
  ? Reducer<TState, TRootAction> & {
      handlers: Record<
        Exclude<TRootAction, TOutputAction>['type'],
        (state: TState, action: TRootAction) => TState
      >;
      handleAction: HandleActionChainApi<TState, TOutputAction, TRootAction>;
    }
  : Reducer<TState, TRootAction> & {
      handlers: Record<
        TRootAction['type'],
        (state: TState, action: TRootAction) => TState
      >;
    };

export type HandleTypeChainApi<
  TState,
  TInputAction extends Action,
  TRootAction extends Action
> = <
  TType extends TInputAction['type'],
  THandledAction extends Extract<TInputAction, Action<TType>>,
  TOutputAction extends Exclude<TInputAction, THandledAction>
>(
  singleOrMultipleCreatorsAndTypes: TType | TType[],
  reducer: (state: TState, action: THandledAction) => TState
) => [TOutputAction] extends [Action]
  ? Reducer<TState, TRootAction> & {
      handlers: Record<
        Exclude<TRootAction, TOutputAction>['type'],
        (state: TState, action: TRootAction) => TState
      >;
      handleType: HandleTypeChainApi<TState, TOutputAction, TRootAction>;
    }
  : Reducer<TState, TRootAction> & {
      handlers: Record<
        TRootAction['type'],
        (state: TState, action: TRootAction) => TState
      >;
    };

type GetAction<
  TAction extends Action,
  TType extends TAction['type']
> = TAction extends Action<TType> ? TAction : never;

type InitialHandler<TState, TRootAction extends Action> = {
  [P in TRootAction['type']]?: (
    state: TState,
    action: GetAction<TRootAction, P>
  ) => TState;
};

type RootAction = Types extends { RootAction: infer T } ? T : any;

export function createReducer<TState, TRootAction extends Action = RootAction>(
  initialState: TState,
  initialHandlers: InitialHandler<TState, TRootAction> = {}
) {
  const handlers: any = {
    ...initialHandlers,
  };

  const rootReducer: Reducer<TState, TRootAction> = (
    state = initialState,
    action: TRootAction
  ) => {
    if (handlers.hasOwnProperty(action.type)) {
      const reducer = handlers[action.type];
      if (typeof reducer !== 'function') {
        throw Error(
          `Reducer under "${action.type}" key is not a valid reducer`
        );
      }
      return reducer(state, action);
    } else {
      return state;
    }
  };

  const reducerHandler = ((
    singleOrMultipleCreatorsAndTypes: any,
    reducer: any
  ) => {
    const creatorsAndTypes = Array.isArray(singleOrMultipleCreatorsAndTypes)
      ? singleOrMultipleCreatorsAndTypes
      : [singleOrMultipleCreatorsAndTypes];

    const newHandlers: typeof handlers = {};

    creatorsAndTypes
      .map(
        (
          acOrType: TRootAction['type'] | ((...args: any[]) => TRootAction),
          index
        ) =>
          checkValidActionCreator(acOrType)
            ? getType(acOrType)
            : checkValidActionType(acOrType)
            ? acOrType
            : throwInvalidActionTypeOrActionCreator(index + 1)
      )
      .forEach(type => (newHandlers[type] = reducer));

    return createReducer<TState, TRootAction>(initialState, {
      ...handlers,
      ...newHandlers,
    });
  }) as
    | HandleActionChainApi<TState, TRootAction, TRootAction>
    | HandleTypeChainApi<TState, TRootAction, TRootAction>;

  const chainApi = Object.assign(rootReducer, {
    handlers: { ...handlers },
    handleAction: reducerHandler,
    handleType: reducerHandler,
  }) as Reducer<TState, TRootAction> &
    Readonly<{
      handlers: InitialHandler<TState, RootAction>;
      handleAction: [unknown] extends [TRootAction]
        ? any
        : HandleActionChainApi<TState, TRootAction, TRootAction>;
      handleType: [unknown] extends [TRootAction]
        ? any
        : HandleTypeChainApi<TState, TRootAction, TRootAction>;
    }>;

  return chainApi;
}
