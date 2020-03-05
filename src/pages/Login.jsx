import React, { Component } from 'react'
import LoginForm from '../components/forms/LoginForm'
import Card from 'react-bootstrap/Card'
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
            <div className="vh-100 d-flex align-items-center justify-content-center">
                <Card className="card__form">
                    <Card.Body>
                        <Title className="text-center mb-4">
                            Inicia sesión
                        </Title>
                        <LoginForm { ... this.props} />
                    </Card.Body>
                </Card>             
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