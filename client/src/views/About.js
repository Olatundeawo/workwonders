import * as React from "react";
import DropDown from '../components/DropDown';
import '../assets/css/About.css';
import Button from "@mui/material/Button";
import { Box, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

export default function About() {
    const services = [
        { icon: ArrowRightAltIcon, sub: 'Dynamic Year: The', text: 'Dynamic Year: The current year is calculated using new Date.getFullYear. Fixed Footer: The footer is fixed at the bottom of the page with position:' },
        { icon: ArrowRightAltIcon, sub: 'Dynamic Year: The', text: 'Dynamic Year: The current year is calculated using new Date.getFullYear. Fixed Footer: The footer is fixed at the bottom of the page with position:e' },
        { icon: ArrowRightAltIcon, sub: 'Dynamic Year: The', text: 'Dynamic Year: The current year is calculated using new Date.getFullYear. Fixed Footer: The footer is fixed at the bottom of the page with position:' }
    ];
    const lists = [{ first: "Drillers kuygyuofuky", second: "Drillers kuygyuofukyDrillers kuygyuofuky" }, { first: "Drillers kuygyuofuky", second: "Drillers kuygyuofukyDrillers kuygyuofuky" }, { first: "Drillers kuygyuofuky", second: "Drillers kuygyuofukyDrillers kuygyuofuky" }, { first: "Drillers kuygyuofuky", second: "Drillers kuygyuofukyDrillers kuygyuofuky" }]


    return (
        <div className="overAll" style={{
            width: '100vw',
            height: '100vh'
        }}>
            <div className="section1">
                <div className="topBar">
                    <Typography variant="h1" sx={{ fontSize: "1.5em", fontWeight: "700" }}>
                        Easy Tech
                    </Typography>
                    <span className="navContainer">
                        <DropDown />
                    </span>
                </div>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: "1.3em",
                        fontWeight: "500",
                        marginTop: "20px",
                        marginBottom: "20px",
                        width: "40%",
                    }}
                >
                    We Create Solutions For Your Business
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1em",
                        marginTop: "20px",
                        marginBottom: "20px",
                        width: "80%"
                    }}
                >
                    Dynamic Year: The current year is calculated using new Date.getFullYear.
                    Fixed Footer: The footer is fixed at the bottom of the page with position:
                </Typography>
                <Button
                    variant="contained"
                    href="#contact"
                    endIcon={<ArrowRightAltIcon />}
                    size="small"
                >
                    Get In Touch
                </Button>
            </div>
            <div className="section2">
                <h1>Our Services</h1>
                <div className="cards">
                    {services.map((service, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: "150px",
                                maxWidth: "30%",
                                // bgcolor: "#1976D2",
                                bgcolor: 'grey',
                                // border: '1px solid black',
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                padding: "10px",
                                margin: "10px",
                            }}
                        >
                            <IconButton sx={{ bgcolor: "#1976D2" }}>
                                <service.icon />
                            </IconButton>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: "0.8em",
                                    fontWeight: "bold",
                                    width: "100%",
                                    textAlign: "center",
                                    marginTop: "5px"
                                }}
                            >
                                {service.sub}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "0.7em",
                                    fontWeight: "bold",
                                    width: "100%",
                                    textAlign: "center",
                                    lineHeight: "10px",
                                    marginTop: "10px"
                                }}
                            >
                                {service.text}
                            </Typography>
                        </Box>
                    ))}
                </div>
            </div>
            <span className="btn">
                <Button

                    variant="contained"
                    href="#contact"
                    endIcon={<ArrowRightAltIcon />}
                    size="small"
                    sx={{
                        top: "-15px"
                    }}
                >
                    Get In Touch
                </Button>
            </span>
            <div className="section3">
                <h2 className="h2">Why Choose Us?</h2>
                <span>
                    <List
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-around"
                        }}>
                        {lists.map((list, index) => (
                            <ListItem key={index}
                                sx={{
                                    width: "130px",
                                }}>
                                <ListItemIcon sx={{
                                    position: "absolute",
                                    top: "10px",
                                    left: 0,
                                    marginRight: "10px",
                                }}>
                                    {/* <ManageAccountsIcon /> */}
                                    <HorizontalRuleIcon />
                                </ListItemIcon>
                                <ListItemText sx={{ marginLeft: "10px" }}
                                > <b>{list.first}</b><h5 className="h5">{list.second}</h5>
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </span>
            </div >
            <div className="section4"
            >
                <Box sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#9CBA9E",
                    margin: "auto",
                }}>
                    <span className="dot"></span>
                    <span className="anniversary">
                        <h1 className="ten">10</h1><h4 className="text">Years <br></br>Of Experience</h4>
                    </span>
                    <span className="dot dot1"></span>
                </Box>
                <div className="points">
                    <span className="number">
                        56k+
                    </span>
                    <Typography variant='body1' sx={{
                        marginBottom: '15px'
                    }}>
                        Machines Created
                    </Typography>
                    <span className="number">
                        56k+
                    </span>
                    <Typography variant='body1'>
                        Sertisfied Customers
                    </Typography>
                </div>
            </div>
        </div>
    );
}
