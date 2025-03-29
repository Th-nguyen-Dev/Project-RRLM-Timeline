import Milestone from "@/milestone"
import { useState } from 'react'
import { MilestoneProps } from '@/milestone'
import milestoneData from './content.json'

function App() {
    return (
        <div className="min-h-screen relative">
            {/* Repeating background div */}
            <div 
                className="fixed top-0 left-0 w-full h-full z-0" 
                style={{ 
                    backgroundImage: `url(${import.meta.env.BASE_URL}images/background.jpg)`,
                    backgroundRepeat: 'repeat', // Makes the image repeat
                    backgroundSize: 'cover', // Ensures the image covers the entire div
                }}  
            />
            
            {/* Content container */}
            <div className="flex flex-col space-y-6 p-6 relative z-10">
                {milestoneData.map((milestone, index) => (
                    <Milestone
                        key={index}
                        content={milestone as MilestoneProps}
                    />
                ))}
            </div>
        </div>
    )
}

export default App