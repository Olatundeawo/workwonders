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
        <div className="overAll">
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
                                bgcolor: "green",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                padding: "10px",
                                margin: "10px",
                            }}
                        >
                            <IconButton sx={{ bgcolor: "white" }}>
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
                            <ListItem sx={{
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
            // sx={{
            //     margin: "auto",
            //     paddingLeft: 300
            // }}
            >
                <Box sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "red",
                    margin: "auto",

                    "&::before": {
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        // display: "flex",
                        // alignItems: "center",
                        // justifyContent: "center",
                        bgcolor: "black",
                        top: -15,
                        left: -25,
                        zIndex: -1,
                    }
                }}>
                    <h1>10</h1><br /><h4>Years Of Experience</h4>
                </Box>
            </div>
        </div >
    );
}
