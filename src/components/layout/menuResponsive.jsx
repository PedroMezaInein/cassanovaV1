import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICONS_MODULES } from '../../constants'
import { Accordion, useAccordionToggle } from 'react-bootstrap'
import { Subtitle } from '../texts'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../form-components'

function CustomToggle({ children, eventKey }) {
    
    const handleClick = useAccordionToggle(eventKey, (e) => {
        
    },);

    
    return (
        <div onClick={handleClick} className="menu-item">
            {children}
        </div>
    );
}
class MenuResponsive extends Component{

    constructor(props){
        const { expanded } = props
        super(props)
    }

    render(){
        const { location, authUser: { modulos: modulos}, expanded, clickResponsiveMenu } = this.props
        
        
        return(
            <div className={`position-fixed d-md-none menu-responsive ${expanded}`}>
                <div className="text-right">
                    <Button icon={faTimes} text='' color="transparent" onClick={clickResponsiveMenu} />
                </div>
                <Accordion>
                    {
                        modulos.map((modulo, key) => {
                            if(modulo.url){
                                return(
                                    <div className="menu-item" key={modulo.id}>
                                        <a href={modulo.url}>
                                            <FontAwesomeIcon  icon={ICONS_MODULES[modulo.icon]} />
                                            <span className="mx-3">{ modulo.name }</span>
                                        </a>
                                    </div>
                                )
                            }else{
                                return(
                                    <div key={modulo.id}>
                                        <CustomToggle eventKey={modulo.slug}>
                                            <FontAwesomeIcon  icon={ICONS_MODULES[modulo.icon]} />
                                            <span className="mx-3">{ modulo.name }</span>
                                        </CustomToggle>
                                        <Accordion.Collapse eventKey={modulo.slug}>
                                            <div>
                                                {
                                                    modulo.modulos.map((_modulo, key) => {
                                                        return(
                                                            <div className="px-4 py-2" key={_modulo.id}>
                                                                <a href={`/${_modulo.url}`}>
                                                                    <FontAwesomeIcon  icon={ICONS_MODULES[_modulo.icon]} />
                                                                    <span className="mx-3">{ _modulo.name }</span>
                                                                </a>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Accordion.Collapse>
                                    </div>
                                )
                            }
                        })
                    }
                </Accordion>
            </div>
        )
    }
}

export default MenuResponsive