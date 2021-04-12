import React, { Component } from 'react'

class SingleTagify extends Component{
    render(){
        const { element, color, onClick } = this.props
        return(
            <div className="tagify d-flex-justify-content-center align-items-center border-0">
                <div className = {`d-flex align-items-center tagify__tag tagify__tag--${color} tagify__tag__newtable px-3px border-radius-3px m-2`}>
                    <div className="tagify__tag__removeBtn ml-0 px-0" aria-label = 'remove tag' 
                        onClick = { onClick }/>
                    <div style={{padding:'1px'}}>
                        <span className="tagify__tag-text p-1 white-space font-weight-bold letter-spacing-0-4">
                            { element.nombre }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default SingleTagify