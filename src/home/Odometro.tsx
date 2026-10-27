import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

export const Odometro = () => {
    const [kilometers, setKilometers] = useState(125430);
    const [increment, setIncrement] = useState(1);

    const addKilometers = () => {
        setKilometers(prev => prev + increment);
    };

    const formatOdometer = (value) => {
        return value.toString().padStart(6, '0');
    };

    return (
        <div className="flex flex-column justify-content-center">

            <div
                style={{
                    fontFamily: 'monospace',
                    fontSize: '2.5rem',
                    letterSpacing: '0.3rem',
                    background: '#c4c1c1',
                    color: 'rgb(80, 73, 73)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                }}
            >
                {formatOdometer(kilometers)}
            </div>
            <span className="text-green-500 text-center">
                +8.65% <FontAwesomeIcon icon={faArrowUp} className="ml-1" />
            </span>
        </div>
    );
};