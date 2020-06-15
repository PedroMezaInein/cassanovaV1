import React, { Component } from 'react'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons'
import { Small, P } from '../texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class SliderImages extends Component{

    state = {
        active: 0
    }

    sliderBack = () => {
        const { elements } = this.props
        let { active } = this.state
        if(active === 0)
            active = elements.length - 1 
        else
            active = active - 1
        this.setState({
            ... this.state,
            active
        })
    }

    sliderNext = () => {
        const { elements } = this.props
        let { active } = this.state
        if(active === elements.length - 1)
            active = 0 
        else
            active = active + 1
        this.setState({
            ... this.state,
            active
        })
    }

    render(){
        const { active } = this.state
        const { elements, ... props } = this.props
        return(
            <>
                <div className="d-flex w-100 align-items-center">
                    <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderBack();} }>
                        <FontAwesomeIcon icon={faCaretSquareLeft} className="mr-2 text-color__dark-blue" />
                    </div>
                    <div className="w-100 text-center px-2">
                        {
                            elements[active].descripcion ?
                                <>
                                    <div>
                                        <img src={elements[active].adjunto.url} className="img-fluid w-100 my-2"/>
                                    </div>
                                    <P color="dark-blue">
                                        {
                                            elements[active].descripcion
                                        }
                                    </P>
                                </>
                            : ''
                        }
                    </div>
                    <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderNext();} }>
                        <FontAwesomeIcon icon={faCaretSquareRight} className="mr-2 text-color__dark-blue" />
                    </div>
                </div>
            </>
        )
    }
}

export default SliderImages