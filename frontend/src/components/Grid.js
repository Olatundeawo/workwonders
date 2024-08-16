import React from "react";
import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import './../db/data.json'
import { Subtitles, Title } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import Data from '../db/data.json'
import '../assets/css/Grid.css'


export default function Grid() {
    return (
        <>
            <Box
                sx={{
                    bgcolor: "grey",
                }}>
                <ImageList className="imageList"
                    sx={{
                        overflow: 'visible',
                        width: '95%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: 'auto',
                        alignItems: "center",
                        justifyContent: "space-around"
                    }}
                >
                    {Data.map((item) => (
                        <ImageListItem key={item.id}
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
                                srcSet={`${item.default}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.default}?w=164&h=164&fit=crop&auto=format`}
                                alt={`company logo`}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.name}
                                subtitle={item.description}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'white' }}
                                        aria-label={`info about ${item.name}`}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>

            </Box>
        </>
    )
}