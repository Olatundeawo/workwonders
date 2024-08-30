import React from "react";
import { Button, FormControl, Input, InputLabel, TextareaAutosize, Box, Typography, IconButton, Link } from "@mui/material";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import DropDown from "../components/DropDown";
import XIcon from '@mui/icons-material/X';
import ContactForm from "../api/ContactForm"
import '../assets/css/Contact.css'

export default function Contact() {

    const spacing = {
        marginTop: '20px'
    }

    const handles = [
        { icon: LocationOnIcon, link: 'https://www.google.com/maps/dir/?api=1&destination=7.491617610243243, 3.9138064576722895' },
        { icon: WhatsAppIcon, link: 'https://www.google.com' },
        { icon: MailIcon, link: 'https://www.google.com' },
        { icon: FacebookIcon, link: 'https://www.google.com' },
        { icon: InstagramIcon, link: 'https://www.google.com' },
        { icon: LocalPhoneIcon, link: 'https://www.google.com' },
        { icon: XIcon, link: 'https://www.google.com' }
    ]

    async function sendMail(e) {
        e.preventDefault()
        const result = await ContactForm(e)
    }

    return (
        <div style={{
            textAlign: 'center',
            paddingTop: '20px'
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: "end",
                alignItems: "center"
            }}>
                <Typography variant="h5"
                    sx={{
                        marginRight: '30%'
                    }}>
                    Get In Touch
                </Typography>
                <DropDown sx={{
                    marginLeft: '30%'
                }} />
            </Box>
            <form className="form" onSubmit={sendMail}>
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
            <footer className="footer" style={{
                marginTop: "50px",
                width: "100%",
                backgroundColor: "red",
                display: 'flex',
                flexDirection: 'column',
                alignItems: "center",
                paddingTop: "20px",
                paddingBottom: '20px'
            }}>
                <Typography variant="h5" style={spacing}>
                    Contact Us
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    {/* <LocationOnIcon /><h4>whatsapp</h4> */}
                    {handles.map((item, index) => (
                        <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
                            <IconButton>
                                <item.icon />
                            </IconButton>
                        </a>
                    ))}
                </Box>
                © 2024 Easy Tech. All rights reserved.
            </footer>
        </div>
    )
}