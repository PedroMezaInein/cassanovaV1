import React, { Component } from 'react'
import * as animationData from '../assets/animate/error-404-page.json'
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

class NotFound extends Component{

    getLink = () => {
        return '/leads/crm'
    }
    render(){
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <div className = 'container'>
                <div className = 'my-3 text-center mx-0'>
                    <h1 className = 'my-5'>
                        ¡Lo sentimos!
                    </h1>
                    <h2 className = 'mb-5'>
                        La página que buscas no existe, te recomendamos visitar nuestra 
                        <Link className = 'ml-2' to = { this.getLink() }>
                            página principal.
                        </Link>
                    </h2>
                </div>
                <div className="row mx-0 justify-content-center">
                    <div className = 'col-md-6'>
                        <Lottie 
                            options = { defaultOptions }
                            /* height = { 400 }
                            width = { 400 } */
                            isStopped={false}
                            isPaused={false}/>
                    </div>
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);