import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'



class modal extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { show, handleClose, children, title, setShow} = this.props

        return(
            <>
            <Modal
                show={show}
                size="xl"
                onHide={handleClose}                
                //backdrop="static"
                keyboard={true}
                centered
            >
                <Modal.Header>
                    <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
					<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick = { handleClose }>
					    <i aria-hidden="true" className="ki ki-close"></i>
					</button>
                </Modal.Header>
                <Modal.Body style={{paddingTop:"0px"}}>
                    { children }
                </Modal.Body>               
            </Modal>
            </>
    )
    }
}

export default modal