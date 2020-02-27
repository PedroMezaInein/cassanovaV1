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
    }

    logoutUser = () =>{
        this.logoutUserAxios();
    }
    async componentDidMount(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = response
                login(data)
            },
            (error) => {
                this.logoutUser()
            }
        ).catch((error) => {
            this.logoutUser()
        })
    }
    async logoutUserAxios(){
        const { logout, access_token, history } = this.props
        await axios.get(URL_DEV + 'user/logout', { headers: {Authorization:`Bearer ${access_token}`}}).then(
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