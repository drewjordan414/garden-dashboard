import React from 'react';
import { Card, CardContent } from '@material-ui/core';

const LiveVideo = () => {
    return (
        <Card style={{ height: '400px' }}>
            <CardContent style={{ height: '100%', padding: 0 }}>
                <div className="live-video-container" style={{ height: '100%' }}>
                    <img src="/api/video_feed" alt="Live Video Feed" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                </div>
            </CardContent>
        </Card>
    );
}

export default LiveVideo;

