const fs = require('fs')

const input = fs.readFileSync('day12.input', 'utf8')

const directions = [
    [0, -1],  // top
    [1, 0],   // right
    [0, 1],   // bottom
    [-1, 0]   // left
]

const directionsDiag = [
    [-1, -1], // top left
    [0, -1],  // top
    [1, -1],  // top right
    [1, 0],   // right
    [-1, 0],  // left
    [1, 1],   // bottom right
    [0, 1],   // bottom
    [-1, 1],  // bottom left
];

const gridMap = new Map()

function getRegions(grid) {
    const regions = new Map()

    grid.forEach((row, y) => {
        row.forEach((char, x) => {
            const link = doesCellLinkToRegion({ char, x, y }, regions, grid)

            let cell;
            if (link) {
                cell = {
                    char: link.char,
                    x,
                    y
                }
                regions.set(link.char, [...regions.get(link.char), cell])
            } else {
                const hasCharBeenUsed = Array.from(regions.keys()).filter(k => k.includes(char))

                if (hasCharBeenUsed?.length) {
                    const newKey = `${char}${hasCharBeenUsed?.length}`
                    cell = {
                        char: newKey,
                        x,
                        y
                    }
                    regions.set(newKey, [cell])
                } else {
                    cell = {
                        char,
                        x,
                        y
                    }
                    regions.set(char, [cell])
                }
            }
            gridMap.set(`${x}-${y}`, cell)
        })
    })

    return regions
}

function doesCellLinkToRegion(cell, regions, grid, visited = new Set()) {
    const key = `${cell.x}-${cell.y}`
    if (visited.has(key)) return null
    visited.add(key)

    const possibleregionsKeys = Array.from(regions.keys()).filter(k => k.includes(cell.char))

    if (!possibleregionsKeys?.length) return null

    for (const possibleregionKey of possibleregionsKeys) {
        const regionToCheck = regions.get(possibleregionKey)

        for (const regionCell of regionToCheck) {
            for (const [dx, dy] of directions) {
                const cx = cell.x + dx
                const cy = cell.y + dy

                if (regionCell.x === cx && regionCell.y === cy && regionCell.char.includes(cell.char)) {
                    return regionCell
                }
            }
        }

        for (const [dx, dy] of directions) {
            const nextCell = {
                x: cell.x + dx,
                y: cell.y + dy,
                char: cell.char
            }

            if (!grid[nextCell.y]?.[nextCell.x] ||
                grid[nextCell.y][nextCell.x] !== cell.char) {
                continue
            }

            const result = doesCellLinkToRegion(nextCell, regions, grid, visited)
            if (result) return result
        }
    }

    return null
}

function getNumCorners(region) {
    let totalCorners = 0

    for (const cell of region) {
        const aroundCell = []
        for (const [dx, dy] of directionsDiag) {
            const neighbor = gridMap.get(`${cell.x + dx}-${cell.y + dy}`)
            aroundCell.push((neighbor?.char === cell.char))
        }

        const [
            topLeft,
            top,
            topRight,
            right,
            left,
            bottomRight,
            bottom,
            bottomLeft,
        ] = aroundCell

        if (!top && !left) totalCorners++
        if (!top && !right) totalCorners++
        if (!bottom && !left) totalCorners++
        if (!bottom && !right) totalCorners++
        if (top && left && !topLeft) totalCorners++
        if (top && right && !topRight) totalCorners++
        if (bottom && left && !bottomLeft) totalCorners++
        if (bottom && right && !bottomRight) totalCorners++
    }

    return totalCorners
}

function getPerimeterLength(region) {
    let perimeter = 0

    for (let cell of region) {
        let p = 4
        for (const [dx, dy] of directions) {
            if (gridMap.get(`${cell.x + dx}-${cell.y + dy}`)?.char === cell.char) {
                p -= 1
            }
        }
        perimeter += p
    }

    return perimeter
}

function main() {
    const grid = input.replace(/\r/g, '').split('\n').map(line => line.split(''))

    const regions = getRegions(grid)    

    let part1Calculations = new Map()
    let part2Calculations = new Map()

    Array.from(regions.keys()).forEach(key => {
        const region = regions.get(key)
        const perimeter = getPerimeterLength(region)
        const area = regions.get(key).length
        const nSides = getNumCorners(regions.get(key))

        part1Calculations.set(key, area * perimeter)
        part2Calculations.set(key, area * nSides)
    })

    console.log('Part 1: ', Array.from(part1Calculations.values()).reduce((acc, curr) => acc + curr))
    console.log('Part 2: ', Array.from(part2Calculations.values()).reduce((acc, curr) => acc + curr))
}

main()