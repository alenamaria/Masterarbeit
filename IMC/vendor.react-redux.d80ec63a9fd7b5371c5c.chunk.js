"use strict";(self.webpackChunk_imc_blish_stage_zero=self.webpackChunk_imc_blish_stage_zero||[]).push([[365],{8129:(e,t,r)=>{r.d(t,{zt:()=>f,I0:()=>p,v9:()=>S,oR:()=>b});var n=r(9377),u=n.createContext(null),c=function(e){e()},o=function(){return c},i={notify:function(){},get:function(){return[]}};function a(e,t){var r,n=i;function u(){a.onStateChange&&a.onStateChange()}function c(){r||(r=t?t.addNestedSub(u):e.subscribe(u),n=function(){var e=o(),t=null,r=null;return{clear:function(){t=null,r=null},notify:function(){e((function(){for(var e=t;e;)e.callback(),e=e.next}))},get:function(){for(var e=[],r=t;r;)e.push(r),r=r.next;return e},subscribe:function(e){var n=!0,u=r={callback:e,next:null,prev:r};return u.prev?u.prev.next=u:t=u,function(){n&&null!==t&&(n=!1,u.next?u.next.prev=u.prev:r=u.prev,u.prev?u.prev.next=u.next:t=u.next)}}}}())}var a={addNestedSub:function(e){return c(),n.subscribe(e)},notifyNestedSubs:function(){n.notify()},handleChangeWrapper:u,isSubscribed:function(){return Boolean(r)},trySubscribe:c,tryUnsubscribe:function(){r&&(r(),r=void 0,n.clear(),n=i)},getListeners:function(){return n}};return a}var s="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?n.useLayoutEffect:n.useEffect;const f=function(e){var t=e.store,r=e.context,c=e.children,o=(0,n.useMemo)((function(){var e=a(t);return{store:t,subscription:e}}),[t]),i=(0,n.useMemo)((function(){return t.getState()}),[t]);s((function(){var e=o.subscription;return e.onStateChange=e.notifyNestedSubs,e.trySubscribe(),i!==t.getState()&&e.notifyNestedSubs(),function(){e.tryUnsubscribe(),e.onStateChange=null}}),[o,i]);var f=r||u;return n.createElement(f.Provider,{value:o},c)};function l(){return(0,n.useContext)(u)}function v(e){void 0===e&&(e=u);var t=e===u?l:function(){return(0,n.useContext)(e)};return function(){return t().store}}r(9863),r(2257),r(3927);var b=v();function d(e){void 0===e&&(e=u);var t=e===u?b:v(e);return function(){return t().dispatch}}var p=d(),h=function(e,t){return e===t};function y(e){void 0===e&&(e=u);var t=e===u?l:function(){return(0,n.useContext)(e)};return function(e,r){void 0===r&&(r=h);var u=t(),c=function(e,t,r,u){var c,o=(0,n.useReducer)((function(e){return e+1}),0)[1],i=(0,n.useMemo)((function(){return a(r,u)}),[r,u]),f=(0,n.useRef)(),l=(0,n.useRef)(),v=(0,n.useRef)(),b=(0,n.useRef)(),d=r.getState();try{if(e!==l.current||d!==v.current||f.current){var p=e(d);c=void 0!==b.current&&t(p,b.current)?b.current:p}else c=b.current}catch(e){throw f.current&&(e.message+="\nThe error may be correlated with this previous error:\n"+f.current.stack+"\n\n"),e}return s((function(){l.current=e,v.current=d,b.current=c,f.current=void 0})),s((function(){function e(){try{var e=r.getState();if(e===v.current)return;var n=l.current(e);if(t(n,b.current))return;b.current=n,v.current=e}catch(e){f.current=e}o()}return i.onStateChange=e,i.trySubscribe(),e(),function(){return i.tryUnsubscribe()}}),[r,i]),c}(e,r,u.store,u.subscription);return(0,n.useDebugValue)(c),c}}var m,S=y();m=r(1602).unstable_batchedUpdates,c=m},589:(e,t)=>{if("function"==typeof Symbol&&Symbol.for){var r=Symbol.for;r("react.element"),r("react.portal"),r("react.fragment"),r("react.strict_mode"),r("react.profiler"),r("react.provider"),r("react.context"),r("react.forward_ref"),r("react.suspense"),r("react.suspense_list"),r("react.memo"),r("react.lazy"),r("react.block"),r("react.server.block"),r("react.fundamental"),r("react.debug_trace_mode"),r("react.legacy_hidden")}},2257:(e,t,r)=>{r(589)}}]);