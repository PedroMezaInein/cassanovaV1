import { elementType } from 'prop-types'
import React, { Component } from 'react'

class Folder extends Component{

    state = {
        hover: false,
        editable: false,
        name: '',
    }

    updateInput = e => {
        const { value } = e.target
        this.setState({
            ...this.state,
            name: value
        })
    }

    render(){
        const { children, text, closeFunction, onClick, element, updateDirectory, onClickDelete } = this.props
        const { hover, editable, name } = this.state
        return(
            <div className = 'pt-5 text-center folder' 
                onMouseEnter = { () => this.setState({...this.state, hover: true})}
                onMouseLeave = { () => this.setState({...this.state, hover: false})} >
                <div className = 'position-relative d-flex justify-content-center'>
                    {/* <div className = 'text-danger text-hover icon-xs'>
                        <i className="fas fa-folder-times icon-xs"></i>
                    </div> */}
                    {
                        closeFunction &&   
                            <span className='btn btn-icon position-absolute text-danger close-icon' 
                                onClick = { (e) => { e.preventDefault(); closeFunction() } }>
                                <i className='fas fa-times icon-s text-danger' />
                            </span>
                    }
                    <div onClick = { (e) => { e.preventDefault(); onClick(element) } } >
                        {
                            hover ?
                                <i className="fas fa-folder-open text-primary hover-primary text-hover-primary font-xxx-large text-hover"></i>
                            :
                                <i className="fas fa-folder  text-primary hover-primary text-hover-primary font-xxx-large text-hover"></i>
                        }
                    </div>
                </div>
                {
                    children ?
                        children
                    :
                        <div className = 'text-transform-none' >
                            {
                                editable ?
                                    <form onSubmit = { (e) => { e.preventDefault(); updateDirectory(name, element); this.setState({...this.state,editable: false})} } >
                                        <input onChange = { this.updateInput } value = { name }  name = 'name' 
                                            className = 'w-100 mt-3 border-top-0 border-left-0 border-right-0 text-center'/>
                                    </form>
                                :
                                    <div className = 'd-flex justify-content-center' >
                                        {
                                            element.adjuntos.length > 0 ? ''
                                            : <span className='text-danger text-hover-danger text-hover px-2' onClick = { (e) => { e.preventDefault(); onClickDelete(element) } } >
                                                    <i className="fas fa-trash icon-xs text-danger" />
                                                </span>
                                        }
                                        <div className = 'px-2' onClick = { (e) =>  { e.preventDefault(); this.setState({ ...this.state, editable: !editable, name: text}); } } >
                                            {text}
                                        </div>
                                    </div>
                            }
                            
                        </div>
                }
            </div>
        )
    }
}

export default Folder