import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

class InputLPassword extends Component {
  state = {
    showPassword: false,
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
    if (formeditado) this.validarInput({ target: { value } });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.validarInput({ target: { value: this.props.value } });
    }
  }

  toggleVisibility = () => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

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

    const { showPassword, inputValido } = this.state;

    return (
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        label={placeholder}
        variant="outlined"
        size="medium"
        error={!!error[name] && !inputValido}
        helperText={!!error[name] && !inputValido ? error[name] : ''}
        onChange={(e) => {
          this.validarInput(e);
          onChange(e);
        }}
        autoComplete="off"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={this.toggleVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    );
  }
}

export default InputLPassword;
