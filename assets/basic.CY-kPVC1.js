import{i as t,e,r as i,a as o,x as r,C as n,A as a,O as s,b as l,E as c,R as u,c as d,d as h,f as p,S as g,g as w,W as f,h as b,j as m,T as v,k as y,M as x,l as $,m as C,n as k,o as R}from"./core.C5sAEwUm.js";import{n as I,c as E,o as T,r as P,U as S,e as j,f as O,a as L}from"./index.DUe7yEhR.js";import{g as z}from"./vendor.BH0yKt5g.js";import{am as A}from"./index.BdF1AENa.js";const B=t`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`;var W=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let D=class extends o{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let t="xxs";return t="lg"===this.size?"m":"md"===this.size?"xs":"xxs",this.style.cssText=`\n       --local-border-radius: var(--wui-border-radius-${t});\n       --local-size: var(--wui-wallet-image-size-${this.size});\n   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),r`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?r`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?r`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:r`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};D.styles=[e,i,B],W([I()],D.prototype,"size",void 0),W([I()],D.prototype,"name",void 0),W([I()],D.prototype,"imageSrc",void 0),W([I()],D.prototype,"walletIcon",void 0),W([I({type:Boolean})],D.prototype,"installed",void 0),W([I()],D.prototype,"badgeSize",void 0),D=W([E("wui-wallet-image")],D);const N=t`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`;var M=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let U=class extends o{constructor(){super(...arguments),this.walletImages=[]}render(){const t=this.walletImages.length<4;return r`${this.walletImages.slice(0,4).map(({src:t,walletName:e})=>r`
            <wui-wallet-image
              size="inherit"
              imageSrc=${t}
              name=${T(e)}
            ></wui-wallet-image>
          `)}
      ${t?[...Array(4-this.walletImages.length)].map(()=>r` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};U.styles=[i,N],M([I({type:Array})],U.prototype,"walletImages",void 0),U=M([E("wui-all-wallets-image")],U);const _=t`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`;var q=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let K=class extends o{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return r`
      <button ?disabled=${this.disabled} tabindex=${T(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?r` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?r` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?r`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:r`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.loading?r`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?r`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?r`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};K.styles=[i,e,_],q([I({type:Array})],K.prototype,"walletImages",void 0),q([I()],K.prototype,"imageSrc",void 0),q([I()],K.prototype,"name",void 0),q([I()],K.prototype,"tagLabel",void 0),q([I()],K.prototype,"tagVariant",void 0),q([I()],K.prototype,"icon",void 0),q([I()],K.prototype,"walletIcon",void 0),q([I()],K.prototype,"tabIdx",void 0),q([I({type:Boolean})],K.prototype,"installed",void 0),q([I({type:Boolean})],K.prototype,"disabled",void 0),q([I({type:Boolean})],K.prototype,"showAllWallets",void 0),q([I({type:Boolean})],K.prototype,"loading",void 0),q([I({type:String})],K.prototype,"loadingSpinnerColor",void 0),K=q([E("wui-list-wallet")],K);var H=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let V=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.count=a.state.count,this.filteredCount=a.state.filteredWallets.length,this.isFetchingRecommendedWallets=a.state.isFetchingRecommendedWallets,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t),a.subscribeKey("count",t=>this.count=t),a.subscribeKey("filteredWallets",t=>this.filteredCount=t.length),a.subscribeKey("isFetchingRecommendedWallets",t=>this.isFetchingRecommendedWallets=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=this.connectors.find(t=>"walletConnect"===t.id),{allWallets:e}=s.state;if(!t||"HIDE"===e)return null;if("ONLY_MOBILE"===e&&!l.isMobile())return null;const i=a.state.featured.length,o=this.count+i,n=o<10?o:10*Math.floor(o/10),c=this.filteredCount>0?this.filteredCount:n;let u=`${c}`;return this.filteredCount>0?u=`${this.filteredCount}`:c<o&&(u=`${c}+`),r`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${u}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${T(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
      ></wui-list-wallet>
    `}onAllWallets(){c.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),u.push("AllWallets")}};H([I()],V.prototype,"tabIdx",void 0),H([P()],V.prototype,"connectors",void 0),H([P()],V.prototype,"count",void 0),H([P()],V.prototype,"filteredCount",void 0),H([P()],V.prototype,"isFetchingRecommendedWallets",void 0),V=H([E("w3m-all-wallets-widget")],V);var F=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Y=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=this.connectors.filter(t=>"ANNOUNCED"===t.type);return t?.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${t.filter(d.showConnector).map(t=>r`
              <wui-list-wallet
                imageSrc=${T(h.getConnectorImage(t))}
                name=${t.name??"Unknown"}
                @click=${()=>this.onConnector(t)}
                tagVariant="success"
                tagLabel="installed"
                data-testid=${`wallet-selector-${t.id}`}
                .installed=${!0}
                tabIdx=${T(this.tabIdx)}
              >
              </wui-list-wallet>
            `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){"walletConnect"===t.id?l.isMobile()?u.push("AllWallets"):u.push("ConnectingWalletConnect"):u.push("ConnectingExternal",{connector:t})}};F([I()],Y.prototype,"tabIdx",void 0),F([P()],Y.prototype,"connectors",void 0),Y=F([E("w3m-connect-announced-widget")],Y);var G=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let J=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.loading=!1,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t)),l.isTelegram()&&l.isIos()&&(this.loading=!p.state.wcUri,this.unsubscribe.push(p.subscribeKey("wcUri",t=>this.loading=!t)))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const{customWallets:t}=s.state;if(!t?.length)return this.style.cssText="display: none",null;const e=this.filterOutDuplicateWallets(t);return r`<wui-flex flexDirection="column" gap="xs">
      ${e.map(t=>r`
          <wui-list-wallet
            imageSrc=${T(h.getWalletImage(t))}
            name=${t.name??"Unknown"}
            @click=${()=>this.onConnectWallet(t)}
            data-testid=${`wallet-selector-${t.id}`}
            tabIdx=${T(this.tabIdx)}
            ?loading=${this.loading}
          >
          </wui-list-wallet>
        `)}
    </wui-flex>`}filterOutDuplicateWallets(t){const e=g.getRecentWallets(),i=this.connectors.map(t=>t.info?.rdns).filter(Boolean),o=e.map(t=>t.rdns).filter(Boolean),r=i.concat(o);if(r.includes("io.metamask.mobile")&&l.isMobile()){const t=r.indexOf("io.metamask.mobile");r[t]="io.metamask"}return t.filter(t=>!r.includes(String(t?.rdns)))}onConnectWallet(t){this.loading||u.push("ConnectingWalletConnect",{wallet:t})}};G([I()],J.prototype,"tabIdx",void 0),G([P()],J.prototype,"connectors",void 0),G([P()],J.prototype,"loading",void 0),J=G([E("w3m-connect-custom-widget")],J);var X=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Q=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=this.connectors.filter(t=>"EXTERNAL"===t.type).filter(d.showConnector).filter(t=>t.id!==w.CONNECTOR_ID.COINBASE_SDK);return t?.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>r`
            <wui-list-wallet
              imageSrc=${T(h.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              data-testid=${`wallet-selector-external-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${T(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){u.push("ConnectingExternal",{connector:t})}};X([I()],Q.prototype,"tabIdx",void 0),X([P()],Q.prototype,"connectors",void 0),Q=X([E("w3m-connect-external-widget")],Q);var Z=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tt=class extends o{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){return this.wallets.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map(t=>r`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${t.id}`}
              imageSrc=${T(h.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${T(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){n.selectWalletConnector(t)}};Z([I()],tt.prototype,"tabIdx",void 0),Z([I()],tt.prototype,"wallets",void 0),tt=Z([E("w3m-connect-featured-widget")],tt);var et=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let it=class extends o{constructor(){super(...arguments),this.tabIdx=void 0,this.connectors=[]}render(){const t=this.connectors.filter(d.showConnector);return 0===t.length?(this.style.cssText="display: none",null):r`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>r`
            <wui-list-wallet
              imageSrc=${T(h.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${T(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnector(t){n.setActiveConnector(t),u.push("ConnectingExternal",{connector:t})}};et([I()],it.prototype,"tabIdx",void 0),et([I()],it.prototype,"connectors",void 0),it=et([E("w3m-connect-injected-widget")],it);var ot=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let rt=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=this.connectors.filter(t=>"MULTI_CHAIN"===t.type&&"WalletConnect"!==t.name);return t?.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>r`
            <wui-list-wallet
              imageSrc=${T(h.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${T(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){n.setActiveConnector(t),u.push("ConnectingMultiChain")}};ot([I()],rt.prototype,"tabIdx",void 0),ot([P()],rt.prototype,"connectors",void 0),rt=ot([E("w3m-connect-multi-chain-widget")],rt);var nt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let at=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.loading=!1,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t)),l.isTelegram()&&l.isIos()&&(this.loading=!p.state.wcUri,this.unsubscribe.push(p.subscribeKey("wcUri",t=>this.loading=!t)))}render(){const t=g.getRecentWallets().filter(t=>!f.isExcluded(t)).filter(t=>!this.hasWalletConnector(t)).filter(t=>this.isWalletCompatibleWithCurrentChain(t));return t.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>r`
            <wui-list-wallet
              imageSrc=${T(h.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${T(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){this.loading||n.selectWalletConnector(t)}hasWalletConnector(t){return this.connectors.some(e=>e.id===t.id||e.name===t.name)}isWalletCompatibleWithCurrentChain(t){const e=b.state.activeChain;return!e||!t.chains||t.chains.some(t=>{const i=t.split(":")[0];return e===i})}};nt([I()],at.prototype,"tabIdx",void 0),nt([P()],at.prototype,"connectors",void 0),nt([P()],at.prototype,"loading",void 0),at=nt([E("w3m-connect-recent-widget")],at);var st=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let lt=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,l.isTelegram()&&l.isIos()&&(this.loading=!p.state.wcUri,this.unsubscribe.push(p.subscribeKey("wcUri",t=>this.loading=!t)))}render(){const{connectors:t}=n.state,{customWallets:e,featuredWalletIds:i}=s.state,o=g.getRecentWallets(),a=t.find(t=>"walletConnect"===t.id),l=t.filter(t=>"INJECTED"===t.type||"ANNOUNCED"===t.type||"MULTI_CHAIN"===t.type).filter(t=>"Browser Wallet"!==t.name);if(!a)return null;if(i||e||!this.wallets.length)return this.style.cssText="display: none",null;const c=l.length+o.length,u=Math.max(0,2-c),d=f.filterOutDuplicateWallets(this.wallets).slice(0,u);return d.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${d.map(t=>r`
            <wui-list-wallet
              imageSrc=${T(h.getWalletImage(t))}
              name=${t?.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${T(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){if(this.loading)return;const e=n.getConnector(t.id,t.rdns);e?u.push("ConnectingExternal",{connector:e}):u.push("ConnectingWalletConnect",{wallet:t})}};st([I()],lt.prototype,"tabIdx",void 0),st([I()],lt.prototype,"wallets",void 0),st([P()],lt.prototype,"loading",void 0),lt=st([E("w3m-connect-recommended-widget")],lt);var ct=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ut=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.connectorImages=m.state.connectorImages,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t),m.subscribeKey("connectorImages",t=>this.connectorImages=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(l.isMobile())return this.style.cssText="display: none",null;const t=this.connectors.find(t=>"walletConnect"===t.id);if(!t)return this.style.cssText="display: none",null;const e=t.imageUrl||this.connectorImages[t?.imageId??""];return r`
      <wui-list-wallet
        imageSrc=${T(e)}
        name=${t.name??"Unknown"}
        @click=${()=>this.onConnector(t)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${T(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `}onConnector(t){n.setActiveConnector(t),u.push("ConnectingWalletConnect")}};ct([I()],ut.prototype,"tabIdx",void 0),ct([P()],ut.prototype,"connectors",void 0),ct([P()],ut.prototype,"connectorImages",void 0),ut=ct([E("w3m-connect-walletconnect-widget")],ut);const dt=t`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var ht=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let pt=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=n.state.connectors,this.recommended=a.state.recommended,this.featured=a.state.featured,this.unsubscribe.push(n.subscribeKey("connectors",t=>this.connectors=t),a.subscribeKey("recommended",t=>this.recommended=t),a.subscribeKey("featured",t=>this.featured=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return r`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){const{custom:t,recent:e,announced:i,injected:o,multiChain:n,recommended:a,featured:s,external:l}=d.getConnectorsByType(this.connectors,this.recommended,this.featured);return d.getConnectorTypeOrder({custom:t,recent:e,announced:i,injected:o,multiChain:n,recommended:a,featured:s,external:l}).map(t=>{switch(t){case"injected":return r`
            ${n.length?r`<w3m-connect-multi-chain-widget
                  tabIdx=${T(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${i.length?r`<w3m-connect-announced-widget
                  tabIdx=${T(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${o.length?r`<w3m-connect-injected-widget
                  .connectors=${o}
                  tabIdx=${T(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return r`<w3m-connect-walletconnect-widget
            tabIdx=${T(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return r`<w3m-connect-recent-widget
            tabIdx=${T(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return r`<w3m-connect-featured-widget
            .wallets=${s}
            tabIdx=${T(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return r`<w3m-connect-custom-widget
            tabIdx=${T(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return r`<w3m-connect-external-widget
            tabIdx=${T(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return r`<w3m-connect-recommended-widget
            .wallets=${a}
            tabIdx=${T(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return null}})}};pt.styles=dt,ht([I()],pt.prototype,"tabIdx",void 0),ht([P()],pt.prototype,"connectors",void 0),ht([P()],pt.prototype,"recommended",void 0),ht([P()],pt.prototype,"featured",void 0),pt=ht([E("w3m-connector-list")],pt);const gt=t`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var wt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ft=class extends o{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`\n      --local-tab: ${this.activeTab};\n      --local-tab-width: ${this.localTabWidth};\n    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map((t,e)=>{const i=e===this.activeTab;return r`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(e)}
          data-active=${i}
          data-testid="tab-${t.label?.toLowerCase()}"
        >
          ${this.iconTemplate(t)}
          <wui-text variant="small-600" color="inherit"> ${t.label} </wui-text>
        </button>
      `})}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout(()=>{this.animateTabs(0,!0)},0))}iconTemplate(t){return t.icon?r`<wui-icon size="xs" color="inherit" name=${t.icon}></wui-icon>`:null}onTabClick(t){this.buttons&&this.animateTabs(t,!1),this.activeTab=t,this.onTabChange(t)}animateTabs(t,e){const i=this.buttons[this.activeTab],o=this.buttons[t],r=i?.querySelector("wui-text"),n=o?.querySelector("wui-text"),a=o?.getBoundingClientRect(),s=n?.getBoundingClientRect();i&&r&&!e&&t!==this.activeTab&&(r.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),i.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),o&&a&&s&&n&&(t!==this.activeTab||e)&&(this.localTabWidth=`${Math.round(a.width+s.width)+6}px`,o.animate([{width:`${a.width+s.width}px`}],{duration:e?0:500,fill:"forwards",easing:"ease"}),n.animate([{opacity:1}],{duration:e?0:125,delay:e?0:200,fill:"forwards",easing:"ease"}))}};ft.styles=[i,e,gt],wt([I({type:Array})],ft.prototype,"tabs",void 0),wt([I()],ft.prototype,"onTabChange",void 0),wt([I({type:Array})],ft.prototype,"buttons",void 0),wt([I({type:Boolean})],ft.prototype,"disabled",void 0),wt([I()],ft.prototype,"localTabWidth",void 0),wt([P()],ft.prototype,"activeTab",void 0),wt([P()],ft.prototype,"isDense",void 0),ft=wt([E("wui-tabs")],ft);var bt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let mt=class extends o{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=this.generateTabs();return r`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs .tabs=${t} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){const t=this.platforms.map(t=>"browser"===t?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===t?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===t?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===t?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===t?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=t.map(({platform:t})=>t),t}onTabChange(t){const e=this.platformTabs[t];e&&this.onSelectPlatfrom?.(e)}};bt([I({type:Array})],mt.prototype,"platforms",void 0),bt([I()],mt.prototype,"onSelectPlatfrom",void 0),mt=bt([E("w3m-connecting-header")],mt);const vt=t`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: none;
    border-radius: var(--local-border-radius);
    width: var(--local-width);
    white-space: nowrap;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='md'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-l);
    height: 36px;
  }

  button[data-size='md'][data-icon-left='true'][data-icon-right='false'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-s);
  }

  button[data-size='md'][data-icon-right='true'][data-icon-left='false'] {
    padding: 8.2px var(--wui-spacing-s) 9px var(--wui-spacing-l);
  }

  button[data-size='lg'] {
    padding: var(--wui-spacing-m) var(--wui-spacing-2l);
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='inverse'] {
    background-color: var(--wui-color-inverse-100);
    color: var(--wui-color-inverse-000);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='accent-error'] {
    background: var(--wui-color-error-glass-015);
    color: var(--wui-color-error-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-error-glass-010);
  }

  button[data-variant='accent-success'] {
    background: var(--wui-color-success-glass-015);
    color: var(--wui-color-success-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-success-glass-010);
  }

  button[data-variant='neutral'] {
    background: transparent;
    color: var(--wui-color-fg-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-variant='main']:focus-visible:enabled {
    background-color: var(--wui-color-accent-090);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='inverse']:focus-visible:enabled {
    background-color: var(--wui-color-inverse-100);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent']:focus-visible:enabled {
    background-color: var(--wui-color-accent-glass-010);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent-error']:focus-visible:enabled {
    background: var(--wui-color-error-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-error-100),
      0 0 0 4px var(--wui-color-error-glass-020);
  }
  button[data-variant='accent-success']:focus-visible:enabled {
    background: var(--wui-color-success-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-success-100),
      0 0 0 4px var(--wui-color-success-glass-020);
  }
  button[data-variant='neutral']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='accent-error']:hover:enabled {
      background: var(--wui-color-error-glass-020);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-error']:active:enabled {
      background: var(--wui-color-error-glass-030);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-success']:hover:enabled {
      background: var(--wui-color-success-glass-020);
      color: var(--wui-color-success-100);
    }

    button[data-variant='accent-success']:active:enabled {
      background: var(--wui-color-success-glass-030);
      color: var(--wui-color-success-100);
    }

    button[data-variant='neutral']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='neutral']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }

    button[data-size='lg'][data-icon-left='true'][data-icon-right='false'] {
      padding-left: var(--wui-spacing-m);
    }

    button[data-size='lg'][data-icon-right='true'][data-icon-left='false'] {
      padding-right: var(--wui-spacing-m);
    }
  }

  /* -- Disabled state --------------------------------------------------- */
  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    color: var(--wui-color-gray-glass-020);
    cursor: not-allowed;
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`;var yt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};const xt={main:"inverse-100",inverse:"inverse-000",accent:"accent-100","accent-error":"error-100","accent-success":"success-100",neutral:"fg-100",disabled:"gray-glass-020"},$t={lg:"paragraph-600",md:"small-600"},Ct={lg:"md",md:"md"};let kt=class extends o{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="main",this.hasIconLeft=!1,this.hasIconRight=!1,this.borderRadius="m"}render(){this.style.cssText=`\n    --local-width: ${this.fullWidth?"100%":"auto"};\n    --local-opacity-100: ${this.loading?0:1};\n    --local-opacity-000: ${this.loading?1:0};\n    --local-border-radius: var(--wui-border-radius-${this.borderRadius});\n    `;const t=this.textVariant??$t[this.size];return r`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${()=>this.handleSlotLeftChange()}></slot>
        <wui-text variant=${t} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight" @slotchange=${()=>this.handleSlotRightChange()}></slot>
      </button>
    `}handleSlotLeftChange(){this.hasIconLeft=!0}handleSlotRightChange(){this.hasIconRight=!0}loadingTemplate(){if(this.loading){const t=Ct[this.size],e=this.disabled?xt.disabled:xt[this.variant];return r`<wui-loading-spinner color=${e} size=${t}></wui-loading-spinner>`}return r``}};kt.styles=[i,e,vt],yt([I()],kt.prototype,"size",void 0),yt([I({type:Boolean})],kt.prototype,"disabled",void 0),yt([I({type:Boolean})],kt.prototype,"fullWidth",void 0),yt([I({type:Boolean})],kt.prototype,"loading",void 0),yt([I()],kt.prototype,"variant",void 0),yt([I({type:Boolean})],kt.prototype,"hasIconLeft",void 0),yt([I({type:Boolean})],kt.prototype,"hasIconRight",void 0),yt([I()],kt.prototype,"borderRadius",void 0),yt([I()],kt.prototype,"textVariant",void 0),kt=yt([E("wui-button")],kt);const Rt=t`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var It=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Et=class extends o{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return r`
      <button ?disabled=${this.disabled} tabindex=${T(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};Et.styles=[i,e,Rt],It([I()],Et.prototype,"tabIdx",void 0),It([I({type:Boolean})],Et.prototype,"disabled",void 0),It([I()],Et.prototype,"color",void 0),Et=It([E("wui-link")],Et);const Tt=t`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var Pt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let St=class extends o{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const t=this.radius>50?50:this.radius,e=36-t;return r`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${116+e} ${245+e}"
          stroke-dashoffset=${360+1.75*e}
        />
      </svg>
    `}};St.styles=[i,Tt],Pt([I({type:Number})],St.prototype,"radius",void 0),St=Pt([E("wui-loading-thumbnail")],St);const jt=t`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`;var Ot=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Lt=class extends o{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){const t="sm"===this.size?"small-600":"paragraph-600";return r`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?r`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${t} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};Lt.styles=[i,e,jt],Ot([I()],Lt.prototype,"variant",void 0),Ot([I()],Lt.prototype,"imageSrc",void 0),Ot([I({type:Boolean})],Lt.prototype,"disabled",void 0),Ot([I()],Lt.prototype,"icon",void 0),Ot([I()],Lt.prototype,"size",void 0),Ot([I()],Lt.prototype,"text",void 0),Lt=Ot([E("wui-chip-button")],Lt);const zt=t`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var At=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Bt=class extends o{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return r`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};Bt.styles=[i,e,zt],At([I({type:Boolean})],Bt.prototype,"disabled",void 0),At([I()],Bt.prototype,"label",void 0),At([I()],Bt.prototype,"buttonLabel",void 0),Bt=At([E("wui-cta-button")],Bt);const Wt=t`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`;var Dt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Nt=class extends o{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:t,app_store:e,play_store:i,chrome_store:o,homepage:n}=this.wallet,a=l.isMobile(),s=l.isIos(),c=l.isAndroid(),d=[e,i,n,o].filter(Boolean).length>1,h=S.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return d&&!a?r`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${()=>u.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!d&&n?r`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:e&&s?r`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:i&&c?r`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&l.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&l.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&l.openHref(this.wallet.homepage,"_blank")}};Nt.styles=[Wt],Dt([I({type:Object})],Nt.prototype,"wallet",void 0),Nt=Dt([E("w3m-mobile-download-links")],Nt);const Mt=t`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`;var Ut=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};class _t extends o{constructor(){super(),this.wallet=u.state.data?.wallet,this.connector=u.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=h.getWalletImage(this.wallet)??h.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=p.state.wcUri,this.error=p.state.wcError,this.ready=!1,this.showRetry=!1,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(p.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),p.subscribeKey("wcError",t=>this.error=t)),(l.isTelegram()||l.isSafari())&&l.isIos()&&p.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),p.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();const t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let e=`Continue in ${this.name}`;return this.error&&(e="Connection declined"),r`
      <wui-flex
        data-error=${T(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${T(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?r`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?r`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;const t=this.shadowRoot?.querySelector("wui-button");t?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){p.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){const t=v.state.themeVariables["--w3m-border-radius-master"],e=t?parseInt(t.replace("px",""),10):4;return r`<wui-loading-thumbnail radius=${9*e}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(l.copyToClopboard(this.uri),y.showSuccess("Link copied"))}catch{y.showError("Failed to copy")}}}_t.styles=Mt,Ut([P()],_t.prototype,"isRetrying",void 0),Ut([P()],_t.prototype,"uri",void 0),Ut([P()],_t.prototype,"error",void 0),Ut([P()],_t.prototype,"ready",void 0),Ut([P()],_t.prototype,"showRetry",void 0),Ut([P()],_t.prototype,"secondaryBtnLabel",void 0),Ut([P()],_t.prototype,"secondaryLabel",void 0),Ut([P()],_t.prototype,"isLoading",void 0),Ut([I({type:Boolean})],_t.prototype,"isMobile",void 0),Ut([I()],_t.prototype,"onRetry",void 0);let qt=class extends _t{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),c.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){try{this.error=!1;const{connectors:t}=n.state,e=t.find(t=>"ANNOUNCED"===t.type&&t.info?.rdns===this.wallet?.rdns||"INJECTED"===t.type||t.name===this.wallet?.name);if(!e)throw new Error("w3m-connecting-wc-browser: No connector found");await p.connectExternal(e,e.chain),x.close(),c.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown"}})}catch(t){c.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}}};qt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([E("w3m-connecting-wc-browser")],qt);let Kt=class extends _t{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),c.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;const{desktop_link:t,name:e}=this.wallet,{redirect:i,href:o}=l.formatNativeUrl(t,this.uri);p.setWcLinking({name:e,href:o}),p.setRecentWallet(this.wallet),l.openHref(i,"_blank")}catch{this.error=!0}}};Kt=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([E("w3m-connecting-wc-desktop")],Kt);var Ht=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Vt=class extends _t{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=s.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;const{mobile_link:t,link_mode:e,name:i}=this.wallet,{redirect:o,redirectUniversalLink:r,href:n}=l.formatNativeUrl(t,this.uri,e);this.redirectDeeplink=o,this.redirectUniversalLink=r,this.target=l.isIframe()?"_top":"_self",p.setWcLinking({name:i,href:n}),p.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?l.openHref(this.redirectUniversalLink,this.target):l.openHref(this.redirectDeeplink,this.target)}catch(t){c.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=$.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(p.subscribeKey("wcUri",()=>{this.onHandleURI()})),c.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){p.setWcError(!1),this.onConnect?.()}};Ht([P()],Vt.prototype,"redirectDeeplink",void 0),Ht([P()],Vt.prototype,"redirectUniversalLink",void 0),Ht([P()],Vt.prototype,"target",void 0),Ht([P()],Vt.prototype,"preferUniversalLinks",void 0),Ht([P()],Vt.prototype,"isLoading",void 0),Vt=Ht([E("w3m-connecting-wc-mobile")],Vt);var Ft,Yt,Gt={};var Jt,Xt={},Qt={};function Zt(){if(Jt)return Qt;let t;Jt=1;const e=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return Qt.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return 4*t+17},Qt.getSymbolTotalCodewords=function(t){return e[t]},Qt.getBCHDigit=function(t){let e=0;for(;0!==t;)e++,t>>>=1;return e},Qt.setToSJISFunction=function(e){if("function"!=typeof e)throw new Error('"toSJISFunc" is not a valid function.');t=e},Qt.isKanjiModeEnabled=function(){return void 0!==t},Qt.toSJIS=function(e){return t(e)},Qt}var te,ee,ie,oe,re,ne={};function ae(){return te||(te=1,(t=ne).L={bit:1},t.M={bit:0},t.Q={bit:3},t.H={bit:2},t.isValid=function(t){return t&&void 0!==t.bit&&t.bit>=0&&t.bit<4},t.from=function(e,i){if(t.isValid(e))return e;try{return function(e){if("string"!=typeof e)throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return t.L;case"m":case"medium":return t.M;case"q":case"quartile":return t.Q;case"h":case"high":return t.H;default:throw new Error("Unknown EC Level: "+e)}}(e)}catch(o){return i}}),ne;var t}var se,le={};var ce,ue={};var de,he={};var pe,ge={};function we(){if(pe)return ge;pe=1;const t=ae(),e=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],i=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return ge.getBlocksCount=function(i,o){switch(o){case t.L:return e[4*(i-1)+0];case t.M:return e[4*(i-1)+1];case t.Q:return e[4*(i-1)+2];case t.H:return e[4*(i-1)+3];default:return}},ge.getTotalCodewordsCount=function(e,o){switch(o){case t.L:return i[4*(e-1)+0];case t.M:return i[4*(e-1)+1];case t.Q:return i[4*(e-1)+2];case t.H:return i[4*(e-1)+3];default:return}},ge}var fe,be,me,ve,ye={},xe={};function $e(){return be||(be=1,function(t){const e=function(){if(fe)return xe;fe=1;const t=new Uint8Array(512),e=new Uint8Array(256);return function(){let i=1;for(let o=0;o<255;o++)t[o]=i,e[i]=o,i<<=1,256&i&&(i^=285);for(let e=255;e<512;e++)t[e]=t[e-255]}(),xe.log=function(t){if(t<1)throw new Error("log("+t+")");return e[t]},xe.exp=function(e){return t[e]},xe.mul=function(i,o){return 0===i||0===o?0:t[e[i]+e[o]]},xe}();t.mul=function(t,i){const o=new Uint8Array(t.length+i.length-1);for(let r=0;r<t.length;r++)for(let n=0;n<i.length;n++)o[r+n]^=e.mul(t[r],i[n]);return o},t.mod=function(t,i){let o=new Uint8Array(t);for(;o.length-i.length>=0;){const t=o[0];for(let n=0;n<i.length;n++)o[n]^=e.mul(i[n],t);let r=0;for(;r<o.length&&0===o[r];)r++;o=o.slice(r)}return o},t.generateECPolynomial=function(i){let o=new Uint8Array([1]);for(let r=0;r<i;r++)o=t.mul(o,new Uint8Array([1,e.exp(r)]));return o}}(ye)),ye}var Ce,ke={},Re={},Ie={};function Ee(){return Ce||(Ce=1,Ie.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),Ie}var Te,Pe,Se,je={};function Oe(){if(Te)return je;Te=1;const t="[0-9]+";let e="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";e=e.replace(/u/g,"\\u");const i="(?:(?![A-Z0-9 $%*+\\-./:]|"+e+")(?:.|[\r\n]))+";je.KANJI=new RegExp(e,"g"),je.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),je.BYTE=new RegExp(i,"g"),je.NUMERIC=new RegExp(t,"g"),je.ALPHANUMERIC=new RegExp("[A-Z $%*+\\-./:]+","g");const o=new RegExp("^"+e+"$"),r=new RegExp("^"+t+"$"),n=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return je.testKanji=function(t){return o.test(t)},je.testNumeric=function(t){return r.test(t)},je.testAlphanumeric=function(t){return n.test(t)},je}function Le(){return Pe||(Pe=1,function(t){const e=Ee(),i=Oe();t.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},t.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},t.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},t.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},t.MIXED={bit:-1},t.getCharCountIndicator=function(t,i){if(!t.ccBits)throw new Error("Invalid mode: "+t);if(!e.isValid(i))throw new Error("Invalid version: "+i);return i>=1&&i<10?t.ccBits[0]:i<27?t.ccBits[1]:t.ccBits[2]},t.getBestModeForData=function(e){return i.testNumeric(e)?t.NUMERIC:i.testAlphanumeric(e)?t.ALPHANUMERIC:i.testKanji(e)?t.KANJI:t.BYTE},t.toString=function(t){if(t&&t.id)return t.id;throw new Error("Invalid mode")},t.isValid=function(t){return t&&t.bit&&t.ccBits},t.from=function(e,i){if(t.isValid(e))return e;try{return function(e){if("string"!=typeof e)throw new Error("Param is not a string");switch(e.toLowerCase()){case"numeric":return t.NUMERIC;case"alphanumeric":return t.ALPHANUMERIC;case"kanji":return t.KANJI;case"byte":return t.BYTE;default:throw new Error("Unknown mode: "+e)}}(e)}catch(o){return i}}}(Re)),Re}function ze(){return Se||(Se=1,function(t){const e=Zt(),i=we(),o=ae(),r=Le(),n=Ee(),a=e.getBCHDigit(7973);function s(t,e){return r.getCharCountIndicator(t,e)+4}function l(t,e){let i=0;return t.forEach(function(t){const o=s(t.mode,e);i+=o+t.getBitsLength()}),i}t.from=function(t,e){return n.isValid(t)?parseInt(t,10):e},t.getCapacity=function(t,o,a){if(!n.isValid(t))throw new Error("Invalid QR Code version");void 0===a&&(a=r.BYTE);const l=8*(e.getSymbolTotalCodewords(t)-i.getTotalCodewordsCount(t,o));if(a===r.MIXED)return l;const c=l-s(a,t);switch(a){case r.NUMERIC:return Math.floor(c/10*3);case r.ALPHANUMERIC:return Math.floor(c/11*2);case r.KANJI:return Math.floor(c/13);case r.BYTE:default:return Math.floor(c/8)}},t.getBestVersionForData=function(e,i){let n;const a=o.from(i,o.M);if(Array.isArray(e)){if(e.length>1)return function(e,i){for(let o=1;o<=40;o++)if(l(e,o)<=t.getCapacity(o,i,r.MIXED))return o}(e,a);if(0===e.length)return 1;n=e[0]}else n=e;return function(e,i,o){for(let r=1;r<=40;r++)if(i<=t.getCapacity(r,o,e))return r}(n.mode,n.getLength(),a)},t.getEncodedBits=function(t){if(!n.isValid(t)||t<7)throw new Error("Invalid QR Code version");let i=t<<12;for(;e.getBCHDigit(i)-a>=0;)i^=7973<<e.getBCHDigit(i)-a;return t<<12|i}}(ke)),ke}var Ae,Be={};var We,De,Ne,Me,Ue,_e,qe,Ke,He,Ve,Fe,Ye,Ge={};function Je(){if(Ke)return qe;Ke=1;const t=_e?Ue:(_e=1,Ue=function(t){for(var e=[],i=t.length,o=0;o<i;o++){var r=t.charCodeAt(o);if(r>=55296&&r<=56319&&i>o+1){var n=t.charCodeAt(o+1);n>=56320&&n<=57343&&(r=1024*(r-55296)+n-56320+65536,o+=1)}r<128?e.push(r):r<2048?(e.push(r>>6|192),e.push(63&r|128)):r<55296||r>=57344&&r<65536?(e.push(r>>12|224),e.push(r>>6&63|128),e.push(63&r|128)):r>=65536&&r<=1114111?(e.push(r>>18|240),e.push(r>>12&63|128),e.push(r>>6&63|128),e.push(63&r|128)):e.push(239,191,189)}return new Uint8Array(e).buffer}),e=Le();function i(i){this.mode=e.BYTE,"string"==typeof i&&(i=t(i)),this.data=new Uint8Array(i)}return i.getBitsLength=function(t){return 8*t},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(t){for(let e=0,i=this.data.length;e<i;e++)t.put(this.data[e],8)},qe=i}function Xe(){return Fe||(Fe=1,function(t){const e=Le(),i=function(){if(De)return We;De=1;const t=Le();function e(e){this.mode=t.NUMERIC,this.data=e.toString()}return e.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(t){let e,i,o;for(e=0;e+3<=this.data.length;e+=3)i=this.data.substr(e,3),o=parseInt(i,10),t.put(o,10);const r=this.data.length-e;r>0&&(i=this.data.substr(e),o=parseInt(i,10),t.put(o,3*r+1))},We=e}(),o=function(){if(Me)return Ne;Me=1;const t=Le(),e=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function i(e){this.mode=t.ALPHANUMERIC,this.data=e}return i.getBitsLength=function(t){return 11*Math.floor(t/2)+t%2*6},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(t){let i;for(i=0;i+2<=this.data.length;i+=2){let o=45*e.indexOf(this.data[i]);o+=e.indexOf(this.data[i+1]),t.put(o,11)}this.data.length%2&&t.put(e.indexOf(this.data[i]),6)},Ne=i}(),r=Je(),n=function(){if(Ve)return He;Ve=1;const t=Le(),e=Zt();function i(e){this.mode=t.KANJI,this.data=e}return i.getBitsLength=function(t){return 13*t},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(t){let i;for(i=0;i<this.data.length;i++){let o=e.toSJIS(this.data[i]);if(o>=33088&&o<=40956)o-=33088;else{if(!(o>=57408&&o<=60351))throw new Error("Invalid SJIS character: "+this.data[i]+"\nMake sure your charset is UTF-8");o-=49472}o=192*(o>>>8&255)+(255&o),t.put(o,13)}},He=i}(),a=Oe(),s=Zt(),l=A();function c(t){return unescape(encodeURIComponent(t)).length}function u(t,e,i){const o=[];let r;for(;null!==(r=t.exec(i));)o.push({data:r[0],index:r.index,mode:e,length:r[0].length});return o}function d(t){const i=u(a.NUMERIC,e.NUMERIC,t),o=u(a.ALPHANUMERIC,e.ALPHANUMERIC,t);let r,n;s.isKanjiModeEnabled()?(r=u(a.BYTE,e.BYTE,t),n=u(a.KANJI,e.KANJI,t)):(r=u(a.BYTE_KANJI,e.BYTE,t),n=[]);return i.concat(o,r,n).sort(function(t,e){return t.index-e.index}).map(function(t){return{data:t.data,mode:t.mode,length:t.length}})}function h(t,a){switch(a){case e.NUMERIC:return i.getBitsLength(t);case e.ALPHANUMERIC:return o.getBitsLength(t);case e.KANJI:return n.getBitsLength(t);case e.BYTE:return r.getBitsLength(t)}}function p(t,a){let l;const c=e.getBestModeForData(t);if(l=e.from(a,c),l!==e.BYTE&&l.bit<c.bit)throw new Error('"'+t+'" cannot be encoded with mode '+e.toString(l)+".\n Suggested mode is: "+e.toString(c));switch(l!==e.KANJI||s.isKanjiModeEnabled()||(l=e.BYTE),l){case e.NUMERIC:return new i(t);case e.ALPHANUMERIC:return new o(t);case e.KANJI:return new n(t);case e.BYTE:return new r(t)}}t.fromArray=function(t){return t.reduce(function(t,e){return"string"==typeof e?t.push(p(e,null)):e.data&&t.push(p(e.data,e.mode)),t},[])},t.fromString=function(i,o){const r=function(t){const i=[];for(let o=0;o<t.length;o++){const r=t[o];switch(r.mode){case e.NUMERIC:i.push([r,{data:r.data,mode:e.ALPHANUMERIC,length:r.length},{data:r.data,mode:e.BYTE,length:r.length}]);break;case e.ALPHANUMERIC:i.push([r,{data:r.data,mode:e.BYTE,length:r.length}]);break;case e.KANJI:i.push([r,{data:r.data,mode:e.BYTE,length:c(r.data)}]);break;case e.BYTE:i.push([{data:r.data,mode:e.BYTE,length:c(r.data)}])}}return i}(d(i,s.isKanjiModeEnabled())),n=function(t,i){const o={},r={start:{}};let n=["start"];for(let a=0;a<t.length;a++){const s=t[a],l=[];for(let t=0;t<s.length;t++){const c=s[t],u=""+a+t;l.push(u),o[u]={node:c,lastCount:0},r[u]={};for(let t=0;t<n.length;t++){const a=n[t];o[a]&&o[a].node.mode===c.mode?(r[a][u]=h(o[a].lastCount+c.length,c.mode)-h(o[a].lastCount,c.mode),o[a].lastCount+=c.length):(o[a]&&(o[a].lastCount=c.length),r[a][u]=h(c.length,c.mode)+4+e.getCharCountIndicator(c.mode,i))}}n=l}for(let e=0;e<n.length;e++)r[n[e]].end=0;return{map:r,table:o}}(r,o),a=l.find_path(n.map,"start","end"),u=[];for(let t=1;t<a.length-1;t++)u.push(n.table[a[t]].node);return t.fromArray(function(t){return t.reduce(function(t,e){const i=t.length-1>=0?t[t.length-1]:null;return i&&i.mode===e.mode?(t[t.length-1].data+=e.data,t):(t.push(e),t)},[])}(u))},t.rawSplit=function(e){return t.fromArray(d(e,s.isKanjiModeEnabled()))}}(Ge)),Ge}function Qe(){if(Ye)return Xt;Ye=1;const t=Zt(),e=ae(),i=function(){if(ie)return ee;function t(){this.buffer=[],this.length=0}return ie=1,t.prototype={get:function(t){const e=Math.floor(t/8);return 1==(this.buffer[e]>>>7-t%8&1)},put:function(t,e){for(let i=0;i<e;i++)this.putBit(1==(t>>>e-i-1&1))},getLengthInBits:function(){return this.length},putBit:function(t){const e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},ee=t}(),o=function(){if(re)return oe;function t(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return re=1,t.prototype.set=function(t,e,i,o){const r=t*this.size+e;this.data[r]=i,o&&(this.reservedBit[r]=!0)},t.prototype.get=function(t,e){return this.data[t*this.size+e]},t.prototype.xor=function(t,e,i){this.data[t*this.size+e]^=i},t.prototype.isReserved=function(t,e){return this.reservedBit[t*this.size+e]},oe=t}(),r=(se||(se=1,function(t){const e=Zt().getSymbolSize;t.getRowColCoords=function(t){if(1===t)return[];const i=Math.floor(t/7)+2,o=e(t),r=145===o?26:2*Math.ceil((o-13)/(2*i-2)),n=[o-7];for(let e=1;e<i-1;e++)n[e]=n[e-1]-r;return n.push(6),n.reverse()},t.getPositions=function(e){const i=[],o=t.getRowColCoords(e),r=o.length;for(let t=0;t<r;t++)for(let e=0;e<r;e++)0===t&&0===e||0===t&&e===r-1||t===r-1&&0===e||i.push([o[t],o[e]]);return i}}(le)),le),n=function(){if(ce)return ue;ce=1;const t=Zt().getSymbolSize;return ue.getPositions=function(e){const i=t(e);return[[0,0],[i-7,0],[0,i-7]]},ue}(),a=(de||(de=1,function(t){t.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const e=3,i=3,o=40,r=10;function n(e,i,o){switch(e){case t.Patterns.PATTERN000:return(i+o)%2==0;case t.Patterns.PATTERN001:return i%2==0;case t.Patterns.PATTERN010:return o%3==0;case t.Patterns.PATTERN011:return(i+o)%3==0;case t.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(o/3))%2==0;case t.Patterns.PATTERN101:return i*o%2+i*o%3==0;case t.Patterns.PATTERN110:return(i*o%2+i*o%3)%2==0;case t.Patterns.PATTERN111:return(i*o%3+(i+o)%2)%2==0;default:throw new Error("bad maskPattern:"+e)}}t.isValid=function(t){return null!=t&&""!==t&&!isNaN(t)&&t>=0&&t<=7},t.from=function(e){return t.isValid(e)?parseInt(e,10):void 0},t.getPenaltyN1=function(t){const i=t.size;let o=0,r=0,n=0,a=null,s=null;for(let l=0;l<i;l++){r=n=0,a=s=null;for(let c=0;c<i;c++){let i=t.get(l,c);i===a?r++:(r>=5&&(o+=e+(r-5)),a=i,r=1),i=t.get(c,l),i===s?n++:(n>=5&&(o+=e+(n-5)),s=i,n=1)}r>=5&&(o+=e+(r-5)),n>=5&&(o+=e+(n-5))}return o},t.getPenaltyN2=function(t){const e=t.size;let o=0;for(let i=0;i<e-1;i++)for(let r=0;r<e-1;r++){const e=t.get(i,r)+t.get(i,r+1)+t.get(i+1,r)+t.get(i+1,r+1);4!==e&&0!==e||o++}return o*i},t.getPenaltyN3=function(t){const e=t.size;let i=0,r=0,n=0;for(let o=0;o<e;o++){r=n=0;for(let a=0;a<e;a++)r=r<<1&2047|t.get(o,a),a>=10&&(1488===r||93===r)&&i++,n=n<<1&2047|t.get(a,o),a>=10&&(1488===n||93===n)&&i++}return i*o},t.getPenaltyN4=function(t){let e=0;const i=t.data.length;for(let o=0;o<i;o++)e+=t.data[o];return Math.abs(Math.ceil(100*e/i/5)-10)*r},t.applyMask=function(t,e){const i=e.size;for(let o=0;o<i;o++)for(let r=0;r<i;r++)e.isReserved(r,o)||e.xor(r,o,n(t,r,o))},t.getBestMask=function(e,i){const o=Object.keys(t.Patterns).length;let r=0,n=1/0;for(let a=0;a<o;a++){i(a),t.applyMask(a,e);const o=t.getPenaltyN1(e)+t.getPenaltyN2(e)+t.getPenaltyN3(e)+t.getPenaltyN4(e);t.applyMask(a,e),o<n&&(n=o,r=a)}return r}}(he)),he),s=we(),l=function(){if(ve)return me;ve=1;const t=$e();function e(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}return e.prototype.initialize=function(e){this.degree=e,this.genPoly=t.generateECPolynomial(this.degree)},e.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");const i=new Uint8Array(e.length+this.degree);i.set(e);const o=t.mod(i,this.genPoly),r=this.degree-o.length;if(r>0){const t=new Uint8Array(this.degree);return t.set(o,r),t}return o},me=e}(),c=ze(),u=function(){if(Ae)return Be;Ae=1;const t=Zt(),e=t.getBCHDigit(1335);return Be.getEncodedBits=function(i,o){const r=i.bit<<3|o;let n=r<<10;for(;t.getBCHDigit(n)-e>=0;)n^=1335<<t.getBCHDigit(n)-e;return 21522^(r<<10|n)},Be}(),d=Le(),h=Xe();function p(t,e,i){const o=t.size,r=u.getEncodedBits(e,i);let n,a;for(n=0;n<15;n++)a=1==(r>>n&1),n<6?t.set(n,8,a,!0):n<8?t.set(n+1,8,a,!0):t.set(o-15+n,8,a,!0),n<8?t.set(8,o-n-1,a,!0):n<9?t.set(8,15-n-1+1,a,!0):t.set(8,15-n-1,a,!0);t.set(o-8,8,1,!0)}function g(e,o,r){const n=new i;r.forEach(function(t){n.put(t.mode.bit,4),n.put(t.getLength(),d.getCharCountIndicator(t.mode,e)),t.write(n)});const a=8*(t.getSymbolTotalCodewords(e)-s.getTotalCodewordsCount(e,o));for(n.getLengthInBits()+4<=a&&n.put(0,4);n.getLengthInBits()%8!=0;)n.putBit(0);const c=(a-n.getLengthInBits())/8;for(let t=0;t<c;t++)n.put(t%2?17:236,8);return function(e,i,o){const r=t.getSymbolTotalCodewords(i),n=s.getTotalCodewordsCount(i,o),a=r-n,c=s.getBlocksCount(i,o),u=r%c,d=c-u,h=Math.floor(r/c),p=Math.floor(a/c),g=p+1,w=h-p,f=new l(w);let b=0;const m=new Array(c),v=new Array(c);let y=0;const x=new Uint8Array(e.buffer);for(let t=0;t<c;t++){const e=t<d?p:g;m[t]=x.slice(b,b+e),v[t]=f.encode(m[t]),b+=e,y=Math.max(y,e)}const $=new Uint8Array(r);let C,k,R=0;for(C=0;C<y;C++)for(k=0;k<c;k++)C<m[k].length&&($[R++]=m[k][C]);for(C=0;C<w;C++)for(k=0;k<c;k++)$[R++]=v[k][C];return $}(n,e,o)}function w(e,i,s,l){let u;if(Array.isArray(e))u=h.fromArray(e);else{if("string"!=typeof e)throw new Error("Invalid data");{let t=i;if(!t){const i=h.rawSplit(e);t=c.getBestVersionForData(i,s)}u=h.fromString(e,t||40)}}const d=c.getBestVersionForData(u,s);if(!d)throw new Error("The amount of data is too big to be stored in a QR Code");if(i){if(i<d)throw new Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: "+d+".\n")}else i=d;const w=g(i,s,u),f=t.getSymbolSize(i),b=new o(f);return function(t,e){const i=t.size,o=n.getPositions(e);for(let r=0;r<o.length;r++){const e=o[r][0],n=o[r][1];for(let o=-1;o<=7;o++)if(!(e+o<=-1||i<=e+o))for(let r=-1;r<=7;r++)n+r<=-1||i<=n+r||(o>=0&&o<=6&&(0===r||6===r)||r>=0&&r<=6&&(0===o||6===o)||o>=2&&o<=4&&r>=2&&r<=4?t.set(e+o,n+r,!0,!0):t.set(e+o,n+r,!1,!0))}}(b,i),function(t){const e=t.size;for(let i=8;i<e-8;i++){const e=i%2==0;t.set(i,6,e,!0),t.set(6,i,e,!0)}}(b),function(t,e){const i=r.getPositions(e);for(let o=0;o<i.length;o++){const e=i[o][0],r=i[o][1];for(let i=-2;i<=2;i++)for(let o=-2;o<=2;o++)-2===i||2===i||-2===o||2===o||0===i&&0===o?t.set(e+i,r+o,!0,!0):t.set(e+i,r+o,!1,!0)}}(b,i),p(b,s,0),i>=7&&function(t,e){const i=t.size,o=c.getEncodedBits(e);let r,n,a;for(let s=0;s<18;s++)r=Math.floor(s/3),n=s%3+i-8-3,a=1==(o>>s&1),t.set(r,n,a,!0),t.set(n,r,a,!0)}(b,i),function(t,e){const i=t.size;let o=-1,r=i-1,n=7,a=0;for(let s=i-1;s>0;s-=2)for(6===s&&s--;;){for(let i=0;i<2;i++)if(!t.isReserved(r,s-i)){let o=!1;a<e.length&&(o=1==(e[a]>>>n&1)),t.set(r,s-i,o),n--,-1===n&&(a++,n=7)}if(r+=o,r<0||i<=r){r-=o,o=-o;break}}}(b,w),isNaN(l)&&(l=a.getBestMask(b,p.bind(null,b,s))),a.applyMask(l,b),p(b,s,l),{modules:b,version:i,errorCorrectionLevel:s,maskPattern:l,segments:u}}return Xt.create=function(i,o){if(void 0===i||""===i)throw new Error("No input text");let r,n,s=e.M;return void 0!==o&&(s=e.from(o.errorCorrectionLevel,e.M),r=c.from(o.version),n=a.from(o.maskPattern),o.toSJISFunc&&t.setToSJISFunction(o.toSJISFunc)),w(i,r,s,n)},Xt}var Ze,ti,ei={},ii={};function oi(){return Ze||(Ze=1,function(t){function e(t){if("number"==typeof t&&(t=t.toString()),"string"!=typeof t)throw new Error("Color should be defined as hex string");let e=t.slice().replace("#","").split("");if(e.length<3||5===e.length||e.length>8)throw new Error("Invalid hex color: "+t);3!==e.length&&4!==e.length||(e=Array.prototype.concat.apply([],e.map(function(t){return[t,t]}))),6===e.length&&e.push("F","F");const i=parseInt(e.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:255&i,hex:"#"+e.slice(0,6).join("")}}t.getOptions=function(t){t||(t={}),t.color||(t.color={});const i=void 0===t.margin||null===t.margin||t.margin<0?4:t.margin,o=t.width&&t.width>=21?t.width:void 0,r=t.scale||4;return{width:o,scale:o?4:r,margin:i,color:{dark:e(t.color.dark||"#000000ff"),light:e(t.color.light||"#ffffffff")},type:t.type,rendererOpts:t.rendererOpts||{}}},t.getScale=function(t,e){return e.width&&e.width>=t+2*e.margin?e.width/(t+2*e.margin):e.scale},t.getImageWidth=function(e,i){const o=t.getScale(e,i);return Math.floor((e+2*i.margin)*o)},t.qrToImageData=function(e,i,o){const r=i.modules.size,n=i.modules.data,a=t.getScale(r,o),s=Math.floor((r+2*o.margin)*a),l=o.margin*a,c=[o.color.light,o.color.dark];for(let t=0;t<s;t++)for(let i=0;i<s;i++){let u=4*(t*s+i),d=o.color.light;if(t>=l&&i>=l&&t<s-l&&i<s-l){d=c[n[Math.floor((t-l)/a)*r+Math.floor((i-l)/a)]?1:0]}e[u++]=d.r,e[u++]=d.g,e[u++]=d.b,e[u]=d.a}}}(ii)),ii}function ri(){return ti||(ti=1,function(t){const e=oi();t.render=function(t,i,o){let r=o,n=i;void 0!==r||i&&i.getContext||(r=i,i=void 0),i||(n=function(){try{return document.createElement("canvas")}catch(t){throw new Error("You need to specify a canvas element")}}()),r=e.getOptions(r);const a=e.getImageWidth(t.modules.size,r),s=n.getContext("2d"),l=s.createImageData(a,a);return e.qrToImageData(l.data,t,r),function(t,e,i){t.clearRect(0,0,e.width,e.height),e.style||(e.style={}),e.height=i,e.width=i,e.style.height=i+"px",e.style.width=i+"px"}(s,n,a),s.putImageData(l,0,0),n},t.renderToDataURL=function(e,i,o){let r=o;void 0!==r||i&&i.getContext||(r=i,i=void 0),r||(r={});const n=t.render(e,i,r),a=r.type||"image/png",s=r.rendererOpts||{};return n.toDataURL(a,s.quality)}}(ei)),ei}var ni,ai,si={};function li(){if(ni)return si;ni=1;const t=oi();function e(t,e){const i=t.a/255,o=e+'="'+t.hex+'"';return i<1?o+" "+e+'-opacity="'+i.toFixed(2).slice(1)+'"':o}function i(t,e,i){let o=t+e;return void 0!==i&&(o+=" "+i),o}return si.render=function(o,r,n){const a=t.getOptions(r),s=o.modules.size,l=o.modules.data,c=s+2*a.margin,u=a.color.light.a?"<path "+e(a.color.light,"fill")+' d="M0 0h'+c+"v"+c+'H0z"/>':"",d="<path "+e(a.color.dark,"stroke")+' d="'+function(t,e,o){let r="",n=0,a=!1,s=0;for(let l=0;l<t.length;l++){const c=Math.floor(l%e),u=Math.floor(l/e);c||a||(a=!0),t[l]?(s++,l>0&&c>0&&t[l-1]||(r+=a?i("M",c+o,.5+u+o):i("m",n,0),n=0,a=!1),c+1<e&&t[l+1]||(r+=i("h",s),s=0)):n++}return r}(l,s,a.margin)+'"/>',h='viewBox="0 0 '+c+" "+c+'"',p='<svg xmlns="http://www.w3.org/2000/svg" '+(a.width?'width="'+a.width+'" height="'+a.width+'" ':"")+h+' shape-rendering="crispEdges">'+u+d+"</svg>\n";return"function"==typeof n&&n(null,p),p},si}const ci=z(function(){if(ai)return Gt;ai=1;const t=Yt?Ft:(Yt=1,Ft=function(){return"function"==typeof Promise&&Promise.prototype&&Promise.prototype.then}),e=Qe(),i=ri(),o=li();function r(i,o,r,n,a){const s=[].slice.call(arguments,1),l=s.length,c="function"==typeof s[l-1];if(!c&&!t())throw new Error("Callback required as last argument");if(!c){if(l<1)throw new Error("Too few arguments provided");return 1===l?(r=o,o=n=void 0):2!==l||o.getContext||(n=r,r=o,o=void 0),new Promise(function(t,a){try{const a=e.create(r,n);t(i(a,o,n))}catch(s){a(s)}})}if(l<2)throw new Error("Too few arguments provided");2===l?(a=r,r=o,o=n=void 0):3===l&&(o.getContext&&void 0===a?(a=n,n=void 0):(a=n,n=r,r=o,o=void 0));try{const t=e.create(r,n);a(null,i(t,o,n))}catch(u){a(u)}}return Gt.create=e.create,Gt.toCanvas=r.bind(null,i.render),Gt.toDataURL=r.bind(null,i.renderToDataURL),Gt.toString=r.bind(null,function(t,e,i){return o.render(t,i)}),Gt}());function ui(t,e,i){if(t===e)return!1;return(t-e<0?e-t:t-e)<=i+.1}const di={generate({uri:t,size:e,logoSize:i,dotColor:o="#141414"}){const r=[],n=function(t,e){const i=Array.prototype.slice.call(ci.create(t,{errorCorrectionLevel:e}).modules.data,0),o=Math.sqrt(i.length);return i.reduce((t,e,i)=>(i%o===0?t.push([e]):t[t.length-1].push(e))&&t,[])}(t,"Q"),a=e/n.length,s=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];s.forEach(({x:t,y:e})=>{const i=(n.length-7)*a*t,l=(n.length-7)*a*e,c=.45;for(let n=0;n<s.length;n+=1){const t=a*(7-2*n);r.push(C`
            <rect
              fill=${2===n?o:"transparent"}
              width=${0===n?t-5:t}
              rx= ${0===n?(t-5)*c:t*c}
              ry= ${0===n?(t-5)*c:t*c}
              stroke=${o}
              stroke-width=${0===n?5:0}
              height=${0===n?t-5:t}
              x= ${0===n?l+a*n+2.5:l+a*n}
              y= ${0===n?i+a*n+2.5:i+a*n}
            />
          `)}});const l=Math.floor((i+25)/a),c=n.length/2-l/2,u=n.length/2+l/2-1,d=[];n.forEach((t,e)=>{t.forEach((t,i)=>{if(n[e][i]&&!(e<7&&i<7||e>n.length-8&&i<7||e<7&&i>n.length-8||e>c&&e<u&&i>c&&i<u)){const t=e*a+a/2,o=i*a+a/2;d.push([t,o])}})});const h={};return d.forEach(([t,e])=>{h[t]?h[t]?.push(e):h[t]=[e]}),Object.entries(h).map(([t,e])=>{const i=e.filter(t=>e.every(e=>!ui(t,e,a)));return[Number(t),i]}).forEach(([t,e])=>{e.forEach(e=>{r.push(C`<circle cx=${t} cy=${e} fill=${o} r=${a/2.5} />`)})}),Object.entries(h).filter(([t,e])=>e.length>1).map(([t,e])=>{const i=e.filter(t=>e.some(e=>ui(t,e,a)));return[Number(t),i]}).map(([t,e])=>{e.sort((t,e)=>t<e?-1:1);const i=[];for(const o of e){const t=i.find(t=>t.some(t=>ui(o,t,a)));t?t.push(o):i.push([o])}return[t,i.map(t=>[t[0],t[t.length-1]])]}).forEach(([t,e])=>{e.forEach(([e,i])=>{r.push(C`
              <line
                x1=${t}
                x2=${t}
                y1=${e}
                y2=${i}
                stroke=${o}
                stroke-width=${a/1.25}
                stroke-linecap="round"
              />
            `)})}),r}},hi=t`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var pi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let gi=class extends o{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`\n     --local-size: ${this.size}px;\n     --local-icon-color: ${this.color??"#3396ff"}\n    `,r`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){const t="light"===this.theme?this.size:this.size-32;return C`
      <svg height=${t} width=${t}>
        ${di.generate({uri:this.uri,size:t,logoSize:this.arenaClear?0:t/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?r`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?r`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:r`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};gi.styles=[i,hi],pi([I()],gi.prototype,"uri",void 0),pi([I({type:Number})],gi.prototype,"size",void 0),pi([I()],gi.prototype,"theme",void 0),pi([I()],gi.prototype,"imageSrc",void 0),pi([I()],gi.prototype,"alt",void 0),pi([I()],gi.prototype,"color",void 0),pi([I({type:Boolean})],gi.prototype,"arenaClear",void 0),pi([I({type:Boolean})],gi.prototype,"farcaster",void 0),gi=pi([E("wui-qr-code")],gi);const wi=t`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`;var fi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let bi=class extends o{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`\n      width: ${this.width};\n      height: ${this.height};\n      border-radius: clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px);\n    `,r`<slot></slot>`}};bi.styles=[wi],fi([I()],bi.prototype,"width",void 0),fi([I()],bi.prototype,"height",void 0),fi([I()],bi.prototype,"borderRadius",void 0),fi([I()],bi.prototype,"variant",void 0),bi=fi([E("wui-shimmer")],bi);const mi=t`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.9;
  }
`;let vi=class extends o{render(){return r`
      <a
        data-testid="ux-branding-reown"
        href=${"https://reown.com"}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="xs"
          .padding=${["0","0","l","0"]}
        >
          <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
          <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};vi.styles=[i,e,mi],vi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([E("wui-ux-by-reown")],vi);const yi=t`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }
`;let xi=class extends _t{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),c.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(t=>t()),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),r`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","xl","xl","xl"]}
        gap="xl"
      >
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const t=this.getBoundingClientRect().width-40,e=this.wallet?this.wallet.name:void 0;return p.setWcLinking(void 0),p.setRecentWallet(this.wallet),r` <wui-qr-code
      size=${t}
      theme=${v.state.themeMode}
      uri=${this.uri}
      imageSrc=${T(h.getWalletImage(this.wallet))}
      color=${T(v.state.themeVariables["--w3m-qr-color"])}
      alt=${T(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){const t=!this.uri||!this.ready;return r`<wui-link
      .disabled=${t}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};xi.styles=yi,xi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([E("w3m-connecting-wc-qrcode")],xi);let $i=class extends o{constructor(){if(super(),this.wallet=u.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");c.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return r`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${T(h.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};$i=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([E("w3m-connecting-wc-unsupported")],$i);var Ci=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ki=class extends _t{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=$.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(p.subscribeKey("wcUri",()=>{this.updateLoadingState()})),c.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;const{webapp_link:t,name:e}=this.wallet,{redirect:i,href:o}=l.formatUniversalUrl(t,this.uri);p.setWcLinking({name:e,href:o}),p.setRecentWallet(this.wallet),l.openHref(i,"_blank")}catch{this.error=!0}}};Ci([P()],ki.prototype,"isLoading",void 0),ki=Ci([E("w3m-connecting-wc-web")],ki);var Ri=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Ii=class extends o{constructor(){super(),this.wallet=u.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=Boolean(s.state.siwx),this.remoteFeatures=s.state.remoteFeatures,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(s.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return r`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?r`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(t=!1){if("browser"!==this.platform&&(!s.state.manualWCControl||t))try{const{wcPairingExpiry:e,status:i}=p.state;(t||s.state.enableEmbedded||l.isPairingExpired(e)||"connecting"===i)&&(await p.connectWalletConnect(),this.isSiwxEnabled||x.close())}catch(e){c.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),p.setWcError(!0),y.showError(e.message??"Connection error"),p.resetWcConnection(),u.goBack()}}determinePlatforms(){if(!this.wallet)return this.platforms.push("qrcode"),void(this.platform="qrcode");if(this.platform)return;const{mobile_link:t,desktop_link:e,webapp_link:i,injected:o,rdns:r}=this.wallet,n=o?.map(({injected_id:t})=>t).filter(Boolean),a=[...r?[r]:n??[]],c=!s.state.isUniversalProvider&&a.length,u=t,d=i,h=p.checkInstalled(a),g=c&&h,w=e&&!l.isMobile();g&&!b.state.noAdapters&&this.platforms.push("browser"),u&&this.platforms.push(l.isMobile()?"mobile":"qrcode"),d&&this.platforms.push("web"),w&&this.platforms.push("desktop"),g||!c||b.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return r`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return r`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return r`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return r`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return r`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return r`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?r`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(t){const e=this.shadowRoot?.querySelector("div");e&&(await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};Ri([P()],Ii.prototype,"platform",void 0),Ri([P()],Ii.prototype,"platforms",void 0),Ri([P()],Ii.prototype,"isSiwxEnabled",void 0),Ri([P()],Ii.prototype,"remoteFeatures",void 0),Ii=Ri([E("w3m-connecting-wc-view")],Ii);var Ei=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Ti=class extends o{constructor(){super(...arguments),this.isMobile=l.isMobile()}render(){if(this.isMobile){const{featured:t,recommended:e}=a.state,{customWallets:i}=s.state,o=g.getRecentWallets(),n=t.length||e.length||i?.length||o.length;return r`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${n?r`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return r`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};Ei([P()],Ti.prototype,"isMobile",void 0),Ti=Ei([E("w3m-connecting-wc-basic-view")],Ti);const Pi=()=>new Si;class Si{}const ji=new WeakMap,Oi=j(class extends O{render(t){return k}update(t,[e]){const i=e!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),k}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const e=this.ht??globalThis;let i=ji.get(e);void 0===i&&(i=new WeakMap,ji.set(e,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?ji.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Li=t`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`;var zi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Ai=class extends o{constructor(){super(...arguments),this.inputElementRef=Pi(),this.checked=void 0}render(){return r`
      <label>
        <input
          ${Oi(this.inputElementRef)}
          type="checkbox"
          ?checked=${T(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};Ai.styles=[i,e,R,Li],zi([I({type:Boolean})],Ai.prototype,"checked",void 0),Ai=zi([E("wui-switch")],Ai);const Bi=t`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var Wi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Di=class extends o{constructor(){super(...arguments),this.checked=void 0}render(){return r`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${T(this.checked)}></wui-switch>
      </button>
    `}};Di.styles=[i,e,Bi],Wi([I({type:Boolean})],Di.prototype,"checked",void 0),Di=Wi([E("wui-certified-switch")],Di);const Ni=t`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`;var Mi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Ui=class extends o{constructor(){super(...arguments),this.icon="copy"}render(){return r`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};Ui.styles=[i,e,Ni],Mi([I()],Ui.prototype,"icon",void 0),Ui=Mi([E("wui-input-element")],Ui);const _i=t`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md,
  wui-loading-spinner + .wui-size-md {
    padding: 10.5px var(--wui-spacing-3xl) 10.5px var(--wui-spacing-3xl);
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-lg {
    padding: var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-l);
    letter-spacing: var(--wui-letter-spacing-medium-title);
    font-size: var(--wui-font-size-medium-title);
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    color: var(--wui-color-fg-100);
    height: 64px;
  }

  .wui-padding-right-xs {
    padding-right: var(--wui-spacing-xs);
  }

  .wui-padding-right-s {
    padding-right: var(--wui-spacing-s);
  }

  .wui-padding-right-m {
    padding-right: var(--wui-spacing-m);
  }

  .wui-padding-right-l {
    padding-right: var(--wui-spacing-l);
  }

  .wui-padding-right-xl {
    padding-right: var(--wui-spacing-xl);
  }

  .wui-padding-right-2xl {
    padding-right: var(--wui-spacing-2xl);
  }

  .wui-padding-right-3xl {
    padding-right: var(--wui-spacing-3xl);
  }

  .wui-padding-right-4xl {
    padding-right: var(--wui-spacing-4xl);
  }

  .wui-padding-right-5xl {
    padding-right: var(--wui-spacing-5xl);
  }

  wui-icon + .wui-size-lg,
  wui-loading-spinner + .wui-size-lg {
    padding-left: 50px;
  }

  wui-icon[data-input='lg'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-m) 17.25px var(--wui-spacing-m);
  }
  wui-icon + .wui-size-mdl,
  wui-loading-spinner + .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-3xl) 17.25px 40px;
  }
  wui-icon[data-input='mdl'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`;var qi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Ki=class extends o{constructor(){super(...arguments),this.inputElementRef=Pi(),this.size="md",this.disabled=!1,this.placeholder="",this.type="text",this.value=""}render(){const t=`wui-padding-right-${this.inputRightPadding}`,e=`wui-size-${this.size}`,i={[e]:!0,[t]:Boolean(this.inputRightPadding)};return r`${this.templateIcon()}
      <input
        data-testid="wui-input-text"
        ${Oi(this.inputElementRef)}
        class=${L(i)}
        type=${this.type}
        enterkeyhint=${T(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
        .value=${this.value||""}
        tabindex=${T(this.tabIdx)}
      />
      <slot></slot>`}templateIcon(){return this.icon?r`<wui-icon
        data-input=${this.size}
        size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};Ki.styles=[i,e,_i],qi([I()],Ki.prototype,"size",void 0),qi([I()],Ki.prototype,"icon",void 0),qi([I({type:Boolean})],Ki.prototype,"disabled",void 0),qi([I()],Ki.prototype,"placeholder",void 0),qi([I()],Ki.prototype,"type",void 0),qi([I()],Ki.prototype,"keyHint",void 0),qi([I()],Ki.prototype,"value",void 0),qi([I()],Ki.prototype,"inputRightPadding",void 0),qi([I()],Ki.prototype,"tabIdx",void 0),Ki=qi([E("wui-input-text")],Ki);const Hi=t`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;let Vi=class extends o{constructor(){super(...arguments),this.inputComponentRef=Pi()}render(){return r`
      <wui-input-text
        ${Oi(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){const t=this.inputComponentRef.value,e=t?.inputElementRef.value;e&&(e.value="",e.focus(),e.dispatchEvent(new Event("input")))}};Vi.styles=[i,Hi],Vi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([E("wui-search-bar")],Vi);const Fi=C`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`,Yi=t`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var Gi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Ji=class extends o{constructor(){super(...arguments),this.type="wallet"}render(){return r`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?r` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${Fi}`:r`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};Ji.styles=[i,e,Yi],Gi([I()],Ji.prototype,"type",void 0),Ji=Gi([E("wui-card-select-loader")],Ji);const Xi=t`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var Qi=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let Zi=class extends o{render(){return this.style.cssText=`\n      grid-template-rows: ${this.gridTemplateRows};\n      grid-template-columns: ${this.gridTemplateColumns};\n      justify-items: ${this.justifyItems};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      align-content: ${this.alignContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&S.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&S.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&S.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&S.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&S.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&S.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&S.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&S.getSpacingStyles(this.margin,3)};\n    `,r`<slot></slot>`}};Zi.styles=[i,Xi],Qi([I()],Zi.prototype,"gridTemplateRows",void 0),Qi([I()],Zi.prototype,"gridTemplateColumns",void 0),Qi([I()],Zi.prototype,"justifyItems",void 0),Qi([I()],Zi.prototype,"alignItems",void 0),Qi([I()],Zi.prototype,"justifyContent",void 0),Qi([I()],Zi.prototype,"alignContent",void 0),Qi([I()],Zi.prototype,"columnGap",void 0),Qi([I()],Zi.prototype,"rowGap",void 0),Qi([I()],Zi.prototype,"gap",void 0),Qi([I()],Zi.prototype,"padding",void 0),Qi([I()],Zi.prototype,"margin",void 0),Zi=Qi([E("wui-grid")],Zi);const to=t`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var eo=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let io=class extends o{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){const t="certified"===this.wallet?.badge_type;return r`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${T(t?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${t?r`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():r`
      <wui-wallet-image
        size="md"
        imageSrc=${T(this.imageSrc)}
        name=${this.wallet?.name}
        .installed=${this.wallet?.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return r`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=h.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await h.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};io.styles=to,eo([P()],io.prototype,"visible",void 0),eo([P()],io.prototype,"imageSrc",void 0),eo([P()],io.prototype,"imageLoading",void 0),eo([I()],io.prototype,"wallet",void 0),io=eo([E("w3m-all-wallets-list-item")],io);const oo=t`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var ro=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};const no="local-paginator";let ao=class extends o{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!a.state.wallets.length,this.wallets=a.state.wallets,this.recommended=a.state.recommended,this.featured=a.state.featured,this.filteredWallets=a.state.filteredWallets,this.unsubscribe.push(a.subscribeKey("wallets",t=>this.wallets=t),a.subscribeKey("recommended",t=>this.recommended=t),a.subscribeKey("featured",t=>this.featured=t),a.subscribeKey("filteredWallets",t=>this.filteredWallets=t))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.paginationObserver?.disconnect()}render(){return r`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;const t=this.shadowRoot?.querySelector("wui-grid");t&&(await a.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(t,e){return[...Array(t)].map(()=>r`
        <wui-card-select-loader type="wallet" id=${T(e)}></wui-card-select-loader>
      `)}walletsTemplate(){const t=this.filteredWallets?.length>0?l.uniqueBy([...this.featured,...this.recommended,...this.filteredWallets],"id"):l.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id");return f.markWalletsAsInstalled(t).map(t=>r`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(t)}
          .wallet=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){const{wallets:t,recommended:e,featured:i,count:o}=a.state,r=window.innerWidth<352?3:4,n=t.length+e.length;let s=Math.ceil(n/r)*r-n+r;return s-=t.length?i.length%r:0,0===o&&i.length>0?null:0===o||[...i,...t,...e].length<o?this.shimmerTemplate(s,no):null}createPaginationObserver(){const t=this.shadowRoot?.querySelector(`#${no}`);t&&(this.paginationObserver=new IntersectionObserver(([t])=>{if(t?.isIntersecting&&!this.loading){const{page:t,count:e,wallets:i}=a.state;i.length<e&&a.fetchWalletsByPage({page:t+1})}}),this.paginationObserver.observe(t))}onConnectWallet(t){n.selectWalletConnector(t)}};ao.styles=oo,ro([P()],ao.prototype,"loading",void 0),ro([P()],ao.prototype,"wallets",void 0),ro([P()],ao.prototype,"recommended",void 0),ro([P()],ao.prototype,"featured",void 0),ro([P()],ao.prototype,"filteredWallets",void 0),ao=ro([E("w3m-all-wallets-list")],ao);const so=t`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var lo=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let co=class extends o{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?r`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){this.query.trim()===this.prevQuery.trim()&&this.badge===this.prevBadge||(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await a.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:t}=a.state,e=f.markWalletsAsInstalled(t);return t.length?r`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${e.map(t=>r`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(t)}
              .wallet=${t}
              data-testid="wallet-search-item-${t.id}"
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:r`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(t){n.selectWalletConnector(t)}};co.styles=so,lo([P()],co.prototype,"loading",void 0),lo([I()],co.prototype,"query",void 0),lo([I()],co.prototype,"badge",void 0),co=lo([E("w3m-all-wallets-search")],co);var uo=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ho=class extends o{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=l.debounce(t=>{this.search=t})}render(){const t=this.search.length>=2;return r`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?r`<w3m-all-wallets-search
            query=${this.search}
            badge=${T(this.badge)}
          ></w3m-all-wallets-search>`:r`<w3m-all-wallets-list badge=${T(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onClick(){"certified"!==this.badge?(this.badge="certified",y.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return l.isMobile()?r`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){u.push("ConnectingWalletConnect")}};uo([P()],ho.prototype,"search",void 0),uo([P()],ho.prototype,"badge",void 0),ho=uo([E("w3m-all-wallets-view")],ho);const po=t`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var go=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let wo=class extends o{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return r`
      <button
        ?disabled=${!!this.loading||Boolean(this.disabled)}
        data-loading=${this.loading}
        data-iconvariant=${T(this.iconVariant)}
        tabindex=${T(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if("image"===this.variant&&this.imageSrc)return r`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if("square"===this.iconVariant&&this.icon&&"icon"===this.variant)return r`<wui-icon name=${this.icon}></wui-icon>`;if("icon"===this.variant&&this.icon&&this.iconVariant){const t=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",e="square-blue"===this.iconVariant?"mdl":"md",i=this.iconSize?this.iconSize:e;return r`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${i}
          background="transparent"
          iconColor=${t}
          backgroundColor=${t}
          size=${e}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?r`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:r``}chevronTemplate(){return this.chevron?r`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};wo.styles=[i,e,po],go([I()],wo.prototype,"icon",void 0),go([I()],wo.prototype,"iconSize",void 0),go([I()],wo.prototype,"tabIdx",void 0),go([I()],wo.prototype,"variant",void 0),go([I()],wo.prototype,"iconVariant",void 0),go([I({type:Boolean})],wo.prototype,"disabled",void 0),go([I()],wo.prototype,"imageSrc",void 0),go([I()],wo.prototype,"alt",void 0),go([I({type:Boolean})],wo.prototype,"chevron",void 0),go([I({type:Boolean})],wo.prototype,"loading",void 0),wo=go([E("wui-list-item")],wo);let fo=class extends o{constructor(){super(...arguments),this.wallet=u.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return r`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?r`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?r`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?r`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?r`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&l.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&l.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&l.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&l.openHref(this.wallet.homepage,"_blank")}};fo=function(t,e,i,o){var r,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(n<3?r(a):n>3?r(e,i,a):r(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([E("w3m-downloads-view")],fo);export{ho as W3mAllWalletsView,Ti as W3mConnectingWcBasicView,fo as W3mDownloadsView};
