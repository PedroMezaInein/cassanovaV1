import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Card } from 'react-bootstrap'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Style from './estilos.module.css'

export default function CrearEgreso(props) {
    const {opcionesData, reload, handleClose, filtrarTabla, borrarTabla,selectedUser,setSelectedUser,users,classes,error} = props


    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    useEffect(() => {
       
        if(opcionesData){
            setOpciones(opcionesData)
        }
        filtrarTabla('')   

    }, [opcionesData])
 
    const [form, setForm] = useState({
        area: '',
        cuenta: '',
        descripcion: '',
        orden_compra: '',
        monto: '',
        fecha_fin: '',
        fecha_inicio: '',
        id_partidas: "",
        subarea: '',
        presupuestos: ''

    })

    const [newEquipo, setNewEquipo] = useState({
        nombre: '',
        modelo: '',
        tipo: '',
        serie: '',
        descripcion: '',
        selectedUser:'',
      });
    


    const filtrar = () => {
        console.log(selectedUser)
            filtrarTabla(`&persona=${selectedUser? selectedUser.id:''}&serie=${newEquipo.serie}&modelo=${newEquipo.modelo}&descripcion=${newEquipo.descripcion}`)
            handleClose()
            // borrar(false)

        }

    const borrar = () => {
        
            // console.log('filtrar tabla')
            filtrarTabla('')   
            borrarTabla(false)
            handleClose()

        }

    return (
        <>

<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', boxShadow: 24, p: 6 }}>
             <div className='row  justify-content-center px-2'>
                  <div className="col-md-12 mx-auto">
                    <h2 id="asignar-equipo-modal-title">Filtar registro</h2>
                  <div style={{ maxHeight: '70vh', overflow: 'auto' }}> {/* Establece una altura máxima y permite el desplazamiento vertical */}
                    <Card.Body className="d-flex align-items-center justify-content-center">
                      <div className='row mx-0 justify-content-center px-2'>
                        <div className="form-group row form-group-marginless mb-1">
                          <div className="col-md-12 text-justify mb-2">
                             <Autocomplete id="persona" options={users} getOptionLabel={(user) => {
                                    const nombre = user.nombre || '';
                                    const apellidoPaterno = user.apellido_paterno || '';
                                    const apellidoMaterno = user.apellido_materno || '';
                                    return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
                                  }}
                                  value={selectedUser} onChange={(e, newValue) => setSelectedUser(newValue)} renderInput={(params) => (
                                    <TextField {...params} label="Persona" variant="outlined" fullWidth required error={error && !selectedUser} className={classes.errorInput} /> )} style={{ width: 300 }}  
                                />
                            {/* <TextField  label="Marca"  value={editedEquipo.nombre}  onChange={(e) => setEditedEquipo({ ...editedEquipo, nombre: e.target.value })}  fullWidth  mb={2}  required  /> */}
                          </div>   
                          <div className="col-md-12 text-justify mb-2">
                              <TextField label="Serie" value={newEquipo.serie} onChange={(e) => setNewEquipo({ ...newEquipo, serie: e.target.value })} fullWidth mb={2} />

                             {/* <TextField  label="Modelo"  value={editedEquipo.modelo}  onChange={(e) => setEditedEquipo({ ...editedEquipo, modelo: e.target.value })}  fullWidth  mb={2}  required  /> */}
                          </div>  
                          {/* <div className="col-md-12 text-justify mb-2">
                          <Autocomplete
                            id="tipo"
                            options={tiposEquipos}
                            value={editedEquipo.tipo}
                            onChange={(event, newValue) => setEditedEquipo(prevState => ({ ...prevState, tipo: newValue }))}
                            renderInput={(params) => <TextField {...params} label="Tipo" variant="outlined" fullWidth />}
                          />                        
                          </div> */}
                          <div className="col-md-12 text-justify mb-2">
                               <TextField label="Modelo" value={newEquipo.modelo} onChange={(e) => setNewEquipo({ ...newEquipo, modelo: e.target.value })} fullWidth mb={2} required  className={error && !newEquipo.modelo ?  classes.errorInput : ''} />

                            {/* <TextField  label="Serie"  value={editedEquipo.serie}  onChange={(e) => setEditedEquipo({ ...editedEquipo, serie: e.target.value })}  fullWidth  mb={2} /> */}
                          </div>
                          <div className="col-md-12 text-justify mb-2">
                          <TextField label="Descripcion" value={newEquipo.descripcion} onChange={(e) => setNewEquipo({ ...newEquipo, descripcion: e.target.value })} fullWidth mb={2} required  className={error && !newEquipo.descripcion ?  classes.errorInput : ''} />

                            {/* <TextField  label="Descripción"  value={editedEquipo.descripcion}  onChange={(e) => setEditedEquipo({ ...editedEquipo, descripcion: e.target.value })}  fullWidth  mb={2}  required /> */}
                          </div>  

                        </div>
                      </div>
                    </Card.Body>
                    </div>

                  </div>
                  <div className='row  justify-content-center px-2'>
                    <div className="col-md-6 text-justify">
                         <Button variant="outlined" size="large" color="primary" onClick={borrar}>Borrar</Button>

                      {/* <Button variant="outlined" size="large" color="primary" onClick={handleSaveEditedEquipo}>Guardar </Button> */}
                    </div>
                    <div className="col-md-6 text-justify">
                          <Button variant="outlined" size="large" color="secondary"   onClick={filtrar}>Filtrar</Button>

                    {/* <Button variant="outlined" size="large" color="secondary"  onClick={()=>handleCloseEditModal()} >cerrar</Button> */}
                    </div>
                </div>
              </div>
          </Box>
           

        </>
    ) 
}
