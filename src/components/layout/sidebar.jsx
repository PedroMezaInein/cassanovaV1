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
        return(
            <SideNav onSelect={this.handleSelectSidebar} className="sidebar__container">
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected={location.pathname.slice(1)}>
                    {
                        MODULES.map(( module, key) => {
                            return(
                                <NavItem key={key} url={module.url} subnavClassName="subnav" eventKey={module.slug}>
                                    <NavIcon className="sidebar__icon">
                                        <FontAwesomeIcon className="sidebar__icon" icon={module.icon} />
                                    </NavIcon>
                                    <NavText className="sidebar__text">
                                        <span  className="sidebar__text">{module.name}</span>
                                    </NavText>
                                    {
                                        module.sub.map((submodule, key) => {
                                            return(
                                                <NavItem key={key} url={submodule.url} eventKey={module.slug+'/'+submodule.slug}>
                                                    <NavIcon>
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon  className="subnav__icon" icon={submodule.icon} />
                                                            <div className="mx-2">
                                                                <span className="subnav__text">
                                                                    {submodule.name}
                                                                </span>
                                                            </div>
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