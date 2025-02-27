import { CircleX, Search, X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Keyboard, SafeAreaView, TouchableOpacity, Linking } from 'react-native'
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input"
import { VStack } from '@/components/ui/vstack'
import { router, useLocalSearchParams} from 'expo-router'
import { useDebounce } from '@/hooks/use-debounce'
import { Text } from 'react-native'
import { useplaces } from '@/hooks/use-place'
import *  as Location from 'expo-location'
import { Place } from '@/lib/type'
import { usePost } from '@/providers/PostProvider'
import { supabase } from '@/lib/supabase'
export default () => {
  const [search, setSearch] = useState('')
  const {updatepost} = usePost()
  const {threadid} =useLocalSearchParams();
  const debounceSearch = useDebounce(search, 500)
   const [location, setLocation] = useState({
    longitude:0,
    latitude:0

   });
   const{data,isLoading,error} = useplaces(debounceSearch,location)
  useEffect(() => {
    getCurrentLocation();

  },
     []);
    
   console.log(error,data)

    const  getCurrentLocation =async ()=> {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setLocation(
    {longitude:location.coords.longitude,
    latitude:location.coords.latitude
  }
    )
    }
const addPlaces = async(place:Place)=>  {
 const { data, error } = await supabase.from('place')
      .insert({
name:place.name,
adress:place?.vicinity ||place?.formatted_adress,
latitude:place?.geometry?.latitude.lat,
longitude:place?.geometry?.longitude?.lng}).select();

      if(!error){
        updatepost(threadid,'place_id',data?.[0]?.id )
      }
console.log(place)
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
            placeholder="Search a location"
            />
          <InputSlot className="pt-3">
            <TouchableOpacity onPress={Keyboard.dismiss} onLongPress={() => router.back()}>
             <InputIcon as={CircleX} size={24} />
            </TouchableOpacity>
          </InputSlot>
        </Input>
        <FlatList
          data={data}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 150 }}
          renderItem={({ item,index }) => {
           
           
            return (
             <TouchableOpacity key={index} onPress={()=>addPlaces(item)}>
                <Text>{item?.name}</Text>
             </TouchableOpacity>
            )
          }}
        />
      </VStack>
    </SafeAreaView>
  )
}















































// import { CircleX, Search } from 'lucide-react-native'
// import React, { useEffect, useState } from 'react'
// import { FlatList, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native'
// import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input"
// import { VStack } from '@/components/ui/vstack'
// import { router, useLocalSearchParams } from 'expo-router'
// import { useDebounce } from '@/hooks/use-debounce'
// import { Text } from 'react-native'
// import { useplaces } from '@/hooks/use-place'
// import * as Location from 'expo-location'
// import { Place } from '@/lib/type'
// import { usePost } from '@/providers/PostProvider'
// import { supabase } from '@/lib/supabase'
// import { Divider } from '@/components/ui/divider'
// import { HStack } from '@/components/ui/hstack'

// export default () => {
//   const [search, setSearch] = useState('')
//   const { updatepost } = usePost()
//   const { threadid } = useLocalSearchParams()
//   const debounceSearch = useDebounce(search, 500)
  
//   const [location, setLocation] = useState({
//     longitude: 0,
//     latitude: 0,
//   })
  
//   // API call to fetch places
//   const { data, isLoading, error } = useplaces(debounceSearch, location)
  
//   useEffect(() => {
//     getCurrentLocation()
//   }, [])
  
//   // Fallback data: 50 most famous locations of Pakistan
//   const fallbackData: Place[] = [
//     { id: '1',  name: 'Islamabad', address: 'Islamabad, Pakistan', latitude: 33.6844, longitude: 73.0479, created_at: new Date() },
//     { id: '2',  name: 'Lahore', address: 'Lahore, Pakistan', latitude: 31.5204, longitude: 74.3587, created_at: new Date() },
//     { id: '3',  name: 'Karachi', address: 'Karachi, Pakistan', latitude: 24.8607, longitude: 67.0011, created_at: new Date() },
//     { id: '4',  name: 'Peshawar', address: 'Peshawar, Pakistan', latitude: 34.0151, longitude: 71.5249, created_at: new Date() },
//     { id: '5',  name: 'Quetta', address: 'Quetta, Pakistan', latitude: 30.1798, longitude: 66.9750, created_at: new Date() },
//     { id: '6',  name: 'Multan', address: 'Multan, Pakistan', latitude: 30.1575, longitude: 71.5249, created_at: new Date() },
//     { id: '7',  name: 'Faisalabad', address: 'Faisalabad, Pakistan', latitude: 31.4504, longitude: 73.1350, created_at: new Date() },
//     { id: '8',  name: 'Rawalpindi', address: 'Rawalpindi, Pakistan', latitude: 33.6007, longitude: 73.0679, created_at: new Date() },
//     { id: '9',  name: 'Hunza Valley', address: 'Hunza Valley, Pakistan', latitude: 36.3167, longitude: 74.4500, created_at: new Date() },
//     { id: '10', name: 'Skardu', address: 'Skardu, Pakistan', latitude: 35.3000, longitude: 75.1500, created_at: new Date() },
//     { id: '11', name: 'Murree', address: 'Murree, Pakistan', latitude: 33.9090, longitude: 73.3940, created_at: new Date() },
//     { id: '12', name: 'Swat Valley', address: 'Swat Valley, Pakistan', latitude: 35.2200, longitude: 72.4250, created_at: new Date() },
//     { id: '13', name: 'Naran', address: 'Naran, Pakistan', latitude: 34.8387, longitude: 73.6260, created_at: new Date() },
//     { id: '14', name: 'Kaghan Valley', address: 'Kaghan Valley, Pakistan', latitude: 34.7740, longitude: 73.4923, created_at: new Date() },
//     { id: '15', name: 'Chitral', address: 'Chitral, Pakistan', latitude: 35.8333, longitude: 71.7833, created_at: new Date() },
//     { id: '16', name: 'Gwadar', address: 'Gwadar, Pakistan', latitude: 25.1265, longitude: 62.3250, created_at: new Date() },
//     { id: '17', name: 'Mohenjo-Daro', address: 'Mohenjo-Daro, Pakistan', latitude: 27.3292, longitude: 68.1386, created_at: new Date() },
//     { id: '18', name: 'Taxila', address: 'Taxila, Pakistan', latitude: 33.7456, longitude: 72.8153, created_at: new Date() },
//     { id: '19', name: 'Badshahi Mosque', address: 'Badshahi Mosque, Lahore, Pakistan', latitude: 31.5889, longitude: 74.3109, created_at: new Date() },
//     { id: '20', name: 'Lahore Fort', address: 'Lahore Fort, Lahore, Pakistan', latitude: 31.5870, longitude: 74.3107, created_at: new Date() },
//     { id: '21', name: 'Minar-e-Pakistan', address: 'Minar-e-Pakistan, Lahore, Pakistan', latitude: 31.5880, longitude: 74.3100, created_at: new Date() },
//     { id: '22', name: 'Faisal Mosque', address: 'Faisal Mosque, Islamabad, Pakistan', latitude: 33.7129, longitude: 73.0965, created_at: new Date() },
//     { id: '23', name: 'Shalimar Gardens', address: 'Shalimar Gardens, Lahore, Pakistan', latitude: 31.6400, longitude: 74.3100, created_at: new Date() },
//     { id: '24', name: 'Rohtas Fort', address: 'Rohtas Fort, Jhelum, Pakistan', latitude: 32.9889, longitude: 73.4800, created_at: new Date() },
//     { id: '25', name: 'Derawar Fort', address: 'Derawar Fort, Bahawalpur, Pakistan', latitude: 29.9900, longitude: 71.5300, created_at: new Date() },
//     { id: '26', name: 'Khewra Salt Mines', address: 'Khewra Salt Mines, Punjab, Pakistan', latitude: 32.6333, longitude: 73.7833, created_at: new Date() },
//     { id: '27', name: 'Ranikot Fort', address: 'Ranikot Fort, Sindh, Pakistan', latitude: 26.5000, longitude: 68.2000, created_at: new Date() },
//     { id: '28', name: 'Baltit Fort', address: 'Baltit Fort, Hunza, Pakistan', latitude: 36.3125, longitude: 74.6361, created_at: new Date() },
//     { id: '29', name: 'Altit Fort', address: 'Altit Fort, Hunza, Pakistan', latitude: 36.3167, longitude: 74.6333, created_at: new Date() },
//     { id: '30', name: 'Hingol National Park', address: 'Hingol National Park, Balochistan, Pakistan', latitude: 26.7500, longitude: 66.5000, created_at: new Date() },
//     { id: '31', name: 'Fairy Meadows', address: 'Fairy Meadows, Pakistan', latitude: 35.3600, longitude: 74.6540, created_at: new Date() },
//     { id: '32', name: 'Lake Saif ul Malook', address: 'Lake Saif ul Malook, Kaghan Valley, Pakistan', latitude: 34.9230, longitude: 73.4900, created_at: new Date() },
//     { id: '33', name: 'Neelum Valley', address: 'Neelum Valley, Azad Kashmir, Pakistan', latitude: 34.7500, longitude: 73.5000, created_at: new Date() },
//     { id: '34', name: 'Shandur Pass', address: 'Shandur Pass, Pakistan', latitude: 35.2728, longitude: 72.5017, created_at: new Date() },
//     { id: '35', name: 'Katas Raj Temples', address: 'Katas Raj Temples, Chakwal, Pakistan', latitude: 32.6611, longitude: 72.7800, created_at: new Date() },
//     { id: '36', name: 'Makli Necropolis', address: 'Makli Necropolis, Thatta, Pakistan', latitude: 24.7461, longitude: 67.9044, created_at: new Date() },
//     { id: '37', name: 'Mohatta Palace', address: 'Mohatta Palace, Karachi, Pakistan', latitude: 24.8600, longitude: 67.0100, created_at: new Date() },
//     { id: '38', name: 'Frere Hall', address: 'Frere Hall, Karachi, Pakistan', latitude: 24.8600, longitude: 67.0015, created_at: new Date() },
//     { id: '39', name: 'Quaid-e-Azam Mausoleum', address: "Quaid-e-Azam's Mausoleum, Karachi, Pakistan", latitude: 24.8600, longitude: 67.0011, created_at: new Date() },
//     { id: '40', name: 'Chaukhandi Tombs', address: 'Chaukhandi Tombs, near Karachi, Pakistan', latitude: 24.5000, longitude: 67.3000, created_at: new Date() },
//     { id: '41', name: 'Thatta', address: 'Thatta, Sindh, Pakistan', latitude: 24.7470, longitude: 67.9350, created_at: new Date() },
//     { id: '42', name: 'Khyber Pass', address: 'Khyber Pass, Pakistan-Afghanistan Border', latitude: 33.9840, longitude: 70.0000, created_at: new Date() },
//     { id: '43', name: 'Kund Malir Beach', address: 'Kund Malir Beach, Balochistan, Pakistan', latitude: 25.2000, longitude: 66.0000, created_at: new Date() },
//     { id: '44', name: 'Hinglaj Mata Mandir', address: 'Hinglaj Mata Mandir, Balochistan, Pakistan', latitude: 26.5000, longitude: 66.7500, created_at: new Date() },
//     { id: '45', name: 'Ziarat', address: 'Ziarat, Balochistan, Pakistan', latitude: 30.1931, longitude: 67.4750, created_at: new Date() },
//     { id: '46', name: 'Khunjerab Pass', address: 'Khunjerab Pass, Pakistan-China Border', latitude: 36.3125, longitude: 75.2322, created_at: new Date() },
//     { id: '47', name: 'Deosai National Park', address: 'Deosai National Park, Gilgit-Baltistan, Pakistan', latitude: 35.1050, longitude: 75.1920, created_at: new Date() },
//     { id: '48', name: 'Gorakh Hill Station', address: 'Gorakh Hill Station, Sindh, Pakistan', latitude: 27.7833, longitude: 68.6000, created_at: new Date() },
//     { id: '49', name: 'Sialkot', address: 'Sialkot, Pakistan', latitude: 32.4946, longitude: 74.5312, created_at: new Date() },
//     { id: '50', name: 'Bahawalpur', address: 'Bahawalpur, Pakistan', latitude: 29.3957, longitude: 71.6837, created_at: new Date() }
//   ]
  
//   // Determine which data to display (API data if available; fallback otherwise) and filter by search text.
//   const displayData = (data && data.length > 0 ? data : fallbackData).filter(item =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   )
  
//   const getCurrentLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync()
//     if (status !== 'granted') {
//       alert('Permission to access location was denied')
//       return
//     }
//     let locationData = await Location.getCurrentPositionAsync()
//     setLocation({
//       longitude: locationData.coords.longitude,
//       latitude: locationData.coords.latitude,
//     })
//   }
  
//   const addPlaces = async (place: Place) => {
//     console.log(place)
//   }
  
//   return (
//     <SafeAreaView style={{ backgroundColor: '#141414' }} className="flex-1">
//       <VStack space="3xl" className=" p-5">
//         <Input
//           className="p-2 rounded-lg"
//           style={{ marginTop: 15, borderWidth: 2, width: '100%' }}>
//           <InputSlot className="pt-3">
//             <InputIcon as={Search} />
//           </InputSlot>
//           <InputField
//             style={{ color: 'white' }}
//             onChangeText={setSearch}
//             value={search}
//             placeholder="Search a location"
//           />
//           <InputSlot className="pt-3">
//             <TouchableOpacity onPress={Keyboard.dismiss} onLongPress={() => router.back()}>
//               <InputIcon as={CircleX} size={24} />
//             </TouchableOpacity>
//           </InputSlot>
//         </Input>
//         <FlatList
//           data={displayData}
//           numColumns={1}
//           contentContainerStyle={{ paddingBottom: 150 }}
//           renderItem={({ item,index }) => (
//             <TouchableOpacity key={index} onPress={() => addPlaces(item)}>
//               <HStack>
//               <Text style={{ color: 'white' ,fontSize:19,gap:4}}>{item?.name}</Text>
//               <Text style={{ color: 'white' ,fontSize:8}}>lng {item.latitude} lat {item.latitude}</Text>
//               </HStack>
//               <Divider/>
//             </TouchableOpacity>
//           )}
//         />
//       </VStack>
//     </SafeAreaView>
//   )
// }
