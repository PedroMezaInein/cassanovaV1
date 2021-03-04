import React, { Component } from 'react'
import { DropZone } from '../form-components'
import { Small} from '../texts'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import { ShowFile } from './ShowFile';

export class ItemDoubleSlider extends Component {

    state = {
        active: 0
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
        const { items, multiple, accept, handleChange } = this.props
        const { active } = this.state
        return(
            <>
                <div className = 'd-flex justify-content-center align-items-center'>
                    {
                        this.isEnablePrevButton() ?
                            <div className = 'cursor' onClick = { (e) => { e.preventDefault(); } }>
                                <div className = 'btn btn-default font-weight-bold small-button'>
                                    <span className = 'svg-icon svg-icon-bold small-button'>
                                        <SVG src={toAbsoluteUrl('/images/svg/double-arrow-left.svg')} />
                                    </span>
                                </div>
                            </div>
                        : <></>
                    }
                    <div className="text-center p-2">
                        {
                            items.length === active && handleChange ?
                                <div className="rounded w-100 d-flex justify-content-center align-items-center mt-4 pt-4">
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
                                <div className = 'row mx-0'>
                                    <div className = 'col-md-6 px-2'>
                                        <ShowFile item = { items[active]} />
                                    </div>
                                    <div className = 'col-md-6 px-2'>
                                        <ShowFile item = { items[active]} />
                                    </div>
                                </div>
                            
                        }
                    </div>
                    {
                        this.isEnableNextButton() ?
                            <div className = 'cursor' onClick = { (e) => { e.preventDefault(); } }>
                                <div className = 'btn btn-default font-weight-bold small-button'>
                                    <span className = 'svg-icon svg-icon-bold small-button'>
                                        <SVG src={toAbsoluteUrl('/images/svg/double-arrow-right.svg')} />
                                    </span>
                                </div>
                            </div>
                        : <></>
                    }
                </div>
            </>
        )
    }
}

export default Component