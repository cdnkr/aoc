const fs = require('fs')

let input = fs.readFileSync('day10.input', 'utf8')

const directions = [
    [0, -1],  // Top
    [1, 0],   // Right
    [0, 1],   // Bottom
    [-1, 0]   // Left
]

const gridKV = new Map()

function parseInputToGrid(input) {
    const grid = input.replace(/\r/g, '').split('\n').map((row, y) => {
        return row.split('').map((cell, x) => {
            gridKV.set(`${x}-${y}`, {
                cell: Number(cell),
                x,
                y
            })
            return {
                cell: Number(cell),
                x,
                y
            }
        })
    })

    return grid
}

function logGrid(grid) {
    const gridStr = grid.map((row, y) => row.map((col, x) => {
        if (path.find(c => c.x === x && c.y === y)) return 'O';
        return isNaN(Number(col.cell)) ? '.' : col.cell
    }).join('')).join('\n')
    console.log(gridStr)
    console.log('')
}

function checkPath(cell, grid, start = 0, path = [], result = { count: 0, endsReached: [] }) {
    if (start === 9) {
        if (!path.find(({ x, y }) => cell === 9 && x === cell.x && y === cell.y)) {
            result.endsReached.push(cell)
        }
        result.count++
    } else {
        for (const direction of directions) {
            const [dx, dy] = direction
            const { x, y } = cell
            const cx = x + dx
            const cy = y + dy

            const checkCell = gridKV.get(`${cx}-${cy}`)

            if (checkCell?.cell === (start + 1)) {
                checkPath(checkCell, grid, start + 1, [...path, checkCell], result)
            }
        }
    }

    return result
}

function main() {
    const grid = parseInputToGrid(input)
    const trailheads = grid.map(row => row.filter(({ cell }) => cell === 0)).flat()

    let uniqueEndsReachable = 0  // Part 1: 9-height positions reachable from that trailhead
    let distinctTrails = 0       // Part 2: Distinct hiking trails which begin at that trailhead
    let endsReached = new Map()
    
    for (const trailhead of trailheads) {
        const { 
            count: distinctTrailsFromTrailhead, 
            endsReached: endsReachedFromTrailhead
        } = checkPath(trailhead, grid)

        endsReachedFromTrailhead.forEach(end => {
            const key = `${trailhead.x}-${trailhead.y}`

            if (!endsReached.has(key)) {
                endsReached.set(key, [end])
            } else if (
                endsReached.get(key) && 
                !endsReached.get(key).some(ea => ea.x === end.x && ea.y === end.y)
            ) {
                endsReached.set(key, [...endsReached.get(key), end])
            }
        })

        const thisCount = endsReached.get(`${trailhead.x}-${trailhead.y}`)?.length || 0

        if (thisCount) uniqueEndsReachable += thisCount // Part 1
        distinctTrails += distinctTrailsFromTrailhead   // Part 2
    }

    console.log({ 
        part1: uniqueEndsReachable, 
        part2: distinctTrails
    })
}

main()