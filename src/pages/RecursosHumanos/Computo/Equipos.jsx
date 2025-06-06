import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../../../components/layout/layout';
import { URL_DEV } from '../../../constants';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import Swal from 'sweetalert2';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from 'react-bootstrap'
import SaveIcon from '@material-ui/icons/Save';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Input from '@material-ui/core/Input';
import { setSingleHeader } from './../../../functions/routers'
import {  printResponseErrorAlert, errorAlert } from './../../../functions/alert'
import Filtrar from './Filtrar'



const useStyles = makeStyles({
  // container: {
  //   maxWidth: 400,
  //   margin: '0 auto',
  //   padding: 20,
  // },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  errorInput: {
    borderBottom: '1px solid red',
  },
  textField: {
    marginBottom: 20,
  },
});


function App(props) {
  const classes = useStyles();

  const [equipos, setEquipos] = useState([]);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false); // Nuevo estado para controlar el modal de agregar equipo

  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [availableEquipos, setAvailableEquipos] = useState([]);

  const auth = useSelector((state) => state.authUser.access_token);
  const authUser = useSelector((state) => state.authUser);
  const [reloadTable, setReloadTable] = useState(false)
  const [newEquipo, setNewEquipo] = useState({
    nombre: '',
    modelo: '',
    tipo: '',
    serie: '',
    descripcion: '',
  });

  const tiposEquipos = [
    "laptop","Pc escritorio","Mouse", "Pantalla", "Teclado", "Cable HDMI", "Memoria RAM", "Disco Duro", 
    "Adaptador HUB", "Audífonos", "Impresora 3D", "Tarjeta Gráfica", "Monitor","camara fotografica", 
    "Router", "Switch", "Cámara Web", "Escáner", "Proyector", "Smartphone","accesorios para dron","luces", 
    "Tablet", "Robot", "Drone", "GPS", "Altavoz Bluetooth", "Impresora Multifunción","estabilizador de camara", 
    "Cámara de Seguridad", "Micrófono", "Batería Externa", "Cargador", "Memoria USB",
    "Silla de Oficina", "Escritorio", "Cable USB", "Cable Ethernet", "Estabilizador",  
    "UPS", "Teclado Inalámbrico", "Mouse Inalámbrico", "Estuche para Portátil", 
    "Mochila para Portátil", "Soporte para Portátil", "Protector de Pantalla", 
    "Kit de Limpieza", "Herramientas", "Distanciometro", "Cámara de Fotos", 
    "Lente de Cámara", "Trípode", "Mochila de Fotografía", "Estudio Fotográfico", 
    "Disco SSD", "Software", "Licencia de Software", "lente de camara fotografica", 
    "Servidor", "Unidad de Almacenamiento en Red (NAS)", "Teclado Ergonómico", 
    "Pantalla Táctil", "Monitor Curvo", "Sistema de Sonido", "Teclado Mecánico", 
    "Procesador", "Placa Base", "Tarjeta de Red", "Enrutador Inalámbrico", 
    "Interruptor de Red", "Tarjeta de Captura de Video", "Auriculares Inalámbricos", 
    "Gafas de Realidad Virtual", "Controlador de Juegos", "Consola de Videojuegos", 
    "Juego de Mesa", "Equipo de Gimnasio", "Instrumento Musical", "Herramientas de Jardinería", 
    "Artículos de Camping", "Equipo de Seguridad", "Material de Oficina", "Suministros de Arte", 
    "Adaptador de Corriente", "Cargador de Teléfono", "Lámpara LED", "Herramientas Eléctricas", 
    "Máquina de Café", "Dispensador de Agua", "Cafetera", "Microondas", "Aspiradora", "Termómetro", 
    "Lámpara de Escritorio", "Kit de Primeros Auxilios", "Ventilador", "Pizarra Blanca", "Grapadora", 
    "Soporte para TV", "TV", "Calculadora", "Cable VGA", "Kit de Accesorios para Computadoras", 
    "Kit de Mantenimiento de Impresoras", "Kit de Limpieza de Impresoras", "Otro"
  ];
  const [currentAssignedUser, setCurrentAssignedUser] = useState('');
  const [openReassignModal, setOpenReassignModal] = useState(false);
  const [equipoUser, setEquipoUser] = useState('');
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const [filtrado, setFiltrado] = useState('') 
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openFiltrarModal, setOpenFiltrarModal] = useState(false);

  
  const [editedEquipo, setEditedEquipo] = useState({
    id: null,
    nombre: '',
    modelo: '',
    tipo: '',
    serie: '',
    descripcion: '',
  });
  const [modal, setModal] = useState({    
    filtrar: {
        show: false,
        data: false
    },
  })

  useEffect(() => {
    axios.get(`${URL_DEV}equipos/equipos`, { headers: { Authorization: `Bearer ${auth}` } })
      .then(response => {
        setEquipos(response.data.inventario);
        setUsers(response.data.usuarios);

        // Filter available equipos
        const available = response.data.inventario.filter(equipo => equipo.disponible);
        setAvailableEquipos(available);

      })
      .catch(error => {
        console.error('Error fetching equipos:', error);
        setError('Error al cargar los equipos. Por favor, intenta nuevamente.');
      });
  }, [auth]);

  useEffect(() => {
    if (filtrado) {
        reloadTable.reload(filtrado)
        if(borrar == false){
            setFiltrado('')   
        }
    }
}, [filtrado])

