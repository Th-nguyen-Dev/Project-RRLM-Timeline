import './App.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
// import { CarouselApi, CarouselItem } from './components/ui/carousel'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ScrollArea } from './components/ui/scroll-area'
import { useCallback, useEffect, useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './components/ui/chart'

export interface MilestoneProps {
  owner: string;
  repo: string;
  branch: string;

  tittle: string;
  subtittle: string;

  description: string;
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

function Milestone({content}: {content: MilestoneProps}) {
  // Fixed the CarouselApi state declaration with proper type
  // const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  // const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0);
  // const [carouselItems, setCarouselItems] = useState(0);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchCommits() {

    try {
      const cachedDataUrl = `${import.meta.env.BASE_URL}data/${content.owner}-${content.repo}-${content.branch}-commits.json`;
      const response = await fetch(cachedDataUrl);
      if (response.ok) {
        const data = await response.json();
        setCommits(data);
      } else {
        console.error(`Failed to fetch commits: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching commits:", error);
    }
  }
  fetchCommits();
  },[content]);

  useEffect(() => {
    async function fetchContribution() {

    try {
      const cachedDataUrl = `${import.meta.env.BASE_URL}data/${content.owner}-${content.repo}-${content.branch}-contribution.json`;
      const response = await fetch(cachedDataUrl);
      if (response.ok) {
        const data = await response.json();
        const transformedData = data[0].weeks.map((week: { w: number; a: number; d: number }) => ({
          w: new Date(week.w * 1000).toLocaleDateString(),
          additions: week.a,
          deletions: week.d,
        }));
        console.log(transformedData);
        setChartData(transformedData);
      } else {
        console.error(`Failed to fetch commits: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching commits:", error);
    }
  }
  fetchContribution();
  },[content]);

  // Set up an effect to create a timer that scrolls to the next carousel item
  // useEffect(() => {
  //   if (!carouselApi) return;
    
  //   // Create an interval that calls scrollNext every 3 seconds
  //   const interval = setInterval(() => {
  //     carouselApi.scrollNext();
  //     const currentIndex = carouselApi.selectedScrollSnap();
  //     setCarouselCurrentIndex(currentIndex);
  //   }, 4000);
    
  //   // Clean up the interval when component unmounts
  //   return () => clearInterval(interval);
  // }, [carouselApi]);

  // useEffect(() => {
  //   if (!carouselApi) return;
  //   setCarouselCurrentIndex(carouselApi.selectedScrollSnap());
  //   setCarouselItems(carouselApi.slideNodes().length);
  // }, [carouselApi]);

  const commitsDisplay = useCallback(() => {
    if (!commits) return null;
    const limitWords = (text: string, wordLimit: number = 15): string => {
      const words = text.split(/\s+/);
      if (words.length <= wordLimit) return text;
      return words.slice(0, wordLimit).join(' ') + '...';
    };
    const commitList = commits.map((commit, index) => (
      <div key={index} className='w-full flex flex-col space-y-1'>
        <div className='w-full h-0.5 bg-gray-300 rounded-full pr-3'></div>
        <div className='flex flex-row space-x-1 w-full'>
          <img
            src={commit.author?.avatar_url || 'https://via.placeholder.com/150'}
            alt={commit.commit.author.name}
            className='w-8 h-8 rounded-full mb-2 border-1 text-gray-300'
          >
          </img>
          <a  
            href={commit.html_url}
            target='_blank'
            rel='noopener noreferrer'
            className='w-[calc(100%-2rem)]'
          >
            <p className='w-full line-clamp-2 text-green-600 hover:text-green-500   transition-colors text-sm/tight font-semibold'>
              {limitWords(commit.commit.message, 12)} 
            </p>
          </a>
        </div>
        <div className='flex-row flex justify-between'>
        <p className='text-xs text-gray-300'>{commit.commit.author.name}</p>
        <p className='text-xs text-gray-300'>{new Date(commit.commit.author.date).toLocaleDateString()}</p>
        </div>
      </div>
    ));
    return (
      <div className='flex flex-col text-left space-y-2'>
        {commitList}
      </div>
    );
  }, [commits]);

  
  const chartConfig = {
    additions: {
      label: "Additions",
      color: "var(--chart-1)",
    },
    deletions: {
      label: "Deletions",
      color: "var(--chart-2)",
    },
  } 


  // const carouselImageDisplay = useCallback(() => {
  //   if (!carouselApi) return null;
  //   const { imageLink, imageDescription } = content;
  //   const images = imageLink.map((imageUrl, index) => (
  //     <CarouselItem key={index} className='w-full h-full'>
  //       <img
  //         src={imageUrl}
  //         alt={imageDescription[index] || ''}
  //         className="object-cover w-full h-full"
  //       />
  //     </CarouselItem>
  //   ));
  //   return images;
  // }, [carouselApi, content]);


  // const carouselAsDots = useCallback(() => {
  //   if (!carouselApi) return null;
  //   const totalItems = carouselItems;
  //   const currentIndex = carouselCurrentIndex;
  //   const dots = Array.from({ length: totalItems }, (_, index) => (
  //     <div
  //       key={index}
  //       className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
  //     ></div>
  //   ));
  //   return <div className="flex-col flex space-y-2 h-full justify-center items-center">{dots}</div>;
  // }, [carouselApi, carouselCurrentIndex, carouselItems]);

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
            <ChartContainer config={chartConfig} className='w-2/4 h-full'>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="w"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                ></YAxis>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                  <Bar dataKey="additions" fill="var(--chart-1)" radius={4} />
                  <Bar dataKey="deletions" fill="var(--chart-2)" radius={4} />
              </BarChart>
            </ChartContainer>
            <ScrollArea className='h-full w-1/4 px-2'> 
                <div className='w-full pr-2'>
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
