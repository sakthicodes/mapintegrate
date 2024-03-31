
// function isNumeric(value) {
//     return /^-?\d+$/.test(value);
// }
function isNumeric(value) {
    return /^-?\d+(\.\d+)*$/.test(value);
}

function checkDotNumbernAlpaOptional(input) {
    const pattern = /^[a-zA-Z0-9.]*$/;
    return pattern.test(input);
}

function extractItemNumber(str) {
    var match = str.match(/^\d+\.\d+\.\d+/);
    if (match && !match == str) {
        match.push() = str.match(/^\d+\.\d+/);
        return match[0, 1];
    } else if (match && match == str) {
        var match1 = str.match(/^\d+\.\d+/);
        return match1[0];
    }
    else {
        return null;
    }
}

function extractNumbersFromString(inputString) {
    const regex = /\d+/g; // This regex will match one or more digits (\d+)
    const numbersArray = inputString.match(regex);
    return numbersArray ? numbersArray.map(Number) : [];
}

function extractWordAndNumberInQuotes(str) {
    const regex = /"([^"]+)"|(\b\d+(\.\d+)?\b)/g;
    const matches = str.match(regex);
    if (!matches) {
        return { word: null, number: null };
    }
    let word = null;
    let number = null;
    matches.forEach(match => {
        if (match.charAt(0) === '"' && match.charAt(match.length - 1) === '"') {
            word = match.slice(1, -1);
        } else if (!isNaN(parseFloat(match))) {
            number = parseFloat(match);
        }
    });

    return { word, number };
}

function getNumberFromString(str) {
    const numberPattern = /\d+/;
    const result = str.match(numberPattern);
    return result ? parseInt(result[0], 10) : null;
}

function getCapitalAlphabetAfter(alphabet, number) {
    if (/^[A-Z]$/.test(alphabet)) {
        const startCharCode = 'A'.charCodeAt(0);
        const givenCharCode = alphabet.charCodeAt(0);
        const position = givenCharCode - startCharCode;
        const newPosition = (position + number) % 26;
        const newCharCode = startCharCode + newPosition;
        const newAlphabet = String.fromCharCode(newCharCode);
        return newAlphabet;
    } else {
        throw new Error('Invalid input. Please provide a single capital alphabet.');
    }
}

function isIntegerNumber(number) {
    return !number.includes('.') && Number.isInteger(Number(number));
}