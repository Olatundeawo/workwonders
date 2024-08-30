import React, { useState, useEffect } from "react";
import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import '../assets/css/Home.css';
import Data from '../db/data.json';
import TopBar from "../components/TopBar";
import fetchMachine from "../api/FetchMachine";

export default function Home() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMachine();
                if (Array.isArray(data)) {
                    setMachines(data);
                    // console.log(String(data[11]['media'][0].url))
                } else {
                    console.error('Data fetched is not an array:', data);
                    setMachines([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch machines');
                setMachines([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleItemClick = async (id) => {
        try {
            const fetchUrl = `/catalog/project/${id}`;
            console.log('Fetching data from:', fetchUrl);

            const response = await fetch(fetchUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            navigate(`/project`, { state: { data } });
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };


    return (
        <div className="body" style={{
            paddingTop: '30px'

        }}>
            <TopBar />
            <Box>
                <ImageList className="imageList"
                    sx={{
                        overflow: 'visible',
                        width: '95%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: 'auto',
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {machines.map((item) => (
                        <ImageListItem key={item._id}
                            sx={{
                                display: "flex",
                                width: "240%",
                                height: '250px',
                                flex: '1 1 200px',
                                maxWidth: '300px',
                                maxHeight: '310px',
                                minWidth: '150px',
                                minHeight: "160px",
                                marginTop: '10px',
                                marginBottom: '10px',
                                marginLeft: '5px',
                                marginRight: '5px'
                            }}>

                            <img
                                onClick={() => handleItemClick(item._id)}
                                srcSet={`${Array.isArray(item.media) && item.media.length > 0 ? String(item.media[0].url) : './images/logo.jpg'}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                src={`${Array.isArray(item.media) && item.media.length > 0 ? String(item.media[0].url) : './images/logo.jpg'}?w=164&h=164&fit=crop&auto=format`}
                                alt={`company logo`}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={item.description}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'white' }}
                                        aria-label={`info about ${item.title}`}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
            <footer className="footer">
                © 2024 Easy Tech. All rights reserved.
            </footer>
        </div>
    );
}
