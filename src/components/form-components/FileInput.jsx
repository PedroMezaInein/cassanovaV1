import React, { Component } from 'react'
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DARK_BLUE } from '../../constants';
import { Badge } from 'react-bootstrap';
import {  Small } from '../texts'

class FileInput extends Component{
    
    state = {
        fileValido: false
    }

    validarFileInput(e){
        const { value } = e.target
        
        if(value > 0){
            this.setState({
                fileValido: false
            })
        }else{
            this.setState({
                fileValido: true     
                
            })
        }
    }
    render(){
        const { onChangeAdjunto, placeholder, value, name, id, accept, files, deleteAdjunto, messageinc, deleteAdjuntoAvance, _key, ... props} = this.props
        const { fileValido } = this.state
        return(
            <>
                <label className = "col-form-label ">{placeholder}</label>
                <div className="input-group mb-3 ">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className={"fas fa-paperclip kt-font-boldest text-primary"}></i></span>
                    </div>
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

                    {/*<label htmlFor = {id}>
                        <FontAwesomeIcon className = "p-0 font-unset mr-2" icon={  faPaperclip } color={ DARK_BLUE } />
                    </label>*/}
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
                </div>
            </>
        )
    }
}

export default FileInput