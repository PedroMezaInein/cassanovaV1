import React, { Component } from 'react'
import { Button } from '../form-components'
import Modal from 'react-bootstrap/Modal'

export default class ModalDelete extends Component {
    render() {
        const { show, handleClose, children, title, onClick } = this.props
        return (
            <>
                <Modal
                    show={show}
                    onHide={handleClose}
                    keyboard={true}
                    centered
                >
                    <Modal.Header>
                        <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <i aria-hidden="true" className="ki ki-close"></i>
                        </button>
                    </Modal.Header>
                    <Modal.Body style={{ paddingTop: "0px" }}>
                        {
                            children
                        }
                        <div className="d-flex justify-content-center mt-3">
                            <Button icon='' onClick={handleClose} text="CANCELAR" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                            <Button icon='' onClick={onClick} text="CONTINUAR" className={"btn btn-danger font-weight-bold"} />
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}
