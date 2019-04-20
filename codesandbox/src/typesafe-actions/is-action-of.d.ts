import { TypeMeta } from './type-helpers';
export declare type ActionCreator<T extends {
    type: string;
}> = ((...args: any[]) => T) & TypeMeta<T['type']>;
export declare function isActionOf<AC extends ActionCreator<{
    type: string;
}>>(actionCreator: AC | AC[], action: {
    type: string;
}): action is ReturnType<AC>;
export declare function isActionOf<AC extends ActionCreator<{
    type: string;
}>>(actionCreator: AC | AC[]): (action: {
    type: string;
}) => action is ReturnType<AC>;
