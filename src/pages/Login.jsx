import React, { Component } from 'react'
import LoginForm from '../components/forms/LoginForm'
//import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Title } from '../components/texts'
import { logout } from '../redux/reducers/auth_user'

class Login extends Component{
    
    componentDidMount(){
        const { logout, authUser , history } = this.props
        logout()
        if(authUser.access_token !== ''){
            history.push('/')
        }else{
            logout();
        }
    }
    
    render(){
        
        return(
            
            <div className="vh-100 d-flex flex-column flex-root">
                    <div className="login login-3 login-signin-on d-flex flex-row-fluid" id="kt_login" >
                        <div className="d-flex flex-center bgi-size-cover bgi-no-repeat flex-row-fluid" style ={ { backgroundImage: "url('/1.jpg')" } }>
                            <div className="row d-flex flex-center ">
                                <div className="d-flex flex-center mb-3">
                                    <a href="#" >
                                        <img src="/inein.png" className="img-empresa  mr-5" alt="" />
                                        <img src="/im.png" className="img-empresa ml-5 mr-5" alt="" />
                                        <img src="/Rocco.png" className="img-empresa ml-5" alt="" style={{height:"3rem"}} />
                                    </a>
                                </div>
                                <div className="login-form text-center text-white p-7 position-relative overflow-hidden pt-4">
                                    <div className="login-signin">
                                        <div className="mb-20">
                                            <h3 className="font-weight-normal pt-5 pb-2">Iniciar sesión</h3>
                                            <p className="pb-2 pt-1">Escribe tu correo y contraseña</p>
                                        </div>
                                            <div className=" align-items-center justify-content-center">
                                                <LoginForm { ... this.props} />
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
    logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);