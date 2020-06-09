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
            
             <div class="vh-100 d-flex flex-column flex-root">
                    <div class="login login-3 login-signin-on d-flex flex-row-fluid" id="kt_login" >
                        <div class="d-flex flex-center bgi-size-cover bgi-no-repeat flex-row-fluid" style ={ { backgroundImage: "url('/bg-2.jpg')" } }>
                            <div class="login-form text-center text-white p-7 position-relative overflow-hidden">
                                <div class="d-flex flex-center mb-15">
                                    <a href="#" >
                                        <img src="/inein.png" class="max-h-75px" alt="" />
                                    </a>
                                </div>
                                <div class="login-signin">
                                    <div class="mb-20">
                                        <h3 class="opacity-40 font-weight-normal pt-5 pb-2">Iniciar sesión</h3>
                                        <p class="opacity-40 pb-2 pt-1">Escribe tu correo y contraseña</p>
                                    </div>
                                        <div className=" align-items-center justify-content-center">
                                            <LoginForm { ... this.props} />
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