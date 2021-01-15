import React, { Component } from 'react'
import { InputGray } from '../../../components/form-components'
import { Folder } from '../../../components/singles'

class NewFolderInput extends Component {
    render() {
        const { newFolder, onSubmit, customclass, name, value, onChange} = this.props
        return (
            <>
                <Folder text='' closeFunction={newFolder} >
                    <div>
                        <form onSubmit={onSubmit} >
                            <InputGray
                                withtaglabel={0}
                                withtextlabel={0}
                                withplaceholder={0}
                                withicon={0}
                                requirevalidation={0}
                                withformgroup={0}
                                withformgroup={0}
                                customclass={customclass}
                                name={name}
                                value={value}
                                onChange={onChange}
                            />
                        </form>
                    </div>
                </Folder>
            </>
        )
    }
}

export default NewFolderInput