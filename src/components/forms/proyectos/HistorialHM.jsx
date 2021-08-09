import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { validateAlert } from '../../../functions/alert';
import { setMinFechaTexto } from '../../../functions/functions';
import { Button, InputCantidad } from '../../form-components'

class HistorialHM extends Component {

    state = {
        datos: []
    }

    componentDidMount = () => {
        const { data } = this.props
        let aux = []
        data.prestamos.forEach((prestamo) => {
            aux.push({
                tipo: 'prestamo',
                fecha: prestamo.fecha,
                dato: prestamo
            })
        })
        data.entradas.forEach((entrada) => {
            aux.push({
                tipo: 'entrada',
                fecha: entrada.fecha,
                dato: entrada
            })
        })
        aux.sort(function (a, b) {
            if (a.fecha < b.fecha) {
                return 1;
            }
            if (a.fecha > b.fecha) {
                return -1;
            }
            return 0;
        });
        this.setState({ ...this.state, datos: aux })
    }

    componentDidUpdate = prevProps => {
        if(this.props.data.entradas.length !== prevProps.data.entradas.length){
            const { data } = this.props
            let aux = []
            data.prestamos.forEach((prestamo) => {
                aux.push({
                    tipo: 'prestamo',
                    fecha: prestamo.fecha,
                    dato: prestamo
                })
            })
            data.entradas.forEach((entrada) => {
                aux.push({
                    tipo: 'entrada',
                    fecha: entrada.fecha,
                    dato: entrada
                })
            })
            aux.sort(function (a, b) {
                if (a.fecha < b.fecha) {
                    return 1;
                }
                if (a.fecha > b.fecha) {
                    return -1;
                }
                return 0;
            });
            this.setState({ ...this.state, datos: aux })
        }
    }

    setProyecto = dato => {
        if(dato.dato){
            if(dato.dato.proyecto){
                return dato.dato.proyecto.nombre
            }
        }
        return ''
    }

    setCantidad = dato => {
        if(dato.tipo === 'prestamo'){
            return dato.dato.cantidad + ' / ' + dato.dato.sumDevoluciones
        }else{ return dato.dato.cantidad }
    }
    
    render() {
        const { form, onChange, onSubmit } = this.props
        const { datos } = this.state
        return (
            <div>
                <Form onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'wizard-3-content') } }>
                    <div className="form-group row form-group-marginless mx-0 mt-2 justify-content-center">
                        <div className="col-md-4">
                            <InputCantidad requirevalidation = { 1 } placeholder = "INGRESA LA CANTIDAD" type = "text" name = "cantidad"
                                value = { form.cantidad } onChange = { onChange } messageinc = "Incorrecto. Ingresa la cantidad."
                                customlabel = "font-weight-bold text-dark-60" customclass = "text-dark-50 font-weight-bold" />
                        </div>
                        {
                            form.cantidad > 0 ?
                                <div className="col-md-2 d-flex align-self-end place-content-center mt-5">
                                    <Button icon='' text='ENVIAR' onClick={(e) => { e.preventDefault(); onSubmit(e) }} className="btn btn-bg-light btn-icon-info btn-hover-light-success text-success font-weight-bolder font-size-13px"/>
                                </div>
                            :<></>
                        }
                    </div>
                </Form>
                <div className="row justify-content-center">
                    <div className="timeline timeline-historial mt-3 d-inline-block">
                        {
                            datos.map((dato) => {
                                console.log(`Dato`, dato)
                                return(
                                    <div className="timeline-item align-items-start">
                                        <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg"> { setMinFechaTexto(dato.fecha) } </div>
                                        <div className="timeline-badge">
                                            <i className={`fa fa-genderless icon-xl ${dato.tipo === 'prestamo' ? 'text-primary' : 'text-info'}`} />
                                        </div>
                                        <div className="timeline-content">
                                            <div className="font-weight-bolder font-size-h6 text-dark-75">
                                                {
                                                    dato.tipo === 'prestamo'
                                                        ? this.setProyecto(dato)
                                                        : 'Compra'
                                                }
                                            </div>
                                            <div className="font-weight-normal font-size-lg text-muted">
                                                CANTIDAD: <u>{this.setCantidad(dato)}</u>
                                            </div>            
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default HistorialHM;