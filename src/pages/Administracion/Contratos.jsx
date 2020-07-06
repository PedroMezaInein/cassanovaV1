// React
import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { renderToString } from 'react-dom/server'

// Funciones
import { waitAlert, errorAlert, forbiddenAccessAlert, validateAlert } from '../../functions/alert'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList, setContactoTable } from '../../functions/setters'
// Components
import Layout from '../../components/layout/layout'
import { Tabs, Tab, Form } from 'react-bootstrap'
import NewTable from '../../components/tables/NewTable'
import { CONTRATOS_PROVEEDORES_COLUMNS, CONTRATOS_CLIENTES_COLUMNS, URL_DEV, ADJ_CONTRATOS_COLUMNS } from '../../constants'
import { Modal, ModalDelete } from '../../components/singles'
import { Subtitle } from '../../components/texts'
import ContratoForm from '../../components/forms/administracion/ContratoForm'
import { Button } from '../../components/form-components'
import FileInput from '../../components/form-components/FileInput'
import TableForModals from '../../components/tables/TableForModals'

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
            },
            adjuntos:[]            
        },
        formeditado:0,
        adjuntos:[],
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
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
            nombre: '',
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
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
        console.log(form)
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
        let aux = []
        if(contrato.adjuntos)
            contrato.adjuntos.map( (adj) => {
                aux.push(
                    {
                        name: adj.name, url: adj.url
                    }
                )
            })
        
        form.adjuntos.adjunto.files = aux
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

    handleCloseModal = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Cliente',
            adjuntos: [],
            contrato: ''
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

    openModalAdjuntos = contrato => {
        const { modal, data, adjuntos, form} = this.state
        modal.adjuntos = true   
        data.adjuntos = contrato.adjuntos
        this.setState({
            ... this.state,
            modal,
            data,
            adjuntos: this.setAdjuntos(contrato.adjuntos),
            contrato: contrato
        })
    }

    handleCloseAdjuntos = () =>{
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ... this.state,
            modal,
            adjuntos: []
        })
    }

    setAdjuntos = adjuntos =>{
        let aux = []
        adjuntos.map((documento) => {
            aux.push({
                actions: this.setActionsAdjuntos(documento),
                adjunto: renderToString(setArrayTable([{text: documento.name, url: documento.url}])),
                id: documento.id
            }) 
        })
        return aux
    }

    onSubmitAdjuntos = e => {
        e.preventDefault()
        waitAlert()
        this.addAdjuntoContratoAxios()
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

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
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
                case 'adjuntosEliminados':
                    form[element] = []
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto:{
                            value: '',
                            placeholder: 'Adjunto(s)',
                            files: []
                        }
                    }
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
                pendiente: renderToString(setMoneyTable(contrato.monto - contrato.acumulado)),
                contrato: contrato.tipo_contrato ? renderToString((setTextTable(contrato.tipo_contrato.tipo))) : '',
                descripcion: renderToString(setTextTable(contrato.descripcion)),
                empresa: contrato.empresa ? renderToString(setTextTable(contrato.empresa.name)) : '',
                id: contrato.id
            })
        })
        return aux
    }
    setActionsAdjuntos = documento => { 
        let aux = []
        aux.push(
            
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAdjunto',
                tooltip: { id: 'deleteAdjunto', text: 'Eliminar', type: 'error' }
            } 
        )
        return aux
    } 
    
    openModalDeleteAdjunto = (adjunto) => {
        swal({
            title: '¿Estás seguro?',
            icon: 'warning',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__green btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__red btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                this.deleteAdjuntoContratoAxios(adjunto.id)                
            }            
        })
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
            },
            {
                text: 'Adjuntos',
                btnclass: 'primary',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
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
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'contratos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
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

    async addAdjuntoContratoAxios(){
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        await axios.post(URL_DEV + 'contratos/' + contrato.id +'/adjunto/', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { contratosClientes, contratosProveedores, contrato } = response.data
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
                data.adjuntos = contrato.adjuntos

                modal.form = false
                
                this.setState({
                    ... this.state,
                    data,
                    contratos,
                    modal,
                    adjuntos: this.setAdjuntos(contrato.adjuntos)
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
        console.log(form)
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

    async deleteAdjuntoContratoAxios(adjunto){
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
        await axios.delete(URL_DEV + 'contratos/' + contrato.id +'/adjunto/' + adjunto, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { contratosClientes, contratosProveedores, contrato } = response.data
                const { data, contratos, modal } = this.state

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

                swal.close()

                data.contratos.proveedores = contratosProveedores
                contratos.proveedores = this.setContratos(contratosProveedores, 'Proveedor')
                data.contratos.clientes = contratosClientes
                contratos.clientes = this.setContratos(contratosClientes, 'Cliente')
                
                this.setState({
                    ... this.state,
                    data,
                    contratos,
                    contrato: '',
                    modal,
                    adjuntos: this.setAdjuntos(contrato.adjuntos)
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
        const { data, contratos, title, options, form, modal, tipo, formeditado, adjuntos} = this.state
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
                                    'adjuntos': {function: this.openModalAdjuntos},
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
                                    'adjuntos': {function: this.openModalAdjuntos},
                                }}
                                elements = { data.contratos.proveedores }
                                idTable = 'kt_datatable_proveedor'
                                />
                        </div>
                    </Tab>
                </Tabs>
                <Modal title = { title } show = { modal.form } handleClose = { this.handleCloseModal }>
                    <ContratoForm tipo = { tipo } options = { options } form = { form } onChange = { this.onChange } 
                        onSubmit = { this.onSubmit } formeditado={formeditado} onChangeAdjunto = { this.onChangeAdjunto } 
                        clearFiles = { this.clearFiles } title = {title} />
                </Modal>
                <ModalDelete title={tipo === 'Cliente' ? '¿Quieres eliminar el contrato de cliente?' : '¿Quieres eliminar el contrato de proveedor?'} show = { modal.delete } handleClose = { this.handleCloseModalDelete } onClick=  { (e) => { e.preventDefault(); waitAlert(); this.deleteContratoAxios() }}>
                </ModalDelete>
                <Modal title = 'Adjuntos del contrato' show = { modal.adjuntos } handleClose = { this.handleCloseModal }>
                    <Form id="form-adjuntos"
                        onSubmit = { 
                            (e) => {
                                e.preventDefault(); 
                                validateAlert(this.onSubmitAdjuntos, e, 'form-adjuntos')
                            }
                        }
                        >
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-6">
                                <FileInput
                                    requirevalidation={0}
                                    onChangeAdjunto={this.onChangeAdjunto}
                                    placeholder={form.adjuntos.adjunto.placeholder}
                                    value={form.adjuntos.adjunto.value}
                                    name='adjunto' 
                                    id='adjunto'
                                    accept="image/*, application/pdf"
                                    files={form.adjuntos.adjunto.files}
                                    deleteAdjunto={this.clearFiles} 
                                    multiple 
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    </Form>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    
                        <TableForModals 
                            columns={ADJ_CONTRATOS_COLUMNS} 
                            data={adjuntos} 
                            mostrar_acciones={true}
                            actions={{
                                'deleteAdjunto': { function: this.openModalDeleteAdjunto}
                            }}
                            elements={data.adjuntos}
                            idTable = 'kt_datatable_estado'
                        />
                </Modal>
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