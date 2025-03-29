import './App.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from './components/ui/carousel'
import { ScrollArea } from './components/ui/scroll-area'
import React, { useCallback, useEffect, useState } from 'react';

function App() {

  // Fixed the CarouselApi state declaration with proper type
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState(0);

  // Set up an effect to create a timer that scrolls to the next carousel item
  useEffect(() => {
    if (!carouselApi) return;
    
    // Create an interval that calls scrollNext every 3 seconds
    const interval = setInterval(() => {
      carouselApi.scrollNext();
      const currentIndex = carouselApi.selectedScrollSnap();
      setCarouselCurrentIndex(currentIndex);
    }, 4000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(interval);
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    setCarouselCurrentIndex(carouselApi.selectedScrollSnap());
    setCarouselItems(carouselApi.slideNodes().length);
  }, [carouselApi]);


  const carouselAsDots = useCallback(() => {
    if (!carouselApi) return null;
    const totalItems = carouselItems;
    const currentIndex = carouselCurrentIndex;
    const dots = Array.from({ length: totalItems }, (_, index) => (
      <div
        key={index}
        className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
      ></div>
    ));
    return <div className="flex space-x-2 h-full z-">{dots}</div>;
  }, [carouselApi, carouselCurrentIndex, carouselItems]);

  return (
    <div>
      <Card className='min-w-6xl h-fit flex-col flex'>
        <CardHeader> 
          <div className='flex flex-col justify-start items-start'>
            <CardTitle >Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='flex flex-row space-x-20 h-80 w-full'>
          <div className='w-1/4'>
            <p>This is some content inside the card.</p>
            <p>It can contain any HTML elements.</p>
          </div>
          <div>
            <div className='flex-col flex justify-center items-center h-full space-y-1 '>
              <Carousel 
              setApi={setCarouselApi} opts={
                {
                  loop: true,
                }
              } 
              className='w-full max-w-xl flex-grow justify-center items-center'>
                <CarouselContent>
                  <CarouselItem>
                    <div className='h-full justify-center items-center flex bg-red-500'>
                      <img
                        src="images/image.png" 
                        className="object-cover w-full h-full"
                      >
                      </img>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className='h-full justify-center items-center flex bg-red-500'>
                      <img
                        src="images/image.png" 
                        className="object-cover w-full h-full"
                      >
                      </img>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className='h-full justify-center items-center flex bg-red-500'>
                      <img
                        src="images/image.png" 
                        className="object-cover w-full h-full"
                      >
                      </img>
                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
              {carouselAsDots()}
            </div>
          </div>
          <ScrollArea className='h-full w-1/4'> 
            <div className='flex flex-col space-y-4'>
              <div className='h-32 bg-red-500'>Item 1</div>
              <div className='h-32 bg-green-500'>Item 2</div>
              <div className='h-32 bg-blue-500'>Item 3</div>
              <div className='h-32 bg-yellow-500'>Item 4</div>
              <div className='h-32 bg-purple-500'>Item 5</div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
