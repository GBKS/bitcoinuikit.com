import { v as vue_cjs_prod, r as require$$0, s as serverRenderer } from '../index.mjs';
import 'unenv/runtime/mock/proxy';
import 'stream';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
function serial(tasks, fn) {
  return tasks.reduce((promise, task) => promise.then(() => fn(task)), Promise.resolve(null));
}
class Hookable {
  constructor() {
    this._hooks = {};
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
  }
  hook(name, fn) {
    if (!name || typeof fn !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let deprecatedHookObj;
    while (this._deprecatedHooks[name]) {
      const deprecatedHook = this._deprecatedHooks[name];
      if (typeof deprecatedHook === "string") {
        deprecatedHookObj = { to: deprecatedHook };
      } else {
        deprecatedHookObj = deprecatedHook;
      }
      name = deprecatedHookObj.to;
    }
    if (deprecatedHookObj) {
      if (!deprecatedHookObj.message) {
        console.warn(`${originalName} hook has been deprecated` + (deprecatedHookObj.to ? `, please use ${deprecatedHookObj.to}` : ""));
      } else {
        console.warn(deprecatedHookObj.message);
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.removeHook(name, fn);
        fn = null;
      }
    };
  }
  hookOnce(name, fn) {
    let _unreg;
    let _fn = (...args) => {
      _unreg();
      _unreg = null;
      _fn = null;
      return fn(...args);
    };
    _unreg = this.hook(name, _fn);
    return _unreg;
  }
  removeHook(name, fn) {
    if (this._hooks[name]) {
      const idx = this._hooks[name].indexOf(fn);
      if (idx !== -1) {
        this._hooks[name].splice(idx, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = deprecated;
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
    return () => {
      removeFns.splice(0, removeFns.length).forEach((unreg) => unreg());
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  callHook(name, ...args) {
    if (!this._hooks[name]) {
      return;
    }
    return serial(this._hooks[name], (fn) => fn(...args));
  }
}
function createHooks() {
  return new Hookable();
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function createMock(name, overrides = {}) {
  const fn = function() {
  };
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    enumerate(_target) {
      return [];
    }
  });
}
const mockContext = createMock("mock");
function mock(warning) {
  console.warn(warning);
  return mockContext;
}
const unsupported = new Set([
  "isClient",
  "isServer",
  "isStatic",
  "store",
  "target",
  "spa",
  "env",
  "modern",
  "fetchCounters"
]);
const todo = new Set([
  "isDev",
  "isHMR",
  "base",
  "payload",
  "from",
  "next",
  "error",
  "redirect",
  "redirected",
  "enablePreview",
  "$preview",
  "beforeNuxtRender",
  "beforeSerialize"
]);
const routerKeys = ["route", "params", "query"];
const legacyPlugin = (nuxt) => {
  nuxt._legacyContext = new Proxy(nuxt, {
    get(nuxt2, p) {
      if (unsupported.has(p)) {
        return mock(`Accessing ${p} is not supported in Nuxt 3.`);
      }
      if (todo.has(p)) {
        return mock(`Accessing ${p} is not yet supported in Nuxt 3.`);
      }
      if (routerKeys.includes(p)) {
        if (!("$router" in nuxt2)) {
          return mock("vue-router is not being used in this project.");
        }
        switch (p) {
          case "route":
            return nuxt2.$router.currentRoute.value;
          case "params":
          case "query":
            return nuxt2.$router.currentRoute.value[p];
        }
      }
      if (p === "$config") {
        return mock("Accessing runtime config is not yet supported in Nuxt 3.");
      }
      if (p === "ssrContext") {
        return nuxt2._legacyContext;
      }
      if (nuxt2.ssrContext && p in nuxt2.ssrContext) {
        return nuxt2.ssrContext[p];
      }
      if (p === "nuxt") {
        return nuxt2.payload;
      }
      if (p === "nuxtState") {
        return nuxt2.payload.data;
      }
      if (p in nuxt2.app) {
        return nuxt2.app[p];
      }
      if (p in nuxt2) {
        return nuxt2[p];
      }
      return mock(`Accessing ${p} is not supported in Nuxt3.`);
    }
  });
};
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxt = __spreadValues({
    provide: void 0,
    globalName: "nuxt",
    payload: vue_cjs_prod.reactive(__spreadValues({
      data: {},
      state: {}
    }, { serverRendered: true })),
    isHydrating: false,
    _asyncDataPromises: {}
  }, options);
  nuxt.hooks = createHooks();
  nuxt.hook = nuxt.hooks.hook;
  nuxt.callHook = nuxt.hooks.callHook;
  nuxt.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxt, $name, value);
    defineGetter(nuxt.app.config.globalProperties, $name, value);
  };
  defineGetter(nuxt.app, "$nuxt", nuxt);
  defineGetter(nuxt.app.config.globalProperties, "$nuxt", nuxt);
  if (nuxt.ssrContext) {
    nuxt.ssrContext.nuxt = nuxt;
  }
  {
    nuxt.ssrContext = nuxt.ssrContext || {};
    nuxt.ssrContext.payload = nuxt.payload;
  }
  {
    nuxt.provide("config", options.ssrContext.runtimeConfig.private);
    nuxt.payload.config = options.ssrContext.runtimeConfig.public;
  }
  return nuxt;
}
function applyPlugin(nuxt, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  return callWithNuxt(nuxt, () => plugin(nuxt));
}
async function applyPlugins(nuxt, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxt, plugin);
  }
}
function normalizePlugins(_plugins2) {
  let needsLegacyContext = false;
  const plugins2 = _plugins2.map((plugin) => {
    if (isLegacyPlugin(plugin)) {
      needsLegacyContext = true;
      return (nuxt) => plugin(nuxt._legacyContext, nuxt.provide);
    }
    return plugin;
  });
  if (needsLegacyContext) {
    plugins2.unshift(legacyPlugin);
  }
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function isLegacyPlugin(plugin) {
  return !plugin[NuxtPluginIndicator];
}
let currentNuxtAppInstance;
const setNuxtAppInstance = (nuxt) => {
  currentNuxtAppInstance = nuxt;
};
async function callWithNuxt(nuxt, setup) {
  setNuxtAppInstance(nuxt);
  const p = setup();
  setNuxtAppInstance(null);
  await p;
}
function useNuxtApp() {
  const vm = vue_cjs_prod.getCurrentInstance();
  if (!vm) {
    if (!currentNuxtAppInstance) {
      throw new Error("nuxt instance unavailable");
    }
    return currentNuxtAppInstance;
  }
  return vm.appContext.app.$nuxt;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var reactivity_cjs_prod = {};
var shared_cjs_prod = {};
Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html = "";
  let escaped;
  let index2;
  let lastIndex = 0;
  for (index2 = match.index; index2 < str.length; index2++) {
    switch (str.charCodeAt(index2)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index2) {
      html += str.slice(lastIndex, index2);
    }
    lastIndex = index2 + 1;
    html += escaped;
  }
  return lastIndex !== index2 ? html + str.slice(lastIndex, index2) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => val instanceof Date;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
};
shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
shared_cjs_prod.NO = NO;
shared_cjs_prod.NOOP = NOOP;
shared_cjs_prod.PatchFlagNames = PatchFlagNames;
shared_cjs_prod.camelize = camelize;
shared_cjs_prod.capitalize = capitalize;
shared_cjs_prod.def = def;
shared_cjs_prod.escapeHtml = escapeHtml;
shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
shared_cjs_prod.extend = extend;
shared_cjs_prod.generateCodeFrame = generateCodeFrame;
shared_cjs_prod.getGlobalThis = getGlobalThis;
shared_cjs_prod.hasChanged = hasChanged;
shared_cjs_prod.hasOwn = hasOwn;
shared_cjs_prod.hyphenate = hyphenate;
shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
shared_cjs_prod.invokeArrayFns = invokeArrayFns;
shared_cjs_prod.isArray = isArray;
shared_cjs_prod.isBooleanAttr = isBooleanAttr;
shared_cjs_prod.isDate = isDate;
var isFunction_1 = shared_cjs_prod.isFunction = isFunction;
shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
shared_cjs_prod.isHTMLTag = isHTMLTag;
shared_cjs_prod.isIntegerKey = isIntegerKey;
shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
shared_cjs_prod.isMap = isMap;
shared_cjs_prod.isModelListener = isModelListener;
shared_cjs_prod.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
shared_cjs_prod.isObject = isObject;
shared_cjs_prod.isOn = isOn;
shared_cjs_prod.isPlainObject = isPlainObject;
shared_cjs_prod.isPromise = isPromise;
shared_cjs_prod.isReservedProp = isReservedProp;
shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
shared_cjs_prod.isSVGTag = isSVGTag;
shared_cjs_prod.isSet = isSet;
shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
shared_cjs_prod.isString = isString;
shared_cjs_prod.isSymbol = isSymbol;
shared_cjs_prod.isVoidTag = isVoidTag;
shared_cjs_prod.looseEqual = looseEqual;
shared_cjs_prod.looseIndexOf = looseIndexOf;
shared_cjs_prod.makeMap = makeMap;
shared_cjs_prod.normalizeClass = normalizeClass;
shared_cjs_prod.normalizeProps = normalizeProps;
shared_cjs_prod.normalizeStyle = normalizeStyle;
shared_cjs_prod.objectToString = objectToString;
shared_cjs_prod.parseStringStyle = parseStringStyle;
shared_cjs_prod.propsToAttrMap = propsToAttrMap;
shared_cjs_prod.remove = remove;
shared_cjs_prod.slotFlagsText = slotFlagsText;
shared_cjs_prod.stringifyStyle = stringifyStyle;
shared_cjs_prod.toDisplayString = toDisplayString;
shared_cjs_prod.toHandlerKey = toHandlerKey;
shared_cjs_prod.toNumber = toNumber;
shared_cjs_prod.toRawType = toRawType;
shared_cjs_prod.toTypeString = toTypeString;
Object.defineProperty(reactivity_cjs_prod, "__esModule", { value: true });
var shared = shared_cjs_prod;
let activeEffectScope;
const effectScopeStack = [];
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      try {
        this.on();
        return fn();
      } finally {
        this.off();
      }
    }
  }
  on() {
    if (this.active) {
      effectScopeStack.push(this);
      activeEffectScope = this;
    }
  }
  off() {
    if (this.active) {
      effectScopeStack.pop();
      activeEffectScope = effectScopeStack[effectScopeStack.length - 1];
    }
  }
  stop(fromParent) {
    if (this.active) {
      this.effects.forEach((e) => e.stop());
      this.cleanups.forEach((cleanup) => cleanup());
      if (this.scopes) {
        this.scopes.forEach((e) => e.stop(true));
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope) {
  scope = scope || activeEffectScope;
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect2) => {
  const { deps } = effect2;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect2);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler2 = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler2;
    this.active = true;
    this.deps = [];
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    if (!effectStack.includes(this)) {
      try {
        effectStack.push(activeEffect = this);
        enableTracking();
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        resetTracking();
        effectStack.pop();
        const n = effectStack.length;
        activeEffect = n > 0 ? effectStack[n - 1] : void 0;
      }
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
function effect(fn, options) {
  if (fn.effect) {
    fn = fn.effect.fn;
  }
  const _effect = new ReactiveEffect(fn);
  if (options) {
    shared.extend(_effect, options);
    if (options.scope)
      recordEffectScope(_effect, options.scope);
  }
  if (!options || !options.lazy) {
    _effect.run();
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
function stop(runner) {
  runner.effect.stop();
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!isTracking()) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = createDep());
  }
  trackEffects(dep);
}
function isTracking() {
  return shouldTrack && activeEffect !== void 0;
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && shared.isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!shared.isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (shared.isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (shared.isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!shared.isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (shared.isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (shared.isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  for (const effect2 of shared.isArray(dep) ? dep : [...dep]) {
    if (effect2 !== activeEffect || effect2.allowRecurse) {
      if (effect2.scheduler) {
        effect2.scheduler();
      } else {
        effect2.run();
      }
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ shared.makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(shared.isSymbol));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = shared.isArray(target);
    if (!isReadonly2 && targetIsArray && shared.hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (shared.isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !shared.isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (shared.isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!shared.isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = shared.isArray(target) && shared.isIntegerKey(key) ? Number(key) < target.length : shared.hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (shared.hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = shared.hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!shared.isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", shared.isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ shared.extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const shallowReadonlyHandlers = /* @__PURE__ */ shared.extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly2 = false, isShallow = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "get", key);
  }
  !isReadonly2 && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "has", key);
  }
  !isReadonly2 && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (shared.hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = shared.isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(shared.hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(shared.toRawType(value));
}
function reactive(target) {
  if (target && target["__v_isReadonly"]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!shared.isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  shared.def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => shared.isObject(value) ? reactive(value) : value;
const toReadonly = (value) => shared.isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (isTracking()) {
    ref2 = toRaw(ref2);
    if (!ref2.dep) {
      ref2.dep = createDep();
    }
    {
      trackEffects(ref2.dep);
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, _shallow) {
    this._shallow = _shallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = _shallow ? value : toRaw(value);
    this._value = _shallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this._shallow ? newVal : toRaw(newVal);
    if (shared.hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this._shallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function triggerRef(ref2) {
  triggerRefValue(ref2);
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this.dep = void 0;
    this.__v_isRef = true;
    const { get: get2, set: set2 } = factory(() => trackRefValue(this), () => triggerRefValue(this));
    this._get = get2;
    this._set = set2;
  }
  get value() {
    return this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object) {
  const ret = shared.isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key) {
    this._object = _object;
    this._key = _key;
    this.__v_isRef = true;
  }
  get value() {
    return this._object[this._key];
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object, key) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2) {
    this._setter = _setter;
    this.dep = void 0;
    this._dirty = true;
    this.__v_isRef = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed(getterOrOptions, debugOptions) {
  let getter;
  let setter;
  const onlyGetter = shared.isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = shared.NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter);
  return cRef;
}
var _a;
const tick = Promise.resolve();
const queue = [];
let queued = false;
const scheduler = (fn) => {
  queue.push(fn);
  if (!queued) {
    queued = true;
    tick.then(flush);
  }
};
const flush = () => {
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
  }
  queue.length = 0;
  queued = false;
};
class DeferredComputedRefImpl {
  constructor(getter) {
    this.dep = void 0;
    this._dirty = true;
    this.__v_isRef = true;
    this[_a] = true;
    let compareTarget;
    let hasCompareTarget = false;
    let scheduled = false;
    this.effect = new ReactiveEffect(getter, (computedTrigger) => {
      if (this.dep) {
        if (computedTrigger) {
          compareTarget = this._value;
          hasCompareTarget = true;
        } else if (!scheduled) {
          const valueToCompare = hasCompareTarget ? compareTarget : this._value;
          scheduled = true;
          hasCompareTarget = false;
          scheduler(() => {
            if (this.effect.active && this._get() !== valueToCompare) {
              triggerRefValue(this);
            }
            scheduled = false;
          });
        }
        for (const e of this.dep) {
          if (e.computed) {
            e.scheduler(true);
          }
        }
      }
      this._dirty = true;
    });
    this.effect.computed = true;
  }
  _get() {
    if (this._dirty) {
      this._dirty = false;
      return this._value = this.effect.run();
    }
    return this._value;
  }
  get value() {
    trackRefValue(this);
    return toRaw(this)._get();
  }
}
_a = "__v_isReadonly";
function deferredComputed(getter) {
  return new DeferredComputedRefImpl(getter);
}
reactivity_cjs_prod.EffectScope = EffectScope;
reactivity_cjs_prod.ITERATE_KEY = ITERATE_KEY;
reactivity_cjs_prod.ReactiveEffect = ReactiveEffect;
var computed_1 = reactivity_cjs_prod.computed = computed;
reactivity_cjs_prod.customRef = customRef;
reactivity_cjs_prod.deferredComputed = deferredComputed;
reactivity_cjs_prod.effect = effect;
reactivity_cjs_prod.effectScope = effectScope;
reactivity_cjs_prod.enableTracking = enableTracking;
reactivity_cjs_prod.getCurrentScope = getCurrentScope;
reactivity_cjs_prod.isProxy = isProxy;
reactivity_cjs_prod.isReactive = isReactive;
reactivity_cjs_prod.isReadonly = isReadonly;
reactivity_cjs_prod.isRef = isRef;
reactivity_cjs_prod.markRaw = markRaw;
reactivity_cjs_prod.onScopeDispose = onScopeDispose;
reactivity_cjs_prod.pauseTracking = pauseTracking;
reactivity_cjs_prod.proxyRefs = proxyRefs;
reactivity_cjs_prod.reactive = reactive;
reactivity_cjs_prod.readonly = readonly;
reactivity_cjs_prod.ref = ref;
reactivity_cjs_prod.resetTracking = resetTracking;
reactivity_cjs_prod.shallowReactive = shallowReactive;
reactivity_cjs_prod.shallowReadonly = shallowReadonly;
reactivity_cjs_prod.shallowRef = shallowRef;
reactivity_cjs_prod.stop = stop;
reactivity_cjs_prod.toRaw = toRaw;
reactivity_cjs_prod.toRef = toRef;
reactivity_cjs_prod.toRefs = toRefs;
reactivity_cjs_prod.track = track;
reactivity_cjs_prod.trigger = trigger;
reactivity_cjs_prod.triggerRef = triggerRef;
reactivity_cjs_prod.unref = unref;
var vueRouter_cjs_prod = {};
/*!
  * vue-router v4.0.12
  * (c) 2021 Eduardo San Martin Morote
  * @license MIT
  */
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var vue = require$$0;
  const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
  const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
  const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
  const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
  const routerKey = /* @__PURE__ */ PolySymbol("r");
  const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
  const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
  function isESModule(obj) {
    return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop = () => {
  };
  const TRAILING_SLASH_RE2 = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE2, "");
  function parseURL2(parseQuery3, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    const searchPos = location2.indexOf("?");
    const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery3(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash,
      path,
      query,
      hash
    };
  }
  function stringifyURL(stringifyQuery3, location2) {
    const query = location2.query ? stringifyQuery3(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery3, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery3(a.query) === stringifyQuery3(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
  }
  function resolveRelativePath(to, from) {
    if (to.startsWith("/"))
      return to;
    if (!to)
      return from;
    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
      segment = toSegments[toPosition];
      if (position === 1 || segment === ".")
        continue;
      if (segment === "..")
        position--;
      else
        break;
    }
    return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
  }
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  const START = "";
  function normalizeBase(base) {
    if (!base) {
      {
        base = "/";
      }
    }
    if (base[0] !== "/" && base[0] !== "#")
      base = "/" + base;
    return removeTrailingSlash(base);
  }
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location2) {
    return base.replace(BEFORE_HASH_RE, "#") + location2;
  }
  const computeScrollPosition = () => ({
    left: window.pageXOffset,
    top: window.pageYOffset
  });
  let createBaseLocation = () => location.protocol + "//" + location.host;
  function createCurrentLocation(base, location2) {
    const { pathname, search, hash } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    let pauseState = null;
    const popStateHandler = ({ state }) => {
      const to = createCurrentLocation(base, location);
      const from = currentLocation.value;
      const fromState = historyState.value;
      let delta = 0;
      if (state) {
        currentLocation.value = to;
        historyState.value = state;
        if (pauseState && pauseState === from) {
          pauseState = null;
          return;
        }
        delta = fromState ? state.position - fromState.position : 0;
      } else {
        replace(to);
      }
      listeners.forEach((listener) => {
        listener(currentLocation.value, from, {
          delta,
          type: NavigationType.pop,
          direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
        });
      });
    };
    function pauseListeners() {
      pauseState = currentLocation.value;
    }
    function listen(callback) {
      listeners.push(callback);
      const teardown = () => {
        const index2 = listeners.indexOf(callback);
        if (index2 > -1)
          listeners.splice(index2, 1);
      };
      teardowns.push(teardown);
      return teardown;
    }
    function beforeUnloadListener() {
      const { history: history2 } = window;
      if (!history2.state)
        return;
      history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
    }
    function destroy() {
      for (const teardown of teardowns)
        teardown();
      teardowns = [];
      window.removeEventListener("popstate", popStateHandler);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    }
    window.addEventListener("popstate", popStateHandler);
    window.addEventListener("beforeunload", beforeUnloadListener);
    return {
      pauseListeners,
      listen,
      destroy
    };
  }
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
      back,
      current,
      forward,
      replaced,
      position: window.history.length,
      scroll: computeScroll ? computeScrollPosition() : null
    };
  }
  function useHistoryStateNavigation(base) {
    const { history: history2, location: location2 } = window;
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = { value: history2.state };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history2.length - 1,
        replaced: true,
        scroll: null
      }, true);
    }
    function changeLocation(to, state, replace2) {
      const hashIndex = base.indexOf("#");
      const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
      try {
        history2[replace2 ? "replaceState" : "pushState"](state, "", url);
        historyState.value = state;
      } catch (err) {
        {
          console.error(err);
        }
        location2[replace2 ? "replace" : "assign"](url);
      }
    }
    function replace(to, data) {
      const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign({}, historyState.value, history2.state, {
        forward: to,
        scroll: computeScrollPosition()
      });
      changeLocation(currentState.current, currentState, true);
      const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
      changeLocation(to, state, false);
      currentLocation.value = to;
    }
    return {
      location: currentLocation,
      state: historyState,
      push,
      replace
    };
  }
  function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
      if (!triggerListeners)
        historyListeners.pauseListeners();
      history.go(delta);
    }
    const routerHistory = assign({
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base)
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => historyNavigation.location.value
    });
    Object.defineProperty(routerHistory, "state", {
      enumerable: true,
      get: () => historyNavigation.state.value
    });
    return routerHistory;
  }
  function createMemoryHistory(base = "") {
    let listeners = [];
    let queue2 = [START];
    let position = 0;
    base = normalizeBase(base);
    function setLocation(location2) {
      position++;
      if (position === queue2.length) {
        queue2.push(location2);
      } else {
        queue2.splice(position);
        queue2.push(location2);
      }
    }
    function triggerListeners(to, from, { direction, delta }) {
      const info2 = {
        direction,
        delta,
        type: NavigationType.pop
      };
      for (const callback of listeners) {
        callback(to, from, info2);
      }
    }
    const routerHistory = {
      location: START,
      state: {},
      base,
      createHref: createHref.bind(null, base),
      replace(to) {
        queue2.splice(position--, 1);
        setLocation(to);
      },
      push(to, data) {
        setLocation(to);
      },
      listen(callback) {
        listeners.push(callback);
        return () => {
          const index2 = listeners.indexOf(callback);
          if (index2 > -1)
            listeners.splice(index2, 1);
        };
      },
      destroy() {
        listeners = [];
        queue2 = [START];
        position = 0;
      },
      go(delta, shouldTrigger = true) {
        const from = this.location;
        const direction = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
        position = Math.max(0, Math.min(position + delta, queue2.length - 1));
        if (shouldTrigger) {
          triggerListeners(this.location, from, {
            direction,
            delta
          });
        }
      }
    };
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => queue2[position]
    });
    return routerHistory;
  }
  function createWebHashHistory(base) {
    base = location.host ? base || location.pathname + location.search : "";
    if (!base.includes("#"))
      base += "#";
    return createWebHistory(base);
  }
  function isRouteLocation(route) {
    return typeof route === "string" || route && typeof route === "object";
  }
  function isRouteName(name) {
    return typeof name === "string" || typeof name === "symbol";
  }
  const START_LOCATION_NORMALIZED = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
  };
  const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
  exports.NavigationFailureType = void 0;
  (function(NavigationFailureType) {
    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
  })(exports.NavigationFailureType || (exports.NavigationFailureType = {}));
  const ErrorTypeMessages = {
    [1]({ location: location2, currentLocation }) {
      return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
    },
    [2]({ from, to }) {
      return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [4]({ from, to }) {
      return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [8]({ from, to }) {
      return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [16]({ from, to }) {
      return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    }
  };
  function createRouterError(type, params) {
    {
      return assign(new Error(ErrorTypeMessages[type](params)), {
        type,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type) {
    return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
  }
  const propertiesToLog = ["params", "query", "hash"];
  function stringifyRoute(to) {
    if (typeof to === "string")
      return to;
    if ("path" in to)
      return to.path;
    const location2 = {};
    for (const key of propertiesToLog) {
      if (key in to)
        location2[key] = to[key];
    }
    return JSON.stringify(location2, null, 2);
  }
  const BASE_PARAM_PATTERN = "[^/]+?";
  const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true
  };
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [90];
      if (options.strict && !segment.length)
        pattern += "/";
      for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
        const token = segment[tokenIndex];
        let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
        if (token.type === 0) {
          if (!tokenIndex)
            pattern += "/";
          pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
          subSegmentScore += 40;
        } else if (token.type === 1) {
          const { value, repeatable, optional, regexp } = token;
          keys.push({
            name: value,
            repeatable,
            optional
          });
          const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
          if (re2 !== BASE_PARAM_PATTERN) {
            subSegmentScore += 10;
            try {
              new RegExp(`(${re2})`);
            } catch (err) {
              throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
            }
          }
          let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
          if (!tokenIndex)
            subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
          if (optional)
            subPattern += "?";
          pattern += subPattern;
          subSegmentScore += 20;
          if (optional)
            subSegmentScore += -8;
          if (repeatable)
            subSegmentScore += -20;
          if (re2 === ".*")
            subSegmentScore += -50;
        }
        segmentScores.push(subSegmentScore);
      }
      score.push(segmentScores);
    }
    if (options.strict && options.end) {
      const i = score.length - 1;
      score[i][score[i].length - 1] += 0.7000000000000001;
    }
    if (!options.strict)
      pattern += "/?";
    if (options.end)
      pattern += "$";
    else if (options.strict)
      pattern += "(?:/|$)";
    const re = new RegExp(pattern, options.sensitive ? "" : "i");
    function parse(path) {
      const match = path.match(re);
      const params = {};
      if (!match)
        return null;
      for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
      }
      return params;
    }
    function stringify(params) {
      let path = "";
      let avoidDuplicatedSlash = false;
      for (const segment of segments) {
        if (!avoidDuplicatedSlash || !path.endsWith("/"))
          path += "/";
        avoidDuplicatedSlash = false;
        for (const token of segment) {
          if (token.type === 0) {
            path += token.value;
          } else if (token.type === 1) {
            const { value, repeatable, optional } = token;
            const param = value in params ? params[value] : "";
            if (Array.isArray(param) && !repeatable)
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            const text = Array.isArray(param) ? param.join("/") : param;
            if (!text) {
              if (optional) {
                if (segment.length < 2) {
                  if (path.endsWith("/"))
                    path = path.slice(0, -1);
                  else
                    avoidDuplicatedSlash = true;
                }
              } else
                throw new Error(`Missing required param "${value}"`);
            }
            path += text;
          }
        }
      }
      return path;
    }
    return {
      re,
      score,
      keys,
      parse,
      stringify
    };
  }
  function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
      const diff = b[i] - a[i];
      if (diff)
        return diff;
      i++;
    }
    if (a.length < b.length) {
      return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
    } else if (a.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    return bScore.length - aScore.length;
  }
  const ROOT_TOKEN = {
    type: 0,
    value: ""
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  function tokenizePath(path) {
    if (!path)
      return [[]];
    if (path === "/")
      return [[ROOT_TOKEN]];
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path "${path}"`);
    }
    function crash(message) {
      throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0;
    let previousState = state;
    const tokens = [];
    let segment;
    function finalizeSegment() {
      if (segment)
        tokens.push(segment);
      segment = [];
    }
    let i = 0;
    let char;
    let buffer = "";
    let customRe = "";
    function consumeBuffer() {
      if (!buffer)
        return;
      if (state === 0) {
        segment.push({
          type: 0,
          value: buffer
        });
      } else if (state === 1 || state === 2 || state === 3) {
        if (segment.length > 1 && (char === "*" || char === "+"))
          crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
        segment.push({
          type: 1,
          value: buffer,
          regexp: customRe,
          repeatable: char === "*" || char === "+",
          optional: char === "*" || char === "?"
        });
      } else {
        crash("Invalid state to consume buffer");
      }
      buffer = "";
    }
    function addCharToBuffer() {
      buffer += char;
    }
    while (i < path.length) {
      char = path[i++];
      if (char === "\\" && state !== 2) {
        previousState = state;
        state = 4;
        continue;
      }
      switch (state) {
        case 0:
          if (char === "/") {
            if (buffer) {
              consumeBuffer();
            }
            finalizeSegment();
          } else if (char === ":") {
            consumeBuffer();
            state = 1;
          } else {
            addCharToBuffer();
          }
          break;
        case 4:
          addCharToBuffer();
          state = previousState;
          break;
        case 1:
          if (char === "(") {
            state = 2;
          } else if (VALID_PARAM_RE.test(char)) {
            addCharToBuffer();
          } else {
            consumeBuffer();
            state = 0;
            if (char !== "*" && char !== "?" && char !== "+")
              i--;
          }
          break;
        case 2:
          if (char === ")") {
            if (customRe[customRe.length - 1] == "\\")
              customRe = customRe.slice(0, -1) + char;
            else
              state = 3;
          } else {
            customRe += char;
          }
          break;
        case 3:
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
          customRe = "";
          break;
        default:
          crash("Unknown state");
          break;
      }
    }
    if (state === 2)
      crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    return tokens;
  }
  function createRouteRecordMatcher(record, parent, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    const matcher = assign(parser, {
      record,
      parent,
      children: [],
      alias: []
    });
    if (parent) {
      if (!matcher.record.aliasOf === !parent.record.aliasOf)
        parent.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes2, globalOptions) {
    const matchers = [];
    const matcherMap = new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent && path[0] !== "/") {
          const parentPath = parent.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
          normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
        }
        matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
        if (originalRecord) {
          originalRecord.alias.push(matcher);
        } else {
          originalMatcher = originalMatcher || matcher;
          if (originalMatcher !== matcher)
            originalMatcher.alias.push(matcher);
          if (isRootAdd && record.name && !isAliasRecord(matcher))
            removeRoute(record.name);
        }
        if ("children" in mainNormalizedRecord) {
          const children = mainNormalizedRecord.children;
          for (let i = 0; i < children.length; i++) {
            addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        insertMatcher(matcher);
      }
      return originalMatcher ? () => {
        removeRoute(originalMatcher);
      } : noop;
    }
    function removeRoute(matcherRef) {
      if (isRouteName(matcherRef)) {
        const matcher = matcherMap.get(matcherRef);
        if (matcher) {
          matcherMap.delete(matcherRef);
          matchers.splice(matchers.indexOf(matcher), 1);
          matcher.children.forEach(removeRoute);
          matcher.alias.forEach(removeRoute);
        }
      } else {
        const index2 = matchers.indexOf(matcherRef);
        if (index2 > -1) {
          matchers.splice(index2, 1);
          if (matcherRef.record.name)
            matcherMap.delete(matcherRef.record.name);
          matcherRef.children.forEach(removeRoute);
          matcherRef.alias.forEach(removeRoute);
        }
      }
    }
    function getRoutes() {
      return matchers;
    }
    function insertMatcher(matcher) {
      let i = 0;
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0)
        i++;
      matchers.splice(i, 0, matcher);
      if (matcher.record.name && !isAliasRecord(matcher))
        matcherMap.set(matcher.record.name, matcher);
    }
    function resolve(location2, currentLocation) {
      let matcher;
      let params = {};
      let path;
      let name;
      if ("name" in location2 && location2.name) {
        matcher = matcherMap.get(location2.name);
        if (!matcher)
          throw createRouterError(1, {
            location: location2
          });
        name = matcher.record.name;
        params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
        path = matcher.stringify(params);
      } else if ("path" in location2) {
        path = location2.path;
        matcher = matchers.find((m) => m.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
        if (!matcher)
          throw createRouterError(1, {
            location: location2,
            currentLocation
          });
        name = matcher.record.name;
        params = assign({}, currentLocation.params, location2.params);
        path = matcher.stringify(params);
      }
      const matched = [];
      let parentMatcher = matcher;
      while (parentMatcher) {
        matched.unshift(parentMatcher.record);
        parentMatcher = parentMatcher.parent;
      }
      return {
        name,
        path,
        params,
        matched,
        meta: mergeMetaFields(matched)
      };
    }
    routes2.forEach((route) => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
      if (key in params)
        newParams[key] = params[key];
    }
    return newParams;
  }
  function normalizeRouteRecord(record) {
    return {
      path: record.path,
      redirect: record.redirect,
      name: record.name,
      meta: record.meta || {},
      aliasOf: void 0,
      beforeEnter: record.beforeEnter,
      props: normalizeRecordProps(record),
      children: record.children || [],
      instances: {},
      leaveGuards: new Set(),
      updateGuards: new Set(),
      enterCallbacks: {},
      components: "components" in record ? record.components || {} : { default: record.component }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
        propsObject[name] = typeof props === "boolean" ? props : props[name];
    }
    return propsObject;
  }
  function isAliasRecord(record) {
    while (record) {
      if (record.record.aliasOf)
        return true;
      record = record.parent;
    }
    return false;
  }
  function mergeMetaFields(matched) {
    return matched.reduce((meta, record) => assign(meta, record.meta), {});
  }
  function mergeOptions(defaults, partialOptions) {
    const options = {};
    for (const key in defaults) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
  }
  const HASH_RE2 = /#/g;
  const AMPERSAND_RE2 = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE2 = /=/g;
  const IM_RE = /\?/g;
  const PLUS_RE2 = /\+/g;
  const ENC_BRACKET_OPEN_RE2 = /%5B/g;
  const ENC_BRACKET_CLOSE_RE2 = /%5D/g;
  const ENC_CARET_RE2 = /%5E/g;
  const ENC_BACKTICK_RE2 = /%60/g;
  const ENC_CURLY_OPEN_RE2 = /%7B/g;
  const ENC_PIPE_RE2 = /%7C/g;
  const ENC_CURLY_CLOSE_RE2 = /%7D/g;
  const ENC_SPACE_RE2 = /%20/g;
  function commonEncode(text) {
    return encodeURI("" + text).replace(ENC_PIPE_RE2, "|").replace(ENC_BRACKET_OPEN_RE2, "[").replace(ENC_BRACKET_CLOSE_RE2, "]");
  }
  function encodeHash(text) {
    return commonEncode(text).replace(ENC_CURLY_OPEN_RE2, "{").replace(ENC_CURLY_CLOSE_RE2, "}").replace(ENC_CARET_RE2, "^");
  }
  function encodeQueryValue2(text) {
    return commonEncode(text).replace(PLUS_RE2, "%2B").replace(ENC_SPACE_RE2, "+").replace(HASH_RE2, "%23").replace(AMPERSAND_RE2, "%26").replace(ENC_BACKTICK_RE2, "`").replace(ENC_CURLY_OPEN_RE2, "{").replace(ENC_CURLY_CLOSE_RE2, "}").replace(ENC_CARET_RE2, "^");
  }
  function encodeQueryKey2(text) {
    return encodeQueryValue2(text).replace(EQUAL_RE2, "%3D");
  }
  function encodePath(text) {
    return commonEncode(text).replace(HASH_RE2, "%23").replace(IM_RE, "%3F");
  }
  function encodeParam(text) {
    return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
  }
  function decode2(text) {
    try {
      return decodeURIComponent("" + text);
    } catch (err) {
    }
    return "" + text;
  }
  function parseQuery2(search) {
    const query = {};
    if (search === "" || search === "?")
      return query;
    const hasLeadingIM = search[0] === "?";
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
    for (let i = 0; i < searchParams.length; ++i) {
      const searchParam = searchParams[i].replace(PLUS_RE2, " ");
      const eqPos = searchParam.indexOf("=");
      const key = decode2(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode2(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!Array.isArray(currentValue)) {
          currentValue = query[key] = [currentValue];
        }
        currentValue.push(value);
      } else {
        query[key] = value;
      }
    }
    return query;
  }
  function stringifyQuery2(query) {
    let search = "";
    for (let key in query) {
      const value = query[key];
      key = encodeQueryKey2(key);
      if (value == null) {
        if (value !== void 0) {
          search += (search.length ? "&" : "") + key;
        }
        continue;
      }
      const values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue2(v)) : [value && encodeQueryValue2(value)];
      values.forEach((value2) => {
        if (value2 !== void 0) {
          search += (search.length ? "&" : "") + key;
          if (value2 != null)
            search += "=" + value2;
        }
      });
    }
    return search;
  }
  function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  function useCallbacks() {
    let handlers = [];
    function add2(handler) {
      handlers.push(handler);
      return () => {
        const i = handlers.indexOf(handler);
        if (i > -1)
          handlers.splice(i, 1);
      };
    }
    function reset() {
      handlers = [];
    }
    return {
      add: add2,
      list: () => handlers,
      reset
    };
  }
  function registerGuard(record, name, guard) {
    const removeFromList = () => {
      record[name].delete(guard);
    };
    vue.onUnmounted(removeFromList);
    vue.onDeactivated(removeFromList);
    vue.onActivated(() => {
      record[name].add(guard);
    });
    record[name].add(guard);
  }
  function onBeforeRouteLeave(leaveGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "leaveGuards", leaveGuard);
  }
  function onBeforeRouteUpdate(updateGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "updateGuards", updateGuard);
  }
  function guardToPromiseFn(guard, to, from, record, name) {
    const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
      const next = (valid) => {
        if (valid === false)
          reject(createRouterError(4, {
            from,
            to
          }));
        else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
            enterCallbackArray.push(valid);
          resolve();
        }
      };
      const guardReturn = guard.call(record && record.instances[name], to, from, next);
      let guardCall = Promise.resolve(guardReturn);
      if (guard.length < 3)
        guardCall = guardCall.then(next);
      guardCall.catch((err) => reject(err));
    });
  }
  function extractComponentsGuards(matched, guardType, to, from) {
    const guards = [];
    for (const record of matched) {
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
          const guard = options[guardType];
          guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
        } else {
          let componentPromise = rawComponent();
          guards.push(() => componentPromise.then((resolved) => {
            if (!resolved)
              return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
            const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
            record.components[name] = resolvedComponent;
            const options = resolvedComponent.__vccOpts || resolvedComponent;
            const guard = options[guardType];
            return guard && guardToPromiseFn(guard, to, from, record, name)();
          }));
        }
      }
    }
    return guards;
  }
  function isRouteComponent(component) {
    return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
  }
  function useLink(props) {
    const router = vue.inject(routerKey);
    const currentRoute = vue.inject(routeLocationKey);
    const route = vue.computed(() => router.resolve(vue.unref(props.to)));
    const activeRecordIndex = vue.computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index2 > -1)
        return index2;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
    });
    const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router[vue.unref(props.replace) ? "replace" : "push"](vue.unref(props.to)).catch(noop);
      }
      return Promise.resolve();
    }
    return {
      route,
      href: vue.computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterLink",
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: {
        type: String,
        default: "page"
      }
    },
    useLink,
    setup(props, { slots }) {
      const link = vue.reactive(useLink(props));
      const { options } = vue.inject(routerKey);
      const elClass = vue.computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children = slots.default && slots.default(link);
        return props.custom ? children : vue.h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          onClick: link.navigate,
          class: elClass.value
        }, children);
      };
    }
  });
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    if (e.button !== void 0 && e.button !== 0)
      return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target))
        return;
    }
    if (e.preventDefault)
      e.preventDefault();
    return true;
  }
  function includesParams(outer, inner) {
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterView",
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: "default"
      },
      route: Object
    },
    setup(props, { attrs, slots }) {
      const injectedRoute = vue.inject(routerViewLocationKey);
      const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
      const depth = vue.inject(viewDepthKey, 0);
      const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth]);
      vue.provide(viewDepthKey, depth + 1);
      vue.provide(matchedRouteKey, matchedRouteRef);
      vue.provide(routerViewLocationKey, routeToDisplay);
      const viewRef = vue.ref();
      vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          to.instances[name] = instance;
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }
        if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, { flush: "post" });
      return () => {
        const route = routeToDisplay.value;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[props.name];
        const currentName = props.name;
        if (!ViewComponent) {
          return normalizeSlot(slots.default, { Component: ViewComponent, route });
        }
        const routePropsOption = matchedRoute.props[props.name];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        return normalizeSlot(slots.default, { Component: component, route }) || component;
      };
    }
  });
  function normalizeSlot(slot, data) {
    if (!slot)
      return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  const RouterView = RouterViewImpl;
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery2;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery2;
    const routerHistory = options.history;
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = applyToParams.bind(null, decode2);
    function addRoute(parentOrRoute, route) {
      let parent;
      let record;
      if (isRouteName(parentOrRoute)) {
        parent = matcher.getRecordMatcher(parentOrRoute);
        record = route;
      } else {
        record = parentOrRoute;
      }
      return matcher.addRoute(record, parent);
    }
    function removeRoute(name) {
      const recordMatcher = matcher.getRecordMatcher(name);
      if (recordMatcher) {
        matcher.removeRoute(recordMatcher);
      }
    }
    function getRoutes() {
      return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
    }
    function hasRoute(name) {
      return !!matcher.getRecordMatcher(name);
    }
    function resolve(rawLocation, currentLocation) {
      currentLocation = assign({}, currentLocation || currentRoute.value);
      if (typeof rawLocation === "string") {
        const locationNormalized = parseURL2(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
        return assign(locationNormalized, matchedRoute2, {
          params: decodeParams(matchedRoute2.params),
          hash: decode2(locationNormalized.hash),
          redirectedFrom: void 0,
          href: href2
        });
      }
      let matcherLocation;
      if ("path" in rawLocation) {
        matcherLocation = assign({}, rawLocation, {
          path: parseURL2(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(rawLocation.params)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash,
        query: stringifyQuery$1 === stringifyQuery2 ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      }, matchedRoute, {
        redirectedFrom: void 0,
        href
      });
    }
    function locationAsObject(to) {
      return typeof to === "string" ? parseURL2(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
      if (pendingLocation !== to) {
        return createRouterError(8, {
          from,
          to
        });
      }
    }
    function push(to) {
      return pushWithRedirect(to);
    }
    function replace(to) {
      return push(assign(locationAsObject(to), { replace: true }));
    }
    function handleRedirectRecord(to) {
      const lastMatched = to.matched[to.matched.length - 1];
      if (lastMatched && lastMatched.redirect) {
        const { redirect } = lastMatched;
        let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
        if (typeof newTargetLocation === "string") {
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
          newTargetLocation.params = {};
        }
        return assign({
          query: to.query,
          hash: to.hash,
          params: to.params
        }, newTargetLocation);
      }
    }
    function pushWithRedirect(to, redirectedFrom) {
      const targetLocation = pendingLocation = resolve(to);
      const from = currentRoute.value;
      const data = to.state;
      const force = to.force;
      const replace2 = to.replace === true;
      const shouldRedirect = handleRedirectRecord(targetLocation);
      if (shouldRedirect)
        return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
          state: data,
          force,
          replace: replace2
        }), redirectedFrom || targetLocation);
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, { to: toLocation, from });
        handleScroll();
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? error : triggerError(error, toLocation, from)).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(failure2, 2)) {
            return pushWithRedirect(assign(locationAsObject(failure2.to), {
              state: data,
              force,
              replace: replace2
            }), redirectedFrom || toLocation);
          }
        } else {
          failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
        }
        triggerAfterEach(toLocation, from, failure2);
        return failure2;
      });
    }
    function checkCanceledNavigationAndReject(to, from) {
      const error = checkCanceledNavigation(to, from);
      return error ? Promise.reject(error) : Promise.resolve();
    }
    function navigate(to, from) {
      let guards;
      const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
      guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
      for (const record of leavingRecords) {
        record.leaveGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards).then(() => {
        guards = [];
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from));
          });
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const record of to.matched) {
          if (record.beforeEnter && !from.matched.includes(record)) {
            if (Array.isArray(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from));
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from));
            }
          }
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        to.matched.forEach((record) => record.enterCallbacks = {});
        guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
    }
    function triggerAfterEach(to, from, failure) {
      for (const guard of afterGuards.list())
        guard(to, from, failure);
    }
    function finalizeNavigation(toLocation, from, isPush, replace2, data) {
      const error = checkCanceledNavigation(toLocation, from);
      if (error)
        return error;
      const isFirstNavigation = from === START_LOCATION_NORMALIZED;
      const state = {};
      if (isPush) {
        if (replace2 || isFirstNavigation)
          routerHistory.replace(toLocation.fullPath, assign({
            scroll: isFirstNavigation && state && state.scroll
          }, data));
        else
          routerHistory.push(toLocation.fullPath, data);
      }
      currentRoute.value = toLocation;
      handleScroll();
      markAsReady();
    }
    let removeHistoryListener;
    function setupListeners() {
      removeHistoryListener = routerHistory.listen((to, _from, info2) => {
        const toLocation = resolve(to);
        const shouldRedirect = handleRedirectRecord(toLocation);
        if (shouldRedirect) {
          pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
          return;
        }
        pendingLocation = toLocation;
        const from = currentRoute.value;
        navigate(toLocation, from).catch((error) => {
          if (isNavigationFailure(error, 4 | 8)) {
            return error;
          }
          if (isNavigationFailure(error, 2)) {
            pushWithRedirect(error.to, toLocation).then((failure) => {
              if (isNavigationFailure(failure, 4 | 16) && !info2.delta && info2.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop);
            return Promise.reject();
          }
          if (info2.delta)
            routerHistory.go(-info2.delta, false);
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(toLocation, from, false);
          if (failure) {
            if (info2.delta) {
              routerHistory.go(-info2.delta, false);
            } else if (info2.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
              routerHistory.go(-1, false);
            }
          }
          triggerAfterEach(toLocation, from, failure);
        }).catch(noop);
      });
    }
    let readyHandlers = useCallbacks();
    let errorHandlers = useCallbacks();
    let ready;
    function triggerError(error, to, from) {
      markAsReady(error);
      const list = errorHandlers.list();
      if (list.length) {
        list.forEach((handler) => handler(error, to, from));
      } else {
        console.error(error);
      }
      return Promise.reject(error);
    }
    function isReady() {
      if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
        return Promise.resolve();
      return new Promise((resolve2, reject) => {
        readyHandlers.add([resolve2, reject]);
      });
    }
    function markAsReady(err) {
      if (ready)
        return;
      ready = true;
      setupListeners();
      readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
      readyHandlers.reset();
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      return Promise.resolve();
    }
    const go = (delta) => routerHistory.go(delta);
    const installedApps = new Set();
    const router = {
      currentRoute,
      addRoute,
      removeRoute,
      hasRoute,
      getRoutes,
      resolve,
      options,
      push,
      replace,
      go,
      back: () => go(-1),
      forward: () => go(1),
      beforeEach: beforeGuards.add,
      beforeResolve: beforeResolveGuards.add,
      afterEach: afterGuards.add,
      onError: errorHandlers.add,
      isReady,
      install(app) {
        const router2 = this;
        app.component("RouterLink", RouterLink);
        app.component("RouterView", RouterView);
        app.config.globalProperties.$router = router2;
        Object.defineProperty(app.config.globalProperties, "$route", {
          enumerable: true,
          get: () => vue.unref(currentRoute)
        });
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
        }
        app.provide(routerKey, router2);
        app.provide(routeLocationKey, vue.reactive(reactiveRoute));
        app.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app.unmount;
        installedApps.add(app);
        app.unmount = function() {
          installedApps.delete(app);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            currentRoute.value = START_LOCATION_NORMALIZED;
            ready = false;
          }
          unmountApp();
        };
      }
    };
    return router;
  }
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
  }
  function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
      const recordFrom = from.matched[i];
      if (recordFrom) {
        if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
          updatingRecords.push(recordFrom);
        else
          leavingRecords.push(recordFrom);
      }
      const recordTo = to.matched[i];
      if (recordTo) {
        if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
          enteringRecords.push(recordTo);
        }
      }
    }
    return [leavingRecords, updatingRecords, enteringRecords];
  }
  function useRouter() {
    return vue.inject(routerKey);
  }
  function useRoute() {
    return vue.inject(routeLocationKey);
  }
  exports.RouterLink = RouterLink;
  exports.RouterView = RouterView;
  exports.START_LOCATION = START_LOCATION_NORMALIZED;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createRouter = createRouter;
  exports.createRouterMatcher = createRouterMatcher;
  exports.createWebHashHistory = createWebHashHistory;
  exports.createWebHistory = createWebHistory;
  exports.isNavigationFailure = isNavigationFailure;
  exports.matchedRouteKey = matchedRouteKey;
  exports.onBeforeRouteLeave = onBeforeRouteLeave;
  exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
  exports.parseQuery = parseQuery2;
  exports.routeLocationKey = routeLocationKey;
  exports.routerKey = routerKey;
  exports.routerViewLocationKey = routerViewLocationKey;
  exports.stringifyQuery = stringifyQuery2;
  exports.useLink = useLink;
  exports.useRoute = useRoute;
  exports.useRouter = useRouter;
  exports.viewDepthKey = viewDepthKey;
})(vueRouter_cjs_prod);
const preload = defineNuxtPlugin(({ app }) => {
  app.mixin({
    beforeCreate() {
      const { _registeredComponents } = this.$nuxt.ssrContext;
      const { __moduleIdentifier } = this.$options;
      _registeredComponents.add(__moduleIdentifier);
    }
  });
});
var __defProp2 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var createElement = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
var getTagKey = (props) => {
  if (props.key !== void 0) {
    return { name: "key", value: props.key };
  }
  if (props.name !== void 0) {
    return { name: "name", value: props.name };
  }
  if (props.property !== void 0) {
    return {
      name: "property",
      value: props.property
    };
  }
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      el.removeAttribute(key);
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var insertTags = (tags, document2 = window.document) => {
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = j.previousElementSibling) {
      if (j) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  const newElements = [];
  let title;
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of tags) {
    if (tag.tag === "title") {
      title = tag.props.children;
      continue;
    }
    if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
      continue;
    }
    if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
      continue;
    }
    if (tag.tag === "meta") {
      const key = getTagKey(tag.props);
      if (key) {
        const elementList = [
          ...head.querySelectorAll(`meta[${key.name}="${key.value}"]`)
        ];
        for (const el of elementList) {
          if (!oldElements.includes(el)) {
            oldElements.push(el);
          }
        }
      }
    }
    newElements.push(createElement(tag.tag, tag.props, document2));
  }
  oldElements.forEach((el) => {
    if (el.nextSibling && el.nextSibling.nodeType === Node.TEXT_NODE) {
      el.nextSibling.remove();
    }
    el.remove();
  });
  if (title !== void 0) {
    document2.title = title;
  }
  setAttrs(document2.documentElement, htmlAttrs);
  setAttrs(document2.body, bodyAttrs);
  newElements.forEach((el) => {
    head.insertBefore(el, headCountEl);
  });
  headCountEl.setAttribute("content", "" + newElements.length);
};
var createHead = () => {
  let allHeadObjs = [];
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base") {
            const key = getTagKey(tag.props);
            if (key) {
              let index2 = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev = deduped[i];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index2 = i;
                  break;
                }
              }
              if (index2 !== -1) {
                deduped.splice(index2, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2) {
      insertTags(head.headTags, document2);
    }
  };
  return head;
};
var tagToString = (tag) => {
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}>`;
  }
  return `<${tag.tag}${attrs}>${tag.props.children || ""}</${tag.tag}>`;
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of head.headTags) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, htmlAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      }));
    },
    get bodyAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, bodyAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      }));
    }
  };
};
const vueuseHead_eb94077c = defineNuxtPlugin((nuxt) => {
  const head = createHead();
  nuxt.app.use(head);
  nuxt._useMeta = (meta) => {
    const headObj = vue_cjs_prod.ref(meta);
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxt.ssrContext.renderMeta = () => renderHeadToString(head);
  }
});
function useMeta(meta) {
  const resolvedMeta = isFunction_1(meta) ? computed_1(meta) : meta;
  useNuxtApp()._useMeta(resolvedMeta);
}
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([_key, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useMeta(() => metaFactory(removeUndefinedProps(props), ctx));
  return () => {
    var _a2, _b;
    return renderChild ? (_b = (_a2 = ctx.slots).default) == null ? void 0 : _b.call(_a2) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = vue_cjs_prod.defineComponent({
  name: "Script",
  props: __spreadProps(__spreadValues({}, globalProps), {
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  }),
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const Link = vue_cjs_prod.defineComponent({
  name: "Link",
  props: __spreadProps(__spreadValues({}, globalProps), {
    as: String,
    crossorigin: String,
    disabled: Boolean,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  }),
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = vue_cjs_prod.defineComponent({
  name: "Base",
  props: __spreadProps(__spreadValues({}, globalProps), {
    href: String,
    target: String
  }),
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = vue_cjs_prod.defineComponent({
  name: "Title",
  setup: setupForUseMeta((_, { slots }) => {
    var _a2, _b;
    const title = ((_b = (_a2 = slots.default()) == null ? void 0 : _a2[0]) == null ? void 0 : _b.children) || null;
    return {
      title
    };
  })
});
const Meta = vue_cjs_prod.defineComponent({
  name: "Meta",
  props: __spreadProps(__spreadValues({}, globalProps), {
    charset: String,
    content: String,
    httpEquiv: String,
    name: String
  }),
  setup: setupForUseMeta((meta) => ({
    meta: [meta]
  }))
});
const Style = vue_cjs_prod.defineComponent({
  name: "Style",
  props: __spreadProps(__spreadValues({}, globalProps), {
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  }),
  setup: setupForUseMeta((props, { slots }) => {
    var _a2, _b, _c;
    const style = __spreadValues({}, props);
    const textContent = (_c = (_b = (_a2 = slots.default) == null ? void 0 : _a2.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.content = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = vue_cjs_prod.defineComponent({
  name: "Head",
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((headAttrs) => ({ headAttrs }), true)
});
const Body = vue_cjs_prod.defineComponent({
  name: "Body",
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  Script,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Body
});
const metaConfig = { "globalMeta": { "meta": [{ "charset": "utf-8" }, { "name": "viewport", "content": "width=device-width, initial-scale=1" }], "link": [], "style": [], "script": [] }, "mixinKey": "created" };
const plugin_f8bf0f94 = defineNuxtPlugin((nuxt) => {
  useMeta(metaConfig.globalMeta);
  nuxt.app.mixin({
    [metaConfig.mixinKey]() {
      var _a2;
      const instance = vue_cjs_prod.getCurrentInstance();
      const options = (instance == null ? void 0 : instance.type) || ((_a2 = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a2.$options);
      if (!options || !("head" in options)) {
        return;
      }
      useMeta(options.head);
    }
  });
  for (const name in Components) {
    nuxt.app.component(name, Components[name]);
  }
});
const layouts = {};
const NuxtLayout = vue_cjs_prod.defineComponent({
  props: {
    name: {
      type: [String, Boolean],
      default: "default"
    }
  },
  setup(props, context) {
    return () => {
      const layout = props.name;
      if (!layouts[layout]) {
        return context.slots.default();
      }
      return vue_cjs_prod.h(layouts[layout], props, context.slots);
    };
  }
});
const _export_sfc = (sfc, props) => {
  for (const [key, val] of props) {
    sfc[key] = val;
  }
  return sfc;
};
const _sfc_main$r = {
  name: "NuxtPage",
  components: { NuxtLayout },
  props: {
    layout: {
      type: String,
      default: null
    }
  },
  setup() {
    const updatedComponentLayout = null;
    const { $nuxt } = vue_cjs_prod.getCurrentInstance().proxy;
    function onSuspensePending(Component) {
      return $nuxt.callHook("page:start", Component);
    }
    function onSuspenseResolved(Component) {
      return $nuxt.callHook("page:finish", Component);
    }
    return {
      updatedComponentLayout,
      onSuspensePending,
      onSuspenseResolved
    };
  }
};
function _sfc_ssrRender$r(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterView = vue_cjs_prod.resolveComponent("RouterView");
  const _component_NuxtLayout = vue_cjs_prod.resolveComponent("NuxtLayout");
  _push(serverRenderer.exports.ssrRenderComponent(_component_RouterView, _attrs, {
    default: vue_cjs_prod.withCtx(({ Component }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if (Component) {
          _push2(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, {
            name: $props.layout || $setup.updatedComponentLayout || Component.type.layout
          }, {
            default: vue_cjs_prod.withCtx((_, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                serverRenderer.exports.ssrRenderSuspense(_push3, {
                  default: () => {
                    serverRenderer.exports.ssrRenderVNode(_push3, vue_cjs_prod.createVNode(vue_cjs_prod.resolveDynamicComponent(Component), {
                      key: _ctx.$route.path
                    }, null), _parent3, _scopeId2);
                  },
                  _: 2
                });
              } else {
                return [
                  vue_cjs_prod.createVNode(vue_cjs_prod.Transition, {
                    name: "page",
                    mode: "out-in"
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Suspense, {
                        onPending: () => $setup.onSuspensePending(Component),
                        onResolve: () => $setup.onSuspenseResolved(Component)
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.resolveDynamicComponent(Component), {
                            key: _ctx.$route.path
                          }))
                        ]),
                        _: 2
                      }, 1032, ["onPending", "onResolve"]))
                    ]),
                    _: 2
                  }, 1024)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          Component ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_NuxtLayout, {
            key: 0,
            name: $props.layout || $setup.updatedComponentLayout || Component.type.layout
          }, {
            default: vue_cjs_prod.withCtx(() => [
              vue_cjs_prod.createVNode(vue_cjs_prod.Transition, {
                name: "page",
                mode: "out-in"
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Suspense, {
                    onPending: () => $setup.onSuspensePending(Component),
                    onResolve: () => $setup.onSuspenseResolved(Component)
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.resolveDynamicComponent(Component), {
                        key: _ctx.$route.path
                      }))
                    ]),
                    _: 2
                  }, 1032, ["onPending", "onResolve"]))
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["name"])) : vue_cjs_prod.createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("node_modules/nuxt3/dist/pages/runtime/page.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const NuxtPage = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["ssrRender", _sfc_ssrRender$r]]);
const routes = [
  {
    "name": "foundation",
    "path": "/foundation",
    "file": "/Users/christoph/workspace/bitcoinuikit.com/pages/foundation.vue",
    "children": [],
    "component": () => Promise.resolve().then(function() {
      return foundation$1;
    })
  },
  {
    "name": "helper",
    "path": "/helper",
    "file": "/Users/christoph/workspace/bitcoinuikit.com/pages/helper.vue",
    "children": [],
    "component": () => Promise.resolve().then(function() {
      return helper$1;
    })
  },
  {
    "name": "home",
    "path": "/home",
    "file": "/Users/christoph/workspace/bitcoinuikit.com/pages/home.vue",
    "children": [],
    "component": () => Promise.resolve().then(function() {
      return home$1;
    })
  },
  {
    "name": "index",
    "path": "/",
    "file": "/Users/christoph/workspace/bitcoinuikit.com/pages/index.vue",
    "children": [],
    "component": () => Promise.resolve().then(function() {
      return index$1;
    })
  },
  {
    "name": "info",
    "path": "/info",
    "file": "/Users/christoph/workspace/bitcoinuikit.com/pages/info.vue",
    "children": [],
    "component": () => Promise.resolve().then(function() {
      return info$1;
    })
  },
  {
    "name": "screens-slug",
    "path": "/screens/:slug(.*)*",
    "file": "/Users/christoph/workspace/bitcoinuikit.com/pages/screens/[...slug].vue",
    "children": [],
    "component": () => Promise.resolve().then(function() {
      return ____slug_$1;
    })
  }
];
const router_e84f1cae = defineNuxtPlugin((nuxt) => {
  const { app } = nuxt;
  app.component("NuxtPage", NuxtPage);
  app.component("NuxtLayout", NuxtLayout);
  app.component("NuxtLink", vueRouter_cjs_prod.RouterLink);
  const routerHistory = vueRouter_cjs_prod.createMemoryHistory();
  const router = vueRouter_cjs_prod.createRouter({
    history: routerHistory,
    routes
  });
  app.use(router);
  nuxt.provide("router", router);
  const previousRoute = vue_cjs_prod.shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(app.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  nuxt.hook("app:created", async () => {
    {
      router.push(nuxt.ssrContext.url);
    }
    await router.isReady();
    const is404 = router.currentRoute.value.matched.length === 0;
    if (is404) {
      const error = new Error(`Page not found: ${nuxt.ssrContext.url}`);
      error.statusCode = 404;
      nuxt.ssrContext.error = error;
    }
  });
});
const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^["{[]|^-?[0-9][0-9.]{0,14}$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor") {
    return;
  }
  return value;
}
function destr(val) {
  if (typeof val !== "string") {
    return val;
  }
  const _lval = val.toLowerCase();
  if (_lval === "true") {
    return true;
  }
  if (_lval === "false") {
    return false;
  }
  if (_lval === "null") {
    return null;
  }
  if (_lval === "nan") {
    return NaN;
  }
  if (_lval === "infinity") {
    return Infinity;
  }
  if (_lval === "undefined") {
    return void 0;
  }
  if (!JsonSigRx.test(val)) {
    return val;
  }
  try {
    if (suspectProtoRx.test(val) || suspectConstructorRx.test(val)) {
      return JSON.parse(val, jsonParseTransform);
    }
    return JSON.parse(val);
  } catch (_e) {
    return val;
  }
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/gi;
const ENC_BRACKET_CLOSE_RE = /%5D/gi;
const ENC_CARET_RE = /%5E/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_CURLY_OPEN_RE = /%7B/gi;
const ENC_PIPE_RE = /%7C/gi;
const ENC_CURLY_CLOSE_RE = /%7D/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeQueryValue(text) {
  return encode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch (_err) {
    return "" + text;
  }
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(paramsStr = "") {
  const obj = {};
  if (paramsStr[0] === "?") {
    paramsStr = paramsStr.substr(1);
  }
  for (const param of paramsStr.split("&")) {
    const s = param.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decode(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
function encodeQueryItem(key, val) {
  if (!val) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(val)) {
    return val.map((_val) => `${encodeQueryKey(key)}=${encodeQueryValue(_val)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(val)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).map((k) => encodeQueryItem(k, query[k])).join("&");
}
function hasProtocol(inputStr, acceptProtocolRelative = false) {
  return /^\w+:\/\/.+/.test(inputStr) || acceptProtocolRelative && /^\/\/[^/]+/.test(inputStr);
}
const TRAILING_SLASH_RE = /\/$|\/\?/;
function hasTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return s0 + "/" + (s.length ? `?${s.join("?")}` : "");
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
  return (hasLeadingSlash(input) ? input.substr(1) : input) || "/";
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = __spreadValues(__spreadValues({}, parseQuery(parsed.search)), query);
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const i of input.filter(isNonEmptyURL)) {
    url = url ? withTrailingSlash(url) + withoutLeadingSlash(i) : i;
  }
  return url;
}
function parseURL(input = "", defaultProto) {
  if (!hasProtocol(input, true)) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [protocol = "", auth, hostAndPath] = (input.match(/([^:/]+:)?\/\/([^/@]+@)?(.*)/) || []).splice(1);
  const [host = "", path = ""] = (hostAndPath.match(/([^/?]*)(.*)?/) || []).splice(1);
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol,
    auth: auth ? auth.substr(0, auth.length - 1) : "",
    host,
    pathname,
    search,
    hash
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const fullpath = parsed.pathname + (parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "") + parsed.hash;
  if (!parsed.protocol) {
    return fullpath;
  }
  return parsed.protocol + "//" + (parsed.auth ? parsed.auth + "@" : "") + parsed.host + fullpath;
}
class FetchError extends Error {
  constructor() {
    super(...arguments);
    this.name = "FetchError";
  }
}
function createFetchError(request, response) {
  const message = `${response.status} ${response.statusText} (${request.toString()})`;
  const error = new FetchError(message);
  Object.defineProperty(error, "request", { get() {
    return request;
  } });
  Object.defineProperty(error, "response", { get() {
    return response;
  } });
  Object.defineProperty(error, "data", { get() {
    return response.data;
  } });
  const stack = error.stack;
  Object.defineProperty(error, "stack", { get() {
    return normalizeStack(stack);
  } });
  return error;
}
function normalizeStack(stack = "") {
  return stack.split("\n").filter((l) => !l.includes("createFetchError") && !l.includes("at $fetch") && !l.includes("processTicksAndRejections")).join("\n");
}
const payloadMethods = ["patch", "post", "put"];
function setHeader(options, _key, value) {
  const key = _key.toLowerCase();
  options.headers = options.headers || {};
  if ("set" in options.headers) {
    options.headers.set(key, value);
  } else if (Array.isArray(options.headers)) {
    const existingHeader = options.headers.find(([header]) => header.toLowerCase() === key);
    if (existingHeader) {
      existingHeader[1] = value;
    } else {
      options.headers.push([key, value]);
    }
  } else {
    const existingHeader = Object.keys(options.headers).find((header) => header.toLowerCase() === key);
    options.headers[existingHeader || key] = value;
  }
}
function createFetch({ fetch: fetch2 }) {
  const raw = async function(request, opts) {
    var _a2;
    if (opts && typeof request === "string") {
      if (opts.baseURL) {
        request = joinURL(opts.baseURL, request);
      }
      if (opts.params) {
        request = withQuery(request, opts.params);
      }
      if (opts.body && opts.body.toString() === "[object Object]" && payloadMethods.includes(((_a2 = opts.method) == null ? void 0 : _a2.toLowerCase()) || "")) {
        opts.body = JSON.stringify(opts.body);
        setHeader(opts, "content-type", "application/json");
      }
    }
    const response = await fetch2(request, opts);
    const text = await response.text();
    response.data = destr(text);
    if (!response.ok) {
      throw createFetchError(request, response);
    }
    return response;
  };
  const $fetch2 = function(request, opts) {
    return raw(request, opts).then((r) => r.data);
  };
  $fetch2.raw = raw;
  return $fetch2;
}
const getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
};
const fetch = getGlobal().fetch || (() => {
  return Promise.reject(new Error("[ohmyfetch] globalThis.fetch is not supported!"));
});
const $fetch = createFetch({ fetch });
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch;
}
const nitroClient_e6acb2f0 = () => {
};
const components = {
  "IncludedContent": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return IncludedContent;
  }).then((c) => c.default || c)),
  "IncludedContentItem": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return IncludedContentItem;
  }).then((c) => c.default || c)),
  "Intro": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Intro;
  }).then((c) => c.default || c)),
  "PageTitle": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return PageTitle;
  }).then((c) => c.default || c)),
  "Tabs": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Tabs;
  }).then((c) => c.default || c)),
  "SiteFooter": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Footer;
  }).then((c) => c.default || c)),
  "SiteHeader": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Header$1;
  }).then((c) => c.default || c)),
  "SiteInfo": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Info;
  }).then((c) => c.default || c)),
  "SiteNav": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Nav;
  }).then((c) => c.default || c)),
  "HelperScreenItem": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return ScreenItem$3;
  }).then((c) => c.default || c)),
  "HelperScreenList": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return ScreenList$3;
  }).then((c) => c.default || c)),
  "ScreensOverlay": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Overlay;
  }).then((c) => c.default || c)),
  "ScreensScreenItem": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return ScreenItem$1;
  }).then((c) => c.default || c)),
  "ScreensScreenList": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return ScreenList$1;
  }).then((c) => c.default || c)),
  "ScreensSearch": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Search;
  }).then((c) => c.default || c)),
  "FoundationSwatch": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Swatch$1;
  }).then((c) => c.default || c)),
  "FoundationSwatches": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Swatches$1;
  }).then((c) => c.default || c)),
  "FoundationTypeItem": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return TypeItem$1;
  }).then((c) => c.default || c)),
  "FoundationTypeList": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return TypeList$1;
  }).then((c) => c.default || c))
};
function components_515c5644(nuxt) {
  for (const name in components) {
    nuxt.app.component(name, components[name]);
    nuxt.app.component("Lazy" + name, components[name]);
  }
}
const _plugins = [
  preload,
  vueuseHead_eb94077c,
  plugin_f8bf0f94,
  router_e84f1cae,
  nitroClient_e6acb2f0,
  components_515c5644
];
const _sfc_main$q = {};
function _sfc_ssrRender$q(_ctx, _push, _parent, _attrs) {
  const _component_App = vue_cjs_prod.resolveComponent("App");
  _push(serverRenderer.exports.ssrRenderComponent(_component_App, _attrs, null, _parent));
}
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("node_modules/nuxt3/dist/pages/runtime/root.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const RootComponent = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["ssrRender", _sfc_ssrRender$q]]);
const _sfc_main$p = {
  name: "SiteNav",
  data() {
    const links = [
      {
        label: "Info",
        to: "/info"
      },
      {
        label: "Foundation",
        to: "/foundation"
      },
      {
        label: "Screens",
        to: "/screens"
      }
    ];
    return {
      links
    };
  }
};
function _sfc_ssrRender$p(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = vue_cjs_prod.resolveComponent("NuxtLink");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "site-nav" }, _attrs))} data-v-6742cf54><h1 data-v-6742cf54>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Bitcoin UI Kit`);
      } else {
        return [
          vue_cjs_prod.createTextVNode("Bitcoin UI Kit")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</h1><nav data-v-6742cf54><!--[-->`);
  serverRenderer.exports.ssrRenderList($data.links, (item, index2) => {
    _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
      key: index2,
      to: item.to
    }, {
      default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${serverRenderer.exports.ssrInterpolate(item.label)}`);
        } else {
          return [
            vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.label), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></nav></div>`);
}
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/site/Nav.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const __nuxt_component_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["ssrRender", _sfc_ssrRender$p], ["__scopeId", "data-v-6742cf54"]]);
const Nav = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_0$4
});
const home$2 = {
  title: "Bitcoin UI Kit",
  description: "This design system and UI kit provides a design foundation for prototypes, concept explorations and open-source projects to kickstart the design process. So you can focus on what makes your Bitcoin product&nbsp;unique."
};
const info$2 = {
  title: "Info",
  description: "Design often starts with establishing foundations. The goal of this project is to provide a ready-to-use foundation for Bitcoin applications."
};
const foundation$2 = {
  title: "Foundation",
  description: 'These are the colors and type styles used in the kit. Icons and illustrations are from <a href="https://bitcoinicons.com/" target="_blank" rel="nofollow noreferrer notarget">Bitcoin&nbsp;Icons</a> and <a href="https://github.com/GBKS/bitcoin-hardware-illustrations" target="_blank" rel="nofollow noreferrer notarget">Bitcoin&nbsp;hardware&nbsp;illustrations</a>.'
};
const screens = {
  title: "Screens",
  description: "Browse some of the screens and user flows included in the kit."
};
const figma = {
  button: "Duplicate on Figma",
  url: "https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)"
};
const nav = [
  {
    label: "Home",
    to: "/"
  },
  {
    label: "Info",
    to: "/info"
  },
  {
    label: "Foundation",
    to: "/foundation"
  },
  {
    label: "Screens",
    to: "/screens"
  }
];
const swatches = {
  header: "A Peer-to-Peer Electronic Cash System",
  body: "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending.",
  light: [
    {
      label: "Orange",
      hex: "#F89B2A"
    },
    {
      label: "Red",
      hex: "#EB5757"
    },
    {
      label: "Green",
      hex: "#27AE60"
    },
    {
      label: "Blue",
      hex: "#2D9CDB"
    },
    {
      label: "Purple",
      hex: "#BB6BD9"
    },
    {
      label: "Foreground",
      hex: "#000000"
    },
    {
      label: "Neutral 8",
      hex: "#404040"
    },
    {
      label: "Neutral 7",
      hex: "#777777"
    },
    {
      label: "Neutral 6",
      hex: "#999999"
    },
    {
      label: "Neutral 5",
      hex: "#BBBBBB"
    },
    {
      label: "Neutral 4",
      hex: "#DEDEDE"
    },
    {
      label: "Neutral 3",
      hex: "#EDEDED"
    },
    {
      label: "Neutral 2",
      hex: "#F4F4F4"
    },
    {
      label: "Neutral 1",
      hex: "#F8F8F8"
    },
    {
      label: "Background",
      hex: "#FFFFFF"
    }
  ],
  dark: [
    {
      label: "Orange",
      hex: "#F89B2A"
    },
    {
      label: "Red",
      hex: "#EB5757"
    },
    {
      label: "Green",
      hex: "#27AE60"
    },
    {
      label: "Blue",
      hex: "#2D9CDB"
    },
    {
      label: "Purple",
      hex: "#BB6BD9"
    },
    {
      label: "Foreground",
      hex: "#FFFFFF"
    },
    {
      label: "Neutral 8",
      hex: "#CCCCCC"
    },
    {
      label: "Neutral 7",
      hex: "#B0B0B0"
    },
    {
      label: "Neutral 6",
      hex: "#949494"
    },
    {
      label: "Neutral 5",
      hex: "#787878"
    },
    {
      label: "Neutral 4",
      hex: "#5C5C5C"
    },
    {
      label: "Neutral 3",
      hex: "#444444"
    },
    {
      label: "Neutral 2",
      hex: "#2D2D2D"
    },
    {
      label: "Neutral 1",
      hex: "#1A1A1A"
    },
    {
      label: "Background",
      hex: "#000000"
    }
  ]
};
const Content = {
  home: home$2,
  info: info$2,
  foundation: foundation$2,
  screens,
  figma,
  nav,
  swatches
};
const _imports_0$1 = "/_nuxt/assets/arrow-right.3e99787f.svg";
const _sfc_main$o = {
  name: "PageTitle",
  data() {
    return {
      links: Content.nav,
      figmaLink: {
        label: Content.figma.button,
        url: Content.figma.url
      }
    };
  },
  computed: {
    activeLinkBase() {
      let result = this.links[0].to;
      for (let i = 1; i < this.links.length; i++) {
        if (this.$route.path.indexOf(this.links[i].to) === 0) {
          result = this.links[i].to;
        }
      }
      return result;
    },
    title() {
      const items = {
        "screens": Content.screens.title,
        "foundation": Content.foundation.title,
        "info": Content.info.title
      };
      let result = Content.home.title;
      for (let key in items) {
        if (this.$route.fullPath.indexOf(key) === 1) {
          result = items[key];
          break;
        }
      }
      return result;
    },
    description() {
      const items = {
        "screens": Content.screens.description,
        "foundation": Content.foundation.description,
        "info": Content.info.description
      };
      let result = Content.home.description;
      for (let key in items) {
        if (this.$route.fullPath.indexOf(key) === 1) {
          result = items[key];
          break;
        }
      }
      return result;
    },
    showFigmalink() {
      return this.$route.fullPath == "/";
    }
  }
};
function _sfc_ssrRender$o(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "page-title" }, _attrs))}><h1>${serverRenderer.exports.ssrInterpolate($options.title)}</h1><p>${$options.description}</p>`);
  if ($options.showFigmalink) {
    _push(`<a class="button"${serverRenderer.exports.ssrRenderAttr("href", $data.figmaLink.url)} target="_blank" rel="noreferrer noopener">${serverRenderer.exports.ssrInterpolate($data.figmaLink.label)} <img${serverRenderer.exports.ssrRenderAttr("src", _imports_0$1)} width="24" height="24" alt="Arrow right"></a>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/PageTitle.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const __nuxt_component_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["ssrRender", _sfc_ssrRender$o]]);
