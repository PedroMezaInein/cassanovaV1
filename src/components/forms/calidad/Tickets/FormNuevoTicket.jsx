import React, { useState} from 'react'
import { Form } from 'react-bootstrap';
import { validateAlert } from '../../../../functions/alert';
import { SelectSearchGray, InputGray, Button, RadioGroup } from '../../../form-components';
import { ItemSlider } from '../../../singles';
export default function FormNuevoTicket({ form, options, onSubmit, handleChange, onChange }) {
    const [externo, setExterno] = useState(false);

    const updateSelect = (value, name) => {
        onChange({ target: { value: value, name: name } })
    }

    const updateRadio = () => {
        if(externo){
            setExterno(false)
            onChange({ target: { value: false, name: 'externo' } })
        } else {
            setExterno(true)
            onChange({ target: { value: true, name: 'externo' } })
        }
    }


    return (
        <>
            <Form id="form-nuevo-ticket"
                onSubmit={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-nuevo-ticket') }} >
                <div className="col-12 col-md-2">
                    <RadioGroup
                        placeholder="Ticket Externo"
                        name="externo"
                        label="Externo"
                        options={[{ value: true, label: 'Si' }, { value: false, label: 'No' }]}
                        onChange={(e) => updateRadio()}
                        value={externo}
                    />
                </div>
                {externo &&
                    <div className="row">
                    <div className="col-12 col-md-1">
                        <InputGray
                            withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0}
                            placeholder="Ticket"
                            label="Ticket"
                            name="numero_ticket"
                            value={form.numero_ticket}
                            onChange={onChange}
                            required />
                    </div>
                    <div className="col-12 col-md-1">
                        <InputGray
                            withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0}
                            placeholder="Clave"
                            label="Clave"
                            name="clave"
                            value={form.clave}
                            onChange={onChange}
                            />
                    </div>
                </div>
                }  
                <div className="form-group row form-group-marginless pt-4 justify-content-md-left">
                    <div className="col-md-3">
                        <SelectSearchGray requirevalidation = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 }
                            options = { options.proyectos } placeholder = 'SELECCIONA EL PROYECTO' name = 'proyecto'
                            value = { form.proyecto } onChange = { (value) =>  { updateSelect(value, 'proyecto') } } 
                            iconclass = 'las la-swatchbook icon-2x' messageinc = "Incorrecto. Selecciona el proyecto" />
                    </div>
                    <div className="col-md-3">
                        <SelectSearchGray requirevalidation = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 }
                            options = { options.tiposTrabajo } placeholder = "SELECCIONA EL TIPO DE TRABAJO" name = "tipo_trabajo"
                            value = { form.tipo_trabajo } onChange = { (value) =>  { updateSelect(value, 'tipo_trabajo') } }  
                            iconclass = "las la-tools icon-xl" messageinc = "Incorrecto. Selecciona el tipo de trabajo" />
                    </div>
                    <div className="col-md-3">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } withformgroup = { 0 }
                            requirevalidation = { 1 } placeholder = "NOMBRE DEL SOLICITANTE" value = { form.solicito } name = "solicito" 
                            onChange = { onChange } messageinc="Incorrecto. Ingresa el nombre del solicitante." />
                    </div>
                    <div className="col-md-5 justify-content-md-right">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } withformgroup = { 0 }
                            requirevalidation = { 1 } as = "textarea" placeholder = "ÁREA DE TRABAJO " rows = "2" 
                            value = { form.solicitado } name = "solicitado" onChange = { onChange } 
                            messageinc="Incorrecto. Ingresa la área de trabajo." />
                    </div>
                    <div className="col-md-5">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } withformgroup = { 0 }
                            requirevalidation = { 1 } as = "textarea" placeholder = "DESCRIPCIÓN DEL PROBLEMA" rows = "2" 
                            value = { form.descripcion } name = "descripcion" onChange = { onChange } 
                            messageinc="Incorrecto. IDETALLE DEL TRABAJO SOLICITADO ." />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-6 text-center">
                        <label className="col-form-label mt-2 font-weight-bolder">{form.adjuntos.fotos.placeholder}</label>
                        <ItemSlider items={form.adjuntos.fotos.files} handleChange={handleChange} item="fotos" />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon = '' text = 'ENVIAR'
                                onClick={ (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-nuevo-ticket') } } />
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
    
}