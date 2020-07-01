import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import {DropZone} from '../form-components'
import { faImages, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Subtitle, Small } from '../texts'
import { Button } from '../form-components'

class ItemSlider extends Component{

    state = {
        active: 0
    }

    sliderBack = () => {
        let { active } = this.state
        const { items, handleChange } = this.props
        if(handleChange){
            if( active === 0){
                active = items.length 
            }else
            {
                active = active - 1
            }
            this.setState({
                ... this.state,
                active
            })
        }else{
            if( active === 0){
                active = items.length - 1
            }else
            {
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
        if(handleChange){
            if( active === items.length){
                active = 0
            }else
            {
                active = active + 1
            }
            this.setState({
                ... this.state,
                active
            })
        }else{
            if( active === items.length - 1){
                active = 0
            }else
            {
                active = active + 1
            }
            this.setState({
                ... this.state,
                active
            })
        }
        
    }

    componentWillReceiveProps(nextProps){
        this.state.active = 0
    }

    handleChange = files => {
        const { handleChange, item } = this.props
        handleChange(files, item)
    }

    render(){
        const { items, deleteFile, handleChange } = this.props
        const { active } = this.state
        return(
            <>
                <div className="d-flex w-100 align-items-center">
                    {
                        items.length > 0 ?
                            <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderBack();} }>
                                <span className="btn btn-text-white btn-bg-blue btn-hover-white small-button">
                                    <i className='fas fa-arrow-left pr-0'></i> 
                                </span>
                            </div>
                        : ''
                    }
                    <div className="w-100 text-center p-2">
                        {
                            items.length === active && handleChange ?
                                <div className="border rounded w-100 border__dashed">
                                    <DropZone accept = "application/pdf, image/*"  handleChange = { this.handleChange } >
                                        <Subtitle className="text-center p-5 " color="gold">
                                            <FontAwesomeIcon icon = { faImages } className="text-color__gold"/>
                                            <br />
                                            <Small color="gold">
                                                Adjunta archivos
                                            </Small>
                                        </Subtitle>
                                    </DropZone>
                                </div>
                            :
                                items.length > 0 ?
                                    <>
                                        <div>
                                            {items[active].name.substring(items[active].name.length - 3) === 'pdf' ?
                                                <div className="pdf-viewer w-100 pb-2">
                                                    <iframe src={items[active].url} className="w-100" />
                                                </div>
                                            :
                                                <img className="p-2 w-100" src={items[active].url} />}
                                        </div>
                                        {
                                            deleteFile ? 
                                                <div className="d-flex justify-content-center">

                                                    <span className="btn btn-text-danger btn-hover-danger" onClick={(e) => { e.preventDefault(); deleteFile(items[active]) } } >
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
                        items.length > 0  ?
                            <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderNext();} }>
                                <span className="btn btn-text-white btn-bg-blue btn-hover-white small-button">
                                    <i className='fas fa-arrow-right pr-0'></i> 
                                </span>
                            </div>
                        : ''
                    }
                </div>
                <div className="text-center">
                    {
                        items.length > 0 && active !== items.length ?
                            <Small className="text-center" color="gold">
                                <a href = {items[active].url} target = '_blank'>
                                    {
                                        items[active].name
                                    }        
                                </a>
                            </Small>
                        : ''
                    }
                </div>
            </>
        )
    }
}

export default ItemSlider