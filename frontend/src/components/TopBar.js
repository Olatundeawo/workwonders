import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { Box } from '@mui/material';
import '../assets/css/TopBar.css'
import DropDown from './DropDown.js'

export default function TopBar() {
    return (
        <>
            <Typography variant='h1' sx={{
                fontSize: "2em",
                fontWeight: "500",
                textAlign: "center",
                marginTop: "30px",
                marginBottom: "30px"
            }}>
                Easy Tech Fabrication
            </Typography>
            <Box className='topBar' sx={{
                width: '90%',
                display: "flex",
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}
                Responsive Padding>
                <Box component='img'
                    sx={{
                        width: '10%',
                        height: 'auto',
                        borderRadius: '50%'
                    }}
                    alt='easy tech logo'
                    src='./images/logo.jpg'>

                </Box>
                <Autocomplete
                    freeSolo
                    id="machines"
                    sx={{
                        width: "65%"
                    }}
                    disableClearable
                    options={top100Films.map((option) => option.title)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search input"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                        />
                    )}
                />
                <DropDown />
            </Box>
        </>
    )
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 }
]
