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
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = function() {
                    var base64data = reader.result;
                    resolve(base64data);
                }
                
            }, "image/jpeg");
        });
    }

    render() {
        const { crop, croppedImageUrl, src } = this.state;
        return (
            <div>
                <div>
                    <div className="d-flex justify-content-center">
                        <span>
                            <label htmlFor="file-upload" className="btn btn-sm btn-bg-light btn-hover-light-primary text-dark-50 text-hover-primary font-weight-bolder font-size-lg py-3 btn btn-primary">
                                <i className="la la-photo text-primary mr-1 icon-xl"></i>SUBIR FOTO DE PERFIL
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                onChange={this.onSelectFile}
                                accept="image/*, application/pdf"
                            />
                        </span>
                    </div>
                        <>
                            {
                                src && (
                                    <ReactCrop
                                        src={src}
                                        crop={crop}
                                        onImageLoaded={this.onImageLoaded}
                                        onComplete={this.onCropComplete}
                                        onChange={this.onCropChange}
                                        minHeight={300}
                                        minWidth={300}
                                    />
                                )
                            }
                            {
                                croppedImageUrl && ( <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} /> )
                            }
                        </>
                </div>
            </div>
        )
    }
}

export default ImageUpload