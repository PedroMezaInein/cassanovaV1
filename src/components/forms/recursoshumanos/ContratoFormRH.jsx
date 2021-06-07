import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { InputGray, RangeCalendar, InputNumberGray, Button, CalendarDay } from '../../form-components'
class ContratoFormRH extends Component {
    state = {
        renovar: false,
    }
    clearFiles = (name, key) => {
        const { form } = this.props
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { empleado, form, onChangeContrato, onChangeRange, onSubmit, tipo, cancelarContrato, renovarContrato } = this.props
        const { renovar } = this.state
        return (
            <Form
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'wizard-3-content')
                    }
                }
            >
                {
                    tipo === 'Administrativo' ?
                        <div className="form-group row form-group-marginless mt-8 align-items-center">
                            <div className={form.periodo === true ? 'col-md-6' : 'col-md-12'}>
                                <div className="mx-auto w-fit-content">
                                    <label className="font-weight-bolder">Periodo del contrato</label>
                                    <div className="radio-list">
                                        <label className="radio radio-outline radio-success">
                                            <input
                                                type="radio"
                                                name='periodo'
                                                value={true}
                                                onChange={onChangeContrato}
                                                checked={form.periodo === true ? true : false}
                                            />
                                            <span></span>DÍAS</label>
                                        <label className="radio radio-outline radio-success">
                                            <input
                                                type="radio"
                                                name='periodo'
                                                value={false}
                                                onChange={onChangeContrato}
                                                checked={form.periodo === false ? true : false}
                                            />
                                            <span></span>INDEFINIDO</label>
                                    </div>
                                </div>
                            </div>
                            {
                                form.periodo === true &&
                                <div className="col-md-6">
                                    <InputNumberGray
                                        formgroup="mb-0"
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="dias"
                                        type="text"
                                        value={form.dias}
                                        placeholder="DÍAS"
                                        iconclass="flaticon2-calendar-6"
                                        messageinc="Incorrecto. Ingresa el número de días."
                                    />
                                </div>
                            }
                            {
                                renovar &&
                                <div className="col-md-12 text-center align-self-center mt-10">
                                    <div className="text-center">
                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bolder">Fecha de contrato</label>
                                        </div>
                                        <CalendarDay date={form.fechaInicio} onChange={onChangeContrato} name='fechaInicio' requirevalidation={1} withformgroup={0} />
                                    </div>
                                </div>
                            }
                        </div>
                        :
                        <div className="form-group row form-group-marginless mt-8">
                            <div className="col-md-6 text-align-last-center align-self-center">
                                <label className="text-center font-weight-bolder text-bodymb-2">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar
                                    onChange={onChangeRange}
                                    start={form.fechaInicio}
                                    end={form.fechaFin}
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
                                        value={form.periodo_pago}
                                        placeholder="PERIODO DE PAGO"
                                        iconclass="flaticon2-calendar-4"
                                        messageinc="Incorrecto. Ingresa el periodo de pago."
                                    />
                                </div>
                                <div className="form-group col-md-12 mb-4">
                                    <InputNumberGray
                                        formgroup="mb-0"
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="pagos_hr_extra"
                                        type="text"
                                        value={form.pagos_hr_extra}
                                        placeholder="PAGOS DE HORA EXTRA "
                                        iconclass="far fa-money-bill-alt"
                                        messageinc="Incorrecto. Ingresa el pago de hora extra."
                                        thousandseparator={true}
                                    />
                                </div>
                                <div className="form-group col-md-12 mb-4">
                                    <InputNumberGray
                                        formgroup="mb-0"
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="total_obra"
                                        type="text"
                                        value={form.total_obra}
                                        placeholder="TOTAL DE LA OBRA"
                                        iconclass="fas fa-dollar-sign"
                                        messageinc="Incorrecto. Ingresa el total de la obra."
                                        thousandseparator={true}
                                    />
                                </div>
                                <div className="form-group col-md-12">
                                    <InputNumberGray
                                        formgroup="mb-0"
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="dias"
                                        type="text"
                                        value={form.dias}
                                        placeholder="DÍAS DEL CONTRATO"
                                        iconclass="flaticon2-calendar-6"
                                        messageinc="Incorrecto. Ingresa el número de días del contrato."
                                    />
                                </div>
                                <div className="form-group col-md-12">
                                    <InputGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        withplaceholder={1}
                                        withicon={1}
                                        withformgroup={0}
                                        requirevalidation={1}
                                        onChange={onChangeContrato}
                                        name="dias_laborables"
                                        type="text"
                                        value={form.dias_laborables}
                                        placeholder="DÍAS LABORABLES"
                                        iconclass="flaticon2-calendar-9"
                                        messageinc="Incorrecto. Ingresa el número de días laborables."
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 mb-4">
                                <div className="col-md-12">
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
                                        value={form.ubicacion_obra}
                                        placeholder="UBICACIÓN DE LA OBRA"
                                        iconclass="flaticon2-map"
                                        messageinc="Incorrecto. Ingresa la ubicación de la obra."
                                    />
                                </div>
                            </div>
                        </div>
                }
                        <div className="card-footer pt-3 pr-1 mt-5 pb-0">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' text='ENVIAR' onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
                                </div>
                            </div>
                        </div>
            </Form>

        )
    }
}

export default ContratoFormRH