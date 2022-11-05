import React, { Component } from 'react' 
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout' 
import NewTable from '../../../components/tables/NewTable';
import { NOMINA_ADMIN_SINGLE_COLUMNS, URL_DEV } from '../../../constants';
import { renderToString } from 'react-dom/server';
import { setTextTableCenter, setMoneyTable,setMoneyTableForNominas } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert } from '../../../functions/alert'
import axios from 'axios'
import { setSingleHeader } from '../../../functions/routers'
import Swal from 'sweetalert2';

class NominaAdminSingle extends Component {
    state = {  
        nomina: '',
        nominaData: [],
        totales: [],
        data:{
            nominaData: []
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
            if(state.nomina) {
                const { nomina } = state
                this.getOneNominaAdminAxios(nomina.id)
            }
        }
    }

    getOneNominaAdminAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/nomina-administrativa/${id}`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { nomina } = response.data
                const { data } = this.state
                data.nominaData = nomina
                this.setState({
                    nomina: nomina,
                    nominaData: this.setNominasAdministrativas(nomina.nominas_administrativas),
                    totales: this.setTotales(nomina),
                    data
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setNominasAdministrativas = nominas => {
        let aux = []
        nominas.map( (nomina) => {
            aux.push(
                {
                    idEmpleado: renderToString(setTextTableCenter(nomina.empleado ? nomina.empleado.id : '')),
                    empleado: renderToString(setTextTableCenter(nomina.empleado ? nomina.empleado.nombre : '')),
                    nominaIMSS: renderToString(setMoneyTable(nomina.nomina_imss ? nomina.nomina_imss: 0.0)),
                    extraImss: renderToString(setMoneyTable(nomina.extra_imss ? nomina.extra_imss : 0.0)),
                    extras: renderToString(setMoneyTable(nomina.restante_nomina ? nomina.restante_nomina : 0.0)),
                    viaticos: renderToString(setMoneyTable(nomina.extras ? nomina.extras : 0.0)),
                    total: renderToString(setMoneyTable(nomina.extras + nomina.restante_nomina + nomina.nomina_imss)),
                    id: nomina.id
                }
            )
            return false
        })
        return aux
    }

    setTotales = nomina => {
        console.log(nomina)
        return {
                totalNominaImss: renderToString(setMoneyTableForNominas(nomina.totalNominaImss)),
                totalExtrasImss: renderToString(setMoneyTableForNominas(nomina.totalExtrasImss)),
                totalRestanteNomina: renderToString(setMoneyTableForNominas(nomina.totalRestanteNomina)),
                totalExtras: renderToString(setMoneyTableForNominas(nomina.totalExtras)),
                total: renderToString(setMoneyTableForNominas(nomina.totalExtras + nomina.totalRestanteNomina + nomina.totalNominaImss)),
            }
    }

    setSubtitle = nomina => {
        let aux = ''
        if(nomina.empresa)
            aux = aux + nomina.empresa.name + ' '
        aux = aux + nomina.periodo + ' '
        let fecha_inicio = new Date(nomina.fecha_inicio)
        let fecha_fin = new Date(nomina.fecha_fin)
        let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        let days = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', 
            '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        fecha_inicio = days[fecha_inicio.getDate()]  + "/" + months[fecha_inicio.getMonth()] + "/" + fecha_inicio.getFullYear()
        fecha_fin = days[fecha_fin.getDate()]  + "/" + months[fecha_fin.getMonth()] + "/" + fecha_fin.getFullYear()
        aux = aux + fecha_inicio + ' ' + fecha_fin
        return aux
    }
    
    render() {
        const { nomina, nominaData, data, totales } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                {
                    nomina ? 
                        <NewTable 
                            columns = { NOMINA_ADMIN_SINGLE_COLUMNS } 
                            data = { nominaData }
                            title = { nomina.periodo } 
                            subtitle = { this.setSubtitle(nomina) }
                            mostrar_boton = {false}
                            abrir_modal = {false}
                            mostrar_acciones = {false}
                            elements = { data.nominaData }
                            totales = { totales }
                            idTable = 'kt_datatable2_nomina_admin'
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

export default connect(mapStateToProps, mapDispatchToProps)(NominaAdminSingle);