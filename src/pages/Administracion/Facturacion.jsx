import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { IngresosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, FACTURAS_COLUMNS, GOLD } from '../../constants'
import { DataTable } from '../../components/tables'
import NewTable from '../../components/tables/NewTable'
import { Small, B, Subtitle } from '../../components/texts'
import { FileInput } from '../../components/form-components'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



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
                    folio: renderToString(this.setTextTable(factura.folio)),
                    serie: renderToString(this.setTextTable(factura.serie)),
                    noCertificado: renderToString(this.setTextTable(factura.numero_certificado)),
                    emisor: renderToString(this.setInfoTable(factura.rfc_emisor, factura.nombre_emisor)),
                    receptor: renderToString(this.setInfoTable(factura.rfc_receptor, factura.nombre_receptor)),
                    usoCFDI: renderToString(this.setTextTable(factura.uso_cfdi)),
                    expedicion: renderToString(this.setExpedicionTable(factura)),
                    subtotal: renderToString(this.setMoneyTable(factura.subtotal)),
                    total: renderToString(this.setMoneyTable(factura.total)),
                    adjuntos: renderToString(this.setAdjuntosTable(factura)),
                    fecha: renderToString(this.setDateTable(factura.created_at)),
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
                <br />
                <Small className="mr-1" >
                    <B color="gold">
                        Fecha:
                    </B>
                </Small>
                {
                    this.setDateTable(factura.fecha)
                }
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
        console.log(facturas, "-facturas")
        console.log(data)
        return (
            <Layout active={'administracion'}  {...this.props}>


                <NewTable columns={FACTURAS_COLUMNS} data={facturas}
                    title='Facturas' subtitle='Listado de facturas'
                    mostrar_boton={false}
                    abrir_modal={false}
                    mostrar_acciones={false}
                    elements={data.facturas}
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