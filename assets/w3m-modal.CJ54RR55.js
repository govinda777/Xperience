import{w as e,p as t,s as i,q as o,M as a,t as r,R as s,i as n,r as c,a as l,x as w,u as d,e as p,o as u,h as m,d as h,j as v,v as g,E as f,O as b,C as y,y as x,k,A as C,T as S,z as R,b as N,g as O}from"./core.CjJXtVnc.js";import{c as T,n as A,r as W,o as $,U as E}from"./index.DmBrcy6h.js";const P=t({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),I=e({state:P,subscribe:e=>o(P,()=>e(P)),subscribeKey:(e,t)=>i(P,e,t),showTooltip({message:e,triggerRect:t,variant:i}){P.open=!0,P.message=e,P.triggerRect=t,P.variant=i},hide(){P.open=!1,P.message="",P.triggerRect={width:0,height:0,top:0,left:0}}}),j={isUnsupportedChainView:()=>"UnsupportedChain"===s.state.view||"SwitchNetwork"===s.state.view&&s.state.history.includes("UnsupportedChain"),async safeClose(){if(this.isUnsupportedChainView())return void a.shake();await r.isSIWXCloseDisabled()?a.shake():a.close()}},D=n`
  :host {
    display: block;
    border-radius: clamp(0px, var(--wui-border-radius-l), 44px);
    box-shadow: 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-modal-bg);
    overflow: hidden;
  }

  :host([data-embedded='true']) {
    box-shadow:
      0 0 0 1px var(--wui-color-gray-glass-005),
      0px 4px 12px 4px var(--w3m-card-embedded-shadow-color);
  }
`;let B=class extends l{render(){return w`<slot></slot>`}};B.styles=[c,D],B=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s}([T("wui-card")],B);const z=n`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-dark-glass-100);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-325);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: var(--wui-border-radius-3xs);
    background-color: var(--local-icon-bg-value);
  }
`;var L=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};let U=class extends l{constructor(){super(...arguments),this.message="",this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="info"}render(){return this.style.cssText=`\n      --local-icon-bg-value: var(--wui-color-${this.backgroundColor});\n   `,w`
      <wui-flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <wui-flex columnGap="xs" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color=${this.iconColor} size="md" name=${this.icon}></wui-icon>
          </wui-flex>
          <wui-text variant="small-500" color="bg-350" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="bg-350"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){d.close()}};U.styles=[c,z],L([A()],U.prototype,"message",void 0),L([A()],U.prototype,"backgroundColor",void 0),L([A()],U.prototype,"iconColor",void 0),L([A()],U.prototype,"icon",void 0),U=L([T("wui-alertbar")],U);const H=n`
  :host {
    display: block;
    position: absolute;
    top: var(--wui-spacing-s);
    left: var(--wui-spacing-l);
    right: var(--wui-spacing-l);
    opacity: 0;
    pointer-events: none;
  }
`;var K=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};const V={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"exclamationTriangle"}};let X=class extends l{constructor(){super(),this.unsubscribe=[],this.open=d.state.open,this.onOpen(!0),this.unsubscribe.push(d.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:t}=d.state,i=V[t];return w`
      <wui-alertbar
        message=${e}
        backgroundColor=${i?.backgroundColor}
        iconColor=${i?.iconColor}
        icon=${i?.icon}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};X.styles=H,K([W()],X.prototype,"open",void 0),X=K([T("w3m-alertbar")],X);const Y=n`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`;var M=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};let _=class extends l{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){const e="lg"===this.size?"--wui-border-radius-xs":"--wui-border-radius-xxs",t="lg"===this.size?"--wui-spacing-1xs":"--wui-spacing-2xs";return this.style.cssText=`\n    --local-border-radius: var(${e});\n    --local-padding: var(${t});\n`,w`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};_.styles=[c,p,u,Y],M([A()],_.prototype,"size",void 0),M([A({type:Boolean})],_.prototype,"disabled",void 0),M([A()],_.prototype,"icon",void 0),M([A()],_.prototype,"iconColor",void 0),_=M([T("wui-icon-link")],_);const q=n`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    gap: var(--wui-spacing-xxs);
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xxs);
  }

  wui-image {
    border-radius: 100%;
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  wui-icon-box {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var G=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};let F=class extends l{constructor(){super(...arguments),this.imageSrc=""}render(){return w`<button>
      ${this.imageTemplate()}
      <wui-icon size="xs" color="fg-200" name="chevronBottom"></wui-icon>
    </button>`}imageTemplate(){return this.imageSrc?w`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`:w`<wui-icon-box
      size="xxs"
      iconColor="fg-200"
      backgroundColor="fg-100"
      background="opaque"
      icon="networkPlaceholder"
    ></wui-icon-box>`}};F.styles=[c,p,u,q],G([A()],F.prototype,"imageSrc",void 0),F=G([T("wui-select")],F);const J=n`
  :host {
    height: 64px;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards var(--wui-ease-out-power-2),
      slide-down-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards var(--wui-ease-out-power-2),
      slide-up-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;var Q=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};const Z=["SmartSessionList"];function ee(){const e=s.state.data?.connector?.name,t=s.state.data?.wallet?.name,i=s.state.data?.network?.name,o=t??e,a=y.getConnectors();return{Connect:`Connect ${1===a.length&&"w3m-email"===a[0]?.id?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:o??"Connect Wallet",ConnectingWalletConnect:o??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview convert",Downloads:o?`Get ${o}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",Profile:void 0,SwitchNetwork:i??"Switch Network",SwitchAddress:"Switch Address",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select token",SwapPreview:"Preview swap",WalletSend:"Send",WalletSendPreview:"Review send",WalletSendSelectToken:"Select Token",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a wallet?",ConnectWallets:"Connect wallet",ConnectSocials:"All socials",ConnectingSocial:x.state.socialProvider?x.state.socialProvider:"Connect Social",ConnectingMultiChain:"Select chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in progress"}}let te=class extends l{constructor(){super(),this.unsubscribe=[],this.heading=ee()[s.state.view],this.network=m.state.activeCaipNetwork,this.networkImage=h.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=s.state.view,this.viewDirection="",this.headerText=ee()[s.state.view],this.unsubscribe.push(v.subscribeNetworkImages(()=>{this.networkImage=h.getNetworkImage(this.network)}),s.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.headerText=ee()[e]},g.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),m.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=h.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return w`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){f.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),s.push("WhatIsAWallet")}async onClose(){await j.safeClose()}rightHeaderTemplate(){const e=b?.state?.features?.smartSessions;return"Account"===s.state.view&&e?w`<wui-flex>
      <wui-icon-link
        icon="clock"
        @click=${()=>s.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-link>
      ${this.closeButtonTemplate()}
    </wui-flex> `:this.closeButtonTemplate()}closeButtonTemplate(){return w`
      <wui-icon-link
        icon="close"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-link>
    `}titleTemplate(){const e=Z.includes(this.view);return w`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="xs"
      >
        <wui-text variant="paragraph-700" color="fg-100" data-testid="w3m-header-text"
          >${this.headerText}</wui-text
        >
        ${e?w`<wui-tag variant="main">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){const{view:e}=s.state,t="Connect"===e,i=b.state.enableEmbedded,o="ApproveTransaction"===e,a="ConnectingSiwe"===e,r="Account"===e,n=b.state.enableNetworkSwitch,c=o||a||t&&i;return r&&n?w`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${$(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${$(this.networkImage)}
      ></wui-select>`:this.showBack&&!c?w`<wui-icon-link
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-link>`:w`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`}onNetworks(){this.isAllowedNetworkSwitch()&&(f.sendEvent({type:"track",event:"CLICK_NETWORKS"}),s.push("Networks"))}isAllowedNetworkSwitch(){const e=m.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,i=e?.find(({id:e})=>e===this.network?.id);return t||!i}getPadding(){return this.heading?["l","2l","l","2l"]:["0","2l","0","2l"]}onViewChange(){const{history:e}=s.state;let t=g.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=g.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){const{history:e}=s.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){s.goBack()}};te.styles=J,Q([W()],te.prototype,"heading",void 0),Q([W()],te.prototype,"network",void 0),Q([W()],te.prototype,"networkImage",void 0),Q([W()],te.prototype,"showBack",void 0),Q([W()],te.prototype,"prevHistoryLength",void 0),Q([W()],te.prototype,"view",void 0),Q([W()],te.prototype,"viewDirection",void 0),Q([W()],te.prototype,"headerText",void 0),te=Q([T("w3m-header")],te);const ie=n`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-s);
    align-items: center;
    padding: var(--wui-spacing-xs) var(--wui-spacing-m) var(--wui-spacing-xs) var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-005);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-175);
    box-shadow:
      0px 14px 64px -4px rgba(0, 0, 0, 0.15),
      0px 8px 22px -6px rgba(0, 0, 0, 0.15);

    max-width: 300px;
  }

  :host wui-loading-spinner {
    margin-left: var(--wui-spacing-3xs);
  }
`;var oe=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};let ae=class extends l{constructor(){super(...arguments),this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="checkmark",this.message="",this.loading=!1,this.iconType="default"}render(){return w`
      ${this.templateIcon()}
      <wui-text variant="paragraph-500" color="fg-100" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return this.loading?w`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:"default"===this.iconType?w`<wui-icon size="xl" color=${this.iconColor} name=${this.icon}></wui-icon>`:w`<wui-icon-box
      size="sm"
      iconSize="xs"
      iconColor=${this.iconColor}
      backgroundColor=${this.backgroundColor}
      icon=${this.icon}
      background="opaque"
    ></wui-icon-box>`}};ae.styles=[c,ie],oe([A()],ae.prototype,"backgroundColor",void 0),oe([A()],ae.prototype,"iconColor",void 0),oe([A()],ae.prototype,"icon",void 0),oe([A()],ae.prototype,"message",void 0),oe([A()],ae.prototype,"loading",void 0),oe([A()],ae.prototype,"iconType",void 0),ae=oe([T("wui-snackbar")],ae);const re=n`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var se=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};const ne={loading:void 0,success:{backgroundColor:"success-100",iconColor:"success-100",icon:"checkmark"},error:{backgroundColor:"error-100",iconColor:"error-100",icon:"close"}};let ce=class extends l{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=k.state.open,this.unsubscribe.push(k.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:t,svg:i}=k.state,o=ne[t],{icon:a,iconColor:r}=i??o??{};return w`
      <wui-snackbar
        message=${e}
        backgroundColor=${o?.backgroundColor}
        iconColor=${r}
        icon=${a}
        .loading=${"loading"===t}
      ></wui-snackbar>
    `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),k.state.autoClose&&(this.timeout=setTimeout(()=>k.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};ce.styles=re,se([W()],ce.prototype,"open",void 0),ce=se([T("w3m-snackbar")],ce);const le=n`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-bg-100);
    position: fixed;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--w3m-modal-width) - var(--wui-spacing-xl));
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: var(--wui-color-bg-150);
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var we=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};let de=class extends l{constructor(){super(),this.unsubscribe=[],this.open=I.state.open,this.message=I.state.message,this.triggerRect=I.state.triggerRect,this.variant=I.state.variant,this.unsubscribe.push(I.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;const e=this.triggerRect.top,t=this.triggerRect.left;return this.style.cssText=`\n    --w3m-tooltip-top: ${e}px;\n    --w3m-tooltip-left: ${t}px;\n    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;\n    --w3m-tooltip-display: ${this.open?"flex":"none"};\n    --w3m-tooltip-opacity: ${this.open?1:0};\n    `,w`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`}};de.styles=[le],we([W()],de.prototype,"open",void 0),we([W()],de.prototype,"message",void 0),we([W()],de.prototype,"triggerRect",void 0),we([W()],de.prototype,"variant",void 0),de=we([T("w3m-tooltip"),T("w3m-tooltip")],de);const pe=n`
  :host {
    --prev-height: 0px;
    --new-height: 0px;
    display: block;
  }

  div.w3m-router-container {
    transform: translateY(0);
    opacity: 1;
  }

  div.w3m-router-container[view-direction='prev'] {
    animation:
      slide-left-out 150ms forwards ease,
      slide-left-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  div.w3m-router-container[view-direction='next'] {
    animation:
      slide-right-out 150ms forwards ease,
      slide-right-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(-10px);
      opacity: 0;
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;var ue=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};let me=class extends l{constructor(){super(),this.resizeObserver=void 0,this.prevHeight="0px",this.prevHistoryLength=1,this.unsubscribe=[],this.view=s.state.view,this.viewDirection="",this.unsubscribe.push(s.subscribeKey("view",e=>this.onViewChange(e)))}firstUpdated(){this.resizeObserver=new ResizeObserver(([e])=>{const t=`${e?.contentRect.height}px`;"0px"!==this.prevHeight&&(this.style.setProperty("--prev-height",this.prevHeight),this.style.setProperty("--new-height",t),this.style.animation="w3m-view-height 150ms forwards ease",this.style.height="auto"),setTimeout(()=>{this.prevHeight=t,this.style.animation="unset"},g.ANIMATION_DURATIONS.ModalHeight)}),this.resizeObserver?.observe(this.getWrapper())}disconnectedCallback(){this.resizeObserver?.unobserve(this.getWrapper()),this.unsubscribe.forEach(e=>e())}render(){return w`<div class="w3m-router-container" view-direction="${this.viewDirection}">
      ${this.viewTemplate()}
    </div>`}viewTemplate(){switch(this.view){case"AccountSettings":return w`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return w`<w3m-account-view></w3m-account-view>`;case"AllWallets":return w`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return w`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return w`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return w`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return w`<w3m-connect-view></w3m-connect-view>`;case"Create":return w`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return w`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return w`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return w`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return w`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return w`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return w`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return w`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"Downloads":return w`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return w`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return w`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return w`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return w`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return w`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return w`<w3m-network-switch-view></w3m-network-switch-view>`;case"Profile":return w`<w3m-profile-view></w3m-profile-view>`;case"SwitchAddress":return w`<w3m-switch-address-view></w3m-switch-address-view>`;case"Transactions":return w`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return w`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampActivity":return w`<w3m-onramp-activity-view></w3m-onramp-activity-view>`;case"OnRampTokenSelect":return w`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return w`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return w`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return w`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return w`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return w`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return w`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return w`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return w`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return w`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return w`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return w`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return w`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WhatIsABuy":return w`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return w`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return w`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return w`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return w`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return w`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return w`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return w`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return w`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return w`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return w`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return w`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return w`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return w`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return w`<w3m-pay-loading-view></w3m-pay-loading-view>`}}onViewChange(e){I.hide();let t=g.VIEW_DIRECTION.Next;const{history:i}=s.state;i.length<this.prevHistoryLength&&(t=g.VIEW_DIRECTION.Prev),this.prevHistoryLength=i.length,this.viewDirection=t,setTimeout(()=>{this.view=e},g.ANIMATION_DURATIONS.ViewTransition)}getWrapper(){return this.shadowRoot?.querySelector("div")}};me.styles=pe,ue([W()],me.prototype,"view",void 0),ue([W()],me.prototype,"viewDirection",void 0),me=ue([T("w3m-router")],me);const he=n`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host(.appkit-modal) wui-card {
    max-width: 400px;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`;var ve=function(e,t,i,o){var a,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(r<3?a(s):r>3?a(t,i,s):a(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s};const ge="scroll-lock";class fe extends l{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=b.state.enableEmbedded,this.open=a.state.open,this.caipAddress=m.state.activeCaipAddress,this.caipNetwork=m.state.activeCaipNetwork,this.shake=a.state.shake,this.filterByNamespace=y.state.filterByNamespace,this.initializeTheming(),C.prefetchAnalyticsConfig(),this.unsubscribe.push(a.subscribeKey("open",e=>e?this.onOpen():this.onClose()),a.subscribeKey("shake",e=>this.shake=e),m.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),m.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),b.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),y.subscribeKey("filterByNamespace",e=>{this.filterByNamespace===e||m.getAccountData(e)?.caipAddress||(C.fetchRecommendedWallets(),this.filterByNamespace=e)}))}firstUpdated(){if(this.caipAddress){if(this.enableEmbedded)return a.close(),void this.prefetch();this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.cssText=`\n      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--wui-border-radius-l), 44px)":"0px"};\n    `,this.enableEmbedded?w`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?w`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return w` <wui-card
      shake="${this.shake}"
      data-embedded="${$(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){await j.safeClose()}initializeTheming(){const{themeVariables:e,themeMode:t}=S.state,i=E.getColorTheme(t);R(e,i)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),k.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=ge,e.textContent="\n      body {\n        touch-action: none;\n        overflow: hidden;\n        overscroll-behavior: contain;\n      }\n      w3m-modal {\n        pointer-events: auto;\n      }\n    ",document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${ge}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){const{tagName:i}=t.target;!i||i.includes("W3M-")||i.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){const t=m.state.isSwitchingNamespace,i=N.getPlainAddress(e),o=t&&i;!i&&!t?a.close():o&&s.goBack(),await r.initializeIfEnabled(),this.caipAddress=e,m.setIsSwitchingNamespace(!1)}onNewNetwork(e){const t=this.caipNetwork,i=t?.caipNetworkId?.toString(),o=t?.chainNamespace,r=e?.caipNetworkId?.toString(),n=e?.chainNamespace,c=i!==r,l=c&&!(o!==n),w=t?.name===O.UNSUPPORTED_NETWORK_NAME,d="ConnectingExternal"===s.state.view,p=!m.getAccountData(e?.chainNamespace)?.caipAddress,u="UnsupportedChain"===s.state.view;let h=!1;a.state.open&&!d&&(p?c&&(h=!0):(u||l&&!w)&&(h=!0)),h&&"SIWXSignMessage"!==s.state.view&&s.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(C.prefetch(),C.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}fe.styles=he,ve([A({type:Boolean})],fe.prototype,"enableEmbedded",void 0),ve([W()],fe.prototype,"open",void 0),ve([W()],fe.prototype,"caipAddress",void 0),ve([W()],fe.prototype,"caipNetwork",void 0),ve([W()],fe.prototype,"shake",void 0),ve([W()],fe.prototype,"filterByNamespace",void 0);let be=class extends fe{};be=ve([T("w3m-modal")],be);let ye=class extends fe{};ye=ve([T("appkit-modal")],ye);export{ye as AppKitModal,be as W3mModal,fe as W3mModalBase};
