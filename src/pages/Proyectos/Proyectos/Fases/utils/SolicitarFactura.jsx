import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import Swal from 'sweetalert2'
import { apiPostForm } from '../../../../../functions/api'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Style from './Compra.module.css';

export default function SolicitarFactura(props) {
    const user = useSelector((state) => state.authUser);
    const {proyecto, opciones} = props;
    const [form, setForm] = useState({
        cliente_id: proyecto.cliente_id,
        clientes: proyecto.clientes ? proyecto.clientes : [],
        formaPago_id: 3,
        metodoPago_id: 1,
        tipoPago_id: 4,
        estatusFactura_id: 1,
        monto: 0,
    })

    console.log(opciones)

    useEffect(() => {
        
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = (e) => { 
        Swal.fire({
            title: '¿Estás seguro de solicitar la factura?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, solicitar factura'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '¡Factura solicitada!',
                    'La factura se ha solicitado correctamente.',
                    'success'
                )
                try {
                    apiPostForm('facturas', form, user.access_token)
                } catch (error) {

                }
            }
        })
    }


    return (
        <div>
            <div className={Style.container}>
                <div>
                    <div>
                        <InputLabel>Cliente</InputLabel>
                        <Select
                            value={form.cliente_id}
                            name='cliente_id'
                            labelId="label-select-Tipo"
                            onChange={handleChange}
                        >
                            {form.clientes.map((item, index) => {
                                return (<MenuItem key={index} value={item.id} >{item.empresa}</MenuItem>)
                            })}

                        </Select>
                    </div>

                    <div>
                        <InputLabel>Forma de pago</InputLabel>
                        <Select
                            value={form.formaPago_id}
                            name='formaPago_id'
                            labelId="label-select-Tipo"
                            onChange={handleChange}
                        >
                            {opciones.formasPago.map((item, index) => {
                                return (<MenuItem key={index} value={item.value} >{item.name}</MenuItem>)
                            })}

                        </Select>
                    </div>

{/*                     <div>
                        <InputLabel>Forma de pago</InputLabel>
                        <Select
                            value={form.metodoPago_id}
                            name='metodoPago_id'
                            labelId="label-select-Tipo"
                            onChange={handleChange}
                        >
                            {opciones.metodosPago.map((item, index) => {
                                return (<MenuItem key={index} value={item.value} >{item.name}</MenuItem>)
                            })}

                        </Select>
                    </div> */}

                </div>

                <div>
                    <div>
                        <InputLabel>Tipo de pago</InputLabel>
                        <Select
                            value={form.tipoPago_id}
                            name='tipoPago_id'
                            labelId="label-select-Tipo"
                            onChange={handleChange}
                        >
                            {opciones.tiposPagos.map((item, index) => {
                                return (<MenuItem key={index} value={item.value} >{item.name}</MenuItem>)
                            })}

                        </Select>
                    </div>

                    <div>
                        <InputLabel>Estatus de factura</InputLabel>
                        <Select
                            value={form.estatusFactura_id}
                            name='estatusFactura_id'
                            labelId="label-select-Tipo"
                            onChange={handleChange}
                        >
                            {opciones.estatusFacturas.map((item, index) => {
                                return (<MenuItem key={index} value={item.value} >{item.name}</MenuItem>)
                            })}

                        </Select>
                    </div>

                    <div>
                        <TextField
                            name="monto"
                            value={form.costo}
                            label="Monto con IVA"
                            color='primary'
                            onChange={handleChange}
                            type='number'
                            placeholder='$0.00'
                        />
                    </div>
                </div>
            </div>
            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button onClick={handleSubmit} className={Style.sendButton}>Solicitar</button>
                </div>
            </div>
        </div>
    )
}