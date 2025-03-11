import { CircleX, Search, } from 'lucide-react-native'
import React, { useState } from 'react'
import { FlatList, Image, Keyboard, SafeAreaView, TouchableOpacity, Linking } from 'react-native'
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input"
import { VStack } from '@/components/ui/vstack'
import { router} from 'expo-router'
export default () => {
  const [search, setSearch] = useState('')
  
  return (
    <SafeAreaView style={{ backgroundColor: '#141414' }} className="flex-1">
      <VStack space="3xl" className="items-center p-5">
        <Input
          className="p-2 rounded-lg"
          style={{ marginTop: 15, borderWidth: 1, width: '100%' }}>
          <InputSlot className="pt-3">
            <InputIcon as={Search} />
          </InputSlot>
          <InputField
            style={{ color: 'white' }}
            onChangeText={setSearch}
            value={search}
            placeholder="Enter Username to search"
            />
          <InputSlot className="pt-3">
            <TouchableOpacity onPress={Keyboard.dismiss} onLongPress={() => router.back()}>
             <InputIcon as={CircleX} size={24} />
            </TouchableOpacity>
          </InputSlot>
        </Input>
        <FlatList
          data={[]}
          renderItem={({ item }) => {
            
            return (
              null
            )
          }}
        />
      </VStack>
    </SafeAreaView>
  )
}
