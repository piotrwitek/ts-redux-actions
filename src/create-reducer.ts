import { getType } from './get-type';
import {
  checkValidActionCreator,
  checkValidActionType,
  throwInvalidActionTypeOrActionCreator,
} from './utils/validation';
import { Reducer, Action, Types } from './type-helpers';

type HandleActionChainApi<
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
      defaultHandler: HandleDefaultActionChainApi<
        TState,
        TOutputAction,
        TRootAction
      >;
    }
  : Reducer<TState, TRootAction> & {
      handlers: Record<
        TRootAction['type'],
        (state: TState, action: TRootAction) => TState
      >;
    };

type HandleDefaultActionChainApi<
  TState,
  TInputAction extends Action,
  TRootAction extends Action
> = <
  TActionCreator extends (...args: any[]) => TInputAction,
  THandledAction extends ReturnType<TActionCreator>,
  TOutputAction extends Exclude<TInputAction, THandledAction>
>(
  reducer: (state: TState, action: THandledAction) => TState,
  executeAtInitialization?: boolean
) => [TOutputAction] extends [Action]
  ? Reducer<TState, TRootAction> & {
      handlers: Record<
        Exclude<TRootAction, TOutputAction>['type'],
        (state: TState, action: TRootAction) => TState
      >;
    }
  : Reducer<TState, TRootAction> & {
      handlers: Record<
        TRootAction['type'],
        (state: TState, action: TRootAction) => TState
      >;
    };

type HandleTypeChainApi<
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
      defaultHandler: HandleDefaultActionChainApi<
        TState,
        TOutputAction,
        TRootAction
      >;
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
  initialHandlers: InitialHandler<TState, TRootAction> = {},
  defaultReducer?: Reducer<TState, TRootAction>,
  defaultReducerExecutedAtInitialization: boolean = false
) {
  const handlers: any = {
    ...initialHandlers,
  };

  const initializationActionTypes = /@@redux\/INIT.*/;

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
    } else if (
      defaultReducer &&
      (defaultReducerExecutedAtInitialization ||
        (!defaultReducerExecutedAtInitialization &&
          !initializationActionTypes.test(action.type)))
    ) {
      return defaultReducer(state, action);
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

    return createReducer<TState, TRootAction>(
      initialState,
      {
        ...handlers,
        ...newHandlers,
      },
      defaultReducer
    );
  }) as
    | HandleActionChainApi<TState, TRootAction, TRootAction>
    | HandleTypeChainApi<TState, TRootAction, TRootAction>;

  const defaultHandler = ((
    reducer: any,
    executeAtInitialization: boolean = false
  ) => {
    return createReducer<TState, TRootAction>(
      initialState,
      handlers,
      reducer,
      executeAtInitialization
    );
  }) as HandleDefaultActionChainApi<TState, TRootAction, TRootAction>;

  const chainApi = Object.assign(rootReducer, {
    handlers: { ...handlers },
    handleAction: reducerHandler,
    handleType: reducerHandler,
    defaultHandler,
  }) as Reducer<TState, TRootAction> &
    Readonly<{
      handlers: InitialHandler<TState, RootAction>;
      handleAction: [unknown] extends [TRootAction]
        ? any
        : HandleActionChainApi<TState, TRootAction, TRootAction>;
      handleType: [unknown] extends [TRootAction]
        ? any
        : HandleTypeChainApi<TState, TRootAction, TRootAction>;
      defaultHandler: [unknown] extends [TRootAction]
        ? any
        : HandleDefaultActionChainApi<TState, TRootAction, TRootAction>;
    }>;

  return chainApi;
}
