const fs = require('fs');

function sumOfMultiplications() {
    const input = fs.readFileSync('2024/day3.input', 'utf8');

    const sumRegex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;

    const sums = input.match(sumRegex);

    let totalSum = 0;
    sums.forEach(sum => {
        const values = sum.match(/[0-9]{1,3}/g);

        const result = parseInt(values[0]) * parseInt(values[1]);
        totalSum += result;
    });

    console.log("totalSum", totalSum);
}

// sumOfMultiplications();

function sumOfMultiplicationsWithConditions() {
    let input = fs.readFileSync('2024/day3.input', 'utf8');

    const sumRegex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;
    const betweenDoAndDontRegex = /do\(\)(.+?)don't\(\)/g;

    const inputWithStartAndEndTokens = "do()" + input + "don't()";

    const sumsToDo = inputWithStartAndEndTokens.match(betweenDoAndDontRegex);

    let newInput = ''

    sumsToDo.forEach(match => {
        newInput += match
    })

    const sums = newInput.match(sumRegex);

    let totalSum = 0;
    sums.forEach(sum => {
        const values = sum.match(/[0-9]{1,3}/g);

        const result = parseInt(values[0]) * parseInt(values[1]);
        totalSum += result;
    });

    console.log("totalSumWithConditions", totalSum);
}

sumOfMultiplicationsWithConditions();