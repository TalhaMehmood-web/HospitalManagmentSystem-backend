const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    if (length < 5) {
        throw new Error('Length must be at least 5');
    }

    const result = [];

    // Ensure at least 2 capital letters
    result.push(characters.charAt(Math.floor(Math.random() * 26)).toUpperCase());
    result.push(characters.charAt(Math.floor(Math.random() * 26)).toUpperCase());

    // Ensure at least 1 small letter
    result.push(characters.charAt(Math.floor(Math.random() * 26)));

    // Calculate the remaining length after fixing the capital and small letters
    const remainingLength = length - 3;

    if (remainingLength > 0) {
        // Calculate the proportion of numbers
        const numCount = Math.floor(remainingLength / 2);

        // Ensure at least 2 numbers
        for (let i = 0; i < numCount; i++) {
            result.push(numbers.charAt(Math.floor(Math.random() * 10)));
        }

        // Fill the remaining positions with small letters
        for (let i = 0; i < remainingLength - numCount; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * 26)));
        }
    }

    // Shuffle the result array
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join('');
}

export default generateRandomString;
