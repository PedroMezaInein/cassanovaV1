import React, { Component } from 'react'
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

class TagInput extends Component {

    render() {
        const { placeholder,tags,onChange} = this.props 
        return ( 
            <div >
                <label className="col-form-label">{placeholder}</label>
                <ReactTagInput 
                    tags={tags} 
                    placeholder={placeholder}
                    editable={true}
                    readOnly={false}
                    removeOnBackspace={true}
                    onChange={onChange}
                />
            </div>
        )
    }
}

export default TagInput 