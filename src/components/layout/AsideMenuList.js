/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl} from "../../functions/routers"

function openSubmenu(modulo){
    let aux = document.getElementById(`submenu-${modulo}`);
    let x = document.getElementsByClassName("submenu-asidemenu");
    x.forEach(element => {
        if(element !== aux){
            element.classList.remove('d-block')
        }else{
            if (!aux.classList.contains('d-block')) {
                element.classList.add('d-block')
            }else{
                element.classList.remove('d-block')
            }       
        }
    });

}

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url)
        ? " menu-item-active menu-item-open "
        : "";
  };

  const modulos = [
    { link: '/proyectos/ventas', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: '0', 
      submodulos: [
        { link: '/dashboard/1', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: 'S 1' },
        { link: '/dashboard/2', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: 'S 2' },
        { link: '/dashboard/3', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: 'S 3' },
      ]
    },
    { link: '/dashboard', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: '1' },
    { link: '/dashboard', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: '2', 
      submodulos: [
        { link: '/dashboard/1', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: 'S 1' },
        { link: '/dashboard/2', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: 'S 2' },
        { link: '/dashboard/3', svg: '/media/svg/icons/Code/Error-circle.svg', nombre: 'S 3' },
      ] 
    }
  ]
  return (
    <>
      <ul className={`menu-nav`}>
        {
          modulos.map( (modulo, key) => {
            return(
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                modulo.link
                )}`}
                key = {key}
                aria-haspopup="true"
                data-menu-toggle="hover"
                >
                  
                <div className="menu-link menu-toggle" to={modulo.link}>
                <span className="svg-icon menu-icon">
                  <SVG
                      src={toAbsoluteUrl(modulo.svg)}
                  />
                </span>
                <NavLink className="menu-text menu-link" to={modulo.link}>{modulo.nombre}</NavLink>
                  {
                      modulo.submodulos ? 
                        <i className="menu-arrow"  onClick = { () => { openSubmenu(modulo.nombre) } }/>
                      : ''
                  }
                  
                </div>
                {
                  modulo.submodulos ?
                    <div className="menu-submenu submenu-asidemenu" id = {`submenu-${modulo.nombre}`}>
                      <i className="menu-arrow"  />
                        <ul className="menu-subnav">
                          <li className="menu-item  menu-item-parent" aria-haspopup="true">
                            <span className="menu-link">
                              <span className="menu-text">{modulo.nombre}</span>
                            </span>
                          </li>
                          {
                            modulo.submodulos.map( (submodulo) => {
                              return(
                                <li
                                  className={`menu-item ${getMenuItemActive(submodulo.link)}`}
                                  aria-haspopup="true"
                                  >
                                    <NavLink className="menu-link" to={submodulo.link}>
                                      <span className="svg-icon menu-icon">
                                        <SVG
                                          src={toAbsoluteUrl(submodulo.svg)}
                                        />
                                      </span>
                                      <span className="menu-text">{submodulo.nombre}</span>
                                    </NavLink>
                                </li>
                              )
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