const PageTitle = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_1$2
});
const _sfc_main$n = {
  name: "SiteFooter"
};
function _sfc_ssrRender$n(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "site-footer" }, _attrs))} data-v-ec52590a><div class="seal" data-v-ec52590a><svg width="202" height="202" viewBox="0 0 202 202" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-ec52590a><path d="M33.227 90.426L33.7198 90.5108L33.7198 90.5108L33.227 90.426ZM30.3094 85.1605L30.2246 85.6532L30.2246 85.6532L30.3094 85.1605ZM32.2386 96.1676L32.1537 96.6603L32.6465 96.7452L32.7313 96.2524L32.2386 96.1676ZM18.7999 93.8541L18.3072 93.7692L18.2223 94.262L18.7151 94.3468L18.7999 93.8541ZM19.7262 88.4734L20.219 88.5582L19.7262 88.4734ZM23.9393 84.6044L23.8545 85.0971L23.8545 85.0971L23.9393 84.6044ZM26.4086 87.5293L25.9092 87.5549L25.9297 87.9542L26.3238 88.022L26.4086 87.5293ZM26.5398 87.5519L26.455 88.0446L26.925 88.1255L27.028 87.6599L26.5398 87.5519ZM25.2752 89.8745L25.7679 89.9594L25.7679 89.9594L25.2752 89.8745ZM24.9125 91.9809L24.8277 92.4736L25.3205 92.5585L25.4053 92.0657L24.9125 91.9809ZM23.9181 87.5532L23.8333 88.046L23.8333 88.046L23.9181 87.5532ZM21.9573 89.2493L21.4646 89.1645L21.4646 89.1645L21.9573 89.2493ZM21.5857 91.4082L21.0929 91.3233L21.0081 91.8161L21.5009 91.9009L21.5857 91.4082ZM30.8036 90.6101L30.3108 90.5252L30.3108 90.5252L30.8036 90.6101ZM30.4048 92.9264L30.32 93.4192L30.8127 93.504L30.8976 93.0112L30.4048 92.9264ZM29.5223 88.0451L29.4375 88.5378L29.4375 88.5378L29.5223 88.0451ZM27.2452 89.9299L27.738 90.0148L27.738 90.0148L27.2452 89.9299ZM26.8352 92.3119L26.3424 92.2271L26.2576 92.7198L26.7503 92.8046L26.8352 92.3119ZM36.3941 76.7638L36.8605 76.944L37.0407 76.4776L36.5743 76.2974L36.3941 76.7638ZM23.6741 71.8494L23.8543 71.383L23.3879 71.2028L23.2077 71.6692L23.6741 71.8494ZM35.3551 79.4531L35.1749 79.9195L35.6413 80.0997L35.8215 79.6333L35.3551 79.4531ZM22.6351 74.5387L22.1687 74.3585L21.9885 74.8249L22.4549 75.0051L22.6351 74.5387ZM42.6182 64.7581L43.0411 65.0248L43.3078 64.6018L42.8849 64.3352L42.6182 64.7581ZM33.0941 58.7528L32.6711 58.4861L32.4045 58.909L32.8274 59.1757L33.0941 58.7528ZM41.0982 67.1687L40.8315 67.5916L41.2544 67.8583L41.5211 67.4354L41.0982 67.1687ZM31.5741 61.1634L31.8408 60.7404L31.4179 60.4737L31.1512 60.8967L31.5741 61.1634ZM29.3474 64.6948L29.0807 65.1177L29.5037 65.3844L29.7704 64.9614L29.3474 64.6948ZM27.3367 63.4269L26.9138 63.1602L26.6471 63.5832L27.07 63.8499L27.3367 63.4269ZM33.3101 53.9535L33.5768 53.5306L33.1538 53.2639L32.8871 53.6869L33.3101 53.9535ZM35.3208 55.2214L35.7437 55.4881L36.0104 55.0651L35.5875 54.7984L35.3208 55.2214ZM52.8075 52.3983L52.466 52.0331L52.466 52.0331L52.8075 52.3983ZM53.8295 44.8246L54.2341 44.5309L53.9031 44.0748L53.4896 44.4579L53.8295 44.8246ZM43.3837 51.6206L43.0185 51.9621L43.0185 51.9621L43.3837 51.6206ZM43.2392 42.1658L43.5807 42.531L43.5807 42.531L43.2392 42.1658ZM50.9508 41.7461L51.2923 42.1113L51.7041 41.7262L51.2725 41.3634L50.9508 41.7461ZM48.8206 43.738L48.5088 44.1289L48.8466 44.3983L49.1621 44.1032L48.8206 43.738ZM45.0296 43.983L44.6881 43.6178L44.6881 43.6178L45.0296 43.983ZM45.5187 49.6241L45.1535 49.9656L45.1535 49.9656L45.5187 49.6241ZM51.0998 50.5038L50.7583 50.1386L50.7583 50.1386L51.0998 50.5038ZM51.6902 46.8068L51.3504 46.44L51.0445 46.7234L51.2684 47.0753L51.6902 46.8068ZM67.6419 41.2519L67.8708 41.6964L67.8708 41.6964L67.6419 41.2519ZM70.111 32.1009L69.6665 32.3298L69.6665 32.3298L70.111 32.1009ZM58.7578 37.9487L59.2023 37.7197L59.2023 37.7197L58.7578 37.9487ZM61.227 28.7977L61.4559 29.2422L61.4559 29.2422L61.227 28.7977ZM66.4742 38.9848L66.2452 38.5403L66.2452 38.5403L66.4742 38.9848ZM61.3564 36.6102L61.8009 36.3812L61.8009 36.3812L61.3564 36.6102ZM67.5125 33.4393L67.068 33.6683L67.068 33.6683L67.5125 33.4393ZM62.3947 31.0647L62.1658 30.6202L62.1658 30.6202L62.3947 31.0647ZM82.0933 34.5812L82.2224 35.0643L82.7055 34.9352L82.5764 34.4521L82.0933 34.5812ZM78.5723 21.4073L79.0553 21.2782L78.9262 20.7952L78.4431 20.9243L78.5723 21.4073ZM79.308 35.3257L78.825 35.4548L78.9541 35.9378L79.4371 35.8087L79.308 35.3257ZM75.7869 22.1518L75.6578 21.6687L75.1748 21.7978L75.3039 22.2809L75.7869 22.1518ZM91.8383 32.8449L91.8652 33.3442L92.3645 33.3173L92.3376 32.818L91.8383 32.8449ZM91.3767 24.2747L91.3498 23.7754L90.8505 23.8023L90.8774 24.3016L91.3767 24.2747ZM88.9594 33L88.4601 33.0269L88.487 33.5262L88.9863 33.4993L88.9594 33ZM88.226 19.3834L88.1991 18.8841L87.6998 18.911L87.7267 19.4103L88.226 19.3834ZM90.7525 19.2473L91.1489 18.9426L90.9885 18.7339L90.7256 18.748L90.7525 19.2473ZM97.0912 27.4943L96.6948 27.799L96.8552 28.0077L97.1181 27.9936L97.0912 27.4943ZM97.2109 27.4878L97.2378 27.9871L97.7371 27.9602L97.7102 27.461L97.2109 27.4878ZM96.7497 18.9243L96.7228 18.425L96.2235 18.4519L96.2504 18.9512L96.7497 18.9243ZM99.6153 18.7699L100.115 18.743L100.088 18.2438L99.5884 18.2706L99.6153 18.7699ZM100.349 32.3865L100.376 32.8858L100.875 32.8589L100.848 32.3596L100.349 32.3865ZM97.8621 32.5205L97.4666 32.8265L97.6271 33.0338L97.889 33.0197L97.8621 32.5205ZM91.4764 24.2693L91.8718 23.9633L91.7114 23.756L91.4495 23.7701L91.4764 24.2693ZM120.757 35.385L120.588 35.8557L120.588 35.8557L120.757 35.385ZM129.342 31.2043L128.871 31.0356L128.871 31.0356L129.342 31.2043ZM116.206 33.7545L115.736 33.5859L115.567 34.0566L116.038 34.2252L116.206 33.7545ZM120.806 20.9173L120.975 20.4466L120.504 20.278L120.335 20.7487L120.806 20.9173ZM125.394 22.5613L125.563 22.0906L125.563 22.0906L125.394 22.5613ZM121.478 33.0191L121.309 33.4898L121.309 33.4898L121.478 33.0191ZM119.754 32.4015L119.283 32.2328L119.114 32.7035L119.585 32.8722L119.754 32.4015ZM126.634 30.2341L126.164 30.0654L126.164 30.0654L126.634 30.2341ZM124.417 24.8352L124.248 25.3058L124.248 25.3058L124.417 24.8352ZM122.687 24.2153L122.856 23.7446L122.385 23.5759L122.216 24.0466L122.687 24.2153ZM140.897 45.348L140.616 45.7619L141.03 46.0424L141.311 45.6285L140.897 45.348ZM142.23 43.3803L142.644 43.6608L142.925 43.247L142.511 42.9664L142.23 43.3803ZM133.269 40.1778L132.855 39.8973L132.574 40.3112L132.988 40.5917L133.269 40.1778ZM140.919 28.8899L141.2 28.476L140.786 28.1955L140.505 28.6094L140.919 28.8899ZM148.525 34.0451L148.939 34.3257L149.22 33.9118L148.806 33.6312L148.525 34.0451ZM147.192 36.0128L146.911 36.4267L147.325 36.7072L147.606 36.2933L147.192 36.0128ZM141.972 32.4751L142.253 32.0612L141.839 31.7807L141.558 32.1946L141.972 32.4751ZM140.149 35.1648L139.735 34.8843L139.455 35.2982L139.869 35.5787L140.149 35.1648ZM144.977 38.4373L145.391 38.7178L145.672 38.3039L145.258 38.0234L144.977 38.4373ZM143.644 40.4049L143.363 40.8188L143.777 41.0993L144.058 40.6855L143.644 40.4049ZM138.816 37.1325L139.096 36.7186L138.682 36.4381L138.402 36.8519L138.816 37.1325ZM136.989 39.8277L136.575 39.5472L136.294 39.961L136.708 40.2416L136.989 39.8277ZM149.707 53.3356L149.336 53.6711L149.336 53.6711L149.707 53.3356ZM156.29 54.5178L156.624 54.8895L156.626 54.8876L156.29 54.5178ZM149.339 46.2603L149.71 45.9248L149.366 45.5447L148.995 45.898L149.339 46.2603ZM151.211 48.329L151.571 48.676L151.895 48.3398L151.582 47.9935L151.211 48.329ZM151.477 51.6893L151.848 51.3538L151.848 51.3538L151.477 51.6893ZM154.343 52.3557L154.676 52.7288L154.681 52.724L154.343 52.3557ZM154.052 49.4939L153.611 49.729L153.613 49.7327L154.052 49.4939ZM153.332 48.1427L153.774 47.9077L153.771 47.903L153.332 48.1427ZM153.594 42.8949L153.929 43.2668L153.932 43.2639L153.594 42.8949ZM160.122 43.9565L159.751 44.292L159.751 44.292L160.122 43.9565ZM160.48 50.4751L160.109 50.8106L160.45 51.1875L160.822 50.8403L160.48 50.4751ZM158.626 48.4261L158.256 48.0904L157.952 48.4259L158.255 48.7616L158.626 48.4261ZM158.322 45.5589L158.692 45.2234L158.692 45.2234L158.322 45.5589ZM155.721 44.9576L156.049 45.3352L156.057 45.3283L155.721 44.9576ZM155.915 47.6919L156.353 47.4519L156.351 47.4483L155.915 47.6919ZM156.519 48.797L156.081 49.037L156.084 49.043L156.519 48.797ZM159.108 64.6273L158.679 64.8844L158.936 65.3132L159.365 65.0562L159.108 64.6273ZM170.804 57.6168L171.061 58.0456L171.49 57.7886L171.233 57.3597L170.804 57.6168ZM157.625 62.1544L157.368 61.7256L156.939 61.9826L157.197 62.4115L157.625 62.1544ZM169.322 55.1439L169.75 54.8868L169.493 54.458L169.065 54.715L169.322 55.1439ZM164.327 76.6964L164.8 76.5349L164.8 76.5349L164.327 76.6964ZM171.69 80.4163L171.528 79.9431L171.528 79.9431L171.69 80.4163ZM168.863 68.3442L169.024 68.8174L169.024 68.8174L168.863 68.3442ZM177.565 72.1133L177.092 72.2748L177.092 72.2748L177.565 72.1133ZM175.102 79.1176L174.629 79.2792L174.814 79.8223L175.327 79.5642L175.102 79.1176ZM174.155 76.3451L173.87 75.9347L173.56 76.1499L173.682 76.5066L174.155 76.3451ZM175.167 72.9814L174.694 73.1429L174.694 73.1429L175.167 72.9814ZM169.832 71.1019L169.994 71.575L169.994 71.575L169.832 71.1019ZM166.744 75.8851L166.271 76.0466L166.271 76.0466L166.744 75.8851ZM170.364 77.9349L170.514 78.4118L171.003 78.2579L170.837 77.7734L170.364 77.9349ZM169.417 75.1624L169.256 74.6892L168.783 74.8508L168.944 75.3239L169.417 75.1624ZM171.472 74.4611L171.945 74.2995L171.783 73.8263L171.31 73.9879L171.472 74.4611ZM173.315 79.8612L173.477 80.3344L173.95 80.1728L173.788 79.6997L173.315 79.8612ZM168.45 91.5933L167.95 91.6214L167.978 92.1206L168.478 92.0925L168.45 91.5933ZM177.019 91.1114L177.518 91.0833L177.49 90.5841L176.991 90.6122L177.019 91.1114ZM168.288 88.7148L168.26 88.2156L167.76 88.2437L167.789 88.7429L168.288 88.7148ZM181.903 87.9491L182.402 87.921L182.374 87.4218L181.874 87.4499L181.903 87.9491ZM182.045 90.4753L182.35 90.871L182.559 90.71L182.544 90.4472L182.045 90.4753ZM173.813 96.8335L173.507 96.4378L173.299 96.5987L173.313 96.8616L173.813 96.8335ZM173.819 96.9532L173.32 96.9812L173.348 97.4805L173.847 97.4524L173.819 96.9532ZM182.382 96.4716L182.881 96.4436L182.853 95.9444L182.354 95.9724L182.382 96.4716ZM182.543 99.3369L182.571 99.8361L183.07 99.808L183.042 99.3088L182.543 99.3369ZM168.928 100.103L168.429 100.131L168.457 100.63L168.956 100.602L168.928 100.103ZM168.788 97.6163L168.481 97.2216L168.274 97.3826L168.289 97.6444L168.788 97.6163ZM177.024 91.2111L177.331 91.6058L177.538 91.4448L177.524 91.183L177.024 91.2111ZM45.0624 155.106L45.3422 155.52L45.8093 155.205L45.4405 154.779L45.0624 155.106ZM37.5277 153.828L37.9043 153.499L37.9043 153.499L37.5277 153.828ZM43.1539 152.901L43.532 152.573L43.2591 152.258L42.8999 152.47L43.1539 152.901ZM39.479 152.185L39.8556 151.856L39.8556 151.856L39.479 152.185ZM40.5475 146.637L40.2186 146.261L40.2186 146.261L40.5475 146.637ZM46.202 146.34L45.8254 146.669L45.8254 146.669L46.202 146.34ZM46.3183 150.137L45.9382 149.812L45.6575 150.14L45.9417 150.466L46.3183 150.137ZM48.2368 152.333L47.8602 152.662L48.2311 153.087L48.6084 152.668L48.2368 152.333ZM48.0789 144.612L48.4555 144.283L48.4555 144.283L48.0789 144.612ZM38.6246 144.436L38.2957 144.059L38.2957 144.059L38.6246 144.436ZM60.3338 164.857L59.9284 164.564L59.9284 164.564L60.3338 164.857ZM51.0566 166.799L50.7639 167.204L50.7639 167.204L51.0566 166.799ZM59.2565 155.44L58.9639 155.845L58.9639 155.845L59.2565 155.44ZM49.9793 157.382L49.5739 157.089L49.5739 157.089L49.9793 157.382ZM52.3493 159.093L51.9439 158.8L51.9439 158.8L52.3493 159.093ZM52.5493 164.731L52.2566 165.136L52.2566 165.136L52.5493 164.731ZM57.7639 157.508L58.0565 157.102L58.0565 157.102L57.7639 157.508ZM57.9638 163.146L57.5584 162.853L57.5584 162.853L57.9638 163.146ZM67.8416 166.826L68.0256 166.361L67.5607 166.177L67.3767 166.642L67.8416 166.826ZM64.564 175.11L64.3801 175.575L64.845 175.759L65.0289 175.294L64.564 175.11ZM67.9469 166.867L68.4469 166.866L68.4459 166.527L68.1308 166.402L67.9469 166.867ZM67.9752 176.388L67.4752 176.389L67.4762 176.728L67.7912 176.853L67.9752 176.388ZM69.7459 177.088L69.562 177.553L69.8766 177.678L70.1091 177.432L69.7459 177.088ZM76.2682 170.195L76.4522 169.73L76.1376 169.606L75.9051 169.852L76.2682 170.195ZM76.3735 170.237L76.8384 170.421L77.0224 169.956L76.5574 169.772L76.3735 170.237ZM73.1081 178.49L72.6432 178.306L72.4592 178.771L72.9242 178.955L73.1081 178.49ZM75.7085 179.519L75.5246 179.984L75.9895 180.168L76.1734 179.703L75.7085 179.519ZM80.7254 166.839L81.1903 167.023L81.3743 166.558L80.9093 166.374L80.7254 166.839ZM77.4192 165.531L77.6031 165.066L77.2912 164.943L77.0588 165.184L77.4192 165.531ZM70.5565 172.669L70.3726 173.134L70.6845 173.257L70.9169 173.015L70.5565 172.669ZM70.4079 172.61L69.908 172.616L69.9121 172.951L70.224 173.075L70.4079 172.61ZM70.2867 162.709L70.7867 162.703L70.7826 162.367L70.4707 162.244L70.2867 162.709ZM66.9805 161.401L67.1645 160.936L66.6995 160.752L66.5156 161.217L66.9805 161.401ZM61.9636 174.081L61.4987 173.897L61.3148 174.362L61.7797 174.546L61.9636 174.081ZM86.2127 173.303L86.2681 172.806L85.7712 172.751L85.7158 173.248L86.2127 173.303ZM85.2252 182.157L85.1698 182.654L85.6667 182.71L85.7221 182.213L85.2252 182.157ZM86.3252 173.316L86.8073 173.183L86.7173 172.856L86.3806 172.819L86.3252 173.316ZM88.8523 182.495L88.3702 182.628L88.4602 182.954L88.7969 182.992L88.8523 182.495ZM90.7449 182.706L90.6894 183.203L91.0257 183.24L91.1855 182.942L90.7449 182.706ZM95.2284 174.342L95.2839 173.845L94.9476 173.808L94.7878 174.106L95.2284 174.342ZM95.3409 174.355L95.8379 174.41L95.8933 173.913L95.3964 173.858L95.3409 174.355ZM94.3572 183.176L93.8602 183.12L93.8048 183.617L94.3017 183.673L94.3572 183.176ZM97.1364 183.486L97.081 183.983L97.5779 184.038L97.6334 183.541L97.1364 183.486ZM98.6479 169.933L99.1448 169.989L99.2002 169.492L98.7033 169.437L98.6479 169.933ZM95.1142 169.539L95.1697 169.042L94.8363 169.005L94.6755 169.3L95.1142 169.539ZM90.3665 178.229L90.3111 178.725L90.6445 178.763L90.8053 178.468L90.3665 178.229ZM90.2077 178.211L89.7269 178.348L89.8189 178.671L90.1523 178.708L90.2077 178.211ZM87.4911 168.689L87.9719 168.552L87.8798 168.229L87.5465 168.192L87.4911 168.689ZM83.9574 168.295L84.0128 167.798L83.5159 167.743L83.4605 168.24L83.9574 168.295ZM82.4459 181.847L81.949 181.792L81.8936 182.289L82.3905 182.344L82.4459 181.847ZM114.88 177.971L115.376 177.906L115.376 177.906L114.88 177.971ZM109.892 183.471L109.957 183.967L109.957 183.967L109.892 183.471ZM113.722 169.03L114.218 168.966L114.154 168.47L113.658 168.534L113.722 169.03ZM110.883 169.398L110.818 168.902L110.323 168.966L110.387 169.462L110.883 169.398ZM112.028 178.239L111.532 178.303L111.532 178.303L112.028 178.239ZM109.562 180.922L109.498 180.426L109.498 180.426L109.562 180.922ZM106.514 178.953L106.018 179.018L106.018 179.018L106.514 178.953ZM105.369 170.112L105.865 170.047L105.801 169.552L105.305 169.616L105.369 170.112ZM102.51 170.482L102.446 169.986L101.95 170.05L102.014 170.546L102.51 170.482ZM103.668 179.423L103.172 179.487L103.172 179.487L103.668 179.423ZM122.133 172.343L121.961 171.873L121.491 172.045L121.663 172.515L122.133 172.343ZM125.084 180.402L125.256 180.872L125.725 180.7L125.553 180.23L125.084 180.402ZM122.227 172.308L122.515 171.9L122.301 171.749L122.055 171.839L122.227 172.308ZM130.748 178.328L130.46 178.736L130.674 178.888L130.92 178.798L130.748 178.328ZM133.087 177.472L133.259 177.941L133.728 177.769L133.556 177.3L133.087 177.472ZM128.398 164.667L128.868 164.495L128.696 164.025L128.226 164.197L128.398 164.667ZM125.703 165.653L125.532 165.184L125.062 165.356L125.234 165.825L125.703 165.653ZM128.652 173.707L128.824 174.176L129.294 174.004L129.122 173.535L128.652 173.707ZM128.54 173.748L128.25 174.155L128.464 174.308L128.711 174.217L128.54 173.748ZM120.064 167.718L120.354 167.311L120.139 167.158L119.892 167.249L120.064 167.718ZM117.688 168.588L117.516 168.119L117.046 168.291L117.218 168.76L117.688 168.588ZM122.376 181.393L121.907 181.565L122.079 182.035L122.548 181.863L122.376 181.393ZM135.311 161.607L135.745 161.358L135.495 160.925L135.062 161.174L135.311 161.607ZM142.113 173.426L142.363 173.86L142.796 173.61L142.547 173.177L142.113 173.426ZM132.813 163.046L132.563 162.612L132.13 162.862L132.379 163.295L132.813 163.046ZM139.614 174.864L139.181 175.114L139.431 175.547L139.864 175.298L139.614 174.864ZM146.031 156.913L145.715 156.526L145.328 156.842L145.644 157.229L146.031 156.913ZM153.153 165.634L153.469 166.022L153.856 165.705L153.54 165.318L153.153 165.634ZM149.265 154.273L149.581 154.66L149.969 154.344L149.652 153.956L149.265 154.273ZM147.762 152.431L148.149 152.115L147.833 151.728L147.446 152.044L147.762 152.431ZM139.087 159.515L138.771 159.127L138.383 159.444L138.7 159.831L139.087 159.515ZM140.59 161.356L140.203 161.672L140.519 162.059L140.907 161.743L140.59 161.356ZM143.824 158.715L144.211 158.399L143.895 158.012L143.508 158.328L143.824 158.715ZM150.945 167.437L150.558 167.753L150.874 168.14L151.261 167.824L150.945 167.437ZM161.864 150.2L161.4 150.387L161.45 150.508L161.552 150.59L161.864 150.2ZM165.63 153.21L166.021 153.522L166.333 153.131L165.942 152.819L165.63 153.21ZM158.083 140.811L158.547 140.624L158.227 139.83L157.693 140.498L158.083 140.811ZM156.067 143.333L155.676 143.021L155.488 143.256L155.608 143.532L156.067 143.333ZM158.713 149.429L159.104 149.741L159.292 149.506L159.172 149.23L158.713 149.429ZM158.63 149.533L158.537 150.024L158.833 150.08L159.021 149.845L158.63 149.533ZM152.101 148.295L152.194 147.804L151.899 147.748L151.711 147.983L152.101 148.295ZM150.085 150.818L149.694 150.506L149.16 151.174L150.005 151.311L150.085 150.818ZM160.077 152.436L160.389 152.046L160.286 151.964L160.157 151.943L160.077 152.436ZM163.842 155.446L163.53 155.837L163.921 156.149L164.233 155.758L163.842 155.446ZM128.719 93.8875L129.214 93.9574L129.214 93.9542L128.719 93.8875ZM116.054 79.6187L115.568 79.5025L115.462 79.9457L115.893 80.0922L116.054 79.6187ZM120.747 103.083L120.636 102.596L119.298 102.901L120.519 103.528L120.747 103.083ZM126.689 118.229L126.214 118.07L126.214 118.071L126.689 118.229ZM104.767 126.958L104.855 126.465L104.39 126.383L104.281 126.843L104.767 126.958ZM102.309 137.347L102.192 137.833L102.68 137.951L102.795 137.462L102.309 137.347ZM96.051 135.836L95.5648 135.719L95.448 136.205L95.9336 136.322L96.051 135.836ZM98.5094 125.615L98.9956 125.732L99.1117 125.249L98.6295 125.129L98.5094 125.615ZM93.518 124.346L93.6467 123.863L93.1508 123.731L93.0317 124.23L93.518 124.346ZM91.0595 134.642L90.9422 135.128L91.4295 135.246L91.5459 134.759L91.0595 134.642ZM84.8017 133.132L84.3151 133.016L84.2005 133.501L84.6843 133.618L84.8017 133.132ZM87.2601 122.742L87.7467 122.857L87.8562 122.395L87.3993 122.262L87.2601 122.742ZM84.5968 122.06L84.48 122.546L84.48 122.546L84.5968 122.06ZM82.8274 121.623L82.9531 121.139L82.941 121.136L82.8274 121.623ZM74.6698 119.721L74.2072 119.531L73.9843 120.074L74.5563 120.208L74.6698 119.721ZM77.6311 112.502L77.7549 112.018L77.3336 111.91L77.1686 112.313L77.6311 112.502ZM82.2314 113.621L82.3417 113.134L80.6575 112.753L81.8776 113.975L82.2314 113.621ZM85.081 112.111L85.5446 112.298L85.5593 112.262L85.5681 112.223L85.081 112.111ZM88.8805 95.6968L89.0277 95.219L88.5145 95.0608L88.3933 95.584L88.8805 95.6968ZM89.1971 95.7714L89.1034 96.2625L89.1034 96.2625L89.1971 95.7714ZM89.5137 95.846L89.3665 96.3238L89.7986 95.4351L89.5137 95.846ZM89.0773 95.6653L89.202 95.1811L89.202 95.1811L89.0773 95.6653ZM88.8805 95.6035L88.3939 95.4884L88.2985 95.8918L88.6771 96.0603L88.8805 95.6035ZM91.6555 83.8713L92.1421 83.9864L92.1513 83.9477L92.1542 83.908L91.6555 83.8713ZM88.7315 80.3088L88.4884 79.8719L87.3833 80.4867L88.61 80.7938L88.7315 80.3088ZM84.2243 79.1897L83.7378 79.074L83.6202 79.569L84.1171 79.678L84.2243 79.1897ZM85.8074 72.5309L85.9241 72.0447L85.4368 71.9277L85.3209 72.4152L85.8074 72.5309ZM94.4306 74.6012L94.3139 75.0874L94.3156 75.0878L94.4306 74.6012ZM96.4514 75.0396L96.35 75.5292L96.35 75.5292L96.4514 75.0396ZM98.4722 75.4779L98.3571 75.9645L98.8426 76.0793L98.9585 75.594L98.4722 75.4779ZM100.931 65.1819L101.047 64.6956L100.56 64.5796L100.444 65.0658L100.931 65.1819ZM107.263 66.6927L107.75 66.8079L107.865 66.3222L107.379 66.2064L107.263 66.6927ZM104.879 76.7649L104.393 76.6497L104.274 77.1524L104.78 77.2549L104.879 76.7649ZM109.87 77.884L109.755 78.3706L110.242 78.4856L110.357 77.9992L109.87 77.884ZM112.254 67.8119L112.372 67.3258L111.884 67.208L111.768 67.6967L112.254 67.8119ZM118.512 69.3227L118.999 69.4388L119.114 68.9537L118.63 68.8367L118.512 69.3227ZM114.638 114.088L115.125 114.202L115.125 114.201L114.638 114.088ZM96.5734 117.071L96.6978 116.586L96.6978 116.586L96.5734 117.071ZM100.363 103.358L100.468 102.869L100.468 102.869L100.363 103.358ZM98.7143 102.99L98.8327 102.504L98.3428 102.385L98.2275 102.875L98.7143 102.99ZM95.4736 116.792L94.9868 116.678L94.8735 117.161L95.3552 117.278L95.4736 116.792ZM116.37 93.8875L115.884 93.7719L115.884 93.7731L116.37 93.8875ZM101.08 96.8854L101.206 96.4013L101.206 96.4013L101.08 96.8854ZM104.609 84.4564L104.714 83.9675L104.714 83.9675L104.609 84.4564ZM103.24 84.1511L103.36 83.6656L102.872 83.5454L102.754 84.0339L103.24 84.1511ZM100.223 96.6667L99.7368 96.5495L99.6202 97.0331L100.103 97.1522L100.223 96.6667ZM100.711 201.099C156.216 201.099 201.211 156.103 201.211 100.599H200.211C200.211 155.551 155.664 200.099 100.711 200.099V201.099ZM0.211426 100.599C0.211426 156.103 45.2068 201.099 100.711 201.099V200.099C45.7591 200.099 1.21143 155.551 1.21143 100.599H0.211426ZM100.711 0.0986328C45.2068 0.0986328 0.211426 45.094 0.211426 100.599H1.21143C1.21143 45.6463 45.7591 1.09863 100.711 1.09863V0.0986328ZM201.211 100.599C201.211 45.094 156.216 0.0986328 100.711 0.0986328V1.09863C155.664 1.09863 200.211 45.6463 200.211 100.599H201.211ZM100.711 194.849C152.764 194.849 194.961 152.651 194.961 100.599H193.961C193.961 152.099 152.212 193.849 100.711 193.849V194.849ZM6.46143 100.599C6.46143 152.651 48.6586 194.849 100.711 194.849V193.849C49.2109 193.849 7.46143 152.099 7.46143 100.599H6.46143ZM100.711 6.34863C48.6586 6.34863 6.46143 48.5458 6.46143 100.599H7.46143C7.46143 49.0981 49.2109 7.34863 100.711 7.34863V6.34863ZM194.961 100.599C194.961 48.5458 152.764 6.34863 100.711 6.34863V7.34863C152.212 7.34863 193.961 49.0981 193.961 100.599H194.961ZM100.711 159.432C133.204 159.432 159.545 133.091 159.545 100.599H158.545C158.545 132.539 132.652 158.432 100.711 158.432V159.432ZM41.878 100.599C41.878 133.091 68.2186 159.432 100.711 159.432V158.432C68.7709 158.432 42.878 132.539 42.878 100.599H41.878ZM100.711 41.7653C68.2186 41.7653 41.878 68.1059 41.878 100.599H42.878C42.878 68.6582 68.7709 42.7653 100.711 42.7653V41.7653ZM159.545 100.599C159.545 68.1059 133.204 41.7653 100.711 41.7653V42.7653C132.652 42.7653 158.545 68.6582 158.545 100.599H159.545ZM100.711 153.182C129.752 153.182 153.295 129.64 153.295 100.599H152.295C152.295 129.087 129.2 152.182 100.711 152.182V153.182ZM48.1281 100.599C48.1281 129.64 71.6705 153.182 100.711 153.182V152.182C72.2228 152.182 49.1281 129.087 49.1281 100.599H48.1281ZM100.711 48.0153C71.6705 48.0153 48.1281 71.5576 48.1281 100.599H49.1281C49.1281 72.1099 72.2228 49.0153 100.711 49.0153V48.0153ZM153.295 100.599C153.295 71.5576 129.752 48.0153 100.711 48.0153V49.0153C129.2 49.0153 152.295 72.1099 152.295 100.599H153.295ZM33.7198 90.5108C33.9937 88.9196 33.7989 87.5672 33.1959 86.5453C32.5877 85.5146 31.5952 84.8745 30.3942 84.6677L30.2246 85.6532C31.1628 85.8147 31.8889 86.2981 32.3346 87.0535C32.7856 87.8177 32.98 88.9138 32.7343 90.3411L33.7198 90.5108ZM32.7313 96.2524L33.7198 90.5108L32.7343 90.3411L31.7458 96.0827L32.7313 96.2524ZM18.7151 94.3468L32.1537 96.6603L32.3234 95.6748L18.8847 93.3613L18.7151 94.3468ZM19.2335 88.3885L18.3072 93.7692L19.2927 93.9389L20.219 88.5582L19.2335 88.3885ZM24.0242 84.1116C22.8856 83.9156 21.8041 84.1703 20.9412 84.9189C20.0896 85.6575 19.5013 86.8324 19.2335 88.3885L20.219 88.5582C20.4617 87.1484 20.9727 86.2153 21.5964 85.6743C22.2088 85.1431 22.9786 84.9463 23.8545 85.0971L24.0242 84.1116ZM26.9079 87.5037C26.8664 86.6936 26.6171 85.9249 26.1304 85.3131C25.6393 84.6959 24.9288 84.2673 24.0242 84.1116L23.8545 85.0971C24.5313 85.2136 25.0182 85.5215 25.3478 85.9358C25.6817 86.3554 25.8764 86.913 25.9092 87.5549L26.9079 87.5037ZM26.6246 87.0591L26.4934 87.0365L26.3238 88.022L26.455 88.0446L26.6246 87.0591ZM30.3942 84.6677C28.1303 84.278 26.4419 85.6794 26.0516 87.4439L27.028 87.6599C27.3085 86.3914 28.512 85.3584 30.2246 85.6532L30.3942 84.6677ZM24.7824 89.7897L24.4198 91.8961L25.4053 92.0657L25.7679 89.9594L24.7824 89.7897ZM23.8333 88.046C24.2179 88.1122 24.4774 88.3121 24.6342 88.5917C24.7975 88.8826 24.8675 89.2955 24.7824 89.7897L25.7679 89.9594C25.8828 89.2921 25.8057 88.6358 25.5063 88.1023C25.2004 87.5573 24.6814 87.1773 24.003 87.0605L23.8333 88.046ZM22.4501 89.3342C22.5447 88.7844 22.75 88.4395 22.9768 88.2488C23.1942 88.0659 23.4773 87.9847 23.8333 88.046L24.003 87.0605C23.3878 86.9546 22.799 87.0915 22.333 87.4835C21.8764 87.8676 21.5868 88.4544 21.4646 89.1645L22.4501 89.3342ZM22.0784 91.493L22.4501 89.3341L21.4646 89.1645L21.0929 91.3233L22.0784 91.493ZM24.9974 91.4881L21.6705 90.9154L21.5009 91.9009L24.8277 92.4736L24.9974 91.4881ZM30.3108 90.5252L29.9121 92.8416L30.8976 93.0112L31.2963 90.6949L30.3108 90.5252ZM29.4375 88.5378C29.8215 88.6039 30.0629 88.7738 30.2048 89.0356C30.3586 89.3193 30.4376 89.7889 30.3108 90.5252L31.2963 90.6949C31.4429 89.8432 31.3866 89.1174 31.084 88.5591C30.7695 87.9788 30.2336 87.6602 29.6071 87.5523L29.4375 88.5378ZM27.738 90.0148C27.8394 89.4254 28.0825 89.0257 28.3704 88.7929C28.6529 88.5644 29.0159 88.4652 29.4375 88.5378L29.6071 87.5523C28.9197 87.434 28.2617 87.5948 27.7416 88.0153C27.227 88.4314 26.886 89.0696 26.7525 89.8451L27.738 90.0148ZM27.3279 92.3967L27.738 90.0148L26.7525 89.8451L26.3424 92.2271L27.3279 92.3967ZM30.4896 92.4336L26.92 91.8191L26.7503 92.8046L30.32 93.4192L30.4896 92.4336ZM36.5743 76.2974L23.8543 71.383L23.4939 72.3158L36.2139 77.2302L36.5743 76.2974ZM35.8215 79.6333L36.8605 76.944L35.9277 76.5836L34.8887 79.273L35.8215 79.6333ZM22.4549 75.0051L35.1749 79.9195L35.5353 78.9867L22.8153 74.0723L22.4549 75.0051ZM23.2077 71.6692L22.1687 74.3585L23.1015 74.7189L24.1405 72.0296L23.2077 71.6692ZM42.8849 64.3352L33.3608 58.3298L32.8274 59.1757L42.3515 65.181L42.8849 64.3352ZM41.5211 67.4354L43.0411 65.0248L42.1952 64.4914L40.6752 66.902L41.5211 67.4354ZM31.3074 61.5863L40.8315 67.5916L41.3649 66.7458L31.8408 60.7404L31.3074 61.5863ZM29.7704 64.9614L31.9971 61.43L31.1512 60.8967L28.9245 64.4281L29.7704 64.9614ZM27.07 63.8499L29.0807 65.1177L29.6141 64.2718L27.6034 63.004L27.07 63.8499ZM32.8871 53.6869L26.9138 63.1602L27.7597 63.6936L33.733 54.2202L32.8871 53.6869ZM35.5875 54.7984L33.5768 53.5306L33.0434 54.3765L35.0541 55.6443L35.5875 54.7984ZM33.517 59.0195L35.7437 55.4881L34.8978 54.9547L32.6711 58.4861L33.517 59.0195ZM53.149 52.7635C55.8896 50.2009 55.8657 46.7789 54.2341 44.5309L53.4248 45.1183C54.765 46.9648 54.8321 49.8207 52.466 52.0331L53.149 52.7635ZM43.0185 51.9621C44.6071 53.6609 46.4106 54.5523 48.2051 54.6613C50.0014 54.7705 51.7286 54.0918 53.149 52.7635L52.466 52.0331C51.2213 53.197 49.7556 53.7537 48.2657 53.6632C46.774 53.5725 45.1982 52.8289 43.7489 51.2791L43.0185 51.9621ZM42.8977 41.8006C41.4939 43.1132 40.6995 44.7883 40.6822 46.589C40.6649 48.3889 41.424 50.2569 43.0185 51.9621L43.7489 51.2791C42.2965 49.7258 41.6678 48.0965 41.6822 46.5987C41.6966 45.1017 42.3534 43.6786 43.5807 42.531L42.8977 41.8006ZM51.2725 41.3634C49.9672 40.2662 48.4902 39.7833 47.015 39.8833C45.5452 39.983 44.1196 40.658 42.8977 41.8006L43.5807 42.531C44.664 41.518 45.8801 40.9626 47.0827 40.881C48.2799 40.7998 49.5061 41.1849 50.629 42.1288L51.2725 41.3634ZM49.1621 44.1032L51.2923 42.1113L50.6093 41.3809L48.4791 43.3728L49.1621 44.1032ZM45.3711 44.3482C45.8767 43.8754 46.4236 43.6367 46.9473 43.6011C47.4679 43.5657 48.0061 43.7279 48.5088 44.1289L49.1324 43.3471C48.4514 42.8039 47.6704 42.5497 46.8796 42.6034C46.0919 42.6569 45.3351 43.0128 44.6881 43.6178L45.3711 44.3482ZM45.8839 49.2826C44.9667 48.3017 44.5299 47.354 44.4681 46.5298C44.4075 45.7216 44.702 44.9739 45.3711 44.3482L44.6881 43.6178C43.8155 44.4337 43.3859 45.4707 43.4709 46.6046C43.5548 47.7226 44.1334 48.8747 45.1535 49.9656L45.8839 49.2826ZM50.7583 50.1386C50.0998 50.7544 49.3492 51.0057 48.5566 50.8977C47.7483 50.7876 46.8294 50.2937 45.8839 49.2826L45.1535 49.9656C46.2 51.0847 47.3154 51.7378 48.4215 51.8886C49.5434 52.0415 50.5873 51.6676 51.4413 50.869L50.7583 50.1386ZM51.2684 47.0753C51.6051 47.6043 51.7068 48.1418 51.6219 48.648C51.5363 49.1586 51.254 49.6751 50.7583 50.1386L51.4413 50.869C52.0691 50.282 52.4803 49.5758 52.6081 48.8134C52.7367 48.0465 52.5719 47.2608 52.112 46.5383L51.2684 47.0753ZM53.4896 44.4579L51.3504 46.44L52.03 47.1735L54.1693 45.1914L53.4896 44.4579ZM67.8708 41.6964C69.5847 40.8136 70.8131 39.4155 71.3271 37.6851C71.841 35.9552 71.625 33.9482 70.5555 31.8719L69.6665 32.3298C70.6398 34.2194 70.7964 35.9601 70.3685 37.4004C69.9408 38.8402 68.9132 40.0346 67.4129 40.8074L67.8708 41.6964ZM58.3133 38.1776C59.378 40.2446 60.8817 41.588 62.5871 42.1776C64.2933 42.7676 66.1476 42.584 67.8708 41.6964L67.4129 40.8074C65.9043 41.5844 64.3333 41.7233 62.9139 41.2325C61.4936 40.7415 60.1713 39.6009 59.2023 37.7197L58.3133 38.1776ZM60.998 28.3532C59.2757 29.2403 58.0468 30.6383 57.5349 32.3683C57.0233 34.0976 57.2443 36.1022 58.3133 38.1776L59.2023 37.7197C58.2286 35.8292 58.0682 34.0906 58.4938 32.6521C58.9193 31.2143 59.9463 30.0197 61.4559 29.2422L60.998 28.3532ZM70.5555 31.8719C69.4861 29.7956 67.9775 28.4544 66.2707 27.8683C64.5634 27.2821 62.7119 27.4704 60.998 28.3532L61.4559 29.2422C62.9562 28.4694 64.5254 28.3263 65.9459 28.8141C67.3669 29.302 68.6933 30.4402 69.6665 32.3298L70.5555 31.8719ZM66.2452 38.5403C65.4333 38.9585 64.644 38.9888 63.9158 38.6643C63.1715 38.3326 62.4297 37.6019 61.8009 36.3812L60.9119 36.8391C61.6064 38.1874 62.4911 39.1242 63.5088 39.5777C64.5425 40.0384 65.6505 39.9715 66.7031 39.4293L66.2452 38.5403ZM67.068 33.6683C67.6965 34.8885 67.8594 35.9174 67.6966 36.7166C67.5372 37.4988 67.0539 38.1237 66.2452 38.5403L66.7031 39.4293C67.7531 38.8884 68.4505 38.0251 68.6765 36.9162C68.8989 35.8242 68.6517 34.5591 67.957 33.2104L67.068 33.6683ZM62.6237 31.5092C63.4323 31.0927 64.2218 31.0621 64.9512 31.3865C65.6963 31.718 66.4395 32.4481 67.068 33.6683L67.957 33.2104C67.2623 31.8616 66.3758 30.9257 65.3576 30.4728C64.3236 30.0129 63.2158 30.0794 62.1658 30.6202L62.6237 31.5092ZM61.8009 36.3812C61.1721 35.1605 61.008 34.1323 61.1701 33.3337C61.3288 32.5525 61.8117 31.9275 62.6237 31.5092L62.1658 30.6202C61.1131 31.1624 60.4153 32.0257 60.1901 33.1348C59.9685 34.2266 60.2174 35.4909 60.9119 36.8391L61.8009 36.3812ZM82.5764 34.4521L79.0553 21.2782L78.0892 21.5364L81.6103 34.7103L82.5764 34.4521ZM79.4371 35.8087L82.2224 35.0643L81.9642 34.0982L79.1789 34.8426L79.4371 35.8087ZM75.3039 22.2809L78.825 35.4548L79.791 35.1966L76.27 22.0227L75.3039 22.2809ZM78.4431 20.9243L75.6578 21.6687L75.9161 22.6348L78.7014 21.8904L78.4431 20.9243ZM92.3376 32.818L91.876 24.2478L90.8774 24.3016L91.339 32.8718L92.3376 32.818ZM88.9863 33.4993L91.8652 33.3442L91.8114 32.3456L88.9325 32.5007L88.9863 33.4993ZM87.7267 19.4103L88.4601 33.0269L89.4587 32.9731L88.7253 19.3565L87.7267 19.4103ZM90.7256 18.748L88.1991 18.8841L88.2529 19.8826L90.7794 19.7466L90.7256 18.748ZM97.4877 27.1896L91.1489 18.9426L90.3561 19.552L96.6948 27.799L97.4877 27.1896ZM97.184 26.9886L97.0643 26.995L97.1181 27.9936L97.2378 27.9871L97.184 26.9886ZM96.2504 18.9512L96.7116 27.5147L97.7102 27.461L97.2489 18.8974L96.2504 18.9512ZM99.5884 18.2706L96.7228 18.425L96.7766 19.4235L99.6422 19.2692L99.5884 18.2706ZM100.848 32.3596L100.115 18.743L99.116 18.7968L99.8494 32.4134L100.848 32.3596ZM97.889 33.0197L100.376 32.8858L100.322 31.8873L97.8352 32.0212L97.889 33.0197ZM91.081 24.5753L97.4666 32.8265L98.2575 32.2145L91.8718 23.9633L91.081 24.5753ZM91.4036 24.774L91.5033 24.7686L91.4495 23.7701L91.3498 23.7754L91.4036 24.774ZM120.588 35.8557C122.643 36.5917 124.573 36.564 126.196 35.7742C127.818 34.9853 129.061 33.471 129.813 31.373L128.871 31.0356C128.186 32.9492 127.092 34.226 125.759 34.875C124.427 35.523 122.783 35.5798 120.926 34.9143L120.588 35.8557ZM116.038 34.2252L120.588 35.8557L120.926 34.9143L116.375 33.2838L116.038 34.2252ZM120.335 20.7487L115.736 33.5859L116.677 33.9232L121.277 21.086L120.335 20.7487ZM125.563 22.0906L120.975 20.4466L120.637 21.388L125.226 23.032L125.563 22.0906ZM129.813 31.373C130.562 29.2808 130.561 27.3278 129.813 25.6953C129.064 24.0611 127.599 22.82 125.563 22.0906L125.226 23.032C127.064 23.6906 128.289 24.7715 128.904 26.112C129.519 27.4542 129.555 29.1287 128.871 31.0356L129.813 31.373ZM121.646 32.5484L119.922 31.9308L119.585 32.8722L121.309 33.4898L121.646 32.5484ZM126.164 30.0654C125.672 31.4385 125.047 32.2169 124.345 32.5813C123.653 32.9409 122.777 32.9534 121.646 32.5484L121.309 33.4898C122.592 33.9495 123.78 34.0018 124.806 33.4688C125.823 32.9406 126.571 31.8942 127.105 30.4027L126.164 30.0654ZM124.248 25.3058C125.376 25.7101 126.045 26.2735 126.352 26.9862C126.663 27.708 126.653 28.699 126.164 30.0654L127.105 30.4027C127.637 28.9171 127.722 27.6399 127.271 26.5908C126.815 25.5327 125.864 24.8227 124.586 24.3645L124.248 25.3058ZM122.518 24.686L124.248 25.3058L124.586 24.3645L122.856 23.7446L122.518 24.686ZM120.224 32.5702L123.158 24.3839L122.216 24.0466L119.283 32.2328L120.224 32.5702ZM141.311 45.6285L142.644 43.6608L141.817 43.0998L140.483 45.0675L141.311 45.6285ZM132.988 40.5917L140.616 45.7619L141.177 44.9341L133.549 39.7639L132.988 40.5917ZM140.505 28.6094L132.855 39.8973L133.683 40.4583L141.333 29.1704L140.505 28.6094ZM148.806 33.6312L141.2 28.476L140.639 29.3038L148.245 34.459L148.806 33.6312ZM147.606 36.2933L148.939 34.3257L148.112 33.7646L146.778 35.7323L147.606 36.2933ZM141.692 32.889L146.911 36.4267L147.472 35.5989L142.253 32.0612L141.692 32.889ZM140.563 35.4453L142.386 32.7556L141.558 32.1946L139.735 34.8843L140.563 35.4453ZM145.258 38.0234L140.43 34.7509L139.869 35.5787L144.697 38.8512L145.258 38.0234ZM144.058 40.6855L145.391 38.7178L144.564 38.1567L143.23 40.1244L144.058 40.6855ZM138.535 37.5464L143.363 40.8188L143.924 39.991L139.096 36.7186L138.535 37.5464ZM137.403 40.1082L139.229 37.413L138.402 36.8519L136.575 39.5472L137.403 40.1082ZM142.511 42.9664L137.269 39.4138L136.708 40.2416L141.95 43.7942L142.511 42.9664ZM149.336 53.6711C150.502 54.9596 151.777 55.7511 153.055 55.9715C154.35 56.1949 155.59 55.8206 156.624 54.8895L155.955 54.1461C155.134 54.8853 154.199 55.1542 153.225 54.9861C152.234 54.815 151.145 54.1803 150.078 53.0001L149.336 53.6711ZM148.995 45.898C147.833 47.0026 147.297 48.2978 147.39 49.674C147.482 51.0307 148.18 52.3929 149.336 53.6711L150.078 53.0001C149.014 51.8244 148.459 50.6656 148.388 49.6065C148.317 48.5668 148.707 47.5513 149.684 46.6226L148.995 45.898ZM151.582 47.9935L149.71 45.9248L148.968 46.5957L150.84 48.6645L151.582 47.9935ZM151.848 51.3538C151.392 50.8506 151.154 50.3521 151.108 49.9107C151.065 49.4872 151.193 49.0684 151.571 48.676L150.851 47.982C150.28 48.5745 150.038 49.2805 150.114 50.0131C150.187 50.7279 150.556 51.4171 151.106 52.0247L151.848 51.3538ZM154.01 51.9827C153.769 52.1975 153.468 52.2733 153.11 52.1917C152.737 52.1068 152.292 51.8445 151.848 51.3538L151.106 52.0247C151.645 52.6202 152.26 53.0238 152.888 53.1668C153.531 53.3132 154.171 53.1792 154.676 52.7287L154.01 51.9827ZM153.613 49.7327C153.974 50.3973 154.177 50.89 154.23 51.2647C154.277 51.5989 154.203 51.8053 154.004 51.9874L154.681 52.724C155.159 52.2848 155.305 51.7313 155.22 51.1255C155.14 50.5602 154.86 49.9328 154.491 49.2551L153.613 49.7327ZM152.891 48.3778L153.611 49.729L154.493 49.2589L153.774 47.9077L152.891 48.3778ZM153.26 42.5231C152.413 43.2843 152.001 44.2054 151.977 45.2316C151.953 46.2365 152.303 47.3015 152.893 48.3825L153.771 47.903C153.226 46.9049 152.959 46.0181 152.976 45.2549C152.994 44.5131 153.28 43.8498 153.929 43.2668L153.26 42.5231ZM160.493 43.6211C159.431 42.4476 158.161 41.6946 156.876 41.4747C155.58 41.2529 154.291 41.5801 153.257 42.526L153.932 43.2639C154.726 42.538 155.698 42.2877 156.707 42.4604C157.728 42.635 158.807 43.2486 159.751 44.292L160.493 43.6211ZM160.822 50.8403C161.816 49.9107 162.294 48.7017 162.23 47.4127C162.167 46.133 161.571 44.8129 160.493 43.6211L159.751 44.292C160.71 45.3516 161.182 46.4607 161.231 47.4624C161.281 48.4547 160.92 49.3793 160.139 50.1099L160.822 50.8403ZM158.255 48.7616L160.109 50.8106L160.851 50.1396L158.997 48.0907L158.255 48.7616ZM157.951 45.8944C158.366 46.3534 158.558 46.7755 158.595 47.1283C158.63 47.4662 158.529 47.7888 158.256 48.0904L158.997 48.7619C159.447 48.2652 159.656 47.6653 159.589 47.0246C159.524 46.3988 159.202 45.7864 158.692 45.2234L157.951 45.8944ZM156.057 45.3283C156.26 45.1439 156.51 45.0723 156.809 45.1342C157.125 45.1995 157.524 45.4226 157.951 45.8944L158.692 45.2234C158.172 44.6485 157.597 44.2761 157.012 44.155C156.411 44.0305 155.834 44.1815 155.386 44.5868L156.057 45.3283ZM156.351 47.4483C156.062 46.9299 155.867 46.473 155.813 46.0971C155.764 45.7485 155.839 45.5175 156.049 45.3351L155.393 44.58C154.864 45.0395 154.739 45.6447 154.823 46.2373C154.903 46.8026 155.174 47.392 155.478 47.9356L156.351 47.4483ZM156.958 48.5569L156.353 47.4519L155.476 47.932L156.081 49.037L156.958 48.5569ZM156.626 54.8876C157.572 54.0271 157.986 52.9902 157.983 51.8758C157.979 50.7832 157.575 49.6489 156.955 48.551L156.084 49.043C156.659 50.0601 156.98 51.0221 156.983 51.879C156.985 52.7142 156.687 53.4802 155.953 54.148L156.626 54.8876ZM159.365 65.0562L171.061 58.0456L170.547 57.1879L158.851 64.1985L159.365 65.0562ZM157.197 62.4115L158.679 64.8844L159.536 64.3703L158.054 61.8974L157.197 62.4115ZM169.065 54.715L157.368 61.7256L157.882 62.5833L169.579 55.5727L169.065 54.715ZM171.233 57.3597L169.75 54.8868L168.893 55.4009L170.375 57.8738L171.233 57.3597ZM163.853 76.858C164.444 78.5865 165.51 79.919 166.92 80.6559C168.334 81.395 170.04 81.5077 171.851 80.8894L171.528 79.9431C169.942 80.4844 168.524 80.3661 167.383 79.7697C166.238 79.1713 165.322 78.0641 164.8 76.5349L163.853 76.858ZM168.701 67.871C166.565 68.6004 165.007 69.8516 164.157 71.4443C163.305 73.0406 163.194 74.9258 163.853 76.858L164.8 76.5349C164.218 74.8312 164.333 73.2374 165.039 71.9151C165.747 70.5891 167.077 69.4821 169.024 68.8174L168.701 67.871ZM178.038 71.9517C177.416 70.1303 176.199 68.718 174.556 67.9606C172.913 67.2036 170.894 67.1224 168.701 67.871L169.024 68.8174C171.016 68.1375 172.765 68.2364 174.137 68.8688C175.508 69.5009 176.55 70.6873 177.092 72.2748L178.038 71.9517ZM175.327 79.5642C178.018 78.2093 179.101 75.0646 178.038 71.9517L177.092 72.2748C178.021 74.9969 177.049 77.5775 174.877 78.671L175.327 79.5642ZM173.682 76.5066L174.629 79.2792L175.575 78.9561L174.628 76.1835L173.682 76.5066ZM174.694 73.1429C174.905 73.7631 174.913 74.3047 174.773 74.7575C174.633 75.2089 174.335 75.6107 173.87 75.9347L174.441 76.7555C175.067 76.3198 175.515 75.7423 175.728 75.053C175.941 74.3652 175.908 73.6048 175.64 72.8198L174.694 73.1429ZM169.994 71.575C171.262 71.142 172.304 71.1404 173.08 71.4273C173.843 71.7092 174.402 72.2884 174.694 73.1429L175.64 72.8198C175.258 71.702 174.492 70.8832 173.427 70.4893C172.375 70.1004 171.087 70.1452 169.671 70.6287L169.994 71.575ZM167.217 75.7235C166.912 74.8281 167.004 74.0224 167.437 73.3383C167.88 72.6395 168.714 72.0118 169.994 71.575L169.671 70.6287C168.253 71.1127 167.194 71.8526 166.592 72.8033C165.981 73.7686 165.878 74.8941 166.271 76.0466L167.217 75.7235ZM170.214 77.4581C169.517 77.6777 168.913 77.6167 168.425 77.3446C167.932 77.0697 167.498 76.5444 167.217 75.7235L166.271 76.0466C166.61 77.0405 167.179 77.7945 167.938 78.2179C168.702 78.6442 169.597 78.7008 170.514 78.4118L170.214 77.4581ZM168.944 75.3239L169.891 78.0965L170.837 77.7734L169.891 75.0008L168.944 75.3239ZM171.31 73.9879L169.256 74.6892L169.579 75.6356L171.633 74.9342L171.31 73.9879ZM173.788 79.6997L171.945 74.2995L170.998 74.6226L172.842 80.0228L173.788 79.6997ZM171.851 80.8894L173.477 80.3344L173.154 79.388L171.528 79.9431L171.851 80.8894ZM168.478 92.0925L177.047 91.6106L176.991 90.6122L168.422 91.0941L168.478 92.0925ZM167.789 88.7429L167.95 91.6214L168.949 91.5652L168.787 88.6867L167.789 88.7429ZM181.874 87.4499L168.26 88.2156L168.316 89.214L181.931 88.4483L181.874 87.4499ZM182.544 90.4472L182.402 87.921L181.403 87.9771L181.545 90.5033L182.544 90.4472ZM174.118 97.2293L182.35 90.871L181.739 90.0796L173.507 96.4378L174.118 97.2293ZM174.319 96.9252L174.312 96.8055L173.313 96.8616L173.32 96.9812L174.319 96.9252ZM182.354 95.9724L173.791 96.454L173.847 97.4524L182.41 96.9709L182.354 95.9724ZM183.042 99.3088L182.881 96.4436L181.883 96.4997L182.044 99.365L183.042 99.3088ZM168.956 100.602L182.571 99.8361L182.515 98.8377L168.9 99.6034L168.956 100.602ZM168.289 97.6444L168.429 100.131L169.427 100.075L169.288 97.5882L168.289 97.6444ZM176.717 90.8164L168.481 97.2216L169.095 98.011L177.331 91.6058L176.717 90.8164ZM176.519 91.1395L176.525 91.2392L177.524 91.183L177.518 91.0833L176.519 91.1395ZM44.7826 154.692C42.8917 155.968 40.0352 155.939 37.9043 153.499L37.1511 154.157C39.6193 156.983 43.0401 157.075 45.3422 155.52L44.7826 154.692ZM42.7758 153.228L44.6843 155.433L45.4405 154.779L43.532 152.573L42.7758 153.228ZM39.1025 152.514C39.6679 153.162 40.3598 153.596 41.1174 153.75C41.8794 153.905 42.6703 153.766 43.4079 153.331L42.8999 152.47C42.3598 152.789 41.8191 152.872 41.3161 152.77C40.8087 152.667 40.302 152.367 39.8556 151.856L39.1025 152.514ZM40.2186 146.261C39.0646 147.269 38.3741 148.361 38.1859 149.462C37.9951 150.578 38.3333 151.634 39.1025 152.514L39.8556 151.856C39.2626 151.177 39.0368 150.419 39.1716 149.63C39.3091 148.826 39.8339 147.924 40.8764 147.014L40.2186 146.261ZM46.5786 146.011C45.7927 145.111 44.7709 144.646 43.6347 144.693C42.5145 144.739 41.3435 145.278 40.2186 146.261L40.8764 147.014C41.8879 146.13 42.8498 145.726 43.6756 145.692C44.4855 145.659 45.2228 145.979 45.8254 146.669L46.5786 146.011ZM46.6984 150.462C47.2644 149.799 47.5449 149.028 47.5181 148.235C47.4913 147.446 47.1613 146.678 46.5786 146.011L45.8254 146.669C46.2808 147.19 46.5008 147.745 46.5186 148.269C46.5363 148.791 46.356 149.323 45.9382 149.812L46.6984 150.462ZM48.6134 152.004L46.6949 149.808L45.9417 150.466L47.8602 152.662L48.6134 152.004ZM47.7023 144.941C48.678 146.058 49.1918 147.292 49.2326 148.497C49.2731 149.696 48.8467 150.908 47.8652 151.999L48.6084 152.668C49.7492 151.401 50.2819 149.941 50.232 148.463C50.1822 146.991 49.556 145.543 48.4555 144.283L47.7023 144.941ZM38.9536 144.812C40.5552 143.413 42.2049 142.84 43.7014 142.905C45.1969 142.971 46.597 143.675 47.7023 144.941L48.4555 144.283C47.1911 142.836 45.544 141.985 43.7449 141.906C41.9466 141.828 40.054 142.523 38.2957 144.059L38.9536 144.812ZM37.9043 153.499C36.7832 152.215 36.2766 150.732 36.4176 149.246C36.5588 147.758 37.3554 146.208 38.9536 144.812L38.2957 144.059C36.5439 145.589 35.5919 147.361 35.4221 149.151C35.252 150.943 35.8718 152.692 37.1511 154.157L37.9043 153.499ZM59.9284 164.564C58.6843 166.288 57.2031 167.215 55.7252 167.486C54.2478 167.757 52.7176 167.381 51.3493 166.393L50.7639 167.204C52.3271 168.333 54.1298 168.795 55.9054 168.47C57.6805 168.145 59.3722 167.043 60.7392 165.15L59.9284 164.564ZM58.9639 155.845C60.3322 156.833 61.1702 158.168 61.3785 159.655C61.5868 161.143 61.1726 162.841 59.9284 164.564L60.7392 165.15C62.1063 163.256 62.6191 161.304 62.3688 159.516C62.1185 157.729 61.1123 156.163 59.5492 155.035L58.9639 155.845ZM50.3847 157.675C51.6294 155.95 53.107 155.02 54.5823 154.748C56.0569 154.477 57.587 154.852 58.9639 155.845L59.5492 155.035C57.9784 153.901 56.1755 153.438 54.4011 153.765C52.6276 154.092 50.9404 155.196 49.5739 157.089L50.3847 157.675ZM51.3493 166.393C49.9733 165.4 49.1382 164.062 48.9331 162.574C48.7279 161.086 49.1461 159.39 50.3847 157.675L49.5739 157.089C48.213 158.974 47.6961 160.923 47.9425 162.711C48.189 164.499 49.1923 166.07 50.7639 167.204L51.3493 166.393ZM51.9439 158.8C51.0562 160.03 50.6215 161.243 50.6779 162.356C50.7353 163.486 51.2966 164.443 52.2566 165.136L52.8419 164.326C52.1014 163.791 51.717 163.101 51.6766 162.305C51.6354 161.491 51.951 160.499 52.7547 159.385L51.9439 158.8ZM58.0565 157.102C57.0965 156.409 56.0109 156.178 54.92 156.479C53.8461 156.776 52.8316 157.57 51.9439 158.8L52.7547 159.385C53.5584 158.272 54.4009 157.66 55.1863 157.443C55.9547 157.231 56.7307 157.379 57.4712 157.913L58.0565 157.102ZM58.3692 163.439C59.2573 162.209 59.6904 160.994 59.6332 159.882C59.5751 158.751 59.0142 157.794 58.0565 157.102L57.4712 157.913C58.2087 158.446 58.5935 159.136 58.6345 159.933C58.6763 160.747 58.3618 161.74 57.5584 162.853L58.3692 163.439ZM52.2566 165.136C53.2143 165.828 54.2998 166.059 55.3908 165.758C56.4652 165.462 57.4812 164.669 58.3692 163.439L57.5584 162.853C56.755 163.966 55.9114 164.577 55.1251 164.794C54.3555 165.006 53.5795 164.858 52.8419 164.326L52.2566 165.136ZM67.3767 166.642L64.0991 174.926L65.0289 175.294L68.3066 167.01L67.3767 166.642ZM68.1308 166.402L68.0256 166.361L67.6577 167.291L67.7629 167.332L68.1308 166.402ZM68.4752 176.386L68.4469 166.866L67.4469 166.869L67.4752 176.389L68.4752 176.386ZM69.9299 176.623L68.1591 175.923L67.7912 176.853L69.562 177.553L69.9299 176.623ZM75.9051 169.852L69.3828 176.745L70.1091 177.432L76.6314 170.539L75.9051 169.852ZM76.5574 169.772L76.4522 169.73L76.0843 170.66L76.1896 170.702L76.5574 169.772ZM73.573 178.674L76.8384 170.421L75.9086 170.053L72.6432 178.306L73.573 178.674ZM75.8925 179.054L73.2921 178.025L72.9242 178.955L75.5246 179.984L75.8925 179.054ZM80.2604 166.655L75.2436 179.335L76.1734 179.703L81.1903 167.023L80.2604 166.655ZM77.2352 165.996L80.5414 167.304L80.9093 166.374L77.6031 165.066L77.2352 165.996ZM70.9169 173.015L77.7796 165.877L77.0588 165.184L70.1961 172.322L70.9169 173.015ZM70.224 173.075L70.3726 173.134L70.7405 172.204L70.5919 172.145L70.224 173.075ZM69.7867 162.715L69.908 172.616L70.9079 172.604L70.7867 162.703L69.7867 162.715ZM66.7966 161.866L70.1028 163.174L70.4707 162.244L67.1645 160.936L66.7966 161.866ZM62.4286 174.265L67.4454 161.585L66.5156 161.217L61.4987 173.897L62.4286 174.265ZM64.748 174.645L62.1476 173.616L61.7797 174.546L64.3801 175.575L64.748 174.645ZM85.7158 173.248L84.7283 182.102L85.7221 182.213L86.7096 173.359L85.7158 173.248ZM86.3806 172.819L86.2681 172.806L86.1573 173.8L86.2698 173.813L86.3806 172.819ZM89.3344 182.362L86.8073 173.183L85.8431 173.449L88.3702 182.628L89.3344 182.362ZM90.8003 182.209L88.9077 181.998L88.7969 182.992L90.6894 183.203L90.8003 182.209ZM94.7878 174.106L90.3042 182.47L91.1855 182.942L95.6691 174.579L94.7878 174.106ZM95.3964 173.858L95.2839 173.845L95.173 174.839L95.2855 174.852L95.3964 173.858ZM94.8541 183.231L95.8379 174.41L94.844 174.299L93.8602 183.12L94.8541 183.231ZM97.1919 182.989L94.4126 182.679L94.3017 183.673L97.081 183.983L97.1919 182.989ZM98.151 169.878L96.6395 183.43L97.6334 183.541L99.1448 169.989L98.151 169.878ZM95.0588 170.036L98.5925 170.43L98.7033 169.437L95.1697 169.042L95.0588 170.036ZM90.8053 178.468L95.553 169.779L94.6755 169.3L89.9278 177.989L90.8053 178.468ZM90.1523 178.708L90.3111 178.725L90.422 177.732L90.2632 177.714L90.1523 178.708ZM87.0102 168.826L89.7269 178.348L90.6885 178.074L87.9719 168.552L87.0102 168.826ZM83.902 168.792L87.4356 169.186L87.5465 168.192L84.0128 167.798L83.902 168.792ZM82.9428 181.903L84.4543 168.35L83.4605 168.24L81.949 181.792L82.9428 181.903ZM85.2806 181.66L82.5014 181.35L82.3905 182.344L85.1698 182.654L85.2806 181.66ZM114.384 178.035C114.565 179.428 114.175 180.545 113.397 181.367C112.609 182.201 111.381 182.774 109.828 182.975L109.957 183.967C111.672 183.744 113.137 183.099 114.124 182.054C115.122 180.999 115.592 179.576 115.376 177.906L114.384 178.035ZM113.226 169.094L114.384 178.035L115.376 177.906L114.218 168.966L113.226 169.094ZM110.947 169.893L113.786 169.526L113.658 168.534L110.818 168.902L110.947 169.893ZM112.524 178.175L111.379 169.333L110.387 169.462L111.532 178.303L112.524 178.175ZM109.626 181.418C110.512 181.303 111.291 180.955 111.827 180.389C112.373 179.814 112.636 179.045 112.524 178.175L111.532 178.303C111.607 178.88 111.436 179.348 111.102 179.701C110.758 180.064 110.211 180.334 109.498 180.426L109.626 181.418ZM106.018 179.018C106.131 179.887 106.582 180.564 107.252 180.981C107.912 181.392 108.75 181.531 109.626 181.418L109.498 180.426C108.797 180.517 108.204 180.395 107.781 180.132C107.369 179.876 107.085 179.466 107.01 178.889L106.018 179.018ZM104.873 170.176L106.018 179.018L107.01 178.889L105.865 170.047L104.873 170.176ZM102.574 170.978L105.433 170.608L105.305 169.616L102.446 169.986L102.574 170.978ZM104.164 179.359L103.006 170.418L102.014 170.546L103.172 179.487L104.164 179.359ZM109.828 182.975C108.268 183.177 106.935 182.936 105.962 182.331C105.003 181.734 104.344 180.753 104.164 179.359L103.172 179.487C103.388 181.156 104.201 182.412 105.434 183.18C106.654 183.939 108.235 184.19 109.957 183.967L109.828 182.975ZM121.663 172.515L124.614 180.574L125.553 180.23L122.602 172.171L121.663 172.515ZM122.055 171.839L121.961 171.873L122.305 172.812L122.398 172.778L122.055 171.839ZM131.037 177.92L122.515 171.9L121.938 172.717L130.46 178.736L131.037 177.92ZM132.915 177.002L130.576 177.858L130.92 178.798L133.259 177.941L132.915 177.002ZM127.929 164.839L132.617 177.644L133.556 177.3L128.868 164.495L127.929 164.839ZM125.875 166.123L128.57 165.136L128.226 164.197L125.532 165.184L125.875 166.123ZM129.122 173.535L126.173 165.482L125.234 165.825L128.183 173.879L129.122 173.535ZM128.711 174.217L128.824 174.176L128.48 173.237L128.368 173.278L128.711 174.217ZM119.774 168.126L128.25 174.155L128.829 173.34L120.354 167.311L119.774 168.126ZM117.86 169.058L120.236 168.188L119.892 167.249L117.516 168.119L117.86 169.058ZM122.846 181.221L118.157 168.416L117.218 168.76L121.907 181.565L122.846 181.221ZM124.912 179.933L122.204 180.924L122.548 181.863L125.256 180.872L124.912 179.933ZM134.878 161.857L141.68 173.676L142.547 173.177L135.745 161.358L134.878 161.857ZM133.062 163.479L135.561 162.041L135.062 161.174L132.563 162.612L133.062 163.479ZM140.048 174.615L133.246 162.796L132.379 163.295L139.181 175.114L140.048 174.615ZM141.864 172.993L139.365 174.431L139.864 175.298L142.363 173.86L141.864 172.993ZM145.644 157.229L152.765 165.951L153.54 165.318L146.419 156.597L145.644 157.229ZM148.949 153.885L145.715 156.526L146.348 157.3L149.581 154.66L148.949 153.885ZM147.374 152.748L148.878 154.589L149.652 153.956L148.149 152.115L147.374 152.748ZM139.403 159.902L148.078 152.819L147.446 152.044L138.771 159.127L139.403 159.902ZM140.978 161.04L139.474 159.198L138.7 159.831L140.203 161.672L140.978 161.04ZM143.508 158.328L140.274 160.969L140.907 161.743L144.14 159.103L143.508 158.328ZM151.332 167.12L144.211 158.399L143.437 159.032L150.558 167.753L151.332 167.12ZM152.836 165.247L150.629 167.049L151.261 167.824L153.469 166.022L152.836 165.247ZM161.552 150.59L165.318 153.6L165.942 152.819L162.176 149.809L161.552 150.59ZM157.619 140.997L161.4 150.387L162.328 150.013L158.547 140.624L157.619 140.997ZM156.458 143.645L158.474 141.123L157.693 140.498L155.676 143.021L156.458 143.645ZM159.172 149.23L156.526 143.134L155.608 143.532L158.254 149.628L159.172 149.23ZM159.021 149.845L159.104 149.741L158.323 149.117L158.239 149.221L159.021 149.845ZM152.008 148.786L158.537 150.024L158.723 149.041L152.194 147.804L152.008 148.786ZM150.476 151.13L152.492 148.607L151.711 147.983L149.694 150.506L150.476 151.13ZM160.157 151.943L150.165 150.324L150.005 151.311L159.997 152.93L160.157 151.943ZM164.155 155.056L160.389 152.046L159.765 152.827L163.53 155.837L164.155 155.056ZM165.239 152.897L163.452 155.134L164.233 155.758L166.021 153.522L165.239 152.897ZM173.628 126.099C175.63 126.099 177.253 124.476 177.253 122.474H176.253C176.253 123.923 175.078 125.099 173.628 125.099V126.099ZM170.003 122.474C170.003 124.476 171.626 126.099 173.628 126.099V125.099C172.178 125.099 171.003 123.923 171.003 122.474H170.003ZM173.628 118.849C171.626 118.849 170.003 120.472 170.003 122.474H171.003C171.003 121.024 172.178 119.849 173.628 119.849V118.849ZM177.253 122.474C177.253 120.472 175.63 118.849 173.628 118.849V119.849C175.078 119.849 176.253 121.024 176.253 122.474H177.253ZM32.503 122.474C32.503 123.923 31.3278 125.099 29.878 125.099V126.099C31.8801 126.099 33.503 124.476 33.503 122.474H32.503ZM29.878 119.849C31.3278 119.849 32.503 121.024 32.503 122.474H33.503C33.503 120.472 31.8801 118.849 29.878 118.849V119.849ZM27.253 122.474C27.253 121.024 28.4283 119.849 29.878 119.849V118.849C27.876 118.849 26.253 120.472 26.253 122.474H27.253ZM29.878 125.099C28.4283 125.099 27.253 123.923 27.253 122.474H26.253C26.253 124.476 27.876 126.099 29.878 126.099V125.099ZM129.214 93.9542C129.748 89.9871 128.502 86.9369 126.09 84.5511C123.704 82.1904 120.195 80.496 116.215 79.1452L115.893 80.0922C119.828 81.4273 123.164 83.0622 125.387 85.262C127.585 87.4366 128.713 90.1779 128.223 93.8208L129.214 93.9542ZM120.858 103.571C123.02 103.078 124.915 102.122 126.371 100.545C127.828 98.968 128.812 96.8057 129.214 93.9574L128.224 93.8176C127.844 96.5091 126.928 98.4689 125.637 99.8667C124.346 101.265 122.646 102.137 120.636 102.596L120.858 103.571ZM127.163 118.387C128.493 114.42 128.455 111.229 127.289 108.632C126.126 106.042 123.881 104.131 120.976 102.638L120.519 103.528C123.313 104.963 125.342 106.736 126.377 109.042C127.409 111.341 127.492 114.259 126.214 118.07L127.163 118.387ZM104.68 127.45C110.041 128.404 114.813 128.681 118.675 127.441C122.582 126.186 125.498 123.398 127.163 118.386L126.214 118.071C124.638 122.814 121.939 125.342 118.369 126.489C114.752 127.65 110.184 127.414 104.855 126.465L104.68 127.45ZM102.795 137.462L105.254 127.073L104.281 126.843L101.822 137.232L102.795 137.462ZM95.9336 136.322L102.192 137.833L102.426 136.861L96.1683 135.35L95.9336 136.322ZM98.0233 125.498L95.5648 135.719L96.5371 135.953L98.9956 125.732L98.0233 125.498ZM93.3893 124.83C95.1449 125.297 96.8066 125.709 98.3893 126.1L98.6295 125.129C97.046 124.738 95.3925 124.328 93.6467 123.863L93.3893 124.83ZM91.5459 134.759L94.0043 124.463L93.0317 124.23L90.5732 134.526L91.5459 134.759ZM84.6843 133.618L90.9422 135.128L91.1769 134.156L84.919 132.646L84.6843 133.618ZM86.7735 122.627L84.3151 133.016L85.2882 133.247L87.7467 122.857L86.7735 122.627ZM84.48 122.546C85.3904 122.765 86.2736 122.977 87.1209 123.223L87.3993 122.262C86.5259 122.009 85.6197 121.791 84.7136 121.574L84.48 122.546ZM82.7018 122.107C83.2986 122.262 83.8947 122.405 84.48 122.546L84.7136 121.574C84.1268 121.433 83.5396 121.292 82.9531 121.139L82.7018 122.107ZM74.5563 120.208L82.7139 122.11L82.941 121.136L74.7834 119.234L74.5563 120.208ZM77.1686 112.313L74.2072 119.531L75.1324 119.91L78.0937 112.692L77.1686 112.313ZM81.8776 113.975C81.8599 113.957 81.7356 113.836 81.7324 113.631C81.728 113.354 81.9286 113.216 82.0091 113.176C82.0865 113.138 82.1542 113.13 82.1716 113.128C82.1987 113.125 82.22 113.125 82.2301 113.125C82.2626 113.125 82.2828 113.129 82.2682 113.127C82.2527 113.125 82.2177 113.118 82.1585 113.106C82.0442 113.081 81.8726 113.042 81.6594 112.992C81.2346 112.891 80.6595 112.749 80.0802 112.605C79.5014 112.46 78.92 112.314 78.4832 112.203C78.2649 112.148 78.0827 112.101 77.9552 112.069C77.8914 112.053 77.8413 112.04 77.8072 112.031C77.7901 112.027 77.777 112.024 77.7682 112.021C77.7638 112.02 77.7604 112.019 77.7582 112.019C77.7571 112.018 77.7562 112.018 77.7557 112.018C77.7554 112.018 77.7552 112.018 77.7551 112.018C77.755 112.018 77.7549 112.018 77.7549 112.018C77.7549 112.018 77.7549 112.018 77.6311 112.502C77.5074 112.987 77.5075 112.987 77.5075 112.987C77.5075 112.987 77.5076 112.987 77.5077 112.987C77.5078 112.987 77.508 112.987 77.5083 112.987C77.5089 112.987 77.5097 112.987 77.5109 112.988C77.5131 112.988 77.5165 112.989 77.5209 112.99C77.5298 112.992 77.543 112.996 77.5601 113C77.5944 113.009 77.6446 113.022 77.7086 113.038C77.8364 113.071 78.0189 113.117 78.2376 113.172C78.6751 113.283 79.2577 113.43 79.8383 113.575C80.4183 113.72 80.998 113.862 81.4287 113.965C81.6433 114.015 81.8248 114.057 81.9518 114.084C82.0133 114.097 82.0712 114.108 82.1159 114.115C82.1315 114.118 82.1737 114.124 82.2195 114.125C82.233 114.125 82.257 114.125 82.2863 114.121C82.306 114.119 82.3754 114.111 82.4539 114.072C82.5355 114.031 82.7367 113.893 82.7323 113.615C82.729 113.409 82.6042 113.287 82.5853 113.268L81.8776 113.975ZM84.6175 111.923C84.4794 112.265 84.2473 112.647 83.8948 112.901C83.5614 113.141 83.0763 113.3 82.3417 113.134L82.1212 114.109C83.1187 114.335 83.9001 114.13 84.4793 113.712C85.0394 113.309 85.3661 112.74 85.5446 112.298L84.6175 111.923ZM88.3933 95.584L84.5939 111.998L85.5681 112.223L89.3676 95.8095L88.3933 95.584ZM89.2908 95.2803C89.1935 95.2617 89.1198 95.2473 89.0277 95.219L88.7332 96.1746C88.8832 96.2208 89.0051 96.2438 89.1034 96.2625L89.2908 95.2803ZM89.6609 95.3682C89.5109 95.3219 89.389 95.299 89.2908 95.2803L89.1034 96.2625C89.2007 96.2811 89.2744 96.2955 89.3665 96.3238L89.6609 95.3682ZM88.9525 96.1495C89.0821 96.1829 89.1525 96.204 89.2288 96.2569L89.7986 95.4351C89.5616 95.2708 89.3344 95.2152 89.202 95.1811L88.9525 96.1495ZM88.6771 96.0603C88.7816 96.1068 88.8903 96.1335 88.9526 96.1495L89.202 95.1811C89.1213 95.1603 89.0977 95.1529 89.0838 95.1467L88.6771 96.0603ZM91.169 83.7563L88.3939 95.4884L89.367 95.7186L92.1421 83.9864L91.169 83.7563ZM88.61 80.7938C89.7794 81.0866 90.4153 81.5981 90.7596 82.1255C91.1091 82.6611 91.198 83.275 91.1569 83.8347L92.1542 83.908C92.2062 83.1993 92.0995 82.349 91.597 81.579C91.0891 80.8008 90.2165 80.1652 88.8529 79.8238L88.61 80.7938ZM84.2243 79.1897C84.1171 79.678 84.1171 79.678 84.1172 79.6781C84.1172 79.6781 84.1172 79.6781 84.1173 79.6781C84.1174 79.6781 84.1176 79.6782 84.1179 79.6782C84.1185 79.6783 84.1193 79.6785 84.1204 79.6788C84.1226 79.6793 84.1259 79.68 84.1303 79.6809C84.1391 79.6829 84.1521 79.6857 84.1691 79.6895C84.2032 79.697 84.2532 79.708 84.3167 79.7221C84.4439 79.7503 84.6254 79.7906 84.8428 79.8393C85.2776 79.9368 85.8551 80.0676 86.427 80.2011C87 80.335 87.563 80.4707 87.9705 80.5781C88.1764 80.6323 88.3327 80.6768 88.4289 80.7086C88.4829 80.7265 88.4939 80.7326 88.4831 80.7272C88.4785 80.7249 88.4651 80.718 88.4474 80.7062C88.4342 80.6974 88.3927 80.6692 88.3505 80.619C88.3152 80.5771 88.2098 80.4359 88.2415 80.2283C88.2748 80.0101 88.4292 79.9048 88.4884 79.8719L88.9745 80.7457C89.039 80.7099 89.1962 80.6012 89.2301 80.3792C89.2624 80.1678 89.1553 80.0224 89.1161 79.9757C89.0396 79.8847 88.9459 79.8406 88.9338 79.8345C88.873 79.8038 88.8007 79.7783 88.7429 79.7592C88.6156 79.7171 88.4342 79.6661 88.2254 79.6111C87.8035 79.4999 87.2292 79.3616 86.6545 79.2274C86.0786 79.0928 85.4979 78.9613 85.0614 78.8635C84.8432 78.8146 84.6608 78.7741 84.5329 78.7458C84.469 78.7316 84.4187 78.7205 84.3844 78.7129C84.3672 78.7091 84.354 78.7062 84.3451 78.7043C84.3406 78.7033 84.3372 78.7026 84.335 78.7021C84.3338 78.7018 84.3329 78.7016 84.3324 78.7015C84.3321 78.7014 84.3319 78.7014 84.3317 78.7013C84.3316 78.7013 84.3316 78.7013 84.3315 78.7013C84.3315 78.7013 84.3315 78.7013 84.2243 79.1897ZM85.3209 72.4152L83.7378 79.074L84.7107 79.3053L86.2938 72.6465L85.3209 72.4152ZM94.5473 74.1151L85.9241 72.0447L85.6907 73.017L94.3139 75.0874L94.5473 74.1151ZM96.5528 74.55C95.8766 74.4099 95.2082 74.2713 94.5457 74.1147L94.3156 75.0878C94.994 75.2482 95.6759 75.3895 96.35 75.5292L96.5528 74.55ZM98.5872 74.9913C97.9088 74.8309 97.2268 74.6896 96.5528 74.55L96.35 75.5292C97.0262 75.6693 97.6945 75.8078 98.3571 75.9645L98.5872 74.9913ZM100.444 65.0658L97.9858 75.3618L98.9585 75.594L101.417 65.2981L100.444 65.0658ZM107.379 66.2064L101.047 64.6956L100.815 65.6683L107.147 67.1791L107.379 66.2064ZM105.366 76.8801L107.75 66.8079L106.776 66.5776L104.393 76.6497L105.366 76.8801ZM109.985 77.3974C108.328 77.0058 106.645 76.6124 104.978 76.2748L104.78 77.2549C106.429 77.5889 108.098 77.9789 109.755 78.3706L109.985 77.3974ZM111.768 67.6967L109.384 77.7689L110.357 77.9992L112.741 67.927L111.768 67.6967ZM118.63 68.8367L112.372 67.3258L112.137 68.2979L118.395 69.8087L118.63 68.8367ZM116.54 79.7348L118.999 69.4388L118.026 69.2066L115.568 79.5025L116.54 79.7348ZM114.152 113.974C113.765 115.621 112.838 116.671 111.581 117.325C110.302 117.99 108.659 118.256 106.859 118.26C103.257 118.268 99.2244 117.235 96.6978 116.586L96.449 117.555C98.9539 118.198 103.11 119.269 106.861 119.26C108.738 119.255 110.562 118.982 112.042 118.212C113.544 117.431 114.668 116.149 115.125 114.202L114.152 113.974ZM100.257 103.847C102.939 104.425 106.863 105.275 109.907 106.866C111.426 107.66 112.682 108.617 113.459 109.778C114.224 110.92 114.545 112.287 114.151 113.974L115.125 114.201C115.581 112.245 115.209 110.594 114.29 109.221C113.383 107.867 111.965 106.813 110.37 105.979C107.186 104.315 103.123 103.442 100.468 102.869L100.257 103.847ZM98.5958 103.476C99.0587 103.588 99.6253 103.711 100.257 103.847L100.468 102.869C99.8316 102.732 99.2797 102.613 98.8327 102.504L98.5958 103.476ZM95.9604 116.907L99.2011 103.104L98.2275 102.875L94.9868 116.678L95.9604 116.907ZM96.6978 116.586C96.2869 116.481 95.9141 116.385 95.592 116.307L95.3552 117.278C95.67 117.355 96.0363 117.449 96.449 117.555L96.6978 116.586ZM115.884 93.7731C115.53 95.2757 114.731 96.2345 113.674 96.8389C112.597 97.4542 111.221 97.7187 109.711 97.7508C106.686 97.8151 103.315 96.9468 101.206 96.4013L100.955 97.3695C103.042 97.9091 106.546 98.8183 109.732 98.7506C111.328 98.7167 112.891 98.4378 114.17 97.7072C115.467 96.9656 116.44 95.7758 116.857 94.002L115.884 93.7731ZM104.504 84.9453C106.723 85.4205 109.979 86.1219 112.489 87.4982C113.739 88.184 114.763 89.0164 115.386 90.0332C115.998 91.0339 116.246 92.2501 115.884 93.7719L116.857 94.0031C117.277 92.2365 116.996 90.7477 116.239 89.511C115.491 88.2905 114.304 87.3532 112.97 86.6214C110.31 85.1625 106.904 84.4367 104.714 83.9675L104.504 84.9453ZM103.12 84.6366C103.503 84.7309 103.977 84.8323 104.504 84.9453L104.714 83.9675C104.181 83.8533 103.724 83.7555 103.36 83.6656L103.12 84.6366ZM100.709 96.7839L103.726 84.2683L102.754 84.0339L99.7368 96.5495L100.709 96.7839ZM101.206 96.4013C100.888 96.3191 100.597 96.2439 100.343 96.1812L100.103 97.1522C100.351 97.2132 100.636 97.2869 100.955 97.3695L101.206 96.4013Z" fill="defaultColor" data-v-ec52590a></path></svg></div><div class="copy" data-v-ec52590a><h2 data-v-ec52590a>Created by the<br data-v-ec52590a><b data-v-ec52590a>Bitcoin Design Community</b></h2><a class="button" href="https://bitcoin.design" target="_blank" rel="noreferrer noopener" data-v-ec52590a> Check it out <img${serverRenderer.exports.ssrRenderAttr("src", _imports_0$1)} width="24" height="24" alt="Arrow right" data-v-ec52590a></a></div></div>`);
}
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/site/Footer.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["ssrRender", _sfc_ssrRender$n], ["__scopeId", "data-v-ec52590a"]]);
const Footer = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_2
});
const _sfc_main$m = {
  name: "App",
  data() {
    return {
      screenSize: this.getScreenSize()
    };
  },
  beforeMount() {
    if (process.browser)
      ;
  },
  methods: {
    resize() {
      if (process.browser) {
        this.screenSize = this.getScreenSize();
      }
    },
    getScreenSize() {
      let screenSize = "large";
      return screenSize;
    }
  }
};
function _sfc_ssrRender$m(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_SiteNav = __nuxt_component_0$4;
  const _component_PageTitle = __nuxt_component_1$2;
  const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
  const _component_SiteFooter = __nuxt_component_2;
  _push(`<!--[-->`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_SiteNav, null, null, _parent));
  _push(serverRenderer.exports.ssrRenderComponent(_component_PageTitle, null, null, _parent));
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, { screenSize: $data.screenSize }, null, _parent));
  _push(serverRenderer.exports.ssrRenderComponent(_component_SiteFooter, null, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("app.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender$m]]);
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext = {}) {
    const app = vue_cjs_prod.createApp(RootComponent);
    app.component("App", AppComponent);
    const nuxt = createNuxtApp({ app, ssrContext });
    await applyPlugins(nuxt, plugins);
    await nuxt.hooks.callHook("app:created", app);
    return app;
  };
}
const entry$1 = (ctx) => entry(ctx);
const _sfc_main$l = {
  name: "Tabs",
  props: [
    "items",
    "activeId"
  ],
  methods: {
    click(itemId) {
      this.$emit("select", itemId);
    }
  }
};
function _sfc_ssrRender$l(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "tabs" }, _attrs))} data-v-4175de2a><!--[-->`);
  serverRenderer.exports.ssrRenderList($props.items, (item, id) => {
    _push(`<!--[-->`);
    if (item.to) {
      _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, {
        class: id == $props.activeId ? "-active" : null,
        to: item.to
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(item.label)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.label), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
    } else {
      _push(`<!---->`);
    }
    if (item.href) {
      _push(`<a class="${serverRenderer.exports.ssrRenderClass(id == $props.activeId ? "-active" : null)}"${serverRenderer.exports.ssrRenderAttr("href", item.href)} data-v-4175de2a>${serverRenderer.exports.ssrInterpolate(item.label)}</a>`);
    } else {
      _push(`<!---->`);
    }
    if (!item.to && !item.href) {
      _push(`<button class="${serverRenderer.exports.ssrRenderClass(id == $props.activeId ? "-active" : null)}" data-v-4175de2a>${serverRenderer.exports.ssrInterpolate(item.label)}</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<!--]-->`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/Tabs.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __nuxt_component_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["ssrRender", _sfc_ssrRender$l], ["__scopeId", "data-v-4175de2a"]]);
const Tabs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_0$3
});
const _sfc_main$k = {
  name: "Swatch",
  props: [
    "swatchData",
    "screenSize",
    "index"
  ],
  computed: {
    styleObject() {
      let order = null;
      let basis = null;
      if (this.screenSize == "large") {
        order = this.index % 5 + this.index % 5 * 3;
      } else if (this.screenSize == "small") {
        if (this.index < 5) {
          order += this.index * 2 + 1;
        } else {
          order = (this.index - 5) * 2;
          if (this.index > 10) {
            basis = "100%";
          }
        }
      }
      return {
        order,
        flexBasis: basis
      };
    },
    colorStyle() {
      return {
        backgroundColor: this.swatchData.hex
      };
    }
  }
};
function _sfc_ssrRender$k(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
    class: "swatch",
    style: $options.styleObject
  }, _attrs))} data-v-6f6779ac><div class="color" style="${serverRenderer.exports.ssrRenderStyle($options.colorStyle)}" data-v-6f6779ac></div><div class="copy" data-v-6f6779ac><h4 data-v-6f6779ac>${serverRenderer.exports.ssrInterpolate($props.swatchData.label)}</h4><p data-v-6f6779ac>${serverRenderer.exports.ssrInterpolate($props.swatchData.hex)}</p></div></div>`);
}
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/foundation/Swatch.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const Swatch = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["ssrRender", _sfc_ssrRender$k], ["__scopeId", "data-v-6f6779ac"]]);
const Swatch$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Swatch
});
const _sfc_main$j = {
  name: "Swatches",
  components: {
    Swatch
  },
  props: [
    "swatchesData",
    "screenSize"
  ],
  computed: {
    className() {
      const c = ["swatches"];
      c.push("-" + this.screenSize);
      return c.join(" ");
    }
  }
};
function _sfc_ssrRender$j(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Swatch = vue_cjs_prod.resolveComponent("Swatch");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: $options.className }, _attrs))} data-v-5f55f4da><!--[-->`);
  serverRenderer.exports.ssrRenderList($props.swatchesData, (item, index2) => {
    _push(serverRenderer.exports.ssrRenderComponent(_component_Swatch, {
      key: "item_" + item.hex,
      swatchData: item,
      index: index2,
      screenSize: $props.screenSize
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/foundation/Swatches.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const Swatches = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$j], ["__scopeId", "data-v-5f55f4da"]]);
const Swatches$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Swatches
});
const _sfc_main$i = {
  name: "TypeItem",
  props: [
    "typeData"
  ],
  computed: {
    styleObject() {
      const result = {
        fontSize: this.typeData.size + "px",
        fontWeight: this.typeData.weight,
        lineHeight: this.typeData.lineHeight + "%"
      };
      if (this.typeData.max) {
        result.maxWidth = this.typeData.max + "px";
      }
      return result;
    },
    details() {
      return "Inter " + (this.typeData.weight == 400 ? "Regular" : "Semi-Bold") + " " + this.typeData.size + "/" + this.typeData.lineHeight + "%";
    }
  }
};
function _sfc_ssrRender$i(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "type-item" }, _attrs))} data-v-b198b036><div class="info" data-v-b198b036><h4 data-v-b198b036>${serverRenderer.exports.ssrInterpolate($props.typeData.label)}</h4><p data-v-b198b036>${serverRenderer.exports.ssrInterpolate($options.details)}</p></div>`);
  serverRenderer.exports.ssrRenderVNode(_push, vue_cjs_prod.createVNode(vue_cjs_prod.resolveDynamicComponent($props.typeData.tag), { style: $options.styleObject }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${serverRenderer.exports.ssrInterpolate($props.typeData.copy)}`);
      } else {
        return [
          vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString($props.typeData.copy), 1)
        ];
      }
    }),
    _: 1
  }), _parent);
  _push(`</div>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/foundation/TypeItem.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const TypeItem = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$i], ["__scopeId", "data-v-b198b036"]]);
const TypeItem$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": TypeItem
});
const _sfc_main$h = {
  name: "TypeList",
  components: {
    TypeItem
  },
  props: [
    "typeData"
  ]
};
function _sfc_ssrRender$h(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TypeItem = vue_cjs_prod.resolveComponent("TypeItem");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "type-list" }, _attrs))} data-v-426fda8c><!--[-->`);
  serverRenderer.exports.ssrRenderList($props.typeData, (item, index2) => {
    _push(serverRenderer.exports.ssrRenderComponent(_component_TypeItem, {
      key: index2,
      typeData: item
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/foundation/TypeList.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const TypeList = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$h], ["__scopeId", "data-v-426fda8c"]]);
const TypeList$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": TypeList
});
const _sfc_main$g = {
  name: "FoundationsPage",
  components: {
    Tabs: __nuxt_component_0$3,
    Swatches,
    TypeList
  },
  props: [
    "screenSize"
  ],
  beforeMount() {
    document.title = "Foundation | Bitcoin UI Kit";
  },
  data() {
    const swatchesLight = Content.swatches.light;
    const swatchesDark = Content.swatches.dark;
    const titleCopy = Content.swatches.header;
    const bodyCopy = Content.swatches.body;
    const typeData = [
      {
        label: "Header 1",
        tag: "h1",
        size: 36,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: "Header 2",
        tag: "h1",
        size: 28,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: "Header 3",
        tag: "h1",
        size: 24,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: "Header 4",
        tag: "h1",
        size: 21,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: "Header 5",
        tag: "h1",
        size: 18,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: "Body 1",
        tag: "p",
        size: 24,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 900
      },
      {
        label: "Body 2",
        tag: "p",
        size: 21,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 800
      },
      {
        label: "Body 3",
        tag: "p",
        size: 18,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 700
      },
      {
        label: "Body 4",
        tag: "p",
        size: 15,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 600
      },
      {
        label: "Body 5",
        tag: "p",
        size: 13,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 500
      }
    ];
    const themeOptions = {
      light: {
        label: "Light"
      },
      dark: {
        label: "Dark"
      }
    };
    return {
      swatchesLight,
      swatchesDark,
      typeData,
      themeOptions,
      activeThemeId: "light"
    };
  },
  mounted() {
    document.body.classList.add("-darker");
  },
  beforeUnmount() {
    document.body.classList.remove("-darker");
    document.body.classList.remove("--theme-dark");
  },
  computed: {
    swatchesData() {
      let result = this.swatchesLight;
      if (this.activeThemeId == "dark") {
        result = this.swatchesDark;
      }
      return result;
    }
  },
  methods: {
    setActiveThemeId(value) {
      this.activeThemeId = value;
      if (value == "dark") {
        document.body.classList.add("--theme-dark");
      } else {
        document.body.classList.remove("--theme-dark");
      }
    }
  }
};
function _sfc_ssrRender$g(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Tabs = __nuxt_component_0$3;
  const _component_Swatches = vue_cjs_prod.resolveComponent("Swatches");
  const _component_TypeList = vue_cjs_prod.resolveComponent("TypeList");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "foundations-page" }, _attrs))} data-v-bbbb169c><div class="tab-bar" data-v-bbbb169c>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_Tabs, {
    items: $data.themeOptions,
    activeId: $data.activeThemeId
  }, null, _parent));
  _push(`</div>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_Swatches, {
    swatchesData: $options.swatchesData,
    screenSize: $props.screenSize
  }, null, _parent));
  _push(serverRenderer.exports.ssrRenderComponent(_component_TypeList, { typeData: $data.typeData }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/foundation.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const foundation = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$g], ["__scopeId", "data-v-bbbb169c"]]);
const foundation$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": foundation
});
const _sfc_main$f = {
  name: "HelperScreenItem",
  props: [
    "screenData"
  ],
  computed: {
    imageFile() {
      return "/assets/screens/" + this.screenData.id + "-preview.png";
    },
    imageSourceSet() {
      return "/assets/screens/" + this.screenData.id + "-preview.png 1x, /assets/screens/" + this.screenData.id + "-preview@2x.png 2x";
    },
    flowText() {
      let result = null;
      if (this.screenData.flow) {
        result = this.screenData.page + "/" + this.screenData.pagemax;
      }
      return result;
    }
  },
  methods: {
    select() {
      this.$emit("select", this.screenData.id);
    },
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, "");
      str = str.toLowerCase();
      var from = "\xE0\xE1\xE4\xE2\xE8\xE9\xEB\xEA\xEC\xED\xEF\xEE\xF2\xF3\xF6\xF4\xF9\xFA\xFC\xFB\xF1\xE7\xB7/_,:;";
      var to = "aaaaeeeeiiiioooouuuunc------";
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }
      str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      return str;
    },
    remove() {
      this.$emit("remove", this.screenData.id);
    }
  }
};
function _sfc_ssrRender$f(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "helper-screen-item" }, _attrs))} data-v-7a2f5899><img${serverRenderer.exports.ssrRenderAttr("src", $options.imageFile)}${serverRenderer.exports.ssrRenderAttr("srcset", $options.imageSourceSet)}${serverRenderer.exports.ssrRenderAttr("width", $props.screenData.width)}${serverRenderer.exports.ssrRenderAttr("height", $props.screenData.height)}${serverRenderer.exports.ssrRenderAttr("alt", $props.screenData.title)} data-v-7a2f5899><div class="copy" data-v-7a2f5899><h3 data-v-7a2f5899>${serverRenderer.exports.ssrInterpolate($props.screenData.title)}</h3>`);
  if ($options.flowText) {
    _push(`<p class="-flow" data-v-7a2f5899>${serverRenderer.exports.ssrInterpolate($props.screenData.flow)} ${serverRenderer.exports.ssrInterpolate($options.flowText)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<button data-v-7a2f5899>Remove</button></div></div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/helper/ScreenItem.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const ScreenItem$2 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$f], ["__scopeId", "data-v-7a2f5899"]]);
const ScreenItem$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ScreenItem$2
});
const _sfc_main$e = {
  name: "HelperScreenList",
  components: {
    ScreenItem: ScreenItem$2
  },
  props: [
    "screenData"
  ],
  methods: {
    remove(value) {
      this.$emit("remove", value);
    }
  }
};
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ScreenItem = vue_cjs_prod.resolveComponent("ScreenItem");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "helper-screen-list" }, _attrs))} data-v-5f8e7fc1><!--[-->`);
  serverRenderer.exports.ssrRenderList($props.screenData, (item, index2) => {
    _push(serverRenderer.exports.ssrRenderComponent(_component_ScreenItem, {
      key: index2,
      screenData: item
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/helper/ScreenList.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const ScreenList$2 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$e], ["__scopeId", "data-v-5f8e7fc1"]]);
const ScreenList$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ScreenList$2
});
const ScreenData = [
  {
    id: "cover-new-user",
    title: "New user",
    links: [
      {
        title: "Creating a new wallet",
        url: "https://bitcoin.design/guide/onboarding/creating-a-new-wallet/"
      }
    ],
    flow: "Cover",
    description: "Default landing screen when a new user launches the app.",
    page: "1",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Bitcoin wallet",
      "A simple bitcoin wallet for your enjoyment.",
      "Create a new wallet",
      "Restore existing wallet",
      "Your wallet, your coins\n100% open-source & open-design"
    ]
  },
  {
    id: "onboarding-product-benefits",
    title: "Product benefits",
    links: [
      {
        title: "Creating a new wallet",
        url: "https://bitcoin.design/guide/onboarding/creating-a-new-wallet/"
      }
    ],
    flow: "Onboarding",
    description: "Explain the main purpose of the application.",
    page: "0",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Skip",
      "Manage your Bitcoin",
      "Take full control with this completely self-custodied wallet.\n\nYour keys, your coins."
    ]
  },
  {
    id: "onboarding-unique-features",
    title: "Unique features",
    links: [
      {
        title: "Creating a new wallet",
        url: "https://bitcoin.design/guide/onboarding/creating-a-new-wallet/"
      }
    ],
    flow: "Onboarding",
    description: "Highlight unique features that users should know about.",
    page: "2",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Skip",
      "Convenient backups with cloud storage",
      "Your recovery phrase will be encrypted and backed up to your cloud provider, only you will be able to access it."
    ]
  },
  {
    id: "onboarding-user-actions",
    title: "User actions",
    links: [
      {
        title: "Creating a new wallet",
        url: "https://bitcoin.design/guide/onboarding/creating-a-new-wallet/"
      }
    ],
    flow: "Onboarding",
    description: "Let users know what they should do next in order to get the most our of the application.",
    page: "3",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Skip",
      "Keep your wallet and bitcoin secure",
      "Enable face detection or set a \npin for extra security."
    ]
  },
  {
    id: "cover-existing-user-pin-entry",
    title: "Existing user, PIN entry",
    flow: "Cover",
    description: "If the app is protected by a PIN, it can also navigate there directly for existing users.",
    page: "3",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Enter your PIN to log in",
      "Log in",
      "Forgot PIN?",
      "PQRS",
      "WXYZ"
    ]
  },
  {
    id: "cover-existing-user",
    title: "Existing user",
    flow: "Cover",
    description: "The user already has an account and has the option to log in or reset the wallet.",
    page: "2",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Bitcoin wallet",
      "Welcome back.",
      "Log in",
      "Reset wallet",
      "Your wallet, your coins\n100% open-source & open-design"
    ]
  },
  {
    id: "cloud-backup-confirmation",
    title: "Confirmation",
    links: [
      {
        title: "Automatic cloud backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/automatic-cloud-backup/"
      }
    ],
    flow: "Cloud backup",
    description: "Final confirmation that the backup was successful.",
    page: "5",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Your wallet is backed up",
      "If you lose this device, you can recover your encrypted wallet backup from iCloud.",
      "Continue"
    ]
  },
  {
    id: "cloud-backup-cloud-service-provider-login",
    title: "Cloud service provider login",
    links: [
      {
        title: "Automatic cloud backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/automatic-cloud-backup/"
      }
    ],
    flow: "Cloud backup",
    description: "Cloud storage often have custom login and permission flows to allow the app to read and store data.",
    page: "4",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Cloud provider UI for accepting required permissions."
    ]
  },
  {
    id: "cloud-backup-service",
    title: "Service",
    links: [
      {
        title: "Automatic cloud backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/automatic-cloud-backup/"
      }
    ],
    flow: "Cloud backup",
    description: "Platform-specific options for cloud storage.",
    page: "3",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Which service do you want to use for a cloud backup?",
      "This will back up your seed phrase with your preferred cloud storage provider.",
      "Apple iCloud",
      "Google Drive",
      "Learn more"
    ]
  },
  {
    id: "cloud-backup-information",
    title: "Information",
    links: [
      {
        title: "Automatic cloud backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/automatic-cloud-backup/"
      }
    ],
    flow: "Cloud backup",
    description: "Provide users with background information on how their data is stored.",
    page: "4",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Done",
      "Automatic Cloud Backup",
      "This security model is great for storing small amounts for daily spending. It provides a high level of convenience with appropriate security.",
      "How it works",
      "The keys to your wallet are encrypted and store with your cloud storage provider (Apple iCloud or Google Drive).",
      "Encryption prevents your storage provider from accessing your keys.",
      "Encryption requires you to create a 6-digit PIN. You have to remember this in order to access your keys.",
      "This security model is appropriate for amounts similar to what you are comfortable carrying with you in cash."
    ]
  },
  {
    id: "cloud-backup-pin-entry",
    title: "PIN entry",
    links: [
      {
        title: "Automatic cloud backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/automatic-cloud-backup/"
      }
    ],
    flow: "Cloud backup",
    description: "A PIN is required for encrypting the stored data to prevent third-party access.",
    page: "2",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Choose a 4-digit PIN",
      "Use a PIN you will remember.\nIt cannot be recovered.",
      "Enter password",
      "Confirm password",
      "Continue",
      "This is used to encrypt your wallet, which prevents your cloud service provider from accessing it.",
      "PQRS",
      "WXYZ"
    ]
  },
  {
    id: "cloud-backup-intro",
    title: "Intro",
    links: [
      {
        title: "Automatic cloud backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/automatic-cloud-backup/"
      }
    ],
    flow: "Cloud backup",
    description: "Explains the purpose and benefit of cloud backups.",
    page: "1",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Back up your wallet to iCloud or Google Drive",
      "Don\u2019t lose your wallet. Save an encrypted copy to your cloud service.",
      "Continue"
    ]
  },
  {
    id: "recovery-phrase-backup-intro",
    title: "Intro",
    links: [
      {
        title: "Manual backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/manual-backup/"
      }
    ],
    flow: "Recovery phrase backup",
    description: "Explains the purpose and benefit of cloud backups.",
    page: "1",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "First, let's create your \nrecovery phrase",
      "A recovery phrase is a series of 12 words in a specific order. This word combination is unique to your wallet. Make sure to have pen and paper ready so you can write it down.",
      "Continue"
    ]
  },
  {
    id: "recovery-phrase-backup-copy",
    title: "Copy",
    links: [
      {
        title: "Manual backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/manual-backup/"
      }
    ],
    flow: "Recovery phrase backup",
    description: "The user is asked to write down the backup phrase.",
    page: "2",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "This is your recovery phrase",
      "Make sure to write it down as shown here. You have to verify this later.",
      "gloom",
      "month",
      "viable",
      "hospital",
      "alcohol",
      "ocean",
      "police",
      "stamp",
      "claim",
      "heart",
      "ghost",
      "Backup to iCloud",
      "Download as PDF",
      "Print template",
      "Download",
      "Print",
      "Verify"
    ]
  },
  {
    id: "recovery-phrase-backup-validation-intro",
    title: "Validation intro",
    links: [
      {
        title: "Manual backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/manual-backup/"
      }
    ],
    flow: "Recovery phrase backup",
    description: "Introduces the verification process.",
    page: "3",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Let's double-check",
      "Well done. Now let\u2019s verify that you've written down your recovery phrase correctly. Yes, it\u2019s that important.",
      "Continue"
    ]
  },
  {
    id: "recovery-phrase-backup-validation-start",
    title: "Validation, start",
    links: [
      {
        title: "Manual backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/manual-backup/"
      }
    ],
    flow: "Recovery phrase backup",
    description: "The words are shown in scrambled order and the user is asked to tap them in the correct one.",
    page: "4",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Tap the words in the \ncorrect order.",
      "viable",
      "alcohol",
      "ocean",
      "hospital",
      "police",
      "stamp",
      "claim",
      "gloom",
      "heart",
      "ghost",
      "Continue"
    ]
  },
  {
    id: "recovery-phrase-backup-validation-progress",
    title: "Validation, progress",
    links: [
      {
        title: "Manual backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/manual-backup/"
      }
    ],
    flow: "Recovery phrase backup",
    description: "Direct feedback is provided when tapping the words.",
    page: "5",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Sorry, that\u2019s not the correct third word. Give it another try.",
      "viable",
      "alcohol",
      "ocean",
      "hospital",
      "police",
      "stamp",
      "claim",
      "gloom",
      "heart",
      "ghost",
      "Continue"
    ]
  },
  {
    id: "recovery-phrase-backup-validation-complete",
    title: "Validation, complete",
    links: [
      {
        title: "Manual backup",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/manual-backup/"
      }
    ],
    flow: "Recovery phrase backup",
    description: "The user has tapped the words in the correct order and may continue.",
    page: "6",
    pagemax: "6",
    width: 375,
    height: 812,
    text: [
      "Perfect. Make sure to securely store your recovery phrase.",
      "viable",
      "alcohol",
      "ocean",
      "hospital",
      "police",
      "stamp",
      "claim",
      "gloom",
      "heart",
      "ghost",
      "month",
      "Continue"
    ]
  },
  {
    id: "sending-send",
    title: "Send",
    links: [
      {
        title: "Sending bitcoin",
        url: "https://bitcoin.design/guide/payments/send/"
      }
    ],
    flow: "Sending",
    description: "The default send form is empty. The user has the option to share a zero amount invoice.",
    page: "1",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Send bitcoin",
      "Recipient",
      "Enter address...",
      "Amount",
      "Enter amount...",
      "Description",
      "What is this transaction for...",
      "Label",
      "Share invoice"
    ]
  },
  {
    id: "errors-routing-error",
    title: "Routing error",
    flow: "Errors",
    description: "To prevent user concerns, error messages should clearly state the problem, provide assurance, and suggest solutions.",
    page: "1",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Skip",
      "The transaction could \nnot be completed.",
      "A connection to the receiver could \nnot be made. The funds remain in \nyour wallet.\n\nThis can be addressed by opening a direct payment channel, which incurs a minimum fee of 2 000 sats. ",
      "View error details",
      "Cancel transaction",
      "Retry",
      "Open channel & retry"
    ]
  },
  {
    id: "errors-general-error",
    title: "General error",
    flow: "Errors",
    description: "When no solutions can be identified, error messages should provide alternative means for users to get help.",
    page: "2",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Skip",
      "The transaction could \nnot be completed.",
      "Sorry, the problem could not be identified. Your funds remain \nsecurely in your wallet.\n\nA few things to try",
      "Wait 5 minutes and try again",
      "Ensure your Internet connection is stable",
      "Ask for support in our Telegram channel",
      "If this problem persists, opening additional payment channels may help. Learn more",
      "View error details"
    ]
  },
  {
    id: "errors-technical-details",
    title: "Technical details",
    flow: "Errors",
    description: "Error codes and other output should be easily shareable to faciliate finding solutions.",
    page: "3",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Done",
      "Error details",
      "If you are stuck with this error, the information below is safe to share \nin our Telegram channel.",
      "Error code",
      "ErrNoRouteFound",
      '{ "code" : 205, "message" : "Could not find a route", "data" : {"getroute_tries": 1, "sendpay_tries": 0, "failures": []} }',
      "Download",
      "Copy",
      "Share"
    ]
  },
  {
    id: "sending-send-node",
    title: "Send, node",
    links: [
      {
        title: "Sending bitcoin",
        url: "https://bitcoin.design/guide/payments/send/"
      }
    ],
    flow: "Sending",
    description: "The user has entered a Lightning node ID. In this case, a new channel needs to be opened for a higher fee.",
    page: "3",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Send bitcoin",
      "Recipient",
      "02a6f31cc788036bd5f6e93dab24fd79127d99e0edf29d7f82a4e22bc9f18cec2f@tljpfqnx33h2ucq4anmq5hdzhcnplvkonm2fflb6wfdgt37j2mjmg6ad.onion:9735",
      "Amount",
      "19 800 sats",
      "Description",
      "What is this transaction for...",
      "Label",
      "~2 000  sats",
      "A payment channel will be opened for this transaction, for a minimum fee of 2 000 sats.",
      "Send payment"
    ]
  },
  {
    id: "sending-review",
    title: "Review",
    links: [
      {
        title: "Sending bitcoin",
        url: "https://bitcoin.design/guide/payments/send/"
      }
    ],
    flow: "Sending",
    description: "Explain the main purpose of the application.",
    page: "5",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Ready to send?",
      "3LaQ yFGJ 82tf XNdm jL23 \n7J6X dvhx RrNf kY",
      "Amount",
      "\u20BF0.35651816",
      "\u20BF0.00000987",
      "Time",
      "Aug 12, 2021 at 4:35pm",
      "Send"
    ]
  },
  {
    id: "sending-send-lightning-address",
    title: "Send, Lightning address",
    links: [
      {
        title: "Sending bitcoin",
        url: "https://bitcoin.design/guide/payments/send/"
      }
    ],
    flow: "Sending",
    description: "The user has entered a Lightning address.",
    page: "2",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Send bitcoin",
      "Recipient",
      "bob@lightning.address",
      "Amount",
      "200 sats",
      "Description",
      "What is this transaction for...",
      "Label",
      "~1  sat",
      "Send payment"
    ]
  },
  {
    id: "sending-send-bitcoin-address",
    title: "Send, Bitcoin address",
    links: [
      {
        title: "Sending bitcoin",
        url: "https://bitcoin.design/guide/payments/send/"
      }
    ],
    flow: "Sending",
    description: "The user has entered an on-chain address.",
    page: "4",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Send bitcoin",
      "Recipient",
      "14svUvG3emDZLc2L65iRwPYy1hw74SRQzi",
      "Label",
      "Amount",
      "21 700 sats",
      "Description",
      "What is this transaction for...",
      "On-chain fee",
      "~2 000  sats",
      "Send payment"
    ]
  },
  {
    id: "sending-confirmation",
    title: "Confirmation",
    links: [
      {
        title: "Sending bitcoin",
        url: "https://bitcoin.design/guide/payments/send/"
      }
    ],
    flow: "Sending",
    description: "An on-chain transaction has been sent.",
    page: "6",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Transaction sent",
      "It usually takes about 30 minutes for a transaction to be finalized.",
      "View transaction",
      "Done"
    ]
  },
  {
    id: "sending-share-invoice",
    title: "Share invoice",
    links: [
      {
        title: "Sending bitcoin",
        url: "https://bitcoin.design/guide/payments/send/"
      }
    ],
    flow: "Sending",
    description: "QR codes are efffective for sharing payment information in-person. Copy and other native share options are also available.",
    page: "7",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Done",
      "Share invoice",
      "View as text",
      "Share",
      "Copy",
      "Details & settings"
    ]
  },
  {
    id: "receiving-recipient",
    title: "Recipient",
    links: [
      {
        title: "Receiving bitcoin",
        url: "https://bitcoin.design/guide/payments/receive/"
      }
    ],
    flow: "Receiving",
    description: "Organizing payment requests by recipient helps users stay organized and allows the app to make intelligent recommendations.",
    page: "3",
    pagemax: "5",
    width: 375,
    height: 812,
    text: [
      "Done",
      "Who is this payment \nrequest for?",
      "Filter",
      "Search...",
      "New contact",
      "Beatrice Phillips",
      "Family \xB7 3 transactions",
      "Thomas Ray",
      "Friend \xB7 1 transaction",
      "ACME Pizza Parlor",
      "Business \xB7 563 transactions",
      "Mount Socks",
      "Exchange \xB7 1 transaction",
      "SuperExchange",
      "Home",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "receiving-purpose",
    title: "Purpose",
    links: [
      {
        title: "Receiving bitcoin",
        url: "https://bitcoin.design/guide/payments/receive/"
      }
    ],
    flow: "Receiving",
    description: "Notes and tags helps both the recipient and the user understand the purpose of the payment in the future.",
    page: "4",
    pagemax: "5",
    width: 375,
    height: 812,
    text: [
      "Done",
      "What is this payment for?",
      "Enter description...",
      "Home",
      "Business",
      "Good life",
      "Allowance",
      "Lunch",
      "New tag",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "receiving-amount",
    title: "Amount",
    links: [
      {
        title: "Receiving bitcoin",
        url: "https://bitcoin.design/guide/payments/receive/"
      }
    ],
    flow: "Receiving",
    description: "Basic amount input with the option of entering via the local currency. This requires the application to know the current exchange rate.",
    page: "1",
    pagemax: "5",
    width: 375,
    height: 812,
    text: [
      "Skip",
      "What is the amount?",
      "Bitcoin",
      "0.00",
      "Euro",
      "PQRS",
      "WXYZ",
      "Continue",
      "Home",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "receiving-share",
    title: "Share",
    links: [
      {
        title: "Receiving bitcoin",
        url: "https://bitcoin.design/guide/payments/receive/"
      }
    ],
    flow: "Receiving",
    description: "A series of options to share the payment request. Technical details to review and verify are collapsed, but easily accessible.",
    page: "2",
    pagemax: "5",
    width: 375,
    height: 812,
    text: [
      "Done",
      "Share payment request",
      "Share",
      "Copy",
      "Contact",
      "Note & tags",
      "Details and settings"
    ]
  },
  {
    id: "receiving-invoice-details",
    title: "Invoice details",
    links: [
      {
        title: "Receiving bitcoin",
        url: "https://bitcoin.design/guide/payments/receive/"
      }
    ],
    flow: "Receiving",
    description: "Quick access to verify details and access infrequently used options.",
    page: "5",
    pagemax: "5",
    width: 375,
    height: 812,
    text: [
      "Done",
      "Share payment request",
      "Share",
      "Copy",
      "Share link",
      "Copy link",
      "Copy QR code",
      "Download QR Code",
      "Details and settings",
      "Address",
      "bc1Q yFGJ 82tf XNdm jL23 \n7J6X dvhx RrNf kY",
      "Amount",
      "0.01020884",
      "Description",
      "50 pounds of horse meat.",
      "Use legacy address",
      "Notify when confirmed"
    ]
  },
  {
    id: "home-empty-wallet",
    title: "Empty wallet",
    flow: "Home",
    description: "If the user has no funds, a custom message can inform them how to get started.",
    page: "0",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Send",
      "Receive",
      "You are all set \nto receive Bitcoin",
      "Ask others to send you Bitcoin, \nor top up the wallet yourself.",
      "View address"
    ]
  },
  {
    id: "home-funded-wallet",
    title: "Funded wallet",
    flow: "Home",
    description: "Minimal home screen focusing on balance display. Swiping up or tapping the button at the bottom reveals transactions.",
    page: "2",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Savings",
      "1.6240 2785",
      "\u20AC 41,328.91",
      "1 transaction today",
      "Send",
      "Scan",
      "Receive"
    ]
  },
  {
    id: "home-hidden-balance",
    title: "Hidden balance",
    flow: "Home",
    description: "Tapping the balance switches between bitcoin, satoshi, and hidden display (*****).",
    page: "3",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Savings",
      "*****",
      "1 transaction today",
      "Send",
      "Scan",
      "Receive"
    ]
  },
  {
    id: "home-security-reminder",
    title: "Security reminder",
    flow: "Home",
    description: "Important messages around security, privacy or errors can be easily seen with a minimal design.",
    page: "4",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Savings",
      "93,500",
      "sats",
      "\u20AC 18.70",
      "Security checklist",
      "Make sure the privacy and security features are set up the way you want them.",
      "Review",
      "1 transaction today",
      "Send",
      "Scan",
      "Receive"
    ]
  },
  {
    id: "transactions-receive-transaction",
    title: "Receive transaction",
    flow: "Transactions",
    description: "The transaction screen should focus on highlighting the most relevant information and options to the user. Adding Contact info, notes and tags are easily accessible.",
    page: "5",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Money bag",
      "1.6240 2785",
      "$ 41,328.91",
      "You received",
      "+5 651 816 sats",
      "Contact",
      "Note",
      "Tags",
      "From address",
      "3LaQ ... NfkY",
      "Amount",
      "+2 987 sats",
      "When",
      "Aug 12, 2021 at 4:35pm",
      "Details",
      "Wallet",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "transactions-annotated-transactions",
    title: "Annotated transactions",
    flow: "Transactions",
    description: "Users should be able to enrich transactions with userful information like sender/receiver, purpose and categories/tags.",
    page: "2",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Transactions",
      "Luigi\u2019s pizza",
      "2 minutes ago",
      "-21,763 sat",
      "\u20AC -12.75",
      " +0.00001000",
      "4 hours ago",
      "Sent to",
      "Timothy Miller",
      "Yum\nYum",
      "Yum Yum Foods",
      "Yesterday",
      "-128,021 sat",
      "\u20AC -75.00",
      "Groceries",
      "Exchange",
      "Invoice",
      "Priya Lee",
      "April 12, 2021",
      "+1,706,950 sat",
      "\u20AC +1000.00",
      "Web design work for ACME Inc.\nInvoice BDC01",
      "Business",
      "Winston Park",
      "April 9, 2021",
      "+73,398 sat",
      "\u20AC +43,00",
      "Reimbursement for party expenses.",
      "Motor City",
      "April 4, 2021",
      "-139,969 sat",
      "\u20AC -82,00",
      "Tire rotation and oil change."
    ]
  },
  {
    id: "transactions-transaction-list",
    title: "Transaction list",
    flow: "Transactions",
    description: "Default transaction information is not helpful in understanding the payment purpose.",
    page: "1",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Transactions",
      "Categorize 5 new transactions",
      "17pY ... 6jHb",
      "2 minutes ago",
      "-0,00021763",
      "14NX ... MzMx",
      "Yesterday",
      " -0,00128021",
      " +0.00001000",
      "4 hours ago",
      "Sent to",
      "Timothy Miller",
      "1A3Y ... DDPE",
      "April 12, 2021",
      "+0,01706950",
      "Web design work for ACME Inc.",
      "Business",
      "Exchange",
      "Invoice",
      "1Kth ... fXXf",
      "April 9, 2021",
      "+0,00073398",
      "1Bvb ... RDW7",
      "April 4, 2021",
      "-0,00139969"
    ]
  },
  {
    id: "transactions-transaction-list-grouped",
    title: "Transaction list, grouped",
    flow: "Transactions",
    description: "Micropayments can be grouped together to clean up the list. ",
    page: "3",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Transactions",
      "Sending...",
      "2 minutes ago",
      "-100 sats",
      "\u20AC1,27",
      "Sent",
      "September 21, 2021",
      "-1 000 sats",
      "\u20AC12,75",
      "41 small transactions",
      "September 19, 2021",
      "-57 sats",
      "\u20AC0,63",
      " +0.00001000",
      "4 hours ago",
      "Sent to",
      "Timothy Miller",
      "Lightning fun games",
      "April 4, 2021",
      "-57 sat",
      " -0,63 \u20AC",
      "17 transactions",
      "Business",
      "Exchange",
      "Invoice",
      "Priya Lee",
      "April 12, 2021",
      "+1 706 950 sat",
      "\u20AC2 000",
      "Web design work for ACME Inc.\nInvoice BDC01",
      "Design"
    ]
  },
  {
    id: "transactions-summary",
    title: "Summary",
    flow: "Transactions",
    description: "An overview provides better insight for budgeting and accounting purposes.",
    page: "4",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Overview",
      "November 2021",
      "Your balance",
      "Tags",
      "Income",
      "2 transactions",
      "+ \u20AC2,86",
      "Good life",
      "35 transactions",
      "fdsh gdhjgsdj",
      "- \u20AC1,471",
      "Transportation",
      "6 transactions",
      "fsdh fdhsgfjdsgfjdg jfg djgfjds",
      "- \u20AC161",
      "Home",
      "12 transactions",
      "fdjfhjgdsghj",
      "- \u20AC3,436"
    ]
  },
  {
    id: "transactions-send-transaction",
    title: "Send transaction",
    flow: "Transactions",
    description: "Variation of the transaction screen showing a Lightning payment.",
    page: "8",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Money bag",
      "1.6240 2785",
      "$ 41,328.91",
      "You sent",
      "-50 sats",
      "Contact",
      "Note",
      "Tags",
      "To node",
      "0356 ... 3cab",
      "Amount",
      "-1 sat",
      "When",
      "2 minutes ago",
      "Details",
      "Wallet",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "transactions-receive-transaction-expanded",
    title: "Receive transaction, expanded",
    flow: "Transactions",
    description: "Details can be expanded for extra information. Also shown here is a status display.",
    page: "6",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Money bag",
      "1.6240 2785",
      "$ 41,328.91",
      "You received",
      "+5 651 816 sats",
      "Contact",
      "Note",
      "Tags",
      "Payment pending",
      "12 minutes",
      "From address",
      "3LaQ ... NfkY",
      "Amount",
      "+2 987 sats",
      "When",
      "Aug 12, 2021 at 4:35pm",
      "Confirmations",
      "Received in address",
      "bc1k ... dz73",
      "Transaction ID",
      "4367 ... 846a",
      "Details",
      "Wallet",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "transactions-send-transaction-expanded",
    title: "Send transaction, expanded",
    flow: "Transactions",
    description: "The same Lightning payment with expanded details.",
    page: "9",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Money bag",
      "1.6240 2785",
      "$ 41,328.91",
      "You sent",
      "-50 sats",
      "Contact",
      "Note",
      "Tags",
      "To node",
      "0356 ... 3cab",
      "Amount",
      "-1 sat",
      "When",
      "2 minutes ago",
      "Lightning invoice",
      "lnbc ... 7d56",
      "Payment preimage",
      "76fg ... 9r37",
      "Details",
      "Wallet",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "transactions-receive-transaction-id-details",
    title: "Receive transaction, ID details",
    flow: "Transactions",
    description: "Even more details and options to interact with each piece of information can be accessed by tapping each row.",
    page: "7",
    pagemax: "9",
    width: 375,
    height: 812,
    text: [
      "Money bag",
      "1.6240 2785",
      "$ 41,328.91",
      "You received",
      "+5 651 816 sats",
      "Contact",
      "Note",
      "Tags",
      "From address",
      "3LaQ ... NfkY",
      "Amount",
      "5 651 816 sats",
      "2 987 sats",
      "When",
      "Aug 12, 2021 at 4:35pm",
      "Confirmations",
      "Received in address",
      "bc1k ... dz73",
      "Transaction ID",
      "4367 ... 846a",
      "Details",
      "ba6f fe4f ac2b 9651 6738 73ef ab13 04cb 74d3 7ed8 851d e49b d974 ce1e 02a1 4ec7",
      "Copy to clipboard",
      "View in explorer",
      "Wallet",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "home-account-switcher",
    title: "Account switcher",
    flow: "Home",
    description: "Wallet switching and adding happens in an overlay accessed by tapping the wallet name.",
    page: "5",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Savings",
      "93,500",
      "sats",
      "\u20AC 18.70",
      "1 transaction today",
      "Send",
      "Scan",
      "Receive",
      "Accounts",
      "Spending",
      "\u20BF 0.0352",
      "\u20BF 1.3567",
      "Add wallet"
    ]
  },
  {
    id: "home-unit-display-options",
    title: "Unit display options",
    flow: "Home",
    description: "Tap and hold the balance to see unit options.",
    page: "6",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Savings",
      "93,500",
      "sats",
      "\u20AC 18.70",
      "1 transaction today",
      "Send",
      "Scan",
      "Receive",
      "Bitcoin unit",
      "Automatic",
      "Bitcoin (BTC, \u20BF)",
      "Label",
      "Bit (\u03BCBTC, \u03BC\u20BF)",
      "Millibit (mBTC, m\u20BF)",
      "Satoshi (SAT)",
      "Hide balance"
    ]
  },
  {
    id: "home-clipboard",
    title: "Clipboard",
    flow: "Home",
    description: "If the user has no funds, a custom message can inform them how to get started.",
    page: "7",
    pagemax: "7",
    width: 375,
    height: 812,
    text: [
      "Savings",
      "93,500",
      "sats",
      "\u20AC 18.70",
      "1 transaction today",
      "Send",
      "Scan",
      "Receive",
      "You have a Lightning invoice on your clipboard.",
      "Would you like to use this invoice for a transaction?",
      "Amount requested",
      "25,000 sats",
      "Cancel",
      "Approve"
    ]
  },
  {
    id: "contacts-list",
    title: "List",
    flow: "Contacts",
    description: "Well-organized contact lists provide useful overviews and simplify sending and receiving flows.",
    page: "1",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "New contact",
      "Contacts",
      "Filter",
      "Search...",
      "Priya Lee",
      "Family \xB7 3 transactions",
      "Thomas Ray",
      "Friend \xB7 1 transaction",
      "ACME Pizza Parlor",
      "Business \xB7 563 transactions",
      "Mount Socks",
      "12 transactions",
      "SuperExchange",
      "Exchange \xB7 1 transaction",
      "Home",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "contacts-personal-contact",
    title: "Personal contact",
    flow: "Contacts",
    description: "Personal contacts can gather transaction and address information.",
    page: "2",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Contacts",
      "Priya Lee",
      "Note",
      "Family",
      "Add tag",
      "Email",
      "priya.lee@bitcoin.design",
      "Lightning address",
      "pl@bitcoin.design",
      "12 Transactions",
      "Last one 3 days ago",
      "2 Scheduled payments",
      "Next in 6 days",
      "3 Addresses",
      "Home",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "contacts-company-contact",
    title: "Company contact",
    flow: "Contacts",
    description: "Company contacts can be emphasize options like scheduled payments and invoice generation.",
    page: "3",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Contacts",
      "Mount Socks",
      "Note",
      "Tags",
      "Website",
      "mtgox.com",
      "12 Transactions",
      "3d ago",
      "Add a scheduled payment...",
      "4 Addresses",
      "Home",
      "Send",
      "Receive",
      "Settings"
    ]
  },
  {
    id: "checklists-security-checklist",
    title: "Security checklist",
    flow: "Checklists",
    description: "A quick, actionable summary of how well the wallet is secured. Covers app security, key scheme, and backup.",
    page: "1",
    pagemax: "2",
    width: 375,
    height: 812,
    text: [
      "Security checklist",
      "App settings",
      "You enabled PIN entry to access the app.",
      "Security mode",
      "You are using a 2-2 multi-key configuration for storing medium amounts of bitcoin.",
      "Key backup",
      "Last backup on Jan 31, 2021.",
      "Learn more"
    ]
  },
  {
    id: "checklists-inadequate-security",
    title: "Inadequate security",
    flow: "Checklists",
    description: "A wallet can recommend users to switch to a secure setup if the amount of funds is beyond the applications security model.",
    page: "2",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Security checklist",
      "Improve your security",
      "The security of this wallet is not adequate for the amount of funds you store. An upgrade is recommended.\nLearn more",
      "App settings",
      "You enabled PIN entry to access the app.",
      "Security mode",
      "You are using the default single-key setup.",
      "Key backup",
      "Last backup on Jan 31, 2021.",
      "Learn more"
    ]
  },
  {
    id: "settings-face-id",
    title: "Face ID",
    links: [
      {
        title: "Protecting a wallet",
        url: "https://bitcoin.design/guide/onboarding/protecting-a-wallet/"
      }
    ],
    flow: "Settings",
    description: "Enabling face detection could be offered during onboarding, and accessed later in settings.",
    page: "10",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Skip",
      "Enable face detection for extra security",
      "Allows you to quickly access your wallet with a quick glance at your phone. Also used as an additional security check for approving transactions.",
      "Enable"
    ]
  },
  {
    id: "settings-settings",
    title: "Settings",
    flow: "Settings",
    description: "Settings are logically grouped to provide easy entry points.",
    page: "1",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Settings",
      "General",
      "Privacy & security",
      "Wallet backup",
      "Help & support",
      "Advanced"
    ]
  },
  {
    id: "settings-general",
    title: "General",
    flow: "Settings",
    description: "Basic settings for localization and notifications.",
    page: "2",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "General",
      "Language",
      "English",
      "Local currency",
      "Bitcoin unit",
      "Notifications",
      "Incoming transactions"
    ]
  },
  {
    id: "settings-privacy-security",
    title: "Privacy & security",
    links: [
      {
        title: "Protecting a wallet",
        url: "https://bitcoin.design/guide/onboarding/protecting-a-wallet/"
      }
    ],
    flow: "Settings",
    description: "PIN, FaceID, an option to hide sensitive data from display, and wallet limits.",
    page: "3",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Privacy & security",
      "Choose a PIN to access the app and protect your data.",
      "FaceID",
      "Use FaceID to perform spending actions securely.",
      "Hide sensitive data",
      "Hides balance and transaction amounts from display.",
      "Wallet limits",
      "Enable wallet limits",
      "Transaction limit",
      "The maximum size of a single transaction.",
      "45,000 sats",
      "Daily spending limit",
      "The total amount that can be spent per day.",
      "1,000,000 sats"
    ]
  },
  {
    id: "settings-wallet-backup",
    title: "Wallet backup",
    links: [
      {
        title: "Backing up a recovery phrase",
        url: "https://bitcoin.design/guide/onboarding/backing-up-a-recovery-phrase/"
      }
    ],
    flow: "Settings",
    description: "Automatic and manual backup options.",
    page: "4",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Wallet backup",
      "Automatic cloud backup",
      "Store backup data in",
      "Apple iCloud",
      "Encrypt cloud backup",
      "Backup channels",
      "Backup transactions",
      "Manual backup",
      "View recovery phrase"
    ]
  },
  {
    id: "settings-local-currency",
    title: "Local currency",
    flow: "Settings",
    description: "The local currency should be automatically identified, with an option to change it.",
    page: "7",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Local currency",
      "Commonly used",
      "Eurozone Euro (EUR, \u20AC)",
      "US Dollar (USD, $)",
      "None",
      "All options",
      "Alabian Lek (ALL, L) ",
      "Argentine Peso, (ARS, $)",
      "Australian Dollar (AUD, $)",
      "Arubian Florin (AWG, \u0192)",
      "Brasilian Real (BRL, R$)",
      "Canadian Dollar (CAD, $)",
      "Swiss Franc (CHF)",
      "Chilean Peso (LP, $)",
      "COP ($)",
      "CZK (K\u010D)",
      "CNY (\xA5)"
    ]
  },
  {
    id: "settings-help-support",
    title: "Help & support",
    flow: "Settings",
    description: "Various ways for users to learn about the application and find support information.",
    page: "5",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Help & support",
      "About",
      "FAQs",
      "Feature requests",
      "Community",
      "License",
      "App information"
    ]
  },
  {
    id: "settings-bitcoin-unit",
    title: "Bitcoin unit",
    links: [
      {
        title: "Units and symbols",
        url: "https://bitcoin.design/guide/payments/units-and-symbols/"
      }
    ],
    flow: "Settings",
    description: "Unit settings are kept to the two most common options, bitcoin and satoshis.",
    page: "8",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Bitcoin unit",
      "Automatic",
      "Bitcoin (BTC, \u20BF)",
      "Satoshi (SAT)",
      "Toggle between units on the home screen by tapping your balance."
    ]
  },
  {
    id: "settings-advanced",
    title: "Advanced",
    flow: "Settings",
    description: "Connection settings for both the Bitcoin and Network settings, as well as overall data exchange.",
    page: "6",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Advanced",
      "Bitcoin network",
      "Lightning network"
    ]
  },
  {
    id: "settings-bitcoin-network",
    title: "Bitcoin network",
    flow: "Settings",
    description: "Configuration options to connect via a personal node.",
    page: "9",
    pagemax: "10",
    width: 375,
    height: 812,
    text: [
      "Bitcoin network",
      "Node",
      "My Raspberry pi",
      "Pruning",
      "Sync when not on WiFi",
      "Network",
      "Mainnet"
    ]
  },
  {
    id: "checklists-privacy-checklist",
    title: "Privacy checklist",
    flow: "Checklists",
    description: "A quick, actionable summary of how the wallet privacy. Covers app privacy, data privacy",
    page: "3",
    pagemax: "3",
    width: 375,
    height: 812,
    text: [
      "Privacy checklist",
      "Change mode",
      "App settings",
      "Balances and transactions are visible by default.",
      "Validation",
      "Transactions are validated with your own Bitcoin node.",
      "Connection",
      "Data is anonymized via Tor.",
      "Learn more"
    ]
  }
];
const _sfc_main$d = {
  name: "HelperPage",
  components: {
    ScreenList: ScreenList$2
  },
  data() {
    const content = ScreenData;
    const ids = [];
    let id;
    for (let i = 0; i < content.length; i++) {
      id = content[i].id;
      if (ids.indexOf(id) !== -1) {
        content.splice(i, 1);
        i--;
        console.log("Deleted duplicate:", id);
      } else {
        ids.push(id);
      }
    }
    return {
      inputModel: "",
      outputModel: JSON.stringify(content),
      content
    };
  },
  methods: {
    changeInput() {
      try {
        const newData = JSON.parse(this.inputModel);
        let newScreenId, oldScreenId, newIndex, oldIndex, replaced;
        for (newIndex in newData) {
          replaced = false;
          newScreenId = newData[newIndex];
          for (oldIndex in this.content) {
            oldScreenId = this.content[oldIndex];
            if (newScreenId == oldScreenId) {
              this.content[oldIndex] = newData[newIndex];
              replaced = true;
            }
          }
          if (!replaced) {
            this.content.push(newData[newIndex]);
          }
        }
        this.outputModel = JSON.stringify(this.content);
      } catch (error) {
        console.log("errror");
      }
    },
    removeScreen(screenId) {
      for (let i in this.content) {
        if (this.content[i].id == screenId) {
          this.content.splice(i, 1);
          this.outputModel = JSON.stringify(this.content);
          break;
        }
      }
    }
  }
};
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ScreenList = vue_cjs_prod.resolveComponent("ScreenList");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "helper-page" }, _attrs))} data-v-76bb6b9e><div class="inputs" data-v-76bb6b9e><textarea placeholder="Paste new data..." data-v-76bb6b9e>${serverRenderer.exports.ssrInterpolate($data.inputModel)}</textarea><textarea data-v-76bb6b9e>${serverRenderer.exports.ssrInterpolate($data.outputModel)}</textarea></div>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_ScreenList, { screenData: $data.content }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/helper.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const helper = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$d], ["__scopeId", "data-v-76bb6b9e"]]);
const helper$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": helper
});
const _imports_0 = "/_nuxt/assets/themes-mobile.853187ec.png";
const _imports_1 = "/_nuxt/assets/themes-mobile@2x.62bfc9a4.png";
const _imports_2 = "/_nuxt/assets/themes.5d434112.png";
const _imports_3 = "/_nuxt/assets/themes@2x.ecdd796f.png";
const _imports_4 = "/_nuxt/assets/caret-down.077a86fd.svg";
const _sfc_main$c = {
  name: "Intro"
};
const _hoisted_1 = _imports_0 + " 1x, " + _imports_1 + " 2x";
const _hoisted_2 = _imports_2 + " 1x, " + _imports_3 + " 2x";
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "intro" }, _attrs))} data-v-6e16d3c7><picture data-v-6e16d3c7><source media="(max-width: 639px)"${serverRenderer.exports.ssrRenderAttr("srcset", _hoisted_1)} data-v-6e16d3c7><img${serverRenderer.exports.ssrRenderAttr("src", _imports_2)}${serverRenderer.exports.ssrRenderAttr("srcset", _hoisted_2)} alt="" width="1280" height="642" loading="lazy" data-v-6e16d3c7></picture><h2 id="whats-included" data-v-6e16d3c7>See what&#39;s included</h2><img${serverRenderer.exports.ssrRenderAttr("src", _imports_4)} width="24" height="24" alt="Arrow down" data-v-6e16d3c7></div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/Intro.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$c], ["__scopeId", "data-v-6e16d3c7"]]);
const Intro = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_0$2
});
const _sfc_main$b = {
  name: "IncludedContentItem",
  props: {
    screenSize: String,
    content: Object
  },
  computed: {
    styleObject() {
      return {
        height: this.screenSize == "large" ? this.content.image.height + "px" : null
      };
    }
  }
};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "included-content-item" }, _attrs))} data-v-21543562><div class="copy" data-v-21543562>`);
  if ($props.content.to) {
    _push(`<h3 data-v-21543562>`);
    _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, {
      to: $props.content.to
    }, {
      default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${serverRenderer.exports.ssrInterpolate($props.content.title)}`);
        } else {
          return [
            vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString($props.content.title), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</h3>`);
  } else {
    _push(`<!---->`);
  }
  if (!$props.content.to) {
    _push(`<h3 data-v-21543562>${serverRenderer.exports.ssrInterpolate($props.content.title)}</h3>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<p data-v-21543562>${$props.content.description}</p></div><div class="image" style="${serverRenderer.exports.ssrRenderStyle($options.styleObject)}" data-v-21543562><picture data-v-21543562><source media="(max-width: 639px)"${serverRenderer.exports.ssrRenderAttr("srcset", $props.content.image.mobile + " 1x, " + $props.content.image.mobileRetina + " 2x")} data-v-21543562><img${serverRenderer.exports.ssrRenderAttr("src", $props.content.image.url)}${serverRenderer.exports.ssrRenderAttr("srcset", $props.content.image.url + " 1x, " + $props.content.image.retina + " 2x")}${serverRenderer.exports.ssrRenderAttr("alt", $props.content.image.alt)}${serverRenderer.exports.ssrRenderAttr("width", $props.content.image.width)}${serverRenderer.exports.ssrRenderAttr("height", $props.content.image.height)} loading="lazy" data-v-21543562></picture></div></div>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/IncludedContentItem.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$b], ["__scopeId", "data-v-21543562"]]);
