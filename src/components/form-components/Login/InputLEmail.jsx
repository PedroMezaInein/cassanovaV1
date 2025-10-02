import React, { Component } from 'react';
import TextField from '@mui/material/TextField';

class InputLEmail extends Component {
  state = {
    inputValido: !this.props.requirevalidation
  };

  validarInput = (e) => {
    const { value } = e.target;
    const { patterns, requirevalidation } = this.props;

    if (value && requirevalidation) {
      const expRegular = new RegExp(patterns);
      this.setState({ inputValido: expRegular.test(value) });
    } else {
      this.setState({ inputValido: !requirevalidation });
    }
  };

  componentDidMount() {
    const { formeditado, value } = this.props;
    if (formeditado) {
      this.validarInput({ target: { value } });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.validarInput({ target: { value: this.props.value } });
    }
  }

  render() {
    const {
      name,
      value,
      onChange,
      placeholder,
      error = {},
      requirevalidation,
      ...props
    } = this.props;

    const { inputValido } = this.state;

    return (
      <TextField
        fullWidth
        type="email"
        name={name}
        value={value}
        margin="normal" // 👈 esto agrega espacio vertical entre inputs

        label={placeholder}
        variant="outlined"
        size="medium"
        autoComplete="off"
        required={requirevalidation === 1}
        error={!!error[name] && !inputValido}
        helperText={!!error[name] && !inputValido ? error[name] : ''}
        onChange={(e) => {
          e.target.value = e.target.value.toLowerCase(); // Forzar minúsculas
          this.validarInput(e);
          onChange(e);
        }}
        {...props}
      />
    );
  }
}

export default InputLEmail;
