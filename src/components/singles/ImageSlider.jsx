import React, {Component} from 'react'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons'
import { Small, P } from '../texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PDFViewer from 'pdf-viewer-reactjs'

class ImageSlider extends Component{

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
        this.setState({
            ... this.state,
            index: index,
            active: elements[index]
        })
    }

    render(){
        const { active } = this.state
        return(
            <div className="d-flex w-100">
                <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderBack();} }>
                    <FontAwesomeIcon icon={faCaretSquareLeft} className="mr-2 text-color__dark-blue" />
                </div>
                <div className="w-100 text-center">
                    <div>
                        {
                            active.name ?
                                <Small color="gold">
                                    {
                                        active.name
                                    }
                                </Small>
                            : ''
                        }
                    </div>
                    {
                        active.url && active.name ?
                            <Small>
                                {
                                    active.url
                                }
                            </Small>
                        : ''
                    }
                </div>
                <div className="cursor" onClick={ (e) => { e.preventDefault(); this.sliderNext();} }>
                    <FontAwesomeIcon icon={faCaretSquareRight} className="mr-2 text-color__dark-blue" />
                </div>
            </div>
        )
    }
}

export default ImageSlider