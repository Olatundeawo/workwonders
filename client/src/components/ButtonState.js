import React from 'react';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AddIcon from '@mui/icons-material/Add';
// import { LoadingButton } from '@mui/lab';


export const signUp = (
    <Button
        endIcon={<AddIcon />}
        size='small'
        variant='outlined'
        color='primary'
        type="submit"
        sx={{
            marginTop: "30px"
        }}
    >
        Sign Up
    </Button>
);
// <LoadingButton loading variant="outlined">
//     Submit
// </LoadingButton>
export const loading = (
    <LoadingButton
        loading
        loadingPosition="center"
        variant="outlined"
        disabled
    >
        Loading
    </LoadingButton>
)

export const successful = (
    <Button
        size='small'
        variant='contained'
        sx={{ bgcolor: "green", marginTop: "30px" }}
        endIcon={<VerifiedRoundedIcon />}>
        Successful
    </Button>
);

export const error = (
    <Button
        size='small'
        variant='contained'
        sx={{
            bgcolor: 'error.main', marginTop: "30px"
        }}
        endIcon={<ErrorRoundedIcon />}>
        Error
    </Button>
);

export const login = (
    <Button
        sx={{
            marginTop: "30px"
        }}
        endIcon={<LoginRoundedIcon />}
        size="small"
        variant="outlined"
        color="primary"
    >
        Log In
    </Button>
);