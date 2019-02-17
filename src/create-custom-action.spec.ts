import * as Types from './types';
import { createCustomAction } from './create-custom-action';

it.skip('skip', () => undefined);

describe('toString() method return a type', () => {
  const actionCreator = createCustomAction('TO_STRING');
  // @dts-jest:pass:snap
  actionCreator.toString(); // => 'TO_STRING'
});

describe('with symbol', () => {
  const WITH_SYMBOL = Symbol(1);
  const withSymbol = createCustomAction(WITH_SYMBOL as any);
  // @dts-jest:pass:snap
  withSymbol(); // => { type: WITH_SYMBOL }
});

describe('with type only', () => {
  const increment = createCustomAction('WITH_TYPE_ONLY');
  // @dts-jest:pass:snap
  increment(); // => { type: 'WITH_TYPE_ONLY' }
});

describe('with payload', () => {
  const add = createCustomAction('WITH_PAYLOAD', type => {
    return (amount: number) => ({ type, payload: amount });
  });
  // @dts-jest:pass:snap
  add(1); // => { type: 'WITH_PAYLOAD', payload: 1 }
});

describe('with optional payload', () => {
  const create = createCustomAction('WITH_OPTIONAL_PAYLOAD', type => {
    return (id?: number) => ({ type, payload: id });
  });
  // @dts-jest:pass:snap
  create(); // => { type: 'WITH_OPTIONAL_PAYLOAD' }
  // @dts-jest:pass:snap
  create(1); // => { type: 'WITH_OPTIONAL_PAYLOAD', payload: 1 }
});

describe('with meta', () => {
  const withMeta = createCustomAction('WITH_META', type => {
    return (token: string) => ({ type, meta: token });
  });
  // @dts-jest:pass:snap
  withMeta('token'); // => { type: 'WITH_META', meta: 'token' }
});

describe('with payload and meta', () => {
  const showNotification = createCustomAction(
    'SHOW_NOTIFICATION',
    type => (message: string, scope: string) => ({
      type,
      payload: message,
      meta: scope,
    })
  );
  // @dts-jest:pass:snap
  showNotification('Hello!', 'info'); // => { type: 'SHOW_NOTIFICATION', payload: 'Hello!', meta: 'info' }
});
