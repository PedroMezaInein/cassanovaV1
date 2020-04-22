import React, { Component } from 'react'
import Dropzone from "react-dropzone";


class DropZone extends Component{

    handleDrop = acceptedFiles => {
        const { handleChange } = this.props
        handleChange(acceptedFiles)
    }

    render(){
        const { children, handleChange, ...props } = this.props
        return(
            <Dropzone { ... props} onDrop={this.handleDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        {
                            children
                        }
                    </div>
                )}
            </Dropzone>
        )
    }
}

export default DropZone