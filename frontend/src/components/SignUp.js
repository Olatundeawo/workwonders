import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import { InputLabel, Input, Button, Typography } from '@mui/material';
import { error, successful, loading, signUp } from './ButtonState';
import SignUpPost from '../api/SignUp';
import AddIcon from '@mui/icons-material/Add';

export default function SignUpForm() {
    const [state, setState] = useState('signUp');
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission

        setState('loading'); // Set the state to loading

        try {
            const response = await SignUpPost(e);
            if (response === 'user created successfully') {
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
        <form onSubmit={handleSubmit}>
            <FormControl>
                <InputLabel htmlFor="name">User Name</InputLabel>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    style={{
                        outline: 'none',
                        margin: '10px auto'
                    }}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="email">Email address</InputLabel>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    style={{
                        outline: 'none',
                        margin: '10px auto'
                    }}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="role">Role</InputLabel>
                <Input
                    id="role"
                    name="role"
                    type="text"
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
                    type="password"
                    required
                    style={{
                        outline: 'none',
                        margin: '10px auto'
                    }}
                />
            </FormControl>
            <Button
                endIcon={<AddIcon />}
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
            >
                {state === 'loading' ? 'Submitting...' : 'Sign Up'}
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
    );
}
