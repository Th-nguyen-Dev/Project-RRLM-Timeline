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
import { useCallback, useEffect, useState } from 'react';

export interface MilestoneProps {
  owner: string;
  repo: string;
  branch: string;

  tittle: string;
  subtittle: string;

  description: string;

  imageDescription: [string];
  imageLink: [string];
}

interface GitHubCommitAuthor {
  name: string;
  email: string;
  date: string;
}

interface GitHubCommitDetails {
  author: GitHubCommitAuthor;
  committer: GitHubCommitAuthor;
  message: string;
  tree: {
    sha: string;
    url: string;
  };
  url: string;
  comment_count: number;
  verification: {
    verified: boolean;
    reason: string;
    signature: string | null;
    payload: string | null;
  };
}

interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: GitHubCommitDetails;
  url: string;
  html_url: string;
  comments_url: string;
  author: {
    login: string;
    id: number;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
  } | null;
  committer: {
    login: string;
    id: number;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
  } | null;
  parents: {
    sha: string;
    url: string;
    html_url: string;
  }[];
}

function Milestone({content, auth_token}: {content: MilestoneProps, auth_token: string}) {
  // Fixed the CarouselApi state declaration with proper type
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState(0);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);

  useEffect(() => {
    async function fetchCommits() {

    const cachedDataUrl = `${import.meta.env.BASE_URL}data/${content.owner}-${content.repo}-${content.branch}.json`;
    const response = await fetch(cachedDataUrl);
    if (response.ok) {
      const data = await response.json();
      setCommits(data);
    }
  }
  fetchCommits();
  },[content, auth_token]);

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

  const commitsDisplay = useCallback(() => {
    if (!commits) return null;
    const commitList = commits.map((commit, index) => (
      <div key={index} className='w-full flex flex-col'>
        <div className='w-full h-0.5 bg-gray-300 rounded-full pr-3'></div>
        <a 
          className='w-full text-sm/tight font-semibold text-green-600 hover:text-green-500 transition-colors line-clamp-2' 
          href={commit.html_url}
          target='_blank'
          rel='noopener noreferrer'
        >
          {commit.commit.message}
        </a>
        <p className='text-xs text-gray-300'>{commit.commit.author.name}</p>
        <p className='text-xs text-gray-300'>{new Date(commit.commit.author.date).toLocaleDateString()}</p>
      </div>
    ));
    return (
      <div className='flex flex-col text-left space-y-2'>
        {commitList}
      </div>
    );
  }, [commits]);

  const carouselImageDisplay = useCallback(() => {
    if (!carouselApi) return null;
    const { imageLink, imageDescription } = content;
    const images = imageLink.map((imageUrl, index) => (
      <CarouselItem key={index} className='w-full h-full'>
        <img
          src={imageUrl}
          alt={imageDescription[index] || ''}
          className="object-cover w-full h-full"
        />
      </CarouselItem>
    ));
    return images;
  }, [carouselApi, content]);


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
    return <div className="flex-col flex space-y-2 h-full justify-center items-center">{dots}</div>;
  }, [carouselApi, carouselCurrentIndex, carouselItems]);

  return (
    <div>
      <div className='relative z-30'>
        <Card className='min-w-6xl h-fit flex-col flex border-2 border-gray-300'>
          <CardHeader> 
            <div className='flex flex-col justify-start items-start space-y-1'>
              <CardTitle className='text-4xl font-bold'>{content.tittle}</CardTitle>
              <CardDescription className='text-xl'>{content.subtittle}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className='flex flex-row h-80 w-full space-x-3'>
            <div className='w-1/4 h-h-full text-left'>
              <p>{content.description}</p>
            </div>
              <div className='w-2/4 flex-row flex justify-center items-center h-full space-x-1 overflow-y-hidden'>
                <Carousel 
                setApi={setCarouselApi} opts={
                  {
                    loop: true,
                  }
                } 
                className='w-full justify-center items-center'>
                  <CarouselContent className='w-full h-full'>
                    {carouselImageDisplay()}
                  </CarouselContent>
                </Carousel>
                {carouselAsDots()}
              </div>
            <ScrollArea className='h-full w-1/4'> 
                <div className='w-full'>
                  {commitsDisplay()}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default Milestone;
