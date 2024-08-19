import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { InputLabel, Input, Button, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import '../assets/css/Contact.css';
import { login, error, successful, loading, signUp } from './ButtonState';
import SignUpForm from './SignUp'
import LoginForm from './LogIn'


function Form({ type, toggleForm }) {

    const formType = { signup: SignUpForm, login: LoginForm } //, logout: Logout }
    const SelectedForm = formType[type]

    { /* api request function*/ }

    return (
        <div
            id="signup"
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                textAlign: "center",
                padding: "30px 25px",
                borderRadius: "20px",
                width: "250px",
                maxWidth: "300px",
                minWidth: "100px"
            }}
        >
            <div className='top'>
                <h3>
                    {type === "signup" ? "Sign Up" : "Log In"}
                </h3>
                <IconButton onClick={() => toggleForm(false)}><CloseRoundedIcon /></IconButton>

            </div>

            { /*form*/}
            {SelectedForm && <SelectedForm />}
        </div>
    );
}

export default Form;
