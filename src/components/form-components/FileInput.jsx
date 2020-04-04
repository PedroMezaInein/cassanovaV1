import React, { Component } from 'react'
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DARK_BLUE } from '../../constants';
import { Badge } from 'react-bootstrap';

class FileInput extends Component{
    render(){
        const { onChangeAdjunto, placeholder, value, name, id, accept, files, deleteAdjunto, ... props} = this.props
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
                    {
                        files.map((file, key) => {
                            return(
                                <Badge variant = "light" key = { key } className="d-flex px-3 align-items-center" pill>
                                    <FontAwesomeIcon
                                        icon = { faTimes }
                                        onClick = { (e) => { e.preventDefault(); deleteAdjunto(name, key) }}
                                        className = "small-button mr-2" />
                                        {
                                            file.name
                                        }
                                </Badge>
                            )
                        })
                    }
                </div>
            </>
        )
    }
}

export default FileInput