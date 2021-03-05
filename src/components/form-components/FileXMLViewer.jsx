import React, { Component } from 'react';
import XMLViewer from 'react-xml-viewer'

const customTheme = {
    "attributeKeyColor": "#9E6614",
    "attributeValueColor": "#008000",
    "cdataColor":"#1D781D",
    "commentColor":"#80808F",
    "separatorColor":"#2172C1",
    "tagColor":"#2172C1",
    "textColor":"#333",
    overflowBreak:false
}

class FileXMLViewer extends Component{
    render () {
        const { xml } = this.props
        return (
            <XMLViewer xml={xml} theme={customTheme} indentSize={6} collapsible={true}/>
        )
    }
}

export default FileXMLViewer