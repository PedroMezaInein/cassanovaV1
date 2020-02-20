import React, { Component } from 'react'
import LoginForm from '../components/forms/LoginForm'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Login extends Component{
    render(){
        const { authUser , history } = this.props
        if(authUser.access_token !== ''){
            history.push('/')
        }
        return(
            <div className="vh-100 d-flex align-items-center justify-content-center">
                <Card className="card-form">
                    <Card.Body>
                        <h1 className="text-center mb-4">
                            Inicia sesión
                        </h1>
                        <LoginForm { ... this.props} />
                        <Link to="/">
                            Go Home
                        </Link>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);