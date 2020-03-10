import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, SelectSearch, Input } from '../form-components'
import { Subtitle } from '../texts'
import axios from 'axios'
import { CP_URL } from '../../constants'
import swal from 'sweetalert'
class ProspectoForm extends Component{

    constructor(props){
        super(props)
        
    }
    
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
        if(event.target.value.length === 5)
            this.cpAxios(event.target.value)
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
        const { title, form, formCliente, children, vendedores, estatusProspectos, clientes, tipoProyecto, estatusContratacion, onChange, onChangeCliente, ...props } = this.props
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
                    <div className="px-2 col-md-4">
                        { 
                            vendedores && 
                                <SelectSearch options = { vendedores } placeholder = "Selecciona al vendedor"
                                    name="vendedor" value={form.vendedor} onChange={this.updateVendedor}/> 
                        }
                    </div>
                    <div className="px-2 col-md-4">
                        { 
                            estatusProspectos && 
                                <SelectSearch options = { estatusProspectos } placeholder = "Selecciona el estatus del prospecto" onChange={this.updateEstatusProspectos}
                                    name="estatusProspecto" value={form.estatusProspecto} /> 
                        }
                    </div>
                    {
                        newEstatusProspectos && 
                            <div className="px-2 col-md-4">
                                <Input name="newEstatusProspecto" type="text" placeholder="Nuevo estatus prospecto" onChange={onChange} value={form.newEstatusProspectos} />
                            </div>
                    }
                    <div className="px-2 col-md-4">
                        { 
                            clientes && 
                                <SelectSearch options = { clientes } placeholder = "Selecciona el cliente" onChange={this.updateCliente}
                                    name="cliente" value={form.cliente} /> 
                        }
                    </div>
                    <div className="col-md-4 px-2">
                        { 
                            tipoProyecto && 
                                <SelectSearch options = { tipoProyecto } placeholder = "Selecciona el tipo de proyecto" onChange={this.updateTipoProyecto} 
                                    name="tipoProyecto" value={form.tipoProyecto} /> 
                        }
                    </div>
                    
                    { 
                        newTipoProyecto && 
                            <div className="col-md-4 px-2">
                                <Input name="newTipoProyecto" onChange={onChange} value={form.newTipoProyecto} type="text" placeholder="Nuevo tipo de proyecto"/> 
                            </div>
                    }
                    <div className="px-2 col-md-4">
                        <Input name="preferencia" type="text" placeholder="Perefencia de contacto"
                            onChange={onChange} value={form.preferencia} />
                    </div>
                    <div className="px-2 col-md-4">
                        { 
                            estatusContratacion && 
                                <SelectSearch options = { estatusContratacion } placeholder = "Selecciona el estatus de contratación" 
                                    name='estatusContratacion' value={form.estatusContratacion} onChange={this.updateEstatusContratacion} /> }
                    </div>
                    {
                        newEstatusContratacion && 
                            <div className="col-md-4">
                                <Input name="newEstatusContratacion" onChange={onChange} value={form.newEstatusContratacion} type="text" placeholder="Nuevo estatus de contratacion"/>
                            </div>
                    }
                    <div className="px-2 col-md-12">
                        <Input rows="3" as="textarea" placeholder="Motivo de contratación o rechazo" name="motivo" onChange={onChange} value={form.motivo}/>
                    </div>
                    {
                        newClient &&
                            <>
                                <div className="col-md-12">
                                    <Subtitle className="text-left my-3" color="gold">
                                        Información del cliente
                                    </Subtitle>
                                </div>
                                <div className="px-2 col-md-4">
                                    <Input name="empresa" value={formCliente.empresa} onChange={onChangeCliente} type="text" placeholder="Nombre empresa"/>
                                </div>
                                <div className="px-2 col-md-4">
                                    <Input name="nombre" value={formCliente.nombre} onChange={onChangeCliente} type="text" placeholder="Nombre del empleado"/>
                                </div>
                                <div className="px-2 col-md-4">
                                    <Input name="puesto" value={formCliente.puesto} onChange={onChangeCliente} type="text" placeholder="Puesto del empleado"/>
                                </div>
                                <div className="px-2 col-md-4">
                                    <Input name="cp" onChange={this.changeCP} type="text" placeholder="Código postal"/>
                                </div>
                                <div className="px-2 col-md-4">
                                    <Input value={estado} name="estado" type="text" placeholder="Estado"/>
                                </div>
                                <div className="px-2 col-md-4">
                                    <Input value={municipio} name="municipio" type="text" placeholder="Municipio/Delegación"/>
                                </div>
                                <div className="px-2 col-md-4">
                                    <SelectSearch options = { colonias } placeholder = "Selecciona la colonia" name="colonia" value={formCliente.colonia} onChange={this.updateColonia}/>
                                </div>
                                <div className="px-2 col-md-8">
                                    <Input name="calle" value={formCliente.calle} onChange={onChangeCliente} type="text" placeholder="Calle y número"/>
                                </div>
                                <div className="px-2 col-md-12">
                                    <Input rows="3" as="textarea" placeholder="Perfil" name="perfil" value={formCliente.perfil} onChange={onChangeCliente}/>
                                </div>
                            </>
                    }
                    
                </div>   
                
                <div className="mt-3 text-center">
                    <Button className="mx-auto" type="submit" text="Enviar" />
                </div>

            </Form>
        )
    }
}

export default ProspectoForm