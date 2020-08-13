import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, URL_ASSETS } from '../../constants'
import { setSelectOptions} from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { ContabilidadForm } from '../../components/forms'
import JSZip from "jszip";
import { saveAs } from 'file-saver';

class Contabilidad extends Component {

    state = {
        form: {
            empresas: [],
            empresa: 0,
            fechaInicio: new Date,
            fechaFin: new Date,
            modulos: [
                {
                    text: 'Ventas',
                    id: 'ventas',
                    checked: false,
                },
                {
                    text: 'Compras',
                    id: 'compras',
                    checked: false,
                },
                {
                    text: 'Ingresos',
                    id: 'ingresos',
                    checked: false,
                },
                {
                    text: 'Egresos',
                    id: 'egresos',
                    checked: false,
                },
                {
                    text: 'Estados de cuenta',
                    id: 'estados de cuenta',
                    checked: false,
                },
                {
                    text: 'Facturacion',
                    id: 'facturacion',
                    checked: false,
                },
            ],
            archivos: [
                {
                    text: 'Presupuestos',
                    id: 'presupuestos',
                    checked: false,
                },
                {
                    text: 'Pagos',
                    id: 'pagos',
                    checked: false,
                },
                {
                    text: 'Facturas',
                    id: 'facturas',
                    checked: false,
                }
            ],
            facturas: [
                {
                    text: 'Sin factura',
                    id: 'Sin factura',
                    checked: false,
                },
                {
                    text: 'Con factura',
                    id: 'Con factura',
                    checked: false,
                }
            ]
        },
        options: {
            empresas: [],
        },
        modal:{
            form: false,
            delete: false,
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
        this.getReportesContabilidadAxios()
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeEmpresa = e => {
        const { name, value } = e.target
        const { options, form } = this.state
        let auxEmpresa = form.empresas
        let aux = []
        options.empresas.find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxEmpresa.push(_aux)
            } else {
                aux.push(_aux)
            }
        })

