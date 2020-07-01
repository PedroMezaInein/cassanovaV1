import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, GOLD, REMISION_COLUMNS } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button , FileInput } from '../../../components/form-components'
import { faPlus, faTrash, faEdit, faSync, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { RemisionCard } from '../../../components/cards'
import { Small, B, Subtitle } from '../../../components/texts'
import NewTable from '../../../components/tables/NewTable'


class Remisiones extends Component{

    state = {
        modalDelete: false,
        modalSingle: false,
        title: 'Nueva remisión',
        remisiones: [],
        remision: '',
        data:{
            remisiones: []
        },
        formeditado:0,
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!remisiones)
            history.push('/')
        this.getRemisionesAxios()
        let queryString = this.props.history.location.search
        if(queryString){
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if(id){
                
                this.setState({
                    ... this.state,
                    modalSingle: true
                })
                this.getRemisionAxios(id)
            }
        }
    }
    
    openModalDelete = (remision) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            remision: remision
        })
    }

    handleCloseSingle = () => {
        this.setState({
            ... this.state,
            modalSingle: false,
            remision: ''
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            remision: '',
        })
    }

    // Setters
    setRemisiones = remisiones => {
        let aux = []
        remisiones.map( (remision) => {
            aux.push(
                {
                    actions: this.setActions(remision),
                    fecha: renderToString(setDateTable(remision.created_at)),
                    proyecto: renderToString(setTextTable(remision.proyecto ? remision.proyecto.nombre : '')),
                    area: renderToString(setTextTable( remision.subarea ? remision.subarea.area ? remision.subarea.area.nombre : '' : '')),
                    subarea: renderToString(setTextTable( remision.subarea ? remision.subarea.nombre : '')),
                    descripcion: renderToString(setTextTable(remision.descripcion)),
                    adjunto: remision.adjunto ? renderToString(setArrayTable([{text: 'Adjunto', url: remision.adjunto.url}])) : renderToString(setTextTable('Sin adjuntos')),
                    id: remision.id
                }
            )
        })
        return aux
    }

    setActions = remision => {
        let aux = []
            aux.push(
                {
                    text: 'Editar',
                    btnclass: 'success',
                    iconclass: 'flaticon2-pen',
                    action: 'edit',
                    tooltip: {id:'edit', text:'Editar'},
                },
                {
                    text: 'Eliminar',
                    btnclass: 'danger',
                    iconclass: 'flaticon2-rubbish-bin',                  
                    action: 'delete',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'},
                },
                {
                    text: 'Convertir',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-refresh',                  
                    action: 'convert',
                    tooltip: {id:'convert', text:'Convertir', type:'success'},
                }
        )
        return aux
    }

    changePageConvert = remision => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/solicitud-compra/convert',
            state: { remision: remision},
            formeditado:1
        });
    }

    changePageEdit = remision => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/remision/edit',
            state: { remision: remision},
            formeditado:1
        });
    }

    async getRemisionesAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proyectos, areas, remisiones } = response.data
                const { data } = this.state
                data.remisiones = remisiones
                this.setState({
                    ... this.state,
                    remisiones: this.setRemisiones(remisiones),
                    data
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

    async getRemisionAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remision } = response.data
                this.setState({
                    ... this.state,
                    remision: remision,
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

    async deleteRemisionAxios(){
        const { access_token } = this.props.authUser
        const { remision } = this.state
        await axios.delete(URL_DEV + 'remision/' + remision.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remisiones } = response.data
                const { data } = this.state
                data.remisiones = remisiones
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La remisión fue eliminada con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    remisiones: this.setRemisiones(remisiones),
                    modalDelete:false,
                    remision: '',
                    data
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

    render(){

        const { data, modalDelete, modalSingle, remisiones, remision, formeditado } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>

                
                {/* <DataTable columns = { REMISION_COLUMNS } data = { remisiones } /> */}
                <NewTable columns = { REMISION_COLUMNS } data = {remisiones} 
                    title = 'Remisiones' subtitle = 'Listado de demisiones'
                    mostrar_boton={true}
                    abrir_modal={false}                    
                    url = '/proyectos/remision/add'
                    mostrar_acciones={true}

                    actions = {{
                        'edit': {function: this.changePageEdit},
                        'delete': {function: this.openModalDelete},
                        'convert': {function: this.changePageConvert}
                    }}
                    elements = { data.remisiones } />

                <ModalDelete title={"¿Estás seguro que deseas eliminar la remisión?"} show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteRemisionAxios() }}>
                </ModalDelete>

                <Modal show = { modalSingle } handleClose = { this.handleCloseSingle } >

                    <RemisionCard data = { remision }>
                        {
                            remision.convertido ? '' :
                                <div className="col-md-12 mb-3 d-flex justify-content-end">
                                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.changePageConvert(remision)} } text='' icon={faSync} color="transparent" 
                                        tooltip={{id:'convertir', text:'Comprar', type:'success'}} />
                                </div>
                        }
                        
                    </RemisionCard>
                    
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

export default connect(mapStateToProps, mapDispatchToProps)(Remisiones);