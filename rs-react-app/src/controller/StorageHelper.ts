const StorageHelper = {
  set<T>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (e) {
      console.error('Error on save data in localStorage', e);
      return false;
    }
  },

  get<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      if (!serializedValue) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (e) {
      console.error('Error on get data in localStorage', e);
      return null;
    }
  },
};

export default StorageHelper;
