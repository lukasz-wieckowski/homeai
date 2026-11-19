var nt=Object.defineProperty;var ot=Object.getOwnPropertyDescriptor;var h=(i,a,e,t)=>{for(var s=t>1?void 0:t?ot(a,e):a,n=i.length-1,r;n>=0;n--)(r=i[n])&&(s=(t?r(a,e,s):r(s))||s);return t&&s&&nt(a,e,s),s};var oe=globalThis,ce=oe.ShadowRoot&&(oe.ShadyCSS===void 0||oe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ve=Symbol(),De=new WeakMap,Y=class{constructor(a,e,t){if(this._$cssResult$=!0,t!==ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=a,this.t=e}get styleSheet(){let a=this.o,e=this.t;if(ce&&a===void 0){let t=e!==void 0&&e.length===1;t&&(a=De.get(e)),a===void 0&&((this.o=a=new CSSStyleSheet).replaceSync(this.cssText),t&&De.set(e,a))}return a}toString(){return this.cssText}},Pe=i=>new Y(typeof i=="string"?i:i+"",void 0,ve),z=(i,...a)=>{let e=i.length===1?i[0]:a.reduce((t,s,n)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Y(e,i,ve)},Re=(i,a)=>{if(ce)i.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of a){let t=document.createElement("style"),s=oe.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,i.appendChild(t)}},_e=ce?i=>i:i=>i instanceof CSSStyleSheet?(a=>{let e="";for(let t of a.cssRules)e+=t.cssText;return Pe(e)})(i):i;var{is:ct,defineProperty:lt,getOwnPropertyDescriptor:dt,getOwnPropertyNames:pt,getOwnPropertySymbols:ht,getPrototypeOf:ut}=Object,le=globalThis,Ne=le.trustedTypes,mt=Ne?Ne.emptyScript:"",gt=le.reactiveElementPolyfillSupport,X=(i,a)=>i,Q={toAttribute(i,a){switch(a){case Boolean:i=i?mt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,a){let e=i;switch(a){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},de=(i,a)=>!ct(i,a),Me={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:de};Symbol.metadata??=Symbol("metadata"),le.litPropertyMetadata??=new WeakMap;var T=class extends HTMLElement{static addInitializer(a){this._$Ei(),(this.l??=[]).push(a)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(a,e=Me){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(a)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(a,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(a,t,e);s!==void 0&&lt(this.prototype,a,s)}}static getPropertyDescriptor(a,e,t){let{get:s,set:n}=dt(this.prototype,a)??{get(){return this[e]},set(r){this[e]=r}};return{get:s,set(r){let d=s?.call(this);n?.call(this,r),this.requestUpdate(a,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(a){return this.elementProperties.get(a)??Me}static _$Ei(){if(this.hasOwnProperty(X("elementProperties")))return;let a=ut(this);a.finalize(),a.l!==void 0&&(this.l=[...a.l]),this.elementProperties=new Map(a.elementProperties)}static finalize(){if(this.hasOwnProperty(X("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(X("properties"))){let e=this.properties,t=[...pt(e),...ht(e)];for(let s of t)this.createProperty(s,e[s])}let a=this[Symbol.metadata];if(a!==null){let e=litPropertyMetadata.get(a);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(a){let e=[];if(Array.isArray(a)){let t=new Set(a.flat(1/0).reverse());for(let s of t)e.unshift(_e(s))}else a!==void 0&&e.push(_e(a));return e}static _$Eu(a,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof a=="string"?a.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(a=>this.enableUpdating=a),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(a=>a(this))}addController(a){(this._$EO??=new Set).add(a),this.renderRoot!==void 0&&this.isConnected&&a.hostConnected?.()}removeController(a){this._$EO?.delete(a)}_$E_(){let a=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(a.set(t,this[t]),delete this[t]);a.size>0&&(this._$Ep=a)}createRenderRoot(){let a=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Re(a,this.constructor.elementStyles),a}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(a=>a.hostConnected?.())}enableUpdating(a){}disconnectedCallback(){this._$EO?.forEach(a=>a.hostDisconnected?.())}attributeChangedCallback(a,e,t){this._$AK(a,t)}_$ET(a,e){let t=this.constructor.elementProperties.get(a),s=this.constructor._$Eu(a,t);if(s!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Q).toAttribute(e,t.type);this._$Em=a,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(a,e){let t=this.constructor,s=t._$Eh.get(a);if(s!==void 0&&this._$Em!==s){let n=t.getPropertyOptions(s),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Q;this._$Em=s;let d=r.fromAttribute(e,n.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(a,e,t,s=!1,n){if(a!==void 0){let r=this.constructor;if(s===!1&&(n=this[a]),t??=r.getPropertyOptions(a),!((t.hasChanged??de)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(a)&&!this.hasAttribute(r._$Eu(a,t))))return;this.C(a,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(a,e,{useDefault:t,reflect:s,wrapped:n},r){t&&!(this._$Ej??=new Map).has(a)&&(this._$Ej.set(a,r??e??this[a]),n!==!0||r!==void 0)||(this._$AL.has(a)||(this.hasUpdated||t||(e=void 0),this._$AL.set(a,e)),s===!0&&this._$Em!==a&&(this._$Eq??=new Set).add(a))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let a=this.scheduleUpdate();return a!=null&&await a,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,n]of t){let{wrapped:r}=n,d=this[s];r!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,n,d)}}let a=!1,e=this._$AL;try{a=this.shouldUpdate(e),a?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw a=!1,this._$EM(),t}a&&this._$AE(e)}willUpdate(a){}_$AE(a){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(a)),this.updated(a)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(a){return!0}update(a){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(a){}firstUpdated(a){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[X("elementProperties")]=new Map,T[X("finalized")]=new Map,gt?.({ReactiveElement:T}),(le.reactiveElementVersions??=[]).push("2.1.2");var xe=globalThis,Le=i=>i,pe=xe.trustedTypes,Ue=pe?pe.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ze="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,Fe="?"+W,vt=`<${Fe}>`,M=document,ee=()=>M.createComment(""),te=i=>i===null||typeof i!="object"&&typeof i!="function",Se=Array.isArray,_t=i=>Se(i)||typeof i?.[Symbol.iterator]=="function",fe=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Be=/>/g,R=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,He=/"/g,Ge=/^(?:script|style|textarea|title)$/i,Ee=i=>(a,...e)=>({_$litType$:i,strings:a,values:e}),l=Ee(1),Ht=Ee(2),Kt=Ee(3),L=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ke=new WeakMap,N=M.createTreeWalker(M,129);function Je(i,a){if(!Se(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(a):a}var ft=(i,a)=>{let e=i.length-1,t=[],s,n=a===2?"<svg>":a===3?"<math>":"",r=I;for(let d=0;d<e;d++){let o=i[d],u,v,g=-1,f=0;for(;f<o.length&&(r.lastIndex=f,v=r.exec(o),v!==null);)f=r.lastIndex,r===I?v[1]==="!--"?r=qe:v[1]!==void 0?r=Be:v[2]!==void 0?(Ge.test(v[2])&&(s=RegExp("</"+v[2],"g")),r=R):v[3]!==void 0&&(r=R):r===R?v[0]===">"?(r=s??I,g=-1):v[1]===void 0?g=-2:(g=r.lastIndex-v[2].length,u=v[1],r=v[3]===void 0?R:v[3]==='"'?He:Ve):r===He||r===Ve?r=R:r===qe||r===Be?r=I:(r=R,s=void 0);let E=r===R&&i[d+1].startsWith("/>")?" ":"";n+=r===I?o+vt:g>=0?(t.push(u),o.slice(0,g)+Ze+o.slice(g)+W+E):o+W+(g===-2?d:E)}return[Je(i,n+(i[e]||"<?>")+(a===2?"</svg>":a===3?"</math>":"")),t]},ae=class i{constructor({strings:a,_$litType$:e},t){let s;this.parts=[];let n=0,r=0,d=a.length-1,o=this.parts,[u,v]=ft(a,e);if(this.el=i.createElement(u,t),N.currentNode=this.el.content,e===2||e===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=N.nextNode())!==null&&o.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith(Ze)){let f=v[r++],E=s.getAttribute(g).split(W),P=/([.?@])?(.*)/.exec(f);o.push({type:1,index:n,name:P[2],strings:E,ctor:P[1]==="."?ye:P[1]==="?"?$e:P[1]==="@"?we:G}),s.removeAttribute(g)}else g.startsWith(W)&&(o.push({type:6,index:n}),s.removeAttribute(g));if(Ge.test(s.tagName)){let g=s.textContent.split(W),f=g.length-1;if(f>0){s.textContent=pe?pe.emptyScript:"";for(let E=0;E<f;E++)s.append(g[E],ee()),N.nextNode(),o.push({type:2,index:++n});s.append(g[f],ee())}}}else if(s.nodeType===8)if(s.data===Fe)o.push({type:2,index:n});else{let g=-1;for(;(g=s.data.indexOf(W,g+1))!==-1;)o.push({type:7,index:n}),g+=W.length-1}n++}}static createElement(a,e){let t=M.createElement("template");return t.innerHTML=a,t}};function F(i,a,e=i,t){if(a===L)return a;let s=t!==void 0?e._$Co?.[t]:e._$Cl,n=te(a)?void 0:a._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(a=F(i,s._$AS(i,a.values),s,t)),a}var be=class{constructor(a,e){this._$AV=[],this._$AN=void 0,this._$AD=a,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(a){let{el:{content:e},parts:t}=this._$AD,s=(a?.creationScope??M).importNode(e,!0);N.currentNode=s;let n=N.nextNode(),r=0,d=0,o=t[0];for(;o!==void 0;){if(r===o.index){let u;o.type===2?u=new se(n,n.nextSibling,this,a):o.type===1?u=new o.ctor(n,o.name,o.strings,this,a):o.type===6&&(u=new ke(n,this,a)),this._$AV.push(u),o=t[++d]}r!==o?.index&&(n=N.nextNode(),r++)}return N.currentNode=M,s}p(a){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(a,t,e),e+=t.strings.length-2):t._$AI(a[e])),e++}},se=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(a,e,t,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=a,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let a=this._$AA.parentNode,e=this._$AM;return e!==void 0&&a?.nodeType===11&&(a=e.parentNode),a}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(a,e=this){a=F(this,a,e),te(a)?a===p||a==null||a===""?(this._$AH!==p&&this._$AR(),this._$AH=p):a!==this._$AH&&a!==L&&this._(a):a._$litType$!==void 0?this.$(a):a.nodeType!==void 0?this.T(a):_t(a)?this.k(a):this._(a)}O(a){return this._$AA.parentNode.insertBefore(a,this._$AB)}T(a){this._$AH!==a&&(this._$AR(),this._$AH=this.O(a))}_(a){this._$AH!==p&&te(this._$AH)?this._$AA.nextSibling.data=a:this.T(M.createTextNode(a)),this._$AH=a}$(a){let{values:e,_$litType$:t}=a,s=typeof t=="number"?this._$AC(a):(t.el===void 0&&(t.el=ae.createElement(Je(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new be(s,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(a){let e=Ke.get(a.strings);return e===void 0&&Ke.set(a.strings,e=new ae(a)),e}k(a){Se(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let n of a)s===e.length?e.push(t=new i(this.O(ee()),this.O(ee()),this,this.options)):t=e[s],t._$AI(n),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(a=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);a!==this._$AB;){let t=Le(a).nextSibling;Le(a).remove(),a=t}}setConnected(a){this._$AM===void 0&&(this._$Cv=a,this._$AP?.(a))}},G=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(a,e,t,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=a,this.name=e,this._$AM=s,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(a,e=this,t,s){let n=this.strings,r=!1;if(n===void 0)a=F(this,a,e,0),r=!te(a)||a!==this._$AH&&a!==L,r&&(this._$AH=a);else{let d=a,o,u;for(a=n[0],o=0;o<n.length-1;o++)u=F(this,d[t+o],e,o),u===L&&(u=this._$AH[o]),r||=!te(u)||u!==this._$AH[o],u===p?a=p:a!==p&&(a+=(u??"")+n[o+1]),this._$AH[o]=u}r&&!s&&this.j(a)}j(a){a===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,a??"")}},ye=class extends G{constructor(){super(...arguments),this.type=3}j(a){this.element[this.name]=a===p?void 0:a}},$e=class extends G{constructor(){super(...arguments),this.type=4}j(a){this.element.toggleAttribute(this.name,!!a&&a!==p)}},we=class extends G{constructor(a,e,t,s,n){super(a,e,t,s,n),this.type=5}_$AI(a,e=this){if((a=F(this,a,e,0)??p)===L)return;let t=this._$AH,s=a===p&&t!==p||a.capture!==t.capture||a.once!==t.once||a.passive!==t.passive,n=a!==p&&(t===p||s);s&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,a),this._$AH=a}handleEvent(a){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,a):this._$AH.handleEvent(a)}},ke=class{constructor(a,e,t){this.element=a,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(a){F(this,a)}};var bt=xe.litHtmlPolyfillSupport;bt?.(ae,se),(xe.litHtmlVersions??=[]).push("3.3.3");var Ye=(i,a,e)=>{let t=e?.renderBefore??a,s=t._$litPart$;if(s===void 0){let n=e?.renderBefore??null;t._$litPart$=s=new se(a.insertBefore(ee(),n),n,void 0,e??{})}return s._$AI(i),s};var ze=globalThis,b=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let a=super.createRenderRoot();return this.renderOptions.renderBefore??=a.firstChild,a}update(a){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(a),this._$Do=Ye(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};b._$litElement$=!0,b.finalized=!0,ze.litElementHydrateSupport?.({LitElement:b});var yt=ze.litElementPolyfillSupport;yt?.({LitElement:b});(ze.litElementVersions??=[]).push("4.2.2");var $t={attribute:!0,type:String,converter:Q,reflect:!1,hasChanged:de},wt=(i=$t,a,e)=>{let{kind:t,metadata:s}=e,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),t==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),t==="accessor"){let{name:r}=e;return{set(d){let o=a.get.call(this);a.set.call(this,d),this.requestUpdate(r,o,i,!0,d)},init(d){return d!==void 0&&this.C(r,void 0,i,d),d}}}if(t==="setter"){let{name:r}=e;return function(d){let o=this[r];a.call(this,d),this.requestUpdate(r,o,i,!0,d)}}throw Error("Unsupported decorator location: "+t)};function _(i){return(a,e)=>typeof e=="object"?wt(i,a,e):((t,s,n)=>{let r=s.hasOwnProperty(n);return s.constructor.createProperty(n,t),r?Object.getOwnPropertyDescriptor(s,n):void 0})(i,a,e)}function m(i){return _({...i,state:!0,attribute:!1})}var U=(i,a,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof a!="object"&&Object.defineProperty(i,a,e),e);function Ae(i,a){return(e,t,s)=>{let n=r=>r.renderRoot?.querySelector(i)??null;if(a){let{get:r,set:d}=typeof t=="object"?e:s??(()=>{let o=Symbol();return{get(){return this[o]},set(u){this[o]=u}}})();return U(e,t,{get(){let o=r.call(this);return o===void 0&&(o=n(this),(o!==null||this.hasUpdated)&&d.call(this,o)),o}})}return U(e,t,{get(){return n(this)}})}}function y(i){return a=>{customElements.get(i)||customElements.define(i,a)}}var Xe={en:{plan_what:"What",plan_do:"What should happen",plan_pick:"Choose\u2026",plan_name_optional:"Name (optional)",plan_custom:"Custom action",plan_custom_hint:"Made in an automation or by an administrator; only an administrator can change it.",plan_advanced:"Advanced",plan_time:"Time",plan_moment:"Moment",plan_offset:"Shift (min)",plan_day:"Day",verb_activate:"Turn on the scene",verb_run:"Run",verb_on:"Turn on",verb_off:"Turn off",verb_brightness:"Brightness",verb_open:"Open",verb_close:"Close",verb_position:"Position",verb_temperature:"Temperature",verb_stop:"Stop",verb_start:"Start cleaning",verb_dock:"Back to the dock",verb_press:"Press",type_scene:"Scenes",type_script:"Scripts",type_light:"Lights",type_switch:"Plugs and switches",type_fan:"Fans and purifiers",type_input_boolean:"Helpers",type_cover:"Blinds and gates",type_climate:"Heating and cooling",type_media_player:"Speakers and TVs",type_vacuum:"Vacuums",type_button:"Buttons",type_input_button:"Helper buttons",pages:"Pages",page_prev:"Previous",page_next:"Next",of:"of",waiting_approval:"Waiting for your approval",needs_attention:"Needs attention",for_info:"For your information",decided:"Recent decisions",acked_by:"Acknowledged by",today:"Today",tomorrow:"Tomorrow",plan_skip_once:"Skip this time",plan_edit_entry:"Edit the entry",plan_new:"New plan entry",plan_change:"Plan entry",presence_new:"New exception",presence_change:"Exception",watch_stop:"Stop watching",days_of:"of",days_word:"days",close:"Close",section:"Section",entry_off:"off",from_source:"from",status_approved:"approved",status_denied:"denied",status_expired:"expired",status_cancelled:"cancelled",status_withdrawn:"withdrawn",situations:"Situations",approvals:"Approvals",plan:"Plan",nothing_open:"Nothing needs attention.",ack:"Got it",handle:"I'll handle it",snooze:"Snooze",dismiss:"Not a problem",severity:"Severity",who:"Who",repairing:"HomeAI is fixing it",approve:"Approve",deny:"Deny",no_approvals:"No requests waiting.",expires:"expires",no_plan:"The plan is empty.",remove:"Remove",resolved:"Recently resolved",since:"since",reason:"Why",steps:"Steps",rule_entities:"Entities",rule_enabled:"Enabled",save:"Save",cancel:"Cancel",edit:"Edit",chat:"Chat",presence:"Presence",send:"Send",chat_new:"New conversation",chat_placeholder:"Ask HomeAI\u2026",chat_hint:"Ask about the house, what happened, or what HomeAI should do. HomeAI acts only within its policy.",remove_confirm:"Remove it?",plan_add:"Add to plan",plan_next:"Coming up",plan_entries:"Entries",plan_skip:"Skip",plan_type:"Type",plan_action:"Action",plan_reminder:"Reminder",plan_reminder_text:"Reminder",plan_to:"Who to remind",plan_to_home_or_all:"Who is home, else everyone",plan_to_home:"Who is home",plan_to_all:"Everyone",plan_to_admins:"Administrators",plan_service:"Action",plan_data:"Data (JSON)",plan_when:"When",plan_once:"Once",plan_daily:"Every day",plan_weekly:"On days",plan_sun:"Around the sun",plan_sunrise:"Sunrise",plan_sunset:"Sunset",plan_dawn:"Dawn",plan_dusk:"Dusk",plan_solar_noon:"Solar noon",plan_skip_away:"Skip while everyone is away",plan_error:"Not saved",presence_add:"Add exception",presence_none:"No trips, guests or other exceptions planned.",presence_hint:"Trips, guests and days at home change how HomeAI watches the house and who it tells.",presence_kind:"What",presence_person:"Who",presence_everyone:"Whole household",presence_from:"From",presence_to:"Until (inclusive)",presence_note:"Note",presence_away:"Away",presence_vacation:"Vacation",presence_guests:"Guests",presence_home_office:"Working from home",presence_sick:"Sick at home",watching:"Watching for you",until:"until",show_all:"Show all",show_less:"Show less"},pl:{plan_what:"Co",plan_do:"Co ma si\u0119 sta\u0107",plan_pick:"Wybierz\u2026",plan_name_optional:"Nazwa (opcjonalnie)",plan_custom:"Akcja niestandardowa",plan_custom_hint:"U\u0142o\u017Cona w automatyzacji albo przez administratora; zmieni\u0107 j\u0105 mo\u017Ce tylko administrator.",plan_advanced:"Zaawansowane",plan_time:"Godzina",plan_moment:"Moment",plan_offset:"Przesuni\u0119cie (min)",plan_day:"Dzie\u0144",verb_activate:"W\u0142\u0105cz scen\u0119",verb_run:"Uruchom",verb_on:"W\u0142\u0105cz",verb_off:"Wy\u0142\u0105cz",verb_brightness:"Jasno\u015B\u0107",verb_open:"Otw\xF3rz",verb_close:"Zamknij",verb_position:"Pozycja",verb_temperature:"Temperatura",verb_stop:"Zatrzymaj",verb_start:"Odkurzaj",verb_dock:"Wr\xF3\u0107 do stacji",verb_press:"Naci\u015Bnij",type_scene:"Sceny",type_script:"Skrypty",type_light:"\u015Awiat\u0142a",type_switch:"Gniazdka i prze\u0142\u0105czniki",type_fan:"Wentylatory i oczyszczacze",type_input_boolean:"Prze\u0142\u0105czniki pomocnicze",type_cover:"Rolety i bramy",type_climate:"Ogrzewanie i klimatyzacja",type_media_player:"G\u0142o\u015Bniki i telewizory",type_vacuum:"Odkurzacze",type_button:"Przyciski",type_input_button:"Przyciski pomocnicze",pages:"Strony",page_prev:"Poprzednie",page_next:"Nast\u0119pne",of:"z",waiting_approval:"Czeka na Twoj\u0105 zgod\u0119",needs_attention:"Wymaga uwagi",for_info:"Do wiadomo\u015Bci",decided:"Ostatnie decyzje",acked_by:"Potwierdzone przez",today:"Dzi\u015B",tomorrow:"Jutro",plan_skip_once:"Pomi\u0144 tym razem",plan_edit_entry:"Edytuj wpis",plan_new:"Nowy wpis planu",plan_change:"Wpis planu",presence_new:"Nowy wyj\u0105tek",presence_change:"Wyj\u0105tek",watch_stop:"Przesta\u0144 pilnowa\u0107",days_of:"z",days_word:"dni",close:"Zamknij",section:"Sekcja",entry_off:"wy\u0142\u0105czony",from_source:"z",status_approved:"zgoda",status_denied:"odmowa",status_expired:"wygas\u0142a",status_cancelled:"anulowana",status_withdrawn:"wycofana",situations:"Sprawy",approvals:"Zgody",plan:"Plan",nothing_open:"Nic nie wymaga uwagi.",ack:"Wiem",handle:"Zajm\u0119 si\u0119",snooze:"Wycisz",dismiss:"To nie problem",severity:"Waga",who:"Kto",repairing:"HomeAI naprawia",approve:"Zgoda",deny:"Odmowa",no_approvals:"Brak oczekuj\u0105cych pr\xF3\u015Bb.",expires:"wygasa",no_plan:"Plan jest pusty.",remove:"Usu\u0144",resolved:"Ostatnio rozwi\u0105zane",since:"od",reason:"Dlaczego",steps:"Kroki",rule_entities:"Encje",rule_enabled:"W\u0142\u0105czona",save:"Zapisz",cancel:"Anuluj",edit:"Edytuj",chat:"Rozmowa",presence:"Obecno\u015B\u0107",send:"Wy\u015Blij",chat_new:"Nowa rozmowa",chat_placeholder:"Zapytaj HomeAI\u2026",chat_hint:"Zapytaj o dom, o to, co si\u0119 sta\u0142o, albo co HomeAI ma zrobi\u0107. HomeAI dzia\u0142a tylko w granicach swojej polityki.",remove_confirm:"Usun\u0105\u0107?",plan_add:"Dodaj do planu",plan_next:"Wkr\xF3tce",plan_entries:"Wpisy",plan_skip:"Pomi\u0144",plan_type:"Rodzaj",plan_action:"Akcja",plan_reminder:"Przypomnienie",plan_reminder_text:"Przypomnienie",plan_to:"Komu przypomnie\u0107",plan_to_home_or_all:"Kto jest w domu, inaczej wszystkim",plan_to_home:"Kto jest w domu",plan_to_all:"Wszystkim",plan_to_admins:"Administratorom",plan_service:"Akcja",plan_data:"Dane (JSON)",plan_when:"Kiedy",plan_once:"Raz",plan_daily:"Codziennie",plan_weekly:"W dni",plan_sun:"Wed\u0142ug s\u0142o\u0144ca",plan_sunrise:"Wsch\xF3d s\u0142o\u0144ca",plan_sunset:"Zach\xF3d s\u0142o\u0144ca",plan_dawn:"\u015Awit",plan_dusk:"Zmierzch",plan_solar_noon:"Po\u0142udnie s\u0142oneczne",plan_skip_away:"Pomijaj, gdy nikogo nie ma",plan_error:"Nie zapisano",presence_add:"Dodaj wyj\u0105tek",presence_none:"Brak zaplanowanych wyjazd\xF3w, go\u015Bci i innych wyj\u0105tk\xF3w.",presence_hint:"Wyjazdy, go\u015Bcie i dni w domu zmieniaj\u0105 to, jak HomeAI pilnuje domu i kogo powiadamia.",presence_kind:"Co",presence_person:"Kto",presence_everyone:"Ca\u0142y dom",presence_from:"Od",presence_to:"Do (w\u0142\u0105cznie)",presence_note:"Notatka",presence_away:"Poza domem",presence_vacation:"Urlop",presence_guests:"Go\u015Bcie",presence_home_office:"Praca z domu",presence_sick:"Choroba w domu",watching:"Pilnuj\u0119 dla ciebie",until:"do",show_all:"Poka\u017C wszystko",show_less:"Poka\u017C mniej"}};function c(i,a){let e=(i||"en").split("-")[0];return Xe[e]?.[a]??Xe.en[a]??a}function q(i,a){let e={},t=new Intl.DateTimeFormat("en-CA",{timeZone:a||void 0,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});for(let s of t.formatToParts(new Date(i)))e[s.type]=s.value;return{date:`${e.year}-${e.month}-${e.day}`,hour:Number(e.hour),minute:Number(e.minute)}}function B(i,a){return i?new Date(i).toLocaleString(a,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):""}function C(i,a){return q(i,a).date}function he(i,a,e){let t=C(i,e);return t===C(Date.now(),e)?c(a,"today"):t===C(Date.now()+864e5,e)?c(a,"tomorrow"):new Date(i).toLocaleDateString(a,{weekday:"long",day:"numeric",month:"long",timeZone:e||void 0})}function ie(i,a,e){return new Date(i).toLocaleTimeString(a,{hour:"2-digit",minute:"2-digit",timeZone:e||void 0})}function V(i,a,e){return i?C(i,e)===C(Date.now(),e)?ie(i,a,e):new Date(i).toLocaleDateString(a,{day:"numeric",month:"short",timeZone:e||void 0}):""}var kt=z`
  :host {
    /* colours */
    --_text: var(--homeai-text-color, var(--primary-text-color));
    --_secondary-text: var(--homeai-secondary-text-color, var(--secondary-text-color));
    --_accent: var(--homeai-accent-color, var(--primary-color));
    --_on-accent: var(--homeai-on-accent-color, var(--text-primary-color));
    --_background: var(--homeai-background, var(--primary-background-color));
    --_surface: var(--homeai-surface-color, var(--secondary-background-color));
    --_divider: var(--homeai-divider-color, var(--divider-color));
    --_error: var(--homeai-error-color, var(--error-color));
    --_header-background: var(--homeai-header-background, color-mix(in srgb, var(--app-header-background-color) 72%, transparent));
    --_header-text: var(--homeai-header-text-color, var(--app-header-text-color));
    --_severity-0: var(--homeai-severity-0-color, var(--secondary-text-color));
    --_severity-1: var(--homeai-severity-1-color, var(--success-color));
    --_severity-2: var(--homeai-severity-2-color, var(--info-color));
    --_severity-3: var(--homeai-severity-3-color, var(--warning-color));
    --_severity-4: var(--homeai-severity-4-color, var(--error-color));
    --_severity-text: var(--homeai-severity-text-color, var(--text-primary-color));

    /* cards: the same variables Home Assistant's own cards read */
    --_card-background: var(--homeai-card-background, var(--ha-card-background, var(--card-background-color)));
    --_card-border-color: var(--homeai-card-border-color, var(--ha-card-border-color, var(--divider-color)));
    --_card-border-width: var(--homeai-card-border-width, var(--ha-card-border-width, var(--ha-border-width-sm)));
    --_card-radius: var(--homeai-card-border-radius, var(--ha-card-border-radius, var(--ha-border-radius-lg)));
    --_card-shadow: var(--homeai-card-box-shadow, var(--ha-card-box-shadow, none));
    --_card-padding: var(--homeai-card-padding, var(--ha-space-4));
    --_card-spacing: var(--homeai-card-spacing, var(--ha-space-3));

    /* controls */
    --_button-radius: var(--homeai-button-border-radius, var(--ha-border-radius-pill));
    --_button-padding: var(--homeai-button-padding, var(--ha-space-2) var(--ha-space-4));
    --_button-border-color: var(--homeai-button-border-color, var(--_glass-border));
    --_button-background: var(--homeai-button-background, color-mix(in srgb, var(--_text) 5%, transparent));
    --_button-hover-background: var(--homeai-button-hover-background, color-mix(in srgb, var(--_accent) 12%, transparent));
    --_button-prominent-background: var(--homeai-button-prominent-background, var(--_accent));
    --_button-prominent-shadow: var(--homeai-button-prominent-box-shadow, var(--ha-box-shadow-s));
    --_input-background: var(--homeai-input-background, var(--input-fill-color));
    --_input-text: var(--homeai-input-text-color, var(--input-ink-color, var(--_text)));
    --_input-border-color: var(--homeai-input-border-color, var(--input-outlined-idle-border-color, var(--_divider)));
    --_input-radius: var(--homeai-input-border-radius, var(--ha-border-radius-sm));
    --_input-padding: var(--homeai-input-padding, var(--ha-space-2));
    --_badge-radius: var(--homeai-badge-border-radius, var(--ha-border-radius-pill));
    --_border-width: var(--ha-border-width-sm);
    --_indicator-width: var(--ha-border-width-md);

    /* chat */
    --_message-radius: var(--homeai-message-border-radius, var(--ha-border-radius-xl));
    --_user-message-background: var(--homeai-user-message-background, var(--_accent));
    --_user-message-text: var(--homeai-user-message-text-color, var(--_on-accent));
    --_assistant-message-background: var(--homeai-assistant-message-background, var(--_surface));
    --_assistant-message-text: var(--homeai-assistant-message-text-color, var(--_text));

    /* Liquid Glass: the navigation layer (top bar, tabs, buttons, the chat composer, sheets) is a translucent
       material floating above the content; the content itself (cards, lists, text) stays solid */
    --_glass-tint: var(--homeai-glass-tint, var(--ha-card-background, var(--card-background-color)));
    --_glass-background: var(--homeai-glass-background, color-mix(in srgb, var(--_glass-tint) 72%, transparent));
    --_glass-filter: var(--homeai-glass-filter, blur(var(--ha-space-5)) saturate(1.8));
    --_glass-border: var(--homeai-glass-border-color, color-mix(in srgb, var(--_text) 12%, transparent));
    --_glass-highlight: var(--homeai-glass-highlight-color, color-mix(in srgb, var(--_text) 6%, transparent));
    --_glass-shadow: var(--homeai-glass-box-shadow, var(--ha-box-shadow-m));
    --_glass-depth: inset 0 var(--_border-width) 0 var(--_glass-highlight), var(--_glass-shadow);
    --_segment-radius: var(--homeai-segmented-border-radius, var(--ha-border-radius-3xl));
    --_sheet-radius: var(--homeai-sheet-border-radius, var(--ha-border-radius-3xl));
    --_sheet-shadow: var(--homeai-sheet-box-shadow, var(--ha-box-shadow-l));
    --_sheet-depth: inset 0 var(--_border-width) 0 var(--_glass-highlight), var(--_sheet-shadow);
    --_motion: var(--homeai-motion-duration, var(--ha-animation-duration-fast));

    /* lists: one surface per group, rows separated by hairlines; a row opens to show its details and actions */
    --_row-x: var(--homeai-row-padding-x, var(--ha-space-4));
    --_row-y: var(--homeai-row-padding-y, var(--ha-space-3));
    --_row-hover-background: var(--homeai-row-hover-background, color-mix(in srgb, var(--_text) 4%, transparent));
    --_dot-size: var(--homeai-dot-size, 0.625em);
    --_row-indent: calc(var(--_row-x) + var(--_dot-size) + var(--_space-l));
    --_section-spacing: var(--homeai-section-spacing, var(--ha-space-6, var(--ha-space-5)));
    --_reading-width: var(--homeai-reading-width, 48em);
    --_scrim: var(--homeai-scrim-color, color-mix(in srgb, var(--primary-text-color) 32%, transparent));
    --_safe-bottom: var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0));
    --_sheet-foot-padding: calc(var(--_space-l) + var(--_safe-bottom));

    /* typography */
    --_font-family: var(--homeai-font-family, var(--ha-font-family-body));
    --_code-font-family: var(--homeai-code-font-family, var(--ha-font-family-code));
    --_font-size: var(--homeai-font-size, var(--ha-font-size-m));
    --_secondary-font-size: var(--homeai-secondary-font-size, var(--ha-font-size-s));
    --_title-font-size: var(--homeai-title-font-size, var(--ha-font-size-l));
    --_title-font-weight: var(--homeai-title-font-weight, var(--ha-font-weight-medium));
    --_header-font-size: var(--homeai-header-font-size, var(--ha-font-size-xl));
    --_header-font-weight: var(--homeai-header-font-weight, var(--ha-font-weight-normal));
    --_strong-font-weight: var(--ha-font-weight-bold);
    --_normal-font-weight: var(--ha-font-weight-normal);

    /* spacing: one base step; smaller and larger ones follow it */
    --_space: var(--homeai-spacing, var(--ha-space-2));
    --_space-s: calc(var(--_space) / 2);
    --_space-l: calc(var(--_space) * 2);
    --_content-padding: var(--homeai-content-padding, var(--ha-content-gutter, var(--ha-space-4)));
  }
`,$=[kt,z`
    :host { display: block; color: var(--_text); font-family: var(--_font-family); font-size: var(--_font-size); }
    .card { background: var(--_card-background); border-radius: var(--_card-radius); box-shadow: var(--_card-shadow);
      border: var(--_card-border-width) solid var(--_card-border-color); padding: var(--_card-padding);
      margin-bottom: var(--_card-spacing); color: var(--_text); }
    .row { display: flex; align-items: center; gap: var(--_space); flex-wrap: wrap; }
    .grow { flex: 1 1 auto; min-width: 0; }
    .muted { color: var(--_secondary-text); font-size: var(--_secondary-font-size); }
    .error { color: var(--_error); }
    .title { font-weight: var(--_title-font-weight); font-size: var(--_title-font-size); }
    .title.spaced { margin-bottom: var(--_space); }
    .pre-line { white-space: pre-line; }
    .w-xs { width: 5em; } .w-s { width: 7em; } .w-m { width: 9em; }
    .tall { min-height: 20em; }
    p { margin: var(--_space) 0; }
    b, strong { font-weight: var(--_strong-font-weight); }

    /* sections: a heading with its count and its one action, then one surface */
    .section { margin-bottom: var(--_section-spacing); }
    .section-head { display: flex; align-items: center; gap: var(--_space); min-height: 2.75em;
      margin: 0 0 var(--_space); padding: 0 var(--_space-s); }
    .heading { flex: 1 1 auto; min-width: 0; margin: 0; font-size: var(--_title-font-size);
      font-weight: var(--_title-font-weight); }
    .count { color: var(--_secondary-text); font-weight: var(--_normal-font-weight); }
    .hint { color: var(--_secondary-text); font-size: var(--_secondary-font-size); margin: 0 0 var(--_space);
      padding: 0 var(--_space-s); }
    details.section > summary { list-style: none; cursor: pointer; }
    details.section > summary::-webkit-details-marker { display: none; }
    .chevron { color: var(--_secondary-text); transition: transform var(--_motion); }
    details[open] > summary .chevron { transform: rotate(90deg); }

    /* a list: one surface, rows separated by hairlines */
    .list { list-style: none; margin: 0; padding: 0; overflow: hidden; background: var(--_card-background);
      border: var(--_card-border-width) solid var(--_card-border-color); border-radius: var(--_card-radius);
      box-shadow: var(--_card-shadow); }
    .list > li + li { border-top: var(--_border-width) solid var(--_divider); }
    /* a list inside a card (the Lovelace cards): the card is the surface */
    .card.flush { padding: 0; overflow: hidden; }
    .card-title { padding: var(--_card-padding) var(--_row-x) var(--_space-s); }
    .list.bare { background: transparent; border: none; border-radius: 0; box-shadow: none; }
    .item-main { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
      column-gap: var(--_space-l); width: 100%; box-sizing: border-box; min-height: 3.25em; padding: var(--_row-y) var(--_row-x);
      font: inherit; text-align: start; color: inherit; background: transparent; border: none; border-radius: 0;
      box-shadow: none; cursor: pointer; }
    div.item-main { cursor: default; }
    .item-main.plain { grid-template-columns: minmax(0, 1fr) auto; }
    .item-main.timed { grid-template-columns: 3.5em minmax(0, 1fr) auto; }
    button.item-main:active:not(:disabled) { transform: none; }
    @media (hover: hover) {
      button.item-main:hover:not(:disabled) { background: var(--_row-hover-background); }
    }
    button.item-main:focus-visible { outline-offset: calc(var(--_indicator-width) * -2); }
    .item-text { min-width: 0; }
    .item-main input { width: 100%; }
    .item-title { display: block; overflow-wrap: anywhere; }
    .item-meta { display: block; margin-top: var(--_space-s); color: var(--_secondary-text);
      font-size: var(--_secondary-font-size); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .open .item-meta, .item-meta.wrap { white-space: normal; }
    .item-aside { color: var(--_secondary-text); font-size: var(--_secondary-font-size); white-space: nowrap;
      font-variant-numeric: tabular-nums; }
    .time { font-variant-numeric: tabular-nums; color: var(--_secondary-text); }
    .off { color: var(--_secondary-text); }
    .item-more { padding: 0 var(--_row-x) var(--_row-y) var(--_row-indent); }
    .item-more.flush { padding-left: var(--_row-x); }
    .item-more p, .item-more ol { margin: 0 0 var(--_space); }
    .item-actions { display: flex; flex-wrap: wrap; gap: var(--_space); }
    .item-actions.end { justify-content: flex-end; }
    .day { padding: var(--_space-l) var(--_row-x) var(--_space-s); color: var(--_secondary-text);
      font-size: var(--_secondary-font-size); font-weight: var(--_title-font-weight); }
    .list > li.day + li { border-top: none; }
    .dot { display: inline-block; width: var(--_dot-size); height: var(--_dot-size); border-radius: var(--_badge-radius);
      background: var(--_severity-0); }
    .dot.sev-4 { background: var(--_severity-4); } .dot.sev-3 { background: var(--_severity-3); }
    .dot.sev-2 { background: var(--_severity-2); } .dot.sev-1 { background: var(--_severity-1); }
    /* pages of a long list: previous, where you are, next */
    .pager { display: flex; align-items: center; justify-content: space-between; gap: var(--_space);
      padding: var(--_space) 0 0; }
    .pager-count { color: var(--_secondary-text); font-size: var(--_secondary-font-size); font-variant-numeric: tabular-nums; }
    ul.plain { list-style: none; padding: 0; margin: 0; }
    ul.plain li { padding: var(--_space) 0; border-bottom: var(--_border-width) solid var(--_divider); }
    ul.plain li:last-child { border-bottom: none; }

    /* glass buttons: a translucent capsule; the main action is prominent (filled with the accent) */
    button { font: inherit; border: var(--_border-width) solid var(--_button-border-color);
      background: var(--_button-background); color: var(--_accent); border-radius: var(--_button-radius);
      padding: var(--_button-padding); cursor: pointer; min-height: 2.5em;
      transition: background-color var(--_motion), box-shadow var(--_motion), transform var(--_motion); }
    button.primary { background: var(--_button-prominent-background); color: var(--_on-accent); border-color: transparent;
      box-shadow: var(--_button-prominent-shadow); }
    button.quiet { background: transparent; border-color: transparent; box-shadow: none; }
    button.danger { color: var(--_error); }
    @media (hover: hover) {
      button:hover:not(:disabled):not(.primary):not(.item-main) { background: var(--_button-hover-background); }
    }
    button:active:not(:disabled) { transform: scale(0.97); }
    button:focus-visible { outline: var(--_indicator-width) solid var(--_accent); outline-offset: var(--_indicator-width); }
    button:disabled { opacity: 0.5; cursor: default; box-shadow: none; }
    /* the material: one layer per group of controls, never on content */
    .glass { background: var(--_glass-background); backdrop-filter: var(--_glass-filter);
      -webkit-backdrop-filter: var(--_glass-filter); border: var(--_border-width) solid var(--_glass-border);
      box-shadow: var(--_glass-depth); }
    /* a segmented control: options share one glass capsule, the chosen one is prominent */
    .segmented { display: inline-flex; flex-wrap: wrap; align-items: center; gap: var(--_space-s);
      padding: var(--_space-s); border-radius: var(--_segment-radius); max-width: 100%; box-sizing: border-box; }
    .segmented button { border-color: transparent; background: transparent; color: var(--_text); box-shadow: none; }
    .segmented button.primary { background: var(--_button-prominent-background); color: var(--_on-accent); }
    /* inside a sheet the group is not glass again (no glass on glass), only a quiet capsule */
    .sheet .segmented { background: var(--_button-background); }
    /* toggles that read as words (weekdays): pressed ones are prominent */
    .chips { display: flex; flex-wrap: wrap; gap: var(--_space-s); }
    .chips button { min-width: 3.25em; color: var(--_text); }
    .chips button[aria-pressed="true"] { background: var(--_button-prominent-background); color: var(--_on-accent);
      border-color: transparent; }

    /* a sheet: an editor that floats above the list it changes (a modal dialog; a bottom sheet on a phone) */
    .card.sheet { background: var(--_glass-background); backdrop-filter: var(--_glass-filter);
      -webkit-backdrop-filter: var(--_glass-filter); border-color: var(--_glass-border); border-radius: var(--_sheet-radius);
      box-shadow: var(--_sheet-depth); }
    dialog.sheet { width: 32em; max-width: calc(100% - var(--_space-l) * 2); max-height: 88dvh; box-sizing: border-box;
      margin: auto; padding: 0; color: var(--_text); }
    dialog.sheet[open] { display: flex; flex-direction: column; }
    dialog.sheet::backdrop { background: var(--_scrim); }
    .sheet-head { padding: var(--_space-l) var(--_card-padding) var(--_space); }
    .sheet-head .title { margin: 0; }
    .sheet-body { flex: 1 1 auto; overflow-y: auto; padding: var(--_space) var(--_card-padding); }
    .sheet-foot { display: flex; flex-wrap: wrap; align-items: center; gap: var(--_space);
      padding: var(--_space) var(--_card-padding) var(--_sheet-foot-padding); }
    @media (max-width: 40em) {
      dialog.sheet { width: 100%; max-width: 100%; margin: auto 0 0; border-radius: var(--_sheet-radius) var(--_sheet-radius) 0 0; }
    }
    .fields { display: grid; gap: var(--_space-l); }
    .field { display: grid; gap: var(--_space-s); }
    .field > .label { color: var(--_secondary-text); font-size: var(--_secondary-font-size); }
    .field input:not([type="checkbox"]), .field select, .field textarea { width: 100%; }
    .pair { display: grid; grid-template-columns: repeat(auto-fit, minmax(9em, 1fr)); gap: var(--_space); }
    .check { display: flex; align-items: center; gap: var(--_space); cursor: pointer; }

    .sev { display: inline-block; min-width: 1.6em; text-align: center; border-radius: var(--_badge-radius);
      padding: 0 var(--_space-s); font-size: var(--_secondary-font-size); color: var(--_severity-text);
      background: var(--_severity-0); }
    .sev-4 { background: var(--_severity-4); } .sev-3 { background: var(--_severity-3); }
    .sev-2 { background: var(--_severity-2); } .sev-1 { background: var(--_severity-1); }
    input, select, textarea { font: inherit; color: var(--_input-text); background: var(--_input-background);
      border: var(--_border-width) solid var(--_input-border-color); border-radius: var(--_input-radius);
      padding: var(--_input-padding); box-sizing: border-box; min-height: 2.75em; }
    input[type="checkbox"] { accent-color: var(--_accent); min-height: auto; width: 1.25em; height: 1.25em; }
    input[type="range"] { width: 100%; padding: 0; border: none; background: transparent; accent-color: var(--_accent); }
    textarea { width: 100%; min-height: 6em; font-family: var(--_code-font-family); font-size: var(--_secondary-font-size); }
    .empty { padding: var(--_section-spacing) var(--_card-padding); text-align: center; color: var(--_secondary-text); }
    /* Reduce transparency: the material becomes solid; increase contrast: clear edges; browsers without
       color-mix: solid colours from the theme */
    @media (prefers-reduced-transparency: reduce) {
      :host { --_glass-background: var(--_glass-tint); --_glass-filter: none;
        --_header-background: var(--homeai-header-background, var(--app-header-background-color)); }
    }
    @media (prefers-contrast: more) {
      :host { --_glass-background: var(--_glass-tint); --_glass-filter: none; --_glass-border: var(--_text);
        --_button-border-color: var(--_accent);
        --_header-background: var(--homeai-header-background, var(--app-header-background-color)); }
    }
    @supports not (background: color-mix(in srgb, currentColor 50%, transparent)) {
      :host { --_glass-background: var(--_glass-tint); --_glass-border: var(--_divider); --_glass-highlight: transparent;
        --_button-background: transparent; --_button-hover-background: var(--_surface);
        --_row-hover-background: var(--_surface); --_scrim: transparent;
        --_header-background: var(--homeai-header-background, var(--app-header-background-color)); }
    }
  `],H=["card","title","heading","badge","badge-0","badge-1","badge-2","badge-3","badge-4","button","button-primary","button-quiet","segmented","sheet","composer","input","list","row","row-title","row-meta","day","time","pager","empty","error","log","message","message-user","message-assistant"].join(", ");var Ce=10;function w(i,a,e,t,s=Ce){let n=Math.max(1,Math.ceil(e.length/s)),r=Math.max(0,Math.min(i.pages[a]??0,n-1)),d=r*s,o=v=>{i.pages={...i.pages,[a]:v}},u=n>1?l`<nav part="pager" class="pager" aria-label=${c(t,"pages")}>
        <button part="button button-quiet" class="quiet" ?disabled=${r===0} @click=${()=>o(r-1)}>‹ ${c(t,"page_prev")}</button>
        <span part="time" class="pager-count" aria-live="polite">${d+1}–${Math.min(e.length,d+s)} ${c(t,"of")} ${e.length}</span>
        <button part="button button-quiet" class="quiet" ?disabled=${r===n-1} @click=${()=>o(r+1)}>${c(t,"page_next")} ›</button>
      </nav>`:p;return{items:e.slice(d,d+s),nav:u,offset:d}}var x=class extends b{constructor(){super(...arguments);this.open=[];this.resolved=[];this.pending=[];this.decided=[];this.expanded=new URLSearchParams(location.search).get("situation");this.error="";this.pages={};this.unsubs=[];this.subscribing=!1;this.scrolled=!1}connectedCallback(){super.connectedCallback(),this.subscribe()}disconnectedCallback(){super.disconnectedCallback(),this.unsubs.forEach(e=>e()),this.unsubs=[]}async subscribe(){if(!(!this.hass||this.unsubs.length||this.subscribing)){this.subscribing=!0;try{let e=this.hass.language,t=await this.hass.connection.subscribeMessage(d=>{d.type==="situations"&&d.situations&&(this.open=d.situations)},{type:"homeai/situations/subscribe",language:e}),s=await this.hass.connection.subscribeMessage(d=>this.pending=d.pending,{type:"homeai/approvals/subscribe"});if(!this.isConnected){t(),s();return}this.unsubs=[t,s];let[n,r]=await Promise.all([this.hass.callWS({type:"homeai/situations/list",resolved:100,language:e}),this.hass.callWS({type:"homeai/approvals/list"})]);this.resolved=n.resolved,this.decided=r.recent.filter(d=>d.status!=="pending")}catch(e){this.error=e?.message??String(e)}finally{this.subscribing=!1}}}groups(){let e=[...this.open].sort((t,s)=>s.severity-t.severity||(s.opened_at||s.first_seen).localeCompare(t.opened_at||t.first_seen));return[e.filter(t=>t.severity>=2),e.filter(t=>t.severity<2)]}willUpdate(e){if(!e.has("open")||!this.expanded||this.scrolled)return;let[t,s]=this.groups();for(let[n,r]of[["needs_attention",t],["for_info",s]]){let d=r.findIndex(o=>o.id===this.expanded);d>=0&&(this.pages={...this.pages,[n]:Math.floor(d/Ce)})}}updated(){if(this.scrolled||!this.expanded)return;let e=this.renderRoot.querySelector(`[data-id="${CSS.escape(this.expanded)}"]`);e&&(this.scrolled=!0,e.scrollIntoView({block:"center"}))}async act(e,t){await this.hass.callWS({type:`homeai/situations/${e}`,situation_id:t.id})}async decide(e,t){this.error="";try{await this.hass.callWS({type:`homeai/approvals/${e}`,approval_id:t.id})}catch(s){this.error=s?.message??String(s)}}toggle(e){this.expanded=this.expanded===e?null:e}approval(e){let t=this.hass.language,s=this.hass.config?.time_zone;return l`<li part="row" class="approval">
      <div class="item-main">
        <span class="item-text"><span part="row-title" class="item-title">${e.what}</span>
          <span part="row-meta" class="item-meta">${[e.reason,e.expires?`${c(t,"expires")} ${V(e.expires,t,s)}`:""].filter(Boolean).join(" \xB7 ")}</span></span>
        <span class="item-actions">
          <button part="button" @click=${()=>this.decide("deny",e)}>${c(t,"deny")}</button>
          <button part="button button-primary" class="primary" @click=${()=>this.decide("approve",e)}>${c(t,"approve")}</button>
        </span>
      </div>
    </li>`}situation(e){let t=this.hass.language,s=this.hass.config?.time_zone,n=e.assessment||{},r=this.expanded===e.id,d=["waiting","trying","verifying"].includes(e.repair?.status),o=[e.description,d?c(t,"repairing"):"",e.acked_by?`\u2713 ${e.acked_by}`:""].filter(Boolean).join(" \xB7 ");return l`<li part="row" class=${r?"open":""} data-id=${e.id}>
      <button class="item-main" aria-expanded=${r?"true":"false"} @click=${()=>this.toggle(e.id)}>
        <span part="badge badge-${e.severity}" class="dot sev-${e.severity}" title=${`${c(t,"severity")} ${e.severity}`}></span>
        <span class="item-text"><span part="row-title" class="item-title">${e.title}</span>
          ${o?l`<span part="row-meta" class="item-meta">${o}</span>`:p}</span>
        <span part="time" class="item-aside">${V(e.opened_at||e.first_seen,t,s)}</span>
      </button>
      ${r?l`<div class="item-more">
            ${n.reason?l`<p><span class="muted">${c(t,"reason")}:</span> ${n.reason}</p>`:p}
            ${n.steps?.length?l`<ol>${n.steps.map(u=>l`<li>${u}</li>`)}</ol>`:p}
            ${d?l`<p class="muted">${c(t,"repairing")} (${e.repair.playbook})</p>`:p}
            ${e.acked_by?l`<p class="muted">${c(t,"acked_by")} ${e.acked_by}</p>`:p}
            <p class="muted">${c(t,"since")} ${B(e.opened_at||e.first_seen,t)}</p>
            <div class="item-actions">
              <button part="button button-primary" class="primary" @click=${()=>this.act("handle",e)}>${c(t,"handle")}</button>
              <button part="button" @click=${()=>this.act("ack",e)} ?disabled=${!!e.acked_by}>${c(t,"ack")}</button>
              <button part="button" @click=${()=>this.act("snooze",e)}>${c(t,"snooze")}</button>
              <button part="button button-quiet" class="quiet" @click=${()=>this.act("dismiss",e)}>${c(t,"dismiss")}</button>
            </div>
          </div>`:p}
    </li>`}group(e,t){if(!t.length)return p;let s=w(this,e,t,this.hass.language);return l`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${c(this.hass.language,e)} <span class="count">${t.length}</span></h2></div>
      <ul part="card list" class="list">${s.items.map(n=>this.situation(n))}</ul>
      ${s.nav}
    </section>`}render(){let e=this.hass.language,t=this.hass.config?.time_zone,[s,n]=this.groups(),r=w(this,"pending",this.pending,e),d=w(this,"resolved",this.resolved,e),o=w(this,"decided",this.decided,e);return l`
      ${this.error?l`<div part="card error" class="card error">${this.error}</div>`:p}
      ${this.pending.length?l`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${c(e,"waiting_approval")} <span class="count">${this.pending.length}</span></h2></div>
            <ul part="card list" class="list">${r.items.map(u=>this.approval(u))}</ul>
            ${r.nav}
          </section>`:p}
      ${this.group("needs_attention",s)}
      ${this.group("for_info",n)}
      ${!this.pending.length&&!this.open.length?l`<div part="empty" class="empty">${c(e,"nothing_open")}</div>`:p}
      ${this.resolved.length?l`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${c(e,"resolved")} <span class="count">${this.resolved.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${d.items.map(u=>l`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${u.title}</span></span>
              <span part="time" class="item-aside">${V(u.opened_at||u.first_seen,e,t)}</span></div></li>`)}</ul>
            ${d.nav}
          </details>`:p}
      ${this.decided.length?l`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${c(e,"decided")} <span class="count">${this.decided.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${o.items.map(u=>l`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${u.what}</span>
                <span part="row-meta" class="item-meta">${c(e,`status_${u.status}`).replace(/^status_/,"")}${u.decided_by?` \xB7 ${u.decided_by}`:""}</span></span>
              <span part="time" class="item-aside">${V(u.created,e,t)}</span></div></li>`)}</ul>
            ${o.nav}
          </details>`:p}
    `}};x.styles=[$,z`
      :host { container-type: inline-size; }
      /* a request: its two answers beside it, or under it on a phone */
      .approval .item-main { grid-template-columns: minmax(0, 1fr) auto; }
      @container (max-width: 34em) {
        .approval .item-main { grid-template-columns: minmax(0, 1fr); row-gap: var(--_space); }
        .approval .item-actions { justify-content: flex-end; }
      }
    `],h([_({attribute:!1})],x.prototype,"hass",2),h([m()],x.prototype,"open",2),h([m()],x.prototype,"resolved",2),h([m()],x.prototype,"pending",2),h([m()],x.prototype,"decided",2),h([m()],x.prototype,"expanded",2),h([m()],x.prototype,"error",2),h([m()],x.prototype,"pages",2),x=h([y("homeai-situations")],x);var ue=i=>[{key:"on",service:`${i}.turn_on`},{key:"off",service:`${i}.turn_off`}],K={scene:[{key:"activate",service:"scene.turn_on"}],script:[{key:"run",service:"script.turn_on"}],light:[...ue("light"),{key:"brightness",service:"light.turn_on",field:{name:"brightness_pct",min:1,max:100,step:1,unit:"%",fallback:50}}],switch:ue("switch"),fan:ue("fan"),input_boolean:ue("input_boolean"),cover:[{key:"open",service:"cover.open_cover"},{key:"close",service:"cover.close_cover"},{key:"position",service:"cover.set_cover_position",field:{name:"position",min:0,max:100,step:5,unit:"%",fallback:50}}],climate:[{key:"temperature",service:"climate.set_temperature",field:{name:"temperature",min:5,max:30,step:.5,unit:"\xB0",fallback:21}},{key:"off",service:"climate.turn_off"}],media_player:[{key:"off",service:"media_player.turn_off"},{key:"stop",service:"media_player.media_stop"}],vacuum:[{key:"start",service:"vacuum.start"},{key:"dock",service:"vacuum.return_to_base"}],button:[{key:"press",service:"button.press"}],input_button:[{key:"press",service:"input_button.press"}]};function J(i){return i.split(".",1)[0]}function me(i,a){return String(i.states[a]?.attributes.friendly_name??a)}function xt(i,a){let e=i.entities?.[a],t=e?.area_id??(e?.device_id?i.devices?.[e.device_id]?.area_id:null);return t?i.areas?.[t]?.name??"":""}function Qe(i){let a=new Map;for(let t of Object.keys(i.states)){let s=J(t);if(!(s in K))continue;let n=i.entities?.[t];if(n?.hidden||n?.entity_category)continue;let r=a.get(s)??[];r.push({id:t,name:me(i,t),area:xt(i,t)}),a.set(s,r)}let e=Object.keys(K);return[...a.entries()].sort(([t],[s])=>e.indexOf(t)-e.indexOf(s)).map(([t,s])=>[t,s.sort((n,r)=>n.area.localeCompare(r.area)||n.name.localeCompare(r.name))])}function Ie(i){if(!i||i.entity_ids.length!==1)return null;let a=J(i.entity_ids[0]),e=Object.keys(i.data??{});for(let t of K[a]??[])if(t.service===i.service&&(t.field?e.length===1&&e[0]===t.field.name:e.length===0))return{thing:i.entity_ids[0],verb:t.key,value:t.field?Number(i.data[t.field.name]):null};return null}function re(i,a){return(K[J(i)]??[]).find(e=>e.key===a)}function Te(i,a,e,t,s){let n=re(e,t),r=c(a,`verb_${t}`).toLowerCase(),d=n?.field&&s!==null?` ${s}${n.field.unit}`:"";return`${me(i,e)}: ${r}${d}`}var St=["daily","weekly","once","sun"],Et=["sunset","sunrise","dusk","dawn","solar_noon"],zt=["home_or_all","home","all","admins"];function At(){let i=new Date;return`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`}function Ct(){return{type:"action",title:"",thing:"",verb:"",value:null,custom:!1,service:"",entities:"",data:"",reminder:"",to:"home_or_all",when:{kind:"daily",time:"08:00"},enabled:!0,skip_when_away:!1}}function et(i){let a=Ie(i.action);return{id:i.id,type:i.reminder?"reminder":"action",title:i.title,thing:a?.thing??"",verb:a?.verb??"",value:a?.value??null,custom:!!i.action&&!a,service:i.action?.service??"",entities:(i.action?.entity_ids??[]).join(", "),data:i.action&&Object.keys(i.action.data).length?JSON.stringify(i.action.data):"",reminder:i.reminder??"",to:i.to??"home_or_all",when:{...i.when},enabled:i.enabled,skip_when_away:i.skip_when_away}}function Tt(i,a){let e=Array.from({length:7},(s,n)=>new Date(2024,0,1+n).toLocaleDateString(a,{weekday:"short"})),t=i.days?.length?i.days.map(s=>e[s]).join(", "):"";switch(i.kind){case"once":return`${i.date?new Date(`${i.date}T12:00`).toLocaleDateString(a,{weekday:"short",day:"numeric",month:"long"}):""} ${i.time}`;case"daily":return`${c(a,"plan_daily")} ${i.time}`;case"weekly":return`${t} ${i.time}`;case"sun":{let s=i.offset?` ${i.offset>0?"+":""}${i.offset} min`:"";return`${c(a,`plan_${i.event}`)}${s}${t?` \xB7 ${t}`:""}`}default:return JSON.stringify(i)}}var S=class extends b{constructor(){super(...arguments);this.occurrences=[];this.entries=[];this.watches=[];this.error="";this.pages={};this.expanded=null}connectedCallback(){super.connectedCallback(),this.load()}async load(){let e=await this.hass.callWS({type:"homeai/plan/list",days:31});this.entries=e.entries,this.occurrences=e.occurrences;try{this.watches=(await this.hass.callWS({type:"homeai/watches/list"})).items}catch{this.watches=[]}}async removeWatch(e){await this.hass.callWS({type:"homeai/watches/delete",watch_id:e}),await this.load()}async removeEntry(e){confirm(c(this.hass.language,"remove_confirm"))&&(await this.hass.callWS({type:"homeai/plan/delete",entry_id:e}),this.close(),await this.load())}async skip(e){let t=q(e.at,this.hass.config?.time_zone).date;await this.hass.callService("homeai","plan_skip",{entry_id:e.entry_id,date:t}),this.expanded=null,await this.load()}set(e){this.draft={...this.draft,...e}}setWhen(e){let t={...this.draft.when,...e};e.kind&&(t.kind==="once"&&!t.date&&(t.date=At()),t.kind==="weekly"&&!t.days?.length&&(t.days=[0,1,2,3,4]),t.kind==="sun"&&!t.event&&(t.event="sunset"),t.kind!=="sun"&&!t.time&&(t.time="08:00")),this.set({when:t})}toggleDay(e){let t=this.draft.when.days??[],s=new Set(t.length?t:[0,1,2,3,4,5,6]);s.has(e)?s.delete(e):s.add(e),this.setWhen({days:[...s].sort()})}pickThing(e){let t=(K[J(e)]??[])[0];this.set({thing:e,verb:t?.key??"",value:t?.field?t.field.fallback:null})}pickVerb(e){let t=re(this.draft.thing,e),s=t?.field&&this.draft.value!==null&&this.draft.verb===e;this.set({verb:e,value:t?.field?s?this.draft.value:t.field.fallback:null})}async save(){let e=this.draft,t=this.hass.language,s={kind:e.when.kind};e.when.kind!=="sun"&&(s.time=e.when.time),e.when.kind==="once"&&(s.date=e.when.date),(e.when.kind==="weekly"||e.when.kind==="sun"&&e.when.days?.length)&&(s.days=e.when.days),e.when.kind==="sun"&&(s.event=e.when.event,s.offset=Number(e.when.offset??0));let n=e.title.trim(),r={when:s,enabled:e.enabled,skip_when_away:e.skip_when_away};if(e.type==="reminder"){if(!e.reminder.trim())return this.fail(c(t,"plan_reminder_text"));r.reminder=e.reminder,r.to=e.to,n||=e.reminder.trim().slice(0,60)}else if(e.custom){let d={};try{d=e.data.trim()?JSON.parse(e.data):{}}catch(o){return this.fail(`JSON: ${o}`)}r.action={service:e.service.trim(),entity_ids:e.entities.split(/[\s,]+/).filter(Boolean),data:d}}else{let d=re(e.thing,e.verb);if(!e.thing||!d)return this.fail(c(t,"plan_what"));let o=d.field&&e.value!==null?{[d.field.name]:e.value}:{};r.action={service:d.service,entity_ids:[e.thing],data:o},n||=Te(this.hass,t,e.thing,e.verb,e.value)}r.title=n||c(t,"plan_custom");try{await this.hass.callWS({type:"homeai/plan/save",entry:r,...e.id?{entry_id:e.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(d){this.fail(d?.message??String(d))}}fail(e){this.error=`${c(this.hass.language,"plan_error")}: ${e}`}close(){this.draft=void 0,this.error=""}updated(){let e=this.renderRoot.querySelector("dialog");e&&!e.open&&e.showModal()}actionFields(){let e=this.hass.language,t=this.draft;if(t.custom){let r=t.entities.split(/[\s,]+/).filter(Boolean).map(d=>me(this.hass,d)).join(", ");return l`<div class="field"><span class="label">${c(e,"plan_do")}</span>
          <div><span part="row-title" class="item-title">${c(e,"plan_custom")}</span><span part="row-meta" class="item-meta wrap">${r||"\u2014"}</span></div>
          <p class="hint">${c(e,"plan_custom_hint")}</p></div>
        ${this.hass.user.is_admin?l`<details><summary class="muted">${c(e,"plan_advanced")}</summary><div class="fields">
              ${this.raw(c(e,"plan_service"),t.service,d=>this.set({service:d}))}
              ${this.raw(c(e,"rule_entities"),t.entities,d=>this.set({entities:d}))}
              ${this.raw(c(e,"plan_data"),t.data,d=>this.set({data:d}))}
            </div></details>`:p}`}let s=t.thing?K[J(t.thing)]??[]:[],n=re(t.thing,t.verb);return l`
      <label class="field"><span class="label">${c(e,"plan_what")}</span>
        <select part="input" @change=${r=>this.pickThing(r.target.value)}>
          <option value="" ?selected=${!t.thing} disabled>${c(e,"plan_pick")}</option>
          ${Qe(this.hass).map(([r,d])=>l`<optgroup label=${c(e,`type_${r}`)}>
            ${d.map(o=>l`<option value=${o.id} ?selected=${o.id===t.thing}>${o.name}${o.area&&!o.name.includes(o.area)?` \u2014 ${o.area}`:""}</option>`)}
          </optgroup>`)}
        </select></label>
      ${s.length>1?l`<div class="field"><span class="label">${c(e,"plan_do")}</span>
            <div part="segmented" class="segmented" role="group" aria-label=${c(e,"plan_do")}>
              ${s.map(r=>l`<button part=${r.key===t.verb?"button button-primary":"button"} class=${r.key===t.verb?"primary":""}
                aria-pressed=${r.key===t.verb?"true":"false"} @click=${()=>this.pickVerb(r.key)}>${c(e,`verb_${r.key}`)}</button>`)}
            </div></div>`:s.length?l`<p class="hint">${c(e,`verb_${s[0].key}`)}</p>`:p}
      ${n?.field?l`<label class="field"><span class="label">${c(e,`verb_${n.key}`)}: <b>${t.value??n.field.fallback}${n.field.unit}</b></span>
            <input part="input" type="range" min=${n.field.min} max=${n.field.max} step=${n.field.step} .value=${String(t.value??n.field.fallback)}
              @input=${r=>this.set({value:Number(r.target.value)})} /></label>`:p}`}raw(e,t,s){return l`<label class="field"><span class="label">${e}</span><input part="input" .value=${t} @input=${n=>s(n.target.value)} /></label>`}form(){let e=this.hass.language,t=this.draft,s=t.when,n=Array.from({length:7},(o,u)=>new Date(2024,0,1+u).toLocaleDateString(e,{weekday:"short"})),r=(o,u)=>l`<label class="field"><span class="label">${o}</span>${u}</label>`,d=(o,u,v,g)=>l`<div part="segmented" class="segmented" role="group">${o.map(f=>l`<button part=${f===u?"button button-primary":"button"} class=${f===u?"primary":""}
        aria-pressed=${f===u?"true":"false"} @click=${()=>g(f)}>${v(f)}</button>`)}</div>`;return l`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${c(e,t.id?"plan_change":"plan_new")}</h2></div>
      <div class="sheet-body fields">
        ${t.custom?p:d(["action","reminder"],t.type,o=>c(e,`plan_${o}`),o=>this.set({type:o}))}
        ${t.type==="reminder"?l`${r(c(e,"plan_reminder_text"),l`<input part="input" .value=${t.reminder} @input=${o=>this.set({reminder:o.target.value})} />`)}
            ${r(c(e,"plan_to"),l`<select part="input" @change=${o=>this.set({to:o.target.value})}>
              ${zt.map(o=>l`<option value=${o} ?selected=${o===t.to}>${c(e,`plan_to_${o}`)}</option>`)}</select>`)}`:this.actionFields()}
        <div class="field"><span class="label">${c(e,"plan_when")}</span>
          ${d(St,s.kind,o=>c(e,`plan_${o}`),o=>this.setWhen({kind:o}))}</div>
        <div class="pair">
          ${s.kind==="once"?r(c(e,"plan_day"),l`<input part="input" type="date" .value=${s.date??""} @change=${o=>this.setWhen({date:o.target.value})} />`):p}
          ${s.kind==="sun"?l`${r(c(e,"plan_moment"),l`<select part="input" @change=${o=>this.setWhen({event:o.target.value})}>
                ${Et.map(o=>l`<option value=${o} ?selected=${o===s.event}>${c(e,`plan_${o}`)}</option>`)}</select>`)}
              ${r(c(e,"plan_offset"),l`<input part="input" type="number" min="-720" max="720" step="5" .value=${String(s.offset??0)} @change=${o=>this.setWhen({offset:parseInt(o.target.value,10)||0})} />`)}`:r(c(e,"plan_time"),l`<input part="input" type="time" .value=${s.time??""} @change=${o=>this.setWhen({time:o.target.value})} />`)}
        </div>
        ${s.kind==="weekly"||s.kind==="sun"?l`<div class="chips" role="group">${n.map((o,u)=>{let v=!s.days?.length||s.days.includes(u);return l`<button part=${v?"button button-primary":"button"} aria-pressed=${v?"true":"false"} @click=${()=>this.toggleDay(u)}>${o}</button>`})}</div>`:p}
        ${r(c(e,"plan_name_optional"),l`<input part="input" .value=${t.title}
          placeholder=${t.type==="action"&&!t.custom&&t.thing?Te(this.hass,e,t.thing,t.verb,t.value):""}
          @input=${o=>this.set({title:o.target.value})} />`)}
        <label class="check"><input part="input" type="checkbox" .checked=${t.skip_when_away} @change=${o=>this.set({skip_when_away:o.target.checked})} />${c(e,"plan_skip_away")}</label>
        <label class="check"><input part="input" type="checkbox" .checked=${t.enabled} @change=${o=>this.set({enabled:o.target.checked})} />${c(e,"rule_enabled")}</label>
        ${this.error?l`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${t.id?l`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeEntry(t.id)}>${c(e,"remove")}</button>`:p}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${c(e,"cancel")}</button>
        <button part="button button-primary" class="primary" ?disabled=${t.custom&&!this.hass.user.is_admin} @click=${this.save}>${c(e,"save")}</button>
      </div>
    </dialog>`}timeline(){let e=this.hass.language,t=this.hass.config?.time_zone,s=w(this,"next",this.occurrences,e,15),n=s.items,r=[],d="";return n.forEach((o,u)=>{let v=C(o.at,t);v!==d&&(r.push(l`<li part="day" class="day">${he(o.at,e,t)}</li>`),d=v);let g=`${o.entry_id}|${o.at}|${s.offset+u}`,f=this.expanded===g,E=o.external?this.hass.states[o.source??""]?.attributes.friendly_name??o.source??"":"",P=E&&!o.title.toLowerCase().includes(String(E).toLowerCase())?`${c(e,"from_source")} ${E}`:"",Oe=l`<span part="time" class="time">${ie(o.at,e,t)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${o.title}</span>${P?l`<span part="row-meta" class="item-meta">${P}</span>`:p}</span>
        <span></span>`;r.push(o.external?l`<li part="row"><div class="item-main timed">${Oe}</div></li>`:l`<li part="row" class=${f?"open":""}>
            <button class="item-main timed" aria-expanded=${f?"true":"false"} @click=${()=>this.expanded=f?null:g}>${Oe}</button>
            ${f?l`<div class="item-more"><div class="item-actions">
                  <button part="button" @click=${()=>this.skip(o)}>${c(e,"plan_skip_once")}</button>
                  ${this.entries.some(rt=>rt.id===o.entry_id)?l`<button part="button button-quiet" class="quiet" @click=${()=>this.edit(o.entry_id)}>${c(e,"plan_edit_entry")}</button>`:p}
                </div></div>`:p}
          </li>`)}),l`<ul part="card list" class="list">${r}</ul>${s.nav}`}edit(e){let t=this.entries.find(s=>s.id===e);t&&(this.draft=et(t))}render(){let e=this.hass.language;return l`
      ${this.draft?this.form():p}
      <div class="columns">
        <section class="section">
          <div class="section-head"><h2 part="heading" class="heading">${c(e,"plan_next")}</h2>
            <button part="button button-primary" class="primary" @click=${()=>this.draft=Ct()}>${c(e,"plan_add")}</button></div>
          ${this.occurrences.length?this.timeline():l`<div part="empty" class="empty">${c(e,"no_plan")}</div>`}
        </section>
        <div>
          ${this.watches.length?l`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${c(e,"watching")} <span class="count">${this.watches.length}</span></h2></div>
                <ul part="card list" class="list">${w(this,"watches",this.watches,e).items.map(t=>{let s=this.expanded===`watch|${t.id}`;return l`<li part="row" class=${s?"open":""}>
                    <button class="item-main plain" aria-expanded=${s?"true":"false"} @click=${()=>this.expanded=s?null:`watch|${t.id}`}>
                      <span class="item-text"><span part="row-title" class="item-title">${t.what}</span>
                        <span part="row-meta" class="item-meta">${t.message?`${t.message} \xB7 `:""}${c(e,"until")} ${B(t.expires,e)}</span></span>
                      <span></span>
                    </button>
                    ${s?l`<div class="item-more flush"><div class="item-actions">
                      <button part="button" @click=${()=>this.removeWatch(t.id)}>${c(e,"watch_stop")}</button></div></div>`:p}
                  </li>`})}</ul>
                ${w(this,"watches",this.watches,e).nav}
              </section>`:p}
          ${this.entries.length?l`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${c(e,"plan_entries")} <span class="count">${this.entries.length}</span></h2></div>
                <ul part="card list" class="list">${w(this,"entries",this.entries,e).items.map(t=>l`<li part="row">
                  <button class="item-main plain" @click=${()=>this.draft=et(t)}>
                    <span class="item-text"><span part="row-title" class="item-title ${t.enabled?"":"off"}">${t.title}</span>
                      <span part="row-meta" class="item-meta">${Tt(t.when,e)} · ${t.author_name}${t.enabled?"":` \xB7 ${c(e,"entry_off")}`}</span></span>
                    <span class="chevron">›</span>
                  </button></li>`)}</ul>
                ${w(this,"entries",this.entries,e).nav}
              </section>`:p}
        </div>
      </div>`}};S.styles=[$,z`
      /* a wide screen: what comes next on the left, what is set up on the right */
      :host { container-type: inline-size; }
      @container (min-width: 56em) {
        .columns { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); column-gap: var(--_section-spacing); align-items: start; }
      }
    `],h([_({attribute:!1})],S.prototype,"hass",2),h([m()],S.prototype,"occurrences",2),h([m()],S.prototype,"entries",2),h([m()],S.prototype,"watches",2),h([m()],S.prototype,"draft",2),h([m()],S.prototype,"error",2),h([m()],S.prototype,"pages",2),h([m()],S.prototype,"expanded",2),S=h([y("homeai-plan")],S);var jt="homeai-chat-conversation";function Wt(i){try{return sessionStorage.getItem(i)}catch{return null}}function tt(i,a){try{a?sessionStorage.setItem(i,a):sessionStorage.removeItem(i)}catch{}}var k=class extends b{constructor(){super(...arguments);this.storageKey=jt;this.compact=!1;this.fill=!1;this.messages=[];this.busy=!1;this.error="";this.conversation=null}connectedCallback(){super.connectedCallback(),this.conversation=Wt(this.storageKey),this.conversation&&this.loadHistory()}async loadHistory(){let e=await this.hass.callWS({type:"homeai/chat/history",conversation_id:this.conversation});this.messages=e.messages,this.scrollDown()}scrollDown(){this.updateComplete.then(()=>{this.fill?this.renderRoot.querySelector(".composer")?.scrollIntoView({block:"end"}):this.log?.scrollTo({top:this.log.scrollHeight})})}async send(){let e=this.box?.value.trim();if(!(!e||this.busy)){this.box.value="",this.messages=[...this.messages,{role:"user",text:e}],this.busy=!0,this.error="",this.scrollDown();try{let t=await this.hass.callWS({type:"homeai/chat/send",text:e,...this.conversation?{conversation_id:this.conversation}:{}});this.conversation=t.conversation_id,tt(this.storageKey,this.conversation),this.messages=[...this.messages,{role:"assistant",text:t.reply}]}catch(t){this.error=t?.message??String(t)}finally{this.busy=!1,this.scrollDown()}}}restart(){this.conversation=null,tt(this.storageKey,null),this.messages=[]}keydown(e){e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this.send())}render(){let e=this.hass.language,t=this.messages.length?l`<div class="item-actions end"><button part="button button-quiet" class="quiet" @click=${this.restart}>${c(e,"chat_new")}</button></div>`:p;return l`
      ${this.fill?t:p}
      <div part="log" class="log" aria-live="polite">
        ${this.messages.length?p:l`<div class="muted hint-block">${c(e,"chat_hint")}</div>`}
        ${this.messages.map(s=>l`<div part="message message-${s.role}" class="msg ${s.role}">${s.text}</div>`)}
        ${this.busy?l`<div part="message message-assistant" class="msg assistant muted">…</div>`:p}
      </div>
      ${this.error?l`<div part="error" class="muted error">${this.error}</div>`:p}
      <div class="bottom">
        <div part="composer" class="composer glass">
          <textarea part="input" class="grow" rows="1" placeholder=${c(e,"chat_placeholder")} aria-label=${c(e,"chat_placeholder")} @keydown=${this.keydown} ?disabled=${this.busy}></textarea>
          <button part="button button-primary" class="primary" @click=${this.send} ?disabled=${this.busy}>${c(e,"send")}</button>
        </div>
      </div>
      ${this.fill?p:t}`}};k.styles=[$,z`
      .log { display: flex; flex-direction: column; gap: var(--_space); max-height: 60vh; overflow-y: auto;
        padding: var(--_space-s) 0 var(--_space-l); }
      :host([compact]) .log { max-height: 24em; }
      .msg { max-width: 85%; padding: var(--_space) var(--_space-l); border-radius: var(--_message-radius);
        white-space: pre-wrap; overflow-wrap: anywhere; }
      .user { align-self: flex-end; background: var(--_user-message-background); color: var(--_user-message-text); }
      .assistant { align-self: flex-start; background: var(--_assistant-message-background); color: var(--_assistant-message-text); }
      textarea { min-height: 3em; font-family: inherit; font-size: inherit; }
      .composer { display: flex; align-items: flex-end; gap: var(--_space); padding: var(--_space-s);
        border-radius: var(--_segment-radius); }
      .composer textarea { border: none; background: transparent; resize: none; min-height: 2.5em; }
      .composer textarea:focus { outline: none; }
      .composer:focus-within { border-color: var(--_accent); }
      :host([fill]) { display: flex; flex-direction: column; }
      :host([fill]) .log { max-height: none; flex: 1 1 auto; justify-content: flex-end; }
      :host([fill]) .bottom { position: sticky; bottom: 0; z-index: 1; padding-bottom: var(--_sheet-foot-padding); }
      .hint-block { margin: auto 0; max-width: 32em; align-self: center; text-align: center; }
    `],h([_({attribute:!1})],k.prototype,"hass",2),h([_({attribute:"storage-key"})],k.prototype,"storageKey",2),h([_({type:Boolean})],k.prototype,"compact",2),h([_({type:Boolean,reflect:!0})],k.prototype,"fill",2),h([m()],k.prototype,"messages",2),h([m()],k.prototype,"busy",2),h([m()],k.prototype,"error",2),h([Ae("textarea")],k.prototype,"box",2),h([Ae(".log")],k.prototype,"log",2),k=h([y("homeai-chat")],k);var Ot=["away","vacation","guests","home_office","sick"];function at(i,a=0){return q(Date.now()+a*864e5,i).date}function ge(i,a,e=!1){return q(new Date(i).getTime()-(e?1e3:0),a).date}function st(i,a){let e=q(i,a);return e.hour===0&&e.minute===0}function Dt(i,a,e,t){if(!st(i,t)||!st(a,t))return`${B(i,e)} \u2192 ${B(a,e)}`;let s=d=>d.toLocaleDateString(e,{weekday:"short",day:"numeric",month:"short",timeZone:t||void 0}),n=new Date(i),r=new Date(new Date(a).getTime()-1e3);return ge(i,t)===ge(a,t,!0)?s(n):`${s(n)} \u2013 ${s(r)}`}var A=class extends b{constructor(){super(...arguments);this.items=[];this.error="";this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}async load(){try{let e=await this.hass.callWS({type:"homeai/presence/list",days:120});this.items=e.items.sort((t,s)=>t.start.localeCompare(s.start)),this.world||(this.world=await this.hass.callWS({type:"homeai/world/summary"}))}catch(e){this.error=e?.message??String(e)}}personName(e){return e?this.world?.persons.find(t=>t.id===e)?.name??e:c(this.hass.language,"presence_everyone")}async save(){let e=this.draft,t={kind:e.kind,person:e.person||null,start:e.start,end:e.end,note:e.note};try{await this.hass.callWS({type:"homeai/presence/save",item:t,...e.id?{exception_id:e.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(s){this.error=s?.message??String(s)}}async removeItem(e){if(confirm(c(this.hass.language,"remove_confirm"))){try{await this.hass.callWS({type:"homeai/presence/delete",exception_id:e}),this.close()}catch(t){this.error=t?.message??String(t)}await this.load()}}close(){this.draft=void 0,this.error=""}updated(){let e=this.renderRoot.querySelector("dialog");e&&!e.open&&e.showModal()}form(){let e=this.hass.language,t=this.draft,s=r=>this.draft={...t,...r},n=(r,d)=>l`<label class="field"><span class="label">${r}</span>${d}</label>`;return l`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${c(e,t.id?"presence_change":"presence_new")}</h2></div>
      <div class="sheet-body fields">
        <div class="pair">
          ${n(c(e,"presence_kind"),l`<select part="input" @change=${r=>s({kind:r.target.value})}>
            ${Ot.map(r=>l`<option value=${r} ?selected=${r===t.kind}>${c(e,`presence_${r}`)}</option>`)}</select>`)}
          ${n(c(e,"presence_person"),l`<select part="input" @change=${r=>s({person:r.target.value})}>
            <option value="" ?selected=${!t.person}>${c(e,"presence_everyone")}</option>
            ${(this.world?.persons??[]).map(r=>l`<option value=${r.id} ?selected=${r.id===t.person}>${r.name}</option>`)}</select>`)}
        </div>
        <div class="pair">
          ${n(c(e,"presence_from"),l`<input part="input" type="date" .value=${t.start} @change=${r=>s({start:r.target.value})} />`)}
          ${n(c(e,"presence_to"),l`<input part="input" type="date" .value=${t.end} @change=${r=>s({end:r.target.value})} />`)}
        </div>
        ${n(c(e,"presence_note"),l`<input part="input" maxlength="300" .value=${t.note} @input=${r=>s({note:r.target.value})} />`)}
        ${this.error?l`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${t.id?l`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeItem(t.id)}>${c(e,"remove")}</button>`:p}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${c(e,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${c(e,"save")}</button>
      </div>
    </dialog>`}render(){let e=this.hass.language,t=this.hass.config?.time_zone;return l`
      ${this.draft?this.form():p}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${c(e,"presence")}</h2>
          <button part="button button-primary" class="primary" @click=${()=>this.draft={kind:"away",person:"",start:at(t),end:at(t,1),note:""}}>${c(e,"presence_add")}</button></div>
        <p class="hint">${c(e,"presence_hint")}</p>
        ${!this.draft&&this.error?l`<div part="card error" class="card error">${this.error}</div>`:p}
        ${this.items.length?l`<ul part="card list" class="list">${w(this,"items",this.items,e).items.map(s=>l`<li part="row">
              <button class="item-main plain" @click=${()=>this.draft={id:s.id,kind:s.kind,person:s.person??"",start:ge(s.start,t),end:ge(s.end,t,!0),note:s.note}}>
                <span class="item-text"><span part="row-title" class="item-title">${c(e,`presence_${s.kind}`)} · ${this.personName(s.person)}</span>
                  <span part="row-meta" class="item-meta">${Dt(s.start,s.end,e,t)}${s.note?` \xB7 ${s.note}`:""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>${w(this,"items",this.items,e).nav}`:l`<div part="empty" class="empty">${c(e,"presence_none")}</div>`}
      </section>`}};A.styles=$,h([_({attribute:!1})],A.prototype,"hass",2),h([m()],A.prototype,"items",2),h([m()],A.prototype,"world",2),h([m()],A.prototype,"draft",2),h([m()],A.prototype,"error",2),h([m()],A.prototype,"pages",2),A=h([y("homeai-presence")],A);var ne={situations:["situations"],plan:["plan","presence"],chat:["chat"]},Pt={situations:"mdi:home-heart",plan:"mdi:calendar-clock",presence:"mdi:account-clock-outline",chat:"mdi:message-text-outline"},We={situations:"/homeai",plan:"/homeai-plan",chat:"/homeai-chat"},Rt="/config/integrations/integration/homeai",Nt=["situations","presence","chat"];function it(i,a){if(a==="journal"){let e=Object.values(i.entities??{}).find(t=>t.platform==="homeai"&&t.translation_key==="situations");return`/logbook?entity_id=${encodeURIComponent(e?.entity_id??"sensor.homeai_situations")}`}return a==="learning"||a==="approvals"||!i.user?.is_admin?We.situations:Rt}function je(i){history.replaceState(null,"",i),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}}))}var j=class extends b{constructor(){super(...arguments);this.narrow=!1}get view(){let e=this.panel?.config?.view;return e&&e in ne?e:"situations"}tabs(){return ne[this.view]}firstUpdated(){let e=new URLSearchParams(location.search).get("tab");if(this.panel?.config?.view==="redirect"){je(it(this.hass,e));return}if(!e)return;if(ne[this.view].includes(e)){this.tab=e;return}if(!this.panel?.config?.view)return;let t=Object.keys(ne).find(s=>ne[s].includes(e));if(t){t!==this.view&&je(t==="situations"?We[t]:`${We[t]}?tab=${e}`);return}je(it(this.hass,e))}select(e){this.tab=e;let t=new URL(location.href);t.searchParams.set("tab",e),history.replaceState(history.state,"",t)}content(e){switch(e){case"plan":return l`<homeai-plan exportparts=${H} .hass=${this.hass}></homeai-plan>`;case"presence":return l`<homeai-presence exportparts=${H} .hass=${this.hass}></homeai-presence>`;case"chat":return l`<homeai-chat exportparts=${H} .hass=${this.hass} fill></homeai-chat>`;default:return l`<homeai-situations exportparts=${H} .hass=${this.hass}></homeai-situations>`}}render(){if(!this.hass||this.panel?.config?.view==="redirect")return l``;let e=this.hass.language,t=this.tabs(),s=this.tab&&t.includes(this.tab)?this.tab:t[0],n=this.panel?.title||c(e,this.view);return l`
      <div part="header" class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 part="header-title">${n}</h1>
        ${t.length>1?l`<nav part="tabs" class="tabs segmented glass ${t.length>3?"many":""}" role="tablist">
              ${t.map(r=>l`<button part=${r===s?"tab tab-active":"tab"} class=${r===s?"active":""} role="tab"
                aria-selected=${r===s?"true":"false"} aria-label=${c(e,r)} @click=${()=>this.select(r)}>
                <ha-icon part="tab-icon" .icon=${Pt[r]}></ha-icon><span part="tab-label" class="label">${c(e,r)}</span></button>`)}
            </nav>`:p}
      </div>
      <main part="content" class=${s==="chat"?"chat":Nt.includes(s)?"reading":""}>${this.content(s)}</main>
    `}};j.styles=[$,z`
      :host { background: var(--_background); min-height: 100%; container-type: inline-size; }
      /* the navigation layer stays on top while the content scrolls underneath, blurred by the glass */
      .toolbar { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; align-items: center;
        column-gap: var(--_space); min-height: var(--homeai-header-height, var(--header-height));
        padding: 0 var(--_space-l); background: var(--_header-background); color: var(--_header-text);
        backdrop-filter: var(--_glass-filter); -webkit-backdrop-filter: var(--_glass-filter);
        border-bottom: var(--_border-width) solid var(--_glass-border); box-sizing: border-box; }
      .toolbar h1 { font-family: var(--_font-family); font-size: var(--_header-font-size);
        font-weight: var(--_header-font-weight); margin: 0; flex: 1 1 auto; min-width: 0;
        min-height: var(--homeai-header-height, var(--header-height)); display: flex; align-items: center;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      /* the tabs: one glass capsule beside the title, or under it when there is no room */
      .tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: var(--_space-s) 0; }
      .tabs::-webkit-scrollbar { display: none; }
      .tabs button { display: inline-flex; align-items: center; gap: var(--_space-s); white-space: nowrap; }
      .tabs button.active { background: var(--_button-prominent-background); color: var(--_on-accent);
        box-shadow: var(--_button-prominent-shadow); }
      .tabs ha-icon { display: none; }
      @container (max-width: 36em) {
        .tabs { order: 3; flex: 1 0 100%; margin: 0 0 var(--_space); }
        .tabs button { flex: 1 1 0; justify-content: center; }
        /* many tabs on a phone: icons, with the name for screen readers */
        .tabs.many ha-icon { display: inline-flex; }
        .tabs.many .label { position: absolute; width: 1em; height: 1em; overflow: hidden; clip-path: inset(50%);
          white-space: nowrap; }
      }
      main { box-sizing: border-box; max-width: var(--homeai-content-max-width, 68em); margin: 0 auto;
        padding: var(--_space-l) var(--_content-padding) var(--_section-spacing); }
      main.reading { max-width: calc(var(--_reading-width) + var(--_content-padding) * 2); }
      main.chat { display: flex; flex-direction: column; padding-bottom: 0;
        min-height: calc(100dvh - var(--header-height) - var(--safe-area-inset-top, 0) - var(--safe-area-inset-bottom, 0)); }
      main.chat homeai-chat { flex: 1 1 auto; }
    `],h([_({attribute:!1})],j.prototype,"hass",2),h([_({type:Boolean})],j.prototype,"narrow",2),h([_({attribute:!1})],j.prototype,"panel",2),h([m()],j.prototype,"tab",2),j=h([y("homeai-panel")],j);var O=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-situations-card"};this.expanded=null}setConfig(e){this.config={entity:"sensor.homeai_situations",min_severity:1,...e}}getCardSize(){return 3}static getStubConfig(){return{type:"custom:homeai-situations-card"}}act(e,t){this.hass.callService("homeai",e,{situation_id:t})}render(){if(!this.hass)return p;let e=this.hass.language,t=this.hass.config?.time_zone,n=(this.hass.states[this.config.entity??"sensor.homeai_situations"]?.attributes.situations??[]).filter(r=>r.severity>=(this.config.min_severity??1));return l`<div part="card" class="card flush">
      ${this.config.title?l`<div part="title" class="title card-title">${this.config.title}</div>`:p}
      ${n.length?l`<ul part="list" class="list bare">${n.map(r=>{let d=this.expanded===r.id;return l`<li part="row" class=${d?"open":""}>
              <button class="item-main" aria-expanded=${d?"true":"false"} @click=${()=>this.expanded=d?null:r.id}>
                <span part="badge badge-${r.severity}" class="dot sev-${r.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title">${r.title}</span>
                  ${r.repairing?l`<span part="row-meta" class="item-meta">${c(e,"repairing")}</span>`:p}</span>
                <span part="time" class="item-aside">${V(r.since,e,t)}</span>
              </button>
              ${d?l`<div class="item-more"><div class="item-actions">
                    <button part="button button-primary" class="primary" @click=${()=>this.act("handle",r.id)}>${c(e,"handle")}</button>
                    <button part="button" @click=${()=>this.act("acknowledge",r.id)} ?disabled=${r.acknowledged}>${c(e,"ack")}</button>
                    <button part="button" @click=${()=>this.act("snooze",r.id)}>${c(e,"snooze")}</button>
                  </div></div>`:p}
            </li>`})}</ul>`:l`<div part="empty" class="empty">${c(e,"nothing_open")}</div>`}
    </div>`}};O.styles=$,h([_({attribute:!1})],O.prototype,"hass",2),h([m()],O.prototype,"config",2),h([m()],O.prototype,"expanded",2),O=h([y("homeai-situations-card")],O);var D=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-plan-card"};this.occurrences=[]}setConfig(e){this.config={days:2,limit:6,...e}}getCardSize(){return 2+Math.min(this.occurrences.length,this.config.limit??6)}static getStubConfig(){return{type:"custom:homeai-plan-card"}}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.load(),300*1e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer)}firstUpdated(){this.load()}async load(){if(this.hass)try{let e=await this.hass.callWS({type:"homeai/plan/list",days:this.config.days??2});this.occurrences=e.occurrences}catch{this.occurrences=[]}}render(){if(!this.hass)return p;let e=this.hass.language,t=this.hass.config?.time_zone,s=this.occurrences.slice(0,this.config.limit??6),n=[],r=C(Date.now(),t);for(let d of s){let o=C(d.at,t);o!==r&&(n.push(l`<li part="day" class="day">${he(d.at,e,t)}</li>`),r=o),n.push(l`<li part="row"><div class="item-main timed"><span part="time" class="time">${ie(d.at,e,t)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${d.title}</span></span><span></span></div></li>`)}return l`<div part="card" class="card flush">
      <div part="title" class="title card-title">${this.config.title??c(e,"plan_next")}</div>
      ${s.length?l`<ul part="list" class="list bare">${n}</ul>`:l`<div part="empty" class="empty">${c(e,"no_plan")}</div>`}
    </div>`}};D.styles=$,h([_({attribute:!1})],D.prototype,"hass",2),h([m()],D.prototype,"config",2),h([m()],D.prototype,"occurrences",2),D=h([y("homeai-plan-card")],D);var Z=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-chat-card"}}setConfig(e){this.config={...e}}getCardSize(){return 6}static getStubConfig(){return{type:"custom:homeai-chat-card"}}render(){return this.hass?l`<div part="card" class="card">
      ${this.config.title?l`<div part="title" class="title spaced">${this.config.title}</div>`:p}
      <homeai-chat exportparts=${H} .hass=${this.hass} compact storage-key="homeai-chat-card"></homeai-chat>
    </div>`:p}};Z.styles=$,h([_({attribute:!1})],Z.prototype,"hass",2),h([m()],Z.prototype,"config",2),Z=h([y("homeai-chat-card")],Z);var Mt=[{type:"homeai-situations-card",name:"HomeAI situations",description:"Open situations from HomeAI with quick reactions.",preview:!0},{type:"homeai-plan-card",name:"HomeAI plan",description:"What the home's plan does next.",preview:!0},{type:"homeai-chat-card",name:"HomeAI chat",description:"Talk to HomeAI in your own account.",preview:!1}];window.customCards=window.customCards||[];for(let i of Mt)window.customCards.some(a=>a.type===i.type)||window.customCards.push(i);
