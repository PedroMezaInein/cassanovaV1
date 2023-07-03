import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux';

// import TablaGeneralPaginado from './../../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import TablaGeneral from './../../../../components/NewTables/TablaGeneral/TablaGeneral'

import { apiPostForm, apiGet, apiPutForm, apiDelete, catchErrors } from './../../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3'

import Style from './CrearEgreso.module.css'

export default function Factura(props) {
    const { opcionesData, egreso, handleClose, reload } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const [reloadTable, setReloadTable] = useState()
    console.log(egreso)

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    const [form, setForm] = useState({
        adjuntos: {
                xml: {
                    files: [], value: ''
                },
                pdf: {
                    files: [], value: ''
                }
            },            
        options: {
            clientes: [],
            empresas: [],
            proveedores: [],
            estatusCompra: []
        },

        estatusCompra: '',
        facturaObject: false,
        factura: true,
        response: {},
        facturas: [],
        url_factura:''
    })

    const [modal, setModal] = useState({
        eliminar: {
            show: false,
            data: false
        },
    })

    useEffect(() => {
        if(opcionesData){
            setOpciones(opcionesData)
        }
        if (reloadTable) {
            reloadTable.reload()
        }
    }, [opcionesData])

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
                    if (keys.includes('cfdi:Conceptos')) {
                        if (jsonObj['cfdi:Conceptos']['cfdi:Concepto']) {
                            if (Array.isArray(jsonObj['cfdi:Conceptos']['cfdi:Concepto'])) {
                                jsonObj['cfdi:Conceptos']['cfdi:Concepto'].forEach((element, index) => {
                                    if (index) {
                                        obj.descripcion += ' - '
                                    }
                                    obj.descripcion += element['Descripcion']
                                })
                            } else {
                                obj.descripcion += jsonObj['cfdi:Conceptos']['cfdi:Concepto']['Descripcion']
                            }
                        }
                    }
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
                    console.log(obj)

                    let empresa = opcionesData.empresas.find((empresa) => empresa.rfc === obj.rfc_receptor)
                    let proveedor = opcionesData.proveedores.find((proveedor) => proveedor.rfc === obj.rfc_emisor)
                    let aux = []
                    files.forEach((file, index) => {
                        aux.push({
                            name: file.name,
                            file: file,
                            url: URL.createObjectURL(file),
                            key: index
                        })
                    })
                    let path = `C:/fakepath/` + aux[0].name // a lo mejor tiene que ser C:\\fakepath\\ o algo asi
                    
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
                        cuentas: opciones.empresas.find((empresaData) => empresaData.id === empresa.id).cuentas,
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
        let files = form.adjuntos[tipo].files
        files.splice(index, 1)
        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: {files: [...files], value: ''}
            }
        })
    }

    const handleAddFile = (e, tipo) => {
        let aux = []

        e.target.files.forEach((file, index) => {
            console.log(file)
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })

        let path = 'C:/fakepath/'+ aux[0].name

        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: {files: aux, value: path}
            }
        })
    }

    // *************** AGREGAR ARCHIVOS ***************
    const addFacturaS3 =  ( ) => {

        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/egresos/`
                let aux = []
                form.adjuntos.xml.files.forEach((file) => {
                    aux.push(file)
                })
                form.adjuntos.pdf.files.forEach((file) => {
                    aux.push(file)
                })
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
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
                Promise.all(auxPromises).then(values => { addNewFacturaAxios(values, egreso) }).catch(err => console.error(err))
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

    const addNewFacturaAxios = (files, egreso) => {
        let aux = form
        aux.archivos = files

        apiPostForm(`v2/administracion/facturas`, aux, auth).then(
            (response) => {
                const { factura } = response.data

                setForm({
                    ...form,
                    facturaItem: factura,
                    archivos: files
                })
                attachFactura(egreso, factura)
            }, (error) => { }
        ).catch((error) => {
            console.error(error, 'error')
        })
    }

    const attachFactura = (egreso, factura) => {

        let objeto = {
            dato: egreso.id,
            tipo: 'egreso',
            factura: factura.id
        }

        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Gasto creado con éxito',
                    text: 'Se creó el gasto con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
                
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

    const formatNumber = (num) => {
        return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    const proccessData = (datos) => {
        let aux = [];

        // if (datos.egreso.facturas.length === 0) { //todos estos valores excepto "estatus" estan dentro del array FACTURAS que esta en el objeto EGRESO. Pregunto si existe FACTURAS
        //     aux.push({
        //         folio: 'n/a',
        //         estatus: datos.egreso.estatus_compra.estatus ? datos.egreso.estatus_compra.estatus : 'n/a',
        //         fecha: 'n/a',
        //         serie: 'n/a',
        //         emisor: 'n/a',
        //         receptor: 'n/a',
        //         subtotal: 'n/a',
        //         total: 'n/a',
        //         adjuntos: 'n/a'
        //     });
        // } else { // dentro de facturas están las propiedades de XML y PDF, cada uno es un objeto
            datos.egreso.facturas.forEach((factura) => {
                let adjuntos = []; // creo un nuevo array para almacenar los valores de los adjuntos 
                if (factura.xml.name) {
                    adjuntos.push(
                        <div style={{width:'100px', marginRight:'2.5rem'}}>
                            <a style={{width:'90%'}} href={factura.xml.url} target="_blank" rel="noopener noreferrer">
                                XML: {factura.xml.name}
                            </a> 
                        </div>   
                    );
                }
                if (factura.pdf.name) {
                    adjuntos.push(
                        <div style={{width:'100px'}}>
                            <a style={{width:'90%'}} href={factura.pdf.url} target="_blank" rel="noopener noreferrer">
                                PDF: {factura.pdf.name}
                            </a>
                        </div>
                    );
                }
    
                aux.push({
                folio: factura.folio ? factura.folio : 'n/a',
                estatus: factura.status ? factura.status : 'n/a',
                fecha: factura.fecha ? factura.fecha : 'n/a',
                serie: factura.serie ? factura.serie : 'n/a',
                emisor: factura.nombre_emisor ? factura.nombre_emisor : 'n/a',
                receptor: factura.nombre_receptor ? factura.nombre_receptor : 'n/a',
                subtotal: factura.subtotal ? '$ '+ formatNumber (factura.subtotal) : 'n/a',
                total: factura.total ? '$ '+ formatNumber (factura.total) : 'n/a',
                adjuntos: adjuntos.length > 0 ? adjuntos : 'n/a',
                id: factura.id,
                data: factura,
                });
            });
        // }
    
        return aux;
    };

    const deleteEgresoAxios = (id) => {
        console.log(egreso)

        apiDelete(`v2/administracion/egresos/${egreso.id}/facturas/${id}`, auth).then(
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

    let acciones = () => {
        let aux = [
            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash-alt',
                color: 'redButton',
                funcion: (item) => {
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
                            console.log(item)
                            deleteEgresoAxios(item.id)
                            
                        }
                    })
                }
            }, 
        ]
        return aux
    }

    return (

        <div>

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

            <div className='row' style={{marginTop:'1rem', marginBottom:'2rem'}}>
                <div className='col-6'>
                    <InputLabel>XML de la factura</InputLabel>
                    <div >

                        <div>
                            <input
                                accept="application/xml"
                                style={{ display: 'none' }}
                                id="xml"
                                
                                type="file"
                                onChange={onChangeFactura}
                            />
                            <label htmlFor="xml" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant="contained" color="primary" component="span">
                                    Agregar
                                </Button>
                            </label>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {
                                    form.adjuntos.xml.files.map((item, index) => (
                                        <div key={index}  style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px' }}>
                                            <div style={{ maxWidth: '140px', display: 'flex', justifyContent: 'space-between' }}>
                                                <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}<span onClick={() => handleDeleteFile('xml', index)} style={{ color: 'red', cursor: 'pointer'  }}>X</span></p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>    
                        </div> 

                    </div>   
                </div>

                <div className='col-6'>
                    <InputLabel>PDF de la factura</InputLabel>
                    <div>
                        <input
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            id="pdf"
                            
                            type="file"
                            onChange={(e) => handleAddFile(e, 'pdf')} 
                        />
                        <label htmlFor="pdf" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button variant="contained" color="primary" component="span">
                                Agregar
                            </Button>
                        </label>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {
                                form.adjuntos.pdf.files.map((item, index) => (
                                    <div key={index} style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px' }}>
                                        <div style={{ maxWidth: '140px', display: 'flex', justifyContent: 'space-between' }}>
                                            <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
                                            <span onClick={() => handleDeleteFile('pdf', index)} style={{ color: 'red', cursor: 'pointer'  }}>X</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>    
                    </div> 
                </div>

                <div style={{marginLeft:'85%'}}>
                    <button className={Style.sendButton}  onClick={addFacturaS3}>Enviar</button>
                </div>
                    
                </div>
            
            <div>
                <TablaGeneral
                    subtitulo="información general"
                    url={`v2/administracion/egresos/facturas/${egreso.id}`}
                    columnas={columns}
                    numItemsPagina={20}
                    ProccessData={proccessData}
                    // opciones={opciones}
                    acciones={acciones()}
                    reload={setReloadTable} 
                />
            </div>
        </div>
    )
}