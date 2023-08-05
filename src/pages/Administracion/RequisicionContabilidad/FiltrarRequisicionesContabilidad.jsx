import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

import { apiPostForm } from '../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import Style from './../../../components/forms/administracion/NuevaRequisicion.module.css'

export default function FiltrarRequisicionesContabilidad(props) {
    const { handleClose, reload, opciones, estatusCompras, filtrarTabla, borrarTabla } = props
    const user = useSelector(state => state.authUser)
    const departamento = useSelector(state => state.authUser.departamento)
    const departamentos = useSelector(state => state.opciones.areas)
    const presupuestos = useSelector(state => state.opciones.presupuestos)
    const [state, setState] = useState({
        orden_compra: '',
        solicitante: '',
        fecha:'',
        departamento: departamento.departamentos[0].id,
        tipoGasto: '', //partida
        tipoPago: '',
        monto: '',
        estatus: '',
    });
    
    const [errores, setErrores] = useState({})

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const handleChangeFecha = (date, tipo) => {
        setState({
            ...state,
            [tipo]: new Date(date)
        })
    };

    function formatDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '/' + month + '/' + day;
      }

    const enviar = () =>{
        // if(validateForm()){
        if(true){


            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
            try {
                let dataForm = new FormData()

                let newForm = {
                    id_solicitante: state.solicitante,
                    id_departamento: state.departamento,
                    id_gasto: state.tipo_gasto,
                    descripcion: state.descripcion,
                    fecha: formatDate(state.fecha),
                    solicitud: state.solicitud,
                    presupuesto: state.presupuesto
                }

                let aux = Object.keys(newForm)

                aux.forEach((element) => {
                    switch (element) {
                        case 'adjuntos':
                            break;
                        default:
                            dataForm.append(element, newForm[element])
                            break
                    }
                })

                dataForm.append(`files_name_requisicion[]`, 'requisicion01')
                dataForm.append(`files_requisicion[]`, state.solicitud)
                dataForm.append('adjuntos[]', "requisicion")


                apiPostForm('requisicion', dataForm, user.access_token)
                    .then((data) => {
                        Swal.fire({
                            title: 'Requisicion enviada',
                            text: 'La requisicion se ha enviado correctamente',
                            icon: 'success',
                            showConfirmButton: true,
                            timer: 2000,
                        }).then(() => {
                            if (reload) {
                                reload.reload()
                            }
                            handleClose()
                        })

                        /* if (data.isConfirmed) {
                            let form = {
                                solicitante: user.user.id,
                                fecha: '',
                                departamento: '',
                                tipo_gasto: '',
                                descripcion: '',
                                solicitud: ''
                            }
                            console.log('form')
                            console.log(form)
                        } */

                        /* else if (data.isDenied) {
                            Swal.fire('Faltan campos', '', 'info')
                        } */
                    })
                    .catch((error) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error 1',
                        })
                        console.log(error)
                    })
            } catch (error) { 
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error 2',
                })
                console.log(error)
            }
        } else{
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    const handleChangeDepartamento = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
            tipo_gasto: null,
        })
    }

    const handleMoney = (e) => {
        setState({
            ...state,
            monto: e
        })
    }

    const borrar = () => {
        filtrarTabla('')   
        borrarTabla(false)
        handleClose()
    }

    return (
        <>
            <div className={Style.container}>
                <div style={{marginLeft:'2rem'}}>

                    <div>
                        <TextField
                            label="N. Orden de compra"
                            name='orden_compra'
                            style={{width:'125px'}}
                            defaultValue={state.orden_compra}
                            // className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <TextField 
                            style={{width:'125px'}}
                            label="Solicitante"
                            type="text"
                            defaultValue={user.user.name}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </div>

                    <div className={Style.nuevaRequisicion}>
                        <InputLabel>Fecha</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid>
                                <KeyboardDatePicker
                                    style={{width:'125px'}}
                                    // className={Style.select}
                                    format="dd/MM/yyyy"
                                    name='fecha'
                                    value={state.fecha !=='' ? state.fecha : null}
                                    onChange={e=>handleChangeFecha(e,'fecha')}
                                    // defaultValue={state.fecha}
                                    placeholder="dd/mm/yyyy"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    
                    <div >
                        {departamentos.length > 0 ?
                            <>
                                <InputLabel>Departamento</InputLabel>
                                <Select
                                    style={{width:'125px'}}
                                    // className={Style.select}
                                    value={state.departamento}
                                    name="departamento"
                                    onChange={handleChangeDepartamento}
                                    // disabled={user.user.tipo.id ==1 ? false : true}
                                >
                                    {departamentos.map((item, index) => (
                                        <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                        }
                    </div>

                </div>

                <div className={Style.nuevaRequisicion_segundoBloque}>
                    
                    <div>
                        {departamentos.length > 0 && state.departamento !== '' ?
                            <>
                                <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                                <Select
                                    style={{width:'125px'}}
                                    value={state.tipoGasto}
                                    name="tipoGasto"
                                    onChange={handleChange}
                                    // className={classes.textField}
                                >
                                    {departamentos.find(item => item.id_area == state.departamento).partidas.map((item, index) => (
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
                                        style={{width:'125px'}}
                                        name="tipoPago"
                                        value={state.tipoPago}
                                        onChange={handleChange}
                                        // className={classes.textField}
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
                    <CurrencyTextField
                        style={{width:'125px'}}
                        label="monto pagado"
                        variant="standard"
                        value={state.monto}
                        currencySymbol="$"
                        outputFormat="number"
                        onChange={(event, value) => handleMoney(value)}
                    />
                    </div>

                    <div>
                        {
                            estatusCompras ?
                                <>
                                    <InputLabel id="demo-simple-select-label">Estatus de entrega</InputLabel>
                                    <Select
                                        style={{width:'125px'}}
                                        name="estatus"
                                        value={state.estatus}
                                        onChange={handleChange}
                                        // className={classes.textField}
                                    >
                                        {estatusCompras.map((item, index) => {
                                            if (item.nivel === 1) {
                                                return <MenuItem key={index} value={item.id}>{item.estatus}</MenuItem>
                                            }
                                        })}
                                    </Select>
                                </>
                            : null
                        }

                    </div>
                        
                </div>

            </div>

            <div style={{marginTop:'3rem'}}>
                <div className="row justify-content-end mt-n18" >
                    <div className="col-md-4">
                        <button className={Style.borrarButton}  onClick={borrar}>Borrar</button>
                    </div>

                    <div className="col-md-3"></div>

                    <div className="col-md-3">
                        <button className={Style.sendButton} onClick={enviar}>Agregar</button>
                    </div>
                </div>
                
            </div>
        </>
        

    );  
}