import React, { Component } from 'react'
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

class TagInput extends Component {
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
                        placeholder={placeholder}
                        editable={true}
                        readOnly={false}
                        removeOnBackspace={true}
                        onChange={onChange}
                    />
                </div>
                
            </div>
        )
    }
}

export default TagInput 