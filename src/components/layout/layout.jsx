/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import NewAsideMenu from './newAsideMenu'
import { logout, login } from '../../redux/reducers/auth_user'
import axios from 'axios'
import { PUSHER_OBJECT, URL_DEV } from '../../constants'
import UrlLocation from './urlLocation'
import MobileHeader from './mobileHeader'
import UserPanel from '../../../src/components/layout/UserPanel/userPanel'
import { ChecadorButton, Notificacion } from '../singles'
import { Zoom, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../functions/alert'
import {Helmet} from "react-helmet";
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

/* function openUserProfile() {
    if (document.getElementsByClassName("offcanvas")[0].classList.contains("offcanvas-on")) {
        document.getElementsByClassName("offcanvas")[0].classList.remove("offcanvas-on");
    }
    else {
        document.getElementsByClassName("offcanvas")[0].classList.add("offcanvas-on");
    }
} */
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
        title: '',
        menu: false,
        json: {},
        checador: []
    }

    componentDidMount() {
        const { pathname } = this.props.location
        let textoArray = pathname.split('/')
        let texto = 'Administrador de proyectos'
        textoArray.forEach((element) => { if(element){ texto = texto + ' / ' + element } })
        this.setState({ ...this.state, title: texto })
        this.getUserChecador()
        const { user } = this.props.authUser
        if(process.env.NODE_ENV === 'production' || true){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('Notificacion.User.'+user.id).listen('NuevaNotificacion', (e) => {
                this.getNotificacionesAxios()
            })
        }
        /* this.getNotificacionesAxios() */
        this.getLocation()
    }

    logoutUser = () => { this.logoutUserAxios(); }

    clickResponsiveMenu = () => { this.setState({ menu: !this.state.menu }) }

    openUserProfile = () => {
        const { json } = this.state
        if(document.getElementsByClassName("offcanvas")[0].classList.contains("offcanvas-on")) {
            document.getElementsByClassName("offcanvas")[0].classList.remove("offcanvas-on");
        }else{
            document.getElementsByClassName("offcanvas")[0].classList.add("offcanvas-on");
        }
    }

    /* getIpInfo = async () => {
        axios.get('https://ipapi.co/json').then((response) => {
            this.setState({json: response.data})
        }).catch((error) => { console.log(error); });
    } */

    getUserChecador = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/usuarios/usuarios/checador`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { usuario } = response.data
                this.setState({...this.state, checador: usuario.checadores})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    isCliente = usuario => {
        if(usuario)
            if(usuario.tipo)
                if(usuario.tipo.tipo)
                    if(usuario.tipo.tipo === 'Cliente')
                        return true
        return false
    }

    printChecador = (getInnerRef) => {
        /* const { checador } = this.state
        return(
            <ChecadorButton ref = { getInnerRef } checador = { checador }  actualizarChecadorAxios = { this.actualizarChecadorAxios } />
        ) */
		const { checador } = this.state
		if(checador.length){
			if(checador[0].fecha_fin === null)
				return(
                    <span className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-primary font-weight-bolder text-primary align-self-center" onClick = { (e) => { e.preventDefault(); this.actualizarChecadorAxios('salida') } } >
                        <i className="fas fa-sign-in-alt text-primary px-0"></i><span className="pl-2 ocultar-checador">CHECAR SALIDA</span>
                    </span>
				)
		}else{
			return(
                <span className="btn btn-sm btn-bg-light btn-icon-success btn-hover-success font-weight-bolder text-success align-self-center" onClick = { (e) => { e.preventDefault(); this.actualizarChecadorAxios('entrada') } }>
                    <i className="fas fa-sign-in-alt text-success px-0"></i><span className="pl-2 ocultar-checador">CHECAR ENTRADA</span>
                </span>
			)
		}
	}

    async getNotificacionesAxios() {
        const options = {
            position: "top-right",
            /* autoClose: true, */
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            autoClose: 8000
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
                        }, (i) * 4000
                    )
                    return false
                })
                /* setTimeout(() => {
                    this.getNotificacionesAxios()
                }, (numero * 2500) + 500000) */
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

    actualizarChecadorAxios = async(tipo) => {
        const { access_token } = this.props.authUser
        const { json } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/usuarios/checador/${tipo}`, {ip: json}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => { 
                const { usuario } = response.data
                if(tipo === 'entrada')
                    doneAlert('Checaste tu entrada.')
                    //doneAlert('Entrada checada con éxito')
                else
                    doneAlert('Checaste tu salida.')
                    //doneAlert('Salida checada con éxito')
                this.setState({...this.state, checador: usuario.checadores})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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

    hasUser = () => {
        const { authUser } = this.props
        if(authUser)
            if(authUser.user)
                return true
        return false
    }

    constructor(props) {
        super(props);
        this.getInnerRef = this.getInnerRef.bind(this);
        this.getLocation = this.getLocation.bind(this);
    }
    innerRef;
    getInnerRef(ref) { this.innerRef = ref; }
    getLocation() { this.innerRef && this.innerRef.getLocation(); }

    render() {
        const { children, authUser } = this.props
        const { checador, title } = this.state
        let tipo_usuario = this.hasUser() ? authUser.user.tipo ? authUser.user.tipo.tipo : '' : ''
        const { getInnerRef, getLocation } = this;

        return (
            <div>
                <Helmet> <title> {title} </title> </Helmet>
                <ToastContainer position = "top-right" autoClose = { false } hideProgressBar = { false } newestOnTop = { false } closeButton = { null }
                    closeOnClick = { true } rtl = { false } draggable = { false } pauseOnHover limit = { 5 } transition = { Zoom } />
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
                                            <div className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle" onClick={() => { this.openUserProfile() }}>
                                                <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Hola,</span>
                                                <br />
                                                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-2">
                                                    { this.hasUser() ?  this.props.authUser.user.name : '' }
                                                </span>
                                                <span className="symbol symbol-45">
                                                    {
                                                        this.hasUser() ? this.props.authUser.user.avatar ?
                                                            <img className="symbol-label p-1 font-size-h5 font-weight-bold bg-transparent rounded-avatar" 
                                                                src = { this.props.authUser.user.avatar } alt ="profile" />
                                                        :
                                                            <span className="symbol-label font-size-h5 font-weight-bold">
                                                                { this.props.authUser.user.name ? this.props.authUser.user.name.charAt(0) : '' }
                                                            </span>
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
                                        <UrlLocation { ...this.props } props = { this.props } checador = { checador } actualizarChecador = { this.actualizarChecadorAxios } 
                                            isCliente = { this.isCliente } printChecador = { this.printChecador } getInnerRef = { getInnerRef } />
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
                    this.hasUser() ?
                        <UserPanel user = { this.props.authUser.user } avatar = { this.props.authUser.user.avatar } 
                            clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} 
                            cerrarSesiones = { this.cerrarSesionesAxios } checador = { checador } 
                            actualizarChecador = { this.actualizarChecadorAxios } {...this.props} />
                    : ''
                }
            </div>
        )
    }

}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ logout: () => dispatch(logout()), login: payload => dispatch(login(payload)) })

export default connect(mapStateToProps, mapDispatchToProps)(Layout);