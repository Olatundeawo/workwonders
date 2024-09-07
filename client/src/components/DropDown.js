import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Button } from '@mui/material';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Link } from "react-router-dom";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonIcon from '@mui/icons-material/Person';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Form from "./Form";
import "../assets/css/DropDown.css";
import IsAdmin from "../utils/IsAdmin";

export default function DropDown() {
    const [visible, isVisible] = React.useState(false);
    const toggleForm = (vise) => {
        isVisible(vise !== undefined ? vise : !visible)
    };

    const [draw, setOpen] = React.useState(false);
    const anchor = 'right';
    const routes = [{ name: "Home", route: "/", icon: HomeIcon }, { name: 'Machines', route: '/machines', icon: PrecisionManufacturingIcon }, { name: 'Contact', route: "/contact", icon: ContactSupportIcon }];
    const admin = IsAdmin()

    if (admin) {
        const adminOption = { name: 'Admin', route: "/admin", icon: PersonIcon }
        routes.push(adminOption)
    }

    const toggle = (anchor, open) => (e) => {
        if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const list = (anchor) => (
        <Box
            role="presentation"
            onClick={toggle(anchor, false)}
            onKeyDown={toggle(anchor, false)}
            sx={{
                height: "100vh",
                // bgcolor: "#3E5C6B",
                bgcolor: "#8F9B9E"
            }}
        >
            <List>
                {routes.map((item, index) => (
                    <ListItem key={item.name} >
                        < Link to={item.route} className='no-link-style'>
                            <ListItemButton >
                                <ListItemIcon>
                                    < item.icon />
                                </ListItemIcon>
                                {item.name}
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                {admin &&
                    <ListItem>
                        <ListItemButton onClick={toggleForm}>
                            <ListItemIcon>
                                < LoginRoundedIcon />
                            </ListItemIcon>
                            Login
                        </ListItemButton>
                    </ListItem>}
            </List>
        </Box>
    );

    return (
        <>
            <React.Fragment >
                <Button onClick={toggle(anchor, true)}
                    sx={{ color: 'black' }} >
                    <MenuRoundedIcon fontSize="large" /></Button>
                <Drawer
                    anchor={anchor}
                    open={draw}
                    onClose={toggle(anchor, false)}
                >
                    {list(anchor)}
                </Drawer>
            </React.Fragment>
            <div className='form-container'>
                {admin && visible && <Form type="signup" toggleForm={toggleForm} />}
            </div>
        </>
    );
}
