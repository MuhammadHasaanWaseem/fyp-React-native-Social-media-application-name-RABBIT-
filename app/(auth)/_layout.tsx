import { Stack } from "expo-router";
export default ()=>{
    return <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="verify"/>
        <Stack.Screen name="username"/>
    </Stack>
}