import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import S3 from 'react-aws-s3';
// import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';
import {

    Typography,
    InputLabel,
    Paper,
    Box,
    DialogContent,
    DialogActions
} from '@mui/material';
import Button from '@material-ui/core/Button';

import { Grid } from '@mui/material';
import TextField from '@material-ui/core/TextField';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { es } from 'date-fns/locale';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Autocomplete from '@mui/material/Autocomplete';

import j2xParser from 'fast-xml-parser';
import Swal from 'sweetalert2';

import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import { apiPostForm, apiGet, apiPutForm } from './../../../functions/api';
import CrearProveedor from './CrearProveedor';
import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css';
import { Modal } from './../../../components/singles';
import { useDropzone } from 'react-dropzone';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Container from '@material-ui/core/Container';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';

export default function CrearVentas(props) {

    const { opcionesData, handleClose, reload, getProveedores } = props
    const departamento = useSelector(state => state.authUser.departamento)
    const departamentos = useSelector(state => state.opciones.ventas)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const [errores, setErrores] = useState({})
    const auth = useSelector((state) => state.authUser.access_token);
    const [adjuntos, setAdjuntos] = useState({ pagos: [], presupuestos: [], facturas_pdf: [] });
    const [activeTab, setActiveTab] = useState('pagos');
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [proyectoClientes, setProyectoClientes] = useState([]);

    const [proveedorSelect, setProveedorSelect] = useState({
        preSelect: false,
        id: null,
        name: null,
    })
    
    useEffect(() => {
        if (proveedorSelect.preSelect) {
            let data = {
                ...proveedorSelect
            }
            handleChangeProveedor('', data)
        }
    }, [proveedorSelect]) //cuando proveedorSelect tenga cualquier modificacion, lo que esta dentro de useEffect se ejecuta

    const [form, setForm] = useState({
        adjuntos: {
            pago: { files: [], value: '' },
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
        },
        area: '',
        banco: 0,
        cuentas: [],
        cuenta: '',
        cuenta_nombre: '',
        descripcion: '',
        empresa: '',
        estatusCompra: 2,
        factura: false,
        facturaItem: '',
        facturaObject: {},
        fecha: '',
        partida: "",
        cliente: '',
        proyecto: '',
        subarea: '',
        tipoImpuesto: 1,
        tipoPago: 4,
        total: '',
        contrato: '',
        tickets: '',
        afectarCuentas: false,
        tipoFactura: '',
    })

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        clientes: [],
        proyectos: [],
        tiposImpuestos: [],
        tiposPagos: [],
        tickets: [],
        contratos: [],
    })

    const [nuevoProveedor, setNuevoProveedor] = useState(false)
    const [cuentaInicializada, setCuentaInicializada] = useState(false);


    const handleCloseProveedor = () => {
        setNuevoProveedor(false)
        setForm({
            ...form,
            proveedor: nuevoProveedor.id, // Establecer el proveedor recién creado
            proveedor_nombre: nuevoProveedor.name,
        });
    }

    const agregarProveedor = () => {
        setNuevoProveedor(true)
    }

    useEffect(() => {

        if (opcionesData) {
            // console.log("🔍 Clientes desde opcionesData:", opcionesData.clientes); // <-- AQUÍ
            setOpciones(opcionesData)
        }
    }, [opcionesData])

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        });
    };

    const handleDeleteFile = (tipo, index) => {
        let filesAdjuntos = [...(form.adjuntos[tipo]?.files || [])];
        filesAdjuntos.splice(index, 1);

        const allXmlFilesDeleted = tipo === 'xml' && filesAdjuntos.length === 0;

        if (allXmlFilesDeleted) {
            setClienteSeleccionado(null); // 🔥 borra cliente visualmente
            setProyectosFiltrados([]);    // 🔥 borra proyectos del cliente
        }

        setForm((prevForm) => ({
            ...prevForm,
            adjuntos: {
                ...prevForm.adjuntos,
                [tipo]: { files: filesAdjuntos, value: '' },
            },
            rfc: allXmlFilesDeleted ? '' : prevForm.rfc,
            empresa: allXmlFilesDeleted ? '' : prevForm.empresa,
            descripcion: allXmlFilesDeleted ? '' : prevForm.descripcion,
            fecha: allXmlFilesDeleted ? '' : prevForm.fecha,
            total: allXmlFilesDeleted ? '' : prevForm.total,
            facturaObject: allXmlFilesDeleted ? '' : prevForm.facturaObject,
            cliente: allXmlFilesDeleted ? '' : prevForm.cliente,
            proveedor_nombre: allXmlFilesDeleted ? '' : prevForm.proveedor_nombre,
            proyecto: allXmlFilesDeleted ? '' : prevForm.proyecto,
            proyecto_nombre: allXmlFilesDeleted ? '' : prevForm.proyecto_nombre,
        }));

        setFiles((prevFiles) => {
            const updated = [...(prevFiles[tipo] || [])];
            updated.splice(index, 1);
            return { ...prevFiles, [tipo]: updated };
        });
    };


    const handleChange = (e) => {
        if (e.target.name === 'empresa') {
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                cuentas: opciones.empresas.find(empresa => empresa.id === e.target.value).cuentas,
            });
        } else if (e.target.name === 'cuenta') {

            // console.log( opciones)
            // console.log( form.cuentas)
            let cuenta = form.cuentas.find(empresa => empresa.id === e.target.value).factura
            let impuesto = form.cuentas.find(empresa => empresa.id === e.target.value).id_impuesto

            // console.log(cuenta)
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                factura: cuenta == 1 ? true : false,
                tipoImpuesto: impuesto,
                disabled: true
            });
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }

    };


    const handleChangeAreas = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            partida: ''
        })
    }

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

        let path = 'C:/fakepath/' + aux[0].name

        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: { files: aux, value: path }
            }
        })
    }

    const onChangeFactura = (e) => {
        const { files } = e.target;
        const reader = new FileReader();

        if (files[0].type === 'text/xml') {
            reader.onload = (event) => {
                const text = event.target.result;

                let jsonObj = j2xParser.parse(text, {
                    ignoreAttributes: false,
                    attributeNamePrefix: ''
                });

                if (!jsonObj['cfdi:Comprobante']) {
                    return Swal.fire({
                        icon: 'error',
                        title: 'Formato XML incorrecto',
                        text: 'La factura no tiene el formato correcto',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }

                jsonObj = jsonObj['cfdi:Comprobante'];
                const keys = Object.keys(jsonObj);
                const obj = {};
                const errores = [];

                if (keys.includes('cfdi:Receptor')) {
                    obj.rfc_receptor = jsonObj['cfdi:Receptor']['Rfc'];
                    obj.nombre_receptor = jsonObj['cfdi:Receptor']['Nombre'];
                    obj.uso_cfdi = jsonObj['cfdi:Receptor']['UsoCFDI'];
                } else errores.push('El XML no tiene el receptor');

                if (keys.includes('cfdi:Emisor')) {
                    obj.rfc_emisor = jsonObj['cfdi:Emisor']['Rfc'];
                    obj.nombre_emisor = jsonObj['cfdi:Emisor']['Nombre'];
                    obj.regimen_fiscal = jsonObj['cfdi:Emisor']['RegimenFiscal'];
                } else errores.push('El XML no tiene el emisor');

                obj.lugar_expedicion = jsonObj['LugarExpedicion'];
                obj.fecha = jsonObj['Fecha'] ? new Date(jsonObj['Fecha']) : null;
                obj.metodo_pago = jsonObj['MetodoPago'];
                obj.tipo_de_comprobante = jsonObj['TipoDeComprobante'];
                obj.total = jsonObj['Total'];
                obj.subtotal = jsonObj['SubTotal'];
                obj.tipo_cambio = jsonObj['TipoCambio'];
                obj.moneda = jsonObj['Moneda'];

                if (keys.includes('cfdi:Complemento') &&
                    jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']) {
                    obj.numero_certificado = jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']['UUID'];
                } else errores.push('El XML no tiene el UUID');

                obj.descripcion = '';
                if (keys.includes('cfdi:Conceptos')) {
                    const conceptos = jsonObj['cfdi:Conceptos']['cfdi:Concepto'];
                    if (Array.isArray(conceptos)) {
                        obj.descripcion = conceptos.map(c => c['Descripcion']).join(' - ');
                    } else {
                        obj.descripcion = conceptos['Descripcion'];
                    }
                }

                obj.folio = jsonObj['Folio'];
                obj.serie = jsonObj['Serie'];
                obj.tipo_relacion = jsonObj['cfdi:CfdiRelacionados']?.[0]?.['TipoRelacion'] || '';
                obj.uuid_relacionado = jsonObj['cfdi:CfdiRelacionado']?.[0]?.['UUID'] || '';

                const empresa = opcionesData.empresas.find(e => e.rfc === obj.rfc_emisor);
                const cliente = opcionesData.clientes.find(c => c.rfc === obj.rfc_receptor);

                if (!empresa) {
                    return Swal.fire({
                        icon: 'error',
                        title: 'Formato XML incorrecto',
                        text: 'En esta factura no somos los receptores',
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }

                if (!cliente) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Cliente no encontrado',
                        text: 'No existe la empresa, favor de crearla',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    return;
                }
                setClienteSeleccionado(cliente);
                setOpciones(prev => ({ ...prev, clientes: opcionesData.clientes }));

                const aux = Array.from(files).map((file, index) => ({
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file),
                    key: index
                }));

                const path = `C:/fakepath/${files[0].name}`;
                // console.log(cliente)
                // Si quieres también filtrar los proyectos relacionados al cliente
                // const proyectosFiltrados = cliente.proyectos.filter(p => p.cliente_id === cliente.id);
                setProyectosFiltrados(cliente.proyectos);

                setForm(prev => ({
                    ...prev,
                    fecha: obj.fecha,
                    rfc: obj.rfc_emisor,
                    total: obj.total,
                    descripcion: obj.descripcion,
                    empresa: empresa.id,
                    empresa_nombre: empresa.nombre,
                    cliente: cliente.id,

                    proveedor_nombre: cliente.name,
                    // proyecto: projectosFiltrados,
                    cuentas: empresa?.cuentas || [],
                    adjuntos: {
                        ...prev.adjuntos,
                        xml: {
                            files: aux,
                            value: path
                        }
                    },
                    facturaObject: obj
                }));
            };

            reader.readAsText(files[0]);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Archivo inválido',
                text: 'Debes subir un archivo XML válido',
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };


    const handleChangeProveedor = (e, value) => {
        if (value && value.name) {
            setClienteSeleccionado(value); // <-- aquí actualizas el Autocomplete
            setForm({
                ...form,
                cliente: value.id,
                proveedor_nombre: value.name,
                proyecto: null,
                proyecto_nombre: null
            });

            // console.log(value.proyectos)
            // const proyectosCliente = value.proyectos.filter(p => p.cliente_id === value.id);
            setProyectosFiltrados(value.proyectos);
        } else {
            setClienteSeleccionado(null); // ← limpia visualmente si se borra
            setForm({
                ...form,
                cliente: null,
                proveedor_nombre: null,
                proyecto: null,
                proyecto_nombre: null
            });
            setProyectosFiltrados([]);
        }
    };



    const handleChangeTicket = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                tickets: value.id,
                tickets_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                tickets: null,
                tickets_nombre: null,
            })
        }
    }

    const handleChangeProyecto = (e, value) => {
        if (value && value.nombre) {
            setForm({
                ...form,
                proyecto: value.id,
                proyecto_nombre: value.nombre,
            });
        } else {
            setForm({
                ...form,
                proyecto: null,
                proyecto_nombre: null,
            });
        }
    };


    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleMoney = (e) => {
        setForm({
            ...form,
            total: e
        })
    }

    const handleMoneyComision = (e) => {
        setForm({
            ...form,
            comision: e
        })
    }

    const addNewFacturaAxios = (files, egreso) => {
        let aux = form;
        aux.archivos = files;
        apiPostForm(`v2/administracion/facturas`, aux, auth).then(
            (response) => {
                const { factura } = response.data;

                setForm({
                    ...form,
                    facturaItem: factura,
                    archivos: files
                });

                // 🔁 Después de vincular el XML, sube los PDF como archivos de venta
                const pdfs = files.filter(file => file.tipo === 'facturas_pdf');
                if (pdfs.length > 0) {
                    attachFilesS3(pdfs, egreso); // esta función ya la tienes
                }

                attachFactura(egreso, factura);
            }, (error) => { }
        ).catch((error) => {
            console.error(error, 'error');
        });
    };

    const addFacturaS3 = (values, egreso) => {

        // console.log('addFacturaS3')
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data;
                let filePath = `facturas/ventas/`;
                let aux = [];

                if (Array.isArray(files.xml)) {
                    files.xml.forEach((file) => {
                        aux.push(file);
                    });
                }

                if (Array.isArray(files.pdf)) {
                    files.pdf.forEach((file) => {
                        aux.push(file);
                    });
                }
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                            .then((data) => {
                                const { location, status } = data
                                if (status === 204) resolve({ name: file.name, url: location })
                                else reject(data)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    })
                })


                Promise.all(auxPromises)
                    .then((values) => {
                        // Ahora se pasan los archivos con sus tipos a la función siguiente
                        addNewFacturaAxios(values, egreso);
                    })
                    .catch((err) => console.error('Error al subir archivos:', err));
            },
            (error) => { }
        ).catch((error) => {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrió un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            });
        });
    };


    const attachFilesS3 = (files, venta, reload) => {

        // console.log(files)
        apiPutForm(`v2/proyectos/ventas/${venta.id}/archivos/s3`, { archivos: files }, auth)
            .then((response) => {
                // console.log('✅ Respuesta después de subir archivos:', response);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Archivos adjuntados',
                    text: 'Los archivos se adjuntaron correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                // reload()
                handleClose(true)
            })
            .catch((error) => {
                console.error('Error al adjuntar archivos:', error);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrió un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    }

    const attachFiles = (ventas) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ventas/${ventas.id}/`
                let aux = []
                form.adjuntos.pago.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'pago'
                        }
                    )
                })
                form.adjuntos.presupuesto.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'presupuesto'
                        }
                    )
                })
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file || file, file.name)

                            .then((data) => {
                                const { location, status } = data
                                if (status === 204) resolve({ name: file.name, url: location, tipo: file.tipo })
                                else reject(data)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => {
                    attachFilesS3(values, ventas)
                }).catch(err => console.error(err))
            }, (error) => { }
        ).catch((error) => {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    const attachFactura = (venta, factura) => {

        let objeto = {
            dato: venta.id,
            tipo: 'venta',
            factura: factura.id
        }

        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                    attachFiles(venta)
                } else {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'compra creada con éxito',
                        text: 'Se creó la compra con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }, (error) => {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrio un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        ).catch((error) => {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    const validateForm = () => {
        let validar = true
        let error = {}
        if (form.cliente === '') {
            error.cliente = "Seleccione un cliente"
            validar = false
        }
        if (form.proyecto === '') {
            error.proyecto = "Seleccione un proyecto"
            validar = false
        }
        if (form.empresa === '') {
            error.empresa = "Seleccione una empresa"
            validar = false
        }
        if (form.fecha === '' || form.fecha === null) {
            error.fecha = "Seleccione una fecha"
            validar = false
        }
        if (form.area === '') {
            error.area = "Seleccione un departamento"
            validar = false
        }
        if (form.partida === '') {
            error.partida = "Seleccione el tipo de gasto"
            validar = false
        }
        if (form.subarea === '') {
            error.subarea = "Seleccione una subarea"
            validar = false
        }
        if (form.descripcion === '') {
            error.descripcion = "Escriba una descripcion"
            validar = false
        }

        if (form.cuenta === '') {
            error.cuenta = "Seleccione una cuenta"
            validar = false
        }
        if (form.total === '') {
            error.total = "indique el monto total"
            validar = false
        }
        // if (form.afectarCuentas === false) {
        //     error.afectarCuentas = "Debe afectar cuentas";
        //     validar = false;
        // }

        setErrores(error)
        return validar
    }

    // const handleSend = () => {
    //     if (validateForm()) {
    //         Swal.fire({
    //             title: '¿Estás seguro?',
    //             text: 'Se creará la venta',
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonText: 'Sí, crear',
    //             cancelButtonText: 'No, cancelar',
    //             cancelButtonColor: '#d33',
    //             reverseButtons: true
    //         }).then((result) => {
    //             if (result.value) {
    //                 Swal.close();
    //                 Swal.fire({
    //                     title: 'Creando venta',
    //                     text: 'Por favor, espere...',
    //                     allowOutsideClick: false,
    //                     onBeforeOpen: () => {
    //                         Swal.showLoading();
    //                     },
    //                 });

    //                 let aux = { ...form };

    //                 aux.factura = form.factura ? 'Con factura' : 'Sin factura';
    //                 aux.adjuntos = { ...files }; // Asegurar que se copian bien los archivos
    //                 // console.log(aux)
    //                 try {

    //                     apiPostForm('v3/proyectos/ventas', aux, auth)
    //                         .then((response) => {
    //                             const { venta } = response.data;

    //                             Swal.fire({
    //                                 title: 'Venta creada con éxito',
    //                                 text: 'Subiendo adjuntos...',
    //                                 allowOutsideClick: false,
    //                                 didOpen: () => Swal.showLoading(),
    //                             });
    //                             const tareas = [];

    //                             setForm({ ...form, venta });

    //                             if (
    //                                 (form.tipoFactura === "extranjera" || form.tipoFactura === "nacional") &&
    //                                 (files?.pdf?.length > 0 || files?.imagenes?.length > 0 || files?.excel?.length > 0)
    //                             ) {
    //                                 const data = new FormData();

    //                                 // PDF
    //                                 if (files?.pdf?.length > 0) {
    //                                     files.pdf.forEach(file => {
    //                                         data.append(`files_name_facturas_pdf[]`, file.name);
    //                                         data.append(`files_facturas[]`, file);
    //                                     });
    //                                 }

    //                                 // Imágenes
    //                                 if (files?.imagenes?.length > 0) {
    //                                     files.imagenes.forEach(file => {
    //                                         data.append(`files_name_facturas_imagen[]`, file.name);
    //                                         data.append(`files_facturas[]`, file);
    //                                     });
    //                                 }

    //                                 // Excel
    //                                 if (files?.excel?.length > 0) {
    //                                     files.excel.forEach(file => {
    //                                         data.append(`files_name_facturas_excel[]`, file.name);
    //                                         data.append(`files_facturas[]`, file);
    //                                     });
    //                                 }

    //                                 // Metadatos adicionales
    //                                 data.append('adjuntos[]', 'facturas');
    //                                 data.append('tipo', form.tipoFactura === "extranjera" ? 'facturas_pdf' : 'facturas');

    //                                 tareas.push(
    //                                     apiPostForm(`v2/proyectos/ventas/${venta.id}/archivos/s3`, data, auth)
    //                                 );
    //                             }

    //                             // console.log("Estado form después de la compra:", form);
    //                             // ✅ ZIP
    //                             if (files.zip?.length > 0) {
    //                                 const data = new FormData();
    //                                 files.zip.forEach(file => {
    //                                     data.append(`files_name_facturas_pdf[]`, file.name);
    //                                     data.append(`files_facturas[]`, file);
    //                                 });
    //                                 data.append('adjuntos[]', 'facturas');
    //                                 data.append('tipo', 'facturas');
    //                                 tareas.push(apiPostForm(`v2/proyectos/ventas/${venta.id}/archivos/s3`, data, auth));
    //                             }


    //                             if (venta.factura) {
    //                                 if (Object.keys(form.facturaObject).length > 0) {
    //                                     addFacturaS3(venta.id, venta);
    //                                 }
    //                             }

    //                             if (files.pago || files.presupuesto) {
    //                                 attachFiles(venta);
    //                             } else {
    //                                 Swal.close();
    //                                 Swal.fire({
    //                                     icon: 'success',
    //                                     title: 'Venta creada con éxito',
    //                                     text: 'Se creó la venta con éxito',
    //                                     showConfirmButton: false,
    //                                     timer: 1500
    //                                 });
    //                                 reload();
    //                                 handleClose(true);
    //                             }
    //                         })
    //                         .catch((error) => {
    //                             console.error("❌ Error al crear la venta:", error);
    //                             Swal.fire({
    //                                 title: 'Error',
    //                                 text: 'No se pudo crear la compra',
    //                                 icon: 'error',
    //                                 confirmButtonText: 'Cerrar',
    //                             });
    //                         });
    //                 } catch (error) {
    //                     console.error("❌ Error inesperado:", error);
    //                 }
    //             }
    //         });
    //     } else {
    //         Swal.fire({
    //             title: 'Faltan campos',
    //             text: 'Favor de llenar todos los campos',
    //             icon: 'info',
    //             showConfirmButton: false,
    //             timer: 1500,
    //         });
    //     }
    // };

  const handleSend = () => {
         if (!validateForm()) return;
 
         Swal.fire({
             title: "¿Estás seguro?",
             text: "Se creará el gasto con sus adjuntos",
             icon: "warning",
             showCancelButton: true,
             confirmButtonText: "Sí, crear",
             cancelButtonText: "No, cancelar",
             cancelButtonColor: "#d33",
             reverseButtons: true,
         }).then(async (result) => {
             if (!result.value) return;
 
             Swal.fire({
             title: "Creando gasto",
             text: "Por favor, espere...",
             allowOutsideClick: false,
             didOpen: () => Swal.showLoading(),
             });
 
             try {
             const formData = new FormData();
                // console.log(form)
             // 1. Datos del gasto
             formData.append("proveedor", form.proveedor);
             formData.append("empresa", form.empresa);
             formData.append("proyecto", form.proyecto);
             formData.append("cliente", form.cliente);

             formData.append("area", form.area);
             formData.append("subarea", form.subarea);
             formData.append("cuenta", form.cuenta);
             formData.append("tipoPago", form.tipoPago);
             formData.append("tipoImpuesto", form.tipoImpuesto);
             formData.append("estatusCompra", form.estatusCompra);
             formData.append("fecha", new Date(form.fecha).toISOString());
             formData.append("descripcion", form.descripcion ?? "");
             formData.append("factura", form.factura ? "Con factura" : "Sin factura");
             formData.append("total", form.total);
             formData.append("comision", form.comision ?? 0);
             formData.append("partida", form.partida ?? "");
             formData.append("presupuestos", form.presupuestos ?? "");
 
             if (form.facturaObject) {
                 formData.append("facturaObject", JSON.stringify(form.facturaObject));
             }
 
              // 2. Helper archivos
            const appendFiles = (list, fieldName) => {
                if (!list || !list.length) return;
                list.forEach((file) => {
                formData.append(fieldName, file, `${Date.now()}-${file.name}`);
                });
            };
 
             // 3. Adjuntar
             appendFiles(files.xml, "files_factura[]");
             appendFiles(files.pdf, "files_factura[]");
             appendFiles(files.zip, "files_zip[]");
             appendFiles(files.imagenes, "files_imagenes[]");
             appendFiles(files.excel, "files_excel[]");
 
             if (files.pago) {
                formData.append("files_pago[]", files.pago, `pago-${Date.now()}-${files.pago.name}`);
            }

            if (files.presupuesto) {
                formData.append("files_presupuesto[]", files.presupuesto, `presupuesto-${Date.now()}-${files.presupuesto.name}`);
            }

 
             // 4. API
             const response = await apiPostForm(
                 "v3/proyectos/ventas",
                 formData,
                 auth
             );
 
             Swal.fire({
                 icon: "success",
                 title: "Gasto creado con éxito",
                 showConfirmButton: false,
                 timer: 1500,
             });
 
             reload();
             handleClose(true);
             } catch (error) {
             console.error("❌ Error al crear gasto con adjuntos:", error);
 
             let msg = "Error interno del servidor";
 
             if (error.response) {
                 if (error.response.status === 500) {
                 msg = "Ya existe una factura con este folio y certificado";
                 } else if (error.response.status === 422) {
                 msg = error.response.data?.message || "Error de validación";
                 } else if (error.response.data?.message) {
                 msg = error.response.data.message;
                 }
             }
 
             Swal.fire({
                 icon: "error",
                 title: "Error al crear el gasto",
                 text: msg,
             });
             }
         });
         };
 




    const { getRootProps: getRootPropsXmlPdf, getInputProps: getInputPropsXmlPdf } = useDropzone({
        multiple: true,
        accept: "application/pdf, application/xml, text/xml, application/zip, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/png, image/jpeg",
        onDrop: async (acceptedFiles) => {
            if (!form.factura) {
                Swal.fire({
                    icon: "warning",
                    title: "Subida de archivos bloqueada",
                    text: "Debes marcar la opción de 'Lleva factura' para subir XML o PDF.",
                });
                return;
            }
            setFiles((prevFiles) => {
                let updatedFiles = {
                    xml: [...(prevFiles.xml || [])],
                    pdf: [...(prevFiles.pdf || [])],
                    zip: [...(prevFiles.zip || [])],
                    excel: [...(prevFiles.excel || [])],
                    imagenes: [...(prevFiles.imagenes || [])],
                };

                let tieneXML = updatedFiles.xml.length > 0;
                let facturaTipo = form.tipoFactura;

                for (const file of acceptedFiles) {
                    const ext = file.name.split('.').pop()?.toLowerCase();

                    switch (ext) {
                        case 'xml':
                            // aquí sí validas que sea CFDI
                            updatedFiles.xml.push(file);
                            tieneXML = true;
                            form.tipoFactura = "nacional";
                            onChangeFactura({ target: { files: [file] } });
                            break;

                        case 'pdf':
                            updatedFiles.pdf.push(file);
                            break;

                        case 'zip':
                            updatedFiles.zip.push(file);
                            break;

                        case 'xls':
                        case 'xlsx':
                            updatedFiles.excel.push(file); // ✅ ya no se confunde con xml
                            break;

                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                            updatedFiles.imagenes.push(file);
                            break;

                        default:
                            console.warn("Archivo desconocido:", file.name, file.type);
                    }
                }

                // 🔥 Si NO hay XML y se sube un PDF, pregunta si es Factura Nacional o Extranjera
                if (!tieneXML && (updatedFiles.pdf.length > 0 || updatedFiles.zip.length > 0 || updatedFiles.excel.length > 0 || updatedFiles.imagenes.length > 0)) {
                    Swal.fire({
                        title: "Tipo de Factura",
                        text: "¿La factura PDF es Nacional o Extranjera?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Guardar",
                        cancelButtonText: "Cancelar",
                        input: "radio",
                        inputOptions: {
                            nacional: "Factura Nacional",
                            extranjera: "Comprobante Extranjero",
                        },
                        inputValidator: (value) => (!value ? "Debes seleccionar un tipo de factura." : null),
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed && result.value) {
                            setForm((prevForm) => ({
                                ...prevForm,
                                tipoFactura: result.value, // ✅ Guarda el tipo de factura en el estado
                            }));
                        }
                    });
                }

                return updatedFiles; // 📌 Retorna el nuevo estado actualizado
            });
        },
    });
    const getFileName = (file) => {
        if (!file) return '';
        if (typeof file === 'string') return file.split('/').pop(); // Solo el nombre si es URL
        if (file instanceof File) return file.name;
        if (file?.name) return file.name;
        return '';
    };

    const getFileUrl = (file) => {
        if (!file) return '';
        if (typeof file === 'string') return file; // URL S3
        if (file instanceof File) return URL.createObjectURL(file); // Archivo local
        return '';
    };

    const handlePreview = (file) => {
        const url = getFileUrl(file);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            Swal.fire('Archivo inválido', 'No se pudo obtener la URL del archivo', 'error');
        }
    };

    const handleDeleteFileAdjuntos = (key) => {
        setFiles((prev) => ({ ...prev, [key]: null }));
    };


    const isImageFile = (file) => file instanceof File && file.type?.includes('image');


    const handleDeleteDropzoneFile = (type, index) => {
        const updatedFiles = [...(form.adjuntos[type]?.files || [])];
        updatedFiles.splice(index, 1);

        setForm(prev => {
            const updatedAdjuntos = {
                ...prev.adjuntos,
                [type]: {
                    files: updatedFiles,
                    value: updatedFiles.length > 0 ? updatedFiles[0].name : ''
                }
            };

            // 🟠 Si se eliminan todos los XML, borra también el RFC
            const newForm = {
                ...prev,
                adjuntos: updatedAdjuntos
            };

            if (type === 'xml' && updatedFiles.length === 0) {
                newForm.rfc = '';
            }

            return newForm;
        });
    };

    const handleAutocompleteChange = (event, value) => {
        if (value) {
            const selectedEmpresa = opciones.empresas.find((empresa) => empresa.id === value.id);

            if (selectedEmpresa) {
                // console.log("Cuentas disponibles:", form.cuentas);
                // console.log("ID cuenta seleccionada:", form.cuenta);
                setForm((prevForm) => ({
                    ...prevForm,
                    empresa: selectedEmpresa.id,
                    cuentas: selectedEmpresa.cuentas || [], // ← sin filtrar por tipo
                    cuenta: '',
                    cuenta_nombre: '',
                    factura: false,
                    tipoFactura: '',
                    rfc: '',
                    adjuntos: {
                        ...prevForm.adjuntos,
                        xml: { files: [], value: '' },
                        pdf: { files: [], value: '' }
                    }
                }));
            }
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                empresa: '',
                cuentas: [],
                cuenta: '',
                cuenta_nombre: '',
                factura: false,
                tipoFactura: '',
                rfc: '',
            }));
        }
    };



    const [files, setFiles] = useState({
        xml: null,
        pdf: null,
        pago: null,
        presupuesto: null,
        zip: null,
        excel: null,
        imagenes: null,
    });
    const [modalTipoArchivo, setModalTipoArchivo] = useState(false);
    const [archivoActual, setArchivoActual] = useState(null);
    const [tipoSeleccionado, setTipoSeleccionado] = useState('pago');

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setArchivoActual(acceptedFiles[0]);
            setModalTipoArchivo(true);
        }
    };
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (acceptedFiles) => {
            let updatedFiles = { ...files };

            for (const file of acceptedFiles) {
                try {
                    // Validar tipo
                    const allowedTypes = [
                        "application/pdf",
                        "application/xml",
                        "text/xml",
                        "image/png",
                        "image/jpeg",
                        "image/jpg",
                        "application/zip",
                    ];

                    if (!allowedTypes.includes(file.type)) {
                        Swal.fire({
                            icon: "error",
                            title: "Formato no permitido",
                            text: `El archivo ${file.name} no es válido.`,
                        });
                        continue;
                    }

                    // Clasificación
                    const result = await Swal.fire({
                        title: "Selecciona el tipo de archivo",
                        text: `¿Este archivo (${file.name}) es un Pago o un Presupuesto?`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Guardar",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        input: "radio",
                        inputOptions: {
                            pago: "Pago",
                            presupuesto: "Presupuesto",
                        },
                        inputValidator: (value) => {
                            if (!value) {
                                return "Debes seleccionar una opción.";
                            }
                        },
                        allowOutsideClick: false,
                    });
                    
                      if (result.isConfirmed && result.value) {
                        updatedFiles[result.value] = file;
                        // Actualiza el estado form.adjuntos
                            setForm((prevForm) => ({
                                ...prevForm,
                                adjuntos: {
                                ...prevForm.adjuntos,
                                [result.value]: { files: [file], value: file.name },
                                },
                            }));
                      }

                } catch (error) {
                    console.error("Error al clasificar archivo:", error);
                }
            }

            setFiles(updatedFiles);
        },
        multiple: true,
        accept: "application/pdf, application/xml, text/xml, image/png, image/jpeg, image/jpg, application/zip",
    });
    // console.log(form)

    const clientes = Array.isArray(opciones.clientes) ? opciones.clientes : [];

    // console.log("🔍 Clientes cargados en Autocomplete:", clientes);
    const proyectosDelCliente = clienteSeleccionado?.proyectos || [];
    const proyectoSeleccionado = proyectosDelCliente.find((p) => p.id === form.proyecto) || null;
    const [proyectosFiltrados, setProyectosFiltrados] = useState([]);

    // console.log("Proyectos:", proyectos);
    // console.log("Ejemplo de cliente:", clientes[0]);
// console.log(opcionesData)
//     console.log(opciones)
    return (
        <Box>
            <Container maxWidth="lg">

                <Grid container spacing={3} >
                    {/* Empresa */}
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Empresa</InputLabel>
                            <Autocomplete
                                id="empresas-autocomplete"
                                options={opciones.empresas}
                                getOptionLabel={(option) => option.name || ''}
                                isOptionEqualToValue={(option, value) => option.id === value}
                                value={opciones.empresas.find((item) => item.id === form.empresa) || null}
                                onChange={handleAutocompleteChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Empresa"
                                        variant="outlined"
                                        error={!!errores.empresa}
                                        helperText={errores.empresa || ''}
                                    />
                                )}
                            />
                        </Paper>
                    </Grid>

                    {/* Cuenta */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Cuenta</InputLabel>
                            <Autocomplete
                                options={form.cuentas || []}
                                getOptionLabel={(option) => option.nombre || ''}
                                value={(form.cuentas || []).find((c) => c.id === form.cuenta) || null}
                                onChange={(e, value) => {
                                    if (!value) return;

                                    const puedeFacturar = value.factura === 1;
                                    const tipoFactura = puedeFacturar
                                        ? value.nombre?.toLowerCase().includes('extranjero')
                                            ? 'extranjera'
                                            : 'nacional'
                                        : '';

                                    const limpiarAdjuntos = {
                                        xml: { files: [], value: '' },
                                        pdf: { files: [], value: '' },
                                    };

                                    setForm((prev) => ({
                                        ...prev,
                                        cuenta: value.id || '',
                                        cuenta_nombre: value.nombre || '',
                                        factura: puedeFacturar,
                                        tipoFactura,
                                        rfc: puedeFacturar ? prev.rfc : '',
                                        adjuntos: puedeFacturar
                                            ? prev.adjuntos
                                            : { ...prev.adjuntos, ...limpiarAdjuntos },
                                    }));

                                    const tieneFacturas =
                                        form.adjuntos.xml.files.length > 0 || form.adjuntos.pdf.files.length > 0;

                                    if (cuentaInicializada && !puedeFacturar && tieneFacturas) {
                                        Swal.fire({
                                            icon: 'info',
                                            title: 'Cuenta sin facturación',
                                            text: 'Se eliminó el RFC y los archivos XML/PDF porque esta cuenta no puede facturar.',
                                            timer: 4000,
                                            showConfirmButton: false,
                                        });
                                    }

                                    if (!cuentaInicializada) setCuentaInicializada(true);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Cuenta" variant="outlined" error={!!errores.cuenta} />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                            />
                        </Paper>
                    </Grid>

                    {/* ¿Lleva factura? */}
                    <Grid item xs={12} md={2}>
                        <Paper
                            sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={0}
                        >
                            <InputLabel sx={{ mb: 1 }}>¿Lleva factura?</InputLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={form.disabled}
                                            checked={!form.factura}
                                            onChange={handleChangeCheck}
                                            color="secondary"
                                            name="factura"
                                        />
                                    }
                                    label="No"
                                    disabled
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={form.disabled}
                                            checked={form.factura}
                                            onChange={handleChangeCheck}
                                            color="primary"
                                            name="factura"
                                        />
                                    }
                                    label="Sí"
                                    disabled
                                />

                            </FormGroup>
                        </Paper>
                    </Grid>

                    {/* ¿Tipo factura? */}
                    <Grid item xs={12} md={2}>
                        <Paper
                            sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                            elevation={0}
                        >
                            <InputLabel sx={{ mb: 1 }}>¿Tipo factura?</InputLabel>
                            <TextField
                                name="tipoFactura"
                                value={
                                    form.tipoFactura
                                        ? form.tipoFactura === 'nacional'
                                            ? 'Factura Nacional'
                                            : 'Comprobante Extranjero'
                                        : 'No especificado'
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                            />
                        </Paper>
                    </Grid>

                </Grid>

                <Grid container spacing={3}>

                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                            <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>Subir Archivos XML y PDF</InputLabel>

                            {/* Dropzone Estilizado */}
                            <Box
                                {...getRootPropsXmlPdf()}
                                sx={{
                                    border: "2px dashed #007BFF",
                                    padding: "20px",
                                    textAlign: "center",
                                    cursor: form.factura ? "pointer" : "not-allowed", // 🚨 Bloquear cursor si no lleva factura
                                    borderRadius: "8px",
                                    backgroundColor: form.factura ? "#F8F9FA" : "#E0E0E0", // 🚨 Hacerlo más gris si está deshabilitado
                                    transition: "all 0.3s",
                                    opacity: form.factura ? 1 : 0.5, // 🚨 Reducir opacidad si está deshabilitado
                                    "&:hover": {
                                        backgroundColor: form.factura ? "#E2ECF9" : "#E0E0E0",
                                    },
                                }}
                            >
                                <input {...getInputPropsXmlPdf()} />
                                <CloudUploadIcon sx={{ fontSize: 40, color: "#007BFF", mb: 1 }} />
                                <Typography variant="body2" sx={{ color: "#555" }}>
                                    {form.factura ? "Arrastra y suelta archivos aquí o haz clic para seleccionar" : "Debe activar 'Lleva factura' para subir archivos"}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: "center", }} elevation={0}>

                            {/* Lista de archivos subidos con estilos mejorados */}
                            {["xml", "pdf", "zip"].map((type) => (
                                <Box key={type} sx={{ marginTop: "10px" }}>
                                    {files[type]?.length > 0 && (
                                        <>
                                            <Typography variant="h6" sx={{ marginTop: "15px", fontSize: "14px", color: "#007BFF", fontWeight: "bold" }}>
                                            </Typography>
                                            {files[type].map((file, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        backgroundColor: "#fff",
                                                        padding: "10px",
                                                        marginBottom: "8px",
                                                        borderRadius: "5px",
                                                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                                                        borderLeft: type === "xml" ? "4px solid #FFA500" : "4px solid #28A745",
                                                    }}
                                                >
                                                    {/* Icono según el tipo de archivo */}
                                                    {type === "xml" ? (
                                                        <Typography sx={{ fontWeight: "bold", color: "#FFA500" }}>📄 <strong>{type} :</strong></Typography>
                                                    ) : type === "pdf" ? (
                                                        <Typography sx={{ fontWeight: "bold", color: "#28A745" }}>📑 <strong>{type} :</strong></Typography>
                                                    ) : (
                                                        <Typography sx={{ fontWeight: "bold", color: "#FF5733" }}>📦 <strong>{type} :</strong></Typography>
                                                    )}

                                                    {/* Nombre del archivo */}
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            flexGrow: 1,
                                                            color: "#333",
                                                            fontSize: "0.875rem",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                        title={file.name}
                                                    >
                                                        {file.name}
                                                    </Typography>

                                                    {/* Botón para visualizar */}
                                                    {type !== "zip" && (
                                                        <IconButton color="primary" href={URL.createObjectURL(file)} target="_blank">
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    )}

                                                    {/* Botón para eliminar */}
                                                    <IconButton color="secondary" onClick={() => handleDeleteFile(type, index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </>
                                    )}
                                </Box>
                            ))}


                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} md={2}>
                        <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                            <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>RFC</InputLabel>
                            <TextField disabled name="rfc" id="standard-disabled" value={form.rfc || ""} label="RFC" />

                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Cliente */}
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                            <InputLabel>Cliente</InputLabel>
                            <Autocomplete
                                options={clientes}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                value={clienteSeleccionado}
                                onChange={(e, value) => handleChangeProveedor(e, value)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Cliente" variant="outlined" error={!!errores.cliente} />
                                )}
                            />
                        </Paper>
                    </Grid>

                    {/* Proyecto */}

                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Proyecto</InputLabel>
                            <Autocomplete
                                name="proyecto"
                                options={proyectosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))}
                                groupBy={(option) => option.nombre.charAt(0).toUpperCase()}
                                getOptionLabel={(option) => `${option.nombre} (${option.id})`}
                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                onChange={(event, value) => handleChangeProyecto(event, value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Proyecto"
                                        error={!!errores.proyecto}
                                        helperText={errores.proyecto || ''}
                                    />
                                )}
                            />

                        </Paper>
                    </Grid>


                    {/* Departamento */}
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Departamento</InputLabel>
                            <Autocomplete
                                name="area"
                                options={departamentos}
                                getOptionLabel={(option) => option.nombreArea || ''}
                                value={departamentos.find((d) => d.id_area === form.area) || null}
                                onChange={(e, value) =>
                                    handleChangeAreas({
                                        target: { name: 'area', value: value?.id_area || '' },
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" error={!!errores.area} />
                                )}
                            />
                        </Paper>
                    </Grid>
                </Grid>





                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Tipo de gasto</InputLabel>
                            <Autocomplete
                                options={
                                    departamentos.find((d) => d.id_area === form.area)?.partidas || []
                                }
                                getOptionLabel={(option) => option.nombre || ''}
                                value={
                                    departamentos
                                        .find((d) => d.id_area === form.area)
                                        ?.partidas.find((p) => p.id === form.partida) || null
                                }
                                onChange={(e, value) =>
                                    handleChange({ target: { name: 'partida', value: value?.id || '' } })
                                }
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" error={!!errores.partida} />
                                )}
                            />
                        </Paper>
                    </Grid>
                    {/* Subgasto */}
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Tipo de Subgasto</InputLabel>
                            <Autocomplete
                                options={
                                    departamentos.find((d) => d.id_area === form.area)
                                        ?.partidas.find((p) => p.id === form.partida)
                                        ?.subpartidas || []
                                }
                                getOptionLabel={(option) => option.nombre || ''}
                                value={
                                    departamentos.find((d) => d.id_area === form.area)
                                        ?.partidas.find((p) => p.id === form.partida)
                                        ?.subpartidas.find((s) => s.id === form.subarea) || null
                                }
                                onChange={(e, value) =>
                                    handleChange({ target: { name: 'subarea', value: value?.id || '' } })
                                }
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" fullWidth error={!!errores.subarea} />
                                )}
                            />
                        </Paper>
                    </Grid>

                    {/* Total */}
                    <Grid item xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Total</InputLabel>
                            <NumberFormat
                                customInput={TextField}
                                name="total"
                                label="Monto total"
                                value={form.total}
                                thousandSeparator
                                prefix="$"
                                fullWidth
                                error={!!errores.total}
                                variant="outlined"
                                onValueChange={(values) =>
                                    handleChange({
                                        target: {
                                            name: 'total',
                                            value: values.floatValue || 0,
                                        },
                                    })
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>

                    {/* Fecha */}
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel sx={{ mb: 1 }}>Fecha de la venta</InputLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    label="Fecha de venta"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    inputVariant="outlined"
                                    name="fecha"
                                    value={form.fecha !== '' ? form.fecha : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={(e) => handleChangeFecha(e, 'fecha')}
                                    className="w-100"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={!!errores.fecha}
                                />
                            </MuiPickersUtilsProvider>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: "center", }} elevation={0}>
                            <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>Subir Archivos (Pago & Presupuesto)</InputLabel>

                            {/* Dropzone Estilizado */}
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: "2px dashed #28A745",
                                    padding: "20px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    borderRadius: "8px",
                                    transition: "all 0.3s",
                                    "&:hover": {
                                        backgroundColor: "#E3F3E1",
                                    },
                                }}
                            >
                                <input {...getInputProps()} />
                                <CloudUploadIcon sx={{ fontSize: 40, color: "#28A745", mb: 1 }} />
                                <Typography variant="body2" sx={{ color: "#555" }}>
                                    Arrastra y suelta archivos aquí o haz clic para seleccionar
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                       <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                        {/* Archivos subidos - Pago */}
                        {files.pago && (
                        <Box
                            sx={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#fff",
                            padding: "10px",
                            borderRadius: "5px",
                            borderLeft: "4px solid #FF5733",
                            }}
                        >
                            <Typography variant="body2" sx={{ flexGrow: 1, color: "#333" }} title={files.pago.name}>
                            <strong>📄 Pago:</strong> {files.pago.name}
                            </Typography>
                            {files.pago.type.includes("image") ? (
                            <img src={URL.createObjectURL(files.pago)} alt="Imagen subida" width="50" style={{ borderRadius: "4px" }} />
                            ) : (
                            <IconButton color="primary" href={URL.createObjectURL(files.pago)} target="_blank">
                                <VisibilityIcon />
                            </IconButton>
                            )}
                            <IconButton color="secondary" onClick={() => handleDeleteFile("pago")}>
                            <DeleteIcon />
                            </IconButton>
                        </Box>
                        )}

                        {/* Archivos subidos - Presupuesto */}
                        {files.presupuesto && (
                        <Box
                            sx={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#fff",
                            padding: "10px",
                            borderRadius: "5px",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                            borderLeft: "4px solid #007BFF",
                            }}
                        >
                            <Typography variant="body2" sx={{ flexGrow: 1, color: "#333" }} title={files.presupuesto.name}>
                            <strong>📄 Presupuesto:</strong> {files.presupuesto.name}
                            </Typography>
                            {files.presupuesto.type.includes("image") ? (
                            <img src={URL.createObjectURL(files.presupuesto)} alt="Imagen subida" width="50" style={{ borderRadius: "4px" }} />
                            ) : (
                            <IconButton color="primary" href={URL.createObjectURL(files.presupuesto)} target="_blank">
                                <VisibilityIcon />
                            </IconButton>
                            )}
                            <IconButton color="secondary" onClick={() => handleDeleteFile("presupuesto")}>
                            <DeleteIcon />
                            </IconButton>
                        </Box>
                        )}
                    </Paper>
                    </Grid>

                </Grid>
                <Grid container spacing={3} justifyContent="center">
                    {/* Descripción */}
                    <Grid item xs={12} sm={8} md={8}>
                        <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                            <InputLabel>Descripción</InputLabel>
                            <TextField
                                name="descripcion"
                                label="Descripción"
                                value={form.descripcion}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                error={!!errores.descripcion}
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    disableUnderline: false,
                                    sx: { color: 'black' },
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                {/* Botones */}

                <DialogActions>
                    <Button variant="contained" style={{ backgroundColor: '#F96D49', color: '#fff', '&:hover': { backgroundColor: '#F96D49', }, }} onClick={() => handleClose()}>
                        Cancelar
                    </Button>
                    {/* <Button color="primary" variant="contained" onClick={e => handleSend(form)}>
                       Enviar
                    </Button> */}
                    <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => handleSend(form)}>
                        Guardar
                    </Button>
                </DialogActions>
            </Container>

        </Box >
    );

}

