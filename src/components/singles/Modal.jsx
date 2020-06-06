import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'


class modal extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { show, handleClose, children } = this.props
        return(
            <Modal show={ show } onHide={ handleClose } >
                <Modal.Header closeButton />
                <Modal.Body>
                    { children }
                </Modal.Body>
            </Modal>
        )
    }
}

export default modal