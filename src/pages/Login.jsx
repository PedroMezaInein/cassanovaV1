import React, { Component } from 'react'
import LoginForm from '../components/forms/LoginForm'
import { connect } from 'react-redux'
import { logout } from '../redux/reducers/auth_user'
class Login extends Component{

    componentDidMount(){
        logout()
    }
    
    render(){
        return(
            <div className="d-flex flex-column flex-root vh-100">
                <div className="login login-4 wizard d-flex flex-column flex-lg-row flex-column-fluid">
                    <div className="login-container order-2 order-lg-1 d-flex flex-center flex-row-fluid px-7 pt-lg-0 pb-lg-0 pt-4 pb-6"  style ={ { backgroundImage: "url('/bg-3.jpg')" } }>
                        <div className="login-content d-flex flex-column pt-lg-0 align-items-center" style={{flexFlow:'column nowrap'}}>
                            <div className="login-logo pb-xl-20 pb-15">
                                <a href="https://inein.mx/" target="_blank" rel="noopener noreferrer">
                                    <img src="/inein-negro.png" className="max-h-img" alt="INEIN"/>
                                </a>
                                <a href="https://infraestructuramedica.mx/" target="_blank" rel="noopener noreferrer">
                                    <img src="/IM_color.png" className="max-h-img px-8" alt="IM"/>
                                </a>
                                <a href="https://www.rocco.mx/" target="_blank" rel="noopener noreferrer">
                                    <img src="/Rocco_negro.png" className="max-h-img" alt="ROCCO"/>
                                </a>
                            </div>
                            <div className="login-form text-center">
                                <LoginForm { ...this.props} />
                            </div>
                        </div>
                    </div>
                    <div className="login-aside order-1 order-lg-2 bgi-no-repeat d-none d-md-block">
                        <div className="login-conteiner bgi-no-repeat" style ={ { backgroundImage: "url('/architecture-plan.jpg')" } }>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => { return{ authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ logout: () => dispatch(logout()) })

export default connect(mapStateToProps, mapDispatchToProps)(Login);