import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { EMPLEADOS_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS } from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { AdjuntosForm } from '../../../components/forms'
import { setOptions, setTextTable, setArrayTable, setAdjuntosList, setDateTable,setLabelTable } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, deleteAlert, doneAlert } from '../../../functions/alert'
import { Tabs, Tab } from 'react-bootstrap'
import TableForModals from '../../../components/tables/TableForModals'
import { EmpleadosCard } from '../../../components/cards'
const $ = require('jquery');

class Empleados extends Component {
    state = {
        formeditado: 0,
        key: 'administrativo',
        data: {
            adjuntos: []
        },
        adjuntos: [],
        modal: {
            delete: false,
            adjuntos: false,
            see: false,
        },
        title: 'Nuevo empleado',
        form: {
            nombre: '',
            curp: '',
            rfc: '',
            nss: '',
            nombre_emergencia: '',
            telefono_emergencia: '',
            banco: '',
            cuenta: '',
            clabe: '',
            tipo_empleado: 'Administrativo',
            estatus_empleado: 'Activo',
            empresa: '',
            fechaInicio: new Date(),
            fechaFin: '',
            estatus_imss: 'Activo',
            puesto: '',
            vacaciones_disponibles: 0,
            fecha_alta_imss: '',
            numero_alta_imss: '',
            nomina_imss: 0.0,
            nomina_extras: 0.0,
            salario_hr: 0.0,
            salario_hr_extra: 0.0,
            adjuntos: {
                datosGenerales: {
                    value: '',
                    placeholder: 'Datos generales',
                    files: []
                },
                recibosNomina: {
                    value: '',
                    placeholder: 'Recibos de Nómina',
                    files: []
                },
                altasBajas: {
                    value: '',
                    placeholder: 'Altas y bajas',
                    files: []
                }
            }
        },
        options: {
            empresas: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const empleados = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!empleados)
            history.push('/')
        // this.getOptionsAxios()
    }
    changePageEdit = empleado => {
        const { history } = this.props
        history.push({
            pathname: '/rh/empleados/edit',
            state: { empleado: empleado }
        });
    }
    openModalDelete = empleado => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            empleado: empleado
        })
    }
    openModalAdjuntos = empleado => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
        this.setState({
            ...this.state,
            modal,
            empleado: empleado,
            data,
            form: this.clearForm(),
            adjuntos: this.setAdjuntosTable(data.adjuntos)
        })
    }
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿Seguro deseas borrar el adjunto?', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }
    openModalSee = empleado => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            empleado: empleado
        })
    }
    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            empleado: ''
        })
    }
    handleCloseAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            empleado: ''
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            empleado: ''
        })
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/empleado/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
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
    async deleteEmpleadoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        await axios.delete(URL_DEV + 'rh/empleado/' + empleado.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal, key } = this.state
                if (key === 'administrativo') {
                    this.getEmpleadosAxios()
                }
                if (key === 'obra') {
                    this.getEmpleadosObraAxios()
                }
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    empleado: '',
                    form: this.clearForm()
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El empleado fue eliminado con éxito.')
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
    clearForm = () => {
        const { form, key } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        datosGenerales: {
                            value: '',
                            placeholder: 'Datos generales',
                            files: []
                        },
                        recibosNomina: {
                            value: '',
                            placeholder: 'Recibos de Nómina',
                            files: []
                        },
                        altasBajas: {
                            value: '',
                            placeholder: 'Altas y bajas',
                            files: []
                        }
                    }
                    break;
                case 'estatus_empleado':
                case 'estatus_imss':
                    form[element] = 'Activo'
                    break;
                case 'nomina_imss':
                case 'salario_hr':
                case 'salario_hr_extra':
                case 'vacaciones_tomadas':
                    form[element] = 0
                    break;
                case 'tipo_empleado':
                    if (key === 'obra')
                        form[element] = 'Obra'
                    else
                        form[element] = 'Administrativo'
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    setEmpleado = empleados => {
        let aux = []
        if (empleados)
            empleados.map((empleado) => {
                aux.push(
                    {
                        actions: this.setActions(empleado),
                        nombre: renderToString(setTextTable(empleado.nombre)),
                        empresa: renderToString(setTextTable(empleado.empresa ? empleado.empresa.name : '')),
                        puesto: renderToString(setTextTable(empleado.puesto)),
                        rfc: renderToString(setTextTable(empleado.rfc)),
                        nss: renderToString(setTextTable(empleado.nss)),
                        curp: renderToString(setTextTable(empleado.curp)),
                        estatus: renderToString(this.setLabel(empleado.estatus_empleado)),
                        fechaInicio: renderToString(setDateTable(empleado.fecha_inicio)),
                        cuenta: renderToString(setArrayTable(
                            [
                                { 'name': 'Banco', 'text': empleado.banco ? empleado.banco : 'Sin definir' },
                                { 'name': 'No. Cuenta', 'text': empleado.cuenta ? empleado.cuenta : 'Sin definir' },
                                { 'name': 'Clabe', 'text': empleado.clabe ? empleado.clabe : 'Sin definir' },
                            ]
                        )),
                        nombre_emergencia: renderToString(setArrayTable(
                            [
                                { 'name': 'Nombre', 'text': empleado.nombre_emergencia ? empleado.nombre_emergencia : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': empleado.telefono_emergencia ? empleado.telefono_emergencia : 'Sin definir' }
                            ]
                        )),
                        vacaciones_tomadas: renderToString(setTextTable(empleado.vacaciones_tomadas)),
                        id: empleado.id
                    }
                )
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
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        return aux
    }
    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                actions: this.setActionsAdjuntos(adjunto),
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                tipo: renderToString(setTextTable(adjunto.pivot.tipo)),
                id: 'adjuntos-' + adjunto.id
            })
            return false
        })
        return aux
    }
    setActionsAdjuntos = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAdjunto',
                tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
            })
        return aux
    }
    async getEmpleadosAxios() {
        $('#empleados_admin_table').DataTable().ajax.reload();
    }
    async getEmpleadosObraAxios() {
        $('#empleados_obra_table').DataTable().ajax.reload();
    }
    controlledTab = value => {
        const { form } = this.state
        if (value === 'administrativo') {
            this.getEmpleadosAxios()
        }
        if (value === 'obra') {
            this.getEmpleadosObraAxios()
            form.tipo_empleado = 'Obra'
        }
        this.setState({
            ...this.state,
            key: value,
            form
        })
    }
    async addAdjuntoEmpleadoAxios() {
        const { access_token } = this.props.authUser
        const { form, empleado } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        data.append('id', empleado.id)
        await axios.post(URL_DEV + 'rh/empleado/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleado } = response.data
                const { data, key } = this.state
                data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
                if (key === 'administrativo') {
                    this.getEmpleadosAxios()
                }
                if (key === 'obra') {
                    this.getEmpleadosObraAxios()
                }
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    empleado: empleado,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
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
    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        await axios.delete(URL_DEV + 'rh/empleado/' + empleado.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleado } = response.data
                const { data, key } = this.state
                data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
                if (key === 'administrativo') {
                    this.getEmpleadosAxios()
                }
                if (key === 'obra') {
                    this.getEmpleadosObraAxios()
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    empleado: empleado,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
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
            ...this.state,
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
            ...this.state,
            form
        })
    }
    render() {
        const { modal, form, key, adjuntos, data, empleado } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <Tabs defaultActiveKey="administrativo" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="administrativo" title="Administrativo">
                        <NewTableServerRender
                            columns={EMPLEADOS_COLUMNS}
                            title='Empleados administrativos'
                            subtitle='Listado de empleados'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url='/rh/empleados/add'
                            mostrar_acciones={true}
                            actions={
                                {
                                    'edit': { function: this.changePageEdit },
                                    'delete': { function: this.openModalDelete },
                                    'adjuntos': { function: this.openModalAdjuntos },
                                    'see': { function: this.openModalSee },
                                }
                            }
                            accessToken={this.props.authUser.access_token}
                            setter={this.setEmpleado}
                            urlRender={URL_DEV + 'rh/empleado/admin'}
                            idTable='empleados_admin_table'
                            cardTable='cardTable_admin'
                            cardTableHeader='cardTableHeader_admin'
                            cardBody='cardBody_admin'
                            isTab={true}
                        />
                    </Tab>
                    <Tab eventKey="obra" title="Obra">
                        <NewTableServerRender
                            columns={EMPLEADOS_COLUMNS}
                            title='Empleados de obra'
                            subtitle='Listado de empleados'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url='/rh/empleados/add'
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function: this.changePageEdit },
                                'delete': { function: this.openModalDelete },
                                'adjuntos': { function: this.openModalAdjuntos },
                                'see': { function: this.openModalSee },
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setEmpleado}
                            urlRender={URL_DEV + 'rh/empleado/obra'}
                            idTable='empleados_obra_table'
                            cardTable='cardTable_obra'
                            cardTableHeader='cardTableHeader_obra'
                            cardBody='cardBody_obra'
                            isTab={true}
                        />
                    </Tab>
                </Tabs>
                <ModalDelete title={'¿Quieres eliminar el empleado?'} show={modal.delete} handleClose={this.handleCloseModalDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEmpleadoAxios() }}>
                </ModalDelete>
                <Modal size="xl" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm
                        form={form}
                        onChangeAdjunto={this.onChangeAdjunto}
                        clearFiles={this.clearFiles}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoEmpleadoAxios() }}
                        adjuntos={['datosGenerales', 'recibosNomina', 'altasBajas']}
                    />
                    <TableForModals
                        columns={ADJUNTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={true}
                        actions={{
                            'deleteAdjunto': { function: this.openModalDeleteAdjuntos }
                        }}
                        dataID='adjuntos'
                        elements={data.adjuntos}
                    />
                </Modal>
                <Modal size="lg" title="Empleados" show={modal.see} handleClose={this.handleCloseSee} >
                    <EmpleadosCard empleado={empleado} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Empleados);