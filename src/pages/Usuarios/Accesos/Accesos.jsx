import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip, Card } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class Accesos extends Component {

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
    render() {
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
                                        <tr>
                                            <td className="font-size-lg text-left font-weight-bolder">
                                                <span>Nombre: </span><span className="text-muted font-weight-bold font-size-sm">semrush</span><br />
                                                <span>Link: </span><span className="text-muted font-weight-bold font-size-sm">https://es.semrush.com/</span>
                                            </td>
                                            <td className="font-size-lg text-left font-weight-bolder">
                                                <span>Usuario: </span><span className="text-muted font-weight-bold font-size-sm">IMSEMRUSH</span><br />
                                                <span>Contraseña: </span><span className="text-muted font-weight-bold font-size-sm">IMSEMRUSH2020</span>
                                            </td>
                                            <td className="font-size-lg text-left font-weight-bolder">
                                                <span>Correo: </span><span className="text-muted font-weight-bold font-size-sm">carina@inein.mx</span><br />
                                                <span>Teléfono: </span><span className="text-muted font-weight-bold font-size-sm">5540059111</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="text-muted font-weight-bold font-size-sm">Carina Jiménez</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="text-muted font-weight-bold font-size-sm">INEIN</span>
                                            </td>
                                            <td className="text-justify">
                                                <span className="text-muted font-weight-bold font-size-sm">
                                                    La herramienta SEMRush, se utiliza principalmente para analizar datos relacionados con el ámbito del SEO, es decir,
                                                    posicionamiento web, como también para elaborar estrategias para conseguir backlinks hacia una web o construir publicidad.
                                                </span>
                                            </td>
                                            <td className="pr-0 text-center">
                                                <OverlayTrigger overlay={<Tooltip>EDITAR</Tooltip>}>
                                                    <a className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-success">
                                                        <span className="svg-icon svg-icon-md">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Write.svg')} />
                                                        </span>
                                                    </a>
                                                </OverlayTrigger>
                                                <OverlayTrigger overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                    <a className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-danger">
                                                        <span className="svg-icon svg-icon-md">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Trash.svg')} />
                                                        </span>
                                                    </a>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
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