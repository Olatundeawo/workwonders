import React from "react";
import { error, successful } from '../components/ButtonState';

export default async function SignUpPost(e) {
    e.preventDefault(); // Prevent the default form submission

    const form = e.target;

    if (!(form instanceof HTMLFormElement)) {
        console.error('Form element is not valid');
        // setState(error);
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

        if (response.ok) {
            const result = await response.json();
            console.log("Server responded with", result.message);
            return result.message;
        } else {
            const result = await response.json();
            console.error('Server responded with an error', result);
            // setState(error);
            return result.message
        }
    } catch (err) {
        console.error('Error during sign up:', err);
        // setState(error);
        return 'Error, please try again'
    }
}
