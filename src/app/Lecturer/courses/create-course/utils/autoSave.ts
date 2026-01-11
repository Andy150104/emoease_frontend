const AUTO_SAVE_KEY = 'course_creation_draft';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

export interface AutoSaveData {
    timestamp: string;
    version: string;
    formStep: string;
    [key: string]: unknown;
}

export const saveToLocalStorage = (formData: Record<string, unknown>, step: string): void => {
    try {
        const filteredData = Object.entries(formData).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, unknown>);

        const dataToSave: AutoSaveData = {
            ...filteredData,
            timestamp: new Date().toISOString(),
            version: '1.0',
            formStep: step,
        };

        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

export const loadFromLocalStorage = (): Record<string, unknown> | null => {
    try {
        const savedData = localStorage.getItem(AUTO_SAVE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { timestamp, version, formStep, ...formData } = parsedData;
            return formData;
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
    return null;
};

export const clearLocalStorage = (): void => {
    try {
        localStorage.removeItem(AUTO_SAVE_KEY);
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
};

export const getLastSavedTime = (): Date | null => {
    try {
        const savedData = localStorage.getItem(AUTO_SAVE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            return new Date(parsedData.timestamp);
        }
    } catch (error) {
        console.error('Failed to get last saved time:', error);
    }
    return null;
};

export const createDebouncedSave = (callback: (data: Record<string, unknown>, step: string) => void) => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (formData: Record<string, unknown>, step: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            callback(formData, step);
        }, AUTO_SAVE_DELAY);
    };
};
