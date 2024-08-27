import React from "react";
import { InputLabel, FormControl, Input, Button, Typography, FormControlLabel, Radio, FormLabel, TextareaAutosize, Box } from '@mui/material';
import createCategory from '../api/CreateCategory'
import AddIcon from '@mui/icons-material/Add';

export default function CreateCategory() {


    return (
        <form onSubmit={createCategory} style={{
            width: '60%',
            margin: "auto",
            textAlign: "center",
        }}>
            <FormControl className="form-control">
                <InputLabel htmlFor="Category">Category</InputLabel>
                <Input
                    name="Category"
                    type="text"
                    required
                />
            </FormControl>
            <Typography variant="body2"
                color="error"
                className="message"
                sx={{
                    marginTop: '30px'
                }}>
                {message}
            </Typography>
            <Button type="submit"
                variant="contained"
                endIcon={<AddIcon />}
                sx={{
                    marginTop: '30px'
                }}>Create</Button>
        </form>
    )
}