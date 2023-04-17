import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { useTable } from 'react-table'
import styled from 'styled-components'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import TrashIcon from '@material-ui/icons/DeleteOutline';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

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

    th{
        background-color: #B4A26D;
    }
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      min-width: 6vw;
      max-width: 6vw;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build the UI
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

    // Render the UI for the table
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


export default function Bloque(props) {
    const partidas = useSelector(state => state.opciones.areas)
    const areas = useSelector(state => state.opciones.areas)

    /* const handleChangeDepartamento = (e) => {
        setForm([
            ...form,
            form[0].partida_id: e.target.value,

        ])
    } */

    let data = [{
        area: '',
        area_id: '',
        partida: '',
        partida_id: '',
        subpartida: '',
        subpartida_id: '',
        Enero: 145.25,
        Febrero: '',
        Marzo: '',
        Abril: '',
        Mayo: '',
        Junio: '',
        Julio: '',
        Agosto: '',
        Septiembre: '',
        Octubre: '',
        Noviembre: '',
        Diciembre: '',
    }]

    useEffect(() => { 

        if (areas.length >= 13) {
            setForm(createData())
        }

    }, [areas])

    

    

    const getColumnas = (index) => {
        let columnas = [
            {
                Header: '',
                accessor: 'area',

                columns: [

                    {
                        Header: '',
                        accessor: 'eliminar',
                    },
                    {
                        Header: 'Partida',
                        accessor: 'partida',
                    },
                    {
                        Header: 'Subpartida',
                        accessor: 'subpartida',
                    },

                ]
            },
            {
                Header: `${partidas[index].nombreArea}`,
                accessor: 'test',
                columns: [

                    {
                        Header: `$${form[index][0].Enero}`,
                        accessor: '1',
                    },
                    {
                        Header: '$ -',
                        accessor: '2',
                    },
                    {
                        Header: '$ -',
                        accessor: '3',
                    },
                    {
                        Header: '$ -',
                        accessor: '4',
                    },
                    {
                        Header: '$ -',
                        accessor: '5',
                    },
                    {
                        Header: '$ -',
                        accessor: '6',
                    },
                    {
                        Header: '$ -',
                        accessor: '7',
                    },
                    {
                        Header: '$ -',
                        accessor: '8',
                    },
                    {
                        Header: '$ -',
                        accessor: '9',
                    },
                    {
                        Header: '$ -',
                        accessor: '10',
                    },
                    {
                        Header: '$ -',
                        accessor: '11',
                    },
                    {
                        Header: '$ -',
                        accessor: '12',
                    },
                ],
            },
        ]
        return columnas
    }

    const createSelectInput = (data) => {

        return (
            <Select

                /* value={form ? form[0].partida_id : ''} */
                /* onChange={handleChangeDepartamento} */
            /* className={classes.textField} */
            >
                {areas?.find(partida => partida.id_area === data) ? areas.find(partida => partida.id_area === data).partidas.map(partida => (
                    <MenuItem key={partida.id} value={partida.id}>{partida.nombre}</MenuItem>
                )) : 
                    <MenuItem value={0}>Seleccione una partida</MenuItem>
                }


            </Select>
        )
    }

    const createDeleteButton = () => {
        return (
            <TrashIcon />
        )
    }

    const handleMoney = (partida, index, mes, e) => {
        let indexPartida = form[index].findIndex(partida => partida.partida_id === partida.partida_id)
        let aux = form[index].find(partida => partida.area_id === partida.area_id)
        setForm([
            ...form,
            form[index] = [
                ...form[index],

            ]
        ])
    }

    const createCurrencyInput = (partida, index, mes) => {
        return (
            <CurrencyTextField
                
                variant="standard"
                value={form ? form[index][mes] : ''}
                currencySymbol="$"
                outputFormat="number"
                onChange={(event, value) => handleMoney(partida, index, mes,value)}
            /* error={errores.monto ? true : false} */
            />
        )
    }

    const createData = () => {
        let aux = []
        areas.map((area, index) => {
            aux.push([{
                area: area.nombreArea,
                area_id: area.id_area,
                partida: createSelectInput(area.id_area),
                partida_id: '',
                subpartida: createSelectInput(area.id_area),
                subpartida_id: '',
                eliminar: createDeleteButton(),
                1: createCurrencyInput(area, index, 1),
                2: createCurrencyInput(area, index, 2),
                3: createCurrencyInput(area, index, 3),
                4: createCurrencyInput(area, index, 4),
                5: createCurrencyInput(area, index, 5),
                6: createCurrencyInput(area, index, 6),
                7: createCurrencyInput(area, index, 7),
                8: createCurrencyInput(area, index, 8),
                9: createCurrencyInput(area, index, 9),
                10: createCurrencyInput(area, index, 10),
                11: createCurrencyInput(area, index, 11),
                12: createCurrencyInput(area, index, 12),
            }])
        })

        return aux
    }

    const [form, setForm] = useState(createData())

    const createTables = (partida, index) => {
        let aux = [{
            area: partida.nombreArea,
            area_id: partida.id_area,
            partida: createSelectInput(partida.id_area),
            partida_id: '',
            subpartida: createSelectInput(),
            eliminar: createDeleteButton(),
            test: 'test',
            1: createCurrencyInput(partida,index, 'Enero'),
            2: createCurrencyInput(partida, index, 'Febrero'),
            3: createCurrencyInput(partida, index, 'Marzo'),
            4: createCurrencyInput(partida, index, 'Abril'),
            5: createCurrencyInput(partida, index, 'Mayo'),
            6: createCurrencyInput(partida, index, 'Junio'),
            7: createCurrencyInput(partida, index, 'Julio'),
            8: createCurrencyInput(partida, index, 'Agosto'),
            9: createCurrencyInput(partida, index, 'Septiembre'),
            10: createCurrencyInput(partida, index, 'Octubre'),
            11: createCurrencyInput(partida, index, 'Noviembre'),
            12: createCurrencyInput(partida, index, 'Diciembre'),
        }]
        
        return (
            <>
                <div>
                    <Styles>
                        <Table columns={getColumnas(index)} data={form[index]} />
                    </Styles>
                    
                </div>
            </>
        )
    }

    console.log(form)


    return (
        <>
            <div>
                { form.length >= 13 &&
                    partidas.map((partida, index) => {
                        return createTables(partida, index)
                    })
                }
                {/* <button onClick={handleAddBloque}>Agregar bloque</button> */}
            </div>
            {/* <Styles>
                <Table columns={columns} data={form[0]} />
            </Styles> */}
            {/* <Styles>
                <Table columns={columns} data={form[0]} />
            </Styles> */}
            {/* <div>
                {createSelectInput()}
                <button onClick={handleAddRow}>Agregar fila</button>
            </div> */}
        </>
    )
}