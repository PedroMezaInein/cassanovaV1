import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { useTable } from 'react-table'
import styled from 'styled-components'

import Swal from 'sweetalert2'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import TrashIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import InputLabel from '@material-ui/core/InputLabel';

import { apiOptions, apiPostForm } from '../../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';

import Style from './TablaPresupuesto.module.css'

import { waitAlert2 } from '../../../../functions/alert'

const Styles = styled.div`
 
  table {
    border-spacing: 0;
    border: 1px solid black;
    background-color: white;
    width: 102%;

    tr {
        min-width: 4vw;
      max-width: 6vw;
      :last-child {
        td {
            border-bottom: 0;
        }
      }
      
    }

    th{
        background: #9CC4E4;
    }
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      min-width: 4vw;
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
        background: #9CC4E4;
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
    const { reload, handleClose } = props
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
        fecha_inicio: '',
        fecha_fin: '',
        nombre: '',
    })
    /* const [nominas, setNominas] = useState([]) */

    /*     */

    const [areasRestantes, setAreasRestantes] = useState([])
    const [formDataTabla, setFormDataTabla] = useState([])

    /*     */


    useEffect(() => {
        getNominas()
    }, [])

    const handleChangePartida = (e, index, subindex) => {
        let nuevoForm = [...formDataTabla]
        nuevoForm[index].filas[subindex].id_partida = e.target.value
        setFormDataTabla(nuevoForm)
    }

    const handleChangeSubpartida = (e, index, subindex) => {
        const nuevoForm = [...formDataTabla]
        nuevoForm[index].filas[subindex].id_subpartida = e.target.value
        setFormDataTabla(nuevoForm)
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
        for (let i = 0; i < formDataTabla[index].filas.length; i++) {
            if (Object.keys(formDataTabla[index].filas[i]) !== 'id_partida' && Object.keys(formDataTabla[index].filas[i]) !== 'id_subpartida') {
                suma += formDataTabla[index].filas[i][mes]
            }

        }
        suma = formatNumberCurrency(suma)

        return suma

    }

    const sumaTotalFila = (index, subindex) => {
        let suma = 0
        suma += formDataTabla[index].filas[subindex].enero
        suma += formDataTabla[index].filas[subindex].febrero
        suma += formDataTabla[index].filas[subindex].marzo
        suma += formDataTabla[index].filas[subindex].abril
        suma += formDataTabla[index].filas[subindex].mayo
        suma += formDataTabla[index].filas[subindex].junio
        suma += formDataTabla[index].filas[subindex].julio
        suma += formDataTabla[index].filas[subindex].agosto
        suma += formDataTabla[index].filas[subindex].septiembre
        suma += formDataTabla[index].filas[subindex].octubre
        suma += formDataTabla[index].filas[subindex].noviembre
        suma += formDataTabla[index].filas[subindex].diciembre
        suma = formatNumberCurrency(suma)
        return suma
    }

    const getSumaMeses = (mes) => {
        let suma = 0
        formDataTabla.forEach((tabla) => {
            tabla.filas.forEach((fila) => {
                if (Object.keys(fila) !== 'id_partida' && Object.keys(fila) !== 'id_subpartida') {
                    suma += fila[mes]
                }
            })
        })
        /* suma = suma + general.nomina */
        suma = formatNumberCurrency(suma)
        return suma
    }

    const sumaTabla = (index) => {
        let suma = 0
        for (let i = 0; i < formDataTabla[index].filas.length; i++) {
            if (Object.keys(formDataTabla[index].filas[i]) !== 'id_partida' && Object.keys(formDataTabla[index].filas[i]) !== 'id_subpartida') {
                suma += formDataTabla[index].filas[i].enero
                suma += formDataTabla[index].filas[i].febrero
                suma += formDataTabla[index].filas[i].marzo
                suma += formDataTabla[index].filas[i].abril
                suma += formDataTabla[index].filas[i].mayo
                suma += formDataTabla[index].filas[i].junio
                suma += formDataTabla[index].filas[i].julio
                suma += formDataTabla[index].filas[i].agosto
                suma += formDataTabla[index].filas[i].septiembre
                suma += formDataTabla[index].filas[i].octubre
                suma += formDataTabla[index].filas[i].noviembre
                suma += formDataTabla[index].filas[i].diciembre
            }
        }
        suma = formatNumberCurrency(suma)
        return suma
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
                {
                    Header: 'Total',
                    accessor: 'total',
                }
            ]
        }]

        return columnas
    }

    const handleMoney = (indexTabla, indexFila, key, value) => {
        const nuevoForm = [...formDataTabla]
        nuevoForm[indexTabla].filas[indexFila][key] = value
        setFormDataTabla(nuevoForm)
    }

    const createCurrencyInput = (fila, indexTabla, indexFila, key) => {
        return (
            <CurrencyTextField

                variant="standard"
                value={formDataTabla[indexTabla].filas[indexFila][key]}
                currencySymbol="$"
                outputFormat="number"
                onChange={(event, value) => handleMoney(indexTabla, indexFila, key, value)}
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

    const getDataHeader = (index) => {
        let aux = [{
            id: 0,
            1: getSumaMeses('enero'),
            2: getSumaMeses('febrero'),
            3: getSumaMeses('marzo'),
            4: getSumaMeses('abril'),
            5: getSumaMeses('mayo'),
            6: getSumaMeses('junio'),
            7: getSumaMeses('julio'),
            8: getSumaMeses('agosto'),
            9: getSumaMeses('septiembre'),
            10: getSumaMeses('octubre'),
            11: getSumaMeses('noviembre'),
            12: getSumaMeses('diciembre'),
            total: getGranTotal(),

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

    const nuevaFila = (index) => {
        let aux = [...formDataTabla]
        aux[index].filas.push({
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
            diciembre: 0,
        })
        setFormDataTabla(aux)
    }

    const eliminarFila = (index, subindex) => {
        let aux = [...formDataTabla]
        aux[index].filas.splice(subindex, 1)
        setFormDataTabla(aux)
    }

    const selectPartidas = (index, subindex) => {
        return (
            <div>

                <Select
                    value={formDataTabla[index].filas[subindex].id_partida}
                    onChange={e => handleChangePartida(e, index, subindex)}
                    style={{ maxWidth: '5vw' }}
                >
                    <MenuItem value='' hidden>partida</MenuItem>
                    {areas.find(partida => partida.id_area === formDataTabla[index].id_area).partidas.map(partida => (
                        <MenuItem key={partida.id} value={partida.id}>{partida.nombre}</MenuItem>
                    ))}
                </Select>

            </div>
        )
    }

    const selectSubpartida = (index, subindex) => {
        return (
            <div>
                {
                    formDataTabla[index].filas[subindex].id_partida !== '' &&
                    <Select
                        value={formDataTabla[index].filas[subindex].id_subpartida}
                        onChange={e => handleChangeSubpartida(e, index, subindex)}
                        style={{ maxWidth: '5vw' }}

                    >
                        <MenuItem value='' hidden>subpartida</MenuItem>
                        {areas.find(partida => partida.id_area === formDataTabla[index].id_area).partidas.find(partida => partida.id === formDataTabla[index].filas[subindex].id_partida).subpartidas.map(subpartida => (
                            <MenuItem key={subpartida.id} value={subpartida.id}>{subpartida.nombre}</MenuItem>
                        ))}
                    </Select>
                }

            </div>
        )
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
        let suma = 0
        for (let i = 0; i < formDataTabla.length; i++) {
            for (let j = 0; j < formDataTabla[i].filas.length; j++) {
                suma += formDataTabla[i].filas[j].enero
                suma += formDataTabla[i].filas[j].febrero
                suma += formDataTabla[i].filas[j].marzo
                suma += formDataTabla[i].filas[j].abril
                suma += formDataTabla[i].filas[j].mayo
                suma += formDataTabla[i].filas[j].junio
                suma += formDataTabla[i].filas[j].julio
                suma += formDataTabla[i].filas[j].agosto
                suma += formDataTabla[i].filas[j].septiembre
                suma += formDataTabla[i].filas[j].octubre
                suma += formDataTabla[i].filas[j].noviembre
                suma += formDataTabla[i].filas[j].diciembre
            }
        }
        /* suma = suma + (general.nomina * 12) */
        suma = formatNumberCurrency(suma)
        return suma
    }

    const getGranTotalR = () => {
        let suma = 0
        for (let i = 0; i < formDataTabla.length; i++) {
            for (let j = 0; j < formDataTabla[i].filas.length; j++) {
                suma += formDataTabla[i].filas[j].enero
                suma += formDataTabla[i].filas[j].febrero
                suma += formDataTabla[i].filas[j].marzo
                suma += formDataTabla[i].filas[j].abril
                suma += formDataTabla[i].filas[j].mayo
                suma += formDataTabla[i].filas[j].junio
                suma += formDataTabla[i].filas[j].julio
                suma += formDataTabla[i].filas[j].agosto
                suma += formDataTabla[i].filas[j].septiembre
                suma += formDataTabla[i].filas[j].octubre
                suma += formDataTabla[i].filas[j].noviembre
                suma += formDataTabla[i].filas[j].diciembre
            }
        }
        /* suma = suma + (general.nomina * 12) */
        return suma
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
        waitAlert2()
        try {
            apiOptions(`presupuestosdep?departamento_id=${general.departamento_id}`, auth)
                .then(res => {
                    let suma = 0
                    /* setNominas([...res.data.empleados]) */
                    for (let i = 0; i < res.data.empleados.length; i++) {
                        suma += res.data.empleados[i].nomina_imss + res.data.empleados[i].nomina_extras
                    }
                    suma = suma * 2
                    setGeneral({
                        ...general,
                        nomina: suma,
                        colaboradores: res.data.empleados.length
                    })
                    Swal.close()
                })

        } catch (error) {
            Swal.close()
            console.log(error)
        }
    }

    const sendPresupuesto = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se creará el presupuesto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Creando presupuesto',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                })
                try {
                    let aux = {
                        tipo: 'crear',
                        data: formDataTabla,
                        fecha_inicio: general.fecha_inicio,
                        fecha_fin: general.fecha_fin,
                        total: getGranTotalR(),
                        id_departamento: general.departamento_id,
                        colaboradores: general.colaboradores,
                        nombre: general.nombre,
                        tab: "departamento"
                    }
                    apiPostForm(`presupuestosdep?departamento_id=${general.departamento_id}`, aux, auth)
                        .then(res => {
                            Swal.close()
                            Swal.fire({
                                icon: 'success',
                                title: 'Presupuesto creado con éxito',
                                timer: 2000
                            }).then(() => {
                                if (reload) {
                                    reload.reload()
                                }
                                handleClose()
                            })

                        })
                } catch (error) {
                    Swal.close()
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al crear el presupuesto',
                        timer: 2000
                    })
                }
            }
        })
    }

    const handleSelectArea = (e) => {
        let aux = []
        let newTable = {}

        areasRestantes.forEach(area => {
            if (area.id_area !== e.target.value) {
                aux = [...aux, area]
            }
        })

        setAreasRestantes(aux)

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
                }
            }
        })
        setFormDataTabla([...formDataTabla, newTable])
    }

    const handleDeleteTable = (index) => {
        Swal.fire({
            title: '¿Estás seguro de eliminar la tabla de ' + formDataTabla[index].nombre + '?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let aux = [...formDataTabla]
                let addArea = partidas.filter(partida => partida.id_area === aux[index].id_area)
                setAreasRestantes([...areasRestantes, addArea[0]])
                aux.splice(index, 1)
                setFormDataTabla(aux)
            }
        })
    }

    console.log(formDataTabla)

    const generateTables = () => {

        return (
            <>
                {
                    formDataTabla.sort((a, b) => a.nombre > b.nombre ? 1 : -1).map((tabla, indexTabla) => {
                        return (
                            <div key={indexTabla} style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', justifyContent: 'center' }}>
                                    <div><TrashIcon onClick={() => handleDeleteTable(indexTabla)} style={{ cursor: 'pointer', color: 'red', fontSize: '20px' }} /></div>
                                    <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0 10px' }}>

                                        <div>
                                            {tabla.nombre}
                                        </div>
                                        <div style={{ marginLeft: '10px' }}>
                                            {sumaTabla(indexTabla)}
                                        </div>
                                    </h3>

                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Gasto</th>
                                            <th>Subgasto</th>
                                            <th>enero <br /> {sumaMes(indexTabla, 'enero')}</th>
                                            <th>Febrero <br /> {sumaMes(indexTabla, 'febrero')}</th>
                                            <th>Marzo <br /> {sumaMes(indexTabla, 'marzo')}</th>
                                            <th>Abril <br /> {sumaMes(indexTabla, 'abril')}</th>
                                            <th>Mayo <br /> {sumaMes(indexTabla, 'mayo')}</th>
                                            <th>Junio <br /> {sumaMes(indexTabla, 'junio')}</th>
                                            <th>Julio <br /> {sumaMes(indexTabla, 'julio')}</th>
                                            <th>Agosto <br /> {sumaMes(indexTabla, 'agosto')}</th>
                                            <th>Septiembre <br /> {sumaMes(indexTabla, 'septiembre')}</th>
                                            <th>Octubre <br /> {sumaMes(indexTabla, 'octubre')}</th>
                                            <th>Noviembre <br /> {sumaMes(indexTabla, 'noviembre')}</th>
                                            <th>Diciembre <br /> {sumaMes(indexTabla, 'diciembre')}</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tabla.filas.map((fila, indexFila) => {
                                                return (
                                                    <tr key={indexFila}>
                                                        <td>
                                                            <center>
                                                                <TrashIcon onClick={() => eliminarFila(indexTabla, indexFila)} style={{ cursor: 'pointer', color: 'red' }} />
                                                            </center>
                                                        </td>
                                                        <td>
                                                            {selectPartidas(indexTabla, indexFila)}
                                                        </td>
                                                        <td>
                                                            {selectSubpartida(indexTabla, indexFila)}
                                                        </td>
                                                        {
                                                            Object.keys(fila).map((key, index) => {
                                                                return (
                                                                    key !== 'id_partida' && key !== 'id_subpartida' &&
                                                                    <td key={index}>
                                                                        {createCurrencyInput(fila, indexTabla, indexFila, key)}
                                                                    </td>
                                                                )
                                                            })

                                                        }
                                                        <td>
                                                            {sumaTotalFila(indexTabla, indexFila)}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <AddIcon onClick={() => nuevaFila(indexTabla)} style={{ cursor: 'pointer', color: 'green', fontSize: '25px', alignSelf: 'flex-start', marginTop: '10px', marginBottom: '10px' }} />

                            </div>
                        )

                    })
                }
            </>
        )
    }


    const handleChangeFecha = (date, tipo) => {
        setGeneral({
            ...general,
            [tipo]: new Date(date)
        })
    };

    const handleChangeNombre = (e) => {
        setGeneral({
            ...general,
            nombre: e.target.value
        })
    }

    return (
        <>
            <div style={{ backgroundColor: 'white', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ textAlign: 'center' }}>Infraestructura e Interiores, S.A. de C.V.</h1>
                    <h2 style={{ textAlign: 'center' }}>Presupuesto Anual</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5rem' }}>
                    {createTableDepartamento()}
                    {createTableColaboradores()}
                    {createTableGerente()}
                    {createTableGranTotal()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5rem' }}>
                    <div>
                        <InputLabel >Fecha Inicio</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_pago"
                                    value={general.fecha_inicio !== '' ? general.fecha_inicio : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_inicio')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel >Fecha Fin</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_pago"
                                    value={general.fecha_fin !== '' ? general.fecha_fin : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_fin')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel >Nombre del presupuesto</InputLabel>
                        <TextField
                            name='nombre'
                            type="text"
                            defaultValue={general.nombre}
                            onChange={handleChangeNombre}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>

                </div>

                <div style={{ marginLeft: '18vw' }}>
                    {
                        form.length >= 13 &&
                        createHeader()
                    }

                </div>
                <Styles>
                    {
                        formDataTabla.length > 0 &&
                        generateTables()
                    }
                </Styles>


                {
                    areasRestantes.length > 0 &&
                    <Select onChange={(e) => handleSelectArea(e)} value={0}>
                        <MenuItem value={0} hidden>Selecciona departamento</MenuItem>
                        {
                            areasRestantes.sort((a, b) => a.nombreArea > b.nombreArea ? 1 : -1).map((area, index) => {
                                return <MenuItem key={index} value={area.id_area}>{area.nombreArea}</MenuItem>
                            })
                        }
                    </Select>

                }

                <div className="row justify-content-end">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={() => sendPresupuesto()} variant="contained" color="primary">Crear</button>
                    </div>
                </div>

            </div>

        </>
    )
}