const borrar = ( id) =>{
  if(id == false){
      reloadTable.reload(filtrado)
      setFiltrado('')   
  }
}

  const handleOpenModal = (equipo) => {
    setSelectedEquipo(equipo.id);
    // setSelectedEquipo(equipo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser('');
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleOpenFiltrarModal = () => {
    setOpenFiltrarModal(true);
  };


  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewEquipo({
      nombre: '',
      modelo: '',
      tipo: '',
      serie: '',
      descripcion: '',
    });
  };


  const handleCloseReassignModal = () => {
    setOpenReassignModal(false);
    setSelectedUser(''); // Limpiar el usuario seleccionado al cerrar el modal
    setEquipoUser('');
  }

  const handleCloseFiltrarModal = () => {
    setOpenFiltrarModal(false);
    setSelectedUser(''); // Limpiar el usuario seleccionado al cerrar el modal
    setEquipoUser('');
  }

    // Función para abrir el modal de asignación y obtener el usuario actualmente asignado
    const handleOpenReassignModal = (equipo) => {
      setSelectedEquipo(equipo.id);
      setOpenReassignModal(true);
        // Obtener el usuario actualmente asignado al equipo seleccionado
      axios.get(`${URL_DEV}equipos/persona/${equipo.id}`, { headers: { Authorization: `Bearer ${auth}` } })
        .then(response => {
          const asignado = response.data.asignado;

          if (asignado && asignado.empleado) {
            setCurrentAssignedUser(asignado.empleado.nombre);
            setEquipoUser(asignado);
          } else {
            setCurrentAssignedUser('N/A');
            setEquipoUser('N/A');
          }
        })
        .catch(error => {
          console.error('Error fetching assigned user:', error);
          setError('Error al obtener el usuario asignado. Por favor, intenta nuevamente.');
        });
    };

  const handleAssignEquipo = () => {

    if (!selectedEquipo || !selectedUser) {
      // Mostrar mensaje de error o tomar la acción correspondiente
      setError('Por favor selecciona un equipo y un usuario.');

      return;
    }
  
    axios.post(`${URL_DEV}equipos/asignar`, {
      equipoId: selectedEquipo,
      persona: selectedUser.id
    }, { headers: { Authorization: `Bearer ${auth}` } })
      .then(response => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Equipo asignado con éxito",
          showConfirmButton: false,
          timer: 2500
        });
          // Actualizar el estado de disponibilidad local del equipo
          setEquipos(prevEquipos => {
            return prevEquipos.map(equipo => {
              if (equipo.id === selectedEquipo) {
                return { ...equipo, disponible: false }; // Marcar el equipo como no disponible
              }
              return equipo;
            });
          });

        handleCloseModal();
        if (reloadTable) {
          reloadTable.reload()
        }      
      })
      .catch(error => {
        console.error('Error al asignar el equipo:', error);
        setError('Error al asignar el equipo. Por favor, intenta nuevamente.');
      });
  };
  

  const handleAddEquipo = () => {
    if (!newEquipo.nombre || !newEquipo.tipo  || !newEquipo.descripcion || !newEquipo.modelo ) {
      // Mostrar mensaje de error o tomar la acción correspondiente
      setError('Por favor selecciona un equipo y un usuario.');
      return;
    }

    axios.post(`${URL_DEV}equipos/agregar`, newEquipo, { headers: { Authorization: `Bearer ${auth}` } })
      .then(response => {
        // Cerrar el modal
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Equipo agregado con exito",
          showConfirmButton: false,
          timer: 2500
        });
        handleCloseAddModal();
        if (reloadTable) {
          reloadTable.reload()
        }

        axios.get(`${URL_DEV}equipos/equipos`, { headers: { Authorization: `Bearer ${auth}` } })
          .then(response => {
            // Filtrar equipos disponibles nuevamente
            const available = response.data.inventario.filter(equipo => equipo.disponible);
            setAvailableEquipos(available);
          })
          .catch(error => {
            console.error('Error fetching equipos:', error);
            setError('Error al cargar los equipos. Por favor, intenta nuevamente.');
          });
         
      })
      .catch(error => {
        console.error('Error al agregar el equipo:', error);
        setError('Error al agregar el equipo. Por favor, intenta nuevamente.');
      });
      setError('');

  };

  const columnas = [
    { nombre: 'Acciones', identificador: 'acciones' },
    { nombre: 'Marca', identificador: 'nombre', sort: false, stringSearch: false },
    { nombre: 'Modelo', identificador: 'modelo', sort: false, stringSearch: false },
    { nombre: 'Equipo', identificador: 'equipo', sort: false, stringSearch: false },
    { nombre: 'Serie', identificador: 'serie', sort: false, stringSearch: false },
    { nombre: 'Descripcion', identificador: 'descripcion', sort: false, stringSearch: false },
    { nombre: 'Asignado', identificador: 'asignado', sort: false, stringSearch: false },
    { nombre: 'Estatus', identificador: 'disponible', sort: false, stringSearch: false },
];


