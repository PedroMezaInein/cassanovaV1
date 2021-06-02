import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { Button, InputGray, RangeCalendar, InputNumberGray } from '../../form-components'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class FormularioContrato extends Component {

    render() {
        const { onSubmit, empleado, formContrato, onChangeContrato, onChangeRange, generarContrato } = this.props
        console.log(formContrato,'formContrato-contrato')
        console.log(empleado,'empleado')
        return (
            <Form id="formContrato-empleados-contrato"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'formContrato-empleados-contrato')
                    }
                }
            >
                {
                    empleado &&
                        empleado.tipo_empleado === 'Administrativo' ?
                        <div className="formContrato-group row formContrato-group-marginless mt-8">
                            <div className={formContrato.periodo === true ? 'col-md-6' : 'col-md-12'}>
                                <div className="mx-auto w-fit-content">
                                    <label className="font-weight-bolder">Periodo del contrato</label>
                                    <div className="radio-list">
                                        <label className="radio radio-outline radio-success">
                                            <input
                                                type="radio"
                                                name='periodo'
                                                value={true}
                                                onChange={onChangeContrato}
                                                checked={formContrato.periodo === true ? true : false}
                                            />
                                            <span></span>DÍAS</label>
                                        <label className="radio radio-outline radio-success">
                                            <input
                                                type="radio"
                                                name='periodo'
                                                value={false}
                                                onChange={onChangeContrato}
                                                checked={formContrato.periodo === false ? true : false}
                                            />
                                            <span></span>INDEFINIDO</label>
                                    </div>
                                </div>
                            </div>
                            {
                                formContrato.periodo === true &&
                                <div className="col-md-6">
                                    <InputNumberGray
                                        formgroup="mb-0"
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="dias"
                                        type="text"
                                        value={formContrato.dias}
                                        placeholder="DÍAS"
                                        iconclass="flaticon2-calendar-6"
                                        messageinc="Incorrecto. Ingresa el número de días."
                                    />
                                </div>
                            }
                        </div>
                        :
                        <div className="formContrato-group row formContrato-group-marginless mt-8">
                            <div className="col-md-6 text-align-last-center">
                                <label className="text-center font-weight-bolder text-bodymb-2">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar
                                    onChange={onChangeRange}
                                    start={formContrato.fechaInicio}
                                    end={formContrato.fechaFin}
                                />
                            </div>
                            <div className="col-md-6 align-self-center">
                                <div className="col-md-12 mb-4">
                                    <InputGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        withplaceholder={1}
                                        withicon={1}
                                        withformgroup={0}
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="periodo_pago"
                                        type="text"
                                        value={formContrato.periodo_pago}
                                        placeholder="PERIODO DE PAGO"
                                        iconclass="flaticon2-calendar-4"
                                        messageinc="Incorrecto. Ingresa el periodo de pago."
                                    />
                                </div>
                                <div className="col-md-12 mb-4">
                                    <InputGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        withplaceholder={1}
                                        withicon={1}
                                        withformgroup={0}
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="ubicacion_obra"
                                        type="text"
                                        value={formContrato.ubicacion_obra}
                                        placeholder="UBICACIÓN DE LA OBRA"
                                        iconclass="flaticon2-map"
                                        messageinc="Incorrecto. Ingresa la ubicación de la obra."
                                    />
                                </div>
                                <div className="formContrato-group col-md-12 mb-4">
                                    <InputNumberGray
                                        formgroup="mb-0"
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="pagos_hr_extra"
                                        type="text"
                                        value={formContrato.pagos_hr_extra}
                                        placeholder="PAGOS DE HORA EXTRA "
                                        iconclass="far fa-money-bill-alt"
                                        messageinc="Incorrecto. Ingresa el pago de hora extra."
                                    />
                                </div>
                                <div className="formContrato-group col-md-12">
                                    <InputNumberGray
                                        formgroup="mb-0"
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="dias"
                                        type="text"
                                        value={formContrato.dias}
                                        placeholder="DÍAS"
                                        iconclass="flaticon2-calendar-6"
                                        messageinc="Incorrecto. Ingresa el número de días."
                                    />
                                </div>
                            </div>
                        </div>
                }
                {/* 
                <a className="btn btn-light h-40px px-3 text-danger font-weight-bolder">
                    <span className="svg-icon svg-icon-lg svg-icon-danger">
                        <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                    </span>Cancelar
                </a> */}
                <div className="card-footer pt-3 pr-1 mt-5 pb-0">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            {
                                empleado &&
                                    empleado.contratos.length === 0 ?
                                    <a className="btn btn-light h-40px px-3 text-success font-weight-bolder"
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(generarContrato, e, 'formContrato-empleados-contrato')
                                            }
                                        }>
                                        <span className="svg-icon svg-icon-lg svg-icon-success">
                                            <SVG src={toAbsoluteUrl('/images/svg/File-plus.svg')} />
                                        </span>GENERAR CONTRATO
                                    </a>
                                    :
                                    <a className="btn btn-light h-40px px-3 mr-2 text-info font-weight-bolder">
                                        <span className="svg-icon svg-icon-lg svg-icon-info">
                                            <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                                        </span>Renovar
                                    </a>
                            }
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default FormularioContrato