import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Modal, ItemSlider } from './../../components/singles'

import TablaGeneralPaginado from '../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { setMoneyTable, setOptions } from '../../functions/setters'
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import Crear from './Modales/CrearEgreso'
// import Editar from './Modales/EditarGasto'
// import Ver from './Modales/VerEgreso'
// import Filtrar from './Modales/Filtrar'
// import FacturaExtranjera from './Modales/FacturaExtranjera'
// import Facturas from './Modales/Facturas'

import j2xParser from 'fast-xml-parser'
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import { setDateTable, setLabelTable,setOptionsWithLabel,setSelectOptions } from '../../functions/setters'
import { waitAlert, errorAlert, doneAlert,printResponseErrorAlert, createAlert } from '../../functions/alert'
import { renderToString } from 'react-dom/server'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Filtrar from './Filtrar'
import  FacturacionCard  from './MostrarFactura'
import { Tabs, Tab, Form, DropdownButton, Dropdown, Card } from 'react-bootstrap'
import {  FileInput } from '../../components/form-components'
import axios from 'axios'
import { URL_DEV, FACTURAS_COLUMNS } from '../../constants'

import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// import { setMoneyTable } from '../../functions/setters'

import StatusIndicatorGastos from './Egresos/Modales/StatusIndicatorGastos'

import Swal from 'sweetalert2'

import { apiOptions,apiPutForm, catchErrors, apiDelete, apiPostFormResponseBlob, apiPostForm, getOptionsAxios } from './../../functions/api';

