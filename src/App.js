import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from './pages/Loading';
import { connect } from 'react-redux';
import axios from 'axios';
import { URL_DEV } from './constants';
import { logout, login } from './redux/reducers/auth_user'

const Loader = x => Loadable({
    loading: Loading,
    loader: x
})

const Login = Loader(() => import('./pages/Login') )
const Home = Loader(() => import('./pages/Home') )
class App extends Component{
    async componentDidMount(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
            },
            (error) => {
                this.logoutUser()
            }
        ).catch((error) => {
            this.logoutUser()
        })
    }
    async logoutUser(){
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
        const { authUser , history } = this.props
        if(authUser.access_token === ''){
            history.push('login')
        }
        return(
            <div className="App">
                <Route path="/" exact component={Home}/>
                <Route path="/login" exact component={Login}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);