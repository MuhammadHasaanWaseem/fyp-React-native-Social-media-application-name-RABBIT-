import {  StyleSheet, View,Text } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  return (
    < SafeAreaView >
<HStack>
<Text  >Test</Text>
  <Text  >Home</Text>
</HStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
justifyContent:'center',
alignContent:'center',
alignItems:'center',
flex:1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
