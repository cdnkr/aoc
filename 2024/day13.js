const fs = require('fs')

const input = fs.readFileSync('day13.input', 'utf8')

function parseInput(input) {
    const split = input.replace(/\r/g, '').split('\n').map((line, i) => {
        return line
    })

    let vendingMachines = []
    let newVendingMachine = {}
    for (let i = 0; i < split.length; i++) {
        let line = split[i]
        if (line === '') {
            vendingMachines = [...vendingMachines, newVendingMachine]
            newVendingMachine = {}
        } else {
            if (line.includes('Button A:')) {
                console.log('A', line)

                const lineValues = line.match(/\d+/g)

                const x = Number(lineValues[0])
                const y = Number(lineValues[1])

                newVendingMachine.a = {
                    x,
                    y
                }
            }
            if (line.includes('Button B:')) {
                const lineValues = line.match(/\d+/g)

                const x = Number(lineValues[0])
                const y = Number(lineValues[1])

                newVendingMachine.b = {
                    x,
                    y
                }
            }
            if (line.includes('Prize:')) {
                const lineValues = line.match(/\d+/g)

                const x = Number(lineValues[0]) + 10000000000000 // Part 2: add 10000000000000 offset
                const y = Number(lineValues[1]) + 10000000000000

                newVendingMachine.p = {
                    x,
                    y
                }
            }
        }
    }

    return vendingMachines
}

function calcA(vendingMachine) {
    const eq1 = vendingMachine.b.y * (vendingMachine.a.x + vendingMachine.b.x)
    const eq2 = vendingMachine.b.x * (vendingMachine.a.y + vendingMachine.b.y)

    const v = eq1 - eq2

    const p1 =  vendingMachine.b.y * vendingMachine.p.x
    const p2 =  vendingMachine.b.x * vendingMachine.p.y

    const pv = p1 - p2

    return correctJSFloat(pv / v)
}

function calcB(vendingMachine) {
    const eq1 = vendingMachine.a.y * (vendingMachine.a.x + vendingMachine.b.x)
    const eq2 = vendingMachine.a.x * (vendingMachine.a.y + vendingMachine.b.y)

    const v = eq1 - eq2

    const p1 =  vendingMachine.a.y * vendingMachine.p.x
    const p2 =  vendingMachine.a.x * vendingMachine.p.y

    const pv = p1 - p2

    return correctJSFloat(pv / v)
}

function correctJSFloat(n) {
    if (String(n).includes('.9999') || String(n).includes('.0000')) n = Math.round(n)

    return n
}

function main() {
    const vendingMachines = parseInput(input)
    let tokenCount = 0
    for (let vm of vendingMachines) {
        const a = calcA(vm)
        const b = calcB(vm)

        if (
            // Below for Part 1 - No more than 100 presses per button
            // a > 100 || b > 100 || 
            Math.floor(a) !== a || Math.floor(b) !== b) continue

        const price = (a * 3) + b

        tokenCount += price
        console.log(`A: ${a}, B: ${b}, Price: ${price}`)
    }

    console.log(tokenCount)
}

main()