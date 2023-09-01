import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import $ from 'jquery'
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';

import { apiPostForm } from "../../../functions/api";
import Style from './estilo.module.css'

import '../../../styles/_comunicados.scss'

export default function SubirComunicado({getinfo, handleClose}){
    const authUser = useSelector(state => state.authUser.access_token)
    const [form, setForm] = useState({
        name: '',
        file: '',
        date: '',
        comunicado: {
            files: [],
            value: '',
            placeholder: 'Adjunto comunicado',
        }
    })
    const [validated, setValidated] = useState(false)

    const hanldelChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = () => {
        let error = true
        if(form.name === ''){
            error = false
        }
        if(form.file === ''){
            error = false
        }
        if(form.date === ''){
            error = false
        }
        setValidated(error)
        return error
    }

    const handleSubmit = (e) => {
        // e.preventDefault()

        if(validateForm()){
            let data = new FormData();
            let aux = Object.keys(form)

            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
                
            })

            data.append(`files_name_comunicado[]`, form.name)
            data.append(`files_comunicado[]`, form.file)
            data.append('adjuntos[]', "comunicado")
            /* let fecha = form.fecha;
            let result = fecha.toISOString();  */
            data.append('fecha', new Date(form.date).toDateString())
            data.append('nombre', form.name)

            try {
                handleClose()
                Swal.fire({
                    title: 'Subiendo comunicado',
                    text: 'Espere por favor',
                    showConfirmButton: false,
                    timer: 1500,
                })
                apiPostForm('comunicado', data, authUser)
                .then(res => {
                    getinfo()
                    Swal.fire({
                        title: 'Correcto',
                        text: 'El comunicado se subió correctamente',
                        showConfirmButton: false,
                        timer: 3500,
                    })
                })
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir el comunicado',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

    const handleFile = (e) => {
        setForm({
            ...form,
            file: e.target.files[0]
        })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    }

    return(
        <>
        <div className="kanban-container">

            {/* <div className="container-modal"> */}
                <div className="position-relative">

                        <InputLabel id="demo-simple-select-label">Nombre de cominucado</InputLabel>

                        <div>
                                {/* <InputLabel >Nombre del presupuesto</InputLabel> */}
                                <TextField
                                    name='name'
                                    type="text"
                                    defaultValue={form.name}
                                    onChange={hanldelChange}
                                    InputLabelProps={{
                                        shrink: true,
                                }}
                            />
                        </div>  

                    {/* <header className="kanban-board-header light-info">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" id="name" name="name"  value={form.name} onChange={hanldelChange}/>
                    </header> */}
                    
                        <InputLabel >Fecha</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="date"
                                    value={form.date !== '' ? form.date : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'date')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                {/* <div className="position-relative">
                    <header className="kanban-board-header light-info">
                    <label htmlFor="date">Fecha</label>
                    <input type="date" id="date" name="date" value={form.date} onChange={hanldelChange}/>
                    </header>
                </div> */}
                {/* <div className="input-gray">
                  
                </div>
                <div className="input-gray">
                   
                </div> */}
            {/* </div> */}

            <div>
                <div className="send-comunicado file">

                    <label htmlFor="file">Selecciona el Comunicado</label>
                    <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                    <div>
                        {form.file.name ? <div className="file-name">{form.file.name}</div> : 'No hay archivo seleccionado'}
                    </div>

                </div>

                <div className="row justify-content-end">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={() => handleSubmit()} variant="contained" color="primary">Subir</button>
                    </div>
                </div>
                {/* <div className="btn-subir">
                    <button onClick={handleSubmit}>Subir</button>
                </div>   */}
            </div>
        </div>

        </>
        
    )
}