import { usePost } from '@/providers/PostProvider';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { CheckCircle, Circle, CircleX, SquareX, SwitchCameraIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, Button, Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { router, useLocalSearchParams } from 'expo-router';


export default ()=> {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef =useRef<CameraView>(null)
  const {uploadFile,Photo,MediaType,setMediaType, setPhoto} =usePost()
  const{threadId} =useLocalSearchParams();  console.log(threadId)

 const CAPTURED_UPLOADED =()=>{

  
  
    router.back();
    
    
 }
 
                  const takePicture= async()=>{
                  if(cameraRef.current && threadId){
                  const photo = await cameraRef.current.takePictureAsync();
                  if(!photo) return

                  setPhoto(photo.uri);
                  setMediaType('image/jpg');

                  console.log(photo.uri)
                  let filename = photo.uri.split('/').pop()
                  if(!filename) return
                  //uploading file to the supabase storage
                  uploadFile(threadId,photo?.uri,`image/${filename.split('.').pop()}`,filename);
                  } 
                    }
                  if (!permission) {
                    // Camera permissions are still loading.
                    return <View />;
                  }

                if (!permission.granted) {
                // Camera permissions are not granted yet.
              
                return (
                  <View  className='flex-1 items-center justify-center'>
                    <Text className='text-center text-2xl'> We need your permission to show the camera</Text>
                    <Button onPress={requestPermission} title="grant permission" />
                  </View>
                );
              }
                  if(Photo)  return(
        
                 <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                       {
                        (Photo && MediaType?.startsWith('image/')?
                        <Image source={{uri:Photo}} className='h-full w-full absolute'/>:null)
                       }
                        <HStack>
                        <HStack>
                          <TouchableOpacity 
                          onPress={CAPTURED_UPLOADED}>
                          <CheckCircle size={25} strokeWidth={3} color={'green'}/>
                  </TouchableOpacity>
                  <Text style={{color:'white'}} >{" "}upload?
                  </Text>
                  </HStack>
                  <HStack>
                  <TouchableOpacity style={{marginLeft:50}} onPress={()=>setPhoto('')}>
                    <CircleX size={25} color={'red'} strokeWidth={3}/>
                  </TouchableOpacity>
                  <Text style={{color:'white'}} > Re Capture?</Text>
                  </HStack></HStack>
                  <Text></Text>
                  <Text></Text>
                  <Text></Text>
                  </View>      
                  )
                    

                      function toggleCameraFacing() {
                        setFacing(current => (current === 'back' ? 'front' : 'back'));
                      }

                            return (
                                <CameraView style={{flex:1,padding:150}} facing={facing} ref={cameraRef}>
                                  <View className='flex-1 items-end flex-row justify-end'>
                                  <TouchableOpacity className='flex-1 items-center ' onPress={toggleCameraFacing}>
                                    <SwitchCameraIcon color={'white'} size={33}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity className='flex-1 items-center ' onPress={takePicture}>
                                    <Circle color={'red'} strokeWidth={2} size={33} />
                                    </TouchableOpacity>
                                  </View>
                                </CameraView>
                            );
                          }
                          // onPress={()=>
                          //   router.back()}