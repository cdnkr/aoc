const fs = require('fs')

let input = fs.readFileSync('day9.input', 'utf8')

function part1() {
    if (input.length / 2 !== Math.round(input.length / 2)) {
        input += '0'
    }
    const pairs = input.match(/\d{2}/g)

    let out = []
    let id = 0
    for (const pair of pairs) {
        const values = pair.split('').map(Number)
        const [nFiles, nEmpty] = values

        for (let i = 0; i < nFiles; i++) {
            out.push(id)
        }

        for (let j = 0; j < nEmpty; j++) {
            out.push('.')
        }

        id++
    }

    for (let i = out.length - 1; i > -1; i--) {
        const curr = out[i];
        if (curr !== '.') {
            const firstOpenSpaceIndex = out.indexOf('.')
            if (firstOpenSpaceIndex < i) {
                out[firstOpenSpaceIndex] = curr
                out[i] = '.'
            }
        }
    }

    let checksum = 0
    for (let i = 0; i < out.length; i++) {
        if (out[i] === '.') continue
        const v = Number(out[i]) * i
        checksum += v
    }

    console.log(out.join(''), checksum)
}

function part2() {
    if (input.length / 2 !== Math.round(input.length / 2)) {
        input += '0'
    }
    const pairs = input.match(/\d{2}/g)

    let out = []
    let id = 0
    for (const pair of pairs) {
        const values = pair.split('').map(Number)
        const [nFiles, nEmpty] = values
        if (nFiles) out.push([...new Array(nFiles)].map(_ => id))
        if (nEmpty) out.push([...new Array(nEmpty)].map(_ => '.'))
        id++
    }

    for (let i = out.length - 1; i > -1; i--) {
        const curr = out[i];
        if (curr.includes('.')) continue

        const emptyRef = curr.map(_ => '.')
        const emptyIndex = out.findIndex(item => item.join('').includes(emptyRef.join('')))

        if (emptyIndex > -1 && emptyIndex < i) {
            let u = out[emptyIndex]
            let ri = 0
            for (let j = 0; j < u.length; j++) {
                let char = u[j]
                if (u[j] !== '.') {
                    u[j] = char
                } else if (curr?.[ri]) {
                    u[j] = curr?.[ri]
                    ri++
                } else {
                    u[j] = char
                }
            }

            out[emptyIndex] = u
            out[i] = emptyRef
        }
    }

    out = out.flat()

    let checksum = 0
    for (let i = 0; i < out.length; i++) {
        if (out[i] === '.') continue
        const v = Number(out[i]) * i
        checksum += v
    }

    console.log(out.join(''), checksum)
}

part1()
part2()