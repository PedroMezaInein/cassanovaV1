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
        itemsPerPage: 5,
        order: {
            direction: null,
            column: null
        }
    }

    componentDidMount = () => {
        this.getInfoPrestacion()
    }

    getInfoPrestacion = () => {
        const { prestacion, at } = this.props
        const { order } = this.state
        waitAlert()
        apiGet(`v1/rh/prestaciones/${prestacion.id}/egresos`, at).then(
            (response) => {
                let { colaboradores, egresos } = response.data
                colaboradores.forEach((colaborador) => {
                    colaborador.costo = prestacion.pago_por_empleado
                })
                if(order.direction !== null && order.column !== null){
                    egresos.sort(function (a, b) {
                        if (a[order.column] > b[order.column]) {
                            if(order.direction === 'asc')
                                return 1;
                            else 
                                return -1;
                        }
                        if (a[order.column] < b[order.column]) {
                            if(order.direction === 'asc')
                                return -1;
                            else 
                                return 1;
                        }
                        return 0;
                    });   
                }
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
                        <div className="px-9 pt-7 card-rounded h-225px w-100 bg-primary2">
                            <div className="d-flex flex-stack justify-content-center">
                                <h3 className="m-0 text-white font-weight-bolder font-size-h4">Colaboradores asignados</h3>
                            </div>
                            <div className="d-flex text-center flex-column text-white pt-4">
                                <span className="font-weight-bolder font-size-lg">Total</span>
                                <span className="font-weight-bolder font-size-h2 pt-1">{setMoneyTableSinSmall(suma)}</span>
                            </div>
                        </div>
                        <div className="bg-white box-shadow-34 card-rounded mx-9 mb-4 px-9 pt-9 pb-6 position-relative z-index-1 mt-n-100px">
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

    resort = columna => {
        const { order } = this.state
        let { egresos } = this.state
        if(order.column === columna){
            order.direction = order.direction === 'asc' ? 'desc' : 'asc'
        }else{
            order.column = columna
            order.direction = 'asc'
        }
        egresos.sort(function (a, b) {
            if (a[order.column] > b[order.column]) {
                if(order.direction === 'asc')
                    return 1;
                else 
                    return -1;
            }
            if (a[order.column] < b[order.column]) {
                if(order.direction === 'asc')
                    return -1;
                else 
                    return 1;
            }
            return 0;
        })
        this.setState({
            ...this.state,
            order,
            egresos: egresos
        })
    }

    printSortIcon = columna => {
        const { order } = this.state
        if(order.direction === null && order.column === null){
            return <i className = 'flaticon2-up text-primary2 icon-sm' onClick = { () => this.resort(columna) } />
        }else{
            if(order.column === columna){
                if(order.direction === 'asc'){
                    return <i className = 'flaticon2-up text-primary2 icon-sm'  onClick = { () => this.resort(columna) } />
                }else{
                    return <i className = 'flaticon2-down text-primary2 icon-sm'  onClick = { () => this.resort(columna) } />    
                }
            }else{
                return <i className = 'flaticon2-up text-primary2 icon-sm'  onClick = { () => this.resort(columna) } />
            }
        }
    }

    printHistorialEgresos = () => {
        const { egresos, activePage, itemsPerPage } = this.state
        return(
            <div>
                <div className="table-responsive-lg mt-4">
                    <table className="table table-vertical-center w-80 mx-auto" >
                        <thead className="bg-light-primary2 text-primary2">
                            <tr>
                                <td className="w-30">
                                    <div className = 'd-flex justify-content-around'>
                                        <span>
                                            IDENTIFICADOR
                                        </span>
                                        <span className = 'text-hover'>
                                            { this.printSortIcon('id') }
                                        </span>
                                    </div>
                                </td>
                                <td className="w-30">
                                    <div className = 'd-flex justify-content-around'>
                                        <span>
                                            MONTO
                                        </span>
                                        <span className = 'text-hover'>
                                            { this.printSortIcon('total') }
                                        </span>
                                    </div>
                                </td>
                                <td className="w-30">
                                    <div className = 'd-flex justify-content-around'>
                                        <span>
                                            FECHA
                                        </span>
                                        <span className = 'text-hover'>
                                            { this.printSortIcon('created_at') }
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody className = 'text-center font-weight-light'>
                            { 
                                egresos.length  ?
                                    egresos.map((egreso, key) => {
                                        let limiteInferior = (activePage - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                        if (egresos.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior)){
                                            return(
                                                <tr key = {egreso.id}>
                                                    <td>
                                                        <a href = {`/administracion/egresos?id=${egreso.id}`} className="font-weight-bold text-primary2">
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
                                prevPageText={<i className='ki ki-bold-arrow-back icon-xs text-primary2' />}
                                nextPageText={<i className='ki ki-bold-arrow-next icon-xs text-primary2' />}
                                linkClassPrev="btn btn-icon btn-sm btn-light-primary2 mr-2 my-1 pagination"
                                linkClassNext="btn btn-icon btn-sm btn-light-primary2 mr-2 my-1 pagination"
                                linkClass="btn btn-icon btn-sm border-0 btn-hover-primary2 mr-2 my-1 pagination"
                                activeLinkClass="btn btn-icon btn-sm border-0 btn-primary2 btn-hover-primary2 mr-2 my-1 pagination"
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
                        <div className={`d-flex justify-content-center ${active === 'historial'?'':'pb-3'}`}>
                            <Button icon = '' onClick = { this.changeTab } className = "btn btn-light btn-hover-primary2 font-weight-bolder"  
                                text = { active === 'historial' ? 'GENERAR EGRESO' :  'VER HISTORIAL' }
                            />
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