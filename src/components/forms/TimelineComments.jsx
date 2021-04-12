import React, { Component } from 'react'
import { diffCommentDate } from '../../functions/functions'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"

class TimelineComments extends Component {
    render() {
        const { comentariosObj, color, col } = this.props
        return (
            <>
                {
                    comentariosObj &&
                    <div className="col-md-12 mx-0 row d-flex justify-content-center">
                        <div className={`col-md-${col} mt-8`}>
                            {
                                comentariosObj.comentarios.length > 0 &&
                                comentariosObj.comentarios.map((comentario, key) => {
                                    return (
                                        <div key={key} className="form-group row form-group-marginless">
                                            <div className="col-md-12">
                                                <div className="timeline timeline-3">
                                                    <div className="timeline-items">
                                                        <div className="timeline-item">
                                                            <div className="timeline-media border-0">
                                                                <img alt="Pic" src={comentario.user.avatar ? comentario.user.avatar : "/default.jpg"} />
                                                            </div>
                                                            <div className="timeline-content">
                                                                <span className={`text-${color} font-weight-bolder`}>{comentario.user.name}</span>
                                                                <span className="text-muted ml-2 font-weight-bold">
                                                                    {diffCommentDate(comentario)}
                                                                </span>
                                                                <p className={comentario.adjunto === null ? "p-0 font-weight-light text-justify mb-0" : "p-0 font-weight-light text-justify"}>{comentario.comentario}</p>
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
            </>
        )
    }
}

export default TimelineComments