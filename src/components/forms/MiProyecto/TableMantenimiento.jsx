import React, { Component } from 'react'
import { InputNumberGray, RangeCalendar, ReactSelectSearch, TagSelectSearchGray } from '../../form-components'
import 'moment/locale/es';
import { Row, Col, Form } from 'react-bootstrap'
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
        const { onChange } = this.props
        onChange({target: { value: value, name: 'rubro'}}, true)
        let { rubros } = this.state
        let aux = []
        if(value !== null){
            value.forEach((tipo) => {
                aux.push(tipo.label)
            })
        }
        rubros = aux
        this.setState({
            ...this.state,
            rubros
        })
    }

    searchForm () {
        const { searchForm } = this.state
        this.setState({
            ...this.state,
            searchForm: !searchForm,
        })
    }
    render() {
        const { options, form, onChangeRange, onChange, filtrarTabla } = this.props
        const { searchForm, rubros } = this.state
        return (
            <div>
                <Row>
                    <Col md="4" className={`bg-form ${searchForm?'':'d-none'}`}>
                        <Form>
                        <div className="row form-group-marginless mx-0 mt-10">
                            <div className="col-md-12 mb-5">
                                <TagSelectSearchGray
                                    placeholder='¿QUÉ DESEAS FILTRAR?'
                                    options={options.rubro}
                                    iconclass='las la-user-friends icon-xl'
                                    defaultvalue={form.rubro}
                                    onChange={this.updateRubro}
                                />
                            </div>
                            {
                                rubros.includes('TIPO DE MANTENIMIENTO')&&
                                <div className="col-md-12 mb-5">
                                    <ReactSelectSearch
                                        placeholder='Selecciona el mantenimiento'
                                        options={this.transformarOptions(options.mantenimientos)}
                                        defaultvalue={form.mantenimiento}
                                        onChange={this.updateMantenimiento}
                                    />
                                </div>
                            }
                            {
                                rubros.includes('EQUIPO')&&
                                <div className="col-md-12 mb-5">
                                    <ReactSelectSearch
                                        placeholder='Selecciona el equipo'
                                        options={this.transformarOptions(options.equipos)}
                                        defaultvalue={form.equipo}
                                        onChange={this.updateEquipos}
                                    />
                                </div>
                            }
                            {
                                rubros.includes('ESTATUS')&&
                                <div className="col-md-12 mb-5">
                                    <ReactSelectSearch
                                        placeholder='Selecciona el estatus'
                                        options={this.transformarOptions(options.estatus)}
                                        defaultvalue={form.estatus}
                                        onChange={this.updateEstatus}
                                    />
                                </div>
                            }
                            {
                                rubros.includes('COSTO')&&
                                <div className="col-md-12 mb-5">
                                    <InputNumberGray
                                        withicon={0}
                                        requirevalidation={0}
                                        placeholder="COSTO"
                                        value={form.costo}
                                        name="tiempo_ejecucion_diseno"
                                        onChange={onChange}
                                        thousandseparator={true}
                                        customclass='bg-white border'
                                    />
                                </div>
                            }
                            {
                                rubros.includes('FECHA')&&
                                <div className="col-md-12 text-center">
                                    <label className="col-form-label my-2 font-weight-bolder text-dark-60">Periodo del mantenimiento</label><br />
                                    <RangeCalendar
                                        onChange={onChangeRange}
                                        start={form.fechaInicio}
                                        end={form.fechaFin}
                                    />
                                </div>
                            }
                        </div>
                        {
                            rubros.length > 0 ?
                                <div className="d-flex justify-content-center mb-5" >
                                    <span className='btn btn-sm font-weight-bolder text-primary align-self-center font-size-lg box-shadow-button' onClick={ (e) => { e.preventDefault(); filtrarTabla() } }>
                                        <i className="la icon-xl text-primary"></i> FILTRAR
                                    </span>
                                </div>
                                : ''
                        }
                        </Form>
                    </Col>
                    <Col md={`${searchForm?'8':'12'}`}>
                        <div className="tab-content ">
                            <div className="d-flex justify-content-end mb-10">
                                <span className='btn btn-sm font-weight-bolder text-info align-self-center font-size-lg box-shadow-button' onClick={(e) => { e.preventDefault(); this.searchForm() }}>
                                    <i className={`la ${searchForm?'la-search-minus':'la-search-plus'} icon-xl text-info`}></i> FILTRAR
                                </span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-borderless table-vertical-center">
                                    <thead>
                                        <tr className="text-center text-proyecto">
                                            <th>Estatus</th>
                                            <th>Tipo de mantenimiento</th>
                                            <th>Equipo</th>
                                            <th>Fecha</th>
                                            <th>Costo</th>
                                            <th>Presupuesto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-dark-75 font-weight-normal text-center">
                                            <td>
                                                
                                            </td>
                                            <td>
                                                
                                            </td>
                                            <td>
                                                
                                            </td>
                                            <td>
                                                
                                            </td>
                                            <td>
                                                
                                            </td>
                                            <td>
                                                
                                            </td>
                                        </tr>
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