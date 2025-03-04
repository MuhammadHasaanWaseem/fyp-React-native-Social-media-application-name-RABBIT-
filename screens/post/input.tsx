import react from 'react' 
import { Post } from '@/lib/type'
import { Text } from '@/components/ui/text'
import { TextInput } from 'react-native'
//hastag post related screen

export const rendertext = (textArray:string[])=>{
if(!textArray) return null
return(
    <Text className=' my-2'>
{ textArray?.map((part,index)=>{
if(part?.startsWith('#')){
const tag =part?.toUpperCase()
return <Text style={{color:'white'}} size="md" key={index} className='font-bold'>{tag}</Text>

}
else {
    return <Text style={{color:'white'}} size="md" key={index} >{part}</Text>
}})}    
        </Text>)}



export default ({post,updatePost,textArray}:{post:Post,updatePost:(id:string,key:string,value:string)=>void,textArray:string[]})=>{
return(
<TextInput
 
 multiline={true}
 onChangeText={(text) => updatePost(post.id, "text",text)}
 className="text-md"
 placeholderTextColor="grey"

 placeholder="What's new?"

 style={{color:'white'}}
>
    {rendertext(textArray)}
</TextInput>


)

}