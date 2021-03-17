import React, { Component } from 'react'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import { connect } from 'react-redux'
import { Modal } from '../singles'
import { Form } from 'react-bootstrap'
import { Button, RangeCalendar } from '../form-components'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../functions/alert'
import axios from 'axios'
import { URL_DEV } from '../../constants'
class UrlLocation extends Component {

    state = {
        paths: [],
        url: [],
        modal: false,
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date()
        }
    }

    componentDidMount() {
        const { history: { location: { pathname } } } = this.props
        let aux = pathname.substr(1, pathname.length - 1)
        let url_direccion = pathname.substr(1, pathname.length - 1)
        aux = aux.split('/')
        if (!Array.isArray(aux))
            aux = [aux]
        this.setState({
            paths: aux,
            url: url_direccion
        })
    }
    
    changePageAdd = tipo => {
        const { history } = this.props
        history.push({ pathname: '/leads/crm/add/' + tipo });
    }

    onChange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }

    openModal = () => { this.setState({...this.state,modal:true}) }
    handleClose = () => { this.setState({...this.state, modal: false}) }

    onSubmit = async(e) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        e.preventDefault();
        waitAlert()
        await axios.post(`${URL_DEV}v2/exportar/leads`, form, { responseType:'blob', headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'leads.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert('Leads consultados con éxito')
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    render() {
        const { paths, url, modal, form } = this.state
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
                            }
                        }
                        break;
                    }
                }
            }
        }

        return (
            <>
                <Modal show = { modal } title = 'Descargar leads' handleClose = { this.handleClose } >
                    <Form onSubmit = { this.onSubmit} >
                        <div className="text-center">
                            <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                            <RangeCalendar onChange = { this.onChange } start = { form.fechaInicio } end = { form.fechaFin } />
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="btn btn-primary mr-2" onClick={ this.onSubmit } text="ENVIAR" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
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
                                                <span onClick = { (e) => { e.preventDefault(); this.openModal() }} 
                                                    className="btn text-dark-50 btn-icon-primary btn-hover-icon-success font-weight-bolder btn-hover-bg-light mr-2">
                                                    <i className="fas fa-file-excel">
                                                    </i> Decargar leads
                                                </span>
                                                <span onClick={() => { this.changePageAdd('telefono') }} className="btn text-dark-50 btn-icon-primary btn-hover-icon-success font-weight-bolder btn-hover-bg-light">
                                                    <i className="fas fa-user-plus">
                                                    </i> Nuevo lead
                                                </span>
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

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(UrlLocation)