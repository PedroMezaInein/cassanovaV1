import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from './sidebar';
import Navbar from './navbar'
import { logout, login } from '../../redux/reducers/auth_user'
import axios from 'axios'
import { URL_DEV } from '../../constants'
class Layout extends Component{

    constructor(props){
        super(props)
        console.log(props, 'PROPS LAYOUT')
    }

    render(){
        const { children,  } = this.props
        return(
            <div className="contenedor__full-height position-relative">
                <Sidebar {... this.props} />
                <Navbar clickLogout={ this.logoutUser } {... this.props} />
                <div className="mx-5 px-5 pt-5 contenedor">
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
    logout: () => dispatch(logout()),
    login: payload => dispatch(login(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout);