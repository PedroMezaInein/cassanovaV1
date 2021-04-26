import React, { Component } from 'react'
import { diffCommentDate } from '../../../../functions/functions'
import { printComentario } from '../../../../functions/printers'

class CommentsPanel extends Component {

    render() {
        const { tarea, proyectos } = this.props
        if(tarea)
            return (
                <div>
                    {
                        tarea.comentarios.map((comentario) => {
                            return(
                                <div className="cursor-pointer toggle-off mt-6"  key = { comentario.id}>
                                    <div className="d-flex align-items-start card-spacer-x bg-comment">
                                        <div className="symbol symbol-35 mr-3 align-self-center">
                                            <span className="symbol-label" style={{ backgroundImage: `url(${comentario.user.avatar ? comentario.user.avatar : "/default.jpg"})` }}></span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 flex-wrap mr-2">
                                            <div className="d-flex">
                                                <div className="font-weight-bolder text-primary mr-2">
                                                    { comentario.user.name }
                                                </div>
                                                <div className="font-weight-bold text-muted">
                                                    { diffCommentDate(comentario) }
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="text-muted font-weight-bold line-break-anywhere text-justify">
                                                    { printComentario(comentario.comentario, proyectos) }
                                                </div>
                                                {
                                                    comentario.adjunto &&
                                                        <div className="d-flex flex-column font-size-sm font-weight-bold ">
                                                            <a rel="noreferrer" href = { comentario.adjunto.url } target = '_blank' className="d-flex align-items-center text-muted text-hover-primary py-1 justify-content-flex-end">
                                                                <span className="flaticon2-clip-symbol text-primary icon-1x mr-2"></span>
                                                                {comentario.adjunto.name}
                                                            </a>
                                                        </div>
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        return <></>
    }
}

export default CommentsPanel