const useStyles = makeStyles((theme) => ({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

  
export default function FacturaTable(props) { 
    const auth = useSelector((state) => state.authUser.access_token);
    const [opcionesData, setOpcionesData] = useState()
    const [reloadTable, setReloadTable] = useState()
    const [selectedOptions, setSelectedOptions] = useState({
        compras: null,
        ventas: null,
        ingreso: null,
        egresos: null,
        // Agrega más estados según sea necesario para cada opción
      });
      const classes = useStyles();
      const [age, setAge] = React.useState('');
      const [open, setOpen] = React.useState(false);

      const [selectData, setSelectData] = useState({
        empresas: [],
        clientes: [],
        proyectos: [],
        estatusFacturas: [],
        contratos: []
      });

      const [formData, setFormData] = useState({
        compras: '',
        ventas: '',
        ingreso: '',
        egresos: '',
      });

      const [form, setForm] = useState({
            facturaObject: '',
            fecha: new Date(),
            folio: '',
            serie: '',
            subtotal: '',
            total: '',
            descripcion: '',
            cliente: '',
            empresa: '',
            adjuntos: {
                pago: {files:[], value: ''},
                pdf: { files: [], value: '' },
                presupuesto: { files: [], value: '' },
                xml: { files: [], value: '' },
                adjuntos: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                },relacionados:{
                    value: '',
                    placeholder: 'Facturas relacionadas',
                    files: []
                },
                factura: {
                    value: '',
                    placeholder: 'Adjuntar factura',
                    files: []
                }
            }, 
            data: {
                facturas: []
            },
            key: 'facturas',
            

    })
    
      const handleChanges = (event) => {
        setAge(event.target.value);
      };
    
      const handleCloses = () => {
        setOpen(false);
      };
    
      const handleOpens = () => {
        setOpen(true);
      };

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
        asignar: {
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
        apiOptions(`v2/administracion/ingresos`, auth)
        // apiOptions(`facturas/facturaOpcciones`, auth)
            .then(res => {
                let data = res.data
                console.log(data)
                let aux = {
                    clientes: [],
                    proveedores: [],
                    empresas:[],
                }

                data.clientes.map((cliente) => {
                    if (cliente.nombre !== null) {
                        aux.clientes.push({
                            id: cliente.id,
                            name: cliente.nombre,
                            rfc: cliente.rfc,
                        })
                    }
                })
                data.empresas.map((empresa) => {
                    if (empresa.nombre !== null) {
                        aux.clientes.push({
                            id: empresa.id,
                            name: empresa.nombre,
                            rfc: empresa.rfc,
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

    const deleteEgresoAxios = (id) => {
        apiDelete(`facturas/facturaelimina/${id}`, auth).then(
            (response) => {
                Swal.fire(
                    '¡Eliminado!',
                    'La factura ha sido eliminado.',
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
        { nombre: 'Folio', identificador: 'folio', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'Serie', identificador: 'serie', orderable: false },
        { nombre: 'Emisor', identificador: 'emisor', stringSearch: false },
        { nombre: 'Receptor', identificador: 'receptor', stringSearch: false },
        { nombre: 'Subtotal', identificador: 'subtotal', stringSearch: false },
        { nombre: 'Total', identificador: 'total', },
        { nombre: 'No. Certificado', identificador: 'certificado', stringSearch: false },

        { nombre: 'MP', identificador: 'pago', stringSearch: false }, //quitar
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
                // console.log(item)
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
            funcion: (item) => {
                eliminar == 1 ?
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',

                    confirmButtonText: 'Sí, Cancelar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const idSeleccionado = item.id;
                        form.idSeleccionado = idSeleccionado

                        openModal('cancelar', idSeleccionado)                        
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
            nombre: 'Asignar',
            icono: 'fas fa-file-invoice',
            color: 'perryButton',
            funcion: (item) => {
                openModal('asignar', item)
            }
        },
    
    ]

    const opciones = [
        {
            nombre: <div><i className="fas fa-plus mr-5"></i><span>Nuevo</span></div>,
            funcion: (item) => {
                openModal('crear', item)
            }
        },
        {
            nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
            funcion: (item) => {
                openModal('filtrar', item)
            }
        },
        {
            nombre: <div><i className="fas fa-file-export mr-5"></i><span>Exportar</span></div>,
            funcion: (item) => {
                exportEgresosAxios(item.id)
            }
        },
    ]

    const cancelaFactura = (id) => {
        apiDelete(`facturas/facturas/${id}`, auth).then(

        // apiDelete(`facturas/facturacancela/${id}`, auth).then(
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

    const  exportEgresosAxios = () => {

        Swal.fire({
            icon: 'success',
            title: 'Descargar facturas',
            text: 'Exportando facturas espere...',
            showConfirmButton: false,
            timer: 4000
        })
        
        apiPostFormResponseBlob(`facturas/exportfacturasemisor`,{ columnas: form },  auth).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'facturas.xlsx');
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
                    : 'facturas exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })

   
    }

    const openModal = (tipo, data) => {
        if(data.factura == 'Sin factura' && tipo == 'facturas' ){
            Swal.fire({
                icon: 'error',
                title: 'No tiene facura',
                text: 'El registro es sin factura',
                showConfirmButton: false,
                timer: 1500
            })
            
        }else{
            setModal({
                ...modal,
                [tipo]: {
                    show: true,
                    data: data
                }
            })
        }

    }

    const handleClose = (tipo) => {
        formData.compras = ''
        formData.ventas = ''
        formData.ingreso = ''
        formData.egresos = ''

        form['adjuntos'] = {
            adjuntos: {
                value: '',
                placeholder: 'Ingresa los adjuntos',
                files: []
            }, factura: {
                value: '',
                placeholder: 'Adjuntar factura',
                files: []
            }, relacionados:{
                value: '',
                placeholder: 'Facturas relacionadas',
                files: []
            }
        }
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: null
            }
        })
    }

    // const createStatusIndicator = (item) => {
    //     const createStatusIndicator = (item) => {
    //         return (
    //             <StatusIndicatorGastos data={item} />
    //         )
    //     }
    // }
    
    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    const proccessData = (datos) => { 
        // console.log(datos)
        let aux = []
        datos.data.data.map((dato) => {
            aux.push({
                data: dato,
                id: dato.id,
                estatus: setLabelTables(dato),
                folio: dato ? dato.folio : 'N/A',
                fecha: dato.created_at ? setDateTable(dato.created_at) : 'N/A',
                serie: dato.serie ? dato.serie : 'N/A',
                emisor: dato.rfc_emisor && dato.nombre_emisor ? emisor(dato.rfc_emisor,dato.nombre_emisor)  : 'N/A',
                receptor: dato.rfc_receptor && dato.nombre_receptor ? receptor( dato.rfc_receptor,dato.nombre_receptor)  : 'N/A',
                subtotal: dato.subtotal == 0 ?  '$0' : setMoneyTable(dato.subtotal),
                total: dato.total  ?  setMoneyTable(dato.total) : '$0' ,
                certificado : dato.numero_certificado ? dato.numero_certificado : 'N/A',
                pago : dato.metodo_pago ? dato.metodo_pago : 'N/A',
                descripcion: dato.descripcion ? descripcion(dato.descripcion) : 'N/A',
                factura:dato ? adjuntos(dato) : 'N/A',  
                objeto: dato

           })
        }
        )
        return aux
    }


    const setLabelTables = (objeto) => {
        let restante = objeto.total - objeto.ventas_compras_count - objeto.ingresos_egresos_count
        let text = {}
        if (objeto.detenida) {
            text.letra = '#5F6A6A'
            text.fondo = '#ECEFF1'
            text.estatus = 'DETENIDA'
        }
        else {
            if (objeto.cancelada) {
                text.letra = '#8950FC'
                text.fondo = '#EEE5FF'
                text.estatus = 'CANCELADA'
            } else {
                if (restante <= 1) {
                    text.letra = '#388E3C'
                    text.fondo = '#E8F5E9'
                    text.estatus = 'PAGADA'
                } else {
                    text.letra = '#F64E60'
                    text.fondo = '#FFE2E5'
                    text.estatus = 'PENDIENTE'
                }
            }
        }
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

      const montos = (dato) => {  
        let totalFacturas = 0;

            dato.forEach(factura => {
                totalFacturas += factura.total;
            });       
        return(            
           <div>          

            <div>
                <HtmlTooltip interactive
                title={
                    <React.Fragment >                 
                        {"Venta: " + dato.total.toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) } <br></br>
                        {"Pagado: " + totalFacturas.toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) }<br></br>
                        {"Pendiente: " + ( dato.total - totalFacturas).toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) }

                    </React.Fragment>
                } >
                <Button>{setMoneyTable(dato.total)} </Button>
                </HtmlTooltip>
            </div>     
            </div>
        )
    }

      const adjuntos = (dato) => { 
        const datos = dato 
        // console.log(dato)
            return(
            <div>  
                    <div>
                        <HtmlTooltip interactive
                        title={
                            <React.Fragment>                
                                  <em>{"Factura: "}</em>                               
                                {
                                    dato.pdf && dato.pdf.url ?
                                    <a href={dato.pdf && dato.pdf.url ? dato.pdf.url : ''} target="_blank" title="Factura pdf">PDF </a>
                                    : ''
                                }
                                {
                                    dato.xml && dato.xml.url ?
                                    <a href={dato.xml && dato.xml.url ? dato.xml.url : ''} target="_blank" title="Factura xml!">xml </a>
                                    : ''
                                }
                            </React.Fragment>
                        }
                        >
                        <Button >{dato.folio ? dato.folio : 'S/N'} </Button>
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


    const handleCheckboxChange = (event) => {
        const { name, value, checked } = event.target;
        const newSelectedOptions = { ...selectedOptions };
          // Copia del estado actual de formData
        const updatedFormData = { ...formData };

        if (checked) {
            updatedFormData[name] = '';
        } 
        setFormData(updatedFormData);

        for (const option in newSelectedOptions) {
          if (option !== name) {
            newSelectedOptions[option] = null;
          }
        }
        
    
        // Actualizar el estado solo para el checkbox seleccionado
        newSelectedOptions[name] = checked ? value : null;
        setSelectedOptions(newSelectedOptions);
      };

    //   const handleSelectChange = (event, option) => {
    //     const { value } = event.target;
    //     setSelectedOptions(prevState => ({
    //       ...prevState,
    //       [option]: value
    //     }));
    //   };

    const handleSelectChange = (event, field) => {
        const selectedValue = event.target.value;
        setAge(selectedValue);
      };


      const handleTextFieldChange = (event, field) => {
        const userInput = event.target.value;
        // Validar si el input es un número (solo permite dígitos)
        const regex = /^\d*$/; // Expresión regular que acepta solo números enteros positivos
    
        if (regex.test(userInput) || userInput === '') {
          setFormData({ ...formData, [field]: userInput });
        }
      };
      
      const handleSubmit = (data) => {
        if(data){
            const dataToSend = {
                compras: selectedOptions["compras"] ? formData.compras : '',
                ventas: selectedOptions["ventas"] ? formData.ventas : '',
                ingreso: selectedOptions["ingreso"] ? formData.ingreso : '',
                egresos: selectedOptions["egresos"] ? formData.egresos : '',
                id: data ? data.id : '',

              }; 
              if(dataToSend.compras || dataToSend.ventas || dataToSend.ingreso || dataToSend.egresos  ){

              apiPutForm( `facturas/asignar/${data.id}`, { dataToSend }, auth ).then(
                (response) => {
                    Swal.fire(
                        '¡Asignado!',
                        'La Factura ha sido asignada.',
                        'success'
                    )
                    if (reloadTable) {
                        setModal({
                            ...modal,
                            ['asignar']: {
                                show: false,
                                data: null
                            }
                        })
                        reloadTable.reload()
                    }
                    }, (error) => { printResponseErrorAlert(error) }
                ).catch((error) => { catchErrors(error) })

            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Campos obligatorios',
                    text: 'Por favor, completa la algun campo.',
                  });
                  return; // Detén la función si los campos están vacíos
        
    
            }
        }
       

        // Aquí puedes enviar los datos al servidor o realizar las acciones necesarias
      };


      const onChangeFactura = (e) => {
        const { files } = e.target
        const reader = new FileReader()
        if (files[0].type === 'text/xml') {
            reader.onload = (event) => {
                const text = (event.target.result)
                let jsonObj = j2xParser.parse(text, {
                    ignoreAttributes: false,
                    attributeNamePrefix: ''
                })
                if (jsonObj['cfdi:Comprobante']) {
                    jsonObj = jsonObj['cfdi:Comprobante']
                    const keys = Object.keys(jsonObj)
                    let obj = {}
                    let errores = []
                    if (keys.includes('cfdi:Receptor')) {
                        obj.rfc_receptor = jsonObj['cfdi:Receptor']['Rfc']
                        obj.nombre_receptor = jsonObj['cfdi:Receptor']['Nombre']
                        obj.uso_cfdi = jsonObj['cfdi:Receptor']['UsoCFDI']
                    } else { errores.push('El XML no tiene el receptor') }
                    if (keys.includes('cfdi:Emisor')) {
                        obj.rfc_emisor = jsonObj['cfdi:Emisor']['Rfc']
                        obj.nombre_emisor = jsonObj['cfdi:Emisor']['Nombre']
                        obj.regimen_fiscal = jsonObj['cfdi:Emisor']['RegimenFiscal']
                    } else { errores.push('El XML no tiene el emisor') }
                    obj.lugar_expedicion = jsonObj['LugarExpedicion']
                    obj.fecha = jsonObj['Fecha'] ? new Date(jsonObj['Fecha']) : null
                    obj.metodo_pago = jsonObj['MetodoPago']
                    obj.tipo_de_comprobante = jsonObj['TipoDeComprobante']
                    obj.total = jsonObj['Total']
                    obj.subtotal = jsonObj['SubTotal']
                    obj.tipo_cambio = jsonObj['TipoCambio']
                    obj.moneda = jsonObj['Moneda']
                    if (keys.includes('cfdi:Complemento')) {
                        if (jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']) {
                            obj.numero_certificado = jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']['UUID']
                        } else { errores.push('El XML no tiene el UUID') }
                    } else { errores.push('El XML no tiene el UUID') }
                    obj.descripcion = ''
                    // if (keys.includes('cfdi:Conceptos')) {
                    //     if (jsonObj['cfdi:Conceptos']['cfdi:Concepto']) {
                    //         if (Array.isArray(jsonObj['cfdi:Conceptos']['cfdi:Concepto'])) {
                    //             jsonObj['cfdi:Conceptos']['cfdi:Concepto'].forEach((element, index) => {
                    //                 if (index) {
                    //                     obj.descripcion += ' - '
                    //                 }
                    //                 obj.descripcion += element['Descripcion']
                    //             })
                    //         } else {
                    //             obj.descripcion += jsonObj['cfdi:Conceptos']['cfdi:Concepto']['Descripcion']
                    //         }
                    //     }
                    // }
                    obj.folio = jsonObj['Folio']
                    obj.serie = jsonObj['Serie']
                    if (keys.includes('cfdi:CfdiRelacionados')) {
                        if (Array.isArray(jsonObj['cfdi:CfdiRelacionados'])) {
                            obj.tipo_relacion = jsonObj['cfdi:CfdiRelacionados'][0]['TipoRelacion']
                        }
                    }
                    if (keys.includes('cfdi:CfdiRelacionado')) {
                        if (Array.isArray(jsonObj['cfdi:CfdiRelacionado'])) {
                            obj.uuid_relacionado = jsonObj['cfdi:CfdiRelacionado'][0]['UUID']
                        }
                    }

                    let empresa = opcionesData.empresas.find((empresa) => empresa.rfc === obj.rfc_receptor)
                    console.log(obj.rfc_receptor)
                    if(empresa === undefined ){
                        Swal.fire({
                            icon: 'error',
                            title: 'Fromato XML incorrecto',
                            text: 'En esta factura no somos los receptores',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    }

                    let proveedor = opcionesData.proveedores.find((proveedor) => proveedor.rfc === obj.rfc_emisor)
                    console.log(obj.rfc_emisor)
                    if(!proveedor){
                        Swal.fire({
                            icon: 'error',
                            title: 'No existe el proveedor',
                            text: 'No existe el proveedor, favor de crearlo..',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        // setNuevoProveedor(true)

                    }else{
                        form.proveedor = proveedor.id.toString()
                        form.contrato = ''
                        // options.contratos = setOptions(proveedor.contratos, 'nombre', 'id')
                    }

                    let aux = []
                    files.forEach((file, index) => {
                        aux.push({
                            name: file.name,
                            file: file,
                            url: URL.createObjectURL(file),
                            key: index
                        })
                    })
                    console.log(obj)

                    let path = `C:/fakepath/` + aux[0].name // a lo mejor tiene que ser C:\\fakepath\\ o algo asi
                    console.log(obj)
                    setForm({
                        ...form,
                        fecha: obj.fecha,
                        rfc: obj.rfc_emisor,
                        total: obj.total,
                        descripcion: obj.descripcion,
                        empresa: empresa ? empresa.id : null,
                        empresa_nombre: empresa ? empresa.nombre : null,
                        proveedor: proveedor ? proveedor.id : null,
                        proveedor_nombre: proveedor ? proveedor.name : null,
                        cuentas: empresa ? opciones.empresas.find((empresaData) => empresaData.id === empresa.id).cuentas : '',
                        adjuntos: {
                            ...form.adjuntos,
                            xml: {
                                files: aux, 
                                value: path
                            }
                        },
                        facturaObject: obj
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Fromato XML incorrecto',
                        text: 'La factura no tiene el formato correcto',
                        showConfirmButton: false,
                        timer: 1500
                    })

                }
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Fromato XML incorrecto',
                text: 'La factura no tiene el formato correcto',
                showConfirmButton: false,
                timer: 3000
            })
        }

        reader.readAsText(files[0])

    }

    const handleDeleteFile = (tipo, index) => {
        let files = form.adjuntos[tipo].files;
        files.splice(index, 1);

        // Check if all XML files are deleted
        const allXmlFilesDeleted = tipo === 'xml' && files.length === 0;

        //LIMPIA LOS CAMPOS DEL FORMULARIO QUE YA HABIAN SIDO LLENADOS POR UNA FACTURA
        setForm((prevForm) => ({
            ...prevForm,
            adjuntos: {
                ...prevForm.adjuntos,
                [tipo]: { files: [...files], value: '' },
            },
            rfc: allXmlFilesDeleted ? '' : prevForm.rfc, // Clear rfc field if all XML files deleted
            empresa: allXmlFilesDeleted ? '' : prevForm.empresa, 
            descripcion: allXmlFilesDeleted ? '' : prevForm.descripcion, 
            fecha: allXmlFilesDeleted ? '' : prevForm.fecha, 
            total: allXmlFilesDeleted ? '' : prevForm.total, 
            facturaObject: allXmlFilesDeleted ? '' : prevForm.facturaObject, 
        }));
    };

    const handleAddFile = (e, tipo) => {
        let aux = []

        e.target.files.forEach((file, index) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        console.log(aux)

        let path = 'C:/fakepath/'+ aux[0].name

        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: {files: aux, value: path}
            }
        })
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
                if (reloadTable) {
                    reloadTable.reload()
                }
                doneAlert('Factura cancelada con éxito')
               
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    const  onChangeAdjuntoFacturas = (e) => {
        console.log(opcionesData)
        // const [form, setForm] = useState({
// 
        const { files, value, name } = e.target;
        // const { files } = e.target
        console.log(selectData)
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            if (name === 'factura') {
                let extension = files[counter].name.slice((Math.max(0, files[counter].name.lastIndexOf(".")) || Infinity) + 1);
                if (extension.toUpperCase() === 'XML') {
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => {
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');                       
                        var xml = new XMLParser().parseFromString(text);
                        if( !xml.getElementsByTagName('cfdi:Receptor')[0] || !xml.getElementsByTagName('cfdi:Emisor')[0] ){
                            errorAlert('Error en el receptor en el XML intente con otro.')
                            form['adjuntos'] = {
                                adjuntos: {
                                    value: '',
                                    placeholder: 'Ingresa los adjuntos',
                                    files: []
                                }, factura: {
                                    value: '',
                                    placeholder: 'Adjuntar factura',
                                    files: []
                                }, relacionados:{
                                    value: '',
                                    placeholder: 'Facturas relacionadas',
                                    files: []
                                }
                            }
                            setForm({ ...form, form })
                            return false
                          }
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
                     
                        const timbreFiscalDigital = xml.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
                        const concepto = xml.getElementsByTagName('cfdi:Concepto')[0]
                        let relacionados = xml.getElementsByTagName('cfdi:CfdiRelacionados')
                       

                        let obj = {
                            rfc_receptor: receptor.attributes.Rfc ? receptor.attributes.Rfc : '',
                            nombre_receptor: receptor.attributes.Nombre ? receptor.attributes.Nombre : '',
                            uso_cfdi: receptor.attributes.UsoCFDI ? receptor.attributes.UsoCFDI : '',
                            rfc_emisor: emisor.attributes.Rfc ? emisor.attributes.Rfc : '',
                            nombre_emisor: emisor.attributes.Nombre ? emisor.attributes.Nombre : '',
                            regimen_fiscal: emisor.attributes.RegimenFiscal ? emisor.attributes.RegimenFiscal : '',
                            lugar_expedicion: xml.attributes.LugarExpedicion ? xml.attributes.LugarExpedicion : '',
                            fecha: xml.attributes.Fecha ? new Date(xml.attributes.Fecha) : '',
                            metodo_pago: xml.attributes.MetodoPago ? xml.attributes.MetodoPago : '',
                            tipo_de_comprobante: xml.attributes.TipoDeComprobante ? xml.attributes.TipoDeComprobante : '',
                            total: xml.attributes.Total ? xml.attributes.Total : '',
                            subtotal: xml.attributes.SubTotal ? xml.attributes.SubTotal : '',
                            tipo_cambio: xml.attributes.TipoCambio ? xml.attributes.TipoCambio : '',
                            moneda: xml.attributes.Moneda ? xml.attributes.Moneda : '',
                            numero_certificado: timbreFiscalDigital.attributes.UUID ? timbreFiscalDigital.attributes.UUID : '',
                            descripcion: concepto.attributes.Descripcion,
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
                        }
                  

                        let tipoRelacion = ''
                        if (relacionados) {
                            if (relacionados.length) {
                                relacionados = relacionados[0]
                                tipoRelacion = relacionados.attributes.TipoRelacion
                                let uuidRelacionado = xml.getElementsByTagName('cfdi:CfdiRelacionado')[0]
                                uuidRelacionado = uuidRelacionado.attributes.UUID
                                obj.tipo_relacion = tipoRelacion
                                obj.uuid_relacionado = uuidRelacionado
                            }
                        }
                        if (obj.numero_certificado === '') {
                            let NoCertificado = text.search('NoCertificado="')
                            if (NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado + 15, NoCertificado + 35)
                        }
                        let auxiliar = ''
                        if (obj.subtotal === '') {
                            let Subtotal = text.search('SubTotal="')
                            if (Subtotal)
                                Subtotal = text.substring(Subtotal + 10)
                            auxiliar = Subtotal.search('"')
                            Subtotal = Subtotal.substring(0, auxiliar)
                            obj.subtotal = Subtotal
                        }
                        if (obj.total === '') {
                            let Total = text.search('Total="')
                            if (Total)
                                Total = text.substring(Total + 7)
                            Total.search('"')
                            Total = Total.substring(0, aux)
                            obj.total = Total
                        }
                        if (obj.fecha === '') {
                            let Fecha = text.search('Fecha="')
                            if (Fecha)
                                Fecha = text.substring(Fecha + 7)
                            auxiliar = Fecha.search('"')
                            Fecha = Fecha.substring(0, auxiliar)
                            obj.fecha = Fecha
                        }
                        let auxEmpresa = ''
                        let auxCliente
                       
                        if (auxEmpresa && auxCliente) {
                            Swal.close()
                        }
                        form.facturaObject = obj

                        console.log( form)
                        setForm({
                            ...form,
                            form
                        })
                    }
                    reader.readAsText(files[counter])
                }
            }
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

    const clearFiles = (name, key) => {
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key)
                aux.push(form['adjuntos'][name].files[counter])
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
            if (name === 'factura')
                form['facturaObject'] = ''
        }
        form['adjuntos'][name].files = aux
        setForm({ ...form, form })
    }

    const sendFacturaAxios = () =>  {
        waitAlert();
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
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
         axios.post(URL_DEV + 'facturas/new', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth}` } }).then(
            (response) => {
                // this.getVentasAxios()
                form['adjuntos'] = {
                    adjuntos: {
                        value: '',
                        placeholder: 'Ingresa los adjuntos',
                        files: []
                    }, factura: {
                        value: '',
                        placeholder: 'Adjuntar factura',
                        files: []
                    }, relacionados:{
                        value: '',
                        placeholder: 'Facturas relacionadas',
                        files: []
                    }
                }
                //  setForm({ ...form, form })
                
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                setModal({
                    ...modal,
                    ['crear']: {
                        show: false,
                        data: null
                    }
                })
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
    
   const clearForm = () => {
        let aux = Object.keys(form)
        form['adjuntos'] = {
            adjuntos: {
                value: '',
                placeholder: 'Ingresa los adjuntos',
                files: []
            }, factura: {
                value: '',
                placeholder: 'Adjuntar factura',
                files: []
            }, relacionados:{
                value: '',
                placeholder: 'Facturas relacionadas',
                files: []
            }
        }
        setForm({ ...form, form })

        // aux.map((element) => {
        //     switch (element) {
        //         case 'adjuntos':
        //             form['adjuntos'] = {
        //                 adjuntos: {
        //                     value: '',
        //                     placeholder: 'Ingresa los adjuntos',
        //                     files: []
        //                 }, factura: {
        //                     value: '',
        //                     placeholder: 'Adjuntar factura',
        //                     files: []
        //                 }, relacionados:{
        //                     value: '',
        //                     placeholder: 'Facturas relacionadas',
        //                     files: []
        //                 }
        //             }
        //             break;
        //         default:
        //             form[element] = ''
        //             break;
        //     }
        //     return false
        // })
        // return form;
    }


    return (
      <>
        <TablaGeneralPaginado
          titulo="Facturas | IV"
          subtitulo="listado de factura pendientes"
          url={"facturas/facturaemisor"}
          columnas={columns}
          numItemsPagina={50}
          ProccessData={proccessData}
          opciones={opciones}
          acciones={acciones}
          reload={setReloadTable}
          filtros={filtrado}
        />

            {
                modal.editar?.data &&
                <Modal size="lg" title={"Ver factura"} show={modal.editar?.show} handleClose={e => handleClose('editar')} >
                    <FacturacionCard  reload={reloadTable} data={modal.editar?.data?.data}/>
                </Modal>
            }

            {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar factura"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
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

        {modal.asignar && (
          <Modal size="xs" title={"Asignar factura"} show={modal.asignar?.show}  handleClose={(e) => handleClose("asignar")}>
            <div>
        <FormControl className={classes.formControl} data={modal.asignar?.data?.data}  >

            <FormControl className={classes.formControl}>

              <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">               
                    <Checkbox  type="checkbox" name="compras" value="compras" checked={selectedOptions["compras"] === "compras"}
                    onChange={handleCheckboxChange}  color="primary" inputProps={{ "aria-label": "secondary checkbox" }} />
                    Compras
              </label>

              {selectedOptions["compras"] && (
                <FormControl className={classes.formControl}>        
                    <TextField  name="compras" id="outlined-textarea"  value={formData.compras} onChange={(e) => handleTextFieldChange(e, 'compras')}  label="Numero de compra" placeholder="No. Compras"  multiline  variant="outlined"  
                     inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', }} />
                </FormControl>
              )}
        </FormControl>
        <FormControl className={classes.formControl}>
             <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">               
                    <Checkbox  type="checkbox" name="ventas" value="ventas" checked={selectedOptions["ventas"] === "ventas"}
                    onChange={handleCheckboxChange}  color="primary" inputProps={{ "aria-label": "secondary checkbox" }} />
                    Ventas
              </label>
            
              {selectedOptions["ventas"] && (
                <FormControl className={classes.formControl}>        
                    <TextField  name="ventas" id="outlined-textarea"  value={formData.ventas}  onChange={(e) => handleTextFieldChange(e, 'ventas')} label="Numero de la venta" placeholder="No. venta"  multiline  variant="outlined" 
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', }} />
                </FormControl>

              )}
        </FormControl>
        <FormControl className={classes.formControl}>
              <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">               
                    <Checkbox  type="checkbox" name="ingreso" value="ingreso" checked={selectedOptions["ingreso"] === "ingreso"}
                    onChange={handleCheckboxChange}  color="primary" inputProps={{ "aria-label": "secondary checkbox" }} />
                    Ingreso
              </label>
             
              {selectedOptions["ingreso"] && (
                <FormControl className={classes.formControl}>        
                    <TextField  name="ingreso" id="outlined-textarea"  value={formData.ingreso} onChange={(e) => handleTextFieldChange(e, 'ingreso')}  label="Numero del ingreso" placeholder="No. ingreso"  multiline  variant="outlined" 
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', }} />
                </FormControl>

              )}
        </FormControl>
            <FormControl className={classes.formControl}>
                <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">               
                        <Checkbox  type="checkbox" name="egresos" value="egresos" checked={selectedOptions["egresos"] === "egresos"}
                        onChange={handleCheckboxChange}  color="primary" inputProps={{ "aria-label": "secondary checkbox" }} />
                        Egresos
                </label>
                
                {selectedOptions["egresos"] && (
                    <FormControl className={classes.formControl}>        
                        <TextField name="egresos"  id="outlined-textarea"  value={formData.egresos}  onChange={(e) => handleTextFieldChange(e, 'egresos')} label="Numero de egreso" placeholder="No. egreso"  multiline  variant="outlined" 
                         inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', }} />

                    </FormControl>
                )}
                
            </FormControl>
                <Button variant="contained" type="submit" color="primary"   onClick={() => handleSubmit(modal.asignar?.data?.data)} >Enviar</Button>
            </FormControl>

            </div>
          </Modal>                    
          
        )}  
        
        <Modal size="lg" title={"Agregar factura"} show={modal.crear?.show} handleClose={e => handleClose('crear')} >
            <Form /*onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios();}} */ >
                <div className="mt-3 mb-4 text-center">
                    <FileInput onChangeAdjunto = { onChangeAdjuntoFacturas } placeholder = { form.adjuntos.factura.placeholder }
                        value = { form.adjuntos.factura.value} name = 'factura' id = 'factura' accept = "text/xml, application/pdf"
                        files = {form.adjuntos.factura.files } deleteAdjunto = { clearFiles } multiple
                        classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                        iconclass='flaticon2-clip-symbol text-primary'
                        />
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button className="btn btn-primary" type="submit" text="ENVIAR"
                                onClick={(e) => { e.preventDefault(); waitAlert(); sendFacturaAxios(); }} >
                                    enviar
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    

      </>
    );

}