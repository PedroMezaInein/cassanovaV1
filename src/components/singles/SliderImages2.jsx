import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

class SliderImages extends Component {
  state = { active: 0 }

  sliderBack = () => {
    const { elements = [] } = this.props
    const { active } = this.state
    const next = elements.length ? (active === 0 ? elements.length - 1 : active - 1) : 0
    this.setState({ active: next })
  }

  sliderNext = () => {
    const { elements = [] } = this.props
    const { active } = this.state
    const next = elements.length ? (active === elements.length - 1 ? 0 : active + 1) : 0
    this.setState({ active: next })
  }

  render() {
    const { active } = this.state
    const { elements = [] } = this.props
    if (!elements || !elements.length) return null

    const item = elements[active] || {}
    const imgUrl =
      item?.adjunto?.url ||
      item?.adjunto?.url_temporal || // por si en algún lado quedó con este nombre
      item?.url

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
            {imgUrl ? (
              <>
                <div>
                  <img alt="" src={imgUrl} className="rounded pdfview-img" />
                  <a
                    href={imgUrl}
                    className="text-muted text-hover-primary font-weight-bold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver imagen
                  </a>
                </div>
              </>
            ) : (
              <div className="text-muted">Sin imagen</div>
            )}
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
          <div className="mb-4 text-center">
            <span className="font-weight-bold">PORCENTAJE DE AVANCE:</span> {item?.avance ?? 0}%
          </div>
          {item?.descripcion || ''}{/* si algún día lo llenas */}
        </div>
      </>
    )
  }
}

export default SliderImages
