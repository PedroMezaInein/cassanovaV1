import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import { Button } from '../../components/form-components';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
class UrlLocation extends Component {
    state = {
        paths: [],
        url: []
    }

    componentDidMount() {
        const { history: { location: { pathname } } } = this.props
        let aux = pathname.substr(1, pathname.length - 1)
        let url_direccion = pathname.substr(1, pathname.length - 1)
        aux = aux.split('/')
        if (!Array.isArray(aux)) {
            aux = [aux]
        }
        this.setState({
            paths: aux,
            url: url_direccion
        })
    }
    changePageAdd = tipo => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/add/' + tipo
        });
    }
    render() {
        const { paths, url } = this.state
        const modulos = this.props.authUser.modulos
        const active = this.props.active;
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
                            } else {
                            }
                        }
                        break;
                    } else {
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
                                <div className="d-flex align-items-center flex-wrap mr-1">
                                    <div className="d-flex align-items-baseline mr-5">
                                        <h5 className="text-dark font-weight-bold my-2 mr-3">
                                            {
                                                modulo_name
                                            }
                                        </h5>
                                        <div>
                                            <span className="svg-icon menu-icon svg-icon-primary">
                                                <SVG src={toAbsoluteUrl(icon)} />
                                            </span>
                                        </div>
                                        {
                                            paths.length > 1 ?
                                                <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                                                    <li className="breadcrumb-item">
                                                        <a href={`/${paths[0]}/${paths[1]}`} className="text-muted ml-3">
                                                            {
                                                                submodulo_name
                                                            }
                                                        </a>
                                                    </li>
                                                </ul>
                                                : ""
                                        }
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end flex-wrap">
                                    {
                                        url === "leads/crm" ?
                                            <>
                                                {/* <Button
                                                    // icon=''
                                                    // onClick={() => { this.changePageAdd('telefono') }}
                                                    // className="btn btn-light-primary mr-2 rounded-0"
                                                    // only_icon="fas fa-phone icon-md mr-2"
                                                    // // tooltip={{ text: 'TELÉFONO' }}
                                                    // text='TELÉFONO'
                                                    icon=''
                                                    onClick={() => { this.changePageAdd('telefono') }}
                                                    className="btn btn-light-primary mr-2 rounded-0 btn-sm"
                                                    only_icon="fas fa-phone pr-0"
                                                    tooltip={{ text: 'TELÉFONO' }}
                                                /> */}
                                                <OverlayTrigger overlay={<Tooltip>LLAMADA ENTRANTE</Tooltip>}>
                                                    <a onClick={() => { this.changePageAdd('telefono') }} className="btn btn-light btn-text-primary btn-hover-text-primary btn-sm">
                                                        <span class="svg-icon svg-icon-md mr-0">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Incoming-call.svg')} />
                                                        </span>
                                                    </a>
                                                </OverlayTrigger>
                                            </>
                                            : ''
                                    }
                                </div>
                            </div>
                        </div>
                        : ""
                }

            </>
        );
    }
}

export default UrlLocation