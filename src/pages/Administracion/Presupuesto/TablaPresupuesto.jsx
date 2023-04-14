import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import { useTable } from 'react-table'
import styled from 'styled-components'

import Bloque from './Modales/Bloque'

const Styles = styled.div`
 
  table {
    border-spacing: 0;
    border: 1px solid black;
    background-color: white;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })

    // Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default function Presupuesto() { 
    const partidas = useSelector(state => state.opciones.areas)

    const [dataTable, setDataTable] = useState([])

    const createSelectInput = () => {
        return (
            <select>
                {partidas.map((option, index) => (
                    <option key={index} value={option.id_area}>
                        {option.nombreArea}
                    </option>
                ))}
            </select>
        )
    }

    const createMoneyInput = () => {
        return (
            <input type="number"style={{width: '8.2rem'}}/>
        )
    }

    const buttonAdd = () => {
        return (
            <button onClick={() => {
                setData([...data, {
                    partida: createSelectInput(),
                    subpartida: createSelectInput(),
                }])
            }}>+</button>
        )
    }

    const [data, setData] = useState([
        {
            partida: createSelectInput(),
            subpartida: createSelectInput(),
            1: createMoneyInput(),
            2: createMoneyInput(),
            3: createMoneyInput(),
            4: createMoneyInput(),
            5: createMoneyInput(),
            6: createMoneyInput(),
            7: createMoneyInput(),
            8: createMoneyInput(),
            9: createMoneyInput(),
            10: createMoneyInput(),
            11: createMoneyInput(),
            12: createMoneyInput(),
        }]
    )

    console.log(data)

    const handleAdd = () => {
        setData([...data, {
            partida: createSelectInput(),
            subpartida: createSelectInput(),
        }])
    }

    const columns =
    [
        {
            Header: ' ' ,
            columns: [
                {
                    Header: 'Partida',
                    accessor: 'partida',
                },
                {
                    Header: 'Subpartida',
                    accessor: 'subpartida',
                },
            ],
        },
        {
            Header: ' ',
            columns: [

                {
                    Header: 'Enero',
                    accessor: '1',
                },
                {
                    Header: 'Febrero',
                    accessor: '2',
                },
                {
                    Header: 'Marzo',
                    accessor: '3',
                },
                {
                    Header: 'Abril',
                    accessor: '4',
                },
                {
                    Header: 'Mayo',
                    accessor: '5',
                },
                {
                    Header: 'Junio',
                    accessor: '6',
                },
                {
                    Header: 'Julio',
                    accessor: '7',
                },
                {
                    Header: 'Agosto',
                    accessor: '8',
                },
                {
                    Header: 'Septiembre',
                    accessor: '9',
                },
                {
                    Header: 'Octubre',
                    accessor: '10',
                },
                {
                    Header: 'Noviembre',
                    accessor: '11',
                },
                {
                    Header: 'Diciembre',
                    accessor: '12',
                },
            ],
        },
    ]


    return (
        <>
            {/* <Styles>
                <Table columns={columns} data={data} />
                {buttonAdd()}
            </Styles> */}
            <Bloque />
        </>
    )
}