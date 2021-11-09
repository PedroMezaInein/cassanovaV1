import React, { Component } from 'react'
import axios from 'axios'
import SVG from "react-inlinesvg"
import { URL_DEV } from '../../../constants'
import { Row, Form, Col } from 'react-bootstrap'
import { Button, InputGray } from '../../form-components'
import { apiDelete, catchErrors } from '../../../functions/api'
import { toAbsoluteUrl, setSingleHeader } from '../../../functions/routers'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, deleteAlert, errorAlert } from '../../../functions/alert'
class RHLicenciasForm extends Component {
    state = {
        form: {
            tipo: '',
            equipos: [
                {
                    equipo: '',
                    modelo: '',
                    marca: '',
                    serie: '',
                    descripcion: ''
                }
            ],
        },
        activeHistorial: true,
    }
    activeBtn = () => {
        let { activeHistorial } = this.state
        this.setState({
            ...this.state,
            activeHistorial: !activeHistorial
        })
    }
    onChangeEquipos = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form.equipos[key][name] = value
        this.setState({ ...this.state, form })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    onSubmit = async () => {
        waitAlert()
        const { at, refresh } = this.props
        const { form } = this.state
        await axios.post(`${URL_DEV}`, form, { headers: setSingleHeader(at) }).then(
            (response) => {
                doneAlert(`Equipo generado con éxito`, () => { refresh() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    addRowEquipo = () => {
        const { form } = this.state
        form.equipos.push({
            equipo: '',
            modelo: '',
            marca: '',
            serie: '',
            descripcion: ''
        })
        this.setState({ ...this.state, form })
    }
    deleteRowEquipo = (key) => {
        let aux = []
        const { form } = this.state
        form.equipos.forEach((element, index) => {
            if (index !== key)
                aux.push(element)
        })
        if (aux.length) {
            form.equipos = aux
        } else {
            form.equipos = [{
                equipo: '',
                modelo: '',
                marca: '',
                serie: '',
                descripcion: ''
            }]
        }
        this.setState({
            ...this.state,
            form
        })
    }
    deleteEquipo = async(id) => {
        waitAlert()
        const { at } = this.props
        apiDelete(`${id}`, at).then(
            (response) => {
                doneAlert(`Equipo eliminado con éxito`)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    render() {
        const { form, activeHistorial } = this.state
        return (
            <>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-sm btn-flex btn-light-info" onClick={() => { this.activeBtn() }} >
                        {
                            activeHistorial ?
                                <><span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Shield-protected.svg')} /></span><div className="font-weight-bolder">AGREGAR EQUIPO</div></>
                                : <><span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Clipboard-list.svg')} /></span><div className="font-weight-bolder">HISTORIAL DE EQUIPOS</div></>
                        }
                    </button>
                </div>
                {
                    activeHistorial ?
                        <div >
                            <table className="table w-100 table-vertical-center table-hover text-center">
                                <thead>
                                    <tr>
                                        <th className="w-5"></th>
                                        <th className="text-dark-75">Equipo</th>
                                        <th className="text-dark-75">Modelo</th>
                                        <th className="text-dark-75">Marca</th>
                                        <th className="text-dark-75">Serie</th>
                                        <th className="text-dark-75">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {
                                            equipos.map((equipo, index) => {
                                                return ( */}
                                    <tr /*key={index}*/ className="font-weight-light border-top">
                                        <td>
                                            <button className='btn btn-icon btn-xs btn-text-danger btn-hover-danger'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteAlert(
                                                        `Eliminarás el equipo`,
                                                        `¿Deseas continuar?`,
                                                        () => { this.deleteEquipo('equipo.id') }
                                                    )
                                                }} >
                                                <i className='flaticon2-rubbish-bin' />
                                            </button>
                                        </td>
                                        <td>Equipo</td>
                                        <td>Modelo</td>
                                        <td>Marca</td>
                                        <td>Serie</td>
                                        <td>Descripción</td>
                                    </tr>
                                    {/* )
                                            })
                                        } */}
                                </tbody>
                            </table>
                        </div>
                        :
                        <>
                            <Form id="form-equipos" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-equipos') }}>
                                <div className="mb-8">
                                    <Button icon='' className="btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" onClick={this.addRowEquipo}
                                        text='AGREGAR EQUIPO' only_icon="flaticon2-plus icon-13px mr-2 px-0 text-success" />
                                    <div className="mt-5">
                                        {
                                            form.equipos.map((equipo, key) => {
                                                return (
                                                    <Row className="mx-0 form-group-marginless" key={key}>
                                                        <Col md="auto" className="align-self-center pl-2 pr-0">
                                                            <Button icon='' onClick={() => { this.deleteRowEquipo(key) }}
                                                                className="btn btn-icon btn-xs p-4 btn-bg-white btn-icon-danger btn-hover-danger" only_icon="las la-trash text-danger icon-xl" />
                                                        </Col>
                                                        <Col>
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='EQUIPO'
                                                                value={form['equipos'][key]['equipo']}
                                                                withtaglabel={0}
                                                                name='equipo'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'equipo')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='MODELO'
                                                                value={form['equipos'][key]['modelo']}
                                                                withtaglabel={0}
                                                                name='modelo'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'modelo')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='MARCA'
                                                                value={form['equipos'][key]['marca']}
                                                                withtaglabel={0}
                                                                name='marca'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'marca')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='SERIE'
                                                                value={form['equipos'][key]['serie']}
                                                                withtaglabel={0}
                                                                name='serie'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'serie')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <InputGray
                                                                requirevalidation={0}
                                                                placeholder='DESCRIPCIÓN'
                                                                value={form['equipos'][key]['descripcion']}
                                                                withtaglabel={0}
                                                                name='descripcion'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'descripcion')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        {
                                                            form.equipos.length === 1 || key === form.equipos.length - 1 ? <></>
                                                                : <Col md="12"> <div className="separator separator-solid my-3"></div> </Col>
                                                        }
                                                    </Row>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="card-footer pt-3 pb-0 px-0 text-right">
                                    <Button icon='' className="btn btn-primary" text="ENVIAR"
                                        onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-equipos') }} />
                                </div>
                            </Form>
                        </>
                }
            </>
        )
    }
}

export default RHLicenciasForm