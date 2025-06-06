import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Button, Form, Modal } from 'react-bootstrap';
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral';
import { apiDelete, apiPostForm, apiPutForm } from '../../../functions/api';
import Layout from '../../../components/layout/layout';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import InputMask from 'react-input-mask';
import { URL_DEV } from '../../../constants';
import axios from 'axios';


const App = () => {
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState(() => ({
        reload: () => setReloadTable((prev) => !prev),
    }));
    const [modal, setModal] = useState({
        crear: { show: false, data: false },
        editar: { show: false, data: false }
    });
    const [currentPayment, setCurrentPayment] = useState({
        aplicacion: '',
        fecha: '',
        tarjeta: '',
        responsable_id: '',
        frecuencia: ''
    });
    const [responsables, setResponsables] = useState([]);

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Aplicacion', identificador: 'nombre', sort: false, stringSearch: false },
        { nombre: 'Fecha Pago', identificador: 'fecha', sort: false, stringSearch: false },
        { nombre: 'Responsable', identificador: 'responsable', sort: false, stringSearch: false },
        { nombre: 'Frecuencia', identificador: 'frecuencia', sort: false, stringSearch: false },
        { nombre: 'Tarjeta', identificador: 'tarjeta', sort: false, stringSearch: false },
    ];

    useEffect(() => {
        const fetchResponsables = async () => {
            try {
                const auth = userAuth.access_token; // Obtén el token de autenticación del estado Redux
                const response = await axios.get(`${URL_DEV}equipos/equipos`, { headers: { Authorization: `Bearer ${auth}` } });
                if (!response.data) {
                    throw new Error('Failed to fetch responsables');
                }
                const data = response.data;
                const usuarios = data.usuarios || [];
                setResponsables(usuarios);
            } catch (error) {
                console.error('Error fetching responsables:', error);
            }
        };
        fetchResponsables();
    }, [userAuth.access_token]); 
    
    const tiposEquipos = [
        "DIARIO","SEMANAL","QUINCENAL","MENSUAL","TRIMESTRAL","ANUAL",
      ];

    const ProccessData = (data) => {
        return data.data.data.reverse().map((item) => ({ ...item, id: 
            item.id , 
            nombre: item.application,
            fecha: item.date,
            frecuencia: item.frequency,
            tarjeta: item.card_expiration,
            responsable: item.empleado ? item.empleado.nombre +" "+ item.empleado.apellido_paterno +" "+ item.empleado.apellido_materno : '' // Aquí llamarías a una función para obtener el nombre del responsable
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPayment({ ...currentPayment, [name]: value });
    };

    const handleAddPayment = async () => {
        try {
            await apiPostForm('payments', currentPayment, userAuth.access_token);
            Swal.fire('Success', 'Payment added successfully', 'success');
            setModal({ ...modal, crear: { show: false, data: false } });
            reloadTable.reload()

            // setReloadTable(prevReload => !prevReload); // Actualizar el estado para recargar la tabla
        } catch (error) {
            Swal.fire('Error', 'Failed to add payment', 'error');
        }
    };

    const handleEditPayment = async () => {
        try {
            // console.log(currentPayment)
            await apiPutForm(`payments/${currentPayment.id}`, currentPayment, userAuth.access_token);
            Swal.fire('Success', 'Payment edited successfully', 'success');
            setModal({ ...modal, editar: { show: false, data: false } });
            reloadTable.reload()

            // setReloadTable(prevReload => !prevReload); // Actualizar el estado para recargar la tabla
        } catch (error) {
            Swal.fire('Error', 'Failed to edit payment', 'error');
        }
    };

    const handleDeletePayment = async (item) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, bórralo!'
        });

        if (result.isConfirmed) {
            try {
                await apiDelete(`payments/${item.id}`, userAuth.access_token);
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                reloadTable.reload()
            } catch (error) {
                Swal.fire('Error', 'Failed to delete payment', 'error');
            }
        }
    };

    const createAcciones = () => [
        {
            nombre: 'Editar',
            icono: 'fas fa-edit',
            color: 'blueButton',
            funcion: (item) => {
                setCurrentPayment(item);
                setModal({ ...modal, editar: { show: true, data: item } });
            }
        },
        {
            nombre: 'Eliminar',
            icono: 'fas fa-trash',
            color: 'redButton',
            funcion: handleDeletePayment
        }
    ];

    const opciones = [
        {
            nombre: 'Agregar Pago',
            funcion: () => {
                setCurrentPayment({
                    aplicacion: '',
                    fecha: '',
                    tarjeta: '',
                    responsable: '',
                    frecuencia: ''
                });
                setModal({ ...modal, crear: { show: true, data: false } });
            }
        }
    ];

    const handleClose = (tipo) => () => {
        setModal({ ...modal, [tipo]: { show: false, data: false } });
    };

    
    const renderField = (field) => {
        if (field === 'responsable') {
            return (
                <Form.Group key={field}>
                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                    <Autocomplete
                        id={field}
                        options={responsables}
                        getOptionLabel={(option) => option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno || ''}
                        value={responsables.find(responsable => responsable.id === currentPayment.responsable_id) || null}
                        onChange={(event, newValue) => {
                            setCurrentPayment({
                                ...currentPayment,
                                responsable_id: newValue ? newValue.id : ''
                            });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label={field} variant="outlined" fullWidth required />
                        )}
                    />
                    
                </Form.Group>
            );
        } else if (field == 'frecuencia') {
            return (
                <Form.Group key={field}>
                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                    <Autocomplete
                        id={field}
                        options={tiposEquipos}
                        getOptionLabel={(option) => option}
                        value={currentPayment[field]}
                        onChange={(event, newValue) => handleInputChange({ target: { name: field, value: newValue } })}
                        renderInput={(params) => (
                            <TextField {...params} label={field} variant="outlined" fullWidth required />
                        )}
                        />
                </Form.Group>
            );
        } else if (field === 'tarjeta') {
            return (
                // <Form.Group key={field}>
                //     <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                //     <InputMask
                //         mask="99/99"
                //         value={currentPayment[field]}
                //         onChange={handleInputChange}
                //     >
                //         {(inputProps) => <Form.Control {...inputProps} name={field} />}
                //     </InputMask>
                // </Form.Group>
                <Form.Group key={field}>
                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                    <InputMask
                        mask="9999"
                        value={currentPayment[field]}
                        onChange={handleInputChange}
                        required
                    >
                        {(inputProps) => <Form.Control {...inputProps} name={field} />}
                    </InputMask>
                </Form.Group>
            );
        }  else if (field === 'cardLastFour') {
            return (
                <Form.Group key={field}>
                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                    <InputMask
                        mask="99/99"
                        value={currentPayment[field]}
                        onChange={handleInputChange}
                        required
                    >
                        {(inputProps) => <Form.Control {...inputProps} name={field} />}
                    </InputMask>
                </Form.Group>
            );
        } else {
            return (
                <Form.Group key={field}>
                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                    <Form.Control 
                        type={field === 'fecha' ? 'date' : 'text'} 
                        name={field} 
                        value={currentPayment[field]} 
                        onChange={handleInputChange} 
                    />
                </Form.Group>
            );
        }
    };

    return (
        <>
            <Layout authUser={userAuth.access_token} location={{ pathname: '/rh/pagos' }} history={{ location: { pathname: '/rh/pagos' } }} active='rh'>
                <TablaGeneral 
                    titulo='Pagos' 
                    columnas={columnas} 
                    url='payments' 
                    ProccessData={ProccessData} 
                    numItemsPagina={12} 
                    acciones={createAcciones()} 
                    opciones={opciones} 
                    reload={setReloadTable} // Asegúrate de pasar reloadTable aquí
                    />
            </Layout>

            <Modal show={modal.crear.show} onHide={handleClose('crear')}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {['aplicacion', 'fecha', 'tarjeta', 'responsable', 'frecuencia'].map((field) => (
                    //    console.log(field)
                             renderField(field)
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose('crear')}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleAddPayment}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modal.editar.show} onHide={handleClose('editar')}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {['nombre', 'fecha', 'tarjeta', 'responsable', 'frecuencia'].map((field) => (
                            renderField(field)
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose('editar')}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleEditPayment}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default App;
