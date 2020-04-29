import React, {Component} from 'react'
import { Modal } from '../singles'
import { Button } from '../form-components'

export default class ModalDelete extends Component{
    render(){
        const { show, handleClose, children, onClick } = this.props
        return(
            <Modal show = { show } handleClose={ handleClose } >
                {
                    children
                }
                <div className="d-flex justify-content-center mt-3">
                    <Button icon='' onClick = { handleClose } text="Cancelar" className="mr-3" color="green"/>
                    <Button icon='' onClick = { onClick } text="Continuar" color="red"/>
                </div>
            </Modal>
        )
    }
}