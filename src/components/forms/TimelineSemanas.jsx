import React, { Component } from 'react'
import { diffCommentDate } from '../../functions/functions'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import { printComentario,printComentarioSemana } from '../../functions/printers'

class TimelineSemanas extends Component {
 
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
        const { semanasObj, color, col, proyectos } = this.props
        return (
            <div>
                {
                semanasObj &&
                    <div className="col-md-12 mx-0 row d-flex justify-content-center">
                        <div className={`col-md-8 mt-8 px-0`}>
                            {
                                semanasObj && 
                                semanasObj.semanas_proyectos &&
                                semanasObj.semanas_proyectos.map((comentario, key) => {
                                    return (
                                        <div key={key} className="form-group row form-group-marginless">
                                            <div className="col-md-12 px-0">
                                                <div className="timeline timeline-3">
                                                    <div className="timeline-items">
                                                        <div className="timeline-item">
                                                            <div className="timeline-media border-0">
                                                                <div className = 'position-relative'>
                                                                    {/* { this.isSameComment(comentario) ? <span className = 'dot-2 bg-danger' /> : <></> } */}
                                                                    <img alt="Pic" src="/default.jpg" />
                                                                </div>
                                                            </div>
                                                            <div className="timeline-content">
                                                                {/* <span className={`text-${color} font-weight-bolder`}>{comentario.user.name}</span> */}
                                                                <span className="text-muted ml-2 font-weight-bold {`text-${color} ">
                                                                    {diffCommentDate(comentario.fecha_inicio)}
                                                                </span>
                                                                <p className={`p-0 font-weight-light text-transform-none line-break-anywhere  text-justify mb-0`}>
                                                                    { printComentarioSemana(comentario.semana, proyectos) }
                                                                </p>

                                                                <p className={`p-0 font-weight-light text-transform-none line-break-anywhere  text-justify mb-0`}>
                                                                    Porcentaje programado {comentario.programado}%
                                                                </p>
                                                                <p className={`p-0 font-weight-light text-transform-none line-break-anywhere  text-justify mb-0`}>
                                                                    Porcentaje ejecutado {comentario.ejecutado}%
                                                                </p>
                                                                
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

export default TimelineSemanas