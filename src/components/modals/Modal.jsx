import React, { Component } from 'react'
import {Modal as BootstrapModal} from 'react-bootstrap'

class Modal extends Component {
    
    componentDidUpdate(){
        var elementos = document.getElementsByClassName('modal');
        for(let cont = 0; cont < elementos.length; cont ++){
            elementos[cont].removeAttribute("tabindex")
        }
    }

    render() {
        const { show, handleClose, children, title, size, icon, customcontent, contentcss, classBody, bgHeader } = this.props

        return (
            <>
                <BootstrapModal
                    show={show}
                    size={size}
                    onHide={handleClose}
                    keyboard={true}
                    centered={customcontent?false:true}
                    contentClassName={contentcss}
                >
                    <BootstrapModal.Header className={bgHeader}>
                        <h5 className="modal-title" id="exampleModalLabel">

                            {title}
                            { icon && <i className={`${icon}`}></i> }
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <i aria-hidden="true" className="ki ki-close"></i>
                        </button>
                    </BootstrapModal.Header>
                    <BootstrapModal.Body style={{ paddingTop: "0px" }} className={classBody}>
                        {children}
                    </BootstrapModal.Body>
                </BootstrapModal>
            </>
        )
    }
}

export default Modal