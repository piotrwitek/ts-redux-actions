!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.TypesafeActions={})}(this,function(n){"use strict";function t(n,t){return void 0===t&&(t=1),null==n}function r(n){throw void 0===n&&(n=1),new Error("Argument "+n+" is empty.")}function e(n){return"function"==typeof n&&"getType"in n}function o(n){throw void 0===n&&(n=1),new Error("Argument "+n+' is invalid, it should be an action-creator instance from "typesafe-actions"')}function i(n,t){if(null==n)throw new Error("Argument contains array with empty element at index "+t);if(null==n.getType)throw new Error("Argument contains array with invalid element at index "+t+', it should be an action-creator instance from "typesafe-actions"')}function u(n){return"string"==typeof n||"symbol"==typeof n}function c(n){return!u(n)}function a(n){throw void 0===n&&(n=1),new Error("Argument "+n+" is invalid, it should be an action type of type: string | symbol")}function f(n,t){if(null==n)throw new Error("Argument contains array with empty element at index "+t);if("string"!=typeof n&&"symbol"!=typeof n)throw new Error("Argument contains array with invalid element at index "+t+", it should be of type: string | symbol")}function s(n,e,i,u){return t(n)&&r(1),c(n)&&o(1),{type:n,payload:e,meta:i,error:u}}function y(n,e){t(n)&&r(1),c(n)&&a(1);var o=null!=e?e(n):function(){return{type:n}};return Object.assign(o,{getType:function(){return n},toString:function(){return n}})}function p(n){return t(n)&&r(1),e(n)||o(1),n.getType()}n.action=s,n.createAction=function(n,t){var r=null==t?function(){return s(n)}:t(s.bind(null,n));return Object.assign(r,{getType:function(){return n},toString:function(){return n}})},n.createStandardAction=function(n){return t(n)&&r(1),c(n)&&a(1),Object.assign(function(){return y(n,function(n){return function(t,r){return{type:n,payload:t,meta:r}}})},{map:function(t){return y(n,function(n){return function(r,e){return Object.assign(t(r,e),{type:n})}})}})},n.createCustomAction=y,n.createAsyncAction=function(n,t,r){return[n,t,r].forEach(f),Object.assign(function(){return{request:y(n,function(n){return function(t){return{type:n,payload:t}}}),success:y(t,function(n){return function(t){return{type:n,payload:t}}}),failure:y(r,function(n){return function(t){return{type:n,payload:t}}})}})},n.createReducer=function(n){var t={},r=Object.assign(function(r,e){return void 0===r&&(r=n),t.hasOwnProperty(e.type)?t[e.type](r,e):r},{addHandler:function(n,o){return(Array.isArray(n)?n:[n]).map(function(n){return e(n)?p(n):u(n)?n:function(n){throw void 0===n&&(n=1),new Error("Argument "+n+' is invalid, it should be an action-creator instance from "typesafe-actions" or action type of type: string | symbol')}()}).forEach(function(n){return t[n]=o}),r}});return r},n.getType=p,n.isOfType=function(n,e){t(n)&&r(1);var o=Array.isArray(n)?n:[n];o.forEach(f);var i=function(n){return o.includes(n.type)};return void 0===e?i:i(e)},n.isActionOf=function(n,e){t(n)&&r(1);var o=Array.isArray(n)?n:[n];o.forEach(i);var u=function(n){return o.some(function(t){return n.type===t.getType()})};return void 0===e?u:u(e)},n.createActionDeprecated=function(n,t){var r;if(null!=t){if("function"!=typeof t)throw new Error("second argument is not a function");r=t}else r=function(){return{type:n}};if(null==n)throw new Error("first argument is missing");if("string"!=typeof n&&"symbol"!=typeof n)throw new Error("first argument should be type of: string | symbol");return r},Object.defineProperty(n,"__esModule",{value:!0})});
//# sourceMappingURL=index.umd.js.map
