import React from 'react';

// import React, { useState } from 'react';
// import FormControl from '@mui/material/FormControl';
// import { InputLabel, Input, Button, Typography, IconButton } from '@mui/material';
// import SendRoundedIcon from '@mui/icons-material/SendRounded';
// import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import '../assets/css/Contact.css';
function Contact() {
    return (
        <div> Contact</div>
    )
}

// function Contact() {
//     // Define the initial and loading button JSX
//     const initial = (
//         <Button
//             type="submit" // Ensure the button is of type submit
//             variant='contained'
//             endIcon={<SendRoundedIcon />}
//             sx={{
//                 marginTop: "30px"
//             }}
//         >
//             Send
//         </Button >
//     );
//     const loading = (
//         <Button variant="outlined" startIcon={<DeleteRoundedIcon />}
//             sx={{
//                 marginTop: "30px"
//             }}>
//             Delete
//         </Button>
//     );

//     const [state, setState] = useState(initial);

//     async function handleSubmit(e) {
//         e.preventDefault();
//         setState(loading); // Change button state to loading

//         const form = e.target; // Get the form element
//         if (!(form instanceof HTMLFormElement)) {
//             console.error('Form element is not valid');
//             return;
//         }

//         const formData = new FormData(form); // Pass the form element to FormData constructor
//         console.log([...formData.entries()]); // Debug: Log form data
//         // console.log(formData.entries());

//         try {
//             const response = await fetch("/api/signup", {
//                 method: "POST",
//                 body: formData
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 console.log("Server responded with", result);
//                 // Optionally, update the button after successful submission
//             }
//         } catch (error) {
//             console.log('Error', error);
//         }
//     }

//     return (
//         <div
//             id="signup"
//             style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 backgroundColor: "white",
//                 textAlign: "center",
//                 padding: "30px 25px",
//                 borderRadius: "20px",
//             }}
//         >
//             <div className='top'>
//                 <h3>
//                     Sign Up
//                 </h3>
//                 <IconButton><CloseRoundedIcon /></IconButton>

//             </div>
//             <form onSubmit={handleSubmit}> {/* Wrap inputs in a form element */}
//                 <FormControl>
//                     <InputLabel htmlFor="name">User Name</InputLabel>
//                     <Input
//                         id="name"
//                         name="name" // Add a name attribute for form submission
//                         type='text'
//                         required
//                         style={{
//                             outline: 'none',
//                             margin: '10px auto'
//                         }}
//                     />
//                 </FormControl>
//                 <FormControl>
//                     <InputLabel htmlFor="email">Email address</InputLabel>
//                     <Input
//                         id="email"
//                         name="email" // Add a name attribute for form submission
//                         type='email'
//                         required
//                         style={{
//                             outline: 'none',
//                             margin: '10px auto'
//                         }}
//                     />
//                 </FormControl>
//                 <FormControl>
//                     <InputLabel htmlFor="password">Password</InputLabel>
//                     <Input
//                         id="password"
//                         name="password" // Add a name attribute for form submission
//                         type='password'
//                         required
//                         style={{
//                             outline: 'none',
//                             margin: '10px auto'
//                         }}
//                     />
//                     {state} {/* Render the current button state */}
//                 </FormControl>
//             </form>
//         </div>
//     );
// }

export default Contact;
