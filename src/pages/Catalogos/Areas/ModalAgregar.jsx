import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios'
import Swal from 'sweetalert2'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { apiPostForm } from '../../../functions/api'

import './AreaStyle/_agregarGasto.scss'

export default function ModalAgregar (props) {
    const {handleClose, reload} = props
    const user = useSelector(state=> state.authUser)
    const departamentos = useSelector(state => state.opciones.areas)

    const [form, setForm] = useState ({
        area:'',
        partida: '',
        subPartida: '',
        arraySubPartidas: [],
        i_select: '',
        i_text:''
    })

    const [errores, setErrores] = useState()

    const handleChangeArea = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
            partida: '',
            subPartida: null,
            arraySubPartidas: []
        })
    }
    
     //de aqui son nuevas funciones handlechange

    const handleChangePartida=(e)=>{
        setForm({
            ...form,
            partida:e.target.value,
            i_text:'',
            i_select:'',
            subPartida: null,
            arraySubPartidas: []
        })
        
    }

    const handleChange=(e)=>{
    setForm({
        ...form,
        [e.target.name]:e.target.value,
        })

    }

    const handleEnterSub=(e)=>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                arraySubPartidas: [...form.arraySubPartidas, {nombre:form.subPartida}],
                subPartida:''
            })
        }
    }

    const handleDeleteSub= (e) =>{
        const indiceSub = form.arraySubPartidas.findIndex(sub => sub.nombre === e)
        const newSub = [...form.arraySubPartidas]
        newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        setForm({
            ...form,
            arraySubPartidas: newSub
        })
    }

    const handleChangePrueba = (e) =>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                i_text:'',
                i_select: '',
                subPartida: null,
                arraySubPartidas: [],
                partida: e.target.value
            })
        } else {
            setForm({
                ...form,
                [e.target.name]:e.target.value,
            })   
        }
    }

    const handleDeletePartida = ()=>{
        setForm({
            ...form,
            partida:''
        })
    }

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.area === ''){
            error.area = 'Selecciona un área'
            validar = false
        }
        if(form.partida === '' || form.partida === null){
            error.partida = 'Agrega una partida'
            validar = false
        }
        if(form.subPartida === '' || form.subPartida === null){
            error.subPartida = 'Agrega una sub partida'
            validar = false
        }
        setErrores (error)
        return validar
    }

    const submit = () =>{
        if(Object.keys(validateForm()).length ===0){
        //if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 

            let newForm = {
                nombre: departamentos.find(item => item.id_area == form.area).nombreArea,
                partida: form.partida.nombre,
                subarea: '',
                subareasEditable: [],
                subareas: form.arraySubPartidas.map((item, index) => {
                    return item.nombre
                }),
                tipo: 'egresos'
            }
            console.log(newForm)
 
            apiPostForm('areas', newForm, user.access_token)
            .then((data)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Nueva Requisicion',
                    text: 'Se ha creado correctamente',
                    timer: 5000,
                    timerProgressBar: true,
                })
                // handleClose()
                // if(reload){
                //     reload.reload()
                // }
               
                if (data.isConfirmed) {
                    
                    let form = {
                        solicitante: user.user.id,
                        fecha: '',
                        departamento: '',
                        tipo_gasto: '',
                        descripcion: '',
                        solicitud:''
                    }
                    
                    console.log('form')
                    console.log(form)

                }

                else if (data.isDenied) {
                    Swal.fire('Faltan campos', '', 'info')
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

        <div>
            <div className='area'>

                {/* AREA */}
                <div>
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                            <Select
                                value={form.area}
                                name="area"
                                onChange={handleChangeArea}
                            >
                                {departamentos.map((item, index) => (
                                    <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                ))}

                            </Select>
                        </>
                        : null
                    }
                </div>

                {/* PARTIDAS */}
                <div>
                    {departamentos.length > 0 && form.area !== ''?
                        <>
                            <div className='subtitulo'>Selecciona o crea una nueva partida </div>
                            <div className='partidas'>
                                <div>
                                    <InputLabel id="demo-simple-select-label">Partida</InputLabel>
                                    <Select
                                        value={form.i_select}
                                        name="partida"
                                        onChange={handleChangePartida}
                                    >
                                    {departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item.nombre}</MenuItem>
                                    ))}

                                    </Select>
                                </div>
                            </div>
                        </>
                        :
                        null
                    }     
                </div>

                <div>
                    {departamentos.length > 0 && form.area !== ''?

                        <>
                            <div>
                                <TextField 
                                    label="Crea una partida"
                                    // style={{ margin: 8 }}
                                    placeholder="Enter para crear partida"
                                    onChange={handleChangePrueba}
                                    onKeyPress={handleChangePrueba}
                                    // margin="normal"
                                    name='i_text'
                                    /* defaultValue={form.i_text} */
                                    value={form.i_text}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                /> 
                            </div>
                        </>
                        :
                        null
                    }   
                    <div className='etiqueta_partida'>
                        {
                            form.partida !== '' && form.partida.nombre ?
                            <>
                                <div>
                                    <span className='nombre_partida'>
                                        <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida.nombre}
                                    </span>
                                </div>
                            </> 
                            : form.partida !== '' ?
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

            <div className='subpartida'>
                {departamentos.length > 0 && form.partida && form.partida !== ''?
                    <>
                        {/* <TextField 
                            label="Sub partida"
                            style={{ margin: 8 }}
                            placeholder="Nueva sub partida"
                            onChange={handleChange}
                            onKeyPress={handleEnterSub}
                            margin="normal"
                            name='subPartida'
                            type='text'
                            defaultValue={form.subPartida}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />  */}
                        <label>Subpartida</label>
                        <input name='subPartida' type='text' value={form.subPartida ? form.subPartida : ''} onKeyPress={handleEnterSub}  onChange={handleChange}></input>
                    </>
                    : null
                } 
            </div>

            <div className='subpartidas'>
                {
                    form.arraySubPartidas.length > 0 && form.partida && form.partida !== '' ?
                        <>
                            {form.arraySubPartidas.map(subpartida=>{
                                return <>
                                    <span className='sub_partida'>
                                        <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(subpartida.nombre)}>X</span>
                                        <span>{subpartida.nombre}</span>
                                    </span>
                                </>
                             
                            })}
                        </>
                    :null
                }
            </div>
            
            {errores && errores.subPartida && form.partida !== '' && form.partida !== null && (form.subPartida === '' || form.subPartida === null) &&<span>{errores.subPartida}</span>}


            {/* ENVIAR */}
            <div className='boton'>
                <button onClick={submit}>
                    Agregar
                </button> 
            </div>
        </div>
        
    )
}




