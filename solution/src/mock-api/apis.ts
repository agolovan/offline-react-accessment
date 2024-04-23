/**
 * do not change the implementation
 */
export const isNameValid = (name: string) => new Promise<boolean>((resolve) => {
    setTimeout(() => {
        resolve(name !== 'invalid name');
    }, Math.random() * 2000);
});

/**
 * do not change the implementation
 */
export const getLocations = () => Promise.resolve(['Canada', 'China', 'USA', 'Brazil']);