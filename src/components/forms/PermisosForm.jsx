import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV, ICONS_MODULES } from '../../constants'
import { ToggleButton, Button } from '../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Subtitle, Small } from '../texts'
import Accordion from 'react-bootstrap/Accordion'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'

class PermisosForm extends Component{

    state = {
        toggle: false,
        grupos: null,
        activeKey: ''
    }

    constructor(props){
        super(props)
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    handleAccordion = eventKey => {
        const { grupos } = this.state;
        const { activeKey } = this.state
        let aux = activeKey
        grupos.find(function(element, index) {
            if(element.name === eventKey && element.checked){
                aux = eventKey      
            }
        });
        this.setState({
            activeKey: aux
        })
    }

    handleGroupToggler = e => {
        const { name, checked } = e.target
        let { grupos, activeKey } = this.state
        if(!checked){
            grupos.find(function(element, index) {
                if(element.name === name){
                    grupos[index].checked = false
                    grupos[index].modulos.map((modulo) => {
                        modulo.checked = false;
                    })
                }
            });
            this.setState({
                activeKey: activeKey === name ? '' : activeKey,
                grupos
            })
        }else{
            grupos.find(function(element, index) {
                if(element.name === name){
                    grupos[index].checked = true
                }
            });
            this.setState({
                activeKey: !checked ? activeKey : name,
                grupos
            })
        }
    }

    handleCheckbox = (module) => (e) => {
        const { padre, name, checked } = module
        
        let { grupos } = this.state
        console.log(grupos)
        grupos.find(function(element, index) {
            if(element.name === padre){
                let aux = false;
                element.modulos.find(function(element, index){
                    if(element.name === name){
                        element.checked = !checked
                    }
                    aux = element.checked || aux
                })
                element.checked = aux
            }
        });

        this.setState({
            ... this.state,
            grupos: grupos
        })
    }

    async componentDidMount(){
        const { authUser: {access_token: access_token}, history, user } = this.props
        if(!access_token)
            history.push('/login')
        await axios.get(URL_DEV + 'modulos/user/'+user, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {modulos: grupos} } = response
                let { activeKey } = this.state
                activeKey = grupos[0].slug
                let gruposObject = Array()
                grupos.map((grupo, key) => {
                    
                    let aux = true
                    const { slug: slugGrupo, name: nombre, icon } = grupo
                
                    let modulosObject = Array()
                    grupo.modulos.map((modulo, key) => {
                        const { slug, name: nombre, icon } = modulo

                        if(modulo.permisos.length){
                            modulosObject.push( { checked: true, padre: slugGrupo, name: slug, nombre: nombre, icon: icon} )
                            aux = aux && true
                        }else{
                            modulosObject.push(  { checked: false, padre: slugGrupo, name: slug, nombre: nombre, icon: icon} )
                            aux = aux && false
                        }
                    })
                    
                    gruposObject.push({checked: aux, modulos: modulosObject, name: slugGrupo, nombre: nombre, icon: icon})
                })

                this.setState({
                    ... this.state,
                    grupos: gruposObject,
                    activeKey
                })
                
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    render(){
        const { grupos, activeKey } = this.state
        
        return(
            <div>
                <Accordion activeKey={activeKey}>
                    {
                        grupos !== null && grupos.map((grupo, key) => {
                            const { ... modulos } = grupo
                            return(
                                <div key={key}> 
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon className="mx-2 text-color__gold" icon={ICONS_MODULES[grupo.icon]} />
                                                <Subtitle className="mb-0 mx-2 " color="dark-blue"> 
                                                    { grupo.nombre }    
                                                </Subtitle>
                                                <ToggleButton { ...grupo} onToggle={(e) => this.handleGroupToggler(e)}/>
                                            </div>
                                        </div>
                                        {
                                            grupo.checked && <Accordion.Toggle as={Button} eventKey={grupo.name} className={"small-button "} color="transparent" icon={faPlus} text='' onClick={() => this.handleAccordion(grupo.name)} />
                                        }
                                        
                                    </div>            
                                    <Accordion.Collapse eventKey={grupo.name}>
                                        <div className="row mx-0 mt-2">
                                            {
                                                grupo.modulos.map((modulo, key) => {
                                                    return(
                                                        <div key={key} className="col-md-2 pt-4 px-3">
                                                            <div className="text-center">
                                                                <FontAwesomeIcon className="mx-3 text-color__gold-80" icon={ICONS_MODULES[modulo.icon]} />
                                                            </div>
                                                            <div className="text-center">
                                                                <Small color="dark-blue-80">{modulo.nombre}</Small>    
                                                            </div>
                                                            <div className="d-flex justify-content-center">
                                                                <Form.Check name={modulo.name} type="checkbox" checked={modulo.checked} onChange={ this.handleCheckbox(modulo) }/>
                                                                {/* <ToggleButton value={modulo.checked} ref={modulo.slug} checked={modulo.checked} name={modulo.name} onToggle={e => console.log('onToggle', e.target, e.target.checked)}/> */}
                                                            </div>                                                
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Accordion.Collapse>
                                    <hr className="divider" />
                                </div>
                            )
                        })
                    }
                </Accordion>
            </div>
        )
    }
}

export default PermisosForm