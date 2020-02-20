import React, { Component } from 'react'
import { connect } from 'react-redux'

class Layout extends Component{
    render(){
        return(
            'Layout'
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout);