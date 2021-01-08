import React, { Component } from 'react'

class Folder extends Component{

    state = {
        hover: false
    }

    render(){
        const { children, text, closeFunction, onClick, element } = this.props
        const { hover } = this.state
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
                <div className = 'text-transform-none'>
                {
                    children ?
                        children
                    :
                        <>
                            <br />
                            {text}
                        </>
                }
                </div>
            </div>
        )
    }
}

export default Folder