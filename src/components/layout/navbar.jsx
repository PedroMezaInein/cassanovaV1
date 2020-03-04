import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from '../form-components/Button';
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons'
import { Small } from '../texts'

const CustomToggle = React.forwardRef(({ children, onClick, drop, userName }, ref) => (
    <div 
        onClick= { e => { e.preventDefault(); onClick(e); } }
        drop={'right'}
        >
        <div className="d-flex flex-column align-items-center" >
            <Button text=''
                icon={faUserCircle}
                color="transparent" 
                className="icon"
                />
            <Small color='gold' className={'small'}>
                {userName}
            </Small>
        </div>
        
    </div>
));
class navbar extends Component{
    render(){
        const { children, clickLogout, authUser: { user: { name: userName } }, clickResponsiveMenu } = this.props
        return(
            <div className="navbar__container ">
                <Navbar>
                    <Button text=''
                        icon={faBars}
                        color="transparent" 
                        className="icon d-md-none"
                        onClick={clickResponsiveMenu}
                        />
                    <Navbar.Brand className="ml-auto">
                        <Dropdown>
                        
                            <Dropdown.Toggle 
                                as={CustomToggle} 
                                drop={'right'}
                                userName={userName}
                                />
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={clickLogout} eventKey="1">Cerrar sesión</Dropdown.Item>
                            </Dropdown.Menu>
                            
                        </Dropdown>
                            
                    </Navbar.Brand>
                </Navbar>
            </div>
        )
    }
}

export default navbar