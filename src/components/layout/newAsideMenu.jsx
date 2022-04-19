import React, { Component } from 'react';
import AsideMenuList from "./AsideMenuList";
import Scrollbar from 'perfect-scrollbar-react';
import 'perfect-scrollbar-react/dist/style.min.css';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

class NewAsideMenu extends Component{

    asideOnMouseEnter = e => {
        if(!document.body.classList.contains('open-f')){    
            document.body.classList.remove('aside-minimize'); 
            document.body.classList.add('aside-minimize-hover');
        }
    }

    asideOnMouseLeave = (e) => {    
        if(!document.body.classList.contains('open-f')){
            document.body.classList.remove('aside-minimize-hover'); 
            document.body.classList.add('aside-minimize'); 
        }
    }

    render(){
        const { props } = this.props
        return(
            <div id = "aside" onMouseEnter = { this.asideOnMouseEnter } onMouseLeave = { this.asideOnMouseLeave } 
                className="aside aside-left aside-fixed d-flex flex-column flex-row-auto" >
                 <div className="brand flex-column-auto" >
                    {/*<a href="/mi-proyecto" className="brand-logo">
                        <i className = 'fas fa-home home-icon-menu' />
                    </a> */}
                    <span className="brand-toggle btn btn-sm px-0"> 
                        <span className="svg-icon svg-icon svg-icon-xl">
                            <SVG src={toAbsoluteUrl('/images/svg/Angle-double-left.svg')} />
                        </span>
                    </span>
                </div> 
                <div className="aside-menu-wrapper flex-column-fluid">     
                    <div className="aside-menu my-4" id = "asideMenuScroll" style={{ display: 'flex', maxHeight: '629px'}}>
                        <Scrollbar>
                            <AsideMenuList  props = {props}/>
                        </Scrollbar>
                    </div>
                </div>
            </div> 
        )
    }
}

export default NewAsideMenu