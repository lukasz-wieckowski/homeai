var fe=Object.defineProperty;var be=Object.getOwnPropertyDescriptor;var p=(i,a,t,e)=>{for(var s=e>1?void 0:e?be(a,t):a,n=i.length-1,r;n>=0;n--)(r=i[n])&&(s=(e?r(a,t,s):r(s))||s);return e&&s&&fe(a,t,s),s};var _t=globalThis,yt=_t.ShadowRoot&&(_t.ShadyCSS===void 0||_t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pt=Symbol(),Vt=new WeakMap,ct=class{constructor(a,t,e){if(this._$cssResult$=!0,e!==Pt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=a,this.t=t}get styleSheet(){let a=this.o,t=this.t;if(yt&&a===void 0){let e=t!==void 0&&t.length===1;e&&(a=Vt.get(t)),a===void 0&&((this.o=a=new CSSStyleSheet).replaceSync(this.cssText),e&&Vt.set(t,a))}return a}toString(){return this.cssText}},Kt=i=>new ct(typeof i=="string"?i:i+"",void 0,Pt),E=(i,...a)=>{let t=i.length===1?i[0]:a.reduce((e,s,n)=>e+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new ct(t,i,Pt)},Ft=(i,a)=>{if(yt)i.adoptedStyleSheets=a.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of a){let e=document.createElement("style"),s=_t.litNonce;s!==void 0&&e.setAttribute("nonce",s),e.textContent=t.cssText,i.appendChild(e)}},jt=yt?i=>i:i=>i instanceof CSSStyleSheet?(a=>{let t="";for(let e of a.cssRules)t+=e.cssText;return Kt(t)})(i):i;var{is:$e,defineProperty:we,getOwnPropertyDescriptor:ke,getOwnPropertyNames:xe,getOwnPropertySymbols:Se,getPrototypeOf:Ee}=Object,ft=globalThis,Zt=ft.trustedTypes,ze=Zt?Zt.emptyScript:"",Te=ft.reactiveElementPolyfillSupport,dt=(i,a)=>i,pt={toAttribute(i,a){switch(a){case Boolean:i=i?ze:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,a){let t=i;switch(a){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},bt=(i,a)=>!$e(i,a),Jt={attribute:!0,type:String,converter:pt,reflect:!1,useDefault:!1,hasChanged:bt};Symbol.metadata??=Symbol("metadata"),ft.litPropertyMetadata??=new WeakMap;var U=class extends HTMLElement{static addInitializer(a){this._$Ei(),(this.l??=[]).push(a)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(a,t=Jt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(a)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(a,t),!t.noAccessor){let e=Symbol(),s=this.getPropertyDescriptor(a,e,t);s!==void 0&&we(this.prototype,a,s)}}static getPropertyDescriptor(a,t,e){let{get:s,set:n}=ke(this.prototype,a)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let c=s?.call(this);n?.call(this,r),this.requestUpdate(a,c,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(a){return this.elementProperties.get(a)??Jt}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;let a=Ee(this);a.finalize(),a.l!==void 0&&(this.l=[...a.l]),this.elementProperties=new Map(a.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){let t=this.properties,e=[...xe(t),...Se(t)];for(let s of e)this.createProperty(s,t[s])}let a=this[Symbol.metadata];if(a!==null){let t=litPropertyMetadata.get(a);if(t!==void 0)for(let[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let s=this._$Eu(t,e);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(a){let t=[];if(Array.isArray(a)){let e=new Set(a.flat(1/0).reverse());for(let s of e)t.unshift(jt(s))}else a!==void 0&&t.push(jt(a));return t}static _$Eu(a,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof a=="string"?a.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(a=>this.enableUpdating=a),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(a=>a(this))}addController(a){(this._$EO??=new Set).add(a),this.renderRoot!==void 0&&this.isConnected&&a.hostConnected?.()}removeController(a){this._$EO?.delete(a)}_$E_(){let a=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(a.set(e,this[e]),delete this[e]);a.size>0&&(this._$Ep=a)}createRenderRoot(){let a=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ft(a,this.constructor.elementStyles),a}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(a=>a.hostConnected?.())}enableUpdating(a){}disconnectedCallback(){this._$EO?.forEach(a=>a.hostDisconnected?.())}attributeChangedCallback(a,t,e){this._$AK(a,e)}_$ET(a,t){let e=this.constructor.elementProperties.get(a),s=this.constructor._$Eu(a,e);if(s!==void 0&&e.reflect===!0){let n=(e.converter?.toAttribute!==void 0?e.converter:pt).toAttribute(t,e.type);this._$Em=a,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(a,t){let e=this.constructor,s=e._$Eh.get(a);if(s!==void 0&&this._$Em!==s){let n=e.getPropertyOptions(s),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:pt;this._$Em=s;let c=r.fromAttribute(t,n.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(a,t,e,s=!1,n){if(a!==void 0){let r=this.constructor;if(s===!1&&(n=this[a]),e??=r.getPropertyOptions(a),!((e.hasChanged??bt)(n,t)||e.useDefault&&e.reflect&&n===this._$Ej?.get(a)&&!this.hasAttribute(r._$Eu(a,e))))return;this.C(a,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(a,t,{useDefault:e,reflect:s,wrapped:n},r){e&&!(this._$Ej??=new Map).has(a)&&(this._$Ej.set(a,r??t??this[a]),n!==!0||r!==void 0)||(this._$AL.has(a)||(this.hasUpdated||e||(t=void 0),this._$AL.set(a,t)),s===!0&&this._$Em!==a&&(this._$Eq??=new Set).add(a))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let a=this.scheduleUpdate();return a!=null&&await a,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[s,n]of e){let{wrapped:r}=n,c=this[s];r!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,n,c)}}let a=!1,t=this._$AL;try{a=this.shouldUpdate(t),a?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw a=!1,this._$EM(),e}a&&this._$AE(t)}willUpdate(a){}_$AE(a){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(a)),this.updated(a)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(a){return!0}update(a){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(a){}firstUpdated(a){}};U.elementStyles=[],U.shadowRootOptions={mode:"open"},U[dt("elementProperties")]=new Map,U[dt("finalized")]=new Map,Te?.({ReactiveElement:U}),(ft.reactiveElementVersions??=[]).push("2.1.2");var Mt=globalThis,Ht=i=>i,$t=Mt.trustedTypes,Gt=$t?$t.createPolicy("lit-html",{createHTML:i=>i}):void 0,Dt="$lit$",q=`lit$${Math.random().toFixed(9).slice(2)}$`,Wt="?"+q,Ae=`<${Wt}>`,Y=document,ut=()=>Y.createComment(""),mt=i=>i===null||typeof i!="object"&&typeof i!="function",Nt=Array.isArray,ee=i=>Nt(i)||typeof i?.[Symbol.iterator]=="function",Rt=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yt=/-->/g,Qt=/>/g,H=RegExp(`>|${Rt}(?:([^\\s"'>=/]+)(${Rt}*=${Rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xt=/'/g,It=/"/g,se=/^(?:script|style|textarea|title)$/i,Ot=i=>(a,...t)=>({_$litType$:i,strings:a,values:t}),o=Ot(1),cs=Ot(2),ds=Ot(3),z=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),te=new WeakMap,G=Y.createTreeWalker(Y,129);function ae(i,a){if(!Nt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Gt!==void 0?Gt.createHTML(a):a}var ie=(i,a)=>{let t=i.length-1,e=[],s,n=a===2?"<svg>":a===3?"<math>":"",r=ht;for(let c=0;c<t;c++){let d=i[c],v,m,g=-1,y=0;for(;y<d.length&&(r.lastIndex=y,m=r.exec(d),m!==null);)y=r.lastIndex,r===ht?m[1]==="!--"?r=Yt:m[1]!==void 0?r=Qt:m[2]!==void 0?(se.test(m[2])&&(s=RegExp("</"+m[2],"g")),r=H):m[3]!==void 0&&(r=H):r===H?m[0]===">"?(r=s??ht,g=-1):m[1]===void 0?g=-2:(g=r.lastIndex-m[2].length,v=m[1],r=m[3]===void 0?H:m[3]==='"'?It:Xt):r===It||r===Xt?r=H:r===Yt||r===Qt?r=ht:(r=H,s=void 0);let _=r===H&&i[c+1].startsWith("/>")?" ":"";n+=r===ht?d+Ae:g>=0?(e.push(v),d.slice(0,g)+Dt+d.slice(g)+q+_):d+q+(g===-2?c:_)}return[ae(i,n+(i[t]||"<?>")+(a===2?"</svg>":a===3?"</math>":"")),e]},gt=class i{constructor({strings:a,_$litType$:t},e){let s;this.parts=[];let n=0,r=0,c=a.length-1,d=this.parts,[v,m]=ie(a,t);if(this.el=i.createElement(v,e),G.currentNode=this.el.content,t===2||t===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=G.nextNode())!==null&&d.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith(Dt)){let y=m[r++],_=s.getAttribute(g).split(q),w=/([.?@])?(.*)/.exec(y);d.push({type:1,index:n,name:w[2],strings:_,ctor:w[1]==="."?kt:w[1]==="?"?xt:w[1]==="@"?St:X}),s.removeAttribute(g)}else g.startsWith(q)&&(d.push({type:6,index:n}),s.removeAttribute(g));if(se.test(s.tagName)){let g=s.textContent.split(q),y=g.length-1;if(y>0){s.textContent=$t?$t.emptyScript:"";for(let _=0;_<y;_++)s.append(g[_],ut()),G.nextNode(),d.push({type:2,index:++n});s.append(g[y],ut())}}}else if(s.nodeType===8)if(s.data===Wt)d.push({type:2,index:n});else{let g=-1;for(;(g=s.data.indexOf(q,g+1))!==-1;)d.push({type:7,index:n}),g+=q.length-1}n++}}static createElement(a,t){let e=Y.createElement("template");return e.innerHTML=a,e}};function Q(i,a,t=i,e){if(a===z)return a;let s=e!==void 0?t._$Co?.[e]:t._$Cl,n=mt(a)?void 0:a._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,t,e)),e!==void 0?(t._$Co??=[])[e]=s:t._$Cl=s),s!==void 0&&(a=Q(i,s._$AS(i,a.values),s,e)),a}var wt=class{constructor(a,t){this._$AV=[],this._$AN=void 0,this._$AD=a,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(a){let{el:{content:t},parts:e}=this._$AD,s=(a?.creationScope??Y).importNode(t,!0);G.currentNode=s;let n=G.nextNode(),r=0,c=0,d=e[0];for(;d!==void 0;){if(r===d.index){let v;d.type===2?v=new it(n,n.nextSibling,this,a):d.type===1?v=new d.ctor(n,d.name,d.strings,this,a):d.type===6&&(v=new Et(n,this,a)),this._$AV.push(v),d=e[++c]}r!==d?.index&&(n=G.nextNode(),r++)}return G.currentNode=Y,s}p(a){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(a,e,t),t+=e.strings.length-2):e._$AI(a[t])),t++}},it=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(a,t,e,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=a,this._$AB=t,this._$AM=e,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let a=this._$AA.parentNode,t=this._$AM;return t!==void 0&&a?.nodeType===11&&(a=t.parentNode),a}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(a,t=this){a=Q(this,a,t),mt(a)?a===h||a==null||a===""?(this._$AH!==h&&this._$AR(),this._$AH=h):a!==this._$AH&&a!==z&&this._(a):a._$litType$!==void 0?this.$(a):a.nodeType!==void 0?this.T(a):ee(a)?this.k(a):this._(a)}O(a){return this._$AA.parentNode.insertBefore(a,this._$AB)}T(a){this._$AH!==a&&(this._$AR(),this._$AH=this.O(a))}_(a){this._$AH!==h&&mt(this._$AH)?this._$AA.nextSibling.data=a:this.T(Y.createTextNode(a)),this._$AH=a}$(a){let{values:t,_$litType$:e}=a,s=typeof e=="number"?this._$AC(a):(e.el===void 0&&(e.el=gt.createElement(ae(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new wt(s,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(a){let t=te.get(a.strings);return t===void 0&&te.set(a.strings,t=new gt(a)),t}k(a){Nt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,s=0;for(let n of a)s===t.length?t.push(e=new i(this.O(ut()),this.O(ut()),this,this.options)):e=t[s],e._$AI(n),s++;s<t.length&&(this._$AR(e&&e._$AB.nextSibling,s),t.length=s)}_$AR(a=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);a!==this._$AB;){let e=Ht(a).nextSibling;Ht(a).remove(),a=e}}setConnected(a){this._$AM===void 0&&(this._$Cv=a,this._$AP?.(a))}},X=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(a,t,e,s,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=a,this.name=t,this._$AM=s,this.options=n,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=h}_$AI(a,t=this,e,s){let n=this.strings,r=!1;if(n===void 0)a=Q(this,a,t,0),r=!mt(a)||a!==this._$AH&&a!==z,r&&(this._$AH=a);else{let c=a,d,v;for(a=n[0],d=0;d<n.length-1;d++)v=Q(this,c[e+d],t,d),v===z&&(v=this._$AH[d]),r||=!mt(v)||v!==this._$AH[d],v===h?a=h:a!==h&&(a+=(v??"")+n[d+1]),this._$AH[d]=v}r&&!s&&this.j(a)}j(a){a===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,a??"")}},kt=class extends X{constructor(){super(...arguments),this.type=3}j(a){this.element[this.name]=a===h?void 0:a}},xt=class extends X{constructor(){super(...arguments),this.type=4}j(a){this.element.toggleAttribute(this.name,!!a&&a!==h)}},St=class extends X{constructor(a,t,e,s,n){super(a,t,e,s,n),this.type=5}_$AI(a,t=this){if((a=Q(this,a,t,0)??h)===z)return;let e=this._$AH,s=a===h&&e!==h||a.capture!==e.capture||a.once!==e.once||a.passive!==e.passive,n=a!==h&&(e===h||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,a),this._$AH=a}handleEvent(a){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,a):this._$AH.handleEvent(a)}},Et=class{constructor(a,t,e){this.element=a,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(a){Q(this,a)}},re={M:Dt,P:q,A:Wt,C:1,L:ie,R:wt,D:ee,V:Q,I:it,H:X,N:xt,U:St,B:kt,F:Et},Ce=Mt.litHtmlPolyfillSupport;Ce?.(gt,it),(Mt.litHtmlVersions??=[]).push("3.3.3");var ne=(i,a,t)=>{let e=t?.renderBefore??a,s=e._$litPart$;if(s===void 0){let n=t?.renderBefore??null;e._$litPart$=s=new it(a.insertBefore(ut(),n),n,void 0,t??{})}return s._$AI(i),s};var Lt=globalThis,b=class extends U{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let a=super.createRenderRoot();return this.renderOptions.renderBefore??=a.firstChild,a}update(a){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(a),this._$Do=ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};b._$litElement$=!0,b.finalized=!0,Lt.litElementHydrateSupport?.({LitElement:b});var Pe=Lt.litElementPolyfillSupport;Pe?.({LitElement:b});(Lt.litElementVersions??=[]).push("4.2.2");var je={attribute:!0,type:String,converter:pt,reflect:!1,hasChanged:bt},Re=(i=je,a,t)=>{let{kind:e,metadata:s}=t,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),e==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(t.name,i),e==="accessor"){let{name:r}=t;return{set(c){let d=a.get.call(this);a.set.call(this,c),this.requestUpdate(r,d,i,!0,c)},init(c){return c!==void 0&&this.C(r,void 0,i,c),c}}}if(e==="setter"){let{name:r}=t;return function(c){let d=this[r];a.call(this,c),this.requestUpdate(r,d,i,!0,c)}}throw Error("Unsupported decorator location: "+e)};function f(i){return(a,t)=>typeof t=="object"?Re(i,a,t):((e,s,n)=>{let r=s.hasOwnProperty(n);return s.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(s,n):void 0})(i,a,t)}function u(i){return f({...i,state:!0,attribute:!1})}var I=(i,a,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof a!="object"&&Object.defineProperty(i,a,t),t);function Ut(i,a){return(t,e,s)=>{let n=r=>r.renderRoot?.querySelector(i)??null;if(a){let{get:r,set:c}=typeof e=="object"?t:s??(()=>{let d=Symbol();return{get(){return this[d]},set(v){this[d]=v}}})();return I(t,e,{get(){let d=r.call(this);return d===void 0&&(d=n(this),(d!==null||this.hasUpdated)&&c.call(this,d)),d}})}return I(t,e,{get(){return n(this)}})}}function k(i){return a=>{customElements.get(i)||customElements.define(i,a)}}var oe={en:{pages:"Pages",page_prev:"Previous",page_next:"Next",of:"of",manage:"Manage",waiting_approval:"Waiting for your approval",needs_attention:"Needs attention",for_info:"For your information",decided:"Recent decisions",acked_by:"Acknowledged by",today:"Today",tomorrow:"Tomorrow",plan_skip_once:"Skip this time",plan_edit_entry:"Edit the entry",plan_new:"New plan entry",plan_change:"Plan entry",presence_new:"New exception",presence_change:"Exception",rule_new:"New rule",rule_change:"Rule",rule_firing:"met now",watch_stop:"Stop watching",days_of:"of",days_word:"days",close:"Close",section:"Section",entry_off:"off",from_source:"from",status_approved:"approved",status_denied:"denied",status_expired:"expired",status_cancelled:"cancelled",situations:"Situations",approvals:"Approvals",plan:"Plan",journal:"Journal",settings:"Settings",ai:"AI",nothing_open:"Nothing needs attention.",ack:"Got it",handle:"I'll handle it",snooze:"Snooze",dismiss:"Not a problem",severity:"Severity",who:"Who",repairing:"HomeAI is fixing it",approve:"Approve",deny:"Deny",no_approvals:"No requests waiting.",expires:"expires",no_plan:"The plan is empty.",remove:"Remove",search:"Search settings",advanced:"Show advanced",reset:"Reset",saved:"Saved",confirm_change:"This lowers protection or changes something important. Continue?",overridden:"overridden here",default:"default",undo:"Undo last change",export:"Export",import:"Import",cost_today:"Cost today",cost_month:"This month",tiers:"Tiers",no_tiers:"No AI tier yet. Add one in the integration's settings (Add AI tier).",last_prompt:"Last request",resolved:"Recently resolved",admin_only:"Only administrators can change settings.",since:"since",reason:"Why",steps:"Steps",learning:"Learning",proposals:"Proposals",no_proposals:"No proposals yet.",memory:"Memory",remember:"Remember",remember_hint:"Something HomeAI should know",review:"Weekly review",rules:"Rules",no_rules:"No rules yet.",rule_add:"Add a rule",rule_name:"Name",rule_entities:"Entities",rule_label:"Label id",rule_area:"Area",rule_domain:"Domain",rule_condition:"Condition",rule_minutes:"For at least",rule_when:"Active",rule_mode:"Mode",rule_category:"Category",rule_advice:"Advice",rule_enabled:"Enabled",rule_preview:"Preview",rule_covers:"Entities covered",rule_meeting:"Meeting it now",rule_off:"off",rule_state:"is",rule_not_state:"is not",rule_above:"above",rule_below:"below",rule_unavailable:"unavailable",rule_always:"always",rule_night:"at night",rule_away:"nobody home",rule_home:"someone home",rule_each:"each entity",rule_all:"all together",rule_safety:"Safety",rule_security:"Security",rule_damage:"Damage",rule_system:"System",rule_energy:"Energy",rule_comfort:"Comfort",rule_maintenance:"Maintenance",rule_info:"Information",rule_nobody:"Nobody",rule_member:"A household member",rule_admin:"An administrator",rule_service:"A technician",save:"Save",cancel:"Cancel",edit:"Edit",chat:"Chat",presence:"Presence",send:"Send",chat_new:"New conversation",chat_placeholder:"Ask HomeAI\u2026",chat_hint:"Ask about the house, what happened, or what HomeAI should do. HomeAI acts only within its policy.",scope:"Applies to",scope_global:"Whole home",scope_floor:"Floor",scope_area:"Room",scope_device:"Device",scope_entity:"Entity",scope_person:"Person",scope_pick:"Choose where this applies.",scope_none:"Nothing in this section can be set here.",inherited:"inherited",history:"History",reset_section:"Reset section",reset_section_confirm:"Restore the defaults of every setting in this section?",import_confirm:"Replace all settings with the file's contents?",remove_confirm:"Remove it?",undo_confirm:"Undo the last settings change?",plan_add:"Add to plan",plan_next:"Coming up",plan_entries:"Entries",plan_skip:"Skip",plan_type:"Type",plan_action:"Action",plan_reminder:"Reminder",plan_reminder_text:"Reminder",plan_to:"Who to remind",plan_to_home_or_all:"Who is home, else everyone",plan_to_home:"Who is home",plan_to_all:"Everyone",plan_to_admins:"Administrators",plan_service:"Action",plan_data:"Data (JSON)",plan_when:"When",plan_once:"Once",plan_daily:"Every day",plan_weekly:"On days",plan_sun:"Around the sun",plan_sunrise:"Sunrise",plan_sunset:"Sunset",plan_dawn:"Dawn",plan_dusk:"Dusk",plan_solar_noon:"Solar noon",plan_skip_away:"Skip while everyone is away",plan_error:"Not saved",presence_add:"Add exception",presence_none:"No trips, guests or other exceptions planned.",presence_hint:"Trips, guests and days at home change how HomeAI watches the house and who it tells.",presence_kind:"What",presence_person:"Who",presence_everyone:"Whole household",presence_from:"From",presence_to:"Until (inclusive)",presence_note:"Note",presence_away:"Away",presence_vacation:"Vacation",presence_guests:"Guests",presence_home_office:"Working from home",presence_sick:"Sick at home",prompts:"Prompts",prompt_triage:"Assessment",prompt_investigate:"Investigation",prompt_chat:"Conversation",prompt_arbiter:"Arbiter",prompt_digest:"Digest",prompt_custom:"your own",prompt_default:"built-in",prompt_restore:"Restore the built-in prompt",prompt_show_default:"Show the built-in prompt",prompt_restored:"built-in prompt restored",prompt_hint:"The rule that house data is never an instruction is always added, and structured answers keep their format.",watching:"Watching for you",until:"until",show_all:"Show all",show_less:"Show less",limit_day:"Daily limit",limit_month:"Monthly limit",memory_home:"whole home",memory_from_person:"told by a person",memory_from_ai:"noticed by AI",memory_from_learning:"learned",kind_schedule:"Plan",kind_action:"Action",kind_ai:"AI",kind_repair:"Repair",kind_approval:"Approval",kind_setting:"Setting",kind_situation:"Situation",kind_notify:"Notification",kind_learning:"Learning",kind_memory:"Memory",kind_policy:"Policy",kind_system:"System",kind_decision:"Decision",kind_notification:"Notification"},pl:{pages:"Strony",page_prev:"Poprzednie",page_next:"Nast\u0119pne",of:"z",manage:"Zarz\u0105dzanie",waiting_approval:"Czeka na Twoj\u0105 zgod\u0119",needs_attention:"Wymaga uwagi",for_info:"Do wiadomo\u015Bci",decided:"Ostatnie decyzje",acked_by:"Potwierdzone przez",today:"Dzi\u015B",tomorrow:"Jutro",plan_skip_once:"Pomi\u0144 tym razem",plan_edit_entry:"Edytuj wpis",plan_new:"Nowy wpis planu",plan_change:"Wpis planu",presence_new:"Nowy wyj\u0105tek",presence_change:"Wyj\u0105tek",rule_new:"Nowa regu\u0142a",rule_change:"Regu\u0142a",rule_firing:"spe\u0142niona teraz",watch_stop:"Przesta\u0144 pilnowa\u0107",days_of:"z",days_word:"dni",close:"Zamknij",section:"Sekcja",entry_off:"wy\u0142\u0105czony",from_source:"z",status_approved:"zgoda",status_denied:"odmowa",status_expired:"wygas\u0142a",status_cancelled:"anulowana",situations:"Sprawy",approvals:"Zgody",plan:"Plan",journal:"Dziennik",settings:"Ustawienia",ai:"AI",nothing_open:"Nic nie wymaga uwagi.",ack:"Wiem",handle:"Zajm\u0119 si\u0119",snooze:"Wycisz",dismiss:"To nie problem",severity:"Waga",who:"Kto",repairing:"HomeAI naprawia",approve:"Zgoda",deny:"Odmowa",no_approvals:"Brak oczekuj\u0105cych pr\xF3\u015Bb.",expires:"wygasa",no_plan:"Plan jest pusty.",remove:"Usu\u0144",search:"Szukaj ustawie\u0144",advanced:"Poka\u017C zaawansowane",reset:"Przywr\xF3\u0107",saved:"Zapisano",confirm_change:"To obni\u017Ca ochron\u0119 albo zmienia co\u015B wa\u017Cnego. Kontynuowa\u0107?",overridden:"nadpisane tutaj",default:"domy\u015Blnie",undo:"Cofnij ostatni\u0105 zmian\u0119",export:"Eksport",import:"Import",cost_today:"Koszt dzi\u015B",cost_month:"W tym miesi\u0105cu",tiers:"Poziomy",no_tiers:"Brak poziomu AI. Dodaj go w ustawieniach integracji (Dodaj poziom AI).",last_prompt:"Ostatnie zapytanie",resolved:"Ostatnio rozwi\u0105zane",admin_only:"Ustawienia zmieniaj\u0105 tylko administratorzy.",since:"od",reason:"Dlaczego",steps:"Kroki",learning:"Uczenie",proposals:"Propozycje",no_proposals:"Brak propozycji.",memory:"Pami\u0119\u0107",remember:"Zapami\u0119taj",remember_hint:"Co\u015B, co HomeAI powinno wiedzie\u0107",review:"Przegl\u0105d tygodniowy",rules:"Regu\u0142y",no_rules:"Brak regu\u0142.",rule_add:"Dodaj regu\u0142\u0119",rule_name:"Nazwa",rule_entities:"Encje",rule_label:"Id etykiety",rule_area:"Obszar",rule_domain:"Domena",rule_condition:"Warunek",rule_minutes:"Przez co najmniej",rule_when:"Aktywna",rule_mode:"Tryb",rule_category:"Kategoria",rule_advice:"Rada",rule_enabled:"W\u0142\u0105czona",rule_preview:"Podgl\u0105d",rule_covers:"Obj\u0119te encje",rule_meeting:"Spe\u0142niaj\u0105 teraz",rule_off:"wy\u0142\u0105czona",rule_state:"jest",rule_not_state:"nie jest",rule_above:"powy\u017Cej",rule_below:"poni\u017Cej",rule_unavailable:"niedost\u0119pna",rule_always:"zawsze",rule_night:"w nocy",rule_away:"nikogo w domu",rule_home:"kto\u015B w domu",rule_each:"ka\u017Cda encja",rule_all:"wszystkie naraz",rule_safety:"Bezpiecze\u0144stwo",rule_security:"Ochrona",rule_damage:"Szkody",rule_system:"System",rule_energy:"Energia",rule_comfort:"Komfort",rule_maintenance:"Konserwacja",rule_info:"Informacja",rule_nobody:"Nikt",rule_member:"Domownik",rule_admin:"Administrator",rule_service:"Fachowiec",save:"Zapisz",cancel:"Anuluj",edit:"Edytuj",chat:"Rozmowa",presence:"Obecno\u015B\u0107",send:"Wy\u015Blij",chat_new:"Nowa rozmowa",chat_placeholder:"Zapytaj HomeAI\u2026",chat_hint:"Zapytaj o dom, o to, co si\u0119 sta\u0142o, albo co HomeAI ma zrobi\u0107. HomeAI dzia\u0142a tylko w granicach swojej polityki.",scope:"Dotyczy",scope_global:"Ca\u0142y dom",scope_floor:"Pi\u0119tro",scope_area:"Pomieszczenie",scope_device:"Urz\u0105dzenie",scope_entity:"Encja",scope_person:"Osoba",scope_pick:"Wybierz, czego to dotyczy.",scope_none:"Niczego z tej sekcji nie da si\u0119 ustawi\u0107 tutaj.",inherited:"dziedziczone",history:"Historia",reset_section:"Przywr\xF3\u0107 sekcj\u0119",reset_section_confirm:"Przywr\xF3ci\u0107 domy\u015Blne warto\u015Bci wszystkich ustawie\u0144 tej sekcji?",import_confirm:"Zast\u0105pi\u0107 wszystkie ustawienia zawarto\u015Bci\u0105 pliku?",remove_confirm:"Usun\u0105\u0107?",undo_confirm:"Cofn\u0105\u0107 ostatni\u0105 zmian\u0119 ustawie\u0144?",plan_add:"Dodaj do planu",plan_next:"Wkr\xF3tce",plan_entries:"Wpisy",plan_skip:"Pomi\u0144",plan_type:"Rodzaj",plan_action:"Akcja",plan_reminder:"Przypomnienie",plan_reminder_text:"Przypomnienie",plan_to:"Komu przypomnie\u0107",plan_to_home_or_all:"Kto jest w domu, inaczej wszystkim",plan_to_home:"Kto jest w domu",plan_to_all:"Wszystkim",plan_to_admins:"Administratorom",plan_service:"Akcja",plan_data:"Dane (JSON)",plan_when:"Kiedy",plan_once:"Raz",plan_daily:"Codziennie",plan_weekly:"W dni",plan_sun:"Wed\u0142ug s\u0142o\u0144ca",plan_sunrise:"Wsch\xF3d s\u0142o\u0144ca",plan_sunset:"Zach\xF3d s\u0142o\u0144ca",plan_dawn:"\u015Awit",plan_dusk:"Zmierzch",plan_solar_noon:"Po\u0142udnie s\u0142oneczne",plan_skip_away:"Pomijaj, gdy nikogo nie ma",plan_error:"Nie zapisano",presence_add:"Dodaj wyj\u0105tek",presence_none:"Brak zaplanowanych wyjazd\xF3w, go\u015Bci i innych wyj\u0105tk\xF3w.",presence_hint:"Wyjazdy, go\u015Bcie i dni w domu zmieniaj\u0105 to, jak HomeAI pilnuje domu i kogo powiadamia.",presence_kind:"Co",presence_person:"Kto",presence_everyone:"Ca\u0142y dom",presence_from:"Od",presence_to:"Do (w\u0142\u0105cznie)",presence_note:"Notatka",presence_away:"Poza domem",presence_vacation:"Urlop",presence_guests:"Go\u015Bcie",presence_home_office:"Praca z domu",presence_sick:"Choroba w domu",prompts:"Prompty",prompt_triage:"Ocena",prompt_investigate:"Dochodzenie",prompt_chat:"Rozmowa",prompt_arbiter:"Arbiter",prompt_digest:"Podsumowanie",prompt_custom:"w\u0142asny",prompt_default:"wbudowany",prompt_restore:"Przywr\xF3\u0107 wbudowany prompt",prompt_show_default:"Poka\u017C wbudowany prompt",prompt_restored:"przywr\xF3cono wbudowany prompt",prompt_hint:"Zasada, \u017Ce dane z domu nigdy nie s\u0105 poleceniem, jest zawsze dodawana, a odpowiedzi strukturalne zachowuj\u0105 sw\xF3j format.",watching:"Pilnuj\u0119 dla ciebie",until:"do",show_all:"Poka\u017C wszystko",show_less:"Poka\u017C mniej",limit_day:"Limit dzienny",limit_month:"Limit miesi\u0119czny",memory_home:"ca\u0142y dom",memory_from_person:"od domownika",memory_from_ai:"zauwa\u017Cone przez AI",memory_from_learning:"nauczone",kind_schedule:"Plan",kind_action:"Akcja",kind_ai:"AI",kind_repair:"Naprawa",kind_approval:"Zgoda",kind_setting:"Ustawienie",kind_situation:"Sprawa",kind_notify:"Powiadomienie",kind_learning:"Uczenie",kind_memory:"Pami\u0119\u0107",kind_policy:"Polityka",kind_system:"System",kind_decision:"Decyzja",kind_notification:"Powiadomienie"}};function l(i,a){let t=(i||"en").split("-")[0];return oe[t]?.[a]??oe.en[a]??a}function tt(i,a){let t={},e=new Intl.DateTimeFormat("en-CA",{timeZone:a||void 0,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});for(let s of e.formatToParts(new Date(i)))t[s.type]=s.value;return{date:`${t.year}-${t.month}-${t.day}`,hour:Number(t.hour),minute:Number(t.minute)}}function D(i,a){return i?new Date(i).toLocaleString(a,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):""}function j(i,a){return tt(i,a).date}function rt(i,a,t){let e=j(i,t);return e===j(Date.now(),t)?l(a,"today"):e===j(Date.now()+864e5,t)?l(a,"tomorrow"):new Date(i).toLocaleDateString(a,{weekday:"long",day:"numeric",month:"long",timeZone:t||void 0})}function et(i,a,t){return new Date(i).toLocaleTimeString(a,{hour:"2-digit",minute:"2-digit",timeZone:t||void 0})}function st(i,a,t){return i?j(i,t)===j(Date.now(),t)?et(i,a,t):new Date(i).toLocaleDateString(a,{day:"numeric",month:"short",timeZone:t||void 0}):""}var Me=E`
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
`,x=[Me,E`
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
  `],R=["card","title","heading","badge","badge-0","badge-1","badge-2","badge-3","badge-4","button","button-primary","button-quiet","segmented","sheet","composer","input","list","row","row-title","row-meta","day","time","pager","empty","error","log","message","message-user","message-assistant"].join(", ");var qt=10;function $(i,a,t,e,s=qt){let n=Math.max(1,Math.ceil(t.length/s)),r=Math.max(0,Math.min(i.pages[a]??0,n-1)),c=r*s,d=m=>{i.pages={...i.pages,[a]:m}},v=n>1?o`<nav part="pager" class="pager" aria-label=${l(e,"pages")}>
        <button part="button button-quiet" class="quiet" ?disabled=${r===0} @click=${()=>d(r-1)}>‹ ${l(e,"page_prev")}</button>
        <span part="time" class="pager-count" aria-live="polite">${c+1}–${Math.min(t.length,c+s)} ${l(e,"of")} ${t.length}</span>
        <button part="button button-quiet" class="quiet" ?disabled=${r===n-1} @click=${()=>d(r+1)}>${l(e,"page_next")} ›</button>
      </nav>`:h;return{items:t.slice(c,c+s),nav:v,offset:c}}var A=class extends b{constructor(){super(...arguments);this.open=[];this.resolved=[];this.pending=[];this.decided=[];this.expanded=new URLSearchParams(location.search).get("situation");this.error="";this.pages={};this.unsubs=[];this.subscribing=!1;this.scrolled=!1}connectedCallback(){super.connectedCallback(),this.subscribe()}disconnectedCallback(){super.disconnectedCallback(),this.unsubs.forEach(t=>t()),this.unsubs=[]}async subscribe(){if(!(!this.hass||this.unsubs.length||this.subscribing)){this.subscribing=!0;try{let t=this.hass.language,e=await this.hass.connection.subscribeMessage(c=>{c.type==="situations"&&c.situations&&(this.open=c.situations)},{type:"homeai/situations/subscribe",language:t}),s=await this.hass.connection.subscribeMessage(c=>this.pending=c.pending,{type:"homeai/approvals/subscribe"});if(!this.isConnected){e(),s();return}this.unsubs=[e,s];let[n,r]=await Promise.all([this.hass.callWS({type:"homeai/situations/list",resolved:100,language:t}),this.hass.callWS({type:"homeai/approvals/list"})]);this.resolved=n.resolved,this.decided=r.recent.filter(c=>c.status!=="pending")}catch(t){this.error=t?.message??String(t)}finally{this.subscribing=!1}}}groups(){let t=[...this.open].sort((e,s)=>s.severity-e.severity||(s.opened_at||s.first_seen).localeCompare(e.opened_at||e.first_seen));return[t.filter(e=>e.severity>=2),t.filter(e=>e.severity<2)]}willUpdate(t){if(!t.has("open")||!this.expanded||this.scrolled)return;let[e,s]=this.groups();for(let[n,r]of[["needs_attention",e],["for_info",s]]){let c=r.findIndex(d=>d.id===this.expanded);c>=0&&(this.pages={...this.pages,[n]:Math.floor(c/qt)})}}updated(){if(this.scrolled||!this.expanded)return;let t=this.renderRoot.querySelector(`[data-id="${CSS.escape(this.expanded)}"]`);t&&(this.scrolled=!0,t.scrollIntoView({block:"center"}))}async act(t,e){await this.hass.callWS({type:`homeai/situations/${t}`,situation_id:e.id})}async decide(t,e){this.error="";try{await this.hass.callWS({type:`homeai/approvals/${t}`,approval_id:e.id})}catch(s){this.error=s?.message??String(s)}}toggle(t){this.expanded=this.expanded===t?null:t}approval(t){let e=this.hass.language,s=this.hass.config?.time_zone;return o`<li part="row" class="approval">
      <div class="item-main">
        <span class="item-text"><span part="row-title" class="item-title">${t.what}</span>
          <span part="row-meta" class="item-meta">${t.reason?`${t.reason} \xB7 `:""}${l(e,"expires")} ${st(t.expires,e,s)}</span></span>
        <span class="item-actions">
          <button part="button" @click=${()=>this.decide("deny",t)}>${l(e,"deny")}</button>
          <button part="button button-primary" class="primary" @click=${()=>this.decide("approve",t)}>${l(e,"approve")}</button>
        </span>
      </div>
    </li>`}situation(t){let e=this.hass.language,s=this.hass.config?.time_zone,n=t.assessment||{},r=this.expanded===t.id,c=["waiting","trying","verifying"].includes(t.repair?.status),d=[t.description,c?l(e,"repairing"):"",t.acked_by?`\u2713 ${t.acked_by}`:""].filter(Boolean).join(" \xB7 ");return o`<li part="row" class=${r?"open":""} data-id=${t.id}>
      <button class="item-main" aria-expanded=${r?"true":"false"} @click=${()=>this.toggle(t.id)}>
        <span part="badge badge-${t.severity}" class="dot sev-${t.severity}" title=${`${l(e,"severity")} ${t.severity}`}></span>
        <span class="item-text"><span part="row-title" class="item-title">${t.title}</span>
          ${d?o`<span part="row-meta" class="item-meta">${d}</span>`:h}</span>
        <span part="time" class="item-aside">${st(t.opened_at||t.first_seen,e,s)}</span>
      </button>
      ${r?o`<div class="item-more">
            ${n.reason?o`<p><span class="muted">${l(e,"reason")}:</span> ${n.reason}</p>`:h}
            ${n.steps?.length?o`<ol>${n.steps.map(v=>o`<li>${v}</li>`)}</ol>`:h}
            ${c?o`<p class="muted">${l(e,"repairing")} (${t.repair.playbook})</p>`:h}
            ${t.acked_by?o`<p class="muted">${l(e,"acked_by")} ${t.acked_by}</p>`:h}
            <p class="muted">${l(e,"since")} ${D(t.opened_at||t.first_seen,e)}</p>
            <div class="item-actions">
              <button part="button button-primary" class="primary" @click=${()=>this.act("handle",t)}>${l(e,"handle")}</button>
              <button part="button" @click=${()=>this.act("ack",t)} ?disabled=${!!t.acked_by}>${l(e,"ack")}</button>
              <button part="button" @click=${()=>this.act("snooze",t)}>${l(e,"snooze")}</button>
              <button part="button button-quiet" class="quiet" @click=${()=>this.act("dismiss",t)}>${l(e,"dismiss")}</button>
            </div>
          </div>`:h}
    </li>`}group(t,e){if(!e.length)return h;let s=$(this,t,e,this.hass.language);return o`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${l(this.hass.language,t)} <span class="count">${e.length}</span></h2></div>
      <ul part="card list" class="list">${s.items.map(n=>this.situation(n))}</ul>
      ${s.nav}
    </section>`}render(){let t=this.hass.language,e=this.hass.config?.time_zone,[s,n]=this.groups(),r=$(this,"pending",this.pending,t),c=$(this,"resolved",this.resolved,t),d=$(this,"decided",this.decided,t);return o`
      ${this.error?o`<div part="card error" class="card error">${this.error}</div>`:h}
      ${this.pending.length?o`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${l(t,"waiting_approval")} <span class="count">${this.pending.length}</span></h2></div>
            <ul part="card list" class="list">${r.items.map(v=>this.approval(v))}</ul>
            ${r.nav}
          </section>`:h}
      ${this.group("needs_attention",s)}
      ${this.group("for_info",n)}
      ${!this.pending.length&&!this.open.length?o`<div part="empty" class="empty">${l(t,"nothing_open")}</div>`:h}
      ${this.resolved.length?o`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${l(t,"resolved")} <span class="count">${this.resolved.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${c.items.map(v=>o`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${v.title}</span></span>
              <span part="time" class="item-aside">${st(v.opened_at||v.first_seen,t,e)}</span></div></li>`)}</ul>
            ${c.nav}
          </details>`:h}
      ${this.decided.length?o`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${l(t,"decided")} <span class="count">${this.decided.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${d.items.map(v=>o`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${v.what}</span>
                <span part="row-meta" class="item-meta">${l(t,`status_${v.status}`).replace(/^status_/,"")}${v.decided_by?` \xB7 ${v.decided_by}`:""}</span></span>
              <span part="time" class="item-aside">${st(v.created,t,e)}</span></div></li>`)}</ul>
            ${d.nav}
          </details>`:h}
    `}};A.styles=[x,E`
      :host { container-type: inline-size; }
      /* a request: its two answers beside it, or under it on a phone */
      .approval .item-main { grid-template-columns: minmax(0, 1fr) auto; }
      @container (max-width: 34em) {
        .approval .item-main { grid-template-columns: minmax(0, 1fr); row-gap: var(--_space); }
        .approval .item-actions { justify-content: flex-end; }
      }
    `],p([f({attribute:!1})],A.prototype,"hass",2),p([u()],A.prototype,"open",2),p([u()],A.prototype,"resolved",2),p([u()],A.prototype,"pending",2),p([u()],A.prototype,"decided",2),p([u()],A.prototype,"expanded",2),p([u()],A.prototype,"error",2),p([u()],A.prototype,"pages",2),A=p([k("homeai-situations")],A);var De=["once","daily","weekly","sun"],We=["sunrise","sunset","dawn","dusk","solar_noon"],Ne=["home_or_all","home","all","admins"],Oe=["light.turn_on","light.turn_off","switch.turn_on","switch.turn_off","cover.open_cover","cover.close_cover","climate.set_temperature","scene.turn_on","script.turn_on","media_player.media_stop","fan.turn_off","input_boolean.turn_on","input_boolean.turn_off"];function Le(){let i=new Date;return`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`}function Ue(){return{type:"action",title:"",service:"light.turn_off",entities:"",data:"",reminder:"",to:"home_or_all",when:{kind:"daily",time:"08:00"},enabled:!0,skip_when_away:!1}}function le(i){return{id:i.id,type:i.reminder?"reminder":"action",title:i.title,service:i.action?.service??"",entities:(i.action?.entity_ids??[]).join(", "),data:i.action&&Object.keys(i.action.data).length?JSON.stringify(i.action.data):"",reminder:i.reminder??"",to:i.to??"home_or_all",when:{...i.when},enabled:i.enabled,skip_when_away:i.skip_when_away}}function qe(i,a){let t=Array.from({length:7},(s,n)=>new Date(2024,0,1+n).toLocaleDateString(a,{weekday:"short"})),e=i.days?.length?i.days.map(s=>t[s]).join(", "):"";switch(i.kind){case"once":return`${i.date} ${i.time}`;case"daily":return`${l(a,"plan_daily")} ${i.time}`;case"weekly":return`${e} ${i.time}`;case"sun":{let s=i.offset?` ${i.offset>0?"+":""}${i.offset} min`:"";return`${l(a,`plan_${i.event}`)}${s}${e?` \xB7 ${e}`:""}`}default:return JSON.stringify(i)}}var C=class extends b{constructor(){super(...arguments);this.occurrences=[];this.entries=[];this.watches=[];this.error="";this.pages={};this.expanded=null}connectedCallback(){super.connectedCallback(),this.load()}async load(){let t=await this.hass.callWS({type:"homeai/plan/list",days:31});this.entries=t.entries,this.occurrences=t.occurrences;try{this.watches=(await this.hass.callWS({type:"homeai/watches/list"})).items}catch{this.watches=[]}}async removeWatch(t){await this.hass.callWS({type:"homeai/watches/delete",watch_id:t}),await this.load()}async removeEntry(t){confirm(l(this.hass.language,"remove_confirm"))&&(await this.hass.callWS({type:"homeai/plan/delete",entry_id:t}),this.close(),await this.load())}async skip(t){let e=tt(t.at,this.hass.config?.time_zone).date;await this.hass.callService("homeai","plan_skip",{entry_id:t.entry_id,date:e}),this.expanded=null,await this.load()}set(t){this.draft={...this.draft,...t}}setWhen(t){let e={...this.draft.when,...t};t.kind&&(e.kind==="once"&&!e.date&&(e.date=Le()),e.kind==="weekly"&&!e.days?.length&&(e.days=[0,1,2,3,4]),e.kind==="sun"&&!e.event&&(e.event="sunset"),e.kind!=="sun"&&!e.time&&(e.time="08:00")),this.set({when:e})}toggleDay(t){let e=new Set(this.draft.when.days??[]);e.has(t)?e.delete(t):e.add(t),this.setWhen({days:[...e].sort()})}async save(){let t=this.draft,e={kind:t.when.kind};t.when.kind!=="sun"&&(e.time=t.when.time),t.when.kind==="once"&&(e.date=t.when.date),(t.when.kind==="weekly"||t.when.kind==="sun"&&t.when.days?.length)&&(e.days=t.when.days),t.when.kind==="sun"&&(e.event=t.when.event,e.offset=Number(t.when.offset??0));let s={title:t.title,when:e,enabled:t.enabled,skip_when_away:t.skip_when_away};if(t.type==="reminder")s.reminder=t.reminder,s.to=t.to;else{let n={};try{n=t.data.trim()?JSON.parse(t.data):{}}catch(r){this.error=`JSON: ${r}`;return}s.action={service:t.service.trim(),entity_ids:t.entities.split(/[\s,]+/).filter(Boolean),data:n}}try{await this.hass.callWS({type:"homeai/plan/save",entry:s,...t.id?{entry_id:t.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(n){this.error=`${l(this.hass.language,"plan_error")}: ${n?.message??n}`}}close(){this.draft=void 0,this.error=""}updated(){let t=this.renderRoot.querySelector("dialog");t&&!t.open&&t.showModal()}form(){let t=this.hass.language,e=this.draft,s=e.when,n=Array.from({length:7},(c,d)=>new Date(2024,0,1+d).toLocaleDateString(t,{weekday:"short"})),r=(c,d)=>o`<label class="field"><span class="label">${c}</span>${d}</label>`;return o`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${l(t,e.id?"plan_change":"plan_new")}</h2></div>
      <div class="sheet-body fields">
        <div class="segmented" role="group" aria-label=${l(t,"plan_type")}>
          ${["action","reminder"].map(c=>o`<button part=${c===e.type?"button button-primary":"button"} class=${c===e.type?"primary":""}
            aria-pressed=${c===e.type?"true":"false"} @click=${()=>this.set({type:c})}>${l(t,`plan_${c}`)}</button>`)}
        </div>
        ${r(l(t,"rule_name"),o`<input part="input" .value=${e.title} @input=${c=>this.set({title:c.target.value})} />`)}
        ${e.type==="reminder"?o`${r(l(t,"plan_reminder_text"),o`<input part="input" .value=${e.reminder} @input=${c=>this.set({reminder:c.target.value})} />`)}
            ${r(l(t,"plan_to"),o`<select part="input" @change=${c=>this.set({to:c.target.value})}>
              ${Ne.map(c=>o`<option value=${c} ?selected=${c===e.to}>${l(t,`plan_to_${c}`)}</option>`)}</select>`)}`:o`${r(l(t,"plan_service"),o`<input part="input" list="homeai-services" .value=${e.service} @input=${c=>this.set({service:c.target.value})} />
              <datalist id="homeai-services">${Oe.map(c=>o`<option value=${c}></option>`)}</datalist>`)}
            ${r(l(t,"rule_entities"),o`<input part="input" list="homeai-entities" placeholder="light.kitchen, light.hall" .value=${e.entities} @input=${c=>this.set({entities:c.target.value})} />
              <datalist id="homeai-entities">${Object.keys(this.hass.states).map(c=>o`<option value=${c}></option>`)}</datalist>`)}
            ${r(l(t,"plan_data"),o`<input part="input" placeholder='{"brightness_pct": 30}' .value=${e.data} @input=${c=>this.set({data:c.target.value})} />`)}`}
        <div class="pair">
          ${r(l(t,"plan_when"),o`<select part="input" @change=${c=>this.setWhen({kind:c.target.value})}>
            ${De.map(c=>o`<option value=${c} ?selected=${c===s.kind}>${l(t,`plan_${c}`)}</option>`)}</select>`)}
          ${s.kind==="once"?r("\xA0",o`<input part="input" type="date" .value=${s.date??""} @change=${c=>this.setWhen({date:c.target.value})} />`):h}
          ${s.kind==="sun"?o`${r("\xA0",o`<select part="input" @change=${c=>this.setWhen({event:c.target.value})}>
                ${We.map(c=>o`<option value=${c} ?selected=${c===s.event}>${l(t,`plan_${c}`)}</option>`)}</select>`)}
              ${r("\xB1 min",o`<input part="input" type="number" min="-720" max="720" .value=${String(s.offset??0)} @change=${c=>this.setWhen({offset:parseInt(c.target.value,10)||0})} />`)}`:r("\xA0",o`<input part="input" type="time" .value=${s.time??""} @change=${c=>this.setWhen({time:c.target.value})} />`)}
        </div>
        ${s.kind==="weekly"||s.kind==="sun"?o`<div class="chips" role="group">${n.map((c,d)=>o`<button part=${(s.days??[]).includes(d)?"button button-primary":"button"} aria-pressed=${(s.days??[]).includes(d)?"true":"false"} @click=${()=>this.toggleDay(d)}>${c}</button>`)}</div>`:h}
        <label class="check"><input part="input" type="checkbox" .checked=${e.skip_when_away} @change=${c=>this.set({skip_when_away:c.target.checked})} />${l(t,"plan_skip_away")}</label>
        <label class="check"><input part="input" type="checkbox" .checked=${e.enabled} @change=${c=>this.set({enabled:c.target.checked})} />${l(t,"rule_enabled")}</label>
        ${this.error?o`<div part="error" class="error">${this.error}</div>`:h}
      </div>
      <div class="sheet-foot">
        ${e.id?o`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeEntry(e.id)}>${l(t,"remove")}</button>`:h}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${l(t,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${l(t,"save")}</button>
      </div>
    </dialog>`}timeline(){let t=this.hass.language,e=this.hass.config?.time_zone,s=$(this,"next",this.occurrences,t,15),n=s.items,r=[],c="";return n.forEach((d,v)=>{let m=j(d.at,e);m!==c&&(r.push(o`<li part="day" class="day">${rt(d.at,t,e)}</li>`),c=m);let g=`${d.entry_id}|${d.at}|${s.offset+v}`,y=this.expanded===g,_=d.external?this.hass.states[d.source??""]?.attributes.friendly_name??d.source??"":"",w=_&&!d.title.toLowerCase().includes(String(_).toLowerCase())?`${l(t,"from_source")} ${_}`:"",P=o`<span part="time" class="time">${et(d.at,t,e)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${d.title}</span>${w?o`<span part="row-meta" class="item-meta">${w}</span>`:h}</span>
        <span></span>`;r.push(d.external?o`<li part="row"><div class="item-main timed">${P}</div></li>`:o`<li part="row" class=${y?"open":""}>
            <button class="item-main timed" aria-expanded=${y?"true":"false"} @click=${()=>this.expanded=y?null:g}>${P}</button>
            ${y?o`<div class="item-more"><div class="item-actions">
                  <button part="button" @click=${()=>this.skip(d)}>${l(t,"plan_skip_once")}</button>
                  ${this.entries.some(lt=>lt.id===d.entry_id)?o`<button part="button button-quiet" class="quiet" @click=${()=>this.edit(d.entry_id)}>${l(t,"plan_edit_entry")}</button>`:h}
                </div></div>`:h}
          </li>`)}),o`<ul part="card list" class="list">${r}</ul>${s.nav}`}edit(t){let e=this.entries.find(s=>s.id===t);e&&(this.draft=le(e))}render(){let t=this.hass.language;return o`
      ${this.draft?this.form():h}
      <div class="columns">
        <section class="section">
          <div class="section-head"><h2 part="heading" class="heading">${l(t,"plan_next")}</h2>
            <button part="button button-primary" class="primary" @click=${()=>this.draft=Ue()}>${l(t,"plan_add")}</button></div>
          ${this.occurrences.length?this.timeline():o`<div part="empty" class="empty">${l(t,"no_plan")}</div>`}
        </section>
        <div>
          ${this.watches.length?o`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${l(t,"watching")} <span class="count">${this.watches.length}</span></h2></div>
                <ul part="card list" class="list">${$(this,"watches",this.watches,t).items.map(e=>{let s=this.expanded===`watch|${e.id}`;return o`<li part="row" class=${s?"open":""}>
                    <button class="item-main plain" aria-expanded=${s?"true":"false"} @click=${()=>this.expanded=s?null:`watch|${e.id}`}>
                      <span class="item-text"><span part="row-title" class="item-title">${e.what}</span>
                        <span part="row-meta" class="item-meta">${e.message?`${e.message} \xB7 `:""}${l(t,"until")} ${D(e.expires,t)}</span></span>
                      <span></span>
                    </button>
                    ${s?o`<div class="item-more flush"><div class="item-actions">
                      <button part="button" @click=${()=>this.removeWatch(e.id)}>${l(t,"watch_stop")}</button></div></div>`:h}
                  </li>`})}</ul>
                ${$(this,"watches",this.watches,t).nav}
              </section>`:h}
          ${this.entries.length?o`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${l(t,"plan_entries")} <span class="count">${this.entries.length}</span></h2></div>
                <ul part="card list" class="list">${$(this,"entries",this.entries,t).items.map(e=>o`<li part="row">
                  <button class="item-main plain" @click=${()=>this.draft=le(e)}>
                    <span class="item-text"><span part="row-title" class="item-title ${e.enabled?"":"off"}">${e.title}</span>
                      <span part="row-meta" class="item-meta">${qe(e.when,t)} · ${e.author_name}${e.enabled?"":` \xB7 ${l(t,"entry_off")}`}</span></span>
                    <span class="chevron">›</span>
                  </button></li>`)}</ul>
                ${$(this,"entries",this.entries,t).nav}
              </section>`:h}
        </div>
      </div>`}};C.styles=[x,E`
      /* a wide screen: what comes next on the left, what is set up on the right */
      :host { container-type: inline-size; }
      @container (min-width: 56em) {
        .columns { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); column-gap: var(--_section-spacing); align-items: start; }
      }
    `],p([f({attribute:!1})],C.prototype,"hass",2),p([u()],C.prototype,"occurrences",2),p([u()],C.prototype,"entries",2),p([u()],C.prototype,"watches",2),p([u()],C.prototype,"draft",2),p([u()],C.prototype,"error",2),p([u()],C.prototype,"pages",2),p([u()],C.prototype,"expanded",2),C=p([k("homeai-plan")],C);var K=class extends b{constructor(){super(...arguments);this.entries=[];this.pages={}}async connectedCallback(){super.connectedCallback();try{let t=await this.hass.callWS({type:"homeai/journal/recent",limit:500});this.entries=t.entries}catch{this.entries=[]}}render(){let t=this.hass.language,e=this.hass.config?.time_zone;if(!this.entries.length)return o`<div part="empty" class="empty">—</div>`;let s=$(this,"entries",this.entries,t,30),n=[],r="";for(let c of s.items){let d=j(c.ts,e);d!==r&&(n.push(o`<li part="day" class="day">${rt(c.ts,t,e)}</li>`),r=d),n.push(o`<li part="row"><div class="item-main timed">
        <span part="time" class="time">${et(c.ts,t,e)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${c.text}</span>
          <span part="row-meta" class="item-meta">${l(t,`kind_${c.kind}`).replace(/^kind_/,"")}</span></span>
        <span></span></div></li>`)}return o`<ul part="card list" class="list">${n}</ul>${s.nav}`}};K.styles=x,p([f({attribute:!1})],K.prototype,"hass",2),p([u()],K.prototype,"entries",2),p([u()],K.prototype,"pages",2),K=p([k("homeai-journal")],K);var B={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},zt=i=>(...a)=>({_$litDirective$:i,values:a}),nt=class{constructor(a){}get _$AU(){return this._$AM._$AU}_$AT(a,t,e){this._$Ct=a,this._$AM=t,this._$Ci=e}_$AS(a,t){return this.update(a,t)}update(a,t){return this.render(...t)}};var{I:Be}=re,ce=i=>i;var pe=i=>i.strings===void 0,de=()=>document.createComment(""),ot=(i,a,t)=>{let e=i._$AA.parentNode,s=a===void 0?i._$AB:a._$AA;if(t===void 0){let n=e.insertBefore(de(),s),r=e.insertBefore(de(),s);t=new Be(n,r,i,i.options)}else{let n=t._$AB.nextSibling,r=t._$AM,c=r!==i;if(c){let d;t._$AQ?.(i),t._$AM=i,t._$AP!==void 0&&(d=i._$AU)!==r._$AU&&t._$AP(d)}if(n!==s||c){let d=t._$AA;for(;d!==n;){let v=ce(d).nextSibling;ce(e).insertBefore(d,s),d=v}}}return t},F=(i,a,t=i)=>(i._$AI(a,t),i),Ve={},Tt=(i,a=Ve)=>i._$AH=a,he=i=>i._$AH,At=i=>{i._$AR(),i._$AA.remove()};var M=zt(class extends nt{constructor(i){if(super(i),i.type!==B.PROPERTY&&i.type!==B.ATTRIBUTE&&i.type!==B.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!pe(i))throw Error("`live` bindings can only contain a single expression")}render(i){return i}update(i,[a]){if(a===z||a===h)return a;let t=i.element,e=i.name;if(i.type===B.PROPERTY){if(a===t[e])return z}else if(i.type===B.BOOLEAN_ATTRIBUTE){if(!!a===t.hasAttribute(e))return z}else if(i.type===B.ATTRIBUTE&&t.getAttribute(e)===a+"")return z;return Tt(i),a}});var ue=(i,a,t)=>{let e=new Map;for(let s=a;s<=t;s++)e.set(i[s],s);return e},me=zt(class extends nt{constructor(i){if(super(i),i.type!==B.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,a,t){let e;t===void 0?t=a:a!==void 0&&(e=a);let s=[],n=[],r=0;for(let c of i)s[r]=e?e(c,r):r,n[r]=t(c,r),r++;return{values:n,keys:s}}render(i,a,t){return this.dt(i,a,t).values}update(i,[a,t,e]){let s=he(i),{values:n,keys:r}=this.dt(a,t,e);if(!Array.isArray(s))return this.ut=r,n;let c=this.ut??=[],d=[],v,m,g=0,y=s.length-1,_=0,w=n.length-1;for(;g<=y&&_<=w;)if(s[g]===null)g++;else if(s[y]===null)y--;else if(c[g]===r[_])d[_]=F(s[g],n[_]),g++,_++;else if(c[y]===r[w])d[w]=F(s[y],n[w]),y--,w--;else if(c[g]===r[w])d[w]=F(s[g],n[w]),ot(i,d[w+1],s[g]),g++,w--;else if(c[y]===r[_])d[_]=F(s[y],n[_]),ot(i,s[g],s[y]),y--,_++;else if(v===void 0&&(v=ue(r,_,w),m=ue(c,g,y)),v.has(c[g]))if(v.has(c[y])){let P=m.get(r[_]),lt=P!==void 0?s[P]:null;if(lt===null){let Bt=ot(i,s[g]);F(Bt,n[_]),d[_]=Bt}else d[_]=F(lt,n[_]),ot(i,s[g],lt),s[P]=null;_++}else At(s[y]),y--;else At(s[g]),g++;for(;_<=w;){let P=ot(i,d[w+1]);F(P,n[_]),d[_++]=P}for(;g<=y;){let P=s[g++];P!==null&&At(P)}return this.ut=r,Tt(i,d),z}});var Ke=["global","floor","area","device","entity","person"],S=class extends b{constructor(){super(...arguments);this.section="general";this.filter="";this.advanced=!1;this.message="";this.scopeType="global";this.scopeRef="";this.scopeValues={};this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}get skey(){return this.scopeType==="global"||!this.scopeRef?"global":`${this.scopeType}:${this.scopeRef}`}async load(){this.schema=await this.hass.callWS({type:"homeai/settings/schema",language:this.hass.language}),this.world||(this.world=await this.hass.callWS({type:"homeai/world/summary"})),await this.loadScope()}async loadScope(){if(this.skey==="global"){this.scopeValues={};return}let t=await this.hass.callWS({type:"homeai/settings/scope",scope:this.skey});this.scopeValues=t.values}targets(){let t=this.hass;switch(this.scopeType){case"floor":return(this.world?.floors??[]).map(e=>({id:e.id,name:e.name}));case"area":return(this.world?.areas??[]).map(e=>({id:e.id,name:e.name}));case"person":return(this.world?.persons??[]).map(e=>({id:e.id,name:e.name}));case"device":return Object.values(t.devices??{}).map(e=>({id:e.id,name:e.name_by_user||e.name||e.id})).sort((e,s)=>e.name.localeCompare(s.name));case"entity":return Object.values(t.states).map(e=>({id:e.entity_id,name:`${e.attributes.friendly_name??e.entity_id} (${e.entity_id})`})).sort((e,s)=>e.name.localeCompare(s.name));default:return[]}}parse(t,e){switch(t.type){case"bool":return!!e;case"int":case"duration":return parseInt(String(e),10);case"float":return parseFloat(String(e));case"multiselect":return e;case"entities":case"strings":return String(e).split(/[\n,]/).map(s=>s.trim()).filter(Boolean);case"json":return JSON.parse(String(e));default:return e}}async save(t,e){let s;try{s=this.parse(t,e)}catch(r){this.message=`${t.label}: ${r}`;return}let n=this.skey;try{if((await this.hass.callWS({type:"homeai/settings/set",key:t.key,value:s,scope:n})).needs_confirmation){if(!confirm(`${t.label}

${l(this.hass.language,"confirm_change")}`)){await this.load();return}await this.hass.callWS({type:"homeai/settings/set",key:t.key,value:s,scope:n,confirmed:!0})}this.message=`${t.label}: ${l(this.hass.language,"saved")}`}catch(r){this.message=r?.message??String(r)}await this.load()}async reset(t){await this.hass.callWS({type:"homeai/settings/reset",key:t.key,scope:this.skey}),await this.load()}async resetSection(){let t=this.schema?.sections.find(s=>s.id===this.section);if(!t||!confirm(`${t.label}

${l(this.hass.language,"reset_section_confirm")}`))return;let e=await this.hass.callWS({type:"homeai/settings/reset_section",section:this.section});this.message=`${t.label}: ${e.reset} \xD7 ${l(this.hass.language,"reset")}`,await this.load()}async undo(){confirm(l(this.hass.language,"undo_confirm"))&&(await this.hass.callWS({type:"homeai/settings/undo"}),await this.load())}async exportSettings(){let t=await this.hass.callWS({type:"homeai/settings/export"}),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=document.createElement("a");s.href=URL.createObjectURL(e),s.download="homeai-settings.json",s.click()}async importSettings(t){let e=t.target,s=e.files?.[0];if(e.value="",!(!s||!confirm(l(this.hass.language,"import_confirm")))){try{let n=JSON.parse(await s.text()),r=await this.hass.callWS({type:"homeai/settings/import",data:n});this.message=`${l(this.hass.language,"import")}: ${r.changed}`}catch(n){this.message=n?.message??String(n)}await this.load()}}async toggleHistory(){if(this.history){this.history=void 0;return}let t=await this.hass.callWS({type:"homeai/settings/history",limit:100});this.history=t.history}input(t,e){let s=n=>{let r=n.target;return t.type==="bool"?this.save(t,r.checked):t.type==="multiselect"?this.save(t,Array.from(r.selectedOptions).map(c=>c.value)):this.save(t,r.value)};switch(t.type){case"bool":return o`<input part="input" type="checkbox" .checked=${M(!!e)} @change=${s} />`;case"select":return o`<select part="input" @change=${s}>${t.options.map(n=>o`<option value=${n} .selected=${M(n===e)}>${t.option_labels?.[n]??n}</option>`)}</select>`;case"multiselect":return o`<select part="input" multiple size=${Math.min(t.options.length,6)} @change=${s}>
          ${t.options.map(n=>o`<option value=${n} .selected=${M((e??[]).includes(n))}>${t.option_labels?.[n]??n}</option>`)}</select>`;case"int":case"float":case"duration":return o`<input part="input" type="number" class="w-m" .value=${M(String(e))} min=${t.min??""} max=${t.max??""}
          step=${t.step??(t.type==="float"?"any":1)} @change=${s} /> ${t.unit??""}`;case"time":return o`<input part="input" type="time" .value=${M(String(e))} @change=${s} />`;case"json":return o`<textarea part="input" .value=${M(JSON.stringify(e,null,2))} @change=${s}></textarea>`;case"entities":case"strings":return o`<textarea part="input" .value=${M((e??[]).join(`
`))} @change=${s} placeholder="one per line"></textarea>`;case"text":return o`<textarea part="input" .value=${M(String(e??""))} @change=${s}></textarea>`;default:return o`<input part="input" type="text" .value=${M(String(e??""))} @change=${s} />`}}scopeBar(){let t=this.hass.language,e=this.targets();return o`<div class="pair">
      <label class="field"><span class="label">${l(t,"scope")}</span><select part="input" @change=${s=>{this.scopeType=s.target.value,this.scopeRef="",this.loadScope()}}>${Ke.map(s=>o`<option value=${s} ?selected=${s===this.scopeType}>${l(t,`scope_${s}`)}</option>`)}</select></label>
      ${this.scopeType==="global"?h:o`<label class="field"><span class="label">\u00a0</span><select part="input" @change=${s=>{this.scopeRef=s.target.value,this.loadScope()}}><option value="">—</option>${e.map(s=>o`<option value=${s.id} ?selected=${s.id===this.scopeRef}>${s.name}</option>`)}</select></label>`}
    </div>`}historyCard(){let t=this.hass.language,e=new Map((this.schema?.settings??[]).map(n=>[n.key,n.label])),s=n=>n==null?"\u2014":typeof n=="object"?JSON.stringify(n):String(n);return o`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${l(t,"history")}</h2>
        <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${l(t,"close")}</button></div>
      <ul part="card list" class="list">${$(this,"history",this.history??[],t,15).items.map(n=>o`<li part="row"><div class="item-main plain">
        <span class="item-text"><span part="row-title" class="item-title">${e.get(n.key)??n.key}${n.scope!=="global"?o` <span class="muted">(${n.scope})</span>`:h}</span>
          <span part="row-meta" class="item-meta">${n.key==="import"?l(t,"import"):n.reset?`${s(n.old)} \u2192 ${l(t,"default")}`:`${s(n.old)} \u2192 ${s(n.new)}`}${n.user?` \xB7 ${n.user}`:""}</span></span>
        <span part="time" class="item-aside">${D(n.ts,t)}</span></div></li>`)}</ul>
      ${$(this,"history",this.history??[],t,15).nav}
    </section>`}render(){let t=this.hass.language;if(!this.hass.user.is_admin)return o`<div part="empty" class="empty">${l(t,"admin_only")}</div>`;if(!this.schema)return h;let e=this.filter.toLowerCase(),s=this.skey!=="global",n=this.schema.sections.find(m=>m.id===this.section)??this.schema.sections[0],r=n?.id??this.section,c=this.schema.settings.filter(m=>(e?`${m.label} ${m.description} ${m.key}`.toLowerCase().includes(e):m.section===r)&&(this.advanced||!m.advanced||e)&&(this.scopeType==="global"||m.scopes.includes(this.scopeType))),d=$(this,`${e?`?${e}`:r}|${this.skey}|${this.advanced}`,c,t,20),v=d.items;return o`
      <div class="tools">
        <input part="input" type="search" placeholder=${l(t,"search")} aria-label=${l(t,"search")} .value=${this.filter} @input=${m=>this.filter=m.target.value} />
        ${this.scopeBar()}
        <label class="check"><input part="input" type="checkbox" .checked=${this.advanced} @change=${m=>this.advanced=m.target.checked} />${l(t,"advanced")}</label>
      </div>
      ${this.history?this.historyCard():h}
      ${this.message?o`<div part="card" class="card muted">${this.message}</div>`:h}
      <div class="layout">
        ${e?o`<div></div>`:o`<nav part="segmented" class="nav glass segmented" aria-label=${l(t,"section")}>
          ${this.schema.sections.map(m=>o`<button part=${m.id===r?"button button-primary":"button"} class=${m.id===r?"primary":""}
            aria-current=${m.id===r?"true":"false"} @click=${()=>this.section=m.id}>${m.label}</button>`)}
        </nav>`}
        <section>
          ${e?h:o`<label class="field picker section"><span class="label">${l(t,"section")}</span>
            <select part="input" @change=${m=>this.section=m.target.value}>
              ${this.schema.sections.map(m=>o`<option value=${m.id} ?selected=${m.id===r}>${m.label}</option>`)}</select></label>`}
          ${e||!n?h:o`<div class="section-head"><h2 part="heading" class="heading">${n.label}</h2>
            ${s?h:o`<button part="button button-quiet" class="quiet" @click=${this.resetSection}>${l(t,"reset_section")}</button>`}</div>
            <p class="hint">${n.description}</p>`}
          ${this.scopeType!=="global"&&!this.scopeRef?o`<div part="empty" class="empty">${l(t,"scope_pick")}</div>`:o`<ul part="card list" class="list">
            ${v.length?h:o`<li class="empty">${l(t,"scope_none")}</li>`}
            ${me(d.items,m=>`${this.skey}|${m.key}`,m=>{let g=s&&m.key in this.scopeValues,y=g?this.scopeValues[m.key]:m.value,_=Object.keys(m.overrides||{}).length,w=g?l(t,"overridden"):s?l(t,"inherited"):_?`${_} \xD7 ${l(t,"overridden")}`:"";return o`<li part="row" class="setting">
                <span class="item-text"><span part="row-title" class="item-title">${m.label}</span>
                  <span part="row-meta" class="item-meta wrap">${m.description}${w?o` · <b>${w}</b>`:h}</span></span>
                ${(s?g:m.source!=="default")?o`<button part="button button-quiet" class="quiet" title=${l(t,"reset")} aria-label=${`${l(t,"reset")}: ${m.label}`} @click=${()=>this.reset(m)}>↺</button>`:o`<span></span>`}
                <span class="control">${this.input(m,y)}</span>
              </li>`})}
          </ul>${d.nav}`}
          <div class="footer">
            <button part="button button-quiet" class="quiet" @click=${this.undo}>${l(t,"undo")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${l(t,"history")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.exportSettings}>${l(t,"export")}</button>
            <span><button part="button button-quiet" class="quiet" @click=${m=>m.currentTarget.nextElementSibling.click()}>${l(t,"import")}</button><input part="input" type="file" accept="application/json,.json" hidden @change=${this.importSettings} /></span>
          </div>
        </section>
      </div>`}};S.styles=[x,E`
      :host { container-type: inline-size; }
      .tools { display: grid; gap: var(--_space); margin-bottom: var(--_section-spacing); }
      .tools input[type="search"] { width: 100%; }
      .layout { display: grid; gap: var(--_section-spacing); }
      .nav { display: none; }
      .nav button { display: block; width: 100%; text-align: start; }
      @container (min-width: 52em) {
        .layout { grid-template-columns: 14em minmax(0, 1fr); align-items: start; }
        .nav { display: grid; gap: var(--_space-s); position: sticky; top: calc(var(--header-height) + var(--_space-l)); }
        .picker { display: none; }
      }
      .setting { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; column-gap: var(--_space-l);
        row-gap: var(--_space); padding: var(--_row-y) var(--_row-x); }
      .setting .control { justify-self: end; max-width: 18em; }
      .setting .control textarea, .setting .control select[multiple] { width: 18em; max-width: 100%; }
      @container (max-width: 34em) {
        .setting { grid-template-columns: minmax(0, 1fr) auto; }
        .setting .control { grid-column: 1 / -1; justify-self: stretch; max-width: none; }
        .setting .control > * { width: 100%; }
      }
      .footer { display: flex; flex-wrap: wrap; gap: var(--_space); margin-top: var(--_section-spacing); }
    `],p([f({attribute:!1})],S.prototype,"hass",2),p([u()],S.prototype,"schema",2),p([u()],S.prototype,"world",2),p([u()],S.prototype,"section",2),p([u()],S.prototype,"filter",2),p([u()],S.prototype,"advanced",2),p([u()],S.prototype,"message",2),p([u()],S.prototype,"scopeType",2),p([u()],S.prototype,"scopeRef",2),p([u()],S.prototype,"scopeValues",2),p([u()],S.prototype,"history",2),p([u()],S.prototype,"pages",2),S=p([k("homeai-settings")],S);var L=class extends b{constructor(){super(...arguments);this.prompts=[];this.message="";this.drafts={}}async connectedCallback(){if(super.connectedCallback(),!!this.hass.user.is_admin)try{this.status=await this.hass.callWS({type:"homeai/ai/status"}),await this.loadPrompts()}catch(t){this.status={enabled:!1},this.message=t?.message??String(t)}}async loadPrompts(){this.prompts=(await this.hass.callWS({type:"homeai/ai/prompts"})).prompts}async savePrompt(t,e){try{await this.hass.callWS({type:"homeai/settings/set",key:t.key,value:e}),this.message=`${l(this.hass.language,`prompt_${t.mission}`)}: ${l(this.hass.language,"saved")}`;let{[t.mission]:s,...n}=this.drafts;this.drafts=n}catch(s){this.message=s?.message??String(s)}await this.loadPrompts()}async restorePrompt(t){await this.hass.callWS({type:"homeai/settings/reset",key:t.key}),this.message=`${l(this.hass.language,`prompt_${t.mission}`)}: ${l(this.hass.language,"prompt_restored")}`;let{[t.mission]:e,...s}=this.drafts;this.drafts=s,await this.loadPrompts()}promptCard(t){let e=this.hass.language,s=this.drafts[t.mission]??(t.custom||t.default);return o`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${l(e,`prompt_${t.mission}`)}</span>
        <span class="muted">${t.custom?l(e,"prompt_custom"):l(e,"prompt_default")}</span></summary>
      <p class="muted">${l(e,"prompt_hint")}</p>
      <textarea part="input" class="tall" .value=${M(s)} @input=${n=>this.drafts={...this.drafts,[t.mission]:n.target.value}}></textarea>
      <div class="row actions">
        <button part="button button-primary" class="primary" @click=${()=>this.savePrompt(t,s.trim()===t.default.trim()?"":s)}>${l(e,"save")}</button>
        ${t.custom?o`<button part="button" @click=${()=>this.restorePrompt(t)}>${l(e,"prompt_restore")}</button>`:h}
      </div>
      ${t.custom?o`<details><summary class="muted">${l(e,"prompt_show_default")}</summary><textarea part="input" readonly class="tall">${t.default}</textarea></details>`:h}
    </details>`}render(){let t=this.hass.language;if(!this.hass.user.is_admin)return o`<div part="empty" class="empty">${l(t,"admin_only")}</div>`;let e=this.status;if(!e)return h;let s=Object.entries(e.tiers??{}),n=(r,c)=>o`<li part="row"><div class="item-main plain">
      <span class="item-text"><span part="row-meta" class="item-meta">${r}</span><span part="row-title" class="item-title title">${c}</span></span></div></li>`;return o`
      <section class="section">
        <ul part="card list" class="list">
          ${n(l(t,"cost_today"),`$${(e.ledger?.today??0).toFixed(3)}`)}
          ${n(l(t,"cost_month"),`$${(e.ledger?.month??0).toFixed(2)}`)}
          ${(e.ledger?.limits??[]).map(r=>n(l(t,`limit_${r.period}`),`$${r.spent.toFixed(2)} / $${r.limit}`))}
        </ul>
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"tiers")}</h2></div>
        ${s.length?o`<ul part="card list" class="list">${s.flatMap(([r,c])=>c.map(d=>o`<li part="row"><div class="item-main">
              <b>${r.toUpperCase()}</b>
              <span class="item-text"><span part="row-title" class="item-title">${d.model}</span><span part="row-meta" class="item-meta">${d.provider} · ${d.priority}</span></span>
              <span part="time" class="item-aside">${d.status??"\u2014"}</span></div></li>`))}</ul>`:o`<p class="hint">${l(t,"no_tiers")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"prompts")}</h2></div>
        ${this.message?o`<p class="hint">${this.message}</p>`:h}
        ${this.prompts.map(r=>this.promptCard(r))}
      </section>
      ${Object.keys(e.last_prompts??{}).length?o`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${l(t,"last_prompt")}</h2></div>
            ${Object.entries(e.last_prompts??{}).map(([r,c])=>o`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${r.toUpperCase()} · ${c.model} · ${c.purpose}</span>
                <span class="muted">$${c.cost.toFixed(4)}</span></summary>
                <p class="muted">${c.ts}</p><textarea part="input" readonly>${JSON.stringify(c.messages,null,2)}</textarea><textarea part="input" readonly>${c.answer}</textarea></details>`)}
          </section>`:h}`}};L.styles=x,p([f({attribute:!1})],L.prototype,"hass",2),p([u()],L.prototype,"status",2),p([u()],L.prototype,"prompts",2),p([u()],L.prototype,"message",2),p([u()],L.prototype,"drafts",2),L=p([k("homeai-ai")],L);var W=class extends b{constructor(){super(...arguments);this.proposals=[];this.facts=[];this.reviews=[];this.draft="";this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}async load(){let t=await this.hass.callWS({type:"homeai/learning/status"});this.proposals=t.proposals,this.facts=t.facts,this.reviews=t.reviews}async call(t,e){await this.hass.callWS({type:t,...e}),await this.load()}async remember(){this.draft.trim()&&(await this.call("homeai/memory/add",{text:this.draft}),this.draft="")}render(){let t=this.hass.language,e=s=>s.scope==="home"?l(t,"memory_home"):this.hass.states[s.scope.replace(/^person:/,"")]?.attributes.friendly_name??s.scope;return o`
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"proposals")}${this.proposals.length?o` <span class="count">${this.proposals.length}</span>`:h}</h2></div>
        ${this.proposals.length?o`<ul part="card list" class="list">${$(this,"proposals",this.proposals,t).items.map(s=>o`<li part="row" class="open">
              <div class="item-main plain"><span class="item-text"><span part="row-title" class="item-title">${s.title}</span>
                <span part="row-meta" class="item-meta">${s.days_seen} ${l(t,"days_of")} ${s.days_possible} ${l(t,"days_word")}</span></span></div>
              <div class="item-more flush"><div class="item-actions end">
                <button part="button" @click=${()=>this.call("homeai/learning/reject",{proposal_id:s.id})}>${l(t,"deny")}</button>
                <button part="button button-primary" class="primary" @click=${()=>this.call("homeai/learning/approve",{proposal_id:s.id})}>${l(t,"approve")}</button>
              </div></div></li>`)}</ul>${$(this,"proposals",this.proposals,t).nav}`:o`<p class="hint">${l(t,"no_proposals")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"memory")}${this.facts.length?o` <span class="count">${this.facts.length}</span>`:h}</h2></div>
        <ul part="card list" class="list">
          <li part="row"><div class="item-main plain">
            <input part="input" .value=${this.draft} placeholder=${l(t,"remember_hint")} aria-label=${l(t,"remember_hint")}
              @input=${s=>this.draft=s.target.value} @keydown=${s=>s.key==="Enter"&&this.remember()} />
            <button part="button" ?disabled=${!this.draft.trim()} @click=${this.remember}>${l(t,"remember")}</button>
          </div></li>
          ${$(this,"facts",this.facts,t).items.map(s=>o`<li part="row"><div class="item-main plain">
            <span class="item-text"><span part="row-title" class="item-title">${s.text}</span>
              <span part="row-meta" class="item-meta">${e(s)} · ${l(t,`memory_from_${s.source}`)}</span></span>
            <span class="item-actions">
              ${s.approved?h:o`<button part="button" @click=${()=>this.call("homeai/memory/approve",{fact_id:s.id})}>${l(t,"approve")}</button>`}
              <button part="button button-quiet" class="quiet" aria-label=${`${l(t,"remove")}: ${s.text}`} @click=${()=>this.call("homeai/memory/remove",{fact_id:s.id})}>${l(t,"remove")}</button>
            </span></div></li>`)}
        </ul>
        ${$(this,"facts",this.facts,t).nav}
      </section>
      ${this.reviews.length?o`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${l(t,"review")}</h2><span class="muted">${D(this.reviews[0].ts,t)}</span></div>
            <div part="card" class="card"><p class="pre-line">${this.reviews[0].text}</p></div>
          </section>`:h}
    `}};W.styles=x,p([f({attribute:!1})],W.prototype,"hass",2),p([u()],W.prototype,"proposals",2),p([u()],W.prototype,"facts",2),p([u()],W.prototype,"reviews",2),p([u()],W.prototype,"draft",2),p([u()],W.prototype,"pages",2),W=p([k("homeai-learning")],W);var Fe={id:"",name:"",enabled:!0,target:{entities:[],label:null,area:null,domain:null},condition:{type:"state",value:"on"},minutes:10,severity:1,category:"info",need:"member",advice:"",when:"always",mode:"each"},Ze=["state","not_state","above","below","unavailable"],Je=["safety","security","damage","system","energy","comfort","maintenance","info"],He=["nobody","member","admin","service"],Ge=["always","night","away","home"],N=class extends b{constructor(){super(...arguments);this.rules=[];this.error="";this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}async load(){let t=await this.hass.callWS({type:"homeai/rules/list"});this.rules=t.rules}async saveAll(t){this.error="";try{await this.hass.callWS({type:"homeai/rules/save",rules:t.map(({firing:e,...s})=>s)}),this.editing=void 0,this.preview=void 0,await this.load()}catch(e){this.error=e?.message??String(e)}}async save(){let t=this.editing;if(!t.id){let s=t.name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").slice(0,36)||"rule",n=new Set(this.rules.map(c=>c.id)),r=s;for(let c=2;n.has(r);c++)r=`${s}_${c}`;t.id=r}let e=this.rules.filter(s=>s.id!==t.id);await this.saveAll([...e,t])}async previewRule(){this.error="";try{this.preview=await this.hass.callWS({type:"homeai/rules/preview",rule:this.editing})}catch(t){this.error=t?.message??String(t)}}set(t,e){let s=structuredClone(this.editing),n=t.split("."),r=s;for(let c of n.slice(0,-1))r=r[c];r[n[n.length-1]]=e,this.editing=s}field(t,e){return o`<label class="field"><span class="label">${t}</span>${e}</label>`}close(){this.editing=void 0,this.preview=void 0,this.error=""}updated(){let t=this.renderRoot.querySelector("dialog");t&&!t.open&&t.showModal()}async removeRule(t){confirm(`${t.name}

${l(this.hass.language,"remove_confirm")}`)&&await this.saveAll(this.rules.filter(e=>e.id!==t.id))}select(t,e,s){return o`<select part="input" @change=${n=>this.set(t,n.target.value)}>
      ${s.map(n=>o`<option value=${n} ?selected=${n===e}>${l(this.hass.language,`rule_${n}`)}</option>`)}</select>`}renderEditor(){let t=this.hass.language,e=this.editing,s=Object.values(this.hass.areas??{}),n=this.rules.some(r=>r.id===e.id);return o`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${l(t,n?"rule_change":"rule_new")}</h2></div>
      <div class="sheet-body fields">
        ${this.field(l(t,"rule_name"),o`<input part="input" .value=${e.name} @input=${r=>this.set("name",r.target.value)} />`)}
        ${this.field(l(t,"rule_entities"),o`<textarea part="input" .value=${e.target.entities.join(`
`)} placeholder="sensor.freezer"
          @change=${r=>this.set("target.entities",r.target.value.split(/[\n,]/).map(c=>c.trim()).filter(Boolean))}></textarea>`)}
        <div class="pair">
          ${this.field(l(t,"rule_area"),o`<select part="input" @change=${r=>this.set("target.area",r.target.value||null)}>
            <option value="">—</option>${s.map(r=>o`<option value=${r.area_id} ?selected=${r.area_id===e.target.area}>${r.name}</option>`)}</select>`)}
          ${this.field(l(t,"rule_label"),o`<input part="input" .value=${e.target.label??""} @input=${r=>this.set("target.label",r.target.value||null)} />`)}
          ${this.field(l(t,"rule_domain"),o`<input part="input" .value=${e.target.domain??""} placeholder="sensor" @input=${r=>this.set("target.domain",r.target.value||null)} />`)}
        </div>
        <div class="pair">
          ${this.field(l(t,"rule_condition"),this.select("condition.type",e.condition.type,Ze))}
          ${e.condition.type==="unavailable"?h:this.field("\xA0",o`<input part="input" .value=${String(e.condition.value??"")}
            @input=${r=>this.set("condition.value",r.target.value)} />`)}
          ${this.field(`${l(t,"rule_minutes")} (min)`,o`<input part="input" type="number" min="0" max="10080" .value=${String(e.minutes)}
            @change=${r=>this.set("minutes",Number(r.target.value))} />`)}
        </div>
        <div class="pair">
          ${this.field(l(t,"rule_when"),this.select("when",e.when,Ge))}
          ${this.field(l(t,"rule_mode"),this.select("mode",e.mode,["each","all"]))}
        </div>
        <div class="pair">
          ${this.field(l(t,"rule_category"),this.select("category",e.category,Je))}
          ${this.field(l(t,"severity"),o`<input part="input" type="number" min="0" max=${e.category==="safety"?4:3} .value=${String(e.severity)}
            @change=${r=>this.set("severity",Number(r.target.value))} />`)}
          ${this.field(l(t,"who"),this.select("need",e.need,He))}
        </div>
        ${this.field(l(t,"rule_advice"),o`<textarea part="input" .value=${e.advice} @change=${r=>this.set("advice",r.target.value)}></textarea>`)}
        <label class="check"><input part="input" type="checkbox" .checked=${e.enabled} @change=${r=>this.set("enabled",r.target.checked)} />${l(t,"rule_enabled")}</label>
        ${this.preview?o`<p class="muted">${l(t,"rule_covers")}: ${this.preview.covered.length} · ${l(t,"rule_meeting")}: ${this.preview.meeting.map(r=>this.preview.covered.find(c=>c.entity_id===r)?.name??r).join(", ")||"\u2014"}</p>`:h}
        ${this.error?o`<div part="error" class="error">${this.error}</div>`:h}
      </div>
      <div class="sheet-foot">
        ${n?o`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeRule(e)}>${l(t,"remove")}</button>`:h}
        <button part="button button-quiet" class="quiet" @click=${this.previewRule}>${l(t,"rule_preview")}</button>
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${l(t,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${l(t,"save")}</button>
      </div>
    </dialog>`}render(){let t=this.hass.language;return this.hass.user.is_admin?o`
      ${this.editing?this.renderEditor():h}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"rules")}${this.rules.length?o` <span class="count">${this.rules.length}</span>`:h}</h2>
          <button part="button button-primary" class="primary" @click=${()=>{this.editing=structuredClone(Fe),this.preview=void 0}}>${l(t,"rule_add")}</button></div>
        ${!this.editing&&this.error?o`<div part="card error" class="card error">${this.error}</div>`:h}
        ${this.rules.length?o`<ul part="card list" class="list">${$(this,"rules",this.rules,t,15).items.map(e=>o`<li part="row">
              <button class="item-main" @click=${()=>{this.editing=structuredClone(e),this.preview=void 0}}>
                <span part="badge badge-${e.severity}" class="dot sev-${e.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title ${e.enabled?"":"off"}">${e.name}</span>
                  <span part="row-meta" class="item-meta">${l(t,`rule_${e.condition.type}`)}${e.condition.type==="unavailable"?"":` ${e.condition.value??""}`} · ${e.minutes} min · ${l(t,`rule_${e.when}`)}${e.enabled?"":` \xB7 ${l(t,"rule_off")}`}${e.firing?` \xB7 ${l(t,"rule_firing")}`:""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>${$(this,"rules",this.rules,t,15).nav}`:o`<div part="empty" class="empty">${l(t,"no_rules")}</div>`}
      </section>
    `:o`<div part="empty" class="empty">${l(t,"admin_only")}</div>`}};N.styles=x,p([f({attribute:!1})],N.prototype,"hass",2),p([u()],N.prototype,"rules",2),p([u()],N.prototype,"editing",2),p([u()],N.prototype,"preview",2),p([u()],N.prototype,"error",2),p([u()],N.prototype,"pages",2),N=p([k("homeai-rules")],N);var Ye="homeai-chat-conversation";function Qe(i){try{return sessionStorage.getItem(i)}catch{return null}}function ge(i,a){try{a?sessionStorage.setItem(i,a):sessionStorage.removeItem(i)}catch{}}var T=class extends b{constructor(){super(...arguments);this.storageKey=Ye;this.compact=!1;this.fill=!1;this.messages=[];this.busy=!1;this.error="";this.conversation=null}connectedCallback(){super.connectedCallback(),this.conversation=Qe(this.storageKey),this.conversation&&this.loadHistory()}async loadHistory(){let t=await this.hass.callWS({type:"homeai/chat/history",conversation_id:this.conversation});this.messages=t.messages,this.scrollDown()}scrollDown(){this.updateComplete.then(()=>{this.fill?this.renderRoot.querySelector(".composer")?.scrollIntoView({block:"end"}):this.log?.scrollTo({top:this.log.scrollHeight})})}async send(){let t=this.box?.value.trim();if(!(!t||this.busy)){this.box.value="",this.messages=[...this.messages,{role:"user",text:t}],this.busy=!0,this.error="",this.scrollDown();try{let e=await this.hass.callWS({type:"homeai/chat/send",text:t,...this.conversation?{conversation_id:this.conversation}:{}});this.conversation=e.conversation_id,ge(this.storageKey,this.conversation),this.messages=[...this.messages,{role:"assistant",text:e.reply}]}catch(e){this.error=e?.message??String(e)}finally{this.busy=!1,this.scrollDown()}}}restart(){this.conversation=null,ge(this.storageKey,null),this.messages=[]}keydown(t){t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),this.send())}render(){let t=this.hass.language,e=this.messages.length?o`<div class="item-actions end"><button part="button button-quiet" class="quiet" @click=${this.restart}>${l(t,"chat_new")}</button></div>`:h;return o`
      ${this.fill?e:h}
      <div part="log" class="log" aria-live="polite">
        ${this.messages.length?h:o`<div class="muted hint-block">${l(t,"chat_hint")}</div>`}
        ${this.messages.map(s=>o`<div part="message message-${s.role}" class="msg ${s.role}">${s.text}</div>`)}
        ${this.busy?o`<div part="message message-assistant" class="msg assistant muted">…</div>`:h}
      </div>
      ${this.error?o`<div part="error" class="muted error">${this.error}</div>`:h}
      <div class="bottom">
        <div part="composer" class="composer glass">
          <textarea part="input" class="grow" rows="1" placeholder=${l(t,"chat_placeholder")} aria-label=${l(t,"chat_placeholder")} @keydown=${this.keydown} ?disabled=${this.busy}></textarea>
          <button part="button button-primary" class="primary" @click=${this.send} ?disabled=${this.busy}>${l(t,"send")}</button>
        </div>
      </div>
      ${this.fill?h:e}`}};T.styles=[x,E`
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
    `],p([f({attribute:!1})],T.prototype,"hass",2),p([f({attribute:"storage-key"})],T.prototype,"storageKey",2),p([f({type:Boolean})],T.prototype,"compact",2),p([f({type:Boolean,reflect:!0})],T.prototype,"fill",2),p([u()],T.prototype,"messages",2),p([u()],T.prototype,"busy",2),p([u()],T.prototype,"error",2),p([Ut("textarea")],T.prototype,"box",2),p([Ut(".log")],T.prototype,"log",2),T=p([k("homeai-chat")],T);var Xe=["away","vacation","guests","home_office","sick"];function ve(i,a=0){return tt(Date.now()+a*864e5,i).date}function Ct(i,a,t=!1){return tt(new Date(i).getTime()-(t?1e3:0),a).date}function _e(i,a){let t=tt(i,a);return t.hour===0&&t.minute===0}function Ie(i,a,t,e){if(!_e(i,e)||!_e(a,e))return`${D(i,t)} \u2192 ${D(a,t)}`;let s=c=>c.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"short",timeZone:e||void 0}),n=new Date(i),r=new Date(new Date(a).getTime()-1e3);return Ct(i,e)===Ct(a,e,!0)?s(n):`${s(n)} \u2013 ${s(r)}`}var O=class extends b{constructor(){super(...arguments);this.items=[];this.error="";this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}async load(){try{let t=await this.hass.callWS({type:"homeai/presence/list",days:120});this.items=t.items.sort((e,s)=>e.start.localeCompare(s.start)),this.world||(this.world=await this.hass.callWS({type:"homeai/world/summary"}))}catch(t){this.error=t?.message??String(t)}}personName(t){return t?this.world?.persons.find(e=>e.id===t)?.name??t:l(this.hass.language,"presence_everyone")}async save(){let t=this.draft,e={kind:t.kind,person:t.person||null,start:t.start,end:t.end,note:t.note};try{await this.hass.callWS({type:"homeai/presence/save",item:e,...t.id?{exception_id:t.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(s){this.error=s?.message??String(s)}}async removeItem(t){if(confirm(l(this.hass.language,"remove_confirm"))){try{await this.hass.callWS({type:"homeai/presence/delete",exception_id:t}),this.close()}catch(e){this.error=e?.message??String(e)}await this.load()}}close(){this.draft=void 0,this.error=""}updated(){let t=this.renderRoot.querySelector("dialog");t&&!t.open&&t.showModal()}form(){let t=this.hass.language,e=this.draft,s=r=>this.draft={...e,...r},n=(r,c)=>o`<label class="field"><span class="label">${r}</span>${c}</label>`;return o`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${l(t,e.id?"presence_change":"presence_new")}</h2></div>
      <div class="sheet-body fields">
        <div class="pair">
          ${n(l(t,"presence_kind"),o`<select part="input" @change=${r=>s({kind:r.target.value})}>
            ${Xe.map(r=>o`<option value=${r} ?selected=${r===e.kind}>${l(t,`presence_${r}`)}</option>`)}</select>`)}
          ${n(l(t,"presence_person"),o`<select part="input" @change=${r=>s({person:r.target.value})}>
            <option value="" ?selected=${!e.person}>${l(t,"presence_everyone")}</option>
            ${(this.world?.persons??[]).map(r=>o`<option value=${r.id} ?selected=${r.id===e.person}>${r.name}</option>`)}</select>`)}
        </div>
        <div class="pair">
          ${n(l(t,"presence_from"),o`<input part="input" type="date" .value=${e.start} @change=${r=>s({start:r.target.value})} />`)}
          ${n(l(t,"presence_to"),o`<input part="input" type="date" .value=${e.end} @change=${r=>s({end:r.target.value})} />`)}
        </div>
        ${n(l(t,"presence_note"),o`<input part="input" maxlength="300" .value=${e.note} @input=${r=>s({note:r.target.value})} />`)}
        ${this.error?o`<div part="error" class="error">${this.error}</div>`:h}
      </div>
      <div class="sheet-foot">
        ${e.id?o`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeItem(e.id)}>${l(t,"remove")}</button>`:h}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${l(t,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${l(t,"save")}</button>
      </div>
    </dialog>`}render(){let t=this.hass.language,e=this.hass.config?.time_zone;return o`
      ${this.draft?this.form():h}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"presence")}</h2>
          <button part="button button-primary" class="primary" @click=${()=>this.draft={kind:"away",person:"",start:ve(e),end:ve(e,1),note:""}}>${l(t,"presence_add")}</button></div>
        <p class="hint">${l(t,"presence_hint")}</p>
        ${!this.draft&&this.error?o`<div part="card error" class="card error">${this.error}</div>`:h}
        ${this.items.length?o`<ul part="card list" class="list">${$(this,"items",this.items,t).items.map(s=>o`<li part="row">
              <button class="item-main plain" @click=${()=>this.draft={id:s.id,kind:s.kind,person:s.person??"",start:Ct(s.start,e),end:Ct(s.end,e,!0),note:s.note}}>
                <span class="item-text"><span part="row-title" class="item-title">${l(t,`presence_${s.kind}`)} · ${this.personName(s.person)}</span>
                  <span part="row-meta" class="item-meta">${Ie(s.start,s.end,t,e)}${s.note?` \xB7 ${s.note}`:""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>${$(this,"items",this.items,t).nav}`:o`<div part="empty" class="empty">${l(t,"presence_none")}</div>`}
      </section>`}};O.styles=x,p([f({attribute:!1})],O.prototype,"hass",2),p([u()],O.prototype,"items",2),p([u()],O.prototype,"world",2),p([u()],O.prototype,"draft",2),p([u()],O.prototype,"error",2),p([u()],O.prototype,"pages",2),O=p([k("homeai-presence")],O);var vt={situations:["situations"],plan:["plan","presence"],chat:["chat"],manage:["learning","journal","rules","settings","ai"]},ts=["rules","settings","ai"],es={situations:"mdi:home-heart",plan:"mdi:calendar-clock",presence:"mdi:account-clock-outline",chat:"mdi:message-text-outline",learning:"mdi:school-outline",journal:"mdi:notebook-outline",rules:"mdi:format-list-checks",settings:"mdi:tune-variant",ai:"mdi:creation-outline"},ye={situations:"/homeai",plan:"/homeai-plan",chat:"/homeai-chat",manage:"/homeai-manage"},ss=["situations","presence","chat","learning","journal","rules"],V=class extends b{constructor(){super(...arguments);this.narrow=!1}get view(){let t=this.panel?.config?.view;return t&&t in vt?t:"situations"}tabs(){return vt[this.view].filter(t=>this.hass?.user?.is_admin||!ts.includes(t))}firstUpdated(){let t=new URLSearchParams(location.search).get("tab");if(!t)return;if(vt[this.view].includes(t)){this.tab=t;return}let e=Object.keys(vt).find(s=>vt[s].includes(t))??(t==="approvals"?"situations":void 0);!e||e===this.view||!this.panel?.config?.view||(history.replaceState(null,"",e==="situations"?ye[e]:`${ye[e]}?tab=${t}`),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}})))}select(t){this.tab=t;let e=new URL(location.href);e.searchParams.set("tab",t),history.replaceState(history.state,"",e)}content(t){switch(t){case"plan":return o`<homeai-plan exportparts=${R} .hass=${this.hass}></homeai-plan>`;case"presence":return o`<homeai-presence exportparts=${R} .hass=${this.hass}></homeai-presence>`;case"chat":return o`<homeai-chat exportparts=${R} .hass=${this.hass} fill></homeai-chat>`;case"learning":return o`<homeai-learning exportparts=${R} .hass=${this.hass}></homeai-learning>`;case"journal":return o`<homeai-journal exportparts=${R} .hass=${this.hass}></homeai-journal>`;case"rules":return o`<homeai-rules exportparts=${R} .hass=${this.hass}></homeai-rules>`;case"settings":return o`<homeai-settings exportparts=${R} .hass=${this.hass}></homeai-settings>`;case"ai":return o`<homeai-ai exportparts=${R} .hass=${this.hass}></homeai-ai>`;default:return o`<homeai-situations exportparts=${R} .hass=${this.hass}></homeai-situations>`}}render(){if(!this.hass)return o``;let t=this.hass.language,e=this.tabs(),s=this.tab&&e.includes(this.tab)?this.tab:e[0],n=this.panel?.title||l(t,this.view);return o`
      <div part="header" class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 part="header-title">${n}</h1>
        ${e.length>1?o`<nav part="tabs" class="tabs segmented glass ${e.length>3?"many":""}" role="tablist">
              ${e.map(r=>o`<button part=${r===s?"tab tab-active":"tab"} class=${r===s?"active":""} role="tab"
                aria-selected=${r===s?"true":"false"} aria-label=${l(t,r)} @click=${()=>this.select(r)}>
                <ha-icon part="tab-icon" .icon=${es[r]}></ha-icon><span part="tab-label" class="label">${l(t,r)}</span></button>`)}
            </nav>`:h}
      </div>
      <main part="content" class=${s==="chat"?"chat":ss.includes(s)?"reading":""}>${this.content(s)}</main>
    `}};V.styles=[x,E`
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
    `],p([f({attribute:!1})],V.prototype,"hass",2),p([f({type:Boolean})],V.prototype,"narrow",2),p([f({attribute:!1})],V.prototype,"panel",2),p([u()],V.prototype,"tab",2),V=p([k("homeai-panel")],V);var Z=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-situations-card"};this.expanded=null}setConfig(t){this.config={entity:"sensor.homeai_situations",min_severity:1,...t}}getCardSize(){return 3}static getStubConfig(){return{type:"custom:homeai-situations-card"}}act(t,e){this.hass.callService("homeai",t,{situation_id:e})}render(){if(!this.hass)return h;let t=this.hass.language,e=this.hass.config?.time_zone,n=(this.hass.states[this.config.entity??"sensor.homeai_situations"]?.attributes.situations??[]).filter(r=>r.severity>=(this.config.min_severity??1));return o`<div part="card" class="card flush">
      ${this.config.title?o`<div part="title" class="title card-title">${this.config.title}</div>`:h}
      ${n.length?o`<ul part="list" class="list bare">${n.map(r=>{let c=this.expanded===r.id;return o`<li part="row" class=${c?"open":""}>
              <button class="item-main" aria-expanded=${c?"true":"false"} @click=${()=>this.expanded=c?null:r.id}>
                <span part="badge badge-${r.severity}" class="dot sev-${r.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title">${r.title}</span>
                  ${r.repairing?o`<span part="row-meta" class="item-meta">${l(t,"repairing")}</span>`:h}</span>
                <span part="time" class="item-aside">${st(r.since,t,e)}</span>
              </button>
              ${c?o`<div class="item-more"><div class="item-actions">
                    <button part="button button-primary" class="primary" @click=${()=>this.act("handle",r.id)}>${l(t,"handle")}</button>
                    <button part="button" @click=${()=>this.act("acknowledge",r.id)} ?disabled=${r.acknowledged}>${l(t,"ack")}</button>
                    <button part="button" @click=${()=>this.act("snooze",r.id)}>${l(t,"snooze")}</button>
                  </div></div>`:h}
            </li>`})}</ul>`:o`<div part="empty" class="empty">${l(t,"nothing_open")}</div>`}
    </div>`}};Z.styles=x,p([f({attribute:!1})],Z.prototype,"hass",2),p([u()],Z.prototype,"config",2),p([u()],Z.prototype,"expanded",2),Z=p([k("homeai-situations-card")],Z);var J=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-plan-card"};this.occurrences=[]}setConfig(t){this.config={days:2,limit:6,...t}}getCardSize(){return 2+Math.min(this.occurrences.length,this.config.limit??6)}static getStubConfig(){return{type:"custom:homeai-plan-card"}}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.load(),300*1e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer)}firstUpdated(){this.load()}async load(){if(this.hass)try{let t=await this.hass.callWS({type:"homeai/plan/list",days:this.config.days??2});this.occurrences=t.occurrences}catch{this.occurrences=[]}}render(){if(!this.hass)return h;let t=this.hass.language,e=this.hass.config?.time_zone,s=this.occurrences.slice(0,this.config.limit??6),n=[],r=j(Date.now(),e);for(let c of s){let d=j(c.at,e);d!==r&&(n.push(o`<li part="day" class="day">${rt(c.at,t,e)}</li>`),r=d),n.push(o`<li part="row"><div class="item-main timed"><span part="time" class="time">${et(c.at,t,e)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${c.title}</span></span><span></span></div></li>`)}return o`<div part="card" class="card flush">
      <div part="title" class="title card-title">${this.config.title??l(t,"plan_next")}</div>
      ${s.length?o`<ul part="list" class="list bare">${n}</ul>`:o`<div part="empty" class="empty">${l(t,"no_plan")}</div>`}
    </div>`}};J.styles=x,p([f({attribute:!1})],J.prototype,"hass",2),p([u()],J.prototype,"config",2),p([u()],J.prototype,"occurrences",2),J=p([k("homeai-plan-card")],J);var at=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-chat-card"}}setConfig(t){this.config={...t}}getCardSize(){return 6}static getStubConfig(){return{type:"custom:homeai-chat-card"}}render(){return this.hass?o`<div part="card" class="card">
      ${this.config.title?o`<div part="title" class="title spaced">${this.config.title}</div>`:h}
      <homeai-chat exportparts=${R} .hass=${this.hass} compact storage-key="homeai-chat-card"></homeai-chat>
    </div>`:h}};at.styles=x,p([f({attribute:!1})],at.prototype,"hass",2),p([u()],at.prototype,"config",2),at=p([k("homeai-chat-card")],at);var as=[{type:"homeai-situations-card",name:"HomeAI situations",description:"Open situations from HomeAI with quick reactions.",preview:!0},{type:"homeai-plan-card",name:"HomeAI plan",description:"What the home's plan does next.",preview:!0},{type:"homeai-chat-card",name:"HomeAI chat",description:"Talk to HomeAI in your own account.",preview:!1}];window.customCards=window.customCards||[];for(let i of as)window.customCards.some(a=>a.type===i.type)||window.customCards.push(i);
