import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'

class modal extends Component {
    
    componentDidUpdate() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal && modal.hasAttribute("tabindex")) {
            modal.removeAttribute("tabindex");
        }
    });
}


    render() {
        const { show, handleClose, children, title, size, icon, customcontent, contentcss, classBody, bgHeader } = this.props

        return (
            <>
               <Modal
                    show={show}
                    size={size}
                    onHide={handleClose}
                    keyboard={true}
                    centered={!customcontent}
                    contentClassName={contentcss}
                    backdrop="static"
                    >
                    <Modal.Header className={bgHeader}>
                        <h5 className="modal-title" id="exampleModalLabel">
                        {title}
                        {icon && <i className={`${icon}`}></i>}
                        </h5>
                        <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={handleClose}
                        >
                        <i aria-hidden="true" className="ki ki-close"></i>
                        </button>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                        paddingTop: "0px",
                        maxHeight: "70vh", // Limita la altura del contenido
                        overflowY: "auto", // Habilita el scroll vertical si el contenido excede la altura
                        }}
                        className={classBody}
                    >
                        {children}
                    </Modal.Body>
                </Modal>

            </>
        )
    }
}

export default modal