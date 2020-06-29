import React, {Component} from 'react'
import { Card } from '../../singles'
import { P, Small, B } from '../../texts'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'

export default class SolicitudCompraCard extends Component{
    render(){
        const { data, children } = this.props
        return(
            <Card className="mx-md-5 my-3">
                <div className="row mx-0">
                    <div className="col-md-12 mb-3">
                        <P className="text-center" color="gold">
                            Solicitud de venta
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
                        data.empresa ?
                            <div className="col-md-6">
                                <Small>
                                    <B color="gold">
                                        Empresa:
                                    </B>
                                </Small>
                                <br />
                                <Small color="dark-blue">
                                    {
                                        data.empresa.name
                                    }
                                </Small>
                                <hr />
                            </div>
                        : ''
                    }
                    {
                        data.monto ?
                            <div className="col-md-6">
                                <Small>
                                    <B color="gold">
                                        Monto:
                                    </B>
                                </Small>
                                <br />
                                <NumberFormat value = { data.monto } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                                    renderText = { value => <Small color="dark-blue"> { value } </Small> } />
                                <hr />
                            </div>
                        : ''
                    }
                    <div className="col-md-6">
                        <Small>
                            <B color="gold">
                                Factura:
                            </B>
                        </Small>
                        <br />
                        <Small color="dark-blue">
                            {
                                data.factura ? 'Con factura' : 'Sin factura'
                            }
                        </Small>
                        <hr />
                    </div>
                    {
                        data.tipo_pago ?
                            <div className="col-md-6">
                                <Small>
                                    <B color="gold">
                                        Tipo de pago:
                                    </B>
                                </Small>
                                <br />
                                <Small color="dark-blue">
                                    {
                                        data.tipo_pago.tipo
                                    }
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
                            <div className="col-md-6">
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