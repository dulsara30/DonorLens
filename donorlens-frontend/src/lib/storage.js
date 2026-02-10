//safe wrappers for localStorage and sessionStorage. These will handle JSON parsing/stringifying and also provide a consistent API for the rest of the app to use. This will also allow us to easily switch to a different storage mechanism in the future if needed (e.g. IndexedDB, AsyncStorage, etc.) without having to change the rest of the app.

export const localStorageWrapper = {
    setItem: (key, value) => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    getItem: (key) => {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

export const sessionStorageWrapper = {
    setItem: (key, value) => {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
        }
    },
    getItem: (key) => {
        try {
            const serializedValue = sessionStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return null;
        }
    },
    removeItem: (key) => {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
        }
    },
    clear: () => {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Error clearing sessionStorage:', error);
        }
    }
};