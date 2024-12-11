const fs = require('fs')

const input = fs.readFileSync('day7.input', 'utf8')

const OPERATORS = ['+', '*', '&']

function getUniqueCombinations(numbers) {
    const eq = []

    let i = 0;
    for (const number of numbers) {
        eq.push(number)
        if (i !== numbers.length - 1) {
            eq.push('')
        }
        i++
    }

    const lenBlank = eq.filter(item => item === '').length
    const combinations = generateCombinations(lenBlank, eq);

    return combinations
}

function generateCombinations(depth, numbers, current = [], results = []) {
    if (depth === 0) {
        let addition = [...numbers]
        let opIn = 0
        for (let i = 0; i < numbers.length; i++) {
            if (i % 2 !== 0) {
                addition[i] = current[opIn]
                opIn++
            } else {
                addition[i] = numbers[i]
            }
        }

        // results.push(current);
        results.push(addition.join(','));
        return;
    }

    for (let i = 0; i < OPERATORS.length; i++) {
        generateCombinations(depth - 1, numbers, [...current, OPERATORS[i]], results);
    }

    return results;
}

function evaluate(exp) {
    const arr = exp.split(',');
    
    const res = arr.reduce((acc = Number(numbers[0]), curr, i) => {
        if (OPERATORS.includes(curr)) return Number(acc);
        return (arr[i - 1] === '&') ?
            Number(String(acc) + String(curr)) :
            (arr[i - 1] === '+') ? 
            (Number(acc) + Number(curr)) : 
            (arr[i - 1] === '*') ? 
            (Number(acc) * Number(curr)) : 
            Number(acc)
    })

    return res
}

function main() {
    const parsed = input.replace(/\r/g, '').split('\n').map(line => {
        const values = line.split(':')

        const answer = Number(values[0])
        const numbers = values[1].trim().split(' ').map(v => Number(v))

        return {
            answer,
            numbers
        }
    })

    let correct = []

    for (let item of parsed) {
        const { answer, numbers } = item

        const uniqueCombinations = getUniqueCombinations(numbers)

        for (const u of uniqueCombinations) {
            if (evaluate(u) === answer) {
                correct.push(answer)
                break
            }
        }
    }

    console.log(correct.reduce((acc, curr) => acc + curr))
}

main()



