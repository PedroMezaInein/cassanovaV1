import React, { Component } from 'react'
import { InputGray, Button } from '../../form-components'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import Moment from 'react-moment'
import Pagination from 'react-js-pagination';

class BuscarLead extends Component {

    state = {
        active: 1,
        itemsPerPage: 3
    }

    onChangePage = (pageNumber) => { this.setState({ ...this.state, active: pageNumber }) }

    render() {
        const { form, onChange, onSubmit, leads } = this.props
        const { active, itemsPerPage } = this.state
        return (
            <>
                <Form onSubmit={onSubmit} >
                    <div className="form-group row form-group-marginless mt-4 mb-0 mx-0 d-flex justify-content-center align-self-center">
                        <div className="col-md-8">
                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                withformgroup = { 1 } placeholder = 'NOMBRE DEL LEAD' iconclass = "far fa-user"
                                name='name' value = { form.name } onChange = { onChange } />
                        </div>
                        <div className="col-md-2 d-flex justify-content-center align-self-center">
                            <div className="mt-3">
                                <Button icon='' className="btn btn-primary mr-2" onClick={onSubmit} text="BUSCAR" />
                            </div>
                        </div>
                    </div>
                </Form>
                <div class="separator separator-solid"></div>

                <div className="tab-content mt-9">
                    <div className="table-responsive-lg">
                        <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                            <thead>
                                <tr className="text-uppercase">
                                    <th style={{ minWidth: "100px" }}>
                                        <span className="text-dark-75 font-size-lgsm">Nombre y fecha</span>
                                    </th>
                                    <th className="text-center">Origen</th>
                                    <th className="text-center">Estatus</th>
                                    <th className="text-center">Empresa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.length === 0 ?
                                        <tr>
                                            <td colSpan = '4' className = 'text-center'>
                                                <span className="text-muted font-weight-bold d-block font-size-sm mt-1">
                                                    Sin datos
                                                </span>
                                            </td>
                                        </tr>
                                    : ''
                                }
                                {
                                    leads.map((lead, key) => {
                                        let limiteInferior = (active - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                        if(leads.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                            return(
                                                <tr key = { lead.id } >
                                                    <td className="pl-0 py-8">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-60 mr-3">
                                                                <span className="symbol-label font-size-h5 bg-light text-dark-75">
                                                                    { lead.nombre.charAt(0) }
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-dark-75 font-weight-bolder text-hover-ping font-size-6">{lead.nombre}</span>
                                                                <span className="text-muted font-weight-bold d-block font-size-sm mt-1">
                                                                    <span className="text-dark-75 font-weight-bolder">
                                                                        Ingreso: 
                                                                    </span>
                                                                    <span>
                                                                        <Moment format="YYYY/MM/DD">
                                                                            {lead.created_at}
                                                                        </Moment>
                                                                    </span>
                                                                    {
                                                                        lead.prospecto ?
                                                                            lead.prospecto.contactos ?
                                                                                lead.prospecto.contactos.length ?
                                                                                    <>
                                                                                        <span className="text-dark-75 font-weight-bolder">
                                                                                            U.Contacto: 
                                                                                        </span>
                                                                                        <span>
                                                                                            <Moment format="YYYY/MM/DD">
                                                                                                {lead.prospecto.contactos[0].created_at}
                                                                                            </Moment>
                                                                                        </span>
                                                                                    </>
                                                                                : ''
                                                                            : ''
                                                                        : ''
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center font-size-lg font-weight-bolder">
                                                        { lead.origen ? lead.origen.origen : '-'}
                                                    </td>
                                                    <td className="text-center font-size-lg font-weight-bolder">
                                                        {
                                                            lead.prospecto ? 
                                                                lead.prospecto.estatus_prospecto ?
                                                                    <span className="label label-md label-inline font-weight-bold" 
                                                                        style = {{
                                                                            color: lead.prospecto.estatus_prospecto.color_texto,
                                                                            backgroundColor: lead.prospecto.estatus_prospecto.color_fondo
                                                                        }} >
                                                                        {lead.prospecto.estatus_prospecto.estatus}
                                                                    </span>
                                                                    /* lead.prospecto.estatus_prospecto.estatus */
                                                                : '-'
                                                            : '-'
                                                        }
                                                    </td>
                                                    <td className="text-center font-size-lg font-weight-bolder">
                                                        {
                                                            lead.empresa ?
                                                                lead.empresa.logo_principal ?
                                                                    lead.empresa.logo_principal.length ?
                                                                        <div className = 'row mx-0 justify-content-center'>
                                                                            <div className="col-md-9 col-lg-7">
                                                                                <img alt = 'LOGO EMPREAS' src = { lead.empresa.logo_principal[0].url} className = 'img-fluid'/>
                                                                            </div>
                                                                        </div>
                                                                    : lead.empresa.name
                                                                : lead.empresa.name
                                                            : '-'
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    leads ? 
                        leads.length > itemsPerPage ?
                            <div className="d-flex justify-content-center my-2">
                                <Pagination itemClass = "page-item" linkClass = "page-link" firstPageText = 'Primero'
                                    lastPageText = 'Último' activePage = { active } itemsCountPerPage = { itemsPerPage }
                                    totalItemsCount = { leads.length } pageRangeDisplayed = { 3 } onChange = { this.onChangePage.bind(this) }
                                    itemClassLast = "d-none" itemClassFirst = "d-none" nextPageText = '>' prevPageText = '<'
                                />
                            </div>
                        : ''
                    : ''
                }
            </>
        )
    }
}

export default BuscarLead