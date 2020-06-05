/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from './sidebar'
import Navbar from './navbar'
import MenuResponsive from './menuResponsive'
import { logout, login } from '../../redux/reducers/auth_user'
import axios from 'axios'
import { URL_DEV } from '../../constants'

import NewSideBar from './NewSideBar'
class Layout extends Component {

    state = {
        menu: false
    }

    constructor(props) {
        super(props)
    }

    logoutUser = () => {
        this.logoutUserAxios();
    }

    clickResponsiveMenu = () => {
        this.setState({
            menu: !this.state.menu
        })
    }

    async logoutUserAxios() {
        const { logout, authUser: { access_token: access_token }, history } = this.props
        await axios.get(URL_DEV + 'user/logout', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                logout();
                history.push('/login')
            },
            (error) => {
                logout();
                history.push('/login')
            }
        ).catch((error) => {
            logout();
            history.push('/login')
        })
    }

    render() {
        const { children, } = this.props
        const { menu } = this.state
        return (

            <div className="pl-5  position-relative nav-full-height"  >
                <Navbar clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} {... this.props} />

                <Sidebar {... this.props} />

                <MenuResponsive expanded={menu ? 'expanded' : ''} clickResponsiveMenu={this.clickResponsiveMenu} {... this.props} />
                <div className="pl-5 container-fluid">
                    {children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    login: payload => dispatch(login(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout);