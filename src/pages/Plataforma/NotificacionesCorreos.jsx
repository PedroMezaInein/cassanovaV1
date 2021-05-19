import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip, Row, Card, Col, Form } from 'react-bootstrap'
import { TagSelectSearchGray, Button } from '../../components/form-components'
import SVG from "react-inlinesvg";
import { setSingleHeader, toAbsoluteUrl } from "../../functions/routers"
import { Menu, MenuItem, MenuButton, SubMenu, MenuHeader } from '@szhsin/react-menu';
import { printResponseErrorAlert, waitAlert, errorAlert, deleteAlert } from '../../functions/alert'
import axios from 'axios'
import { URL_DEV, PUSHER_OBJECT } from '../../constants'
import Swal from 'sweetalert2'
import { Panel } from '../../components/Lottie'
import Echo from 'laravel-echo';
import { Modal } from '../../components/singles'

class NotificacionesCorreos extends Component {

    state = {
        form: { responsables: [], departamentos: [] },
        options: { responsables: [], usuarios: [], departamentos: [] },
        modulos: [],
        notificaciones: [],
        notificacion: '',
        list:{ tipo: '', modulo: '', submodulo: '' },
        modal_editar: false,
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const notificaciones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!notificaciones)
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

    mostrarInput = (notif) => {
        const { options } = this.state
            options.responsables = []
            options.usuarios.forEach((elemento, index) => {
                let flag = notif.destinatarios.find((auxiliar) => {
                    return auxiliar.id.toString() === elemento.value
                })
                if(flag === undefined)
                    options.responsables.push({ name: elemento.name, label: elemento.name, value: elemento.value })
            })
        this.setState({ ...this.state, notificacion: notif, options })
    }

