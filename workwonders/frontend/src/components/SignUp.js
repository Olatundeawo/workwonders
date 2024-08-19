import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import { InputLabel, Input, IconButton } from '@mui/material';
import { login, error, successful, loading, signUp } from './ButtonState';
import SignUpPost from '../Api/SignUp'

export default function SignUpForm() {

    const [state, setState] = useState(signUp);
    function handleSubmit(e) {
        SignUpPost(e, setState)
    }
    return (
        // { SignUp }
        <form onSubmit={handleSubmit}>
            <FormControl>
                <InputLabel htmlFor="name">User Name</InputLabel>
                <Input
                    id="name"
                    name="name"
                    type='text'
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
                {state}
                {login}
            </FormControl>
        </form>
    )
}