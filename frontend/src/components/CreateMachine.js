import React, { useState } from "react";
import { InputLabel, Input, Button, Typography, FormControlLabel, Radio, FormLabel, TextareaAutosize, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import '../assets/css/CreateMachine.css';
import createProject from '../api/CreateMachine'

export default function CreateMachine() {
    const [message, setMessage] = useState('');
    const [imageURLs, setImageURLs] = useState([]);
    const [videoURLs, setVideoURLs] = useState([]);

    const spacing = {
        marginTop: '20px'
    }

    function handleImageUpload(e) {
        const files = e.target.files;
        let fileArray = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            fileArray.push(url);
        }
        setImageURLs(fileArray);
    }

    function handleVideoUpload(e) {
        const files = e.target.files;
        let fileArray = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            fileArray.push(url);
        }
        setVideoURLs(fileArray);
    }

    function createProjects(e) {
        createProject(e)
    }

    return (
        <div id="createMachine">
            <form className="form-container" onSubmit={createProjects}>
                <FormControl className="form-control">
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <Input
                        id="name"
                        name="title"
                        type="text"
                        required
                    />
                </FormControl>
                <FormControl className="form-control" style={spacing}>
                    <FormLabel id="category-label">CATEGORY</FormLabel>
                    <RadioGroup
                        aria-labelledby="category-label"
                        name="category"
                        required
                        row
                    >
                        <FormControlLabel value="presser" control={<Radio />} label="Presser" />
                        <FormControlLabel value="driller" control={<Radio />} label="Driller" />
                        <FormControlLabel value="crusher" control={<Radio />} label="Crusher" />
                        <FormControlLabel value="dehuler" control={<Radio />} label="Dehuler" />
                    </RadioGroup>
                </FormControl>
                <FormControl className="form-control" style={spacing}>
                    <FormLabel id="power-label">POWER SOURCE</FormLabel>
                    <RadioGroup
                        aria-labelledby="power-label"
                        name="powerSource"
                        required
                        row
                    >
                        <FormControlLabel value="motor" control={<Radio />} label="Motor" />
                        <FormControlLabel value="electricity" control={<Radio />} label="Electricity" />
                    </RadioGroup>
                </FormControl>
                <FormControl className="form-control" style={spacing}>
                    <TextareaAutosize
                        name="description"
                        placeholder="Description"
                        minRows={5}
                        style={{
                            outline: 'none',
                            width: '100%',
                            background: 'none'
                        }}
                        required
                    />
                </FormControl>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    style={spacing}
                >
                    Upload Images
                    <Input
                        id="images"
                        name="media"
                        type="file"
                        style={{ display: 'none' }}
                        accept='.jpg, .jpeg, .png'
                        onChange={handleImageUpload}
                        inputProps={{
                            multiple: true
                        }}
                    // required
                    />
                </Button>
                <div className="image-container">
                    {imageURLs.map((url, index) => (
                        <Box key={index} component='img'
                            sx={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '10px',
                                margin: '10px',
                            }}
                            alt={`uploaded image ${index}`}
                            src={url}
                        />
                    ))}
                </div>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    style={spacing}
                >
                    Upload Video
                    <Input
                        id="videos"
                        name="media"
                        type="file"
                        style={{ display: 'none' }}
                        inputProps={{
                            multiple: true
                        }}
                        accept='video/*'
                        // required
                        onChange={handleVideoUpload}
                    />
                </Button>
                <div
                    className="image-container">
                    {videoURLs.map((url, index) => (
                        <Box key={index} component='video'
                            sx={{
                                width: '300px',
                                height: '200px',
                                borderRadius: '10px',
                                margin: 'auto',
                                margin: '10px',
                            }}
                            alt={`uploaded video ${index}`}
                            src={url}
                            controls
                        />
                    ))}
                </div>
                <Button
                    endIcon={<AddIcon />}
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="submit-button"
                    style={spacing}
                >
                    Create
                </Button>
                <Typography variant="body2" color="error" className="message">
                    {message}
                </Typography>
            </form>
        </div>
    );
}
