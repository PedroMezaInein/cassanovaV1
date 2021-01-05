import React, { Component } from 'react'
import Dropzone from "react-dropzone";

class DropZone extends Component{

    handleDrop = acceptedFiles => {
        const { handleChange } = this.props
        handleChange(acceptedFiles)
    }

    render(){
        const { children, handleChange, multiple, accept,...props } = this.props
        
        return(
            <Dropzone { ... props} 
                /* maxSize = { 10000000 } */
                onDrop={this.handleDrop}
                >
                {({ getRootProps, getInputProps }) => {
                    let aux = getInputProps()
                    aux.multiple = multiple;
                    if(accept)
                        aux.accept = accept
                    return (<div {...getRootProps({ className: "dropzone dropzone-default dropzone-primary dz-clickable col-md-10" })}>
                        <input {...aux} />
                        {
                            children
                        }
                    </div>)
                }}
            </Dropzone>
        )
    }
}

export default DropZone