const fs = require('fs')

const DEBUG = true

const input = fs.readFileSync(DEBUG ? 'day15.test.input' : 'day15.input', 'utf8')

const gridMap = new Map()

const directions = {
    '^': [0, -1],
    '>': [1, 0],
    'v': [0, 1],
    '<': [-1, 0]
}

function getAdjacentBoxes(pos, move, result = []) {
    const [dx, dy] = move
    const cx = pos.x + dx
    const cy = pos.y + dy
    const next = gridMap.get(`${cx}-${cy}`)

    if (next?.char === 'O') {
        return getAdjacentBoxes(next, move, [...result, next])
    } else if (next.char === '#') {
        return false
    }

    return result
}

function getRobot() {
    for (const key of Array.from(gridMap.keys())) {
        const cell = gridMap.get(key)

        if (cell.char === '@') return cell
    }
}

function printGrid() {
    if (DEBUG) return

    let grid = []
    for (const key of Array.from(gridMap.keys())) {
        const [x, y] = key.split('-').map(Number)

        if (!grid[y]) grid[y] = []
        grid[y][x] = gridMap.get(key).char
    }

    console.log(grid.map(row => row.join('')).join('\n'))

    return grid.map(row => row.join('')).join('\n')
}

function getAnswer() {
    let totalSum = 0
    for (const key of Array.from(gridMap.keys())) {
        const cell = gridMap.get(key)
        if (cell.char === 'O') {
            const boxSum = 100 * cell.y + cell.x
            totalSum += boxSum
        }
    }
    return totalSum
}

function main() {
    const [gridInput, movesInput] = input.replace(/\r/g, '').split('\n\n')

    gridInput.split('\n').forEach((line, y) => line.split('').forEach((char, x) => {
        gridMap.set(`${x}-${y}`, {
            char,
            x,
            y
        })
        return char
    }))

    const moves = movesInput.split('')

    printGrid()

    for (const move of moves) {
        const robot = getRobot()
        const [dx, dy] = directions[move]
        const cx = robot.x + dx
        const cy = robot.y + dy

        const next = gridMap.get(`${cx}-${cy}`)

        if (next?.char === '#') continue
        if (next?.char === '.') {
            gridMap.set(`${robot.x}-${robot.y}`, {
                x: robot.x,
                y: robot.y,
                char: '.',
            })
            gridMap.set(`${cx}-${cy}`, {
                x: cx,
                y: cy,
                char: '@'
            })
            continue
        }
        if (next?.char === 'O') {
            let adjacent = getAdjacentBoxes(next, [dx, dy])

            if (DEBUG) console.log({ next, adjacent })

            // edge case: if last box is next to wall at curr direction, robo can't move - treat as first "if" case 
            if (!Array.isArray(adjacent)) {
                continue
            }

            adjacent = [next, ...adjacent]

            gridMap.set(`${robot.x}-${robot.y}`, {
                x: robot.x,
                y: robot.y,
                char: '.',
            })
            gridMap.set(`${cx}-${cy}`, {
                x: cx,
                y: cy,
                char: '@'
            })

            for (const box of adjacent) {
                // get change in coords for each box;
                const cx = box.x + dx
                const cy = box.y + dy
                gridMap.set(`${cx}-${cy}`, {
                    x: cx,
                    y: cy,
                    char: 'O'
                })
            }
        }

        printGrid()
    }

    const answer = getAnswer()

    console.log('Part 1: ', answer)
}

main()