import {  useQuery } from "@tanstack/react-query";
//api for gif
const apikey='AIzaSyBIhHv-66nuJJmLfqbuW5JQBdPwyDzEO2k';
export const GetSearch =async(search:string ,location:{latitude:number,longitude:number} | null)=>{
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?radius=1i0&query=${search}&location=${location.latitude}%2C${location.longitude}&key=${apikey}`);
    const {results}=await response.json();
    return results;

}
// searching gifs function
export const GetNearby =async(location:{latitude:number,longitude:number} | null)=>{
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=restaurant&radius=1&location=${location.latitude}%2C${location.longitude}&key=${apikey}`);
    const results=await response.json();
    return results;
}

//using gif
export const useplaces =(search:string |null ,location:{latitude:number,longitude:number} | null)=>{
    const {data,isLoading,error} =useQuery({
        queryKey:["places",search],
        queryFn:()=>search? GetSearch(search,location):GetNearby(location)
    });
    return {data,isLoading,error}
}
//AIzaSyBIhHv-66nuJJmLfqbuW5JQBdPwyDzEO2k