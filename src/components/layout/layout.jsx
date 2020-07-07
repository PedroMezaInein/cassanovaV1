/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from './sidebar'
import Navbar from './navbar'
import MenuResponsive from './menuResponsive'
import NewAsideMenu from './newAsideMenu'
import { logout, login } from '../../redux/reducers/auth_user'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import UrlLocation from './urlLocation'
import ScrollBar from "react-perfect-scrollbar";
import MobileHeader from './mobileHeader'
import UserPanel from '../../../src/components/layout/UserPanel/userPanel'

function openUserProfile (){  
    if(document.getElementsByClassName("offcanvas")[0].classList.contains("offcanvas-on")){
        // console.log(document.getElementsByClassName("offcanvas")[0].classList);
        document.getElementsByClassName("offcanvas")[0].classList.remove("offcanvas-on");
    }
    else
    { 
        document.getElementsByClassName("offcanvas")[0].classList.add("offcanvas-on");
    }
}
function clickShowAside(){    
    document.body.classList.remove('aside-on');
    document.getElementById("openbuerger").classList.remove("mobile-toggle-active");
    document.getElementById("aside").classList.remove("aside-on");
    document.getElementById('showaside').classList.remove("aside-overlay");     
}
function clickShowHeader(){
    document.body.classList.remove('header-menu-wrapper-on');		
	document.getElementById("openbuerger").classList.remove("mobile-toggle-active");
	document.getElementById("showheadermenu").classList.remove("header-menu-wrapper-on");
	document.getElementById('showheader').classList.remove("header-menu-wrapper-overlay"); 	     
}

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
            <> 
            <MobileHeader/>

            <div className="d-flex flex-column flex-root">
                <div className="d-flex flex-row flex-column-fluid page">
                  {/*  <MenuResponsive expanded={menu ? 'expanded' : ''} clickResponsiveMenu={this.clickResponsiveMenu} {... this.props} /> */}
                    
                    <NewAsideMenu props =  {this.props} /> 
                    <div id="showaside" onClick = { () => { clickShowAside() } }></div>
                    <div className="d-flex flex-column flex-row-fluid wrapper"> 
                        <div  className="header header-fixed">
                            <div className="container-fluid d-flex align-items-stretch justify-content-between">
                                <div id="showheadermenu"className="header-menu-wrapper header-menu-wrapper-left" >
                                    <div  className="header-menu header-menu-mobile header-menu-layout-default">
                                        <ul className="menu-nav">
                                            <li className="menu-item menu-item-submenu" data-menu-toggle="click" aria-haspopup="true">
                                                <a href="/proyectos/proyectos" className="menu-link menu-toggle">
                                                    <span className="menu-text text-uppercase">Proyectos</span>
                                                    <i className="menu-arrow"></i>
                                                </a>
                                            </li>
                                            <li className="menu-item menu-item-submenu" data-menu-toggle="click" aria-haspopup="true">
                                                <a href="/administracion/proveedores" className="menu-link menu-toggle">
                                                    <span className="menu-text text-uppercase">Proveedores</span>
                                                    <i className="menu-arrow"></i>
                                                </a>
                                            </li>
                                            <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                                <a href="/leads/leads" className="menu-link menu-toggle">
                                                    <span className="menu-text text-uppercase">Leads</span>
                                                    <i className="menu-arrow"></i>
                                                </a>
                                            </li>
                                        </ul>                                        
                                    </div>
                                </div>   
                                <div id="showheader" onClick = { () => { clickShowHeader() } }></div>                             
                                <div className="topbar" >
                                    <div className="topbar-item">                                    
                                        {/* <Navbar clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} {... this.props} />*/}
                                            <div className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle" onClick = { () => { openUserProfile() } }>
                                                <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Hola,</span>
                                                <br/>
                                                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
                                                    {
                                                        this.props.authUser.user.name
                                                    }
                                                </span>
                                                <span className="symbol symbol-35 symbol-light-primary">
                                                    <span className="symbol-label font-size-h5 font-weight-bold">O</span>
                                                </span>                                                
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>                   

                        <div className="content d-flex flex-column flex-column-fluid">                            
                            <UrlLocation {... this.props} props =  {this.props} />                            
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
            <UserPanel clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} {... this.props} />
            </>
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