// {/* <div className='agregar'>

//             <div className='agregar_area'>
//                 AREA
//                 <div className=" area">
//                     {departamentos.length > 0 ?
//                         <>
//                             <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
//                             <Select
//                                 value={form.area}
//                                 name="area"
//                                 onChange={handleChangeArea}
//                             >
//                                 {departamentos.map((item, index) => (
//                                     <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
//                                 ))}

//                             </Select>
//                         </>
//                         : null
//                     }
//                 </div>
//                 {errores && errores.area && form.area === '' &&<span className='error_area'>{errores.area}</span>}

//                 PARTIDA
//                 <div className='agregar_partidas'>
//                     {departamentos.length > 0 && form.area !== ''?
                    
//                         <>
//                             <div>Selecciona o crea una nueva partida </div>
//                             <div className='partidas'>
//                                 <div>
//                                     <InputLabel id="demo-simple-select-label">Partida</InputLabel>
//                                     <Select
//                                         value={form.i_select}
//                                         name="partida"
//                                         onChange={handleChangePartida}
//                                     >
//                                         {departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
//                                             <MenuItem key={index} value={item}>{item.nombre}</MenuItem>
//                                         ))}

//                                     </Select>
//                                 </div>

//                                 <div>
//                                     <TextField 
//                                         label="Crea una partida"
//                                         style={{ margin: 8 }}
//                                         placeholder="Enter para crear partida"
//                                         onChange={handleChangePrueba}
//                                         onKeyPress={handleChangePrueba}
//                                         margin="normal"
//                                         name='i_text'
//                                         /* defaultValue={form.i_text} */
//                                         value={form.i_text}
//                                         InputLabelProps={{
//                                         shrink: true,
//                                         }}
//                                     /> 
//                                 </div>
//                             </div>

