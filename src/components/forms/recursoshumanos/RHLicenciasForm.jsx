import React, { Component } from 'react'
import axios from 'axios'
import SVG from "react-inlinesvg";
import { URL_DEV } from '../../../constants'
import { Row, Form, Col, Tab, Nav } from 'react-bootstrap'
import { toAbsoluteUrl, setSingleHeader } from '../../../functions/routers'
import { setNaviIcon, setOptions, setOptionsWithLabel } from '../../../functions/setters'
import { optionsFases } from '../../../functions/options'
import { RadioGroupGray, Button, InputGray, ReactSelectSearchGray } from '../../form-components'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, deleteAlert } from '../../../functions/alert'
import { apiGet, apiOptions, catchErrors } from '../../../functions/api'
import Swal from 'sweetalert2';
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

    activeBtn = () => {
        let { activeHistorial } = this.state
        this.setState({
            ...this.state,
            activeHistorial: !activeHistorial
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
    render() {
        const { form, activeHistorial, licencias } = this.state
        const { options } = this.state
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-sm btn-flex btn-light-primary2" onClick={() => { this.activeBtn() }} >
                        {
                            activeHistorial ?
                                <><span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Shield-protected.svg')} /></span><div>AGREGAR LICENCIA</div></>
                            : <><span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Clipboard-list.svg')} /></span><div>HISTORIAL DE LICENCIAS</div></>
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
                                        <th className="text-dark-75">Tiempo de vencimiento</th>
                                        <th className="text-dark-75">Estatus</th>
                                        <th className="text-dark-75">Token</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        licencias.length === 0 ?
                                            <tr className="font-weight-light border-top ">
                                                <td colSpan = '6' className = 'text-center'>
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
                                                                        () => { this.deleteLicencia('licencia.id') }
                                                                    )
                                                                } } >
                                                                <i className='flaticon2-rubbish-bin' />
                                                            </button>
                                                        </td>
                                                        <td className='px-2 text-break'>Nombre</td>
                                                        <td className='px-2 text-break'>Fecha de activación</td>
                                                        <td className='px-2 text-break'>Tiempo de vencimiento</td>
                                                        <td className='px-2 text-break'>Estatus</td>
                                                        <td className='px-2 text-break'>Token</td>
                                                    </tr>
                                                )
                                            })
                                    }
                                    {/* {
                                        licencias.map((licencia, index) => {
                                            return ( */}
                                                <tr /*key={index}*/ className="font-weight-light border-top">
                                                    <td className='px-2'>
                                                        <button className='btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger'
                                                            onClick = { (e) => { 
                                                                e.preventDefault(); 
                                                                deleteAlert(
                                                                    `Eliminarás la licencia`,
                                                                    `¿Deseas continuar?`,
                                                                    () => { this.deleteLicencia('licencia.id') }
                                                                )
                                                            } } >
                                                            <i className='flaticon2-rubbish-bin' />
                                                        </button>
                                                    </td>
                                                    <td className='px-2 text-break'>Nombre</td>
                                                    <td className='px-2 text-break'>Fecha de activación</td>
                                                    <td className='px-2 text-break'>Tiempo de vencimiento</td>
                                                    <td className='px-2 text-break'>Estatus</td>
                                                    <td className='px-2 text-break'>Token</td>
                                                </tr>
                                            {/* )
                                        })
                                    } */}
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