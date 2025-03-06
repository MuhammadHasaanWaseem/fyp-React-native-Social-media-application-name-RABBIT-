import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { HStack } from '@/components/ui/hstack'
import { ArrowLeft } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useThread } from '@/hooks/use-thread'
import { VStack } from '@/components/ui/vstack'
import { Divider } from '@/components/ui/divider'
import { useAuth } from '@/providers/AuthProviders'
import view from './view'

const Thread = () => {
  
    const { user } = useAuth();
   const {id} =useLocalSearchParams()
//   const {data,isLoading,error,refetch} =useThread(id as string)

  return (
    <View style={{ backgroundColor: '#141414', flex: 1 }}>
      <HStack style={{ marginTop: 43, marginHorizontal: 14, alignItems: 'center' }}>
        {/* Back Arrow */}
<TouchableOpacity onPress={()=>router.back()}>
<ArrowLeft color={'white'} />

</TouchableOpacity>
        {/* Title Centered */}
        <View style={{ flex: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0 }}>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>Add to Threads</Text>
        </View>
      </HStack>
<VStack space="md">
 {/* <View item={data[0]} />  */}
  <Divider/>
</VStack>

    </View>
  )
}

export default Thread