//                             {/* <label>Partida</label>
//                             <br></br>
//                             <input name='partida' type='text' value={form.partida} onChange={handleChangePartida}></input> */}
//                         </>
//                         :
//                         null
//                     }

//                     <div>
//                         {
//                             form.partida !== '' && form.partida.nombre ?
//                             <>
//                                 <div><span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida.nombre}</div>
//                             </> 
//                             : form.partida !== '' ?
//                                 <div><span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida}</div>
//                                 : null
                            
//                         }
//                     </div>
//                 </div>

//                 {/* {errores && errores.partida && form.area !== '' && (form.partida === '' || form.partida === null) && <span className=''>{errores.partida}</span>}  */}
//             </div>


//             SUBPARTIDA
//             <div className='agregar_subpartida'>
//                 {departamentos.length > 0 && form.partida && form.partida !== ''?
//                     <>
//                         {/* <TextField 
//                             label="Sub partida"
//                             style={{ margin: 8 }}
//                             placeholder="Nueva sub partida"
//                             onChange={handleChange}
//                             onKeyPress={handleEnterSub}
//                             margin="normal"
//                             name='subPartida'
//                             type='text'
//                             defaultValue={form.subPartida}
//                             InputLabelProps={{
//                             shrink: true,
//                             }}
//                         />  */}
//                         <label>Subpartida</label>
//                         <input name='subPartida' type='text' value={form.subPartida ? form.subPartida : ''} onKeyPress={handleEnterSub}  onChange={handleChange}></input>
//                     </>
//                     : null
//                 } 
//             </div>

//             <div className='subpartidas'>
//                 {
//                     form.arraySubPartidas.length > 0 && form.partida && form.partida !== '' ?
//                     <>
//                         {form.arraySubPartidas.map(subpartida=>{
//                             return <><span className='sub_eliminar' onClick={(e)=>handleDeleteSub(subpartida.nombre)}>X</span><span className='eliminar_sub'>{subpartida.nombre}</span></>
//                         })}
//                     </>
//                     :null
//                 }
//             </div>
//             {errores && errores.subPartida && form.partida !== '' && form.partida !== null && (form.subPartida === '' || form.subPartida === null) &&<span>{errores.subPartida}</span>}


//             ENVIAR
//             <div className='boton'>
//                 <button onClick={submit}>
//                     Agregar
//                 </button> 
//             </div>
//         </div> */}








// import React, {useState, useEffect} from 'react'
// import { useSelector } from 'react-redux'

// import axios from 'axios'
// import Swal from 'sweetalert2'

// import InputLabel from '@material-ui/core/InputLabel';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import TextField from '@material-ui/core/TextField';

// import { apiPostForm } from '../../../../../functions/api'

// // import '../Styles-Gastos/_agregarGastos.scss'

// export default function ModalEditarSub (props) {
//     const {handleClose, reload} = props
//     const user = useSelector(state=> state.authUser)
//     const departamentos = useSelector(state => state.opciones.areas)

//     const [form, setForm] = useState ({
//         area:'',
//         partida: '',
//         subPartida: '',
//         arraySubPartidas: []
//     })

//     const [errores, setErrores] = useState()

