import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { renderToString } from 'react-dom/server'
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { Modal, ItemSlider, ItemDoubleSlider } from '../../components/singles'
import {  FileInput } from '../../components/form-components'
import { Tabs, Tab, Form, DropdownButton, Dropdown, Card } from 'react-bootstrap'
import j2xParser from 'fast-xml-parser'
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios'; 

// import { Modal } from './../../../components/singles'

import TablaGeneralPaginado from '../../components/NewTables/TablaGeneral/TablaGeneralPaginado'

import  FacturacionCard  from './VerFactura'
import Filtrar from './Filtrar'
import FacturaExtranjera from './FacturaExtranjera'

import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import { setDateTable ,setLabelTable , setMoneyTable} from '../../functions/setters'
import { waitAlert, errorAlert, doneAlert,printResponseErrorAlert } from '../../functions/alert'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';


import StatusIndicatorGastos from './Egresos/Modales/StatusIndicatorGastos'

import Swal from 'sweetalert2'

import { apiOptions, catchErrors, apiDelete, apiPostFormResponseBlob,apiPostForm } from './../../functions/api';

export default function FEgresoTable(props) { 
    const auth = useSelector((state) => state.authUser.access_token);
    const [opcionesData, setOpcionesData] = useState()
    const [reloadTable, setReloadTable] = useState()
    const [form, setForm] = useState({     
        fecha_fin: '',
        fecha_inicio: '',
        idSeleccionado: '',
        adjuntos: {
            factura: {
                value: '',
                placeholder: 'Adjuntar factura',
                files: []
            }, adjuntos: {
                value: '',
                placeholder: 'Ingresa los adjuntos',
                files: []
            },relacionados:{
                value: '',
                placeholder: 'Facturas relacionadas',
                files: []
            }
        }
    })
    const {eliminar } = props

    const [modal, setModal] = useState({
        ver: {
            show: false,
            data: null
        },
        editar: {
            show: false,
            data: null
        },
        crear: {
            show: false,
            data: null
        },
        filtrar: {
            show: false,
            data: null
        },
        facturaExtranjera: {
            show: false,
            data: null
        },
        facturas: {
            show: false,
            data: null
        },
        exportar: {
            show: false,
            data: null
        },
        cancelar: {
            show: false,
            data: null
        },
    })

    useEffect(() => {
        getProveedores()
    }, [filtrado])
    
    const getProveedores = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })
        apiOptions(`facturas/facturaOpcciones`, auth)
            .then(res => {
                let data = res.data

                let aux = {
                    clientes: [],
                    proveedores: [],
                }

                data.preveedores.map((proveedor) => {
                    if (proveedor.razon_social !== null) {
                        aux.proveedores.push({
                            id: proveedor.id,
                            name: proveedor.razon_social,
                            rfc: proveedor.rfc,
                        })   
                    }  
                })

                data.clientes.map((cliente) => {
                    if (cliente.nombre !== null) {
                        aux.clientes.push({
                            id: cliente.id,
                            name: cliente.nombre,
                            rfc: cliente.rfc,
                        })
                    }
                })

               

                Swal.close()
                setOpcionesData(aux)
                // setProveedoresData(aux);
            }
        )
        
    }

    const [filtrado, setFiltrado] = useState('') 

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

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const deleteEgresoAxios = (id) => {

        apiDelete(`facturas/egreso/${id}`, auth).then(
            (response) => {
                Swal.fire(
                    '¡Eliminado!',
                    'El egreso ha sido eliminado.',
                    'success'
                )
                if (reloadTable) {
                    reloadTable.reload()
                }
            }, (error) => { }
        ).catch((error) => { catchErrors(error) })
    }  


    const cancelaFactura = (id) => {
        apiDelete(`facturas/facturacancelaegreso/${id}`, auth).then(
            (response) => {
                Swal.fire(
                    '¡Cancelado!',
                    'El egreso ha sido Cancelado.',
                    'success'
                )
                if (reloadTable) {
                    reloadTable.reload()
                }
            }, (error) => { }
        ).catch((error) => { catchErrors(error) })
    }  

    const columns = [
        { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'Estatus', identificador: 'estatus'},
        { nombre: 'Egreso', identificador: 'id', stringSearch: false },
        { nombre: 'Folio', identificador: 'folio', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'Serie', identificador: 'serie', orderable: false },
        { nombre: 'Emisor', identificador: 'emisor', stringSearch: false },
        { nombre: 'Receptor', identificador: 'receptor', stringSearch: false },
        { nombre: 'Subtotal', identificador: 'subtotal',  },        
        { nombre: 'Total', identificador: 'total', },
        // { nombre: 'N.° CERT', identificador: 'certificado', stringSearch: false },

        { nombre: 'MDP', identificador: 'pago', stringSearch: false }, //quitar
        { nombre: 'Descripcion', identificador: 'descripcion', stringSearch: false }, //qui
        { nombre: 'Adjuntos', identificador: 'factura', stringSearch: false ,active : true }, //quitar

    ]

    const acciones = [
        {
            nombre: 'Mostrar',
            icono: 'fas fa-edit',
            color: 'blueButton',
            funcion: (item) => {
                openModal('editar', item)
            }
        },

        {
            nombre: 'Eliminar',
            icono: 'fas fa-trash-alt',
            color: 'redButton',
            funcion: (item) => {
                eliminar == 1 ?
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',

                    confirmButtonText: 'Sí, bórralo',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {


                    if (result.isConfirmed) {
                        deleteEgresoAxios(item.id)
                        
                    }
                })
                :   
                Swal.fire({
                    icon: 'error',
                    title: 'No tienes permiso',
                    text: 'Lo sentimos no tienes permiso para borrar...',
                    showConfirmButton: false,
                    timer: 4000
                })
                
            }
        },
        {
            nombre: 'Cancelar',
            icono: 'fas fa-trash-alt',
            color: 'redButton',
            funcion: (items) => {
                if(eliminar == 1){
                    if (!Array.isArray(items.data) || items.data.length === 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No hay elementos disponibles para cancelar',
                            showConfirmButton: true,
                        });
                        return;
                    }
    
                    const idsDisponibles = items.data.map(item => ({
                        value: item.id,
                        label: item.folio ? `${item.folio} - ${item.id}` : `Sin folio - ${item.id}`,
                    }));        
    
                    Swal.fire({
                        title: 'Selecciona el ID a cancelar',
                        input: 'select',
                        inputOptions: idsDisponibles.reduce((acc, curr) => {
                                acc[curr.value] = curr.label;
                                return acc;
                        }, {}),                   
                        inputPlaceholder: 'Selecciona un ID',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Sí, Cancelar',
                        inputValidator: (value) => {
                            if (!value) {
                                return 'Debes seleccionar un ID';
                            }
                        },
                   
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const idSeleccionado = result.value;
                            form.idSeleccionado = idSeleccionado
                            openModal('cancelar', idSeleccionado)

                        }
                    });

                }else{
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'No tienes permiso',
                        text: 'Lo sentimos no tienes permiso para borrar...',
                        showConfirmButton: false,
                        timer: 4000
                    })
                }
                
            }

        },
    
    ]

    function cancelaFacturaConAdjuntos(idSeleccionado, archivosAdjuntos) {
        const formData = new FormData();
        formData.append('id', idSeleccionado);
    
        for (let i = 0; i < archivosAdjuntos.length; i++) {
            formData.append('archivos[]', archivosAdjuntos[i]);
        }
    
        // Ejemplo de solicitud POST utilizando axios
        axios.post('/ruta/para/cancelarFactura', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            // Manejar la respuesta del servidor si es necesario
            console.log('La factura se canceló correctamente:', response.data);
        })
        .catch(error => {
            // Manejar errores si ocurren
            console.error('Error al cancelar la factura:', error);
        });
    }

    const opciones = [
        {
            nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
            funcion: (item) => {
                openModal('filtrar', item)
            }
        },
        {
            nombre: <div><i className="fas fa-file-export mr-5"></i><span>Exportar</span></div>,
            funcion: (item) => {
                openModal('exportar', item)
                // exportEgresosAxios(item.id)
            }
        },
    ]

    const  exportEgresosAxios = () => {
    
        if(form.fecha_fin && form.fecha_inicio){
            Swal.fire({
                icon: 'success',
                title: 'Descargar egreso',
                text: 'Exportando egreso espere...',
                showConfirmButton: false,
                timer: 4000
            })
    
            apiPostFormResponseBlob(`facturas/exportegreso`,{ columnas: form },  auth).then(
                (response) => {
                    
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'egreso.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    setModal({
                        ...modal,
                        ['exportar']: {
                            show: false,
                            data: null
                        }
                    })
                    doneAlert(
                        response.data.message !== undefined ? 
                            response.data.message 
                        : 'Egreso exportados con éxito.'
                    )
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { catchErrors(error) })

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Campos obligatorios',
                text: 'Por favor, completa las fechas de inicio y fin.',
              });
              return; // Detén la función si los campos están vacíos
    

        }
        

    }

    const openModal = (tipo, data) => {

        // if(data.factura == 'Sin factura' && tipo == 'facturas' ){
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'No tiene facura',
        //         text: 'El registro es sin factura',
        //         showConfirmButton: false,
        //         timer: 1500
        //     })
            
        // }
        // else{
            form.fecha_inicio = ''
            form.fecha_fin = ''
            // form.idSeleccionado = ''

            setModal({
                ...modal,
                [tipo]: {
                    show: true,
                    data: data
                }
            })
        // }

    }

    const handleClose = (tipo) => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: null
            }
        })
    }

    const createStatusIndicator = (item) => {
        const createStatusIndicator = (item) => {
            return (
                <StatusIndicatorGastos data={item} />
            )
        }
    }
    
    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }
    // console.log('si entra')

    const proccessData = (datos) => { 
        // console.log(datos)
        let aux = []
        datos.data.data.map((dato) => {
            // fatura.facturas.map((dato) => {
                // const ventasIds = dato.factura.ventas ? dato.factura.ventas.map(venta => venta.id).join(' , ') : '';
                // console.log(dato.facturas.slice(1))

                aux.push({
                    data: dato.facturas,
                    estatus: setLabelTables(dato),
                    id: dato.id,
                    folio: dato.facturas && dato.facturas[0].folio ? dato.facturas[0].folio : 'N/A',
                    fecha: dato.facturas && dato.facturas[0] ? setDateTable(dato.facturas[0].created_at) : '',
                    serie: dato.facturas ? dato.facturas[0].serie : '',
                    emisor: dato.facturas ? emisor(dato.facturas[0].rfc_emisor,dato.facturas[0].nombre_emisor)  : '',
                    receptor: dato.facturas ? receptor( dato.facturas[0].rfc_receptor,dato.facturas[0].nombre_receptor)  : '',
                    subtotal: dato.facturas ? setMoneyTable(dato.facturas[0].subtotal) : '',
                    total: dato.facturas ?  montos(dato)  : '',
                    certificado : dato.facturas ? dato.facturas[0].numero_certificado : '',
                    pago : dato.facturas ? dato.facturas[0].metodo_pago : 'N/A',
                    descripcion: dato.facturas && dato.facturas[0].descripcion ? descripcion(dato.facturas[0].descripcion) : 'N/A',
                    factura:dato.facturas ? adjuntos(dato) : 'N/A',  
                    objeto: dato.facturas ? dato.facturas[0] : ''

    
                })
            // }
            // )
        }
        )
        return aux
    }

    const setLabelTables = (objeto) => {
        let totalFacturas = 0;

        objeto.facturas.forEach(factura => {
            totalFacturas += factura.total;
        });       
        let restante = objeto.total - totalFacturas
        let resul = restante < 0 ? 0 : restante
        let resul2 = restante < 0 ? restante :  0
        let numeroPositivo = Math.abs(resul2);

        let text = {}

        if (totalFacturas == objeto.total || restante >= 0.01 && restante <= 1 ) {
             text.letra = '#388E3C'
             text.fondo = '#E8F5E9'
             text.estatus = 'PAGADA'
        }
        else {
            if (resul > 0) {
                text.letra = '#000000'
                text.fondo = '#ffff51'
                text.estatus = 'PROCESO'
               
            } else{
                if( numeroPositivo > 0){
                    text.letra = '#388E3C'
                    text.fondo = '#E8F5E9'
                    text.estatus = 'A FAVOR'
                }else{
                    if(totalFacturas < objeto.total ){
                        text.letra = '#000000'
                        text.fondo = '##ff7360'
                        text.estatus = 'PENDIENTE'
                    }
                }
            }
        }
    
        return setLabelTable(text)
    }

    const setLabelFacturas = (objeto) => {

        let text = {}

            // console.log(facturas)
            if(objeto.cancelada == 1){
                text.letra = '#8950FC'
                text.fondo = '#EEE5FF'
                text.estatus = 'CANCELADA'
            }else{
                text.letra = '#388E3C'
                text.fondo = '#E8F5E9'
                text.estatus = 'PAGADA'
            }
            // text.push(text);

        return setLabelTable(text)
    }
    
    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 500,
          maxHeight: 500,
          fontSize: theme.typography.pxToRem(14),
          border: '1px solid #dadde9',
        },
      }))(Tooltip);


      const adjuntos = (dato) => { 
        const datos = dato.facturas 
            return(
            <div>  
                {datos.map((item, index) => (
                    <div key={index}>
                        <HtmlTooltip interactive 
                        title={
                            <React.Fragment>        
                                <em>{"V: " + dato.id }</em>
                                {datos[index] == datos[0] ?
                                    <em>{" / Factura: "}</em>
                                    :
                                    <em>{" / Complemento: "}</em>
                                }
                                {
                                    item.pdf && item.pdf.url ?
                                    <a href={item.pdf && item.pdf.url ? item.pdf.url : ''} target="_blank" title="Factura pdf">PDF </a>
                                    : ''
                                }
                                {
                                    item.xml && item.xml.url ?
                                    <a href={item.xml && item.xml.url ? item.xml.url : ''} target="_blank" title="Factura xml!">xml </a>
                                    : ''
                                }
                                <em>{" / Serie: "} {item.serie  }</em>
                            </React.Fragment>
                        }
                        >
                        <Button > {setLabelFacturas(item)}  {item.folio ? (" F: "+item.folio) : 'S/N'} </Button>
                        </HtmlTooltip>
                    </div>
                    ))} 
                </div>      
             )                
    }

    const montos = (dato) => {  
        let totalFacturas = 0;

            dato.facturas.forEach(factura => {
                totalFacturas += factura.total;
            });       
            let restante = dato.total - totalFacturas
            let resul = restante < 0 ? 0 : restante
            let resul2 = restante < 0 ? restante :  0
            let numeroPositivo = Math.abs(resul2);

        return(               
           <div>       
    

            <div>
                <HtmlTooltip interactive
                title={
                    <React.Fragment >                 
                        {"Venta: " + dato.total.toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) } <br></br>
                        {"Pagado: " + totalFacturas.toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) }<br></br>
                        {"Pendiente: " + ( resul).toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) }<br></br>
                        {"A Favor: " + ( numeroPositivo).toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) }

                    </React.Fragment>
                } >
                <Button>{setMoneyTable(dato.total)} </Button>
                </HtmlTooltip>
            </div>     
            </div>
        )
    }


      const receptor = (rfc,nombre) => {  
        return(            
           <div>        
            <div>
                <HtmlTooltip interactive
                title={
                    <React.Fragment >                 
                        {"RFC: " + rfc } <br></br>
                        {"Receptor: " + nombre }
                    </React.Fragment>
                } >
                <Button>{rfc} </Button>
                </HtmlTooltip>
            </div>              
            </div>
        )
    }

      const emisor = (rfc,nombre) => {  
        return(            
           <div>        
            <div>
                <HtmlTooltip
                title={
                    <React.Fragment>                 
                        {"RFC: " + rfc } <br></br>
                        {"Emisor: " + nombre }
                    </React.Fragment>
                } >
                <Button>{rfc} </Button>
                </HtmlTooltip>
            </div>              
            </div>
        )
    }

      const descripcion = (dato) => {  
        return(            
           <div>        
            <div>
                <HtmlTooltip
                title={
                    <React.Fragment>                 
                        {"Descripcion: " + dato }
                    </React.Fragment>
                } >
                <Button>{dato} </Button>
                </HtmlTooltip>
            </div>              
            </div>
        )
    }
      
  
    const compras = (dato) => {  
        return(
            
           <div>   
            {dato.map((item, index) => (
            <div>
                <HtmlTooltip
                title={
                    <React.Fragment>                 
                        {"Compra: " +item.id + " Monto: $"+ item.monto}
                    </React.Fragment>
                }
                >
                <Button>{item.id} </Button>
                </HtmlTooltip>
            </div>
              
              ))}
            </div>

        )
    }

    const label = (dato) => {  
        return(
    
            <div   title={`${ dato.factura == 1 ? 'Con factura': 'Sin factura'}`}  >
                {
                    dato.factura ?
                      dato.facturas.length > 0 || dato.facturas_pdf.length ?
                     <span   style={{ color: 'green' }}><DoneAllIcon/></span>
                        : <span   style={{ color: 'red' }}><DoneAllIcon/></span>
                    : <span><DescriptionOutlinedIcon/></span>
                }
            </div>
        )
    }

    const handleChange = (files, item) => { onChangeAdjunto({ target: { name: item, value: files, files: files } }) }

    const onChangeAdjunto = e => {
        // const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        setForm({ ...form, form })
    }


    const cancelarFacturaAxios =() =>{
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })

        apiPostForm('facturas/cancelar/' + form.idSeleccionado, data, auth).then((response) => {

                let data = response.data
                // console.log(response)
                setModal({
                    ...modal,
                    ['cancelar']: {
                        show: false,
                        data: null
                    }
                })
                doneAlert('Factura cancelada con éxito')
                if (reloadTable) {
                    reloadTable.reload()
                }
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }



    return (
        <>
            <TablaGeneralPaginado
                titulo="Egresos"
                subtitulo="listado de egresos"
                url={'facturas/facturaegreso'}
                columnas={columns}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={opciones}
                acciones={acciones}
                onCellClick={ ()=>console.log('ass')}
                reload={setReloadTable} 
                filtros={filtrado}
            />

            {
                modal.editar?.data &&
                <Modal size="lg" title={"Ver egreso"} show={modal.editar?.show} handleClose={e => handleClose('editar')} >
                    <FacturacionCard  reload={reloadTable} data={modal.editar?.data?.data}/>
                </Modal>
            }

            {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar egreso"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
                </Modal>
            }

            {
                modal.exportar.data &&
                <Modal size="lg" title={"Exportar egreso"} show={modal.exportar?.show} handleClose={e => handleClose('exportar')} >
                    {/* <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/> */}
                        <div className="form-group form-group-marginless  mx-0">
                                <br></br> 
                            <div className="row">
                            <div className="col-md-3">
                            </div> 

                                <div className="col-md-3">
                                    <InputLabel >FECHA INICIAL</InputLabel>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                        <Grid container >
                                            <KeyboardDatePicker

                                                format="dd/MM/yyyy"
                                                name="fecha_inicio"
                                                value={form.fecha_inicio !== '' ? form.fecha_inicio : null}
                                                placeholder="dd/mm/yyyy"
                                                onChange={e => handleChangeFecha(e, 'fecha_inicio')} 
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </div> 

                                <div className="col-md-3">
                                    <InputLabel >FECHA FINAL</InputLabel>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                        <Grid container >
                                            <KeyboardDatePicker

                                                format="dd/MM/yyyy"
                                                name="fecha_fin"
                                                value={form.fecha_fin !== '' ? form.fecha_fin : null}
                                                placeholder="dd/mm/yyyy"
                                                onChange={e => handleChangeFecha(e, 'fecha_fin')} 
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </div>     
                            </div>
                            <br></br> 

                            <div className=" row ">
                                <div className="col-md-6"> 
                                </div>
                                <div className="col-md-6">
                                    <Button variant="contained" color="primary" onClick={exportEgresosAxios}>Filtrar</Button>
                                </div>
                            </div>

                        </div>
                </Modal>
            }


            {
                modal.cancelar.data &&
                <Modal size="lg" title={"Agregar adjuntos para cancelar"} show={modal.cancelar?.show} handleClose={e => handleClose('cancelar')}  >
                    <div className="mt-4 mb-4">
                        <ItemSlider items={form.adjuntos.adjuntos.files} handleChange={handleChange} item="adjuntos" multiple={true} />
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button  className="btn btn-primary"
                                    onClick={(e) => { e.preventDefault(); waitAlert(); cancelarFacturaAxios() }} >
                                    Enviar
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            }



                {/* <Modal title = "Agregar facturas" show = { modalFacturas } handleClose = { this.handleCloseFacturas }>
                    <Form  >
                        <div className="mt-3 mb-4 text-center">
                            <FileInput onChangeAdjunto = { this.onChangeAdjuntoFacturas } placeholder = { form.adjuntos.factura.placeholder }
                                value = { form.adjuntos.factura.value} name = 'factura' id = 'factura' accept = "text/xml, application/pdf"
                                files = {form.adjuntos.factura.files } deleteAdjunto = { this.clearFiles } multiple
                                classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                iconclass='flaticon2-clip-symbol text-primary'
                                />
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR"
                                        onClick={(e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios(); }} />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal> */}
            {/* {
                modal.facturaExtranjera.data &&
                <Modal size="lg" title={"Adjuntos"} show={modal.facturaExtranjera?.show} handleClose={e => handleClose('facturaExtranjera')} >
                    
                    <ItemDoubleSlider items = { modal.facturaExtranjera?.data?.data[0].relacionados } handleChange = { this.handleChangeRelacionadas } item = 'relacionados' 
                        deleteFile = { this.deleteRelacionada }
                    
                    // handleClose={e => handleClose('facturaExtranjera')} opcionesData={opcionesData} data={modal.facturaExtranjera.data}
                    />
                </Modal>
            } */}

{/* <Modal size = "xl" title = "Facturas relacionadas" show = { modalFacturaRelacionada } handleClose = { this.handleCloseFacturaRelacionada } >
                    <ItemDoubleSlider items = { form.adjuntos.relacionados.files } handleChange = { this.handleChangeRelacionadas } item = 'relacionados' 
                        deleteFile = { this.deleteRelacionada } /> 
                </Modal> */}

            {/* <Modal size="lg" title="Factura"  >
                <FacturacionCard factura = { factura } />
            </Modal> */}


            {/* <Modal size="lg" title={"Nuevo gasto"} show={modal.crear?.show} handleClose={e => handleClose('crear')} >
                <Crear getProveedores={getProveedores} handleClose={e => handleClose('crear')} opcionesData={opcionesData} reload={reloadTable}/> 
            </Modal>

            {
                modal.facturas.data &&
                <Modal size="xl" title={"Facturas"} show={modal.facturas?.show} handleClose={e => handleClose('facturas')} >
                    <Facturas handleClose={e => handleClose('facturas')}  opcionesData={opcionesData} egreso={modal.facturas.data}/>
                </Modal> 
            }
        
            {
                modal.editar?.data &&
                <Modal size="lg" title={"Editar gasto"} show={modal.editar?.show} handleClose={e => handleClose('editar')} >
                    <Editar handleClose={e => handleClose('editar')} opcionesData={opcionesData} reload={reloadTable} data={modal.editar?.data?.data}/>
                </Modal>
            }

            {
                modal.ver.data &&
                <Modal size="lg" title={"Ver gasto"} show={modal.ver?.show} handleClose={e => handleClose('ver')} >
                    <Ver handleClose={e => handleClose('ver')} opcionesData={opcionesData} data={modal.ver?.data?.data}/>
                </Modal>
            }
            
            {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
                </Modal>
            }

            {
                modal.facturaExtranjera.data &&
                <Modal size="lg" title={"Adjuntos"} show={modal.facturaExtranjera?.show} handleClose={e => handleClose('facturaExtranjera')} >
                    <FacturaExtranjera handleClose={e => handleClose('facturaExtranjera')} opcionesData={opcionesData} data={modal.facturaExtranjera.data}/>
                </Modal>
            } */}
        </>
    )

}