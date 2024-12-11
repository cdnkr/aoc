const fs = require('fs');

function getCorrectOrder(list, rules) {
    return list.sort((a, b) => {
        if (rules.some(([first, second]) => first === a && second === b)) return -1

        if (rules.some(([first, second]) => first === b && second === a)) return 1

        return 0
    })
}

function isOrderValid(list, rules) {
    const isCorrect = rules.every(([first, second]) => 
        !(list.includes(first) && list.includes(second)) || 
        (list.indexOf(first) < list.indexOf(second))
    )

    return isCorrect
}

function main() {
    const input = fs.readFileSync('day5.input', 'utf8').trim();

    const lines = input.split('\n').filter(line => line.trim() !== '');
    const rules = lines.filter(line => line.includes('|')).map(line => line.split('|').map(Number));
    const lists = lines.filter(line => !line.includes('|')).map(line => line.split(',').map(Number));

    let centerValueSum = 0;
    let incorrectlyOrderedLists = [];

    for (const list of lists) {
        let isListInCorrectOrder = isOrderValid(list, rules);
        if (isListInCorrectOrder) {
            centerValueSum += list[Math.floor(list.length / 2)]
        } else {
            incorrectlyOrderedLists.push(list);
        }
    }

    console.log("PART_1:", centerValueSum);

    let centerValueSum_2 = 0;
    for (const list of incorrectlyOrderedLists) {
        let reordered = getCorrectOrder(list, rules);
        const newCenterValue = reordered[Math.floor(reordered.length / 2)];
        centerValueSum_2 += newCenterValue;
    }

    console.log("PART_2:", centerValueSum_2);
}

main()