// src/types/telegram-webapp.d.ts
interface TelegramWebApp {
    ready: () => void;
    MainButton: {
      setText: (text: string) => void;
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
    };
  }
  
  declare global {
    interface Window {
      Telegram: {
        WebApp: TelegramWebApp;
      };
    }
  }
  
  export {};