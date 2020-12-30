import React, { Component } from 'react'

class MensajePrincipal extends Component {

    render() {
        const { primerTexto, segundoTexto, tercerTexto, primerBoldest, segundoBoldest, tercerBoldest, separator, boton} = this.props
        return (
            <>
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${boton ?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={boton?"w-95":""}>
                        {primerTexto}
                        <span className="font-weight-boldest">{primerBoldest}</span>
                        {segundoTexto}
                        <span className="font-weight-boldest">{segundoBoldest}</span>
                        {tercerTexto}
                        <span className="font-weight-boldest">{tercerBoldest}</span>
                    </span>
                    {
                        boton?
                            <span className="w-5 d-flex justify-content-end align-items-center">
                                <a className="btn btn-icon btn-light-primary btn-xs">
                                    <i className="far fa-copy"></i>
                                </a>
                            </span>
                        : ""
                    }
                </div>
                {
                    separator?
                        <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
                    :""
                }
            </>
        )
    }
}

export default MensajePrincipal