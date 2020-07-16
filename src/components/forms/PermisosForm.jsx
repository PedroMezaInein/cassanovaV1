import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV, ICONS_MODULES, DARK_BLUE, L_BLUE, BONE } from '../../constants'
import { ToggleButton, Button } from '../form-components'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Subtitle, Small } from '../texts'
import {Accordion, Card} from 'react-bootstrap'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import swal from 'sweetalert'
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

    setGrupos = grupos => {
        let { activeKey } = this.state
        activeKey = grupos[0].slug
        let auxActive = null
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
            if((auxActive === null && aux)){
                if(auxActive === null){
                    auxActive = key
                }
            }
            gruposObject.push({checked: aux, modulos: modulosObject, name: slugGrupo, nombre: nombre, icon: icon})
        })

        this.setState({
            ... this.state,
            grupos: gruposObject,
            activeKey: auxActive ? grupos[auxActive].slug : activeKey
        })
    }

    async componentDidMount(){
        const { authUser: {access_token: access_token}, history, user } = this.props
        if(!access_token)
            history.push('/login')
        await axios.get(URL_DEV + 'modulos/user/'+user, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {modulos:  grupos} } = response
                this.setGrupos(grupos);
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    }).then((result) => {
                        if(result.value)
                            history.push('/login')
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        const { grupos } = this.state
        const { user } = this.props
        this.setPermisosAxios(user, grupos);
    }

    async setPermisosAxios(user, data){
        const { authUser: {access_token: access_token}, history, handleClose } = this.props
        if(!access_token)
            history.push('/login')
        await axios.put(URL_DEV + 'modulos/user/'+user, {grupos: data}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {modulos:  grupos} } = response
                this.setGrupos(grupos);
                handleClose();
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Actualizaste los permisos.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }
    

    render(){
        const { grupos, activeKey } = this.state
        
        return(
            <form onSubmit={this.handleSubmit}>
                {/* <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                    Click me!
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>Hello! I'm the body</Card.Body>
                    </Accordion.Collapse>
                </Card> 
                </Accordion> */}
                <Accordion activeKey={activeKey} className="accordion accordion-light ">
                    {
                        grupos !== null && grupos.map((grupo, key) => {
                            const { ... modulos } = grupo
                            return(
                                <div key={key}>  
                                    <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey={grupo.name} onClick={() => this.handleAccordion(grupo.name)}> 
                                        <div className="d-flex align-items-center">
                                            
                                            <div className="card-title collapsed">{grupo.nombre}</div>
                                            <ToggleButton  
                                                { ...grupo} 
                                                        onToggle={(e) => this.handleGroupToggler(e)}
                                                        leftBG={BONE}
                                                        rightBG={L_BLUE}
                                                        borderColor={DARK_BLUE}
                                                        knobColor={DARK_BLUE}
                                                        />
                                            
                                        </div>
                                    </Accordion.Toggle>          
                                    <Accordion.Collapse eventKey={grupo.name}>
                                        <Card.Body>
                                            <div className="row mx-0 mt-2">
                                                {
                                                    grupo.modulos.map((modulo, key) => {
                                                        return(
                                                            <div key={key} className="col-md-2 pt-4 px-3">
                                                                <div className="text-center">
                                                                    {/* <FontAwesomeIcon className="mx-3 text-color__gold-80" icon={ICONS_MODULES[modulo.icon]} /> */}
                                                                </div>
                                                                <div className="text-center">
                                                                    <Small color="dark-blue-80">{modulo.nombre}</Small>    
                                                                </div>
                                                                <div className="d-flex justify-content-center">
                                                                    <Form.Check name={modulo.name} type="checkbox" checked={modulo.checked} onChange={ this.handleCheckbox(modulo) }/>
                                                                </div>                                                
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                    <hr className="divider" />
                                
                                </div>
                            )
                        })
                    }
                </Accordion>
                <div className="d-flex justify-content-center my-3">
                    <Button  icon='' type="submit" className="text-center mx-auto" text='Confirmar' />
                </div>
            </form>
        )
    }
}

export default PermisosForm