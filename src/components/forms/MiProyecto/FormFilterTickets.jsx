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
    
    onChange = (e) => {
        const { name, value } = e.target
        const { onChange } = this.props
        onChange({target: { value: value, name: name}}, 'filterTickets')
    }

    updateSelect = (value, name) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } }, 'filterTickets')
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
        const { onSubmit, options, form, onChangeRange, typeForm } = this.props
        return (
            <Form>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12 mb-5">
                        <TagSelectSearchGray placeholder = '¿QUÉ DESEAS FILTRAR?' options={typeForm === 'ticket' ? options.filterTickets : options.filterPresupuesto} defaultvalue = { form.filter }
                            iconclass = 'las la-user-friends icon-xl' onChange = { this.updateRubro } bgcolor='#fff'/>
                    </div>
                    {
                        this.getActive('proyecto') &&
                        <div className="col-md-12 mb-5">
                            <ReactSelectSearch placeholder = 'Selecciona el proyecto' defaultvalue = { form.proyecto } iconclass='las la-folder icon-xl'
                                options = { this.transformarOptions(options.proyectos) } onChange={(value) => { this.updateSelect(value, 'proyecto') }}/>
                        </div>
                    }
                    {
                        this.getActive('estatus') &&
                        <div className="col-md-12 mb-5">
                            <ReactSelectSearch placeholder='Selecciona el estatus' options={this.transformarOptions(options.estatus)}
                                defaultvalue={form.estatus} iconclass='las la-check-circle icon-xl'  onChange={(value) => { this.updateSelect(value, 'estatus') }} />
                        </div>
                    }
                    {
                        this.getActive(typeForm === 'ticket' ? 'tipo_trabajo' : 'area') &&
                        <div className="col-md-12 mb-5">
                            <ReactSelectSearch
                                placeholder={`Selecciona el ${typeForm === 'ticket' ? 'tipo de trabajo' : 'area'}`}
                                defaultvalue={typeForm === 'ticket' ? form.tipo_trabajo : form.area}
                                iconclass='las la-tools icon-xl'
                                options={typeForm === 'ticket' ? this.transformarOptions(options.tiposTrabajo) : this.transformarOptions(options.areas)}
                                onChange={(value) => { this.updateSelect(value, `${typeForm === 'ticket' ? 'tipo_trabajo' : 'area'}`) }}
                            />
                        </div>
                    }
                    {
                        this.getActive('id') &&
                        <div className="col-md-12 mb-5">
                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0}
                                placeholder="IDENTIFICADOR" value={form.id} name="id" onChange = { (value) => this.onChange(value)} thousandseparator={true}
                                customclass='bg-white' iconclass='las la-id-card-alt icon-xl' custom_gtext='bg-white' inputsolid='bg-white border' />
                        </div>
                    }
                    {
                        this.getActive(typeForm === 'ticket' ? 'descripcion' : 'tiempo_ejecucion') &&
                        <div className="col-md-12 mb-5">
                            <InputGray
                                withtaglabel={1}
                                withtextlabel={1}
                                withplaceholder={1}
                                withicon={1}
                                requirevalidation={0}
                                placeholder={`${typeForm === 'ticket' ? 'DESCRIPCIÓN' : 'TIEMPO DE EJECUCIÓN'}`}
                                value={typeForm === 'ticket' ? form.descripcion : form.tiempo_ejecucion}
                                name={typeForm === 'ticket' ? 'descripcion' : 'tiempo_ejecucion'}
                                onChange = { (value) => this.onChange(value)}
                                thousandseparator={true}
                                customclass='bg-white'
                                iconclass={`${typeForm === 'ticket' ? 'las la-grip-lines' : 'flaticon-calendar-with-a-clock-time-tools'}`}
                                custom_gtext='bg-white'
                                inputsolid='bg-white border'
                            />
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