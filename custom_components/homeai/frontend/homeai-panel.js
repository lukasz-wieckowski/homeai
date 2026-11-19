var zt=Object.defineProperty;var Tt=Object.getOwnPropertyDescriptor;var h=(i,s,e,t)=>{for(var a=t>1?void 0:t?Tt(s,e):s,n=i.length-1,r;n>=0;n--)(r=i[n])&&(a=(t?r(s,e,a):r(a))||a);return t&&a&&zt(s,e,a),a};var be=globalThis,$e=be.ShadowRoot&&(be.ShadyCSS===void 0||be.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,We=Symbol(),Je=new WeakMap,pe=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==We)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if($e&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=Je.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&Je.set(e,s))}return s}toString(){return this.cssText}},Ye=i=>new pe(typeof i=="string"?i:i+"",void 0,We),E=(i,...s)=>{let e=i.length===1?i[0]:s.reduce((t,a,n)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+i[n+1],i[0]);return new pe(e,i,We)},Qe=(i,s)=>{if($e)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),a=be.litNonce;a!==void 0&&t.setAttribute("nonce",a),t.textContent=e.cssText,i.appendChild(t)}},De=$e?i=>i:i=>i instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return Ye(e)})(i):i;var{is:At,defineProperty:Ct,getOwnPropertyDescriptor:Pt,getOwnPropertyNames:jt,getOwnPropertySymbols:Rt,getPrototypeOf:Mt}=Object,we=globalThis,Xe=we.trustedTypes,Ot=Xe?Xe.emptyScript:"",Wt=we.reactiveElementPolyfillSupport,he=(i,s)=>i,ue={toAttribute(i,s){switch(s){case Boolean:i=i?Ot:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,s){let e=i;switch(s){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ke=(i,s)=>!At(i,s),Ie={attribute:!0,type:String,converter:ue,reflect:!1,useDefault:!1,hasChanged:ke};Symbol.metadata??=Symbol("metadata"),we.litPropertyMetadata??=new WeakMap;var U=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=Ie){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),a=this.getPropertyDescriptor(s,t,e);a!==void 0&&Ct(this.prototype,s,a)}}static getPropertyDescriptor(s,e,t){let{get:a,set:n}=Pt(this.prototype,s)??{get(){return this[e]},set(r){this[e]=r}};return{get:a,set(r){let d=a?.call(this);n?.call(this,r),this.requestUpdate(s,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??Ie}static _$Ei(){if(this.hasOwnProperty(he("elementProperties")))return;let s=Mt(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(he("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(he("properties"))){let e=this.properties,t=[...jt(e),...Rt(e)];for(let a of t)this.createProperty(a,e[a])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,a]of e)this.elementProperties.set(t,a)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let a=this._$Eu(e,t);a!==void 0&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let a of t)e.unshift(De(a))}else s!==void 0&&e.push(De(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qe(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),a=this.constructor._$Eu(s,t);if(a!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:ue).toAttribute(e,t.type);this._$Em=s,n==null?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(s,e){let t=this.constructor,a=t._$Eh.get(s);if(a!==void 0&&this._$Em!==a){let n=t.getPropertyOptions(a),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ue;this._$Em=a;let d=r.fromAttribute(e,n.type);this[a]=d??this._$Ej?.get(a)??d,this._$Em=null}}requestUpdate(s,e,t,a=!1,n){if(s!==void 0){let r=this.constructor;if(a===!1&&(n=this[s]),t??=r.getPropertyOptions(s),!((t.hasChanged??ke)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(s)&&!this.hasAttribute(r._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:a,wrapped:n},r){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,r??e??this[s]),n!==!0||r!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),a===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,n]of this._$Ep)this[a]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[a,n]of t){let{wrapped:r}=n,d=this[a];r!==!0||this._$AL.has(a)||d===void 0||this.C(a,void 0,n,d)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};U.elementStyles=[],U.shadowRootOptions={mode:"open"},U[he("elementProperties")]=new Map,U[he("finalized")]=new Map,Wt?.({ReactiveElement:U}),(we.reactiveElementVersions??=[]).push("2.1.2");var Le=globalThis,et=i=>i,xe=Le.trustedTypes,tt=xe?xe.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ue="$lit$",q=`lit$${Math.random().toFixed(9).slice(2)}$`,qe="?"+q,Dt=`<${qe}>`,Y=document,ge=()=>Y.createComment(""),ve=i=>i===null||typeof i!="object"&&typeof i!="function",Be=Array.isArray,ot=i=>Be(i)||typeof i?.[Symbol.iterator]=="function",Ne=`[ 	
\f\r]`,me=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,st=/>/g,G=RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),it=/'/g,rt=/"/g,lt=/^(?:script|style|textarea|title)$/i,Ve=i=>(s,...e)=>({_$litType$:i,strings:s,values:e}),l=Ve(1),_a=Ve(2),ya=Ve(3),z=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),nt=new WeakMap,J=Y.createTreeWalker(Y,129);function ct(i,s){if(!Be(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return tt!==void 0?tt.createHTML(s):s}var dt=(i,s)=>{let e=i.length-1,t=[],a,n=s===2?"<svg>":s===3?"<math>":"",r=me;for(let d=0;d<e;d++){let c=i[d],g,u,v=-1,_=0;for(;_<c.length&&(r.lastIndex=_,u=r.exec(c),u!==null);)_=r.lastIndex,r===me?u[1]==="!--"?r=at:u[1]!==void 0?r=st:u[2]!==void 0?(lt.test(u[2])&&(a=RegExp("</"+u[2],"g")),r=G):u[3]!==void 0&&(r=G):r===G?u[0]===">"?(r=a??me,v=-1):u[1]===void 0?v=-2:(v=r.lastIndex-u[2].length,g=u[1],r=u[3]===void 0?G:u[3]==='"'?rt:it):r===rt||r===it?r=G:r===at||r===st?r=me:(r=G,a=void 0);let y=r===G&&i[d+1].startsWith("/>")?" ":"";n+=r===me?c+Dt:v>=0?(t.push(g),c.slice(0,v)+Ue+c.slice(v)+q+y):c+q+(v===-2?d:y)}return[ct(i,n+(i[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},_e=class i{constructor({strings:s,_$litType$:e},t){let a;this.parts=[];let n=0,r=0,d=s.length-1,c=this.parts,[g,u]=dt(s,e);if(this.el=i.createElement(g,t),J.currentNode=this.el.content,e===2||e===3){let v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(a=J.nextNode())!==null&&c.length<d;){if(a.nodeType===1){if(a.hasAttributes())for(let v of a.getAttributeNames())if(v.endsWith(Ue)){let _=u[r++],y=a.getAttribute(v).split(q),w=/([.?@])?(.*)/.exec(_);c.push({type:1,index:n,name:w[2],strings:y,ctor:w[1]==="."?Ee:w[1]==="?"?ze:w[1]==="@"?Te:X}),a.removeAttribute(v)}else v.startsWith(q)&&(c.push({type:6,index:n}),a.removeAttribute(v));if(lt.test(a.tagName)){let v=a.textContent.split(q),_=v.length-1;if(_>0){a.textContent=xe?xe.emptyScript:"";for(let y=0;y<_;y++)a.append(v[y],ge()),J.nextNode(),c.push({type:2,index:++n});a.append(v[_],ge())}}}else if(a.nodeType===8)if(a.data===qe)c.push({type:2,index:n});else{let v=-1;for(;(v=a.data.indexOf(q,v+1))!==-1;)c.push({type:7,index:n}),v+=q.length-1}n++}}static createElement(s,e){let t=Y.createElement("template");return t.innerHTML=s,t}};function Q(i,s,e=i,t){if(s===z)return s;let a=t!==void 0?e._$Co?.[t]:e._$Cl,n=ve(s)?void 0:s._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),n===void 0?a=void 0:(a=new n(i),a._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=a:e._$Cl=a),a!==void 0&&(s=Q(i,a._$AS(i,s.values),a,t)),s}var Se=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,a=(s?.creationScope??Y).importNode(e,!0);J.currentNode=a;let n=J.nextNode(),r=0,d=0,c=t[0];for(;c!==void 0;){if(r===c.index){let g;c.type===2?g=new re(n,n.nextSibling,this,s):c.type===1?g=new c.ctor(n,c.name,c.strings,this,s):c.type===6&&(g=new Ae(n,this,s)),this._$AV.push(g),c=t[++d]}r!==c?.index&&(n=J.nextNode(),r++)}return J.currentNode=Y,a}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},re=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,a){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=Q(this,s,e),ve(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==z&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):ot(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&ve(this._$AH)?this._$AA.nextSibling.data=s:this.T(Y.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,a=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=_e.createElement(ct(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===a)this._$AH.p(e);else{let n=new Se(a,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(s){let e=nt.get(s.strings);return e===void 0&&nt.set(s.strings,e=new _e(s)),e}k(s){Be(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,a=0;for(let n of s)a===e.length?e.push(t=new i(this.O(ge()),this.O(ge()),this,this.options)):t=e[a],t._$AI(n),a++;a<e.length&&(this._$AR(t&&t._$AB.nextSibling,a),e.length=a)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=et(s).nextSibling;et(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},X=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,a,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=e,this._$AM=a,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(s,e=this,t,a){let n=this.strings,r=!1;if(n===void 0)s=Q(this,s,e,0),r=!ve(s)||s!==this._$AH&&s!==z,r&&(this._$AH=s);else{let d=s,c,g;for(s=n[0],c=0;c<n.length-1;c++)g=Q(this,d[t+c],e,c),g===z&&(g=this._$AH[c]),r||=!ve(g)||g!==this._$AH[c],g===p?s=p:s!==p&&(s+=(g??"")+n[c+1]),this._$AH[c]=g}r&&!a&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Ee=class extends X{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},ze=class extends X{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},Te=class extends X{constructor(s,e,t,a,n){super(s,e,t,a,n),this.type=5}_$AI(s,e=this){if((s=Q(this,s,e,0)??p)===z)return;let t=this._$AH,a=s===p&&t!==p||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,n=s!==p&&(t===p||a);a&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},Ae=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){Q(this,s)}},pt={M:Ue,P:q,A:qe,C:1,L:dt,R:Se,D:ot,V:Q,I:re,H:X,N:ze,U:Te,B:Ee,F:Ae},Nt=Le.litHtmlPolyfillSupport;Nt?.(_e,re),(Le.litHtmlVersions??=[]).push("3.3.3");var ht=(i,s,e)=>{let t=e?.renderBefore??s,a=t._$litPart$;if(a===void 0){let n=e?.renderBefore??null;t._$litPart$=a=new re(s.insertBefore(ge(),n),n,void 0,e??{})}return a._$AI(i),a};var Ke=globalThis,b=class extends U{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=ht(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};b._$litElement$=!0,b.finalized=!0,Ke.litElementHydrateSupport?.({LitElement:b});var Lt=Ke.litElementPolyfillSupport;Lt?.({LitElement:b});(Ke.litElementVersions??=[]).push("4.2.2");var Ut={attribute:!0,type:String,converter:ue,reflect:!1,hasChanged:ke},qt=(i=Ut,s,e)=>{let{kind:t,metadata:a}=e,n=globalThis.litPropertyMetadata.get(a);if(n===void 0&&globalThis.litPropertyMetadata.set(a,n=new Map),t==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),t==="accessor"){let{name:r}=e;return{set(d){let c=s.get.call(this);s.set.call(this,d),this.requestUpdate(r,c,i,!0,d)},init(d){return d!==void 0&&this.C(r,void 0,i,d),d}}}if(t==="setter"){let{name:r}=e;return function(d){let c=this[r];s.call(this,d),this.requestUpdate(r,c,i,!0,d)}}throw Error("Unsupported decorator location: "+t)};function f(i){return(s,e)=>typeof e=="object"?qt(i,s,e):((t,a,n)=>{let r=a.hasOwnProperty(n);return a.constructor.createProperty(n,t),r?Object.getOwnPropertyDescriptor(a,n):void 0})(i,s,e)}function m(i){return f({...i,state:!0,attribute:!1})}var I=(i,s,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof s!="object"&&Object.defineProperty(i,s,e),e);function Fe(i,s){return(e,t,a)=>{let n=r=>r.renderRoot?.querySelector(i)??null;if(s){let{get:r,set:d}=typeof t=="object"?e:a??(()=>{let c=Symbol();return{get(){return this[c]},set(g){this[c]=g}}})();return I(e,t,{get(){let c=r.call(this);return c===void 0&&(c=n(this),(c!==null||this.hasUpdated)&&d.call(this,c)),c}})}return I(e,t,{get(){return n(this)}})}}function k(i){return s=>{customElements.get(i)||customElements.define(i,s)}}var ut={en:{plan_what:"What",plan_do:"What should happen",plan_pick:"Choose\u2026",plan_name_optional:"Name (optional)",plan_custom:"Custom action",plan_custom_hint:"Made in an automation or by an administrator; only an administrator can change it.",plan_advanced:"Advanced",plan_time:"Time",plan_moment:"Moment",plan_offset:"Shift (min)",plan_day:"Day",verb_activate:"Turn on the scene",verb_run:"Run",verb_on:"Turn on",verb_off:"Turn off",verb_brightness:"Brightness",verb_open:"Open",verb_close:"Close",verb_position:"Position",verb_temperature:"Temperature",verb_stop:"Stop",verb_start:"Start cleaning",verb_dock:"Back to the dock",verb_press:"Press",type_scene:"Scenes",type_script:"Scripts",type_light:"Lights",type_switch:"Plugs and switches",type_fan:"Fans and purifiers",type_input_boolean:"Helpers",type_cover:"Blinds and gates",type_climate:"Heating and cooling",type_media_player:"Speakers and TVs",type_vacuum:"Vacuums",type_button:"Buttons",type_input_button:"Helper buttons",pages:"Pages",page_prev:"Previous",page_next:"Next",of:"of",manage:"Manage",waiting_approval:"Waiting for your approval",needs_attention:"Needs attention",for_info:"For your information",decided:"Recent decisions",acked_by:"Acknowledged by",today:"Today",tomorrow:"Tomorrow",plan_skip_once:"Skip this time",plan_edit_entry:"Edit the entry",plan_new:"New plan entry",plan_change:"Plan entry",presence_new:"New exception",presence_change:"Exception",rule_new:"New rule",rule_change:"Rule",rule_firing:"met now",watch_stop:"Stop watching",days_of:"of",days_word:"days",close:"Close",section:"Section",entry_off:"off",from_source:"from",status_approved:"approved",status_denied:"denied",status_expired:"expired",status_cancelled:"cancelled",situations:"Situations",approvals:"Approvals",plan:"Plan",journal:"Journal",settings:"Settings",ai:"AI",nothing_open:"Nothing needs attention.",ack:"Got it",handle:"I'll handle it",snooze:"Snooze",dismiss:"Not a problem",severity:"Severity",who:"Who",repairing:"HomeAI is fixing it",approve:"Approve",deny:"Deny",no_approvals:"No requests waiting.",expires:"expires",no_plan:"The plan is empty.",remove:"Remove",search:"Search settings",advanced:"Show advanced",reset:"Reset",saved:"Saved",confirm_change:"This lowers protection or changes something important. Continue?",overridden:"overridden here",default:"default",undo:"Undo last change",export:"Export",import:"Import",cost_today:"Cost today",cost_month:"This month",tiers:"Tiers",no_tiers:"No AI tier yet. Add one in the integration's settings (Add AI tier).",last_prompt:"Last request",resolved:"Recently resolved",admin_only:"Only administrators can change settings.",since:"since",reason:"Why",steps:"Steps",learning:"Learning",proposals:"Proposals",no_proposals:"No proposals yet.",memory:"Memory",remember:"Remember",remember_hint:"Something HomeAI should know",review:"Weekly review",rules:"Rules",no_rules:"No rules yet.",rule_add:"Add a rule",rule_name:"Name",rule_entities:"Entities",rule_label:"Label id",rule_area:"Area",rule_domain:"Domain",rule_condition:"Condition",rule_minutes:"For at least",rule_when:"Active",rule_mode:"Mode",rule_category:"Category",rule_advice:"Advice",rule_enabled:"Enabled",rule_preview:"Preview",rule_covers:"Entities covered",rule_meeting:"Meeting it now",rule_off:"off",rule_state:"is",rule_not_state:"is not",rule_above:"above",rule_below:"below",rule_unavailable:"unavailable",rule_always:"always",rule_night:"at night",rule_away:"nobody home",rule_home:"someone home",rule_each:"each entity",rule_all:"all together",rule_safety:"Safety",rule_security:"Security",rule_damage:"Damage",rule_system:"System",rule_energy:"Energy",rule_comfort:"Comfort",rule_maintenance:"Maintenance",rule_info:"Information",rule_nobody:"Nobody",rule_member:"A household member",rule_admin:"An administrator",rule_service:"A technician",save:"Save",cancel:"Cancel",edit:"Edit",chat:"Chat",presence:"Presence",send:"Send",chat_new:"New conversation",chat_placeholder:"Ask HomeAI\u2026",chat_hint:"Ask about the house, what happened, or what HomeAI should do. HomeAI acts only within its policy.",scope:"Applies to",scope_global:"Whole home",scope_floor:"Floor",scope_area:"Room",scope_device:"Device",scope_entity:"Entity",scope_person:"Person",scope_pick:"Choose where this applies.",scope_none:"Nothing in this section can be set here.",inherited:"inherited",history:"History",reset_section:"Reset section",reset_section_confirm:"Restore the defaults of every setting in this section?",import_confirm:"Replace all settings with the file's contents?",remove_confirm:"Remove it?",undo_confirm:"Undo the last settings change?",plan_add:"Add to plan",plan_next:"Coming up",plan_entries:"Entries",plan_skip:"Skip",plan_type:"Type",plan_action:"Action",plan_reminder:"Reminder",plan_reminder_text:"Reminder",plan_to:"Who to remind",plan_to_home_or_all:"Who is home, else everyone",plan_to_home:"Who is home",plan_to_all:"Everyone",plan_to_admins:"Administrators",plan_service:"Action",plan_data:"Data (JSON)",plan_when:"When",plan_once:"Once",plan_daily:"Every day",plan_weekly:"On days",plan_sun:"Around the sun",plan_sunrise:"Sunrise",plan_sunset:"Sunset",plan_dawn:"Dawn",plan_dusk:"Dusk",plan_solar_noon:"Solar noon",plan_skip_away:"Skip while everyone is away",plan_error:"Not saved",presence_add:"Add exception",presence_none:"No trips, guests or other exceptions planned.",presence_hint:"Trips, guests and days at home change how HomeAI watches the house and who it tells.",presence_kind:"What",presence_person:"Who",presence_everyone:"Whole household",presence_from:"From",presence_to:"Until (inclusive)",presence_note:"Note",presence_away:"Away",presence_vacation:"Vacation",presence_guests:"Guests",presence_home_office:"Working from home",presence_sick:"Sick at home",prompts:"Prompts",prompt_triage:"Assessment",prompt_investigate:"Investigation",prompt_chat:"Conversation",prompt_arbiter:"Arbiter",prompt_digest:"Digest",prompt_custom:"your own",prompt_default:"built-in",prompt_restore:"Restore the built-in prompt",prompt_show_default:"Show the built-in prompt",prompt_restored:"built-in prompt restored",prompt_hint:"The rule that house data is never an instruction is always added, and structured answers keep their format.",watching:"Watching for you",until:"until",show_all:"Show all",show_less:"Show less",limit_day:"Daily limit",limit_month:"Monthly limit",memory_home:"whole home",memory_from_person:"told by a person",memory_from_ai:"noticed by AI",memory_from_learning:"learned",kind_schedule:"Plan",kind_action:"Action",kind_ai:"AI",kind_repair:"Repair",kind_approval:"Approval",kind_setting:"Setting",kind_situation:"Situation",kind_notify:"Notification",kind_learning:"Learning",kind_memory:"Memory",kind_policy:"Policy",kind_system:"System",kind_decision:"Decision",kind_notification:"Notification"},pl:{plan_what:"Co",plan_do:"Co ma si\u0119 sta\u0107",plan_pick:"Wybierz\u2026",plan_name_optional:"Nazwa (opcjonalnie)",plan_custom:"Akcja niestandardowa",plan_custom_hint:"U\u0142o\u017Cona w automatyzacji albo przez administratora; zmieni\u0107 j\u0105 mo\u017Ce tylko administrator.",plan_advanced:"Zaawansowane",plan_time:"Godzina",plan_moment:"Moment",plan_offset:"Przesuni\u0119cie (min)",plan_day:"Dzie\u0144",verb_activate:"W\u0142\u0105cz scen\u0119",verb_run:"Uruchom",verb_on:"W\u0142\u0105cz",verb_off:"Wy\u0142\u0105cz",verb_brightness:"Jasno\u015B\u0107",verb_open:"Otw\xF3rz",verb_close:"Zamknij",verb_position:"Pozycja",verb_temperature:"Temperatura",verb_stop:"Zatrzymaj",verb_start:"Odkurzaj",verb_dock:"Wr\xF3\u0107 do stacji",verb_press:"Naci\u015Bnij",type_scene:"Sceny",type_script:"Skrypty",type_light:"\u015Awiat\u0142a",type_switch:"Gniazdka i prze\u0142\u0105czniki",type_fan:"Wentylatory i oczyszczacze",type_input_boolean:"Prze\u0142\u0105czniki pomocnicze",type_cover:"Rolety i bramy",type_climate:"Ogrzewanie i klimatyzacja",type_media_player:"G\u0142o\u015Bniki i telewizory",type_vacuum:"Odkurzacze",type_button:"Przyciski",type_input_button:"Przyciski pomocnicze",pages:"Strony",page_prev:"Poprzednie",page_next:"Nast\u0119pne",of:"z",manage:"Zarz\u0105dzanie",waiting_approval:"Czeka na Twoj\u0105 zgod\u0119",needs_attention:"Wymaga uwagi",for_info:"Do wiadomo\u015Bci",decided:"Ostatnie decyzje",acked_by:"Potwierdzone przez",today:"Dzi\u015B",tomorrow:"Jutro",plan_skip_once:"Pomi\u0144 tym razem",plan_edit_entry:"Edytuj wpis",plan_new:"Nowy wpis planu",plan_change:"Wpis planu",presence_new:"Nowy wyj\u0105tek",presence_change:"Wyj\u0105tek",rule_new:"Nowa regu\u0142a",rule_change:"Regu\u0142a",rule_firing:"spe\u0142niona teraz",watch_stop:"Przesta\u0144 pilnowa\u0107",days_of:"z",days_word:"dni",close:"Zamknij",section:"Sekcja",entry_off:"wy\u0142\u0105czony",from_source:"z",status_approved:"zgoda",status_denied:"odmowa",status_expired:"wygas\u0142a",status_cancelled:"anulowana",situations:"Sprawy",approvals:"Zgody",plan:"Plan",journal:"Dziennik",settings:"Ustawienia",ai:"AI",nothing_open:"Nic nie wymaga uwagi.",ack:"Wiem",handle:"Zajm\u0119 si\u0119",snooze:"Wycisz",dismiss:"To nie problem",severity:"Waga",who:"Kto",repairing:"HomeAI naprawia",approve:"Zgoda",deny:"Odmowa",no_approvals:"Brak oczekuj\u0105cych pr\xF3\u015Bb.",expires:"wygasa",no_plan:"Plan jest pusty.",remove:"Usu\u0144",search:"Szukaj ustawie\u0144",advanced:"Poka\u017C zaawansowane",reset:"Przywr\xF3\u0107",saved:"Zapisano",confirm_change:"To obni\u017Ca ochron\u0119 albo zmienia co\u015B wa\u017Cnego. Kontynuowa\u0107?",overridden:"nadpisane tutaj",default:"domy\u015Blnie",undo:"Cofnij ostatni\u0105 zmian\u0119",export:"Eksport",import:"Import",cost_today:"Koszt dzi\u015B",cost_month:"W tym miesi\u0105cu",tiers:"Poziomy",no_tiers:"Brak poziomu AI. Dodaj go w ustawieniach integracji (Dodaj poziom AI).",last_prompt:"Ostatnie zapytanie",resolved:"Ostatnio rozwi\u0105zane",admin_only:"Ustawienia zmieniaj\u0105 tylko administratorzy.",since:"od",reason:"Dlaczego",steps:"Kroki",learning:"Uczenie",proposals:"Propozycje",no_proposals:"Brak propozycji.",memory:"Pami\u0119\u0107",remember:"Zapami\u0119taj",remember_hint:"Co\u015B, co HomeAI powinno wiedzie\u0107",review:"Przegl\u0105d tygodniowy",rules:"Regu\u0142y",no_rules:"Brak regu\u0142.",rule_add:"Dodaj regu\u0142\u0119",rule_name:"Nazwa",rule_entities:"Encje",rule_label:"Id etykiety",rule_area:"Obszar",rule_domain:"Domena",rule_condition:"Warunek",rule_minutes:"Przez co najmniej",rule_when:"Aktywna",rule_mode:"Tryb",rule_category:"Kategoria",rule_advice:"Rada",rule_enabled:"W\u0142\u0105czona",rule_preview:"Podgl\u0105d",rule_covers:"Obj\u0119te encje",rule_meeting:"Spe\u0142niaj\u0105 teraz",rule_off:"wy\u0142\u0105czona",rule_state:"jest",rule_not_state:"nie jest",rule_above:"powy\u017Cej",rule_below:"poni\u017Cej",rule_unavailable:"niedost\u0119pna",rule_always:"zawsze",rule_night:"w nocy",rule_away:"nikogo w domu",rule_home:"kto\u015B w domu",rule_each:"ka\u017Cda encja",rule_all:"wszystkie naraz",rule_safety:"Bezpiecze\u0144stwo",rule_security:"Ochrona",rule_damage:"Szkody",rule_system:"System",rule_energy:"Energia",rule_comfort:"Komfort",rule_maintenance:"Konserwacja",rule_info:"Informacja",rule_nobody:"Nikt",rule_member:"Domownik",rule_admin:"Administrator",rule_service:"Fachowiec",save:"Zapisz",cancel:"Anuluj",edit:"Edytuj",chat:"Rozmowa",presence:"Obecno\u015B\u0107",send:"Wy\u015Blij",chat_new:"Nowa rozmowa",chat_placeholder:"Zapytaj HomeAI\u2026",chat_hint:"Zapytaj o dom, o to, co si\u0119 sta\u0142o, albo co HomeAI ma zrobi\u0107. HomeAI dzia\u0142a tylko w granicach swojej polityki.",scope:"Dotyczy",scope_global:"Ca\u0142y dom",scope_floor:"Pi\u0119tro",scope_area:"Pomieszczenie",scope_device:"Urz\u0105dzenie",scope_entity:"Encja",scope_person:"Osoba",scope_pick:"Wybierz, czego to dotyczy.",scope_none:"Niczego z tej sekcji nie da si\u0119 ustawi\u0107 tutaj.",inherited:"dziedziczone",history:"Historia",reset_section:"Przywr\xF3\u0107 sekcj\u0119",reset_section_confirm:"Przywr\xF3ci\u0107 domy\u015Blne warto\u015Bci wszystkich ustawie\u0144 tej sekcji?",import_confirm:"Zast\u0105pi\u0107 wszystkie ustawienia zawarto\u015Bci\u0105 pliku?",remove_confirm:"Usun\u0105\u0107?",undo_confirm:"Cofn\u0105\u0107 ostatni\u0105 zmian\u0119 ustawie\u0144?",plan_add:"Dodaj do planu",plan_next:"Wkr\xF3tce",plan_entries:"Wpisy",plan_skip:"Pomi\u0144",plan_type:"Rodzaj",plan_action:"Akcja",plan_reminder:"Przypomnienie",plan_reminder_text:"Przypomnienie",plan_to:"Komu przypomnie\u0107",plan_to_home_or_all:"Kto jest w domu, inaczej wszystkim",plan_to_home:"Kto jest w domu",plan_to_all:"Wszystkim",plan_to_admins:"Administratorom",plan_service:"Akcja",plan_data:"Dane (JSON)",plan_when:"Kiedy",plan_once:"Raz",plan_daily:"Codziennie",plan_weekly:"W dni",plan_sun:"Wed\u0142ug s\u0142o\u0144ca",plan_sunrise:"Wsch\xF3d s\u0142o\u0144ca",plan_sunset:"Zach\xF3d s\u0142o\u0144ca",plan_dawn:"\u015Awit",plan_dusk:"Zmierzch",plan_solar_noon:"Po\u0142udnie s\u0142oneczne",plan_skip_away:"Pomijaj, gdy nikogo nie ma",plan_error:"Nie zapisano",presence_add:"Dodaj wyj\u0105tek",presence_none:"Brak zaplanowanych wyjazd\xF3w, go\u015Bci i innych wyj\u0105tk\xF3w.",presence_hint:"Wyjazdy, go\u015Bcie i dni w domu zmieniaj\u0105 to, jak HomeAI pilnuje domu i kogo powiadamia.",presence_kind:"Co",presence_person:"Kto",presence_everyone:"Ca\u0142y dom",presence_from:"Od",presence_to:"Do (w\u0142\u0105cznie)",presence_note:"Notatka",presence_away:"Poza domem",presence_vacation:"Urlop",presence_guests:"Go\u015Bcie",presence_home_office:"Praca z domu",presence_sick:"Choroba w domu",prompts:"Prompty",prompt_triage:"Ocena",prompt_investigate:"Dochodzenie",prompt_chat:"Rozmowa",prompt_arbiter:"Arbiter",prompt_digest:"Podsumowanie",prompt_custom:"w\u0142asny",prompt_default:"wbudowany",prompt_restore:"Przywr\xF3\u0107 wbudowany prompt",prompt_show_default:"Poka\u017C wbudowany prompt",prompt_restored:"przywr\xF3cono wbudowany prompt",prompt_hint:"Zasada, \u017Ce dane z domu nigdy nie s\u0105 poleceniem, jest zawsze dodawana, a odpowiedzi strukturalne zachowuj\u0105 sw\xF3j format.",watching:"Pilnuj\u0119 dla ciebie",until:"do",show_all:"Poka\u017C wszystko",show_less:"Poka\u017C mniej",limit_day:"Limit dzienny",limit_month:"Limit miesi\u0119czny",memory_home:"ca\u0142y dom",memory_from_person:"od domownika",memory_from_ai:"zauwa\u017Cone przez AI",memory_from_learning:"nauczone",kind_schedule:"Plan",kind_action:"Akcja",kind_ai:"AI",kind_repair:"Naprawa",kind_approval:"Zgoda",kind_setting:"Ustawienie",kind_situation:"Sprawa",kind_notify:"Powiadomienie",kind_learning:"Uczenie",kind_memory:"Pami\u0119\u0107",kind_policy:"Polityka",kind_system:"System",kind_decision:"Decyzja",kind_notification:"Powiadomienie"}};function o(i,s){let e=(i||"en").split("-")[0];return ut[e]?.[s]??ut.en[s]??s}function ee(i,s){let e={},t=new Intl.DateTimeFormat("en-CA",{timeZone:s||void 0,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});for(let a of t.formatToParts(new Date(i)))e[a.type]=a.value;return{date:`${e.year}-${e.month}-${e.day}`,hour:Number(e.hour),minute:Number(e.minute)}}function O(i,s){return i?new Date(i).toLocaleString(s,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):""}function j(i,s){return ee(i,s).date}function ne(i,s,e){let t=j(i,e);return t===j(Date.now(),e)?o(s,"today"):t===j(Date.now()+864e5,e)?o(s,"tomorrow"):new Date(i).toLocaleDateString(s,{weekday:"long",day:"numeric",month:"long",timeZone:e||void 0})}function te(i,s,e){return new Date(i).toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit",timeZone:e||void 0})}function ae(i,s,e){return i?j(i,e)===j(Date.now(),e)?te(i,s,e):new Date(i).toLocaleDateString(s,{day:"numeric",month:"short",timeZone:e||void 0}):""}var Bt=E`
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
`,x=[Bt,E`
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
  `],R=["card","title","heading","badge","badge-0","badge-1","badge-2","badge-3","badge-4","button","button-primary","button-quiet","segmented","sheet","composer","input","list","row","row-title","row-meta","day","time","pager","empty","error","log","message","message-user","message-assistant"].join(", ");var Ze=10;function $(i,s,e,t,a=Ze){let n=Math.max(1,Math.ceil(e.length/a)),r=Math.max(0,Math.min(i.pages[s]??0,n-1)),d=r*a,c=u=>{i.pages={...i.pages,[s]:u}},g=n>1?l`<nav part="pager" class="pager" aria-label=${o(t,"pages")}>
        <button part="button button-quiet" class="quiet" ?disabled=${r===0} @click=${()=>c(r-1)}>‹ ${o(t,"page_prev")}</button>
        <span part="time" class="pager-count" aria-live="polite">${d+1}–${Math.min(e.length,d+a)} ${o(t,"of")} ${e.length}</span>
        <button part="button button-quiet" class="quiet" ?disabled=${r===n-1} @click=${()=>c(r+1)}>${o(t,"page_next")} ›</button>
      </nav>`:p;return{items:e.slice(d,d+a),nav:g,offset:d}}var A=class extends b{constructor(){super(...arguments);this.open=[];this.resolved=[];this.pending=[];this.decided=[];this.expanded=new URLSearchParams(location.search).get("situation");this.error="";this.pages={};this.unsubs=[];this.subscribing=!1;this.scrolled=!1}connectedCallback(){super.connectedCallback(),this.subscribe()}disconnectedCallback(){super.disconnectedCallback(),this.unsubs.forEach(e=>e()),this.unsubs=[]}async subscribe(){if(!(!this.hass||this.unsubs.length||this.subscribing)){this.subscribing=!0;try{let e=this.hass.language,t=await this.hass.connection.subscribeMessage(d=>{d.type==="situations"&&d.situations&&(this.open=d.situations)},{type:"homeai/situations/subscribe",language:e}),a=await this.hass.connection.subscribeMessage(d=>this.pending=d.pending,{type:"homeai/approvals/subscribe"});if(!this.isConnected){t(),a();return}this.unsubs=[t,a];let[n,r]=await Promise.all([this.hass.callWS({type:"homeai/situations/list",resolved:100,language:e}),this.hass.callWS({type:"homeai/approvals/list"})]);this.resolved=n.resolved,this.decided=r.recent.filter(d=>d.status!=="pending")}catch(e){this.error=e?.message??String(e)}finally{this.subscribing=!1}}}groups(){let e=[...this.open].sort((t,a)=>a.severity-t.severity||(a.opened_at||a.first_seen).localeCompare(t.opened_at||t.first_seen));return[e.filter(t=>t.severity>=2),e.filter(t=>t.severity<2)]}willUpdate(e){if(!e.has("open")||!this.expanded||this.scrolled)return;let[t,a]=this.groups();for(let[n,r]of[["needs_attention",t],["for_info",a]]){let d=r.findIndex(c=>c.id===this.expanded);d>=0&&(this.pages={...this.pages,[n]:Math.floor(d/Ze)})}}updated(){if(this.scrolled||!this.expanded)return;let e=this.renderRoot.querySelector(`[data-id="${CSS.escape(this.expanded)}"]`);e&&(this.scrolled=!0,e.scrollIntoView({block:"center"}))}async act(e,t){await this.hass.callWS({type:`homeai/situations/${e}`,situation_id:t.id})}async decide(e,t){this.error="";try{await this.hass.callWS({type:`homeai/approvals/${e}`,approval_id:t.id})}catch(a){this.error=a?.message??String(a)}}toggle(e){this.expanded=this.expanded===e?null:e}approval(e){let t=this.hass.language,a=this.hass.config?.time_zone;return l`<li part="row" class="approval">
      <div class="item-main">
        <span class="item-text"><span part="row-title" class="item-title">${e.what}</span>
          <span part="row-meta" class="item-meta">${e.reason?`${e.reason} \xB7 `:""}${o(t,"expires")} ${ae(e.expires,t,a)}</span></span>
        <span class="item-actions">
          <button part="button" @click=${()=>this.decide("deny",e)}>${o(t,"deny")}</button>
          <button part="button button-primary" class="primary" @click=${()=>this.decide("approve",e)}>${o(t,"approve")}</button>
        </span>
      </div>
    </li>`}situation(e){let t=this.hass.language,a=this.hass.config?.time_zone,n=e.assessment||{},r=this.expanded===e.id,d=["waiting","trying","verifying"].includes(e.repair?.status),c=[e.description,d?o(t,"repairing"):"",e.acked_by?`\u2713 ${e.acked_by}`:""].filter(Boolean).join(" \xB7 ");return l`<li part="row" class=${r?"open":""} data-id=${e.id}>
      <button class="item-main" aria-expanded=${r?"true":"false"} @click=${()=>this.toggle(e.id)}>
        <span part="badge badge-${e.severity}" class="dot sev-${e.severity}" title=${`${o(t,"severity")} ${e.severity}`}></span>
        <span class="item-text"><span part="row-title" class="item-title">${e.title}</span>
          ${c?l`<span part="row-meta" class="item-meta">${c}</span>`:p}</span>
        <span part="time" class="item-aside">${ae(e.opened_at||e.first_seen,t,a)}</span>
      </button>
      ${r?l`<div class="item-more">
            ${n.reason?l`<p><span class="muted">${o(t,"reason")}:</span> ${n.reason}</p>`:p}
            ${n.steps?.length?l`<ol>${n.steps.map(g=>l`<li>${g}</li>`)}</ol>`:p}
            ${d?l`<p class="muted">${o(t,"repairing")} (${e.repair.playbook})</p>`:p}
            ${e.acked_by?l`<p class="muted">${o(t,"acked_by")} ${e.acked_by}</p>`:p}
            <p class="muted">${o(t,"since")} ${O(e.opened_at||e.first_seen,t)}</p>
            <div class="item-actions">
              <button part="button button-primary" class="primary" @click=${()=>this.act("handle",e)}>${o(t,"handle")}</button>
              <button part="button" @click=${()=>this.act("ack",e)} ?disabled=${!!e.acked_by}>${o(t,"ack")}</button>
              <button part="button" @click=${()=>this.act("snooze",e)}>${o(t,"snooze")}</button>
              <button part="button button-quiet" class="quiet" @click=${()=>this.act("dismiss",e)}>${o(t,"dismiss")}</button>
            </div>
          </div>`:p}
    </li>`}group(e,t){if(!t.length)return p;let a=$(this,e,t,this.hass.language);return l`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${o(this.hass.language,e)} <span class="count">${t.length}</span></h2></div>
      <ul part="card list" class="list">${a.items.map(n=>this.situation(n))}</ul>
      ${a.nav}
    </section>`}render(){let e=this.hass.language,t=this.hass.config?.time_zone,[a,n]=this.groups(),r=$(this,"pending",this.pending,e),d=$(this,"resolved",this.resolved,e),c=$(this,"decided",this.decided,e);return l`
      ${this.error?l`<div part="card error" class="card error">${this.error}</div>`:p}
      ${this.pending.length?l`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${o(e,"waiting_approval")} <span class="count">${this.pending.length}</span></h2></div>
            <ul part="card list" class="list">${r.items.map(g=>this.approval(g))}</ul>
            ${r.nav}
          </section>`:p}
      ${this.group("needs_attention",a)}
      ${this.group("for_info",n)}
      ${!this.pending.length&&!this.open.length?l`<div part="empty" class="empty">${o(e,"nothing_open")}</div>`:p}
      ${this.resolved.length?l`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${o(e,"resolved")} <span class="count">${this.resolved.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${d.items.map(g=>l`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${g.title}</span></span>
              <span part="time" class="item-aside">${ae(g.opened_at||g.first_seen,e,t)}</span></div></li>`)}</ul>
            ${d.nav}
          </details>`:p}
      ${this.decided.length?l`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${o(e,"decided")} <span class="count">${this.decided.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${c.items.map(g=>l`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${g.what}</span>
                <span part="row-meta" class="item-meta">${o(e,`status_${g.status}`).replace(/^status_/,"")}${g.decided_by?` \xB7 ${g.decided_by}`:""}</span></span>
              <span part="time" class="item-aside">${ae(g.created,e,t)}</span></div></li>`)}</ul>
            ${c.nav}
          </details>`:p}
    `}};A.styles=[x,E`
      :host { container-type: inline-size; }
      /* a request: its two answers beside it, or under it on a phone */
      .approval .item-main { grid-template-columns: minmax(0, 1fr) auto; }
      @container (max-width: 34em) {
        .approval .item-main { grid-template-columns: minmax(0, 1fr); row-gap: var(--_space); }
        .approval .item-actions { justify-content: flex-end; }
      }
    `],h([f({attribute:!1})],A.prototype,"hass",2),h([m()],A.prototype,"open",2),h([m()],A.prototype,"resolved",2),h([m()],A.prototype,"pending",2),h([m()],A.prototype,"decided",2),h([m()],A.prototype,"expanded",2),h([m()],A.prototype,"error",2),h([m()],A.prototype,"pages",2),A=h([k("homeai-situations")],A);var Ce=i=>[{key:"on",service:`${i}.turn_on`},{key:"off",service:`${i}.turn_off`}],se={scene:[{key:"activate",service:"scene.turn_on"}],script:[{key:"run",service:"script.turn_on"}],light:[...Ce("light"),{key:"brightness",service:"light.turn_on",field:{name:"brightness_pct",min:1,max:100,step:1,unit:"%",fallback:50}}],switch:Ce("switch"),fan:Ce("fan"),input_boolean:Ce("input_boolean"),cover:[{key:"open",service:"cover.open_cover"},{key:"close",service:"cover.close_cover"},{key:"position",service:"cover.set_cover_position",field:{name:"position",min:0,max:100,step:5,unit:"%",fallback:50}}],climate:[{key:"temperature",service:"climate.set_temperature",field:{name:"temperature",min:5,max:30,step:.5,unit:"\xB0",fallback:21}},{key:"off",service:"climate.turn_off"}],media_player:[{key:"off",service:"media_player.turn_off"},{key:"stop",service:"media_player.media_stop"}],vacuum:[{key:"start",service:"vacuum.start"},{key:"dock",service:"vacuum.return_to_base"}],button:[{key:"press",service:"button.press"}],input_button:[{key:"press",service:"input_button.press"}]};function oe(i){return i.split(".",1)[0]}function Pe(i,s){return String(i.states[s]?.attributes.friendly_name??s)}function Vt(i,s){let e=i.entities?.[s],t=e?.area_id??(e?.device_id?i.devices?.[e.device_id]?.area_id:null);return t?i.areas?.[t]?.name??"":""}function mt(i){let s=new Map;for(let t of Object.keys(i.states)){let a=oe(t);if(!(a in se))continue;let n=i.entities?.[t];if(n?.hidden||n?.entity_category)continue;let r=s.get(a)??[];r.push({id:t,name:Pe(i,t),area:Vt(i,t)}),s.set(a,r)}let e=Object.keys(se);return[...s.entries()].sort(([t],[a])=>e.indexOf(t)-e.indexOf(a)).map(([t,a])=>[t,a.sort((n,r)=>n.area.localeCompare(r.area)||n.name.localeCompare(r.name))])}function gt(i){if(!i||i.entity_ids.length!==1)return null;let s=oe(i.entity_ids[0]),e=Object.keys(i.data??{});for(let t of se[s]??[])if(t.service===i.service&&(t.field?e.length===1&&e[0]===t.field.name:e.length===0))return{thing:i.entity_ids[0],verb:t.key,value:t.field?Number(i.data[t.field.name]):null};return null}function ye(i,s){return(se[oe(i)]??[]).find(e=>e.key===s)}function He(i,s,e,t,a){let n=ye(e,t),r=o(s,`verb_${t}`).toLowerCase(),d=n?.field&&a!==null?` ${a}${n.field.unit}`:"";return`${Pe(i,e)}: ${r}${d}`}var Kt=["daily","weekly","once","sun"],Ft=["sunset","sunrise","dusk","dawn","solar_noon"],Zt=["home_or_all","home","all","admins"];function Ht(){let i=new Date;return`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`}function Gt(){return{type:"action",title:"",thing:"",verb:"",value:null,custom:!1,service:"",entities:"",data:"",reminder:"",to:"home_or_all",when:{kind:"daily",time:"08:00"},enabled:!0,skip_when_away:!1}}function vt(i){let s=gt(i.action);return{id:i.id,type:i.reminder?"reminder":"action",title:i.title,thing:s?.thing??"",verb:s?.verb??"",value:s?.value??null,custom:!!i.action&&!s,service:i.action?.service??"",entities:(i.action?.entity_ids??[]).join(", "),data:i.action&&Object.keys(i.action.data).length?JSON.stringify(i.action.data):"",reminder:i.reminder??"",to:i.to??"home_or_all",when:{...i.when},enabled:i.enabled,skip_when_away:i.skip_when_away}}function Jt(i,s){let e=Array.from({length:7},(a,n)=>new Date(2024,0,1+n).toLocaleDateString(s,{weekday:"short"})),t=i.days?.length?i.days.map(a=>e[a]).join(", "):"";switch(i.kind){case"once":return`${i.date?new Date(`${i.date}T12:00`).toLocaleDateString(s,{weekday:"short",day:"numeric",month:"long"}):""} ${i.time}`;case"daily":return`${o(s,"plan_daily")} ${i.time}`;case"weekly":return`${t} ${i.time}`;case"sun":{let a=i.offset?` ${i.offset>0?"+":""}${i.offset} min`:"";return`${o(s,`plan_${i.event}`)}${a}${t?` \xB7 ${t}`:""}`}default:return JSON.stringify(i)}}var C=class extends b{constructor(){super(...arguments);this.occurrences=[];this.entries=[];this.watches=[];this.error="";this.pages={};this.expanded=null}connectedCallback(){super.connectedCallback(),this.load()}async load(){let e=await this.hass.callWS({type:"homeai/plan/list",days:31});this.entries=e.entries,this.occurrences=e.occurrences;try{this.watches=(await this.hass.callWS({type:"homeai/watches/list"})).items}catch{this.watches=[]}}async removeWatch(e){await this.hass.callWS({type:"homeai/watches/delete",watch_id:e}),await this.load()}async removeEntry(e){confirm(o(this.hass.language,"remove_confirm"))&&(await this.hass.callWS({type:"homeai/plan/delete",entry_id:e}),this.close(),await this.load())}async skip(e){let t=ee(e.at,this.hass.config?.time_zone).date;await this.hass.callService("homeai","plan_skip",{entry_id:e.entry_id,date:t}),this.expanded=null,await this.load()}set(e){this.draft={...this.draft,...e}}setWhen(e){let t={...this.draft.when,...e};e.kind&&(t.kind==="once"&&!t.date&&(t.date=Ht()),t.kind==="weekly"&&!t.days?.length&&(t.days=[0,1,2,3,4]),t.kind==="sun"&&!t.event&&(t.event="sunset"),t.kind!=="sun"&&!t.time&&(t.time="08:00")),this.set({when:t})}toggleDay(e){let t=this.draft.when.days??[],a=new Set(t.length?t:[0,1,2,3,4,5,6]);a.has(e)?a.delete(e):a.add(e),this.setWhen({days:[...a].sort()})}pickThing(e){let t=(se[oe(e)]??[])[0];this.set({thing:e,verb:t?.key??"",value:t?.field?t.field.fallback:null})}pickVerb(e){let t=ye(this.draft.thing,e),a=t?.field&&this.draft.value!==null&&this.draft.verb===e;this.set({verb:e,value:t?.field?a?this.draft.value:t.field.fallback:null})}async save(){let e=this.draft,t=this.hass.language,a={kind:e.when.kind};e.when.kind!=="sun"&&(a.time=e.when.time),e.when.kind==="once"&&(a.date=e.when.date),(e.when.kind==="weekly"||e.when.kind==="sun"&&e.when.days?.length)&&(a.days=e.when.days),e.when.kind==="sun"&&(a.event=e.when.event,a.offset=Number(e.when.offset??0));let n=e.title.trim(),r={when:a,enabled:e.enabled,skip_when_away:e.skip_when_away};if(e.type==="reminder"){if(!e.reminder.trim())return this.fail(o(t,"plan_reminder_text"));r.reminder=e.reminder,r.to=e.to,n||=e.reminder.trim().slice(0,60)}else if(e.custom){let d={};try{d=e.data.trim()?JSON.parse(e.data):{}}catch(c){return this.fail(`JSON: ${c}`)}r.action={service:e.service.trim(),entity_ids:e.entities.split(/[\s,]+/).filter(Boolean),data:d}}else{let d=ye(e.thing,e.verb);if(!e.thing||!d)return this.fail(o(t,"plan_what"));let c=d.field&&e.value!==null?{[d.field.name]:e.value}:{};r.action={service:d.service,entity_ids:[e.thing],data:c},n||=He(this.hass,t,e.thing,e.verb,e.value)}r.title=n||o(t,"plan_custom");try{await this.hass.callWS({type:"homeai/plan/save",entry:r,...e.id?{entry_id:e.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(d){this.fail(d?.message??String(d))}}fail(e){this.error=`${o(this.hass.language,"plan_error")}: ${e}`}close(){this.draft=void 0,this.error=""}updated(){let e=this.renderRoot.querySelector("dialog");e&&!e.open&&e.showModal()}actionFields(){let e=this.hass.language,t=this.draft;if(t.custom){let r=t.entities.split(/[\s,]+/).filter(Boolean).map(d=>Pe(this.hass,d)).join(", ");return l`<div class="field"><span class="label">${o(e,"plan_do")}</span>
          <div><span part="row-title" class="item-title">${o(e,"plan_custom")}</span><span part="row-meta" class="item-meta wrap">${r||"\u2014"}</span></div>
          <p class="hint">${o(e,"plan_custom_hint")}</p></div>
        ${this.hass.user.is_admin?l`<details><summary class="muted">${o(e,"plan_advanced")}</summary><div class="fields">
              ${this.raw(o(e,"plan_service"),t.service,d=>this.set({service:d}))}
              ${this.raw(o(e,"rule_entities"),t.entities,d=>this.set({entities:d}))}
              ${this.raw(o(e,"plan_data"),t.data,d=>this.set({data:d}))}
            </div></details>`:p}`}let a=t.thing?se[oe(t.thing)]??[]:[],n=ye(t.thing,t.verb);return l`
      <label class="field"><span class="label">${o(e,"plan_what")}</span>
        <select part="input" @change=${r=>this.pickThing(r.target.value)}>
          <option value="" ?selected=${!t.thing} disabled>${o(e,"plan_pick")}</option>
          ${mt(this.hass).map(([r,d])=>l`<optgroup label=${o(e,`type_${r}`)}>
            ${d.map(c=>l`<option value=${c.id} ?selected=${c.id===t.thing}>${c.name}${c.area&&!c.name.includes(c.area)?` \u2014 ${c.area}`:""}</option>`)}
          </optgroup>`)}
        </select></label>
      ${a.length>1?l`<div class="field"><span class="label">${o(e,"plan_do")}</span>
            <div class="segmented" role="group" aria-label=${o(e,"plan_do")}>
              ${a.map(r=>l`<button part=${r.key===t.verb?"button button-primary":"button"} class=${r.key===t.verb?"primary":""}
                aria-pressed=${r.key===t.verb?"true":"false"} @click=${()=>this.pickVerb(r.key)}>${o(e,`verb_${r.key}`)}</button>`)}
            </div></div>`:a.length?l`<p class="hint">${o(e,`verb_${a[0].key}`)}</p>`:p}
      ${n?.field?l`<label class="field"><span class="label">${o(e,`verb_${n.key}`)}: <b>${t.value??n.field.fallback}${n.field.unit}</b></span>
            <input part="input" type="range" min=${n.field.min} max=${n.field.max} step=${n.field.step} .value=${String(t.value??n.field.fallback)}
              @input=${r=>this.set({value:Number(r.target.value)})} /></label>`:p}`}raw(e,t,a){return l`<label class="field"><span class="label">${e}</span><input part="input" .value=${t} @input=${n=>a(n.target.value)} /></label>`}form(){let e=this.hass.language,t=this.draft,a=t.when,n=Array.from({length:7},(c,g)=>new Date(2024,0,1+g).toLocaleDateString(e,{weekday:"short"})),r=(c,g)=>l`<label class="field"><span class="label">${c}</span>${g}</label>`,d=(c,g,u,v)=>l`<div class="segmented" role="group">${c.map(_=>l`<button part=${_===g?"button button-primary":"button"} class=${_===g?"primary":""}
        aria-pressed=${_===g?"true":"false"} @click=${()=>v(_)}>${u(_)}</button>`)}</div>`;return l`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${o(e,t.id?"plan_change":"plan_new")}</h2></div>
      <div class="sheet-body fields">
        ${t.custom?p:d(["action","reminder"],t.type,c=>o(e,`plan_${c}`),c=>this.set({type:c}))}
        ${t.type==="reminder"?l`${r(o(e,"plan_reminder_text"),l`<input part="input" .value=${t.reminder} @input=${c=>this.set({reminder:c.target.value})} />`)}
            ${r(o(e,"plan_to"),l`<select part="input" @change=${c=>this.set({to:c.target.value})}>
              ${Zt.map(c=>l`<option value=${c} ?selected=${c===t.to}>${o(e,`plan_to_${c}`)}</option>`)}</select>`)}`:this.actionFields()}
        <div class="field"><span class="label">${o(e,"plan_when")}</span>
          ${d(Kt,a.kind,c=>o(e,`plan_${c}`),c=>this.setWhen({kind:c}))}</div>
        <div class="pair">
          ${a.kind==="once"?r(o(e,"plan_day"),l`<input part="input" type="date" .value=${a.date??""} @change=${c=>this.setWhen({date:c.target.value})} />`):p}
          ${a.kind==="sun"?l`${r(o(e,"plan_moment"),l`<select part="input" @change=${c=>this.setWhen({event:c.target.value})}>
                ${Ft.map(c=>l`<option value=${c} ?selected=${c===a.event}>${o(e,`plan_${c}`)}</option>`)}</select>`)}
              ${r(o(e,"plan_offset"),l`<input part="input" type="number" min="-720" max="720" step="5" .value=${String(a.offset??0)} @change=${c=>this.setWhen({offset:parseInt(c.target.value,10)||0})} />`)}`:r(o(e,"plan_time"),l`<input part="input" type="time" .value=${a.time??""} @change=${c=>this.setWhen({time:c.target.value})} />`)}
        </div>
        ${a.kind==="weekly"||a.kind==="sun"?l`<div class="chips" role="group">${n.map((c,g)=>{let u=!a.days?.length||a.days.includes(g);return l`<button part=${u?"button button-primary":"button"} aria-pressed=${u?"true":"false"} @click=${()=>this.toggleDay(g)}>${c}</button>`})}</div>`:p}
        ${r(o(e,"plan_name_optional"),l`<input part="input" .value=${t.title}
          placeholder=${t.type==="action"&&!t.custom&&t.thing?He(this.hass,e,t.thing,t.verb,t.value):""}
          @input=${c=>this.set({title:c.target.value})} />`)}
        <label class="check"><input part="input" type="checkbox" .checked=${t.skip_when_away} @change=${c=>this.set({skip_when_away:c.target.checked})} />${o(e,"plan_skip_away")}</label>
        <label class="check"><input part="input" type="checkbox" .checked=${t.enabled} @change=${c=>this.set({enabled:c.target.checked})} />${o(e,"rule_enabled")}</label>
        ${this.error?l`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${t.id?l`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeEntry(t.id)}>${o(e,"remove")}</button>`:p}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${o(e,"cancel")}</button>
        <button part="button button-primary" class="primary" ?disabled=${t.custom&&!this.hass.user.is_admin} @click=${this.save}>${o(e,"save")}</button>
      </div>
    </dialog>`}timeline(){let e=this.hass.language,t=this.hass.config?.time_zone,a=$(this,"next",this.occurrences,e,15),n=a.items,r=[],d="";return n.forEach((c,g)=>{let u=j(c.at,t);u!==d&&(r.push(l`<li part="day" class="day">${ne(c.at,e,t)}</li>`),d=u);let v=`${c.entry_id}|${c.at}|${a.offset+g}`,_=this.expanded===v,y=c.external?this.hass.states[c.source??""]?.attributes.friendly_name??c.source??"":"",w=y&&!c.title.toLowerCase().includes(String(y).toLowerCase())?`${o(e,"from_source")} ${y}`:"",P=l`<span part="time" class="time">${te(c.at,e,t)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${c.title}</span>${w?l`<span part="row-meta" class="item-meta">${w}</span>`:p}</span>
        <span></span>`;r.push(c.external?l`<li part="row"><div class="item-main timed">${P}</div></li>`:l`<li part="row" class=${_?"open":""}>
            <button class="item-main timed" aria-expanded=${_?"true":"false"} @click=${()=>this.expanded=_?null:v}>${P}</button>
            ${_?l`<div class="item-more"><div class="item-actions">
                  <button part="button" @click=${()=>this.skip(c)}>${o(e,"plan_skip_once")}</button>
                  ${this.entries.some(de=>de.id===c.entry_id)?l`<button part="button button-quiet" class="quiet" @click=${()=>this.edit(c.entry_id)}>${o(e,"plan_edit_entry")}</button>`:p}
                </div></div>`:p}
          </li>`)}),l`<ul part="card list" class="list">${r}</ul>${a.nav}`}edit(e){let t=this.entries.find(a=>a.id===e);t&&(this.draft=vt(t))}render(){let e=this.hass.language;return l`
      ${this.draft?this.form():p}
      <div class="columns">
        <section class="section">
          <div class="section-head"><h2 part="heading" class="heading">${o(e,"plan_next")}</h2>
            <button part="button button-primary" class="primary" @click=${()=>this.draft=Gt()}>${o(e,"plan_add")}</button></div>
          ${this.occurrences.length?this.timeline():l`<div part="empty" class="empty">${o(e,"no_plan")}</div>`}
        </section>
        <div>
          ${this.watches.length?l`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${o(e,"watching")} <span class="count">${this.watches.length}</span></h2></div>
                <ul part="card list" class="list">${$(this,"watches",this.watches,e).items.map(t=>{let a=this.expanded===`watch|${t.id}`;return l`<li part="row" class=${a?"open":""}>
                    <button class="item-main plain" aria-expanded=${a?"true":"false"} @click=${()=>this.expanded=a?null:`watch|${t.id}`}>
                      <span class="item-text"><span part="row-title" class="item-title">${t.what}</span>
                        <span part="row-meta" class="item-meta">${t.message?`${t.message} \xB7 `:""}${o(e,"until")} ${O(t.expires,e)}</span></span>
                      <span></span>
                    </button>
                    ${a?l`<div class="item-more flush"><div class="item-actions">
                      <button part="button" @click=${()=>this.removeWatch(t.id)}>${o(e,"watch_stop")}</button></div></div>`:p}
                  </li>`})}</ul>
                ${$(this,"watches",this.watches,e).nav}
              </section>`:p}
          ${this.entries.length?l`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${o(e,"plan_entries")} <span class="count">${this.entries.length}</span></h2></div>
                <ul part="card list" class="list">${$(this,"entries",this.entries,e).items.map(t=>l`<li part="row">
                  <button class="item-main plain" @click=${()=>this.draft=vt(t)}>
                    <span class="item-text"><span part="row-title" class="item-title ${t.enabled?"":"off"}">${t.title}</span>
                      <span part="row-meta" class="item-meta">${Jt(t.when,e)} · ${t.author_name}${t.enabled?"":` \xB7 ${o(e,"entry_off")}`}</span></span>
                    <span class="chevron">›</span>
                  </button></li>`)}</ul>
                ${$(this,"entries",this.entries,e).nav}
              </section>`:p}
        </div>
      </div>`}};C.styles=[x,E`
      /* a wide screen: what comes next on the left, what is set up on the right */
      :host { container-type: inline-size; }
      @container (min-width: 56em) {
        .columns { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); column-gap: var(--_section-spacing); align-items: start; }
      }
    `],h([f({attribute:!1})],C.prototype,"hass",2),h([m()],C.prototype,"occurrences",2),h([m()],C.prototype,"entries",2),h([m()],C.prototype,"watches",2),h([m()],C.prototype,"draft",2),h([m()],C.prototype,"error",2),h([m()],C.prototype,"pages",2),h([m()],C.prototype,"expanded",2),C=h([k("homeai-plan")],C);var K=class extends b{constructor(){super(...arguments);this.entries=[];this.pages={}}async connectedCallback(){super.connectedCallback();try{let e=await this.hass.callWS({type:"homeai/journal/recent",limit:500});this.entries=e.entries}catch{this.entries=[]}}render(){let e=this.hass.language,t=this.hass.config?.time_zone;if(!this.entries.length)return l`<div part="empty" class="empty">—</div>`;let a=$(this,"entries",this.entries,e,30),n=[],r="";for(let d of a.items){let c=j(d.ts,t);c!==r&&(n.push(l`<li part="day" class="day">${ne(d.ts,e,t)}</li>`),r=c),n.push(l`<li part="row"><div class="item-main timed">
        <span part="time" class="time">${te(d.ts,e,t)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${d.text}</span>
          <span part="row-meta" class="item-meta">${o(e,`kind_${d.kind}`).replace(/^kind_/,"")}</span></span>
        <span></span></div></li>`)}return l`<ul part="card list" class="list">${n}</ul>${a.nav}`}};K.styles=x,h([f({attribute:!1})],K.prototype,"hass",2),h([m()],K.prototype,"entries",2),h([m()],K.prototype,"pages",2),K=h([k("homeai-journal")],K);var B={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},je=i=>(...s)=>({_$litDirective$:i,values:s}),le=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,e,t){this._$Ct=s,this._$AM=e,this._$Ci=t}_$AS(s,e){return this.update(s,e)}update(s,e){return this.render(...e)}};var{I:Yt}=pt,_t=i=>i;var ft=i=>i.strings===void 0,yt=()=>document.createComment(""),ce=(i,s,e)=>{let t=i._$AA.parentNode,a=s===void 0?i._$AB:s._$AA;if(e===void 0){let n=t.insertBefore(yt(),a),r=t.insertBefore(yt(),a);e=new Yt(n,r,i,i.options)}else{let n=e._$AB.nextSibling,r=e._$AM,d=r!==i;if(d){let c;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(c=i._$AU)!==r._$AU&&e._$AP(c)}if(n!==a||d){let c=e._$AA;for(;c!==n;){let g=_t(c).nextSibling;_t(t).insertBefore(c,a),c=g}}}return e},F=(i,s,e=i)=>(i._$AI(s,e),i),Qt={},Re=(i,s=Qt)=>i._$AH=s,bt=i=>i._$AH,Me=i=>{i._$AR(),i._$AA.remove()};var M=je(class extends le{constructor(i){if(super(i),i.type!==B.PROPERTY&&i.type!==B.ATTRIBUTE&&i.type!==B.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ft(i))throw Error("`live` bindings can only contain a single expression")}render(i){return i}update(i,[s]){if(s===z||s===p)return s;let e=i.element,t=i.name;if(i.type===B.PROPERTY){if(s===e[t])return z}else if(i.type===B.BOOLEAN_ATTRIBUTE){if(!!s===e.hasAttribute(t))return z}else if(i.type===B.ATTRIBUTE&&e.getAttribute(t)===s+"")return z;return Re(i),s}});var $t=(i,s,e)=>{let t=new Map;for(let a=s;a<=e;a++)t.set(i[a],a);return t},wt=je(class extends le{constructor(i){if(super(i),i.type!==B.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,s,e){let t;e===void 0?e=s:s!==void 0&&(t=s);let a=[],n=[],r=0;for(let d of i)a[r]=t?t(d,r):r,n[r]=e(d,r),r++;return{values:n,keys:a}}render(i,s,e){return this.dt(i,s,e).values}update(i,[s,e,t]){let a=bt(i),{values:n,keys:r}=this.dt(s,e,t);if(!Array.isArray(a))return this.ut=r,n;let d=this.ut??=[],c=[],g,u,v=0,_=a.length-1,y=0,w=n.length-1;for(;v<=_&&y<=w;)if(a[v]===null)v++;else if(a[_]===null)_--;else if(d[v]===r[y])c[y]=F(a[v],n[y]),v++,y++;else if(d[_]===r[w])c[w]=F(a[_],n[w]),_--,w--;else if(d[v]===r[w])c[w]=F(a[v],n[w]),ce(i,c[w+1],a[v]),v++,w--;else if(d[_]===r[y])c[y]=F(a[_],n[y]),ce(i,a[v],a[_]),_--,y++;else if(g===void 0&&(g=$t(r,y,w),u=$t(d,v,_)),g.has(d[v]))if(g.has(d[_])){let P=u.get(r[y]),de=P!==void 0?a[P]:null;if(de===null){let Ge=ce(i,a[v]);F(Ge,n[y]),c[y]=Ge}else c[y]=F(de,n[y]),ce(i,a[v],de),a[P]=null;y++}else Me(a[_]),_--;else Me(a[v]),v++;for(;y<=w;){let P=ce(i,c[w+1]);F(P,n[y]),c[y++]=P}for(;v<=_;){let P=a[v++];P!==null&&Me(P)}return this.ut=r,Re(i,c),z}});var Xt=["global","floor","area","device","entity","person"],S=class extends b{constructor(){super(...arguments);this.section="general";this.filter="";this.advanced=!1;this.message="";this.scopeType="global";this.scopeRef="";this.scopeValues={};this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}get skey(){return this.scopeType==="global"||!this.scopeRef?"global":`${this.scopeType}:${this.scopeRef}`}async load(){this.schema=await this.hass.callWS({type:"homeai/settings/schema",language:this.hass.language}),this.world||(this.world=await this.hass.callWS({type:"homeai/world/summary"})),await this.loadScope()}async loadScope(){if(this.skey==="global"){this.scopeValues={};return}let e=await this.hass.callWS({type:"homeai/settings/scope",scope:this.skey});this.scopeValues=e.values}targets(){let e=this.hass;switch(this.scopeType){case"floor":return(this.world?.floors??[]).map(t=>({id:t.id,name:t.name}));case"area":return(this.world?.areas??[]).map(t=>({id:t.id,name:t.name}));case"person":return(this.world?.persons??[]).map(t=>({id:t.id,name:t.name}));case"device":return Object.values(e.devices??{}).map(t=>({id:t.id,name:t.name_by_user||t.name||t.id})).sort((t,a)=>t.name.localeCompare(a.name));case"entity":return Object.values(e.states).map(t=>({id:t.entity_id,name:`${t.attributes.friendly_name??t.entity_id} (${t.entity_id})`})).sort((t,a)=>t.name.localeCompare(a.name));default:return[]}}parse(e,t){switch(e.type){case"bool":return!!t;case"int":case"duration":return parseInt(String(t),10);case"float":return parseFloat(String(t));case"multiselect":return t;case"entities":case"strings":return String(t).split(/[\n,]/).map(a=>a.trim()).filter(Boolean);case"json":return JSON.parse(String(t));default:return t}}async save(e,t){let a;try{a=this.parse(e,t)}catch(r){this.message=`${e.label}: ${r}`;return}let n=this.skey;try{if((await this.hass.callWS({type:"homeai/settings/set",key:e.key,value:a,scope:n})).needs_confirmation){if(!confirm(`${e.label}

${o(this.hass.language,"confirm_change")}`)){await this.load();return}await this.hass.callWS({type:"homeai/settings/set",key:e.key,value:a,scope:n,confirmed:!0})}this.message=`${e.label}: ${o(this.hass.language,"saved")}`}catch(r){this.message=r?.message??String(r)}await this.load()}async reset(e){await this.hass.callWS({type:"homeai/settings/reset",key:e.key,scope:this.skey}),await this.load()}async resetSection(){let e=this.schema?.sections.find(a=>a.id===this.section);if(!e||!confirm(`${e.label}

${o(this.hass.language,"reset_section_confirm")}`))return;let t=await this.hass.callWS({type:"homeai/settings/reset_section",section:this.section});this.message=`${e.label}: ${t.reset} \xD7 ${o(this.hass.language,"reset")}`,await this.load()}async undo(){confirm(o(this.hass.language,"undo_confirm"))&&(await this.hass.callWS({type:"homeai/settings/undo"}),await this.load())}async exportSettings(){let e=await this.hass.callWS({type:"homeai/settings/export"}),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(t),a.download="homeai-settings.json",a.click()}async importSettings(e){let t=e.target,a=t.files?.[0];if(t.value="",!(!a||!confirm(o(this.hass.language,"import_confirm")))){try{let n=JSON.parse(await a.text()),r=await this.hass.callWS({type:"homeai/settings/import",data:n});this.message=`${o(this.hass.language,"import")}: ${r.changed}`}catch(n){this.message=n?.message??String(n)}await this.load()}}async toggleHistory(){if(this.history){this.history=void 0;return}let e=await this.hass.callWS({type:"homeai/settings/history",limit:100});this.history=e.history}input(e,t){let a=n=>{let r=n.target;return e.type==="bool"?this.save(e,r.checked):e.type==="multiselect"?this.save(e,Array.from(r.selectedOptions).map(d=>d.value)):this.save(e,r.value)};switch(e.type){case"bool":return l`<input part="input" type="checkbox" .checked=${M(!!t)} @change=${a} />`;case"select":return l`<select part="input" @change=${a}>${e.options.map(n=>l`<option value=${n} .selected=${M(n===t)}>${e.option_labels?.[n]??n}</option>`)}</select>`;case"multiselect":return l`<select part="input" multiple size=${Math.min(e.options.length,6)} @change=${a}>
          ${e.options.map(n=>l`<option value=${n} .selected=${M((t??[]).includes(n))}>${e.option_labels?.[n]??n}</option>`)}</select>`;case"int":case"float":case"duration":return l`<input part="input" type="number" class="w-m" .value=${M(String(t))} min=${e.min??""} max=${e.max??""}
          step=${e.step??(e.type==="float"?"any":1)} @change=${a} /> ${e.unit??""}`;case"time":return l`<input part="input" type="time" .value=${M(String(t))} @change=${a} />`;case"json":return l`<textarea part="input" .value=${M(JSON.stringify(t,null,2))} @change=${a}></textarea>`;case"entities":case"strings":return l`<textarea part="input" .value=${M((t??[]).join(`
`))} @change=${a} placeholder="one per line"></textarea>`;case"text":return l`<textarea part="input" .value=${M(String(t??""))} @change=${a}></textarea>`;default:return l`<input part="input" type="text" .value=${M(String(t??""))} @change=${a} />`}}scopeBar(){let e=this.hass.language,t=this.targets();return l`<div class="pair">
      <label class="field"><span class="label">${o(e,"scope")}</span><select part="input" @change=${a=>{this.scopeType=a.target.value,this.scopeRef="",this.loadScope()}}>${Xt.map(a=>l`<option value=${a} ?selected=${a===this.scopeType}>${o(e,`scope_${a}`)}</option>`)}</select></label>
      ${this.scopeType==="global"?p:l`<label class="field"><span class="label">\u00a0</span><select part="input" @change=${a=>{this.scopeRef=a.target.value,this.loadScope()}}><option value="">—</option>${t.map(a=>l`<option value=${a.id} ?selected=${a.id===this.scopeRef}>${a.name}</option>`)}</select></label>`}
    </div>`}historyCard(){let e=this.hass.language,t=new Map((this.schema?.settings??[]).map(n=>[n.key,n.label])),a=n=>n==null?"\u2014":typeof n=="object"?JSON.stringify(n):String(n);return l`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${o(e,"history")}</h2>
        <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${o(e,"close")}</button></div>
      <ul part="card list" class="list">${$(this,"history",this.history??[],e,15).items.map(n=>l`<li part="row"><div class="item-main plain">
        <span class="item-text"><span part="row-title" class="item-title">${t.get(n.key)??n.key}${n.scope!=="global"?l` <span class="muted">(${n.scope})</span>`:p}</span>
          <span part="row-meta" class="item-meta">${n.key==="import"?o(e,"import"):n.reset?`${a(n.old)} \u2192 ${o(e,"default")}`:`${a(n.old)} \u2192 ${a(n.new)}`}${n.user?` \xB7 ${n.user}`:""}</span></span>
        <span part="time" class="item-aside">${O(n.ts,e)}</span></div></li>`)}</ul>
      ${$(this,"history",this.history??[],e,15).nav}
    </section>`}render(){let e=this.hass.language;if(!this.hass.user.is_admin)return l`<div part="empty" class="empty">${o(e,"admin_only")}</div>`;if(!this.schema)return p;let t=this.filter.toLowerCase(),a=this.skey!=="global",n=this.schema.sections.find(u=>u.id===this.section)??this.schema.sections[0],r=n?.id??this.section,d=this.schema.settings.filter(u=>(t?`${u.label} ${u.description} ${u.key}`.toLowerCase().includes(t):u.section===r)&&(this.advanced||!u.advanced||t)&&(this.scopeType==="global"||u.scopes.includes(this.scopeType))),c=$(this,`${t?`?${t}`:r}|${this.skey}|${this.advanced}`,d,e,20),g=c.items;return l`
      <div class="tools">
        <input part="input" type="search" placeholder=${o(e,"search")} aria-label=${o(e,"search")} .value=${this.filter} @input=${u=>this.filter=u.target.value} />
        ${this.scopeBar()}
        <label class="check"><input part="input" type="checkbox" .checked=${this.advanced} @change=${u=>this.advanced=u.target.checked} />${o(e,"advanced")}</label>
      </div>
      ${this.history?this.historyCard():p}
      ${this.message?l`<div part="card" class="card muted">${this.message}</div>`:p}
      <div class="layout">
        ${t?l`<div></div>`:l`<nav part="segmented" class="nav glass segmented" aria-label=${o(e,"section")}>
          ${this.schema.sections.map(u=>l`<button part=${u.id===r?"button button-primary":"button"} class=${u.id===r?"primary":""}
            aria-current=${u.id===r?"true":"false"} @click=${()=>this.section=u.id}>${u.label}</button>`)}
        </nav>`}
        <section>
          ${t?p:l`<label class="field picker section"><span class="label">${o(e,"section")}</span>
            <select part="input" @change=${u=>this.section=u.target.value}>
              ${this.schema.sections.map(u=>l`<option value=${u.id} ?selected=${u.id===r}>${u.label}</option>`)}</select></label>`}
          ${t||!n?p:l`<div class="section-head"><h2 part="heading" class="heading">${n.label}</h2>
            ${a?p:l`<button part="button button-quiet" class="quiet" @click=${this.resetSection}>${o(e,"reset_section")}</button>`}</div>
            <p class="hint">${n.description}</p>`}
          ${this.scopeType!=="global"&&!this.scopeRef?l`<div part="empty" class="empty">${o(e,"scope_pick")}</div>`:l`<ul part="card list" class="list">
            ${g.length?p:l`<li class="empty">${o(e,"scope_none")}</li>`}
            ${wt(c.items,u=>`${this.skey}|${u.key}`,u=>{let v=a&&u.key in this.scopeValues,_=v?this.scopeValues[u.key]:u.value,y=Object.keys(u.overrides||{}).length,w=v?o(e,"overridden"):a?o(e,"inherited"):y?`${y} \xD7 ${o(e,"overridden")}`:"";return l`<li part="row" class="setting">
                <span class="item-text"><span part="row-title" class="item-title">${u.label}</span>
                  <span part="row-meta" class="item-meta wrap">${u.description}${w?l` · <b>${w}</b>`:p}</span></span>
                ${(a?v:u.source!=="default")?l`<button part="button button-quiet" class="quiet" title=${o(e,"reset")} aria-label=${`${o(e,"reset")}: ${u.label}`} @click=${()=>this.reset(u)}>↺</button>`:l`<span></span>`}
                <span class="control">${this.input(u,_)}</span>
              </li>`})}
          </ul>${c.nav}`}
          <div class="footer">
            <button part="button button-quiet" class="quiet" @click=${this.undo}>${o(e,"undo")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${o(e,"history")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.exportSettings}>${o(e,"export")}</button>
            <span><button part="button button-quiet" class="quiet" @click=${u=>u.currentTarget.nextElementSibling.click()}>${o(e,"import")}</button><input part="input" type="file" accept="application/json,.json" hidden @change=${this.importSettings} /></span>
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
    `],h([f({attribute:!1})],S.prototype,"hass",2),h([m()],S.prototype,"schema",2),h([m()],S.prototype,"world",2),h([m()],S.prototype,"section",2),h([m()],S.prototype,"filter",2),h([m()],S.prototype,"advanced",2),h([m()],S.prototype,"message",2),h([m()],S.prototype,"scopeType",2),h([m()],S.prototype,"scopeRef",2),h([m()],S.prototype,"scopeValues",2),h([m()],S.prototype,"history",2),h([m()],S.prototype,"pages",2),S=h([k("homeai-settings")],S);var L=class extends b{constructor(){super(...arguments);this.prompts=[];this.message="";this.drafts={}}async connectedCallback(){if(super.connectedCallback(),!!this.hass.user.is_admin)try{this.status=await this.hass.callWS({type:"homeai/ai/status"}),await this.loadPrompts()}catch(e){this.status={enabled:!1},this.message=e?.message??String(e)}}async loadPrompts(){this.prompts=(await this.hass.callWS({type:"homeai/ai/prompts"})).prompts}async savePrompt(e,t){try{await this.hass.callWS({type:"homeai/settings/set",key:e.key,value:t}),this.message=`${o(this.hass.language,`prompt_${e.mission}`)}: ${o(this.hass.language,"saved")}`;let{[e.mission]:a,...n}=this.drafts;this.drafts=n}catch(a){this.message=a?.message??String(a)}await this.loadPrompts()}async restorePrompt(e){await this.hass.callWS({type:"homeai/settings/reset",key:e.key}),this.message=`${o(this.hass.language,`prompt_${e.mission}`)}: ${o(this.hass.language,"prompt_restored")}`;let{[e.mission]:t,...a}=this.drafts;this.drafts=a,await this.loadPrompts()}promptCard(e){let t=this.hass.language,a=this.drafts[e.mission]??(e.custom||e.default);return l`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${o(t,`prompt_${e.mission}`)}</span>
        <span class="muted">${e.custom?o(t,"prompt_custom"):o(t,"prompt_default")}</span></summary>
      <p class="muted">${o(t,"prompt_hint")}</p>
      <textarea part="input" class="tall" .value=${M(a)} @input=${n=>this.drafts={...this.drafts,[e.mission]:n.target.value}}></textarea>
      <div class="row actions">
        <button part="button button-primary" class="primary" @click=${()=>this.savePrompt(e,a.trim()===e.default.trim()?"":a)}>${o(t,"save")}</button>
        ${e.custom?l`<button part="button" @click=${()=>this.restorePrompt(e)}>${o(t,"prompt_restore")}</button>`:p}
      </div>
      ${e.custom?l`<details><summary class="muted">${o(t,"prompt_show_default")}</summary><textarea part="input" readonly class="tall">${e.default}</textarea></details>`:p}
    </details>`}render(){let e=this.hass.language;if(!this.hass.user.is_admin)return l`<div part="empty" class="empty">${o(e,"admin_only")}</div>`;let t=this.status;if(!t)return p;let a=Object.entries(t.tiers??{}),n=(r,d)=>l`<li part="row"><div class="item-main plain">
      <span class="item-text"><span part="row-meta" class="item-meta">${r}</span><span part="row-title" class="item-title title">${d}</span></span></div></li>`;return l`
      <section class="section">
        <ul part="card list" class="list">
          ${n(o(e,"cost_today"),`$${(t.ledger?.today??0).toFixed(3)}`)}
          ${n(o(e,"cost_month"),`$${(t.ledger?.month??0).toFixed(2)}`)}
          ${(t.ledger?.limits??[]).map(r=>n(o(e,`limit_${r.period}`),`$${r.spent.toFixed(2)} / $${r.limit}`))}
        </ul>
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${o(e,"tiers")}</h2></div>
        ${a.length?l`<ul part="card list" class="list">${a.flatMap(([r,d])=>d.map(c=>l`<li part="row"><div class="item-main">
              <b>${r.toUpperCase()}</b>
              <span class="item-text"><span part="row-title" class="item-title">${c.model}</span><span part="row-meta" class="item-meta">${c.provider} · ${c.priority}</span></span>
              <span part="time" class="item-aside">${c.status??"\u2014"}</span></div></li>`))}</ul>`:l`<p class="hint">${o(e,"no_tiers")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${o(e,"prompts")}</h2></div>
        ${this.message?l`<p class="hint">${this.message}</p>`:p}
        ${this.prompts.map(r=>this.promptCard(r))}
      </section>
      ${Object.keys(t.last_prompts??{}).length?l`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${o(e,"last_prompt")}</h2></div>
            ${Object.entries(t.last_prompts??{}).map(([r,d])=>l`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${r.toUpperCase()} · ${d.model} · ${d.purpose}</span>
                <span class="muted">$${d.cost.toFixed(4)}</span></summary>
                <p class="muted">${d.ts}</p><textarea part="input" readonly>${JSON.stringify(d.messages,null,2)}</textarea><textarea part="input" readonly>${d.answer}</textarea></details>`)}
          </section>`:p}`}};L.styles=x,h([f({attribute:!1})],L.prototype,"hass",2),h([m()],L.prototype,"status",2),h([m()],L.prototype,"prompts",2),h([m()],L.prototype,"message",2),h([m()],L.prototype,"drafts",2),L=h([k("homeai-ai")],L);var W=class extends b{constructor(){super(...arguments);this.proposals=[];this.facts=[];this.reviews=[];this.draft="";this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}async load(){let e=await this.hass.callWS({type:"homeai/learning/status"});this.proposals=e.proposals,this.facts=e.facts,this.reviews=e.reviews}async call(e,t){await this.hass.callWS({type:e,...t}),await this.load()}async remember(){this.draft.trim()&&(await this.call("homeai/memory/add",{text:this.draft}),this.draft="")}render(){let e=this.hass.language,t=a=>a.scope==="home"?o(e,"memory_home"):this.hass.states[a.scope.replace(/^person:/,"")]?.attributes.friendly_name??a.scope;return l`
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${o(e,"proposals")}${this.proposals.length?l` <span class="count">${this.proposals.length}</span>`:p}</h2></div>
        ${this.proposals.length?l`<ul part="card list" class="list">${$(this,"proposals",this.proposals,e).items.map(a=>l`<li part="row" class="open">
              <div class="item-main plain"><span class="item-text"><span part="row-title" class="item-title">${a.title}</span>
                <span part="row-meta" class="item-meta">${a.days_seen} ${o(e,"days_of")} ${a.days_possible} ${o(e,"days_word")}</span></span></div>
              <div class="item-more flush"><div class="item-actions end">
                <button part="button" @click=${()=>this.call("homeai/learning/reject",{proposal_id:a.id})}>${o(e,"deny")}</button>
                <button part="button button-primary" class="primary" @click=${()=>this.call("homeai/learning/approve",{proposal_id:a.id})}>${o(e,"approve")}</button>
              </div></div></li>`)}</ul>${$(this,"proposals",this.proposals,e).nav}`:l`<p class="hint">${o(e,"no_proposals")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${o(e,"memory")}${this.facts.length?l` <span class="count">${this.facts.length}</span>`:p}</h2></div>
        <ul part="card list" class="list">
          <li part="row"><div class="item-main plain">
            <input part="input" .value=${this.draft} placeholder=${o(e,"remember_hint")} aria-label=${o(e,"remember_hint")}
              @input=${a=>this.draft=a.target.value} @keydown=${a=>a.key==="Enter"&&this.remember()} />
            <button part="button" ?disabled=${!this.draft.trim()} @click=${this.remember}>${o(e,"remember")}</button>
          </div></li>
          ${$(this,"facts",this.facts,e).items.map(a=>l`<li part="row"><div class="item-main plain">
            <span class="item-text"><span part="row-title" class="item-title">${a.text}</span>
              <span part="row-meta" class="item-meta">${t(a)} · ${o(e,`memory_from_${a.source}`)}</span></span>
            <span class="item-actions">
              ${a.approved?p:l`<button part="button" @click=${()=>this.call("homeai/memory/approve",{fact_id:a.id})}>${o(e,"approve")}</button>`}
              <button part="button button-quiet" class="quiet" aria-label=${`${o(e,"remove")}: ${a.text}`} @click=${()=>this.call("homeai/memory/remove",{fact_id:a.id})}>${o(e,"remove")}</button>
            </span></div></li>`)}
        </ul>
        ${$(this,"facts",this.facts,e).nav}
      </section>
      ${this.reviews.length?l`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${o(e,"review")}</h2><span class="muted">${O(this.reviews[0].ts,e)}</span></div>
            <div part="card" class="card"><p class="pre-line">${this.reviews[0].text}</p></div>
          </section>`:p}
    `}};W.styles=x,h([f({attribute:!1})],W.prototype,"hass",2),h([m()],W.prototype,"proposals",2),h([m()],W.prototype,"facts",2),h([m()],W.prototype,"reviews",2),h([m()],W.prototype,"draft",2),h([m()],W.prototype,"pages",2),W=h([k("homeai-learning")],W);var It={id:"",name:"",enabled:!0,target:{entities:[],label:null,area:null,domain:null},condition:{type:"state",value:"on"},minutes:10,severity:1,category:"info",need:"member",advice:"",when:"always",mode:"each"},ea=["state","not_state","above","below","unavailable"],ta=["safety","security","damage","system","energy","comfort","maintenance","info"],aa=["nobody","member","admin","service"],sa=["always","night","away","home"],D=class extends b{constructor(){super(...arguments);this.rules=[];this.error="";this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}async load(){let e=await this.hass.callWS({type:"homeai/rules/list"});this.rules=e.rules}async saveAll(e){this.error="";try{await this.hass.callWS({type:"homeai/rules/save",rules:e.map(({firing:t,...a})=>a)}),this.editing=void 0,this.preview=void 0,await this.load()}catch(t){this.error=t?.message??String(t)}}async save(){let e=this.editing;if(!e.id){let a=e.name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").slice(0,36)||"rule",n=new Set(this.rules.map(d=>d.id)),r=a;for(let d=2;n.has(r);d++)r=`${a}_${d}`;e.id=r}let t=this.rules.filter(a=>a.id!==e.id);await this.saveAll([...t,e])}async previewRule(){this.error="";try{this.preview=await this.hass.callWS({type:"homeai/rules/preview",rule:this.editing})}catch(e){this.error=e?.message??String(e)}}set(e,t){let a=structuredClone(this.editing),n=e.split("."),r=a;for(let d of n.slice(0,-1))r=r[d];r[n[n.length-1]]=t,this.editing=a}field(e,t){return l`<label class="field"><span class="label">${e}</span>${t}</label>`}close(){this.editing=void 0,this.preview=void 0,this.error=""}updated(){let e=this.renderRoot.querySelector("dialog");e&&!e.open&&e.showModal()}async removeRule(e){confirm(`${e.name}

${o(this.hass.language,"remove_confirm")}`)&&await this.saveAll(this.rules.filter(t=>t.id!==e.id))}select(e,t,a){return l`<select part="input" @change=${n=>this.set(e,n.target.value)}>
      ${a.map(n=>l`<option value=${n} ?selected=${n===t}>${o(this.hass.language,`rule_${n}`)}</option>`)}</select>`}renderEditor(){let e=this.hass.language,t=this.editing,a=Object.values(this.hass.areas??{}),n=this.rules.some(r=>r.id===t.id);return l`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${o(e,n?"rule_change":"rule_new")}</h2></div>
      <div class="sheet-body fields">
        ${this.field(o(e,"rule_name"),l`<input part="input" .value=${t.name} @input=${r=>this.set("name",r.target.value)} />`)}
        ${this.field(o(e,"rule_entities"),l`<textarea part="input" .value=${t.target.entities.join(`
`)} placeholder="sensor.freezer"
          @change=${r=>this.set("target.entities",r.target.value.split(/[\n,]/).map(d=>d.trim()).filter(Boolean))}></textarea>`)}
        <div class="pair">
          ${this.field(o(e,"rule_area"),l`<select part="input" @change=${r=>this.set("target.area",r.target.value||null)}>
            <option value="">—</option>${a.map(r=>l`<option value=${r.area_id} ?selected=${r.area_id===t.target.area}>${r.name}</option>`)}</select>`)}
          ${this.field(o(e,"rule_label"),l`<input part="input" .value=${t.target.label??""} @input=${r=>this.set("target.label",r.target.value||null)} />`)}
          ${this.field(o(e,"rule_domain"),l`<input part="input" .value=${t.target.domain??""} placeholder="sensor" @input=${r=>this.set("target.domain",r.target.value||null)} />`)}
        </div>
        <div class="pair">
          ${this.field(o(e,"rule_condition"),this.select("condition.type",t.condition.type,ea))}
          ${t.condition.type==="unavailable"?p:this.field("\xA0",l`<input part="input" .value=${String(t.condition.value??"")}
            @input=${r=>this.set("condition.value",r.target.value)} />`)}
          ${this.field(`${o(e,"rule_minutes")} (min)`,l`<input part="input" type="number" min="0" max="10080" .value=${String(t.minutes)}
            @change=${r=>this.set("minutes",Number(r.target.value))} />`)}
        </div>
        <div class="pair">
          ${this.field(o(e,"rule_when"),this.select("when",t.when,sa))}
          ${this.field(o(e,"rule_mode"),this.select("mode",t.mode,["each","all"]))}
        </div>
        <div class="pair">
          ${this.field(o(e,"rule_category"),this.select("category",t.category,ta))}
          ${this.field(o(e,"severity"),l`<input part="input" type="number" min="0" max=${t.category==="safety"?4:3} .value=${String(t.severity)}
            @change=${r=>this.set("severity",Number(r.target.value))} />`)}
          ${this.field(o(e,"who"),this.select("need",t.need,aa))}
        </div>
        ${this.field(o(e,"rule_advice"),l`<textarea part="input" .value=${t.advice} @change=${r=>this.set("advice",r.target.value)}></textarea>`)}
        <label class="check"><input part="input" type="checkbox" .checked=${t.enabled} @change=${r=>this.set("enabled",r.target.checked)} />${o(e,"rule_enabled")}</label>
        ${this.preview?l`<p class="muted">${o(e,"rule_covers")}: ${this.preview.covered.length} · ${o(e,"rule_meeting")}: ${this.preview.meeting.map(r=>this.preview.covered.find(d=>d.entity_id===r)?.name??r).join(", ")||"\u2014"}</p>`:p}
        ${this.error?l`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${n?l`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeRule(t)}>${o(e,"remove")}</button>`:p}
        <button part="button button-quiet" class="quiet" @click=${this.previewRule}>${o(e,"rule_preview")}</button>
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${o(e,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${o(e,"save")}</button>
      </div>
    </dialog>`}render(){let e=this.hass.language;return this.hass.user.is_admin?l`
      ${this.editing?this.renderEditor():p}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${o(e,"rules")}${this.rules.length?l` <span class="count">${this.rules.length}</span>`:p}</h2>
          <button part="button button-primary" class="primary" @click=${()=>{this.editing=structuredClone(It),this.preview=void 0}}>${o(e,"rule_add")}</button></div>
        ${!this.editing&&this.error?l`<div part="card error" class="card error">${this.error}</div>`:p}
        ${this.rules.length?l`<ul part="card list" class="list">${$(this,"rules",this.rules,e,15).items.map(t=>l`<li part="row">
              <button class="item-main" @click=${()=>{this.editing=structuredClone(t),this.preview=void 0}}>
                <span part="badge badge-${t.severity}" class="dot sev-${t.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title ${t.enabled?"":"off"}">${t.name}</span>
                  <span part="row-meta" class="item-meta">${o(e,`rule_${t.condition.type}`)}${t.condition.type==="unavailable"?"":` ${t.condition.value??""}`} · ${t.minutes} min · ${o(e,`rule_${t.when}`)}${t.enabled?"":` \xB7 ${o(e,"rule_off")}`}${t.firing?` \xB7 ${o(e,"rule_firing")}`:""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>${$(this,"rules",this.rules,e,15).nav}`:l`<div part="empty" class="empty">${o(e,"no_rules")}</div>`}
      </section>
    `:l`<div part="empty" class="empty">${o(e,"admin_only")}</div>`}};D.styles=x,h([f({attribute:!1})],D.prototype,"hass",2),h([m()],D.prototype,"rules",2),h([m()],D.prototype,"editing",2),h([m()],D.prototype,"preview",2),h([m()],D.prototype,"error",2),h([m()],D.prototype,"pages",2),D=h([k("homeai-rules")],D);var ia="homeai-chat-conversation";function ra(i){try{return sessionStorage.getItem(i)}catch{return null}}function kt(i,s){try{s?sessionStorage.setItem(i,s):sessionStorage.removeItem(i)}catch{}}var T=class extends b{constructor(){super(...arguments);this.storageKey=ia;this.compact=!1;this.fill=!1;this.messages=[];this.busy=!1;this.error="";this.conversation=null}connectedCallback(){super.connectedCallback(),this.conversation=ra(this.storageKey),this.conversation&&this.loadHistory()}async loadHistory(){let e=await this.hass.callWS({type:"homeai/chat/history",conversation_id:this.conversation});this.messages=e.messages,this.scrollDown()}scrollDown(){this.updateComplete.then(()=>{this.fill?this.renderRoot.querySelector(".composer")?.scrollIntoView({block:"end"}):this.log?.scrollTo({top:this.log.scrollHeight})})}async send(){let e=this.box?.value.trim();if(!(!e||this.busy)){this.box.value="",this.messages=[...this.messages,{role:"user",text:e}],this.busy=!0,this.error="",this.scrollDown();try{let t=await this.hass.callWS({type:"homeai/chat/send",text:e,...this.conversation?{conversation_id:this.conversation}:{}});this.conversation=t.conversation_id,kt(this.storageKey,this.conversation),this.messages=[...this.messages,{role:"assistant",text:t.reply}]}catch(t){this.error=t?.message??String(t)}finally{this.busy=!1,this.scrollDown()}}}restart(){this.conversation=null,kt(this.storageKey,null),this.messages=[]}keydown(e){e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this.send())}render(){let e=this.hass.language,t=this.messages.length?l`<div class="item-actions end"><button part="button button-quiet" class="quiet" @click=${this.restart}>${o(e,"chat_new")}</button></div>`:p;return l`
      ${this.fill?t:p}
      <div part="log" class="log" aria-live="polite">
        ${this.messages.length?p:l`<div class="muted hint-block">${o(e,"chat_hint")}</div>`}
        ${this.messages.map(a=>l`<div part="message message-${a.role}" class="msg ${a.role}">${a.text}</div>`)}
        ${this.busy?l`<div part="message message-assistant" class="msg assistant muted">…</div>`:p}
      </div>
      ${this.error?l`<div part="error" class="muted error">${this.error}</div>`:p}
      <div class="bottom">
        <div part="composer" class="composer glass">
          <textarea part="input" class="grow" rows="1" placeholder=${o(e,"chat_placeholder")} aria-label=${o(e,"chat_placeholder")} @keydown=${this.keydown} ?disabled=${this.busy}></textarea>
          <button part="button button-primary" class="primary" @click=${this.send} ?disabled=${this.busy}>${o(e,"send")}</button>
        </div>
      </div>
      ${this.fill?p:t}`}};T.styles=[x,E`
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
    `],h([f({attribute:!1})],T.prototype,"hass",2),h([f({attribute:"storage-key"})],T.prototype,"storageKey",2),h([f({type:Boolean})],T.prototype,"compact",2),h([f({type:Boolean,reflect:!0})],T.prototype,"fill",2),h([m()],T.prototype,"messages",2),h([m()],T.prototype,"busy",2),h([m()],T.prototype,"error",2),h([Fe("textarea")],T.prototype,"box",2),h([Fe(".log")],T.prototype,"log",2),T=h([k("homeai-chat")],T);var na=["away","vacation","guests","home_office","sick"];function xt(i,s=0){return ee(Date.now()+s*864e5,i).date}function Oe(i,s,e=!1){return ee(new Date(i).getTime()-(e?1e3:0),s).date}function St(i,s){let e=ee(i,s);return e.hour===0&&e.minute===0}function oa(i,s,e,t){if(!St(i,t)||!St(s,t))return`${O(i,e)} \u2192 ${O(s,e)}`;let a=d=>d.toLocaleDateString(e,{weekday:"short",day:"numeric",month:"short",timeZone:t||void 0}),n=new Date(i),r=new Date(new Date(s).getTime()-1e3);return Oe(i,t)===Oe(s,t,!0)?a(n):`${a(n)} \u2013 ${a(r)}`}var N=class extends b{constructor(){super(...arguments);this.items=[];this.error="";this.pages={}}connectedCallback(){super.connectedCallback(),this.load()}async load(){try{let e=await this.hass.callWS({type:"homeai/presence/list",days:120});this.items=e.items.sort((t,a)=>t.start.localeCompare(a.start)),this.world||(this.world=await this.hass.callWS({type:"homeai/world/summary"}))}catch(e){this.error=e?.message??String(e)}}personName(e){return e?this.world?.persons.find(t=>t.id===e)?.name??e:o(this.hass.language,"presence_everyone")}async save(){let e=this.draft,t={kind:e.kind,person:e.person||null,start:e.start,end:e.end,note:e.note};try{await this.hass.callWS({type:"homeai/presence/save",item:t,...e.id?{exception_id:e.id}:{}}),this.draft=void 0,this.error="",await this.load()}catch(a){this.error=a?.message??String(a)}}async removeItem(e){if(confirm(o(this.hass.language,"remove_confirm"))){try{await this.hass.callWS({type:"homeai/presence/delete",exception_id:e}),this.close()}catch(t){this.error=t?.message??String(t)}await this.load()}}close(){this.draft=void 0,this.error=""}updated(){let e=this.renderRoot.querySelector("dialog");e&&!e.open&&e.showModal()}form(){let e=this.hass.language,t=this.draft,a=r=>this.draft={...t,...r},n=(r,d)=>l`<label class="field"><span class="label">${r}</span>${d}</label>`;return l`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${o(e,t.id?"presence_change":"presence_new")}</h2></div>
      <div class="sheet-body fields">
        <div class="pair">
          ${n(o(e,"presence_kind"),l`<select part="input" @change=${r=>a({kind:r.target.value})}>
            ${na.map(r=>l`<option value=${r} ?selected=${r===t.kind}>${o(e,`presence_${r}`)}</option>`)}</select>`)}
          ${n(o(e,"presence_person"),l`<select part="input" @change=${r=>a({person:r.target.value})}>
            <option value="" ?selected=${!t.person}>${o(e,"presence_everyone")}</option>
            ${(this.world?.persons??[]).map(r=>l`<option value=${r.id} ?selected=${r.id===t.person}>${r.name}</option>`)}</select>`)}
        </div>
        <div class="pair">
          ${n(o(e,"presence_from"),l`<input part="input" type="date" .value=${t.start} @change=${r=>a({start:r.target.value})} />`)}
          ${n(o(e,"presence_to"),l`<input part="input" type="date" .value=${t.end} @change=${r=>a({end:r.target.value})} />`)}
        </div>
        ${n(o(e,"presence_note"),l`<input part="input" maxlength="300" .value=${t.note} @input=${r=>a({note:r.target.value})} />`)}
        ${this.error?l`<div part="error" class="error">${this.error}</div>`:p}
      </div>
      <div class="sheet-foot">
        ${t.id?l`<button part="button button-quiet" class="quiet danger" @click=${()=>this.removeItem(t.id)}>${o(e,"remove")}</button>`:p}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${o(e,"cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${o(e,"save")}</button>
      </div>
    </dialog>`}render(){let e=this.hass.language,t=this.hass.config?.time_zone;return l`
      ${this.draft?this.form():p}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${o(e,"presence")}</h2>
          <button part="button button-primary" class="primary" @click=${()=>this.draft={kind:"away",person:"",start:xt(t),end:xt(t,1),note:""}}>${o(e,"presence_add")}</button></div>
        <p class="hint">${o(e,"presence_hint")}</p>
        ${!this.draft&&this.error?l`<div part="card error" class="card error">${this.error}</div>`:p}
        ${this.items.length?l`<ul part="card list" class="list">${$(this,"items",this.items,e).items.map(a=>l`<li part="row">
              <button class="item-main plain" @click=${()=>this.draft={id:a.id,kind:a.kind,person:a.person??"",start:Oe(a.start,t),end:Oe(a.end,t,!0),note:a.note}}>
                <span class="item-text"><span part="row-title" class="item-title">${o(e,`presence_${a.kind}`)} · ${this.personName(a.person)}</span>
                  <span part="row-meta" class="item-meta">${oa(a.start,a.end,e,t)}${a.note?` \xB7 ${a.note}`:""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>${$(this,"items",this.items,e).nav}`:l`<div part="empty" class="empty">${o(e,"presence_none")}</div>`}
      </section>`}};N.styles=x,h([f({attribute:!1})],N.prototype,"hass",2),h([m()],N.prototype,"items",2),h([m()],N.prototype,"world",2),h([m()],N.prototype,"draft",2),h([m()],N.prototype,"error",2),h([m()],N.prototype,"pages",2),N=h([k("homeai-presence")],N);var fe={situations:["situations"],plan:["plan","presence"],chat:["chat"],manage:["learning","journal","rules","settings","ai"]},la=["rules","settings","ai"],ca={situations:"mdi:home-heart",plan:"mdi:calendar-clock",presence:"mdi:account-clock-outline",chat:"mdi:message-text-outline",learning:"mdi:school-outline",journal:"mdi:notebook-outline",rules:"mdi:format-list-checks",settings:"mdi:tune-variant",ai:"mdi:creation-outline"},Et={situations:"/homeai",plan:"/homeai-plan",chat:"/homeai-chat",manage:"/homeai-manage"},da=["situations","presence","chat","learning","journal","rules"],V=class extends b{constructor(){super(...arguments);this.narrow=!1}get view(){let e=this.panel?.config?.view;return e&&e in fe?e:"situations"}tabs(){return fe[this.view].filter(e=>this.hass?.user?.is_admin||!la.includes(e))}firstUpdated(){let e=new URLSearchParams(location.search).get("tab");if(!e)return;if(fe[this.view].includes(e)){this.tab=e;return}let t=Object.keys(fe).find(a=>fe[a].includes(e))??(e==="approvals"?"situations":void 0);!t||t===this.view||!this.panel?.config?.view||(history.replaceState(null,"",t==="situations"?Et[t]:`${Et[t]}?tab=${e}`),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}})))}select(e){this.tab=e;let t=new URL(location.href);t.searchParams.set("tab",e),history.replaceState(history.state,"",t)}content(e){switch(e){case"plan":return l`<homeai-plan exportparts=${R} .hass=${this.hass}></homeai-plan>`;case"presence":return l`<homeai-presence exportparts=${R} .hass=${this.hass}></homeai-presence>`;case"chat":return l`<homeai-chat exportparts=${R} .hass=${this.hass} fill></homeai-chat>`;case"learning":return l`<homeai-learning exportparts=${R} .hass=${this.hass}></homeai-learning>`;case"journal":return l`<homeai-journal exportparts=${R} .hass=${this.hass}></homeai-journal>`;case"rules":return l`<homeai-rules exportparts=${R} .hass=${this.hass}></homeai-rules>`;case"settings":return l`<homeai-settings exportparts=${R} .hass=${this.hass}></homeai-settings>`;case"ai":return l`<homeai-ai exportparts=${R} .hass=${this.hass}></homeai-ai>`;default:return l`<homeai-situations exportparts=${R} .hass=${this.hass}></homeai-situations>`}}render(){if(!this.hass)return l``;let e=this.hass.language,t=this.tabs(),a=this.tab&&t.includes(this.tab)?this.tab:t[0],n=this.panel?.title||o(e,this.view);return l`
      <div part="header" class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 part="header-title">${n}</h1>
        ${t.length>1?l`<nav part="tabs" class="tabs segmented glass ${t.length>3?"many":""}" role="tablist">
              ${t.map(r=>l`<button part=${r===a?"tab tab-active":"tab"} class=${r===a?"active":""} role="tab"
                aria-selected=${r===a?"true":"false"} aria-label=${o(e,r)} @click=${()=>this.select(r)}>
                <ha-icon part="tab-icon" .icon=${ca[r]}></ha-icon><span part="tab-label" class="label">${o(e,r)}</span></button>`)}
            </nav>`:p}
      </div>
      <main part="content" class=${a==="chat"?"chat":da.includes(a)?"reading":""}>${this.content(a)}</main>
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
    `],h([f({attribute:!1})],V.prototype,"hass",2),h([f({type:Boolean})],V.prototype,"narrow",2),h([f({attribute:!1})],V.prototype,"panel",2),h([m()],V.prototype,"tab",2),V=h([k("homeai-panel")],V);var Z=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-situations-card"};this.expanded=null}setConfig(e){this.config={entity:"sensor.homeai_situations",min_severity:1,...e}}getCardSize(){return 3}static getStubConfig(){return{type:"custom:homeai-situations-card"}}act(e,t){this.hass.callService("homeai",e,{situation_id:t})}render(){if(!this.hass)return p;let e=this.hass.language,t=this.hass.config?.time_zone,n=(this.hass.states[this.config.entity??"sensor.homeai_situations"]?.attributes.situations??[]).filter(r=>r.severity>=(this.config.min_severity??1));return l`<div part="card" class="card flush">
      ${this.config.title?l`<div part="title" class="title card-title">${this.config.title}</div>`:p}
      ${n.length?l`<ul part="list" class="list bare">${n.map(r=>{let d=this.expanded===r.id;return l`<li part="row" class=${d?"open":""}>
              <button class="item-main" aria-expanded=${d?"true":"false"} @click=${()=>this.expanded=d?null:r.id}>
                <span part="badge badge-${r.severity}" class="dot sev-${r.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title">${r.title}</span>
                  ${r.repairing?l`<span part="row-meta" class="item-meta">${o(e,"repairing")}</span>`:p}</span>
                <span part="time" class="item-aside">${ae(r.since,e,t)}</span>
              </button>
              ${d?l`<div class="item-more"><div class="item-actions">
                    <button part="button button-primary" class="primary" @click=${()=>this.act("handle",r.id)}>${o(e,"handle")}</button>
                    <button part="button" @click=${()=>this.act("acknowledge",r.id)} ?disabled=${r.acknowledged}>${o(e,"ack")}</button>
                    <button part="button" @click=${()=>this.act("snooze",r.id)}>${o(e,"snooze")}</button>
                  </div></div>`:p}
            </li>`})}</ul>`:l`<div part="empty" class="empty">${o(e,"nothing_open")}</div>`}
    </div>`}};Z.styles=x,h([f({attribute:!1})],Z.prototype,"hass",2),h([m()],Z.prototype,"config",2),h([m()],Z.prototype,"expanded",2),Z=h([k("homeai-situations-card")],Z);var H=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-plan-card"};this.occurrences=[]}setConfig(e){this.config={days:2,limit:6,...e}}getCardSize(){return 2+Math.min(this.occurrences.length,this.config.limit??6)}static getStubConfig(){return{type:"custom:homeai-plan-card"}}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.load(),300*1e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer)}firstUpdated(){this.load()}async load(){if(this.hass)try{let e=await this.hass.callWS({type:"homeai/plan/list",days:this.config.days??2});this.occurrences=e.occurrences}catch{this.occurrences=[]}}render(){if(!this.hass)return p;let e=this.hass.language,t=this.hass.config?.time_zone,a=this.occurrences.slice(0,this.config.limit??6),n=[],r=j(Date.now(),t);for(let d of a){let c=j(d.at,t);c!==r&&(n.push(l`<li part="day" class="day">${ne(d.at,e,t)}</li>`),r=c),n.push(l`<li part="row"><div class="item-main timed"><span part="time" class="time">${te(d.at,e,t)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${d.title}</span></span><span></span></div></li>`)}return l`<div part="card" class="card flush">
      <div part="title" class="title card-title">${this.config.title??o(e,"plan_next")}</div>
      ${a.length?l`<ul part="list" class="list bare">${n}</ul>`:l`<div part="empty" class="empty">${o(e,"no_plan")}</div>`}
    </div>`}};H.styles=x,h([f({attribute:!1})],H.prototype,"hass",2),h([m()],H.prototype,"config",2),h([m()],H.prototype,"occurrences",2),H=h([k("homeai-plan-card")],H);var ie=class extends b{constructor(){super(...arguments);this.config={type:"custom:homeai-chat-card"}}setConfig(e){this.config={...e}}getCardSize(){return 6}static getStubConfig(){return{type:"custom:homeai-chat-card"}}render(){return this.hass?l`<div part="card" class="card">
      ${this.config.title?l`<div part="title" class="title spaced">${this.config.title}</div>`:p}
      <homeai-chat exportparts=${R} .hass=${this.hass} compact storage-key="homeai-chat-card"></homeai-chat>
    </div>`:p}};ie.styles=x,h([f({attribute:!1})],ie.prototype,"hass",2),h([m()],ie.prototype,"config",2),ie=h([k("homeai-chat-card")],ie);var pa=[{type:"homeai-situations-card",name:"HomeAI situations",description:"Open situations from HomeAI with quick reactions.",preview:!0},{type:"homeai-plan-card",name:"HomeAI plan",description:"What the home's plan does next.",preview:!0},{type:"homeai-chat-card",name:"HomeAI chat",description:"Talk to HomeAI in your own account.",preview:!1}];window.customCards=window.customCards||[];for(let i of pa)window.customCards.some(s=>s.type===i.type)||window.customCards.push(i);
