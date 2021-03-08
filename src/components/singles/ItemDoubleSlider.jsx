import React, { Component } from 'react'
import { DropZone } from '../form-components'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import { ShowFile } from './ShowFile';

export class ItemDoubleSlider extends Component {

    state = {
        active: 0
    }

    sliderBack = () => {
        let { active } = this.state
        const { items, handleChange } = this.props
        if (handleChange) {
            if (active === 0) active = items.length
            else active = active - 1
            this.setState({ ...this.state, active })
        } else {
            if (active === 0) active = items.length - 1
            else active = active - 1
            this.setState({ ...this.state, active })
        }
    }

    sliderNext = () => {
        let { active } = this.state
        const { items, handleChange } = this.props
        if (handleChange) {
            if (active === items.length) active = 0
            else active = active + 1 
            this.setState({ ...this.state, active })
        } else {
            if (active === items.length - 1) active = 0
            else active = active + 1
            this.setState({ ...this.state, active })
        }

    }

    handleChange = files => {
        const { handleChange, item } = this.props
        handleChange(files, item)
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

    render(){
        const { items, multiple, accept, handleChange, deleteFile } = this.props
        const { active } = this.state
        return(
            <>
                <div className = 'd-flex justify-content-center align-items-center'>
                    {
                        this.isEnablePrevButton() ?
                            <div className = 'cursor' onClick = { (e) => { e.preventDefault(); this.sliderBack(); } }>
                                <div className = 'btn btn-default font-weight-bold small-button'>
                                    <span className = 'svg-icon svg-icon-bold small-button'>
                                        <SVG src={toAbsoluteUrl('/images/svg/double-arrow-left.svg')} />
                                    </span>
                                </div>
                            </div>
                        : <></>
                    }
                    <div className = 'w-80'>
                        {
                            items.length === active && handleChange ?
                                <div className="rounded w-50 d-flex mx-auto justify-content-center align-items-center mt-4 pt-4">
                                    <DropZone accept = { accept } multiple = { multiple === true || multiple === false ? multiple : true }
                                        handleChange = { this.handleChange }>
                                        <div className = "dropzone-msg dz-message needsclick">
                                            <div className = "row d-flex justify-content-center align-items-center">
                                                <span className = " col-md-12 pb-3 svg-icon svg-icon-primary svg-icon svg-icon-5x">
                                                    <SVG src = { toAbsoluteUrl('/images/svg/upload-arrow.svg') } />
                                                </span>
                                                <p className = "font-size-h4 lead pb-2">Haga clic para cargar los archivos</p>
                                            </div>
                                        </div>
                                    </DropZone>
                                </div>
                            : 
                                items.length > 0 ?
                                    <div className = 'row mx-0 justify-content-center mt-4'>
                                        {
                                            items[active].xml &&
                                                <div className = { items[active].pdf ? 'col-md-6 px-2' : 'col-md-10 px-2'}>
                                                    <ShowFile item = { items[active].xml } />
                                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                                        <div className="text-center">
                                                            <a href = { items[active].xml.url } target = '_blank' rel = "noopener noreferrer" 
                                                                className = "text-muted text-hover-primary font-weight-bold" >
                                                                <span className = "svg-icon svg-icon-md svg-icon-gray-500 mr-1" >
                                                                    <SVG src = { toAbsoluteUrl('/images/svg/Attachment1.svg') } />
                                                                </span>
                                                                Ver archivo
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                        {
                                            items[active].pdf &&
                                                <div className = { items[active].xml ? 'col-md-6 px-2' : 'col-md-10 px-2'}>
                                                    <ShowFile item = { items[active].pdf } />
                                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                                        <div className="text-center">
                                                            <a href = { items[active].pdf.url } target = '_blank' rel = "noopener noreferrer" 
                                                                className = "text-muted text-hover-primary font-weight-bold" >
                                                                <span className = "svg-icon svg-icon-md svg-icon-gray-500 mr-1" >
                                                                    <SVG src = { toAbsoluteUrl('/images/svg/Attachment1.svg') } />
                                                                </span>
                                                                Ver archivo
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                : ''
                            
                        }
                    </div>
                    {
                        this.isEnableNextButton() ?
                            <div className = 'cursor' onClick = { (e) => { e.preventDefault(); this.sliderNext(); } }>
                                <div className = 'btn btn-default font-weight-bold small-button'>
                                    <span className = 'svg-icon svg-icon-bold small-button'>
                                        <SVG src={toAbsoluteUrl('/images/svg/double-arrow-right.svg')} />
                                    </span>
                                </div>
                            </div>
                        : <></>
                    }
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <div>
                        {
                            items.length > 0 && active !== items.length ? 
                                deleteFile && items[active].id ?
                                    <span className="btn btn-text-danger btn-hover-danger p-2" onClick={(e) => { e.preventDefault(); deleteFile(items[active]) }} >
                                        <i className='fas fa-trash pr-0'></i>
                                    </span>
                                : ''
                            : ''
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default ItemDoubleSlider