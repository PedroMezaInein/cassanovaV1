import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../../components/layout/layout' 
import { ModalDelete} from '../../../components/singles' 
import { PRESUPUESTO_DISEÑO_COLUMNS, URL_DEV} from '../../../constants'
import { setOptions, setDateTable, setMoneyTable, setTextTable } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { renderToString } from 'react-dom/server'

const $ = require('jquery');

class PresupuestoDiseño extends Component {
    state = {  
        formeditado:0,
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nuevo presupuesto de diseño',
        form:{
            periodo : '',
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
        },
        options: {
            empresas: [],
            precios:[],
            esquemas:[]
        }
    }

    componentDidMount() { 
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!presupuesto)
            history.push('/')
            this.getOptionsAxios()
    }

    changeEditPage = presupuesto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto-diseño/edit',
            state: { presupuesto: presupuesto }
        });
    }

    openModalDelete = presupuesto => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            presupuesto: presupuesto
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos-diseño/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { esquemas, empresas, precios} = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['esquemas'] = setOptions(esquemas, 'nombre', 'id')
                options['precios'] = setOptions(precios, 'm2', 'id')

                this.setState({
                    ... this.state,
                    options,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deletePresupuestoAdminAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, presupuesto} = this.state
        
        await axios.delete(URL_DEV + '/presupuesto/presupuesto-diseño' + presupuesto.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                const { presupuesto } = response.data
                this.getPresupuestoAxios()

                modal.delete = false

                this.setState({                    
                    ... this.state,
                    modal,
                    presupuesto: '',
                    form: this.clearForm()
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La presupuesto fue eliminada con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
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

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal, 
            presupuesto: ''
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break; 
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    setPresupuestos = presupuestos => {
        let aux = []
        if(presupuestos)
            presupuestos.map( (presupuesto) => {
                aux.push(
                    {
                        actions: this.setActions(presupuesto),
                        proyecto: renderToString(setTextTable( presupuesto.proyecto ? presupuesto.proyecto.nombre : '')),
                        empresa: renderToString(setTextTable( presupuesto.empresa ? presupuesto.empresa.name : '')),
                        area: renderToString(setTextTable( presupuesto.area ? presupuesto.area.nombre : '')),
                        fecha: renderToString(setDateTable(presupuesto.fecha)),
                        id: presupuesto.id,
                    }
                )
            })
        return aux
    }

    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',                  
                action: 'delete',
                tooltip: {id:'delete', text:'Eliminar', type:'error'},
            }
        )
        return aux
    }

    async getPresupuestoAxios(){
        var table = $('#kt_datatable2_presupuesto_diseño')
            .DataTable();
        table.ajax.reload();
    }
    
    render() {
        const { modal } = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                <NewTableServerRender   
                    columns = { PRESUPUESTO_DISEÑO_COLUMNS }
                    title = 'Presupuesto de diseño' subtitle = 'Listado de presupuestos'
                    mostrar_boton={true}
                    abrir_modal={false} 
                    url = '/presupuesto/presupuesto-diseño/add'
                    mostrar_acciones={true} 
                    actions={{
                        'edit': { function: this.changeEditPage },
                        'delete': {function: this.openModalDelete}
                    }}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setPresupuestos }
                    urlRender = {URL_DEV + 'rh/nomina-administrativa'} /// Falta cambiar aqui
                    idTable = 'kt_datatable2_presupuesto_diseño'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete title={'¿Desea eliminar el presupuesto?'} show = { modal.delete } handleClose = { this.handleCloseModalDelete } onClick=  { (e) => { e.preventDefault(); waitAlert(); this.deletePresupuestoAdminAxios() }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestoDiseño);