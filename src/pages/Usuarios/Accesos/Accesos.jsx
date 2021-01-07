import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip, Card } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { deleteAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import axios from 'axios'
import { URL_DEV } from '../../../constants';
import Swal from 'sweetalert2';
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

    getAccesosAxios = async() => {
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
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteAccesoAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'accesos/' + id, { headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getAccesosAxios()
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
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
        for(let i = 0; i < pwd.length; i++)
            aux += '*'
        return aux
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
                                <table className="table table-borderless table-vertical-center w-100">
                                    <thead>
                                        <tr className="text-uppercase bg-primary-o-20 text-primary">
                                            <th className="w-auto">Plataforma</th>
                                            <th className="w-auto">Accesos</th>
                                            <th className="w-auto">Correo y teléfono de alta</th>
                                            <th className="w-auto text-center">Responsables</th>
                                            <th className="w-auto text-center">Empresas</th>
                                            <th className="w-30 text-center">Descripción de plataforma</th>
                                            <th style={{ minWidth: "100px" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            accesos.map((acceso, key)=>{
                                                return(
                                                    <tr key = { key } >
                                                        <td className="font-size-lg text-left font-weight-bolder">
                                                            <span>Nombre: </span><span className="text-muted font-weight-bold font-size-sm text-transform-none">{acceso.plataforma}</span><br />
                                                            <span>Link: </span>
                                                            <a href = { acceso.url } target = '_blank' className="text-muted font-weight-bold font-size-sm text-transform-none">{acceso.url}</a>
                                                        </td>
                                                        <td className="font-size-lg text-left font-weight-bolder">
                                                            <span>Usuario: </span><span className="text-muted font-weight-bold font-size-sm text-transform-none">{acceso.usuario}</span><br />
                                                            <div className = 'text-hover' onClick={() => {navigator.clipboard.writeText(acceso.contraseña)}}>
                                                                <span>Contraseña: </span>
                                                                <OverlayTrigger overlay = { <Tooltip> <span className="text-muted font-weight-bold font-size-sm text-transform-none">{acceso.contraseña}</span></Tooltip>}>
                                                                    <span className="text-muted font-weight-bold font-size-sm text-transform-none">{this.setHiddenPassword(acceso.contraseña)}</span>
                                                                </OverlayTrigger>
                                                            </div>
                                                            
                                                        </td>
                                                        <td className="font-size-lg text-left font-weight-bolder">
                                                            <span>Correo: </span>
                                                            <a href = { `mailto:+${acceso.correo}` } className="text-muted font-weight-bold font-size-sm text-transform-none">
                                                                {acceso.correo}
                                                            </a>
                                                            <br />
                                                            <span>Teléfono: </span>
                                                            <a href = { `tel:+${acceso.numero}` } className="text-muted font-weight-bold font-size-sm">
                                                                {acceso.numero}
                                                            </a>
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                acceso.usuarios.map((usuario, index) => {
                                                                    return(
                                                                        <span className="text-muted font-weight-bold font-size-sm" key = { index } >{usuario.name} <br/></span>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                acceso.empresas.map((empresa, index) => {
                                                                    return(
                                                                        <span className="text-muted font-weight-bold font-size-sm" key = { index } >{empresa.name} <br/></span>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td className="text-justify">
                                                            <span className="text-muted font-weight-bold font-size-sm">
                                                                { acceso.descripcion }
                                                            </span>
                                                        </td>
                                                        <td className="pr-0 text-center">
                                                            <OverlayTrigger overlay={<Tooltip>EDITAR</Tooltip>}>
                                                                <span 
                                                                    onClick = { (e) => { e.preventDefault(); this.changePageEdit(acceso) } }
                                                                    className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-success">
                                                                    <span className="svg-icon svg-icon-md">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Write.svg')} />
                                                                    </span>
                                                                </span>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                                <span 
                                                                    onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL REGISTRO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deleteAccesoAxios(acceso.id)) }}
                                                                    className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-danger">
                                                                    <span className="svg-icon svg-icon-md">
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
                </Card>
            </Layout>
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