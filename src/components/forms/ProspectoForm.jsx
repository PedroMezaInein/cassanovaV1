import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, SelectSearch, Input } from '../form-components'
import { Subtitle } from '../texts'
import axios from 'axios'
import { CP_URL } from '../../constants'
import swal from 'sweetalert'
import { ContactoLeadForm, ClienteForm } from '../forms'
class ProspectoForm extends Component{

 
    state = {
        newClient: false,
        newEstatusProspectos: false,
        newTipoProyecto: false,
        newEstatusContratacion: false,
        municipio: '',
        estado: '',
        colonias: []
    }

    updateEstatusContratacion = value => {
        const { onChange } = this.props
        onChange({target:{name:'estatusContratacion', value: value.value}})
        if( value.value === 'New' ){
            this.setState({
                newEstatusContratacion: true
            })
        }else{
            this.setState({
                newEstatusContratacion: false
            })
        }
    }

    updateEstatusProspectos = value => {
        const { onChange } = this.props
        onChange({target:{name:'estatusProspecto', value: value.value}})
        if( value.value === 'New' ){
            this.setState({
                newEstatusProspectos: true
            })

        }else{
            this.setState({
                newEstatusProspectos: false
            })
        }
    }

    updateTipoProyecto = value => {
        const { onChange } = this.props
        onChange( { target: { name:'tipoProyecto', value: value.value } } )
        if( value.value === 'New' ){
            this.setState({
                newTipoProyecto: true
            })
        }else{
            this.setState({
                newTipoProyecto: false
            })
        }
    }

    updateCliente = value => {
        const { onChange } = this.props
        onChange({target:{name:'cliente', value: value.value}})
        if( value.value === 'New' ){
            this.setState({
                newClient: true
            })
        }else{
            this.setState({
                newClient: false
            })
        }
    }

    updateVendedor = value => {
        const { onChange } = this.props
        onChange({target:{name:'vendedor', value: value.value}})
    }

    updateColonia = value => {
        const { onChangeCliente } = this.props
        onChangeCliente({target:{name:'colonia', value: value.value}})
    }

    changeCP = event => {
        const { value, name } = event.target
        const { onChangeCliente } = this.props
        onChangeCliente( { target: { name: name, value: value } } )
        if(value.length === 5)
            this.cpAxios(value)
    }

    async cpAxios(value){
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { municipio, estado, asentamiento } = response.data.response
                const { onChangeCliente } = this.props
                let aux = [];
                asentamiento.map((colonia, key) => {
                    aux.push({value: colonia, name: colonia})
                })
                this.setState({
                    ... this.state,
                    municipio,
                    estado,
                    colonias: aux
                })
                onChangeCliente({target:{name:'cp', value: value}})
                onChangeCliente({target:{name:'municipio', value: municipio}})
                onChangeCliente({target:{name:'estado', value: estado}})
            },
            (error) => {
               
            }
        ).catch((error) => {
           
        })
    }

    render(){
        const { title, form, formCliente, children, vendedores, estatusProspectos, clientes, tipoProyecto, estatusContratacion, tiposContactos, onChange, onChangeCliente, onChangeContacto, formContacto, ...props } = this.props
        const { newClient, newEstatusProspectos, newTipoProyecto, newEstatusContratacion, municipio, estado, colonias } = this.state
        return(
            <Form { ... props}>

                <Subtitle className="text-center" color="gold">
                    {title}
                </Subtitle>
                { children }
                <div className="row my-3 mx-0">
                    <div className="px-2 col-md-12">
                        <Input rows="3" as="textarea" placeholder="Descripción del prospecto" name="descripcion"
                            onChange={onChange} value={form.descripcion} />
                    </div>
                    <div className="px-2 col-md-6">
                        { 
                            vendedores && 
                                <SelectSearch options = { vendedores } placeholder = "Selecciona al vendedor"
                                    name="vendedor" value={form.vendedor} onChange={this.updateVendedor}/> 
                        }
                    </div>
                    <div className="px-2 col-md-6">
                        { 
                            estatusProspectos && 
                                <SelectSearch options = { estatusProspectos } placeholder = "Selecciona el estatus del prospecto" onChange={this.updateEstatusProspectos}
                                    name="estatusProspecto" value={form.estatusProspecto} /> 
                        }
                    </div>
                    {
                        newEstatusProspectos && 
                            <div className="px-2 col-md-6">
                                <Input name="newEstatusProspecto" type="text" placeholder="Nuevo estatus prospecto" onChange={onChange} value={form.newEstatusProspectos} />
                            </div>
                    }
                    <div className="px-2 col-md-6">
                        { 
                            clientes && 
                                <SelectSearch options = { clientes } placeholder = "Selecciona el cliente" onChange={this.updateCliente}
                                    name="cliente" value={form.cliente} /> 
                        }
                    </div>
                    <div className="col-md-6 px-2">
                        { 
                            tipoProyecto && 
                                <SelectSearch options = { tipoProyecto } placeholder = "Selecciona el tipo de proyecto" onChange={this.updateTipoProyecto} 
                                    name="tipoProyecto" value={form.tipoProyecto} /> 
                        }
                    </div>
                    
                    { 
                        newTipoProyecto && 
                            <div className="col-md-6 px-2">
                                <Input name="newTipoProyecto" onChange={onChange} value={form.newTipoProyecto} type="text" placeholder="Nuevo tipo de proyecto"/> 
                            </div>
                    }
                    <div className="px-2 col-md-6">
                        <Input name="preferencia" type="text" placeholder="Perefencia de contacto"
                            onChange={onChange} value={form.preferencia} />
                    </div>
                    <div className="px-2 col-md-6">
                        { 
                            estatusContratacion && 
                                <SelectSearch options = { estatusContratacion } placeholder = "Selecciona el estatus de contratación" 
                                    name='estatusContratacion' value={form.estatusContratacion} onChange={this.updateEstatusContratacion} /> }
                    </div>
                    {
                        newEstatusContratacion && 
                            <div className="col-md-6">
                                <Input name="newEstatusContratacion" onChange={onChange} value={form.newEstatusContratacion} type="text" placeholder="Nuevo estatus de contratacion"/>
                            </div>
                    }
                    <div className="px-2 col-md-12">
                        <Input rows="3" as="textarea" placeholder="Motivo de contratación o rechazo" name="motivo" onChange={onChange} value={form.motivo}/>
                    </div>
                    {
                        newClient &&
                            <ClienteForm 
                                onChange = { onChangeCliente } 
                                title = 'Información del cliente'
                                form = { formCliente }
                                changeCP = { this.changeCP }
                                estado = { estado }
                                municipio = { municipio }
                                colonias = { colonias }
                                updateColonia = { this.updateColonia }
                                />
                    }
                    {
                        title !== 'Editar prospecto' &&
                        <>
                            <div className="col-md-12">
                                <Subtitle className="text-left my-3" color="gold">
                                    Información del contacto
                                </Subtitle>
                            </div>
                            <div className="col-md-12 p-0">
                                <ContactoLeadForm tiposContactos = { tiposContactos } formContacto = { formContacto } onChangeContacto = { onChangeContacto } />
                            </div>
                        </>
                    }
                </div>   
                
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>

            </Form>
        )
    }
}

export default ProspectoForm