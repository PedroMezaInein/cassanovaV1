import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loading from './pages/Loading';
import NotFound from './pages/NotFound';
import { connect } from 'react-redux';
import axios from 'axios';
import { URL_DEV } from './constants';
import { logout, login } from './redux/reducers/auth_user'
import { errorAlert } from './functions/alert';

/* import SalaJuntas from './pages/RecursosHumanos/SalaJuntas/SalaJuntas';
import Cursos from './pages/RecursosHumanos/Cursos/Cursos'; */
import Reuniones from './pages/RecursosHumanos/Reuniones/Reuniones';
import NominaPrestaciones from './pages/RecursosHumanos/NominaPrestaciones/NominaPrestaciones';
import { Requisiciones } from './pages/Administracion/Requisiciones/Requisiciones'
import RequisicionCompras from './pages/Administracion/RequisicionCompras/RequisicionCompras'
import RequisicionContabilidad from './pages/Administracion/RequisicionContabilidad/RequisicionContabilidad'
import TablaVehiculos from './pages/RecursosHumanos/Vehiculos/TablaVehiculos';
import TablaOperadores from './pages/RecursosHumanos/Vehiculos/TablaOperadores';
import TablaSolicitudes from './pages/RecursosHumanos/Vehiculos/TablaSolicitudes';
import SoporteTecnicoTable from './pages/Ti/Soporte/SoporteTecnicoTable';

import TicketsUser from './pages/Ti/Tickets/TicketsUserTable';
import TicketsTi from './pages/Ti/Tickets/TicketsTiTable';
import TablaInsumos from './pages/RecursosHumanos/Insumos/TablaInsumos';

const Login = React.lazy(() => import('./pages/Login') )
const Home = React.lazy(() => import('./pages/Home') )

// const TeEscuchamos = React.lazy(() => import('./pages/TeEscuchamos/TeEscuchamos') )
// const Encuesta = React.lazy(() => import('./pages/Encuesta/Encuesta') )

const Tareas = React.lazy(() => import('./pages/Usuarios/Tareas') )
const Empresas = React.lazy(() => import('./pages/Usuarios/Empresas/Empresas') )
const EmpresasForm = React.lazy(() => import('./pages/Usuarios/Empresas/EmpresasForm') )

const Usuarios = React.lazy(() => import('./pages/Usuarios/Usuarios/Usuarios') )
const UsuariosForm = React.lazy(() => import('./pages/Usuarios/Usuarios/UsuariosForm') )

const Accesos = React.lazy(() => import('./pages/Usuarios/Accesos/Accesos') )
const AccesosForm = React.lazy(() => import('./pages/Usuarios/Accesos/AccesosForm') )

const CalendarioTareas = React.lazy(() => import('./pages/Usuarios/CalendarioTareas/CalendarioTareas') )

const Normas = React.lazy(() => import('./pages/Normas') )

const Leads = React.lazy(() => import('./pages/Leads/Leads/Leads') )
const LeadsForm = React.lazy(() => import('./pages/Leads/Leads/LeadsForm') )

const Prospectos = React.lazy(() => import('./pages/Leads/Prospectos/Prospectos') )
const ProspectosForm = React.lazy(() => import('./pages/Leads/Prospectos/ProspectosForm') )

// const Clientes = React.lazy(() => import('./pages/Leads/Clientes') )
const Clientes = React.lazy(() => import('./pages/Leads/Clientes/Clientes') )
const ClientesForm = React.lazy(() => import('./pages/Leads/Clientes/ClientesForm') )

// const MiProyecto = React.lazy(() => import('./pages/MiProyecto') )
// const InicioMiProyecto = React.lazy(() => import('./pages/InicioMiProyecto') )

const Cuentas = React.lazy(() => import('./pages/Bancos/Cuenta/Cuenta') )
const CuentasForm = React.lazy(() => import('./pages/Bancos/Cuenta/CuentaForm') )
const CuentaDetails = React.lazy(() => import('./pages/Bancos/Cuenta/CuentaDetails') )

// const EstadosCuenta = React.lazy(() => import('./pages/Bancos/EstadosCuenta') )
const EstadosCuenta = React.lazy(() => import('./pages/Bancos/EstadosCuenta/EstadosCuenta') )
const EstadosCuentaForm = React.lazy(() => import('./pages/Bancos/EstadosCuenta/EstadosCuentaForm') )

const Traspasos = React.lazy(() => import('./pages/Bancos/Traspasos/Traspasos') )
const TraspasosForm = React.lazy(() => import('./pages/Bancos/Traspasos/TraspasosForm') )

