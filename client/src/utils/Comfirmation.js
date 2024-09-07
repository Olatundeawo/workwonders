// https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE

import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import { InputLabel, Input, Button, Box, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteMachine from "../api/DeleteMachine"

export default function ConfirmAction({ id, z }) {
    const [zoom, isZoom] = useState(false);

    useEffect(() => {
        isZoom(z);
    }, [z]);

    console.log('joshua', id)
    console.log('joshua', z)

    return (
        <div>
            <div style={{ position: 'relative' }}>
                {zoom &&
                    <div className='overlay'
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            backgroundColor: 'rgba(128, 128, 128, 0.8)',
                            height: "100vh",
                            width: '100vw',
                            zIndex: 1000, // Ensure this is high enough to cover other content
                            overflow: 'hidden', // Hide scrollbars if necessary
                        }}>
                        <div style={{
                            position: 'absolute',
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            width: "75%",
                            backgroundColor: 'grey',
                            padding: '30px 15px',
                            borderRadius: '15px'
                        }}>
                            <Typography variant='h6' color='error'>
                                Once done this action cant be undone
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: "center",
                                width: '70%',
                                margin: 'auto'
                            }}>
                                <Button
                                    endIcon={<CancelIcon />}
                                    onClick={() => isZoom(false)}
                                    type="submit"
                                    variant="contained"
                                    color="error"
                                    style={{ marginTop: '20px' }}
                                >
                                    Cancel
                                    {/* {state === 'loading' ? 'Submitting...' : 'Sign Up'} */}
                                </Button>
                                <Button
                                    endIcon={<ThumbUpIcon />}
                                    type="submit"
                                    variant="contained"
                                    onClick={() => { DeleteMachine(id) }}
                                    color="success"
                                    style={{ marginTop: '20px' }}
                                >
                                    Continue
                                    {/* {state === 'loading' ? 'Submitting...' : 'Sign Up'} */}
                                </Button>
                            </Box>
                        </div >
                    </div>
                }
            </div>
        </div >
    )
}