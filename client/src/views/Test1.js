import React, { useEffect, useState } from 'react';

export default function GetIp() {
    const [ip, setIp] = useState('');

    useEffect(() => {
        const fetchIp = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                setIp(response.data.ip);
                console.log('my ip is :', ip)
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };

        fetchIp();
    }, []);

    return (
        <div>
            <h1>Your IP Address is: {ip}</h1>
        </div>
    );
}