const fs = require('fs');

function distanceBetweenLocationLists() {
    let list1 = [], list2 = [];

    const input = fs.readFileSync('day1.input', 'utf8');

    const lines = input.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const lineValues = lines[i].split('   ');
        list1.push(parseInt(lineValues[0]));
        list2.push(parseInt(lineValues[1]));
    }

    const list1Sorted = list1.sort((a, b) => a - b);
    const list2Sorted = list2.sort((a, b) => a - b);

    let totalDistance = 0;
    for (let i = 0; i < list1Sorted.length; i++) {
        const distance = Math.abs(list2Sorted[i] - list1Sorted[i]);
        totalDistance += distance;
    }

    console.log('totalDistance', totalDistance);
}

// distanceBetweenLocationLists();

function similarityScore() {
    let list1 = [], list2 = [];

    const input = fs.readFileSync('day1.input', 'utf8');

    const lines = input.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const lineValues = lines[i].split('   ');
        list1.push(parseInt(lineValues[0]));
        list2.push(parseInt(lineValues[1]));
    }

    const list1Sorted = list1.sort((a, b) => a - b);
    const list2Sorted = list2.sort((a, b) => a - b);


    let totalSimilarityScore = 0;
    for (let i = 0; i < list1Sorted.length; i++) {
        const occurancesInList2 = list2Sorted.filter(value => value === list1Sorted[i]).length;
        const similarityScore = list1Sorted[i] * occurancesInList2;
        
        totalSimilarityScore += similarityScore;
    }

    console.log('totalSimilarityScore', totalSimilarityScore);
}

similarityScore();