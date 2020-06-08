import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, GOLD, SOLICITUD_COMPRA_COLUMNS } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button , FileInput } from '../../../components/form-components'
import { faPlus, faTrash, faEdit, faSync, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { SolicitudCompraCard } from '../../../components/cards'
import { Small, B, Subtitle } from '../../../components/texts'
import NewTable from '../../../components/tables/NewTable'

class SolicitudCompra extends Component{

    state = {
        modalDelete: false,
        modalSingle: false,
        title: 'Nueva solicitud de compra',
        solicitud: '',
        solicitudes: [],
        data:{
            solicitudes: []
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const solicitud = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!solicitud)
            history.push('/')
        let queryString = this.props.history.location.search
        if(queryString){
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if(id){
                
                this.setState({
                    ... this.state,
                    modalSingle: true
                })
                this.getSolicitudCompraAxios(id)

            }
        }
        this.getSolicitudesCompraAxios()
    }

    openModalDelete = ( solicitud ) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            title: 'Nueva solicitud de compra',
            solicitud: solicitud
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            solicitud: '',
            remision: ''
        })
    }

    handleCloseSingle = () => {
        const { modalSingle } = this.state
        this.setState({
            ... this.state,
            modalSingle: !modalSingle,
            solicitud: '',
            remision: ''
        })
    }

    setSolicitudes = solicitudes => {
        let aux = []
        solicitudes.map( (solicitud) => {
            aux.push(
                {
                    actions: this.setActions(solicitud),
                    proyecto: renderToString(setTextTable( solicitud.proyecto ? solicitud.proyecto.nombre : '')),
                    empresa: renderToString(setTextTable( solicitud.empresa ? solicitud.empresa.name : '' )),
                    proveedor: renderToString(setTextTable( solicitud.proveedor ? solicitud.proveedor.nombre : '' )),
                    factura: renderToString(setTextTable(solicitud.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(solicitud.monto)),
                    tipoPago: renderToString(setTextTable(solicitud.tipo_pago ? solicitud.tipo_pago.tipo : '')),
                    descripcion: renderToString(setTextTable(solicitud.descripcion)),
                    area: renderToString(setTextTable( solicitud.subarea ? solicitud.subarea.area ? solicitud.subarea.area.nombre : '' : '' )),
                    subarea: renderToString(setTextTable( solicitud.subarea ? solicitud.subarea.nombre : '' )),
                    fecha: renderToString(setDateTable(solicitud.created_at)),
                    adjunto: solicitud.adjunto ? renderToString(setArrayTable([{text: 'Adjunto', url: solicitud.adjunto.url}])) : renderToString(setTextTable('Sin adjuntos')),
                    id: solicitud.id
                }
            )
        })
        return aux
    }

    setActions = solicitud => {
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

    changePageConvert = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/compra/convert',
            state: { solicitud: solicitud}
        });
    }

    changePageEdit = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/solicitud-compra/edit',
            state: { solicitud: solicitud}
        });
    }

    //Async
    async getSolicitudesCompraAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { solicitudes } = response.data
                const { data } = this.state
                data.solicitudes = solicitudes
                this.setState({
                    ... this.state,
                    solicitudes: this.setSolicitudes(solicitudes)
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

    async getSolicitudCompraAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { solicitud } = response.data
                this.setState({
                    ... this.state,
                    solicitud: solicitud
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

    async deleteSolicitudAxios(){
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        await axios.delete(URL_DEV + 'solicitud-compra/' + solicitud.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { solicitudes } = response.data
                const { data } = this.state
                data.solicitudes = solicitudes 
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    data,
                    title: 'Nueva solicitud de compra',
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes)
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

        const { modalDelete, modalSingle, solicitudes, solicitud, data } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>
                
                <NewTable columns = { SOLICITUD_COMPRA_COLUMNS } data = {solicitudes} 
                    title = 'Solicitudes de compra' subtitle = 'Listado de solicitudes de compra'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url = '/proyectos/solicitud-compra/add'
                    mostrar_acciones={true}
                    
                    actions = {{
                        'edit': {function: this.changePageEdit},
                        'delete': {function: this.openModalDelete},
                        'convert': {function: this.changePageConvert}
                    }}
                    elements = { data.solicitudes } />
                
                <ModalDelete show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteSolicitudAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar la solicitud de compra?
                    </Subtitle>
                </ModalDelete>
                
                <Modal show = { modalSingle } handleClose = { this.handleCloseSingle } >
                    <SolicitudCompraCard data = { solicitud }>
                        {
                            solicitud.convertido ? '' :
                                <div className="col-md-12 mb-3 d-flex justify-content-end">
                                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.changePageConvert(solicitud)} } text='' icon={faSync} color="transparent" 
                                        tooltip={{id:'convertir', text:'Comprar', type:'success'}} />
                                </div>
                        }
                        
                    </SolicitudCompraCard>
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

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudCompra);