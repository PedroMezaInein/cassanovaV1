import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { printResponseErrorAlert, waitAlert } from '../../../../functions/alert'
import { apiGet, catchErrors } from '../../../../functions/api'
import { setMoneyText, setDateText } from '../../../../functions/setters'
import { Button, InputMoneyGray } from '../../../form-components'
import Pagination from "react-js-pagination"

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
                <div className="row mx-0 justify-content-center">
                    {
                        colaboradores.map((colaborador, id) => {
                            let flag = id + 1 === colaboradores.length && id % 2 === 0
                            return(
                                <div className={`col-md-${flag ? 12 : 6} mt-4 border-dashed border-top-0 border-left-0 border-right-0`} key  = { id } >
                                    <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                                        withformgroup = { 1 } requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } 
                                        prefix = '$' name = { id } value = { colaborador.costo } onChange = { this.onChange } 
                                        placeholder = { colaborador.nombre } iconclass = "la la-money-bill icon-xl" />
                                </div>
                            )
                        })
                    }
                </div>
                <div className="row mx-0 justify-content-around">
                    <div className = 'col-md-4'>
                        <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } placeholder = 'TOTAL'
                            withformgroup = { 1 } requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } prefix = '$'
                            value = { suma } disabled onChange = { () => {} } customclass = 'bg-light-success text-white'/>
                    </div>
                    <div className="col-md-4 d-flex align-items-center">
                        <Button icon = '' onClick = { this.onSubmit } className = "btn btn-light-primary"  text = 'CONTINUAR'
                            tooltip={{text:'CONTINUAR'}} />
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