import React, { Component } from 'react'
import axios from 'axios'
import SVG from "react-inlinesvg";
import { URL_DEV } from '../../../constants'
import { Row, Form, Col, Tab, Nav } from 'react-bootstrap'
import { toAbsoluteUrl, setSingleHeader } from '../../../functions/routers'
import { setDateText, setNaviIcon, setOptions, setOptionsWithLabel } from '../../../functions/setters'
import { optionsFases } from '../../../functions/options'
import { RadioGroupGray, Button, InputGray, ReactSelectSearchGray } from '../../form-components'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, deleteAlert } from '../../../functions/alert'
import { apiGet, apiOptions, apiPostForm, apiDelete, catchErrors } from '../../../functions/api'
import Swal from 'sweetalert2';
class RHLicenciasForm extends Component {
    
    state = {
        form: {
            licencia: '',
            codigo:''
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
                let aux = []
                licencias.forEach(elemento => {
                    aux.push({
                        name: elemento.fullName,
                        label: elemento.fullName,
                        value: elemento.id.toString(),
                        codigo: elemento.nextKeyAvailable
                    })
                    return ''
                })
                options.licencias = aux
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
        const { form, options } = this.state
        options.licencias.forEach((licencia) => {
            if (value.value === licencia.value) {
                form.codigo = licencia.codigo
            }
        })
        form[name] = value
        this.setState({ ...this.state, form })
    }

    printFechaFin = (licencia) => {
        let fecha = new Date(licencia.pivot.fecha)
        let newDate = new Date(fecha.setMonth(fecha.getMonth()+licencia.duracion));
        return setDateText(newDate)
    }

    render() {
        const { form, activeHistorial, licencias } = this.state
        const { options } = this.state
        console.log(form, 'form')
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
                        <div className="table-responsive">
                            <table className="table w-100 table-vertical-center table-hover text-center">
                                <thead>
                                    <tr>
                                        <th className="w-5"></th>
                                        <th className="text-dark-75 w-15">Nombre</th>
                                        <th className="text-dark-75 w-10">Duración</th>
                                        <th className="text-dark-75 w-15">Fecha de activación</th>
                                        <th className="text-dark-75 w-15">Fecha de vencimiento</th>
                                        <th className="text-dark-75 w-10">Estatus</th>
                                        <th className="text-dark-75 w-15">Token</th>
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
                                                    <tr key = { index } className="font-weight-light border-top font-size-md">
                                                        <td>
                                                            <button className='btn btn-icon btn-actions-table btn-xs btn-text-danger btn-hover-danger'
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
                                                        </td>
                                                        <td>
                                                            { licencia.tipo } - { licencia.nombre }
                                                        </td>
                                                        <td>
                                                            { licencia.duracion } meses
                                                        </td>
                                                        <td>
                                                            { setDateText(licencia.pivot.fecha) }
                                                        </td>
                                                        <td>
                                                            { this.printFechaFin(licencia) }
                                                        </td>
                                                        <td>
                                                            <div className = { `label-status ${licencia.pivot.estatus === 'En uso' ? 'text-success bg-light-success' : 'text-danger'}`}>
                                                                { licencia.pivot.estatus }
                                                            </div>
                                                        </td>
                                                        <td className = "font-weight-bold">
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
                                {
                                    form.licencia ?
                                    <div className="col-md-6">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                            withformgroup={1} requirevalidation={0} name='codigo' 
                                            placeholder={`CÓDIGO`} value={form.codigo} iconclass='las la-key icon-xl text-danger'
                                            letterCase={false} disabled={true} customdiv='mb-0 bg-input-disable-success' customclass="disable-success"
                                        />
                                    </div>
                                    :<></>
                                }
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