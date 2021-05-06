import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip, Row, Card, Col  } from 'react-bootstrap'
import { TagSelectSearchGray } from '../../components/form-components'
import SVG from "react-inlinesvg";
import { setSingleHeader, toAbsoluteUrl } from "../../functions/routers"
import { Menu, MenuItem, MenuButton, SubMenu, MenuHeader } from '@szhsin/react-menu';
import { printResponseErrorAlert, waitAlert, errorAlert } from '../../functions/alert'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import Swal from 'sweetalert2'
import { Panel } from '../../components/Lottie'
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
        activeSubMenu: true,
        modulos: [],
        notificaciones: [],
        list:{
            tipo: '',
            modulo: '',
            submodulo: ''
        }
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
        this.getPanelNotificaciones()
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

    getPanelNotificaciones = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v1/plataforma/notificaciones`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { modulos } = response.data
                Swal.close()
                this.setState({...this.state, modulos: modulos})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    changeEnable = async(notificacion) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v1/plataforma/notificaciones`, {type: 'enable', id: notificacion.id}, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { notificaciones } = response.data
                const { list } = this.state
                Swal.close()
                this.setState({...this.state, notificaciones: this.getNotificacionesByType(notificaciones, list.tipo)})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onClickSubmenu = ( texto, submodulo, modulo ) => {
        const { list } = this.state
        list.tipo = texto
        list.modulo = modulo.name
        list.submodulo = submodulo.name
        this.setState({...this.state, list, notificaciones: this.getNotificacionesByType(submodulo.notificaciones, texto)})
    }

    setSubmenuLabel = (modulo, icon) => {
        return (
            <div key = { modulo.id} className="d-flex align-items-center">
                <span className="svg-icon svg-icon-lg ml-2 mr-3">
                    <SVG src = {toAbsoluteUrl( icon ? icon : modulo.icon ) } />
                </span>
                { modulo.name }
            </div>
        )
    }

    setMenuItem = (texto, submodulo, modulo) => {
        return(
            <MenuItem styles={{ margin: '0.1rem 0.6rem', paddingRight: '3.25px' }}
                onClick = { (e) => { this.onClickSubmenu(texto, submodulo, modulo) }} >
                <div className="text-hover-primary px-2 d-flex align-items-center">
                    <i className="fas fa-circle mr-2 font-size-5px"></i>
                    <span className="menu-text">{texto}</span>
                </div>
            </MenuItem>
        )
    }

    hasActive = (submodulo, tipo) => {
        let flag = null
        switch(tipo){
            case 'correos':
                flag = submodulo.notificaciones.find((elemento) => {
                    return elemento.tipo === 'correo'
                })
                break;
            case 'notificaciones':
                flag = submodulo.notificaciones.find((elemento) => {
                    return elemento.tipo === 'notificacion'
                })
                break;
        }
        if(flag)
            return true
        return false
    }

    getNotificacionesByType = (notificaciones, tipo) => {
        let aux = []
        notificaciones.forEach((elemento) => {
            switch(tipo){
                case 'todas':
                    aux.push(elemento)
                    break;
                case 'correos':
                    if(elemento.tipo === 'correo')
                        aux.push(elemento)
                    break;
                case 'notificaciones':
                    if(elemento.tipo === 'notificacion')
                        aux.push(elemento)
                    break;
            }
        })
        return aux
    }

    render() {
        const { options, form, showInput, activeButton, activeSubMenu, keyActive, modulos, list, notificaciones } = this.state
        return (
            <Layout active='plataforma' {...this.props}>
                <Row className="mx-0">
                    <Col md="12">
                        <Card className="card-custom card-stretch gutter-b">
                            <div className="card-header border-0">
                                <h3 className="card-title align-items-start flex-column align-self-center mt-3">
                                    <span className="card-label font-weight-bolder text-dark">{list.tipo}</span>
                                    {
                                        list.modulo !== '' && list.submodulo !== '' ?
                                            <span className="text-muted mt-3">
                                                <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 font-size-lg">
                                                    <li className="breadcrumb-item">
                                                        <div className="text-muted">{list.modulo}</div>
                                                    </li>
                                                    <li className="breadcrumb-item">
                                                        <div className="text-primary font-weight-bolder">{list.submodulo}</div>
                                                    </li>
                                                </ul>
                                            </span>
                                        : <></>
                                    }
                                    
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
                                        } >
                                    <MenuHeader><div className="text-muted font-size-sm font-weight-bold p-1">Selecciona un módulo</div></MenuHeader>
                                    {
                                        modulos.map((modulo) => {
                                            return(
                                                <SubMenu key = { modulo.id } direction = 'left' label = { this.setSubmenuLabel(modulo, null) }>
                                                    {
                                                        modulo.modulos.map((submodulo) => {
                                                            return(
                                                                <SubMenu key = { submodulo.id } direction = 'left' label = { this.setSubmenuLabel(submodulo, modulo.icon) }>
                                                                    { this.hasActive(submodulo, 'correos') && this.setMenuItem('correos', submodulo, modulo) }
                                                                    { this.hasActive(submodulo, 'notificaciones') && this.setMenuItem('notificaciones', submodulo, modulo) }
                                                                    { this.setMenuItem('todas', submodulo, modulo) }
                                                                </SubMenu>
                                                            )
                                                        })
                                                    }
                                                </SubMenu>
                                            )
                                        })
                                    }
                                </Menu>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mx-0 justify-content-center">
                                    {
                                        notificaciones.length ?
                                            notificaciones.map((element) => {
                                                return(
                                                    <div key = { element.id } className="col-md-4">
                                                        <div className="row mx-0 card-notify-2">
                                                            <span className="svg-icon svg-icon-3x">
                                                                <button className={`img-avatar ${!element.enable ? 'disable-bg' : ''}`} onClick={(e) => { this.changeEnable(element)}} >
                                                                    <SVG src={toAbsoluteUrl('/images/svg/email-notification.svg')} />
                                                                </button>            
                                                            </span>
                                                            <div className="col-3 px-0 w-100 row mx-0 card-color">
                                                                <div className={`bg-notify ${!element.enable ? 'disable-bg' : ''}`}></div>
                                                            </div>
                                                            <div className="col bg-success-2">
                                                                <div className="padding-col-text py-3">
                                                                        <div className="switch-notify d-flex justify-content-end">
                                                                            <span className="switch switch-outline switch-icon switch-info switch-sm ">
                                                                                <label>
                                                                                    <input type="checkbox" checked = { element.enable === 1 ? true : false } name="select" 
                                                                                        onChange = { (e) => { this.changeEnable(element)}} />
                                                                                    <span></span>
                                                                                </label>
                                                                            </span>
                                                                        </div>
                                                                    <div className={`tipo-user ${!element.enable ? 'disable-bg' : ''}`}>
                                                                        { element.usuario_externo ?  'Cliente' : 'Usuario' }
                                                                    </div>
                                                                    <div className="title-notify">
                                                                        { element.titulo }
                                                                    </div>
                                                                    <div className="actions row mx-0">
                                                                        <div className="col px-2 mt-2">
                                                                        <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                                            <div className="d-table mb-1 cursor-pointer" id="responsable-notify">
                                                                                <div className="tagify align-items-center border-0 d-inline-block">
                                                                                    <div className="d-flex align-items-center tagify__tag tagify__tag__newtable px-3px border-radius-3px m-0 flex-row-reverse bg-gray-200">
                                                                                        <div className="tagify__tag__removeBtn ml-0 px-0"></div>
                                                                                        <div className="p-2-5px">
                                                                                            <span className="tagify__tag-text white-space font-weight-bold letter-spacing-0-4 font-size-11px bg-gray-200 text-dark-50">
                                                                                                <div className="mt-2px">
                                                                                                    CJ
                                                                                                </div>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                        </div>
                                                                        <div className="col px-2 mt-2">
                                                                            <OverlayTrigger overlay={<Tooltip>AGREGAR DESTINATARIO</Tooltip>}>
                                                                                <span className="label-notify bg-gray-200 px-4" onClick={() => { this.mostrarInput() }}>
                                                                                    <i className="fas fa-user-plus icon-sm text-color-8080"></i>
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                        <div className={showInput ? 'col-md-12 mt-5 px-0 ' : 'd-none'}>
                                                                            <TagSelectSearchGray placeholder = 'Agregar destinatario ' options = { options.responsables } 
                                                                                iconclass = 'las la-user-friends icon-xl' defaultvalue = { form.responsables } onChange = { this.updateResponsable }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        : 
                                            <div className = 'col-md-6'>
                                                <Panel />
                                            </div>
                                    }
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Layout >
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(NotificacionesCorreos);