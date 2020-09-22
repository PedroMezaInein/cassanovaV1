import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS } from '../../constants'
import { CuentaForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small } from '../../components/texts'
import NumberFormat from 'react-number-format';
import { Form, Tabs, Tab } from 'react-bootstrap'
import Calendar from '../../components/form-components/Calendar'
import TableForModals from '../../components/tables/TableForModals'
import { setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable } from '../../functions/setters'
import { errorAlert, forbiddenAccessAlert, waitAlert, doneAlert } from '../../functions/alert'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { CuentaCard } from '../../components/cards'
const $ = require('jquery');

class Cuentas extends Component {

    state = {
        modal: false,
        modalDelete: false,
        modalEstado: false,
        modalSee: false,
        bancos: [],
        tipos: [],
        estatus: [],
        estados: [],
        empresas: [],
        empresasOptions: [],
        tipo: 'Bancaria',
        form: {
            nombre: '',
            numero: '',
            descripcion: '',
            balance: 0.0,
            banco: '',
            tipo: '',
            estatus: '',
            empresa: 0,
            empresa_principal: '',
            empresas: []
        },
        data: {
            cuentas: []
        },
        formeditado: 0,
        cuentas: [],
        cajas: [],
        cuenta: null,
        adjunto: '',
        adjuntoFile: '',
        adjuntoName: '',
        fecha: new Date(),
        key: 'bancos'
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
        this.getOptionsAxios()
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

    onChangeEmpresa = e => {
        const { value } = e.target
        const { empresas, form } = this.state
        let auxEmpresa = form.empresas
        let aux = []
        empresas.find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxEmpresa.push(_aux)
            } else {
                aux.push(_aux)
            }
        })

        form['empresas'] = auxEmpresa
        this.setState({
            ... this.state,
            form,
            empresas: aux
        })
    }

    updateEmpresa = empresa => {
        const { form, empresas } = this.state
        let aux = []
        form.empresas.map((element, key) => {
            if (empresa.value.toString() !== element.value.toString()) {
                aux.push(element)
            } else {
                empresas.push(element)
            }
        })
        form.empresas = aux
        this.setState({
            ... this.state,
            empresas,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        this.addCuentaAxios()
    }

    onSubmitEstado = e => {
        e.preventDefault()
        const { adjunto } = this.state
        if (adjunto) {
            waitAlert()
            this.addEstadoAxios()
        }
    }

    onEditSubmit = e => {
        e.preventDefault()
        this.editCuentaAxios()
    }

    safeDelete = e => () => {
        this.deleteCuentaAxios()
    }

    onChangeAdjunto = (e) => {
        this.setState({
            ... this.state,
            adjuntoFile: e.target.files[0],
            adjunto: e.target.value,
            adjuntoName: e.target.files[0].name
        })
    }

    onChangeCalendar = date => {
        this.setState({
            ... this.state,
            fecha: date
        })
    }

    deleteAdjunto = () => {
        this.setState({
            ... this.state,
            adjuntoFile: '',
            adjunto: '',
            adjuntoName: ''
        })
    }

    setEmptyForm = () => {
        return {
            nombre: '',
            numero: '',
            descripcion: '',
            empresa: '',
            balance: 0.0,
            banco: 0,
            tipo: 0,
            estatus: 0,
            empresa: 0,
            empresa_principal: 0,
            empresas: []
        }
    }

    setCuentas = cuentas => {
        let aux = []
        cuentas.map((cuenta, key) => {
            aux.push({
                actions: this.setActions(cuenta),
                nombre: renderToString(setTextTable(cuenta.nombre)),
                numero: renderToString(setTextTable(cuenta.numero)),
                balance: renderToString(setMoneyTable(cuenta.balance)),
                descripcion: renderToString(setTextTable(cuenta.descripcion)),
                banco: renderToString(setTextTable(cuenta.banco ? cuenta.banco.nombre : '')),
                tipo: renderToString(setTextTable(cuenta.tipo ? cuenta.tipo.tipo : '')),
                estatus: renderToString(setTextTable(cuenta.estatus ? cuenta.estatus.estatus : '')),
                empresa: renderToString(setListTable(cuenta.empresa, 'name')),
                fecha: renderToString(setDateTable(cuenta.created_at)),
                id: cuenta.id
            })
        })
        return aux
    }

    setEstados = estados => {
        let aux = []
        estados.map((estado, key) => {
            aux.push({
                actions: this.setActionsEstado(estado),
                estado: renderToString(setArrayTable([{ url: estado.url, text: estado.name }])),
                fecha: renderToString(setDateTable(estado.created_at)),
                id: estado.id
            })
        })
        this.setState({
            ... this.state,
            estados: aux
        })
    }

    setEmpresasTable = arreglo => {
        let aux = []
        arreglo.map((element) => {
            aux.push({ text: element.name })
        })
        setArrayTable(aux)
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

    setActionsEstado = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAction',
                tooltip: { id: 'deleteEstado', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }

    openModalDeleteEstado = (estado) => {
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
                this.deleteEstadoAxios(estado.id)
            }
        })
    }

    setText = text => {
        return (
            <Small className="">
                {text}
            </Small>
        )
    }

    setMoney = value => {
        return (
            <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'$'}
                renderText={value => <Small> {value} </Small>} />
        )
    }

    setLinks = value => {
        return (
            <a href={value.url} target="_blank">
                <Small>
                    {
                        value.name
                    }
                </Small>
            </a>
        )
    }

    openModalSee = cuenta => {
        this.setState({
            ... this.state,
            modalSee: true,
            cuenta: cuenta
        })
    }

    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            cuenta: ''
        })
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
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Agregar&nbsp;estado&nbsp;de&nbsp;cuenta',
                btnclass: 'primary',
                iconclass: 'flaticon2-infographic',
                action: 'estado',
                tooltip: { id: 'estado', text: 'Agregar estados de cuenta', type: 'error' }
            },
            {
                text: 'Ver',
                btnclass: 'info',
                iconclass: 'flaticon2-expand',                  
                action: 'see',
                tooltip: {id:'see', text:'Mostrar', type:'info'},
            },
        )
        return aux
    }

    setOptions = (array, name) => {
        const { form } = this.state
        let aux = []
        array.map((element, key) => {
            if (key === 0) {
                switch (name) {
                    case 'nombre':
                        form['banco'] = element.id
                        break;
                    default:
                        form[name] = element.id
                        break;
                }
                this.setState({
                    ... this.state,
                    form
                })
            }
            aux.push({
                value: element.id,
                text: element[name]
            })
        })
        return aux
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal,
            cuenta: null,
            form: this.setEmptyForm()
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            modalDelete: !modalDelete,
            cuenta: null
        })
    }

    handleEstadoClose = () => {
        const { modalEstado } = this.state
        this.setState({
            modalEstado: !modalEstado,
            cuenta: null,
            estados: [],
            fecha: new Date(),
            adjunto: '',
            adjuntoFile: '',
            adjuntoName: ''
        })
    }

    openModal = () => {
        const { empresasOptions } = this.state
        let aux = []
        empresasOptions.map((option) => {
            aux.push(option)
        })
        this.setState({
            modal: true,
            cuenta: null,
            form: this.setEmptyForm(),
            empresas: aux,
            empresas2: aux,
            formeditado: 0,
            tipo: 'Bancaria'
        })
    }

    openModalCajaChica = () => {
        const { empresasOptions } = this.state
        let aux = []
        empresasOptions.map((option) => {
            aux.push(option)
        })
        this.setState({
            modal: true,
            cuenta: null,
            form: this.setEmptyForm(),
            empresas: aux,
            formeditado: 0,
            tipo: 'Caja chica'
        })
    }

    openModalEdit = cuenta => {
        const { empresasOptions } = this.state

        let empresaFormAux = []
        cuenta.empresa.map((empresa, key) => {
            empresaFormAux.push({ value: empresa.id, text: empresa.name })
        })

        let empresaOptionsAux = []
        let empresaOptionsAux2 = []

        empresasOptions.map((option) => {
            let aux = true
            cuenta.empresa.map((empresa) => {
                if (empresa.id.toString() === option.value.toString()) {
                    aux = false
                }
            })
            empresaOptionsAux2.push(option)
            if (aux)
                empresaOptionsAux.push(option)
        })

        let aux = {
            nombre: cuenta.nombre,
            numero: cuenta.numero,
            descripcion: cuenta.descripcion,
            balance: cuenta.balance,
            banco: cuenta.banco ? cuenta.banco.id : 0,
            tipo: cuenta.tipo ? cuenta.tipo.id : 0,
            estatus: cuenta.estatus ? cuenta.estatus.id : 0,
            empresa: 0,
            empresas: empresaFormAux,
            empresa_principal: cuenta.empresa_principal ? cuenta.empresa_principal.id : 0
        }

        this.setState({
            modal: true,
            cuenta: cuenta,
            form: aux,
            empresas: empresaOptionsAux,
            empresas2: empresaOptionsAux2,
            formeditado: 1,
            tipo: 'Bancaria'
        })
    }

    openModalEditCajaChica = cuenta => {
        const { empresasOptions } = this.state

        let empresaFormAux = []
        cuenta.empresa.map((empresa, key) => {
            empresaFormAux.push({ value: empresa.id, text: empresa.name })
        })

        let empresaOptionsAux = []

        empresasOptions.map((option) => {
            let aux = true
            cuenta.empresa.map((empresa) => {
                if (empresa.id.toString() === option.value.toString()) {
                    aux = false
                }
            })
            if (aux)
                empresaOptionsAux.push(option)
        })

        let aux = {
            nombre: cuenta.nombre,
            numero: cuenta.numero,
            descripcion: cuenta.descripcion,
            balance: cuenta.balance,
            banco: cuenta.banco ? cuenta.banco.id : 0,
            tipo: cuenta.tipo ? cuenta.tipo.id : 0,
            estatus: cuenta.estatus ? cuenta.estatus.id : 0,
            empresa: 0,
            empresas: empresaFormAux
        }

        this.setState({
            modal: true,
            cuenta: cuenta,
            form: aux,
            empresas: empresaOptionsAux,
            formeditado: 1,
            tipo: 'Caja chica'
        })
    }

    openModalAddEstado = cuenta => {
        const { data } = this.state
        data.estados = cuenta ? cuenta.estados : []

        this.setState({
            modalEstado: true,
            cuenta: cuenta,
            data,
            estados: [],
            formeditado: 0
        })

        this.setEstados(cuenta ? cuenta.estados : [])
    }

    openModalDelete = cuenta => {
        this.setState({
            modalDelete: true,
            cuenta: cuenta
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { bancos, estatus, tipo, empresas } = response.data
                let aux = []
                bancos.map((banco) => {
                    if (banco.nombre !== 'CAJA CHICA')
                        aux.push(banco)
                })

                this.setState({
                    ... this.state,
                    bancos: this.setOptions(aux, 'nombre'),
                    estatus: this.setOptions(estatus, 'estatus'),
                    tipos: this.setOptions(tipo, 'tipo'),
                    empresas: this.setOptions(empresas, 'name'),
                    empresasOptions: this.setOptions(empresas, 'name')
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

    async addCuentaAxios() {
        const { access_token } = this.props.authUser
        let { form } = this.state
        const { tipo } = this.state
        form.tipoBanco = tipo
        await axios.post(URL_DEV + 'cuentas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuentas } = response.data
                const { data, key } = this.state
                data.cuentas = cuentas

                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }

                this.setState({
                    modal: false,
                    form: this.setEmptyForm()
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Cuenta agregada con éxito.')
                
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

    async addEstadoAxios() {
        const { access_token } = this.props.authUser
        const { fecha, adjuntoName, adjuntoFile, cuenta } = this.state
        const data = new FormData();
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('id', cuenta.id)
        data.append('fecha', (new Date(fecha)).toDateString())
        await axios.post(URL_DEV + 'cuentas/estado', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuenta } = response.data
                const { data, key } = this.state
                data.estados = cuenta.estados

                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }

                this.setState({
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    fecha: new Date(),
                    data
                })
                this.setEstados(cuenta.estados)
                swal.close()
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

    async editCuentaAxios() {
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.put(URL_DEV + 'cuentas/' + cuenta.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { key } = this.state
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }

                this.setState({
                    modal: false,
                    form: this.setEmptyForm(),
                    cuenta: null
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Cuenta editada con éxito.')
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

    async deleteCuentaAxios() {
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { key } = this.state

                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }

                this.setState({
                    modalDelete: false,
                    cuenta: null,
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Cuenta eliminada con éxito.')

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

    async deleteEstadoAxios(id) {
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id + '/estado/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuenta } = response.data
                const { data, key } = this.state
                data.estados = cuenta.estados

                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }

                this.setState({
                    ... this.state,
                    data
                })
                this.setEstados(cuenta.estados)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Estado de cuenta eliminado con éxito.')
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

    async getBancosAxios() {
        $('#cuentas_bancos').DataTable().ajax.reload();
    }

    async getCajasAxios() {
        $('#cuentas_cajas').DataTable().ajax.reload();
    }

    controlledTab = value => {
        if (value === 'bancos') {
            this.getBancosAxios()
        }
        if (value === 'cajas') {
            this.getCajasAxios()
        }
        this.setState({
            ... this.state,
            key: value
        })
    }

    render() {
        const { modal, modalDelete, modalEstado, bancos, estatus, tipos, key, form, modalSee, cuenta, empresas, empresas2, estados, adjunto, adjuntoName, fecha, data, formeditado, tipo, cajas } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>

                <Tabs defaultActiveKey="bancos" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="bancos" title="Banco">
                        <NewTableServerRender
                            columns={CUENTAS_COLUMNS}
                            title='Cuentas'
                            subtitle='Listado de cuentas'
                            mostrar_boton={true}
                            abrir_modal={true}
                            onClick={this.openModal}
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function: this.openModalEdit },
                                'delete': { function: this.openModalDelete },
                                'estado': { function: this.openModalAddEstado },
                                'see': { function: this.openModalSee },
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setCuentas}
                            urlRender={URL_DEV + 'cuentas/cuentas'}
                            idTable='cuentas_bancos'
                            elementClass='estatus'
                            cardTable='cardTable_bancos'
                            cardTableHeader='cardTableHeader__bancos'
                            cardBody='cardBody_bancos'
                            isTab={true}
                        />
                    </Tab>
                    <Tab eventKey="cajas" title="Caja chica">
                        <NewTableServerRender
                            columns={CUENTAS_COLUMNS}
                            title='Cajas chicas'
                            subtitle='Listado de cajas chicas'
                            mostrar_boton={true}
                            abrir_modal={true}
                            onClick={this.openModalCajaChica}
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function: this.openModalEditCajaChica },
                                'delete': { function: this.openModalDelete },
                                'estado': { function: this.openModalAddEstado },
                                'see': { function: this.openModalSee },
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setCuentas}
                            urlRender={URL_DEV + 'cuentas/cajas'}
                            idTable='cuentas_cajas'
                            elementClass='estatus'
                            cardTable='cardTable_caja'
                            cardTableHeader='cardTableHeader_caja'
                            cardBody='cardBody_caja'
                            isTab={true}
                        />
                    </Tab>
                </Tabs>


                <Modal size="xl" title={cuenta === null ? "Nueva cuenta" : 'Editar cuenta'} show={modal} handleClose={this.handleClose} >
                    <CuentaForm
                        tipo={tipo}
                        bancos={bancos}
                        estatus={estatus}
                        tipos={tipos}
                        empresas={empresas}
                        empresas2={empresas2}
                        form={form}
                        onChange={this.onChange}
                        onChangeEmpresa={this.onChangeEmpresa}
                        updateEmpresa={this.updateEmpresa}
                        onSubmit={cuenta === null ? this.onSubmit : this.onEditSubmit}
                        formeditado={formeditado}
                    />
                </Modal>
                <Modal size="xl" title={cuenta === null ? "¿Estás seguro que deseas eliminar la cuenta " : "¿Estás seguro que deseas eliminar la cuenta " + cuenta.nombre + " ?"} show={modalDelete} handleClose={this.handleDeleteModal} >
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleDeleteModal} text="CANCELAR" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                        <Button icon='' onClick={(e) => { this.safeDelete(e)() }} text="CONTINUAR" className={"btn btn-danger font-weight-bold mr-2"} />
                    </div>
                </Modal>
                <Modal size="xl" title={cuenta === null ? "Estados de cuenta para" : "Estados de cuenta para " + cuenta.nombre} show={modalEstado} handleClose={this.handleEstadoClose} >

                    <Form onSubmit={this.onSubmitEstado} >
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-4">
                                <Calendar
                                    onChangeCalendar={this.onChangeCalendar}
                                    placeholder="Fecha"
                                    name="fecha"
                                    value={fecha}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label ">Adjunto de estado de cuenta</label>
                                <div className="col-md-6 px-2">
                                    <div className="d-flex align-items-center">
                                        <div className="image-upload d-flex align-items-center">
                                            <div className="no-label">
                                                <input
                                                    onChange={this.onChangeAdjunto}
                                                    value={adjunto}
                                                    name="adjunto"
                                                    type="file"
                                                    id="adjunto"
                                                    accept="application/pdf" />
                                            </div>
                                            {
                                                adjuntoName &&
                                                <div className="">
                                                    <div className="tagify form-control p-1" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                                        <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                            <div
                                                                title="Borrar archivo"
                                                                className="tagify__tag__removeBtn"
                                                                role="button"
                                                                aria-label="remove tag"
                                                                onClick={(e) => { e.preventDefault(); this.deleteAdjunto() }}
                                                            >
                                                            </div>
                                                            <div><span className="tagify__tag-text p-1 white-space">{adjuntoName}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12 text-center">
                                {
                                    adjuntoName &&
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Button className="ml-4" type="submit" text="ENVIAR" />
                                    </div>
                                }
                            </div>
                        </div>
                    </Form>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    {estados.length > 0 &&
                        <TableForModals
                            columns={EDOS_CUENTAS_COLUMNS}
                            data={estados}
                            mostrar_acciones={true}
                            actions={{
                                'deleteAction': { function: this.openModalDeleteEstado }
                            }}
                            elements={data.estados}
                            idTable='kt_datatable_estado'
                        />
                    }
                </Modal>

                <Modal size="lg" title="Cuenta" show = { modalSee } handleClose = { this.handleCloseSee } >
                    <CuentaCard cuenta={cuenta}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cuentas);