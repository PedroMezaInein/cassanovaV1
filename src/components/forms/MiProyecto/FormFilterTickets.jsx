import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { TagSelectSearchGray, RangeCalendar, ReactSelectSearch, InputGray } from '../../form-components'

class FormFilterTickets extends Component {
    state={
        optionsFilter:[]
    }
    
    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }
    updateRubro = value => {
        const { onChange, options, form } = this.props
        onChange({target: { value: value, name: 'filter'}}, 'filterTickets', true)
        if(value !== null){
            options.filterTickets.forEach((option) => {
                let valor
                if(form.filter === null){
                    valor = undefined
                }else{
                    valor = value.find((element) => { return element.value === option.value })
                }
                if(valor === undefined){
                    if(option.value === 'fecha'){
                        onChange({target: { value: new Date(), name: 'fechaInicio'}}, 'filterTickets', true)
                        onChange({target: { value: new Date(), name: 'fechaFin'}}, 'filterTickets', true)
                    }else{ onChange({target: { value: '', name: option.value}}, 'filterTickets', true) }
                }
            })
            let { optionsFilter } = this.state
            let aux = []
            if(value !== null){ value.forEach((tipo) => { aux.push(tipo.label) }) }
            optionsFilter = aux
            this.setState({ ...this.state, optionsFilter })
        }
    }
    
    updateEstatus= value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'estatus'}}, 'filterTickets', true)
    }
    
    updateTipoTrabajo = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'tipo_trabajo'}}, 'filterTickets', true)
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'proyecto'}}, 'filterTickets', true)
    }
    onChange = (e) => {
        const { name, value } = e.target
        const { onChange } = this.props
        onChange({target: { value: value, name: name}}, 'filterTickets')
    }

    getActive = value => {
        const { form } = this.props
        if(form.filter === null){
            return false
        }else{
            let flag = form.filter.find((element) => { return element.value === value })
            if(flag){
                return true
            }
        }
        return false
    }

    render() {
        const { onSubmit, options, form, onChangeRange, tipoTickets } = this.props
        return (
            <Form>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <TagSelectSearchGray placeholder = '¿QUÉ DESEAS FILTRAR?' options = { options.filterTickets } defaultvalue = { form.filter }
                            iconclass = 'las la-user-friends icon-xl' onChange = { this.updateRubro } bgcolor='#fff'/>
                    </div>
                    {
                        this.getActive('proyecto') && tipoTickets==='all'?
                            <div className="col-md-12 mb-5">
                                <ReactSelectSearch placeholder = 'Selecciona el proyecto' defaultvalue = { form.tipo_trabajo } iconclass='las la-folder icon-xl'
                                    options = { this.transformarOptions(options.proyectos) } onChange = { this.updateProyecto } />
                            </div>
                        :<></>
                    }
                    {
                        this.getActive('estatus') &&
                        <div className="col-md-12 mb-5">
                            <ReactSelectSearch placeholder='Selecciona el estatus' options={this.transformarOptions(options.estatus)}
                                defaultvalue={form.estatus} onChange={this.updateEstatus} iconclass='las la-check-circle icon-xl' />
                        </div>
                    }
                    {
                        this.getActive('tipo_trabajo') &&
                            <div className="col-md-12 mb-5">
                                <ReactSelectSearch placeholder = 'Selecciona el tipo de trabajo' defaultvalue = { form.tipo_trabajo } iconclass='las la-tools icon-xl'
                                    options = { this.transformarOptions(options.tiposTrabajo) } onChange = { this.updateTipoTrabajo } />
                            </div>
                    }
                    {
                        this.getActive('descripcion') &&
                        <div className="col-md-12 mb-5">
                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} requirevalidation={0}
                                placeholder="DESCRIPCIÓN" value={form.descripcion} name="descripcion" onChange = { (value) => this.onChange(value)} thousandseparator={true}
                                customclass='bg-white' iconclass='las la-money-bill icon-xl' custom_gtext='bg-white' inputsolid='bg-white border' />
                        </div>
                    }
                    {
                        this.getActive('fecha') &&
                        <div className="col-md-12 text-center">
                            <label className="col-form-label my-2 font-weight-bolder text-dark-60">Periodo del ticket</label><br />
                            <RangeCalendar onChange={onChangeRange} start={form.fechaInicio} end={form.fechaFin} />
                        </div>
                    }
                </div>
                {
                    form.filter !== null ?
                        form.filter.length > 0 ?
                            <div className="card-footer px-0 pb-0 pt-2 bg-light">
                                <div className="row mx-0">
                                    <div className="col-md-12 text-right px-0 pb-0">
                                        <span className='btn btn-sm btn-primary font-weight-bolder font-size-13px' onClick={(e) => { e.preventDefault(); onSubmit() }}>
                                            <i className="la la-filter icon-xl"></i> FILTRAR
                                        </span>
                                    </div>
                                </div>
                            </div>
                            : ''
                        : ''
                }
            </Form>
        )
    }
}

export default FormFilterTickets