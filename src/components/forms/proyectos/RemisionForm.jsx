import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, FileInput, SelectSearch, Button, Calendar } from '../../form-components'

class ConceptoForm extends Component{

    updateProyecto = value => {
        const { onChange, form } = this.props
        onChange({target:{value: value, name:'proyecto'}})
    }
    /*Código Omar
    updateArea = value => {
        const { onChange, setOptions } = this.props
        onChange({target:{value: value.value, name:'area'}})
        onChange({target:{value: '', name:'subarea'}})
        setOptions('subareas', value.subareas)
    }*/

    updateArea = value => {
        const { onChange, setOptions } = this.props
        
        onChange({target:{value: value, name:'area'}})
        onChange({target:{value: '', name:'subarea'}})

        const { options: { areas: areas } } = this.props
        const aux = areas.find(function(element, index) {
            if(value.toString() === element.value.toString() )
            {
                setOptions('subareas',element.subareas)
            }
        })
        
    }

    updateSubarea = value => {
        const { onChange, setOptions } = this.props
       /* Código Omar
       onChange({target:{value: value.value, name:'subarea'}})*/
       onChange( { target: { name: 'subarea', value: value.toString() } } )
    }

    handleChangeDate = (date) =>{
        const { onChange }  = this.props
        onChange( { target: { name: 'fecha', value: date } } )
    }
    
    render(){
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                <div className="row mx-0 my-3">
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.proyectos} placeholder = "Selecciona el proyecto" 
                            name = "proyecto" value = { form.proyecto } onChange = { this.updateProyecto }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Calendar onChangeCalendar = { this.handleChangeDate } placeholder = "Fecha"
                            name = "fecha" value = { form.fecha }
                            />
                    </div>
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.areas} placeholder = "Selecciona el área" 
                            name = "area" value = { form.area } onChange = { this.updateArea }/>
                    </div>
                    {
                        form.area ?
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.subareas} placeholder = "Selecciona el subárea" 
                                    name = "subarea" value = { form.subarea } onChange = { this.updateSubarea }/>
                            </div>
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        <FileInput 
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = { form.adjuntos.adjunto.placeholder }
                            value = { form.adjuntos.adjunto.value }
                            name = 'adjunto' id = 'adjunto'
                            accept = "image/*, application/pdf" 
                            files = { form.adjuntos.adjunto.files }
                            deleteAdjunto = { clearFiles } multiple/>
                    </div>
                    <div className = " col-md-12 px-2">
                        <Input as = "textarea" placeholder = "Descripción" rows = "3" value = { form.descripcion }
                            name = "descripcion" onChange = { onChange } />
                    </div>
                </div>
                
                <div className="d-flex justify-content-center my-3">
                    <Button  icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
                
            </Form>
        )
    }
}

export default ConceptoForm