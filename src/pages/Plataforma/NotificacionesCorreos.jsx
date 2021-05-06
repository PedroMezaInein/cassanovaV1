import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip, Row, Card, Col  } from 'react-bootstrap'
import { TagSelectSearchGray } from '../../components/form-components'
import SVG from "react-inlinesvg";
import { setSingleHeader, toAbsoluteUrl } from "../../functions/routers"
import { Menu, MenuItem, MenuButton, SubMenu, MenuHeader } from '@szhsin/react-menu';
import { printResponseErrorAlert, waitAlert, errorAlert, deleteAlert } from '../../functions/alert'
import axios from 'axios'
import { URL_DEV, PUSHER_OBJECT } from '../../constants'
import Swal from 'sweetalert2'
import { Panel } from '../../components/Lottie'
import { setOptions } from '../../functions/setters'
import Echo from 'laravel-echo';

class NotificacionesCorreos extends Component {

    state = {
        keyActive:'',
        showInput: false,
        form: { responsables: [], },
        options: { responsables: [], usuarios: [] },
        activeSubMenu: true,
        modulos: [],
        notificaciones: [],
        notificacion: '',
        list:{ tipo: '', modulo: '', submodulo: '' }
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
        if(process.env.NODE_ENV === 'production' || true){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('Plataforma.Notificaciones').listen('Plataforma\\Notificaciones', (e) => {
                this.getPanelNotificaciones()
            })
        }
        this.getPanelNotificaciones()
        this.getOptions()
    }

    mostrarInput(notif) {
        const { showInput, options } = this.state
        options.responsables = []
        options.usuarios.forEach((elemento, index) => {
            let flag = notif.destinatarios.find((auxiliar) => {
                return auxiliar.id.toString() === elemento.value
            })
            if(flag === undefined)
                options.responsables.push({ name: elemento.name, label: elemento.name, value: elemento.value })
        })
        this.setState({ ...this.state, showInput: !showInput, notificacion: notif, options })
    }

