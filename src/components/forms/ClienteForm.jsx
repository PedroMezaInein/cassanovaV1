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
                </div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input name="empresa" value={form.empresa} onChange={onChange} type="text" placeholder="Nombre empresa"iconclass={"far fa-building"}/>
                        <span className="form-text text-muted">Por favor, ingrese el nombre de la empresa</span>
                    </div>
                    <div className="col-md-4">
                        <Input name="rfc" value={form.rfc} onChange={onChange} type="text" placeholder="RFC empresa" iconclass={"far fa-file-alt"} />
                        <span className="form-text text-muted">Por favor, ingrese el RFC de la empresa. </span>
                    </div>
                    <div className="col-md-4">
                        <Input name="nombre" value={form.nombre} onChange={onChange} type="text" placeholder="Nombre del empleado" iconclass={"far fa-user"}/>
                        <span className="form-text text-muted">Por favor, ingrese el nombre del empleado</span>
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input name="puesto" value={form.puesto} onChange={onChange} type="text" placeholder="Puesto del empleado" iconclass={" fas fa-user-tie"}/>
                        <span className="form-text text-muted">Por favor, ingrese el puesto del empleado </span>
                    </div>
                    <div className="col-md-4">
                        <Input name="cp" onChange={changeCP} value={form.cp} type="text" placeholder="Código postal" iconclass={"far fa-envelope"} />
                        <span className="form-text text-muted">Por favor, ingrese su código postal. </span>
                    </div>
                    <div className="col-md-4">
                        <Input readOnly={colonias.length <= 0 ? true : false} value={estado} name="estado" type="text" placeholder="Estado" iconclass={"fas fa-map-marked-alt"}/>
                        <span className="form-text text-muted">Por favor, ingrese su estado. </span>
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input readOnly={colonias.length <= 0 ? true : false} value={municipio} name="municipio" type="text" placeholder="Municipio/Delegación" iconclass={"fas fa-map-marker-alt"} />
                        <span className="form-text text-muted">Por favor, ingrese su municipio/delegación. </span>
                    </div>
                    <div className="col-md-4">
                        { colonias.length > 0 && <SelectSearch options = { colonias } placeholder = "Selecciona la colonia" name="colonia"  
                            value = { form.colonia } defaultValue = { form.colonia } onChange = { updateColonia } iconclass={"fas fa-map-pin"} />}
                        { colonias.length <= 0 && <Input readOnly value={form.colonia} name="colonia" type="text" placeholder="Selecciona la colonia" iconclass={"fas fa-map-pin"} />}
                        <span className="form-text text-muted">Por favor, seleccione su colonia. </span>
                    </div>
                    <div className="col-md-4">
                        <Input name="calle" value={form.calle} onChange={onChange} type="text" placeholder="Calle y número" iconclass={"fas fa-map-signs"}/>
                        <span className="form-text text-muted">Por favor, ingrese su calle y número. </span>
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input rows="" as="textarea" placeholder="Perfil" name="perfil" value={form.perfil} onChange={onChange} iconclass={"fas fa-user-tag"}/>
                        <span className="form-text text-muted">Por favor, ingrese su perfil </span>
                    </div>
                </div>
            </>
        )
    }

}

export default ClienteForm