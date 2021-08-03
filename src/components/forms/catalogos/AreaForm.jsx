import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, TagInputGray, SelectSearchGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import InputGray from '../../form-components/Gray/InputGray'

class AreaForm extends Component {

    handleChange = function(e, element){
        const { editSubarea } = this.props
        editSubarea(e.target.innerHTML.toUpperCase(), element)
    }.bind(this);

    updatePartida = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'partida' } })
    }

    tagInputChange = values =>  {
        const { onChange, area, form } = this.props
        let aux = []
        let newValues = []
        values.forEach((value) => {
            newValues.push(value.toUpperCase())
        })
        newValues = [...new Set(newValues)]
        if(area !== ''){
            newValues.forEach((value) => {
                let exist = area.subareas.find((element) => {
                    return value.toUpperCase() === element.nombre.toUpperCase()
                })
                if( exist === undefined ){
                    aux.push(value.toUpperCase())
                }
            })
        }else{
            newValues.forEach((value) => {
                aux.push(value.toUpperCase())
            }) 
        }
        onChange({target:{value: aux, name: 'subareas'}})
    }

    render() {
        const { title, form, onChange, addSubarea, deleteSubarea, onSubmit, formeditado, area, editSubarea, tipo, options, ...props } = this.props
        return (
            <Form id="form-area" onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-area') } } {...props}>
                <div className="form-group row form-group-marginless pt-4 justify-content-center ">
                    <div className="col-md-4">
                        <InputGray requirevalidation = { 1 } formeditado = { formeditado } name = 'nombre' value = { form.nombre } withtextlabel = { 1 }
                            placeholder = 'NOMBRE DEL ÁREA' onChange = { onChange } iconclass = 'far fa-window-maximize' withtaglabel = { 1 }  
                            messageinc = "Incorrecto. Ingresa el nombre del área." withplaceholder = { 1 } withicon = { 1 } />
                    </div>
                    <div className="col-md-4">
                        <TagInputGray tags = { form.subareas } placeholder = "SUBÁREA(S)" iconclass = "far fa-window-restore" 
                            uppercase = { true } onChange = { this.tagInputChange } /> 
                    </div>
                    {
                        tipo === 'compras' ?
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.partidas } placeholder = "SELECCIONA LA PARTIDA" name = "partida" 
                                    value = { form.partida } onChange = { this.updatePartida } requirevalidation = { 1 } withicon = { 1 }
                                    messageinc = "Seleccione la partida." customdiv = "mb-0" withtaglabel = { 1 } withtextlabel = { 1 } />
                            </div>
                        : <></>
                    }
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                    {
                        area ?
                            area.subareas.map((element, key) => {
                                return (
                                    <div className="tagify form-control p-2 d-flex justify-content-center align-items-center w-auto" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                        <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--success tagify--noAnim"  >
                                            <div title="Borrar archivo" className="tagify__tag__removeBtn" role="button"
                                                aria-label="remove tag"
                                                onClick={(e) => { deleteSubarea(area, element, 'subareas') }} 
                                                />
                                            <div>
                                                <span className="tagify__tag-text p-1 white-space" contentEditable = { true } 
                                                    onBlur={ (e) => { e.preventDefault(); this.handleChange(e,element); } }
                                                    onInput={ (e) => { e.preventDefault(); this.handleChange(e,element); } } >
                                                    {element.nombre}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        : ''
                    }
                </div>
                <div className="mt-3 text-center">
                    <Button icon = '' className = "mx-auto" onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-area') } }
                        text="ENVIAR" />
                </div>
            </Form>
        )
    }
}

export default AreaForm