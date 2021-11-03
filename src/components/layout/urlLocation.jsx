import React, { Component } from 'react'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import { connect } from 'react-redux'
class UrlLocation extends Component {

    state = {
        paths: []
    }

    componentDidMount() {
        const { history: { location: { pathname } } } = this.props
        let aux = pathname.substr(1, pathname.length - 1)
        aux = aux.split('/')
        if (!Array.isArray(aux))
            aux = [aux]
        this.setState({
            paths: aux
        })
    }

    render() {
        const { paths } = this.state
        const { authUser: { modulos }, active, user: usuario, printChecador, isCliente, getInnerRef } = this.props
        let icon;
        let modulo_name;
        let submodulo_name;
        let submodulo;

        if (modulos) {
            if (paths.length === 1) {
                for (let i = 0; i < modulos.length; i++) {
                    if (modulos[i].slug === paths[0]) {
                        modulo_name = modulos[i].name
                        submodulo_name = modulos[i].name
                        icon = modulos[i].icon
                    }
                }
            } else {
                for (let i = 0; i < modulos.length; i++) {
                    if (modulos[i].slug === active) {
                        icon = modulos[i].icon
                        modulo_name = modulos[i].name
                        submodulo = modulos[i].modulos
                        for (let j = 0; j < submodulo.length; j++) {
                            if (submodulo[j].slug === paths[1]) {
                                submodulo_name = submodulo[j].name
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }

        return (
            <>
                {
                    paths.length > 0 ?
                        <div className="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader">
                            <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                                <div className="d-flex align-items-center flex-wrap">
                                    <div className="d-flex align-items-baseline">
                                        <h5 className="text-dark font-weight-bold my-2 mr-3"> { modulo_name } </h5>
                                        <div>
                                            <span className="svg-icon menu-icon svg-icon-primary">
                                                <SVG src={toAbsoluteUrl(icon)} />
                                            </span>
                                        </div>
                                        {
                                            paths.length > 1 ?
                                                <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                                                    <li className="breadcrumb-item">
                                                        <a href={`/${paths[0]}/${paths[1]}`} className="text-muted ml-3"> { submodulo_name } </a>
                                                    </li>
                                                </ul>
                                            : ""
                                        }
                                    </div>
                                </div>
                                <div className="text-align-last-center">
                                    { !isCliente(usuario) && printChecador(getInnerRef) }
                                </div>
                            </div>
                        </div>
                    : ""
                }
            </>
        );
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(UrlLocation)