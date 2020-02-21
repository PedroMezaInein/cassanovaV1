import React, { Component } from 'react'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MODULES } from '../../constants'

class Sidebar extends Component{
    constructor(props){
        super(props)
    }

    handleSelectSidebar = (selected) => {
        const {history} = this.props
        history.push('/'+selected)
    }

    render(){
        const { location } = this.props
        console.log( location.pathname, 'pathname' );
        return(
            <SideNav onSelect={this.handleSelectSidebar}>
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected={location.pathname.slice(1)}>
                    {
                        MODULES.map(( module, key) => {
                            return(
                                <NavItem key={key} url={module.url} subnavClassName="subnav-item-container" eventKey={module.slug}>
                                    <NavIcon>
                                        <FontAwesomeIcon icon={module.icon} />
                                    </NavIcon>
                                    <NavText>
                                        {module.name}
                                    </NavText>
                                    {
                                        module.sub.map((submodule, key) => {
                                            return(
                                                <NavItem key={key} url={submodule.url} eventKey={module.slug+'/'+submodule.slug}>
                                                    <NavIcon>
                                                        <FontAwesomeIcon icon={submodule.icon} />
                                                        <div>
                                                            <span>
                                                                {submodule.name}
                                                            </span>
                                                        </div>
                                                    </NavIcon>
                                                </NavItem>
                                            )
                                        })
                                    }
                                </NavItem>
                            )
                        })
                    }
                </SideNav.Nav>
            </SideNav>
        )
    }
}

export default Sidebar