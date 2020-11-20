import React, { Component } from 'react'
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

class TagInput extends Component {

    render() {
        const [tags, setTags] = React.useState(["example tag"])
        const { error, onChange, placeholder} = this.props 
        return (
            <div >
                <label className="col-form-label">{placeholder}</label>
                <ReactTagInput 
                    tags={tags} 
                    placeholder="Type and press enter" 
                    editable={true}
                    readOnly={false}
                    removeOnBackspace={true}
                    onChange={(newTags) => setTags(newTags)}
                />
            </div>
        )
    }
}

export default TagInput 