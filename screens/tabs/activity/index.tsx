import { Divider } from "@/components/ui/divider"
import { HStack } from "@/components/ui/hstack"
import { BellIcon } from "lucide-react-native"
import { FlatList, SafeAreaView,Text, View } from "react-native"
import { Button, ButtonText } from "@/components/ui/button"
import { useState } from "react"
import Follows from "./follows"

const tabs= ['Follows','Likes','Mentions','Comments']
export default ()=>{
  const [selectedtab,setselectedtab]=useState('Follows');
return(

<SafeAreaView style={{backgroundColor:'#141414'}} className="flex-1">

<HStack space="md" style={{marginTop:10}} className="items-center justify-center p-3 ">
  <BellIcon color={'grey'} size={24}/>
  <Text style={{color:'white',fontSize:22,fontWeight:'600'}}>Notifcations</Text>
  </HStack>
  <Divider style={{marginBottom:10}}/>
  {/* header ends here */}
  <View className="flex-grow-0">
<FlatList
showsHorizontalScrollIndicator={false}
contentContainerStyle={{gap:9,padding:7,margin:3}}
data={tabs}
horizontal
renderItem={({item})=>{
  return(
      <Button onPress={()=>setselectedtab(item)} className={`${selectedtab === item ? "bg-white rounded-lg" : "rounded-lg bg-transparent"}`}size="md" variant={selectedtab===item ? "solid" :"outline"}  action="primary">
      <ButtonText style={{color: selectedtab === item ? "black" : "white"}}>{item}</ButtonText>
    </Button>
    
  )
}}/></View>
          <Follows />
</SafeAreaView>

)
}