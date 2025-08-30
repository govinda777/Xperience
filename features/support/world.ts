import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';

export interface CustomWorld extends World {
  // Authentication state
  authState: {
    isAuthenticated: boolean;
    user: any;
    error: string | null;
  };
  
  // Payment state
  paymentState: {
    selectedPlan: any;
    selectedMethod: string | null;
    paymentData: any;
    status: string;
  };
  
  // Wallet state
  walletState: {
    address: string | null;
    balance: string;
    transactions: any[];
  };
  
  // UI state
  uiState: {
    currentPage: string;
    isLoading: boolean;
    error: string | null;
    formData: any;
  };
  
  // Test data
  credentials: {
    email: string;
    password: string;
  } | null;
  
  // Helper methods
  resetState(): void;
  setAuthenticatedUser(user: any): void;
  setError(error: string): void;
}

export class XperienceWorld extends World implements CustomWorld {
  authState = {
    isAuthenticated: false,
    user: null,
    error: null,
  };
  
  paymentState = {
    selectedPlan: null,
    selectedMethod: null,
    paymentData: null,
    status: 'idle',
  };
  
  walletState = {
    address: null,
    balance: '0',
    transactions: [],
  };
  
  uiState = {
    currentPage: 'home',
    isLoading: false,
    error: null,
    formData: null,
  };
  
  credentials = null;
  
  constructor(options: IWorldOptions) {
    super(options);
  }
  
  resetState(): void {
    this.authState = {
      isAuthenticated: false,
      user: null,
      error: null,
    };
    
    this.paymentState = {
      selectedPlan: null,
      selectedMethod: null,
      paymentData: null,
      status: 'idle',
    };
    
    this.walletState = {
      address: null,
      balance: '0',
      transactions: [],
    };
    
    this.uiState = {
      currentPage: 'home',
      isLoading: false,
      error: null,
      formData: null,
    };
    
    this.credentials = null;
  }
  
  setAuthenticatedUser(user: any): void {
    this.authState.isAuthenticated = true;
    this.authState.user = user;
    this.authState.error = null;
  }
  
  setError(error: string): void {
    this.uiState.error = error;
  }
}

setWorldConstructor(XperienceWorld);