import React, { Component } from 'react'
import { DropZone } from '../form-components'
import { Small} from '../texts'

class ItemSlider extends Component {

    state = {
        active: 0
    }

    sliderBack = () => {
        let { active } = this.state
        const { items, handleChange } = this.props
        if (handleChange) {
            if (active === 0) {
                active = items.length
            } else {
                active = active - 1
            }
            this.setState({
                ... this.state,
                active
            })
        } else {
            if (active === 0) {
                active = items.length - 1
            } else {
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
        if (handleChange) {
            if (active === items.length) {
                active = 0
            } else {
                active = active + 1
            }
            this.setState({
                ... this.state,
                active
            })
        } else {
            if (active === items.length - 1) {
                active = 0
            } else {
                active = active + 1
            }
            this.setState({
                ... this.state,
                active
            })
        }

    }

    componentWillReceiveProps(nextProps) {
        this.state.active = 0
    }

    handleChange = files => {
        const { handleChange, item } = this.props
        handleChange(files, item)
    }

    isImage = string => {
        let aux = string.substring(string.length - 3);
        if (aux.toUpperCase() === 'JPG' || aux.toUpperCase() === 'GIF' || aux.toUpperCase() === 'PNG')
            return true
        aux = string.substring(string.length - 4);
        if (aux.toUpperCase() === 'JPEG')
            return true
        return false
    }

    downloadFile = item => {
        const url = item.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.name);
        document.body.appendChild(link);
        link.click();
    }

    render() {
        const { items, deleteFile, handleChange, multiple } = this.props
        console.log( multiple, '-multiple-')
        const { active } = this.state
        return (
            <>
                <div className="d-flex justify-content-center align-items-center">
                    {
                        items.length > 0 ?
                            <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderBack(); }}>
                                <div className="btn btn-default font-weight-bold small-button">
                                    <span className="svg-icon svg-icon-lg mr-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <polygon points="0 0 24 0 24 24 0 24" />
                                                <path d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z" fill="#000000" fillRule="nonzero" transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999) " />
                                                <path d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z" fill="#000000" fillRule="nonzero" opacity="0.3" transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999) " />
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            : ''
                    }
                    <div className="text-center p-2">
                        {
                            items.length === active && handleChange ?
                                <div className="rounded w-100 d-flex justify-content-center align-items-center">
                                    <DropZone multiple = { multiple === true || multiple === false ? multiple : true} handleChange={this.handleChange} >
                                        <div className="dropzone-msg dz-message needsclick">
                                            <div className="row d-flex justify-content-center align-items-center">
                                                <span className=" col-md-12 pb-3 svg-icon svg-icon-primary svg-icon svg-icon-5x">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <path d="M17,8 C16.4477153,8 16,7.55228475 16,7 C16,6.44771525 16.4477153,6 17,6 L18,6 C20.209139,6 22,7.790861 22,10 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,9.99305689 C2,7.7839179 3.790861,5.99305689 6,5.99305689 L7.00000482,5.99305689 C7.55228957,5.99305689 8.00000482,6.44077214 8.00000482,6.99305689 C8.00000482,7.54534164 7.55228957,7.99305689 7.00000482,7.99305689 L6,7.99305689 C4.8954305,7.99305689 4,8.88848739 4,9.99305689 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,10 C20,8.8954305 19.1045695,8 18,8 L17,8 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                                                            <rect fill="#000000" opacity="0.3" transform="translate(12.000000, 8.000000) scale(1, -1) rotate(-180.000000) translate(-12.000000, -8.000000) " x="11" y="2" width="2" height="12" rx="1" />
                                                            <path d="M12,2.58578644 L14.2928932,0.292893219 C14.6834175,-0.0976310729 15.3165825,-0.0976310729 15.7071068,0.292893219 C16.0976311,0.683417511 16.0976311,1.31658249 15.7071068,1.70710678 L12.7071068,4.70710678 C12.3165825,5.09763107 11.6834175,5.09763107 11.2928932,4.70710678 L8.29289322,1.70710678 C7.90236893,1.31658249 7.90236893,0.683417511 8.29289322,0.292893219 C8.68341751,-0.0976310729 9.31658249,-0.0976310729 9.70710678,0.292893219 L12,2.58578644 Z" fill="#000000" fillRule="nonzero" transform="translate(12.000000, 2.500000) scale(1, -1) translate(-12.000000, -2.500000) " />
                                                        </g>
                                                    </svg>
                                                </span>
                                                <p className="font-size-h4 lead pb-2">Haga clic para cargar los archivos</p>
                                            </div>
                                        </div>
                                    </DropZone>
                                </div>
                                :
                                items.length > 0 ?
                                    <>
                                        <div>
                                            {
                                                items[active].name.substring(items[active].name.length - 3) === 'pdf' ?
                                                    <div className="w-100 pb-2">
                                                        <iframe src={items[active].url} className="pdfview" />
                                                    </div>
                                                    :
                                                    this.isImage(items[active].name) ?
                                                        <img className="p-2 rounded pdfview" src={items[active].url} style={{ width: "100", height: "100" }} />
                                                        :
                                                        <div id="descarga" className="btn btn-hover p-2 rounded pdfview d-flex align-items-center justify-content-center mx-auto" onClick={() => { this.downloadFile(items[active]) }}>
                                                            <div>
                                                                <i className={"fas fa-file m-0 kt-font-boldest text-primary"}></i>
                                                                <br />
                                                                <Small className="text-center" color="gold">
                                                                    Descarga
                                                                </Small>
                                                            </div>
                                                        </div>
                                            }
                                        </div>
                                        {
                                            deleteFile ?
                                                <div className="d-flex justify-content-center">

                                                    <span className="btn btn-text-danger btn-hover-danger" onClick={(e) => { e.preventDefault(); deleteFile(items[active]) }} >
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
                        items.length > 0 ?
                            <div className="cursor" onClick={(e) => { e.preventDefault(); this.sliderNext(); }}>
                                <div className="btn btn-default font-weight-bold small-button">
                                    <span className="svg-icon svg-icon-lg mr-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <polygon points="0 0 24 0 24 24 0 24" />
                                                <path d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z" fill="#000000" fillRule="nonzero" />
                                                <path d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z" fill="#000000" fillRule="nonzero" opacity="0.3" transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999) " />
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            : ''
                    }
                </div>
                <div className="text-center">
                    {
                        items.length > 0 && active !== items.length ?
                            <Small className="text-center" color="gold">
                                <a href={items[active].url} target='_blank'>
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