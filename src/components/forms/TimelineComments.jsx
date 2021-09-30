import React, { Component } from 'react'
import { diffCommentDate } from '../../functions/functions'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import { printComentario } from '../../functions/printers'

class TimelineComments extends Component {

    isSameComment = (comentario) => {
        const { comentarioId } = this.props
        if(comentarioId){
            if(comentarioId.toString() === comentario.id.toString()){
                return true
            }
        }
        return false
    }

    render() {
        const { comentariosObj, color, col, proyectos } = this.props
        return (
            <div>
                {
                comentariosObj &&
                    <div className="col-md-12 mx-0 row d-flex justify-content-center">
                        <div className={`col-md-${col} mt-8 px-0`}>
                            {
                                comentariosObj.comentarios.length > 0 &&
                                comentariosObj.comentarios.map((comentario, key) => {
                                    return (
                                        <div key={key} className="form-group row form-group-marginless">
                                            <div className="col-md-12 px-0">
                                                <div className="timeline timeline-3">
                                                    <div className="timeline-items">
                                                        <div className="timeline-item">
                                                            <div className="timeline-media border-0">
                                                                <div className = 'position-relative'>
                                                                    { this.isSameComment(comentario) ? <span className = 'dot-2 bg-danger' /> : <></> }
                                                                    <img alt="Pic" src={comentario.user.avatar ? comentario.user.avatar : "/default.jpg"} />
                                                                </div>
                                                            </div>
                                                            <div className="timeline-content">
                                                                <span className={`text-${color} font-weight-bolder`}>{comentario.user.name}</span>
                                                                <span className="text-muted ml-2 font-weight-bold">
                                                                    {diffCommentDate(comentario)}
                                                                </span>
                                                                <p className={`p-0 font-weight-light text-transform-none line-break-anywhere ${comentario.adjunto === null ? "text-justify mb-0" : "text-justify"}`}>
                                                                    { printComentario(comentario.comentario, proyectos) }
                                                                </p>
                                                                {
                                                                    comentario.adjunto ?
                                                                        <div className="d-flex justify-content-end">
                                                                            <a href={comentario.adjunto.url} target='_blank' rel="noopener noreferrer" className={`text-muted text-hover-${color} font-weight-bold`}>
                                                                                <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
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
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default TimelineComments