const IncludedContentItem = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_0$1
});
const _sfc_main$a = {
  name: "IncludedContent",
  components: {
    IncludedContentItem: __nuxt_component_0$1
  },
  props: {
    screenSize: String
  },
  data() {
    return {
      content: [
        {
          title: "Elements",
          to: "/foundation",
          description: 'Colors, icons, text styles and other details make up the smallest parts the UI kit. Customize them and the changes are automatically applied to all the other components. Icons and illustrations via <a href="https://bitcoinicons.com/" target="_blank" rel="nofollow noreferrer notarget">Bitcoin&nbsp;Icons</a> and <a href="https://github.com/GBKS/bitcoin-hardware-illustrations" target="_blank" rel="nofollow noreferrer notarget">Bitcoin&nbsp;hardware&nbsp;illustrations</a>.',
          image: {
            url: "/assets/elements.png",
            retina: "/assets/elements@2x.png",
            mobile: "/assets/elements-mobile.png",
            mobileRetina: "/assets/elements-mobile@2x.png",
            width: 1275,
            height: 809,
            alt: "Stuff"
          }
        },
        {
          title: "Components",
          description: "The kit includes plenty of building blocks, from general UI components like buttons and inputs, to Bitcoin-specific ones like balance display and address&nbsp;input.",
          image: {
            url: "/assets/components.png",
            retina: "/assets/components@2x.png",
            mobile: "/assets/components-mobile.png",
            mobileRetina: "/assets/components-mobile@2x.png",
            width: 1317,
            height: 897,
            alt: "Stuff"
          }
        },
        {
          title: "Screens",
          to: "/screens",
          description: "Common UI screens are included for both mobile and desktop applications. Home, settings, transactions, security center, and a lot&nbsp;more.",
          image: {
            url: "/assets/screens.png",
            retina: "/assets/screens@2x.png",
            mobile: "/assets/screens-mobile.png",
            mobileRetina: "/assets/screens-mobile@2x.png",
            width: 1426,
            height: 654,
            alt: "Stuff"
          }
        },
        {
          title: "User flows",
          to: "/screens",
          description: "Onboarding, wallet creation, sending, receiving and other common user flows are laid out with explanations and can be easily&nbsp;customized.",
          image: {
            url: "/assets/user-flow.png",
            retina: "/assets/user-flow@2x.png",
            mobile: "/assets/user-flow-mobile.png",
            mobileRetina: "/assets/user-flow-mobile@2x.png",
            width: 1056,
            height: 498,
            alt: "Stuff"
          }
        }
      ]
    };
  }
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_IncludedContentItem = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "included-content" }, _attrs))} data-v-71765d05><!--[-->`);
  serverRenderer.exports.ssrRenderList($data.content, (item, index2) => {
    _push(serverRenderer.exports.ssrRenderComponent(_component_IncludedContentItem, {
      key: index2,
      content: item,
      screenSize: $props.screenSize
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/IncludedContent.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$a], ["__scopeId", "data-v-71765d05"]]);
const IncludedContent = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_1$1
});
const _sfc_main$9 = {
  name: "HomePage",
  components: {
    Intro: __nuxt_component_0$2,
    IncludedContent: __nuxt_component_1$1,
    Tabs: __nuxt_component_0$3
  },
  props: [
    "screenSize"
  ],
  beforeMount() {
    document.title = "Bitcoin UI Kit";
  },
  data() {
    return {
      title: "Bitcoin UI Kit",
      description: "This design system and UI kit provides a design foundation for prototypes, concept explorations and open-source projects to kickstart the design process. So you can focus on what makes your Bitcoin product&nbsp;unique.",
      figmaLink: {
        label: "Duplicate on Figma",
        url: "https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)"
      },
      links: [
        {
          label: "Info",
          to: "/info"
        },
        {
          label: "Foundation",
          to: "/foundation"
        },
        {
          label: "Screens",
          to: "/screens"
        }
      ]
    };
  }
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Intro = __nuxt_component_0$2;
  const _component_IncludedContent = __nuxt_component_1$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "home-page" }, _attrs))}><div class="wrap">`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_Intro, null, null, _parent));
  _push(serverRenderer.exports.ssrRenderComponent(_component_IncludedContent, { screenSize: $props.screenSize }, null, _parent));
  {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/home.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const home = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$9]]);