//     const handleChangeArea = (event) => {
//         setForm({
//             ...form,
//             [event.target.name]: event.target.value,
//             partida: null,
//             subPartida: null,
//             arraySubPartidas: []
//         })
//     }

//     const handleChangePartida = (event) => {
//         let name = event.target.name
//         setForm({
//             ...form,
//             [name]: event.target.value,
//             arraySubPartidas: []
//         })
//     }

//     const handleChangeSub = (e) => {
//         if(form.arraySubPartidas.length > 0 ){
//             if(form.arraySubPartidas.find((item => item.id === e.target.value))){

//             } else {
//                 setForm({
//                     ...form,
//                     arraySubPartidas:[
//                         ...form.arraySubPartidas,
//                         {
//                             id: e.target.value,
//                         }
//                     ]
//                 })
//             }
           
//         } else {
//             setForm({
//                 ...form,
//                 arraySubPartidas:[
//                     ...form.arraySubPartidas,
//                     {
//                         id: e.target.value,
//                     }
//                 ]
//             })
//         }
//     }

//     const handleDelete = (e) => {
//         const indiceSub = form.arraySubPartidas.findIndex(sub => sub.id === e) //extraigo el indice se la subpartida que quiero eliminar
//         const newSub = [...form.arraySubPartidas] // creo una copia de arraySubPartidas
        
//         newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
//         setForm({
//             ...form,
//             arraySubPartidas: newSub
//         })
//     }

//     const validateForm = () => {
//         let validar = true
//         let error = {}
//         if(form.area === ''){
//             error.area = 'Selecciona un área'
//             validar = false
//         }
//         if(form.partida === '' || form.partida === null){
//             error.partida = 'Agrega una partida'
//             validar = false
//         }
//         if(form.subPartida === '' || form.subPartida === null){
//             error.subPartida = 'Agrega una sub partida'
//             validar = false
//         }
//         setErrores (error)
//         return validar
//     }

//     const enviar = (e) => {
//         if(validateForm()){

//             Swal.fire({
//                 title: 'Cargando...',
//                 allowOutsideClick: false,
//                 onBeforeOpen: () => {
//                     Swal.showLoading()
//                 }
//             }) 
//         } else {

//             let newForm = {
//                 id_area: form.area,
//                 id_partida: form.partida,
//                 id_subPartida: form.subPartida,
//                 /* [
//                     {id:67, nombre: 'mano de obra'}
//                     {id:43, nombre: 'mantenimiento'}
//                     {id:67, nombre: 'mano de obra'}
//                     {id:67, nombre: 'mano de obra'}
//                 ] */
//             }
        
//             apiPostForm('requisicion', newForm, user.access_token)
//             .then((data)=>{
//                 Swal.close()
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Nueva Requisicion',
//                     text: 'Se ha creado correctamente',
//                     timer: 5000,
//                     timerProgressBar: true,
//                 })
//                 handleClose()
//                 if(reload){
//                     reload.reload()
//                 }
                
//                 if (data.isConfirmed) {  
//                     Swal.fire('Se creó con éxito')
//                 }

//                 else if (data.isDenied) {
//                     Swal.fire('Faltan campos', '', 'info')
//                 }
//             })
//             .catch((errores)=>{  
//                 Swal.close()
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Oops...',
//                     text: 'Ha ocurrido un error',
//                 })
//             })
//         }
        
//     }
//      //de aqui son nuevas funciones handlechange

//      const handleChange=(e)=>{
//         setForm({
//             ...form,
//             [e.target.name]:e.target.value
//         })
//      }
//     const handleEnter=(e)=>{
//         if(e.key==='Enter' ){
//             setForm({
//                 ...form,
//                 arraySubPartidas: [...form.arraySubPartidas, {nombre:form.subPartida}],
//                 subPartida:''
//             })
//         }
//     }

