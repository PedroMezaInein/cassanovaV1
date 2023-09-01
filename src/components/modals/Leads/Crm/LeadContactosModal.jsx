import React, { Component } from 'react'
import { printContactCount } from '../../../../functions/printerss'
import { Button } from '../../../form-components'
import { HistorialContactoForm } from '../../../forms'
import { TimeLineContacto } from '../../../timeline'

import Modal from '../../Modal'
import Pagination from "react-js-pagination"
class LeadContactosModal extends Component{

    state = {
        flag: false,
        activePage: 1,
        itemsPerPage: 5
    }

    hasProspecto = (value, lead) => {
        let flag = false
        if(lead){
            if(lead.prospecto){
                flag = true
            }
        }
        if(flag){
            switch(value){
                case 'estatus':
                    if(lead.prospecto.estatus_prospecto)
                        flag = true
                    else flag = false
                    break;
                case 'contactos':
                    if(lead.prospecto.contactos){
                        if(lead.prospecto.contactos.length){
                            flag = true
                        }else flag = false
                    }else flag = false
                    break;
                default:
                    break;
            }
        }return flag
    }

    mostrarFormulario = () => {
        const { flag } = this.state
        this.setState({ ...this.state, flag: !flag })
    }
    
    refresh = () => {
        const { refresh } = this.props
        refresh()
        this.setState({ ...this.state, flag: false })
    }

    onChangePage(pageNumber){
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({ ...this.state, activePage })
    }

    render(){
        
        const { flag, activePage, itemsPerPage } = this.state
        const { lead, show, handleClose, at, options } = this.props
        
        return(
            <Modal show={show} handleClose={handleClose} size="xl" title='HISTORIAL DE CONTACTO'>
                {
                    this.hasProspecto('estatus', lead) ?
                        lead.prospecto.estatus_prospecto.estatus !== 'Cancelado' && lead.prospecto.estatus_prospecto.estatus !== 'Rechazado' ?
                            <div className="d-flex justify-content-end mt-4">
                                <Button icon='' className="btn btn-light-info font-weight-bolder p-2" 
                                    text = { `${flag ? 'Mostrar historial' : 'Nuevo contacto'} ` } 
                                    onClick = { this.mostrarFormulario } 
                                    only_icon = {`${flag ? 'flaticon-eye' : 'flaticon2-plus'} icon-13px mr-2`}/>
                            </div>
                        : ''
                    : ''
                }
                {
                    flag ?
                        <HistorialContactoForm refresh = { this.refresh } 
                            lead = { lead } at = { at } options = { options } classcalendar="col-md-7 mx-auto" classhora="col-md-5" />
                    :
                        <div className="row mx-0 justify-content-center">
                            <div className="col-md-7 pt-4">
                                {
                                    this.hasProspecto('contactos', lead) ?
                                        <div>
                                            {printContactCount(lead.prospecto.contactos)}
                                            { 
                                                lead.prospecto.contactos.map((contacto, key) => {
                                                    let limiteInferior = (activePage - 1) * itemsPerPage
                                                    let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                    if(contacto.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                                        return <div key = { key }>
                                                                <TimeLineContacto contacto = { contacto } index = { key } at = { at } 
                                                                    refresh = { this.refresh } lead = { lead } />
                                                            </div>
                                                    return <div key = { key }></div>
                                                })
                                            }
                                            {
                                                lead.prospecto.contactos.length > itemsPerPage ?
                                                    <div className="d-flex justify-content-center mt-4">
                                                        <Pagination 
                                                            itemClass="page-item"
                                                            firstPageText = 'Primero'
                                                            lastPageText = 'Último'
                                                            activePage = { activePage }
                                                            itemsCountPerPage = { itemsPerPage }
                                                            totalItemsCount = { lead.prospecto.contactos.length }
                                                            pageRangeDisplayed = { 5 }
                                                            onChange={this.onChangePage.bind(this)}
                                                            itemClassLast="d-none"
                                                            itemClassFirst="d-none"
                                                            prevPageText={<i className='ki ki-bold-arrow-back icon-xs'/>}
                                                            nextPageText={<i className='ki ki-bold-arrow-next icon-xs'/>}
                                                            linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                            linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                            linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                            activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination" />
                                                    </div>
                                                : ''
                                            }
                                            
                                        </div>
                                    : 
                                        <div className="text-center text-dark-75 font-weight-bolder font-size-lg">
                                            No se ha registrado ningún contacto
                                        </div>
                                }
                            </div>
                        </div>
                }
            </Modal>
            
        )
    }
}

export default LeadContactosModal