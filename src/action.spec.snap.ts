import * as Types from './types';
import { action } from './action';

it.skip('skip', () => undefined);

describe('with symbol', () => {
  const WITH_SYMBOL = Symbol(1);
  const withSymbol = () => action(WITH_SYMBOL as any);
  // @dts-jest:pass:snap -> { type: any; }
  withSymbol(); // => { type: WITH_SYMBOL }
});

describe('with type only', () => {
  const showNotification = () => action('SHOW_NOTIFICATION');
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; }
  showNotification(); // => { type: 'SHOW_NOTIFICATION' }
});

describe('with payload', () => {
  const showNotification = (message: string) =>
    action('SHOW_NOTIFICATION', message);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; payload: string; }
  showNotification('Hello!'); // => { type: 'SHOW_NOTIFICATION',payload: 'Hello!' }
});

describe('with optional payload', () => {
  const showNotification = (message?: string) =>
    action('SHOW_NOTIFICATION', message);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; payload: string | undefined; }
  showNotification(); // => { type: 'SHOW_NOTIFICATION' }
});

describe('with meta', () => {
  const showNotification = (scope: string) =>
    action('SHOW_NOTIFICATION', undefined, scope);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; meta: string; }
  showNotification('info'); // => { type: 'SHOW_NOTIFICATION', meta: 'info' }
});

describe('with optional meta', () => {
  const showNotification = (scope?: string) =>
    action('SHOW_NOTIFICATION', undefined, scope);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; meta: string | undefined; }
  showNotification(); // => { type: 'SHOW_NOTIFICATION' }
});

describe('with payload and meta', () => {
  const showNotification = (message: string, scope: string) =>
    action('SHOW_NOTIFICATION', message, scope);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; payload: string; meta: string; }
  showNotification('Hello!', 'info'); // => { type: 'SHOW_NOTIFICATION', payload: 'Hello!', meta: 'info' }
});

describe('with optional payload and meta', () => {
  const showNotification = (scope: string, message?: string) =>
    action('SHOW_NOTIFICATION', message, scope);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; payload: string | undefined; meta: string; }
  showNotification('info'); // => { type: 'SHOW_NOTIFICATION', meta: 'info' }
});

describe('with payload and optional meta', () => {
  const showNotification = (message: string, scope?: string) =>
    action('SHOW_NOTIFICATION', message, scope);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; payload: string; meta: string | undefined; }
  showNotification('Hello!'); // => { type: 'SHOW_NOTIFICATION', payload: 'Hello!' }
});

describe('with optional payload and optional meta', () => {
  const showNotification = (message?: string, scope?: string) =>
    action('SHOW_NOTIFICATION', message, scope);
  // @dts-jest:pass:snap -> { type: "SHOW_NOTIFICATION"; payload: string | undefined; meta: string | undefined; }
  showNotification(); // => { type: 'SHOW_NOTIFICATION' }
});
