import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import { Form } from 'react-bootstrap'
import { Button } from '../../form-components'
import { dayDMY } from '../../../functions/setters'
import { toAbsoluteUrl } from '../../../functions/routers'
import { apiOptions, catchErrors } from '../../../functions/api'
import { printResponseErrorAlert } from '../../../functions/alert'
class PrestacionesRHList extends Component {
    state = {
        prestaciones: [],
        form: {
            prestaciones: [{
                id: '',
                active: false,
                activeHistorial:false
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
        if (historial.pivot.fecha_activacion !== null && historial.pivot.fecha_cancelacion) {
            let activacionDate = dayDMY(historial.pivot.fecha_activacion)
            let cancelacionDate = dayDMY(historial.pivot.fecha_cancelacion)
            if (activacionDate === cancelacionDate) {
                return (
                    <div className="mb-2" key={index}>
                        <span className="svg-icon svg-icon-dark svg-icon-lg">
                            <SVG src={toAbsoluteUrl('/images/svg/Cross-circle.svg')} />
                        </span>
                        <span className="font-weight-bolder ml-2">{activacionDate}</span> - Se activó y canceló el mismo día
                    </div>
                )
            } else {
                return (
                    <div className="mb-2" key={index}>
                        <span className="svg-icon svg-icon-dark svg-icon-lg">
                            <SVG src={toAbsoluteUrl('/images/svg/Cross-circle.svg')} />
                        </span>
                        <span className="font-weight-bolder ml-2">Perido: </span> {activacionDate} - {cancelacionDate}
                    </div>
                )
            }
        } else {
            return (
                <div className="mb-2" key={index}>
                    <span className="svg-icon svg-icon-success svg-icon-lg">
                        <SVG src={toAbsoluteUrl('/images/svg/Done-circle.svg')} />
                    </span>
                    <span className="font-weight-bolder ml-2">Activado </span>- {dayDMY(historial.pivot.fecha_activacion)}
                </div>
            )
        }
    }

    onSubmit = (e) => {

    }
    showHistorial = (key) => {
        const { form } = this.state
        let box = document.getElementById(`div-historial-${key}`);
        if (box.classList.contains('d-none')) {
            box.classList.remove('d-none');
            setTimeout(function () { box.classList.remove('opacity-1'); }, 5);
            form.prestaciones[key].activeHistorial = true
        } else {
            box.classList.add('opacity-1');
            box.addEventListener('transitionend', function (e) {
                box.classList.add('d-none');
            },{
                capture: false,
                once: true,
                passive: false
            });
            form.prestaciones[key].activeHistorial = false
        }
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { prestaciones, form } = this.state
        return (
            <>
                {
                    prestaciones ?
                        <Form id='form-prestaciones' onSubmit={this.onSubmit}>
                            <div className="mt-5">
                                {
                                    prestaciones.map((prestacion, key) => {
                                        return (
                                            <div key={key}>
                                                <div className={`d-flex align-items-center py-5 ${key === prestaciones.length - 1 ? '' : 'border-bottom-dashed border-light-secondary'} `}>
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
                                                        <div className="text-gray-800 font-weight-bolder font-size-lg">{prestacion.nombre}</div>
                                                        <div class="font-size-sm text-muted align-self-center">
                                                            {
                                                                prestacion.active !== null ?
                                                                    <>ACTIVADO: <span class="text-success">{dayDMY(prestacion.active.pivot.fecha_activacion)}</span></>
                                                                    :
                                                                    <>DESACTIVADO</>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        prestacion.historial.length > 0 ?
                                                            <div class="btn btn-xs btn-light btn-clean px-2 py-2" onClick={() => { this.showHistorial(key) }}>
                                                                <span class="text-dark-50 font-weight-bolder font-size-sm">{form.prestaciones[key].activeHistorial?'OCULTAR':'VER'} HISTORIAL</span>
                                                            </div>
                                                            : <></>
                                                    }
                                                </div>
                                                {
                                                    prestacion.historial.length > 0 ?
                                                        <div className="bg-light px-4 pt-4 pb-2 transition-prestaciones opacity-1 d-none w-max-content mx-auto rounded" id={`div-historial-${key}`}>
                                                            {
                                                                prestacion.historial.map((historial, key2) => {
                                                                    return (
                                                                        this.getHistorial(historial, key2)
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        : <></>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="d-flex justify-content-center border-top mt-3 pt-3">
                                <Button only_icon='las la-save' className="btn btn-light-success btn-sm font-weight-bold" type='submit' text="Guardar" />
                            </div>
                        </Form>
                        : <></>
                }
            </>
        )
    }
}

export default PrestacionesRHList