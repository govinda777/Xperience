declare module "@privy-io/react-auth" {
  export interface PrivyClientConfig {
    appId: string;
    [key: string]: any;
  }

  export interface PrivyProviderProps {
    appId: string;
    children: React.ReactNode;
    config?: Partial<PrivyClientConfig>;
  }

  export interface User {
    id: string;
    email: {
      address: string;
      verified: boolean;
    } | null;
    wallet: {
      address: string;
      chainId: number;
    } | null;
    [key: string]: any;
  }

  export interface PrivyContext {
    ready: boolean;
    authenticated: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    connectWallet: () => Promise<void>;
    [key: string]: any;
  }

  export function usePrivy(): PrivyContext;
  export function PrivyProvider(props: PrivyProviderProps): JSX.Element;
}
