const fs = require('fs')

const DEBUG = false

const input = fs.readFileSync(DEBUG ? 'day14.test.input' : 'day14.input', 'utf8')
const GRID_WIDTH = DEBUG ? 11 : 101
const GRID_HEIGHT = DEBUG ? 7 : 103
const SECONDS = 100

function constructGrid(robots) {
    let grid = []
    for (let y = 0; y < GRID_HEIGHT; y++) {
        let row = []
        for (let x = 0; x < GRID_WIDTH; x++) {
            let char = '.'
            const robotOnPos = robots.filter(r => r.p.x === x && r.p.y === y)

            if (robotOnPos?.length) {
                char = robotOnPos.length
            }
            row.push(char)
        }
        grid.push(row)
    }

    return {
        grid,
        gridVisualization: grid.map(row => row.join('')).join('\n')
    }
}

function moveRobots(robots) {
    return robots.map(r => {
        let minX = 0
        let maxX = GRID_WIDTH - 1
        let minY = 0
        let maxY = GRID_HEIGHT - 1

        let initialX = r.p.x
        let initialY = r.p.y

        let newX = initialX + r.v.x
        let newY = initialY + r.v.y

        if (newY > maxY) {
            newY = minY + (newY - maxY - 1)
        }

        if (newY < minY) {
            newY = maxY - (minY - newY - 1)
        }

        if (newX > maxX) {
            newX = minX + (newX - maxX - 1)
        }

        if (newX < minX) {
            newX = maxX - (minX - newX - 1)
        }

        return {
            ...r,
            p: {
                x: newX,
                y: newY
            }
        }
    })
}

function getBotsPerQuadrant(robots) {
    const quadrantHeight = GRID_HEIGHT / 2
    const quadrantWidth = GRID_WIDTH / 2

    let q1 = createQuadrant(0, quadrantWidth, 0, quadrantHeight)
    let q2 = createQuadrant(quadrantWidth, GRID_WIDTH, 0, quadrantHeight)
    let q3 = createQuadrant(0, quadrantWidth, quadrantHeight, GRID_HEIGHT)
    let q4 = createQuadrant(quadrantWidth, GRID_WIDTH, quadrantHeight, GRID_HEIGHT)

    const quadrants = [q1, q2, q3, q4]

    for (const robot of robots) {
        // skip if bot is in middle row/col
        if (robot.p.x === (Math.round(GRID_WIDTH / 2) - 1) || robot.p.y === (Math.round(GRID_HEIGHT / 2) - 1)) continue

        for (let quadrant of quadrants) {
            if (
                robot.p.x >= quadrant.x.start &&
                robot.p.x <= quadrant.x.end &&
                robot.p.y >= quadrant.y.start &&
                robot.p.y <= quadrant.y.end
            ) {
                quadrant.count++
                if (DEBUG) quadrant.bots.push(robot)
            }
        }
    }

    if (DEBUG) {
        printQuadrant(q1, 1)
        printQuadrant(q2, 2)
        printQuadrant(q3, 3)
        printQuadrant(q4, 4)
    }

    return {
        q1Count: q1.count,
        q2Count: q2.count,
        q3Count: q3.count,
        q4Count: q4.count
    }
}

function createQuadrant(startX, endX, startY, endY) {
    return {
        x: { start: startX, end: endX },
        y: { start: startY, end: endY },
        count: 0,
        bots: []
    }
}

function printQuadrant(quadrant, n) {
    const { gridVisualization } = constructGrid(quadrant.bots)
    console.log(`Q${n} GRID`)
    console.log(gridVisualization)
    console.log('')
}

function parseInput(input) {
    return input.replace(/\r/g, '').split('\n').map(line => {
        const values = line.split(' ')

        const pValues = values[0].replace('p=', '').split(',')
        const vValues = values[1].replace('v=', '').split(',')

        return {
            p: { x: Number(pValues[0]), y: Number(pValues[1]) },
            v: { x: Number(vValues[0]), y: Number(vValues[1]) }
        }
    })
}

function part1() {
    let robots = parseInput(input)

    for (let s = 1; s <= SECONDS; s++) {
        robots = moveRobots(robots)

        if (DEBUG) {
            const { gridVisualization } = constructGrid(robots)
            console.log(gridVisualization)
            console.log('')
        }
    }

    const { q1Count, q2Count, q3Count, q4Count } = getBotsPerQuadrant(robots)
    const dangerFactor = q1Count * q2Count * q3Count * q4Count

    console.log(`Danger Factor: ${dangerFactor}`)


}

function part2() {
    let robots = parseInput(input)

    let s = 1
    let minDangerFactor = Infinity
    while (true) {
        robots = moveRobots(robots)

        const { q1Count, q2Count, q3Count, q4Count } = getBotsPerQuadrant(robots)

        const dangerFactor = (q1Count * q2Count * q3Count * q4Count)
        if (dangerFactor < minDangerFactor) {
            minDangerFactor = dangerFactor
            const { gridVisualization } = constructGrid(robots)

            console.log(`${gridVisualization}\n@ ${s} seconds`)
        }

        if (s > 10000) break

        s++
    }
}

// part1()
part2()