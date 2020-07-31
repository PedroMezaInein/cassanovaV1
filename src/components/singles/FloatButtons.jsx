import React, { Component } from 'react'

class FloatButtons extends Component{
    render(){
        const { save, recover, formulario, url } = this.props

        return(
            <div className="position-fixed float-button d-flex align-items-center">
                <div>
                    <button onClick={ save } className="ml-2 my-2 btn btn-actions-table btn-md btn-icon btn-bg-white btn-text-success btn-hover-success" 
                        title='Guardar'>
                        <i className='fas fa-save'></i>
                    </button>
                    <br />
                    {
                        url === formulario.page ?
                            Object.keys(formulario.form).length > 0 ?
                                <button onClick={ recover } className="ml-2 my-2 btn btn-actions-table btn-md btn-icon btn-bg-white btn-text-primary btn-hover-primary" 
                                    title='Recuperar formulario'>
                                    <i className='fas fa-clipboard-list'></i>
                                </button>  
                            : ''

                        : ''
                    }
                      
                </div>
            </div>
        )
    }
}

export default FloatButtons