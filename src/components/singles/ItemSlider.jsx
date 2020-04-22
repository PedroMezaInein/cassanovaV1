import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import {DropZone} from '../form-components'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import { Subtitle, Small } from '../texts'

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
        console.log(files, 'FILES')
    }

    render(){
        const { item, items } = this.props
        const { active } = this.state
        console.log('items', 'slider', items)
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
                                    items[active].name.substring(items[active].name.length - 3) === 'pdf' ?
                                        <div className="pdf-viewer w-100">
                                            <iframe src={items[active].url} className="w-100 h-100" />
                                        </div>
                                    :
                                        <img className="p-2 w-100" src={items[active].url} />
                                : ''
                        }
                    </div>
                    {
                        items.length > 0 ?
                            <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderNext();} }>
                                <FontAwesomeIcon icon={faCaretSquareRight} className="mr-2 text-color__dark-blue" />
                            </div>
                        : ''
                    }
                </div>
                <div>
                    {
                        items.length > 0 ?
                            <Small>
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