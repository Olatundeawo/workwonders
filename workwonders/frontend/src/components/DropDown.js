import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Button } from '@mui/material';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Link } from "react-router-dom"
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import Form from "./Form"
import "../assets/css/DropDown.css"

export default function DropDown() {
    const [visible, isVisible] = React.useState(false);
    const toggleForm = (vise) => {
        isVisible(vise !== undefined ? vise : !visible)
    };

    const [draw, setOpen] = React.useState(false);
    const anchor = 'right';
    const routes = [{ name: 'Home', route: '/', icon: HomeIcon }, { name: "About", route: "about", icon: InfoIcon }, { name: 'Contact', route: "contact", icon: ConnectWithoutContactIcon }];

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
        >
            <List>
                {routes.map((item, index) => (
                    <ListItem key={item.name} >
                        < Link to={item.route}>
                            <ListItemButton >
                                <ListItemIcon>
                                    < item.icon />
                                </ListItemIcon>
                                {item.name}
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <ListItem>
                    <ListItemButton onClick={toggleForm}>
                        <ListItemIcon>
                            < LoginRoundedIcon />
                        </ListItemIcon>
                        Login
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <React.Fragment>
                <Button onClick={toggle(anchor, true)}><MenuRoundedIcon fontSize="large" /></Button>
                <Drawer
                    anchor={anchor}
                    open={draw}
                    onClose={toggle(anchor, false)}
                >
                    {list(anchor)}
                </Drawer>
            </React.Fragment>
            <div className='form'>
                {visible && <Form type="signup" toggleForm={toggleForm} />}
            </div>
        </>
    );
}
