import { StringType } from './type-helpers';
export declare function action<T extends StringType, E>(type: T, payload: undefined, meta: undefined, error: E): {
    type: T;
    error: E;
};
export declare function action<T extends StringType, M, E>(type: T, payload: undefined, meta: M, error: E): {
    type: T;
    meta: M;
    error: E;
};
export declare function action<T extends StringType, P, E>(type: T, payload: P, meta: undefined, error: E): {
    type: T;
    payload: P;
    error: E;
};
export declare function action<T extends StringType, P, M, E>(type: T, payload: P, meta: M, error: E): {
    type: T;
    payload: P;
    meta: M;
    error: E;
};
export declare function action<T extends StringType, M>(type: T, payload: undefined, meta: M): {
    type: T;
    meta: M;
};
export declare function action<T extends StringType, P, M>(type: T, payload: P, meta: M): {
    type: T;
    payload: P;
    meta: M;
};
export declare function action<T extends StringType, P>(type: T, payload: P): {
    type: T;
    payload: P;
};
export declare function action<T extends StringType>(type: T): {
    type: T;
};
