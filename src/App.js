import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from './pages/Loading';
import { connect } from 'react-redux';
import axios from 'axios';
import { URL_DEV } from './constants';
import { logout, login } from './redux/reducers/auth_user'
import swal from 'sweetalert'

const Loader = x => Loadable({
    loading: Loading,
    loader: x
})

const Login = Loader(() => import('./pages/Login') )

const Home = Loader(() => import('./pages/Home') )

const Tareas = Loader(() => import('./pages/Usuarios/Tareas') )
const Empresas = Loader(() => import('./pages/Usuarios/Empresas') )
const Usuarios = Loader(() => import('./pages/Usuarios/Usuarios') )

const Normas = Loader(() => import('./pages/Normas') )

const Leads = Loader(() => import('./pages/Leads/Leads') )
const Prospectos = Loader(() => import('./pages/Leads/Prospectos') )
const Clientes = Loader(() => import('./pages/Leads/Clientes') )

const MiProyecto = Loader(() => import('./pages/MiProyecto') )

const Cuentas = Loader(() => import('./pages/Bancos/Cuenta') )
const EstadosCuenta = Loader(() => import('./pages/Bancos/EstadosCuenta') )
const Traspasos = Loader(() => import('./pages/Bancos/Traspasos') )

const Conceptos = Loader(() => import('./pages/Presupuesto/Conceptos') )
const Rendimiento = Loader(() => import('./pages/Presupuesto/Rendimiento') )

const Ingresos = Loader(() => import('./pages/Administracion/Ingresos/Ingresos') )
const IngresosForm = Loader(() => import('./pages/Administracion/Ingresos/IngresosForm') )

const Egresos = Loader(() => import('./pages/Administracion/Egresos/Egresos') )
const EgresosForm = Loader(() => import('./pages/Administracion/Egresos/EgresosForm') )

const Facturacion = Loader(() => import('./pages/Administracion/Facturacion') )

const Proveedores = Loader(() => import('./pages/Administracion/Proveedor/Proveedor') )
const ProveedoresForm = Loader(() => import('./pages/Administracion/Proveedor/ProveedorForm') )

const Proyectos = Loader(() => import('./pages/Proyectos/Proyectos') )
const Ventas = Loader(() => import('./pages/Proyectos/Ventas') )
const Compras = Loader(() => import('./pages/Proyectos/Compras') )
const SolicitudCompra = Loader(() => import('./pages/Proyectos/SolicitudCompra') )
const Remision = Loader(() => import('./pages/Proyectos/Remision') )

const Areas = Loader( () => import('./pages/Catalogos/Areas') )

class App extends Component{
    async componentDidMount(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = response
                login(data)
            },
            (error) => {
                if(error.response.status === 401){
                    this.logoutUser()    
                }
                else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
                console.log(error.response, 'response')
                /* this.logoutUser() */
            }
        ).catch((error) => {
            /* this.logoutUser() */
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }
    async logoutUser(){
        const { logout, authUser : {access_token: access_token}, history } = this.props
        
        await axios.get(URL_DEV + 'user/logout', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                logout();
                history.push('/login')
            },
            (error) => {
                if(error.response.status === 401){
                    logout();
                    history.push('/login')
                }
            }
        ).catch((error) => {
            /* logout();
            history.push('/login') */
        })
    }
    render(){
        const { authUser , history } = this.props
        if(authUser.access_token === ''){
            history.push('/login')
        }
        return(
            <div className="">
                
                <Route path = "/login" exact component = { Login } />

                <Route path = "/" exact component= { Home } />

                <Route path = "/mi-proyecto" exact component = { MiProyecto } />

                <Route path = "/usuarios/usuarios" exact component = { Usuarios } />
                <Route path = "/usuarios/tareas" exact component = { Tareas } />
                <Route path = "/usuarios/empresas" exact component ={ Empresas } />

                <Route path = "/presupuesto/conceptos" exact component ={ Conceptos } />
                <Route path = "/presupuesto/rendimiento" exact component ={ Rendimiento } />

                <Route path = "/proyectos/proyectos" exact component ={ Proyectos } />
                <Route path = "/proyectos/ventas" exact component ={ Ventas } />
                <Route path = "/proyectos/compras" exact component ={ Compras } />
                <Route path = "/proyectos/solicitud-compra" exact component ={ SolicitudCompra } />
                <Route path = "/proyectos/remision" exact component ={ Remision } />
                
                <Route path = "/administracion/egresos" exact component ={ Egresos } />
                <Route path = "/administracion/egresos/:action" exact component ={ EgresosForm } />

                <Route path = "/administracion/ingresos" exact component ={ Ingresos } />
                <Route path = "/administracion/ingresos/:action" exact component ={ IngresosForm } />
                
                <Route path = "/administracion/facturacion" exact component ={ Facturacion } />

                <Route path = "/administracion/proveedores" exact component ={ Proveedores } />
                <Route path = "/administracion/proveedores/:action" exact component ={ ProveedoresForm } />

                <Route path = "/bancos/cuentas" exact component ={ Cuentas } />
                <Route path = "/bancos/estados-cuenta" exact component ={ EstadosCuenta } />
                <Route path = "/bancos/traspasos" exact component ={ Traspasos } />
                
                <Route path = "/leads/leads" exact component ={ Leads } />
                <Route path = "/leads/prospectos" exact component = { Prospectos } />
                <Route path = "/leads/clientes" exact component = { Clientes } />

                <Route path = "/normas" exact component ={ Normas } />

                <Route path = "/catalogos/areas" exact component ={ Areas } />
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