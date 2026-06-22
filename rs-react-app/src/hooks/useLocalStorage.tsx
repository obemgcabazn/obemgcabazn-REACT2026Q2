import { useState, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (newValue: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch (e) {
        console.error('localStorage write error', e);
      }
    },
    [key]
  );

  return [value, set] as const;
}

export default useLocalStorage;
