import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../../components/layout/layout' 
import { ModalDelete, Modal } from '../../../components/singles' 
import { PRESUPUESTO_DISEÑO_COLUMNS, URL_DEV, ADJUNTOS_PRESUPUESTOS_COLUMNS} from '../../../constants'
import { setDateTable, setTextTable, setMoneyTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert} from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { renderToString } from 'react-dom/server'
import TableForModals from '../../../components/tables/TableForModals'

const $ = require('jquery');

class PresupuestoDiseño extends Component {
    state = {  
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        data:{
            adjuntos: []
        },
        title: 'Nuevo presupuesto de diseño',
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
    }

    changeEditPage = presupuesto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto-diseño/edit',
            state: { presupuesto: presupuesto }
        });
    }

    openModalDelete = presupuesto => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            presupuesto: presupuesto
        })
    }

    downloadPDF = presupuesto   => {
        const { modal, data } = this.state
        data.adjuntos = presupuesto.pdfs
        modal.adjuntos = true
        this.setState({
            ... this.state,
            presupuesto: presupuesto,
            modal,
            adjuntos: this.setAdjuntosTable(presupuesto.pdfs),
            data
        })
    }

    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                identificador: renderToString(setTextTable(adjunto.pivot.identificador)),
                id: adjunto.id
            })
        })
        return aux
    }

    async deletePresupuestoAdminAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, presupuesto} = this.state
        
        await axios.delete(URL_DEV + 'presupuestos-diseño/' + presupuesto.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                const { presupuesto } = response.data
                this.getPresupuestoAxios()

                modal.delete = false

                this.setState({                    
                    ... this.state,
                    modal,
                    presupuesto: '',
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'La presupuesto fue eliminada con éxito.',)
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

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal, 
            presupuesto: ''
        })
    }

    handleClose = () => {
        const { modal, data } = this.state
        data.adjuntos = []
        modal.adjuntos = false
        this.setState({
            ... this.state,
            presupuesto: '',
            modal,
            adjuntos: [],
            data
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

    setPresupuestos = presupuestos => {
        let aux = []
        if(presupuestos)
            presupuestos.map( (presupuesto) => {
                aux.push(
                    {
                        actions: this.setActions(presupuesto),
                        empresa: renderToString(setTextTable( presupuesto.empresa ? presupuesto.empresa.name : '')),
                        fecha: renderToString(setDateTable(presupuesto.fecha)),
                        m2: renderToString(setTextTable(presupuesto.precio ? presupuesto.precio.m2 : '')),
                        esquema: renderToString(setTextTable(presupuesto.esquema ? presupuesto.esquema.replace('_', ' ') : '')),
                        total: renderToString(setMoneyTable(presupuesto.total)),
                        id: presupuesto.id,
                    }
                )
            })
        return aux
    }

    setActions = presupuesto => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            }
        )
        if(presupuesto.pdfs)
            if(presupuesto.pdfs.length)
                {
                    aux.push(
                        {
                            text: 'Descargar&nbsp;presupuesto',
                            btnclass: 'info',
                            iconclass: 'flaticon2-download-1',                  
                            action: 'download',
                            tooltip: {id:'download', text:'Decargar presupuesto'},
                        }
                    )
                }
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',                  
                action: 'delete',
                tooltip: {id:'delete', text:'Eliminar', type:'error'},
            }
        )
        return aux
    }

    async getPresupuestoAxios(){
        var table = $('#kt_datatable2_presupuesto_diseño')
            .DataTable();
        table.ajax.reload();
    }

    render() {
        const { modal, data, adjuntos } = this.state

        return (
            <Layout active={'presupuesto'} {...this.props}>
                <NewTableServerRender   
                    columns = { PRESUPUESTO_DISEÑO_COLUMNS }
                    title = 'Presupuesto de diseño' subtitle = 'Listado de presupuestos'
                    mostrar_boton={true}
                    abrir_modal={false} 
                    url = '/presupuesto/presupuesto-diseño/add'
                    mostrar_acciones={true} 
                    actions={{
                        'edit': { function: this.changeEditPage },
                        'delete': {function: this.openModalDelete},
                        'download': { function: this.downloadPDF}
                    }}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setPresupuestos }
                    urlRender = {URL_DEV + 'presupuestos-diseño'} /// Falta cambiar aqui
                    idTable = 'kt_datatable2_presupuesto_diseño'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete 
                    title = '¿Desea eliminar el presupuesto?' 
                    show = { modal.delete } 
                    handleClose = { this.handleCloseModalDelete } 
                    onClick=  { (e) => { e.preventDefault(); waitAlert(); this.deletePresupuestoAdminAxios() }} />
                <Modal show = { modal.adjuntos } handleClose = { this.handleClose } title = "Listado de presupuestos" >
                    <TableForModals
                        columns={ADJUNTOS_PRESUPUESTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={false}
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

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestoDiseño);