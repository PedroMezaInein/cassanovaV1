import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { Tabs, Tab, Form } from 'react-bootstrap'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { CONTRATOS_RRHH_COLUMNS, URL_DEV, ADJ_CONTRATOS_COLUMNS } from '../../../constants'
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert, validateAlert } from '../../../functions/alert'
import { setArrayTable } from '../../../functions/setters'
import { setSingleHeader } from '../../../functions/routers'
import FileInput from '../../../components/form-components/FileInput'
import { onChangeAdjunto } from '../../../functions/onChanges'
import { Button } from '../../../components/form-components'
import TableForModals from '../../../components/tables/TableForModals'
import { Modal } from '../../../components/singles'

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
                    placeholder: 'Contrato',
                    files: []
                }
            }
        },
        adjuntos: [],
        data: {
            adjuntos: []
        },
        tipo: 'Administrativo',
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
        contratos.forEach((contrato, key) => {
            aux.push({
                actions: this.setActions(contrato),
                empleado: contrato.empleado.nombre,
                periodo: contrato.indefinido === 1 ? 'Tiempo indefinido' : `${contrato.dias} días`,
                fecha_inicio: '-',
                fecha_fin: '-',
                estatus: contrato.terminado ? 'Terminado' : 'En curso',
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
                text: 'Regenerar',
                btnclass: 'success',
                iconclass: 'flaticon2-refresh-button',
                action: 'regenerar',
                tooltip: { id: 'regenerar', text: 'Regenerar' },
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
        this.setState({
            ...this.state,
            modal,
            data,
            // adjuntos: this.setAdjuntos(contrato),
            contrato: contrato
        })
    }
    handleCloseModalAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Cliente',
            adjuntos: [],
            contrato: ''
        })
    }
    setAdjuntos = contrato => {
        console.log(contrato)
        let aux = []
        contrato.map((documento) => {
            aux.push({
                actions: this.setActionsAdjuntos(documento),
                // adjunto: renderToString(setArrayTable([{ text: documento.name, url: documento.contrato }])),
                adjunto: renderToString(setArrayTable(
                    [
                        { name: 'GENERADO', text: documento.contrato ? documento.contrato : '' },
                        { name: 'FIRMADO', text: documento.contrato_firmado ? documento.contrato_firmado : '' }
                    ],'200px'
                )),
                id: documento.id
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
                tooltip: { id: 'deleteAdjunto', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }
    onSubmitAdjuntos = e => {
        e.preventDefault()
        waitAlert()
        this.addAdjuntoContratoAxios()
    }
    async addAdjuntoContratoAxios() {
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
        })
        await axios.post(URL_DEV + 'contratos/' + contrato.id + '/adjunto/', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                // const { contrato } = response.data
                const { data, modal, key } = this.state
                if (key === 'administrativo') { this.getContratosAdminAxios() }
                if (key === 'obra') { this.getContratosObraAxios() }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
                // data.adjuntos = contrato.adjuntos
                modal.form = false
                this.setState({
                    ...this.state,
                    data,
                    modal,
                    // adjuntos: this.setAdjuntos(contrato.adjuntos)
                })
            }, (error) => {
                printResponseErrorAlert(error)
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
    
    changePageRenovar = contrato => {
        const { history } = this.props
        history.push({
            pathname: '/rh/contratos-rrhh/renovar',
            state: { contrato: contrato, tipo:'Administrativo'}

        });
    }
    changePageEditObra = contrato => {
        const { history } = this.props
        history.push({
            pathname: '/rh/contratos-rrhh/renovar',
            state: { contrato: contrato, tipo:'Obra'}
        });
    }
    render() {
        const { access_token } = this.props.authUser
        const { key, modal, form, adjuntos, data } = this.state

        return (
            <Layout active = 'rh' { ...this.props } >
                <Tabs defaultActiveKey="administrativo" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="administrativo" title="Administrativo">
                        <NewTableServerRender columns = { CONTRATOS_RRHH_COLUMNS } title = 'Contratos' subtitle = 'Listado de contratos' mostrar_boton = { true } url='/rh/contratos-rrhh/add?tipo=Administrativo'
                            abrir_modal = { false } mostrar_acciones = { true } urlRender = { `${URL_DEV}v1/rh/contratos-rrhh` } accessToken = { access_token }
                            actions = {{ 
                                'terminar': { function: this.cancelarContrato },
                                'renovar': { function: this.changePageRenovar },
                                'regenerar': { function: this.openModalSee },
                                'adjuntos': { function: this.openModalAdjuntos }
                            }}
                            setter = { this.setContratos } 
                            idTable = 'contratos_admin_table'  cardTable = 'cardTable_admin' cardTableHeader = 'cardTableHeader_admin'
                            cardBody = 'cardBody_admin'  isTab = { true } 
                        />
                    </Tab>
                    <Tab eventKey="obra" title="Obra">
                        <NewTableServerRender columns = { CONTRATOS_RRHH_COLUMNS } title = 'Contratos' subtitle = 'Listado de contratos' mostrar_boton = { true } url='/rh/contratos-rrhh/add?tipo=Obra'
                            abrir_modal = { false } mostrar_acciones = { true } urlRender = { `${URL_DEV}v1/rh/contratos-rrhh` } accessToken = { access_token }
                            actions = {{
                                'terminar': { function: this.cancelarContrato },
                                'renovar': { function: this.changePageEditObra },
                                'regenerar': { function: this.openModalSee },
                                'adjuntos': { function: this.openModalAdjuntos }
                            }}
                            setter = { this.setContratos } 
                            idTable = 'contratos_obra_table' cardTable = 'cardTable_obra' cardTableHeader = 'cardTableHeader_obra' cardBody = 'cardBody_obra'  isTab = { true } 
                        />
                    </Tab>
                </Tabs>
                <Modal size="lg" title='Adjuntos del contrato' show={modal.adjuntos} handleClose={this.handleCloseModalAdjuntos}>
                    <Form id="form-adjuntos"
                        onSubmit={
                            (e) => {
                                e.preventDefault();
                                validateAlert(this.onSubmitAdjuntos, e, 'form-adjuntos')
                            }
                        }
                    >
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-12 text-center">
                                <FileInput
                                    requirevalidation={0}
                                    onChangeAdjunto={ (e) => { this.setState({...this.state,form: onChangeAdjunto(e, form) });}}
                                    placeholder={form.adjuntos.contrato.placeholder}
                                    value={form.adjuntos.contrato.value}
                                    name='contrato'
                                    id='adjunto-contrato'
                                    accept="application/pdf"
                                    files={form.adjuntos.contrato.files}
                                    deleteAdjunto={this.clearFiles}
                                    multiple
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                    iconclass='flaticon2-clip-symbol text-primary'
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(this.onSubmitAdjuntos, e, 'form-adjuntos')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </Form>
                    {/* <div className="separator separator-dashed mt-1 mb-2"></div>
                    <TableForModals
                        columns={ADJ_CONTRATOS_COLUMNS}
                        data={adjuntos}
                        mostrar_acciones={true}
                        actions={{
                            'deleteAdjunto': { function: this.openModalDeleteAdjunto }
                        }}
                        elements={data.adjuntos}
                        idTable='kt_datatable_estado'
                    /> */}
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(ContratosRh);