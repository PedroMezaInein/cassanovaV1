import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import { Dropdown } from 'react-bootstrap'
class Normas extends Component {

    state = {
        title: '',
        accordion: [
            {
                nombre: 'Acordeón 1',
                // icono: 'flaticon2-paper',
                tipo: 1,
                isActive: false,
            },
            {
                nombre: 'Acordeón 2',
                icono: 'flaticon2-calendar-5',
                tipo: 2,
                isActive: false,
            },
            {
                nombre: 'Acordeón 3',
                icono: 'flaticon2-wifi',
                tipo: 3,
                isActive: false,
            }
        ]
    };
    openAccordion = (indiceClick) => {
        let { accordion } = this.state
        accordion.map((element, key) => {
            if (indiceClick === key) {
                element.isActive = element.isActive ? false : true
            }
            else {
                element.isActive = false
            }
            return false
        })
        this.setState({
            accordion: accordion
        });
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
    render() {
        return (
            <Layout {...this.props}>
                
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
                <div className="d-flex flex-row">
                    <div className="flex-row-fluid ">
                        <div className="d-flex flex-column flex-grow-1 ">
                            <div className="card card-custom gutter-b">
                                <div className="card-body d-flex align-items-center justify-content-between  py-3">
                                    <h3 className="font-weight-bold mb-0">TAGS</h3>
                                    <Dropdown className="text-center">
                                        <Dropdown.Toggle
                                            style={
                                                {
                                                    backgroundColor: '#f3f6f9', color: '#80809a', border: 'transparent', padding: '0.3rem 0.6rem',
                                                    width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px',
                                                    fontWeight: 600
                                                }}>
                                            AGREGAR TAGS
                                                </Dropdown.Toggle>
                                        <Dropdown.Menu className="p-0" >
                                            <Dropdown.Header>
                                                <span className="font-size-12px">Elige una opción</span>
                                            </Dropdown.Header>
                                            <Dropdown.Item className="p-0">
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-danger rounded-0 w-100 font-size-12px">URGENTE</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="p-0">
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-info rounded-0 w-100 font-size-12px">EN PROCESO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="p-0">
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-success rounded-0 w-100 font-size-12px">EN REVISIÓN</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="p-0">
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-warning rounded-0 w-100 font-size-12px">PENDIENTE</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="p-0">
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-white rounded-0 w-100 font-size-12px">AGREGAR NUEVO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="card card-custom card-stretch">
                                        <div className="card-header p-6 border-0 justify-content-flex-end">
                                            <span className="btn btn-light-success btn-sm font-weight-bolder">Nueva tarea</span>
                                        </div>
                                        <div className="card-body pt-2">
                                            <div className="table-responsive">
                                                <div className="list list-hover min-w-500px">
                                                    <div>
                                                        <div className="row mx-0 col-md-12 px-0">
                                                            <div className="col align-self-center px-1">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="symbol symbol-30 mr-3 symbol-light">
                                                                        <span className="symbol-label font-size-lg">CJ</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg cursor-pointer">
                                                                            PROPUESTA DE DISEÑO MÓDULO DE MERCADOTECNIA
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-auto px-1 align-self-center">
                                                                <div className="d-flex align-items-center justify-content-end flex-wrap">
                                                                    <span className="label label-light-danger font-weight-bold label-inline">URGENTE</span>
                                                                    <span className="mx-3">
                                                                        <div className="btn btn-icon btn-xs text-hover-warning">
                                                                            <i className="flaticon-star text-muted"></i>
                                                                        </div>
                                                                        <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                                                            <i className="flaticon-add-label-button text-muted"></i>
                                                                        </div>
                                                                    </span>
                                                                    <div className="font-weight-bold text-muted">15 ABRIL</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="separator separator-solid my-4"></div>
                                                    </div>
                                                    <div>
                                                        <div className="row mx-0 col-md-12 px-0">
                                                            <div className="col align-self-center px-1">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="symbol symbol-30 mr-3 symbol-light">
                                                                        <span className="symbol-label font-size-lg">CJ</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg cursor-pointer">
                                                                            CAMBIAR LA ALERTA AL ENVIAR COMENTARIO EN TAREAS
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-auto px-1 align-self-center">
                                                                <div className="d-flex align-items-center justify-content-end flex-wrap">
                                                                    <span className="label label-light-success font-weight-bold label-inline">EN REVISIÓN</span>
                                                                    <span className="mx-3">
                                                                        <div className="btn btn-icon btn-xs text-hover-warning">
                                                                            <i className="flaticon-star text-muted"></i>
                                                                        </div>
                                                                        <div className="btn btn-icon btn-xs btn-hover-text-warning">
                                                                            <i className="flaticon-add-label-button text-muted"></i>
                                                                        </div>
                                                                    </span>
                                                                    <div className="font-weight-bold text-muted">14 ABRIL</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="separator separator-solid my-4"></div>
                                                    </div>
                                                    <div>
                                                        <div className="row mx-0 col-md-12 px-0">
                                                            <div className="col align-self-center px-1">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="symbol symbol-30 mr-3 symbol-light">
                                                                        <span className="symbol-label font-size-lg">CJ</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg cursor-pointer">
                                                                            GENERAR MÓDULO DE ACCESOS
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-auto px-1 align-self-center">
                                                                <div className="d-flex align-items-center justify-content-end flex-wrap">
                                                                    <span className="label label-light-info font-weight-bold label-inline">EN PROCESO</span>
                                                                    <span className="mx-3">
                                                                        <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                                                            <i className="flaticon-star text-muted"></i>
                                                                        </div>
                                                                        <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                                                            <i className="flaticon-add-label-button text-muted"></i>
                                                                        </div>
                                                                    </span>
                                                                    <div className="font-weight-bold text-muted">13 ABRIL</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="separator separator-solid my-4"></div>
                                                    </div>
                                                    <div>
                                                        <div className="row mx-0 col-md-12 px-0">
                                                            <div className="col align-self-center px-1">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="symbol symbol-30 mr-3 symbol-light">
                                                                        <span className="symbol-label font-size-lg">CJ</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg cursor-pointer">
                                                                            AGREGANDO VALIDADORES EN FORMULARIOS DE LANDING
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-auto px-1 align-self-center">
                                                                <div className="d-flex align-items-center justify-content-end flex-wrap">
                                                                    <span className="label label-light-warning font-weight-bold label-inline">PENDIENTE</span>
                                                                    <span className="mx-3">
                                                                        <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                                                            <i className="flaticon-star text-muted"></i>
                                                                        </div>
                                                                        <div className="btn btn-icon btn-xs btn-hover-text-warning">
                                                                            <i className="flaticon-add-label-button text-muted"></i>
                                                                        </div>
                                                                    </span>
                                                                    <div className="font-weight-bold text-muted">12 ABRIL</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="separator separator-solid my-4"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center my-2 my-6 card-spacer-x justify-content-end">
                                                <div className="d-flex align-items-center mr-2" data-toggle="tooltip" title="" data-original-title="Records per page">
                                                    <span className="text-muted font-weight-bold mr-2" data-toggle="dropdown">1 - 10 de 20</span>
                                                </div>
                                                <span className="btn btn-default btn-icon btn-sm mr-2" data-toggle="tooltip" title="" data-original-title="Previose page">
                                                    <i className="ki ki-bold-arrow-back icon-sm"></i>
                                                </span>
                                                <span className="btn btn-default btn-icon btn-sm" data-toggle="tooltip" title="" data-original-title="Next page">
                                                    <i className="ki ki-bold-arrow-next icon-sm"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6 pt-10 pt-xl-0">
                                    <div className="card card-custom card-stretch">
                                        <div className="card-header align-items-center flex-wrap justify-content-between border-0 py-6 h-auto">
                                            <div className="d-flex flex-column mr-2 py-2">
                                                <span className="text-dark text-hover-primary font-weight-bold font-size-h4 mr-3">PROPUESTA DE DISEÑO MÓDULO DE MERCADOTECNIA</span>
                                                <div className="d-flex align-items-center py-1">
                                                    <span className="d-flex align-items-center text-muted text-hover-info mr-2 font-weight-bold">
                                                        <span className="fa fa-genderless text-info icon-md mr-2"></span>EN PROCESO</span>
                                                    <span className="d-flex align-items-center text-muted text-hover-danger font-weight-bold">
                                                        <span className="fa fa-genderless text-danger icon-md mr-2"></span>URGENTE</span>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-end text-right my-2">
                                                <span className="btn btn-default btn-icon btn-sm mr-2" data-toggle="tooltip" title="" data-original-title="Archive">
                                                    <span className="svg-icon svg-icon-md">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24"></rect>
                                                                <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fillRule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>
                                                                <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fillRule="nonzero" opacity="0.3"></path>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </span>
                                                <span className="btn btn-light-danger btn-sm text-uppercase font-weight-bolder mr-2">20 ABRIL</span>
                                                <span className="btn btn-light-success btn-sm text-uppercase font-weight-bolder">COMPLETAR</span>
                                            </div>
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="mb-3">
                                                <div className="cursor-pointer" data-inbox="message">
                                                    <div className="d-flex align-items-start card-spacer-x py-4">
                                                        <div className="d-flex flex-column flex-grow-1 flex-wrap">
                                                            <div className="d-flex">
                                                                <span className="font-size-lg font-weight-bold text-dark-75 text-hover-primary mr-2">Responsable: </span>
                                                                <div className="font-size-lg font-weight-bold text-dark-50 text-hover-primary mr-2">CARINA JIMÉNEZ</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <div className="d-flex align-items-center" data-inbox="toolbar">
                                                                <span className="btn btn-clean btn-xs btn-icon mr-2">
                                                                    <i className="flaticon-star icon-1x text-warning"></i>
                                                                </span>
                                                                <span className="btn btn-clean btn-xs btn-icon">
                                                                    <i className="flaticon-add-label-button icon-1x"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-spacer-x pt-2 pb-5 toggle-off-item">
                                                        <div className="mb-1 text-justify font-weight-light mb-5">
                                                            Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="separator separator-dashed separator-border-3"></div>
                                                <div className="cursor-pointer toggle-off mt-6 " data-inbox="message">
                                                    <div className="d-flex align-items-start card-spacer-x bg-comment">
                                                        <div className="symbol symbol-35 mr-3 align-self-center">
                                                            <span className="symbol-label" style={{ backgroundImage: 'url("/default.jpg")' }}></span>
                                                        </div>
                                                        <div className="d-flex flex-column flex-grow-1 flex-wrap mr-2">
                                                            <div className="d-flex">
                                                                <div className="font-weight-bolder text-primary mr-2">OMAR ABAROA</div>
                                                                <div className="font-weight-bold text-muted">
                                                                    HACE 1 HORA
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <div className="text-muted font-weight-bold toggle-on-item" data-inbox="toggle">Estos textos hacen parecerlo un español que se puede leer. </div>

                                                                <div className="d-flex flex-column font-size-sm font-weight-bold ">
                                                                    <span className="d-flex align-items-center text-muted text-hover-primary py-1 justify-content-flex-end">
                                                                        <span className="flaticon2-clip-symbol text-primary icon-1x mr-2"></span>Requerimientos.pdf
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-spacer-x pb-10 pt-5">
                                                <div className="card card-custom shadow-sm">
                                                    <div className="card-body p-0">
                                                        <form>
                                                            <div className="d-block">
                                                                <div className="border-0 ql-container ql-snow" style={{ height: '85px' }}>
                                                                    <div className="ql-editor ql-blank px-8" data-placeholder="ESCRIBIR COMENTARIO">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-between py-5 pl-8 pr-5 border-top">
                                                                <div className="d-flex align-items-center mr-3">
                                                                    <div className="btn-group mr-4">
                                                                        <span className="btn btn-primary font-weight-bold px-6">Enviar</span>
                                                                    </div>
                                                                    <span className="btn btn-icon btn-sm btn-clean mr-2 dz-clickable">
                                                                        <i className="flaticon2-clip-symbol"></i>
                                                                    </span>
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                    <span className="btn btn-icon btn-sm btn-clean text-hover-danger" data-inbox="dismiss" data-toggle="tooltip" title="" data-original-title="Dismiss reply">
                                                                        <i className="flaticon2-rubbish-bin-delete-button"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Normas);