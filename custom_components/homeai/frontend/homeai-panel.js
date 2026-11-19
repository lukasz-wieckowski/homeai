var _e=Object.defineProperty;var ye=Object.getOwnPropertyDescriptor;var h=(i,s,t,e)=>{for(var a=e>1?void 0:e?ye(s,t):s,n=i.length-1,r;n>=0;n--)(r=i[n])&&(a=(e?r(s,t,a):r(a))||a);return e&&a&&_e(s,t,a),a};var gt=globalThis,vt=gt.ShadowRoot&&(gt.ShadyCSS===void 0||gt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ct=Symbol(),qt=new WeakMap,ot=class{constructor(s,t,e){if(this._$cssResult$=!0,e!==Ct)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=t}get styleSheet(){let s=this.o,t=this.t;if(vt&&s===void 0){let e=t!==void 0&&t.length===1;e&&(s=qt.get(t)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),e&&qt.set(t,s))}return s}toString(){return this.cssText}},Bt=i=>new ot(typeof i=="string"?i:i+"",void 0,Ct),S=(i,...s)=>{let t=i.length===1?i[0]:s.reduce((e,a,n)=>e+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+i[n+1],i[0]);return new ot(t,i,Ct)},Vt=(i,s)=>{if(vt)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of s){let e=document.createElement("style"),a=gt.litNonce;a!==void 0&&e.setAttribute("nonce",a),e.textContent=t.cssText,i.appendChild(e)}},Pt=vt?i=>i:i=>i instanceof CSSStyleSheet?(s=>{let t="";for(let e of s.cssRules)t+=e.cssText;return Bt(t)})(i):i;var{is:fe,defineProperty:be,getOwnPropertyDescriptor:$e,getOwnPropertyNames:we,getOwnPropertySymbols:ke,getPrototypeOf:xe}=Object,_t=globalThis,Kt=_t.trustedTypes,Se=Kt?Kt.emptyScript:"",Ee=_t.reactiveElementPolyfillSupport,lt=(i,s)=>i,ct={toAttribute(i,s){switch(s){case Boolean:i=i?Se:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,s){let t=i;switch(s){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},yt=(i,s)=>!fe(i,s),Ft={attribute:!0,type:String,converter:ct,reflect:!1,useDefault:!1,hasChanged:yt};Symbol.metadata??=Symbol("metadata"),_t.litPropertyMetadata??=new WeakMap;var N=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,t=Ft){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(s,t),!t.noAccessor){let e=Symbol(),a=this.getPropertyDescriptor(s,e,t);a!==void 0&&be(this.prototype,s,a)}}static getPropertyDescriptor(s,t,e){let{get:a,set:n}=$e(this.prototype,s)??{get(){return this[t]},set(r){this[t]=r}};return{get:a,set(r){let c=a?.call(this);n?.call(this,r),this.requestUpdate(s,c,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??Ft}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;let s=xe(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){let t=this.properties,e=[...we(t),...ke(t)];for(let a of e)this.createProperty(a,t[a])}let s=this[Symbol.metadata];if(s!==null){let t=litPropertyMetadata.get(s);if(t!==void 0)for(let[e,a]of t)this.elementProperties.set(e,a)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let a=this._$Eu(t,e);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let t=[];if(Array.isArray(s)){let e=new Set(s.flat(1/0).reverse());for(let a of e)t.unshift(Pt(a))}else s!==void 0&&t.push(Pt(s));return t}static _$Eu(s,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(s.set(e,this[e]),delete this[e]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Vt(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,t,e){this._$AK(s,e)}_$ET(s,t){let e=this.constructor.elementProperties.get(s),a=this.constructor._$Eu(s,e);if(a!==void 0&&e.reflect===!0){let n=(e.converter?.toAttribute!==void 0?e.converter:ct).toAttribute(t,e.type);this._$Em=s,n==null?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(s,t){let e=this.constructor,a=e._$Eh.get(s);if(a!==void 0&&this._$Em!==a){let n=e.getPropertyOptions(a),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ct;this._$Em=a;let c=r.fromAttribute(t,n.type);this[a]=c??this._$Ej?.get(a)??c,this._$Em=null}}requestUpdate(s,t,e,a=!1,n){if(s!==void 0){let r=this.constructor;if(a===!1&&(n=this[s]),e??=r.getPropertyOptions(s),!((e.hasChanged??yt)(n,t)||e.useDefault&&e.reflect&&n===this._$Ej?.get(s)&&!this.hasAttribute(r._$Eu(s,e))))return;this.C(s,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,t,{useDefault:e,reflect:a,wrapped:n},r){e&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,r??t??this[s]),n!==!0||r!==void 0)||(this._$AL.has(s)||(this.hasUpdated||e||(t=void 0),this._$AL.set(s,t)),a===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,n]of this._$Ep)this[a]=n;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[a,n]of e){let{wrapped:r}=n,c=this[a];r!==!0||this._$AL.has(a)||c===void 0||this.C(a,void 0,n,c)}}let s=!1,t=this._$AL;try{s=this.shouldUpdate(t),s?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw s=!1,this._$EM(),e}s&&this._$AE(t)}willUpdate(s){}_$AE(s){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(s){}firstUpdated(s){}};N.elementStyles=[],N.shadowRootOptions={mode:"open"},N[lt("elementProperties")]=new Map,N[lt("finalized")]=new Map,Ee?.({ReactiveElement:N}),(_t.reactiveElementVersions??=[]).push("2.1.2");var Rt=globalThis,Zt=i=>i,ft=Rt.trustedTypes,Ht=ft?ft.createPolicy("lit-html",{createHTML:i=>i}):void 0,Mt="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Dt="?"+U,ze=`<${Dt}>`,J=document,pt=()=>J.createComment(""),ht=i=>i===null||typeof i!="object"&&typeof i!="function",Wt=Array.isArray,It=i=>Wt(i)||typeof i?.[Symbol.iterator]=="function",jt=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Jt=/-->/g,Gt=/>/g,Z=RegExp(`>|${jt}(?:([^\\s"'>=/]+)(${jt}*=${jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yt=/'/g,Qt=/"/g,te=/^(?:script|style|textarea|title)$/i,Lt=i=>(s,...t)=>({_$litType$:i,strings:s,values:t}),o=Lt(1),oa=Lt(2),la=Lt(3),E=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Xt=new WeakMap,H=J.createTreeWalker(J,129);function ee(i,s){if(!Wt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ht!==void 0?Ht.createHTML(s):s}var ae=(i,s)=>{let t=i.length-1,e=[],a,n=s===2?"<svg>":s===3?"<math>":"",r=dt;for(let c=0;c<t;c++){let d=i[c],g,b,m=-1,v=0;for(;v<d.length&&(r.lastIndex=v,b=r.exec(d),b!==null);)v=r.lastIndex,r===dt?b[1]==="!--"?r=Jt:b[1]!==void 0?r=Gt:b[2]!==void 0?(te.test(b[2])&&(a=RegExp("</"+b[2],"g")),r=Z):b[3]!==void 0&&(r=Z):r===Z?b[0]===">"?(r=a??dt,m=-1):b[1]===void 0?m=-2:(m=r.lastIndex-b[2].length,g=b[1],r=b[3]===void 0?Z:b[3]==='"'?Qt:Yt):r===Qt||r===Yt?r=Z:r===Jt||r===Gt?r=dt:(r=Z,a=void 0);let _=r===Z&&i[c+1].startsWith("/>")?" ":"";n+=r===dt?d+ze:m>=0?(e.push(g),d.slice(0,m)+Mt+d.slice(m)+U+_):d+U+(m===-2?c:_)}return[ee(i,n+(i[t]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),e]},ut=class i{constructor({strings:s,_$litType$:t},e){let a;this.parts=[];let n=0,r=0,c=s.length-1,d=this.parts,[g,b]=ae(s,t);if(this.el=i.createElement(g,e),H.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(a=H.nextNode())!==null&&d.length<c;){if(a.nodeType===1){if(a.hasAttributes())for(let m of a.getAttributeNames())if(m.endsWith(Mt)){let v=b[r++],_=a.getAttribute(m).split(U),k=/([.?@])?(.*)/.exec(v);d.push({type:1,index:n,name:k[2],strings:_,ctor:k[1]==="."?$t:k[1]==="?"?wt:k[1]==="@"?kt:Y}),a.removeAttribute(m)}else m.startsWith(U)&&(d.push({type:6,index:n}),a.removeAttribute(m));if(te.test(a.tagName)){let m=a.textContent.split(U),v=m.length-1;if(v>0){a.textContent=ft?ft.emptyScript:"";for(let _=0;_<v;_++)a.append(m[_],pt()),H.nextNode(),d.push({type:2,index:++n});a.append(m[v],pt())}}}else if(a.nodeType===8)if(a.data===Dt)d.push({type:2,index:n});else{let m=-1;for(;(m=a.data.indexOf(U,m+1))!==-1;)d.push({type:7,index:n}),m+=U.length-1}n++}}static createElement(s,t){let e=J.createElement("template");return e.innerHTML=s,e}};function G(i,s,t=i,e){if(s===E)return s;let a=e!==void 0?t._$Co?.[e]:t._$Cl,n=ht(s)?void 0:s._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),n===void 0?a=void 0:(a=new n(i),a._$AT(i,t,e)),e!==void 0?(t._$Co??=[])[e]=a:t._$Cl=a),a!==void 0&&(s=G(i,a._$AS(i,s.values),a,e)),s}var bt=class{constructor(s,t){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:t},parts:e}=this._$AD,a=(s?.creationScope??J).importNode(t,!0);H.currentNode=a;let n=H.nextNode(),r=0,c=0,d=e[0];for(;d!==void 0;){if(r===d.index){let g;d.type===2?g=new st(n,n.nextSibling,this,s):d.type===1?g=new d.ctor(n,d.name,d.strings,this,s):d.type===6&&(g=new xt(n,this,s)),this._$AV.push(g),d=e[++c]}r!==d?.index&&(n=H.nextNode(),r++)}return H.currentNode=J,a}p(s){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(s,e,t),t+=e.strings.length-2):e._$AI(s[t])),t++}},st=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,t,e,a){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=t,this._$AM=e,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,t=this._$AM;return t!==void 0&&s?.nodeType===11&&(s=t.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,t=this){s=G(this,s,t),ht(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==E&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):It(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&ht(this._$AH)?this._$AA.nextSibling.data=s:this.T(J.createTextNode(s)),this._$AH=s}$(s){let{values:t,_$litType$:e}=s,a=typeof e=="number"?this._$AC(s):(e.el===void 0&&(e.el=ut.createElement(ee(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===a)this._$AH.p(t);else{let n=new bt(a,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(s){let t=Xt.get(s.strings);return t===void 0&&Xt.set(s.strings,t=new ut(s)),t}k(s){Wt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,a=0;for(let n of s)a===t.length?t.push(e=new i(this.O(pt()),this.O(pt()),this,this.options)):e=t[a],e._$AI(n),a++;a<t.length&&(this._$AR(e&&e._$AB.nextSibling,a),t.length=a)}_$AR(s=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);s!==this._$AB;){let e=Zt(s).nextSibling;Zt(s).remove(),s=e}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},Y=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,t,e,a,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=t,this._$AM=a,this.options=n,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=p}_$AI(s,t=this,e,a){let n=this.strings,r=!1;if(n===void 0)s=G(this,s,t,0),r=!ht(s)||s!==this._$AH&&s!==E,r&&(this._$AH=s);else{let c=s,d,g;for(s=n[0],d=0;d<n.length-1;d++)g=G(this,c[e+d],t,d),g===E&&(g=this._$AH[d]),r||=!ht(g)||g!==this._$AH[d],g===p?s=p:s!==p&&(s+=(g??"")+n[d+1]),this._$AH[d]=g}r&&!a&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},$t=class extends Y{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},wt=class extends Y{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},kt=class extends Y{constructor(s,t,e,a,n){super(s,t,e,a,n),this.type=5}_$AI(s,t=this){if((s=G(this,s,t,0)??p)===E)return;let e=this._$AH,a=s===p&&e!==p||s.capture!==e.capture||s.once!==e.once||s.passive!==e.passive,n=s!==p&&(e===p||a);a&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},xt=class{constructor(s,t,e){this.element=s,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(s){G(this,s)}},se={M:Mt,P:U,A:Dt,C:1,L:ae,R:bt,D:It,V:G,I:st,H:Y,N:wt,U:kt,B:$t,F:xt},Te=Rt.litHtmlPolyfillSupport;Te?.(ut,st),(Rt.litHtmlVersions??=[]).push("3.3.3");var ie=(i,s,t)=>{let e=t?.renderBefore??s,a=e._$litPart$;if(a===void 0){let n=t?.renderBefore??null;e._$litPart$=a=new st(s.insertBefore(pt(),n),n,void 0,t??{})}return a._$AI(i),a};var Ot=globalThis,f=class extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=ie(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};f._$litElement$=!0,f.finalized=!0,Ot.litElementHydrateSupport?.({LitElement:f});var Ae=Ot.litElementPolyfillSupport;Ae?.({LitElement:f});(Ot.litElementVersions??=[]).push("4.2.2");var Ce={attribute:!0,type:String,converter:ct,reflect:!1,hasChanged:yt},Pe=(i=Ce,s,t)=>{let{kind:e,metadata:a}=t,n=globalThis.litPropertyMetadata.get(a);if(n===void 0&&globalThis.litPropertyMetadata.set(a,n=new Map),e==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(t.name,i),e==="accessor"){let{name:r}=t;return{set(c){let d=s.get.call(this);s.set.call(this,c),this.requestUpdate(r,d,i,!0,c)},init(c){return c!==void 0&&this.C(r,void 0,i,c),c}}}if(e==="setter"){let{name:r}=t;return function(c){let d=this[r];s.call(this,c),this.requestUpdate(r,d,i,!0,c)}}throw Error("Unsupported decorator location: "+e)};function y(i){return(s,t)=>typeof t=="object"?Pe(i,s,t):((e,a,n)=>{let r=a.hasOwnProperty(n);return a.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(a,n):void 0})(i,s,t)}function u(i){return y({...i,state:!0,attribute:!1})}var Q=(i,s,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof s!="object"&&Object.defineProperty(i,s,t),t);function Nt(i,s){return(t,e,a)=>{let n=r=>r.renderRoot?.querySelector(i)??null;if(s){let{get:r,set:c}=typeof e=="object"?t:a??(()=>{let d=Symbol();return{get(){return this[d]},set(g){this[d]=g}}})();return Q(t,e,{get(){let d=r.call(this);return d===void 0&&(d=n(this),(d!==null||this.hasUpdated)&&c.call(this,d)),d}})}return Q(t,e,{get(){return n(this)}})}}function $(i){return s=>{customElements.get(i)||customElements.define(i,s)}}var re={en:{manage:"Manage",waiting_approval:"Waiting for your approval",needs_attention:"Needs attention",for_info:"For your information",decided:"Recent decisions",acked_by:"Acknowledged by",today:"Today",tomorrow:"Tomorrow",plan_skip_once:"Skip this time",plan_edit_entry:"Edit the entry",plan_new:"New plan entry",plan_change:"Plan entry",presence_new:"New exception",presence_change:"Exception",rule_new:"New rule",rule_change:"Rule",rule_firing:"met now",watch_stop:"Stop watching",days_of:"of",days_word:"days",close:"Close",section:"Section",entry_off:"off",from_source:"from",status_approved:"approved",status_denied:"denied",status_expired:"expired",status_cancelled:"cancelled",situations:"Situations",approvals:"Approvals",plan:"Plan",journal:"Journal",settings:"Settings",ai:"AI",nothing_open:"Nothing needs attention.",ack:"Got it",handle:"I'll handle it",snooze:"Snooze",dismiss:"Not a problem",severity:"Severity",who:"Who",repairing:"HomeAI is fixing it",approve:"Approve",deny:"Deny",no_approvals:"No requests waiting.",expires:"expires",no_plan:"The plan is empty.",remove:"Remove",search:"Search settings",advanced:"Show advanced",reset:"Reset",saved:"Saved",confirm_change:"This lowers protection or changes something important. Continue?",overridden:"overridden here",default:"default",undo:"Undo last change",export:"Export",import:"Import",cost_today:"Cost today",cost_month:"This month",tiers:"Tiers",no_tiers:"No AI tier yet. Add one in the integration's settings (Add AI tier).",last_prompt:"Last request",resolved:"Recently resolved",admin_only:"Only administrators can change settings.",since:"since",reason:"Why",steps:"Steps",learning:"Learning",proposals:"Proposals",no_proposals:"No proposals yet.",memory:"Memory",remember:"Remember",remember_hint:"Something HomeAI should know",review:"Weekly review",rules:"Rules",no_rules:"No rules yet.",rule_add:"Add a rule",rule_name:"Name",rule_entities:"Entities",rule_label:"Label id",rule_area:"Area",rule_domain:"Domain",rule_condition:"Condition",rule_minutes:"For at least",rule_when:"Active",rule_mode:"Mode",rule_category:"Category",rule_advice:"Advice",rule_enabled:"Enabled",rule_preview:"Preview",rule_covers:"Entities covered",rule_meeting:"Meeting it now",rule_off:"off",rule_state:"is",rule_not_state:"is not",rule_above:"above",rule_below:"below",rule_unavailable:"unavailable",rule_always:"always",rule_night:"at night",rule_away:"nobody home",rule_home:"someone home",rule_each:"each entity",rule_all:"all together",rule_safety:"Safety",rule_security:"Security",rule_damage:"Damage",rule_system:"System",rule_energy:"Energy",rule_comfort:"Comfort",rule_maintenance:"Maintenance",rule_info:"Information",rule_nobody:"Nobody",rule_member:"A household member",rule_admin:"An administrator",rule_service:"A technician",save:"Save",cancel:"Cancel",edit:"Edit",chat:"Chat",presence:"Presence",send:"Send",chat_new:"New conversation",chat_placeholder:"Ask HomeAI\u2026",chat_hint:"Ask about the house, what happened, or what HomeAI should do. HomeAI acts only within its policy.",scope:"Applies to",scope_global:"Whole home",scope_floor:"Floor",scope_area:"Room",scope_device:"Device",scope_entity:"Entity",scope_person:"Person",scope_pick:"Choose where this applies.",scope_none:"Nothing in this section can be set here.",inherited:"inherited",history:"History",reset_section:"Reset section",reset_section_confirm:"Restore the defaults of every setting in this section?",import_confirm:"Replace all settings with the file's contents?",remove_confirm:"Remove it?",undo_confirm:"Undo the last settings change?",plan_add:"Add to plan",plan_next:"Coming up",plan_entries:"Entries",plan_skip:"Skip",plan_type:"Type",plan_action:"Action",plan_reminder:"Reminder",plan_reminder_text:"Reminder",plan_to:"Who to remind",plan_to_home_or_all:"Who is home, else everyone",plan_to_home:"Who is home",plan_to_all:"Everyone",plan_to_admins:"Administrators",plan_service:"Action",plan_data:"Data (JSON)",plan_when:"When",plan_once:"Once",plan_daily:"Every day",plan_weekly:"On days",plan_sun:"Around the sun",plan_sunrise:"Sunrise",plan_sunset:"Sunset",plan_dawn:"Dawn",plan_dusk:"Dusk",plan_solar_noon:"Solar noon",plan_skip_away:"Skip while everyone is away",plan_error:"Not saved",presence_add:"Add exception",presence_none:"No trips, guests or other exceptions planned.",presence_hint:"Trips, guests and days at home change how HomeAI watches the house and who it tells.",presence_kind:"What",presence_person:"Who",presence_everyone:"Whole household",presence_from:"From",presence_to:"Until (inclusive)",presence_note:"Note",presence_away:"Away",presence_vacation:"Vacation",presence_guests:"Guests",presence_home_office:"Working from home",presence_sick:"Sick at home",prompts:"Prompts",prompt_triage:"Assessment",prompt_investigate:"Investigation",prompt_chat:"Conversation",prompt_arbiter:"Arbiter",prompt_digest:"Digest",prompt_custom:"your own",prompt_default:"built-in",prompt_restore:"Restore the built-in prompt",prompt_show_default:"Show the built-in prompt",prompt_restored:"built-in prompt restored",prompt_hint:"The rule that house data is never an instruction is always added, and structured answers keep their format.",watching:"Watching for you",until:"until",show_all:"Show all",show_less:"Show less",limit_day:"Daily limit",limit_month:"Monthly limit",memory_home:"whole home",memory_from_person:"told by a person",memory_from_ai:"noticed by AI",memory_from_learning:"learned",kind_schedule:"Plan",kind_action:"Action",kind_ai:"AI",kind_repair:"Repair",kind_approval:"Approval",kind_setting:"Setting",kind_situation:"Situation",kind_notify:"Notification",kind_learning:"Learning",kind_memory:"Memory",kind_policy:"Policy",kind_system:"System",kind_decision:"Decision",kind_notification:"Notification"},pl:{manage:"Zarz\u0105dzanie",waiting_approval:"Czeka na Twoj\u0105 zgod\u0119",needs_attention:"Wymaga uwagi",for_info:"Do wiadomo\u015Bci",decided:"Ostatnie decyzje",acked_by:"Potwierdzone przez",today:"Dzi\u015B",tomorrow:"Jutro",plan_skip_once:"Pomi\u0144 tym razem",plan_edit_entry:"Edytuj wpis",plan_new:"Nowy wpis planu",plan_change:"Wpis planu",presence_new:"Nowy wyj\u0105tek",presence_change:"Wyj\u0105tek",rule_new:"Nowa regu\u0142a",rule_change:"Regu\u0142a",rule_firing:"spe\u0142niona teraz",watch_stop:"Przesta\u0144 pilnowa\u0107",days_of:"z",days_word:"dni",close:"Zamknij",section:"Sekcja",entry_off:"wy\u0142\u0105czony",from_source:"z",status_approved:"zgoda",status_denied:"odmowa",status_expired:"wygas\u0142a",status_cancelled:"anulowana",situations:"Sprawy",approvals:"Zgody",plan:"Plan",journal:"Dziennik",settings:"Ustawienia",ai:"AI",nothing_open:"Nic nie wymaga uwagi.",ack:"Wiem",handle:"Zajm\u0119 si\u0119",snooze:"Wycisz",dismiss:"To nie problem",severity:"Waga",who:"Kto",repairing:"HomeAI naprawia",approve:"Zgoda",deny:"Odmowa",no_approvals:"Brak oczekuj\u0105cych pr\xF3\u015Bb.",expires:"wygasa",no_plan:"Plan jest pusty.",remove:"Usu\u0144",search:"Szukaj ustawie\u0144",advanced:"Poka\u017C zaawansowane",reset:"Przywr\xF3\u0107",saved:"Zapisano",confirm_change:"To obni\u017Ca ochron\u0119 albo zmienia co\u015B wa\u017Cnego. Kontynuowa\u0107?",overridden:"nadpisane tutaj",default:"domy\u015Blnie",undo:"Cofnij ostatni\u0105 zmian\u0119",export:"Eksport",import:"Import",cost_today:"Koszt dzi\u015B",cost_month:"W tym miesi\u0105cu",tiers:"Poziomy",no_tiers:"Brak poziomu AI. Dodaj go w ustawieniach integracji (Dodaj poziom AI).",last_prompt:"Ostatnie zapytanie",resolved:"Ostatnio rozwi\u0105zane",admin_only:"Ustawienia zmieniaj\u0105 tylko administratorzy.",since:"od",reason:"Dlaczego",steps:"Kroki",learning:"Uczenie",proposals:"Propozycje",no_proposals:"Brak propozycji.",memory:"Pami\u0119\u0107",remember:"Zapami\u0119taj",remember_hint:"Co\u015B, co HomeAI powinno wiedzie\u0107",review:"Przegl\u0105d tygodniowy",rules:"Regu\u0142y",no_rules:"Brak regu\u0142.",rule_add:"Dodaj regu\u0142\u0119",rule_name:"Nazwa",rule_entities:"Encje",rule_label:"Id etykiety",rule_area:"Obszar",rule_domain:"Domena",rule_condition:"Warunek",rule_minutes:"Przez co najmniej",rule_when:"Aktywna",rule_mode:"Tryb",rule_category:"Kategoria",rule_advice:"Rada",rule_enabled:"W\u0142\u0105czona",rule_preview:"Podgl\u0105d",rule_covers:"Obj\u0119te encje",rule_meeting:"Spe\u0142niaj\u0105 teraz",rule_off:"wy\u0142\u0105czona",rule_state:"jest",rule_not_state:"nie jest",rule_above:"powy\u017Cej",rule_below:"poni\u017Cej",rule_unavailable:"niedost\u0119pna",rule_always:"zawsze",rule_night:"w nocy",rule_away:"nikogo w domu",rule_home:"kto\u015B w domu",rule_each:"ka\u017Cda encja",rule_all:"wszystkie naraz",rule_safety:"Bezpiecze\u0144stwo",rule_security:"Ochrona",rule_damage:"Szkody",rule_system:"System",rule_energy:"Energia",rule_comfort:"Komfort",rule_maintenance:"Konserwacja",rule_info:"Informacja",rule_nobody:"Nikt",rule_member:"Domownik",rule_admin:"Administrator",rule_service:"Fachowiec",save:"Zapisz",cancel:"Anuluj",edit:"Edytuj",chat:"Rozmowa",presence:"Obecno\u015B\u0107",send:"Wy\u015Blij",chat_new:"Nowa rozmowa",chat_placeholder:"Zapytaj HomeAI\u2026",chat_hint:"Zapytaj o dom, o to, co si\u0119 sta\u0142o, albo co HomeAI ma zrobi\u0107. HomeAI dzia\u0142a tylko w granicach swojej polityki.",scope:"Dotyczy",scope_global:"Ca\u0142y dom",scope_floor:"Pi\u0119tro",scope_area:"Pomieszczenie",scope_device:"Urz\u0105dzenie",scope_entity:"Encja",scope_person:"Osoba",scope_pick:"Wybierz, czego to dotyczy.",scope_none:"Niczego z tej sekcji nie da si\u0119 ustawi\u0107 tutaj.",inherited:"dziedziczone",history:"Historia",reset_section:"Przywr\xF3\u0107 sekcj\u0119",reset_section_confirm:"Przywr\xF3ci\u0107 domy\u015Blne warto\u015Bci wszystkich ustawie\u0144 tej sekcji?",import_confirm:"Zast\u0105pi\u0107 wszystkie ustawienia zawarto\u015Bci\u0105 pliku?",remove_confirm:"Usun\u0105\u0107?",undo_confirm:"Cofn\u0105\u0107 ostatni\u0105 zmian\u0119 ustawie\u0144?",plan_add:"Dodaj do planu",plan_next:"Wkr\xF3tce",plan_entries:"Wpisy",plan_skip:"Pomi\u0144",plan_type:"Rodzaj",plan_action:"Akcja",plan_reminder:"Przypomnienie",plan_reminder_text:"Przypomnienie",plan_to:"Komu przypomnie\u0107",plan_to_home_or_all:"Kto jest w domu, inaczej wszystkim",plan_to_home:"Kto jest w domu",plan_to_all:"Wszystkim",plan_to_admins:"Administratorom",plan_service:"Akcja",plan_data:"Dane (JSON)",plan_when:"Kiedy",plan_once:"Raz",plan_daily:"Codziennie",plan_weekly:"W dni",plan_sun:"Wed\u0142ug s\u0142o\u0144ca",plan_sunrise:"Wsch\xF3d s\u0142o\u0144ca",plan_sunset:"Zach\xF3d s\u0142o\u0144ca",plan_dawn:"\u015Awit",plan_dusk:"Zmierzch",plan_solar_noon:"Po\u0142udnie s\u0142oneczne",plan_skip_away:"Pomijaj, gdy nikogo nie ma",plan_error:"Nie zapisano",presence_add:"Dodaj wyj\u0105tek",presence_none:"Brak zaplanowanych wyjazd\xF3w, go\u015Bci i innych wyj\u0105tk\xF3w.",presence_hint:"Wyjazdy, go\u015Bcie i dni w domu zmieniaj\u0105 to, jak HomeAI pilnuje domu i kogo powiadamia.",presence_kind:"Co",presence_person:"Kto",presence_everyone:"Ca\u0142y dom",presence_from:"Od",presence_to:"Do (w\u0142\u0105cznie)",presence_note:"Notatka",presence_away:"Poza domem",presence_vacation:"Urlop",presence_guests:"Go\u015Bcie",presence_home_office:"Praca z domu",presence_sick:"Choroba w domu",prompts:"Prompty",prompt_triage:"Ocena",prompt_investigate:"Dochodzenie",prompt_chat:"Rozmowa",prompt_arbiter:"Arbiter",prompt_digest:"Podsumowanie",prompt_custom:"w\u0142asny",prompt_default:"wbudowany",prompt_restore:"Przywr\xF3\u0107 wbudowany prompt",prompt_show_default:"Poka\u017C wbudowany prompt",prompt_restored:"przywr\xF3cono wbudowany prompt",prompt_hint:"Zasada, \u017Ce dane z domu nigdy nie s\u0105 poleceniem, jest zawsze dodawana, a odpowiedzi strukturalne zachowuj\u0105 sw\xF3j format.",watching:"Pilnuj\u0119 dla ciebie",until:"do",show_all:"Poka\u017C wszystko",show_less:"Poka\u017C mniej",limit_day:"Limit dzienny",limit_month:"Limit miesi\u0119czny",memory_home:"ca\u0142y dom",memory_from_person:"od domownika",memory_from_ai:"zauwa\u017Cone przez AI",memory_from_learning:"nauczone",kind_schedule:"Plan",kind_action:"Akcja",kind_ai:"AI",kind_repair:"Naprawa",kind_approval:"Zgoda",kind_setting:"Ustawienie",kind_situation:"Sprawa",kind_notify:"Powiadomienie",kind_learning:"Uczenie",kind_memory:"Pami\u0119\u0107",kind_policy:"Polityka",kind_system:"System",kind_decision:"Decyzja",kind_notification:"Powiadomienie"}};function l(i,s){let t=(i||"en").split("-")[0];return re[t]?.[s]??re.en[s]??s}function X(i,s){let t={},e=new Intl.DateTimeFormat("en-CA",{timeZone:s||void 0,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});for(let a of e.formatToParts(new Date(i)))t[a.type]=a.value;return{date:`${t.year}-${t.month}-${t.day}`,hour:Number(t.hour),minute:Number(t.minute)}}function M(i,s){return i?new Date(i).toLocaleString(s,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):""}function A(i,s){return X(i,s).date}function it(i,s,t){let e=A(i,t);return e===A(Date.now(),t)?l(s,"today"):e===A(Date.now()+864e5,t)?l(s,"tomorrow"):new Date(i).toLocaleDateString(s,{weekday:"long",day:"numeric",month:"long",timeZone:t||void 0})}function I(i,s,t){return new Date(i).toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit",timeZone:t||void 0})}function tt(i,s,t){return i?A(i,t)===A(Date.now(),t)?I(i,s,t):new Date(i).toLocaleDateString(s,{day:"numeric",month:"short",timeZone:t||void 0}):""}var je=S`
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
`,w=[je,S`
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
  `],C=["card","title","heading","badge","badge-0","badge-1","badge-2","badge-3","badge-4","button","button-primary","button-quiet","segmented","sheet","composer","input","list","row","row-title","row-meta","day","time","empty","error","log","message","message-user","message-assistant"].join(", ");var P=class extends f{constructor(){super(...arguments);this.open=[];this.resolved=[];this.pending=[];this.decided=[];this.expanded=new URLSearchParams(location.search).get("situation");this.error="";this.unsubs=[];this.subscribing=!1;this.scrolled=!1}connectedCallback(){super.connectedCallback(),this.subscribe()}disconnectedCallback(){super.disconnectedCallback(),this.unsubs.forEach(t=>t()),this.unsubs=[]}async subscribe(){if(!(!this.hass||this.unsubs.length||this.subscribing)){this.subscribing=!0;try{let t=this.hass.language,e=await this.hass.connection.subscribeMessage(c=>{c.type==="situations"&&c.situations&&(this.open=c.situations)},{type:"homeai/situations/subscribe",language:t}),a=await this.hass.connection.subscribeMessage(c=>this.pending=c.pending,{type:"homeai/approvals/subscribe"});if(!this.isConnected){e(),a();return}this.unsubs=[e,a];let[n,r]=await Promise.all([this.hass.callWS({type:"homeai/situations/list",resolved:10,language:t}),this.hass.callWS({type:"homeai/approvals/list"})]);this.resolved=n.resolved,this.decided=r.recent.filter(c=>c.status!=="pending")}catch(t){this.error=t?.message??String(t)}finally{this.subscribing=!1}}}updated(){if(this.scrolled||!this.expanded)return;let t=this.renderRoot.querySelector(`[data-id="${CSS.escape(this.expanded)}"]`);t&&(this.scrolled=!0,t.scrollIntoView({block:"center"}))}async act(t,e){await this.hass.callWS({type:`homeai/situations/${t}`,situation_id:e.id})}async decide(t,e){this.error="";try{await this.hass.callWS({type:`homeai/approvals/${t}`,approval_id:e.id})}catch(a){this.error=a?.message??String(a)}}toggle(t){this.expanded=this.expanded===t?null:t}approval(t){let e=this.hass.language,a=this.hass.config?.time_zone;return o`<li part="row" class="approval">
      <div class="item-main">
        <span class="item-text"><span part="row-title" class="item-title">${t.what}</span>
          <span part="row-meta" class="item-meta">${t.reason?`${t.reason} \xB7 `:""}${l(e,"expires")} ${tt(t.expires,e,a)}</span></span>
        <span class="item-actions">
          <button part="button" @click=${()=>this.decide("deny",t)}>${l(e,"deny")}</button>
          <button part="button button-primary" class="primary" @click=${()=>this.decide("approve",t)}>${l(e,"approve")}</button>
        </span>
      </div>
    </li>`}situation(t){let e=this.hass.language,a=this.hass.config?.time_zone,n=t.assessment||{},r=this.expanded===t.id,c=["waiting","trying","verifying"].includes(t.repair?.status),d=[t.description,c?l(e,"repairing"):"",t.acked_by?`\u2713 ${t.acked_by}`:""].filter(Boolean).join(" \xB7 ");return o`<li part="row" class=${r?"open":""} data-id=${t.id}>
      <button class="item-main" aria-expanded=${r?"true":"false"} @click=${()=>this.toggle(t.id)}>
        <span part="badge badge-${t.severity}" class="dot sev-${t.severity}" title=${`${l(e,"severity")} ${t.severity}`}></span>
        <span class="item-text"><span part="row-title" class="item-title">${t.title}</span>
          ${d?o`<span part="row-meta" class="item-meta">${d}</span>`:p}</span>
        <span part="time" class="item-aside">${tt(t.opened_at||t.first_seen,e,a)}</span>
      </button>
      ${r?o`<div class="item-more">
            ${n.reason?o`<p><span class="muted">${l(e,"reason")}:</span> ${n.reason}</p>`:p}
            ${n.steps?.length?o`<ol>${n.steps.map(g=>o`<li>${g}</li>`)}</ol>`:p}
            ${c?o`<p class="muted">${l(e,"repairing")} (${t.repair.playbook})</p>`:p}
            ${t.acked_by?o`<p class="muted">${l(e,"acked_by")} ${t.acked_by}</p>`:p}
            <p class="muted">${l(e,"since")} ${M(t.opened_at||t.first_seen,e)}</p>
            <div class="item-actions">
              <button part="button button-primary" class="primary" @click=${()=>this.act("handle",t)}>${l(e,"handle")}</button>
              <button part="button" @click=${()=>this.act("ack",t)} ?disabled=${!!t.acked_by}>${l(e,"ack")}</button>
              <button part="button" @click=${()=>this.act("snooze",t)}>${l(e,"snooze")}</button>
              <button part="button button-quiet" class="quiet" @click=${()=>this.act("dismiss",t)}>${l(e,"dismiss")}</button>
            </div>
          </div>`:p}
    </li>`}group(t,e){return e.length?o`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${l(this.hass.language,t)} <span class="count">${e.length}</span></h2></div>
      <ul part="card list" class="list">${e.map(a=>this.situation(a))}</ul>
    </section>`:p}render(){let t=this.hass.language,e=this.hass.config?.time_zone,a=[...this.open].sort((c,d)=>d.severity-c.severity||(d.opened_at||d.first_seen).localeCompare(c.opened_at||c.first_seen)),n=a.filter(c=>c.severity>=2),r=a.filter(c=>c.severity<2);return o`
      ${this.error?o`<div part="card error" class="card error">${this.error}</div>`:p}
      ${this.pending.length?o`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${l(t,"waiting_approval")} <span class="count">${this.pending.length}</span></h2></div>
            <ul part="card list" class="list">${this.pending.map(c=>this.approval(c))}</ul>
          </section>`:p}
      ${this.group("needs_attention",n)}
      ${this.group("for_info",r)}
      ${!this.pending.length&&!this.open.length?o`<div part="empty" class="empty">${l(t,"nothing_open")}</div>`:p}
      ${this.resolved.length?o`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${l(t,"resolved")} <span class="count">${this.resolved.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${this.resolved.map(c=>o`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${c.title}</span></span>
              <span part="time" class="item-aside">${tt(c.opened_at||c.first_seen,t,e)}</span></div></li>`)}</ul>
          </details>`:p}
      ${this.decided.length?o`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${l(t,"decided")} <span class="count">${Math.min(this.decided.length,15)}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${this.decided.slice(0,15).map(c=>o`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${c.what}</span>
                <span part="row-meta" class="item-meta">${l(t,`status_${c.status}`).replace(/^status_/,"")}${c.decided_by?` \xB7 ${c.decided_by}`:""}</span></span>
              <span part="time" class="item-aside">${tt(c.created,t,e)}</span></div></li>`)}</ul>
          </details>`:p}
    `}};P.styles=[w,S`
      :host { container-type: inline-size; }
      /* a request: its two answers beside it, or under it on a phone */
      .approval .item-main { grid-template-columns: minmax(0, 1fr) auto; }
      @container (max-width: 34em) {
        .approval .item-main { grid-template-columns: minmax(0, 1fr); row-gap: var(--_space); }
        .approval .item-actions { justify-content: flex-end; }
      }
    `],h([y({attribute:!1})],P.prototype,"hass",2),h([u()],P.prototype,"open",2),h([u()],P.prototype,"resolved",2),h([u()],P.prototype,"pending",2),h([u()],P.prototype,"decided",2),h([u()],P.prototype,"expanded",2),h([u()],P.prototype,"error",2),P=h([$("homeai-situations")],P);var Re=["once","daily","weekly","sun"],Me=["sunrise","sunset","dawn","dusk","solar_noon"],De=["home_or_all","home","all","admins"],We=["light.turn_on","light.turn_off","switch.turn_on","switch.turn_off","cover.open_cover","cover.close_cover","climate.set_temperature","scene.turn_on","script.turn_on","media_player.media_stop","fan.turn_off","input_boolean.turn_on","input_boolean.turn_off"];function Le(){let i=new Date;return`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`}function Oe(){return{type:"action",title:"",service:"light.turn_off",entities:"",data:"",reminder:"",to:"home_or_all",when:{kind:"daily",time:"08:00"},enabled:!0,skip_when_away:!1}}function ne(i){return{id:i.id,type:i.reminder?"reminder":"action",title:i.title,service:i.action?.service??"",entities:(i.action?.entity_ids??[]).join(", "),data:i.action&&Object.keys(i.action.data).length?JSON.stringify(i.action.data):"",reminder:i.reminder??"",to:i.to??"home_or_all",when:{...i.when},enabled:i.enabled,skip_when_away:i.skip_when_away}}function Ne(i,s){let t=Array.from({length:7},(a,n)=>new Date(2024,0,1+n).toLocaleDateString(s,{weekday:"short"})),e=i.days?.length?i.days.map(a=>t[a]).join(", "):"";switch(i.kind){case"once":return`${i.date} ${i.time}`;case"daily":return`${l(s,"plan_daily")} ${i.time}`;case"weekly":return`${e} ${i.time}`;case"sun":{let a=i.offset?` ${i.offset>0?"+":""}${i.offset} min`:"";return`${l(s,`plan_${i.event}`)}${a}${e?` \xB7 ${e}`:""}`}default:return JSON.stringify(i)}}var T=class extends f{constructor(){super(...arguments);this.occurrences=[];this.entries=[];this.watches=[];this.error="";this.all=!1;this.expanded=null}connectedCallback(){super.connectedCallback(),this.load()}async load(){let t=await this.hass.callWS({type:"homeai/plan/list",days:14});this.entries=t.entries,this.occurrences=t.occurrences;try{this.watches=(await this.hass.callWS({type:"homeai/watches/list"})).items}catch{this.watches=[]}}async removeWatch(t){await this.hass.callWS({type:"homeai/watches/delete",watch_id:t}),await this.load()}async removeEntry(t){confirm(l(this.hass.language,"remove_confirm"))&&(await this.hass.callWS({type:"homeai/plan/delete",entry_id:t}),this.close(),await this.load())}async skip(t){let e=X(t.at,this.hass.config?.time_zone).date;await this.hass.callService("homeai","plan_skip",{entry_id:t.entry_id,date:e}),this.expanded=null,await this.load()}set(t){this.draft={...this.draft,...t}}setWhen(t){let e={...this.draft.when,...t};t.kind&&(e.kind==="once"&&!e.date&&(e.date=Le()),e.kind==="weekly"&&!e.days?.length&&(e.days=[0,1,2,3,4]),e.kind==="sun"&&!e.event&&(e.event="sunset"),e.kind!=="sun"&&!e.time&&(e.time="08:00")),this.set({when:e})}toggleDay(t){let e=new Set(this.draft.when.days??[]);e.has(t)?e.delete(t):e.add(t),this.setWhen({days:[...e].sort()})}async save(){let t=this.draft,e={kind:t.when.kind};t.when.kind!=="sun"&&(e.time=t.when.time),t.when.kind==="once"&&(e.date=t.when.date),(t.when.kind==="weekly"||t.when.kind==="sun"&&t.when.days?.length)&&(e.days=t.when.days),t.when.kind==="sun"&&(e.event=t.when.event,e.offset=Number(t.when.offset??0));let a={title:t.title,when:e,enabled:t.enabled,skip_when_away:t.skip_when_away};if(t.type==="reminder")a.reminder=t.reminder,a.to=t.to;else{let n={};try{n=t.data.trim()?JSON.parse(t.data):{}}catch(r){this.error=`JSON: ${r}`;return}a.action={service:t.service.trim(),entity_ids:t.entities.split(/[\s,]+/).filter(Boolean),data:n}}try{await this.hass.callWS({type:"homeai/plan/save",entry:a,...t.id?{entry_id:t.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(n){this.error=`${l(this.hass.language,"plan_error")}: ${n?.message??n}`}}close(){this.draft=void 0,this.error=""}updated(){let t=this.renderRoot.querySelector("dialog");t&&!t.open&&t.showModal()}form(){let t=this.hass.language,e=this.draft,a=e.when,n=Array.from({length:7},(c,d)=>new Date(2024,0,1+d).toLocaleDateString(t,{weekday:"short"})),r=(c,d)=>o`<label class="field"><span class="label">${c}</span>${d}</label>`;return o`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${l(t,e.id?"plan_change":"plan_new")}</h2></div>
      <div class="sheet-body fields">
        <div class="segmented" role="group" aria-label=${l(t,"plan_type")}>
          ${["action","reminder"].map(c=>o`<button part=${c===e.type?"button button-primary":"button"} class=${c===e.type?"primary":""}
            aria-pressed=${c===e.type?"true":"false"} @click=${()=>this.set({type:c})}>${l(t,`plan_${c}`)}</button>`)}
        </div>
        ${r(l(t,"rule_name"),o`<input part="input" .value=${e.title} @input=${c=>this.set({title:c.target.value})} />`)}
        ${e.type==="reminder"?o`${r(l(t,"plan_reminder_text"),o`<input part="input" .value=${e.reminder} @input=${c=>this.set({reminder:c.target.value})} />`)}
            ${r(l(t,"plan_to"),o`<select part="input" @change=${c=>this.set({to:c.target.value})}>
              ${De.map(c=>o`<option value=${c} ?selected=${c===e.to}>${l(t,`plan_to_${c}`)}</option>`)}</select>`)}`:o`${r(l(t,"plan_service"),o`<input part="input" list="homeai-services" .value=${e.service} @input=${c=>this.set({service:c.target.value})} />
              <datalist id="homeai-services">${We.map(c=>o`<option value=${c}></option>`)}</datalist>`)}
            ${r(l(t,"rule_entities"),o`<input part="input" list="homeai-entities" placeholder="light.kitchen, light.hall" .value=${e.entities} @input=${c=>this.set({entities:c.target.value})} />
              <datalist id="homeai-entities">${Object.keys(this.hass.states).map(c=>o`<option value=${c}></option>`)}</datalist>`)}
            ${r(l(t,"plan_data"),o`<input part="input" placeholder='{"brightness_pct": 30}' .value=${e.data} @input=${c=>this.set({data:c.target.value})} />`)}`}
        <div class="pair">
          ${r(l(t,"plan_when"),o`<select part="input" @change=${c=>this.setWhen({kind:c.target.value})}>
            ${Re.map(c=>o`<option value=${c} ?selected=${c===a.kind}>${l(t,`plan_${c}`)}</option>`)}</select>`)}
          ${a.kind==="once"?r("\xA0",o`<input part="input" type="date" .value=${a.date??""} @change=${c=>this.setWhen({date:c.target.value})} />`):p}
          ${a.kind==="sun"?o`${r("\xA0",o`<select part="input" @change=${c=>this.setWhen({event:c.target.value})}>
                ${Me.map(c=>o`<option value=${c} ?selected=${c===a.event}>${l(t,`plan_${c}`)}</option>`)}</select>`)}
              ${r("\xB1 min",o`<input part="input" type="number" min="-720" max="720" .value=${String(a.offset??0)} @change=${c=>this.setWhen({offset:parseInt(c.target.value,10)||0})} />`)}`:r("\xA0",o`<input part="input" type="time" .value=${a.time??""} @change=${c=>this.setWhen({time:c.target.value})} />`)}
        </div>
        ${a.kind==="weekly"||a.kind==="sun"?o`<div class="chips" role="group">${n.map((c,d)=>o`<button part=${(a.days??[]).includes(d)?"button button-primary":"button"} aria-pressed=${(a.days??[]).includes(d)?"true":"false"} @click=${()=>this.toggleDay(d)}>${c}</button>`)}</div>`:p}
        <label class="check"><input part="input" type="checkbox" .checked=${e.skip_when_away} @change=${c=>this.set({skip_when_away:c.target.checked})} />${l(t,"plan_skip_away")}</label>
        <label class="check"><input part="input" type="checkbox" .checked=${e.enabled} @change=${c=>this.set({enabled:c.target.checked})} />${l(t,"rule_enabled")}</label>
        ${this.error?o`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${e.id?o`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeEntry(e.id)}>${l(t,"remove")}</button>`:p}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${l(t,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${l(t,"save")}</button>
      </div>
    </dialog>`}timeline(){let t=this.hass.language,e=this.hass.config?.time_zone,a=this.occurrences.slice(0,this.all?200:12),n=[],r="";return a.forEach((c,d)=>{let g=A(c.at,e);g!==r&&(n.push(o`<li part="day" class="day">${it(c.at,t,e)}</li>`),r=g);let b=`${c.entry_id}|${c.at}|${d}`,m=this.expanded===b,v=c.external?this.hass.states[c.source??""]?.attributes.friendly_name??c.source??"":"",_=v&&!c.title.toLowerCase().includes(String(v).toLowerCase())?`${l(t,"from_source")} ${v}`:"",k=o`<span part="time" class="time">${I(c.at,t,e)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${c.title}</span>${_?o`<span part="row-meta" class="item-meta">${_}</span>`:p}</span>
        <span></span>`;n.push(c.external?o`<li part="row"><div class="item-main timed">${k}</div></li>`:o`<li part="row" class=${m?"open":""}>
            <button class="item-main timed" aria-expanded=${m?"true":"false"} @click=${()=>this.expanded=m?null:b}>${k}</button>
            ${m?o`<div class="item-more"><div class="item-actions">
                  <button part="button" @click=${()=>this.skip(c)}>${l(t,"plan_skip_once")}</button>
                  ${this.entries.some(R=>R.id===c.entry_id)?o`<button part="button button-quiet" class="quiet" @click=${()=>this.edit(c.entry_id)}>${l(t,"plan_edit_entry")}</button>`:p}
                </div></div>`:p}
          </li>`)}),o`<ul part="card list" class="list">${n}</ul>
      ${this.occurrences.length>12?o`<div class="item-actions end"><button part="button button-quiet" class="quiet" @click=${()=>this.all=!this.all}>${this.all?l(t,"show_less"):`${l(t,"show_all")} (${this.occurrences.length})`}</button></div>`:p}`}edit(t){let e=this.entries.find(a=>a.id===t);e&&(this.draft=ne(e))}render(){let t=this.hass.language;return o`
      ${this.draft?this.form():p}
      <div class="columns">
        <section class="section">
          <div class="section-head"><h2 part="heading" class="heading">${l(t,"plan_next")}</h2>
            <button part="button button-primary" class="primary" @click=${()=>this.draft=Oe()}>${l(t,"plan_add")}</button></div>
          ${this.occurrences.length?this.timeline():o`<div part="empty" class="empty">${l(t,"no_plan")}</div>`}
        </section>
        <div>
          ${this.watches.length?o`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${l(t,"watching")} <span class="count">${this.watches.length}</span></h2></div>
                <ul part="card list" class="list">${this.watches.map(e=>{let a=this.expanded===`watch|${e.id}`;return o`<li part="row" class=${a?"open":""}>
                    <button class="item-main plain" aria-expanded=${a?"true":"false"} @click=${()=>this.expanded=a?null:`watch|${e.id}`}>
                      <span class="item-text"><span part="row-title" class="item-title">${e.what}</span>
                        <span part="row-meta" class="item-meta">${e.message?`${e.message} \xB7 `:""}${l(t,"until")} ${M(e.expires,t)}</span></span>
                      <span></span>
                    </button>
                    ${a?o`<div class="item-more flush"><div class="item-actions">
                      <button part="button" @click=${()=>this.removeWatch(e.id)}>${l(t,"watch_stop")}</button></div></div>`:p}
                  </li>`})}</ul>
              </section>`:p}
          ${this.entries.length?o`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${l(t,"plan_entries")} <span class="count">${this.entries.length}</span></h2></div>
                <ul part="card list" class="list">${this.entries.map(e=>o`<li part="row">
                  <button class="item-main plain" @click=${()=>this.draft=ne(e)}>
                    <span class="item-text"><span part="row-title" class="item-title ${e.enabled?"":"off"}">${e.title}</span>
                      <span part="row-meta" class="item-meta">${Ne(e.when,t)} · ${e.author_name}${e.enabled?"":` \xB7 ${l(t,"entry_off")}`}</span></span>
                    <span class="chevron">›</span>
                  </button></li>`)}</ul>
              </section>`:p}
        </div>
      </div>`}};T.styles=[w,S`
      /* a wide screen: what comes next on the left, what is set up on the right */
      :host { container-type: inline-size; }
      @container (min-width: 56em) {
        .columns { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); column-gap: var(--_section-spacing); align-items: start; }
      }
    `],h([y({attribute:!1})],T.prototype,"hass",2),h([u()],T.prototype,"occurrences",2),h([u()],T.prototype,"entries",2),h([u()],T.prototype,"watches",2),h([u()],T.prototype,"draft",2),h([u()],T.prototype,"error",2),h([u()],T.prototype,"all",2),h([u()],T.prototype,"expanded",2),T=h([$("homeai-plan")],T);var et=class extends f{constructor(){super(...arguments);this.entries=[]}async connectedCallback(){super.connectedCallback();try{let t=await this.hass.callWS({type:"homeai/journal/recent",limit:200});this.entries=t.entries}catch{this.entries=[]}}render(){let t=this.hass.language,e=this.hass.config?.time_zone;if(!this.entries.length)return o`<div part="empty" class="empty">—</div>`;let a=[],n="";for(let r of this.entries){let c=A(r.ts,e);c!==n&&(a.push(o`<li part="day" class="day">${it(r.ts,t,e)}</li>`),n=c),a.push(o`<li part="row"><div class="item-main timed">
        <span part="time" class="time">${I(r.ts,t,e)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${r.text}</span>
          <span part="row-meta" class="item-meta">${l(t,`kind_${r.kind}`).replace(/^kind_/,"")}</span></span>
        <span></span></div></li>`)}return o`<ul part="card list" class="list">${a}</ul>`}};et.styles=w,h([y({attribute:!1})],et.prototype,"hass",2),h([u()],et.prototype,"entries",2),et=h([$("homeai-journal")],et);var q={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},St=i=>(...s)=>({_$litDirective$:i,values:s}),rt=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,t,e){this._$Ct=s,this._$AM=t,this._$Ci=e}_$AS(s,t){return this.update(s,t)}update(s,t){return this.render(...t)}};var{I:Ue}=se,oe=i=>i;var ce=i=>i.strings===void 0,le=()=>document.createComment(""),nt=(i,s,t)=>{let e=i._$AA.parentNode,a=s===void 0?i._$AB:s._$AA;if(t===void 0){let n=e.insertBefore(le(),a),r=e.insertBefore(le(),a);t=new Ue(n,r,i,i.options)}else{let n=t._$AB.nextSibling,r=t._$AM,c=r!==i;if(c){let d;t._$AQ?.(i),t._$AM=i,t._$AP!==void 0&&(d=i._$AU)!==r._$AU&&t._$AP(d)}if(n!==a||c){let d=t._$AA;for(;d!==n;){let g=oe(d).nextSibling;oe(e).insertBefore(d,a),d=g}}}return t},V=(i,s,t=i)=>(i._$AI(s,t),i),qe={},Et=(i,s=qe)=>i._$AH=s,de=i=>i._$AH,zt=i=>{i._$AR(),i._$AA.remove()};var j=St(class extends rt{constructor(i){if(super(i),i.type!==q.PROPERTY&&i.type!==q.ATTRIBUTE&&i.type!==q.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ce(i))throw Error("`live` bindings can only contain a single expression")}render(i){return i}update(i,[s]){if(s===E||s===p)return s;let t=i.element,e=i.name;if(i.type===q.PROPERTY){if(s===t[e])return E}else if(i.type===q.BOOLEAN_ATTRIBUTE){if(!!s===t.hasAttribute(e))return E}else if(i.type===q.ATTRIBUTE&&t.getAttribute(e)===s+"")return E;return Et(i),s}});var pe=(i,s,t)=>{let e=new Map;for(let a=s;a<=t;a++)e.set(i[a],a);return e},he=St(class extends rt{constructor(i){if(super(i),i.type!==q.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,s,t){let e;t===void 0?t=s:s!==void 0&&(e=s);let a=[],n=[],r=0;for(let c of i)a[r]=e?e(c,r):r,n[r]=t(c,r),r++;return{values:n,keys:a}}render(i,s,t){return this.dt(i,s,t).values}update(i,[s,t,e]){let a=de(i),{values:n,keys:r}=this.dt(s,t,e);if(!Array.isArray(a))return this.ut=r,n;let c=this.ut??=[],d=[],g,b,m=0,v=a.length-1,_=0,k=n.length-1;for(;m<=v&&_<=k;)if(a[m]===null)m++;else if(a[v]===null)v--;else if(c[m]===r[_])d[_]=V(a[m],n[_]),m++,_++;else if(c[v]===r[k])d[k]=V(a[v],n[k]),v--,k--;else if(c[m]===r[k])d[k]=V(a[m],n[k]),nt(i,d[k+1],a[m]),m++,k--;else if(c[v]===r[_])d[_]=V(a[v],n[_]),nt(i,a[m],a[v]),v--,_++;else if(g===void 0&&(g=pe(r,_,k),b=pe(c,m,v)),g.has(c[m]))if(g.has(c[v])){let R=b.get(r[_]),At=R!==void 0?a[R]:null;if(At===null){let Ut=nt(i,a[m]);V(Ut,n[_]),d[_]=Ut}else d[_]=V(At,n[_]),nt(i,a[m],At),a[R]=null;_++}else zt(a[v]),v--;else zt(a[m]),m++;for(;_<=k;){let R=nt(i,d[k+1]);V(R,n[_]),d[_++]=R}for(;m<=v;){let R=a[m++];R!==null&&zt(R)}return this.ut=r,Et(i,d),E}});var Be=["global","floor","area","device","entity","person"],x=class extends f{constructor(){super(...arguments);this.section="general";this.filter="";this.advanced=!1;this.message="";this.scopeType="global";this.scopeRef="";this.scopeValues={}}connectedCallback(){super.connectedCallback(),this.load()}get skey(){return this.scopeType==="global"||!this.scopeRef?"global":`${this.scopeType}:${this.scopeRef}`}async load(){this.schema=await this.hass.callWS({type:"homeai/settings/schema",language:this.hass.language}),this.world||(this.world=await this.hass.callWS({type:"homeai/world/summary"})),await this.loadScope()}async loadScope(){if(this.skey==="global"){this.scopeValues={};return}let t=await this.hass.callWS({type:"homeai/settings/scope",scope:this.skey});this.scopeValues=t.values}targets(){let t=this.hass;switch(this.scopeType){case"floor":return(this.world?.floors??[]).map(e=>({id:e.id,name:e.name}));case"area":return(this.world?.areas??[]).map(e=>({id:e.id,name:e.name}));case"person":return(this.world?.persons??[]).map(e=>({id:e.id,name:e.name}));case"device":return Object.values(t.devices??{}).map(e=>({id:e.id,name:e.name_by_user||e.name||e.id})).sort((e,a)=>e.name.localeCompare(a.name));case"entity":return Object.values(t.states).map(e=>({id:e.entity_id,name:`${e.attributes.friendly_name??e.entity_id} (${e.entity_id})`})).sort((e,a)=>e.name.localeCompare(a.name));default:return[]}}parse(t,e){switch(t.type){case"bool":return!!e;case"int":case"duration":return parseInt(String(e),10);case"float":return parseFloat(String(e));case"multiselect":return e;case"entities":case"strings":return String(e).split(/[\n,]/).map(a=>a.trim()).filter(Boolean);case"json":return JSON.parse(String(e));default:return e}}async save(t,e){let a;try{a=this.parse(t,e)}catch(r){this.message=`${t.label}: ${r}`;return}let n=this.skey;try{if((await this.hass.callWS({type:"homeai/settings/set",key:t.key,value:a,scope:n})).needs_confirmation){if(!confirm(`${t.label}

${l(this.hass.language,"confirm_change")}`)){await this.load();return}await this.hass.callWS({type:"homeai/settings/set",key:t.key,value:a,scope:n,confirmed:!0})}this.message=`${t.label}: ${l(this.hass.language,"saved")}`}catch(r){this.message=r?.message??String(r)}await this.load()}async reset(t){await this.hass.callWS({type:"homeai/settings/reset",key:t.key,scope:this.skey}),await this.load()}async resetSection(){let t=this.schema?.sections.find(a=>a.id===this.section);if(!t||!confirm(`${t.label}

${l(this.hass.language,"reset_section_confirm")}`))return;let e=await this.hass.callWS({type:"homeai/settings/reset_section",section:this.section});this.message=`${t.label}: ${e.reset} \xD7 ${l(this.hass.language,"reset")}`,await this.load()}async undo(){confirm(l(this.hass.language,"undo_confirm"))&&(await this.hass.callWS({type:"homeai/settings/undo"}),await this.load())}async exportSettings(){let t=await this.hass.callWS({type:"homeai/settings/export"}),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(e),a.download="homeai-settings.json",a.click()}async importSettings(t){let e=t.target,a=e.files?.[0];if(e.value="",!(!a||!confirm(l(this.hass.language,"import_confirm")))){try{let n=JSON.parse(await a.text()),r=await this.hass.callWS({type:"homeai/settings/import",data:n});this.message=`${l(this.hass.language,"import")}: ${r.changed}`}catch(n){this.message=n?.message??String(n)}await this.load()}}async toggleHistory(){if(this.history){this.history=void 0;return}let t=await this.hass.callWS({type:"homeai/settings/history",limit:100});this.history=t.history}input(t,e){let a=n=>{let r=n.target;return t.type==="bool"?this.save(t,r.checked):t.type==="multiselect"?this.save(t,Array.from(r.selectedOptions).map(c=>c.value)):this.save(t,r.value)};switch(t.type){case"bool":return o`<input part="input" type="checkbox" .checked=${j(!!e)} @change=${a} />`;case"select":return o`<select part="input" @change=${a}>${t.options.map(n=>o`<option value=${n} .selected=${j(n===e)}>${t.option_labels?.[n]??n}</option>`)}</select>`;case"multiselect":return o`<select part="input" multiple size=${Math.min(t.options.length,6)} @change=${a}>
          ${t.options.map(n=>o`<option value=${n} .selected=${j((e??[]).includes(n))}>${t.option_labels?.[n]??n}</option>`)}</select>`;case"int":case"float":case"duration":return o`<input part="input" type="number" class="w-m" .value=${j(String(e))} min=${t.min??""} max=${t.max??""}
          step=${t.step??(t.type==="float"?"any":1)} @change=${a} /> ${t.unit??""}`;case"time":return o`<input part="input" type="time" .value=${j(String(e))} @change=${a} />`;case"json":return o`<textarea part="input" .value=${j(JSON.stringify(e,null,2))} @change=${a}></textarea>`;case"entities":case"strings":return o`<textarea part="input" .value=${j((e??[]).join(`
`))} @change=${a} placeholder="one per line"></textarea>`;case"text":return o`<textarea part="input" .value=${j(String(e??""))} @change=${a}></textarea>`;default:return o`<input part="input" type="text" .value=${j(String(e??""))} @change=${a} />`}}scopeBar(){let t=this.hass.language,e=this.targets();return o`<div class="pair">
      <label class="field"><span class="label">${l(t,"scope")}</span><select part="input" @change=${a=>{this.scopeType=a.target.value,this.scopeRef="",this.loadScope()}}>${Be.map(a=>o`<option value=${a} ?selected=${a===this.scopeType}>${l(t,`scope_${a}`)}</option>`)}</select></label>
      ${this.scopeType==="global"?p:o`<label class="field"><span class="label">\u00a0</span><select part="input" @change=${a=>{this.scopeRef=a.target.value,this.loadScope()}}><option value="">—</option>${e.map(a=>o`<option value=${a.id} ?selected=${a.id===this.scopeRef}>${a.name}</option>`)}</select></label>`}
    </div>`}historyCard(){let t=this.hass.language,e=new Map((this.schema?.settings??[]).map(n=>[n.key,n.label])),a=n=>n==null?"\u2014":typeof n=="object"?JSON.stringify(n):String(n);return o`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${l(t,"history")}</h2>
        <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${l(t,"close")}</button></div>
      <ul part="card list" class="list">${(this.history??[]).map(n=>o`<li part="row"><div class="item-main plain">
        <span class="item-text"><span part="row-title" class="item-title">${e.get(n.key)??n.key}${n.scope!=="global"?o` <span class="muted">(${n.scope})</span>`:p}</span>
          <span part="row-meta" class="item-meta">${n.key==="import"?l(t,"import"):n.reset?`${a(n.old)} \u2192 ${l(t,"default")}`:`${a(n.old)} \u2192 ${a(n.new)}`}${n.user?` \xB7 ${n.user}`:""}</span></span>
        <span part="time" class="item-aside">${M(n.ts,t)}</span></div></li>`)}</ul>
    </section>`}render(){let t=this.hass.language;if(!this.hass.user.is_admin)return o`<div part="empty" class="empty">${l(t,"admin_only")}</div>`;if(!this.schema)return p;let e=this.filter.toLowerCase(),a=this.skey!=="global",n=this.schema.sections.find(d=>d.id===this.section)??this.schema.sections[0],r=n?.id??this.section,c=this.schema.settings.filter(d=>(e?`${d.label} ${d.description} ${d.key}`.toLowerCase().includes(e):d.section===r)&&(this.advanced||!d.advanced||e)&&(this.scopeType==="global"||d.scopes.includes(this.scopeType)));return o`
      <div class="tools">
        <input part="input" type="search" placeholder=${l(t,"search")} aria-label=${l(t,"search")} .value=${this.filter} @input=${d=>this.filter=d.target.value} />
        ${this.scopeBar()}
        <label class="check"><input part="input" type="checkbox" .checked=${this.advanced} @change=${d=>this.advanced=d.target.checked} />${l(t,"advanced")}</label>
      </div>
      ${this.history?this.historyCard():p}
      ${this.message?o`<div part="card" class="card muted">${this.message}</div>`:p}
      <div class="layout">
        ${e?o`<div></div>`:o`<nav part="segmented" class="nav glass segmented" aria-label=${l(t,"section")}>
          ${this.schema.sections.map(d=>o`<button part=${d.id===r?"button button-primary":"button"} class=${d.id===r?"primary":""}
            aria-current=${d.id===r?"true":"false"} @click=${()=>this.section=d.id}>${d.label}</button>`)}
        </nav>`}
        <section>
          ${e?p:o`<label class="field picker section"><span class="label">${l(t,"section")}</span>
            <select part="input" @change=${d=>this.section=d.target.value}>
              ${this.schema.sections.map(d=>o`<option value=${d.id} ?selected=${d.id===r}>${d.label}</option>`)}</select></label>`}
          ${e||!n?p:o`<div class="section-head"><h2 part="heading" class="heading">${n.label}</h2>
            ${a?p:o`<button part="button button-quiet" class="quiet" @click=${this.resetSection}>${l(t,"reset_section")}</button>`}</div>
            <p class="hint">${n.description}</p>`}
          ${this.scopeType!=="global"&&!this.scopeRef?o`<div part="empty" class="empty">${l(t,"scope_pick")}</div>`:o`<ul part="card list" class="list">
            ${c.length?p:o`<li class="empty">${l(t,"scope_none")}</li>`}
            ${he(c,d=>`${this.skey}|${d.key}`,d=>{let g=a&&d.key in this.scopeValues,b=g?this.scopeValues[d.key]:d.value,m=Object.keys(d.overrides||{}).length,v=g?l(t,"overridden"):a?l(t,"inherited"):m?`${m} \xD7 ${l(t,"overridden")}`:"";return o`<li part="row" class="setting">
                <span class="item-text"><span part="row-title" class="item-title">${d.label}</span>
                  <span part="row-meta" class="item-meta wrap">${d.description}${v?o` · <b>${v}</b>`:p}</span></span>
                ${(a?g:d.source!=="default")?o`<button part="button button-quiet" class="quiet" title=${l(t,"reset")} aria-label=${`${l(t,"reset")}: ${d.label}`} @click=${()=>this.reset(d)}>↺</button>`:o`<span></span>`}
                <span class="control">${this.input(d,b)}</span>
              </li>`})}
          </ul>`}
          <div class="footer">
            <button part="button button-quiet" class="quiet" @click=${this.undo}>${l(t,"undo")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${l(t,"history")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.exportSettings}>${l(t,"export")}</button>
            <span><button part="button button-quiet" class="quiet" @click=${d=>d.currentTarget.nextElementSibling.click()}>${l(t,"import")}</button><input part="input" type="file" accept="application/json,.json" hidden @change=${this.importSettings} /></span>
          </div>
        </section>
      </div>`}};x.styles=[w,S`
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
    `],h([y({attribute:!1})],x.prototype,"hass",2),h([u()],x.prototype,"schema",2),h([u()],x.prototype,"world",2),h([u()],x.prototype,"section",2),h([u()],x.prototype,"filter",2),h([u()],x.prototype,"advanced",2),h([u()],x.prototype,"message",2),h([u()],x.prototype,"scopeType",2),h([u()],x.prototype,"scopeRef",2),h([u()],x.prototype,"scopeValues",2),h([u()],x.prototype,"history",2),x=h([$("homeai-settings")],x);var D=class extends f{constructor(){super(...arguments);this.prompts=[];this.message="";this.drafts={}}async connectedCallback(){if(super.connectedCallback(),!!this.hass.user.is_admin)try{this.status=await this.hass.callWS({type:"homeai/ai/status"}),await this.loadPrompts()}catch(t){this.status={enabled:!1},this.message=t?.message??String(t)}}async loadPrompts(){this.prompts=(await this.hass.callWS({type:"homeai/ai/prompts"})).prompts}async savePrompt(t,e){try{await this.hass.callWS({type:"homeai/settings/set",key:t.key,value:e}),this.message=`${l(this.hass.language,`prompt_${t.mission}`)}: ${l(this.hass.language,"saved")}`;let{[t.mission]:a,...n}=this.drafts;this.drafts=n}catch(a){this.message=a?.message??String(a)}await this.loadPrompts()}async restorePrompt(t){await this.hass.callWS({type:"homeai/settings/reset",key:t.key}),this.message=`${l(this.hass.language,`prompt_${t.mission}`)}: ${l(this.hass.language,"prompt_restored")}`;let{[t.mission]:e,...a}=this.drafts;this.drafts=a,await this.loadPrompts()}promptCard(t){let e=this.hass.language,a=this.drafts[t.mission]??(t.custom||t.default);return o`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${l(e,`prompt_${t.mission}`)}</span>
        <span class="muted">${t.custom?l(e,"prompt_custom"):l(e,"prompt_default")}</span></summary>
      <p class="muted">${l(e,"prompt_hint")}</p>
      <textarea part="input" class="tall" .value=${j(a)} @input=${n=>this.drafts={...this.drafts,[t.mission]:n.target.value}}></textarea>
      <div class="row actions">
        <button part="button button-primary" class="primary" @click=${()=>this.savePrompt(t,a.trim()===t.default.trim()?"":a)}>${l(e,"save")}</button>
        ${t.custom?o`<button part="button" @click=${()=>this.restorePrompt(t)}>${l(e,"prompt_restore")}</button>`:p}
      </div>
      ${t.custom?o`<details><summary class="muted">${l(e,"prompt_show_default")}</summary><textarea part="input" readonly class="tall">${t.default}</textarea></details>`:p}
    </details>`}render(){let t=this.hass.language;if(!this.hass.user.is_admin)return o`<div part="empty" class="empty">${l(t,"admin_only")}</div>`;let e=this.status;if(!e)return p;let a=Object.entries(e.tiers??{}),n=(r,c)=>o`<li part="row"><div class="item-main plain">
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
        ${a.length?o`<ul part="card list" class="list">${a.flatMap(([r,c])=>c.map(d=>o`<li part="row"><div class="item-main">
              <b>${r.toUpperCase()}</b>
              <span class="item-text"><span part="row-title" class="item-title">${d.model}</span><span part="row-meta" class="item-meta">${d.provider} · ${d.priority}</span></span>
              <span part="time" class="item-aside">${d.status??"\u2014"}</span></div></li>`))}</ul>`:o`<p class="hint">${l(t,"no_tiers")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"prompts")}</h2></div>
        ${this.message?o`<p class="hint">${this.message}</p>`:p}
        ${this.prompts.map(r=>this.promptCard(r))}
      </section>
      ${Object.keys(e.last_prompts??{}).length?o`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${l(t,"last_prompt")}</h2></div>
            ${Object.entries(e.last_prompts??{}).map(([r,c])=>o`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${r.toUpperCase()} · ${c.model} · ${c.purpose}</span>
                <span class="muted">$${c.cost.toFixed(4)}</span></summary>
                <p class="muted">${c.ts}</p><textarea part="input" readonly>${JSON.stringify(c.messages,null,2)}</textarea><textarea part="input" readonly>${c.answer}</textarea></details>`)}
          </section>`:p}`}};D.styles=w,h([y({attribute:!1})],D.prototype,"hass",2),h([u()],D.prototype,"status",2),h([u()],D.prototype,"prompts",2),h([u()],D.prototype,"message",2),h([u()],D.prototype,"drafts",2),D=h([$("homeai-ai")],D);var W=class extends f{constructor(){super(...arguments);this.proposals=[];this.facts=[];this.reviews=[];this.draft=""}connectedCallback(){super.connectedCallback(),this.load()}async load(){let t=await this.hass.callWS({type:"homeai/learning/status"});this.proposals=t.proposals,this.facts=t.facts,this.reviews=t.reviews}async call(t,e){await this.hass.callWS({type:t,...e}),await this.load()}async remember(){this.draft.trim()&&(await this.call("homeai/memory/add",{text:this.draft}),this.draft="")}render(){let t=this.hass.language,e=a=>a.scope==="home"?l(t,"memory_home"):this.hass.states[a.scope.replace(/^person:/,"")]?.attributes.friendly_name??a.scope;return o`
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"proposals")}${this.proposals.length?o` <span class="count">${this.proposals.length}</span>`:p}</h2></div>
        ${this.proposals.length?o`<ul part="card list" class="list">${this.proposals.map(a=>o`<li part="row" class="open">
              <div class="item-main plain"><span class="item-text"><span part="row-title" class="item-title">${a.title}</span>
                <span part="row-meta" class="item-meta">${a.days_seen} ${l(t,"days_of")} ${a.days_possible} ${l(t,"days_word")}</span></span></div>
              <div class="item-more flush"><div class="item-actions end">
                <button part="button" @click=${()=>this.call("homeai/learning/reject",{proposal_id:a.id})}>${l(t,"deny")}</button>
                <button part="button button-primary" class="primary" @click=${()=>this.call("homeai/learning/approve",{proposal_id:a.id})}>${l(t,"approve")}</button>
              </div></div></li>`)}</ul>`:o`<p class="hint">${l(t,"no_proposals")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"memory")}${this.facts.length?o` <span class="count">${this.facts.length}</span>`:p}</h2></div>
        <ul part="card list" class="list">
          <li part="row"><div class="item-main plain">
            <input part="input" .value=${this.draft} placeholder=${l(t,"remember_hint")} aria-label=${l(t,"remember_hint")}
              @input=${a=>this.draft=a.target.value} @keydown=${a=>a.key==="Enter"&&this.remember()} />
            <button part="button" ?disabled=${!this.draft.trim()} @click=${this.remember}>${l(t,"remember")}</button>
          </div></li>
          ${this.facts.map(a=>o`<li part="row"><div class="item-main plain">
            <span class="item-text"><span part="row-title" class="item-title">${a.text}</span>
              <span part="row-meta" class="item-meta">${e(a)} · ${l(t,`memory_from_${a.source}`)}</span></span>
            <span class="item-actions">
              ${a.approved?p:o`<button part="button" @click=${()=>this.call("homeai/memory/approve",{fact_id:a.id})}>${l(t,"approve")}</button>`}
              <button part="button button-quiet" class="quiet" aria-label=${`${l(t,"remove")}: ${a.text}`} @click=${()=>this.call("homeai/memory/remove",{fact_id:a.id})}>${l(t,"remove")}</button>
            </span></div></li>`)}
        </ul>
      </section>
      ${this.reviews.length?o`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${l(t,"review")}</h2><span class="muted">${M(this.reviews[0].ts,t)}</span></div>
            <div part="card" class="card"><p class="pre-line">${this.reviews[0].text}</p></div>
          </section>`:p}
    `}};W.styles=w,h([y({attribute:!1})],W.prototype,"hass",2),h([u()],W.prototype,"proposals",2),h([u()],W.prototype,"facts",2),h([u()],W.prototype,"reviews",2),h([u()],W.prototype,"draft",2),W=h([$("homeai-learning")],W);var Ve={id:"",name:"",enabled:!0,target:{entities:[],label:null,area:null,domain:null},condition:{type:"state",value:"on"},minutes:10,severity:1,category:"info",need:"member",advice:"",when:"always",mode:"each"},Ke=["state","not_state","above","below","unavailable"],Fe=["safety","security","damage","system","energy","comfort","maintenance","info"],Ze=["nobody","member","admin","service"],He=["always","night","away","home"],L=class extends f{constructor(){super(...arguments);this.rules=[];this.error=""}connectedCallback(){super.connectedCallback(),this.load()}async load(){let t=await this.hass.callWS({type:"homeai/rules/list"});this.rules=t.rules}async saveAll(t){this.error="";try{await this.hass.callWS({type:"homeai/rules/save",rules:t.map(({firing:e,...a})=>a)}),this.editing=void 0,this.preview=void 0,await this.load()}catch(e){this.error=e?.message??String(e)}}async save(){let t=this.editing;if(!t.id){let a=t.name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").slice(0,36)||"rule",n=new Set(this.rules.map(c=>c.id)),r=a;for(let c=2;n.has(r);c++)r=`${a}_${c}`;t.id=r}let e=this.rules.filter(a=>a.id!==t.id);await this.saveAll([...e,t])}async previewRule(){this.error="";try{this.preview=await this.hass.callWS({type:"homeai/rules/preview",rule:this.editing})}catch(t){this.error=t?.message??String(t)}}set(t,e){let a=structuredClone(this.editing),n=t.split("."),r=a;for(let c of n.slice(0,-1))r=r[c];r[n[n.length-1]]=e,this.editing=a}field(t,e){return o`<label class="field"><span class="label">${t}</span>${e}</label>`}close(){this.editing=void 0,this.preview=void 0,this.error=""}updated(){let t=this.renderRoot.querySelector("dialog");t&&!t.open&&t.showModal()}async removeRule(t){confirm(`${t.name}

${l(this.hass.language,"remove_confirm")}`)&&await this.saveAll(this.rules.filter(e=>e.id!==t.id))}select(t,e,a){return o`<select part="input" @change=${n=>this.set(t,n.target.value)}>
      ${a.map(n=>o`<option value=${n} ?selected=${n===e}>${l(this.hass.language,`rule_${n}`)}</option>`)}</select>`}renderEditor(){let t=this.hass.language,e=this.editing,a=Object.values(this.hass.areas??{}),n=this.rules.some(r=>r.id===e.id);return o`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${l(t,n?"rule_change":"rule_new")}</h2></div>
      <div class="sheet-body fields">
        ${this.field(l(t,"rule_name"),o`<input part="input" .value=${e.name} @input=${r=>this.set("name",r.target.value)} />`)}
        ${this.field(l(t,"rule_entities"),o`<textarea part="input" .value=${e.target.entities.join(`
`)} placeholder="sensor.freezer"
          @change=${r=>this.set("target.entities",r.target.value.split(/[\n,]/).map(c=>c.trim()).filter(Boolean))}></textarea>`)}
        <div class="pair">
          ${this.field(l(t,"rule_area"),o`<select part="input" @change=${r=>this.set("target.area",r.target.value||null)}>
            <option value="">—</option>${a.map(r=>o`<option value=${r.area_id} ?selected=${r.area_id===e.target.area}>${r.name}</option>`)}</select>`)}
          ${this.field(l(t,"rule_label"),o`<input part="input" .value=${e.target.label??""} @input=${r=>this.set("target.label",r.target.value||null)} />`)}
          ${this.field(l(t,"rule_domain"),o`<input part="input" .value=${e.target.domain??""} placeholder="sensor" @input=${r=>this.set("target.domain",r.target.value||null)} />`)}
        </div>
        <div class="pair">
          ${this.field(l(t,"rule_condition"),this.select("condition.type",e.condition.type,Ke))}
          ${e.condition.type==="unavailable"?p:this.field("\xA0",o`<input part="input" .value=${String(e.condition.value??"")}
            @input=${r=>this.set("condition.value",r.target.value)} />`)}
          ${this.field(`${l(t,"rule_minutes")} (min)`,o`<input part="input" type="number" min="0" max="10080" .value=${String(e.minutes)}
            @change=${r=>this.set("minutes",Number(r.target.value))} />`)}
        </div>
        <div class="pair">
          ${this.field(l(t,"rule_when"),this.select("when",e.when,He))}
          ${this.field(l(t,"rule_mode"),this.select("mode",e.mode,["each","all"]))}
        </div>
        <div class="pair">
          ${this.field(l(t,"rule_category"),this.select("category",e.category,Fe))}
          ${this.field(l(t,"severity"),o`<input part="input" type="number" min="0" max=${e.category==="safety"?4:3} .value=${String(e.severity)}
            @change=${r=>this.set("severity",Number(r.target.value))} />`)}
          ${this.field(l(t,"who"),this.select("need",e.need,Ze))}
        </div>
        ${this.field(l(t,"rule_advice"),o`<textarea part="input" .value=${e.advice} @change=${r=>this.set("advice",r.target.value)}></textarea>`)}
        <label class="check"><input part="input" type="checkbox" .checked=${e.enabled} @change=${r=>this.set("enabled",r.target.checked)} />${l(t,"rule_enabled")}</label>
        ${this.preview?o`<p class="muted">${l(t,"rule_covers")}: ${this.preview.covered.length} · ${l(t,"rule_meeting")}: ${this.preview.meeting.map(r=>this.preview.covered.find(c=>c.entity_id===r)?.name??r).join(", ")||"\u2014"}</p>`:p}
        ${this.error?o`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${n?o`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeRule(e)}>${l(t,"remove")}</button>`:p}
        <button part="button button-quiet" class="quiet" @click=${this.previewRule}>${l(t,"rule_preview")}</button>
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${l(t,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${l(t,"save")}</button>
      </div>
    </dialog>`}render(){let t=this.hass.language;return this.hass.user.is_admin?o`
      ${this.editing?this.renderEditor():p}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"rules")}${this.rules.length?o` <span class="count">${this.rules.length}</span>`:p}</h2>
          <button part="button button-primary" class="primary" @click=${()=>{this.editing=structuredClone(Ve),this.preview=void 0}}>${l(t,"rule_add")}</button></div>
        ${!this.editing&&this.error?o`<div part="card error" class="card error">${this.error}</div>`:p}
        ${this.rules.length?o`<ul part="card list" class="list">${this.rules.map(e=>o`<li part="row">
              <button class="item-main" @click=${()=>{this.editing=structuredClone(e),this.preview=void 0}}>
                <span part="badge badge-${e.severity}" class="dot sev-${e.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title ${e.enabled?"":"off"}">${e.name}</span>
                  <span part="row-meta" class="item-meta">${l(t,`rule_${e.condition.type}`)}${e.condition.type==="unavailable"?"":` ${e.condition.value??""}`} · ${e.minutes} min · ${l(t,`rule_${e.when}`)}${e.enabled?"":` \xB7 ${l(t,"rule_off")}`}${e.firing?` \xB7 ${l(t,"rule_firing")}`:""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>`:o`<div part="empty" class="empty">${l(t,"no_rules")}</div>`}
      </section>
    `:o`<div part="empty" class="empty">${l(t,"admin_only")}</div>`}};L.styles=w,h([y({attribute:!1})],L.prototype,"hass",2),h([u()],L.prototype,"rules",2),h([u()],L.prototype,"editing",2),h([u()],L.prototype,"preview",2),h([u()],L.prototype,"error",2),L=h([$("homeai-rules")],L);var Je="homeai-chat-conversation";function Ge(i){try{return sessionStorage.getItem(i)}catch{return null}}function ue(i,s){try{s?sessionStorage.setItem(i,s):sessionStorage.removeItem(i)}catch{}}var z=class extends f{constructor(){super(...arguments);this.storageKey=Je;this.compact=!1;this.fill=!1;this.messages=[];this.busy=!1;this.error="";this.conversation=null}connectedCallback(){super.connectedCallback(),this.conversation=Ge(this.storageKey),this.conversation&&this.loadHistory()}async loadHistory(){let t=await this.hass.callWS({type:"homeai/chat/history",conversation_id:this.conversation});this.messages=t.messages,this.scrollDown()}scrollDown(){this.updateComplete.then(()=>{this.fill?this.renderRoot.querySelector(".composer")?.scrollIntoView({block:"end"}):this.log?.scrollTo({top:this.log.scrollHeight})})}async send(){let t=this.box?.value.trim();if(!(!t||this.busy)){this.box.value="",this.messages=[...this.messages,{role:"user",text:t}],this.busy=!0,this.error="",this.scrollDown();try{let e=await this.hass.callWS({type:"homeai/chat/send",text:t,...this.conversation?{conversation_id:this.conversation}:{}});this.conversation=e.conversation_id,ue(this.storageKey,this.conversation),this.messages=[...this.messages,{role:"assistant",text:e.reply}]}catch(e){this.error=e?.message??String(e)}finally{this.busy=!1,this.scrollDown()}}}restart(){this.conversation=null,ue(this.storageKey,null),this.messages=[]}keydown(t){t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),this.send())}render(){let t=this.hass.language,e=this.messages.length?o`<div class="item-actions end"><button part="button button-quiet" class="quiet" @click=${this.restart}>${l(t,"chat_new")}</button></div>`:p;return o`
      ${this.fill?e:p}
      <div part="log" class="log" aria-live="polite">
        ${this.messages.length?p:o`<div class="muted hint-block">${l(t,"chat_hint")}</div>`}
        ${this.messages.map(a=>o`<div part="message message-${a.role}" class="msg ${a.role}">${a.text}</div>`)}
        ${this.busy?o`<div part="message message-assistant" class="msg assistant muted">…</div>`:p}
      </div>
      ${this.error?o`<div part="error" class="muted error">${this.error}</div>`:p}
      <div class="bottom">
        <div part="composer" class="composer glass">
          <textarea part="input" class="grow" rows="1" placeholder=${l(t,"chat_placeholder")} aria-label=${l(t,"chat_placeholder")} @keydown=${this.keydown} ?disabled=${this.busy}></textarea>
          <button part="button button-primary" class="primary" @click=${this.send} ?disabled=${this.busy}>${l(t,"send")}</button>
        </div>
      </div>
      ${this.fill?p:e}`}};z.styles=[w,S`
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
    `],h([y({attribute:!1})],z.prototype,"hass",2),h([y({attribute:"storage-key"})],z.prototype,"storageKey",2),h([y({type:Boolean})],z.prototype,"compact",2),h([y({type:Boolean,reflect:!0})],z.prototype,"fill",2),h([u()],z.prototype,"messages",2),h([u()],z.prototype,"busy",2),h([u()],z.prototype,"error",2),h([Nt("textarea")],z.prototype,"box",2),h([Nt(".log")],z.prototype,"log",2),z=h([$("homeai-chat")],z);var Ye=["away","vacation","guests","home_office","sick"];function me(i,s=0){return X(Date.now()+s*864e5,i).date}function Tt(i,s,t=!1){return X(new Date(i).getTime()-(t?1e3:0),s).date}function ge(i,s){let t=X(i,s);return t.hour===0&&t.minute===0}function Qe(i,s,t,e){if(!ge(i,e)||!ge(s,e))return`${M(i,t)} \u2192 ${M(s,t)}`;let a=c=>c.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"short",timeZone:e||void 0}),n=new Date(i),r=new Date(new Date(s).getTime()-1e3);return Tt(i,e)===Tt(s,e,!0)?a(n):`${a(n)} \u2013 ${a(r)}`}var O=class extends f{constructor(){super(...arguments);this.items=[];this.error=""}connectedCallback(){super.connectedCallback(),this.load()}async load(){try{let t=await this.hass.callWS({type:"homeai/presence/list",days:120});this.items=t.items.sort((e,a)=>e.start.localeCompare(a.start)),this.world||(this.world=await this.hass.callWS({type:"homeai/world/summary"}))}catch(t){this.error=t?.message??String(t)}}personName(t){return t?this.world?.persons.find(e=>e.id===t)?.name??t:l(this.hass.language,"presence_everyone")}async save(){let t=this.draft,e={kind:t.kind,person:t.person||null,start:t.start,end:t.end,note:t.note};try{await this.hass.callWS({type:"homeai/presence/save",item:e,...t.id?{exception_id:t.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(a){this.error=a?.message??String(a)}}async removeItem(t){if(confirm(l(this.hass.language,"remove_confirm"))){try{await this.hass.callWS({type:"homeai/presence/delete",exception_id:t}),this.close()}catch(e){this.error=e?.message??String(e)}await this.load()}}close(){this.draft=void 0,this.error=""}updated(){let t=this.renderRoot.querySelector("dialog");t&&!t.open&&t.showModal()}form(){let t=this.hass.language,e=this.draft,a=r=>this.draft={...e,...r},n=(r,c)=>o`<label class="field"><span class="label">${r}</span>${c}</label>`;return o`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${l(t,e.id?"presence_change":"presence_new")}</h2></div>
      <div class="sheet-body fields">
        <div class="pair">
          ${n(l(t,"presence_kind"),o`<select part="input" @change=${r=>a({kind:r.target.value})}>
            ${Ye.map(r=>o`<option value=${r} ?selected=${r===e.kind}>${l(t,`presence_${r}`)}</option>`)}</select>`)}
          ${n(l(t,"presence_person"),o`<select part="input" @change=${r=>a({person:r.target.value})}>
            <option value="" ?selected=${!e.person}>${l(t,"presence_everyone")}</option>
            ${(this.world?.persons??[]).map(r=>o`<option value=${r.id} ?selected=${r.id===e.person}>${r.name}</option>`)}</select>`)}
        </div>
        <div class="pair">
          ${n(l(t,"presence_from"),o`<input part="input" type="date" .value=${e.start} @change=${r=>a({start:r.target.value})} />`)}
          ${n(l(t,"presence_to"),o`<input part="input" type="date" .value=${e.end} @change=${r=>a({end:r.target.value})} />`)}
        </div>
        ${n(l(t,"presence_note"),o`<input part="input" maxlength="300" .value=${e.note} @input=${r=>a({note:r.target.value})} />`)}
        ${this.error?o`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${e.id?o`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeItem(e.id)}>${l(t,"remove")}</button>`:p}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${l(t,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${l(t,"save")}</button>
      </div>
    </dialog>`}render(){let t=this.hass.language,e=this.hass.config?.time_zone;return o`
      ${this.draft?this.form():p}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${l(t,"presence")}</h2>
          <button part="button button-primary" class="primary" @click=${()=>this.draft={kind:"away",person:"",start:me(e),end:me(e,1),note:""}}>${l(t,"presence_add")}</button></div>
        <p class="hint">${l(t,"presence_hint")}</p>
        ${!this.draft&&this.error?o`<div part="card error" class="card error">${this.error}</div>`:p}
        ${this.items.length?o`<ul part="card list" class="list">${this.items.map(a=>o`<li part="row">
              <button class="item-main plain" @click=${()=>this.draft={id:a.id,kind:a.kind,person:a.person??"",start:Tt(a.start,e),end:Tt(a.end,e,!0),note:a.note}}>
                <span class="item-text"><span part="row-title" class="item-title">${l(t,`presence_${a.kind}`)} · ${this.personName(a.person)}</span>
                  <span part="row-meta" class="item-meta">${Qe(a.start,a.end,t,e)}${a.note?` \xB7 ${a.note}`:""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>`:o`<div part="empty" class="empty">${l(t,"presence_none")}</div>`}
      </section>`}};O.styles=w,h([y({attribute:!1})],O.prototype,"hass",2),h([u()],O.prototype,"items",2),h([u()],O.prototype,"world",2),h([u()],O.prototype,"draft",2),h([u()],O.prototype,"error",2),O=h([$("homeai-presence")],O);var mt={situations:["situations"],plan:["plan","presence"],chat:["chat"],manage:["learning","journal","rules","settings","ai"]},Xe=["rules","settings","ai"],Ie={situations:"mdi:home-heart",plan:"mdi:calendar-clock",presence:"mdi:account-clock-outline",chat:"mdi:message-text-outline",learning:"mdi:school-outline",journal:"mdi:notebook-outline",rules:"mdi:format-list-checks",settings:"mdi:tune-variant",ai:"mdi:creation-outline"},ve={situations:"/homeai",plan:"/homeai-plan",chat:"/homeai-chat",manage:"/homeai-manage"},ta=["situations","presence","chat","learning","journal","rules"],B=class extends f{constructor(){super(...arguments);this.narrow=!1}get view(){let t=this.panel?.config?.view;return t&&t in mt?t:"situations"}tabs(){return mt[this.view].filter(t=>this.hass?.user?.is_admin||!Xe.includes(t))}firstUpdated(){let t=new URLSearchParams(location.search).get("tab");if(!t)return;if(mt[this.view].includes(t)){this.tab=t;return}let e=Object.keys(mt).find(a=>mt[a].includes(t))??(t==="approvals"?"situations":void 0);!e||e===this.view||!this.panel?.config?.view||(history.replaceState(null,"",e==="situations"?ve[e]:`${ve[e]}?tab=${t}`),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}})))}select(t){this.tab=t;let e=new URL(location.href);e.searchParams.set("tab",t),history.replaceState(history.state,"",e)}content(t){switch(t){case"plan":return o`<homeai-plan exportparts=${C} .hass=${this.hass}></homeai-plan>`;case"presence":return o`<homeai-presence exportparts=${C} .hass=${this.hass}></homeai-presence>`;case"chat":return o`<homeai-chat exportparts=${C} .hass=${this.hass} fill></homeai-chat>`;case"learning":return o`<homeai-learning exportparts=${C} .hass=${this.hass}></homeai-learning>`;case"journal":return o`<homeai-journal exportparts=${C} .hass=${this.hass}></homeai-journal>`;case"rules":return o`<homeai-rules exportparts=${C} .hass=${this.hass}></homeai-rules>`;case"settings":return o`<homeai-settings exportparts=${C} .hass=${this.hass}></homeai-settings>`;case"ai":return o`<homeai-ai exportparts=${C} .hass=${this.hass}></homeai-ai>`;default:return o`<homeai-situations exportparts=${C} .hass=${this.hass}></homeai-situations>`}}render(){if(!this.hass)return o``;let t=this.hass.language,e=this.tabs(),a=this.tab&&e.includes(this.tab)?this.tab:e[0],n=this.panel?.title||l(t,this.view);return o`
      <div part="header" class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 part="header-title">${n}</h1>
        ${e.length>1?o`<nav part="tabs" class="tabs segmented glass ${e.length>3?"many":""}" role="tablist">
              ${e.map(r=>o`<button part=${r===a?"tab tab-active":"tab"} class=${r===a?"active":""} role="tab"
                aria-selected=${r===a?"true":"false"} aria-label=${l(t,r)} @click=${()=>this.select(r)}>
                <ha-icon part="tab-icon" .icon=${Ie[r]}></ha-icon><span part="tab-label" class="label">${l(t,r)}</span></button>`)}
            </nav>`:p}
      </div>
      <main part="content" class=${a==="chat"?"chat":ta.includes(a)?"reading":""}>${this.content(a)}</main>
    `}};B.styles=[w,S`
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
    `],h([y({attribute:!1})],B.prototype,"hass",2),h([y({type:Boolean})],B.prototype,"narrow",2),h([y({attribute:!1})],B.prototype,"panel",2),h([u()],B.prototype,"tab",2),B=h([$("homeai-panel")],B);var K=class extends f{constructor(){super(...arguments);this.config={type:"custom:homeai-situations-card"};this.expanded=null}setConfig(t){this.config={entity:"sensor.homeai_situations",min_severity:1,...t}}getCardSize(){return 3}static getStubConfig(){return{type:"custom:homeai-situations-card"}}act(t,e){this.hass.callService("homeai",t,{situation_id:e})}render(){if(!this.hass)return p;let t=this.hass.language,e=this.hass.config?.time_zone,n=(this.hass.states[this.config.entity??"sensor.homeai_situations"]?.attributes.situations??[]).filter(r=>r.severity>=(this.config.min_severity??1));return o`<div part="card" class="card flush">
      ${this.config.title?o`<div part="title" class="title card-title">${this.config.title}</div>`:p}
      ${n.length?o`<ul part="list" class="list bare">${n.map(r=>{let c=this.expanded===r.id;return o`<li part="row" class=${c?"open":""}>
              <button class="item-main" aria-expanded=${c?"true":"false"} @click=${()=>this.expanded=c?null:r.id}>
                <span part="badge badge-${r.severity}" class="dot sev-${r.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title">${r.title}</span>
                  ${r.repairing?o`<span part="row-meta" class="item-meta">${l(t,"repairing")}</span>`:p}</span>
                <span part="time" class="item-aside">${tt(r.since,t,e)}</span>
              </button>
              ${c?o`<div class="item-more"><div class="item-actions">
                    <button part="button button-primary" class="primary" @click=${()=>this.act("handle",r.id)}>${l(t,"handle")}</button>
                    <button part="button" @click=${()=>this.act("acknowledge",r.id)} ?disabled=${r.acknowledged}>${l(t,"ack")}</button>
                    <button part="button" @click=${()=>this.act("snooze",r.id)}>${l(t,"snooze")}</button>
                  </div></div>`:p}
            </li>`})}</ul>`:o`<div part="empty" class="empty">${l(t,"nothing_open")}</div>`}
    </div>`}};K.styles=w,h([y({attribute:!1})],K.prototype,"hass",2),h([u()],K.prototype,"config",2),h([u()],K.prototype,"expanded",2),K=h([$("homeai-situations-card")],K);var F=class extends f{constructor(){super(...arguments);this.config={type:"custom:homeai-plan-card"};this.occurrences=[]}setConfig(t){this.config={days:2,limit:6,...t}}getCardSize(){return 2+Math.min(this.occurrences.length,this.config.limit??6)}static getStubConfig(){return{type:"custom:homeai-plan-card"}}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.load(),300*1e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer)}firstUpdated(){this.load()}async load(){if(this.hass)try{let t=await this.hass.callWS({type:"homeai/plan/list",days:this.config.days??2});this.occurrences=t.occurrences}catch{this.occurrences=[]}}render(){if(!this.hass)return p;let t=this.hass.language,e=this.hass.config?.time_zone,a=this.occurrences.slice(0,this.config.limit??6),n=[],r=A(Date.now(),e);for(let c of a){let d=A(c.at,e);d!==r&&(n.push(o`<li part="day" class="day">${it(c.at,t,e)}</li>`),r=d),n.push(o`<li part="row"><div class="item-main timed"><span part="time" class="time">${I(c.at,t,e)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${c.title}</span></span><span></span></div></li>`)}return o`<div part="card" class="card flush">
      <div part="title" class="title card-title">${this.config.title??l(t,"plan_next")}</div>
      ${a.length?o`<ul part="list" class="list bare">${n}</ul>`:o`<div part="empty" class="empty">${l(t,"no_plan")}</div>`}
    </div>`}};F.styles=w,h([y({attribute:!1})],F.prototype,"hass",2),h([u()],F.prototype,"config",2),h([u()],F.prototype,"occurrences",2),F=h([$("homeai-plan-card")],F);var at=class extends f{constructor(){super(...arguments);this.config={type:"custom:homeai-chat-card"}}setConfig(t){this.config={...t}}getCardSize(){return 6}static getStubConfig(){return{type:"custom:homeai-chat-card"}}render(){return this.hass?o`<div part="card" class="card">
      ${this.config.title?o`<div part="title" class="title spaced">${this.config.title}</div>`:p}
      <homeai-chat exportparts=${C} .hass=${this.hass} compact storage-key="homeai-chat-card"></homeai-chat>
    </div>`:p}};at.styles=w,h([y({attribute:!1})],at.prototype,"hass",2),h([u()],at.prototype,"config",2),at=h([$("homeai-chat-card")],at);var ea=[{type:"homeai-situations-card",name:"HomeAI situations",description:"Open situations from HomeAI with quick reactions.",preview:!0},{type:"homeai-plan-card",name:"HomeAI plan",description:"What the home's plan does next.",preview:!0},{type:"homeai-chat-card",name:"HomeAI chat",description:"Talk to HomeAI in your own account.",preview:!1}];window.customCards=window.customCards||[];for(let i of ea)window.customCards.some(s=>s.type===i.type)||window.customCards.push(i);
