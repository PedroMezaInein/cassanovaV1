import React from 'react';
import {AsideMenuList} from "./AsideMenuList";
import ScrollBar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

export default function NewAsideMenu({props}) { 
  function asideOnMouseEnter(e) { 
    if(!document.body.classList.contains('open-f')){    
      document.body.classList.remove('aside-minimize'); 
      document.body.classList.add('aside-minimize-hover'); 
    }
  }
  function asideOnMouseLeave(e) {    
    if(!document.body.classList.contains('open-f')){
      document.body.classList.remove('aside-minimize-hover'); 
      document.body.classList.add('aside-minimize'); 
    }
  }

  function openAside(){  
    if(document.body.classList.contains('aside-minimize') || document.body.classList.contains('aside-minimize-hover') )
    {
      document.body.classList.remove('aside-minimize'); 
      document.body.classList.remove('aside-minimize-hover');       
      document.body.classList.add('open-f');
    }
    else
    {
      document.body.classList.add('aside-minimize');
      document.body.classList.remove('open-f');      
    } 
  }
    return ( 
      <> 
      
        <div id="aside" onMouseEnter={asideOnMouseEnter} onMouseLeave={asideOnMouseLeave} className="aside aside-left aside-fixed d-flex flex-column flex-row-auto" >

            <div className="brand flex-column-auto" >
              <a href="/mi-proyecto" className="brand-logo">
                <img alt="Logo" src="/dashboard.png" />
              </a> 
              <button className="brand-toggle btn btn-sm px-0" onClick = { () => { openAside() } } >
                  <span className="svg-icon svg-icon svg-icon-xl">
                    <SVG src={toAbsoluteUrl('/images/svg/Angle-double-left.svg')} />
                  </span>
              </button>
            </div>

            <div className="aside-menu-wrapper flex-column-fluid">     
              <div className="aside-menu h-90" >
              <ScrollBar>
                <AsideMenuList  props = {props}/>
              </ScrollBar>            
              </div>              
            </div>
        </div> 
      </>
    );
  }