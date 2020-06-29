import React, { Component } from 'react'
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DARK_BLUE } from '../../constants';
import { Badge } from 'react-bootstrap';
import {  Small } from '../texts'

class FileInput extends Component{
    
    state = {
        fileValido: !this.props.requirevalidation
    }

    validarFileInput(e){         
        const { value } = e.target 
        const {requirevalidation}= this.props
        if(value !== '' && value !== null && value !== undefined)
        {
            if(requirevalidation){      
                    if(value > 0){
                        this.setState({
                            fileValido: true
                        })
                    }else{
                        this.setState({
                            fileValido: false     
                            
                        })
                    } 
            }else{
                this.setState({
                    fileValido: true     
                    
                })
            }
        }else{
            if(requirevalidation){
                this.setState({
                    fileValido: false
                })
            }else{
                this.setState({
                    fileValido: true
                })
            }
            
        }
    }

    /*validarFileInput(e){
        const { value } = e.target
        const {requirevalidation}= this.props
        if(requirevalidation){        
            if(value > 0){
                this.setState({
                    fileValido: false
                })
            }else{
                this.setState({
                    fileValido: true     
                    
                })
            }
        }else{
            this.setState({
                fileValido: true  
            })
        }
    }*/

    componentDidUpdate(nextProps){
        if(nextProps.value !== this.props.value)
            if(!nextProps.requirevalidation)
            {
                this.setState({
                    ... this.state,
                    fileValido: true
                })
            }else{
                if(this.props.value !== '')
                {
                    this.validarFileInput({ target: { value: this.props.value } })
                }
            }
            
    }
    
    componentDidMount(){
        const { formeditado, value, name } = this.props
        if(formeditado){
            this.validarFileInput({ target: { value: value } })
        }
    }

    render(){
        const { onChangeAdjunto, placeholder, value, name, id, accept, files, deleteAdjunto, messageinc, deleteAdjuntoAvance, _key, ... props} = this.props
        const { fileValido } = this.state
        return(
            <>
                <label className = "col-form-label ">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={"fas fa-paperclip m-0 kt-font-boldest text-primary"}></i> 
                    </span>
                    <div className={'custom-file'}> 
                        <input 
                            //onChange = { onChangeAdjunto }
                            onChange={ (e) => { e.preventDefault(); this.validarFileInput(e); onChangeAdjunto(e) }} 
                            value = { value }
                            name = { name }
                            type = "file"
                            id = { id }
                            accept = { accept }
                            { ... props}
                            className={ fileValido ? " custom-file-input is-valid " : " custom-file-input is-invalid" }
                        /> 
                        <label className="custom-file-label" htmlFor="customFile"></label>
                    </div>                    
                </div>
                <span className={ fileValido ? "form-text text-danger hidden" : "form-text text-danger"}> {messageinc} </span>
                <div className="flex-wrap d-flex">
                    {
                        files.map((file, key) => {
                            return(
                                <Badge variant = "light" key = { key } className="d-flex px-3 align-items-center" pill>
                                    <FontAwesomeIcon
                                        icon = { faTimes }
                                        onClick = 
                                            { 
                                                deleteAdjunto 
                                                    ? (e) => { e.preventDefault(); deleteAdjunto(name, key); } 
                                                    : deleteAdjuntoAvance 
                                                        ? 
                                                            (e) => { e.preventDefault(); deleteAdjuntoAvance(name, key, _key) } 
                                                        : ''
                                            }
                                        className = "small-button mr-2" />
                                        {
                                            file.url ? 
                                                <a href={file.url} target="_blank">
                                                    <Small>
                                                        {
                                                            file.name
                                                        }
                                                    </Small>
                                                </a>
                                            :
                                                <Small>
                                                    {
                                                        file.name
                                                    }
                                                </Small>
                                        }
                                </Badge>
                            )
                        })
                    }</div>

            </>
        )
    }
}

export default FileInput