const fs = require('fs')
const input = fs.readFileSync('day11.input', 'utf8')

function getSplit(value) {
    value = value.toString()
    const firstHalf = value.slice(0, value.length / 2)
    const lastHalf = value.slice(value.length / 2)

    return [
        Number(firstHalf),
        Number(lastHalf)
    ]
}

function part1() {
    const numBlinks = 25
    let rocks = input.split(' ').map(Number)

    for (let i = 0; i < numBlinks; i++) {
        rocks = rocks.map(r => {
            if (String(r).length % 2 === 0) {
                return getSplit(r)
            }

            if (r === 0) {
                return 1
            }

            return r * 2024
        }).flat()
    }

    console.log(rocks.length)
}

function setMap(key, numTimes, map) {
    if (map.has(key)) {
        map.set(key, map.get(key) + numTimes)
        return
    }
    map.set(key, numTimes)
}

function part2() {
    const numBlinks = 75
    const rocks = input.split(' ').map(Number)

    let rockMap = new Map()
    rocks.forEach(r => {
        rockMap.set(r, 1)
    })

    for (let i = 0; i < numBlinks; i++) {
        const newRockMap = new Map()
        Array.from(rockMap.keys()).forEach(rock => {
            const numberOfTimes = rockMap.get(rock)
            if (String(rock).length % 2 === 0) {
                const [first, second] = getSplit(rock)
                setMap(first, numberOfTimes, newRockMap)
                setMap(second, numberOfTimes, newRockMap)
            } else if (rock === 0) {
                setMap(1, numberOfTimes, newRockMap)
            } else {
                setMap(rock * 2024, numberOfTimes, newRockMap)
            }
        })

        rockMap = newRockMap
    }

    const total = Array.from(rockMap.values()).reduce((acc, curr) => acc + curr)
    console.log(total)
}

part2()