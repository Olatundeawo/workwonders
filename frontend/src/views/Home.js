import React, { useState, useEffect } from "react";
import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar, Tooltip, Typography } from "@mui/material";
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
            paddingBottom: '10px'

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
                        paddingTop: "15px",
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopRightRadius: "30px",
                        // borderTop: "3px solid red"
                    }}
                >
                    {machines.map((item, index) => (
                        <ImageListItem key={item._id}

                            sx={{
                                display: "flex",
                                width: "240px",
                                height: '250px',
                                flex: '1 1 200px',
                                maxWidth: '270px',
                                maxHeight: '280px',
                                minWidth: '180px',
                                minHeight: "200px",
                                marginTop: '10px',
                                marginBottom: '10px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                borderRadius: "15px",
                                overflow: 'hidden'
                                // display: "flex",
                                // width: "240px", // Adjust width to fit container
                                // height: 'auto', // Adjust height to fit content
                                // flex: '1 1 auto', // Flexible sizing
                                // marginTop: '10px',
                                // marginBottom: '10px',
                                // marginLeft: '5px',
                                // marginRight: '5px',
                                // borderRadius: "15px",
                                // overflow: 'hidden',
                                // position: 'relative',

                            }}>
                            <div className="image-container">
                                <img
                                    className="responsive-image"
                                    onClick={() => handleItemClick(item._id)}

                                    src={item.media.length > 0
                                        ? String(item.media[5].url)
                                        : './images/logo.jpg'}

                                    alt={`machine image`}
                                    loading="lazy"
                                />
                            </div>
                            <ImageListItemBar
                                title={item.title}
                                subtitle={item.description}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'white' }}
                                        aria-label={`info about ${item.title}`}
                                    >
                                        <Tooltip title={`Power: ${item.powerSource}`}>
                                            <InfoIcon />
                                        </Tooltip>
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
            <footer className="footer">
                <Typography variant='h6'>
                    © 2024 Easy Tech. All rights reserved.
                </Typography>
            </footer>
        </div >
    );
}
