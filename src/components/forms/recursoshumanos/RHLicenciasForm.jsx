import React, { Component } from 'react'
import axios from 'axios'
import SVG from "react-inlinesvg";
import { URL_DEV } from '../../../constants'
import { Row, Form, Col, Tab, Nav } from 'react-bootstrap'
import { toAbsoluteUrl, setSingleHeader } from '../../../functions/routers'
import { setDateText, setNaviIcon, setOptions, setOptionsWithLabel } from '../../../functions/setters'
import { optionsFases } from '../../../functions/options'
import { RadioGroupGray, Button, InputGray, ReactSelectSearchGray } from '../../form-components'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, deleteAlert, questionAlertWithLottie } from '../../../functions/alert'
import { apiGet, apiOptions, apiPostForm, apiDelete, catchErrors, apiPutForm } from '../../../functions/api'
import Swal from 'sweetalert2';
import { Software } from '../../../assets/animate';
class RHLicenciasForm extends Component {
    
    state = {
        form: {
            licencia: ''
        },
        options: {
            licencias: []
        },
        activeHistorial: true,
        licencias: []
    }

    componentDidMount = () => {
        this.getLicencias()
    }

    getOptions = async() => {
        waitAlert()
        const { at } = this.props
        apiOptions(`v2/rh/empleados/licencias`, at).then(
            (response) => {
                const { licencias } = response.data
                const { options } = this.state
                options.licencias = setOptionsWithLabel(licencias, 'fullName', 'id')
                Swal.close()
                this.setState({
                    ... this.state,
                    options
                })
            }, (error) => { printResponseErrorAlert(error) })
            .catch((error) => { catchErrors(error) })
    }

    getLicencias = async() => {
        waitAlert()
        const { at, empleado } = this.props
        apiGet(`v2/rh/empleados/licencias/${empleado.id}`, at).then(
            (response) => {
                Swal.close()
                const { licencias } = response.data
                this.setState({
                    ...this.state,
                    licencias: licencias
                })
            }, (error) => { printResponseErrorAlert(error) })
            .catch((error) => { catchErrors(error) })
    }

    deleteLicencia = async(id, token) => {
        waitAlert()
        const { at, empleado } = this.props
        apiDelete(`v2/rh/empleados/licencias/${empleado.id}/licencia/${id}?token=${token}`, at).then(
            (response) => {
                this.getLicencias()
            }, (error) => { printResponseErrorAlert(error) })
            .catch((error) => { catchErrors(error) })
    }

    nuevoToken = async(licencia) => {
        waitAlert()
        const { at, empleado } = this.props
        apiPutForm(`v2/rh/empleados/licencias/${empleado.id}/${licencia.id}`, { token: licencia.pivot.token }, at).then(
            (response) => {
                this.getLicencias()
            }, (error) => { printResponseErrorAlert(error) })
            .catch((error) => { catchErrors(error) })
    }

    onSubmit = async() => {
        waitAlert()
        const { form } = this.state
        const { at, empleado } = this.props
        apiPostForm(`v2/rh/empleados/licencias/${empleado.id}`, form, at).then(
            (response) => {
                Swal.close()
                const { licencias } = response.data
                this.setState({
                    ...this.state,
                    licencias: licencias,
                    activeHistorial: true
                })
            }, (error) => { printResponseErrorAlert(error) })
            .catch((error) => { catchErrors(error) })
    }

    activeBtn = () => {
        let { activeHistorial, form } = this.state
        form.licencia = ''
        this.setState({
            ...this.state,
            activeHistorial: !activeHistorial,
            form
        })
        if(activeHistorial){
            this.getOptions()
        }else{
            this.getLicencias()
        }
    }

