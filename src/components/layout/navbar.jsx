import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from '../form-components/Button';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

const CustomToggle = React.forwardRef(({ children, onClick, drop }, ref) => (
    <div 
        onClick= { e => { e.preventDefault(); onClick(e); } }
        drop={'right'}
        >
        <Button text=''
            icon={faUserCircle}
            color="transparent" 
            className="icon"
            />
    </div>
));
class navbar extends Component{
    render(){
        const { children, clickLogout } = this.props
        return(
            <div className="navbar__container ">
                <Navbar>
                    <Navbar.Brand className="ml-auto">
                        <Dropdown>
                            <Dropdown.Toggle 
                                as={CustomToggle} 
                                drop={'right'}
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