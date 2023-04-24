import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { Modal } from '../../../components/singles'
import { apiPutForm } from '../../../functions/api'
import ModalModificarSubGasto from './ModalModificarSubGasto'

import './AreaStyle/_agregarGasto.scss'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function ModalEditarGastos (props) {
    const classes = useStyles();

    const {data, handleClose, reload} = props
    console.log(data)
    const user = useSelector(state => state.authUser)

    const [form, setForm] = useState({
        area: data.nombreArea,
        partida: data.partida.nombre,
        subPartida: '',// en este se guarda la informacion que se esta escribiendo
        auxSubPartida: [], // aqui se guardan cuando doy enter
        arraySubPartidas: [...data.partida.subpartidas], // este me sirve para mostrar todas las subpartidas, tanto las que ya existen como las nuevas
    })

    const [modal, setModal] = useState({
        modificarSubGasto: {
            show: false,
            data: false
        }
    })

    const [reloadTable, setReloadTable] = useState()

    const [errores, setErrores] = useState({})

    const handleChange=(e)=>{
        if(e.target.value.replace(/\s/g, '').length > 0){
            setForm({
                ...form,
                [e.target.name]:e.target.value.toUpperCase(),
            })    
        } else if(e.target.value.replace(/\s/g, '').length === 0){
            setForm({
                ...form,
                [e.target.name]:'',
            })    
        }
    }

    const handleEnterSub=(e)=>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                arraySubPartidas: [...form.arraySubPartidas, e.target.value],
                subPartida:'',
                auxSubPartida: [...form.auxSubPartida, e.target.value ]
            })
        }
    }

    const handleOpenPartida = (info) =>{
        console.log(info)
        setModal({
            ...modal,
            modificarSubGasto:{
                show:true,
                data: info
            }
        })
    }

    const handleDeletePartida = ()=>{
        setForm({
            ...form,
            partida:''
        })
    }

    const handleDeleteArea = ()=>{
        setForm({
            ...form,
            area:''
        })
    }

    const handleDeleteSub= (e) =>{
        const indiceSub = form.arraySubPartidas.findIndex(sub => {
            if(sub.nombre){
                
            } else {
                if(sub === e){
                    return sub
                }
            }
        })

        const auxIndiceSub = form.auxSubPartida.findIndex(sub => {
            if(sub.nombre){
                
            } else {
                if(sub === e){
                    return sub
                }
            }
        })


        let newSub = [...form.arraySubPartidas]
        newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        let aux = [...form.auxSubPartida]
        aux.splice(auxIndiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        setForm({
            ...form,
            arraySubPartidas: newSub,
            auxSubPartida: aux
        })
    }

    const validateForm = () => {
        let validar = true
        let error = {}

        if(form.area === ''){
            error.area = 'Crea un área'
            validar = false
        }
        if(form.partida === '' || form.partida === null){
            error.partida = 'Crea una partida'
            validar = false
        }
        if(form.arraySubPartidas.length === 0){
            error.subPartidas = 'Crea una o varias sub partidas'
            validar = false
        }
        setErrores (error)
        return validar
    }

    const handleCloseGastos = (tipo) => {
        setModal({
            ...modal,
            [tipo]:{
                ...modal[tipo],
                show: false,
            }
        })
    }

    const submit = () =>{
        if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 

            let newForm = {
                area: form.area,
                id_area: data.id,
                partida: form.partida,
                id_partida: data.partida.id,
                subareas: form.auxSubPartida,
                tipo: 'gastos',
                // subareasEditable: [],
                // subareas: form.arraySubPartidas.map((item, index) => {
                //     return item.nombre
                // }),
                // tipo: 'egresos'
            }
 
            apiPutForm(`v2/catalogos/areas/${data.id}`, newForm, user.access_token)
            .then((data)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'editar gasto',
                    text: 'Se ha editado correctamente',
                    timer: 2000,
                    timerProgressBar: true,
                })
                handleClose()
                if(reload){
                    reload.reload()
                }  
                
            })
            .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            })
        }// 
        else{
            Swal.fire({
                title: 'Error',
                text: 'Favor de llenar todos los campos',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    return (
        <>
            <div className='titulo_gasto'>al escribir una nueva área o partida, presiona enter para que esta sea creada</div>

            <div className='gasto_area'>

                <div>
                    <FormControl className='editar_comentario'>
                        <TextField 
                            label="área"
                            style={{ margin: 8 }}
                            onChange={handleChange}
                            onKeyPress={handleChange}
                            margin="normal"
                            name='area'
                            defaultValue={form.area}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            error={errores.area ? true : false}

                        />
                    </FormControl> 

                    <div className='etiqueta_gasto'>
                        {
                            form.area !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span onClick={e=>{handleDeleteArea(e)}}>X</span>{form.area}
                                    </span>
                                </div>
                            : null
                        }
                    </div> 
                </div>

                <div>
                    <FormControl className='editar_comentario'>
                        <TextField 
                            label="partida"
                            style={{ margin: 8 }}
                            onChange={handleChange}
                            onKeyPress={handleChange}
                            margin="normal"
                            name='partida'
                            defaultValue={form.partida}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            error={errores.partida ? true : false}
                        />
                    </FormControl> 

                    <div className='etiqueta_gasto'>
                        {
                            form.partida !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida}
                                    </span>
                                </div>
                            : null
                        }
                    </div> 
                </div>

            </div>

            {/* SUBPARTIDA */}

            {/* <form className={classes.root} noValidate autoComplete="off">
          
                <TextField 
                    // id="outlined-helperText"
                    label="Helper text"
                    // defaultValue="Default Value"
                    helperText="Some important text"
                    variant="outlined"
                    name='subPartida' 
                    type='text' 
                    placeholder="Enter para crear subpartida"
                    value={form.subPartida} 
                    onKeyPress={handleEnterSub}  
                    onChange={handleChange}
                />
            </form> */}

            <div className='subpartida_gasto'>
                <label>Subpartida</label>
                <input 
                    className=''
                    name='subPartida' 
                    type='text' 
                    placeholder="Enter para crear subpartida"
                    value={form.subPartida} 
                    onKeyPress={handleEnterSub}  
                    onChange={handleChange}
                    // error={errores.subPartidas ? true : false}
                    >
                </input>

                <div className='gasto_etiqueta'>
                    {
                        form.arraySubPartidas.length > 0 ? 
                            form.arraySubPartidas.map((item,index) => {
                                if(item.nombre){
                                    return <span key={index} className='sub_partida'>
                                                <span className='sub_eliminar' onClick={()=>{handleOpenPartida(item)}}>X</span>
                                                <span className=''>{item.nombre}</span>
                                            </span>
                                } else{
                                    return <span key={index} className='sub_partida'>
                                                <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(item)}>X</span>
                                                <span className=''>{item}</span>
                                            </span>
                                }
                            })
                        : <div>No hay su partidas</div>
                    }  
                </div> 
            </div>

            <div className='gasto_leyenda'>Al terminar de modificar todos los cambios deseados, da clic en el boton amarillo "Agregar" para mostrar la nueva información en la tabla</div>

            {/* ENVIAR */}
            <div className='boton'>
                <button onClick={submit}>
                    Agregar
                </button> 
            </div>

            <Modal size="lg" title={"Editar Sub gasto"} show={modal.modificarSubGasto.show} handleClose={()=>handleCloseGastos ('modificarSubGasto')}>
                <ModalModificarSubGasto data={modal.modificarSubGasto.data} dataGeneral={data} handleClose={()=>handleCloseGastos ('modificarSubGasto')} reload={reloadTable}/>
            </Modal>
        </>

    )
}


{/* {
    data.partida.subpartidas.map((item, index)=>{
    return <span className='sub_partida'>
                <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(item.nombre)}>X</span>
                <span className=''>{item.nombre}</span>
            </span>
    })
}  */}