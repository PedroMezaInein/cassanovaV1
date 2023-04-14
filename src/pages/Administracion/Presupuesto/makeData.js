import React from 'react'

/* const range = len => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
} */

const createSelectInput = () => {
    const options = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
    ]
    return (
        <select>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

const newPerson = () => {
    const statusChance = Math.random()
    return {
        partida: createSelectInput(),
        subpartida: createSelectInput(),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status:
            statusChance > 0.66
                ? 'relationship'
                : statusChance > 0.33
                    ? 'complicated'
                    : 'single',
    }
}

export default function makeData() {
    const statusChance = Math.random()
    return {
        partida: createSelectInput(),
        subpartida: createSelectInput(),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status:
            statusChance > 0.66
                ? 'relationship'
                : statusChance > 0.33
                    ? 'complicated'
                    : 'single',
    }

}