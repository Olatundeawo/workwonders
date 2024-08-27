import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import { InputLabel, Input, IconButton, Button, Typography } from '@mui/material';
import { login, error, successful, loading, signUp } from './ButtonState';
import SignUpPost from '../api/SignUp'
import LoginIcon from '@mui/icons-material/Login';

export default function SignUpForm() {

    const [state, setState] = useState(login);
    const [message, setMessage] = useState('')
    async function handleSubmit(e) {
        e.preventDefault();

        setState(loading);

        try {
            const response = await SignUpPost(e, setState);
            if (response === 'successful') {
                console.log('State:', response)
                setState('successful')
                setMessage('Successful!');
            } else {
                setState('error')
                setMessage(response);
                console.log('Error State:', response)
            }
        } catch (err) {
            setState(error);
            setMessage('Sign up failed. Please try again.');
        }
    }
    return (
        // { SignUp }
        <form onSubmit={handleSubmit}>
            <FormControl>
                <InputLabel htmlFor="email">Email address</InputLabel>
                <Input
                    id="email"
                    name="email"
                    type='email'
                    required
                    style={{
                        outline: 'none',
                        margin: '10px auto'
                    }}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                    id="password"
                    name="password"
                    type='password'
                    required
                    style={{
                        outline: 'none',
                        margin: '10px auto'
                    }}
                />

            </FormControl>
            <Button
                endIcon={<LoginIcon />}
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
            >
                {state === loading ? 'Submitting...' : 'Log In'}
            </Button>
            {state === 'error' && (
                <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
                    {message}
                </Typography>
            )}
            {state === 'successful' && (
                <Typography variant="body2" style={{ marginTop: '10px', color: 'green' }}>
                    {message}
                </Typography>
            )}
        </form>
    )
}