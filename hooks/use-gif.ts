import { Query, useQuery } from "@tanstack/react-query";
//api for gif
export const gettrendingGif =async()=>{
    const response = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=Q1uy4ohRcOcdgLFOJSciSoxeOpuRgEGJ&limit=100&offset=0&rating=g&bundle=messaging_non_clips');
    const data=await response.json();
    return data;

}
// searching gifs function
export const searchgif =async(query:string)=>{
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=Q1uy4ohRcOcdgLFOJSciSoxeOpuRgEGJ&q=${query}&limit=100&offset=0&rating=g&lang=en&bundle=messaging_non_clips`);
    const data=await response.json();
    return data;
}

//using gif
export const usegif =(query:string)=>{
    const {data,isLoading,error,refetch} =useQuery({
        queryKey:["gifs",query],
        queryFn:()=>query? searchgif(query):gettrendingGif()
    });
    return {data,isLoading,error,refetch}
}