import React, { Component } from 'react'
import Swal from 'sweetalert2'
import SVG from 'react-inlinesvg'
import Pagination from 'react-js-pagination'
import { toAbsoluteUrl } from '../../../../functions/routers'
import { apiGet, catchErrors } from '../../../../functions/api'
import { Button, InputMoneyGray } from '../../../form-components'
import { printResponseErrorAlert, waitAlert } from '../../../../functions/alert'
import { setMoneyText, setDateText, dayDMY, setMoneyTableSinSmall } from '../../../../functions/setters'
class PrestacionesEgresos extends Component {
    state = {
        colaboradores: [],
        suma: 0,
        active: 'historial',
        egresos: [],
        activePage: 1,
        itemsPerPage: 5
    }

    componentDidMount = () => {
        this.getInfoPrestacion()
    }

    getInfoPrestacion = () => {
        const { prestacion, at } = this.props
        waitAlert()
        apiGet(`v1/rh/prestaciones/${prestacion.id}/egresos`, at).then(
            (response) => {
                const { colaboradores, egresos } = response.data
                colaboradores.forEach((colaborador) => {
                    colaborador.costo = prestacion.pago_por_empleado
                })
                Swal.close()
                this.setState({ 
                    ...this.state, 
                    colaboradores, 
                    egresos: egresos, 
                    suma: colaboradores.length * prestacion.pago_por_empleado, 
                    active: egresos.length ? 'historial' : 'formulario'
                })
            }, (error) => { printResponseErrorAlert(error)  }
        ).catch((error) => { catchErrors(error) })
    }

    onChangePage(pageNumber) {
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({ ...this.state, activePage })
    }

    onChange = (e) => {
        const { name, value } = e.target
        let { colaboradores, suma } = this.state
        suma = suma - parseFloat(colaboradores[name].costo) + parseFloat(value)
        colaboradores[name].costo = value
        this.setState({
            ...this.state,
            colaboradores,
            suma
        })
    }

    onSubmit = () => {
        const { history, prestacion } = this.props
        const { suma } = this.state
        prestacion.total = suma
        history.push({
            pathname: '/administracion/egresos/add',
            state: { prestacion: prestacion }
        });
    }

    changeTab = () => {
        const { active } = this.state
        this.setState({
            ...this.state,
            active: active === 'historial' ? 'formulario' : 'historial',
            activePage: 1
        })
    }