const ProccessData = (data) => { 
    let aux = []
    data.data.data.map((item) => {
      console.log(item)
        aux.push({
            ...item,
            id: item.id,
            asignado: item.asigna ? item.asigna.empleado.nombre +" " + item.asigna.empleado.apellido_paterno  +" " + item.asigna.empleado.apellido_materno: 'N/A',
            // nombre: item.equipo ? item.equipo.nombre : 'N/A',
            nombre: item.nombre ? item.nombre : 'N/A',
            modelo: item.modelo ? item.modelo : 'N/A',
            equipo: item.tipo ? item.tipo : 'N/A',
            serie: item.serie ? item.serie : 'N/A',
            descripcion: item.descripcion ? item.descripcion : 'N/A',
            disponible : item.disponible == 1 ?  'Disponible' : 'No disponible',
            data: item,
        })
    }
    )
    aux = aux.reverse()
    return aux
}

    const createAcciones = () => {
      let aux = [
        
            {
              nombre: 'Editar',
              icono: 'fas fa-edit',
              color: 'blueButton ',
              funcion: (item) => {
                handleOpenEditModal(item) 
              }
            },
            {
              nombre: 'Asignar',
              icono: 'fas fa-file-invoice',
              color: 'blueButton ',
              funcion: (item) => {
                item.disponible == 'Disponible' ?
                handleOpenModal(item)  
                :  Swal.fire({
                      position: "top-end",
                      icon: "error",
                      title: "Equipo ya esta asignado",
                      showConfirmButton: false,
                      timer: 2500
                  });
              }
            },
          {
            nombre: 'Reasignar',
            icono: 'fas fa-eye',
            color: 'blueButton ',
            funcion: (item) => {
              item.disponible == 'No disponible' ?
              handleOpenReassignModal(item)  
              :  Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Equipo no esta asignado no se puede reasignar, primero asignalo",
                    showConfirmButton: false,
                    timer: 2500
                });
            }
          },
          {
            nombre: 'Historial',
            icono: 'fas fa-paperclip',
            color: 'blueButton ',
            funcion: (item) => {
              handleOpenHistorialModal(item)    
            }
          },
          {
            nombre: 'Desasignar',
            icono: 'fas fa-trash-alt',
            color: 'redButton',
            funcion: (item) => {
                // authUser.user.tipo.tipo === 'Administrador' ?
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Sí, Desasignar',
                }).then((result) => {
                    if (result.isConfirmed) {
                       item.disponible == 'No disponible' ?
                       handleUnassignEquipo(item)  
                        :  Swal.fire({
                              position: "top-end",
                              icon: "error",
                              title: "Equipo ya esta esta desasignado",
                              showConfirmButton: false,
                              timer: 3500
                          });
                    }
                })
            }
        },
      ]

      return aux
    }

    const handleOpenHistorialModal = (equipoId) => {
      setSelectedEquipoId(equipoId.id);
      setShowHistorialModal(true);
      obtenerHistorial(equipoId); // Obtener el historial al abrir el modal
    };
    
    const handleCloseHistorialModal = () => {
      setShowHistorialModal(false);
      setSelectedEquipoId(null);
    };

    const opciones = [
      {
        nombre: <div><i className="fas fa-plus mr-5"></i><span>Agregar inventario</span></div>,
        funcion: (item) => {
          handleOpenAddModal()
        }        
     },
     {
      //filtrar
      nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
      funcion: (item) => {
          handleOpenFiltrarModal()

      }
  },
  ]


  const handleReassignEquipo = () => {
    
    if (!selectedEquipo || !selectedUser) {
      // Mostrar mensaje de error o tomar la acción correspondiente
      setError('Por favor selecciona un equipo y un usuario.');

      return;
    }
    axios.put(`${URL_DEV}equipos/reasignar/${selectedEquipo}`, {
        equipo:equipoUser.id,
        equipo_id:equipoUser.equipo_id,
        nuevaPersona: selectedUser.id
    }, { headers: { Authorization: `Bearer ${auth}` } })
    .then(response => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Equipo desasignado y reasignado con éxito",
            showConfirmButton: false,
            timer: 2500
        });
        // handleCloseReassignModal(false)
        // Actualizar el estado local de equipos
        if (reloadTable) {
          reloadTable.reload()
        }

        axios.post(`${URL_DEV}equipos/historial`, {
          equipoId: equipoUser.equipo_id,
          personaId: selectedUser.id,
          fecha: new Date()
          }, { headers: { Authorization: `Bearer ${auth}` } })
          .then(response => {
            console.log('Historial registrado con éxito');
        })
        .catch(error => {
            console.error('Error al registrar historial:', error);
        });


        setEquipos(prevEquipos => {
            return prevEquipos.map(equipo => {
                if (equipo.id === selectedEquipo) {
                    return { ...equipo, disponible: true }; // Marcar el equipo como disponible nuevamente
                }
                return equipo;
            });
        });
        // Cerrar el modal u otras operaciones necesarias
        handleCloseReassignModal();
    })
    .catch(error => {
        console.error('Error al desasignar y reasignar el equipo:', error);
        setError('Error al desasignar y reasignar el equipo. Por favor, intenta nuevamente.');
    });
  };


  const obtenerHistorial = (equipoId) => {
    setLoading(true);
    axios.get(`${URL_DEV}equipos/historial/${equipoId.id}`, { headers: { Authorization: `Bearer ${auth}` } })
      .then(response => {
        setHistorial(response.data.historial);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener historial:', error);
        setLoading(false);
      });
  };

  const handleUnassignEquipo = (data) => {
    axios.put(`${URL_DEV}equipos/desasignar/${data.id}`, {
        equipo:data.id,
        equipo_id:data.id,
    }, { headers: { Authorization: `Bearer ${auth}` } })
      .then(response => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Equipo desasignado con éxito",
          showConfirmButton: false,
          timer: 2500
        });
  
        if (reloadTable) {
            reloadTable.reload()
        }
         // Actualizar el estado local de equipos
            const updatedEquipos = equipos.map(equipo => {
              if (equipo.id === data.equipo_id) {
                return { ...equipo, disponible: true };
              }
              return equipo;
            });

            // Si el equipo desasignado no existe en la lista de equipos, agrégalo
            if (!updatedEquipos.find(equipo => equipo.id === selectedEquipo)) {
              updatedEquipos.push({
                id: selectedEquipo,
                // Agrega otras propiedades del equipo si es necesario
                disponible: true // Marca el equipo como disponible nuevamente
              });
            }

            setEquipos(updatedEquipos);

            // Volver a cargar los equipos disponibles
            axios.get(`${URL_DEV}equipos/equipos`, { headers: { Authorization: `Bearer ${auth}` } })
              .then(response => {
                // Filtrar equipos disponibles nuevamente
                const available = response.data.inventario.filter(equipo => equipo.disponible);
                setAvailableEquipos(available);
              })
              .catch(error => {
                console.error('Error fetching equipos:', error);
                setError('Error al cargar los equipos. Por favor, intenta nuevamente.');
              });
  
        // Cerrar el modal u otras operaciones necesarias
        handleCloseModal(); // Cierra el modal de asignación si está abierto
      })
      .catch(error => {
        console.error('Error al desasignar el equipo:', error);
        setError('Error al desasignar el equipo. Por favor, intenta nuevamente.');
      });
  };

  const handleOpenEditModal = (equipo) => {
    // Carga los datos del equipo en el estado de editedEquipo
    setEditedEquipo({
      id: equipo.id,
      nombre: equipo.nombre,
      modelo: equipo.modelo,
      tipo: equipo.tipo,
      serie: equipo.serie,
      descripcion: equipo.descripcion,
    });
    // Abre el modal de editar equipo
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveEditedEquipo = () => {
    // Aquí puedes agregar la lógica para guardar los cambios del equipo
      axios.put(`${URL_DEV}equipos/${editedEquipo.id}`, editedEquipo, { headers: setSingleHeader(auth) }).then(
          (response) => {
              const { avance } = response.data
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Equipo desasignado con éxito",
                showConfirmButton: false,
                timer: 2500
              });
              if (reloadTable) {
                  reloadTable.reload()
              }
          }, (error) => { printResponseErrorAlert(error) }
      ).catch((error) => {
          errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
          console.error(error, 'error')
      })

    // Cierra el modal después de guardar los cambios
    handleCloseEditModal();
  };

  let handleClose = (tipo) => () => {
    setModal({
        ...modal,
        [tipo]: {
            show: false,
            data: false
          }
      })
  }

  return (
    <Layout authUser={authUser.access_token} location={{ pathname: '/rh/equipos-computo' }} history={{ location: { pathname: '/rh/equipos-computo' } }} active='rh'>
        <>
        <TablaGeneralPaginado
            titulo="Equipos" 
            columnas={columnas} 
            url="equipos" 
            // opciones={opcionesbtn} 
            acciones={createAcciones()} 
            numItemsPagina={50} 
            ProccessData={ProccessData}
            opciones={opciones}
            filtros={filtrado}
            reload={setReloadTable} 
            />
            
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="asignar-equipo-modal-title" aria-describedby="asignar-equipo-modal-description"  >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, bgcolor: 'background.paper', boxShadow: 24, p: 6 }}>
            <div className='row  justify-content-center px-2'>
                <div className="col-md-12 mx-auto">
                  <h2 id="asignar-equipo-modal-title">Asignar Equipo</h2>
                  <Card.Body className="d-flex align-items-center justify-content-center">
                    <div className='row mx-0 justify-content-center px-2'>
                          <div className="form-group row form-group-marginless mb-1">
                            <div className="col-md-12 text-justify">
                              <Autocomplete id="persona" options={users} getOptionLabel={(user) => {
                                    const nombre = user.nombre || '';
                                    const apellidoPaterno = user.apellido_paterno || '';
                                    const apellidoMaterno = user.apellido_materno || '';
                                    return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
                                  }}
                                  value={selectedUser} onChange={(e, newValue) => setSelectedUser(newValue)} renderInput={(params) => (
                                    <TextField {...params} label="Persona" variant="outlined" fullWidth required error={error && !selectedUser} className={classes.errorInput} /> )} style={{ width: 300 }}  
                                />
                          </div>
                      </div>
                    </div>
                  </Card.Body>
                </div>
                <div className='row  justify-content-center px-2'>
                    <div className="col-md-6 text-justify">
                      <Button variant="outlined" size="large" color="primary" onClick={handleAssignEquipo} startIcon={<SaveIcon />}>Asignar</Button>               
                    </div>
                    <div className="col-md-6 text-justify">
                    <Button variant="outlined" size="large" color="secondary"  onClick={()=>handleCloseModal()} >cerrar</Button>
                    </div>
                </div>
            </div>
          </Box>                  
        </Modal>

        <Modal open={openAddModal} onClose={handleCloseAddModal}  aria-labelledby="agregar-equipo-modal-title" aria-describedby="agregar-equipo-modal-description">
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 6 }}>
            <div className='row  justify-content-center px-2'>
                  <div className="col-md-12 mx-auto">
                    <h2 id="asignar-equipo-modal-title">Agregar Equipo</h2>
                    <Card.Body className="d-flex align-items-center justify-content-center">
                      <div className='row mx-0 justify-content-center px-2'>
                            <div className="form-group row form-group-marginless mb-1">
                              <div className="col-md-12 text-justify mb-3">
                                  <TextField label="Marca" value={newEquipo.nombre} onChange={(e) => setNewEquipo({ ...newEquipo, nombre: e.target.value })} fullWidth mb={2} required  className={error && !newEquipo.nombre ?  classes.errorInput : ''} />
                              </div>
                              
                              <div className="col-md-12 text-justify mb-3">
                                  <TextField label="Modelo" value={newEquipo.modelo} onChange={(e) => setNewEquipo({ ...newEquipo, modelo: e.target.value })} fullWidth mb={2} required  className={error && !newEquipo.modelo ?  classes.errorInput : ''} />
                              </div>
                              <div className="col-md-12 text-justify mb-2">
                               <Autocomplete
                                  id="tipo"
                                  options={tiposEquipos}
                                  getOptionLabel={(option) => option} value={newEquipo.tipo} onChange={(event, newValue) => setNewEquipo({ ...newEquipo, tipo: newValue })} renderInput={(params) => (
                                  <TextField {...params} label="Tipo" variant="outlined" fullWidth required className={error && !newEquipo.tipo ? classes.errorInput : ''} />
                                  )}
                                  />

                              </div>
                              <div className="col-md-12 text-justify mb-2">
                                <TextField label="Serie" value={newEquipo.serie} onChange={(e) => setNewEquipo({ ...newEquipo, serie: e.target.value })} fullWidth mb={2} />
                              </div>
                              <div className="col-md-12 text-justify mb-2 ">
                              <TextField label="Descripcion" value={newEquipo.descripcion} onChange={(e) => setNewEquipo({ ...newEquipo, descripcion: e.target.value })} fullWidth mb={2} required  className={error && !newEquipo.descripcion ?  classes.errorInput : ''} />
                              </div>
                        </div>
                      </div>
                    </Card.Body>
                  </div>
                  <div className='row  justify-content-center px-2'>
                    <div className="col-md-6 text-justify">
                      <Button variant="outlined" size="large" color="primary" onClick={handleAddEquipo} startIcon={<SaveIcon />}>Agregar</Button>               
                    </div>
                    <div className="col-md-6 text-justify">
                    <Button variant="outlined" size="large" color="secondary"  onClick={()=>handleCloseAddModal()} >cerrar</Button>
                    </div>
                </div>
              </div>
          </Box>
        </Modal>

        <Modal open={openReassignModal} onClose={handleCloseReassignModal} aria-labelledby="reasignar-equipo-modal-title" aria-describedby="reasignar-equipo-modal-description">
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 6 }}>
              <div className='row  justify-content-center px-2'>
                  <div className="col-md-12 mx-auto">
                    <h2 id="asignar-equipo-modal-title">Desasignar y Reasignar Equipo</h2>
                    <Card.Body className="d-flex align-items-center justify-content-center">
                      <div className='row mx-0 justify-content-center px-2'>
                            <div className="form-group row form-group-marginless mb-1">
                            <div className="col-md-12 text-justify">
                               {equipoUser && (
                                  <p><strong>Marca:</strong> {equipos.find(equipo => equipo.id === equipoUser.equipo_id)?.nombre}</p>
                                )}
                             </div> 
                             <div className="col-md-12 text-justify">
                               {equipoUser && (
                                  <p><strong>Modelo:</strong> {equipos.find(equipo => equipo.id === equipoUser.equipo_id)?.modelo}</p>
                                )}
                             </div> 
                             <div className="col-md-12 text-justify">
                               {equipoUser && (
                                  <p><strong>Serie:</strong> {equipos.find(equipo => equipo.id === equipoUser.equipo_id)?.serie}</p>
                                )}
                             </div>       
                            <div className="col-md-12 text-justify">
                                <p> <strong>Usuario actualmente asignado: </strong> {currentAssignedUser}</p>                          
                              </div>       
                              <div className="col-md-12 text-justify">

                              <Autocomplete id="nuevaPersona" options={users} getOptionLabel={(user) => {
                                    const nombre = user.nombre || '';
                                    const apellidoPaterno = user.apellido_paterno || '';
                                    const apellidoMaterno = user.apellido_materno || '';
                                    return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
                                  }}
                                  value={selectedUser} onChange={(e, newValue) => setSelectedUser(newValue)} renderInput={(params) => (
                                    <TextField {...params} label="Persona" variant="outlined" fullWidth required error={error && !selectedUser} className={classes.errorInput} /> )} style={{ width: 400 }}  
                                />
                              </div>                           
                        </div>
                      </div>
                    </Card.Body>
                  </div>
                  <div className='row  justify-content-center px-2'>
                    <div className="col-md-6 text-justify">
                      <Button variant="outlined" size="large" color="primary" onClick={handleReassignEquipo} startIcon={<SaveIcon />}>Reasignar</Button>               
                    </div>
                    <div className="col-md-6 text-justify">
                    <Button variant="outlined" size="large" color="secondary"  onClick={()=>handleCloseReassignModal()} >cerrar</Button>
                    </div>
                </div>
              </div>
          </Box>
        </Modal>

        <Modal open={showHistorialModal} onClose={handleCloseHistorialModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', boxShadow: 24, p: 6 }}>
             <div className='row  justify-content-center px-2'>
                  <div className="col-md-12 mx-auto">
                    <h2 id="asignar-equipo-modal-title">Historial de Asignación</h2>
                  <div style={{ maxHeight: '70vh', overflow: 'auto' }}> {/* Establece una altura máxima y permite el desplazamiento vertical */}
                    <Card.Body className="d-flex align-items-center justify-content-center">
                      <div className='row mx-0 justify-content-center px-2'>
                        <div className="form-group row form-group-marginless mb-1">
                          <div className="col-md-12 text-justify">
                            {loading && <p>Cargando historial...</p>}
                              {!loading && historial.length === 0 && <p>No hay historial disponible para este equipo.</p>}
                              {!loading && historial.length > 0 && (
                                
                                historial.map(asignacion => (
                                 <List className={classes.root}>
                                 <ListItem>
                                   <ListItemAvatar>
                                     <Avatar src= {asignacion.empleado && asignacion.empleado.usuario ? asignacion.empleado.usuario.avatar : '' } >
                                     </Avatar>
                                   </ListItemAvatar>
                                   <ListItemText primary={asignacion.empleado ? asignacion.empleado.nombre+' '+asignacion.empleado.apellido_paterno+' '+asignacion.empleado.apellido_materno : ''} secondary={asignacion.fecha_asignacion} />
                                 </ListItem>
                                 </List>
                                 ))
                              )}
                          </div>                              
                        </div>
                      </div>
                    </Card.Body>
                    </div>

                  </div>
                  <div className='row  justify-content-center px-2'>
                    <div className="col-md-6 text-justify">
                    <Button variant="outlined" size="large" color="secondary"  onClick={()=>handleCloseHistorialModal()} >cerrar</Button>
                    </div>
                </div>
              </div>
          </Box>
        </Modal>

        <Modal open={openEditModal} onClose={handleCloseEditModal} >
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', boxShadow: 24, p: 6 }}>
             <div className='row  justify-content-center px-2'>
                  <div className="col-md-12 mx-auto">
                    <h2 id="asignar-equipo-modal-title">Editar de registro</h2>
                  <div style={{ maxHeight: '70vh', overflow: 'auto' }}> {/* Establece una altura máxima y permite el desplazamiento vertical */}
                    <Card.Body className="d-flex align-items-center justify-content-center">
                      <div className='row mx-0 justify-content-center px-2'>
                        <div className="form-group row form-group-marginless mb-1">
                          <div className="col-md-12 text-justify mb-2">
                            <TextField  label="Marca"  value={editedEquipo.nombre}  onChange={(e) => setEditedEquipo({ ...editedEquipo, nombre: e.target.value })}  fullWidth  mb={2}  required  />
                          </div>   
                          <div className="col-md-12 text-justify mb-2">
                             <TextField  label="Modelo"  value={editedEquipo.modelo}  onChange={(e) => setEditedEquipo({ ...editedEquipo, modelo: e.target.value })}  fullWidth  mb={2}  required  />
                          </div>  
                          <div className="col-md-12 text-justify mb-2">
                          <Autocomplete
                            id="tipo"
                            options={tiposEquipos}
                            value={editedEquipo.tipo}
                            onChange={(event, newValue) => setEditedEquipo(prevState => ({ ...prevState, tipo: newValue }))}
                            renderInput={(params) => <TextField {...params} label="Tipo" variant="outlined" fullWidth />}
                          />                        
                          </div>
                          <div className="col-md-12 text-justify mb-2">
                            <TextField  label="Serie"  value={editedEquipo.serie}  onChange={(e) => setEditedEquipo({ ...editedEquipo, serie: e.target.value })}  fullWidth  mb={2} />
                          </div>
                          <div className="col-md-12 text-justify mb-2">
                            <TextField  label="Descripción"  value={editedEquipo.descripcion}  onChange={(e) => setEditedEquipo({ ...editedEquipo, descripcion: e.target.value })}  fullWidth  mb={2}  required />
                          </div>  

                        </div>
                      </div>
                    </Card.Body>
                    </div>

                  </div>
                  <div className='row  justify-content-center px-2'>
                    <div className="col-md-6 text-justify">
                      <Button variant="outlined" size="large" color="primary" onClick={handleSaveEditedEquipo}>Guardar </Button>
                    </div>
                    <div className="col-md-6 text-justify">
                    <Button variant="outlined" size="large" color="secondary"  onClick={()=>handleCloseEditModal()} >cerrar</Button>
                    </div>
                </div>
              </div>
          </Box>
        </Modal>

        <Modal open={openFiltrarModal} onClose={handleCloseFiltrarModal} aria-labelledby="reasignar-equipo-modal-title" aria-describedby="reasignar-equipo-modal-description">
        {/* <Modal size="lg" title={"filtrar"} show={modal.filtrar.show} handleClose={handleClose('filtrar')}> */}
            <Filtrar handleClose={handleCloseFiltrarModal} opciones={users} filtrarTabla={setFiltrado} borrarTabla={borrar} users={users} error={error}
             newEquipo={newEquipo} setNewEquipo={setNewEquipo} classes={classes} selectedUser={selectedUser} setSelectedUser={setSelectedUser}  />
        </Modal>

    </>
    </Layout>
  );
}

export default App;
