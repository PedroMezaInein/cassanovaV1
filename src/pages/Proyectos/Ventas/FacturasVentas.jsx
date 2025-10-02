import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux';
import { apiPostForm, apiGet, apiPutForm, apiDelete, catchErrors, apiOptions } from './../../../functions/api'
import InputLabel from '@material-ui/core/InputLabel';
import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3'
import {
    Grid, Paper, Tooltip, Typography, IconButton,
    Card, CardContent, CardActions, Box, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@material-ui/core/Button';




export default function FacturasVentas(props) {
    const { opcionesData, handleClose, reload, venta } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const [reloadTable, setReloadTable] = useState()
    const [openPreview, setOpenPreview] = useState(false)
    const [previewData, setPreviewData] = useState(null)
    const proveedores = useSelector((state) => state.opciones.proveedores);

    const [facturas, setFacturas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [facturaPreview, setFacturaPreview] = useState(null);
    // console.log(opcionesData)


    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusVentas: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    const [form, setForm] = useState({
        adjuntos: {
            xml: { files: [], value: '' },
            pdf: { files: [], value: '' },
            excel: { files: [], value: '' },
            imagenes: { files: [], value: '' }, // ✅ agregar
            zip: { files: [], value: '' },
        },
        options: {
            clientes: [],
            empresas: [],
            proveedores: [],
            estatusVenta: [],
        },
        estatusVenta: '',
        facturaObject: false,
        factura: true,
        response: {},
        facturas: [],
        url_factura: '',
    });


    const [modal, setModal] = useState({
        eliminar: {
            show: false,
            data: false
        },
    })

    useEffect(() => {
        obtenerFacturas();
    }, []);


    useEffect(() => {
        if (opcionesData) {
            setOpciones(opcionesData)
        }
        if (reloadTable) {
            reloadTable.reload()
        }
    }, [opcionesData])

    // console.log(venta)
    // 🟢 Obtener facturas de la API
    const obtenerFacturas = async () => {
        try {
            const response = await apiGet(`v2/proyectos/ventas/facturas/${venta?.id || venta}`, auth);
            const facturasCFDI = response.data.venta.facturas || []; // facturas "normales"
            const facturasAdjuntos = response.data.venta.facturas_pdf || []; // nuevos adjuntos
            const todasFacturas = [...facturasCFDI];

            facturasAdjuntos.forEach(adjunto => {
                todasFacturas.push({
                    id: adjunto.id,
                    nombre_emisor: 'Adjunto',
                    nombre_receptor: 'Adjunto',
                    subtotal: 'n/a',
                    total: 'n/a',
                    archivoAdjunto: { url: adjunto.url_temporal, name: adjunto.name },
                    esAdjunto: true
                });
            });
            // console.log(todasFacturas)
            setFacturas(todasFacturas);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error al obtener facturas' });
        }
    };


    // *************** ESTATUS DE COMPRA ***************
    // const handleChange = (event) => {
    //     const selectedValue = event.target.value;
    //     const selectedOption = opcionesData.estatusCompras.find((item) => item.id === selectedValue);

    //     Swal.fire({
    //         title: `cambiarás el estatus de la compra a: "${selectedOption.name}"?`,
    //         text: '¿Deseas continuar?',
    //         icon: 'question',
    //         showCancelButton: true,
    //         confirmButtonText: 'Sí',
    //         cancelButtonText: 'No'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //         setForm((prevForm) => ({
    //             ...prevForm,
    //             estatusCompra: selectedValue
    //         }));
    //         handleSaveEstatus();
    //         } else {
    //         // Si se selecciona "No", puedes realizar alguna acción adicional o simplemente no hacer nada
    //         }
    //     });
    // };

    // *****************************************************

    const onChangeFactura = async (e) => {
        const ventaId = typeof venta === "object" ? venta.id : venta; // ✅ seguro
        const { files } = e.target;
        if (!files || !files[0]) {
            console.warn("No se seleccionó archivo");
            return;
        }

        const file = files[0];

        if (file.type !== "text/xml") {
            Swal.fire({
                icon: "error",
                title: "Formato XML incorrecto",
                text: "El archivo debe ser un XML válido",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target.result;
                let jsonObj = j2xParser.parse(text, {
                    ignoreAttributes: false,
                    attributeNamePrefix: "",
                });

                if (!jsonObj["cfdi:Comprobante"]) {
                    Swal.fire({
                        icon: "error",
                        title: "XML inválido",
                        text: "No se encontró el nodo cfdi:Comprobante",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    return;
                }

                // ✅ Preview de datos básicos
                const comprobante = jsonObj["cfdi:Comprobante"];
                setFacturaPreview({
                    rfc_receptor: comprobante["cfdi:Receptor"]?.Rfc || "N/A",
                    nombre_receptor: comprobante["cfdi:Receptor"]?.Nombre || "N/A",
                    rfc_emisor: comprobante["cfdi:Emisor"]?.Rfc || "N/A",
                    nombre_emisor: comprobante["cfdi:Emisor"]?.Nombre || "N/A",
                    fecha: comprobante.Fecha || "N/A",
                    metodo_pago: comprobante.MetodoPago || "N/A",
                    total: comprobante.Total || "N/A",
                    moneda: comprobante.Moneda || "N/A",
                    descripcion:
                        comprobante["cfdi:Conceptos"]?.["cfdi:Concepto"]?.Descripcion || "N/A",
                });
                setOpenModal(true);

                // 🔥 Subida automática al backend
                const data = new FormData();
                data.append("files_name_facturas[]", file.name);
                data.append("files_facturas[]", file);
                data.append("adjuntos[]", "factura-xml");
                data.append("tipo", "factura-xml");

                Swal.fire({
                    title: "Subiendo XML...",
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });

                await apiPostForm(
                    `v2/proyectos/ventas/${ventaId}/archivos/s3`,
                    data,
                    auth
                );

                Swal.fire({
                    icon: "success",
                    title: "XML subido con éxito",
                    timer: 1200,
                    showConfirmButton: false,
                });

                // 🔄 Recargar lista de facturas
                obtenerFacturas();
            } catch (err) {
                console.error("Error al leer XML:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo procesar el archivo XML",
                });
            }
        };

        reader.readAsText(file);
    };

    const handleDeleteFile = (tipo, index) => {
        let files = form.adjuntos[tipo].files
        files.splice(index, 1)
        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: { files: [...files], value: '' }
            }
        })
    }

    const handleAddFile = (e) => {
        const archivos = Array.from(e.target.files);
        const nuevosAdjuntos = { ...form.adjuntos };

        archivos.forEach((file, index) => {
            const nombre = file.name.toLowerCase();
            const tipoMime = file.type;

            const fileObj = {
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: Date.now() + index,
            };

            // Clasificación por tipo de archivo
            if (tipoMime.includes("pdf") || nombre.endsWith(".pdf")) {
                if (!nuevosAdjuntos.pdf) nuevosAdjuntos.pdf = { files: [], value: '' };
                nuevosAdjuntos.pdf.files.push(fileObj);
                nuevosAdjuntos.pdf.value = 'C:/fakepath/' + file.name;
            } else if (tipoMime.includes("image") || nombre.match(/\.(jpg|jpeg|png)$/)) {
                if (!nuevosAdjuntos.imagenes) nuevosAdjuntos.imagenes = { files: [], value: '' };
                nuevosAdjuntos.imagenes.files.push(fileObj);
                nuevosAdjuntos.imagenes.value = 'C:/fakepath/' + file.name;
            } else if (
                tipoMime.includes("sheet") ||
                nombre.endsWith(".xls") ||
                nombre.endsWith(".xlsx")
            ) {
                if (!nuevosAdjuntos.excel) nuevosAdjuntos.excel = { files: [], value: '' };
                nuevosAdjuntos.excel.files.push(fileObj);
                nuevosAdjuntos.excel.value = 'C:/fakepath/' + file.name;
            } else if (tipoMime.includes("zip") || nombre.endsWith(".zip")) {
                if (!nuevosAdjuntos.zip) nuevosAdjuntos.zip = { files: [], value: '' };
                nuevosAdjuntos.zip.files.push(fileObj);
                nuevosAdjuntos.zip.value = 'C:/fakepath/' + file.name;
            }
        });

        setForm({
            ...form,
            adjuntos: nuevosAdjuntos,
        });
    };


    // const addFacturaS3 = async () => {
    //     if (!form.adjuntos) {
    //         Swal.fire({ icon: 'error', title: 'Error de adjuntos', text: 'No se encontraron archivos cargados.' });
    //         return;
    //     }

    //     const {
    //         xml = { files: [] },
    //         pdf = { files: [] },
    //         imagenes = { files: [] },
    //         excel = { files: [] },
    //         zip = { files: [] }
    //     } = form.adjuntos;

    //     const allFiles = [...xml.files, ...pdf.files, ...imagenes.files, ...excel.files, ...zip.files];
    //     console.log('📁 Archivos listos para subir a S3:');
    //     allFiles.forEach((file, index) => {
    //         console.log(`🗂️ Archivo ${index + 1}:`, {
    //             name: file.name,
    //             size: file.file?.size + ' bytes',
    //             type: file.file?.type,
    //             key: file.key,
    //             url: file.url
    //         });
    //     });

    //     if (allFiles.length === 0) {
    //         Swal.fire({ icon: 'error', title: 'Debe agregar al menos un archivo' });
    //         return;
    //     }

    //     Swal.fire({ title: 'Subiendo archivos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    //     try {

    //         const { data: config } = await apiGet(`v1/constant/admin-proyectos`, auth);
    //         const alma = config.alma;
    //         const filePath = `facturas/ventas/`;

    //         const uploads = allFiles.map((file) => {
    //             const nombre = `${Math.floor(Date.now() / 1000)}-${file.name}`;
    //             return new Promise((resolve, reject) => {
    //                 new S3(alma).uploadFile(file.file, `${filePath}${nombre}`)
    //                     .then((data) => {
    //                         if (data.status === 204) {
    //                             console.log('✅ Archivo subido con éxito:', {
    //                                 name: file.name,
    //                                 url: data.location,
    //                             });
    //                             resolve({ name: file.name, url: data.location });
    //                         } else {
    //                             console.error('⚠️ S3 respondió con status inesperado:', data);
    //                             reject(data);
    //                         }
    //                     })
    //             });
    //         });

    //         const uploaded = await Promise.all(uploads);
    //         console.log('📦 Venta actual:', venta);
    //         console.log('📝 Estado completo del formulario (form):', form);
    //         console.log('📎 Archivos adjuntos en form.adjuntos:', form.adjuntos);


    //         // const archivoXml = xml.files?.[0];

    //         // if (archivoXml) {
    //         //     const reader = new FileReader();
    //         //     reader.onload = (e) => {
    //         //         const xmlText = e.target.result;
    //         //         const datos = leerFacturaXML(xmlText); // ← tu función para extraer: folio, fecha, emisor, receptor, etc.

    //         //         const formConXML = {
    //         //             ...form,
    //         //             ...datos
    //         //         };

    //         //         addNewFacturaAxios(uploaded, formConXML); // 🔁 paso final
    //         //     };
    //         //     reader.readAsText(archivoXml.file);
    //         // } else {
    //             addNewFacturaAxios(uploaded, venta); // sin XML
    //         // }

    //         setForm((prevForm) => ({
    //             ...prevForm,
    //             adjuntos: {
    //                 xml: { files: [], value: '' },
    //                 pdf: { files: [], value: '' },
    //                 imagenes: { files: [], value: '' },
    //                 excel: { files: [], value: '' },
    //                 zip: { files: [], value: '' }
    //             }
    //         }));

    //         if (reloadTable) reloadTable.reload();

    //     } catch (error) {
    //         console.error(error);
    //         Swal.close();
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error al subir archivos',
    //             text: 'Ocurrió un error al adjuntar los archivos',
    //             showConfirmButton: false,
    //             timer: 1500
    //         });
    //     }
    // };

    const addFacturaS3 = async () => {
        const ventaId = typeof venta === "object" ? venta.id : venta; // 👈 aquí el fix
        const { xml, pdf, imagenes, excel, zip } = form.adjuntos;

        if (
            xml.files.length === 0 &&
            pdf.files.length === 0 &&
            imagenes.files.length === 0 &&
            excel.files.length === 0 &&
            zip.files.length === 0
        ) {
            Swal.fire({ icon: "error", title: "Debe agregar al menos un archivo" });
            return;
        }

        const allFiles = [...xml.files, ...pdf.files, ...imagenes.files, ...excel.files, ...zip.files];

        if (allFiles.length === 1) {
            const file = allFiles[0];
            const data = new FormData();
            data.append("files_name_facturas[]", file.name);
            data.append("files_facturas[]", file.file);

            data.append("adjuntos[]", "factura-xml");
            data.append("tipo", "factura-xml");

            try {
                await apiPostForm(`v2/proyectos/ventas/${ventaId}/archivos/s3`, data, auth);
                obtenerFacturas();
                if (reloadTable) reloadTable.reload();

            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir archivo',
                    text: 'Ocurrió un error al subir el archivo',
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        } else {
            // 🔹 Flujo para varios archivos
            Swal.fire({ title: 'Subiendo archivos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            try {
                // const { data: config } = await apiGet(`v1/constant/admin-proyectos`, auth);
                // const alma = config.alma;
                // const filePath = `facturas/ventas/`;

                // const uploads = allFiles.map((file) => {
                //     const nombre = `${Math.floor(Date.now() / 1000)}-${file.name}`;
                //     return new Promise((resolve, reject) => {
                //         new S3(alma).uploadFile(file.file, `${filePath}${nombre}`)
                //             .then((data) => {
                //                 if (data.status === 204) {
                //                     resolve({ name: file.name, url: data.location });
                //                 } else {
                //                     reject(data);
                //                 }
                //             })
                //             .catch((error) => reject(error));
                //     });
                // });

                // const uploaded = await Promise.all(uploads);

                // addNewFacturaAxios(uploaded, venta);

                // setForm((prevForm) => ({
                //     ...prevForm,
                //     adjuntos: {
                //         xml: { files: [], value: '' },
                //         pdf: { files: [], value: '' },
                //         imagenes: { files: [], value: '' },
                //         excel: { files: [], value: '' },
                //     }
                // }));

            // if (reloadTable) reloadTable.reload();
                // console.log(allFiles)
                addNewFacturaAxios(allFiles, venta);

                setForm((prevForm) => ({
                    ...prevForm,
                    adjuntos: {
                    xml: { files: [], value: '' },
                    pdf: { files: [], value: '' },
                    imagenes: { files: [], value: '' },
                    excel: { files: [], value: '' },
                    }
                }));

                if (reloadTable) reloadTable.reload();

            } catch (error) {
                console.error(error);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir archivos',
                    text: 'Ocurrió un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };




    // const addNewFacturaAxios = (files, venta) => {
    //     // const facturaObject = {
    //     //     folio: datosFactura?.folio || '',
    //     //     fecha: datosFactura?.fecha || '',
    //     //     serie: datosFactura?.serie || '',
    //     //     nombre_emisor: datosFactura?.nombre_emisor || '',
    //     //     nombre_receptor: datosFactura?.nombre_receptor || '',
    //     //     total: datosFactura?.total || 0,
    //     // };

    //     // const formData = new FormData();

    //     // Object.entries(facturaObject).forEach(([key, value]) => {
    //     //     formData.append(`facturaObject[${key}]`, value);
    //     // });
    //     // console.log(files)
    //     // files.forEach((file) => {
    //     //     files.forEach((file, index) => {
    //     //         formData.append(`archivos[${index}][name]`, file.name);
    //     //         formData.append(`archivos[${index}][url]`, file.url);
    //     //     });

    //     // });
    //     // console.log(formData.archivos)
    //     let aux = form
    //     aux.archivos = files


    //     // console.log(formData)
    //     apiPostForm(`v2/administracion/facturas`, aux, auth)
    //         .then((response) => {
    //             const { factura } = response.data;

    //             setFacturas(prev => [...prev, factura]);

    //             console.log(factura)
    //             console.log(files)
    //             setForm(prev => ({
    //                 ...prev,
    //                 facturaItem: factura,
    //                 archivos: files
    //             }));

    //             if (typeof reload === 'function') {
    //                 reload();
    //             }
    //             attachFactura(venta, factura);
    //             obtenerFacturas();
    //         })
    //         .catch((error) => {
    //             console.error('Error al registrar factura:', error);
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error al registrar factura',
    //                 text: error?.response?.data?.message || 'Ocurrió un error inesperado',
    //             });
    //         });
    // };


    const addNewFacturaAxios = async (files: any, venta: any) => {
        // let aux = form
        // aux.archivos = files

        // apiPostForm(`v2/administracion/facturas`, aux, auth).then(
        //     (response) => {
        //         const { factura } = response.data
        //         setFacturas(prevFacturas => [...prevFacturas, factura]);

        //         setForm({
        //             ...form,
        //             facturaItem: factura,
        //             archivos: files
        //         })
        //         // if (reload) {
        //         //     reload.reload()
        //         // }
        //         attachFactura(venta, factura)
        //     }, (error) => { }
        // ).catch((error) => {
        //     console.error(error, 'error')
        // })

        try {
                    // 1) arma FormData
                const fd = new FormData();
    
                // facturaObject: ajusta al nombre real dentro de tu "form"
                const facturaObject =
                (form && (form.facturaObject || form.factura)) || {};
                fd.append("facturaObject", JSON.stringify(facturaObject));
    
                // helper para empujar archivos al mismo campo files_zip[]
                const pushFiles = (list?: { file: File; name?: string }[]) => {
                if (!Array.isArray(list)) return;
                list.forEach(({ file, name }) => {
                    // debe ser un File real (no {} ni blob:url)
                    if (!(file instanceof File) || file.size === undefined) return;
                    const stamped =
                    `${Math.floor(Date.now() / 1000)}-` + (name || file.name || "file");
                    fd.append("files_zip[]", file, stamped);
                });
                };
    
                // 2) soporta las distintas formas en que te llega "files"
                // a) objeto tipo adjuntos { pdf:{files:[]}, xml:{files:[]}, ... }
                if (
                files?.pdf || files?.xml || files?.zip || files?.excel || files?.imagenes
                ) {
                pushFiles(files?.pdf?.files);
                pushFiles(files?.xml?.files);
                pushFiles(files?.zip?.files);
                pushFiles(files?.excel?.files);
                pushFiles(files?.imagenes?.files);
                }
                // b) files.adjuntos (por si te lo pasan envuelto)
                else if (files?.adjuntos) {
                const adj = files.adjuntos;
                pushFiles(adj?.pdf?.files);
                pushFiles(adj?.xml?.files);
                pushFiles(adj?.zip?.files);
                pushFiles(adj?.excel?.files);
                pushFiles(adj?.imagenes?.files);
                }
                // c) arreglo plano [{ file, name }]
                else if (Array.isArray(files)) {
                pushFiles(files);
                }
                fd.append("facturaObject", JSON.stringify(facturaObject));
                fd.append("filePath", "facturas/ventas/");
    
                // console.log(fd)
                // 3) POST (apiPostForm debe detectar FormData y NO serializarlo)
                const response = await apiPostForm(`v2/administracion/facturas`, fd, auth);
    
                const { factura } = response.data;
    
                Swal.close();
                Swal.fire({
                icon: "success",
                title: "Factura subida con éxito",
                text: "Se subio la factura con éxito",
                showConfirmButton: false,
                timer: 1500,
                });
    
                setFacturas((prev) => [...prev, factura]);
                attachFactura(venta, factura);
    
                // Limpia estado (no mutamos form directamente)
                setForm((prev) => ({
                ...prev,
                facturaItem: factura,
                adjuntos: {
                    xml: { files: [], value: "" },
                    pdf: { files: [], value: "" },
                    zip: { files: [], value: "" },
                    excel: { files: [], value: "" },
                    imagenes: { files: [], value: "" },
                },
                }));
    
                if (reloadTable) reloadTable.reload();
                } catch (error) {
                    console.error(error, "error");
                }
            };
    // }


    const attachFactura = (venta, factura) => {
        // console.log(venta)
        let objeto = {
            dato: venta,
            tipo: 'venta',
            factura: factura.id
        }
        // console.log('facturas', objeto);
        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {

                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Venta creado con éxito',
                    text: 'Se creó el gasto con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
                setForm({ adjuntos: { xml: { files: [], value: '' }, pdf: { files: [], value: '' } } }); // Limpiar después de subir
                obtenerFacturas();

                if (reloadTable) {
                    reloadTable.reload()
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

    // ************************************************

    const columns = [
        { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'folio', identificador: 'folio', sort: false, stringSearch: false },
        { nombre: 'estatus', identificador: 'estatus', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'serie', identificador: 'serie', stringSearch: false },
        { nombre: 'emisor', identificador: 'emisor', stringSearch: false },
        { nombre: 'receptor', identificador: 'receptor', stringSearch: false },
        { nombre: 'sub total', identificador: 'subtotal', stringSearch: false },
        { nombre: 'total', identificador: 'total', stringSearch: false },
        // { nombre: 'monto acumulado', identificador: 'monto_acumulado', stringSearch: false },
        // { nombre: 'monto restante', identificador: 'monto_restante', stringSearch: false },
        { nombre: 'adjuntos', identificador: 'adjuntos', stringSearch: false },
    ]

    // const formatNumber = (num) => {
    //     const parsed = parseFloat(num);
    //     if (isNaN(parsed)) return '0.00';

    //     return parsed
    //         .toFixed(2)
    //         .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    // };
    const formatNumber = (num) => {
        return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    // const proccessData = (datos) => {
    //     let aux = [];

    //     if (!datos.venta || !Array.isArray(datos.venta.facturas)) return [];

    //     datos.venta.facturas.forEach((factura) => {
    //         let adjuntos = [];

    //         if (factura.xml && factura.xml.name) {
    //             adjuntos.push(
    //                 <div style={{ width: '100px', marginRight: '2.5rem' }} key={`xml-${factura.id}`}>
    //                     <a style={{ width: '90%' }} href={factura.xml.url} target="_blank" rel="noopener noreferrer">
    //                         XML: {factura.xml.name}
    //                     </a>
    //                 </div>
    //             );
    //         }

    //         if (factura.pdf && factura.pdf.name) {
    //             adjuntos.push(
    //                 <div style={{ width: '100px' }} key={`pdf-${factura.id}`}>
    //                     <a style={{ width: '90%' }} href={factura.pdf.url} target="_blank" rel="noopener noreferrer">
    //                         PDF: {factura.pdf.name}
    //                     </a>
    //                 </div>
    //             );
    //         }

    //         aux.push({
    //             folio: factura.folio ?? null,

    //             estatus: 'FACTURADO',
    //             fecha: factura.fecha || null,
    //             serie: factura.serie || null,
    //             emisor: factura.nombre_emisor || null,
    //             receptor: factura.nombre_receptor || null,

    //             subtotal: factura.subtotal ? '$ ' + formatNumber(factura.subtotal) : 'n/a',
    //             total: factura.total ? '$ ' + formatNumber(factura.total) : 'n/a',
    //             adjuntos: adjuntos.length > 0 ? adjuntos : 'n/a',
    //             id: factura.id,
    //             data: factura,
    //         });
    //     });

    //     return aux;
    // };

    // const deleteEgresoAxios = (id) => {

    //     apiDelete(`v2/proyectos/compras/${compra}/facturas/${id}`, auth).then(
    //         (response) => {
    //             Swal.fire(
    //                 '¡Eliminado!',
    //                 'la compra ha sido eliminado.',
    //                 'success'
    //             )
    //             if (reloadTable) {
    //                 reloadTable.reload()
    //             }
    //         }, (error) => { }
    //     ).catch((error) => { catchErrors(error) })
    // }
    // const leerFacturaXML = (xmlText) => {
    //     const parsed = j2xParser.parse(xmlText, {
    //         ignoreAttributes: false,
    //         attributeNamePrefix: '',
    //     });

    //     const comprobante = parsed['cfdi:Comprobante'];

    //     return {
    //         folio: comprobante?.Folio || 'SIN-FOLIO',
    //         fecha: comprobante?.Fecha || 'N/A',
    //         serie: comprobante?.Serie || 'N/A',
    //         nombre_emisor: comprobante['cfdi:Emisor']?.Nombre || 'N/A',
    //         nombre_receptor: comprobante['cfdi:Receptor']?.Nombre || 'N/A',
    //         subtotal: comprobante?.SubTotal || 0,
    //         total: comprobante?.Total || 0,
    //     };
    // };

    // const handleCargarXML = (file) => {
    //     if (!file) return;

    //     const reader = new FileReader();

    //     reader.onload = (e) => {
    //         const xmlText = e.target.result;
    //         const datos = leerFacturaXML(xmlText);

    //         const factura = {
    //             ...datos,
    //             xml: {
    //                 name: file.name,
    //                 url: URL.createObjectURL(file),
    //             },
    //             pdf: null,
    //             id: Date.now(),
    //         };

    //         console.log('Factura parseada:', factura);

    //         const dataFormateada = proccessData({ venta: { facturas: [factura] } });
    //         setFacturas(dataFormateada);

    //         // ✅ Agregar el archivo al estado adjuntos.xml.files
    //         const archivo = { name: file.name, file };
    //         setForm((prevForm) => ({
    //             ...prevForm,
    //             adjuntos: {
    //                 ...prevForm.adjuntos,
    //                 xml: {
    //                     ...prevForm.adjuntos.xml,
    //                     files: [...(prevForm.adjuntos.xml?.files || []), archivo],
    //                     value: file.name
    //                 }
    //             }
    //         }));
    //     };

    //     reader.readAsText(file);
    // };


    const deleteEgresoAxios = (factura) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let deletePromise;

                if (factura.esAdjunto) {
                    // 🔥 Si es adjunto eliminar de la ruta de adjuntos
                    deletePromise = apiDelete(`v2/proyectos/ventas/${venta}/adjuntos/${factura.id}`, auth);
                } else {
                    // 🔥 Si es factura CFDI eliminar de la ruta de facturas
                    deletePromise = apiDelete(`v2/proyectos/ventas/${venta}/facturas/${factura.id}`, auth);
                }

                deletePromise
                    .then(() => {
                        Swal.fire('¡Eliminado!', 'Se ha eliminado correctamente.', 'success');
                        setFacturas(prevFacturas => prevFacturas.filter(f => f.id !== factura.id));
                        obtenerFacturas(); // 🔥 Recargar después de eliminar
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo eliminar.', 'error');
                    });


                // apiDelete(`v2/proyectos/compras/${compra}/facturas/${id}`, auth)
                //     .then(() => {
                //         Swal.fire('¡Eliminado!', 'La factura ha sido eliminada.', 'success');
                //          // 🔥 Actualizar estado eliminando la factura eliminada
                //     setFacturas(prevFacturas => prevFacturas.filter(factura => factura.id !== id));

                //         obtenerFacturas(); // Recargar facturas tras eliminar
                //     })
                //     .catch(() => {
                //         Swal.fire('Error', 'No se pudo eliminar la factura.', 'error');
                //     });
            }
        });
    };

    // let acciones = () => {
    //     let aux = [
    //         {
    //             nombre: 'Eliminar',
    //             icono: 'fas fa-trash-alt',
    //             color: 'redButton',
    //             funcion: (item) => {
    //                 Swal.fire({
    //                     title: '¿Estás seguro?',
    //                     text: "¡No podrás revertir esto!",
    //                     icon: 'warning',
    //                     showCancelButton: true,
    //                     confirmButtonColor: '#3085d6',
    //                     cancelButtonColor: '#d33',

    //                     confirmButtonText: 'Sí, bórralo',
    //                     cancelButtonText: 'Cancelar'
    //                 }).then((result) => {
    //                     if (result.isConfirmed) {
    //                         deleteEgresoAxios(item.id)

    //                     }
    //                 })
    //             }
    //         },
    //     ]
    //     return aux
    // }

    return (
        <>

            {/* ************ ESTATUS DE COMPRA *************
            { 
                opcionesData?.estatusCompras && 
                    <div> 
                        <InputLabel>estatus de la compra</InputLabel>
                        <Select 
                            name="estatusCompras"
                            value={form.estatusCompra}
                            onChange={handleChange} 
                        >
                            {opcionesData.estatusCompras.map((item, index) => (
                                <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </div>
            } */}

            <Box sx={{ maxWidth: 900, margin: 'auto', padding: '2rem' }}>
                <Grid container spacing={4}>

                    {/* Sección de XML */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={4} sx={{ padding: 2 }}>
                            <CardContent>
                                <InputLabel>📄 XML de la Factura</InputLabel>

                                <input
                                    accept="application/xml"
                                    style={{ display: 'none' }}
                                    id="xml-upload"
                                    type="file"
                                    // onChange={(e) => {
                                    //     const file = e.target.files[0];
                                    //     if (file) handleCargarXML(file);
                                    // }}
                                    onChange={onChangeFactura}
                                />

                                <label htmlFor="xml-upload">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        fullWidth
                                        startIcon={<DescriptionIcon />}
                                        style={{ mt: 1 }}
                                    >
                                        Agregar XML
                                    </Button>
                                </label>
                            </CardContent>
                            {/* 📜 Modal de Vista Previa del XML */}
                            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                                <DialogTitle>📄 Vista Previa del XML</DialogTitle>
                                <DialogContent>
                                    {facturaPreview ? (
                                        <Box>
                                            <Typography><strong>RFC Emisor:</strong> {facturaPreview.rfc_emisor}</Typography>
                                            <Typography><strong>Nombre Emisor:</strong> {facturaPreview.nombre_emisor}</Typography>
                                            <Typography><strong>RFC Receptor:</strong> {facturaPreview.rfc_receptor}</Typography>
                                            <Typography><strong>Nombre Receptor:</strong> {facturaPreview.nombre_receptor}</Typography>
                                            <Typography><strong>Fecha:</strong> {facturaPreview.fecha}</Typography>
                                            <Typography><strong>Método de Pago:</strong> {facturaPreview.metodo_pago}</Typography>
                                            <Typography><strong>Moneda:</strong> {facturaPreview.moneda}</Typography>
                                            <Typography><strong>Total:</strong> ${facturaPreview.total}</Typography>
                                            <Typography><strong>Descripción:</strong> {facturaPreview.descripcion}</Typography>
                                        </Box>
                                    ) : (
                                        <Typography>❌ No se encontraron datos en el XML.</Typography>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenModal(false)} color="error">Cerrar</Button>
                                </DialogActions>
                            </Dialog>

                            {/* Archivos Cargados */}
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.xml.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.25)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#3f51b5',
                                                        }}
                                                    >
                                                        {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('xml', index)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: '#f77c5d', color: '#f77c5d',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Sección de PDF */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={4} sx={{ padding: 2 }}>
                            <CardContent>
                                <InputLabel>📑 PDF de la Factura</InputLabel>
                                <input
                                    accept="application/pdf,application/zip,image/jpeg,image/png,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    style={{ display: 'none' }}
                                    id="pdf-upload"
                                    type="file"
                                    onChange={(e) => handleAddFile(e, 'pdf')}
                                />
                                <label htmlFor="pdf-upload">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        fullWidth
                                        startIcon={<PictureAsPdfIcon />}
                                        style={{ mt: 1 }}
                                    >
                                        Agregar PDF
                                    </Button>
                                </label>
                            </CardContent>

                            {/* Archivos Cargados */}
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.pdf.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.25)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#3f51b5',
                                                        }}
                                                    >
                                                        {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('pdf', index)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: '#f77c5d', color: '#f77c5d',
                                                        },
                                                    }}                                            >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.imagenes?.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.15)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <img src={item.url} alt={item.name} width={40} height={40} style={{ marginRight: 10, borderRadius: 4 }} />
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#3f51b5',
                                                        }}
                                                    >
                                                        {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('imagenes', index)}
                                                    sx={{ '&:hover': { backgroundColor: '#f77c5d', color: '#fff' } }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>

                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.excel?.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.15)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#388e3c',
                                                        }}
                                                    >
                                                        📊 {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('excel', index)}
                                                    sx={{ '&:hover': { backgroundColor: '#f77c5d', color: '#fff' } }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.zip?.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.15)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#000',
                                                        }}
                                                    >
                                                        🗜️ {item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('zip', index)}
                                                    sx={{ '&:hover': { backgroundColor: '#f77c5d', color: '#fff' } }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Botón de Enviar */}
                    <Grid item xs={12}>
                        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={addFacturaS3}
                                style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#075633', }, }}
                            >
                                Guardar
                            </Button>
                        </CardActions>
                    </Grid>

                </Grid>
            </Box>

            <Box sx={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
                <Grid container spacing={3}>

                    {facturas.length === 0 ? (
                        <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                            No hay facturas disponibles.  
                        </Typography>
                    ) : (
                        facturas.map((factura, index) => (
                            <Grid item xs={12} sm={8} md={6} key={index}>
                                <Card elevation={4} sx={{ padding: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {factura.esAdjunto
                                                ? 'Factura Adjunto'
                                                : factura.folio
                                                    ? `Folio: ${factura.folio}`
                                                    : 'Sin Folio'}
                                        </Typography>

                                        {/* Si es adjunto solo muestra nombre del archivo */}
                                        {factura.esAdjunto ? (
                                            <Typography variant="body2">
                                                <strong>Archivo:</strong> {factura.archivoAdjunto?.name || 'N/A'}
                                            </Typography>
                                        ) : (
                                            <>
                                                <Typography variant="body2"><strong>CFDI:</strong> {factura.serie || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Fecha:</strong> {factura.fecha || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Serie:</strong> {factura.serie || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Emisor:</strong> {factura.emisor || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Receptor:</strong> {factura.receptor || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Total:</strong> {factura.total || 'N/A'}</Typography>
                                            </>
                                        )}
                                    </CardContent>

                                    {/* Botones de acciones */}
                                    <CardActions sx={{ justifyContent: 'space-between' }}>
                                        {/* Botón para ver archivo */}
                                        {factura.esAdjunto ? (
                                            <Tooltip title="Ver archivo">
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    href={factura.archivoAdjunto?.url}
                                                    target="_blank"
                                                    size="small"
                                                >
                                                    Ver
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <>
                                                {/* Botón Ver XML */}
                                                {factura.xml?.url_temporal && (
                                                    <Tooltip title="Ver XML">
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            href={factura.xml.url_temporal}
                                                            target="_blank"
                                                            size="small"
                                                        >
                                                            XML
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                {/* Botón Ver PDF */}
                                                {factura.pdf?.url_temporal && (
                                                    <Tooltip title="Ver PDF">
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            href={factura.pdf.url_temporal}
                                                            target="_blank"
                                                            size="small"
                                                        >
                                                            PDF
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                            </>
                                        )}

                                        {/* Botón eliminar (común para ambos) */}
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteEgresoAxios(factura)}
                                                sx={{ color: '#f77c5d' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}

                </Grid>
            </Box>
            {/* <TablaGeneral
                    subtitulo="información general"
                    url={`v2/proyectos/compras/facturas/${compra}`}
                    columnas={columns}
                    numItemsPagina={20}
                    ProccessData={proccessData}
                    // opciones={opciones}
                    acciones={acciones()}
                    reload={setReloadTable}
                /> */}
        </>

    )
}