import React, { Component } from 'react'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import { connect } from 'react-redux'
import { setMoneyText, setPercent } from '../../functions/setters'
import Layout from '../../components/layout/layout'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { apiGet, catchErrors, apiPutForm } from '../../functions/api'
import { printResponseErrorAlert, waitAlert } from '../../functions/alert'
import { Modal } from '../../components/singles'
import FiltersUtilidad from '../../components/filters/administracion/FiltersUtilidad'
import VentasList from '../../components/forms/administracion/Utilidad/VentasList'
import ComprasList from '../../components/forms/administracion/Utilidad/ComprasList'
import Swal from 'sweetalert2'

class Utilidad extends Component {
    state = {
        proyectos: {
            data: [],
            total: 0,
            totalPages: 0,
            numPage: 0,
            filtrados: 0
        },
        modal:{
            compras:false,
            ventas:false,
            filter:false
        },
        ventas:[],
        compras:[],
        title:'',
        filters: {}
    }

    componentDidMount() {
        this.getUtilidad()
    }

    getUtilidad = async ( objeto ) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { proyectos } = this.state
        apiPutForm(`v2/administracion/utilidad?page=${proyectos.numPage}`, objeto, access_token).then((response) => {
            const { proyectos: proyectosResponse, filtrados, totales } = response.data
            proyectos.data = proyectosResponse
            proyectos.filtrados = filtrados
            proyectos.total = totales
            proyectos.totalPages = Math.ceil(filtrados / 10)
            console.log(proyectos, 'proyectos.data')
            Swal.close()
            this.setState({ ...this.state, proyectos })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    getComprasVentasProyecto = async(proy, tipo) => {
        const { access_token } = this.props.authUser
        apiGet( `v2/administracion/utilidad/${proy.id}/${tipo}`, access_token ).then((response) => {
            const { proyecto } = response.data
            let { title, ventas, compras, modal } = this.state
            title = proyecto.simpleName
            if(tipo === 'ventas'){
                ventas = proyecto.ventas
                modal.ventas = true
                modal.compras = false
            }
            if(tipo === 'compras'){
                compras = proyecto.compras
                modal.ventas = false
                modal.compras = true
            }
            Swal.close()
            this.setState({ ...this.state, modal, ventas, compras, title })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    percentageUtilidad(proyecto){
        let percentage = (proyecto.totalVentas - proyecto.totalCompras)*100/proyecto.totalVentas
        if (isNaN(percentage) || percentage == Number.NEGATIVE_INFINITY) {
            return '-';
        }else{
            return setPercent(percentage)
        }
    }

    handleClose = () => { 
        const { modal } = this.state
        let { ventas, title, compras } = this.state
        modal.ventas = false
        modal.compras = false
        ventas = []
        compras = []
        title = ''
        this.setState({ ...this.state, modal, ventas, compras, title })
    }
    
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filter = true
        this.setState({...this.state, modal})
    }

    handleCloseFiltros = () => {
        const { modal } = this.state
        modal.filter = false
        this.setState({...this.state, modal})
    }
    sendFilters = async(form) => {
        const { modal, proyectos } = this.state
        proyectos.numPage = 0
        modal.filter = false
        this.setState({ ...this.state, filters: form, modal, proyectos })
        this.getUtilidad( form )
    }
    isActiveButton(direction) {
        const { proyectos } = this.state
        if (proyectos.totalPages > 1) {
            if (direction === 'prev') {
                if (proyectos.numPage > 0) {
                    return true;
                }
            } else {
                if (proyectos.numPage < 10) {
                    if (proyectos.numPage < proyectos.totalPages - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    onClickNext = (e) => {
        e.preventDefault()
        const { proyectos, filters } = this.state
        if (proyectos.numPage < proyectos.totalPages - 1) {
            this.setState({
                numPage: proyectos.numPage++
            })
        }
        this.getUtilidad(filters)
    }
    
    onClickPrev = (e) => {
        e.preventDefault()
        const { proyectos, filters } = this.state
        if (proyectos.numPage > 0) {
            this.setState({
                numPage: proyectos.numPage--
            })
            this.getUtilidad(filters)
        }
    }
    render() {
        const { proyectos, modal, title, ventas, compras, filters } = this.state
        console.log(this.state, 'this.state')
        let keys = Object.keys(filters)
        return (
            <Layout active='administracion'  {...this.props}>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center pt-6 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">Utilidad</div>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-flex btn-light-primary2" onClick={() => { this.openModalFiltros() }} >
                                <span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Filter.svg')} /></span><div>FILTRAR</div>
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <div className="w-100">
                            <table className="table-utilidad w-80 ml-auto">
                                <thead>
                                    <tr>
                                        <th>FASE</th>
                                        <th>PRECIO DE VENTA</th>
                                        <th>POR COBRAR</th>
                                        <th>VENTAS</th>
                                        <th>COMPRAS</th>
                                        <th>UTILIDAD</th>
                                        <th>% UTILIDAD</th>
                                    </tr>
                                </thead>
                            </table>
                            {
                                Object.keys(proyectos.data).map((name, key1) => {
                                    return (
                                        <div className="hola d-flex border-top" key={key1}>
                                            <div className="w-20 align-self-center py-2 px-3">
                                                <div className="font-weight-bold text-justify">{name}</div>
                                            </div>
                                            <table className="table-utilidad  w-80">
                                                <tbody>
                                                    {
                                                        proyectos.data[name].map((proyecto, key2) => {
                                                            return (
                                                                <tr key={key2} className="h-40px">
                                                                    <td> {proyecto.fase} </td>
                                                                    <td> {setMoneyText(proyecto.precioVenta)} </td>
                                                                    <td> {setMoneyText(proyecto.precioVenta - proyecto.totalVentas)} </td>
                                                                    <td>
                                                                        <div className="d-inline-flex">
                                                                            {
                                                                                proyecto.ventas_count > 0 ?
                                                                                    <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>VER VENTAS</span></Tooltip>}>
                                                                                        <div className="see-ventas text-hover" 
                                                                                            onClick = { () => { 
                                                                                                    this.getComprasVentasProyecto(proyecto, 'ventas'); 
                                                                                                } } >
                                                                                            {setMoneyText(proyecto.totalVentas)}
                                                                                        </div>
                                                                                    </OverlayTrigger>
                                                                                    : <div>{setMoneyText(proyecto.totalVentas)}</div>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-inline-flex">
                                                                            {
                                                                                proyecto.compras_count > 0 ?
                                                                                    <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>VER COMPRAS</span></Tooltip>}>
                                                                                        <div className="see-ventas text-hover" 
                                                                                            onClick = { () => { 
                                                                                                this.getComprasVentasProyecto(proyecto, 'compras'); 
                                                                                            } } >
                                                                                            {setMoneyText(proyecto.totalCompras)}</div>
                                                                                    </OverlayTrigger>
                                                                                    : <div>{setMoneyText(proyecto.totalCompras)}</div>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td> {setMoneyText(proyecto.totalVentas - proyecto.totalCompras)} </td>
                                                                    <td> {this.percentageUtilidad(proyecto)}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="d-flex justify-content-between mt-8 text-body font-weight-bold font-size-sm">
                            <div>
                                {`${proyectos.filtrados} ${proyectos.filtrados===1?'PROYECTO ENCONTRADO':'PROYECTOS ENCONTRADOS'}`}
                                {
                                    keys.length? `(FILTRADO DE UN TOTAL DE ${proyectos.total} PROYECTOS)`:''
                                }
                            </div>
                            <div className="d-flex align-items-center">
                                {
                                    proyectos.total > 0 ?
                                    <div className="align-self-center mr-5">Página { parseInt(proyectos.numPage) + 1} de { proyectos.totalPages }</div>
                                    :<></>
                                }
                                {
                                    this.isActiveButton('prev') ?
                                        <span className="btn btn-icon btn-xs btn-light-primary2 mr-2" onClick={this.onClickPrev}>
                                            <i className="ki ki-bold-arrow-back icon-xs"></i>
                                        </span>
                                    : ''
                                }
                                {
                                    this.isActiveButton('next') ?
                                        <span className="btn btn-icon btn-xs btn-light-primary2" onClick={this.onClickNext}>
                                            <i className="ki ki-bold-arrow-next icon-xs"></i>
                                        </span>
                                    : ''
                                }
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                
                <Modal show = { modal.ventas } title = 'VENTAS' handleClose = { this.handleClose } bgHeader="border-0 pb-0">
                    <VentasList ventas={ventas} title={title} history = { this.props.history } />
                </Modal>
                <Modal show = { modal.compras } title = 'COMPRAS' handleClose = { this.handleClose } bgHeader="border-0 pb-0">
                    <ComprasList compras={compras} title={title} history = { this.props.history } />
                </Modal>
                <Modal size = 'lg' title = 'Filtros' show = { modal.filter } handleClose = { this.handleCloseFiltros } customcontent = { true } 
                    contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-sm modal-dialog modal-dialog-scrollable">
                        <FiltersUtilidad filters={filters} sendFilters={this.sendFilters} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Utilidad);