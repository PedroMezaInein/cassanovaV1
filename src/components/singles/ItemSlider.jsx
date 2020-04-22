import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'

class ItemSlider extends Component{

    state = {
        active: 0
    }

    sliderBack = () => {
        let { active } = this.state
        const { items } = this.props
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

    sliderNext = () => {
        let { active } = this.state
        const { items } = this.props
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

    render(){
        const { id, items } = this.props
        const { active } = this.state
        console.log('items', 'slider', items)
        return(
            <>
                <div className="d-flex w-100 align-items-center">
                    {
                        items.length > 1 ?
                            <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderBack();} }>
                                <FontAwesomeIcon icon={faCaretSquareLeft} className="mr-2 text-color__dark-blue" />
                            </div>
                        : ''
                    }
                    <div className="w-100 text-center px-2">
                        {
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
                        items.length > 1 ?
                            <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderBack();} }>
                                <FontAwesomeIcon icon={faCaretSquareRight} className="mr-2 text-color__dark-blue" />
                            </div>
                        : ''
                    }
                </div>
            </>
        )
    }
}

export default ItemSlider