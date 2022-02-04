import React, { Component } from 'react' 
import axios from 'axios'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout' 
import NewTable from '../../../components/tables/NewTable'
import { setSingleHeader } from '../../../functions/routers'
import { PAGO_IMPUESTOS_SINGLE_COLUMNS, URL_DEV } from '../../../constants'
import { errorAlert, waitAlert, printResponseErrorAlert } from '../../../functions/alert'
import { setTextTableCenter, setMoneyTable,setMoneyTableForNominas } from '../../../functions/setters'

class PagoImpuestoSingle extends Component {
    state = {  
        impuesto: '',
        impuestosData: [],
        totales: [],
        data:{
            impuestosData: []
        }
    }

    componentDidMount() { 
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match : { params: { id } } } = this.props
        const { history } = this.props
        const nominaadmin = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/single/' + id
        });
        
        if (!nominaadmin)
            history.push('/')

        const { state } = this.props.location
        if(state) {
            if(state.impuesto) {
                const { impuesto } = state
                this.getOnePagoImpuestosAxios(impuesto.id)
            }
        }
    }

    getOnePagoImpuestosAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/pago-impuestos/${id}`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { impuesto } = response.data
                const { data } = this.state

                data.impuestosData = impuesto
                this.setState({
                    impuesto: impuesto,
                    impuestosData: this.setPagoImpuestos(impuesto),
                    totales: this.setTotales(impuesto),
                    data
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setPagoImpuestos = nominas => {
        let aux = []
        nominas.map( (impuesto) => {
            aux.push(
                {
                    idEmpleado: renderToString(setTextTableCenter(impuesto.empleado ? impuesto.empleado.id : '')),
                    empleado: renderToString(setTextTableCenter(impuesto.empleado ? impuesto.empleado.nombre : '')),
                    imss: renderToString(setMoneyTable(impuesto.nomina_imss ? impuesto.nomina_imss: 0.0)),
                    rcv: renderToString(setMoneyTable(impuesto.restante_nomina ? impuesto.restante_nomina : 0.0)),
                    infonavit: renderToString(setMoneyTable(impuesto.extras ? impuesto.extras : 0.0)),
                    isn: renderToString(setMoneyTable(impuesto.extras + impuesto.restante_nomina + impuesto.nomina_imss)),
                    total: renderToString(setMoneyTable(impuesto.extras + impuesto.restante_nomina + impuesto.nomina_imss)),
                    id: impuesto.id
                }
            )
            return false
        })
        return aux
    }
    
    setTotales = impuesto => {
        return {
                totalImss: renderToString(setMoneyTableForNominas(impuesto.totalNominaImss)),
                totalRcv: renderToString(setMoneyTableForNominas(impuesto.totalRestanteNomina)),
                totalInfonavit: renderToString(setMoneyTableForNominas(impuesto.totalExtras)),
                totalIsn: renderToString(setMoneyTableForNominas(impuesto.totalExtras)),
                total: renderToString(setMoneyTableForNominas(impuesto.totalExtras + impuesto.totalRestanteNomina + impuesto.totalNominaImss)),
            }
    }
    
    render() {
        const { impuesto, impuestosData, data, totales } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                {
                    impuesto ? 
                        <NewTable 
                            columns = { PAGO_IMPUESTOS_SINGLE_COLUMNS } 
                            data = { impuestosData }
                            title = { impuesto.periodo } 
                            subtitle = 'Listado'
                            mostrar_boton = {false}
                            abrir_modal = {false}
                            mostrar_acciones = {false}
                            elements = { data.impuestosData }
                            totales = { totales }
                            idTable = 'kt_datatable2_pagos_impuestos'
                            cardTable='cardTable'
                            cardTableHeader='cardTableHeader'
                            cardBody='cardBody'
                            />
                    : ''
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(PagoImpuestoSingle);