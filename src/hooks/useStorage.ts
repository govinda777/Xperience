import { useState, useEffect } from 'react';

type StorageType = 'session' | 'local';

export function useStorage<T>(key: string, initialValue: T, storageType: StorageType = 'session'): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const storage = storageType === 'session' ? window.sessionStorage : window.localStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from ${storageType}Storage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const storage = storageType === 'session' ? window.sessionStorage : window.localStorage;
      storage.setItem(key, JSON.stringify(valueToStore));

      // Dispatch a custom event so other components can sync if needed
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error(`Error writing to ${storageType}Storage:`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Handle changes from other tabs (localStorage) or standard storage events
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    const handleCustomStorageChange = () => {
        try {
            const storage = storageType === 'session' ? window.sessionStorage : window.localStorage;
            const item = storage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch(error) {
            console.error(`Error syncing from custom event for ${storageType}Storage:`, error);
        }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageChange);
    };
  }, [key, storageType]);

  return [storedValue, setValue];
}
