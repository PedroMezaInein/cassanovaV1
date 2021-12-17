import React, { Component } from 'react' 
import $ from 'jquery'
import axios from 'axios'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout' 
import { AdjuntosForm} from '../../../components/forms'
import { NewTable } from '../../../components/NewTables'
import { setSingleHeader } from '../../../functions/routers'
import { Modal, ModalDelete} from '../../../components/singles' 
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import TableForModals from '../../../components/tables/TableForModals'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { NOMINA_ADMIN_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS, PAGO_IMPUESTOS_COLUMNS} from '../../../constants'
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert} from '../../../functions/alert'
import { apiOptions, apiGet, apiDelete, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { setOptions, setDateTable, setMoneyTable, setTextTableCenter, setAdjuntosList, setTextTable, setNaviIcon } from '../../../functions/setters'

class PagoImpuestos extends Component {
    state = {
        filters: {},
        impuesto: '',



        
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        data:{
            adjuntos: []
        },
        title: 'Nueva nómina administrativa',
        form:{
            periodo : '',
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nominasAdmin:[{
                usuario: '',
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }],
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        options: {
            usuarios: [],
            empresas:[]
        }
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

    reloadTable = (filter) => {
        $(`#impuestos`).DataTable().search(JSON.stringify(filter)).draw();
    }

    async deleteNominaAdminAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { nomina} = this.state
        await axios.delete(`${URL_DEV}v2/rh/nomina-administrativa/${nomina.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { modal } = this.state
                this.getNominasAxios()
                modal.delete = false
                this.setState({ ...this.state, modal, nomina: '', form: this.clearForm() })
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue eliminada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }










    componentDidMount() { 
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const nominaadmin = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!nominaadmin)
            history.push('/')
            this.getOptionsAxios()
    }
    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-administrativa/options', { responseType:'json', headers: {Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                Swal.close()
                const { usuarios, empresas } = response.data
                const { options, data } = this.state
                data.usuarios = usuarios
                options['usuarios'] = setOptions( usuarios, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    changeSinglePage = (nomina) => {
        const { history } = this.props
        history.push({
            pathname: '/rh/nomina-admin/single/'+nomina.id,
            state: { nomina: nomina }
        });
    }

    changeEditPage = nomina => {
        const { history } = this.props
        history.push({
            pathname: '/rh/nomina-admin/edit',
            state: { nomina: nomina }
        });
    }

    openModalDelete = nomina => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            nomina: nomina
        })
    }

    openModalAdjuntos = nomina => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = nomina.adjuntos
        this.setState({
            ...this.state,
            modal,
            nomina: nomina,
            data,
            form: this.clearForm(),
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

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }

    

    async deleteNominaAdminAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { nomina} = this.state
        await axios.delete(`${URL_DEV}v2/rh/nomina-administrativa/${nomina.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { modal } = this.state
                this.getNominasAxios()
                modal.delete = false
                this.setState({ ...this.state, modal, nomina: '', form: this.clearForm() })
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue eliminada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async addAdjuntoNominaAdminAxios() {

        const { access_token } = this.props.authUser
        const { form, nomina } = this.state
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

        data.append('id', nomina.id)

        await axios.post(URL_DEV + 'rh/nomina-administrativa/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { nomina } = response.data
                const { data } = this.state
                data.adjuntos = nomina.adjuntos
                this.getNominasAxios()

                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    nomina: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { nomina } = this.state
        await axios.delete(URL_DEV + 'rh/nomina-administrativa/' + nomina.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { nomina } = response.data
                const { data } = this.state
                data.adjuntos = nomina.adjuntos
                this.getNominasAxios()
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    nomina: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert('Adjunto eliminado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal, 
            nomina: ''
        })
    }

    handleCloseAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal, 
            nomina: ''
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
                case 'nominasAdmin':
                    form[element] = [{
                        usuarios: '',
                        empresa:''
                    }]
                    break;
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

    setNominaAdmin = nominas => {
        let aux = []
        nominas.map( (nomina) => {
            aux.push(
                {
                    actions: this.setActions(nomina),
                    periodo: renderToString(setTextTableCenter(nomina.periodo)),
                    fechaInicio: renderToString(setDateTable(nomina.fecha_inicio)),
                    fechaFin: renderToString(setDateTable(nomina.fecha_fin)),
                    totalNominaIMSS: renderToString(setMoneyTable(nomina.totalNominaImss)),
                    restanteNomina: renderToString(setMoneyTable(nomina.totalRestanteNomina)),
                    extras: renderToString(setMoneyTable(nomina.totalExtras)),
                    granTotal: renderToString(setMoneyTable(nomina.totalNominaImss + nomina.totalRestanteNomina + nomina.totalExtras)),
                    id: nomina.id
                }
            )
            return false
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
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'show',
                tooltip: { id: 'show', text: 'Mostrar'}
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos'}
            }
        )
        return aux
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

    async getNominasAxios(){
        $('#kt_datatable2_nomina_admin').DataTable().ajax.reload();
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
                />





                <NewTableServerRender   
                    columns = { NOMINA_ADMIN_COLUMNS }
                    title = 'Nómina Administrativa' subtitle = 'Listado de Nómina Administrativa'
                    mostrar_boton={true}
                    abrir_modal={false} 
                    url = '/rh/pago-impuestos/add'
                    mostrar_acciones={true} 
                    actions={{
                        'edit': { function: this.changeEditPage },
                        'delete': {function: this.openModalDelete},
                        'adjuntos': { function: this.openModalAdjuntos },
                        'show': { function: this.changeSinglePage}
                    }}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setNominaAdmin }
                    urlRender = {URL_DEV + 'rh/nomina-administrativa'}
                    idTable = 'kt_datatable2_nomina_admin'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete title={'¿Desea eliminar la nómina?'} show = { modal.delete } handleClose = { this.handleCloseModalDelete } onClick=  { (e) => { e.preventDefault(); waitAlert(); this.deleteNominaAdminAxios() }} />

                <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm form={form} onChangeAdjunto={this.onChangeAdjunto} clearFiles={this.clearFiles}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoNominaAdminAxios() }} 
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