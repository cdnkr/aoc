const fs = require('fs');

function safeLevelCount() {
    const input = fs.readFileSync('day2.input', 'utf8');

    const lines = input.split('\n').map(line => line.replace('\r', ''));

    let safeCount = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineValues = line.split(' ').map(value => parseInt(value));
        const isSafe = getIsSafe(lineValues);

        if (isSafe) {
            safeCount++;
            console.log('Safe Level:', isSafe);
        } else {
            const isSafeByRemovingOneOfTheValues = getIsSafeByRemovingOneOfTheValues(lineValues);
            if (isSafeByRemovingOneOfTheValues) {
                safeCount++;
                console.log('Safe Level by removing one of the values:', isSafeByRemovingOneOfTheValues);
            } else {
                console.log('Unsafe Level:', isSafeByRemovingOneOfTheValues);
            }
        }
    }

    console.log('safeCount', safeCount);
}

safeLevelCount();

function getIsSafe(lineValues) {
    return increasingOrDecreasingCheck(lineValues) && adjacentValuesSafeDifferenceCheck(lineValues);
}

function isIncreasing(lineValues) {
    return lineValues.every((value, index) => index === 0 || value > lineValues[index - 1]);
}

function isDecreasing(lineValues) {
    return lineValues.every((value, index) => index === 0 || value < lineValues[index - 1]);
}

function increasingOrDecreasingCheck(lineValues) {
    return isIncreasing(lineValues) || isDecreasing(lineValues);
}

function adjacentValuesSafeDifferenceCheck(lineValues) {
    const moreThan1 = lineValues.every((value, index) => index === 0 || Math.abs(value - lineValues[index - 1]) >= 1);
    const noMoreThan3 = lineValues.every((value, index) => index === 0 || Math.abs(value - lineValues[index - 1]) <= 3);

    return moreThan1 && noMoreThan3;
}

function getIsSafeByRemovingOneOfTheValues(lineValues) {
    for (let i = 0; i < lineValues.length; i++) {
        const tryForSafeWithoutValue = lineValues.filter((_, index) => index !== i);
        const isSafeWithoutValue = getIsSafe(tryForSafeWithoutValue);
        if (isSafeWithoutValue) {
            return true;
        }
    }

    return false;
}