import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { IngresosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, FACTURAS_COLUMNS, GOLD } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, B, Subtitle } from '../../components/texts'
import { FileInput } from '../../components/form-components'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Facturacion extends Component{

    state = {
        facturas: []
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const facturas = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!facturas)
            history.push('/')
        this.getFacturas()
    }

    setFactura = facturas => {
        let aux = []
        facturas.map( (factura) => {
            aux.push(
                {
                    folio: this.setTextTable(factura.folio),
                    serie: this.setTextTable(factura.serie),
                    noCertificado: this.setTextTable(factura.numero_certificado),
                    emisor: this.setInfoTable(factura.rfc_emisor, factura.nombre_emisor),
                    receptor: this.setInfoTable(factura.rfc_receptor, factura.nombre_receptor),
                    usoCFDI: this.setTextTable(factura.uso_cfdi),
                    expedicion: this.setExpedicionTable(factura),
                    subtotal:this.setMoneyTable(factura.subtotal),
                    total: this.setMoneyTable(factura.total),
                    adjuntos: this.setAdjuntosTable(factura),
                    fecha: this.setDateTable(factura.created_at)
                }
            )
        })
        return aux
    }

    setDateTable = date => {
        return(
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    setExpedicionTable = factura => {
        return(
            <div>
                <Small className = "mr-1" >
                    <B color = "gold">
                        Lugar: 
                    </B>
                </Small>
                <Small>
                    {factura.lugar_expedicion}
                </Small>
                <br />
                <Small className = "mr-1" >
                    <B color = "gold">
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
        return(
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
        return(
            <div>
                <Small className = "mr-1" >
                    <B color = "gold">
                        RFC: 
                    </B>
                </Small>
                <Small>
                    {rfc}
                </Small>
                <br />
                <Small className = "mr-1" >
                    <B color = "gold">
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
        return(
            <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                    renderText = { value => <Small> { value } </Small> } />
        )
    }

    setTextTable = text => {
        return(
            <Small>
                {text}
            </Small>
        )
    }

    async getFacturas(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { facturas } = response.data
                this.setState({
                    facturas: this.setFactura(facturas)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    render(){
        const { facturas } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                
                <DataTable columns = { FACTURAS_COLUMNS } data = { facturas } />
                
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Facturacion);