import React, { Component } from 'react'

class FolderFijo extends Component {
    state = {
        hover: false,
    }
    render() {
        const { text, onClick, element } = this.props
        const { hover } = this.state
        return (
            <>
                <div className="mt-4 text-center folder"
                    onMouseEnter={() => this.setState({ ...this.state, hover: true })}
                    onMouseLeave={() => this.setState({ ...this.state, hover: false })}
                >
                    <div className="card card-box-shadow card-sm card-hover-shadow h-auto" onClick={(e) => { e.preventDefault(); onClick(element) }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    {
                                        hover ?
                                            <i className="fas fa-folder-open text-primary hover-primary text-hover-primary icon-md text-hover mr-2"></i>
                                            :
                                            <i className="fas fa-folder text-primary hover-primary text-hover-primary icon-md text-hover mr-2"></i>
                                    }
                                </div>
                                <div className="text-truncate font-size-14px m-auto">
                                    {text}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default FolderFijo