    getOptions = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v1/plataforma/notificaciones`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { options } = this.state
                const { usuarios, departamentos } = response.data
                options.responsables = []
                usuarios.forEach( ( element ) => {
                    options.responsables.push({
                        name: element.name,
                        value: element.id.toString(),
                        label: element.name
                    })
                });
                options.departamentos = []
                departamentos.forEach( ( element ) => {
                    options.departamentos.push({
                        name: element.nombre,
                        value: element.id.toString(),
                        label: element.nombre
                    })
                });
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
                this.getPanelNotificaciones()
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
                this.getPanelNotificaciones()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    // updateResponsable = async(value) => {
    //     waitAlert()
    //     const { access_token } = this.props.authUser
    //     const { notificacion } = this.state
    //     await axios.put(`${URL_DEV}v1/plataforma/notificaciones/${notificacion.id}`, { value: value[0].value }, { headers: setSingleHeader(access_token) }).then(
    //         (response) => {
    //             Swal.close();
    //             this.setState({...this.state, notificacion: ''})
    //             this.getPanelNotificaciones()
    //         }, (error) => { printResponseErrorAlert(error) }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.log(error, 'error')
    //     })
    // }

    onClickSubmenu = ( texto, submodulo, modulo ) => {
        const { list, options } = this.state
        options.destinatarios = []
        list.tipo = texto
        list.modulo = modulo.name
        list.submodulo = submodulo.name
        this.setState({...this.state, list, notificaciones: this.getNotificacionesByType(submodulo.notificaciones, texto), notificacion: '', options})
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
            <div className="symbol symbol-50 symbol-light mr-5" onClick={(e) => { this.changeEnable(element) }}>
                <span className="symbol-label">
                    <span className={`svg-icon svg-icon-sm-xxl position-relative svg-color-nofify ${!element.enable ? 'disable-bg' : ''}`}>
                        <SVG src={toAbsoluteUrl(icon)} />
                    </span>
                </span>
            </div> 
        )
    }
    openModalEditar = notificacion => {
        console.log(notificacion, 'notificacion')
        const { form } = this.state
        let auxResponsables = []
        let auxDepartamentos= []
        if (notificacion.destinatarios) {
            notificacion.destinatarios.forEach(destinatario => {
                auxResponsables.push({
                    value: destinatario.id.toString(),
                    name: destinatario.name,
                    label: destinatario.name
                })
            });
            form.responsables = auxResponsables
        }
        if (notificacion.departamentos) {
            notificacion.departamentos.forEach(departamento => {
                auxDepartamentos.push({
                    value: departamento.id.toString(),
                    name: departamento.nombre,
                    label: departamento.nombre
                })
            });
            form.departamentos = auxDepartamentos
        }
        this.setState({
            ...this.state, 
            modal_editar: true,
            notificacion: notificacion,
            form,
            formeditado: true
        })
    }

    handleCloseModalEditar = () => {
        this.setState({
            ...this.state,
            modal_editar: false,
        })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ 
            ...this.state,
            form
        })
    }
    updateResponsable = value => {
        this.onChange({target: { value: value, name: 'responsables'}}, true)
    }
    updateDepartamentos = value => {
        this.onChange({target: { value: value, name: 'departamentos'}}, true)
    }
    sendForm = async() => {
        const { access_token } = this.props.authUser
        const { notificacion, form} = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v1/plataforma/notificaciones/${notificacion.id}`, form , { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close();
                this.setState({...this.state, notificacion: '', modal_editar: false})
                this.getPanelNotificaciones()
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
        
    }
    deleteNotificacionesAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/plataforma/notificaciones/${id}`, { headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getPanelNotificaciones()
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { options, form, modulos, list, notificaciones, modal_editar } = this.state
        return (
            <Layout active='plataforma' {...this.props}>
                <Row className="mx-0">
                    <Col md="12">
                        <Card className="card-custom card-stretch gutter-b">
                            <div className="card-header border-0 mt-5">
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
                            <div className="card-body pt-2">
                                {
                                    notificaciones.length ?
                                        <div className="table-responsive">
                                            <table className="table table-head-custom table-vertical-center" id="kt_advance_table_widget_1">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th className="w-20px"></th>
                                                        <th className="font-size-13px">Título del correo o notificación</th>
                                                        <th className="text-center font-size-13px">Destinatarios</th>
                                                        <th className="text-center font-size-13px">Departamento</th>
                                                        <th className="text-center"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        notificaciones.map((element) => {
                                                            console.log(element)
                                                            return (
                                                                <tr key={element.id}>
                                                                    <td className="text-center">
                                                                        <div className="switch-notify">
                                                                            <span className="switch switch-outline switch-icon switch-info switch-sm ">
                                                                                <label>
                                                                                    <input type="checkbox" checked = { element.enable === 1 ? true : false } name="select" onChange = { (e) => { this.changeEnable(element)}} />
                                                                                    <span></span>
                                                                                </label>
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            { this.showIcon(element) }
                                                                            <div>
                                                                                <span className="text-dark-75 font-weight-bolder mb-1 font-size-lg cursor-pointer">{element.titulo}</span>
                                                                                <span className="text-muted font-weight-bold d-block"> {element.usuario_externo ? 'Cliente' : 'Usuario'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="symbol-group symbol-hover d-flex justify-content-center">
                                                                            {
                                                                                element.destinatarios.map((destinatario, index) => {
                                                                                    return (
                                                                                        <OverlayTrigger key={index} overlay={<Tooltip>{destinatario.name}</Tooltip>}>
                                                                                            <div className={`symbol symbol-20 symbol-lg-30 symbol-circle border-0 ${!element.enable ? '' : 'symbol-light-info '}`}>
                                                                                                {
                                                                                                    destinatario.avatar ?
                                                                                                        <img alt="Pic" src={ destinatario.avatar } />
                                                                                                    : 
                                                                                                    <span className="symbol-label font-weight-bolder">{this.setInitials(destinatario.name)}</span>
                                                                                                }
                                                                                            </div>
                                                                                        </OverlayTrigger>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="text-center font-size-sm">
                                                                        {
                                                                            element.departamentos.map((departamento, index) => {
                                                                                return (
                                                                                    <div className="text-center font-size-sm" key={index}>
                                                                                        {departamento.nombre}<br/>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </td>
                                                                    <td className="text-right px-0">
                                                                        <span className={`btn btn-icon btn-light btn-sm ${!element.enable ? 'btn-hover-dark-75' : 'btn-hover-info '}`} onClick={(e) => { this.openModalEditar(element) }}>
                                                                            <span className={`svg-icon svg-icon-md ${!element.enable ? 'svg-icon-dark-75' : 'svg-icon-info '}`}>
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Edit.svg')} />
                                                                            </span>
                                                                        </span>
                                                                        <span className={`btn btn-icon btn-light btn-sm ml-3 ${!element.enable ? 'btn-hover-dark-75' : 'btn-hover-info '}`} 
                                                                            onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR LA NOTIFICACIÓN?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deleteNotificacionesAxios(element.id)) }} >
                                                                            <span className={`svg-icon svg-icon-md ${!element.enable ? 'svg-icon-dark-75' : 'svg-icon-info '}`}>
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Trash.svg')} />
                                                                            </span>
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        : <div className = 'col-md-12 px-0'>
                                            <div className="col-md-6 mx-auto">
                                                <Panel /> 
                                            </div>
                                        </div>
                                }
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal size="lg" title={'Agregar usuario y/o departamento'} show={modal_editar} handleClose={this.handleCloseModalEditar} >
                    <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendForm(); }}>
                        <div className="row mx-0">
                            <div className="col-md-12 mt-5">
                                <TagSelectSearchGray
                                    placeholder = 'Selecciona el usuario'
                                    options = { options.responsables } 
                                    iconclass = 'las la-user-friends icon-xl'
                                    defaultvalue = { form.responsables }
                                    onChange = { this.updateResponsable }
                                />
                            </div>
                            <div className="col-md-12 mt-5">
                                <TagSelectSearchGray
                                    placeholder = 'Selecciona el departamento '
                                    options = { options.departamentos } 
                                    iconclass = 'las la-user-friends icon-xl'
                                    defaultvalue = { form.departamentos } 
                                    onChange = { this.updateDepartamentos }
                                />
                            </div>
                        </div>
                        <div className="card-footer py-3 pr-1 mt-7">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-center pr-0 pb-0">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </Layout >
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(NotificacionesCorreos);