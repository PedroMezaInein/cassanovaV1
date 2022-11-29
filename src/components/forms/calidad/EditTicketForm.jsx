import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { CalendarDay, Button, SelectSearchGray, InputGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
class EditTicketForm extends Component {
    isMantenimiento = () => {
        const { ticket } = this.props
        if(ticket.subarea){
            switch(ticket.subarea.nombre){
                case 'MANTENIMIENTO':
                case 'MANTENIMIENTO CORRECTIVO':
                case 'MANTENIMIENTO PREVENTIVO':
                    return true;
                default: break;
            }
        }
        return false;
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    updateSelect = (value, type) => {
        const { onChange } = this.props
        onChange({ target: { name: 'cliente', value: value } })
    }
    render() {
        const { form, onSubmit, formeditado, onChange, onChangeTicketMonto, options, handleChange, deleteFile, generateEmail, estatus, ticket, at, ...props } = this.props
        return (
            <div>
                {
                    <div className="row justify-content-center">    
                        <div className="col-md-12">
                            
                        <Form id= 'fechas' onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'fechas') } }{...props} >
                                <div>
                                    <div className="col-md-12">
                                        <SelectSearchGray
                                            formeditado={formeditado}
                                            options={options.nom_cliente}
                                            placeholder="SELECCIONA EL CLIENTE"
                                            name="nom_cliente"
                                            value={form.nom_cliente}
                                            onChange={this.updateSelect}
                                            iconclass="las la-swatchbook icon-2x"
                                            customdiv="mb-0"
                                            iconvalid={1}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon={1}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <InputGray
                                            formeditado={formeditado}
                                            placeholder="No. de Compra"
                                            name="num_compra"
                                            value={form.num_compra}
                                            onChange={onChange}
                                            iconclass="las la-shopping-cart icon-2x"
                                            customdiv="mb-0"
                                            iconvalid={1}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon={1}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <InputGray
                                            formeditado={formeditado}
                                            placeholder="Monto (con IVA)"
                                            name="orden_monto"
                                            value={form.orden_monto}
                                            onChange={onChangeTicketMonto}
                                            iconclass="las la-coins icon-2x"
                                            customdiv="mb-0"
                                            iconvalid={1}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon={1}
                                        />
                                    </div>
                                    <div className="col-md-6 text-center px-0 mt-3">
                                        <div className="calendar-tickets">
                                            <label className="text-center font-weight-bold text-dark-60 margin-top-">Fecha Autorizada</label>
                                            <CalendarDay value={form.fechaAutorizada} date={form.fechaAutorizada}
                                                onChange={onChange} name='fechaAutorizada' withformgroup={0}
                                                requirevalidation={0} />
                                        </div>
                                    </div>
                                </div>
                            <div className="border-top mt-3 pt-3">
                                <div className="row">
                                    <div className="col-lg-6 text-left">
                                    </div>
                                    <div className="col-lg-6 text-right">
                                        <div className="">
                                            <Button icon='' className="btn btn-light-primary font-weight-bold text-uppercase mr-2" text="GUARDAR"
                                                onClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(onSubmit, e, 'fechas')
                                                    }
                                                } />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                        </div>
                    </div>

                }
            </div>
        );
    }
}

export default EditTicketForm