//     const handleDeleteSub= (e) =>{
//         const indiceSub = form.arraySubPartidas.findIndex(sub => sub.nombre === e)
//         const newSub = [...form.arraySubPartidas]
//         newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
//         setForm({
//             ...form,
//             arraySubPartidas: newSub
//         })
//     }



//     return (
//         <>
//         {/* AREA */}
//         <div className="area">
//             {departamentos.length > 0 ?
//                 <>
//                     <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
//                     <Select
//                         value={form.area}
//                         name="area"
//                         onChange={handleChangeArea}
//                     >
//                         {departamentos.map((item, index) => (
//                             <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
//                         ))}

//                     </Select>
//                 </>
//                 : null
//             }
//         </div>
//         {errores && errores.area && form.area === '' &&<span className='error_area'>{errores.area}</span>}

//         {/* PARTIDA */}
//         {/* <div className="">  
//             {departamentos.length > 0 && form.area !== ''?
//                 <>
//                     <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
//                     <Select
//                         value={form.partida}
//                         name="partida"
//                         onChange={handleChangePartida}
//                     >
//                         {departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
//                             <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
//                         ))}
//                     </Select>
//                 </>
//                 : null
//             }
//         </div>
//         {errores && errores.partida && form.area !== '' && (form.partida === '' || form.partida === null) && <span className=''>{errores.partida}</span>} */}
        

//         {/* SUBPARTIDA */}
//         {/* <div className="">  
//             {departamentos.length > 0 && form.partida ?
//                 <>
//                     <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
//                     <Select
//                         value={form.subPartida}
//                         name="subPartida"
//                         onChange={handleChangeSub}
//                     >
//                         {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id ==                         form.partida).subpartidas.map((item, index) => (
//                             <MenuItem key={index} value={item.id} >{item.nombre}</MenuItem>
//                         ))}
//                     </Select> 
//                 </>
//                 : null
//             }
//         </div> */}
//         {/* <div>
//             {
//                 form.arraySubPartidas.length > 0 && departamentos.length > 0 && form.partida ?
//                 <>
//                     {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id ==                         form.partida).subpartidas.map((item, index) => (
//                         form.arraySubPartidas.map((sub,index)=>{
//                             if(sub.id === item.id){
//                                 return <div key={index} value={item.id} >{item.nombre}<span onClick={(e)=>{handleDelete(sub.id)}} >X</span></div>
//                             }
//                         })
//                     ))}
//                 </>

                

//                 :null
//             }
//         </div> */}
//         <div className="">  
//             {departamentos.length > 0 && form.partida ?
//                 <>

//                         {/* {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.partida).subpartidas.map((item, index) => (
//                             <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
//                         ))} */}

//                 </>
//                 : null
//             }
//         </div> 
//         {errores && errores.subPartida && form.partida !== '' && form.partida !== null && (form.subPartida === '' || form.subPartida === null) &&<span>{errores.subPartida}</span>}


//     {/* PARTIDA */}
//     <div>
//         {departamentos.length > 0 && form.area !== ''?
//             <>
//                 <label>Partida</label>
//                 <input name='partida' type='text' value={form.partida} onChange={handleChange}></input>
//             </>
//             :
//             null
//         }
//     </div>
//     {errores && errores.partida && form.area !== '' && (form.partida === '' || form.partida === null) && <span className=''>{errores.partida}</span>} 


//     {/* SUBPARTIDA */}
//     <div>
//         <label>Subpartida</label>
//         <input name='subPartida' type='text' value={form.subPartida} onKeyPress={handleEnter}  onChange={handleChange}></input>
//     </div>

//     <div>
//         {
//             form.arraySubPartidas.length > 0 && form.partida && form.partida !== '' ?
//             <>
//                 {form.arraySubPartidas.map(subpartida=>{
//                     return <div><span onClick={(e)=>handleDeleteSub(subpartida.nombre)}>X</span>{subpartida.nombre}</div>
//                 })}
//             </>
//             :null
//         }
//     </div>
//         </>
//     )
// }