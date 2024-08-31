import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/material';
import '../assets/css/TopBar.css'
import DropDown from './DropDown'

export default function TopBar() {

    return (
        <Box sx={{
            borderBottomLeftRadius: "60px",
            borderBottomRightRadius: '-80px',
            // border: '3px solid black',
            // borderBottom: "3px solid black",
            paddingTop: '30px',
            paddingBottom: "30px",
            // backgroundColor: '#9CBA9E'
            // backgroundColor: '#8F9B9E'
            backgroundColor: '#5B7A8B'
        }}>
            <Typography variant='h1' sx={{
                fontSize: "2em",
                fontWeight: "500",
                textAlign: "center",
                // marginTop: "30px",
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
            >
                <Box component='img'
                    sx={{
                        width: '10%',
                        height: '10%',
                        borderRadius: '50%',
                        textAlign: "center"
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
                            label="Search Machine"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                        />
                    )}
                />
                <DropDown />

            </Box>
        </Box>
    )
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 }
]
