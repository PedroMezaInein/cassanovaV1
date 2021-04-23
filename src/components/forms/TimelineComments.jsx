import React, { Component } from 'react'
import { diffCommentDate, replaceAll } from '../../functions/functions'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"

class TimelineComments extends Component {

    indexSubcadena = (cadena, prefixA, prefixB) => {
        let indiceA = cadena.indexOf(prefixA)
        let indiceB = cadena.indexOf(prefixB)
        if(indiceA === indiceB === -1)
            return -1
        if(indiceA === -1)
            return indiceB
        if(indiceB === -1)
            return indiceA
        if(indiceA < indiceB)
            return indiceA
        return indiceB
        
    }

    setLink = texto => {
        const { proyectos } = this.props
        let value = proyectos.find( (elemento) => {
            return elemento.display === texto
        })
        let liga = '/proyectos/proyectos'
        if(value)
            liga = `${liga}?id=${value.id}&name=${value.name}`
        return liga
    }

    printComentario = texto => {
        let indice = this.indexSubcadena(texto, '___', '***')
        let arrayAux = [];
        if(indice === -1)        
            return(
                <span>
                    {texto}
                </span>
            )
        let subcadena = texto
        let final = 0
        let inicio = indice + 3
        let flag = ''
        let prefix = ''
        while(indice !== -1){
            inicio = indice + 3
            switch(this.indexSubcadena(subcadena, '___', '***')){
                case subcadena.indexOf('___'):
                    flag = 'black';
                    break
                case subcadena.indexOf('***'):
                    flag = 'info';
                    break
                case -1:
                    flag = 'none'
                    break
                default: break;
            }
            if(flag !== 'none'){
                prefix = flag === 'black' ? '___' : '***'
                arrayAux.push({
                    texto: replaceAll(subcadena.substring(final, inicio), prefix, ''),
                    tipo: 'normal'
                })
                final = subcadena.indexOf(prefix, inicio)
                arrayAux.push({
                    texto: subcadena.substring(inicio, final),
                    tipo: flag
                })
                subcadena = subcadena.substring(final+3)
                indice = this.indexSubcadena(subcadena, '___', '***')
                final = 0
            }
        }
        if(subcadena)
            arrayAux.push({
                texto: subcadena,
                tipo: 'normal'
            })
        return arrayAux.map((elemento, index) => {
            if(elemento.tipo === 'info'){
                return(
                    <span className = 'font-weight-bolder text-info' key = { index }>
                        <a rel="noreferrer" href = {this.setLink(elemento.texto)} className = 'font-weight-bolder text-info' target = '_blank'>
                            {elemento.texto}
                        </a>
                    </span>
                )
            }
            return (
                <span key = { index } className = {` ${elemento.tipo ==='black' ? 'font-weight-bolder text-success' : ''}`}>
                    { elemento.texto }
                </span>
            )
        })
    }

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
                                                                <p className={`p-0 0 font-weight-light text-transform-none ${comentario.adjunto === null ? "text-justify mb-0" : "text-justify"}`}>
                                                                    {/* {comentario.comentario} */}
                                                                    {
                                                                        this.printComentario(comentario.comentario)
                                                                    }
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
            </>
        )
    }
}

export default TimelineComments