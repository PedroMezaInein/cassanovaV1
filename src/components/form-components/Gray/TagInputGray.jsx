import React, { Component } from 'react'
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
// import { messageAlert } from '../../../functions/alert'

class TagInputGray extends Component {
    render() {
        const { placeholder, tags, onChange,iconclass } = this.props
        return (
            <div >
                <label className="col-form-label">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-primary"} style={{zIndex:'2'}}></i>
                    </span>
                    <ReactTagInput
                        tags={tags}
                        placeholder={'PRESIONA ENTER PARA AGREGAR'}
                        editable={true}
                        readOnly={false}
                        removeOnBackspace={true}
                        onChange={onChange}
                        // validator={(value) => {
                        //     // Don't actually validate e-mails this way
                        //     const isEmail = value.indexOf("@") !== -1;
                        //     if (!isEmail) {
                        //         messageAlert("LA DIRECCIÓN DEL CORREO ELECTRÓNICO ES INCORRECTA");
                        //     }
                        //     // Return boolean to indicate validity
                        //     return isEmail;
                        // }}
                    />
                </div>
                
            </div>
        )
    }
}

export default TagInputGray 