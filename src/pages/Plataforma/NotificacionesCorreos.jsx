import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Nav, Tab, OverlayTrigger, Tooltip, Row, Accordion, Card,  } from 'react-bootstrap'
import { TagSelectSearchGray } from '../../components/form-components'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import $ from 'jquery'
import Dropdown, {
    DropdownToggle,
    DropdownMenu,
    DropdownMenuWrapper,
    MenuItem,
    DropdownButton
} from '@trendmicro/react-dropdown';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

class NotificacionesCorreos extends Component {
    state={
        keyActive:'',
        showInput: false,
        activeButton: false,
        form: {
            responsables: [],
        },
        options: {
            responsables: []
        },
        activeSubMenu: true
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!tareas)
            history.push('/')
    }
    mostrarInput() {
        const { showInput } = this.state
        this.setState({
            ...this.state,
            showInput: !showInput
        })
    }

    activeButton() {
        const { activeButton } = this.state
        this.setState({
            ...this.state,
            activeButton: !activeButton
        })
    }
    activeList = (e, tipo) => {
        let { keyActive, activeSubMenu } = this.state
        let id = e.currentTarget.id
        if(id === tipo){
            keyActive = tipo
            activeSubMenu = true
        }
        this.setState({
            ...this.state,
            keyActive,
            activeSubMenu
        })
    }
    
    updateResponsable = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'responsables'}}, true)
    }
    closeList = () => {
        let { activeSubMenu } = this.state
        activeSubMenu = false
        this.setState({
            ...this.state,
            activeSubMenu
        })
    }
    render() {
        const { options, form, showInput, activeButton, activeSubMenu, keyActive } = this.state
        return (
            <Layout active='plataforma' {...this.props}>
                    <Row>
                        {/* <div className="col-sm-3">
                        <div className="card card-custom gutter-b border-radius-24px bg-aside-notify p-4">
                            <div className="card-header d-flex align-self-center align-content-center border-0">
                                <div className="text-center">
                                    <span className="font-size-h4 font-weight-bold text-white">
                                        Modulos
                                    </span>
                                </div>
                            </div>
                            <div className="card-body p-0 position-relative">
                            <nav className="sidenav">
                                <ul className="main-buttons">
                                    <li className={`${keyActive === "recursoshumanos" ? 'active-list' :''}`}>
                                        <div className="row mx-0" id="recursoshumanos" onClick={(e) => { this.activeList(e, 'recursoshumanos') }}>
                                            <div className="w-20 text-center text-hover-primary">
                                                <span className="svg-icon svg-icon-xl svg-icon-gray-500 mr-1">
                                                    <SVG src={toAbsoluteUrl('/images/svg/recursoshumanos.svg')} />
                                                </span>
                                            </div>
                                            <div className="w-80 align-self-center pl-2">
                                                Recursos humanos
                                            </div>
                                        </div>
                                        <ul className={`hidden ${!activeSubMenu && keyActive === "recursoshumanos"? 'd-none':''}`} >
                                            <li className="py-9px px-3" onClick = { this.closeList }  >
                                                <span>
                                                    <i className="flaticon2-left-arrow-1 icon-sm text-muted mr-2"></i>
                                                    Regresar
                                                </span>
                                            </li>
                                            <li>Préstamos</li>
                                            <li>Vacaciones</li>
                                        </ul>
                                    </li>
                                    <li className={`${keyActive === "proyectos" ? 'active-list' :''}`}>
                                        <div className="row mx-0" id="proyectos" onClick={(e) => { this.activeList(e, 'proyectos') }}>
                                            <div className="w-20 text-center text-hover-primary">
                                                <span className="svg-icon svg-icon-xl svg-icon-gray-500 mr-1">
                                                    <SVG src={toAbsoluteUrl('/images/svg/proyectos.svg')} />
                                                </span>
                                            </div>
                                            <div className="w-80 align-self-center pl-2">
                                                Proyectos
                                            </div>
                                        </div>
                                        <ul className={`hidden ${!activeSubMenu && keyActive === "proyectos" ? 'd-none':''}`}>
                                            <li className="py-9px px-3" onClick = { this.closeList }  >
                                                <span>
                                                    <i className="flaticon2-left-arrow-1 icon-sm text-muted mr-2"></i>
                                                    Regresar
                                                </span>
                                            </li>
                                            <li>Solicitud de compra</li>
                                            <li>Proyectos</li>
                                            <li>Remisión</li>
                                            <li>Solicitud de venta</li>
                                        </ul>
                                    </li>
                                    <li className={`${keyActive === "administracion" ? 'active-list' :''}`}>
                                        <div className="row mx-0" id="administracion"  onClick={(e) => { this.activeList(e, 'administracion') }}>
                                            <div className="w-20 text-center text-hover-primary">
                                                <span className="svg-icon svg-icon-xl svg-icon-gray-500 mr-1">
                                                    <SVG src={toAbsoluteUrl('/images/svg/administracion.svg')} />
                                                </span>
                                            </div>
                                            <div className="w-80 align-self-center pl-2">
                                                Administración
                                            </div>
                                        </div>
                                        <ul className={`hidden ${!activeSubMenu  && keyActive === "administracion"? 'd-none':'e'}`} onClick = { () => { this.closeList() } } >
                                            <li className="py-9px px-3" onClick = { this.closeList }  >
                                                <span>
                                                    <i className="flaticon2-left-arrow-1 icon-sm text-muted mr-2"></i>
                                                    Regresar
                                                </span>
                                            </li>
                                            <li>Egreso</li>
                                            <li>Facturas</li>
                                        </ul>
                                    </li>
                                    <li className={`${keyActive === "usuarios" ? 'active-list' :''}`}>
                                        <div className="row mx-0" id="usuarios"  onClick={(e) => { this.activeList(e, 'usuarios') }}>
                                            <div className="w-20 text-center text-hover-primary">
                                                <span className="svg-icon svg-icon-xl svg-icon-gray-500 mr-1">
                                                    <SVG src={toAbsoluteUrl('/images/svg/usuarios.svg')} />
                                                </span>
                                            </div>
                                            <div className="w-80 align-self-center pl-2">
                                                Usuario
                                            </div>
                                        </div>
                                        <ul className={`hidden ${!activeSubMenu  && keyActive === "usuarios"? 'd-none':'e'}`} onClick = { () => { this.closeList() } } >
                                            <li className="py-9px px-3" onClick = { this.closeList }  >
                                                <span>
                                                    <i className="flaticon2-left-arrow-1 icon-sm text-muted mr-2"></i>
                                                    Regresar
                                                </span>
                                            </li>
                                            <li>Tareas</li>
                                            <li>Usuario</li>
                                        </ul>
                                    </li>
                                    <li className={`${keyActive === "calidad" ? 'active-list' :''}`}>
                                        <div className="row mx-0" id="calidad"  onClick={(e) => { this.activeList(e, 'calidad') }}>
                                            <div className="w-20 text-center text-hover-primary">
                                                <span className="svg-icon svg-icon-xl svg-icon-gray-500 mr-1">
                                                    <SVG src={toAbsoluteUrl('/images/svg/calidad.svg')} />
                                                </span>
                                            </div>
                                            <div className="w-80 align-self-center pl-2">
                                                Calidad
                                            </div>
                                        </div>
                                        <ul className={`hidden ${!activeSubMenu  && keyActive === "calidad"? 'd-none':'e'}`} onClick = { () => { this.closeList() } } >
                                            <li className="py-9px px-3" onClick = { this.closeList }  >
                                                <span>
                                                    <i className="flaticon2-left-arrow-1 icon-sm text-muted mr-2"></i>
                                                    Regresar
                                                </span>
                                            </li>
                                            <li>Calidad</li>
                                        </ul>
                                    </li>
                                    <li className={`${keyActive === "leads" ? 'active-list' :''}`}>
                                        <div className="row mx-0" id="leads"  onClick={(e) => { this.activeList(e, 'leads') }}>
                                            <div className="w-20 text-center text-hover-primary">
                                                <span className="svg-icon svg-icon-xl svg-icon-gray-500 mr-1">
                                                    <SVG src={toAbsoluteUrl('/images/svg/leads.svg')} />
                                                </span>
                                            </div>
                                            <div className="w-80 align-self-center pl-2">
                                                Leads
                                            </div>
                                        </div>
                                        <ul className={`hidden ${!activeSubMenu  && keyActive === "leads"? 'd-none':'e'}`} onClick = { () => { this.closeList() } } >
                                            <li className="py-9px px-3" onClick = { this.closeList }  >
                                                <span>
                                                    <i className="flaticon2-left-arrow-1 icon-sm text-muted mr-2"></i>
                                                    Regresar
                                                </span>
                                            </li>
                                            <li>Leads</li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                            </div>
                        </div>
                    </div> */}
                        <div className="col-md-12">
                        
                            <div className="card-custom card-stretch gutter-b card">
                                <div className="p-5">
                                    <Dropdown>
                                        <Dropdown.Toggle title="Módulo" />
                                        <Dropdown.Menu>
                                            <MenuItem>
                                            Módulo 1
                                            </MenuItem>
                                            <MenuItem>
                                            Módulo 2
                                            </MenuItem>
                                            <MenuItem>
                                            Módulo 3
                                            </MenuItem>
                                            <MenuItem divider />
                                            <MenuItem>
                                            Módulo 4
                                                <MenuItem>
                                                    submódulo 1
                                                </MenuItem>
                                                <MenuItem>
                                                    submódulo 2
                                                </MenuItem>
                                                <MenuItem>
                                                    submódulo 3
                                                    <MenuItem>
                                                        Otro subsubmodulo
                                                    </MenuItem>
                                                </MenuItem>
                                            </MenuItem>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="card-body">
                                    <div className="p-12">
                                        <div className="row mx-0">
                                            <div className="col-md-6 card-notify">
                                                <div className="row-notify">
                                                    <button className={`img-avatar ${!activeButton ? 'disable-bg' :''}`} onClick={() => { this.activeButton() }} >
                                                        <svg viewBox="0 0 100 100">
                                                            <path d="m38.977 59.074c0 2.75-4.125 2.75-4.125 0s4.125-2.75 4.125 0"></path>
                                                            <path d="m60.477 59.074c0 2.75-4.125 2.75-4.125 0s4.125-2.75 4.125 0"></path>
                                                            <path d="m48.203 69.309c1.7344 0 3.1484-1.4141 3.1484-3.1484 0-0.27734-0.22266-0.5-0.5-0.5-0.27734 0-0.5 0.22266-0.5 0.5 0 1.1836-0.96484 2.1484-2.1484 2.1484s-2.1484-0.96484-2.1484-2.1484c0-0.27734-0.22266-0.5-0.5-0.5-0.27734 0-0.5 0.22266-0.5 0.5 0 1.7344 1.4141 3.1484 3.1484 3.1484z"></path>
                                                            <path d="m35.492 24.371c0.42187-0.35156 0.48047-0.98438 0.125-1.4062-0.35156-0.42188-0.98438-0.48438-1.4062-0.125-5.1602 4.3047-16.422 17.078-9.5312 42.562 0.21484 0.79688 0.85547 1.4062 1.6641 1.582 0.15625 0.035156 0.31641 0.050781 0.47266 0.050781 0.62891 0 1.2344-0.27344 1.6445-0.76562 0.82812-0.98828 2.0039-1.5391 2.793-1.8203 0.56641 1.6055 1.4766 3.3594 2.9727 4.9414 2.2852 2.4219 5.4336 3.9453 9.3867 4.5547-3.6055 4.5-3.8047 10.219-3.8086 10.484-0.011719 0.55078 0.42187 1.0078 0.97656 1.0234h0.023438c0.53906 0 0.98437-0.42969 1-0.97266 0-0.054688 0.17187-4.8711 2.9805-8.7773 0.63281 1.2852 1.7266 2.5 3.4141 2.5 1.7109 0 2.7578-1.2695 3.3398-2.6172 2.8867 3.9258 3.0586 8.8359 3.0586 8.8906 0.015625 0.54297 0.46094 0.97266 1 0.97266h0.023438c0.55078-0.015625 0.98828-0.47266 0.97656-1.0234-0.007812-0.26953-0.20703-6.0938-3.9141-10.613 7.0781-1.3086 10.406-5.4219 11.969-8.9766 1.0508 0.98828 2.75 2.1992 4.793 2.1992 0.078126 0 0.15625 0 0.23828-0.003906 0.47266-0.023438 1.5781-0.074219 3.4219-4.4219 1.1172-2.6406 2.1406-6.0117 2.8711-9.4922 4.8281-22.945-4.7852-30.457-9.1445-32.621-12.316-6.1172-22.195-3.6055-28.312-0.42188-0.48828 0.25391-0.67969 0.85938-0.42578 1.3477s0.85938 0.67969 1.3477 0.42578c5.7031-2.9688 14.934-5.3047 26.5 0.4375 7.1875 3.5703 9 11.586 9.2539 17.684 0.49609 11.93-4.2617 23.91-5.7344 25.062h-0.015626c-1.832 0-3.4102-1.5742-4.0352-2.2852 0.28906-0.99609 0.44531-1.8672 0.52734-2.5117 0.62891 0.16797 1.2812 0.27344 1.9727 0.27344 0.55469 0 1-0.44922 1-1 0-0.55078-0.44531-1-1-1-7.3203 0-10.703-13.941-10.734-14.082-0.097656-0.40625-0.4375-0.71094-0.85156-0.76172-0.43359-0.050781-0.82031 0.16406-1.0117 0.53906-1.8984 3.7188-1.4297 6.7539-0.67969 8.668-6.2383-2.2852-8.9766-8.6914-9.0078-8.7617-0.17969-0.43359-0.62891-0.68359-1.1016-0.60156-0.46094 0.082032-0.80469 0.47266-0.82422 0.94141-0.14062 3.3359 0.67188 5.75 1.5 7.3164-8.3125-2.4297-10.105-11.457-10.184-11.875-0.097656-0.51562-0.57422-0.86328-1.0898-0.8125-0.51953 0.054687-0.90625 0.50391-0.89062 1.0234 0.41406 13.465-1.8516 17.766-3.2383 19.133-0.66406 0.65625-1.1992 0.67188-1.2383 0.67188-0.53906-0.050781-1.0156 0.31641-1.0938 0.85156-0.078125 0.54688 0.29688 1.0547 0.84375 1.1328 0.03125 0.003906 0.11328 0.015625 0.23828 0.015625 0.36719 0 1.1016-0.09375 1.9414-0.66406 0.050781 0.38672 0.125 0.81641 0.21875 1.2656-1.0273 0.35156-2.6211 1.0781-3.7812 2.4648-0.015625 0.019532-0.054687 0.066406-0.15625 0.046875-0.039062-0.007812-0.13281-0.039062-0.16406-0.15234-2.1875-8.1094-5.7148-28.309 8.8867-40.496zm12.711 51.828c-1.0039 0-1.5898-1.207-1.8672-2.0117 0.48047 0.023438 0.95703 0.050781 1.4531 0.050781 0.74219 0 1.4453-0.035156 2.1289-0.082031-0.24219 0.83594-0.76172 2.043-1.7148 2.043zm-13.148-30.664c1.9531 3.6211 5.6367 7.9102 12.305 8.6992 0.43359 0.046875 0.83984-0.18359 1.0234-0.57422 0.18359-0.39062 0.089844-0.85938-0.22656-1.1523-0.074219-0.070312-1.2734-1.2227-1.9688-3.6367 2 2.6094 5.3359 5.6836 10.305 6.5664 0.42187 0.070312 0.83594-0.125 1.0469-0.49219 0.21094-0.36719 0.16406-0.82812-0.11719-1.1484-0.023437-0.027344-1.9414-2.2969-1.2891-5.8906 1.2227 3.5508 3.7461 9.2227 7.8945 11.551-0.03125 0.55859-0.14844 1.668-0.55078 3.0156-0.085937 0.13672-0.125 0.28516-0.13672 0.44531-1.3008 3.8906-5.0039 9.3281-15.547 9.3281-5.375 0-9.4414-1.418-12.086-4.2109-3.5664-3.7656-3.332-8.8477-3.332-8.8984v-0.011719c1.5898-2.7227 2.5-7.3203 2.6797-13.59z"></path>
                                                        </svg>
                                                    </button>
                                                    <div className={`bg-notify ${!activeButton ? 'disable-bg' :''}`}>
                                                        
                                                    </div>
                                                    <div className="text-notify">
                                                        <div className={`tipo-user ${!activeButton ? 'disable-bg' :''}`}>
                                                            Usuario
                                                        </div>
                                                        <div className="title-notify">
                                                            Recordatorio de préstamo
                                                        </div>
                                                        <div className="actions">
                                                            <div className="col pl-2 pr-0 mt-2">
                                                                <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                                    <span className="label-notify">CJ</span>
                                                                </OverlayTrigger>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                {/* <Tab.Container defaultActiveKey="1" className="container d-flex flex-column">
                    <Nav className="header-tabs nav flex-column-auto" role="tablist">
                        <Nav.Item>
                            <Nav.Link eventKey="1">
                                <span className="nav-title text-uppercase">Recursos Humanos</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="2">
                                <span className="nav-title text-uppercase">Usuarios</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="4">
                                <span className="nav-title text-uppercase">Leads</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="5">
                                <span className="nav-title text-uppercase">Proyectos</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="6">
                                <span className="nav-title text-uppercase">Administración</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="7">
                                <span className="nav-title text-uppercase">Mi proyecto</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="8">
                                <span className="nav-title text-uppercase">Calidad</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="10">
                                <span className="nav-title text-uppercase">Mercadotecnia</span>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content className="bg-white">
                        <Tab.Pane eventKey="2">
                            <div>
                                <div className="text-right border-bottom py-5 px-10">
                                    <a className="btn btn-light font-weight-bolder mr-3 my-2 my-lg-0">Tareas</a>
                                    <a className="btn btn-light font-weight-bolder my-2 my-lg-0">Usuario</a>
                                </div>
                            </div>
                            <div className="p-12">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="card card-custom bgi-no-repeat card-border card-stretch rounded-0" style={{ backgroundPosition:'right top', backgroundSize:'30% auto', backgroundImage: "url('/images/svg/shapes/abstract-1.svg')" }} >
                                            <div className="card-body border-bottom-notificaciones">
                                                <div className="row mx-0 w-100 align-items-center mb-5">
                                                    <div className="w-15">
                                                        <span className="switch switch-sm switch-icon">
                                                            <label className="mb-0">
                                                                <input type="checkbox" checked="checked" name="select" />
                                                                <span></span>
                                                            </label>
                                                        </span>
                                                    </div>
                                                    <div className="w-85 text-right">
                                                        <a href="#" className="card-title font-weight-bolder text-dark-50 font-size-h5 m-0 text-right">Nuevo comentario de tarea</a>
                                                    </div>
                                                </div>
                                                <div className="font-weight-bolder text-primary mb-5 text-center">Usuario</div>
                                                <div className="symbol-group symbol-hover justify-content-center ">
                                                    <div className="symbol symbol-circle symbol-20 symbol-lg-30 border-0">
                                                        <img src="/default.jpg"/>
                                                    </div>
                                                    <div className="symbol symbol-circle symbol-20 symbol-lg-30 border-0">
                                                        <img src="/default.jpg"/>
                                                    </div>
                                                    <div className="symbol symbol-circle symbol-light-info symbol-20 symbol-lg-30 border-0">
                                                        <span className="symbol-label font-weight-bold">5+</span>
                                                    </div>
                                                    <div className="symbol symbol-circle symbol-light-success symbol-20 symbol-lg-30 border-0" onClick={() => { this.mostrarInput() }}>
                                                        <span className="symbol-label font-weight-bold"><i className="fas fa-user-plus font-size-13px text-success"></i></span>
                                                    </div>
                                                </div>
                                                <div className={showInput ? 'col-md-12 mt-5' : 'd-none'}>
                                                    <TagSelectSearchGray placeholder = 'Agregar responsables' options = { options.responsables } 
                                                        iconclass = 'las la-user-friends icon-xl' defaultvalue = { form.responsables } onChange = { this.updateResponsable }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="1">
                            <div>
                                <div className="text-right border-bottom py-5 px-10">
                                    <a className="btn btn-light font-weight-bolder mr-3 my-2 my-lg-0">Tareas</a>
                                    <a className="btn btn-light font-weight-bolder my-2 my-lg-0">Usuario</a>
                                </div>
                            </div>
                            <div className="p-12">
                                <div className="row mx-0">
                                    <div className="col-md-3 card-notify">
                                        <div className="row-notify">
                                            <button className={`img-avatar ${!activeButton ? 'disable-bg' :''}`} onClick={() => { this.activeButton() }} >
                                                <svg viewBox="0 0 100 100">
                                                    <path d="m38.977 59.074c0 2.75-4.125 2.75-4.125 0s4.125-2.75 4.125 0"></path>
                                                    <path d="m60.477 59.074c0 2.75-4.125 2.75-4.125 0s4.125-2.75 4.125 0"></path>
                                                    <path d="m48.203 69.309c1.7344 0 3.1484-1.4141 3.1484-3.1484 0-0.27734-0.22266-0.5-0.5-0.5-0.27734 0-0.5 0.22266-0.5 0.5 0 1.1836-0.96484 2.1484-2.1484 2.1484s-2.1484-0.96484-2.1484-2.1484c0-0.27734-0.22266-0.5-0.5-0.5-0.27734 0-0.5 0.22266-0.5 0.5 0 1.7344 1.4141 3.1484 3.1484 3.1484z"></path>
                                                    <path d="m35.492 24.371c0.42187-0.35156 0.48047-0.98438 0.125-1.4062-0.35156-0.42188-0.98438-0.48438-1.4062-0.125-5.1602 4.3047-16.422 17.078-9.5312 42.562 0.21484 0.79688 0.85547 1.4062 1.6641 1.582 0.15625 0.035156 0.31641 0.050781 0.47266 0.050781 0.62891 0 1.2344-0.27344 1.6445-0.76562 0.82812-0.98828 2.0039-1.5391 2.793-1.8203 0.56641 1.6055 1.4766 3.3594 2.9727 4.9414 2.2852 2.4219 5.4336 3.9453 9.3867 4.5547-3.6055 4.5-3.8047 10.219-3.8086 10.484-0.011719 0.55078 0.42187 1.0078 0.97656 1.0234h0.023438c0.53906 0 0.98437-0.42969 1-0.97266 0-0.054688 0.17187-4.8711 2.9805-8.7773 0.63281 1.2852 1.7266 2.5 3.4141 2.5 1.7109 0 2.7578-1.2695 3.3398-2.6172 2.8867 3.9258 3.0586 8.8359 3.0586 8.8906 0.015625 0.54297 0.46094 0.97266 1 0.97266h0.023438c0.55078-0.015625 0.98828-0.47266 0.97656-1.0234-0.007812-0.26953-0.20703-6.0938-3.9141-10.613 7.0781-1.3086 10.406-5.4219 11.969-8.9766 1.0508 0.98828 2.75 2.1992 4.793 2.1992 0.078126 0 0.15625 0 0.23828-0.003906 0.47266-0.023438 1.5781-0.074219 3.4219-4.4219 1.1172-2.6406 2.1406-6.0117 2.8711-9.4922 4.8281-22.945-4.7852-30.457-9.1445-32.621-12.316-6.1172-22.195-3.6055-28.312-0.42188-0.48828 0.25391-0.67969 0.85938-0.42578 1.3477s0.85938 0.67969 1.3477 0.42578c5.7031-2.9688 14.934-5.3047 26.5 0.4375 7.1875 3.5703 9 11.586 9.2539 17.684 0.49609 11.93-4.2617 23.91-5.7344 25.062h-0.015626c-1.832 0-3.4102-1.5742-4.0352-2.2852 0.28906-0.99609 0.44531-1.8672 0.52734-2.5117 0.62891 0.16797 1.2812 0.27344 1.9727 0.27344 0.55469 0 1-0.44922 1-1 0-0.55078-0.44531-1-1-1-7.3203 0-10.703-13.941-10.734-14.082-0.097656-0.40625-0.4375-0.71094-0.85156-0.76172-0.43359-0.050781-0.82031 0.16406-1.0117 0.53906-1.8984 3.7188-1.4297 6.7539-0.67969 8.668-6.2383-2.2852-8.9766-8.6914-9.0078-8.7617-0.17969-0.43359-0.62891-0.68359-1.1016-0.60156-0.46094 0.082032-0.80469 0.47266-0.82422 0.94141-0.14062 3.3359 0.67188 5.75 1.5 7.3164-8.3125-2.4297-10.105-11.457-10.184-11.875-0.097656-0.51562-0.57422-0.86328-1.0898-0.8125-0.51953 0.054687-0.90625 0.50391-0.89062 1.0234 0.41406 13.465-1.8516 17.766-3.2383 19.133-0.66406 0.65625-1.1992 0.67188-1.2383 0.67188-0.53906-0.050781-1.0156 0.31641-1.0938 0.85156-0.078125 0.54688 0.29688 1.0547 0.84375 1.1328 0.03125 0.003906 0.11328 0.015625 0.23828 0.015625 0.36719 0 1.1016-0.09375 1.9414-0.66406 0.050781 0.38672 0.125 0.81641 0.21875 1.2656-1.0273 0.35156-2.6211 1.0781-3.7812 2.4648-0.015625 0.019532-0.054687 0.066406-0.15625 0.046875-0.039062-0.007812-0.13281-0.039062-0.16406-0.15234-2.1875-8.1094-5.7148-28.309 8.8867-40.496zm12.711 51.828c-1.0039 0-1.5898-1.207-1.8672-2.0117 0.48047 0.023438 0.95703 0.050781 1.4531 0.050781 0.74219 0 1.4453-0.035156 2.1289-0.082031-0.24219 0.83594-0.76172 2.043-1.7148 2.043zm-13.148-30.664c1.9531 3.6211 5.6367 7.9102 12.305 8.6992 0.43359 0.046875 0.83984-0.18359 1.0234-0.57422 0.18359-0.39062 0.089844-0.85938-0.22656-1.1523-0.074219-0.070312-1.2734-1.2227-1.9688-3.6367 2 2.6094 5.3359 5.6836 10.305 6.5664 0.42187 0.070312 0.83594-0.125 1.0469-0.49219 0.21094-0.36719 0.16406-0.82812-0.11719-1.1484-0.023437-0.027344-1.9414-2.2969-1.2891-5.8906 1.2227 3.5508 3.7461 9.2227 7.8945 11.551-0.03125 0.55859-0.14844 1.668-0.55078 3.0156-0.085937 0.13672-0.125 0.28516-0.13672 0.44531-1.3008 3.8906-5.0039 9.3281-15.547 9.3281-5.375 0-9.4414-1.418-12.086-4.2109-3.5664-3.7656-3.332-8.8477-3.332-8.8984v-0.011719c1.5898-2.7227 2.5-7.3203 2.6797-13.59z"></path>
                                                </svg>
                                            </button>
                                            <div className={`bg-notify ${!activeButton ? 'disable-bg' :''}`}>
                                                
                                            </div>
                                            <div className="text-notify">
                                                <div className={`tipo-user ${!activeButton ? 'disable-bg' :''}`}>
                                                    Usuario
                                                </div>
                                                <div className="title-notify">
                                                    Recordatorio de préstamo
                                                </div>
                                                <div className="actions">
                                                    <div className="col pl-2 pr-0 mt-2">
                                                        <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                            <span className="label-notify">CJ</span>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </Tab.Pane>
                        <Tab.Pane eventKey="3">
                            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
                                <a href="#" className="btn btn-light font-weight-bold mr-3 my-2 my-lg-0">Latest Orders</a>
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container> */}
            </Layout >
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificacionesCorreos);