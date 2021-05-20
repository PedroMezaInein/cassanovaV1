import React, { Component } from 'react'

class SingleTagify extends Component{
    render(){
        const { element, color, onClick, tipo } = this.props
        return(
            <div className="tagify align-items-center border-0 d-inline-block">
                <div className = {`d-flex align-items-center tagify__tag tagify__tag--${color} tagify__tag__newtable px-3px border-radius-3px m-0`}>
                    <div className="tagify__tag__removeBtn ml-0 px-0" aria-label = 'remove tag' 
                        onClick = { onClick }/>
                    <div style={{padding:'1px'}}>
                        <span className="tagify__tag-text p-1 white-space font-weight-bold letter-spacing-0-4 font-size-11px">
                            { 
                                tipo === 'empresa_acceso' && element.name === 'INFRAESTRUCTURA MÉDICA'?
                                    'IM':
                                element.nombre === undefined ? 
                                    element.name :
                                element.nombre 
                            }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default SingleTagify