import React from 'react'

import ReactCrop from "react-image-crop";
class ImageUpload extends React.Component {
    state = {
        src: null,
        crop: {
            unit: "px",
            width: 300,
            height: 300,
            aspect: 1 / 1
        }
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = ( crop ) => {
        const { src } = this.state
        const { onChange} = this.props
        this.setState({ crop });
        onChange({ target: { name: 'foto', value: src } })
    };

    async makeClientCrop(crop) {
        const { onChange } = this.props
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            console.log('cropped', croppedImageUrl)
            onChange({ target: { name: 'avatar', value: croppedImageUrl } })
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            const { src } = this.state
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                /* blob.name = fileName; */
                /* console.log('BLOB', blob)
                console.log('filename', fileName)
                console.log('src', src) */
                const reader = new FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = function() {
                    var base64data = reader.result;                
                    console.log(base64data, 'base64');
                    resolve(base64data);
                }
                /* window.URL.revokeObjectURL(this.fileUrl); */
                /* this.fileUrl = window.URL.createObjectURL(blob); */
                /* console.log(this.fileUrl, 'FILE URL') */
                
            }, "image/jpeg");
        });
    }

    render() {
        const { crop, croppedImageUrl, src } = this.state;
        return (
            <div>
                <div>
                    <div>
                        <input type="file" onChange={this.onSelectFile} />
                    </div>
                    {src && (
                        <ReactCrop
                            src={src}
                            crop={crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                            minHeight={300}
                            minWidth={300}
                        />
                    )}
                    {croppedImageUrl && (
                        <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                    )}
                </div>
            </div>
        )
    }
}

export default ImageUpload

// import React from 'react'
// import Avatar from 'react-avatar-edit'

// class ImageUpload extends React.Component {

//     constructor(props) {
//         super(props)
//         const src = ''
//         this.state = {
//             preview: null,
//             src
//         }
//         this.onCrop = this.onCrop.bind(this)
//         this.onClose = this.onClose.bind(this)
//         this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
//     }

//     componentDidUpdate(nextProps){
//         if (nextProps.value !== this.props.value){
//             const { value } = this.props
//             this.setState({
//                 ...this.state,
//                 src: value,
//                 preview: value
//             })
//         }
//     }

//     onClose() {
//         const { clearAvatar } = this.props
//         clearAvatar()
//     }

//     onCrop(preview) {
//         const { onChange} = this.props
//         this.setState({ preview })
//         onChange({ target: { name: 'foto', value: preview } })
//     }

//     onBeforeFileLoad(elem) {
//         if (elem.target.files[0].size > 71680) {
//             alert("¡El archivo es demasiado grande!");
//             elem.target.value = "";
//         };
//     }

//     render() {
//         console.log(this.state.preview)
//         const divStyle = {
//             color: '#80808F',
//             fontSize: 18.8,
//             fontWeight: 'bold',
//             width:'auto'
//         };
//         const divborderStyle = {
//             backgroundColor: '#ECF0F3 ',
//             // border: '2px dashed #80808F'
//         };

//         return (
//             <div className="form-group row form-group-marginless d-flex justify-content-center">
//                 <div className="col align-self-center text-center">
//                     <Avatar
//                         width={390}
//                         height={295}
//                         onCrop={this.onCrop}
//                         onClose={this.onClose}
//                         label="Elige tu foto de perfil"
//                         src={this.state.src}
//                         labelStyle={divStyle}
//                         borderStyle={divborderStyle}
//                         minCropRadius={30}
//                         exportSize={390}
//                         exportQuality={1.0}
//                     />
//                 </div>
//                 {
//                     this.state.preview?
//                         <div className="col align-self-center text-center">
//                             <img src={this.state.preview} alt = 'imagen-profile' />
//                         </div>
//                     :''
//                 }
//             </div>
//         )
//     }
// }

// export default ImageUpload