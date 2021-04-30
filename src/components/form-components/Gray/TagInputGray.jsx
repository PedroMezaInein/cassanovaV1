import React, { Component } from 'react'
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import $ from "jquery";
// import { messageAlert } from '../../../functions/alert'
class TagInputGray extends Component {

    componentDidMount() {
        $('.react-tag-input').attr('id','react-tag-input')
    }
    render() {
        const { placeholder, tags, onChange, iconclass, letterCase } = this.props
        return (
            <div className = { letterCase === false ? 'text-no-transform' : 'text-uppercase'} >
                <label className="col-form-label font-weight-bold text-dark-60">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-dark-50"} style={{zIndex:'2'}}></i>
                    </span>
                    <ReactTagInput
                        tags = { tags }
                        placeholder = 'PRESIONA ENTER PARA AGREGAR'
                        editable = { true }
                        readOnly = { false }
                        removeOnBackspace = { true }
                        onChange = { onChange }
                    />
                </div>
                
            </div>
        )
    }
}

export default TagInputGray 