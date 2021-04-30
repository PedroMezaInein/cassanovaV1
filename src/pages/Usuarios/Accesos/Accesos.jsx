import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip, Card } from 'react-bootstrap'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../functions/routers"
import { deleteAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Swal from 'sweetalert2';
import $ from "jquery";
class Accesos extends Component {

    state = {
        accesos: []
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const accessos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!accessos)
            history.push('/')
        this.getAccesosAxios()
    }

    getAccesosAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'accesos', { headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { accesos } = response.data
                Swal.close();
                this.setState({
                    ...this.state,
                    accesos: accesos
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteAccesoAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'accesos/' + id, { headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getAccesosAxios()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    changePageEdit = acceso => {
        const { history } = this.props
        history.push({
            pathname: '/usuarios/accesos/edit',
            state: { acceso: acceso }
        });
    }

    setHiddenPassword = pwd => {
        let aux = ''
        for (let i = 0; i < pwd.length; i++)
            aux += '*'
        return aux
    }
    substrCadena = cadena => {
        let pantalla = $(window).width()
        let aux = ''
        if (pantalla < 1400) {
            if (cadena.length > 15) {
                aux = cadena.substr(0, 15) + "..."
                return(
                    <OverlayTrigger overlay={<Tooltip>{cadena}</Tooltip>}>
                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                    </OverlayTrigger>
                )
            } else {
                aux = cadena
                return(
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                )
            }
        } else {
            if (cadena.length > 20) {
                aux = cadena.substr(0, 20) + "..."
                return(
                    <OverlayTrigger overlay={<Tooltip>{cadena}</Tooltip>}>
                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                    </OverlayTrigger>
                )
            } else {
                aux = cadena
                return(
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                )
            }
        }
    }

    setUrl = ( url ) => {
        if(!url.includes('http'))
            return 'https://' + url
        return url
    }

    render() {
        const { accesos } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Card className="card-custom card-stretch gutter-b py-2">
                    <Card.Header className="align-items-center border-0 pt-3">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">ACCESOS</span>
                        </h3>
                        <div className="card-toolbar">
                            <div>
                                <a href="/usuarios/accesos/add" className="btn btn-light-success btn-sm mr-2">
                                    <i className="flaticon2-lock pr-0 mr-2"></i>NUEVO ACCESO
                                </a>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="tab-content">
                            <div className="table-responsive-lg">
                                <table className="table table-head-custom table-vertical-center">
                                    <thead className="bg-gray-100">
                                        <tr className="text-left">
                                            <th className="min-width-100px">Plataforma</th>
                                            <th className="min-width-100px">Usuario y contraseña</th>
                                            <th className="min-width-100px">Correo y teléfono de alta</th>
                                            <th className="min-width-100px">Responsables</th>
                                            <th className="min-width-100px">Empresas</th>
                                            <th className="min-width-100px text-center">Descripción</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            accesos.map((acceso, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td>
                                                            <a href = { this.setUrl(acceso.url) } target = "_blank" rel="noopener noreferrer"
                                                                className="font-weight-bolder text-dark text-hover-primary font-size-lg">
                                                                {acceso.plataforma}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.usuario) }}>
                                                            {
                                                                acceso.correo ?
                                                                    <span>{this.substrCadena(acceso.usuario)}</span>
                                                                : <div className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary">-</div>
                                                            }
                                                            </div>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.contraseña) }}>
                                                                <OverlayTrigger overlay={<Tooltip>{acceso.contraseña}</Tooltip>}>
                                                                    <span className="text-muted font-weight-bold text-transform-none">{this.setHiddenPassword(acceso.contraseña)}</span>
                                                                </OverlayTrigger>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.correo) }}>
                                                                {
                                                                    acceso.correo ?
                                                                        <OverlayTrigger overlay={<Tooltip>{acceso.correo}</Tooltip>}>
                                                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{this.substrCadena(acceso.correo)}</span>
                                                                        </OverlayTrigger>
                                                                        : <div className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary">-</div>
                                                                }
                                                            </div>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.numero) }}>
                                                                {
                                                                    acceso.numero ?
                                                                        <span className="text-muted font-weight-bold">{acceso.numero}</span>
                                                                        : <div className="text-muted font-weight-bold">-</div>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {
                                                                acceso.usuarios.length > 1 ?
                                                                    acceso.usuarios.map((usuario, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index}>
                                                                                <ul className="pl-4 mb-2">
                                                                                    <li>{usuario.name}</li>
                                                                                </ul>
                                                                            </span>
                                                                        )
                                                                    })
                                                                    :
                                                                    acceso.usuarios.map((usuario, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index}>{usuario.name} <br /></span>
                                                                        )
                                                                    })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                acceso.empresas.length > 1 ?
                                                                    acceso.empresas.map((empresa, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index} >
                                                                                <ul className="pl-4 mb-2">
                                                                                    <li>{empresa.name}</li>
                                                                                </ul>
                                                                            </span>
                                                                        )
                                                                    })
                                                                    :
                                                                    acceso.empresas.map((empresa, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index} >{empresa.name} <br /></span>
                                                                        )
                                                                    })
                                                            }
                                                        </td>
                                                        <td className="text-justify">
                                                            <span className="text-muted font-weight-bold">{acceso.descripcion}</span>
                                                        </td>
                                                        <td className="px-0 text-center">
                                                            <OverlayTrigger overlay={<Tooltip>EDITAR</Tooltip>}>
                                                                <span
                                                                    onClick={(e) => { e.preventDefault(); this.changePageEdit(acceso) }}
                                                                    className="btn btn-icon btn-sm mr-2 btn-hover-success mb-2">
                                                                    <span className="svg-icon svg-icon-md svg-icon-success">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Write.svg')} />
                                                                    </span>
                                                                </span>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                                <span
                                                                    onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL REGISTRO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deleteAccesoAxios(acceso.id)) }}
                                                                    className="btn btn-icon btn-sm btn-hover-danger mb-2">
                                                                    <span className="svg-icon svg-icon-md svg-icon-danger">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Trash.svg')} />
                                                                    </span>
                                                                </span>
                                                            </OverlayTrigger>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card.Body>
                </Card >
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

export default connect(mapStateToProps, mapDispatchToProps)(Accesos);