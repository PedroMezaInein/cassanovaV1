import React, { Component } from 'react'

class MensajePrincipal extends Component {

    getText = () => {
        const { primerTexto, segundoTexto, tercerTexto, primerBoldest, segundoBoldest, tercerBoldest } = this.props
        let aux = ''
        if(primerTexto)
            aux = aux + primerTexto
        if(primerBoldest)
            aux = aux + '' + primerBoldest
        if(segundoTexto)
            aux = aux + '' + segundoTexto
        if(segundoBoldest)
            aux = aux + '' + segundoBoldest
        if(tercerTexto)
            aux = aux + '' + tercerTexto
        if(tercerBoldest)
            aux = aux + '' + tercerBoldest
        return aux
    }

    render() {
        const { primerTexto, segundoTexto, tercerTexto, primerBoldest, segundoBoldest, tercerBoldest, separator, boton, bontonFunction} = this.props
        return (
            <>
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${boton ?" row mx-0 pl-4 pr-2":" px-4"}`} >
                    <span className={boton?"w-90":""}>
                        {primerTexto}
                        <span className="font-weight-boldest">{primerBoldest}</span>
                        {segundoTexto}
                        <span className="font-weight-boldest">{segundoBoldest}</span>
                        {tercerTexto}
                        <span className="font-weight-boldest">{tercerBoldest}</span>
                    </span>
                    {
                        boton?
                            <>
                                <span className="w-10 d-flex justify-content-end align-items-center">
                                    <span className="btn btn-icon btn-light-primary btn-xs" onClick={() => { navigator.clipboard.writeText(this.getText()) }}>
                                        <i className="far fa-copy"></i>
                                    </span>
                                    <span className="btn btn-icon btn-light-primary btn-xs" onClick = { (e) => {bontonFunction(e, this.getText())} }>
                                        <i className="fab fa-whatsapp"></i>
                                    </span>
                                </span>
                            </>
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