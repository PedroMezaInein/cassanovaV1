import React, { Component } from 'react'
import { InputNumberGray, RangeCalendar, ReactSelectSearch, TagSelectSearchGray } from '../../form-components'
import moment from 'moment';
import 'moment/locale/es';
import { Row, Col, Form } from 'react-bootstrap'
import { setLabelTable } from '../../../functions/setters'
import NumberFormat from 'react-number-format';
class TableMantenimiento extends Component {
    state={
        searchForm : false,
        rubros:[]
    }
    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }
    updateMantenimiento= value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'mantenimiento'}}, true)
    }
    updateEquipos= value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'equipo'}}, true)
    }
    updateEstatus= value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'estatus'}}, true)
    }
    
    updateRubro = value => {
        const { onChange, options, form } = this.props
        onChange({target: { value: value, name: 'rubro'}}, true)
        options.rubro.forEach((rubro) => {
            let valor
            if(form.rubro === null)
                valor = undefined
            else
                valor = value.find((element) => { return element.value === rubro.value })
            if(valor === undefined){
                if(rubro.value === 'fecha'){
                    onChange({target: { value: new Date(), name: 'fechaInicio'}}, true)
                    onChange({target: { value: new Date(), name: 'fechaFin'}}, true)
                }else{ onChange({target: { value: '', name: rubro.value}}, true) }
            }
        })
        let { rubros } = this.state
        let aux = []
        if(value !== null){ value.forEach((tipo) => { aux.push(tipo.label) }) }
        rubros = aux
        this.setState({ ...this.state, rubros })
    }

    searchForm () {
        const { searchForm } = this.state
        this.setState({ ...this.state, searchForm: !searchForm, })
    }

    getActive = value => {
        const { form } = this.props
        if(form.rubro === null)
            return false
        let flag = form.rubro.find((element) => {
            return element.value === value
        })
        if(flag)
            return true
        return false
    }

    filtrarTabla = () => {
        const { filtrarTabla } = this.props
        this.setState({...this.state, searchForm: false })
        filtrarTabla()
    }
    
    formatDay (fecha){
        let fecha_ticket = moment(fecha);
        let formatDate = fecha_ticket.locale('es').format("DD MMM YYYY");
        return formatDate.replace('.', '');
    }
    setMoneyTable(value) {
        let cantidad = 0
        cantidad = parseFloat(value).toFixed(2)
        return (
            <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={true} prefix={'$'}
                renderText={cantidad => <span> {cantidad} </span>} />
        )
    }
    clearForm = () => {
        const { cleanForm } = this.props
        this.setState({...this.state, searchForm: false })
        cleanForm()
    }
    render() {
        const { options, form, onChangeRange, onChange, mantenimientos } = this.props
        const { searchForm } = this.state
        return (
            <div>
                <Row>
                    <Col md="4" className={`bg-form rounded ${searchForm?'':'d-none'}`}>
                        <Form>
                            <div className="row form-group-marginless mx-0 mt-10">
                                <div className="col-md-12 mb-5">
                                    <TagSelectSearchGray placeholder = '¿QUÉ DESEAS FILTRAR?' options = { options.rubro } defaultvalue = { form.rubro }
                                        iconclass = 'las la-user-friends icon-xl' onChange = { this.updateRubro } bgcolor='#fff'/>
                                </div>
                                {
                                    this.getActive('tipo_mantenimiento') &&
                                        <div className="col-md-12 mb-5">
                                            <ReactSelectSearch placeholder = 'Selecciona el mantenimiento' defaultvalue = { form.mantenimiento } iconclass='las la-tools icon-xl'
                                                options = { this.transformarOptions(options.mantenimientos) } onChange = { this.updateMantenimiento } />
                                        </div>
                                }
                                {
                                    this.getActive('equipo') &&
                                        <div className="col-md-12 mb-5">
                                            <ReactSelectSearch placeholder = 'Selecciona el equipo' defaultvalue = { form.equipo } onChange = { this.updateEquipos }
                                                options = { this.transformarOptions(options.equipos) } iconclass='las la-desktop icon-xl' />
                                        </div>
                                }
                                {
                                    this.getActive('estatus') &&
                                        <div className="col-md-12 mb-5">
                                            <ReactSelectSearch placeholder = 'Selecciona el estatus' options = { this.transformarOptions(options.estatus) }
                                                defaultvalue = { form.estatus } onChange = { this.updateEstatus } iconclass='las la-check-circle icon-xl' />
                                        </div>
                                }
                                {
                                    this.getActive('costo') &&
                                        <div className="col-md-12 mb-5">
                                            <InputNumberGray withicon = { 1 } requirevalidation = { 0 } placeholder = "COSTO" value = { form.costo }
                                                name = "costo" onChange = { onChange } thousandseparator = { true }  customclass='bg-white '
                                                iconclass='las la-money-bill icon-xl' custom_gtext='bg-white' custom_inputg='bg-white border' />
                                        </div>
                                }
                                {
                                    this.getActive('fecha') &&
                                        <div className="col-md-12 text-center">
                                            <label className="col-form-label my-2 font-weight-bolder text-dark-60">Periodo del mantenimiento</label><br />
                                            <RangeCalendar onChange = { onChangeRange } start = { form.fechaInicio } end = { form.fechaFin } />
                                        </div>
                                }
                            </div>
                            {
                                form.rubro !== null ?
                                    form.rubro.length > 0 ?
                                        <div className="d-flex justify-content-center my-5" >
                                            <span className='btn btn-sm btn-transparent btn-hover-light-primary text-primary font-weight-bolder font-size-13px box-shadow-button' onClick={ (e) => { e.preventDefault(); this.filtrarTabla() } }>
                                                <i className="la la-filter icon-xl text-primary"></i> FILTRAR
                                            </span>
                                        </div>
                                    : ''
                                : ''
                            }
                        </Form>
                    </Col>
                    <Col md={`${searchForm?'8':'12'}`}>
                        <div className="tab-content ">
                            <div className="d-flex justify-content-end mb-10">
                                <span className='btn btn-sm btn-transparent btn-hover-light-info text-info font-weight-bolder font-size-13px box-shadow-button' onClick={(e) => { e.preventDefault(); this.searchForm() }}>
                                    <i className={`la ${searchForm?'la-search-minus':'la-search-plus'} icon-xl text-info`}></i> FILTRAR
                                </span>
                                <span className='btn btn-sm btn-transparent btn-hover-light-success text-success font-weight-bolder font-size-13px box-shadow-button ml-2' onClick={ (e) => { e.preventDefault(); this.clearForm() }}>
                                    <i className="la la-list icon-xl text-success"></i> LISTADO COMPLETO
                                </span>
                            </div>
                            <div className="table-responsive rounded">
                                <table className="table table-borderless table-vertical-center rounded table-hover" id="table-mantenimientos">
                                    <thead>
                                        <tr className="text-center text-proyecto">
                                            <th>Estatus</th>
                                            <th>Tipo de mantenimiento</th>
                                            <th>Equipo</th>
                                            <th style={{minWidth:'100px'}}>Fecha</th>
                                            <th>Costo</th>
                                            <th>Presupuesto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            mantenimientos.length === 0 &&
                                                <tr className="text-dark-75 font-weight-light text-center" >
                                                    <td colSpan = "6"> Sin mantenimientos </td>
                                                </tr>
                                        }
                                        {
                                            mantenimientos.map((mantenimiento, index) => {
                                                console.log(mantenimiento)
                                                return(
                                                    <tr className="text-dark-75 font-weight-light text-center" key = { index } >
                                                        <td>
                                                            {setLabelTable(mantenimiento.mantenimiento.status)}
                                                        </td>
                                                        <td> { mantenimiento.mantenimiento.tipo } </td>
                                                        <td> { mantenimiento.instalacion.equipo.equipo } </td>
                                                        <td> {this.formatDay(mantenimiento.mantenimiento.fecha )}</td>
                                                        <td> 
                                                            {this.setMoneyTable(mantenimiento.mantenimiento.costo)}
                                                        </td>
                                                        <td>
                                                            { 
                                                                mantenimiento.mantenimiento.cotizacion  ?
                                                                    <a href = { mantenimiento.mantenimiento.cotizacion } target = '_blank' rel="noopener noreferrer" className="btn btn-icon btn-white btn-hover-primary btn-sm ml-3" >
                                                                        <i className="la la-file-invoice-dollar text-primary icon-xl"></i>
                                                                    </a>
                                                                :    
                                                                <span>-</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default TableMantenimiento