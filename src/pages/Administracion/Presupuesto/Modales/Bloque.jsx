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
    width: 100%;

    tr {
      :last-child {
        td {
            border-bottom: 0;
        }
      }
      
    }

    th{
        background: rgba(22, 147, 165, 0.75);
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
const StylesGeneral = styled.div`
 
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
        background: rgba(22, 147, 165, 0.75);
    }
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      min-width: 10vw;
      max-width: 10vw;

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
    const departamento = useSelector(state => state.authUser.departamento.departamentos[0])
    const nombreUsuario = useSelector(state => state.authUser.user)
    const [form, setForm] = useState([])
    const [general, setGeneral] = useState({
        departamento: departamento.nombre,
        departamento_id: departamento.id,
        gerente: nombreUsuario.name,
        gerente_id: nombreUsuario.id,
        colaboradores: '',
        colaboradores_id: '',
        granTotal: '',
    })

    const handleChangePartida = (e, index, subindex, datos) => {
        let nuevoForm = [...datos]
        nuevoForm[index][subindex].partida_id = e.target.value
        setForm(nuevoForm)
    }

    const handleChangeSubpartida = (e, index, subindex) => {
        const nuevoForm = [...form]
        nuevoForm[index][subindex].subpartida_id = e.target.value
        setForm(nuevoForm)
    }

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
            createData()
        }
    }, [areas])

    const formatNumberCurrency = (number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(number)
    }

    const sumaMes = (index, mes) => {
        let suma = 0
        for (let i = 0; i < form[index].length; i++) {
            suma += form[index][i][mes]
        }
        suma = formatNumberCurrency(suma)
        return suma
    }

    const getSumaMeses = (mes) => {
        let suma = 0
        form.map((area, index) => {
            form[index].map((fila, subindex) => {
                suma += form[index][subindex][mes]
            })
        })
        suma = formatNumberCurrency(suma)
        return suma
    }

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
                        Header: `${sumaMes(index, 'Enero')}`,
                        accessor: '1',
                    },
                    {
                        Header: `${sumaMes(index, 'Febrero')}`,
                        accessor: '2',
                    },
                    {
                        Header: `${sumaMes(index, 'Marzo')}`,
                        accessor: '3',
                    },
                    {
                        Header: `${sumaMes(index, 'Abril')}`,
                        accessor: '4',
                    },
                    {
                        Header: `${sumaMes(index, 'Mayo')}`,
                        accessor: '5',
                    },
                    {
                        Header: `${sumaMes(index, 'Junio')}`,
                        accessor: '6',
                    },
                    {
                        Header: `${sumaMes(index, 'Julio')}`,
                        accessor: '7',
                    },
                    {
                        Header: `${sumaMes(index, 'Agosto')}`,
                        accessor: '8',
                    },
                    {
                        Header: `${sumaMes(index, 'Septiembre')}`,
                        accessor: '9',
                    },
                    {
                        Header: `${sumaMes(index, 'Octubre')}`,
                        accessor: '10',
                    },
                    {
                        Header: `${sumaMes(index, 'Noviembre')}`,
                        accessor: '11',
                    },
                    {
                        Header: `${sumaMes(index, 'Diciembre')}`,
                        accessor: '12',
                    },
                ],
            },
        ]
        return columnas
    }

    const getColumnsHeader = () => {
        let columnas = [
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
        ]
        return columnas
    }

    const deleteRow = (index, subindex) => {
        const nuevoForm = [...form]
        nuevoForm[index].splice(subindex, 1)
        setForm(nuevoForm)
    }

    const createDeleteButton = (index, subindex) => {
        return (
            <div onClick={() => deleteRow(index, subindex)} style={{ cursor: 'pointer' }}>
                <TrashIcon />    
            </div>
            
        )
    }

    const handleMoney = (partida, index, mes, e, subindex) => {
        console.log(partida, index, mes, e, subindex)
        console.log(form)
        const nuevoForm = [...form]
        nuevoForm[index][subindex][mes] = e
        /* console.log(form) */
        /* createData() */
        // return form
        setForm(nuevoForm)
    }

    const createCurrencyInput = (partida, index, mes, subindex) => {
        return (
            <CurrencyTextField

                variant="standard"
                value={form[index]?.[subindex]?.[mes] ? form[index][subindex][mes] : ''}
                currencySymbol="$"
                outputFormat="number"
                onChange={(event, value) => handleMoney(partida, index, mes, value, subindex)}
            /* error={errores.monto ? true : false} */
            />
        )
    }

    const createData = () => {
        let aux = []
        let id = 0
        areas.map((area, index) => {
            aux.push([])
        })
        setForm(aux)
    }

    const getForm = () => {
        let aux = [...form]
        return aux
    }

    const createSelectInputPartida = (data, index, subindex) => {
        console.log(form[index][subindex])
        console.log(data, index, subindex)

        try {
            console.log(form[index][subindex].partida_id)

        }
        catch (error) {
            console.log(error)
        }

        return (
                    <Select
                        value={form[index]?.[subindex]?.partida_id ? form[index][subindex].partida_id : '0'}
                        onChange={e => handleChangePartida(e, index, subindex, getForm())}
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
    
    const createSelectInputSubpartida = (data, index, subindex) => {

        return (
            <div>
                {
                    form[index].length > 0 && form[index][subindex] && form[index][subindex].partida_id && form[index][subindex].partida_id !== '' &&
                    <Select
                        value={form.length > 0 ? form[index][subindex].subpartida_id : ''}
                        onChange={e => handleChangeSubpartida(e, index, subindex)}
                        /* className={classes.textField} */
                    >
                            {areas?.find(partida => partida.id_area === data) ? areas.find(partida => partida.id_area === data).partidas.find(partida => partida.id === form[index][subindex].partida_id).subpartidas.map(subpartida => (   
                                <MenuItem key={subpartida.id} value={subpartida.id}>{subpartida.nombre}</MenuItem>
                            )) :
                                <MenuItem value={0}>Seleccione una partida</MenuItem>

                            }
                    </Select>
                }
            </div> 
        )
    }

   /*  console.log(form) */

    const createTables = (partida, index) => {
        return (
            <>
                <div key={index}>
                    <Styles>
                        <Table columns={getColumnas(index)} data={form[index]} />
                        <button onClick={() => addNewRow(index)}>Agregar</button>
                    </Styles>

                </div>
            </>
        )
    }

    const getDataHeader = (index) => {
        let aux = [{
            id: 0,
            1: getSumaMeses('Enero'),
            2: getSumaMeses('Febrero'),
            3: getSumaMeses('Marzo'),
            4: getSumaMeses('Abril'),
            5: getSumaMeses('Mayo'),
            6: getSumaMeses('Junio'),
            7: getSumaMeses('Julio'),
            8: getSumaMeses('Agosto'),
            9: getSumaMeses('Septiembre'),
            10: getSumaMeses('Octubre'),
            11: getSumaMeses('Noviembre'),
            12: getSumaMeses('Diciembre'),

        }]
        return aux
    }

    const createHeader = () => {
        return (
            <div>
                <Styles>
                    <Table columns={getColumnsHeader()} data={getDataHeader()} />
                </Styles>
            </div>
        )
    }

    const addNewRow = (index) => {
        let aux = form[index]
        let id = aux.length > 0 ? aux[aux.length - 1].id + 1 : 0
        
        aux.push({
            id: id,
            area: areas[index].nombreArea,
            area_id: areas[index].id_area,
            partida: createSelectInputPartida(areas[index].id_area, index, id),
            partida_id: '',
            subpartida: createSelectInputSubpartida(areas[index].id_area, index, id),
            subpartida_id: '',
            eliminar: createDeleteButton(index, id),
            1: createCurrencyInput('', index, 'Enero', id),
            2: createCurrencyInput('', index, 'Febrero', id),
            3: createCurrencyInput('', index, 'Marzo', id),
            4: createCurrencyInput('', index, 'Abril', id),
            5: createCurrencyInput('', index, 'Mayo', id),
            6: createCurrencyInput('', index, 'Junio', id),
            7: createCurrencyInput('', index, 'Julio', id),
            8: createCurrencyInput('', index, 'Agosto', id),
            9: createCurrencyInput('', index, 'Septiembre', id),
            10: createCurrencyInput('', index, 'Octubre', id),
            11: createCurrencyInput('', index, 'Noviembre', id),
            12: createCurrencyInput('', index, 'Diciembre', id),
            Enero: 0,
            Febrero: 0,
            Marzo: 0,
            Abril: 0,
            Mayo: 0,
            Junio: 0,
            Julio: 0,
            Agosto: 0,
            Septiembre: 0,
            Octubre: 0,
            Noviembre: 0,
            Diciembre: 0,
        })
        setForm(form => [...form.slice(0, index), aux, ...form.slice(index + 1)])
    }

    const createTableDepartamento = () => {
        const columnas = [
            {
                Header: 'Departamento',
                accessor: 'nombre',
            }
        ]
        return (
            <div>
                <StylesGeneral>
                    <Table columns={columnas} data={[{ nombre: general.departamento}]} />
                </StylesGeneral>
            </div>
        )
    }

    const createTableGerente = () => {
        const columnas = [
            {
                Header: 'Gerente',
                accessor: 'nombre',
            }
        ]


        return (
            <div>
                <StylesGeneral>
                    <Table columns={columnas} data={[{ nombre: general.gerente }]} />
                </StylesGeneral>
            </div>
        )
    }

    const getGranTotal = () => {
        let total = 0
        const meses = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ]
        for (let i = 0; i < form.length; i++) {
            for (let j = 0; j < form[i].length; j++) {
                for (let k = 0; k < meses.length; k++) {
                    total += form[i][j][meses[k]]
                }
            }
        }
        total = formatNumberCurrency(total)
        return total
    }

    const getDataGranTotal = () => {
        let aux = [{
            valor: getGranTotal()
        }]
        return aux
    }

    const createTableGranTotal = () => {
        const columnas = [
            {
                Header: 'Gran Total Anual',
                accessor: 'valor',
            }
        ]

        return (
            <div>
                <StylesGeneral>
                    <Table columns={columnas} data={getDataGranTotal()} />
                </StylesGeneral>
            </div>
        )
    }



    return (
        <>
            <div style={{ backgroundColor: 'white', padding: '2rem'}}>
                <div>
                    <h1 style={{ textAlign: 'center' }}>Infraestructura e Interiores, S.A. de C.V.</h1>
                    <h2 style={{ textAlign: 'center' }}>Presupuesto Anual 2023</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom:'5rem' }}>
                    {createTableDepartamento()}
                    {createTableGerente()}
                    {createTableGranTotal()}
                </div>
                <div style={{ marginLeft:'18vw' }}>
                    {
                        form.length >= 13 &&
                        createHeader()
                    }    
                </div>
                
                {form.length >= 13 &&
                    partidas.map((partida, index) => {
                        /* if (form[index].length > 0){
                            return createTables(partida, index)
                        } else {
                            return null
                        } */
                        return createTables(partida, index)
                    })
                }
                {/* <button onClick={handleAddBloque}>Agregar bloque</button> */}
            </div>
        </>
    )
}