import React, { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetchMachine from '../api/FetchMachine';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { List, IconButton, ListItem, ListItemButton, ListItemIcon, Button, Box, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UpdateIcon from '@mui/icons-material/Update';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageSwiper from "../components/ImageSwiper"
import DeleteMachine from "../api/DeleteMachine"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Data from '../db/data.json'


// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default function Machine() {
    const location = useLocation();

    const { data } = location.state;
    console.log('nwigiri machine', data)
    const [machineData, setMachineData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState(<MoreVertIcon />);
    const images = ['./images/logo.jpg', './images/logo.jpg', './images/logo.jpg']

    const toggle = () => {
        setVisible(prevVisible => {
            const newVisible = !prevVisible;
            setAction(newVisible ? <CloseIcon /> : <MoreVertIcon />);
            return newVisible;
        });
    };

    // useLayoutEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const data = await fetchMachine(id);
    //             setMachineData(data);
    //             console.log('Machine data fetched:', data);
    //         } catch (error) {
    //             console.error('Error fetching machine data:', error);
    //         }
    //     };

    //     fetchData();
    // }, [id]);

    const actions = [
        { action: 'Update', icon: <UpdateIcon /> },
        { action: 'Delete', icon: <DeleteForeverIcon /> }
    ];

    return (
        <div className="machine" style={{ width: "80%", margin: 'auto', }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
                <ArrowRightAltIcon sx={{
                    transform: "rotate(180deg)"
                }} />
                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <IconButton onClick={toggle}>
                        {action}
                    </IconButton>

                    {visible && (
                        <List sx={{ position: 'absolute', bgcolor: "red", borderRadius: '10px', marginTop: '45px', zIndex: '30' }}>
                            {actions.map((item, index) => (
                                <ListItem key={index} sx={{ marginTop: "-10px" }}>
                                    <ListItemButton onClick={() => index === 1 ? DeleteMachine(data._id) : null}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        {item.action}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </span>
            </div>

            <div style={{
                textAlign: "center",
                marginTop: "20px",
            }}>
                <Typography variant='h5'>
                    {data.title}
                </Typography>

                <ImageSwiper imageList={images} />
                <Swiper
                    cssMode={true}
                    navigation={true}
                    pagination={false}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <Box component='video'
                            sx={{
                                width: '300px',
                                height: '200px',
                                borderRadius: '10px',
                                border: '1px solid black',
                                margin: '10px',
                            }}
                            alt={`uploaded video(s)`}
                            src={'/videos/video.mp4'}
                            // src={'../../public/videos/video.mp4'}
                            controls
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box component='video'
                            sx={{
                                width: '300px',
                                height: '200px',
                                borderRadius: '10px',
                                border: '1px solid black',
                                margin: '10px',
                            }}
                            alt={`uploaded video(s)`}
                            src={'/videos/video.mp4'}
                            // src={'../../public/videos/video.mp4'}
                            controls
                        />
                    </SwiperSlide>
                </Swiper>
                <Box sx={{
                    marginTop: "20px",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: 'center',
                    maxWidth: '100%', // Ensures the box takes the full width available
                    overflowWrap: 'break-word', // Ensures long words break and wrap to the next line
                }}>
                    <Typography variant='body1'
                        sx={{
                            wordWrap: 'break-word', // Ensures long words wrap within the container
                            maxWidth: '100%', // Prevents overflow
                        }}>
                        {data.description}
                    </Typography>
                </Box>

            </div>
        </div >
    );
}

