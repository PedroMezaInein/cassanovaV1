import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import { Form } from 'react-bootstrap'
import { dayDMY } from '../../../functions/setters'
import { toAbsoluteUrl } from '../../../functions/routers'
import { apiOptions, catchErrors } from '../../../functions/api'
import { printResponseErrorAlert } from '../../../functions/alert'
import { Button } from '../../form-components'

class PrestacionesRHList extends Component {
    state = {
        prestaciones: [],
        form: {
            prestaciones: [{
                id: '',
                active: false
            }],
        },
    }

    componentDidMount = () => {
        this.getPrestaciones()
    }
    getPrestaciones = async () => {
        const { at, empleado } = this.props
        apiOptions(`v2/rh/empleados/prestaciones/${empleado.id}`, at).then(
            (response) => {
                const { form } = this.state
                const { prestaciones } = response.data
                let aux = []
                prestaciones.forEach((prestacion) => {
                    aux.push({
                        id: prestacion.id,
                        active: prestacion.isActive ? true : false
                    })
                })
                form.prestaciones = aux
                this.setState({
                    ...this.state,
                    prestaciones: prestaciones
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    checkButton = (key, e) => {
        const { name, checked } = e.target
        const { form } = this.state
        form.prestaciones[key][name] = checked
        this.setState({ ...this.state, form })
    }
    getHistorial(historial, index){
        if(historial.pivot.fecha_activacion !== null && historial.pivot.fecha_cancelacion){
            let activacionDate = dayDMY(historial.pivot.fecha_activacion)
            let cancelacionDate = dayDMY(historial.pivot.fecha_cancelacion)
            if(activacionDate === cancelacionDate){
                return(
                    <div>
                        <span className="font-size-h6 text-success">
                            <span className="svg-icon svg-icon-dark svg-icon-lg">
                                <SVG src={toAbsoluteUrl('/images/svg/Cross-circle.svg')} />
                            </span>
                        </span> <span className="font-weight-bolder">{activacionDate}</span> - Se activó y canceló el mismo día 
                    </div>
                )
            }else{
                <div>
                    <span className="font-weight-bolder">Perido: </span> {activacionDate}
                </div>
            }
        }else{
            return(
                <div>
                    <span className="font-weight-bolder">Perido: </span>{dayDMY(historial.pivot.fecha_activacion)}
                </div>
            )
        }
    }

    onSubmit = (e) => {

    }
    render() {
        const { prestaciones, form } = this.state
        console.log(prestaciones, 'prestaciones')
        console.log(form, 'form')
        return (
            <>
                <Form id='form-prestaciones' onSubmit={ this.onSubmit }>
                    <div className="mt-5">
                        {
                            prestaciones.map((prestaciones, key) => {
                                return (
                                    <div key={key}>
                                        <div className={`d-flex align-items-center mb-8`}>
                                            <span className={`bullet bullet-vertical h-40px w-4px bg-${form.prestaciones[key].active ? 'success' : 'gray-300'}`}></span>
                                            <div className="d-flex align-items-center mx-4">
                                                <label className={`checkbox checkbox-lg checkbox-single checkbox-${form.prestaciones[key].active ? 'success' : 'light'}`}>
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => { this.checkButton(key, e) }}
                                                        name='active'
                                                        checked={form.prestaciones[key].active}
                                                        value={form.prestaciones[key].active}
                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="text-gray-800 font-weight-bolder font-size-lg">{prestaciones.nombre}</div>
                                                <div class="font-size-sm text-muted align-self-center">
                                                    {
                                                        prestaciones.active !== null ?
                                                            <>ACTIVADO: <span class="text-success">{dayDMY(prestaciones.active.pivot.fecha_activacion)}</span></>
                                                            :
                                                            <>DESACTIVADO</>
                                                    }
                                                </div>
                                            </div>
                                            {
                                                prestaciones.historial.length > 0 ?
                                                    <span className="badge badge-light-success fs-8 fw-bolder">btn</span>
                                                    : <></>
                                            }
                                        </div>
                                        {
                                            prestaciones.historial.length > 0 ?
                                                prestaciones.historial.map((historial, key2) => {
                                                    console.log(prestaciones, 'prestaciones')
                                                    return (
                                                        <div key={key2}>
                                                            {this.getHistorial(historial, key2)}
                                                        </div>
                                                    )
                                                })
                                                : <></>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    
                    <div className="d-flex justify-content-center border-top mt-3 pt-3 mx-4">
                        <Button only_icon='las la-save' className="btn btn-light-success btn-sm font-weight-bold" type='submit' text="Guardar" />
                    </div>
                </Form>
            </>
        )
    }
}

export default PrestacionesRHList