    printFormularioEgreso = () => {
        const { colaboradores, suma } = this.state
        return(
            <div>
                <div className="card mt-1 border-0">
                    <div className="card-body p-0">
                        <div className="px-9 pt-7 card-rounded h-230px w-100 bg-primary2">
                            <div className="d-flex flex-stack justify-content-center">
                                <h3 className="m-0 text-white font-weight-bolder font-size-h3">Colaboradores asignados</h3>
                            </div>
                            <div className="d-flex text-center flex-column text-white pt-5">
                                <span className="font-weight-normal font-size-lg">Total</span>
                                <span className="font-weight-bolder font-size-h2 pt-1">{setMoneyTableSinSmall(suma)}</span>
                            </div>
                        </div>
                        <div className="bg-white shadow-sm card-rounded mx-9 mb-5 px-9 pt-9 pb-6 position-relative z-index-1 mt-n-100px">
                            <div className="table-responsive">
                                <div className="list min-w-500px">
                                    {
                                        colaboradores.map((colaborador, id) => {
                                            return(
                                                <div className="d-flex align-items-center mb-6" key  = { id } >
                                                    <div className="symbol symbol-45px w-40px mr-5">
                                                        <span className="symbol-label bg-light font-size-h4">
                                                            {colaborador.nombre.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-center flex-wrap w-100">
                                                        <div className="mb-1 pe-3 flex-grow-1">
                                                            <div className="font-size-lg text-dark-75 font-weight-bolder">{colaborador.nombre}</div>
                                                            <div className="font-weight-bolder font-size-sm">Activado: <span className="font-weight-light">{dayDMY(colaborador.pivot.fecha_activacion)}</span></div>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <div className="font-weight-bolder font-size-h6 text-gray-800 pe-1">
                                                                <InputMoneyGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } 
                                                                    withformgroup = { 0 } requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } 
                                                                    prefix = '$' name = { id } value = { colaborador.costo } onChange = { this.onChange } 
                                                                    placeholder = { colaborador.nombre } iconclass = "la la-money-bill icon-xl" customclass="px-2 text-center w-90px"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="d-flex justify-content-center border-top pt-4">
                                <button type="button" className="btn btn-sm btn-flex btn-light-primary2" onClick={() => { this.onSubmit() }} >
                                    <span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} /></span><div>GENERAR EGRESO</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    printHistorialEgresos = () => {
        const { egresos, activePage, itemsPerPage } = this.state
        return(
            <div>
                <div className="table-responsive-lg mt-4">
                    <table className="table table-vertical-center mx-auto table-borderless tcalendar_p_info" >
                        <thead className="bg-primary-o-30">
                            <tr>
                                <td>
                                    IDENTIFICADOR
                                </td>
                                <td>
                                    MONTO
                                </td>
                                <td>
                                    FECHA
                                </td>
                            </tr>
                        </thead>
                        <tbody className = 'text-center'>
                            { 
                                egresos.length  ?
                                    egresos.map((egreso, key) => {
                                        let limiteInferior = (activePage - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                        if (egresos.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior)){
                                            return(
                                                <tr key = {egreso.id}>
                                                    <td>
                                                        <a href = {`/administracion/egresos?id=${egreso.id}`}>
                                                            {egreso.id}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        { setMoneyText(egreso.total) }
                                                    </td>
                                                    <td>
                                                        { setDateText(egreso.created_at) }
                                                    </td>
                                                </tr>
                                            )
                                        }else{
                                            return false
                                        }
                                    })
                                :
                                    <tr>
                                        <td colSpan = '3' >
                                            Sin datos
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    egresos.length > itemsPerPage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                innerClass="pagination mb-0"
                                itemClass="page-item"
                                firstPageText='Primero'
                                lastPageText='Último'
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={egresos.length}
                                pageRangeDisplayed={5}
                                onChange={this.onChangePage.bind(this)}
                                itemClassLast="d-none"
                                itemClassFirst="d-none"
                                prevPageText={<i className='ki ki-bold-arrow-back icon-xs text-table-utilidad' />}
                                nextPageText={<i className='ki ki-bold-arrow-next icon-xs text-table-utilidad' />}
                                linkClassPrev="btn btn-icon btn-sm btn-light-utilidad mr-2 my-1 pagination"
                                linkClassNext="btn btn-icon btn-sm btn-light-utilidad mr-2 my-1 pagination"
                                linkClass="btn btn-icon btn-sm border-0 btn-hover-utilidad mr-2 my-1 pagination"
                                activeLinkClass="btn btn-icon btn-sm border-0 btn-utilidad btn-hover-utilidad mr-2 my-1 pagination"
                            />
                        </div>
                        : ''
                }
            </div>
            
        )
    }

    render() {
        const { egresos, active } = this.state
        return (
            <div className="container">
                {
                    egresos.length ?
                        <div className="d-flex justify-content-end mt-4">
                            <Button icon = '' onClick = { this.changeTab } className = "btn btn-light-info"  
                                text = { active === 'historial' ? 'GENERAR EGRESO' :  'VER HISTORIAL' } 
                                tooltip= { { text: active === 'historial' ? 'GENERAR EGRESO' :  'VER HISTORIAL' } } />
                        </div>
                    : ''
                }
                {
                    active === 'historial' ?
                        this.printHistorialEgresos()
                    :
                        this.printFormularioEgreso()
                }
            </div>
        )
    }
}

export default PrestacionesEgresos