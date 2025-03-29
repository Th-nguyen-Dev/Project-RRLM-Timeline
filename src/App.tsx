import Milestone from "@/Milestone"
import { useState } from 'react'
import { MilestoneProps } from '@/Milestone'
import milestoneData from './content.json'

function App() {
    const [auth_token] = useState(import.meta.env.VITE_GITHUB_TOKEN)
    
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
                        auth_token={auth_token}
                    />
                ))}
            </div>
        </div>
    )
}

export default App