import React, { Component } from 'react'
import * as animationData from '../assets/animate/error-404-page.json'
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import $ from "jquery";
class NotFound extends Component {

    getLink = () => {
        return '/usuarios/calendario-tareas'
    }
    componentDidMount() {
        $("body").addClass('bg-white d-flex justify-content-center');
    }
    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <div className="row mx-0 col-md-12 row-paddingless">
                <div className="mx-0 col-md-6 d-flex align-items-center justify-content-center text-center">
                    <div className="px-4">
                        <div className="error-title font-weight-boldest text-primary">¡Lo sentimos!</div>
                        <div className="font-weight-boldest error-subtitle">La página que buscas no existe.</div>
                        <h2 className="error-subtitle-2 font-weight-light">
                            Te recomendamos visitar nuestra
                            <Link className="ml-2" to={this.getLink()}>
                                <span className="font-weight-bolder text-hover-error"><u>Página principal.</u></span>
                            </Link>
                        </h2>
                    </div>
                </div>
                <div className="row mx-0 col-md-6 row-paddingless d-flex align-items-center justify-content-center">
                    <div className="col-md-11">
                        <Lottie
                            options={defaultOptions}
                            isStopped={false}
                            isPaused={false}
                        />
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