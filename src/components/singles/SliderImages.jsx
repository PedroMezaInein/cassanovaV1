import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
class SliderImages extends Component {
    state = {
        active: 0
    }
    sliderBack = () => {
        const { elements } = this.props
        let { active } = this.state
        if (active === 0)
            active = elements.length - 1
        else
            active = active - 1
        this.setState({
            ...this.state,
            active
        })
    }
    sliderNext = () => {
        const { elements } = this.props
        let { active } = this.state
        if (active === elements.length - 1)
            active = 0
        else
            active = active + 1
        this.setState({
            ...this.state,
            active
        })
    }
    render() {
        const { active } = this.state
        const { elements } = this.props
        if(elements.length > 0)
        return (
            <>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderBack(); }}>
                        <div className="btn btn-default font-weight-bold small-button">
                            <span className="svg-icon svg-icon-lg mr-0">
                                <SVG src={toAbsoluteUrl('/images/svg/double-arrow-left.svg')} />
                            </span>
                        </div>
                    </div>
                    <div className="w-50 text-center mx-6">
                        {
                            elements[active].descripcion ?
                                <>
                                    <div>
                                        <img alt = '' src={elements[active].adjunto.url} className="rounded pdfview-img"/>
                                         <a href={elements[active].adjunto.url} class="text-muted text-hover-primary font-weight-bold" target="_blank"> Ver imagen</a>
                                    </div>
                                </>
                                : ''
                        }
                    </div>
                    <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderNext(); }}>
                        <div className="btn btn-default font-weight-bold small-button">
                            <span className="svg-icon svg-icon-lg mr-0">
                                <SVG src={toAbsoluteUrl('/images/svg/double-arrow-right.svg')} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="font-weight-light font-size-lg mt-4 text-justify px-4">
                    <div className="mb-4 text-center"><span className="font-weight-bold">PORCENTAJE DE AVANCE:</span> {elements[active].avance}%</div>
                    {
                        elements[active].descripcion
                    }
                </div>
            </>
        )
        else return(
            <></>
        )
    }
}

export default SliderImages