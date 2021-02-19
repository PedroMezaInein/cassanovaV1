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
                                <div className = 'row borderBottom mx-0 py-2 my-3' key = { index } >
                                    <div className = 'col-1 px-1 align-self-center text-justify'>
                                        <Button icon = '' onClick = { () => { deletePlano(item.id) } } className = "btn btn-icon btn-light-danger btn-xs mr-2" 
                                            only_icon = "flaticon2-delete icon-xs" tooltip={{text:'Eliminar'}} />
                                    </div>
                                    <div className = 'col-9 w-100 px-2 align-self-center text-justify'>
                                        { item.nombre }
                                    </div>
                                    <div className = 'col-2 w-100 px-2 align-self-center'>
                                        <div className = 'row mx-0'>
                                            <div className = 'col-6 px-1 align-self-center'>
                                                {
                                                    this.isUpActiveButton(item, index) ?
                                                        <Button icon = '' onClick = { () => { changePosicionPlano(item, 'up') } } className = "btn btn-icon btn-light-primary btn-xs mr-2" 
                                                            only_icon = "flaticon2-up icon-xs" tooltip={{text:'Subir'}} />
                                                    : ''
                                                }
                                            </div>
                                            <div className = 'col-6 px-1 align-self-center'>
                                                {
                                                    this.isDownActiveButton(item, index) ?
                                                        <Button icon = '' onClick = { () => { changePosicionPlano(item, 'down') } } className = "btn btn-icon btn-light-info btn-xs mr-2" 
                                                            only_icon = "flaticon2-down icon-xs" tooltip={{text:'Bajar'}} />
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                    })
                }
            </div>
        )
    }
}
export default Esquema