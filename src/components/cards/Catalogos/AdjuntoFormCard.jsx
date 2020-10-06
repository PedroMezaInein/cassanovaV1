import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { ItemSlider } from '../../singles'
export default class AdjuntoFormCard extends Component {
    render() {
        const { adjunto } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    adjunto.empresa ?
                                        <p className="font-size-h3 mb-0">EMPRESA:&nbsp;<strong className="font-size-h4">{adjunto.empresa.name}</strong></p>
                                        : ''
                                }
                                {
                                    adjunto.tipo_adjunto ?
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">TIPO DE ADJUNTO:&nbsp;<strong className="font-size-h6"> {adjunto.tipo_adjunto.nombre}</strong> </p>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        {
                            adjunto.adjunto ?
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-6">
                                        <ItemSlider items={[adjunto.adjunto]} item='' />
                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                </Card>
            </div>
        )
    }
}