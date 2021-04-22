import React, { Component } from 'react'
import { COLORS } from '../../../../constants';
import { TagColorForm } from '../../../../components/forms'

class NewTag extends Component{
    render(){
        const { form, onChange, formeditado, sendTag, closeCard } = this.props
        return(
            <div className = ' card card-custom bg-light gutter-b mt-10 mx-auto shadow '>
                <div className="card-header border-0">
                    <h3 className="card-title font-weight-bold text-dark">
                        <span className="d-block text-dark font-weight-bolder">NUEVO TAG</span>
                    </h3>
                </div>
                <div className="card-body pt-2">
                    <TagColorForm
                        form = { form }
                        onChange ={ onChange }
                        formeditado = { formeditado }
                        sendTag = { sendTag }
                        closeCard = { closeCard }
                        colors={ COLORS }
                        customclass='bg-white'
                        btnCloseCard = {true}
                    />
                </div>
            </div>
        )
    }
}

export default NewTag