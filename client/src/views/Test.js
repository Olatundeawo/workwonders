// https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE


import FormControl from '@mui/material/FormControl';
import { InputLabel, Input, Button, Box, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function PasswordVerification(endPoint, method) {
    function apiRequest(endpoint, meth, endpoint1, meth1) {
        fetch(endpoint, { method: meth })
            .then(res => {
                if (res.ok) {
                    return fetch(endpoint1, { method: meth1 });
                } else {
                    throw new Error('First request failed');
                }
            })
            .then(res => res.json())
            .then(result => console.log(result))
            .catch(err => console.error(err));
    }
    const zoom = true;

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
                            <form >
                                <FormControl >
                                    <InputLabel htmlFor="password-verification">Password</InputLabel>
                                    <Input
                                        id="password-verification"
                                        name="password-verification"
                                        type="password"
                                        autoComplete='true'
                                        required
                                        style={{
                                            outline: 'none',
                                            margin: '10px auto',
                                            padding: '5px '
                                        }}
                                    />
                                </FormControl>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: "center",
                                    width: '70%',
                                    margin: 'auto'
                                }}>
                                    <Button
                                        endIcon={<CancelIcon />}
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
                                        color="success"
                                        style={{ marginTop: '20px' }}
                                    >
                                        Continue
                                        {/* {state === 'loading' ? 'Submitting...' : 'Sign Up'} */}
                                    </Button>
                                </Box>
                            </form >
                        </div >
                    </div>
                }
            </div>
        </div>
    )
}