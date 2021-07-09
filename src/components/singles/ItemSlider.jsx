import React, { Component } from 'react'
import { DropZone } from '../form-components'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import { ShowFile } from './ShowFile';

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
                ...this.state,
                active
            })
        } else {
            if (active === 0) {
                active = items.length - 1
            } else {
                active = active - 1
            }
            this.setState({
                ...this.state,
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
                ...this.state,
                active
            })
        } else {
            if (active === items.length - 1) {
                active = 0
            } else {
                active = active + 1
            }
            this.setState({
                ...this.state,
                active
            })
        }

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            active: 0
        })
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

    isVideo = string => {
        let aux = string.substring(string.length - 3);
        if (aux.toUpperCase() === 'MP4')
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

    isEnablePrevButton = () => {
        const { items, handleChange } = this.props
        const { active } = this.state
        if(items.length < 1 )
            return false
        if(handleChange){
            return true
        }
        if(active === 0)
            return false
        return true
    }

    isEnableNextButton = () => {
        const { items, handleChange } = this.props
        const { active } = this.state
        if(items.length < 1 )
            return false
        if(handleChange){
            return true
        }
        if(active === items.length - 1)
            return false
        return true
    }

    render() {
        const { items, deleteFile, handleChange, multiple, accept } = this.props
        const { active } = this.state
        return (
            <>
                <div className="row mx-auto w-100">
                    <div className="w-10 align-self-center text-center">
                        {
                            this.isEnablePrevButton() ?
                                <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderBack(); }}>
                                    <div className="btn btn-white btn-hover-white font-weight-bold btn-sm mx-auto p-1">
                                        <span className="svg-icon svg-icon-xl mr-0 svg-icon-primary">
                                            <SVG src={toAbsoluteUrl('/images/svg/double-arrow-left.svg')} />
                                        </span>
                                    </div>
                                </div>
                            : ''
                        }
                    </div>
                    <div className="w-80">
                        {
                            items.length === active && handleChange ?
                                <div className="rounded w-80 d-flex justify-content-center align-items-center mx-auto">
                                    <DropZone accept = { accept } multiple = { multiple === true || multiple === false ? multiple : true} handleChange={this.handleChange} >
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
                                items.length > 0 ? <ShowFile item = { items[active] } /> : ''
                        }
                    </div>
                    <div className="w-10 align-self-center text-center">
                        {
                            this.isEnableNextButton() ?
                                <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderNext(); }}>
                                    <div className="btn btn-white btn-hover-white font-weight-bold btn-sm mx-auto p-1">
                                        <span className="svg-icon svg-icon-xl mr-0 svg-icon-primary">
                                            <SVG src={toAbsoluteUrl('/images/svg/double-arrow-right.svg')} />
                                        </span>
                                    </div>
                                </div>
                            : ''
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <div className="text-center">
                        {
                            items.length > 0 && active !== items.length ? 
                                deleteFile && items[active].id ?
                                    <span className="btn btn-text-danger btn-hover-danger p-2" onClick={(e) => { e.preventDefault(); deleteFile(items[active]) }} >
                                        <i className='fas fa-trash pr-0'></i>
                                    </span>
                                : ''
                            : ''
                        }
                        {
                            items.length > 0 && active !== items.length ? 
                                <div className="text-center">
                                    <a href={items[active].url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-primary font-weight-bold">
                                        <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                            <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                        </span>
                                        Ver archivo
                                    </a>
                                </div>
                            : ''
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default ItemSlider