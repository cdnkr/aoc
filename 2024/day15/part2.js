const fs = require('fs')

const DEBUG = false

const input = fs.readFileSync(DEBUG ? 'day15.test.input' : 'day15.input', 'utf8')

const gridMap = new Map()

const directions = {
    '^': [0, -1],
    '>': [1, 0],
    'v': [0, 1],
    '<': [-1, 0]
}

function getOtherSideOfBox(boxPos) {
    const otherSide = gridMap.get(boxPos?.char === '[' ? `${boxPos.x + 1}-${boxPos.y}` : `${boxPos.x - 1}-${boxPos.y}`)

    return otherSide
}

function getAdjacentBoxesH(pos, move, result = []) {
    const [dx, dy] = move
    const cx = pos.x + dx
    const cy = pos.y + dy
    const next = gridMap.get(`${cx}-${cy}`)

    if (next?.char === '[' || next?.char === ']') {
        return getAdjacentBoxesH(next, move, [...result, next])
    } else if (next.char === '#') {
        return false
    }

    return result
}

function getAdjacentBoxesV(positions, move, result = []) {

    let nArr = []
    for (const pos of positions) {
        const [dx, dy] = move
        const cx = pos.x + dx
        const cy = pos.y + dy
        const next = gridMap.get(`${cx}-${cy}`)

        if (next?.char === '[' || next?.char === ']') {
            const otherSide = getOtherSideOfBox(next)

            nArr.push(next, otherSide)
        } else if (next.char === '#') {
            return false
        }
    }

    if (!nArr?.length) return result

    return getAdjacentBoxesV(nArr, move, [...result, ...nArr])
}

function getRobot() {
    for (const key of Array.from(gridMap.keys())) {
        const cell = gridMap.get(key)

        if (cell.char === '@') return cell
    }
}

function printGrid() {
    if (!DEBUG) return

    let grid = []
    for (const key of Array.from(gridMap.keys())) {
        const [x, y] = key.split('-').map(Number)

        if (!grid[y]) grid[y] = []
        grid[y][x] = gridMap.get(key).char
    }

    console.log(grid.map(row => row.join('')).join('\n'))
    console.log('\n')

    return grid.map(row => row.join('')).join('\n')
}

function getAnswer() {
    let totalSum = 0
    for (const key of Array.from(gridMap.keys())) {
        const cell = gridMap.get(key)
        if (cell.char === '[') {
            const boxSum = 100 * cell.y + cell.x
            totalSum += boxSum
        }
    }
    return totalSum
}

function gridX2(gridInput) {
    return gridInput.replace(/#/g, '##')
        .replace(/O/g, '[]')
        .replace(/\./g, '..')
        .replace(/@/g, '@.')
}

function main() {
    let [gridInput, movesInput] = input.replace(/\r/g, '').split('\n\n')

    gridInput = gridX2(gridInput)

    gridInput.split('\n').forEach((line, y) => line.split('').forEach((char, x) => {
        gridMap.set(`${x}-${y}`, {
            char,
            x,
            y
        })
    }))

    const moves = movesInput.split('')

    printGrid()

    for (const move of moves) {
        if (DEBUG) console.log(move, move, move)

        const robot = getRobot()
        const [dx, dy] = directions[move]
        const cx = robot.x + dx
        const cy = robot.y + dy

        const next = gridMap.get(`${cx}-${cy}`)

        if (next?.char === '#') {
            printGrid()
            continue
        }
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
            printGrid()
            continue
        }

        if (next?.char === '[' || next?.char === ']') {
            const otherSide = getOtherSideOfBox(next)

            let adjacent
            if (move === '^' || move === 'v') {
                adjacent = getAdjacentBoxesV([next, otherSide], [dx, dy])
            } else {
                adjacent = getAdjacentBoxesH(next, [dx, dy])
            }

            if (DEBUG) console.log({ next, adjacent })

            if (!Array.isArray(adjacent)) {
                printGrid()
                continue
            }

            adjacent = [next, otherSide, ...adjacent]


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

            if (move === '^' || move === 'v') {
                gridMap.set(`${otherSide.x}-${otherSide.y}`, {
                    x: otherSide.x,
                    y: otherSide.y,
                    char: '.'
                })
            }

            for (const box of adjacent) {
                const cx = box.x + dx
                const cy = box.y + dy

                if (!adjacent.some(b => ((b.x + dx) === box.x) && ((b.y + dy) === box.y)) && gridMap.get(`${box.x}-${box.y}`)?.char !== '@') {
                    gridMap.set(`${box.x}-${box.y}`, {
                        x: box.x,
                        y: box.y,
                        char: '.'
                    })
                }

                gridMap.set(`${cx}-${cy}`, {
                    x: cx,
                    y: cy,
                    char: box.char
                })
            }
        }

        printGrid()
    }

    const answer = getAnswer()

    console.log('Part 2: ', answer)
}

main()