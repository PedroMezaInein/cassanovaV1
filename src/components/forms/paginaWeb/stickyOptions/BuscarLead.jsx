import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import { dayDMY } from '../../../../functions/setters'
import { InputGray, Button } from '../../../form-components'

class BuscarLead extends Component {

    state = {
        active: 1,
        itemsPerPage: 3
    }

    onChangePage = (pageNumber) => { this.setState({ ...this.state, active: pageNumber }) }

    render() {
        const { form, onChange, onSubmit, leads, changePageDetails } = this.props
        const { active, itemsPerPage } = this.state
        return (
            <>
                <Form onSubmit={onSubmit} >
                    <div className="row mx-0 row-paddingless d-flex justify-content-center align-self-center my-6">
                        <div className="col-md-5">
                            <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={1}
                                withformgroup={0} placeholder='NOMBRE DEL LEAD' iconclass="far fa-user"
                                name='name' value={form.name} onChange={onChange} />
                        </div>
                        <div className="col-md-2 d-flex justify-content-center align-self-center mt-5 mt-lg-0">
                            <Button icon='' className="btn-light-info font-weight-bolder" onClick={onSubmit} text="BUSCAR" />
                        </div>
                    </div>
                </Form>
                <div className="separator separator-solid"></div>
                <div className="tab-content mt-9">
                    <div className="table-responsive-lg">
                        <table className="table table-head-custom  table-borderless table-vertical-center table-crm-buscar">
                            <thead className="bg-light text-center">
                                <tr>
                                    <th className="bg-light text-left"><span className="text-dark-75">Nombre y fecha</span></th>
                                    <th><span className="text-dark-75">Origen</span></th>
                                    <th><span className="text-dark-75">Estatus</span></th>
                                    <th><span className="text-dark-75">Empresa</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.length === 0 ?
                                        <tr>
                                            <td colSpan='4' className='text-center pb-0'>
                                                <span className="text-muted font-weight-bold d-block font-size-lg mt-1">
                                                    Sin datos
                                                </span>
                                            </td>
                                        </tr>
                                        :
                                        leads.map((lead, key) => {
                                            let limiteInferior = (active - 1) * itemsPerPage
                                            let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                            if (leads.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior))
                                                return (
                                                    <tr key={lead.id}>
                                                        <td className="pl-0">
                                                            <div className="d-flex align-items-center">
                                                                <div className="symbol symbol-60 mr-3">
                                                                    <span className="symbol-label font-size-lg bg-light text-dark-75">
                                                                        {lead.nombre.charAt(0)}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-dark-75 font-weight-bolder text-hover-primary font-size-lg cursor-pointer " onClick={(e) => { changePageDetails(lead) }}>{lead.nombre}</span>
                                                                    <span className="text-muted font-weight-bold d-block font-size-sm mt-2">
                                                                        <span className="text-dark-75 font-weight-bolder">
                                                                            Ingreso:
                                                                        </span>
                                                                        <span>&nbsp;
                                                                            {dayDMY(lead.created_at)}
                                                                        </span>
                                                                        {
                                                                            lead.prospecto ?
                                                                                lead.prospecto.contactos ?
                                                                                    lead.prospecto.contactos.length ?
                                                                                        <div>
                                                                                            <span className="text-dark-75 font-weight-bolder">
                                                                                                U.Contacto:
                                                                                            </span>
                                                                                            <span>&nbsp;
                                                                                                {dayDMY(lead.prospecto.contactos[0].created_at)}
                                                                                            </span>
                                                                                        </div>
                                                                                        : ''
                                                                                    : ''
                                                                                : ''
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center font-size-sm font-weight-bolder">
                                                            <span className="label-origen">
                                                                {lead.origen ? lead.origen.origen : '-'}
                                                            </span>
                                                        </td>
                                                        <td className="text-center font-size-lg font-weight-bolder">
                                                            {
                                                                lead.prospecto ?
                                                                    lead.prospecto.estatus_prospecto ?
                                                                        <span className="label-status"
                                                                            style={{
                                                                                color: lead.prospecto.estatus_prospecto.color_texto,
                                                                                backgroundColor: lead.prospecto.estatus_prospecto.color_fondo
                                                                            }} >
                                                                            {lead.prospecto.estatus_prospecto.estatus}
                                                                        </span>
                                                                        : '-'
                                                                    : '-'
                                                            }
                                                        </td>
                                                        <td className="text-center font-size-lg font-weight-bolder pr-0">
                                                            {
                                                                lead.empresa.isotipos.length > 0 ?
                                                                    lead.empresa.isotipos.map((isotipo, key) => {
                                                                        return (
                                                                            <img alt="Pic" src={isotipo.url} className="w-isotipo" key={key} />
                                                                        )
                                                                    })
                                                                    : <span className="text-dark-75 font-weight-bolder">{lead.empresa.name}</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            return ''
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    leads ?
                        leads.length > itemsPerPage ?
                            <div className="d-flex justify-content-center pagination-ul">
                                <Pagination
                                    itemClass="page-item"
                                    firstPageText='Primero'
                                    lastPageText='Último'
                                    activePage={active}
                                    itemsCountPerPage={itemsPerPage}
                                    totalItemsCount={leads.length}
                                    pageRangeDisplayed={4}
                                    onChange={this.onChangePage.bind(this)}
                                    itemClassLast="d-none"
                                    itemClassFirst="d-none"
                                    prevPageText={<i className='ki ki-bold-arrow-back icon-xs' />}
                                    nextPageText={<i className='ki ki-bold-arrow-next icon-xs' />}
                                    linkClassPrev="btn btn-icon btn-sm btn-light-info mr-2 my-1 pagination"
                                    linkClassNext="btn btn-icon btn-sm btn-light-info mr-2 my-1 pagination"
                                    linkClass="btn btn-icon btn-sm border-0 btn-hover-info mr-2 my-1 font-weight-bolder pagination"
                                    activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-info active mr-2 my-1 pagination"
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