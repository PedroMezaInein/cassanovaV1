import React, { Component } from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import CuentaCard from '../../../components/cards/Bancos/CuentaCard';
import { Calendar, Button } from '../../../components/form-components';
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles';
import ItemSlider from '../../../components/singles/ItemSlider';
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import TableForModals from '../../../components/tables/TableForModals';
import { CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS, URL_DEV } from '../../../constants';
import { deleteAlert, doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import { setArrayTable, setDateTable, setListTable, setMoneyTable, setTextTable, setLabelTable } from '../../../functions/setters';
import axios from 'axios'
const $ = require('jquery');
class Cuenta extends Component {
    state = {
        key: 'bancos',
        keyEstados: 'listado',
        modal: {
            delete: false,
            see: false,
            estado: false
        },
        form: {
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: ''
                }
            },
            fecha: new Date()
        },
        data: {
            estados: []
        },
        estados: [],
        cuenta: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!modulo)
            history.push('/')
    }
    controlledTab = value => {
        if (value === 'bancos') {
            this.getBancosAxios()
        }
        if (value === 'cajas') {
            this.getCajasAxios()
        }
        this.setState({
            ...this.state,
            key: value
        })
    }
    controlledTabEstados = value => {
        const { form } = this.state
        if (value === 'nuevo') {
            form.adjuntos.adjuntos.files = []
            form.adjuntos.adjuntos.value = ''
            form.fecha = new Date()
        }
        this.setState({
            ...this.state,
            keyEstados: value,
            form
        })
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
                estatus: cuenta.estatus ? renderToString(this.setLabel(cuenta.estatus.estatus)) : '',
                empresa: renderToString(setListTable(cuenta.empresa, 'name')),
                principal: renderToString(setTextTable(cuenta ? cuenta.empresa_principal ? cuenta.empresa_principal.name : '' : '')),
                fecha: renderToString(setDateTable(cuenta.created_at)),
                id: cuenta.id
            })
            return false
        })
        return aux
    }
    setLabel = estatus => {
        let text = {}
        if (estatus === "Activo") {
            text.letra = '#388E3C'
            text.fondo = '#E8F5E9'
            text.estatus = 'Activo'
        } else {
            text.letra = '#F64E60'
            text.fondo = '#FFE2E5'
            text.estatus = 'Inactivo'
        }
        return setLabelTable(text)
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
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Agregar&nbsp;estado&nbsp;de&nbsp;cuenta',
                btnclass: 'info',
                iconclass: 'flaticon2-infographic',
                action: 'estado',
                tooltip: { id: 'estado', text: 'Agregar estados de cuenta', type: 'error' }
            }
        )
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
            return false
        })
        return aux
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
    onChangeCalendar = date => {
        const { form } = this.state
        form.fecha = date
        this.setState({
            ...this.state,
            form
        })
    }
    handleChange = (files, item) => {
        const { form } = this.state
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
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    async getBancosAxios() {
        $('#cuentas_bancos').DataTable().ajax.reload();
    }
    async getCajasAxios() {
        $('#cuentas_cajas').DataTable().ajax.reload();
    }
    changePageEdit = cuenta => {
        const { history } = this.props
        history.push({
            pathname: '/bancos/cuentas/edit',
            state: { cuenta: cuenta }
        });
    }
    openModalDelete = cuenta => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            cuenta: cuenta
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            cuenta: ''
        })
    }
    openModalSee = cuenta => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            cuenta: cuenta
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            cuenta: ''
        })
    }
    openModalEstado = cuenta => {
        const { modal, data } = this.state
        modal.estado = true
        data.estados = cuenta.estados
        this.setState({
            ...this.state,
            modal,
            cuenta: cuenta,
            data,
            estados: this.setEstados(cuenta.estados)
        })
    }
    handleCloseEstado = () => {
        const { modal, data } = this.state
        modal.estado = false
        data.estados = []
        this.setState({
            ...this.state,
            modal,
            cuenta: '',
            data,
            estados: []
        })
    }
    openModalDeleteEstado = estado => {
        deleteAlert('¿Deseas eliminar el estado de cuenta?', () => this.deleteEstadoCuentaAxios(estado))
    }
    async deleteCuentaAxios() {
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key, modal } = this.state
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    cuenta: ''
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
    async addEstadoAxios() {
        const { access_token } = this.props.authUser
        const { form, cuenta } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        data.append('id', cuenta.id)
        await axios.post(URL_DEV + 'cuentas/estado', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuenta } = response.data
                const { data, key, form } = this.state
                data.estados = cuenta.estados
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.value = ''
                form.fecha = new Date()
                this.setState({
                    ...this.state,
                    form,
                    cuenta: cuenta,
                    estados: this.setEstados(cuenta.estados),
                    data,
                    keyEstados: 'listado'
                })
                doneAlert('Adjunto creado con éxito')
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
    async deleteEstadoCuentaAxios(estado) {
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id + '/estado/' + estado.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
                    ...this.state,
                    data,
                    estados: this.setEstados(cuenta.estados)
                })
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
    render() {
        const { key, cuenta, modal, keyEstados, form, estados, data } = this.state
        return (
            <Layout active='bancos' {...this.props}>
                <Tabs defaultActiveKey='bancos' activeKey={key}
                    onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey='bancos' title='Banco'>
                        {
                            key === 'bancos' ?
                                <NewTableServerRender
                                    columns={CUENTAS_COLUMNS}
                                    title='Cuentas'
                                    subtitle='Listado de cuentas'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/bancos/cuentas/add?type=bancos'
                                    mostrar_acciones={true}
                                    actions={
                                        {
                                            'edit': { function: this.changePageEdit },
                                            'delete': { function: this.openModalDelete },
                                            'estado': { function: this.openModalEstado },
                                            'see': { function: this.openModalSee },
                                        }
                                    }
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setCuentas}
                                    urlRender={URL_DEV + 'cuentas/cuentas'}
                                    idTable='cuentas_bancos'
                                    cardTable='cardTable_bancos'
                                    cardTableHeader='cardTableHeader__bancos'
                                    cardBody='cardBody_bancos'
                                    isTab={true} />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey='cajas' title='Caja chica'>
                        {
                            key === 'cajas' ?
                                <NewTableServerRender
                                    columns={CUENTAS_COLUMNS}
                                    title='Cajas chicas'
                                    subtitle='Listado de cajas chicas'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/bancos/cuentas/add?type=cajas'
                                    mostrar_acciones={true}
                                    actions={
                                        {
                                            'edit': { function: this.changePageEdit },
                                            'delete': { function: this.openModalDelete },
                                            'estado': { function: this.openModalEstado },
                                            'see': { function: this.openModalSee },
                                        }}
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setCuentas}
                                    urlRender={URL_DEV + 'cuentas/cajas'}
                                    idTable='cuentas_cajas'
                                    cardTable='cardTable_caja'
                                    cardTableHeader='cardTableHeader_caja'
                                    cardBody='cardBody_caja'
                                    isTab={true} />
                                : ''
                        }
                    </Tab>
                </Tabs>
                <ModalDelete
                    title={cuenta === null ? "¿Estás seguro que deseas eliminar la cuenta " : "¿Estás seguro que deseas eliminar la cuenta " + cuenta.nombre + " ?"}
                    show={modal.delete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteCuentaAxios() }}
                />
                <Modal size='lg' title='Cuenta' show={modal.see} handleClose={this.handleCloseSee}>
                    <CuentaCard cuenta={cuenta} />
                </Modal>
                <Modal size="lg" title={cuenta === null ? "Estados de cuenta" : "Estados de cuenta para " + cuenta.nombre} show={modal.estado} handleClose={this.handleCloseEstado} >
                    <Tabs defaultActiveKey='listado' activeKey={keyEstados} onSelect={(value) => { this.controlledTabEstados(value) }} className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100">
                        <Tab eventKey='listado' title='Estados de cuenta'>
                            <TableForModals
                                columns={EDOS_CUENTAS_COLUMNS}
                                data={estados}
                                mostrar_acciones={true}
                                actions={
                                    {
                                        'deleteAction': { function: this.openModalDeleteEstado }
                                    }
                                }
                                elements={data.estados}
                                idTable='kt_datatable_estado'
                            />
                        </Tab>
                        <Tab eventKey='nuevo' title='Agregar estado de cuenta'>
                            <Form >
                                <div className="form-group row form-group-marginless pt-4 justify-content-center">
                                    <div className='col-md-6'>
                                        <Calendar
                                            onChangeCalendar={this.onChangeCalendar}
                                            placeholder='fecha'
                                            name='fecha'
                                            value={form.fecha} />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless justify-content-center">
                                    <div className='col-md-6'>
                                        <ItemSlider items={form.adjuntos.adjuntos.files} item='adjuntos'
                                            handleChange={this.handleChange} />
                                    </div>
                                </div>
                                {
                                    form.adjuntos.adjuntos.value ?
                                        <div className="card-footer py-3 pr-1">
                                            <div className="row">
                                                <div className="col-lg-12 text-right pr-0 pb-0">
                                                    <Button
                                                        icon=''
                                                        text='ENVIAR'
                                                        onClick={(e) => { e.preventDefault(); waitAlert(); this.addEstadoAxios() }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Cuenta);