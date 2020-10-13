import React from 'react'
import Avatar from 'react-avatar-edit'
class ImageUpload extends React.Component {
    constructor(props) {
        super(props)
        const src = ''
        this.state = {
            preview: null,
            src
        }
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
    }
    onClose() {
        this.setState({ preview: null })
    }
    onCrop(preview) {
        const { onChange} = this.props
        this.setState({ preview })
        onChange({ target: { name: 'foto', value: preview } })
    }
    onBeforeFileLoad(elem) {
        if (elem.target.files[0].size > 71680) {
            alert("¡El archivo es demasiado grande!");
            elem.target.value = "";
        };
    }
    render() {
        const divStyle = {
            color: '#80808F',
            fontSize: 18.8,
            fontWeight: 'bold',
            width:'auto'
        };
        const divborderStyle = {
            backgroundColor: '#ECF0F3 ',
            // border: '2px dashed #80808F'
        };
        
        return (
            <div className="form-group row form-group-marginless d-flex justify-content-center">
                <div className="col align-self-center text-center">
                    <Avatar
                        width="auto"
                        height={250}
                        onCrop={this.onCrop}
                        onClose={this.onClose}
                        label="Elige tu foto de perfil"
                        src={this.state.src}
                        labelStyle={divStyle}
                        borderStyle={divborderStyle}
                    />
                </div>
                {
                    this.state.preview?
                        <div className="col align-self-center text-center">
                            <img src={this.state.preview} />
                        </div>
                    :''
                }
                
            </div>
        )
    }
}

export default ImageUpload