import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Nav, Tab, OverlayTrigger, Tooltip, Row, Accordion, Card, Col  } from 'react-bootstrap'
import { TagSelectSearchGray } from '../../components/form-components'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import $ from 'jquery'
import { Menu, MenuItem, MenuButton, SubMenu, MenuHeader } from '@szhsin/react-menu';
// import '@szhsin/react-menu/dist/index.css';

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
                <Row className="mx-0">
                    <Col md="12">
                        <Card className="card-custom card-stretch gutter-b">
                            <div className="card-header border-0">
                                <h3 className="card-title align-items-start flex-column align-self-center mt-3">
                                    <span className="card-label font-weight-bolder text-dark">Notificaciones</span>
                                    <span className="text-muted mt-3">
                                        <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 font-size-lg">
											<li className="breadcrumb-item">
												<div className="text-muted">Recursos Humanos</div>
											</li>
											<li className="breadcrumb-item">
												<div className="text-primary font-weight-bolder">Préstamos</div>
											</li>
										</ul>
                                    </span>
                                </h3>
                                <div className="card-toolbar">
                                    <Menu direction='bottom' className="navi my-menu"
                                    menuButton={
                                        <MenuButton className="btn btn-bg-light btn-icon-primary btn-hover-primary font-weight-bolder text-primary btn-sm">
                                            <span className="svg-icon svg-icon-2 svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Menu.svg')} />
                                            </span>
                                            <span className="pt-2">
                                                MÓDULOS
                                            </span>
                                        </MenuButton>
                                    }
                                >
                                    <MenuHeader><div className="text-muted font-size-sm font-weight-bold p-1">Selecciona un módulo</div></MenuHeader>
                                        <SubMenu direction='left'
                                            label={
                                                <div className="d-flex align-items-center">
                                                    <span className="svg-icon svg-icon-lg ml-2 mr-3">
                                                        <SVG src={toAbsoluteUrl('/images/svg/recursoshumanos.svg')} />
                                                    </span>
                                                    Recursos Humanos
                                                </div>
                                            }>
                                            <SubMenu direction='left'
                                                label={
                                                    <div className="d-flex align-items-center">
                                                        <span className="svg-icon svg-icon-lg ml-2 mr-3">
                                                            <SVG src={toAbsoluteUrl('/images/svg/recursoshumanos.svg')} />
                                                        </span>
                                                                Préstamos
                                                            </div>
                                                }>
                                                <MenuItem styles={{ margin: '0.1rem 0.6rem', paddingRight: '3.25px' }}>
                                                    <div className="text-hover-primary px-2 d-flex align-items-center">
                                                        <i className="fas fa-circle mr-2 font-size-5px"></i>
                                                        <span className="menu-text">Notificaciones</span>
                                                    </div>
                                                </MenuItem>
                                                <MenuItem styles={{ margin: '0.1rem 0.6rem', paddingRight: '3.25px' }}>
                                                    <div className="text-hover-primary px-2 d-flex align-items-center">
                                                        <i className="fas fa-circle mr-2 font-size-5px"></i>
                                                        <span className="menu-text">Correos</span>
                                                    </div>
                                                </MenuItem>
                                                <MenuItem styles={{ margin: '0.1rem 0.6rem', paddingRight: '3.25px' }}>
                                                    <div className="text-hover-primary px-2 d-flex align-items-center">
                                                        <i className="fas fa-circle mr-2 font-size-5px"></i>
                                                        <span className="menu-text">Todos</span>
                                                    </div>
                                                </MenuItem>
                                            </SubMenu>
                                            <SubMenu direction='left'
                                                label={
                                                    <div className="d-flex align-items-center">
                                                        <span className="svg-icon svg-icon-lg ml-2 mr-3">
                                                            <SVG src={toAbsoluteUrl('/images/svg/recursoshumanos.svg')} />
                                                        </span>
                                                                Vacaciones
                                                            </div>
                                                }>
                                                <MenuItem styles={{ margin: '0.1rem 0.6rem', paddingRight: '3.25px' }}>
                                                    <div className="text-hover-primary px-2 d-flex align-items-center">
                                                        <i className="fas fa-circle mr-2 font-size-5px"></i>
                                                        <span className="menu-text">Notificaciones</span>
                                                    </div>
                                                </MenuItem>
                                                <MenuItem styles={{ margin: '0.1rem 0.6rem', paddingRight: '3.25px' }}>
                                                    <div className="text-hover-primary px-2 d-flex align-items-center">
                                                        <i className="fas fa-circle mr-2 font-size-5px"></i>
                                                        <span className="menu-text">Correos</span>
                                                    </div>
                                                </MenuItem>
                                                <MenuItem styles={{ margin: '0.1rem 0.6rem', paddingRight: '3.25px' }}>
                                                    <div className="text-hover-primary px-2 d-flex align-items-center">
                                                        <i className="fas fa-circle mr-2 font-size-5px"></i>
                                                        <span className="menu-text">Todos</span>
                                                    </div>
                                                </MenuItem>
                                            </SubMenu>
                                        </SubMenu>
                                </Menu>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mx-0">
                                    <div className="col-md-4">
                                        <div className="row mx-0 card-notify-2">
                                            <span className="svg-icon svg-icon-3x">
                                                <button className={`img-avatar ${!activeButton ? 'disable-bg' : ''}`} onClick={() => { this.activeButton() }} >
                                                    <SVG src={toAbsoluteUrl('/images/svg/email-notification.svg')} />
                                                </button>
                                            </span>
                                            <div className="col-3 px-0 w-100 row mx-0 card-color">
                                                <div className={`bg-notify ${!activeButton ? 'disable-bg' : ''}`}></div>
                                            </div>
                                            <div className="col bg-success-2">
                                                <div className="padding-col-text py-3">
                                                        <div className="switch-notify d-flex justify-content-end">
                                                            <span class="switch switch-outline switch-icon switch-info switch-sm ">
                                                                <label>
                                                                    <input type="checkbox"  name="select"/>
                                                                    <span></span>
                                                                </label>
                                                            </span>
                                                        </div>
                                                    <div className={`tipo-user ${!activeButton ? 'disable-bg' : ''}`}>
                                                        Usuario
                                                    </div>
                                                    <div className="title-notify">
                                                        Recordatorio de préstamo
                                                    </div>
                                                    <div className="actions row mx-0">
                                                        <div className="col px-2 mt-2">
                                                            <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                                <span className="label-notify">CJ</span>
                                                            </OverlayTrigger>
                                                        </div>
                                                        <div className="col px-2 mt-2">
                                                            <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                                <span className="label-notify">CJ</span>
                                                            </OverlayTrigger>
                                                        </div>
                                                        <div className="col px-2 mt-2">
                                                            <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                                <span className="label-notify">CJ</span>
                                                            </OverlayTrigger>
                                                        </div>
                                                        <div className="col px-2 mt-2">
                                                            <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                                <span className="label-notify">CJ</span>
                                                            </OverlayTrigger>
                                                        </div>
                                                        <div className="col px-2 mt-2">
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
                        </Card>
                    </Col>
                </Row>
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