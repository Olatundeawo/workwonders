import React, { useState } from "react";
import { login, error, successful, loading, signUp } from '../components/ButtonState';

export default async function SignUpPost(e, setState) {
    e.preventDefault(); // Prevent the default form submission

    const form = e.target;

    if (!(form instanceof HTMLFormElement)) {
        console.error('Form element is not valid');
        return;
    }

    const formData = new FormData(form);
    const urlEncodedData = new URLSearchParams(formData).toString(); // Convert FormData to URL-encoded string

    try {
        const response = await fetch("/catalog/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: urlEncodedData
        });

        let result;

        if (response.ok) {
            result = await response.json();
            console.log("Server responded with", result);

            setState(successful);
        } else {
            result = await response.json();
            console.error('Server responded with an error', result);
            setState(error);
            // throw new Error('Sign up failed');
        }
    } catch (err) {
        console.error('Error during sign up:', err);
        setState(error);
        throw err; // Propagate the error so it can be caught in the form
    }
}
