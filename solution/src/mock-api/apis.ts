/**
 * do not change the implementation
 */
// I'm uncertain about how to utilize this. According to the guidelines, the Name input should be validated as the user types. 
// Presently, data is loaded into the Entries state, so we can validate based on that data. 
// When a user types quickly, we need to validate quickly as well, and since we already have all the data in memory, 
// it's unclear what could be a purpose of incorporating asynchronous operations into this process.
export const isNameValid = (name: string) => new Promise<boolean>((resolve) => {
    setTimeout(() => {
        resolve(name !== 'invalid name');
    }, Math.random() * 2000);
});

/**
 * do not change the implementation
 */
export const getLocations = () => Promise.resolve(['Canada', 'China', 'USA', 'Brazil']);