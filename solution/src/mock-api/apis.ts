/**
 * do not change the implementation
 */
export const isNameValid = (name: string) => new Promise<boolean>((resolve) => {
    setTimeout(() => {
        // changed for more clarity
        resolve(name !== 'alex' && name !== 'mila' );
    }, Math.random() * 2000);
});

/**
 * do not change the implementation
 */
export const getLocations = () => Promise.resolve(['Canada', 'China', 'USA', 'Brazil']);