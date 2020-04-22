import React, {Component} from 'react'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons'
import { Small, P } from '../texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemSlider } from './'

class Slider extends Component{

    state = {
        active: '',
        index: 0,
        elements: []
    }

    componentDidMount(){
        const { elements } = this.props
        if(elements.length > 0){
            this.setState({
                ... this.state,
                active: elements[0],
                elements: elements
            })
        }
    }

    sliderBack = () => {
        let { index, elements } = this.state
        if(index === 0)
            index = elements.length - 1 
        else
            index = index - 1
        console.log('element index back', elements[index])
        this.setState({
            ... this.state,
            index: index,
            active: elements[index]
        })
    }

    sliderNext = () => {
        let { index, elements } = this.state
        if(index === elements.length - 1)
            index = 0
        else
            index = index + 1
        console.log('element index next', elements[index])
        this.setState({
            ... this.state,
            index: index,
            active: elements[index]
        })
    }

    render(){
        const { active } = this.state
        return(
            <>
                <div className="d-flex w-100 align-items-center">
                    <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderBack();} }>
                        <FontAwesomeIcon icon={faCaretSquareLeft} className="mr-2 text-color__dark-blue" />
                    </div>
                    <div className="w-100 text-center px-2">
                        {
                            active.text ?
                                <P color="dark-blue">
                                    {
                                        active.text
                                    }
                                </P>
                            : ''
                        }
                    </div>
                    <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderNext();} }>
                        <FontAwesomeIcon icon={faCaretSquareRight} className="mr-2 text-color__dark-blue" />
                    </div>
                </div>
                <div>
                    {
                        active.files ?
                            <ItemSlider items = {active.files} id = { active.id ? active.id : ''} />
                        : ''
                    }
                </div>
            </>
        )
    }
}

export default Slider