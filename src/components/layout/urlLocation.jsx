import React, { Component } from 'react'
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl} from "../../functions/routers"

class UrlLocation extends Component{
    state={
        paths:[] 
    }

    componentDidMount() {       
        const { history: { location: { pathname: pathname } } } = this.props
        let aux = pathname.substr(1, pathname.length-1)
        this.setState({
            paths:aux.split('/')
        })
        
    }
    

    render(){
        console.log(this.props,"props")        
        const { paths } = this.state
        const modulos = this.props.authUser.modulos
        const active = this.props.active;
        let icon;
        let modulo_name;
        let submodulo_name;
        let submodulo;

        for (let i = 0; i < modulos.length; i ++) {
            if (modulos[i].slug == active) {
                icon = modulos[i].icon               
                modulo_name = modulos[i].name
                submodulo = modulos[i].modulos 
                for (let j = 0; j < submodulo.length; j ++) {
                    if (submodulo[j].slug ==paths[1]) {
                        submodulo_name = submodulo[j].name
                        break;
                    }else{
                    }
                }
                break;
            }else{
            }            
        }
        
        return (
            <>  
                {
                    paths.length > 0 ?
                        <div className="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader">
                            <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                                <div className="d-flex align-items-center flex-wrap mr-1">
                                    <div className="d-flex align-items-baseline mr-5">

                                        <h5 className="text-dark font-weight-bold my-2 mr-3">
                                            {                                                
                                                modulo_name
                                            }
                                        </h5>
                                        <div>                                            
                                            <span className="svg-icon menu-icon svg-icon-primary">
                                                <SVG src={toAbsoluteUrl(icon)}/>
                                            </span>
                                        </div>
                                        {
                                            paths.length > 1 ?
                                                <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                                                    <li className="breadcrumb-item">
                                                        <div href="" className="text-muted ml-3">
                                                        {
                                                            submodulo_name
                                                        }
                                                        </div>
                                                    </li>
                                                </ul>
                                            :  ""
                                        }
                                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    :  ""
                }
                
            </>
        );
    }
}

export default UrlLocation