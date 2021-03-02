/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import NewAsideMenu from './newAsideMenu'
import { logout, login } from '../../redux/reducers/auth_user'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import UrlLocation from './urlLocation'
import MobileHeader from './mobileHeader'
import UserPanel from '../../../src/components/layout/UserPanel/userPanel'
import { Notificacion } from '../singles'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorAlert, printResponseErrorAlert, doneAlert } from '../../functions/alert'

function openUserProfile() {
    if (document.getElementsByClassName("offcanvas")[0].classList.contains("offcanvas-on")) {
        document.getElementsByClassName("offcanvas")[0].classList.remove("offcanvas-on");
    }
    else {
        document.getElementsByClassName("offcanvas")[0].classList.add("offcanvas-on");
    }
}
function clickShowAside() {
    document.body.classList.remove('aside-on');
    document.getElementById("openbuerger").classList.remove("mobile-toggle-active");
    document.getElementById("aside").classList.remove("aside-on");
    document.getElementById('showaside').classList.remove("aside-overlay");
}
function clickShowHeader() {
    document.body.classList.remove('header-menu-wrapper-on');
    document.getElementById("openbuerger").classList.remove("mobile-toggle-active");
    document.getElementById("showheadermenu").classList.remove("header-menu-wrapper-on");
    document.getElementById('showheader').classList.remove("header-menu-wrapper-overlay");
}

class Layout extends Component {

    state = {
        menu: false
    }

    componentDidMount() {
        this.getNotificacionesAxios()
    }

    logoutUser = () => {
        this.logoutUserAxios();
    }

    clickResponsiveMenu = () => {
        this.setState({
            menu: !this.state.menu
        })
    }

    async getNotificacionesAxios() {
        const options = {
            position: "top-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
        }
        const { authUser: { access_token } } = this.props
        await axios.get(`${URL_DEV}notificaciones`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { notificaciones } = response.data
                let numero = notificaciones.length
                notificaciones.map((notificacion, i) => {
                    setTimeout(
                        () => {
                            toast(<Notificacion data={notificacion} />, options);
                        }, (i) * 2500
                    )
                    return false
                })
                setTimeout(() => {
                    this.getNotificacionesAxios()
                }, (numero * 2500) + 500000)
            },
            (error) => {
            }
        ).catch((error) => {
        })
    }

    async logoutUserAxios() {
        const { logout, authUser: { access_token }, history } = this.props
        await axios.get(`${URL_DEV}user/logout`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => { logout(); history.push('/login') },
            (error) => { logout(); history.push('/login') }
        ).catch((error) => {
            logout();
            history.push('/login')
        })
    }

    cerrarSesionesAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}user/close`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {  doneAlert('Sesiones cerradas con éxito') },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { children, authUser } = this.props
        const { menu } = this.state
        let tipo_usuario = authUser ? 
                            authUser.user ? 
                                authUser.user.tipo ? 
                                    authUser.user.tipo.tipo
                                : ''
                            : ''
                        : '';

        return (
            <div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover />
                <MobileHeader />
                <div className="d-flex flex-column flex-root">
                    <div className="d-flex flex-row flex-column-fluid page">
                        {
                            tipo_usuario === 'Cliente' ?
                                '' :
                                <NewAsideMenu props={this.props} />
                        }
                        <div id="showaside" onClick={() => { clickShowAside() }}></div>
                        <div className={tipo_usuario === 'Cliente' ?
                            "d-flex flex-column flex-row-fluid wrapper pl-0 pt-65px" : "d-flex flex-column flex-row-fluid wrapper"}>
                            <div className={tipo_usuario === 'Cliente' ?
                                "header header-fixed left-0" : "header header-fixed"}>
                                <div className="container-fluid d-flex align-items-stretch justify-content-between">
                                    <div id="showheader" onClick={() => { clickShowHeader() }}></div>
                                    <div className="topbar" >
                                        <div className="topbar-item">
                                            <div className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle" onClick={() => { openUserProfile() }}>
                                                <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Hola,</span>
                                                <br />
                                                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-2">
                                                    {
                                                        this.props ?
                                                            this.props.authUser ?
                                                                this.props.authUser.user ? 
                                                                    this.props.authUser.user.name
                                                                : ''
                                                            : ''
                                                        : ''
                                                    }
                                                </span>
                                                <span className="symbol symbol-45">
                                                    {
                                                        this.props ?
                                                            this.props.authUser ?
                                                                this.props.authUser.user ?
                                                                    this.props.authUser.user.avatar ? 
                                                                        <img className="symbol-label p-1 font-size-h5 font-weight-bold bg-transparent" src = { this.props.authUser.user.avatar } alt ="profile" />
                                                                    : 
                                                                        <span className="symbol-label font-size-h5 font-weight-bold">
                                                                            { this.props.authUser.user.name ? this.props.authUser.user.name.charAt(0) : '' }
                                                                        </span>
                                                                : ''
                                                            : ''
                                                        : ''
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={this.props.location.pathname==='/mi-proyecto' ?"content d-flex flex-column flex-column-fluid pt-0":"content d-flex flex-column flex-column-fluid"}>
                                {
                                    tipo_usuario === 'Cliente' ?
                                        '' :
                                        <UrlLocation {...this.props} props={this.props} />
                                }
                                <div className="d-flex flex-column-fluid">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props ?
                        this.props.authUser ?
                            this.props.authUser.user ?
                                <UserPanel user = { this.props.authUser.user } avatar = { this.props.authUser.user.avatar } 
                                    clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} 
                                    cerrarSesiones = { this.cerrarSesionesAxios }
                                    {...this.props} />
                            : ''
                        : ''
                    : ''
                }
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