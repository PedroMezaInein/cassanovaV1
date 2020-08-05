import React, { Component } from 'react'
import { Form, Accordion, Card } from 'react-bootstrap'
import { SelectSearchSinText, InputMoneySinText, InputNumberSinText,InputSinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'
import ReactTooltip from "react-tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { setMoneyTable } from '../../../functions/setters'
import { setMoneyTableForNominas } from '../../../functions/setters'

class ActualizarPresupuestoForm extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateArea = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'area' } })
    }

    updatePartida = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'partida' } })
        onChange({ target: { value: '', name: 'subpartida' } })

        const { options: { partidas: partidas } } = this.props
        const aux = partidas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subpartidas', element.subpartidas)
            }
        })
    }

    updateSubpartida = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'subpartida' } })
    }

    mostrarFormulario() {
        var element = document.getElementById("form-presupuesto");
        if (element.style.display === "none") {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, data, checkButton } = this.props
        return (
            <>
                <Card className="card-custom">
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <div className="list list-hover min-w-500px" data-inbox="list">
                                <div className="d-flex align-items-start list-item card-spacer-x py-4" data-inbox="message">

                                    <div className="d-flex align-items-center mr-5">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <circle fill="#000000" opacity="0.3" cx="12" cy="9" r="8" />
                                                            <path d="M14.5297296,11 L9.46184488,11 L11.9758349,17.4645458 L14.5297296,11 Z M10.5679953,19.3624463 L6.53815512,9 L17.4702704,9 L13.3744964,19.3674279 L11.9759405,18.814912 L10.5679953,19.3624463 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                                                            <path d="M10,22 L14,22 L14,22 C14,23.1045695 13.1045695,24 12,24 L12,24 C10.8954305,24 10,23.1045695 10,22 Z" fill="#000000" opacity="0.3" />
                                                            <path d="M9,20 C8.44771525,20 8,19.5522847 8,19 C8,18.4477153 8.44771525,18 9,18 C8.44771525,18 8,17.5522847 8,17 C8,16.4477153 8.44771525,16 9,16 L15,16 C15.5522847,16 16,16.4477153 16,17 C16,17.5522847 15.5522847,18 15,18 C15.5522847,18 16,18.4477153 16,19 C16,19.5522847 15.5522847,20 15,20 C15.5522847,20 16,20.4477153 16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 C8,20.4477153 8.44771525,20 9,20 Z" fill="#000000" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column font-weight-bold">
                                            <a href="#" className="text-dark text-hover-primary mb-1 font-size-lg">ROCCO - PROYECTO MV</a>
                                            <span className="text-muted">Proyecto</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mx-5">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <rect fill="#000000" x="2" y="5" width="19" height="4" rx="1" />
                                                            <rect fill="#000000" opacity="0.3" x="2" y="11" width="19" height="10" rx="1" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column font-weight-bold">
                                            <a href="#" className="text-dark text-hover-primary mb-1 font-size-lg">Ricky Hunt</a>
                                            <span className="text-muted">ÁREA</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mx-5">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-primary svg-icon-2x">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <path d="M13.5,21 L13.5,18 C13.5,17.4477153 13.0522847,17 12.5,17 L11.5,17 C10.9477153,17 10.5,17.4477153 10.5,18 L10.5,21 L5,21 L5,4 C5,2.8954305 5.8954305,2 7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,21 L13.5,21 Z M9,4 C8.44771525,4 8,4.44771525 8,5 L8,6 C8,6.55228475 8.44771525,7 9,7 L10,7 C10.5522847,7 11,6.55228475 11,6 L11,5 C11,4.44771525 10.5522847,4 10,4 L9,4 Z M14,4 C13.4477153,4 13,4.44771525 13,5 L13,6 C13,6.55228475 13.4477153,7 14,7 L15,7 C15.5522847,7 16,6.55228475 16,6 L16,5 C16,4.44771525 15.5522847,4 15,4 L14,4 Z M9,8 C8.44771525,8 8,8.44771525 8,9 L8,10 C8,10.5522847 8.44771525,11 9,11 L10,11 C10.5522847,11 11,10.5522847 11,10 L11,9 C11,8.44771525 10.5522847,8 10,8 L9,8 Z M9,12 C8.44771525,12 8,12.4477153 8,13 L8,14 C8,14.5522847 8.44771525,15 9,15 L10,15 C10.5522847,15 11,14.5522847 11,14 L11,13 C11,12.4477153 10.5522847,12 10,12 L9,12 Z M14,12 C13.4477153,12 13,12.4477153 13,13 L13,14 C13,14.5522847 13.4477153,15 14,15 L15,15 C15.5522847,15 16,14.5522847 16,14 L16,13 C16,12.4477153 15.5522847,12 15,12 L14,12 Z" fill="#000000" />
                                                            <rect fill="#FFFFFF" x="13" y="8" width="3" height="3" rx="1" />
                                                            <path d="M4,21 L20,21 C20.5522847,21 21,21.4477153 21,22 L21,22.4 C21,22.7313708 20.7313708,23 20.4,23 L3.6,23 C3.26862915,23 3,22.7313708 3,22.4 L3,22 C3,21.4477153 3.44771525,21 4,21 Z" fill="#000000" opacity="0.3" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column font-weight-bold">
                                            <a href="#" className="text-dark text-hover-primary mb-1 font-size-lg">Ricky Hunt</a>
                                            <span className="text-muted">Empresa</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mx-5">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-primary svg-icon-2x">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <path d="M12,22 C7.02943725,22 3,17.9705627 3,13 C3,8.02943725 7.02943725,4 12,4 C16.9705627,4 21,8.02943725 21,13 C21,17.9705627 16.9705627,22 12,22 Z" fill="#000000" opacity="0.3" />
                                                            <path d="M11.9630156,7.5 L12.0475062,7.5 C12.3043819,7.5 12.5194647,7.69464724 12.5450248,7.95024814 L13,12.5 L16.2480695,14.3560397 C16.403857,14.4450611 16.5,14.6107328 16.5,14.7901613 L16.5,15 C16.5,15.2109164 16.3290185,15.3818979 16.1181021,15.3818979 C16.0841582,15.3818979 16.0503659,15.3773725 16.0176181,15.3684413 L11.3986612,14.1087258 C11.1672824,14.0456225 11.0132986,13.8271186 11.0316926,13.5879956 L11.4644883,7.96165175 C11.4845267,7.70115317 11.7017474,7.5 11.9630156,7.5 Z" fill="#000000" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column font-weight-bold">
                                            <a href="#" className="text-dark text-hover-primary mb-1 font-size-lg">Ricky Hunt</a>
                                            <span className="text-muted">Tiempo de ejecución</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mx-5">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-primary svg-icon-2x"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24" />
                                                        <rect fill="#000000" x="4" y="5" width="16" height="3" rx="1.5" />
                                                        <path d="M5.5,15 L18.5,15 C19.3284271,15 20,15.6715729 20,16.5 C20,17.3284271 19.3284271,18 18.5,18 L5.5,18 C4.67157288,18 4,17.3284271 4,16.5 C4,15.6715729 4.67157288,15 5.5,15 Z M5.5,10 L18.5,10 C19.3284271,10 20,10.6715729 20,11.5 C20,12.3284271 19.3284271,13 18.5,13 L5.5,13 C4.67157288,13 4,12.3284271 4,11.5 C4,10.6715729 4.67157288,10 5.5,10 Z" fill="#000000" opacity="0.3" />
                                                    </g>
                                                </svg></span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column font-weight-bold">
                                            <a href="#" className="text-dark text-hover-primary mb-1 font-size-lg">Ricky Hunt</a>
                                            <span className="text-muted">Fecha</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Header>
                        <h4 className="text-dark m-0">Actualización</h4>
                    </Card.Header>
                    <Card.Body>
                        <table className="table table-separate table-responsive-sm pt-5">
                            <thead>
                                <tr>
                                    <th className="check_desc " rowSpan="2"><div className="mt-2 pb-3 font-size-sm"></div></th>
                                    <th className="clave" rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Clave</div></th>
                                    <th className="descripcion" rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Descripción</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Unidad</div></th>                                     
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Costo</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Cantidad Preliminar</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">% Despercicio</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Cantidad</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Importe</div></th>
                                    
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td className="check_desc text-center">
                                        <label data-inbox="group-select" className="checkbox checkbox-single checkbox-primary mr-3">
                                            <input
                                                type="checkbox"
                                            />
                                            <span className="symbol-label"></span>
                                        </label> 
                                    </td>
                                    <td className="clave text-center">
                                        <div class="font-weight-bold font-size-sm">27.1.5</div>
                                    </td>
                                    <td className="descripcion text-center">
                                        <InputSinText
                                            identificador={"descipcion"}
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="descipcion"
                                            rows="3"
                                            as="textarea"
                                            value={"form['nominasObra'][key]['descipcion']"}
                                            onChange={"e => onChangeNominasObra(key, e, 'descipcion')"}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <div class="font-weight-bold font-size-sm">EQUIPO</div>
                                    </td>
                                    <td className="text-center">
                                        <InputMoneySinText
                                            identificador={"costo"}
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="costo"
                                            value={"form['nominasObra'][key]['costo']"}
                                            onChange={"e => onChangeNominasObra(key, e, 'costo')"}
                                            thousandSeparator={true}
                                            typeformat="###########"
                                        />
                                    </td>
                                    <td className="text-center">
                                        <InputMoneySinText
                                            identificador={"cantidad_preeliminar"}
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="cantidad_preeliminar"
                                            value={"form['nominasObra'][key]['cantidad_preeliminar']"}
                                            onChange={"e => onChangeNominasObra(key, e, 'cantidad_preeliminar')"}
                                            thousandSeparator={true}
                                            typeformat="###########"
                                        />
                                    </td>
                                    <td className="text-center">
                                        <InputNumberSinText
                                            identificador={"desperdicio"}
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="desperdicio"
                                            value={"form['nominasObra'][key]['desperdicio']"}
                                            onChange={"e => onChangeNominasObra(key, e, 'desperdicio')"}
                                            thousandSeparator={true}
                                            prefix={'%'}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <div class="font-weight-bold font-size-sm">237823</div>
                                    </td>
                                    <td className="text-center">
                                        <div class="font-weight-bold font-size-sm">28928932</div>
                                    </td>
                                    
                                </tr>
                            </tbody>
                        </table>
                    </Card.Body>
                </Card>
            </>


        )
    }
}

export default ActualizarPresupuestoForm