const Conceptos = React.lazy(() => import('./pages/Presupuesto/Conceptos/Conceptos') )
const ConceptosForm = React.lazy(() => import('./pages/Presupuesto/Conceptos/ConceptosForm') )

const Rendimiento = React.lazy(() => import('./pages/Presupuesto/Rendimiento/Rendimiento') )
const RendimientoForm = React.lazy(() => import('./pages/Presupuesto/Rendimiento/RendimientoForm') )
const Presupuesto = React.lazy(() => import('./pages/Presupuesto/Presupuesto') )
const AddPresupuestoForm = React.lazy(() => import('./pages/Presupuesto/AddPresupuestoForm') )
const ActualizarPresupuesto = React.lazy(() => import('./pages/Presupuesto/ActualizarPresupuesto') )
const UltimoPresupuesto = React.lazy(() => import('./pages/Presupuesto/UltimoPresupuesto') )
const PresupuestoDiseño = React.lazy(() => import('./pages/Presupuesto/PresupuestoDiseño/PresupuestoDiseño') )
const PresupuestoDiseñoForm = React.lazy(() => import('./pages/Presupuesto/PresupuestoDiseño/PresupuestoDiseñoForm') )
const PresupuestosEnviados = React.lazy(() => import('./pages/Presupuesto/PresupuestosEnviados/PresupuestosEnviados') )
const PresupuestosEnviadosFinish = React.lazy(() => import('./pages/Presupuesto/PresupuestosEnviados/PresupuestosEnviadosFinish') )

const Ingresos = React.lazy(() => import('./pages/Administracion/Ingresos/Ingresos') )
const IngresosForm = React.lazy(() => import('./pages/Administracion/Ingresos/IngresosForm') )

const Egresos = React.lazy(() => import('./pages/Administracion/Egresos/Egresos') )
const EgresosForm = React.lazy(() => import('./pages/Administracion/Egresos/EgresosForm') )

// const Contratos = React.lazy(() => import('./pages/Administracion/Contratos') )
const Contratos = React.lazy(() => import('./pages/Administracion/Contratos/Contratos') )
const ContratosForm = React.lazy(() => import('./pages/Administracion/Contratos/ContratosForm') )

// const Contratosgenerador = React.lazy(() => import('./pages/Proyectos/Contratos/Contratos') )
// const ContratosgeneradorForm = React.lazy(() => import('./pages/Proyectos/Contratos/ContratosForm') )

const Facturacion = React.lazy(() => import('./pages/Administracion/Facturacion') )
const Flujos = React.lazy(() => import('./pages/Administracion/Flujos') )

const Documentos = React.lazy(() => import('./pages/Administracion/Documentos/Documentos') )
const DocumentosForm = React.lazy(() => import('./pages/Administracion/Documentos/DocumentosForm') )

const SolicitudFactura = React.lazy( () => import('./pages/Administracion/SolicitudFactura/SolicitudFactura') )
const Licencias = React.lazy( () => import('./pages/Administracion/Licencias/Licencias') )

const CalendarioPagos = React.lazy( () => import('./pages/Administracion/CalendarioPagos/CalendarioPagos') )

const Proveedores = React.lazy(() => import('./pages/Leads/Proveedor/Proveedor') )
const ProveedoresForm = React.lazy(() => import('./pages/Leads/Proveedor/ProveedorForm') )

const Proyectos = React.lazy(() => import('./pages/Proyectos/Proyectos/Proyectos') )
const ProyectosForm = React.lazy(() => import('./pages/Proyectos/Proyectos/ProyectosForm') )

const SingleProyecto = React.lazy(() => import('./pages/Proyectos/Proyectos/SingleProyecto') )

const Compras = React.lazy(() => import('./pages/Proyectos/Compras/Compras') )
const ComprasForm = React.lazy(() => import('./pages/Proyectos/Compras/ComprasForm') )

const Ventas = React.lazy(() => import('./pages/Proyectos/Ventas/Ventas') )
const VentasForm = React.lazy(() => import('./pages/Proyectos/Ventas/VentasForm') )

// const Ventas = React.lazy(() => import('./pages/Proyectos/Ventas') )
// const Compras = React.lazy(() => import('./pages/Proyectos/Compras') )
const Utilidad = React.lazy(() => import('./pages/Proyectos/Utilidad') )

const SolicitudCompra = React.lazy(() => import('./pages/Proyectos/SolicitudCompra/SolicitudCompra') )
const SolicitudCompraForm = React.lazy(() => import('./pages/Proyectos/SolicitudCompra/SolicitudCompraForm') )

