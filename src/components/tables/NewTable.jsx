import React, { Component } from 'react'

class NewTable extends Component{

    render(){

        const { headers, data } = this.props

        return(
            <>
                <table>
                    <tr>
                        {
                            headers.map((element, key) => {
                                return(
                                    <th>
                                        {
                                            element
                                        }
                                    </th>
                                )
                            })
                        }
                    </tr>
                    {
                        data.map((element, key) => {
                            return(
                                <tr>
                                    {
                                        element.map((elemento) => {
                                            return(
                                                <td>
                                                    {elemento}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </table>
            </>
        )
    }
}

export default NewTable