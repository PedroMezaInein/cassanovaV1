import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle} from '../../texts'
import {Input, Select, SelectSearch, Button} from '../../form-components'
import { faPlus, faTimes, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert'

class AreaForm extends Component{

    render(){
        const { title, form, onChange, addSubarea, deleteSubarea, onSubmit, formeditado, ... props } = this.props
        return(
            <Form id="form-area"
                onSubmit = { 
                    (e) => {
                        e.preventDefault(); 
                        validateAlert(onSubmit, e, 'form-area')
                    }
                }
                { ... props}>
                <div className="form-group row form-group-marginless mt-4">
                    <div className="col-md-5">
                        <Input 
                            requirevalidation={1} 
                            formeditado={formeditado}
                            name="nombre" 
                            value={form.nombre} 
                            placeholder="Nombre del área" 
                            onChange={onChange} 
                            iconclass={"far fa-window-maximize"}
                        />
                    </div>
                    <div className="col-md-5">
                        <Input 
                            requirevalidation={0}
                            formeditado={formeditado}
                            name="subarea" 
                            value={form.subarea} 
                            placeholder="Subárea " 
                            onChange={onChange} 
                            iconclass={"far fa-window-restore"}
                        />
                    </div>
                    <div className="col-md-2 mt-3 d-flex justify-content-center align-items-center"> 
                        <Button icon = {faPlus} pulse={"pulse-ring"}className={"btn btn-icon btn-light-primary pulse pulse-primary mr-5"} onClick = { addSubarea }  />
                    </div>  
                </div>
                <div className="col-md-12 row mx-0">  
                    {
                        form.subareas.map((element, key) => {
                            return(
                                <div className="tagify form-control p-1 col-md-3 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{borderWidth:"0px"}} key = { key }>
                                    <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--primary tagify--noAnim"  >
                                        <div 
                                            title="Borrar archivo" 
                                            className="tagify__tag__removeBtn" 
                                            role="button" 
                                            aria-label="remove tag" 
                                            onClick = { (e) => { e.preventDefault(); deleteSubarea(element) }}
                                        >
                                        </div>                                                            
                                        <div><span className="tagify__tag-text p-1 ">{element}</span></div>
                                        </div>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    form.nombre !== '' && form.subareas.length > 0 ? 
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    : ''
                }
                
            </Form>
        )
    }
}

export default AreaForm