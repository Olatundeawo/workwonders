import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../assets/css/Contact.css';

// import required modules
import { Navigation, EffectFade, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

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

    const isImageUrl = (url) => {
        return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url.split('?')[0]);
    };

    const imageUrl = imageList.filter(image => isImageUrl(String(image.url)) ? image : null);

    return (
        <>
            <div style={{ position: 'relative' }}>
                {zoom &&
                    <div className='overlay'
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            backgroundColor: 'grey',
                            height: "100vh",
                            width: '100vw',
                            zIndex: 1000,
                            overflow: 'hidden',
                        }}>
                        <div
                            style={{
                                position: "absolute",
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1010,
                            }}>
                            <IconButton onClick={closeOverlay} sx={{
                                float: 'right'
                            }} >
                                <CloseIcon />
                            </IconButton>
                            <Box component='img'
                                sx={{
                                    width: "90vw",
                                    height: "90vh",
                                    maxWidth: '400px',
                                    maxHeight: '80vh'
                                }}
                                src={overlay}
                            />
                        </div>
                    </div>}

                <Swiper
                    spaceBetween={30}
                    effect={'fade'}
                    navigation={true}
                    modules={[EffectFade, Navigation, Pagination]}
                    className="mySwiper"
                >
                    {imageUrl.length > 0 && imageUrl.map((element, index) => (
                        <SwiperSlide key={element._id || index} className="custom-slide"
                        >
                            <Box component='img'
                                sx={{
                                    width: '65%',
                                    height: '19em',
                                    // minWidth: '100px',
                                    // padding: '15px',
                                    border: '1px solid black',
                                    borderRadius: '5px',
                                    margin: "20px auto",
                                    backgroundColor: "grey",
                                }}
                                onClick={zoomOut}
                                src={String(element.url) ? String(element.url) : './images/missing.png'}
                            />

                        </SwiperSlide>
                    ))
                    }
                </Swiper>
            </div>
        </>
    );
}
