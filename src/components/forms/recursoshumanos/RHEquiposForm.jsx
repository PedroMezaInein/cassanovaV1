import React, { Component } from 'react'
import SVG from "react-inlinesvg"
import { Row, Form, Col } from 'react-bootstrap'
import { Button, InputGray } from '../../form-components'
import { toAbsoluteUrl } from '../../../functions/routers'
import { apiDelete, apiGet, apiPostForm, catchErrors } from '../../../functions/api'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, deleteAlert } from '../../../functions/alert'
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
        equipos: [],
        activeHistorial: true,
    }

    componentDidMount = () => {
        this.getEquipos()
    }

    getEquipos = async() => {
        const { at, empleado } = this.props
        apiGet(`v2/rh/empleados/equipos/${empleado.id}`, at).then(
                (response) => {
                    const { equipos } = response.data
                    this.setState({
                        ...this.state,
                        equipos: equipos
                    })
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { catchErrors(error) } )
    }
    
    onSubmit = async () => {
        waitAlert()
        const { at, empleado } = this.props
        const { form } = this.state
        apiPostForm(`v2/rh/empleados/equipos/${empleado.id}`, form, at).then(
            (response) => {
                this.setState({
                    ...this.state,
                    activeHistorial: true
                })
                doneAlert(`Equipo registrado con éxito`,  () => { this.getEquipos() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    deleteEquipo = async(id) => {
        waitAlert()
        const { at, empleado } = this.props
        apiDelete(`v2/rh/empleados/equipos/${empleado.id}/equipo/${id}`, at).then(
            (response) => {
                doneAlert(`Equipo registrado con éxito`,  () => { this.getEquipos() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
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
    
    render() {
        const { form, activeHistorial, equipos } = this.state
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-sm btn-flex btn-light-info" onClick={() => { this.activeBtn() }} >
                        {
                            activeHistorial ?
                                <div className = 'd-flex'>
                                    <span className="svg-icon">
                                        <SVG src={toAbsoluteUrl('/images/svg/Shield-protected.svg')} />
                                    </span>
                                    <div className="font-weight-bolder">AGREGAR EQUIPO</div>
                                </div>
                            : 
                                <div className = 'd-flex'>
                                    <span className="svg-icon">
                                        <SVG src={toAbsoluteUrl('/images/svg/Clipboard-list.svg')} />
                                    </span>
                                    <div className="font-weight-bolder">HISTORIAL DE EQUIPOS</div>
                                </div>
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
                                        <th className="text-dark-75">Equipo</th>
                                        <th className="text-dark-75">Modelo</th>
                                        <th className="text-dark-75">Marca</th>
                                        <th className="text-dark-75">Serie</th>
                                        <th className="text-dark-75">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        equipos.length === 0 ?
                                            <tr className="font-weight-light border-top">
                                                <td colSpan = '6' className = 'text-center'>
                                                    No hay datos disponibles
                                                </td>
                                            </tr>
                                        : 
                                            equipos.map((equipo) => {
                                                return (
                                                    <tr key = { equipo.id } className="font-weight-light border-top">
                                                        <td>
                                                            <button className='btn btn-icon btn-xs btn-text-danger btn-hover-danger'
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    deleteAlert(
                                                                        `Eliminarás el equipo`,
                                                                        `¿Deseas continuar?`,
                                                                        () => { this.deleteEquipo(equipo.id) }
                                                                    )
                                                                }} >
                                                                <i className='flaticon2-rubbish-bin' />
                                                            </button>
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.equipo }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.modelo }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.marca }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.serie }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.descripcion }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                    }
                                </tbody>
                            </table>
                        </div>
                    :
                        <Form id="form-equipos" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-equipos') }}>
                            <div className="mb-8">
                                <Button className="btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" 
                                    icon='' onClick={this.addRowEquipo} text='AGREGAR EQUIPO' only_icon="flaticon2-plus icon-13px mr-2 px-0 text-success" />
                                <div className="mt-5">
                                    {
                                        form.equipos.map((equipo, key) => {
                                            return (
                                                <div>
                                                    <div className="d-flex w-100" key={key}>
                                                        <div className="w-auto align-self-center">
                                                            <Button icon='' onClick={() => { this.deleteRowEquipo(key) }}
                                                                className="btn btn-icon btn-xs p-4 btn-bg-white btn-icon-danger btn-hover-danger"
                                                                only_icon="las la-trash text-danger icon-xl" />
                                                        </div>
                                                        <div className="w-100">
                                                            <Row className="mx-0 form-group-marginless">
                                                                <Col md="3">
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
                                                                <Col md="3" className="mt-4 mt-lg-0">
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
                                                                <Col md="3" className="mt-4 mt-lg-0">
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
                                                                <Col md="3" className="mt-4 mt-lg-0">
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
                                                                <Col md="12" className="mt-4">
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
                                                                        as="textarea"
                                                                        rows="2"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                    {
                                                        form.equipos.length === 1 || key === form.equipos.length - 1 ? <></>
                                                            : <div className="separator separator-solid my-3 w-100"></div>
                                                    }
                                                </div>
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
                }
            </div>
        )
    }
}

export default RHLicenciasForm