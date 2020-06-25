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
        const { items } = this.props
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
    }

    sliderNext = () => {
        let { active } = this.state
        const { items } = this.props
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
    }

    componentWillReceiveProps(nextProps){
        this.state.active = 0
    }

    handleChange = files => {
        const {item, handleChange} = this.props
        handleChange(files, item)
    }

    render(){
        const { items, deleteFile } = this.props
        const { active } = this.state
        return(
            <>
                <div className="d-flex w-100 align-items-center">
                    {
                        items.length > 0 ?
                            <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderBack();} }>
                                <FontAwesomeIcon icon={faCaretSquareLeft} className="mr-2 text-color__dark-blue" />
                            </div>
                        : ''
                    }
                    <div className="w-100 text-center p-2">
                        {
                            items.length === active ?
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
                                        <div className="d-flex justify-content-center">
                                            <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => { e.preventDefault(); deleteFile(items[active]) } } 
                                                text='' icon={faTrash} color="red" tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                                        </div>
                                    </>
                                : ''
                        }
                    </div>
                    {
                        items.length > 0  ?
                            <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderNext();} }>
                                <FontAwesomeIcon icon={faCaretSquareRight} className="mr-2 text-color__dark-blue" />
                            </div>
                        : ''
                    }
                </div>
                <div className="text-center">
                    {
                        items.length > 0 && active !== items.length ?
                            <Small className="text-center" color="gold">
                                {
                                    items[active].name
                                }
                            </Small>
                        : ''
                    }
                </div>
            </>
        )
    }
}

export default ItemSlider