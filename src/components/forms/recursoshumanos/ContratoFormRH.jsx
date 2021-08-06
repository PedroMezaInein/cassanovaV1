import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { InputGray, RangeCalendar, InputNumberGray, Button, CalendarDay, SelectSearchGray } from '../../form-components'
class ContratoFormRH extends Component {
    updateEmpleado = value => {
        const { onChangeContrato } = this.props
        onChangeContrato({ target: { value: value, name: 'empleado' } })
    }
    render() {
        const { options, form, onChangeContrato, onChangeRange, onSubmit, tipo, formeditado, title } = this.props
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
                    tipo === 'administrativo' ?
                        <>
                            <div className="form-group row form-group-marginless mt-5">
                                <div className={`${((title.includes('Nuevo')) && (form.periodo === false || form.periodo === '')) ? 'col-md-6' : (title.includes('Nuevo') && form.periodo === true) ? 'col-md-4' : (!title.includes('Nuevo')) ? 'd-none' : ''}`}>
                                    <SelectSearchGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        customdiv='mb-0'
                                        options={options.empleados}
                                        placeholder="SELECCIONA EL EMPLEADO"
                                        name="empleado"
                                        value={form.empleado}
                                        onChange={this.updateEmpleado}
                                        iconclass={"fas fa-user"}
                                        formeditado={formeditado}
                                        messageinc="Selecciona el empleado"
                                    />
                                </div>
                                <div className={`${(title.includes('Nuevo') && form.periodo === false) ? 'col-md-6' : (title.includes('Nuevo') && form.periodo === true) ? 'col-md-4' : (!title.includes('Nuevo') && form.periodo === false) ? 'col-md-12' : 'col-md-6'}`}>
                                    <div className="mx-auto w-fit-content">
                                        <label className="font-weight-bolder">Periodo del contrato</label>
                                        <div className="radio-list">
                                            <label className="radio radio-outline radio-primary">
                                                <input
                                                    type="radio"
                                                    name='periodo'
                                                    value={true}
                                                    onChange={onChangeContrato}
                                                    checked={form.periodo === true ? true : false}
                                                />
                                                <span></span>DÍAS</label>
                                            <label className="radio radio-outline radio-primary">
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
                                    <div className={`${(title.includes('Nuevo') && form.periodo === true) ? 'col-md-4' : 'col-md-6'}`}>
                                        <InputNumberGray
                                            withtaglabel = { 1 }
                                            withtextlabel = { 1 }
                                            withplaceholder = { 1 }
                                            withicon={1}
                                            requirevalidation={1}
                                            onChange={onChangeContrato}
                                            name="dias"
                                            type="text"
                                            value={form.dias}
                                            placeholder="DÍAS"
                                            iconclass="flaticon2-calendar-6"
                                            messageinc="Ingresa el número de días."
                                            formeditado={formeditado}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="separator separator-dashed mt-12 mb-10"></div>
                            <div className="row form-group-marginless">
                                <div className={`col-md-12 text-align-last-center align-self-center`}>
                                    <div className="text-center">
                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bolder">Fecha de contrato</label>
                                        </div>
                                        <CalendarDay date={form.fechaInicio} onChange={onChangeContrato} name='fechaInicio' requirevalidation={1} withformgroup={0} />
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <div className="form-group row form-group-marginless mt-8">
                            <div className="col-md-4 text-align-last-center align-self-center">
                                <label className="text-center font-weight-bolder text-bodymb-2">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar
                                    onChange={onChangeRange}
                                    start={form.fechaInicio}
                                    end={form.fechaFin}
                                />
                            </div>
                            <div className="col-md-8 align-self-center">
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            customdiv='mb-0'
                                            options={options.empleadosObra}
                                            placeholder="SELECCIONA EL EMPLEADO"
                                            name="empleado"
                                            value={form.empleado}
                                            onChange={this.updateEmpleado}
                                            iconclass={"fas fa-user"}
                                            formeditado={formeditado}
                                            messageinc="Selecciona el empleado"
                                        />
                                    </div>
                                    <div className="col-md-4">
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
                                            messageinc="Ingresa el periodo de pago."
                                            formeditado={formeditado}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            withtaglabel = { 1 }
                                            withtextlabel = { 1 }
                                            withplaceholder = { 1 }
                                            withicon={1}
                                            requirevalidation={1}
                                            onChange={onChangeContrato}
                                            name="pagos_hr_extra"
                                            type="text"
                                            value={form.pagos_hr_extra}
                                            placeholder="PAGOS DE HORA EXTRA "
                                            iconclass="far fa-money-bill-alt"
                                            messageinc="Ingresa el pago de hora extra."
                                            thousandseparator={true}
                                            formeditado={formeditado}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless pt-4">
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            withtaglabel = { 1 }
                                            withtextlabel = { 1 }
                                            withplaceholder = { 1 }
                                            withicon={1}
                                            requirevalidation={1}
                                            onChange={onChangeContrato}
                                            name="total_obra"
                                            type="text"
                                            value={form.total_obra}
                                            placeholder="TOTAL DE LA OBRA"
                                            iconclass="fas fa-dollar-sign"
                                            messageinc="Ingresa el total de la obra."
                                            thousandseparator={true}
                                            formeditado={formeditado}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            withtaglabel = { 1 }
                                            withtextlabel = { 1 }
                                            withplaceholder = { 1 }
                                            withicon={1}
                                            requirevalidation={1}
                                            onChange={onChangeContrato}
                                            name="dias"
                                            type="text"
                                            value={form.dias}
                                            placeholder="DÍAS DEL CONTRATO"
                                            iconclass="flaticon2-calendar-6"
                                            messageinc="Ingresa el número de días del contrato."
                                            formeditado={formeditado}
                                        />
                                    </div>
                                    <div className="col-md-4">
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
                                            messageinc="Ingresa el número de días laborables."
                                            formeditado={formeditado}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="row form-group-marginless pt-4">
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
                                            value={form.ubicacion_obra}
                                            placeholder="UBICACIÓN DE LA OBRA"
                                            iconclass="flaticon2-map"
                                            messageinc="Ingresa la ubicación de la obra."
                                            formeditado={formeditado}
                                        />
                                    </div>
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