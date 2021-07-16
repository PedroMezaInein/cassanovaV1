import registerUserForm from './RegisterUserForm' 
import empresaForm from './EmpresaForm'
import permisosForm from './PermisosForm'
import tareaForm from './TareaForm'
import leadForm from './LeadForm'
import prospectoForm from './ProspectoForm'
import contactoLeadForm from './ContactoLeadForm'
import clienteForm from './ClienteForm'
import cuentaForm from './bancos/CuentaForm'
import traspasoForm from './bancos/TraspasoForm'
import estadosCuentaForm from './bancos/EstadosCuentaForm'
import ingresosForm from './administracion/IngresosForm'
import egresosForm from './administracion/EgresosForm'
import proveedorForm from './administracion/ProveedorForm'
import contratoForm from './administracion/ContratoForm'
import areasForm from './catalogos/AreaForm'
import servicioForm from './catalogos/ServicioForm'
import partidaForm from './catalogos/PartidaForm'
import unidadForm from './catalogos/UnidadForm'
import origenLeadForm from './catalogos/OrigenLeadForm'
import redesSocialesForm from './catalogos/RedesSocialesForm'
import bancoForm from './catalogos/BancoForm'
import tipoForm from './catalogos/TipoForm'
import proyectosForm from './proyectos/ProyectosForm'
import avanceForm from './proyectos/AvanceForm'
import ventasForm from './proyectos/VentasForm'
import comprasForm from './proyectos/ComprasForm'
import facturaForm from './administracion/FacturaForm'
import solicitudCompraForm from './proyectos/SolicitudCompraForm'
import solicitudVentaForm from './proyectos/SolicitudVentaForm'
import bodegaForm from './proyectos/BodegaForm'
import conceptoForm from './presupuesto/ConceptoForm'
import rendimientoForm from './presupuesto/RendimientoForm'
import presupuestoForm from './presupuesto/PresupuestoForm'
import actualizarPresupuestoForm from './presupuesto/ActualizarPresupuestoForm'
import remisionForm from './proyectos/RemisionForm'
import devolucionesForm from './proyectos/DevolucionesForm'
import contabilidadForm from './reportes/ContabilidadForm'
import flujosForm from './administracion/FlujosForm'
import clienteUserForm from './usuarios/ClienteUserForm'
import changePasswordForm from './perfil/ChangePasswordForm'
import solicitarVacacionesForm from './perfil/SolicitarVacacionesForm'
import estatusForm from './perfil/EstatusForm'
import nominaObraForm from './recursoshumanos/NominaObraForm'
import adjuntosForm from './AdjuntosForm'
import nominaAdminForm from './recursoshumanos/NominaAdminForm'
import empleadosForm from './recursoshumanos/EmpleadosForm'
import agregarConcepto from './presupuesto/AgregarConcepto'
import ultimoPresupuestoForm from './presupuesto/UltimoPresupuestoForm'
import precioDiseñoForm from './catalogos/PrecioDiseñoForm'
import presupuestoDiseñoForm from './presupuesto/PresupuestoDiseñoForm'
import partidasDiseñoForm from './catalogos/PartidasDiseñoForm'
import diseñoForm from './catalogos/DiseñoForm'
import obraForm from './catalogos/ObraForm'
import ticketView from './calidad/Tickets/TicketView' 
//import ticketView2 from './calidad/Tickets/TicketView2' 
import procesoTicketForm from './calidad/ProcesoTicketForm'
import CartasCalidadForm from './calidad/CartasCalidadForm'
import agregarVacacionesForm from './recursoshumanos/AgregarVacacionesForm'
import flujosReportesVentas from './reportes/FlujosReportesVentas'
import flujosReportes from './reportes/FlujosReportes'
import tablaReportes from './reportes/TablaReportes'
import accordionEstadosResultados from './reportes/AccordionEstadosResultados'
import tablaEstadosResultados from './reportes/TablaEstadosResultados'
import tablaReportesDepartamento from './reportes/TablaReportesDepartamento'
import headersTotales from './reportes/HeadersTotales'
import formPrestamos from './proyectos/FormPrestamos'
import documentosForm from './administracion/DocumentosForm'
import imssForm from './recursoshumanos/ImssForm'
import prestamosForm from './recursoshumanos/PrestamosForm'
import abonoPrestamosForm from './recursoshumanos/AbonoPrestamosForm'
import adjuntosEmpresaForm from './catalogos/AdjuntosEmpresaForm'
import agendaLlamada from './leads/AgendaLlamada'
import agendaLlamadaUbicacion from './leads/AgendaLlamadaUbicacion'
import historialContactoForm from './leads/info/HistorialContactoForm'
import agendarCitaForm from './leads/info/AgendarCitaForm'
import presupuestoDiseñoCRMForm from './leads/info/PresupuestoDiseñoCRMForm'
import presupuestoGenerado from './leads/info/PresupuestoGenerado'
import presupuestoGeneradoNoCrm from './presupuesto/PresupuestoGeneradoNoCrm'
import informacionGeneral from './leads/InformacionGeneral'
import formLlamada from './leads/FormLlamada'
import formWhatsapp from './leads/FormWhatsapp'
import mensajePrincipal from './leads/MensajePrincipal'
import accesosForm from './usuarios/AccesosForm'
import parrillaContenidoForm from './mercadotecnia/ParrillaContenidoForm'
import mercadotecniaForm from './reportes/MercadotecniaForm'
import mercaProveedoresForm from './mercadotecnia/MercaProveedoresForm'
import solicitudEgresosForm from './mercadotecnia/SolicitudEgresosForm'
import planTrabajoForm from './mercadotecnia/PlanTrabajoForm'
import rolesMercadotecniaForm from './catalogos/RolesMercadotecniaForm'
import pagosForm from './mercadotecnia/PagosForm'
import agendarReunionGoogle from './leads/AgendarReunionGoogle'
import formProveedoresRRHH from './leads/FormProveedoresRRHH'
import facturaExtranjera from './FacturaExtranjera'
import comentarios from './Comentarios'
import buscarLead from './leads/BuscarLead'
import formCalendarioTareas from './usuarios/FormCalendarioTareas'
import comentarioForm from './ComentarioForm'
import timelineComments from './TimelineComments'
import tags from './usuarios/tareas/Tags'
import listPanel from './usuarios/tareas/ListPanel'
import itemTaskList from './usuarios/tareas/ItemTaskList'
import task from './usuarios/tareas/Task'
import writeComment from './usuarios/tareas/WriteComment'
import commentsPanel from './usuarios/tareas/CommentsPanel'
import addTaskForm from './usuarios/tareas/AddTaskForm'
import TagColorForm from './usuarios/tareas/TagColorForm'
import NewTag from './usuarios/tareas/NewTag'
import EquipoForm from './proyectos/EquipoForm'
import EtiquetasForm from './catalogos/EtiquetasForm'
import FormEstadoResultados from './reportes/FormEstadoResultados'
import FormularioContrato from './recursoshumanos/FormularioContrato'
import ContratoFormRH from './recursoshumanos/ContratoFormRH'
import NotaBitacoraForm from './proyectos/NotaBitacoraForm'
import PestamosDevoluciones from './proyectos/PestamosDevoluciones'
import FormCalendarioIEquipos from './proyectos/FormCalendarioIEquipos'
import DetailsInstalacion from './proyectos/DetailsInstalacion'
import TableTickets from './MiProyecto/TableTickets'
import HistorialHM from './proyectos/HistorialHM'
import FormNuevoTicket from './calidad/Tickets/FormNuevoTicket'
export const RegisterUserForm = registerUserForm
export const EmpresaForm = empresaForm
export const PermisosForm = permisosForm
export const TareaForm = tareaForm
export const LeadForm = leadForm
export const ProspectoForm = prospectoForm
export const ContactoLeadForm = contactoLeadForm
export const ClienteForm = clienteForm
export const CuentaForm = cuentaForm
export const TraspasoForm = traspasoForm
export const EstadosCuentaForm = estadosCuentaForm
export const IngresosForm = ingresosForm
export const EgresosForm = egresosForm
export const ProveedorForm = proveedorForm
export const ContratoForm = contratoForm
export const AreasForm = areasForm
export const ServicioForm = servicioForm
export const PartidaForm = partidaForm
export const UnidadForm = unidadForm
export const OrigenLeadForm = origenLeadForm
export const RedesSocialesForm = redesSocialesForm
export const BancoForm = bancoForm
export const TipoForm = tipoForm
export const ProyectosForm = proyectosForm
export const AvanceForm = avanceForm
export const VentasForm = ventasForm
export const ComprasForm = comprasForm
export const FacturaForm = facturaForm
export const SolicitudCompraForm = solicitudCompraForm
export const SolicitudVentaForm = solicitudVentaForm
export const ConceptoForm = conceptoForm
export const RendimientoForm = rendimientoForm
export const PresupuestoForm = presupuestoForm
export const ActualizarPresupuestoForm = actualizarPresupuestoForm
export const RemisionForm = remisionForm
export const DevolucionesForm = devolucionesForm
export const ContabilidadForm = contabilidadForm
export const FlujosForm = flujosForm
export const ClienteUserForm = clienteUserForm
export const ChangePasswordForm = changePasswordForm
export const SolicitarVacacionesForm = solicitarVacacionesForm
export const EstatusForm = estatusForm
export const NominaObraForm = nominaObraForm
export const AdjuntosForm = adjuntosForm
export const NominaAdminForm = nominaAdminForm
export const EmpleadosForm = empleadosForm
export const AgregarConcepto = agregarConcepto
export const UltimoPresupuestoForm = ultimoPresupuestoForm
export const PrecioDiseñoForm = precioDiseñoForm
export const PresupuestoDiseñoForm = presupuestoDiseñoForm
export const PartidasDiseñoForm = partidasDiseñoForm
export const DiseñoForm = diseñoForm
export const ObraForm = obraForm
export const TicketView = ticketView
//export const TicketView2 = ticketView2
export const AgregarVacacionesForm = agregarVacacionesForm
export const ProcesoTicketForm = procesoTicketForm
export const FlujosReportesVentas = flujosReportesVentas
export const FlujosReportes = flujosReportes
export const TablaReportes = tablaReportes
export const AccordionEstadosResultados = accordionEstadosResultados
export const TablaEstadosResultados = tablaEstadosResultados
export const TablaReportesDepartamento = tablaReportesDepartamento
export const HeadersTotales = headersTotales
export const BodegaForm = bodegaForm
export const FormPrestamos = formPrestamos
export const DocumentosForm = documentosForm
export const ImssForm = imssForm
export const PrestamosForm = prestamosForm
export const AbonoPrestamosForm = abonoPrestamosForm
export const AdjuntosEmpresaForm = adjuntosEmpresaForm
export const AgendaLlamada = agendaLlamada
export const AgendaLlamadaUbicacion = agendaLlamadaUbicacion
export const HistorialContactoForm = historialContactoForm
export const AgendarCitaForm = agendarCitaForm
export const PresupuestoDiseñoCRMForm = presupuestoDiseñoCRMForm
export const PresupuestoGenerado = presupuestoGenerado
export const PresupuestoGeneradoNoCrm = presupuestoGeneradoNoCrm
export const InformacionGeneral = informacionGeneral
export const FormLlamada = formLlamada
export const FormWhatsap = formWhatsapp
export const MensajePrincipal = mensajePrincipal
export const AccesosForm = accesosForm
export const ParrillaContenidoForm = parrillaContenidoForm
export const MercadotecniaForm = mercadotecniaForm
export const MercaProveedoresForm = mercaProveedoresForm
export const SolicitudEgresosForm = solicitudEgresosForm
export const PlanTrabajoForm = planTrabajoForm
export const RolesMercadotecniaForm = rolesMercadotecniaForm
export const PagosForm = pagosForm
export const AgendarReunionGoogle = agendarReunionGoogle
export const FormProveedoresRRHH = formProveedoresRRHH
export const FacturaExtranjera = facturaExtranjera
export const Comentarios = comentarios
export const BuscarLead = buscarLead
export const FormCalendarioTareas = formCalendarioTareas
export const ComentarioForm = comentarioForm
export const TimelineComments = timelineComments
export const Tags = tags
export const ListPanel = listPanel
export const ItemTaskList = itemTaskList
export const Task = task
export const WriteComment = writeComment
export const CommentsPanel = commentsPanel
export const AddTaskForm = addTaskForm
export { NewTag, TagColorForm, CartasCalidadForm, EtiquetasForm, FormEstadoResultados, FormularioContrato, ContratoFormRH, NotaBitacoraForm, 
    PestamosDevoluciones, FormCalendarioIEquipos, EquipoForm, DetailsInstalacion, TableTickets, HistorialHM, FormNuevoTicket}