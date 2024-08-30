import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../assets/css/Contact.css';

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default function ImageSwiper({ imageList }) {
    const [overlay, setOverlayImg] = useState("");
    const [zoom, setZoom] = useState(false);

    function zoomOut(e) {
        const imgSrc = e.target.src;
        setOverlayImg(imgSrc);
        setZoom(true);
    }

    function closeOverlay() {
        setZoom(false);
        setOverlayImg("");
    }

    return (
        <>
            <div style={{ position: 'relative' }}>
                {zoom &&
                    <div className='overlay'
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            backgroundColor: 'rgba(128, 128, 128, 0.8)',
                            height: "100vh",
                            width: '100vw',
                            zIndex: 1000, // Ensure this is high enough to cover other content
                            overflow: 'hidden', // Hide scrollbars if necessary
                        }}>
                        <div
                            style={{
                                position: "absolute",
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1010, // Keep this above the overlay background
                            }}>
                            <IconButton onClick={closeOverlay} >
                                <CloseIcon />
                            </IconButton>
                            <Box component='img'
                                sx={{
                                    width: "90vw",
                                    height: "90vh",
                                }}
                                src={overlay}
                            />
                        </div>
                    </div>}

                <Swiper
                    cssMode={true}
                    navigation={true}
                    pagination={false}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    className="mySwiper"
                >
                    {imageList && imageList.map((element, index) => (
                        <SwiperSlide key={element._id || index} className="custom-slide"
                        >
                            <Box component='img'
                                sx={{
                                    width: '200px',
                                    height: '200px',
                                    minWidth: '100px',
                                    padding: '25px 40px',
                                    border: '1px solid black',
                                    borderRadius: '5px',
                                    margin: "20px auto",
                                }}
                                onClick={zoomOut}
                                src={element}
                            />

                        </SwiperSlide>
                    ))
                    }
                </Swiper>
            </div>
        </>
    );
}