// const SolicitudVenta = React.lazy(() => import('./pages/Proyectos/SolicitudVenta') )
const SolicitudVenta = React.lazy(() => import('./pages/Proyectos/SolicitudVenta/SolicitudVenta') )
const SolicitudVentaForm = React.lazy(() => import('./pages/Proyectos/SolicitudVenta/SolicitudVentaForm') )

const Remision = React.lazy(() => import('./pages/Proyectos/Remision/Remision') )
const RemisionForm = React.lazy(() => import('./pages/Proyectos/Remision/RemisionForm') )

const Bodega = React.lazy(() => import('./pages/Proyectos/Bodega/Bodega') )
const BodegaForm = React.lazy(() => import('./pages/Proyectos/Bodega/BodegaForm') )

const Equipo = React.lazy(() => import('./pages/Proyectos/Equipos/Equipo') )
const EquipoForm = React.lazy(() => import('./pages/Proyectos/Equipos/EquipoForm') )

const CalendarioProyectos = React.lazy(() => import('./pages/Proyectos/Calendario/CalendarioProyectos') )

const Devoluciones = React.lazy(() => import('./pages/Proyectos/Devoluciones/Devoluciones') )
const DevolucionesForm = React.lazy(() => import('./pages/Proyectos/Devoluciones/DevolucionesForm') )

const CalendarioInstalacion = React.lazy(() => import('./pages/Proyectos/CalendarioInstalacion/CalendarioInstalacion') )

const Areas = React.lazy( () => import('./pages/Catalogos/Areas') )
const Partidas = React.lazy( () => import('./pages/Catalogos/Partidas') )
const Unidades = React.lazy( () => import('./pages/Catalogos/Unidades') )
const TiposContratos = React.lazy( () => import('./pages/Catalogos/TiposContratos') )
const Bancos = React.lazy( () => import('./pages/Catalogos/Bancos') )
const PrecioDiseño = React.lazy( () => import('./pages/Catalogos/PrecioDiseño/PrecioDiseño') )
const PrecioDiseñoForm = React.lazy( () => import('./pages/Catalogos/PrecioDiseño/PrecioDiseñoForm') )
const PartidasDiseño = React.lazy( () => import('./pages/Catalogos/PartidasDiseño/PartidasDiseño') )
const PartidasDiseñoForm = React.lazy( () => import('./pages/Catalogos/PartidasDiseño/PartidasDiseñoForm') )
const AdjuntosEmpresa = React.lazy( () => import('./pages/Catalogos/AdjuntosEmpresa/AdjuntosEmpresa') )
const AdjuntosEmpresaForm = React.lazy( () => import('./pages/Catalogos/AdjuntosEmpresa/AdjuntosEmpresaForm') )
const Diseño = React.lazy( () => import('./pages/Catalogos/Diseño') )
const OrigenesLeads = React.lazy( () => import('./pages/Catalogos/OrigenesLeads') )
const RedesSociales = React.lazy( () => import('./pages/Catalogos/RedesSociales') )
const RolesMercadotecnia = React.lazy( () => import('./pages/Catalogos/RolesMercadotecnia') )
const Servicios = React.lazy( () => import('./pages/Catalogos/Servicios') )
// const Prestaciones = React.lazy( () => import('./pages/Catalogos/Prestaciones') )

const ConceptosFacturacion = React.lazy( () => import('./pages/Catalogos/ConceptoFacturacion') )

const Contabilidad = React.lazy( () => import('./pages/Reportes/Contabilidad') )
const ReporteVentas = React.lazy( () => import('./pages/Reportes/ReporteVentas') )
const FlujoProyectos = React.lazy( () => import('./pages/Reportes/FlujoProyectos') )
const FlujoDepartamentos = React.lazy( () => import('./pages/Reportes/FlujoDepartamentos') )
const EstadoResultados = React.lazy( () => import('./pages/Reportes/EstadoResultados') )
const ReporteMercadotecnia = React.lazy( () => import('./pages/Reportes/Mercadotecnia/Mercadotecnia') )

const AccountSettings = React.lazy(() => import('./pages/Perfil/AccountSettings') )
const Calendario = React.lazy(() => import('./pages/Perfil/Calendario') )
const Notificaciones = React.lazy(() => import('./pages/Perfil/Notificaciones') )

