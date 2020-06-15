import React, { Component } from 'react'
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DARK_BLUE } from '../../constants';
import { Badge } from 'react-bootstrap';
import {  Small } from '../texts'

class FileInput extends Component{
    render(){
        const { onChangeAdjunto, placeholder, value, name, id, accept, files, deleteAdjunto, deleteAdjuntoAvance, _key, ... props} = this.props
        return(
            <>
                <label className = "mt-2 mb-1 label-form form-label">
                    {placeholder}
                </label>
                <div className="image-upload d-flex align-items-center">
                    <div className={'no-label'}>
                        <Input onChange = { onChangeAdjunto } value = { value } name = { name } type = "file" id = { id }
                            accept = { accept } { ... props} />
                    </div>
                    <label htmlFor = {id}>
                        <FontAwesomeIcon className = "p-0 font-unset mr-2" icon={  faPaperclip } color={ DARK_BLUE } />
                    </label>
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