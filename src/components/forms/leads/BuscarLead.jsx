import React, { Component } from 'react'
import { InputGray, Button } from '../../form-components'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';

class BuscarLead extends Component {

    render() {
        const { form, onChange, onSubmit } = this.props
        return (
            <>
                <Form onSubmit={onSubmit} >
                    <div className="form-group row form-group-marginless mt-4 mb-0 mx-0 d-flex justify-content-center align-self-center">
                        <div className="col-md-8">
                            <InputGray
                                withtaglabel={1}
                                withtextlabel={1}
                                withplaceholder={1}
                                withicon={1}
                                withformgroup={1}
                                placeholder='NOMBRE DEL LEAD'
                                iconclass="far fa-user"
                                name='name'
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-md-2 d-flex justify-content-center align-self-center">
                            <div className="mt-3">
                                <Button icon='' className="btn btn-primary mr-2" onClick={onSubmit} text="BUSCAR" />
                            </div>
                        </div>
                    </div>
                </Form>
                <div class="separator separator-solid"></div>

                <div className="tab-content mt-9">
                    <div className="table-responsive-lg">
                        <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                            <thead>
                                {/* <tr>
                                    <th colSpan="7" className='text-pink p-2 text-center text-uppercase'>
                                        Busqueda por {form.name}
                                    </th>
                                </tr> */}
                                <tr className="text-uppercase">
                                    <th style={{ minWidth: "100px" }}>
                                        <span className="text-dark-75 font-size-lgsm">Nombre y fecha</span>
                                    </th>
                                    {/* <th>Fecha</th> */}
                                    <th className="text-center">Origen</th>
                                    <th className="text-center">Estatus</th>
                                    <th className="text-center">Empresa</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="pl-0 py-8">
                                        <div className="d-flex align-items-center">
                                            <div className="symbol symbol-60 mr-3">
                                                <span className="symbol-label font-size-h5 bg-light text-dark-75">N</span>
                                            </div>
                                            <div>
                                                <a className="text-dark-75 font-weight-bolder text-hover-pink font-size-6">Nombre del lead</a>
                                                <span class="text-muted font-weight-bold d-block font-size-sm mt-1"><span className="text-dark-75 font-weight-bolder">Ingreso: </span>26/03/2021</span>
                                                <span class="text-muted font-weight-bold d-block font-size-sm"><span className="text-dark-75 font-weight-bolder">U.Contacto: </span>26/03/2021</span>
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td className="font-size-lg text-left font-weight-bolder">
                                        <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">26/03/2021</span><br />
                                        <span>Último contacto: </span><span className="text-muted font-weight-bold font-size-sm">26/03/2021</span>
                                    </td> */}
                                    <td className="text-center font-size-lg font-weight-bolder">
                                        Origen
                                    </td>
                                    <td className="text-center font-size-lg font-weight-bolder">
                                        Estatus
                                    </td>
                                    <td className="text-center font-size-lg font-weight-bolder">
                                        Empresa
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
}

export default BuscarLead