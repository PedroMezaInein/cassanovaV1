import React, { Component } from 'react' 
import $ from 'jquery'
import { connect } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { Modal} from '../../../components/singles'
import Layout from '../../../components/layout/layout' 
import { AdjuntosForm} from '../../../components/forms'
import { NewTable } from '../../../components/NewTables'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import TableForModals from '../../../components/tables/TableForModals'
import { apiDelete, catchErrors, apiPostFormData } from '../../../functions/api'
import { URL_DEV, ADJUNTOS_COLUMNS, PAGO_IMPUESTOS_COLUMNS} from '../../../constants'
import { waitAlert, printResponseErrorAlert, deleteAlert, doneAlert} from '../../../functions/alert'
import { setDateTable, setMoneyTable, setTextTableCenter, setAdjuntosList, setTextTable, setNaviIcon } from '../../../functions/setters'
class PagoImpuestos extends Component {
    state = {
        filters: {},
        impuesto: '',
        modal:{
            adjuntos: false,
        },
        data:{
            adjuntos: []
        },
        form:{
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        }
    }

    componentDidMount() { 
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const impuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!impuesto)
            history.push('/')
    }

    reloadTable = (filter) => {
        $(`#impuestos`).DataTable().search(JSON.stringify(filter)).draw();
    }

    setImpuestos = impuestos => {
        let aux = []
        impuestos.map( (impuesto) => {
            aux.push(
                {
                    actions: this.setActionsImpuestos(impuesto),
                    tipo: setTextTableCenter('tipo'),
                    fecha: setDateTable(impuesto.fecha_inicio),
                    imss: setMoneyTable(impuesto.totalNominaImss),
                    rcv: setMoneyTable(impuesto.totalNominaImss),
                    infonavit: setMoneyTable(impuesto.totalRestanteNomina),
                    isn: setMoneyTable(impuesto.totalExtras),
                    total: setMoneyTable(impuesto.totalNominaImss + impuesto.totalRestanteNomina + impuesto.totalExtras),
                    id: impuesto.id
                }
            )
            return false
        })
        return aux
    }

    setActionsImpuestos = impuesto => {
        const { history } = this.props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); 
                        history.push({ pathname: '/rh/pago-impuestos/edit', state: { impuesto: impuesto } }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL PAGO DE IMPUESTO CON IDENTIFICADOR: ${impuesto.id}`, () => this.deletePagoImpuesto(impuesto.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); 
                        history.push({ pathname: `/rh/pago-impuestos/single/${impuesto.id}`, state: { impuesto: impuesto } }) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Mostrar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(impuesto) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        )
    }

    async deletePagoImpuesto(id) {
        const { access_token } = this.props.authUser
        apiDelete(`v2/rh/nomina-administrativa/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                this.setState({
                    ...this.state,
                    impuesto: '',
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    openModalAdjuntos = impuesto => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = impuesto.adjuntos
        this.setState({
            ...this.state,
            modal,
            impuesto: impuesto,
            data,
            form: this.clearFormAdjuntos(),
            adjuntos: this.setAdjuntosTable(data.adjuntos)
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', '', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }

    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                actions: this.setActionsAdjuntos(adjunto),
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                tipo: renderToString(setTextTable('Adjunto')),
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
    async addAdjuntoAxios() {
        const { access_token } = this.props.authUser
        const { form, impuesto } = this.state
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
        data.append('id', impuesto.id)
        apiPostFormData(`rh/nomina-administrativa/adjuntos`, data, access_token).then(
            (response) => {
                const { nomina } = response.data
                const { data, filters } = this.state
                data.adjuntos = nomina.adjuntos
                this.reloadTable(filters)
                this.setState({
                    ...this.state,
                    form: this.clearFormAdjuntos(),
                    impuesto: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Adjunto agregado con éxito.')                
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { impuesto } = this.state
        apiDelete(`v2/rh/nomina-administrativa/${impuesto.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { nomina } = response.data
                const { data, filters } = this.state
                data.adjuntos = nomina.adjuntos
                this.reloadTable(filters)
                this.setState({
                    ...this.state,
                    form: this.clearFormAdjuntos(),
                    impuesto: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert('Adjunto eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    handleCloseAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearFormAdjuntos(),
            modal, 
            impuesto: ''
        })
    }

    clearFormAdjuntos = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'adjuntos': 
                    form[element] = {
                        adjunto:{
                            value: '',
                            placeholder: 'Ingresa los adjuntos',
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
        const { modal, form, adjuntos, data } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <NewTable 
                    tableName='impuestos'
                    subtitle='Listado de pago de impuestos'
                    title='Impuestos'
                    accessToken={this.props.authUser.access_token}
                    columns={PAGO_IMPUESTOS_COLUMNS}
                    setter={this.setImpuestos}
                    urlRender={`${URL_DEV}rh/nomina-administrativa`}
                    filterClick={this.openModalFiltros}
                    type='tab'
                    exportar_boton={true}
                    onClickExport={() => this.exportEquiposAxios()}
                    url = '/rh/pago-impuestos/add'
                />
                <Modal size="lg" title='Adjuntos' show={modal.adjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm form={form} onChangeAdjunto={this.onChangeAdjunto} clearFiles={this.clearFiles}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoAxios() }} 
                        adjuntos = {['adjunto']}/>
                    <div className="separator separator-dashed separator-border-2 mb-6 mt-5"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PagoImpuestos);