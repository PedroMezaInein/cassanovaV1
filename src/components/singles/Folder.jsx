import React, { Component } from 'react'
import { InputGray } from '../form-components'

class Folder extends Component {

    state = {
        hover: false,
        editable: false,
        name: '',
    }

    updateInput = e => {
        const { value } = e.target
        this.setState({
            ...this.state,
            name: value
        })
    }

    render() {
        const { children, text, closeFunction, onClick, element, updateDirectory, onClickDelete } = this.props
        const { hover, editable, name } = this.state
        return (
            <>
                <div className="mt-4 text-center folder"
                    onMouseEnter={() => this.setState({ ...this.state, hover: true })}
                    onMouseLeave={() => this.setState({ ...this.state, hover: false })}
                >
                    <div className="card card-box-shadow card-sm card-hover-shadow h-auto" >
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div onClick={(e) => { e.preventDefault(); onClick(element) }}>
                                    {
                                        hover ?
                                            <i className="fas fa-folder-open text-primary hover-primary text-hover-primary icon-md text-hover mr-2"></i>
                                            :
                                            <i className="fas fa-folder text-primary hover-primary text-hover-primary icon-md text-hover mr-2"></i>
                                    }
                                </div>
                                {
                                    children ?
                                        children
                                        :
                                        !editable ?
                                            <>
                                                <div className="text-truncate font-size-14px m-auto" onClick={(e) => { e.preventDefault(); this.setState({ ...this.state, editable: !editable, name: text }); }}>
                                                    {text}
                                                </div>
                                                {
                                                    element.adjuntos.length > 0 ? ''
                                                        :
                                                        <div className="hs-unfold ml-2" onClick={(e) => { e.preventDefault(); onClickDelete(element) }} >
                                                            <i className="ki ki-close icon-xs text-body text-hover-danger"></i>
                                                        </div>
                                                }
                                            </>
                                            : ''
                                }
                                {
                                    children ?
                                        ''
                                        :
                                        editable ?
                                            <form className="w-100" onSubmit={(e) => { e.preventDefault(); updateDirectory(name, element); this.setState({ ...this.state, editable: false }) }} >
                                                <InputGray
                                                    withtaglabel={0}
                                                    withtextlabel={0}
                                                    withplaceholder={0}
                                                    withicon={0}
                                                    requirevalidation={0}
                                                    withformgroup={0}
                                                    customclass="input-folder"
                                                    name='name'
                                                    value={name}
                                                    onChange={this.updateInput}
                                                />
                                            </form>
                                            :
                                            ''
                                }
                                {
                                    closeFunction &&
                                    <div className="hs-unfold ml-2" onClick={(e) => { e.preventDefault(); closeFunction() }}>
                                        <i className="ki ki-close icon-xs text-body text-hover-danger"></i>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Folder