        options.empresas = aux
        form['empresas'] = auxEmpresa
        this.setState({
            ... this.state,
            form,
            options
        })
    }

    updateEmpresa = empresa => {
        const { form, options } = this.state
        let aux = []
        form.empresas.map((element, key) => {
            if (empresa.value.toString() !== element.value.toString()) {
                aux.push(element)
            } else {
                options.empresas.push(element)
            }
        })
        form.empresas = aux
        this.setState({
            ... this.state,
            options,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.createReporteContabilidad()
    }

    async getReportesContabilidadAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'contabilidad', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setSelectOptions(empresas, 'name')
                this.setState({
                    ... this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async createReporteContabilidad(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'contabilidad', form,  { headers: {Authorization:`Bearer ${access_token}`}, timeout: 60000000 }).then(
            (response) => {
                const { empresas } = response.data
                if(empresas){
                    const zip = new JSZip()
                    let empresaFolder = ''
                    empresas.map( (empresa) => {
                        empresaFolder = zip.folder(empresa.name)
                        let url = ''
                        if(empresa.venta_url){
                            url = URL_ASSETS + '/storage/' + empresa.venta_url
                            const blobPromise = fetch(url, {method: 'GET', headers:{'Access-Control-Allow-Origin': '*'}, cache: 'default'}).then(r => {
                                if (r.status === 200) return r.blob()
                                return Promise.reject(new Error(r.statusText))
                            })
                            const name = (url.substring(url.lastIndexOf('/'))).replace('/', '');
                            
                            empresaFolder.file(name, blobPromise)
                            if(empresa.ventas){
                                empresa.ventas.map( (venta) => {
                                    if(venta.pagos){
                                        venta.pagos.map( (pago) => {
                                            url = pago.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'ventas/pagos/'+empresa.name+' V '+pago.id+' '+venta.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(venta.presupuestos){
                                        venta.presupuestos.map( (presupuesto) => {
                                            url = presupuesto.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'ventas/presupuestos/'+empresa.name+' V '+presupuesto.id+' '+venta.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(venta.facturas){
                                        venta.facturas.map( (factura) => {
                                            if(factura.xml){
                                                url = factura.xml.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'ventas/facturas/'+empresa.name+' F '+factura.id+' '+venta.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                            if(factura.pdf){
                                                url = factura.pdf.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'ventas/facturas/'+empresa.name+' F '+factura.id+' '+venta.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        if(empresa.compra_url){
                            url = URL_ASSETS + '/storage/' + empresa.compra_url
                            const blobPromise = fetch(url).then(r => {
                                if (r.status === 200) return r.blob()
                                return Promise.reject(new Error(r.statusText))
                            })
                            const name = (url.substring(url.lastIndexOf('/'))).replace('/', '')
                            empresaFolder.file(name, blobPromise)
                            if(empresa.compras){
                                empresa.compras.map( (compra) => {
                                    if(compra.pagos){
                                        compra.pagos.map( (pago) => {
                                            url = pago.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'compras/pagos/'+empresa.name+' C '+pago.id+' '+compra.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(compra.presupuestos){
                                        compra.presupuestos.map( (presupuesto) => {
                                            url = presupuesto.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'compras/presupuestos/'+empresa.name+' C '+presupuesto.id+' '+compra.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(compra.facturas){
                                        compra.facturas.map( (factura) => {
                                            if(factura.xml){
                                                url = factura.xml.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'compras/facturas/'+empresa.name+' F '+factura.id+' '+compra.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                            if(factura.pdf){
                                                url = factura.pdf.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'compras/facturas/'+empresa.name+' F '+factura.id+' '+compra.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        if(empresa.egreso_url){
                            url = URL_ASSETS + '/storage/' + empresa.egreso_url
                            const blobPromise = fetch(url).then(r => {
                                if (r.status === 200) return r.blob()
                                return Promise.reject(new Error(r.statusText))
                            })
                            const name = (url.substring(url.lastIndexOf('/'))).replace('/', '')
                            empresaFolder.file(name, blobPromise)
                            if(empresa.egresos){
                                empresa.egresos.map( (egreso) => {
                                    if(egreso.pagos){
                                        egreso.pagos.map( (pago) => {
                                            url = pago.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'egresos/pagos/'+empresa.name+' E '+pago.id+' '+egreso.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(egreso.presupuestos){
                                        egreso.presupuestos.map( (presupuesto) => {
                                            url = presupuesto.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'egresos/presupuestos/'+empresa.name+' E '+presupuesto.id+' '+egreso.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(egreso.facturas){
                                        egreso.facturas.map( (factura) => {
                                            if(factura.xml){
                                                url = factura.xml.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'egresos/facturas/'+empresa.name+' F '+factura.id+' '+egreso.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                            if(factura.pdf){
                                                url = factura.pdf.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'egresos/facturas/'+empresa.name+' F '+factura.id+' '+egreso.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        if(empresa.ingreso_url){
                            url = URL_ASSETS + '/storage/' + empresa.ingreso_url
                            const blobPromise = fetch(url).then(r => {
                                if (r.status === 200) return r.blob()
                                return Promise.reject(new Error(r.statusText))
                            })
                            const name = (url.substring(url.lastIndexOf('/'))).replace('/', '')
                            empresaFolder.file(name, blobPromise)
                            if(empresa.ingresos){
                                empresa.ingresos.map( (ingreso) => {
                                    if(ingreso.pagos){
                                        ingreso.pagos.map( (pago) => {
                                            url = pago.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'ingresos/pagos/'+empresa.name+' I '+pago.id+' '+ingreso.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(ingreso.presupuestos){
                                        ingreso.presupuestos.map( (presupuesto) => {
                                            url = presupuesto.url
                                            const blobPromise = fetch(url).then(r => {
                                                if (r.status === 200) return r.blob()
                                                return Promise.reject(new Error(r.statusText))
                                            })
                                            const name = 'ingresos/presupuestos/'+empresa.name+' I '+presupuesto.id+' '+ingreso.id+url.substring(url.lastIndexOf('.'))
                                            empresaFolder.file(name, blobPromise)
                                        })
                                    }
                                    if(ingreso.facturas){
                                        ingreso.facturas.map( (factura) => {
                                            if(factura.xml){
                                                url = factura.xml.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'ingresos/facturas/'+empresa.name+' F '+factura.id+' '+ingreso.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                            if(factura.pdf){
                                                url = factura.pdf.url
                                                const blobPromise = fetch(url).then(r => {
                                                    if (r.status === 200) return r.blob()
                                                    return Promise.reject(new Error(r.statusText))
                                                })
                                                const name = 'ingresos/facturas/'+empresa.name+' F '+factura.id+' '+ingreso.id+url.substring(url.lastIndexOf('.'))
                                                empresaFolder.file(name, blobPromise)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        if(empresa.estados_de_cuenta){
                            empresa.cuenta.map( (cuenta) => {
                                cuenta.estados.map( (estado) => {
                                    url = estado.url
                                    const blobPromise = fetch(url).then(r => {
                                        if (r.status === 200) return r.blob()
                                        return Promise.reject(new Error(r.statusText))
                                    })
                                    const name = 'estados-cuentas/'+empresa.name+' EC '+estado.id+url.substring(url.lastIndexOf('.'))
                                    empresaFolder.file(name, blobPromise)
                                })
                            })
                        }
                    })
                    zip.generateAsync({type:"blob"})
                        .then((blob) => {saveAs(blob, 'contabilidad.zip'); swal.close()})
                        .catch(e => console.log(e));
                    
                }
                
                

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error ')
        })
    }

    render() {
        const { form, options } = this.state
        return (
            <Layout active={'reportes'}  {...this.props}>
                <Card className="m-2 p-2 m-md-4 p-md-4">
                    <Card.Body>
                        <ContabilidadForm form = { form } options = { options } onChangeEmpresa = { this.onChangeEmpresa } 
                            updateEmpresa = { this.updateEmpresa } onChange = { this.onChange } onSubmit = { this.onSubmit }/>
                            
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Contabilidad);