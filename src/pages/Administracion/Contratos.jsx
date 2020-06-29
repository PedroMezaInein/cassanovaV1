// React
import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { renderToString } from 'react-dom/server'

// Funciones
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList, setContactoTable } from '../../functions/setters'
// Components
import Layout from '../../components/layout/layout'
import { Tabs, Tab } from 'react-bootstrap'
import NewTable from '../../components/tables/NewTable'
import { CONTRATOS_PROVEEDORES_COLUMNS, CONTRATOS_CLIENTES_COLUMNS, URL_DEV } from '../../constants'
import { Modal, ModalDelete } from '../../components/singles'
import { Subtitle } from '../../components/texts'
import ContratoForm from '../../components/forms/administracion/ContratoForm'


class Contratos extends Component {

    state = {
        contratos:{
            clientes: [],
            proveedores: []
        },
        data:{
            clientes: [],
            contratos:{
                clientes: [],
                proveedores: []
            }
        },
        formeditado:0,
        modal:{
            form: false,
            delete: false
        },
        options:{
            empresas: [],
            clientes: [],
            proveedores: [],
            tiposContratos: []
        },
        form:{
            cliente: '',
            proveedor: '',
            empresa: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            monto: '',
            tipoContrato: '',
            descripcion: '',
            tipo: 'cliente',
            nombre: ''
        },
        title:'Nuevo contrato de cliente',
        tipo: 'Cliente',
        contrato: '',
        clientes: []
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const contratos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!contratos)
            history.push('/')
        this.getContratosAxios()
    }

    openModalCliente = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Cliente',
            title: 'Nuevo contrato de cliente',
            formeditado:0
        })
    }

    openModalEditCliente = contrato => {
        const { modal, form } = this.state
        if(contrato.empresa){
            form.empresa = contrato.empresa.id.toString()
        }
        if(contrato.cliente){
            form.cliente = contrato.cliente.id.toString()
        }
        form.fechaInicio = new Date(contrato.fecha_inicio)
        form.fechaFin = new Date(contrato.fecha_fin)
        form.descripcion = contrato.descripcion
        if(contrato.tipo_contrato)
            form.tipoContrato = contrato.tipo_contrato.id.toString()
        form.monto = contrato.monto
        form.nombre = contrato.nombre
        modal.form = true
        this.setState({
            ... this.state,
            modal,
            tipo: 'Cliente',
            title: 'Editar contrato de cliente',
            contrato: contrato,
            form,
            formeditado:1
        })
    }

    openModalEditProveedor = contrato => {
        const { modal, form } = this.state
        if(contrato.empresa){
            form.empresa = contrato.empresa.id.toString()
        }
        if(contrato.proveedor){
            form.proveedor = contrato.proveedor.id.toString()
        }
        form.fechaInicio = new Date(contrato.fecha_inicio)
        form.fechaFin = new Date(contrato.fecha_fin)
        form.descripcion = contrato.descripcion
        if(contrato.tipo_contrato)
            form.tipoContrato = contrato.tipo_contrato.id.toString()
        form.monto = contrato.monto
        form.nombre = contrato.nombre
        modal.form = true
        this.setState({
            ... this.state,
            form, 
            modal,
            tipo: 'Proveedor',
            title: 'Editar contrato de proveedor',
            contrato: contrato,
            formeditado:1
        })
    }

    openModalDeleteCliente = contrato => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            tipo: 'Cliente',
            contrato: contrato
        })
    }

    openModalDeleteProveedor = contrato => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            tipo: 'Proveedor',
            contrato: contrato
        })
    }

    openModalProveedor = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Proveedor',
            title: 'Nuevo contrato de proveedor',
            formeditado:0
        })
    }

    handleCloseModal = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Cliente'
        })
    }

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Cliente',
            contrato: ''
        })
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

    setContratos = (contratos, tipo) => {
        let aux = []
        contratos.map((contrato) => {
            aux.push({
                actions: this.setActions(contrato, tipo),
                nombre: renderToString(setTextTable(contrato.nombre)),
                cliente: tipo === 'Cliente' && contrato.cliente ? renderToString(setTextTable(contrato.cliente.empresa)) : '',
                proveedor: tipo === 'Proveedor' && contrato.proveedor ? renderToString(setTextTable(contrato.proveedor.razon_social)) : '',

                fechaInicio: renderToString(setDateTable(contrato.fecha_inicio)),
                fechaFin: renderToString(setDateTable(contrato.fecha_fin)),
                monto: renderToString(setMoneyTable(contrato.monto)),
                acumulado: renderToString(setMoneyTable(contrato.acumulado)),
                contrato: contrato.tipo_contrato ? renderToString((setTextTable(contrato.tipo_contrato.tipo))) : '',
                descripcion: renderToString(setTextTable(contrato.descripcion)),
                empresa: contrato.empresa ? renderToString(setTextTable(contrato.empresa.name)) : '',
                id: contrato.id
            })
        })
        return aux
    }

    setActions = (contrato, tipo) => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: tipo === 'Cliente' ? 'editCliente' : 'editProveedor',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: tipo === 'Cliente' ? 'deleteCliente' : 'deleteProveedor',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }

    onSubmit = e => {
        e.preventDefault()
        const { title, tipo, form } = this.state
        if(tipo === 'Cliente'){
            form.tipo = 'cliente'
        }
        if(tipo === 'Proveedor'){
            form.tipo = 'proveedor'
        }
        this.setState({
            ... this.state,
            form
        })
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        let aux = title.split(' ');
        if(aux.length){
            if(aux[0] === 'Editar'){
                this.updateContratoAxios()
            }else{
                this.addContratoAxios()
            }
        }
    }

    async getContratosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'contratos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { contratosClientes, contratosProveedores, empresas, 
                    clientes, proveedores, tiposContratos } = response.data
                const { data, contratos, options } = this.state

                options.empresas = setOptions(empresas, 'name', 'id')
                options.proveedores = setOptions(proveedores, 'razon_social', 'id')
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.tiposContratos = setOptions(tiposContratos, 'tipo', 'id')
                
                data.contratos.proveedores = contratosProveedores
                contratos.proveedores = this.setContratos(contratosProveedores, 'Proveedor')
                data.contratos.clientes = contratosClientes
                contratos.clientes = this.setContratos(contratosClientes, 'Cliente')
                
                this.setState({
                    ... this.state,
                    data,
                    contratos,
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

    async addContratoAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'contratos', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { contratosClientes, contratosProveedores } = response.data
                const { data, contratos, modal } = this.state

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

                data.contratos.proveedores = contratosProveedores
                contratos.proveedores = this.setContratos(contratosProveedores, 'Proveedor')
                data.contratos.clientes = contratosClientes
                contratos.clientes = this.setContratos(contratosClientes, 'Cliente')

                modal.form = false
                
                this.setState({
                    ... this.state,
                    data,
                    contratos,
                    modal
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

    async updateContratoAxios(){
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
        await axios.put(URL_DEV + 'contratos/' + contrato.id, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { contratosClientes, contratosProveedores } = response.data
                const { data, contratos, modal } = this.state

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

                modal.form = false

                data.contratos.proveedores = contratosProveedores
                contratos.proveedores = this.setContratos(contratosProveedores, 'Proveedor')
                data.contratos.clientes = contratosClientes
                contratos.clientes = this.setContratos(contratosClientes, 'Cliente')
                
                this.setState({
                    ... this.state,
                    data,
                    contratos,
                    contrato: ''
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

    async deleteContratoAxios(){
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
        await axios.delete(URL_DEV + 'contratos/' + contrato.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { contratosClientes, contratosProveedores } = response.data
                const { data, contratos, modal } = this.state

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

                modal.delete = false

                data.contratos.proveedores = contratosProveedores
                contratos.proveedores = this.setContratos(contratosProveedores, 'Proveedor')
                data.contratos.clientes = contratosClientes
                contratos.clientes = this.setContratos(contratosClientes, 'Cliente')
                
                this.setState({
                    ... this.state,
                    data,
                    contratos,
                    contrato: '',
                    modal
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
        const { data, contratos, title, options, form, modal, tipo, formeditado } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>

                <Tabs defaultActiveKey="cliente">
                    <Tab eventKey="cliente" title="Cliente">
                        <div className="py-2">
                            <NewTable
                                columns = { CONTRATOS_CLIENTES_COLUMNS } 
                                data = { contratos.clientes }
                                title = 'Contratos de clientes' 
                                subtitle = 'Listado de contratos de clientes'
                                mostrar_boton = { true }
                                abrir_modal = { true }
                                mostrar_acciones = { true }
                                onClick = { this.openModalCliente }
                                actions = {{
                                    'editCliente': {function: this.openModalEditCliente},
                                    'deleteCliente': {function: this.openModalDeleteCliente},
                                    'editProveedor': {function: this.openModalEditProveedor},
                                    'deleteProveedor': {function: this.openModalDeleteProveedor},
                                }}
                                elements = { data.contratos.clientes }
                                idTable = 'kt_datatable_cliente'
                                />
                        </div>
                    </Tab>
                    <Tab eventKey="proveedor" title="Proveedor">
                        <div className="py-2">
                            <NewTable
                                columns = { CONTRATOS_PROVEEDORES_COLUMNS } 
                                data = { contratos.proveedores }
                                title = 'Contratos de proveedores' 
                                subtitle = 'Listado de contratos de proveedores'
                                mostrar_boton = { true }
                                abrir_modal = { true }
                                mostrar_acciones = { true }
                                onClick = { this.openModalProveedor }
                                actions = {{
                                    'editCliente': {function: this.openModalEditCliente},
                                    'deleteCliente': {function: this.openModalDeleteCliente},
                                    'editProveedor': {function: this.openModalEditProveedor},
                                    'deleteProveedor': {function: this.openModalDeleteProveedor},
                                }}
                                elements = { data.contratos.proveedores }
                                idTable = 'kt_datatable_proveedor'
                                />
                        </div>
                    </Tab>
                </Tabs>
                <Modal title = { title } show = { modal.form } handleClose = { this.handleCloseModal }>
                    <ContratoForm tipo = { tipo } options = { options } form = { form } onChange = { this.onChange } 
                        onSubmit = { this.onSubmit } formeditado={formeditado}/>
                </Modal>
                <ModalDelete show = { modal.delete } handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteContratoAxios() }}>
                    <Subtitle className="my-3 text-center">
                        {
                            tipo === 'Cliente' ? 
                                '¿Estás seguro que deseas eliminar el contrato de cliente?'
                            :
                                '¿Estás seguro que deseas eliminar el contrato de proveedor?'
                        }
                        
                    </Subtitle>
                </ModalDelete>
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

export default connect(mapStateToProps, mapDispatchToProps)(Contratos);