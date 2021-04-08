import React, { Component } from 'react'

class SingleTagify extends Component{
    render(){
        const { element, color, onClick } = this.props
        return(
            <div className="tagify pr-2 pb-2 d-flex-justify-content-center align-items-center w-100 border-0">
                <div className = {`d-flex px-2 align-items-center tagify__tag tagify__tag--${color} tagify__tag__newtable`}>
                    <div className="tagify__tag__removeBtn" aria-label = 'remove tag' 
                        onClick = { onClick }/>
                    <div>
                        <span className="tagify__tag-text p-1 white-space">
                            { element.nombre }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default SingleTagify