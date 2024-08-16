import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Button } from '@mui/material';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

export default function DropDown() {
    const [draw, setOpen] = React.useState(false);
    const anchor = 'right';

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
            onKeyDown={toggle(anchor, false)}>
            <List>
                {['Home', 'About', 'Contact'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            {text}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <React.Fragment>
            <Button onClick={toggle(anchor, true)}><MenuRoundedIcon /></Button>
            <Drawer
                anchor={anchor}
                open={draw}
                onClose={toggle(anchor, false)}
            >
                {list(anchor)}
            </Drawer>
        </React.Fragment>
    );
}
