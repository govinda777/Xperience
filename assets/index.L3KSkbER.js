const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/add.LJMeM8rb.js","assets/core.Cx7-XGlB.js","assets/wallet.BRxiaYOA.js","assets/router.B9Wt-69n.js","assets/vendor.BH0yKt5g.js","assets/index.mreEMI_a.js","assets/ton.BJ3_JspX.js","assets/ui.CiY_Dn60.js","assets/analytics.3midQUAv.js","assets/index.CtjAOMPN.css","assets/all-wallets.Dol04yuD.js","assets/arrow-bottom-circle.BLrfap68.js","assets/app-store.Vn9No7Sn.js","assets/apple.BDyOi93B.js","assets/arrow-bottom.BUfmNcCH.js","assets/arrow-left.CFGB9XWs.js","assets/arrow-right.CIzlH-2k.js","assets/arrow-top.DJDoIswr.js","assets/bank.8FPcGI-W.js","assets/browser.BpAqH94W.js","assets/card.C8p2x7a_.js","assets/checkmark.DPr0z43y.js","assets/checkmark-bold.BFKa-IMi.js","assets/chevron-bottom.BW52KEMk.js","assets/chevron-left.JeIhz1tZ.js","assets/chevron-right.DpUScv8p.js","assets/chevron-top.7uBuqBBY.js","assets/chrome-store.CumdNMT9.js","assets/clock.R09r4TlT.js","assets/close.sln-OLOd.js","assets/compass.CslWJz1M.js","assets/coinPlaceholder.BMZxga-k.js","assets/copy.6M2LdZJj.js","assets/cursor.oR3YLbwj.js","assets/cursor-transparent.BDbBsYCa.js","assets/desktop.CrS57As5.js","assets/disconnect.fvxqGYPL.js","assets/discord.zJcv_VmO.js","assets/etherscan.OZPp3j29.js","assets/extension.CQ2WqyPJ.js","assets/external-link.DyCEXmUf.js","assets/facebook.BlJZb39e.js","assets/farcaster.rC0Afu-F.js","assets/filters.BsVdeiPD.js","assets/github.Dd02uUbE.js","assets/google.J4rxzxgW.js","assets/help-circle.BwDOofcp.js","assets/image.CZqyhNN-.js","assets/id.CM3gbTaF.js","assets/info-circle.R1WBvM0O.js","assets/lightbulb.TvuOan4v.js","assets/mail.ChNTpaTS.js","assets/mobile.BbY-PiBu.js","assets/more.gnOzUFqk.js","assets/network-placeholder.e2rNa8ru.js","assets/nftPlaceholder.CxG0vRyZ.js","assets/off.DRZ0wz8Y.js","assets/play-store.uKkHZKOe.js","assets/plus.CV_mZtSy.js","assets/qr-code.Bi8GfGYA.js","assets/recycle-horizontal.DOc0OQqG.js","assets/refresh.CwMM39R7.js","assets/search.DKYFvc7e.js","assets/send.Dz0MeUn7.js","assets/swapHorizontal.DrkavMib.js","assets/swapHorizontalMedium.Cxxaojcx.js","assets/swapHorizontalBold.D0d_B98q.js","assets/swapHorizontalRoundedBold.B59xthov.js","assets/swapVertical.CchpnNvy.js","assets/telegram.DuY-uhrm.js","assets/three-dots.50B8KrBH.js","assets/twitch.CLf4Qxd6.js","assets/x.BmJv6oer.js","assets/twitterIcon.aqBfh2dF.js","assets/verify.DvcjGkKl.js","assets/verify-filled.BX3sPurw.js","assets/wallet.DQOJ06nr.js","assets/walletconnect.CGkAl--2.js","assets/wallet-placeholder.imN4u7ZC.js","assets/warning-circle.0m_Hu0Qu.js","assets/info.CJDw-pSk.js","assets/exclamation-triangle.BYxqzxvG.js","assets/reown-logo.CxE0qGwC.js"])))=>i.map(i=>d[i]);
import{B as t,D as e,i as r,r as o,a,x as i,n,F as s,o as c,e as l}from"./core.Cx7-XGlB.js";import{_ as g}from"./wallet.BRxiaYOA.js";const h={getSpacingStyles:(t,e)=>Array.isArray(t)?t[e]?`var(--wui-spacing-${t[e]})`:void 0:"string"==typeof t?`var(--wui-spacing-${t})`:void 0,getFormattedDate:t=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(t),getHostName(t){try{return new URL(t).hostname}catch(e){return""}},getTruncateString:({string:t,charsStart:e,charsEnd:r,truncate:o})=>t.length<=e+r?t:"end"===o?`${t.substring(0,e)}...`:"start"===o?`...${t.substring(t.length-r)}`:`${t.substring(0,Math.floor(e))}...${t.substring(t.length-Math.floor(r))}`,generateAvatarColors(t){const e=t.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),r=this.hexToRgb(e),o=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),a=100-3*Number(o?.replace("px","")),i=`${a}% ${a}% at 65% 40%`,n=[];for(let s=0;s<5;s+=1){const t=this.tintColor(r,.15*s);n.push(`rgb(${t[0]}, ${t[1]}, ${t[2]})`)}return`\n    --local-color-1: ${n[0]};\n    --local-color-2: ${n[1]};\n    --local-color-3: ${n[2]};\n    --local-color-4: ${n[3]};\n    --local-color-5: ${n[4]};\n    --local-radial-circle: ${i}\n   `},hexToRgb(t){const e=parseInt(t,16);return[e>>16&255,e>>8&255,255&e]},tintColor(t,e){const[r,o,a]=t;return[Math.round(r+(255-r)*e),Math.round(o+(255-o)*e),Math.round(a+(255-a)*e)]},isNumber:t=>/^[0-9]+$/u.test(t),getColorTheme:t=>t||("undefined"!=typeof window&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark"),splitBalance(t){const e=t.split(".");return 2===e.length?[e[0],e[1]]:["0","00"]},roundNumber:(t,e,r)=>t.toString().length>=e?Number(t).toFixed(r):t,formatNumberToLocalString:(t,e=2)=>void 0===t?"0.00":"number"==typeof t?t.toLocaleString("en-US",{maximumFractionDigits:e,minimumFractionDigits:e}):parseFloat(t).toLocaleString("en-US",{maximumFractionDigits:e,minimumFractionDigits:e})};function p(t){return function(e){return"function"==typeof e?function(t,e){return customElements.get(t)||customElements.define(t,e),e}(t,e):function(t,e){const{kind:r,elements:o}=e;return{kind:r,elements:o,finisher(e){customElements.get(t)||customElements.define(t,e)}}}(t,e)}}const w={attribute:!0,type:String,converter:e,reflect:!1,hasChanged:t},u=(t=w,e,r)=>{const{kind:o,metadata:a}=r;let i=globalThis.litPropertyMetadata.get(a);if(void 0===i&&globalThis.litPropertyMetadata.set(a,i=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),"accessor"===o){const{name:o}=r;return{set(r){const a=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,a,t)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=r;return function(r){const a=this[o];e.call(this,r),this.requestUpdate(o,a,t)}}throw Error("Unsupported decorator location: "+o)};function v(t){return(e,r)=>"object"==typeof r?u(t,e,r):((t,e,r)=>{const o=e.hasOwnProperty(r);return e.constructor.createProperty(r,t),o?Object.getOwnPropertyDescriptor(e,r):void 0})(t,e,r)}function d(t){return v({...t,state:!0,attribute:!1})}const _=r`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var f=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};let m=class extends a{render(){return this.style.cssText=`\n      flex-direction: ${this.flexDirection};\n      flex-wrap: ${this.flexWrap};\n      flex-basis: ${this.flexBasis};\n      flex-grow: ${this.flexGrow};\n      flex-shrink: ${this.flexShrink};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&h.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&h.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&h.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&h.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&h.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&h.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&h.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&h.getSpacingStyles(this.margin,3)};\n    `,i`<slot></slot>`}};m.styles=[o,_],f([v()],m.prototype,"flexDirection",void 0),f([v()],m.prototype,"flexWrap",void 0),f([v()],m.prototype,"flexBasis",void 0),f([v()],m.prototype,"flexGrow",void 0),f([v()],m.prototype,"flexShrink",void 0),f([v()],m.prototype,"alignItems",void 0),f([v()],m.prototype,"justifyContent",void 0),f([v()],m.prototype,"columnGap",void 0),f([v()],m.prototype,"rowGap",void 0),f([v()],m.prototype,"gap",void 0),f([v()],m.prototype,"padding",void 0),f([v()],m.prototype,"margin",void 0),m=f([p("wui-flex")],m);const y=t=>t??n,S=1,b=2,E=t=>(...e)=>({_$litDirective$:t,values:e});let $=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const x=(t,e)=>{const r=t._$AN;if(void 0===r)return!1;for(const o of r)o._$AO?.(e,!1),x(o,e);return!0},j=t=>{let e,r;do{if(void 0===(e=t._$AM))break;r=e._$AN,r.delete(t),t=e}while(0===r?.size)},P=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(void 0===r)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),A(e)}};function R(t){void 0!==this._$AN?(j(this),this._$AM=t,P(this)):this._$AM=t}function k(t,e=!1,r=0){const o=this._$AH,a=this._$AN;if(void 0!==a&&0!==a.size)if(e)if(Array.isArray(o))for(let i=r;i<o.length;i++)x(o[i],!1),j(o[i]);else null!=o&&(x(o,!1),j(o));else x(this,t)}const A=t=>{t.type==b&&(t._$AP??=k,t._$AQ??=R)};class T extends ${constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),P(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(x(this,t),j(this))}setValue(t){if(void 0===this._$Ct.strings)this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}class O{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}}class L{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(t=>this.Z=t)}resume(){this.Z?.(),this.Y=this.Z=void 0}}const D=t=>{return!(e=t,null===e||"object"!=typeof e&&"function"!=typeof e||"function"!=typeof t.then);var e},z=1073741823;const I=E(class extends T{constructor(){super(...arguments),this._$Cwt=z,this._$Cbt=[],this._$CK=new O(this),this._$CX=new L}render(...t){return t.find(t=>!D(t))??s}update(t,e){const r=this._$Cbt;let o=r.length;this._$Cbt=e;const a=this._$CK,i=this._$CX;this.isConnected||this.disconnected();for(let n=0;n<e.length&&!(n>this._$Cwt);n++){const t=e[n];if(!D(t))return this._$Cwt=n,t;n<o&&t===r[n]||(this._$Cwt=z,o=0,Promise.resolve(t).then(async e=>{for(;i.get();)await i.get();const r=a.deref();if(void 0!==r){const o=r._$Cbt.indexOf(t);o>-1&&o<r._$Cwt&&(r._$Cwt=o,r.setValue(e))}}))}return s}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}});const C=new class{constructor(){this.cache=new Map}set(t,e){this.cache.set(t,e)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},V=r`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;var B=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};const H={add:async()=>(await g(async()=>{const{addSvg:t}=await import("./add.LJMeM8rb.js");return{addSvg:t}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]))).addSvg,allWallets:async()=>(await g(async()=>{const{allWalletsSvg:t}=await import("./all-wallets.Dol04yuD.js");return{allWalletsSvg:t}},__vite__mapDeps([10,1,2,3,4,5,6,7,8,9]))).allWalletsSvg,arrowBottomCircle:async()=>(await g(async()=>{const{arrowBottomCircleSvg:t}=await import("./arrow-bottom-circle.BLrfap68.js");return{arrowBottomCircleSvg:t}},__vite__mapDeps([11,1,2,3,4,5,6,7,8,9]))).arrowBottomCircleSvg,appStore:async()=>(await g(async()=>{const{appStoreSvg:t}=await import("./app-store.Vn9No7Sn.js");return{appStoreSvg:t}},__vite__mapDeps([12,1,2,3,4,5,6,7,8,9]))).appStoreSvg,apple:async()=>(await g(async()=>{const{appleSvg:t}=await import("./apple.BDyOi93B.js");return{appleSvg:t}},__vite__mapDeps([13,1,2,3,4,5,6,7,8,9]))).appleSvg,arrowBottom:async()=>(await g(async()=>{const{arrowBottomSvg:t}=await import("./arrow-bottom.BUfmNcCH.js");return{arrowBottomSvg:t}},__vite__mapDeps([14,1,2,3,4,5,6,7,8,9]))).arrowBottomSvg,arrowLeft:async()=>(await g(async()=>{const{arrowLeftSvg:t}=await import("./arrow-left.CFGB9XWs.js");return{arrowLeftSvg:t}},__vite__mapDeps([15,1,2,3,4,5,6,7,8,9]))).arrowLeftSvg,arrowRight:async()=>(await g(async()=>{const{arrowRightSvg:t}=await import("./arrow-right.CIzlH-2k.js");return{arrowRightSvg:t}},__vite__mapDeps([16,1,2,3,4,5,6,7,8,9]))).arrowRightSvg,arrowTop:async()=>(await g(async()=>{const{arrowTopSvg:t}=await import("./arrow-top.DJDoIswr.js");return{arrowTopSvg:t}},__vite__mapDeps([17,1,2,3,4,5,6,7,8,9]))).arrowTopSvg,bank:async()=>(await g(async()=>{const{bankSvg:t}=await import("./bank.8FPcGI-W.js");return{bankSvg:t}},__vite__mapDeps([18,1,2,3,4,5,6,7,8,9]))).bankSvg,browser:async()=>(await g(async()=>{const{browserSvg:t}=await import("./browser.BpAqH94W.js");return{browserSvg:t}},__vite__mapDeps([19,1,2,3,4,5,6,7,8,9]))).browserSvg,card:async()=>(await g(async()=>{const{cardSvg:t}=await import("./card.C8p2x7a_.js");return{cardSvg:t}},__vite__mapDeps([20,1,2,3,4,5,6,7,8,9]))).cardSvg,checkmark:async()=>(await g(async()=>{const{checkmarkSvg:t}=await import("./checkmark.DPr0z43y.js");return{checkmarkSvg:t}},__vite__mapDeps([21,1,2,3,4,5,6,7,8,9]))).checkmarkSvg,checkmarkBold:async()=>(await g(async()=>{const{checkmarkBoldSvg:t}=await import("./checkmark-bold.BFKa-IMi.js");return{checkmarkBoldSvg:t}},__vite__mapDeps([22,1,2,3,4,5,6,7,8,9]))).checkmarkBoldSvg,chevronBottom:async()=>(await g(async()=>{const{chevronBottomSvg:t}=await import("./chevron-bottom.BW52KEMk.js");return{chevronBottomSvg:t}},__vite__mapDeps([23,1,2,3,4,5,6,7,8,9]))).chevronBottomSvg,chevronLeft:async()=>(await g(async()=>{const{chevronLeftSvg:t}=await import("./chevron-left.JeIhz1tZ.js");return{chevronLeftSvg:t}},__vite__mapDeps([24,1,2,3,4,5,6,7,8,9]))).chevronLeftSvg,chevronRight:async()=>(await g(async()=>{const{chevronRightSvg:t}=await import("./chevron-right.DpUScv8p.js");return{chevronRightSvg:t}},__vite__mapDeps([25,1,2,3,4,5,6,7,8,9]))).chevronRightSvg,chevronTop:async()=>(await g(async()=>{const{chevronTopSvg:t}=await import("./chevron-top.7uBuqBBY.js");return{chevronTopSvg:t}},__vite__mapDeps([26,1,2,3,4,5,6,7,8,9]))).chevronTopSvg,chromeStore:async()=>(await g(async()=>{const{chromeStoreSvg:t}=await import("./chrome-store.CumdNMT9.js");return{chromeStoreSvg:t}},__vite__mapDeps([27,1,2,3,4,5,6,7,8,9]))).chromeStoreSvg,clock:async()=>(await g(async()=>{const{clockSvg:t}=await import("./clock.R09r4TlT.js");return{clockSvg:t}},__vite__mapDeps([28,1,2,3,4,5,6,7,8,9]))).clockSvg,close:async()=>(await g(async()=>{const{closeSvg:t}=await import("./close.sln-OLOd.js");return{closeSvg:t}},__vite__mapDeps([29,1,2,3,4,5,6,7,8,9]))).closeSvg,compass:async()=>(await g(async()=>{const{compassSvg:t}=await import("./compass.CslWJz1M.js");return{compassSvg:t}},__vite__mapDeps([30,1,2,3,4,5,6,7,8,9]))).compassSvg,coinPlaceholder:async()=>(await g(async()=>{const{coinPlaceholderSvg:t}=await import("./coinPlaceholder.BMZxga-k.js");return{coinPlaceholderSvg:t}},__vite__mapDeps([31,1,2,3,4,5,6,7,8,9]))).coinPlaceholderSvg,copy:async()=>(await g(async()=>{const{copySvg:t}=await import("./copy.6M2LdZJj.js");return{copySvg:t}},__vite__mapDeps([32,1,2,3,4,5,6,7,8,9]))).copySvg,cursor:async()=>(await g(async()=>{const{cursorSvg:t}=await import("./cursor.oR3YLbwj.js");return{cursorSvg:t}},__vite__mapDeps([33,1,2,3,4,5,6,7,8,9]))).cursorSvg,cursorTransparent:async()=>(await g(async()=>{const{cursorTransparentSvg:t}=await import("./cursor-transparent.BDbBsYCa.js");return{cursorTransparentSvg:t}},__vite__mapDeps([34,1,2,3,4,5,6,7,8,9]))).cursorTransparentSvg,desktop:async()=>(await g(async()=>{const{desktopSvg:t}=await import("./desktop.CrS57As5.js");return{desktopSvg:t}},__vite__mapDeps([35,1,2,3,4,5,6,7,8,9]))).desktopSvg,disconnect:async()=>(await g(async()=>{const{disconnectSvg:t}=await import("./disconnect.fvxqGYPL.js");return{disconnectSvg:t}},__vite__mapDeps([36,1,2,3,4,5,6,7,8,9]))).disconnectSvg,discord:async()=>(await g(async()=>{const{discordSvg:t}=await import("./discord.zJcv_VmO.js");return{discordSvg:t}},__vite__mapDeps([37,1,2,3,4,5,6,7,8,9]))).discordSvg,etherscan:async()=>(await g(async()=>{const{etherscanSvg:t}=await import("./etherscan.OZPp3j29.js");return{etherscanSvg:t}},__vite__mapDeps([38,1,2,3,4,5,6,7,8,9]))).etherscanSvg,extension:async()=>(await g(async()=>{const{extensionSvg:t}=await import("./extension.CQ2WqyPJ.js");return{extensionSvg:t}},__vite__mapDeps([39,1,2,3,4,5,6,7,8,9]))).extensionSvg,externalLink:async()=>(await g(async()=>{const{externalLinkSvg:t}=await import("./external-link.DyCEXmUf.js");return{externalLinkSvg:t}},__vite__mapDeps([40,1,2,3,4,5,6,7,8,9]))).externalLinkSvg,facebook:async()=>(await g(async()=>{const{facebookSvg:t}=await import("./facebook.BlJZb39e.js");return{facebookSvg:t}},__vite__mapDeps([41,1,2,3,4,5,6,7,8,9]))).facebookSvg,farcaster:async()=>(await g(async()=>{const{farcasterSvg:t}=await import("./farcaster.rC0Afu-F.js");return{farcasterSvg:t}},__vite__mapDeps([42,1,2,3,4,5,6,7,8,9]))).farcasterSvg,filters:async()=>(await g(async()=>{const{filtersSvg:t}=await import("./filters.BsVdeiPD.js");return{filtersSvg:t}},__vite__mapDeps([43,1,2,3,4,5,6,7,8,9]))).filtersSvg,github:async()=>(await g(async()=>{const{githubSvg:t}=await import("./github.Dd02uUbE.js");return{githubSvg:t}},__vite__mapDeps([44,1,2,3,4,5,6,7,8,9]))).githubSvg,google:async()=>(await g(async()=>{const{googleSvg:t}=await import("./google.J4rxzxgW.js");return{googleSvg:t}},__vite__mapDeps([45,1,2,3,4,5,6,7,8,9]))).googleSvg,helpCircle:async()=>(await g(async()=>{const{helpCircleSvg:t}=await import("./help-circle.BwDOofcp.js");return{helpCircleSvg:t}},__vite__mapDeps([46,1,2,3,4,5,6,7,8,9]))).helpCircleSvg,image:async()=>(await g(async()=>{const{imageSvg:t}=await import("./image.CZqyhNN-.js");return{imageSvg:t}},__vite__mapDeps([47,1,2,3,4,5,6,7,8,9]))).imageSvg,id:async()=>(await g(async()=>{const{idSvg:t}=await import("./id.CM3gbTaF.js");return{idSvg:t}},__vite__mapDeps([48,1,2,3,4,5,6,7,8,9]))).idSvg,infoCircle:async()=>(await g(async()=>{const{infoCircleSvg:t}=await import("./info-circle.R1WBvM0O.js");return{infoCircleSvg:t}},__vite__mapDeps([49,1,2,3,4,5,6,7,8,9]))).infoCircleSvg,lightbulb:async()=>(await g(async()=>{const{lightbulbSvg:t}=await import("./lightbulb.TvuOan4v.js");return{lightbulbSvg:t}},__vite__mapDeps([50,1,2,3,4,5,6,7,8,9]))).lightbulbSvg,mail:async()=>(await g(async()=>{const{mailSvg:t}=await import("./mail.ChNTpaTS.js");return{mailSvg:t}},__vite__mapDeps([51,1,2,3,4,5,6,7,8,9]))).mailSvg,mobile:async()=>(await g(async()=>{const{mobileSvg:t}=await import("./mobile.BbY-PiBu.js");return{mobileSvg:t}},__vite__mapDeps([52,1,2,3,4,5,6,7,8,9]))).mobileSvg,more:async()=>(await g(async()=>{const{moreSvg:t}=await import("./more.gnOzUFqk.js");return{moreSvg:t}},__vite__mapDeps([53,1,2,3,4,5,6,7,8,9]))).moreSvg,networkPlaceholder:async()=>(await g(async()=>{const{networkPlaceholderSvg:t}=await import("./network-placeholder.e2rNa8ru.js");return{networkPlaceholderSvg:t}},__vite__mapDeps([54,1,2,3,4,5,6,7,8,9]))).networkPlaceholderSvg,nftPlaceholder:async()=>(await g(async()=>{const{nftPlaceholderSvg:t}=await import("./nftPlaceholder.CxG0vRyZ.js");return{nftPlaceholderSvg:t}},__vite__mapDeps([55,1,2,3,4,5,6,7,8,9]))).nftPlaceholderSvg,off:async()=>(await g(async()=>{const{offSvg:t}=await import("./off.DRZ0wz8Y.js");return{offSvg:t}},__vite__mapDeps([56,1,2,3,4,5,6,7,8,9]))).offSvg,playStore:async()=>(await g(async()=>{const{playStoreSvg:t}=await import("./play-store.uKkHZKOe.js");return{playStoreSvg:t}},__vite__mapDeps([57,1,2,3,4,5,6,7,8,9]))).playStoreSvg,plus:async()=>(await g(async()=>{const{plusSvg:t}=await import("./plus.CV_mZtSy.js");return{plusSvg:t}},__vite__mapDeps([58,1,2,3,4,5,6,7,8,9]))).plusSvg,qrCode:async()=>(await g(async()=>{const{qrCodeIcon:t}=await import("./qr-code.Bi8GfGYA.js");return{qrCodeIcon:t}},__vite__mapDeps([59,1,2,3,4,5,6,7,8,9]))).qrCodeIcon,recycleHorizontal:async()=>(await g(async()=>{const{recycleHorizontalSvg:t}=await import("./recycle-horizontal.DOc0OQqG.js");return{recycleHorizontalSvg:t}},__vite__mapDeps([60,1,2,3,4,5,6,7,8,9]))).recycleHorizontalSvg,refresh:async()=>(await g(async()=>{const{refreshSvg:t}=await import("./refresh.CwMM39R7.js");return{refreshSvg:t}},__vite__mapDeps([61,1,2,3,4,5,6,7,8,9]))).refreshSvg,search:async()=>(await g(async()=>{const{searchSvg:t}=await import("./search.DKYFvc7e.js");return{searchSvg:t}},__vite__mapDeps([62,1,2,3,4,5,6,7,8,9]))).searchSvg,send:async()=>(await g(async()=>{const{sendSvg:t}=await import("./send.Dz0MeUn7.js");return{sendSvg:t}},__vite__mapDeps([63,1,2,3,4,5,6,7,8,9]))).sendSvg,swapHorizontal:async()=>(await g(async()=>{const{swapHorizontalSvg:t}=await import("./swapHorizontal.DrkavMib.js");return{swapHorizontalSvg:t}},__vite__mapDeps([64,1,2,3,4,5,6,7,8,9]))).swapHorizontalSvg,swapHorizontalMedium:async()=>(await g(async()=>{const{swapHorizontalMediumSvg:t}=await import("./swapHorizontalMedium.Cxxaojcx.js");return{swapHorizontalMediumSvg:t}},__vite__mapDeps([65,1,2,3,4,5,6,7,8,9]))).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await g(async()=>{const{swapHorizontalBoldSvg:t}=await import("./swapHorizontalBold.D0d_B98q.js");return{swapHorizontalBoldSvg:t}},__vite__mapDeps([66,1,2,3,4,5,6,7,8,9]))).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await g(async()=>{const{swapHorizontalRoundedBoldSvg:t}=await import("./swapHorizontalRoundedBold.B59xthov.js");return{swapHorizontalRoundedBoldSvg:t}},__vite__mapDeps([67,1,2,3,4,5,6,7,8,9]))).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await g(async()=>{const{swapVerticalSvg:t}=await import("./swapVertical.CchpnNvy.js");return{swapVerticalSvg:t}},__vite__mapDeps([68,1,2,3,4,5,6,7,8,9]))).swapVerticalSvg,telegram:async()=>(await g(async()=>{const{telegramSvg:t}=await import("./telegram.DuY-uhrm.js");return{telegramSvg:t}},__vite__mapDeps([69,1,2,3,4,5,6,7,8,9]))).telegramSvg,threeDots:async()=>(await g(async()=>{const{threeDotsSvg:t}=await import("./three-dots.50B8KrBH.js");return{threeDotsSvg:t}},__vite__mapDeps([70,1,2,3,4,5,6,7,8,9]))).threeDotsSvg,twitch:async()=>(await g(async()=>{const{twitchSvg:t}=await import("./twitch.CLf4Qxd6.js");return{twitchSvg:t}},__vite__mapDeps([71,1,2,3,4,5,6,7,8,9]))).twitchSvg,twitter:async()=>(await g(async()=>{const{xSvg:t}=await import("./x.BmJv6oer.js");return{xSvg:t}},__vite__mapDeps([72,1,2,3,4,5,6,7,8,9]))).xSvg,twitterIcon:async()=>(await g(async()=>{const{twitterIconSvg:t}=await import("./twitterIcon.aqBfh2dF.js");return{twitterIconSvg:t}},__vite__mapDeps([73,1,2,3,4,5,6,7,8,9]))).twitterIconSvg,verify:async()=>(await g(async()=>{const{verifySvg:t}=await import("./verify.DvcjGkKl.js");return{verifySvg:t}},__vite__mapDeps([74,1,2,3,4,5,6,7,8,9]))).verifySvg,verifyFilled:async()=>(await g(async()=>{const{verifyFilledSvg:t}=await import("./verify-filled.BX3sPurw.js");return{verifyFilledSvg:t}},__vite__mapDeps([75,1,2,3,4,5,6,7,8,9]))).verifyFilledSvg,wallet:async()=>(await g(async()=>{const{walletSvg:t}=await import("./wallet.DQOJ06nr.js");return{walletSvg:t}},__vite__mapDeps([76,1,2,3,4,5,6,7,8,9]))).walletSvg,walletConnect:async()=>(await g(async()=>{const{walletConnectSvg:t}=await import("./walletconnect.CGkAl--2.js");return{walletConnectSvg:t}},__vite__mapDeps([77,1,2,3,4,5,6,7,8,9]))).walletConnectSvg,walletConnectLightBrown:async()=>(await g(async()=>{const{walletConnectLightBrownSvg:t}=await import("./walletconnect.CGkAl--2.js");return{walletConnectLightBrownSvg:t}},__vite__mapDeps([77,1,2,3,4,5,6,7,8,9]))).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await g(async()=>{const{walletConnectBrownSvg:t}=await import("./walletconnect.CGkAl--2.js");return{walletConnectBrownSvg:t}},__vite__mapDeps([77,1,2,3,4,5,6,7,8,9]))).walletConnectBrownSvg,walletPlaceholder:async()=>(await g(async()=>{const{walletPlaceholderSvg:t}=await import("./wallet-placeholder.imN4u7ZC.js");return{walletPlaceholderSvg:t}},__vite__mapDeps([78,1,2,3,4,5,6,7,8,9]))).walletPlaceholderSvg,warningCircle:async()=>(await g(async()=>{const{warningCircleSvg:t}=await import("./warning-circle.0m_Hu0Qu.js");return{warningCircleSvg:t}},__vite__mapDeps([79,1,2,3,4,5,6,7,8,9]))).warningCircleSvg,x:async()=>(await g(async()=>{const{xSvg:t}=await import("./x.BmJv6oer.js");return{xSvg:t}},__vite__mapDeps([72,1,2,3,4,5,6,7,8,9]))).xSvg,info:async()=>(await g(async()=>{const{infoSvg:t}=await import("./info.CJDw-pSk.js");return{infoSvg:t}},__vite__mapDeps([80,1,2,3,4,5,6,7,8,9]))).infoSvg,exclamationTriangle:async()=>(await g(async()=>{const{exclamationTriangleSvg:t}=await import("./exclamation-triangle.BYxqzxvG.js");return{exclamationTriangleSvg:t}},__vite__mapDeps([81,1,2,3,4,5,6,7,8,9]))).exclamationTriangleSvg,reown:async()=>(await g(async()=>{const{reownSvg:t}=await import("./reown-logo.CxE0qGwC.js");return{reownSvg:t}},__vite__mapDeps([82,1,2,3,4,5,6,7,8,9]))).reownSvg};let M=class extends a{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`\n      --local-color: var(--wui-color-${this.color});\n      --local-width: var(--wui-icon-size-${this.size});\n      --local-aspect-ratio: ${this.aspectRatio}\n    `,i`${I(async function(t){if(C.has(t))return C.get(t);const e=(H[t]??H.copy)();return C.set(t,e),e}(this.name),i`<div class="fallback"></div>`)}`}};M.styles=[o,c,V],B([v()],M.prototype,"size",void 0),B([v()],M.prototype,"name",void 0),B([v()],M.prototype,"color",void 0),B([v()],M.prototype,"aspectRatio",void 0),M=B([p("wui-icon")],M);const F=E(class extends ${constructor(t){if(super(t),t.type!==S||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const r=t.element.classList;for(const o of this.st)o in e||(r.remove(o),this.st.delete(o));for(const o in e){const t=!!e[o];t===this.st.has(o)||this.nt?.has(o)||(t?(r.add(o),this.st.add(o)):(r.remove(o),this.st.delete(o)))}return s}}),N=r`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;var G=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};let U=class extends a{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){const t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`\n      --local-align: ${this.align};\n      --local-color: var(--wui-color-${this.color});\n    `,i`<slot class=${F(t)}></slot>`}};U.styles=[o,N],G([v()],U.prototype,"variant",void 0),G([v()],U.prototype,"color",void 0),G([v()],U.prototype,"align",void 0),G([v()],U.prototype,"lineClamp",void 0),U=G([p("wui-text")],U);const q=r`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var W=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};let Y=class extends a{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const t=this.iconSize||this.size,e="lg"===this.size,r="xl"===this.size,o=e?"12%":"16%",a=e?"xxs":r?"s":"3xl",n="gray"===this.background,s="opaque"===this.background,c="accent-100"===this.backgroundColor&&s||"success-100"===this.backgroundColor&&s||"error-100"===this.backgroundColor&&s||"inverse-100"===this.backgroundColor&&s;let l=`var(--wui-color-${this.backgroundColor})`;return c?l=`var(--wui-icon-box-bg-${this.backgroundColor})`:n&&(l=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`\n       --local-bg-value: ${l};\n       --local-bg-mix: ${c||n?"100%":o};\n       --local-border-radius: var(--wui-border-radius-${a});\n       --local-size: var(--wui-icon-box-size-${this.size});\n       --local-border: ${"wui-color-bg-125"===this.borderColor?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}\n   `,i` <wui-icon color=${this.iconColor} size=${t} name=${this.icon}></wui-icon> `}};Y.styles=[o,l,q],W([v()],Y.prototype,"size",void 0),W([v()],Y.prototype,"backgroundColor",void 0),W([v()],Y.prototype,"iconColor",void 0),W([v()],Y.prototype,"iconSize",void 0),W([v()],Y.prototype,"background",void 0),W([v({type:Boolean})],Y.prototype,"border",void 0),W([v()],Y.prototype,"borderColor",void 0),W([v()],Y.prototype,"icon",void 0),Y=W([p("wui-icon-box")],Y);const K=r`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var X=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};let Z=class extends a{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`\n      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      `,i`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};Z.styles=[o,c,K],X([v()],Z.prototype,"src",void 0),X([v()],Z.prototype,"alt",void 0),X([v()],Z.prototype,"size",void 0),Z=X([p("wui-image")],Z);const Q=r`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`;var J=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};let tt=class extends a{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;const t="md"===this.size?"mini-700":"micro-700";return i`
      <wui-text data-variant=${this.variant} variant=${t} color="inherit">
        <slot></slot>
      </wui-text>
    `}};tt.styles=[o,Q],J([v()],tt.prototype,"variant",void 0),J([v()],tt.prototype,"size",void 0),tt=J([p("wui-tag")],tt);const et=r`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var rt=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};let ot=class extends a{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText="--local-color: "+("inherit"===this.color?"inherit":`var(--wui-color-${this.color})`),this.dataset.size=this.size,i`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};ot.styles=[o,et],rt([v()],ot.prototype,"color",void 0),rt([v()],ot.prototype,"size",void 0),ot=rt([p("wui-loading-spinner")],ot);export{h as U,F as a,p as c,E as e,T as f,v as n,y as o,d as r};
