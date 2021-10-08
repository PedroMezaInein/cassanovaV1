/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl} from "../../functions/routers"

function openSubmenu(modulo){
    let aux = document.getElementById(`submenu-${modulo}`);
    let x = document.getElementsByClassName("submenu-asidemenu");
    let cont = 0;
    for(cont = 0; cont < x.length; cont ++){
        if(x[cont] !== aux){
            x[cont].classList.remove('d-block')
        }else{
            if (!aux.classList.contains('d-block')) {
                x[cont].classList.add('d-block')
            }else{
                x[cont].classList.remove('d-block')
            }       
        }
    }
}

function closeAside(){  
    if(document.body.classList.contains('aside-minimize-hover') )
    {
        document.body.classList.remove('aside-minimize-hover');       
        document.body.classList.add('aside-minimize');
    }
    else
    {            
    } 
}

function getUrlFromSub(sub){
    const { name, url } = sub
    switch(name){
        /* case 'CRM':
            return `https://leads.inein.com.mx/${url}` */
        default:
            return url;
    }
}

export function AsideMenuList({ props }) {
    /* const location = useLocation();
    const getMenuItemActive = (url) => {
        return checkIsActive(location, url)
            ? " menu-item-active menu-item-open "
            : "";
    }; */

    const modulos = props.authUser.modulos ? props.authUser.modulos : []
    return (
        <>
            <ul className={`menu-nav`}>
                {
                    modulos.map( (modulo, key) => {
                        return(
                            <li className={`menu-item menu-item-submenu`}
                                /* className={`menu-item menu-item-submenu ${getMenuItemActive(modulo.url)}`} */
                                key = {key}
                                // aria-haspopup="true"
                                data-menu-toggle="hover"
                                onClick = { () => { openSubmenu(modulo.slug) } }>
                                <div className="menu-link menu-toggle" to={modulo.url}>
                                    <span className="svg-icon menu-icon">
                                        <SVG src={toAbsoluteUrl(modulo.icon)}/>
                                    </span>
                                    {
                                        modulo.url ? 
                                            <NavLink className="menu-text menu-link text-uppercase" to={modulo.url}>{modulo.name}</NavLink>
                                        : 
                                            <span className="menu-text menu-link text-uppercase" to={modulo.url}>{modulo.name}</span>
                                    }
                                    {
                                        modulo.modulos.length > 1 || modulo.url === null  ? 
                                            <i className="menu-arrow"  onClick = { () => { openSubmenu(modulo.slug) } }/>
                                        : ''
                                    }
                                </div>
                                {
                                    modulo.modulos.length > 1 || modulo.url === null ?
                                        <div className="menu-submenu submenu-asidemenu" id = {`submenu-${modulo.slug}`}>
                                            <i className="menu-arrow"  />
                                            <ul className="menu-subnav">
                                                <li className="menu-item  menu-item-parent" 
                                                    // aria-haspopup="true"
                                                >
                                                    <span className="menu-link">
                                                        <span className="menu-text">{modulo.name}</span>
                                                    </span>
                                                </li>
                                                {
                                                    modulo.modulos.map( (submodulo) => {
                                                        let url = getUrlFromSub(submodulo)
                                                        if(url.includes('https://')){
                                                            return(
                                                                <li  key={submodulo.url} className={`menu-item `}>
                                                                    <a className="menu-link" href = { url } 
                                                                        onClick = { () => { closeAside() } }>
                                                                        <span className="svg-icon menu-icon">
                                                                            <SVG src={toAbsoluteUrl(submodulo.icon)} />
                                                                        </span>
                                                                        <span className="menu-text text-uppercase">{submodulo.name}</span>
                                                                    </a>
                                                                </li>
                                                            )
                                                        }else{
                                                            return(
                                                                <li  key={submodulo.url} className={`menu-item `}>
                                                                    <NavLink className="menu-link" to = { submodulo.url } 
                                                                        onClick = { () => { closeAside() } }>
                                                                        <span className="svg-icon menu-icon">
                                                                            <SVG src={toAbsoluteUrl(submodulo.icon)} />
                                                                        </span>
                                                                        <span className="menu-text text-uppercase">{submodulo.name}</span>
                                                                    </NavLink>
                                                                </li>
                                                            )
                                                        }
                                                        
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    : ''
                                }
                            </li>
                        )
                    })
                }
            </ul>
        </>
    );
}