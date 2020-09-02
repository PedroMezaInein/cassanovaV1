import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, FACTURAS_COLUMNS} from '../../constants'
import NewTable from '../../components/tables/NewTable'
import { Small, B } from '../../components/texts'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { setTextTable, setMoneyTable, setDateTable } from '../../functions/setters'
import { errorAlert, forbiddenAccessAlert, createAlert, doneAlert } from '../../functions/alert'


const $ = require('jquery');

class Facturacion extends Component {

    state = {
        facturas: [],
        data: {
            facturas: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        let aux = pathname.substr(1, pathname.length-1)
        const facturas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!facturas)
            history.push('/')
        this.getFacturas()
    }

    setFactura = facturas => {
        let aux = []
        facturas.map((factura) => {
            aux.push(
                {
                    actions: this.setActions(factura),
                    folio: renderToString(setTextTable(factura.folio)),
                    estatus: renderToString(this.setLabelTable(factura)),
                    fecha: renderToString(setDateTable(factura.fecha)),
                    serie: renderToString(setTextTable(factura.serie)),
                    emisor: renderToString(this.setInfoTable(factura.rfc_emisor, factura.nombre_emisor)),
                    receptor: renderToString(this.setInfoTable(factura.rfc_receptor, factura.nombre_receptor)),
                    subtotal: renderToString(setMoneyTable(factura.subtotal)),
                    total: renderToString(setMoneyTable(factura.total)),
                    acumulado: renderToString(setMoneyTable(factura.ventas_count + factura.ingresos_count)),
                    restante: renderToString(setMoneyTable(factura.total - factura.ventas_count - factura.ingresos_count)),
                    adjuntos: renderToString(this.setAdjuntosTable(factura)),
                    descripcion: renderToString(setTextTable(factura.descripcion)),
                    noCertificado: renderToString(setTextTable(factura.numero_certificado)),
                    usoCFDI: renderToString(setTextTable(factura.uso_cfdi)),
                    id: factura.id,
                    objeto: factura
                }
            )
        })
        return aux
    }

    setActions = factura => {
        
        let aux = []

        if(!factura.cancelada){
            aux.push(
                {
                    text: 'Cancelar',
                    btnclass: 'danger',
                    iconclass: "flaticon-circle",
                    action: 'cancelarFactura',
                    tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
                })
        }

        return aux
    }

    setLabelTable = objeto => {
        let restante = objeto.total - objeto.ventas_count - objeto.ingresos_count
        let text = {}
        if(objeto.cancelada){
            text.letra = '#8950FC'
            text.fondo = '#EEE5FF'
            text.estatus = 'CANCELADA'
        }else{
            if(restante <= 1){
                text.letra = '#388E3C'
                text.fondo = '#E8F5E9'
                text.estatus = 'PAGADA'
            }else{
                text.letra = '#F64E60'
                text.fondo = '#FFE2E5'
                text.estatus = 'PENDIENTE'
            }
        }
            
        return(
            <>
                <div class="d-none">
                    {text.estatus}
                </div>
                <span className="label label-lg bg- label-inline font-weight-bold py-2" style={{
                    color: `${text.letra}`,
                    backgroundColor: `${text.fondo}`,
                    fontSize:"11.7px"
                    }} >
                    {text.estatus}
                </span>
            </>
        )
    }
    

    setAdjuntosTable = factura => {
        return (
            <div>
                {
                    factura.xml ?
                        <a href={factura.xml.url} target="_blank">
                            <Small>
                                factura.xml
                            </Small>
                        </a>
                        : ''
                }
                <br />
                {
                    factura.pdf ?
                        <a href={factura.pdf.url} target="_blank">
                            <Small>
                                factura.pdf
                            </Small>
                        </a>
                        : ''
                }
            </div>
        )
    }

    setInfoTable = (rfc, nombre) => {
        return (
            <div>
                <Small className="mr-1" >
                    <B color="gold">
                        RFC:
                    </B>
                </Small>
                <Small>
                    {rfc}
                </Small>
                <br />
                <Small className="mr-1" >
                    <B color="gold">
                        Nombre:
                    </B>
                </Small>
                <Small>
                    {nombre}
                </Small>
            </div>
        )
    }

    cancelarFactura = (factura) => {
        createAlert('¿Deseas cancelar la factura?', '', () => this.cancelarFacturaAxios(factura))
    }

    async cancelarFacturaAxios(factura){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'facturas/cancelar/'+factura.id, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
                })
                doneAlert('Factura cancelada con éxito')
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

    async getFacturas() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturas, facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
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

    render() {
        const { facturas, data } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <NewTable 
                    columns = { FACTURAS_COLUMNS } 
                    data = { facturas }
                    title = 'Facturas' 
                    subtitle = 'Listado de facturas'
                    mostrar_boton = { false }
                    abrir_modal = { false }
                    mostrar_acciones = { true }
                    elements = { data.facturas }
                    tipo_validacion = 'facturas'
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                    idTable = 'facturas-table'
                    actions={{
                        'cancelarFactura': { function: this.cancelarFactura }
                    }}
                    />

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

export default connect(mapStateToProps, mapDispatchToProps)(Facturacion);