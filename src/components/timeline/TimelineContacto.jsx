import React, { Component } from 'react'
import { setContactoIcon, setDateTableLG } from '../../functions/setters'
import SVG from 'react-inlinesvg'
import { Attachment } from '../../assets'
import { deleteAlert, doneAlert, printResponseErrorAlert } from '../../functions/alert'
import { apiDelete, catchErrors } from '../../functions/api'

class TimeLineContacto extends Component{

    eliminarContacto = contacto => {
        const { refresh, at, lead } = this.props
        apiDelete(`crm/prospecto/${lead.id}/contacto/${contacto.id}`, at).then((response) => {
            doneAlert(`Registro de contacto eliminado con éxito`, () => { refresh() } )
        }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }   

    render(){
        const { contacto, index } = this.props
        return(
            <div className="timeline timeline-6" key = { index } >
                <div className = 'timeline-items'>
                    <div className = 'timeline-item'>
                        <div className = {`timeline-media bg-light-${contacto.success ? 'success' : 'danger'}` } >
                            <span className = { `svg-icon svg-icon-md svg-icon-${contacto.success ? 'success' : 'danger'}`}>
                                { setContactoIcon(contacto) }
                            </span>
                        </div>
                        <div className = { `timeline-desc timeline-desc-light-${contacto.success ? 'success' : 'danger'}` } >
                            <span className = { `font-weight-bolder text-${contacto.success ? 'success' : 'danger'}`} >
                                { setDateTableLG(contacto.created_at) }
                            </span>
                            <div className="font-weight-light pb-2 text-justify position-relative mt-2 pr-3" 
                                style={{ borderRadius: '0.42rem', padding: '1rem 1.5rem', backgroundColor: '#F3F6F9' }}>
                                <div className = "text-dark-75 font-weight-bold mb-2">
                                    <div className = "d-flex justify-content-between">
                                        { contacto.tipo_contacto ? contacto.tipo_contacto.tipo : '' }
                                        <span className="text-muted text-hover-danger font-weight-bold a-hover"
                                            onClick = { (e) => { deleteAlert(
                                                `Eliminarás el registro del contacto`,
                                                `¿Deseas continuar?`,
                                                () => { this.eliminarContacto(contacto) }
                                            ) } }>
                                            <i className="flaticon2-cross icon-xs" />
                                        </span>
                                    </div>
                                </div>
                                { contacto.comentario }
                                <span className="blockquote-footer font-weight-lighter ml-2 d-inline">
                                    {contacto.user.name}
                                </span>
                                {
                                    contacto.adjunto ?
                                        <div className="d-flex justify-content-end mt-1">
                                            <a href={contacto.adjunto.url} target='_blank' rel="noopener noreferrer" 
                                                className="text-muted text-hover-primary font-weight-bold">
                                                <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                    <SVG src = { Attachment } />
                                                </span>VER ADJUNTO
                                            </a>
                                        </div>
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TimeLineContacto