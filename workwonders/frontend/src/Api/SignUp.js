import React, { useState } from "react";
import { login, error, successful, loading, signUp } from '../components/ButtonState';


export default async function SignUpPost({ e, setState }) {
    e.preventDefault();
    setState(loading);

    const form = e.target;
    if (!(form instanceof HTMLFormElement)) {
        console.error('Form element is not valid');
        return;
    }

    const formData = new FormData(form);
    console.log([...formData.entries()]);

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Server responded with", result);

        }
    } catch (error) {
        console.log('Error', error);
    }
}