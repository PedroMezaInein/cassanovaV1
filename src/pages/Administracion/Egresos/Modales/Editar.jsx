import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import { apiOptions, apiPutForm, apiPostForm } from '../../../../functions/api'

import { setOptions } from '../../../../functions/setters'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Swal from 'sweetalert2'

import Style from './AprobarSolicitud.module.css'

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export default function Editar(props) {
    const { data } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const [opciones, setOpciones] = useState(false)
    const auth = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: data.fecha,
        departamento: data.departamento_id,
        tipoGasto: data.tipoGasto,
        tipoSubgasto: data.tipoSubgasto,
        tipoPago: data.tipoPago,
        monto: data.monto,
        descripcion: data.descripcion,
        estado: data.estado,
        id: data.id
    })
    console.log(data)
    const classes = useStyles();

    useEffect(() => {
        getOptions()
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getOptions = () => {

        apiOptions(`v2/proyectos/compras`, auth.access_token).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos, proveedores, formasPago, metodosPago, estatusFacturas } = response.data
                let aux = {}
                /* aux.empresas = setOptions(empresas, 'name', 'id')
                aux.proveedores = setOptions(proveedores, 'razon_social', 'id')
                aux.areas = setOptions(areas, 'nombre', 'id')
                aux.proyectos = setOptions(proyectos, 'nombre', 'id') */
                aux.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
                /* aux.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id')
                aux.estatusCompras = setOptions(estatusCompras, 'estatus', 'id')
                aux.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
                aux.formasPago = setOptions(formasPago, 'nombre', 'id')
                aux.metodosPago = setOptions(metodosPago, 'nombre', 'id') */
                setOpciones(aux)
            }, (error) => { }
        ).catch((error) => {})
    }

    const handleChangeDepartamento = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipoGasto: null,
            tipoSubgasto: null
        })
    }

    const handleSave = () => {
        console.log(form)
        try {
            let newForm = {
                id_departamento: form.departamento,
                id_gasto: form.tipoGasto,
                descripcion: form.descripcion,
                id_subarea: form.tipoSubgasto,
                id_pago: form.tipoPago,
                id_solicitante: data.solicitante_id,
                monto_pagado: form.monto,
            }

            apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then(
                (response) => {
                    console.log(response)
                }, (error) => { }
            ).catch((error) => {})
        } catch (error) {
            console.log(error)
        }
    }

    console.log(opciones)
    return (
        <>
            <div className={Style.container}>
                <div>
                    <TextField
                        label="Fecha de solicitud"
                        type="date"
                        name='fecha'
                        defaultValue={form.fecha}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div>
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                            <Select
                                value={form.departamento}
                                name="departamento"
                                onChange={handleChangeDepartamento}
                            >
                                {departamentos.map((item, index) => (
                                    <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                ))}

                            </Select>
                        </>
                        : null
                    }
                    
                </div>
                <div>
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                            <Select
                                value={form.tipoGasto}
                                name="tipoGasto"
                                onChange={handleChange}
                            >
                                {departamentos.find(item => item.id_area == form.departamento).partidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}

                            </Select>
                        </>
                        : null
                    }
                </div>

                <div>
                    {departamentos.length && form.tipoGasto ?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                            <Select
                                name="tipoSubgasto"
                                onChange={handleChange}
                                value={form.tipoSubgasto}
                            >
                                {departamentos.find(item => item.id_area == form.departamento).partidas.find(item => item.id == form.tipoGasto).subpartidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}

                            </Select>    
                        </>
                        : null

                    }
                    
                </div>

                <div>
                    {
                        opciones ?
                            <>
                            <InputLabel id="demo-simple-select-label">Tipo de Pago</InputLabel>
                            <Select
                                name="tipoPago"
                                value={form.tipoPago}
                                onChange={handleChange}
                                >
                                    {opciones.tiposPagos.map((item, index) => (
                                    <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                ))}

                            </Select>    
                            </>
                            : null
                    }
                    
                </div>
                <div>
                    <TextField
                        name='monto'
                        label="Monto solicitado"
                        type="number"
                        defaultValue={form.monto}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                <div>
                    <button onClick={handleSave}>Guardar</button>
                    </div>

            </div>
        </>
        )
        
}