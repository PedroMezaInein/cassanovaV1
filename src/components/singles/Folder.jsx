import React, { Component } from 'react'

class Folder extends Component{

    state = {
        hover: false
    }

    render(){
        const { children, text } = this.props
        const { hover } = this.state
        console.log('children', children)
        return(
            <div className = 'p-5 border text-center folder' 
                onMouseEnter = { () => this.setState({...this.state, hover: true})}
                onMouseLeave = { () => this.setState({...this.state, hover: false})} >
                {
                    hover ?
                        <i className="fas fa-folder-open text-primary hover-primary text-hover-primary font-xxx-large"></i>
                    :
                        <i className="fas fa-folder  text-primary hover-primary text-hover-primary font-xxx-large"></i>
                }
                <br />
                { text }
            </div>
        )
    }
}

export default Folder