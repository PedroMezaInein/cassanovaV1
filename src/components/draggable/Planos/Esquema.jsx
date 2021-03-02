import React, { Component } from 'react'
import { Button } from '../../form-components'

class Esquema extends Component{

    isUpActiveButton = (item, index) => {
        if(index > 0)
            return true
        return false
    }

    isDownActiveButton = ( item, index ) => {
        const { planos } = this.props
        if(index < planos.length - 2)
            return true
        return false
    }

    render(){
        const { deletePlano, planos, changePosicionPlano } = this.props
        return(
            <div>
                {
                    planos.map((item, index)=>{
                        if(item.id)
                            return(
                                <div className = 'row options-planos' key = { index } >
                                    <div className = 'w-eliminar'>
                                        <Button icon = '' onClick = { () => { deletePlano(item.id) } } className = "btn btn-icon btn-light-danger btn-circle btn-xxs" 
                                            only_icon = "flaticon2-delete icon-xs" tooltip={{text:'ELIMINAR'}} />
                                    </div>
                                    <div className = 'w-text'>
                                        { item.nombre }
                                    </div>
                                    <div className = 'w-arrows row mx-0'>
                                            <span className = 'col pr-1 p-0 text-center'>
                                                {
                                                    this.isUpActiveButton(item, index) ?
                                                        <Button icon = '' onClick = { () => { changePosicionPlano(item, 'up') } } className = "btn btn-icon btn-light-primary btn-xxs" 
                                                            only_icon = "flaticon2-up icon-xs" tooltip={{text:'SUBIR'}} />
                                                    : ''
                                                }
                                            </span>
                                            <span className = 'col pr-1 p-0 text-center'>
                                                {
                                                    this.isDownActiveButton(item, index) ?
                                                        <Button icon = '' onClick = { () => { changePosicionPlano(item, 'down') } } className = "btn btn-icon btn-light-primary btn-xxs" 
                                                            only_icon = "flaticon2-down icon-xs" tooltip={{text:'BAJAR'}} />
                                                    : ''
                                                }
                                            </span>
                                        </div>
                                </div>
                            )
                        return <></>
                    })
                }
            </div>
        )
    }
}
export default Esquema