    getOptions = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v1/plataforma/notificaciones`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { options } = this.state
                const { usuarios } = response.data
                options.responsables = setOptions(usuarios, 'name', 'id')
                options.usuarios = setOptions(usuarios, 'name', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getPanelNotificaciones = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v1/plataforma/notificaciones`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { modulos } = response.data
                let { notificaciones, notificacion, list } = this.state
                if(list.tipo !== '' && list.modulo !== '' && list.submodulo !== ''){
                    let actualModulo = modulos.find((elemento) => {
                        return elemento.name === list.modulo
                    })
                    let actualSubmodulo = actualModulo.modulos.find((elemento) => {
                        return elemento.name === list.submodulo
                    })
                    let actualNotificacion = actualSubmodulo.notificaciones.find((elemento) => {
                        return elemento.id === notificacion.id
                    })
                    if(actualNotificacion)
                        notificacion = actualNotificacion
                    if(actualSubmodulo)
                        notificaciones = this.getNotificacionesByType(actualSubmodulo.notificaciones, list.tipo)
                }
                Swal.close()
                this.setState({...this.state, modulos: modulos, notificaciones, notificacion})
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
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteDestinatario = async(notificacion, destinatario) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/plataforma/notificaciones/${notificacion.id}/destinatario/${destinatario.id}`, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    updateResponsable = async(value) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { notificacion } = this.state
        await axios.put(`${URL_DEV}v1/plataforma/notificaciones/${notificacion.id}`, { value: value[0].value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { showInput } = this.state
                Swal.close();
                this.setState({...this.state, showInput: !showInput, notificacion: ''})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onClickSubmenu = ( texto, submodulo, modulo ) => {
        const { list, options } = this.state
        options.destinatarios = []
        list.tipo = texto
        list.modulo = modulo.name
        list.submodulo = submodulo.name
        this.setState({...this.state, list, notificaciones: this.getNotificacionesByType(submodulo.notificaciones, texto), notificacion: '', options, showInput: false})
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
            default: break;
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
                default: break;
            }
        })
        return aux
    }

    setInitials = name => {
        let arreglo = name.split(' ')
        let texto = ''
        if(arreglo.length){
            arreglo.forEach((elemento) => {
                texto = texto + elemento.trim().charAt(0)
            })
        }else{
            if(name.length)
                return name.trim().charAt(0);
        }
        return texto
    }

    showIcon = (element) => {
        let icon = ''
        if(element.tipo==='correo'){
            if(element.enable){
                icon = '/images/svg/send-mail.svg'
            }else{
                icon = '/images/svg/hidden-email.svg'
            }
        }else{
            if(element.enable){
                icon = '/images/svg/send-notification.svg'
            }else{
                icon = '/images/svg/hidden-notification.svg'
            }
        }
        return(
            <button className={`img-avatar ${!element.enable ? 'disable-bg' : ''}`} onClick={(e) => { this.changeEnable(element)}} >
                <SVG src={toAbsoluteUrl(icon)} />
            </button>  
        )
    }

    render() {
        const { options, form, showInput, modulos, list, notificaciones } = this.state
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
                                                <span className="pt-2"> MÓDULOS </span>
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
                                                                    { this.hasActive(submodulo, 'notificaciones') && this.hasActive(submodulo, 'correos') && this.setMenuItem('todas', submodulo, modulo) }
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
                                                            <span className="svg-icon svg-icon-sm-3x">
                                                                { this.showIcon(element) }          
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
                                                                    <div className="title-notify"> { element.titulo } </div>
                                                                    <div className="actions row mx-0">
                                                                        {
                                                                            element.destinatarios.map((destinatario) => {
                                                                                return(
                                                                                    <div className="col px-2 mt-2" key = {destinatario.id}>
                                                                                        <OverlayTrigger overlay={<Tooltip>{destinatario.name}</Tooltip>}>
                                                                                            <div className="d-table mb-1 cursor-pointer" >
                                                                                                <div className="tagify align-items-center border-0 d-inline-block">
                                                                                                    <div className="d-flex align-items-center tagify__tag tagify__tag__newtable px-3px border-radius-3px m-0 flex-row-reverse bg-gray-200">
                                                                                                        <div className="tagify__tag__removeBtn ml-0 px-0" 
                                                                                                            onClick = { 
                                                                                                                (e) => {
                                                                                                                    deleteAlert(`${destinatario.name} NO RECIBIRÁ ${element.tipo === 'coreo' ? 'EL CORREO' : 'LA NOTIFICACIÓN'}`, '',
                                                                                                                        () => this.deleteDestinatario(element, destinatario)
                                                                                                                    ) 
                                                                                                                }
                                                                                                            } />
                                                                                                        <div className="p-2-5px">
                                                                                                            <span className="tagify__tag-text white-space font-weight-bold letter-spacing-0-4 font-size-11px bg-gray-200 text-dark-50">
                                                                                                                <div className="mt-2px">
                                                                                                                    {this.setInitials(destinatario.name)}
                                                                                                                </div>
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </OverlayTrigger>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                        <div className="col px-2 mt-2">
                                                                            <OverlayTrigger overlay={<Tooltip>AGREGAR DESTINATARIO</Tooltip>}>
                                                                                <span className="label-notify bg-gray-200 px-4" onClick={() => { this.mostrarInput(element) }}>
                                                                                    <i className="fas fa-user-plus icon-sm text-color-8080"></i>
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                        <div className={showInput ? 'col-md-12 mt-5 px-0 ' : 'd-none'}>
                                                                            <TagSelectSearchGray placeholder = 'Agregar usuarios ' options = { options.responsables } 
                                                                                iconclass = 'las la-user-friends icon-xl' defaultvalue = { form.responsables } 
                                                                                onChange = { this.updateResponsable }/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        : <div className = 'col-md-6'> <Panel /> </div>
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