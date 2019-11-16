import Button from '@material-ui/core/Button';
import React from 'react';

export const Login = (props: LoginProps) => {
  return (
    <Button variant="contained" color="primary" onClick={() => props.handleLogin()}>
      Login
    </Button>
  );
};

export default Login;

interface LoginProps {
  handleLogin: () => void;
}
