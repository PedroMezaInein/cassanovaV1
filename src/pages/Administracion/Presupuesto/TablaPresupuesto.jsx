import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { useTable } from 'react-table'
import styled from 'styled-components'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import TrashIcon from '@material-ui/icons/DeleteOutline';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import { apiOptions } from '../../../functions/api'

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


export default function TablaPresupuesto(props) {
    const partidas = useSelector(state => state.opciones.areas)
    const areas = useSelector(state => state.opciones.areas)
    const departamento = useSelector(state => state.authUser.departamento.departamentos[0])
    const nombreUsuario = useSelector(state => state.authUser.user)
    const auth = useSelector(state => state.authUser.access_token)
    const [form, setForm] = useState([])
    const [general, setGeneral] = useState({
        departamento: departamento.nombre,
        departamento_id: departamento.id,
        gerente: nombreUsuario.name,
        gerente_id: nombreUsuario.id,
        colaboradores: '',
        colaboradores_id: '',
        granTotal: '',
        nomina: 0,
        colaboradores: '',
    })
    const [nominas, setNominas] = useState([])

    /*     */

    const [areasRestantes, setAreasRestantes] = useState([])
    const [formDataTabla, setFormDataTabla] = useState([])

    /*     */


    useEffect(() => {
        getNominas()
    }, [])

    const handleChangePartida = (e, index, subindex) => {
        let nuevoForm = [...form]
        nuevoForm[index][subindex].partida_id = e.target.value
        nuevoForm[index][subindex].subpartida_id = ''
        setForm(nuevoForm)
    }

    const handleChangeSubpartida = (e, index, subindex) => {
        const nuevoForm = [...form]
        nuevoForm[index][subindex].subpartida_id = e.target.value
        setForm(nuevoForm)
    }
    
    useEffect(() => {
        if (areas.length >= 13) {
            createData()
        }

        if (areas.length) { 
            setAreasRestantes(areas)
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
        suma = suma + general.nomina
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

    const nuevaTablaNativa = (index) => {
        let columnas = [
            {
                name: '',
                accessor: 'eliminar',
            },
            {
                name: 'Partida',
                accessor: 'partida',
            },
            {
                name: 'Subpartida',
                accessor: 'subpartida',
            },
            {
                name: `${sumaMes(index, 'Enero')}`,
                accessor: '1',
            },
            {
                name: `${sumaMes(index, 'Febrero')}`,
                accessor: '2',
            },
            {
                name: `${sumaMes(index, 'Marzo')}`,
                accessor: '3',
            },
            {
                name: `${sumaMes(index, 'Abril')}`,
                accessor: '4',
            },
            {
                name: `${sumaMes(index, 'Mayo')}`,
                accessor: '5',
            },
            {
                name: `${sumaMes(index, 'Junio')}`,
                accessor: '6',
            },
            {
                name: `${sumaMes(index, 'Julio')}`,
                accessor: '7',
            },
            {
                name: `${sumaMes(index, 'Agosto')}`,
                accessor: '8',
            },
            {
                name: `${sumaMes(index, 'Septiembre')}`,
                accessor: '9',
            },
            {
                name: `${sumaMes(index, 'Octubre')}`,
                accessor: '10',
            },
            {
                name: `${sumaMes(index, 'Noviembre')}`,
                accessor: '11',
            },
            {
                name: `${sumaMes(index, 'Diciembre')}`,
                accessor: '12',
            },
        ]

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {columnas.map((columna, index) => {
                                return (
                                    <th key={index}>{columna.name}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            form && form[index].length > 0 ?
                                form[index].map((fila, subindex) => {
                                    return (
                                        <tr key={subindex}>
                                            {
                                                columnas.map((columna, subindex) => {
                                                    return (
                                                        <td key={subindex}>{fila[columna.accessor]}</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                                : null

                        }
                    </tbody>
                </table>
                <button onClick={() => addNewRow(index)}>Agregar</button>
            </div>

        )
    }

    const getColumnsHeader = () => {
        let columnas = [{
            Header: 'Total mensual',
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
            ]
        }]

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
        const nuevoForm = [...form]
        nuevoForm[index][subindex][mes] = e
        /* console.log(form) */
        /* createData() */
        // return form
        setForm(nuevoForm)
    }

    const createCurrencyInput = (partida, index, mes, subindex) => {
        return (
            <div>
                {
                    form &&

                    <CurrencyTextField

                        variant="standard"
                        value={form[index]?.[subindex]?.[mes] ? form[index][subindex][mes] : ''}
                        currencySymbol="$"
                        outputFormat="number"
                        onChange={(event, value) => handleMoney(partida, index, mes, value, subindex)}
                    /* error={errores.monto ? true : false} */
                    />
                }
            </div>

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
        let id_partida
        let id_subpartida
        return (
            <div>
                <select onChange={e => handleChangePartida(e, index, subindex)} value={form[index][subindex]?.partida_id} style={{ width: '100%' }}>
                    <option value='' hidden>Seleccione una partida</option>
                    {areas?.find(partida => partida.id_area === data) && areas.find(partida => partida.id_area === data).partidas.map(partida => (
                        <option key={partida.id} value={partida.id}>{partida.nombre}</option>
                    ))}
                </select>
            </div>
        )
    }

    const createSelectInputSubpartida = (id_area, index, subindex) => {

        return (
            <div>
                {
                    form && form[index][subindex] &&
                    <select onChange={e => handleChangeSubpartida(e, index, subindex)} value={form[index][subindex]?.subpartida_id} style={{ width: '100%' }}>
                        {form[index][subindex]?.partida_id !== '' ?
                            <>
                                <option value='' hidden>habilitado</option>
                                {console.log(form[index][subindex])}
                                {
                                    areas?.find(partida => partida.id_area === id_area).partidas.find(partida => partida.id === form[index][subindex].partida_id).subpartidas.map(subpartida => (
                                        <option key={subpartida.id} value={subpartida.id}>{subpartida.nombre}</option>
                                    ))
                                }
                            </>
                            :
                            <option value='' hidden>disabled</option>
                        }
                    </select>
                }

            </div>
        )
    }



    const createTables = (partida, index) => {
        return (
            <>
                {
                    form &&
                    <div key={index}>
                        <Styles>
                            <Table columns={getColumnas(index)} data={form[index]} />
                            <button onClick={() => addNewRow(index)}>Agregar</button>
                        </Styles>

                    </div>
                }

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
                    <Table columns={columnas} data={[{ nombre: general.departamento }]} />
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

    const createTableColaboradores = () => {
        const columnas = [
            {
                Header: 'Colaboradores',
                accessor: 'nombre',
            }
        ]
        return (
            <div>
                <StylesGeneral>
                    <Table columns={columnas} data={[{ nombre: general.colaboradores }]} />
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
        total = total + (general.nomina * 12)
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
                <Styles>
                    <Table columns={columnas} data={getDataGranTotal()} />
                </Styles>
            </div>
        )
    }

    const getNominas = () => {
        try {
            apiOptions(`presupuestosdep?departamento_id=${general.departamento_id}`, auth)
                .then(res => {
                    let suma = 0
                    setNominas([...res.data.empleados])
                    for (let i = 0; i < res.data.empleados.length; i++) {
                        suma += res.data.empleados[i].nomina_imss + res.data.empleados[i].nomina_extras
                    }
                    suma = suma * 2
                    setGeneral({
                        ...general,
                        nomina: suma,
                        colaboradores: res.data.empleados.length
                    })
                })

        } catch (error) {
            console.log(error)
        }
    }

    const getDataNominas = () => {
        let suma = 0
        for (let i = 0; i < nominas.length; i++) {
            suma += nominas[i].nomina_imss + nominas[i].nomina_extras
        }
        suma = suma * 2
        let aux = [{
            nombre: 'Nóminas',
            1: formatNumberCurrency(suma),
            2: formatNumberCurrency(suma),
            3: formatNumberCurrency(suma),
            4: formatNumberCurrency(suma),
            5: formatNumberCurrency(suma),
            6: formatNumberCurrency(suma),
            7: formatNumberCurrency(suma),
            8: formatNumberCurrency(suma),
            9: formatNumberCurrency(suma),
            10: formatNumberCurrency(suma),
            11: formatNumberCurrency(suma),
            12: formatNumberCurrency(suma),
        }]
        return aux
    }

    const createTableNominas = () => {
        const aux = [{
            Header: 'Nóminas',
            columns: [
                {
                    Header: ' ',
                    accessor: '1',
                },
                {
                    Header: ' ',
                    accessor: '2',
                },
                {
                    Header: ' ',
                    accessor: '3',
                },
                {
                    Header: ' ',
                    accessor: '4',
                },
                {
                    Header: ' ',
                    accessor: '5',
                },
                {
                    Header: ' ',
                    accessor: '6',
                },
                {
                    Header: ' ',
                    accessor: '7',
                },
                {
                    Header: ' ',
                    accessor: '8',
                },
                {
                    Header: ' ',
                    accessor: '9',
                },
                {
                    Header: ' ',
                    accessor: '10',
                },
                {
                    Header: ' ',
                    accessor: '11',
                },
                {
                    Header: ' ',
                    accessor: '12',
                },
            ]
        }]

        return (
            <div>
                <Styles>
                    <Table columns={aux} data={getDataNominas()} />
                </Styles>
            </div>
        )
    }


    const handleSelectArea = (e) => {
        let aux = []
        let newTable = {}

        areasRestantes.forEach(area => {
            if (area.id_area !== e.target.value) {
                aux = [...aux, area]
            }
        })

        partidas.forEach(partida => {
            if (partida.id_area === e.target.value) {
                newTable = {
                    id_area: partida.id_area,
                    nombre: partida.nombreArea,
                    filas: [
                        {
                            id_partida: '',
                            id_subpartida: '',
                            enero: 0,
                            febrero: 0,
                            marzo: 0,
                            abril: 0,
                            mayo: 0,
                            junio: 0,
                            julio: 0,
                            agosto: 0,
                            septiembre: 0,
                            octubre: 0,
                            noviembre: 0,
                            diciembre: 0
                        }
                    ],
                    total: 0,
                    meses: {
                        enero: 0,
                        febrero: 0,
                        marzo: 0,
                        abril: 0,
                        mayo: 0,
                        junio: 0,
                        julio: 0,
                        agosto: 0,
                        septiembre: 0,
                        octubre: 0,
                        noviembre: 0,
                        diciembre: 0
                    }
                }
            }
        })
        setFormDataTabla([...formDataTabla, newTable])
        setAreasRestantes(aux)
        console.log(aux)
    }

    const generateTables = () => {

        return (
            <>
                {
                    formDataTabla.map((tabla, index) => {
                        return (
                            <div key={index}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <h3>{tabla.nombre}</h3>
                                    <button /* onClick={() => handleDeleteTable(index)} */>Eliminar</button>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Partida</th>
                                            <th>Subpartida</th>
                                            <th>Enero</th>
                                            <th>Febrero</th>
                                            <th>Marzo</th>
                                            <th>Abril</th>
                                            <th>Mayo</th>
                                            <th>Junio</th>
                                            <th>Julio</th>
                                            <th>Agosto</th>
                                            <th>Septiembre</th>
                                            <th>Octubre</th>
                                            <th>Noviembre</th>
                                            <th>Diciembre</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tabla.filas.map((fila, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                name="id_partida"
                                                                value={fila.id_partida}
                                                               /*  onChange={(e) => handleSelectPartida(e, index, tabla.id_area)} */
                                                            >
                                                                <option value="">Selecciona una partida</option>
                                                                {
                                                                    partidas.map((partida, index) => {
                                                                        return (
                                                                            <option key={index} value={partida.id_partida}>{partida.nombrePartida}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <p>Select</p>
                                                        </td>
                                                        {
                                                            Object.keys(fila).map((key, index) => {
                                                                return (
                                                                    key !== 'id_partida' && key !== 'id_subpartida' &&
                                                                    <td key={index}>
                                                                            <input
                                                                                type="number"
                                                                                name={key}
                                                                                value={fila[key]}
                                                                                /* onChange={(e) => handleInputChange(e, index, tabla.id_area)} */
                                                                            />
                                                                    </td>
                                                                )
                                                            })

                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>                                     
                                
                            </div>
                        )

                    })
                }
            </>       
        )
    }



    return (
        <>
            <div style={{ backgroundColor: 'white', padding: '2rem' }}>
                <div>
                    <h1 style={{ textAlign: 'center' }}>Infraestructura e Interiores, S.A. de C.V.</h1>
                    <h2 style={{ textAlign: 'center' }}>Presupuesto Anual 2023</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5rem' }}>
                    {createTableDepartamento()}
                    {createTableColaboradores()}
                    {createTableGerente()}
                    {createTableGranTotal()}
                </div>
                <div style={{ marginLeft: '18vw' }}>
                    {
                        form.length >= 13 &&
                        createHeader()
                    }
                    {
                        nominas.length > 0 &&
                        createTableNominas()
                    }
                </div>

                {/* {form && form.length >= 13 &&
                    partidas.map((partida, index) => {

                        return createTables(partida, index)
                    })
                } */}
                {
                    formDataTabla.length > 0 &&
                    generateTables()

                }

                {
                    areasRestantes.length > 0 &&
                    <select onChange={(e) => handleSelectArea(e)}>
                            <option value={0}>Selecciona un área</option>   
                            {
                                areasRestantes.map((area, index) => {
                                    return <option key={index} value={area.id_area}>{area.nombreArea}</option>
                                }
                                )
                            }
                    </select>
                    
                }
            </div>
        </>
    )
}