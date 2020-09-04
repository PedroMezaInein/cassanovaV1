import React, { Component } from 'react'
import { DropZone } from '../form-components'
import { Small} from '../texts'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

class ItemSlider extends Component {

    state = {
        active: 0
    }

    sliderBack = () => {
        let { active } = this.state
        const { items, handleChange } = this.props
        if (handleChange) {
            if (active === 0) {
                active = items.length
            } else {
                active = active - 1
            }
            this.setState({
                ... this.state,
                active
            })
        } else {
            if (active === 0) {
                active = items.length - 1
            } else {
                active = active - 1
            }
            this.setState({
                ... this.state,
                active
            })
        }
    }

    sliderNext = () => {
        let { active } = this.state
        const { items, handleChange } = this.props
        if (handleChange) {
            if (active === items.length) {
                active = 0
            } else {
                active = active + 1
            }
            this.setState({
                ... this.state,
                active
            })
        } else {
            if (active === items.length - 1) {
                active = 0
            } else {
                active = active + 1
            }
            this.setState({
                ... this.state,
                active
            })
        }

    }

    componentWillReceiveProps(nextProps) {
        this.state.active = 0
    }

    handleChange = files => {
        const { handleChange, item } = this.props
        handleChange(files, item)
    }

    isImage = string => {
        let aux = string.substring(string.length - 3);
        if (aux.toUpperCase() === 'JPG' || aux.toUpperCase() === 'GIF' || aux.toUpperCase() === 'PNG')
            return true
        aux = string.substring(string.length - 4);
        if (aux.toUpperCase() === 'JPEG')
            return true
        return false
    }

    downloadFile = item => {
        const url = item.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.name);
        document.body.appendChild(link);
        link.click();
    }

    render() {
        const { items, deleteFile, handleChange, multiple } = this.props
        const { active } = this.state
        return (
            <>
                <div className="d-flex justify-content-center align-items-center">
                    {
                        items.length > 0 ?
                            <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderBack(); }}>
                                <div className="btn btn-default font-weight-bold small-button">
                                    <span className="svg-icon svg-icon-lg mr-0">
                                        <SVG src={toAbsoluteUrl('/images/svg/double-arrow-left.svg')} />
                                    </span>
                                </div>
                            </div>
                            : ''
                    }
                    <div className="text-center p-2">
                        {
                            items.length === active && handleChange ?
                                <div className="rounded w-100 d-flex justify-content-center align-items-center">
                                    <DropZone multiple = { multiple === true || multiple === false ? multiple : true} handleChange={this.handleChange} >
                                        <div className="dropzone-msg dz-message needsclick">
                                            <div className="row d-flex justify-content-center align-items-center">
                                                <span className=" col-md-12 pb-3 svg-icon svg-icon-primary svg-icon svg-icon-5x">
                                                    <SVG src={toAbsoluteUrl('/images/svg/upload-arrow.svg')} />
                                                </span>
                                                <p className="font-size-h4 lead pb-2">Haga clic para cargar los archivos</p>
                                            </div>
                                        </div>
                                    </DropZone>
                                </div>
                                :
                                items.length > 0 ?
                                    <>
                                        <div>
                                            {
                                                (items[active].name.substring(items[active].name.length - 3)).toUpperCase() === 'PDF' ?
                                                    <div className="w-100 pb-2">
                                                        <iframe src={items[active].url} className="pdfview" />
                                                    </div>
                                                    :
                                                    this.isImage(items[active].name) ?
                                                        <img className="p-2 rounded pdfview-img" src={items[active].url} style={{ width: "100", height: "100" }} />
                                                        :
                                                        <div id="descarga" className="btn btn-hover p-2 rounded pdfview d-flex align-items-center justify-content-center mx-auto" onClick={() => { this.downloadFile(items[active]) }}>
                                                            <div>
                                                                <i className={"fas fa-file m-0 kt-font-boldest text-primary"}></i>
                                                                <br />
                                                                <Small className="text-center" color="gold">
                                                                    Descarga
                                                                </Small>
                                                            </div>
                                                        </div>
                                            }
                                        </div>
                                        {
                                            deleteFile && items[active].id ?
                                                <div className="d-flex justify-content-center">

                                                    <span className="btn btn-text-danger btn-hover-danger" onClick={(e) => { e.preventDefault(); deleteFile(items[active]) }} >
                                                        <i className='fas fa-trash pr-0'></i>
                                                    </span>

                                                </div>
                                                : ''
                                        }
                                    </>
                                    : ''
                        }
                    </div>
                    {
                        items.length > 0 ?
                            <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderNext(); }}>
                                <div className="btn btn-default font-weight-bold small-button">
                                    <span className="svg-icon svg-icon-lg mr-0">
                                        <SVG src={toAbsoluteUrl('/images/svg/double-arrow-right.svg')} />
                                    </span>
                                </div>
                            </div>
                            : ''
                    }
                </div>
                <div className="text-center">
                    {
                        items.length > 0 && active !== items.length ? 
                        <>
                            <a href={items[active].url} target='_blank' className="text-muted text-hover-primary font-weight-bold mr-lg-8 mr-5 mb-lg-0 mb-2">
                                <span class="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                    <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
								</span>
                                    Ver archivo
                                    {/* {
                                        items[active].name
                                    } */}
                            </a>
                        </>
                        : ''
                    }
                </div>
            </>
        )
    }
}

export default ItemSlider