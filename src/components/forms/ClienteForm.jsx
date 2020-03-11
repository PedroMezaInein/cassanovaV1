import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, SelectSearch, Input } from '../form-components'
import { Subtitle } from '../texts'

class ClienteForm extends Component{

    constructor(props){
        super(props)
        
    }

    render(){

        const { title, form, onChange, changeCP, estado, municipio, colonias, updateColonia } = this.props
        return(
            <>
                <div className="col-md-12">
                    <Subtitle className="text-left my-3" color="gold">
                        { title }
                    </Subtitle>
                </div>
                <div className="px-2 col-md-4">
                    <Input name="empresa" value={form.empresa} onChange={onChange} type="text" placeholder="Nombre empresa"/>
                </div>
                <div className="px-2 col-md-4">
                    <Input name="nombre" value={form.nombre} onChange={onChange} type="text" placeholder="Nombre del empleado"/>
                </div>
                <div className="px-2 col-md-4">
                    <Input name="puesto" value={form.puesto} onChange={onChange} type="text" placeholder="Puesto del empleado"/>
                </div>
                <div className="px-2 col-md-4">
                    <Input name="cp" onChange={changeCP} value={form.cp} type="text" placeholder="Código postal"/>
                </div>
                <div className="px-2 col-md-4">
                    <Input readOnly={colonias.length <= 0 ? true : false} value={estado} name="estado" type="text" placeholder="Estado"/>
                </div>
                <div className="px-2 col-md-4">
                    <Input readOnly={colonias.length <= 0 ? true : false} value={municipio} name="municipio" type="text" placeholder="Municipio/Delegación"/>
                </div>
                <div className="px-2 col-md-4">
                    { colonias.length > 0 && <SelectSearch options = { colonias } placeholder = "Selecciona la colonia" name="colonia"  
                        value = { form.colonia } defaultValue = { form.colonia } onChange = { updateColonia }/>}
                    { colonias.length <= 0 && <Input readOnly value={form.colonia} name="colonia" type="text" placeholder="Selecciona la colonia"/>}
                </div>
                <div className="px-2 col-md-8">
                    <Input name="calle" value={form.calle} onChange={onChange} type="text" placeholder="Calle y número"/>
                </div>
                <div className="px-2 col-md-12">
                    <Input rows="3" as="textarea" placeholder="Perfil" name="perfil" value={form.perfil} onChange={onChange}/>
                </div>
            </>
        )
    }

}

export default ClienteForm