    updateSelect = (value, name) => {
        this.onChange({ target: { value: value, name: name } })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    printFechaFin = (licencia) => {
        let fecha = new Date(licencia.pivot.fecha)
        let newDate = new Date(fecha.setMonth(fecha.getMonth()+licencia.duracion));
        return setDateText(newDate)
    }

    render() {
        const { form, activeHistorial, licencias, options } = this.state
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-sm btn-flex btn-light-info" onClick={() => { this.activeBtn() }} >
                        {
                            activeHistorial ?
                                <><span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Shield-protected.svg')} /></span><div className="font-weight-bolder">AGREGAR LICENCIA</div></>
                                : <><span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Clipboard-list.svg')} /></span><div className="font-weight-bolder">HISTORIAL DE LICENCIAS</div></>
                        }
                    </button>
                </div>
                {
                    activeHistorial ?
                        <div>
                            <table className="table w-100 table-vertical-center table-hover text-center">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className="text-dark-75">Nombre</th>
                                        <th className="text-dark-75">Fecha de activación</th>
                                        <th className="text-dark-75">Duración</th>
                                        <th className="text-dark-75">Fecha de vencimiento</th>
                                        <th className="text-dark-75">Estatus</th>
                                        <th className="text-dark-75">Token</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        licencias.length === 0 ?
                                            <tr className="font-weight-light border-top ">
                                                <td colSpan = '7' className = 'text-center'>
                                                    No hay licencias mostradas
                                                </td>
                                            </tr>
                                        :
                                            licencias.map((licencia, index) => {
                                                return(
                                                    <tr key = { index } className="font-weight-light border-top">
                                                        <td className='px-2'>
                                                            <button className='btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger'
                                                                onClick = { (e) => { 
                                                                    e.preventDefault(); 
                                                                    deleteAlert(
                                                                        `Eliminarás la licencia`,
                                                                        `¿Deseas continuar?`,
                                                                        () => { this.deleteLicencia(licencia.id, licencia.pivot.token) }
                                                                    )
                                                                } } >
                                                                <i className='flaticon2-rubbish-bin' />
                                                            </button>
                                                            
                                                            {
                                                                licencia.pivot.estatus === 'En uso' && licencia.keysAvailables > 0 ?
                                                                    <button className='btn btn-icon btn-actions-table btn-xs ml-2 btn-text-info btn-hover-info'
                                                                        onClick = { (e) => { 
                                                                            e.preventDefault(); 
                                                                            questionAlertWithLottie(
                                                                                '¿Deseas continuar?',
                                                                                `Solicitarás un nuevo token de la licencia ${licencia.tipo} - ${licencia.nombre}`,
                                                                                Software,
                                                                                { confirm: 'SI', cancel: 'NO' },
                                                                                {
                                                                                    cancel: null,
                                                                                    success: () => this.nuevoToken(licencia)
                                                                                }
                                                                            )
                                                                        } } >
                                                                        <i className='fas fa-retweet' />
                                                                    </button>
                                                                : null
                                                            }
                                                        </td>
                                                        <td className='px-2 text-break'>
                                                            { licencia.tipo } - { licencia.nombre }
                                                        </td>
                                                        <td className='px-2 text-break'>
                                                            { setDateText(licencia.pivot.fecha) }
                                                        </td>
                                                        <td className='px-2 text-break'>
                                                            { licencia.duracion } meses
                                                        </td>
                                                        <td className='px-2 text-break'>
                                                            { this.printFechaFin(licencia) }
                                                        </td>
                                                        <td className = { `px-2 text-break font-weight-bold ${licencia.pivot.estatus === 'En uso' ? 'text-success' : 'text-danger'}` }>
                                                            { licencia.pivot.estatus }
                                                        </td>
                                                        <td className = { `px-2 text-break font-weight-bold ${licencia.pivot.estatus === 'En uso' ? 'text-success' : 'text-danger'}` }>
                                                            { licencia.pivot.token }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                    }
                                </tbody>
                            </table>
                        </div>
                    : 
                        <Form id = 'form-ventas-solicitud-factura' onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-ventas-solicitud-factura') } }>
                            <Row className="form-group mx-0 form-group-marginless">
                                <div className="col-md-6">
                                    <ReactSelectSearchGray requirevalidation = { 1 } placeholder = 'SELECCIONA LA LICENCIA'
                                        defaultvalue = { form.licencia } iconclass = 'las la-shield-alt icon-xl'
                                        options = { options.licencias } onChange={(value) => { this.updateSelect(value, 'licencia') }}
                                        messageinc="Incorrecto. Selecciona la licencia." />
                                </div>
                            </Row>
                            <div className="d-flex justify-content-end border-top mt-3 pt-3">
                                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type = 'submit' text="ENVIAR" />
                            </div>
                        </Form>
                }
            </div>
        )
    }
}

export default RHLicenciasForm