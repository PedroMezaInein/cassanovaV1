import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, PRESUPUESTO_COLUMNS } from '../../constants'
import { setOptions, setTextTable, setMoneyTable} from '../../functions/setters'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { PresupuestoForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../functions/alert'
const $ = require('jquery');

class Conceptos extends Component {

    state = {
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        title: 'Nuevo presupuesto',
        form: {
            proyecto: '',
            area: '',
            empresa: '',
            fecha: new Date(),            
            tiempo_ejecucion: '',
            partida: '',
            subpartida: '',
        },
        options: { 
            proyectos: [],
            empresas:[],
            areas: [],
            partidas: [],
            subpartidas: []
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

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ... this.state,
            modal,
            form: this.clearForm(),
            formeditado:0,
            title: 'Nuevo presupuesto',
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
        await axios.get(URL_DEV + 'presupuestos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close() 
                const { empresas, proyectos, areas, partidas} = response.data
                const { options} = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                this.setState({
                    ... this.state,
                    options
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

    handleCloseModal = () => {
        const { modal } = this.state 
        modal.form = false
        this.setState({
            ... this.state,
            modal, 
            form: this.clearForm()
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    form[element] = new Date()
                    break; 
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    async getNominasAxios(){
        var table = $('#kt_datatable2_presupuesto')
            .DataTable();
        table.ajax.reload();
    }

    render() {

        const { modal, title, form, options, formeditado} = this.state

        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <Modal size="xl" title={title} show={modal.form}  handleClose={this.handleCloseModal}>
                    <PresupuestoForm  
                        form={form} 
                        options={options} 
                        setOptions = { this.setOptions }
                        onChange={this.onChange} 
                        onSubmit = { this.onSubmit } 
                        formeditado={formeditado}
                    />
                </Modal>

                <NewTableServerRender columns={PRESUPUESTO_COLUMNS}
                    title='Presupuesto' subtitle='Listado de presupuestos'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={ this.openModal }
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    accessToken = { this.props.authUser.access_token }
                    // setter = {  }
                    urlRender = {URL_DEV + 'presupuesto'}
                    idTable = 'kt_datatable2_presupuesto'
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

export default connect(mapStateToProps, mapDispatchToProps)(Conceptos);