const fs = require('fs');

const input = fs.readFileSync('day8.input', 'utf8')

function parseInput(input) {
    const grid = input.replace(/\r/g, '').split('\n').map((line, y) => {
        return line.split('').map((char, x) => {
            return {
                char,
                x,
                y
            }
        })
    })
    
    const maxes = { x: grid[0].length - 1, y: grid.length - 1 }

    return {
        grid,
        maxes
    }
}

function getUniqueAntennas(grid) {
    const antennas = grid.map(line => line.filter(c => c.char !== '.')).flat()
    const uniqueAntennas = new Map()
    for (let antenna of antennas) {
        uniqueAntennas.set(antenna.char, uniqueAntennas.has(antenna.char) ? [...uniqueAntennas.get(antenna.char), antenna] : [antenna])
    }
    return uniqueAntennas
}

function getUpdatedGridString(interferancePoints, grid) {
    let updatedGrid = [...grid];
    interferancePoints.forEach(ip => {
        if (updatedGrid[ip.y][ip.x].char === '.') {
            updatedGrid[ip.y][ip.x] = {
                x: ip.x,
                y: ip.y,
                char: '#'
            }
        }
    })

    return updatedGrid.map(l => l.map(l => l.char).join('')).join('\n')
}

function part1(uniqueAntennas, grid, maxes) {
    let interferancePoints = [];

    for (const antennaKey of uniqueAntennas.keys()) {
        const currentAntennas = uniqueAntennas.get(antennaKey)

        for (const { x: x1, y: y1, char } of currentAntennas) {
            for (const { x: x2, y: y2 } of currentAntennas) {
                if (x1 !== x2 && y1 !== y2) {
                    const dx = x2 - x1
                    const dy = y2 - y1

                    const m = dy / dx
                    // y=mx+c
                    // c=mx-y
                    // c=y-mx
                    const c = y1 - (m * x1)

                    let ly = y1 > y2 ? y2 : y1
                    let hy = y1 < y2 ? y2 : y1

                    ly -= dy
                    hy += dy

                    if (hy > maxes.y) hy = hy -= dy
                    if (ly < 0) ly = ly += dy

                    for (let y = ly; y <= hy; y += dy) {
                        let nx = (y - c) / m
                        // js hack
                        if (String(nx).includes('.9999') || String(nx).includes('.0000')) nx = Math.round(nx)

                        if (
                            interferancePoints.some(p => p.x === nx && p.y === y) ||
                            nx > maxes.x ||
                            nx < 0 ||
                            nx !== Math.floor(nx) ||
                            grid[y][nx].char === char
                        ) continue

                        interferancePoints.push({
                            origin: char,
                            x: nx,
                            y
                        })
                    }
                }
            }
        }
    }

    let updatedGrid = [...grid];
    interferancePoints.forEach(ip => {
        if (updatedGrid[ip.y][ip.x].char === '.') {
            updatedGrid[ip.y][ip.x] = {
                x: ip.x,
                y: ip.y,
                char: '#'
            }
        }
    })

    return interferancePoints
}

function part2(uniqueAntennas, grid, maxes) {
    let interferancePoints = [];

    for (const antennaKey of uniqueAntennas.keys()) {
        const currentAntennas = uniqueAntennas.get(antennaKey)

        for (const { x: x1, y: y1, char } of currentAntennas) {
            for (const { x: x2, y: y2 } of currentAntennas) {
                if (x1 !== x2 && y1 !== y2) {
                    const dx = x2 - x1
                    const dy = y2 - y1
                    const m = dy / dx
                    const c = y1 - (m * x1)

                    let ly = y1 > y2 ? y2 : y1
                    let hy = y1 < y2 ? y2 : y1

                    ly -= dy
                    hy += dy

                    if (hy > maxes.y) hy = hy -= dy
                    if (ly < 0) ly = ly += dy

                    for (let y = 0; y <= maxes.y; y++) {
                        let nx = (y - c) / m
                        // js hack
                        if (String(nx).includes('.9999') || String(nx).includes('.0000')) nx = Math.round(nx)

                        if (
                            interferancePoints.some(p => p.x === nx && p.y === y) ||
                            nx > maxes.x ||
                            nx < 0 ||
                            nx !== Math.floor(nx)
                        ) continue

                        interferancePoints.push({
                            origin: char,
                            x: nx,
                            y
                        })
                    }
                }
            }
        }
    }

    return interferancePoints
}

function main() {
    const { grid, maxes } = parseInput(input)
    const uniqueAntennas = getUniqueAntennas(grid)

    const interferancePoints = part1(uniqueAntennas, grid, maxes)
    console.log(getUpdatedGridString(interferancePoints, grid))
    console.log("Part 1: ", interferancePoints.length)

    const interferancePoints_2 = part2(uniqueAntennas, grid, maxes)
    console.log(getUpdatedGridString(interferancePoints_2, grid))
    console.log("Part 1: ", interferancePoints_2.length)
}

main()