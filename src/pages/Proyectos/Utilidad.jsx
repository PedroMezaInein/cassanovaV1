import React, { Component } from 'react'
import SVG from "react-inlinesvg"
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Card } from 'react-bootstrap'
import { Modal } from '../../components/singles'
import Layout from '../../components/layout/layout'
import { toAbsoluteUrl } from "../../functions/routers"
import { setMoneyText, setPercent } from '../../functions/setters'
import { apiGet, catchErrors, apiPutForm } from '../../functions/api'
import { printResponseErrorAlert, waitAlert } from '../../functions/alert'
import VentasList from '../../components/forms/administracion/Utilidad/VentasList'
import ComprasList from '../../components/forms/administracion/Utilidad/ComprasList'
import FiltersUtilidad from '../../components/filters/administracion/FiltersUtilidad'
class Utilidad extends Component {
    state = {
        proyectos: {
            data: [],
            total: 0,
            totalPages: 0,
            numPage: 0,
            filtrados: 0
        },
        modal: {
            compras: false,
            ventas: false,
            filter: false
        },
        ventas: [],
        compras: [],
        title: '',
        filters: {}
    }

    componentDidMount() {
        this.getUtilidad()
    }

    getUtilidad = async (objeto) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { proyectos } = this.state
        apiPutForm(`v2/administracion/utilidad?page=${proyectos.numPage}`, objeto, access_token).then((response) => {
            const { proyectos: proyectosResponse, filtrados, totales } = response.data
            proyectos.data = proyectosResponse
            proyectos.filtrados = filtrados
            proyectos.total = totales
            if(filtrados!==0){
                proyectos.totalPages = Math.ceil(filtrados / 10)
            }else{
                proyectos.totalPages = 1
            }
            Swal.close()
            this.setState({ ...this.state, proyectos })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    getComprasVentasProyecto = async (proy, tipo) => {
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/utilidad/${proy.id}/${tipo}`, access_token).then((response) => {
            const { proyecto } = response.data
            let { title, ventas, compras, modal } = this.state
            title = proyecto.simpleName
            if (tipo === 'ventas') {
                ventas = proyecto.ventas
                modal.ventas = true
                modal.compras = false
            }
            if (tipo === 'compras') {
                compras = proyecto.compras
                modal.ventas = false
                modal.compras = true
            }
            Swal.close()
            this.setState({ ...this.state, modal, ventas, compras, title })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    percentageUtilidad(proyecto) {
        let percentage = (proyecto.totalVentas - proyecto.totalCompras) * 100 / proyecto.totalVentas
        if (isNaN(percentage) || percentage === Number.NEGATIVE_INFINITY) {
            return '-';
        } else {
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
        this.setState({ ...this.state, modal })
    }

    handleCloseFiltros = () => {
        const { modal } = this.state
        modal.filter = false
        this.setState({ ...this.state, modal })
    }
    sendFilters = async (form) => {
        const { modal, proyectos } = this.state
        proyectos.numPage = 0
        modal.filter = false
        this.setState({ ...this.state, filters: form, modal, proyectos })
        this.getUtilidad(form)
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
    changePageProyecto = proyecto => {
        const { history } = this.props
        history.push({ pathname: `/proyectos/proyectos/single/${proyecto.id}` });
    }
    totlaProyectos(keys) {
        const { proyectos } = this.state
        let text = ''
        if (keys.length) {
            text = `${proyectos.filtrados} ${proyectos.filtrados === 1 ? 'PROYECTO ENCONTRADO' : 'PROYECTOS ENCONTRADOS'}`
        } else {
            text = `${proyectos.filtrados} ${proyectos.filtrados === 1 ? 'PROYECTO' : 'PROYECTOS'}`
        }
        return text
    }
    render() {
        const { proyectos, modal, title, ventas, compras, filters } = this.state
        let keys = Object.keys(filters)
        return (
            <Layout active='administracion'  {...this.props}>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center pt-6 pt-md-0">
                        <div className="card-title-utilidad">Utilidad</div>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-flex btn-utilidad" onClick={() => { this.openModalFiltros() }} >
                                <span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Filter.svg')} /></span><div>FILTRAR</div>
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <div className="table-responsive">
                            <div className="list min-w-1000px">
                                <div className="row mx-0 utilidad-head-table">
                                    <div className="w-20"></div>
                                    <table className="table-utilidad w-80">
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
                                </div>
                                <div>
                                    {
                                        proyectos.data.length === 0 ?
                                            <div className='font-weight-light text-center mt-3'>
                                                No hay datos que mostrar
                                            </div>
                                            :
                                            Object.keys(proyectos.data).map((name, key1) => {
                                                return (
                                                    <div className="border-utilidad" key={key1}>
                                                        <div className="div-general-utilidad">
                                                            <div className="w-20 align-self-center py-2 px-3 utilidad-table-title">
                                                                {name}
                                                            </div>
                                                            <table className="table-utilidad w-80 hover-utilidad-table">
                                                                <tbody>
                                                                    {
                                                                        proyectos.data[name].map((proyecto, key2) => {
                                                                            return (
                                                                                <tr key={key2} className="tr-utilidad-table">
                                                                                    <td> <span className="link-utilidad" onClick={(e) => { e.preventDefault(); this.changePageProyecto(proyecto) }}>{proyecto.fase}</span></td>
                                                                                    <td> {setMoneyText(proyecto.precioVenta)} </td>
                                                                                    <td> {setMoneyText(proyecto.precioVenta - proyecto.totalVentas)} </td>
                                                                                    <td>
                                                                                        <div className="d-inline-flex">
                                                                                            {
                                                                                                proyecto.ventas_count > 0 ?
                                                                                                    <div className="link-utilidad text-hover"
                                                                                                        onClick={() => {
                                                                                                            this.getComprasVentasProyecto(proyecto, 'ventas');
                                                                                                        }} >
                                                                                                        {setMoneyText(proyecto.totalVentas)}
                                                                                                    </div>
                                                                                                    : <div>{setMoneyText(proyecto.totalVentas)}</div>
                                                                                            }
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="d-inline-flex">
                                                                                            {
                                                                                                proyecto.compras_count > 0 ?
                                                                                                    <div className="link-utilidad text-hover"
                                                                                                        onClick={() => {
                                                                                                            this.getComprasVentasProyecto(proyecto, 'compras');
                                                                                                        }} >
                                                                                                        {setMoneyText(proyecto.totalCompras)}</div>
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
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-8 text-body font-weight-bold font-size-sm">
                            <div>
                                {this.totlaProyectos(keys)}
                                {
                                    keys.length ? ` (FILTRADO DE UN TOTAL DE ${proyectos.total} PROYECTOS)` : ''
                                }
                            </div>
                            <div className="d-flex align-items-center">
                                {
                                    proyectos.total > 0 ?
                                        <div className="align-self-center mr-5">Página {parseInt(proyectos.numPage) + 1} de {proyectos.totalPages}</div>
                                        : <></>
                                }
                                {
                                    this.isActiveButton('prev') ?
                                        <span className="btn btn-icon btn-xs btn-utilidad mr-2" onClick={this.onClickPrev}>
                                            <i className="ki ki-bold-arrow-back icon-xs"></i>
                                        </span>
                                        : ''
                                }
                                {
                                    this.isActiveButton('next') ?
                                        <span className="btn btn-icon btn-xs btn-utilidad" onClick={this.onClickNext}>
                                            <i className="ki ki-bold-arrow-next icon-xs"></i>
                                        </span>
                                        : ''
                                }
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Modal show={modal.ventas} title='VENTAS' handleClose={this.handleClose} bgHeader="border-0 pb-0">
                    <VentasList ventas={ventas} title={title} history={this.props.history} />
                </Modal>
                <Modal show={modal.compras} title='COMPRAS' handleClose={this.handleClose} bgHeader="border-0 pb-0">
                    <ComprasList compras={compras} title={title} history={this.props.history} />
                </Modal>
                <Modal size='lg' title='Filtros' show={modal.filter} handleClose={this.handleCloseFiltros} customcontent={true}
                    contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-sm modal-dialog modal-dialog-scrollable">
                    <FiltersUtilidad filters={filters} sendFilters={this.sendFilters} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Utilidad);