const NominaObra = React.lazy(() => import('./pages/RecursosHumanos/NominaObra/NominaObra') )
const NominaObraForm = React.lazy(() => import('./pages/RecursosHumanos/NominaObra/NominaObraForm') )
const NominaObraSingle = React.lazy(() => import('./pages/RecursosHumanos/NominaObraSingle') )

const NominaAdmin = React.lazy(() => import('./pages/RecursosHumanos/NominaAdmin/NominaAdmin') )
const NominaAdminForm = React.lazy(() => import('./pages/RecursosHumanos/NominaAdmin/NominaAdminForm') )
const NominaAdminSingle = React.lazy(() => import('./pages/RecursosHumanos/NominaAdmin/NominaAdminSingle') )
const Checador = React.lazy(() => import('./pages/RecursosHumanos/Checador/Checador') )
const ContratosRh = React.lazy(() => import('./pages/RecursosHumanos/ContratosRh/ContratosRh') )
const ContratosRhForm = React.lazy(() => import('./pages/RecursosHumanos/ContratosRh/ContratosRhForm') )

// const Empleados = React.lazy(() => import('./pages/RecursosHumanos/Empleados') )
const Empleados = React.lazy(() => import('./pages/RecursosHumanos/Empleados/Empleados') )
const EmpleadosForm = React.lazy(() => import('./pages/RecursosHumanos/Empleados/EmpleadosForm') )
const Biblioteca = React.lazy(() => import('./pages/RecursosHumanos/Biblioteca/Biblioteca') )

// const PagoImpuestos = React.lazy(() => import('./pages/RecursosHumanos/PagoImpuestos/PagoImpuestos') )
// const PagoImpuestosForm = React.lazy(() => import('./pages/RecursosHumanos/PagoImpuestos/PagoImpuestosForm') )
// const PagoImpuestoSingle =  React.lazy(() => import('./pages/RecursosHumanos/PagoImpuestos/PagoImpuestoSingle') )

const Imss = React.lazy(() => import('./pages/RecursosHumanos/Imss/Imss') )
const ImssForm = React.lazy(() => import('./pages/RecursosHumanos/Imss/ImssForm') )

const Prestamos = React.lazy(() => import('./pages/RecursosHumanos/Prestamos/Prestamos') )
const PrestamosForm = React.lazy(() => import('./pages/RecursosHumanos/Prestamos/PrestamosForm') )

// const Vacaciones = React.lazy(() => import('./pages/RecursosHumanos/Vacaciones/Vacaciones') )

const Minutas = React.lazy(() => import('./pages/RecursosHumanos/Minutas/Minutas') )

const Prestaciones = React.lazy(() => import('./pages/RecursosHumanos/Prestaciones/Prestaciones') )

const TicketTable = React.lazy(() => import('./pages/Calidad/LevantamientoTickets/TicketTable') )
const AddTicket = React.lazy(() => import('./pages/Calidad/LevantamientoTickets/AddTicket') )
const TicketDetails = React.lazy(() => import('./pages/Calidad/LevantamientoTickets/TicketDetails') )

const CartasGarantia = React.lazy(() => import('./pages/Calidad/CartasGarantia/CartasGarantia') )

const CalendarioTicket = React.lazy(() => import('./pages/Calidad/CalendarioTicket/CalendarioTicket') )

const MaterialEmpresa = React.lazy(() => import('./pages/Mercadotecnia/MaterialEmpresa/MaterialEmpresa') )
const MaterialCliente = React.lazy(() => import('./pages/Mercadotecnia/MaterialCliente/MaterialCliente') )
const ParrillasContenido = React.lazy(() => import('./pages/Mercadotecnia/ParrillasContenido/ParrillasContenido') )
const PlanTrabajo = React.lazy(() => import('./pages/Mercadotecnia/PlanTrabajo/PlanTrabajo') )

const MercaProveedores = React.lazy(() => import('./pages/Mercadotecnia/Proveedores/Proveedores') )
const MercaProveedoresForm = React.lazy(() => import('./pages/Mercadotecnia/Proveedores/ProveedoresForm') )

const SolicitudEgresos = React.lazy(() => import('./pages/Mercadotecnia/Solicitud-Pagos/SolicitudEgresos') )
const SolicitudEgresosForm = React.lazy(() => import('./pages/Mercadotecnia/Solicitud-Pagos/SolicitudEgresosForm') )

const Pagos = React.lazy(() => import('./pages/Mercadotecnia/Pagos/Pagos') )
const PagosForm = React.lazy(() => import('./pages/Mercadotecnia/Pagos/PagosForm') )
const NotificacionesCorreos = React.lazy(() => import('./pages/Plataforma/NotificacionesCorreos') )

