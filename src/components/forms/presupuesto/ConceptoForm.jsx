import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup } from '../../form-components'

class ConceptoForm extends Component {

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

    updateUnidades = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'unidad' } })
    }

    render() {
        const { title, options, form, onChange, onSubmit, ...props } = this.props
        return (
            <Form id="form-concepto"
                onSubmit = { 
                    (e) => {
                        e.preventDefault(); 
                        var elementsInvalid = document.getElementById("form-concepto").getElementsByClassName("is-invalid"); 
                        if(elementsInvalid.length===0){   
                            onSubmit(e)
                        }else{ 
                            alert("Rellena todos los campos")
                        } 
                    }
                }
                {...props}
                >
                    <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-6">
                            <SelectSearch 
                                options={options.partidas}
                                placeholder="Selecciona la partida"
                                name="partida"
                                value={form.partida}
                                onChange={this.updatePartida} 
                                iconclass={" fas fa-book"} 
                            />
                            {/*<span className="form-text text-muted">Por favor, selecciona la partida</span>*/}
                        </div>
                        <div className="col-md-6" hidden={options.subpartidas.length <= 0 ? true : false}>
                            <SelectSearch 
                                options={options.subpartidas}
                                placeholder="Selecciona la subpartida"
                                name="subpartida"
                                value={form.subpartida}
                                onChange={this.updateSubpartida}
                                iconclass={" fas fa-book"}
                            />
                            {/*<span className="form-text text-muted">Por favor, selecciona la subpartida</span>*/}
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-6">
                            <SelectSearch
                                options={options.unidades}
                                placeholder="Selecciona la unidad"
                                name="unidad"
                                value={form.unidad}
                                onChange={this.updateUnidades}
                                iconclass={" fas fa-weight-hanging"}
                            />
                            {/*<span className="form-text text-muted">Por favor, selecciona la unidad</span>*/}
                        </div>
                        <div className="col-md-6">
                            <InputMoney 
                                requirevalidation={1}
                                thousandSeparator={true}
                                placeholder="Costo"
                                value={form.costo}
                                name="costo"
                                onChange={onChange}
                                iconclass={"fas fa-dollar-sign"}
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su costo. </span>*/}
                        </div>
                    </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <Input 
                                    requirevalidation={1}
                                    as="textarea" 
                                    placeholder="Descripción"
                                    rows="3"
                                    value={form.descripcion}
                                    name="descripcion"
                                    onChange={onChange}
                                    messageinc="Incorrecto. Ingresa una descripción."
                                    style={{paddingLeft:"10px"}} 
                                />
                                {/*<span className="form-text text-muted">Por favor, ingresa la descripción. </span>*/}
                            </div>
                        </div>
                    <div className="d-flex justify-content-center my-3">
                        <Button icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                    </div>

            </Form>
        )
    }
}

export default ConceptoForm