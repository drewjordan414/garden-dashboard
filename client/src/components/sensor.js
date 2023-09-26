import React from 'react';

const SensorData = ({ title, value, unit }) => {
    return (
        <div className="sensor-data-container">
            <strong>{title}:</strong> {value} {unit}
        </div>
    );
}

export default SensorData;
