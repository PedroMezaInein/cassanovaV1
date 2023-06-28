import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux';

import TablaGeneralPaginado from './../../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { apiGet, apiOptions, apiPutForm } from './../../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'

export default function Factura(props) {
    const { opcionesData, data } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const tipo_factura = 'egresos'

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    console.log(data)

    useEffect(() => {
        
        if(opcionesData){
            setOpciones(opcionesData)
        }
    }, [opcionesData])

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
        factura: false,
        response: {},
        facturas: [],
        url_factura:''
    })

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

    // *************** ESTATUS DE COMPRA ***************

    // const handleSaveEstatus = () => {
    //     if(true){

    //         Swal.fire({
    //             title: 'Cargando...',
    //             allowOutsideClick: false,
    //             onBeforeOpen: () => {
    //                 Swal.showLoading()
    //             }
    //         }) 
    
    //         let newForm = {
    //             estatusCompra: form.estatusCompra,
    //         }

    //         apiPutForm(`v2/administracion/${tipo_factura}/estatusCompra/${data.id}`, newForm, auth)
    //         .then((response)=>{
    //             Swal.close()
    //             Swal.fire({
    //                 icon: 'success',
    //                 tittle: 'Editar estatus',
    //                 text: 'Se ha editado correctamente',
    //                 timer: 2000,
    //                 timerProgressBar: true,
    //             })
    //             // handleClose()
    //             // if(reload){
    //             //     reload.reload()
    //             // }
    //         }) 

    //         .catch((error)=>{  
    //             Swal.close()
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Ha ocurrido un error',
    //             })
    //         })
    //     }
        
    //     else {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: 'Todos los campos son obligatorios',
    //         })
    //     }
    // }

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

    const handleSaveEstatus = () => {
        if(true){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
    
            let newForm = {
                estatusCompra: form.estatusCompra,
            }

            apiPutForm(`v2/administracion/facturas/attach`, newForm, auth)
            .then((response)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    tittle: 'Editar estatus',
                    text: 'Se ha editado correctamente',
                    timer: 2000,
                    timerProgressBar: true,
                })
                // handleClose()
                // if(reload){
                //     reload.reload()
                // }
            }) 

            .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            })
        }
        
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
            })
        }
    }

    const columns = [
        { nombre: 'folio', identificador: 'folio', sort: false, stringSearch: false },
        { nombre: 'estatus', identificador: 'estatus', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'serie', identificador: 'serie', stringSearch: false },
        { nombre: 'emisor', identificador: 'emisor', stringSearch: false },
        { nombre: 'receptor', identificador: 'receptor', stringSearch: false },
        { nombre: 'subtotal', identificador: 'subtotal', stringSearch: false },
        { nombre: 'total', identificador: 'total', stringSearch: false },
        { nombre: 'monto acumulado', identificador: 'monto_acumulado', stringSearch: false },
        { nombre: 'monto restante', identificador: 'monto_restante', stringSearch: false },
        { nombre: 'adjuntos', identificador: 'adjuntos', stringSearch: false },
    ]

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

            <div>
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

            <div>
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

                <div>
                    <button>Enviar</button>
                </div>
                
            </div>

            <div>
                <TablaGeneralPaginado
                    subtitulo="información general"
                    url={'v3/administracion/gastos'}
                    columnas={columns}
                    numItemsPagina={5}
                    // ProccessData={proccessData}
                    // opciones={opciones}
                    // acciones={acciones}
                    // reload={setReloadTable} 
                    // filtros={filtrado}
                />
            </div>
        </div>
    )
}