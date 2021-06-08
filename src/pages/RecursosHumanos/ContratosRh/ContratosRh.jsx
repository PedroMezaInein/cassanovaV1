import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { Tabs, Tab } from 'react-bootstrap'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { CONTRATOS_RRHH_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS_URL } from '../../../constants'
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert, validateAlert } from '../../../functions/alert'
import { setDateTable, setAdjuntoTable, setTextTableCenter } from '../../../functions/setters'
import { setSingleHeader } from '../../../functions/routers'
import TableForModals from '../../../components/tables/TableForModals'
import { Modal } from '../../../components/singles'
import { AdjuntosForm } from '../../../components/forms'
import $ from "jquery";
class ContratosRh extends Component {
    state = { 
        key: 'administrativo',
        contrato:'',
        modal: {
            adjuntos: false,
        },
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            periodo: '',
            dias: '',
            periodo_pago:'',
            ubicacion_obra:'',
            pagos_hr_extra:'',
            total_obra:'',
            dias_laborables:'',
            adjuntos: {
                contrato: {
                    value: '',
                    placeholder: 'Adjuntar contrato firmado',
                    files: []
                },
                carta: {
                    value: '',
                    placeholder: 'Adjuntar carta firmada',
                    files: []
                }
            }
        },
        adjuntos: [],
        data: {
            adjuntos: []
        },
        tipo: 'administrativo',
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const contratos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!contratos)
            history.push('/')
    }

    setContratos = contratos => {
        let aux = []
        contratos.forEach((contrato) => {
            aux.push({
                actions: this.setActions(contrato),
                empleado:renderToString(setTextTableCenter(contrato.empleado.nombre)),
                periodo: renderToString(setTextTableCenter(contrato.indefinido === 1 ? 'Tiempo indefinido' : `${contrato.dias} días`)),
                fecha_inicio: renderToString(setDateTable(contrato.fecha_inicio)),
                fecha_fin: renderToString(setDateTable(contrato.fecha_fin)),
                estatus: renderToString(setTextTableCenter(contrato.terminado ? 'Terminado' : 'En curso')),
                id: contrato.id
            })
        })
        return aux
    }

    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Terminar',
                btnclass: 'danger',
                iconclass: 'fa-times-circle',
                action: 'terminar',
                tooltip: { id: 'delete', text: 'Terminar', type: 'error' },
            },
            {
                text: 'Renovar',
                btnclass: 'info',
                iconclass: 'fas fa-check',
                action: 'renovar',
                tooltip: { id: 'renovar', text: 'Renovar' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'warning',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos' }
            }
        )
        return aux
    }
    controlledTab = value => {
        if (value === 'administrativo') { this.getContratosAdminAxios() }
        if (value === 'obra') { this.getContratosObraAxios() }
        this.setState({ ...this.state, key: value })
    }
    async getContratosAdminAxios() {
        $('#contratos_admin_table').DataTable().ajax.reload();
    }
    async getContratosObraAxios() {
        $('#contratos_obra_table').DataTable().ajax.reload();
    }
    cancelarContrato = element => {
        deleteAlert('¿DESEAS TERMINAR EL CONTRATO?', '', () => this.cancelarContratoAxios(element.id), 'SI, TERMINAR')
    }
    async cancelarContratoAxios(element) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/empleados/${element.empleado.id}/contratos/${element}/terminar`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { empleado } = response.data
                const { key } = this.state
                if (key === 'administrativo') { this.getContratosAdminAxios() }
                if (key === 'obra') { this.getContratosObraAxios() }
                this.setState({...this.state, empleado: empleado})
                doneAlert(response.data.message !== undefined ? response.data.message : 'Contrato terminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    openModalAdjuntos = contrato => {
        const { modal, data } = this.state
        modal.adjuntos = true
        let aux = [];
        if (contrato.contrato) {
            aux.push({
                name: 'CONTRATO GENERADO',
                url: contrato.contrato
            })
        }
        if (contrato.contrato_firmado) {
            aux.push({
                name: 'CONTRATO FIRMADO',
                url: contrato.contrato_firmado
            })
        }
        if (contrato.carta) {
            aux.push({
                name: 'CARTA GENERADA',
                url: contrato.carta
            })
        }
        if (contrato.carta_firmada) {
            aux.push({
                name: 'CARTA FIRMADA',
                url: contrato.carta_firmada
            })
        }
        data.adjuntos = aux
        this.setState({
            ...this.state,
            modal,
            contrato: contrato,
            data,
            form: this.clearForm(),
            adjuntos: this.setAdjuntosTable(data.adjuntos)
        })
    }

    handleCloseModalAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            contrato: ''
        })
    }
    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                url: renderToString(setAdjuntoTable(adjunto))
            })
            return false
        })
        return aux
    }
    async addAdjuntoContrato() {
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
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
        data.append('id', contrato.id)
        await axios.post(URL_DEV + 'rh/empleado/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contrato } = response.data
                const { data, key } = this.state
                if (key === 'administrativo') { this.getContratosAdminAxios() }
                if (key === 'obra') { this.getContratosObraAxios() }
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    contrato: contrato,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        contrato: {
                            value: '',
                            placeholder: 'Adjuntar contrato firmado',
                            files: []
                        },
                        carta: {
                            value: '',
                            placeholder: 'Adjuntar carta firmada',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
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
    
    changePageRenovar = contrato => {
        const { history } = this.props
        history.push({
            pathname: '/rh/contratos-rrhh/renovar',
            state: { contrato: contrato, tipo:'administrativo'}

        });
    }
    changePageEditObra = contrato => {
        const { history } = this.props
        history.push({
            pathname: '/rh/contratos-rrhh/renovar',
            state: { contrato: contrato, tipo:'obra'}
        });
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
        this.setState({ ...this.state, form })
    }
    render() {
        const { access_token } = this.props.authUser
        const { key, modal, form, adjuntos, data } = this.state

        return (
            <Layout active = 'rh' { ...this.props } >
                <Tabs defaultActiveKey="administrativo" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="administrativo" title="Administrativo">
                        <NewTableServerRender columns = { CONTRATOS_RRHH_COLUMNS } title = 'Contratos' subtitle = 'Listado de contratos' mostrar_boton = { true } url='/rh/contratos-rrhh/add?tipo=administrativo'
                            abrir_modal = { false } mostrar_acciones = { true } urlRender = { `${URL_DEV}v1/rh/contratos-rrhh` } accessToken = { access_token }
                            actions = {{ 
                                'terminar': { function: this.cancelarContrato },
                                'renovar': { function: this.changePageRenovar },
                                'adjuntos': { function: this.openModalAdjuntos }
                            }}
                            setter = { this.setContratos } 
                            idTable = 'contratos_admin_table'  cardTable = 'cardTable_admin' cardTableHeader = 'cardTableHeader_admin'
                            cardBody = 'cardBody_admin'  isTab = { true } 
                        />
                    </Tab>
                    <Tab eventKey="obra" title="Obra">
                        <NewTableServerRender columns = { CONTRATOS_RRHH_COLUMNS } title = 'Contratos' subtitle = 'Listado de contratos' mostrar_boton = { true } url='/rh/contratos-rrhh/add?tipo=obra'
                            abrir_modal = { false } mostrar_acciones = { true } urlRender = { `${URL_DEV}v1/rh/contratos-rrhh` } accessToken = { access_token }
                            actions = {{
                                'terminar': { function: this.cancelarContrato },
                                'renovar': { function: this.changePageEditObra },
                                'adjuntos': { function: this.openModalAdjuntos }
                            }}
                            setter = { this.setContratos } 
                            idTable = 'contratos_obra_table' cardTable = 'cardTable_obra' cardTableHeader = 'cardTableHeader_obra' cardBody = 'cardBody_obra'  isTab = { true } 
                        />
                    </Tab>
                </Tabs>
                <Modal size="lg" title='Adjuntos del contrato' show={modal.adjuntos} handleClose={this.handleCloseModalAdjuntos}>
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = { this.clearFiles }
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoContrato() }}
                        adjuntos={['contrato', 'carta']} />
                    <div className="separator separator-dashed separator-border-2 mb-6 mt-7"></div>
                    <TableForModals columns = { ADJUNTOS_COLUMNS_URL } data = { adjuntos } hideSelector = { true } mostrar_acciones = { false } dataID = 'adjuntos' elements = { data.adjuntos }/>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(ContratosRh);