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
                    <div className="w-50 text-center px-2">
                        {
                            elements[active].descripcion ?
                                <>
                                    <div>
                                        <img alt = '' src={elements[active].adjunto.url} className="p-2 rounded pdfview-img"/>
                                    </div>
                                    <p className="font-weight-bolder font-size-lg">
                                        {
                                            elements[active].descripcion
                                        }
                                    </p>
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
            </>
        )
    }
}

export default SliderImages