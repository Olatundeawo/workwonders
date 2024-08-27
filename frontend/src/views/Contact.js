import React from "react";
import { Button, FormControl, Input, InputLabel, TextareaAutosize, Box, Typography } from "@mui/material";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../assets/css/Contact.css'

export default function Contact() {

    const spacing = {
        marginTop: '20px'
    }

    const handles = [{ icon: <LocationOnIcon />, text: 'uigwefyioqfrey8;yqerui7' }]

    return (
        <div style={{
            textAlign: 'center',
            overflow: 'hidden'
        }}>
            <Typography variant="h5">
                Get In Touch
            </Typography>
            <form className="form">
                <FormControl style={spacing}>
                    <InputLabel htmlFor='name'>Name</InputLabel>
                    <Input
                        id='name'
                        name='name'
                        type='text'
                        sx={{ height: '30px', fontSize: '16px' }}

                        required />
                </FormControl>
                <FormControl style={spacing}>
                    <InputLabel htmlFor='email'>Email Address</InputLabel>
                    <Input
                        id='email'
                        name='email'
                        type='email'
                        sx={{ height: '30px', fontSize: '16px' }}
                        required></Input>
                </FormControl>
                <FormControl style={spacing}>
                    <TextareaAutosize
                        name="message"
                        placeholder="Message"
                        minRows={6}
                        style={{
                            outline: 'none',
                            width: '100%',
                            background: 'none'
                        }}
                        required
                    />
                </FormControl>
                <Button type="submit" variant="contained" endIcon={<ForwardToInboxIcon />}
                    sx={{ width: '30%', marginTop: '20px' }}>Send</Button>
            </form>
            <Box sx={{
                marginTop: "50px",
                width: "100%",
                bgcolor: "red",
                display: 'flex',
                flexDirection: 'column',
                alignItems: "flex-start",
                paddingLeft: '15%'
            }}>
                <Typography variant="h5" style={spacing}>
                    Contact Us
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocationOnIcon /><h4>whatsapp</h4>
                </Box>
            </Box>
        </div>
    )
}