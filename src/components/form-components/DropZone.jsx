import React, { Component } from 'react'
import Dropzone from "react-dropzone";


class DropZone extends Component{

    handleDrop = acceptedFiles => {
        const { handleChange } = this.props
        handleChange(acceptedFiles)
    }

    render(){
        const { children, handleChange, multiple, ...props } = this.props
        
        return(
            <Dropzone { ... props} 
                onDrop={this.handleDrop}
                >
                {({ getRootProps, getInputProps }) => {
                    let aux = getInputProps()
                    aux.multiple = multiple;
                    console.log(multiple)
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