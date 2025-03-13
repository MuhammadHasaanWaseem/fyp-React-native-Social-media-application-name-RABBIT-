import {  SearchIcon } from "lucide-react-native"
import { SafeAreaView,Text } from "react-native"

import Users from "./users"
import { VStack } from "@/components/ui/vstack"
import { Input, InputSlot, InputIcon, InputField } from "@/components/ui/input"

export default ()=>{
 

  
return(

<SafeAreaView style={{backgroundColor:'#141414'}} className="flex-1">
<VStack space="md" style={{marginTop:30}}>
  <Text style={{fontSize:24,fontWeight:'700',marginBottom:3,marginLeft:5,color:'white'}} >Search</Text>
<Input className="rounded-lg" style={{backgroundColor:'#242424',margin:5,}}>
      <InputSlot style={{paddingLeft:6}}>
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField style={{color:'#141414'}}  placeholder="Search Users" />
    </Input> 
</VStack>
<Users/>
</SafeAreaView>

)
}