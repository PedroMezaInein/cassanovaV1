import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from './sidebar';
class Layout extends Component{
    componentDidMount(){
        const { access_token } = this.props.authUser
        const { history } = this.props
        if(!access_token.length){
            history.push('/login')
        }
    }
    render(){
        const { children,  } = this.props
        return(
            <div className="main-container">
                <Sidebar {... this.props} />
                <div className="main m-5 p-5">
                    {children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout);