import React, { Component } from 'react'
import { Form, Card } from 'react-bootstrap'
import { InputMoneySinText, InputNumberSinText, InputSinText, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import Moment from 'react-moment'
import ReactTooltip from 'react-tooltip/dist';

class ActualizarPresupuestoForm extends Component {
    
    state = {
        margen: 0
    }

    getTotalImport = () => {
        const { form } = this.props
        let aux = parseFloat(0);
        form.conceptos.map( (concepto) => {
            if(concepto.active)
                aux = aux + parseFloat(concepto.importe)
        })
        return aux.toFixed(2)
    }

    onChangeDesperdicio = e =>{
        const { value, name } = e.target
        const { form, onChange } = this.props
        console.log(value, 'value')
        if(value)
            form.conceptos.map( (concepto, key) => {
                if(concepto.active)
                    onChange(key, e, 'margen')
            })
        this.setState({
            ... this.state,
            margen: value
        })
    }

    getPartidaClave = clave => {
        let aux = clave.split('.')
        if(aux.length)
            return aux[0]
    }
    getSubpartidaClave = clave => {
        let aux = clave.split('.')
        if(aux.length)
            return aux[1]
    }

    getPartida = key => {
        const { presupuesto } = this.props
        if(key === 0)
            return true
        if(presupuesto.conceptos[key].concepto.subpartida.partida.id !== presupuesto.conceptos[key-1].concepto.subpartida.partida.id)
            return true
        return false
    }
    getSubpartida = key => {
        const { presupuesto } = this.props
        if(key === 0)
            return true
        if(presupuesto.conceptos[key].concepto.subpartida.id !== presupuesto.conceptos[key-1].concepto.subpartida.id)
            return true
        return false
    }

    render() {
        const { onChange, formeditado, checkButton, form, presupuesto, onSubmit} = this.props
        const { margen } = this.state
        if (presupuesto)
            return (
                <>
                    < Card className="card-custom" >
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <div className="list min-w-1000px" data-inbox="list">
                                    <div className="col-md-12 d-flex justify-content-center align-items-center list-item card-spacer-x py-4" data-inbox="message">
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24px"
                                                            height="24px"
                                                            viewBox="0 0 24 24"
                                                            version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24" />
                                                                <circle fill="#000000" opacity="0.3" cx="12" cy="9" r="8" />
                                                                <path
                                                                    d="M14.5297296,11 L9.46184488,11 L11.9758349,17.4645458 L14.5297296,11 Z M10.5679953,19.3624463 L6.53815512,9 L17.4702704,9 L13.3744964,19.3674279 L11.9759405,18.814912 L10.5679953,19.3624463 Z"
                                                                    fill="#000000"
                                                                    fillRule="nonzero"
                                                                    opacity="0.3" />
                                                                <path
                                                                    d="M10,22 L14,22 L14,22 C14,23.1045695 13.1045695,24 12,24 L12,24 C10.8954305,24 10,23.1045695 10,22 Z"
                                                                    fill="#000000"
                                                                    opacity="0.3" />
                                                                <path
                                                                    d="M9,20 C8.44771525,20 8,19.5522847 8,19 C8,18.4477153 8.44771525,18 9,18 C8.44771525,18 8,17.5522847 8,17 C8,16.4477153 8.44771525,16 9,16 L15,16 C15.5522847,16 16,16.4477153 16,17 C16,17.5522847 15.5522847,18 15,18 C15.5522847,18 16,18.4477153 16,19 C16,19.5522847 15.5522847,20 15,20 C15.5522847,20 16,20.4477153 16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 C8,20.4477153 8.44771525,20 9,20 Z"
                                                                    fill="#000000" />
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">{presupuesto.proyecto.nombre}</div>
                                                <span className="text-muted">Proyecto</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24px"
                                                            height="24px"
                                                            viewBox="0 0 24 24"
                                                            version="1.1">
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
                                                <div className="text-dark mb-1">{presupuesto.area.nombre}</div>
                                                <span className="text-muted">ÁREA</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24px"
                                                            height="24px"
                                                            viewBox="0 0 24 24"
                                                            version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24" />
                                                                <path
                                                                    d="M13.5,21 L13.5,18 C13.5,17.4477153 13.0522847,17 12.5,17 L11.5,17 C10.9477153,17 10.5,17.4477153 10.5,18 L10.5,21 L5,21 L5,4 C5,2.8954305 5.8954305,2 7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,21 L13.5,21 Z M9,4 C8.44771525,4 8,4.44771525 8,5 L8,6 C8,6.55228475 8.44771525,7 9,7 L10,7 C10.5522847,7 11,6.55228475 11,6 L11,5 C11,4.44771525 10.5522847,4 10,4 L9,4 Z M14,4 C13.4477153,4 13,4.44771525 13,5 L13,6 C13,6.55228475 13.4477153,7 14,7 L15,7 C15.5522847,7 16,6.55228475 16,6 L16,5 C16,4.44771525 15.5522847,4 15,4 L14,4 Z M9,8 C8.44771525,8 8,8.44771525 8,9 L8,10 C8,10.5522847 8.44771525,11 9,11 L10,11 C10.5522847,11 11,10.5522847 11,10 L11,9 C11,8.44771525 10.5522847,8 10,8 L9,8 Z M9,12 C8.44771525,12 8,12.4477153 8,13 L8,14 C8,14.5522847 8.44771525,15 9,15 L10,15 C10.5522847,15 11,14.5522847 11,14 L11,13 C11,12.4477153 10.5522847,12 10,12 L9,12 Z M14,12 C13.4477153,12 13,12.4477153 13,13 L13,14 C13,14.5522847 13.4477153,15 14,15 L15,15 C15.5522847,15 16,14.5522847 16,14 L16,13 C16,12.4477153 15.5522847,12 15,12 L14,12 Z"
                                                                    fill="#000000" />
                                                                <rect fill="#FFFFFF" x="13" y="8" width="3" height="3" rx="1" />
                                                                <path
                                                                    d="M4,21 L20,21 C20.5522847,21 21,21.4477153 21,22 L21,22.4 C21,22.7313708 20.7313708,23 20.4,23 L3.6,23 C3.26862915,23 3,22.7313708 3,22.4 L3,22 C3,21.4477153 3.44771525,21 4,21 Z"
                                                                    fill="#000000"
                                                                    opacity="0.3" />
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">{presupuesto.empresa.name}</div>
                                                <span className="text-muted">Empresa</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24px"
                                                            height="24px"
                                                            viewBox="0 0 24 24"
                                                            version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24" />
                                                                <path
                                                                    d="M12,22 C7.02943725,22 3,17.9705627 3,13 C3,8.02943725 7.02943725,4 12,4 C16.9705627,4 21,8.02943725 21,13 C21,17.9705627 16.9705627,22 12,22 Z"
                                                                    fill="#000000"
                                                                    opacity="0.3" />
                                                                <path
                                                                    d="M11.9630156,7.5 L12.0475062,7.5 C12.3043819,7.5 12.5194647,7.69464724 12.5450248,7.95024814 L13,12.5 L16.2480695,14.3560397 C16.403857,14.4450611 16.5,14.6107328 16.5,14.7901613 L16.5,15 C16.5,15.2109164 16.3290185,15.3818979 16.1181021,15.3818979 C16.0841582,15.3818979 16.0503659,15.3773725 16.0176181,15.3684413 L11.3986612,14.1087258 C11.1672824,14.0456225 11.0132986,13.8271186 11.0316926,13.5879956 L11.4644883,7.96165175 C11.4845267,7.70115317 11.7017474,7.5 11.9630156,7.5 Z"
                                                                    fill="#000000" />
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">{presupuesto.tiempo_ejecucion}</div>
                                                <span className="text-muted">Tiempo de ejecución</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24px"
                                                            height="24px"
                                                            viewBox="0 0 24 24"
                                                            version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24" />
                                                                <rect fill="#000000" x="4" y="5" width="16" height="3" rx="1.5" />
                                                                <path
                                                                    d="M5.5,15 L18.5,15 C19.3284271,15 20,15.6715729 20,16.5 C20,17.3284271 19.3284271,18 18.5,18 L5.5,18 C4.67157288,18 4,17.3284271 4,16.5 C4,15.6715729 4.67157288,15 5.5,15 Z M5.5,10 L18.5,10 C19.3284271,10 20,10.6715729 20,11.5 C20,12.3284271 19.3284271,13 18.5,13 L5.5,13 C4.67157288,13 4,12.3284271 4,11.5 C4,10.6715729 4.67157288,10 5.5,10 Z"
                                                                    fill="#000000"
                                                                    opacity="0.3" />
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">
                                                    <Moment format="DD/MM/YYYY">
                                                        {presupuesto.fecha}
                                                    </Moment>
                                                </div>
                                                <span className="text-muted">Fecha</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24px"
                                                            height="24px"
                                                            viewBox="0 0 24 24"
                                                            version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <polygon points="0 0 24 0 24 24 0 24"/>
                                                                <path d="M4.85714286,1 L11.7364114,1 C12.0910962,1 12.4343066,1.12568431 12.7051108,1.35473959 L17.4686994,5.3839416 C17.8056532,5.66894833 18,6.08787823 18,6.52920201 L18,19.0833333 C18,20.8738751 17.9795521,21 16.1428571,21 L4.85714286,21 C3.02044787,21 3,20.8738751 3,19.0833333 L3,2.91666667 C3,1.12612489 3.02044787,1 4.85714286,1 Z M8,12 C7.44771525,12 7,12.4477153 7,13 C7,13.5522847 7.44771525,14 8,14 L15,14 C15.5522847,14 16,13.5522847 16,13 C16,12.4477153 15.5522847,12 15,12 L8,12 Z M8,16 C7.44771525,16 7,16.4477153 7,17 C7,17.5522847 7.44771525,18 8,18 L11,18 C11.5522847,18 12,17.5522847 12,17 C12,16.4477153 11.5522847,16 11,16 L8,16 Z" fill="#000000" fillRule="nonzero" opacity="0.3"/>
                                                                <path d="M6.85714286,3 L14.7364114,3 C15.0910962,3 15.4343066,3.12568431 15.7051108,3.35473959 L20.4686994,7.3839416 C20.8056532,7.66894833 21,8.08787823 21,8.52920201 L21,21.0833333 C21,22.8738751 20.9795521,23 19.1428571,23 L6.85714286,23 C5.02044787,23 5,22.8738751 5,21.0833333 L5,4.91666667 C5,3.12612489 5.02044787,3 6.85714286,3 Z M8,12 C7.44771525,12 7,12.4477153 7,13 C7,13.5522847 7.44771525,14 8,14 L15,14 C15.5522847,14 16,13.5522847 16,13 C16,12.4477153 15.5522847,12 15,12 L8,12 Z M8,16 C7.44771525,16 7,16.4477153 7,17 C7,17.5522847 7.44771525,18 8,18 L11,18 C11.5522847,18 12,17.5522847 12,17 C12,16.4477153 11.5522847,16 11,16 L8,16 Z" fill="#000000" fillRule="nonzero"/>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">
                                                    No.1
                                                </div>
                                                <span className="text-muted">Presupuesto</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="mt-4 card-custom">
                        <Card.Header>
                            <div className="card-title">
                                <h3 className="card-label">Presupuesto</h3>
                            </div>
                        </Card.Header>

                        <Card.Body className="pt-2">
                            <Form id="form-presupuesto"
                                    onSubmit={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(onSubmit, e, 'form-presupuesto')
                                        }
                                    }
                                >
                                <table className="table table-separate table-responsive-sm">
                                    <thead>
                                        <tr>
                                            <th className="check_desc border-0">
                                                <div className="font-size-sm text-center"></div>
                                            </th>
                                            <th className="clave border-0">
                                                <div className="font-size-sm text-center">Clave</div>
                                            </th>
                                            <th className="descripcion border-0">
                                                <div className="font-size-sm text-center">Descripción</div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center">Unidad</div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center">Costo</div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center">% Margen</div>
                                                <div>
                                                    <InputNumberSinText
                                                        identificador = { "margen-global" }
                                                        requirevalidation = { 0 }
                                                        formeditado = { 1 }
                                                        name = " margen "
                                                        value = { margen }
                                                        onChange = { this.onChangeDesperdicio }
                                                        thousandSeparator = { true }
                                                        prefix = { '%' } />
                                                </div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center">Cantidad</div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center">Precio Unitario</div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center">Importe</div>
                                                <div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm text-center">
                                                    {
                                                        setMoneyTableForNominas(this.getTotalImport())
                                                    }
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            presupuesto.conceptos.map((concepto, key) => {
                                                return (
                                                    <>
                                                        {
                                                            concepto.mensaje ?                                                         
                                                                <ReactTooltip id = { key + '-th' } type = 'warning'>
                                                                    <div>
                                                                        {
                                                                            concepto.user_comentario ?
                                                                                <b>
                                                                                    {
                                                                                        concepto.user_comentario.name
                                                                                    }
                                                                                </b>
                                                                            : ''
                                                                        }
                                                                        <br/>
                                                                        {
                                                                            concepto.mensaje
                                                                        }
                                                                    </div>
                                                                </ReactTooltip>
                                                            : ''
                                                        }
                                                        {
                                                            this.getPartida(key)?
                                                                <tr>
                                                                    <td colSpan={9} className="bg-primary-o-20 text-primary font-size-lg font-weight-bolder border-0 ">
                                                                        <b className="font-weight-boldest text-primary font-size-h6">
                                                                        {
                                                                            this.getPartidaClave(concepto.concepto.clave)
                                                                        }
                                                                        </b>
                                                                        &nbsp;&nbsp; 
                                                                            {
                                                                                concepto.concepto ? 
                                                                                    concepto.concepto.subpartida ?
                                                                                        concepto.concepto.subpartida.partida ?
                                                                                            concepto.concepto.subpartida.partida.nombre
                                                                                        : ''
                                                                                    : ''
                                                                                : ''
                                                                            } 
                                                                    </td>
                                                                </tr>
                                                            :
                                                                ''
                                                        }
                                                        {
                                                            this.getSubpartida(key)?
                                                                <tr>
                                                                    <td colSpan={9} className="font-size-lg font-weight-bolder">
                                                                        <b  className="font-size-h6 label label-light-primary label-pill label-inline mr-2 font-weight-bolder label-rounded">
                                                                        {
                                                                            this.getPartidaClave(concepto.concepto.clave)
                                                                        }
                                                                        .
                                                                        {
                                                                            this.getSubpartidaClave(concepto.concepto.clave)
                                                                        }
                                                                        </b>
                                                                        &nbsp;
                                                                        {
                                                                            concepto.concepto ? 
                                                                                concepto.concepto.subpartida ?
                                                                                    concepto.concepto.subpartida.nombre
                                                                                : ''
                                                                            : ''
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            :
                                                                ''
                                                        }
                                                        <tr data-tip data-for = { key + '-th' } className = { form.conceptos[key].active ? 'concepto-active' : 'concepto-inactive bg-light-primary' } key = { key }>
                                                            <td className="check_desc text-center">
                                                                <label
                                                                    data-inbox="group-select"
                                                                    className="checkbox checkbox-single checkbox-primary mr-3">
                                                                    <input
                                                                        name='active'
                                                                        type="checkbox"
                                                                        onChange={(e) => { checkButton(key, e) }}
                                                                        checked={form.conceptos[key].active}
                                                                        value={form.conceptos[key].active} />
                                                                    <span className="symbol-label"></span>
                                                                </label>
                                                            </td>
                                                            <td className="clave text-center">
                                                                <div className="font-weight-bold font-size-sm">{concepto.concepto.clave}</div>
                                                            </td>

                                                            <td className="descripcion text-center">
                                                                <InputSinText
                                                                    identificador={"descipcion"}
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="descipcion"
                                                                    rows="3"
                                                                    as="textarea"
                                                                    value={form['conceptos'][key]['descripcion']}
                                                                    onChange={(e) => { onChange(key, e, 'descripcion')} } 
                                                                    disabled = { !form.conceptos[key].active }
                                                                    />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{concepto.concepto.unidad.nombre}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <InputMoneySinText identificador={"costo"}
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="costo"
                                                                    value={form['conceptos'][key]['costo']}
                                                                    onChange={e => onChange(key, e, 'costo')}
                                                                    thousandSeparator={true}
                                                                    typeformat="###########" 
                                                                    disabled = { !form.conceptos[key].active } />
                                                            </td>
                                                            <td className="text-center">
                                                                <InputNumberSinText
                                                                    identificador={"margen" + key}
                                                                    requirevalidation={0}
                                                                    formeditado={formeditado}
                                                                    name="margen"
                                                                    value={form['conceptos'][key]['margen']}
                                                                    onChange={e => onChange(key, e, 'margen')}
                                                                    thousandSeparator={true}
                                                                    prefix={'%'} 
                                                                    disabled = { !form.conceptos[key].active }
                                                                    />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['cantidad']}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['precio_unitario']}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['importe']}</div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="mt-3 text-center">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR Y GENERAR PDF" />
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </>
            )
        else
            return (
                <>
                </>
            )
    }
}

export default ActualizarPresupuestoForm