import React, { Component } from 'react'
import { Form, Row } from 'react-bootstrap'
import { InputGray, InputMoneyGray, ReactSelectSearchGray, Button, RangeCalendar } from '../../form-components'

import InputLabel from '@material-ui/core/InputLabel';
import SelectMUI from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class EngresosFilters extends Component {

    state = {
        form: {
            fechas: { start: null, end: null },
            proveedor: '',
            area: '',
            id_partidas: '',
            id_subpartida: '',
            subarea: '',
            total: '',
            empresa: '',
            cuenta: '',
            estatusCompra: 0,
            descripcion:'',
            factura: '',
            identificador: ''
        },
    }

    componentDidMount = () => {
        const { filters } = this.props
        let keys = Object.keys(filters)
        if(keys.length){
            const { form } = this.state
            keys.forEach((element) => {
                form[element] = filters[element]
            })
            this.setState({ ...this.state, form })
        }
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    updateSelect = (value, type) => {
        const { form } = this.state
        form[type] = value
        const { setOptions, options: { areas, empresas} } = this.props
        switch (type) {
            case 'area':
                areas.find(function (element, index) {
                    if(value !== null){
                        if (value.value.toString() === element.value.toString()) {
                            setOptions('subareas', element.subareas)
                            return true
                        }
                        return false
                    }
                    return false
                })
                break;
            case 'empresa':
                empresas.find(function (element, index) {
                    if(value !== null){
                        if (value.value.toString() === element.value.toString()) {
                            setOptions('cuentas', element.cuentas)
                            return element
                        }
                        return false
                    }
                    return false
                })
                break;
            default:
                break;
        }
        this.setState({ ...this.state, form })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { sendFilters } = this.props
        const { form } = this.state
        sendFilters(form)
    }

    clearFilters = (e) => {
        e.preventDefault();
        const { sendFilters } = this.props
        this.clearForm()
        sendFilters({})
    }
    clearForm = () => {
        const { form } = this.state
        form.fechas = { start: null, end: null }
        form.proveedor = ''
        form.area = ''
        form.subarea = ''
        form.total = ''
        form.empresa = ''
        form.cuenta = ''
        form.estatusCompra = 0
        form.descripcion = ''
        form.factura = ''
        form.identificador = ''
        this.setState({ ...this.state, form })
    }

    render() {
        const { form } = this.state
        
        const { options, areas } = this.props
        return (
            <Form onSubmit={this.onSubmit} >
                <Row className="mx-0 mt-5 mb-8">
                    <div className="order-md-2 order-xxl-1 col-md-12 col-xxl-3 text-center align-self-center">
                        <div className="col-md-12 text-center">
                            <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                            <RangeCalendar start={form.fechas.start} end={form.fechas.end}
                                onChange={(value) => { this.onChange({ target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) }} />
                        </div>
                    </div>
                    <div className="order-md-1 order-xxl-2 col-md-12 col-xxl-9 align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} requirevalidation={0}
                                    withformgroup={0} name='identificador' placeholder='IDENTIFICADOR' value={form.identificador}
                                    onChange={this.onChange} withicon={0} customclass="px-2" />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder='Selecciona el proveedor' defaultvalue={form.proveedor} iconclass='las la-user icon-xl'
                                    options={options.proveedores} onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'proveedor') } else {
                                            form.proveedor = ''
                                            this.setState({ ...this.state, form })
                                        }
                                    }} />

                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder='Selecciona la empresa' defaultvalue={form.empresa} iconclass='las la-building icon-xl'
                                    options={options.empresas}
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'empresa') } 
                                        if (value===null){
                                            form.empresa = ''
                                            this.setState({ ...this.state, form })
                                        }}}
                                />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder='Selecciona la cuenta' defaultvalue={form.cuenta} iconclass='las la-credit-card icon-xl'
                                    options={options.allCuentas} 
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'cuenta') } 
                                        if (value===null){
                                            form.cuenta = ''
                                            this.setState({ ...this.state, form })
                                        }}}
                                        />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder='Selecciona el área' defaultvalue={form.area} iconclass='las la-window-minimize icon-xl'
                                    options={options.areas} 
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'area') } 
                                        if (value===null){
                                            form.area = ''
                                            this.setState({ ...this.state, form })
                                        }}}
                                />
                                
                            </div>
                            {/* {
                                form.area ?
                                    <div className="col-md-4 col-xxl-3 mb-5">
                                        <ReactSelectSearchGray placeholder='Selecciona el subárea' defaultvalue={form.subarea} iconclass='las la-window-maximize icon-xl'
                                            options={options.subareas} 
                                            onChange={(value) => {
                                                if (value !== null) { this.updateSelect(value, 'subarea') } 
                                                if (value===null){
                                                    form.subarea = ''
                                                    this.setState({ ...this.state, form })
                                                }}}
                                            />
                                    </div>
                                    : <></>
                            } */}
                            
                                {areas.length > 0 && form.area !== '' && areas.find(item => item.id_area == form.area.value) ?
                                    <div className="col-md-4 col-xxl-3 mb-5">
                                        <label className="col-form-label font-weight-bold text-dark-60">Partida</label>
                                        <SelectMUI
                                            value={form.id_partidas}
                                            onChange={e => this.updateSelect(e.target.value, 'id_partidas') }
                                            style={{ width: '100%' }}
                                        >
                                            {areas.find(item => item.id_area == form.area.value).partidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </SelectMUI>
                                    </div>
                                    : null
                                }    
                            
                            
                            
                                {areas.length && form.area !== '' && form.id_partidas !== '' ?
                                    <>
                                        {
                                            console.log(areas.find(item => item.id_area == form.area.value).partidas.find(item => item.id == form.s))
                                        }
                                        {
                                            areas.find(item => item.id_area == form.area.value).partidas.find(item => item.id == form.id_partidas) ?
                                                <div className="col-md-4 col-xxl-3 mb-4 mt-5">
                                                    <InputLabel >Tipo de Subgasto</InputLabel>
                                                    <SelectMUI
                                                        style={{ width: '100%' }}
                                                        onChange={e => this.updateSelect(e.target.value, 'id_subpartida')}
                                                        value={form.id_subpartida}
                                                    >
                                                        {areas.find(item => item.id_area == form.area.value).partidas.find(item => item.id == form.id_partidas).subpartidas.map((item, index) => (
                                                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                                        ))}

                                                    </SelectMUI>
                                                </div>
                                                : null

                                        }

                                    </>
                                    : null

                                }
                            
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder='estatus de compra' defaultvalue={form.estatusCompra} iconclass='las la-check-circle icon-xl'
                                    options={options.estatusCompras} 
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'estatusCompra') } 
                                        if (value===null){
                                            form.estatusCompra = 0
                                            this.setState({ ...this.state, form })
                                        }}}
                                />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <InputMoneyGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0}
                                    requirevalidation={0} formeditado={0} thousandseparator={true} prefix='$' name="total"
                                    value={form.total} onChange={this.onChange} placeholder="TOTAL" iconclass='las la-dollar-sign' />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder='¿Lleva factura?' defaultvalue={form.factura} iconclass='las la-question-circle icon-xl'
                                    options={[{ label: 'Si', value: 'Con factura' }, { label: 'No', value: 'Sin factura' }]} 
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'factura') } 
                                        if (value===null){
                                            form.factura = ''
                                            this.setState({ ...this.state, form })
                                        }}}
                                    />
                            </div>
                            <div className="col col-xxl-12">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} requirevalidation={0} as='textarea' rows='1'
                                    withformgroup={0} name='descripcion' placeholder='DESCRIPCION' value={form.descripcion} onChange={this.onChange}
                                    withicon={0} customclass="px-2" />
                            </div>
                        </div>
                    </div>
                </Row>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR"
                        onClick={this.clearFilters} />
                    <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default EngresosFilters
