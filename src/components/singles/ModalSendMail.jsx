import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'

class ModalSendMail extends Component {
    render() {
        const { show, handleClose, header, validation, url, url_text, children, sendMail } = this.props

        return (
            <>
                <Modal show = { show } onHide = { handleClose } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>{header}</Modal.Header>
                    <Modal.Body className = 'p-0 mt-3'>
                        <div className = 'row mx-0 justify-content-center'>
                            <div className="col-md-12 text-center py-2">
                                <div>
                                    {
                                        validation ?
                                            <u>
                                                <a className="font-weight-bold text-hover-success text-primary" target= '_blank' rel="noreferrer" href = {url}>
                                                    DA CLIC AQUÍ PARA VER <i className="las la-hand-point-right text-primary icon-md ml-1"></i> {url_text}
                                                </a>
                                            </u>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 font-weight-light mt-4 text-justify">
                                Si deseas enviar {url_text} agrega el o los correos del destinatario, de lo contario da clic en <a onClick = { handleClose } className="font-weight-bold">cancelar</a>.
                            </div>
                            {children}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { handleClose }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { sendMail } >SI, ENVIAR</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalSendMail