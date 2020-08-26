import React, { Component } from 'react'

import { validateAlert } from '../../../functions/alert'
import { Button, Input } from '../../form-components'
import { Form } from 'react-bootstrap'

class CalendarioForm extends Component {
    render() {
        const { onSubmit, form, onChange } = this.props
        return (
            <Form id="form-calendario"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-calendario')
                    }
                }
            >
                <div className="form-group row form-group-marginless">

                </div>

                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                </div>

            </Form>
        )
    }
}

export default CalendarioForm