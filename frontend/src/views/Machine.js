import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchMachine from '../api/FetchMachine';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { List, IconButton, ListItem, ListItemButton, ListItemIcon, Button, Box, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UpdateIcon from '@mui/icons-material/Update';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Data from '../db/data.json'


// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default function Machine() {
    const { id } = useParams();
    const [machineData, setMachineData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState(<MoreVertIcon />);

    const toggle = () => {
        setVisible(prevVisible => {
            const newVisible = !prevVisible;
            setAction(newVisible ? <CloseIcon /> : <MoreVertIcon />);
            return newVisible;
        });
    };

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMachine(id);
                setMachineData(data);
                console.log('Machine data fetched:', data);
            } catch (error) {
                console.error('Error fetching machine data:', error);
            }
        };

        fetchData();
    }, [id]);

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
                                    <ListItemButton>
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
                marginTop: "20px"
            }}>
                <Typography variant='h5'>
                    Title
                </Typography>
                <Swiper
                    cssMode={true}
                    navigation={true}
                    pagination={true}
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
                            alt={`uploaded video `}
                            src={'/videos/video.mp4'}
                            // src={'../../public/videos/video.mp4'}
                            controls
                        />
                    </SwiperSlide>
                </Swiper>
                <Box sx={{
                    textAlign: 'left',
                    marginTop: "20px",
                }}>
                    <Typography variant='p'>
                        public Folder: Files placed in the public folder can be accessed via the root URL. Therefore, a file located at public/videos/video.mp4 would be accessed with /videos/video.mp4.
                        src Folder: Files in the src folder need to be imported since they are bundled with the application during the build process.
                        By following the appropriate method based on where the file is located, you should be able to get the video to display correctly.
                    </Typography>
                </Box>
            </div>
        </div>
    );
}

