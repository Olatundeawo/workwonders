import React, { useState } from 'react';
import CreateMachine from "../components/CreateMachine";
import CreateCategory from "../components/CreateCategory";
import { Button } from '@mui/material';
import DropDown from '../components/DropDown'

import '../assets/css/Admin.css';
import zIndex from '@mui/material/styles/zIndex';

export default function App() {
    const pages = { machine: CreateMachine, category: CreateCategory };
    const [page, setPage] = useState('machine');
    const CurrentPageComponent = pages[page];

    function togglePage(pageType) {
        setPage(pageType);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <div className='drop' >
                <DropDown />
            </div>
            <div className='header'>
                <Button onClick={() => togglePage('machine')}>Add A Machine</Button>
                <Button onClick={() => togglePage('category')}>Create A Category</Button>
            </div>
            <div style={{
                zIndex: '10'
            }}>
                <CurrentPageComponent />
            </div>
        </div>
    );
}
