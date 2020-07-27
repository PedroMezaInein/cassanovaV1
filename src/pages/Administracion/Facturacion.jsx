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
import { setTextTable, setMoneyTable} from '../../functions/setters'

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
                    folio: renderToString(setTextTable(factura.folio)),
                    serie: renderToString(setTextTable(factura.serie)),
                    noCertificado: renderToString(setTextTable(factura.descripcion)),
                    emisor: renderToString(this.setInfoTable(factura.rfc_emisor, factura.nombre_emisor)),
                    receptor: renderToString(this.setInfoTable(factura.rfc_receptor, factura.nombre_receptor)),
                    usoCFDI: renderToString(setTextTable(factura.uso_cfdi)),
                    subtotal: renderToString(setMoneyTable(factura.subtotal)),
                    total: renderToString(setMoneyTable(factura.total)),
                    acumulado: renderToString(setMoneyTable(factura.ventas_count + factura.ingresos_count)),
                    restante: renderToString(setMoneyTable(factura.total - factura.ventas_count - factura.ingresos_count)),
                    adjuntos: renderToString(this.setAdjuntosTable(factura)),
                    fecha: renderToString(this.setDateTable(factura.fecha)),
                    id: factura.id
                }
            )
        })
        return aux
    }

    setDateTable = date => {
        return (
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    setExpedicionTable = factura => {
        return (
            <div>
                <Small className="mr-1" >
                    <B color="gold">
                        Lugar:
                    </B>
                </Small>
                <Small>
                    {factura.lugar_expedicion}
                </Small>
            </div>
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

    setMoneyTable = value => {
        return (
            <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'$'}
                renderText={value => <Small> {value} </Small>} />
        )
    }

    setTextTable = text => {
        return (
            <Small>
                {text}
            </Small>
        )
    }

    async getFacturas() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturas, facturasVentas } = response.data
                data.facturas = facturas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    render() {
        const { facturas, data } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <NewTable columns={FACTURAS_COLUMNS} data={facturas}
                    title='Facturas' subtitle='Listado de facturas'
                    mostrar_boton={false}
                    abrir_modal={false}
                    mostrar_acciones={false}
                    elements={data.facturas}
                    elementClass = 'restante'
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