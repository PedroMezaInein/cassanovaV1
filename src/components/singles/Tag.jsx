import React, { Component } from 'react'

class Tag extends Component{
    render(){ 
        const { etiqueta, onClick, customPadding } = this.props
        console.log(`customPadding ${customPadding}`)
        return(
            <div className="d-table ml-1 cursor-pointer mt-1 " key = { etiqueta.id }>
                <div className="tagify align-items-center border-0 d-inline-block">
                    <div className={`d-flex align-items-center tagify__tag tagify__tag__newtable border-radius-3px m-0 flex-row-reverse ${customPadding !== undefined ? customPadding : 'px-3px'}`} 
                        style = { { backgroundColor: etiqueta.color, color: 'white!important' } } >
                        {
                            onClick &&
                                <div className="tagify__tag__removeBtn ml-0 px-0" style = { { color: 'white!important' } } onClick = { onClick }></div>
                        }
                        <div className="p-2-5px">
                            <span className="tagify__tag-text white-space font-weight-bold letter-spacing-0-4 font-size-11px" style={{ backgroundColor: etiqueta.color, color: 'white' }}>
                                <div className="mt-2px"> {etiqueta.titulo} </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Tag