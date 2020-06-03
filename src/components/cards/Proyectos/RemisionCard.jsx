import React, {Component} from 'react'
import { Card } from '../../singles'
import { P, Small, B } from '../../texts'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'

export default class RemisionCard extends Component{
    render(){
        const { data, children } = this.props
        return(
            <Card className="mx-md-5 my-3">
                <div className="row mx-0">
                    <div className="col-md-12 mb-3">
                        <P className="text-center" color="gold">
                            Remisión
                        </P>
                    </div>
                    {
                        children
                    }
                    {
                        data.proyecto ?
                            <div className="col-md-6">
                                <Small>
                                    <B color="gold">
                                        Proyecto:
                                    </B>
                                </Small>
                                <br />
                                <Small color="dark-blue">
                                    {
                                        data.proyecto.nombre
                                    }
                                </Small>
                                <hr />
                            </div>
                        : ''
                    }
                    {
                        data.created_at ?
                            <div className="col-md-6">
                                <Small>
                                    <B color="gold">
                                        Fecha:
                                    </B>
                                </Small>
                                <br />
                                <Small color="dark-blue">
                                    <Moment format="DD/MM/YYYY">
                                        {data.created_at}
                                    </Moment>
                                </Small>
                                
                                <hr />
                            </div>
                        : ''
                    }
                    {
                        data.subarea ?
                            <>
                                {
                                    data.subarea.area ?
                                        <div className="col-md-6">
                                            <Small>
                                                <B color="gold">
                                                    Área:
                                                </B>
                                            </Small>
                                            <br />
                                            <Small color="dark-blue">
                                                {
                                                    data.subarea.area.nombre
                                                }
                                            </Small>
                                            <hr />
                                        </div>
                                    : ''
                                }
                                <div className="col-md-6">
                                    <Small>
                                        <B color="gold">
                                            Subarea:
                                        </B>
                                    </Small>
                                    <br />
                                    <Small color="dark-blue">
                                        {
                                            data.subarea.nombre
                                        }
                                    </Small>
                                    <hr />
                                </div>
                            </>
                        : ''
                    }
                    <div className="col-md-6">
                        <Small>
                            <B color="gold">
                                Adjunto:
                            </B>
                        </Small>
                        <br />
                        {
                            data.adjunto ?
                                <a href={data.adjunto.url} target="_blank">
                                    <Small>
                                        {
                                            data.adjunto.name
                                        }
                                    </Small>
                                </a>
                            :
                                <Small>
                                    Sin adjunto
                                </Small>
                        }
                        <hr />
                    </div>
                    {
                        data.descripcion ?
                            <div className="col-md-12">
                                <Small>
                                    <B color="gold">
                                        Descripción:
                                    </B>
                                </Small>
                                <br />
                                <Small color="dark-blue">
                                    {
                                        data.descripcion
                                    }
                                </Small>
                                <hr />
                            </div>
                        : ''
                    }
                    
                </div>
            </Card>
        )
    }
}