const home$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": home
});
const _sfc_main$8 = {
  name: "HomePage",
  components: {
    Intro: __nuxt_component_0$2,
    IncludedContent: __nuxt_component_1$1,
    Tabs: __nuxt_component_0$3
  },
  props: [
    "screenSize"
  ],
  beforeMount() {
    document.title = "Bitcoin UI Kit";
  },
  data() {
    return {
      title: "Bitcoin UI Kit",
      description: "This design system and UI kit provides a design foundation for prototypes, concept explorations and open-source projects to kickstart the design process. So you can focus on what makes your Bitcoin product&nbsp;unique.",
      figmaLink: {
        label: "Duplicate on Figma",
        url: "https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)"
      },
      links: [
        {
          label: "Info",
          to: "/info"
        },
        {
          label: "Foundation",
          to: "/foundation"
        },
        {
          label: "Screens",
          to: "/screens"
        }
      ]
    };
  }
};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Intro = __nuxt_component_0$2;
  const _component_IncludedContent = __nuxt_component_1$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "home-page" }, _attrs))}><div class="wrap">`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_Intro, null, null, _parent));
  _push(serverRenderer.exports.ssrRenderComponent(_component_IncludedContent, { screenSize: $props.screenSize }, null, _parent));
  {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/index.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$8]]);
const index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": index
});
const _sfc_main$7 = {
  name: "SiteInfo",
  props: {
    figmaLink: Object
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "site-info" }, _attrs))} data-v-20658890><h2 id="how-to-use" data-v-20658890>How to use it</h2><p data-v-20658890>You will need a Figma account to use the kit. On the <a href="https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)" target="_blank" rel="noreferrer notarget" data-v-20658890>kit page</a>, press &quot;Duplicate&quot; to create your own copy of the file. You can freely modify it and use it as you\xA0desire.</p><a class="button"${serverRenderer.exports.ssrRenderAttr("href", $props.figmaLink.url)} target="_blank" rel="noreferrer noopener" data-v-20658890>${serverRenderer.exports.ssrInterpolate($props.figmaLink.name)} <img${serverRenderer.exports.ssrRenderAttr("src", _imports_0$1)} width="24" height="24" alt="Arrow right" data-v-20658890></a><p data-v-20658890>Some use case ideas:</p><ul data-v-20658890><li data-v-20658890>The foundation for a new Bitcoin wallet\xA0project</li><li data-v-20658890>A reference for how to solve a specific user flow or interface\xA0execution</li><li data-v-20658890>Create mockups and prototypes to include in the <a href="https://bitcoin.design/guide/" target="_blank" rel="noreferrer notarget" data-v-20658890>Bitcoin\xA0Design\xA0Guide</a></li><li data-v-20658890>Quick design concept explorations</li><li data-v-20658890>Developers can pick elements from the UI kit to include in their\xA0applications</li></ul><p data-v-20658890>Also check out the <a href="https://github.com/reez/WalletUI" target="_blank" rel="nofollow noreferrer notarget" data-v-20658890>WalletUI project</a>. reez is turning this kit into an iOS\xA0library.</p><h2 id="contribute" data-v-20658890>How to contribute</h2><p data-v-20658890>The kit is a big work-in-progress and you are welcome to chip in. It is primarily maintained by <a href="https://twitter.com/gbks" target="_blank" rel="nofollow noreferrer notarget" data-v-20658890>GBKS</a>. If you have feedback, leave a comment directly in the Figma file or <a href="https://github.com/GBKS/bitcoin-wallet-ui-kit" target="_blank" rel="me" data-v-20658890>Github repo</a>.</p><p data-v-20658890>What&#39;s helpful:</p><ul data-v-20658890><li data-v-20658890>Point out mistakes (spelling, technical,\xA0visual)</li><li data-v-20658890>Ask for components, screens, etc you think should be\xA0added</li><li data-v-20658890>Propose specific improvements</li><li data-v-20658890>Point out alternative approaches</li><li data-v-20658890>Let me know if you made use of the\xA0kit</li></ul><p data-v-20658890>To propose specific design changes, duplicate the file, make your changes, and leave a comment on the original file. We can then together review and merge the changes into the main file. You can also publish your file as a\xA0<a href="https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-Figma-Community#Community_files" target="_blank" rel="nofollow noreferrer notarget" data-v-20658890>Remix</a>.</p><h2 id="license" data-v-20658890>License</h2><p data-v-20658890>The kit is published via Figma community under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow noreferrer notarget" data-v-20658890>CC BY 4.0 license</a>. You can modify and use it freely for personal and commercial projects, and of course the best types \u2014 open-source\xA0projects.</p></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/site/Info.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7], ["__scopeId", "data-v-20658890"]]);
const Info = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_0
});
const _sfc_main$6 = {
  name: "InfoPage",
  components: {
    SiteInfo: __nuxt_component_0
  },
  props: [
    "screenSize"
  ],
  beforeMount() {
    document.title = "Info | Bitcoin UI Kit";
  },
  data() {
    return {
      figmaLink: {
        name: "Duplicate on Figma",
        url: "https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)"
      }
    };
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_SiteInfo = __nuxt_component_0;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "info-page" }, _attrs))}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_SiteInfo, { figmaLink: $data.figmaLink }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/info.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const info = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6]]);
const info$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": info
});
const _sfc_main$5 = {
  name: "ScreensOverlay",
  props: [
    "screenData",
    "activeFlowId",
    "searchTerm"
  ],
  watch: {
    screenData() {
      if (this.screenData) {
        document.body.classList.add("-overlay-visible");
      } else {
        document.body.classList.remove("-overlay-visible");
      }
    }
  },
  mounted() {
    if (this.screenData) {
      document.body.classList.add("-overlay-visible");
    }
  },
  computed: {
    imageFile() {
      return "/assets/screens/" + this.screenData.id + ".png";
    },
    imageSourceSet() {
      return "/assets/screens/" + this.screenData.id + ".png 1x, /assets/screens/" + this.screenData.id + "@2x.png 2x";
    },
    flowLink() {
      return "/screens/flow/" + this.slugify(this.screenData.flow);
    },
    flowText() {
      let result = null;
      if (this.screenData.flow) {
        result = this.screenData.page + " of " + this.screenData.pagemax;
      }
      return result;
    },
    closeLink() {
      let result = "/screens";
      if (this.activeFlowId && this.activeFlowId != "all") {
        result = "/screens/flow/" + this.activeFlowId;
      }
      if (this.searchTerm) {
        result += "?search=" + this.searchTerm;
      }
      return result;
    }
  },
  methods: {
    hide() {
      this.$emit("hide");
    },
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, "");
      str = str.toLowerCase();
      var from = "\xE0\xE1\xE4\xE2\xE8\xE9\xEB\xEA\xEC\xED\xEF\xEE\xF2\xF3\xF6\xF4\xF9\xFA\xFC\xFB\xF1\xE7\xB7/_,:;";
      var to = "aaaaeeeeiiiioooouuuunc------";
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }
      str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      return str;
    },
    clickBack(event) {
      if (event.target == this.$refs.wrap || event.target == this.$refs.overlay) {
        this.$router.push(this.closeLink);
      }
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
  if ($props.screenData) {
    _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
      ref: "overlay",
      class: "screens-overlay"
    }, _attrs))} data-v-4464453e><div class="wrap" data-v-4464453e><div class="content" data-v-4464453e><div class="copy" data-v-4464453e>`);
    _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, { to: $options.closeLink }, {
      default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Close`);
        } else {
          return [
            vue_cjs_prod.createTextVNode("Close")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`<h3 data-v-4464453e>${serverRenderer.exports.ssrInterpolate($props.screenData.title)}</h3>`);
    if ($props.screenData.description) {
      _push(`<p data-v-4464453e>${serverRenderer.exports.ssrInterpolate($props.screenData.description)}</p>`);
    } else {
      _push(`<!---->`);
    }
    if ($options.flowText) {
      _push(`<p class="-flow" data-v-4464453e><b data-v-4464453e>Flow</b><br data-v-4464453e>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, { to: $options.flowLink }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate($props.screenData.flow)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString($props.screenData.flow), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`, screen ${serverRenderer.exports.ssrInterpolate($options.flowText)}</p>`);
    } else {
      _push(`<!---->`);
    }
    if ($props.screenData.links) {
      _push(`<p class="-links" data-v-4464453e><b data-v-4464453e>Links</b><br data-v-4464453e><!--[-->`);
      serverRenderer.exports.ssrRenderList($props.screenData.links, (item, index2) => {
        _push(`<a${serverRenderer.exports.ssrRenderAttr("href", item.url)} target="_blank" data-v-4464453e>${serverRenderer.exports.ssrInterpolate(item.title)}</a>`);
      });
      _push(`<!--]--></p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><img${serverRenderer.exports.ssrRenderAttr("src", $options.imageFile)}${serverRenderer.exports.ssrRenderAttr("srcset", $options.imageSourceSet)} width="375" height="812"${serverRenderer.exports.ssrRenderAttr("alt", $props.screenData.title)} data-v-4464453e></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/screens/Overlay.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-4464453e"]]);
const Overlay = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_1
});
const _sfc_main$4 = {
  name: "ScreenItem",
  props: [
    "screenData",
    "activeFlowId",
    "activeScreenId",
    "searchTerm"
  ],
  data() {
    return {
      imageLoading: true
    };
  },
  computed: {
    className() {
      const c = ["screen-item"];
      if (this.screenData.id == this.activeScreenId) {
        c.push("-active");
      }
      if (this.imageLoading) {
        c.push("-loading");
      }
      return c.join(" ");
    },
    imageFile() {
      return "/assets/screens/" + this.screenData.id + "-preview.png";
    },
    imageSourceSet() {
      return "/assets/screens/" + this.screenData.id + "-preview.png 1x, /assets/screens/" + this.screenData.id + "-preview@2x.png 2x";
    },
    link() {
      const slug = this.slugify(this.screenData.id);
      let result = "/screens/screen/" + slug;
      if (this.activeFlowId && this.activeFlowId !== "all") {
        result = "/screens/flow/" + this.activeFlowId + "/" + slug;
      }
      if (this.searchTerm) {
        result += "?search=" + this.searchTerm;
      }
      return result;
    },
    flowLink() {
      return "/screens/flow/" + this.slugify(this.screenData.flow);
    },
    flowText() {
      let result = null;
      if (this.screenData.flow) {
        result = this.screenData.page + "/" + this.screenData.pagemax;
      }
      return result;
    }
  },
  methods: {
    select() {
      this.$emit("select", this.screenData.id);
    },
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, "");
      str = str.toLowerCase();
      var from = "\xE0\xE1\xE4\xE2\xE8\xE9\xEB\xEA\xEC\xED\xEF\xEE\xF2\xF3\xF6\xF4\xF9\xFA\xFC\xFB\xF1\xE7\xB7/_,:;";
      var to = "aaaaeeeeiiiioooouuuunc------";
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }
      str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      return str;
    },
    imageLoaded() {
      this.imageLoading = false;
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: $options.className }, _attrs))} data-v-be561ca0>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, { to: $options.link }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.exports.ssrRenderAttr("src", $options.imageFile)}${serverRenderer.exports.ssrRenderAttr("srcset", $options.imageSourceSet)}${serverRenderer.exports.ssrRenderAttr("width", $props.screenData.width)}${serverRenderer.exports.ssrRenderAttr("height", $props.screenData.height)}${serverRenderer.exports.ssrRenderAttr("alt", $props.screenData.title)} data-v-be561ca0${_scopeId}>`);
      } else {
        return [
          vue_cjs_prod.createVNode("img", {
            src: $options.imageFile,
            srcset: $options.imageSourceSet,
            width: $props.screenData.width,
            height: $props.screenData.height,
            alt: $props.screenData.title,
            onLoad: $options.imageLoaded
          }, null, 40, ["src", "srcset", "width", "height", "alt", "onLoad"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h3 data-v-be561ca0>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, { to: $options.link }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${serverRenderer.exports.ssrInterpolate($props.screenData.title)}`);
      } else {
        return [
          vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString($props.screenData.title), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</h3>`);
  if ($options.flowText) {
    _push(`<p class="-flow" data-v-be561ca0>`);
    _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, { to: $options.flowLink }, {
      default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${serverRenderer.exports.ssrInterpolate($props.screenData.flow)} ${serverRenderer.exports.ssrInterpolate($options.flowText)}`);
        } else {
          return [
            vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString($props.screenData.flow) + " " + vue_cjs_prod.toDisplayString($options.flowText), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</p>`);
  } else {
    _push(`<!---->`);
  }
  {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/screens/ScreenItem.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ScreenItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-be561ca0"]]);
const ScreenItem$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ScreenItem
});
const _sfc_main$3 = {
  name: "ScreenList",
  components: {
    ScreenItem
  },
  props: [
    "screenData",
    "activeFlowId",
    "activeScreenId",
    "searchTerm"
  ],
  methods: {
    select(value) {
      this.$emit("select", value);
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ScreenItem = vue_cjs_prod.resolveComponent("ScreenItem");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "screen-list" }, _attrs))}><!--[-->`);
  serverRenderer.exports.ssrRenderList($props.screenData, (item) => {
    _push(serverRenderer.exports.ssrRenderComponent(_component_ScreenItem, {
      key: item.id,
      screenData: item,
      activeFlowId: $props.activeFlowId,
      activeScreenId: $props.activeScreenId,
      searchTerm: $props.searchTerm
    }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/screens/ScreenList.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ScreenList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const ScreenList$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ScreenList
});
const _sfc_main$2 = {
  name: "ScreenSearch",
  props: [
    "term"
  ],
  data() {
    return {
      inputModel: this.term
    };
  },
  watch: {
    term() {
      this.inputModel = this.term;
    }
  },
  computed: {
    className() {
      const c = ["screen-search"];
      if (this.term && this.term.length > 0) {
        c.push("-active");
      }
      return c.join(" ");
    }
  },
  methods: {
    keyUp() {
      this.$router.push("/screens?search=" + this.inputModel);
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: $options.className }, _attrs))} data-v-37370e5e><input type="text"${serverRenderer.exports.ssrRenderAttr("value", $data.inputModel)} placeholder="Search..." data-v-37370e5e></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/screens/Search.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ScreenSearch = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-37370e5e"]]);
const Search = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ScreenSearch
});
const _sfc_main$1 = {
  name: "ScreensPage",
  components: {
    Tabs: __nuxt_component_0$3,
    ScreenList,
    ScreensOverlay: __nuxt_component_1,
    ScreenSearch
  },
  props: [
    "screenSize"
  ],
  beforeMount() {
    this.updateTitle();
  },
  data() {
    console.log("ballss", this.$route.params);
    const screenData = ScreenData;
    const flowSlugs = {};
    let flow, slug;
    for (let i = 0; i < screenData.length; i++) {
      flow = screenData[i].flow;
      if (flow) {
        slug = this.slugify(flow);
        screenData[i].flowSlug = slug;
        flowSlugs[slug] = flow;
      }
      if (screenData[i].page) {
        screenData[i].page = parseInt(screenData[i].page);
      }
    }
    const actives = this.getActiveFromRoute(screenData);
    return {
      activeScreenData: actives.activeScreenData,
      searchTerm: actives.searchTerm,
      screenData,
      activeScreenId: actives.activeScreenId,
      activeFlowId: actives.activeFlowId,
      flowSlugs
    };
  },
  watch: {
    $route() {
      this.activeFlowId = this.$route.params.flowId || "all";
      this.activeScreenId = this.$route.params.screenId;
      this.searchTerm = this.$route.query.search;
      if (this.activeScreenId) {
        for (let i = 0; i < this.screenData.length; i++) {
          if (this.screenData[i].id == this.activeScreenId) {
            this.activeScreenData = this.screenData[i];
            break;
          }
        }
      } else {
        this.activeScreenData = null;
      }
      this.updateTitle();
    }
  },
  computed: {
    cleanActiveFlowId() {
      let result = this.activeFlowId;
      if (result == "all" && this.searchTerm && this.searchTerm.length > 0) {
        result = null;
      }
      return result;
    },
    tabOptions() {
      const result = {
        all: {
          label: "All",
          to: "/screens"
        }
      };
      let item;
      for (let i = 0; i < this.screenData.length; i++) {
        item = this.screenData[i];
        if (item.flow) {
          if (!result[item.flowSlug]) {
            result[item.flowSlug] = {
              label: item.flow,
              to: "/screens/flow/" + item.flowSlug
            };
          }
        }
      }
      return result;
    },
    visibleScreens() {
      let result = null;
      let ids = [];
      if (this.searchTerm) {
        result = [];
        const lowerSearchTerm = this.searchTerm.toLowerCase();
        let item, k;
        for (let i = 0; i < this.screenData.length; i++) {
          item = this.screenData[i];
          if (item.title && item.title.toLowerCase().indexOf(lowerSearchTerm) !== -1) {
            ids.push(item.id);
            result.push(item);
          } else if (item.description && item.description.toLowerCase().indexOf(lowerSearchTerm) !== -1) {
            ids.push(item.id);
            result.push(item);
          } else if (item.text && item.text.length > 0) {
            for (k = 0; k < item.text.length; k++) {
              if (item.text[k].toLowerCase().indexOf(lowerSearchTerm) !== -1) {
                ids.push(item.id);
                result.push(item);
                break;
              }
            }
          }
        }
      } else if (this.activeFlowId == "all") {
        result = this.screenData;
      } else {
        result = [];
        for (let i = 0; i < this.screenData.length; i++) {
          if (this.screenData[i].flowSlug == this.activeFlowId) {
            ids.push(this.screenData[i].id);
            result.push(this.screenData[i]);
          }
        }
      }
      return result;
    },
    sortedScreens() {
      const result = this.visibleScreens.slice();
      return result.sort((a, b) => {
        if (a.flow == b.flow) {
          if (a.page < b.page)
            return -1;
          if (a.page > b.page)
            return 1;
          return 0;
        } else {
          if (a.flow < b.flow)
            return -1;
          if (a.flow > b.flow)
            return 1;
          return 0;
        }
      });
    },
    noResultsMessage() {
      return 'No results for "' + this.searchTerm + '".';
    }
  },
  methods: {
    getActiveFromRoute(screenData) {
      const result = {
        activeFlowId: "all",
        activeScreenId: null,
        activeScreenData: null,
        searchTerm: null
      };
      const slugs = this.$route.params.slug;
      if (slugs && slugs.length > 0) {
        if (slugs[0] == "flow") {
          result.activeFlowId = slugs[1];
          if (slugs.length == 3) {
            result.activeScreenId = slugs[2];
            result.activeScreenData = this.getScreenDataFromScreenId(result.activeScreenId, screenData);
          }
        } else if (slugs[0] == "screen") {
          result.activeScreenId = slugs[1];
        } else if (slugs[0] == "search") {
          result.searchTerm = this.$route.query.search;
        }
      }
      return result;
    },
    setActiveFromRoute() {
      const result = this.getActiveFromRoute();
      this.activeFlowId = result.activeFlowId;
      this.activeScreenId = result.activeScreenId;
      this.activeScreenData = result.activeScreenData;
      this.searchTerm = result.searchTerm;
    },
    getScreenDataFromScreenId(value, optionalScreenData) {
      const screenData = optionalScreenData || this.screenData;
      let result;
      for (let i = 0; i < screenData.length; i++) {
        if (screenData[i].id == value) {
          result = screenData[i];
          break;
        }
      }
      return result;
    },
    setActiveFlowId(value) {
      this.activeFlowId = value;
    },
    setActiveScreenId(value) {
      this.activeScreenId = value;
      for (let i = 0; i < this.screenData.length; i++) {
        if (this.screenData[i].id == value) {
          this.activeScreenData = this.screenData[i];
          break;
        }
      }
    },
    setSearchTerm(value) {
      this.searchTerm = value;
      console.log("setSearchTerm", value);
      if (value) {
        this.activeFlowId = null;
      }
    },
    hideOverlay() {
      console.log("hideOverlay");
      this.activeScreenId = null;
      this.activeScreenData = null;
    },
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, "");
      str = str.toLowerCase();
      var from = "\xE0\xE1\xE4\xE2\xE8\xE9\xEB\xEA\xEC\xED\xEF\xEE\xF2\xF3\xF6\xF4\xF9\xFA\xFC\xFB\xF1\xE7\xB7/_,:;";
      var to = "aaaaeeeeiiiioooouuuunc------";
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }
      str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      return str;
    },
    updateTitle() {
      let result = "Screens | Bitcoin UI Kit";
      if (this.activeScreenId && this.activeScreenData) {
        result = this.activeScreenData.title + " screen | Bitcoin UI Kit";
      } else if (this.activeFlowId && this.activeFlowId !== "all") {
        result = this.flowSlugs[this.activeFlowId] + " flow | Bitcoin UI Kit";
      } else if (this.searchTerm && this.searchTerm.length > 0) {
        result = "Screen search | Bitcoin UI Kit";
      }
      document.title = result;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ScreenSearch = vue_cjs_prod.resolveComponent("ScreenSearch");
  const _component_Tabs = __nuxt_component_0$3;
  const _component_ScreenList = vue_cjs_prod.resolveComponent("ScreenList");
  const _component_ScreensOverlay = __nuxt_component_1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "screens-page" }, _attrs))} data-v-1544c87a><div class="tab-bar" data-v-1544c87a>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_ScreenSearch, { term: $data.searchTerm }, null, _parent));
  _push(serverRenderer.exports.ssrRenderComponent(_component_Tabs, {
    items: $options.tabOptions,
    activeId: $options.cleanActiveFlowId
  }, null, _parent));
  _push(`</div>`);
  if ($options.sortedScreens.length > 0) {
    _push(serverRenderer.exports.ssrRenderComponent(_component_ScreenList, {
      screenData: $options.sortedScreens,
      activeScreenId: $data.activeScreenId,
      activeFlowId: $data.activeFlowId,
      searchTerm: $data.searchTerm
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  if ($options.visibleScreens.length == 0) {
    _push(`<p class="no-results" data-v-1544c87a>${serverRenderer.exports.ssrInterpolate($options.noResultsMessage)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(serverRenderer.exports.ssrRenderComponent(_component_ScreensOverlay, {
    screenData: $data.activeScreenData,
    activeFlowId: $data.activeFlowId,
    searchTerm: $data.searchTerm
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/screens/[...slug].vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ____slug_ = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-1544c87a"]]);
const ____slug_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ____slug_
});
const _sfc_main = {
  name: "SiteHeader",
  props: {
    figmaLink: Object,
    links: Array
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "site-header" }, _attrs))} data-v-4630f16a><h1 data-v-4630f16a>Bitcoin UI Kit</h1><p data-v-4630f16a>This design system and UI kit provides a design foundation for prototypes, concept explorations and open-source projects to kickstart the design process. So you can focus on what makes your Bitcoin product\xA0unique.</p><div class="links" data-v-4630f16a><!--[-->`);
  serverRenderer.exports.ssrRenderList($props.links, (item, index2) => {
    _push(`<!--[-->`);
    if (item.url) {
      _push(`<a${serverRenderer.exports.ssrRenderAttr("href", item.url)} data-v-4630f16a>${serverRenderer.exports.ssrInterpolate(item.name)}</a>`);
    } else {
      _push(`<!---->`);
    }
    if (item.to) {
      _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, {
        key: index2,
        to: item.to
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(item.label)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.label), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`<!--]-->`);
  });
  _push(`<!--]--></div><a class="button"${serverRenderer.exports.ssrRenderAttr("href", $props.figmaLink.url)} target="_blank" rel="noreferrer noopener" data-v-4630f16a>${serverRenderer.exports.ssrInterpolate($props.figmaLink.label)} <img${serverRenderer.exports.ssrRenderAttr("src", _imports_0$1)} width="24" height="24" alt="Arrow right" data-v-4630f16a></a></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/site/Header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-4630f16a"]]);
const Header$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Header
});

export { entry$1 as default };