const Etiquetas = React.lazy( () => import('./pages/Catalogos/Etiquetas') )

const Modulo = React.lazy(() => import('./pages/RecursosHumanos/Modulos/Modulos') )
const RepseForm = React.lazy(() => import('./pages/RecursosHumanos/Modulos/RepseForm'))

class App extends Component{

    async componentDidMount(){
        const { history } = this.props
        let queryString = history.location.search
        let token = null
        if (queryString) {
            let params = new URLSearchParams(queryString)
            token = params.get("token")
        }
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}user`, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = response
                login(data)
            }, (error) => {
                const { status } = error.response
                if(status === 401){
                    if(token){
                    }
                    else{ history.push('/login') }
                }else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    shouldComponentUpdate(nextProps){
        const { history } = this.props
        let queryString = history.location.search
        let token = ''
        if (queryString) {
            let params = new URLSearchParams(queryString)
            token = params.get("token")
        }
        if(token === ''){
            if(nextProps.authUser.access_token === ''){
                history.push('/login')
            }
        }
        return false
    }

    async logoutUser(){
        const { logout, authUser : {access_token }, history } = this.props
        await axios.get(`${URL_DEV}user/logout`, { headers: {Authorization:`Bearer ${access_token}`}}).then(
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
        ).catch((error) => { })
    }
    render(){
        
        return(
            <div>
                <Suspense fallback={<div><Loading /></div>}>
                <Switch>

                    {/* ANCHOR Routes from login */}

                    <Route path = "/login" exact component = { Login } />

                    {/*  ANCHOR Routes for home */}

                    <Route path = "/" exact component= { Home } />

                     {/* ANCHOR Routes for mi proyecto */}

                    {/* <Route path = "/mi-proyecto" exact component = { MiProyecto } /> */}
                    {/* <Route path = "/mi-proyecto" exact component = { InicioMiProyecto } /> */}

                    {/* ANCHOR Routes for usuarios */}

                    {/* <Route path = "/te-escuchamos" exact component = { TeEscuchamos } /> */}
                    
                    {/* <Route path = "/mi-proyecto/encuesta" exact component = { Encuesta } /> */}

                    <Route path = "/usuarios/usuarios" exact component = { Usuarios } />
                    <Route path = "/usuarios/usuarios/:action" exact component ={ UsuariosForm } />

                    <Route path = "/usuarios/tareas" exact component = { Tareas } />

                    <Route path = "/usuarios/empresas" exact component ={ Empresas } />
                    <Route path = "/usuarios/empresas/:action" exact component ={ EmpresasForm } />

                    <Route path = "/usuarios/accesos" exact component = { Accesos } />
                    <Route path = "/usuarios/accesos/:action" exact component ={ AccesosForm } />

                    <Route path = "/usuarios/calendario-tareas" exact component ={ CalendarioTareas } />

                    {/*  ANCHOR Routes for presupuesto */}

                    <Route path = "/presupuesto/conceptos" exact component ={ Conceptos } />
                    <Route path = "/presupuesto/conceptos/:action" exact component ={ ConceptosForm } />

                    <Route path = "/presupuesto/rendimiento" exact component ={ Rendimiento } />
                    <Route path = "/presupuesto/rendimiento/:action" exact component ={ RendimientoForm } />

                    <Route path = "/presupuesto/presupuesto" exact component ={ Presupuesto } />
                    <Route path = "/presupuesto/presupuesto/add" exact component ={ AddPresupuestoForm } />
                    <Route path = "/presupuesto/presupuesto/update" exact component ={ ActualizarPresupuesto } />  
                    <Route path = "/presupuesto/presupuesto/finish" exact component ={ UltimoPresupuesto } />

                    <Route path = "/presupuesto/presupuesto-diseño" exact component ={ PresupuestoDiseño } />  
                    <Route path = "/presupuesto/presupuesto-diseño/:action" exact component ={ PresupuestoDiseñoForm } />   
                    
                    <Route path = "/presupuesto/utilidad-presupuestos" exact component = {PresupuestosEnviados} />
                    <Route path = "/presupuesto/utilidad-presupuestos/finish" exact component = {PresupuestosEnviadosFinish} />

                    {/*  ANCHOR Routes for proyectos */}

                    <Route path = "/proyectos/proyectos" exact component = { Proyectos } />
                    
                    <Route path = "/proyectos/proyectos/:action" exact component ={ ProyectosForm } />
                    <Route path = "/proyectos/proyectos/single/:id" exact component ={ SingleProyecto } />
                    
                    {/* <Route path = "/proyectos/ventas" exact component ={ Ventas } /> */}
                    {/* <Route path = "/proyectos/compras" exact component ={ Compras } /> */}

                    <Route path = "/proyectos/remision" exact component ={ Remision } />
                    <Route path = "/proyectos/remision/:action" exact component ={ RemisionForm } />

                    <Route path = "/proyectos/compras" exact component ={ Compras } />
                    <Route path = "/proyectos/compras/:action" exact component ={ ComprasForm } />

                    <Route path = "/proyectos/ventas" exact component ={ Ventas } />
                    <Route path = "/proyectos/ventas/:action" exact component ={ VentasForm } />

                    <Route path = "/proyectos/solicitud-compra" exact component ={ SolicitudCompra } />
                    <Route path = "/proyectos/solicitud-compra/:action" exact component ={ SolicitudCompraForm } />

                    <Route path = "/proyectos/solicitud-venta" exact component ={ SolicitudVenta } />
                    <Route path = "/proyectos/solicitud-venta/:action" exact component ={ SolicitudVentaForm } />

                    {/* <Route path = "/proyectos/solicitud-venta" exact component ={ SolicitudVenta } /> */}

                    <Route path = "/proyectos/bodega" exact component ={ Bodega } />
                    <Route path = "/proyectos/bodega/:action" exact component ={ BodegaForm } />

                    <Route path = "/proyectos/equipos" exact component ={ Equipo } />
                    <Route path = "/proyectos/equipos/:action" exact component ={ EquipoForm } />

                    <Route path = "/proyectos/calendario-proyectos" exact component = { CalendarioProyectos } />

                    <Route path = "/proyectos/devoluciones" exact component ={ Devoluciones } />
                    <Route path = "/proyectos/devoluciones/:action" exact component ={ DevolucionesForm } />

                    <Route path = "/proyectos/calendario-instalacion-equipos" exact component = { CalendarioInstalacion } />
                    
                    {/*  ANCHOR Routes for administracion */}

                    <Route path = "/administracion/egresos" exact component ={ Egresos } />
                    <Route path = "/administracion/egresos/:action" exact component ={ EgresosForm } />

                    <Route path = "/administracion/ingresos" exact component ={ Ingresos } />
                    <Route path = "/administracion/ingresos/:action" exact component = { IngresosForm } />

                    {/* <Route path = "/administracion/contratos" exact component ={ Contratos } /> */}
                    <Route path = "/administracion/contratos" exact component ={ Contratos } />
                    <Route path = "/administracion/contratos/:action" exact component ={ ContratosForm } />

                    {/* <Route path = "/proyectos/generador-contratos" exact component ={ Contratosgenerador } /> */}
                    {/* <Route path = "/proyectos/generador-contratos/:action" exact component ={ ContratosgeneradorForm } /> */}

                    <Route path = "/administracion/facturacion" exact component ={ Facturacion } />
                    <Route path = "/administracion/flujos" exact component ={ Flujos } />

                    <Route path = "/leads/proveedores" exact component ={ Proveedores } />
                    <Route path = "/leads/proveedores/:action" exact component ={ ProveedoresForm } />

                    <Route path = "/administracion/documentos" exact component ={ Documentos } />
                    <Route path = "/administracion/documentos/:action" exact component ={ DocumentosForm } />

                    <Route path = "/administracion/solicitud-factura" exact component = { SolicitudFactura } />
                    
                    <Route path = "/administracion/utilidad" exact component ={ Utilidad } />
                    <Route path = "/administracion/licencias-equipos" exact component ={ Licencias } />

                    <Route path = "/administracion/calendario-pagos" exact component = { CalendarioPagos } />
                    <Route path="/administracion/gasto" exact component={Requisiciones} />
                    <Route path="/administracion/gasto-compras" exact component={RequisicionCompras} />
                    <Route path="/administracion/gastos" exact component={RequisicionContabilidad} />

                    {/*  ANCHOR Routes for bancos */}

                    <Route path = "/bancos/cuentas" exact component ={ Cuentas } />
                    <Route path = "/bancos/cuentas/:action" exact component ={ CuentasForm } />
                    <Route path = "/bancos/cuentas/details/:id" exact component ={ CuentaDetails } />

                    {/* <Route path = "/bancos/estados-cuenta" exact component ={ EstadosCuenta } /> */}
                    <Route path = "/bancos/estados-cuenta" exact component ={ EstadosCuenta } />
                    <Route path = "/bancos/estados-cuenta/:action" exact component ={ EstadosCuentaForm } />

                    <Route path = "/bancos/traspasos" exact component ={ Traspasos } />
                    <Route path = "/bancos/traspasos/:action" exact component ={ TraspasosForm } />

                    {/*  ANCHOR Routes for leads */}

                    <Route path = "/leads/leads" exact component ={ Leads } />
                    <Route path = "/leads/leads/:action" exact component ={ LeadsForm } />

                    <Route path = "/leads/prospectos" exact component = { Prospectos } />
                    <Route path = "/leads/prospectos/:action" exact component = { ProspectosForm } />

                    <Route path = "/leads/clientes" exact component = { Clientes } />
                    <Route path = "/leads/clientes/:action" exact component = { ClientesForm } />

                    {/* ANCHOR Routes for normas */}

                    <Route path = "/normas" exact component ={ Normas } />

                    {/* ANCHOR Routes for catálogos */}

                    <Route path = "/catalogos/areas" exact component ={ Areas } />
                    <Route path = "/catalogos/partidas" exact component ={ Partidas } />
                    <Route path = "/catalogos/unidades" exact component ={ Unidades } />
                    <Route path = "/catalogos/tipos-contratos" exact component ={ TiposContratos } />
                    <Route path = "/catalogos/bancos" exact component ={ Bancos } />
                    <Route path = "/catalogos/roles-mercadotecnia" exact component ={ RolesMercadotecnia } />
                    <Route path = "/catalogos/servicios" exact component ={ Servicios } />
                    {/* <Route path = "/catalogos/prestaciones" exact component ={ Prestaciones } /> */}
                    
                    <Route path = "/catalogos/precio-diseno" exact component ={ PrecioDiseño } />
                    <Route path = "/catalogos/precio-diseno/:action" exact component ={ PrecioDiseñoForm } />
                    
                    <Route path = "/catalogos/partidas-diseño" exact component ={ PartidasDiseño } />
                    <Route path = "/catalogos/partidas-diseño/:action" exact component ={ PartidasDiseñoForm } />
                    
                    <Route path = "/catalogos/adjuntos" exact component ={ AdjuntosEmpresa } />
                    <Route path = "/catalogos/adjuntos/:action" exact component ={ AdjuntosEmpresaForm } />
                    
                    <Route path = "/catalogos/tabulador" exact component ={ Diseño } />
                    <Route path = "/catalogos/origenes-leads" exact component = { OrigenesLeads } />
                    <Route path = "/catalogos/redes-sociales" exact component = { RedesSociales } />
                    
                    <Route path = "/catalogos/tareas-etiquetas" exact component ={ Etiquetas } />
                    <Route path = "/catalogos/conceptos-facturacion" exact component = { ConceptosFacturacion } />

                    {/* ANCHOR Routes for reportes */}

                    <Route path = "/reportes/contabilidad" exact component ={ Contabilidad } />
                    <Route path = "/reportes/reporte-ventas" exact component ={ ReporteVentas } />
                    <Route path = "/reportes/flujo-proyectos" exact component ={ FlujoProyectos } />
                    <Route path = "/reportes/flujo-departamentos" exact component ={ FlujoDepartamentos } />
                    <Route path = "/reportes/estado-resultados" exact component ={ EstadoResultados } />
                    <Route path = "/reportes/reporte-mercadotecnia" exact component = { ReporteMercadotecnia } />

                    {/* ANCHOR Routes for RH */}

                    <Route path = "/rh/nomina-obras" exact component ={ NominaObra } />  
                    <Route path = "/rh/nomina-obras/:action" exact component ={ NominaObraForm } />
                    <Route path = "/rh/nomina-obras/single/:id" exact component ={ NominaObraSingle } />

                    <Route path = "/rh/nomina-admin" exact component ={ NominaAdmin } />
                    <Route path = "/rh/nomina-admin/:action" exact component ={ NominaAdminForm } />
                    <Route path="/rh/nomina-admin/single/:id" exact component={NominaAdminSingle} />
                    {/* <Route path="/rh/nomina-prestaciones" exact component={NominaPrestaciones} /> */}
                        
                    <Route path = "/rh/checador" exact component ={ Checador } />
                    <Route path = "/rh/prestaciones" exact component ={ Prestaciones } />
                    
                    {/* <Route path = "/rh/colaboradores" exact component ={ Empleados } /> */}
                    <Route path = "/rh/colaboradores" exact component ={ Empleados } />
                    <Route path = "/rh/colaboradores/:action" exact component ={ EmpleadosForm } />

                    {/* <Route path = "/rh/pago-impuestos" exact component ={ PagoImpuestos } /> */}
                    {/* <Route path = "/rh/pago-impuestos/:action" exact component ={ PagoImpuestosForm } />
                    <Route path = "/rh/pago-impuestos/single/:id" exact component ={ PagoImpuestoSingle } /> */}
                    
                    {/* <Route path = "/rh/incidencias" exact component ={ Vacaciones } /> */}
                    <Route path = "/rh/biblioteca" exact component ={ Biblioteca } />
                    <Route path = "/rh/minutas" exact component ={ Minutas } />

                    <Route path = "/rh/imss" exact component ={ Imss } />
                    <Route path = "/rh/imss/:action" exact component = { ImssForm } />

                    <Route path = "/rh/prestamos" exact component ={ Prestamos } />
                    <Route path = "/rh/prestamos/:action" exact component = { PrestamosForm } />
                    
                    <Route path = "/rh/impresos" exact component ={ ContratosRh } />
                    <Route path = "/rh/impresos/:action" exact component ={ ContratosRhForm } />

                    <Route path = "/rh/modulo" exact component ={ Modulo } />
                    <Route path="/rh/modulo/:action" exact component={RepseForm} />
                    {/* <Route path="/rh/sala-juntas" exact component={SalaJuntas} />
                    <Route path="/rh/cursos" exact component={Cursos} /> */}
                    <Route path="/rh/reuniones" exact component={Reuniones} />
                    <Route path="/rh/vehiculos" exact component={TablaVehiculos} />
                    <Route path="/rh/operadores" exact component={TablaOperadores} />
                    <Route path="/rh/solicitudes-vehiculo" exact component={TablaSolicitudes} />

                    <Route path="/rh/insumos" exact component={TablaInsumos} />

                    {/* ANCHOR Routes for calidad */}

                    <Route path = "/calidad/tickets" exact component ={ TicketTable } />
                    <Route path = "/calidad/tickets/nuevo-ticket" exact component = { AddTicket } />
                    <Route path = "/calidad/tickets/detalles-ticket" exact component = { TicketDetails } />
                    {/* <Route path = "/calidad/tickets/detalles-ticket2" exact component = { TicketDetails2 } /> */}

                    <Route path = "/calidad/cartas-garantia" exact component = { CartasGarantia } />

                    <Route path = "/calidad/calendario-ticket" exact component = { CalendarioTicket} />

                    {/* ANCHOR Routes for mercadotécnia */}
                    
                    <Route path = "/mercadotecnia/material-empresas" exact component ={ MaterialEmpresa } />
                    <Route path = "/mercadotecnia/material-clientes" exact component ={ MaterialCliente} />
                    <Route path = "/mercadotecnia/parrillas-de-contenido" exact component ={ ParrillasContenido} />
                    <Route path = "/mercadotecnia/plan-trabajo" exact component = { PlanTrabajo } />
                    
                    <Route path = "/mercadotecnia/merca-proveedores" exact component = { MercaProveedores } />
                    <Route path = "/mercadotecnia/merca-proveedores/:action" exact component = { MercaProveedoresForm } />

                    <Route path = "/mercadotecnia/solicitud-de-pagos" exact component = { SolicitudEgresos } />
                    <Route path = "/mercadotecnia/solicitud-de-pagos/:action" exact component = { SolicitudEgresosForm } />

                    <Route path = "/mercadotecnia/pagos" exact component = { Pagos } />
                    <Route path = "/mercadotecnia/pagos/:action" exact component ={ PagosForm } />

                    {/* ANCHOR Routes for user settings */}
                    
                    <Route path = "/mi-perfil" exact component ={ AccountSettings } />
                    <Route path = "/mi-calendario" exact component ={ Calendario } />
                    <Route path = "/mis-notificaciones" exact component ={ Notificaciones } />

                    {/* ANCHOR Routes for plataforma */}
                    <Route path = "/plataforma/notificaciones" exact component ={ NotificacionesCorreos } />
                    <Route path="/ti/tickets-usuario" exact component={TicketsUser } />
                    <Route path="/ti/tickets-ti" exact component={TicketsTi } />
                    <Route path="/ti/soporte" exact component={SoporteTecnicoTable } />

                    {/* ANCHOR NOT FOUND ROUTE */}

                    <Route path = "*" component = { NotFound } />
                    
                </Switch>
                </Suspense>
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