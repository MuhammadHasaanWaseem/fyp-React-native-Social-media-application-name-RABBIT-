import { CircleX, Search, X } from 'lucide-react-native'
import React, { useState } from 'react'
import { FlatList, Image, Keyboard, SafeAreaView, TouchableOpacity, Linking } from 'react-native'
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input"
import { VStack } from '@/components/ui/vstack'
import { usegif } from '@/hooks/use-gif'
import { router} from 'expo-router'
import { useDebounce } from '@/hooks/use-debounce'
export default () => {
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  const { data } = usegif(debounceSearch)
  const handleupload = async (url: string) => {
    try {
      await Linking.openURL(url)
    } catch (error) {
      console.error("Error opening URL:", error)
    }
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#141414' }} className="flex-1">
      <VStack space="3xl" className="items-center p-5">
        <Input
          className="p-2 rounded-lg"
          style={{ marginTop: 15, borderWidth: 2, width: '100%' }}>
          <InputSlot className="pt-3">
            <InputIcon as={Search} />
          </InputSlot>
          <InputField
            style={{ color: 'white' }}
            onChangeText={setSearch}
            value={search}
            placeholder="Search a gif"
            />
          <InputSlot className="pt-3">
            <TouchableOpacity onPress={Keyboard.dismiss} onLongPress={() => router.back()}>
             <InputIcon as={CircleX} size={24} />
            </TouchableOpacity>
          </InputSlot>
        </Input>
        <FlatList
          data={data?.data}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: 150 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            // Always use the GIF URL from fixed_height (or fallback to original)
            const imageUrl =
              item.images.fixed_height?.url || item.images.original?.url
            return (
              <TouchableOpacity onPress={() => handleupload(imageUrl)}>
                <Image
                  style={{
                    width: 120,
                    height: 130,
                    borderRadius: 9,
                    borderColor: 'white',
                    borderWidth: 1,
                    margin: 5,
                  }}
                  source={{ uri: imageUrl }}
                />
              </TouchableOpacity>
            )
          }}
        />
      </VStack>
    </SafeAreaView>
  )
}
