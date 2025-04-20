// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '@/providers/AuthProviders';
// import React, { useState } from 'react';
// import { Input, InputField } from '@/components/ui/input';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'expo-router';
// import { View, Text, StyleSheet, Keyboard, Pressable, FlatList, Modal, StatusBar, TouchableOpacity } from 'react-native';
// import Layout from './_layout';
// import { VStack } from '@/components/ui/vstack';
// import { HStack } from '@/components/ui/hstack';
// import { ChevronDown, Minus, XIcon } from 'lucide-react-native';
// import {countries} from './contries'

// export default function SignIn() {
//   const [phone, setPhone] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState(countries[0]);
//   const [showCountryPicker, setShowCountryPicker] = useState(false);
//   const { user } = useAuth();
//   const router = useRouter();

//   const handleSignIn = async () => {
//     Keyboard.dismiss();
//     const { data, error } = await supabase.auth.signInWithOtp({
//       phone: `${selectedCountry.dial_code}${phone}`
//     });
//     if (!error) {
//       router.push({
//         pathname: '/(auth)/verify',
//         params: { phone: `${selectedCountry.dial_code}${phone}` },
//       });
//     }
//   };

//   const selectCountry = (country) => {
//     setSelectedCountry(country);
//     setShowCountryPicker(false);
//   };
//   const pickercloser =()=>{
//     setShowCountryPicker(false);

//   }

//   return (
//     <Layout onPress={handleSignIn} buttonText='Continue'>
//       <SafeAreaView style={styles.container}>
//         <VStack style={styles.content}>
//           <Text style={styles.title}>Enter your phone number</Text>

//           <VStack style={styles.inputContainer}>
//             <Text style={styles.label}>Phone Number</Text>
//             <HStack style={styles.phoneInput}>
//               <Pressable
//                 style={styles.countrySelector}
//                 onPress={() => setShowCountryPicker(true)}
//               >
//                 <HStack space="sm" alignItems="center">
//                   <View style={styles.symbolContainer}>
//                     <Text style={styles.countrySymbol}>{selectedCountry.symbol}</Text>
//                   </View>
//                   <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
//                   <ChevronDown size={16} color="#9CA3AF" />
//                 </HStack>
//               </Pressable>

//               <Input variant="outline" size="md" style={styles.input}>
//                 <InputField
//                   placeholder="300 1234567"
//                   style={styles.inputField}
//                   value={phone}
//                   onChangeText={setPhone}
//                   keyboardType="phone-pad"
//                   placeholderTextColor="#6B7280"
//                 />
//               </Input>
//             </HStack>
//           </VStack>

//           <Text style={styles.note}>
//             We'll send you a verification code via SMS
//           </Text>
//         </VStack>

//         {/* Country Picker Modal */}
//         <Modal
//           visible={showCountryPicker}
//           animationType="slide"
//           transparent={true}
//         >
//           <View style={styles.modalContainer}>
         
//             <View style={styles.modalContent}>
//             <View className='items-center'>
//            <TouchableOpacity onPress={pickercloser}>
//               <Minus color={'#FF4500'} size={24} strokeWidth={5} />
//             </TouchableOpacity>
//            </View>
//               <FlatList
//                 data={countries}
//                 keyExtractor={(item) => item.code}
//                 renderItem={({ item }) => (
//                   <Pressable
//                     style={styles.countryItem}
//                     onPress={() => selectCountry(item)}
//                   >
//                     <View style={styles.symbolContainer}>
//                       <Text style={styles.countrySymbol}>{item.symbol}</Text>
//                     </View>
//                     <Text style={styles.countryName}>{item.name}</Text>
//                     <Text style={styles.dialCodeText}>{item.dial_code}</Text>
//                   </Pressable>
//                 )}
//               />
//             </View>
//           </View>
//         </Modal>
//       </SafeAreaView>
//     </Layout>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: 'white',
//     marginBottom: '5%',
//   },
//   inputContainer: {
    
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   phoneInput: {
//     alignItems: 'center',
//     gap: 8,
//   },
//   countrySelector: {
//     backgroundColor: '#1F2937',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//   },
//   symbolContainer: {
//     backgroundColor: '#374151',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2
//   },
//   countrySymbol: {
//     color: 'white',
//     fontWeight: '700',
//     fontSize: 14
//   },
//   dialCode: {
//     color: 'white',
//     fontWeight: '500',
//     fontSize: 14
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end'
//   },
//   modalContent: {
//     backgroundColor: '#010118',
//     maxHeight: '60%',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 16
//   },
//   countryItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     gap: 12
//   },
//   countryName: {
//     color: 'white',
//     flex: 1,
//     fontSize: 14
//   },
//   dialCodeText: {
//     color: '#9CA3AF',
//     fontSize: 14
//   },
//   input: {
//     flex: 1,
//     borderColor: '#374151',
//     backgroundColor: '#1F2937',
//   },
//   inputField: {
//     color: 'white',
//     fontSize: 16,
//   },
//   note: {
//     color: '#6B7280',
//     fontSize: 12,
//     marginTop: 12,
//   },
// });
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import React, { useState } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Keyboard, Pressable, FlatList, Modal, TouchableOpacity, TextInput } from 'react-native';
import Layout from './_layout';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ChevronDown, Minus } from 'lucide-react-native';
import { countries } from './contries';
import { Button, ButtonText } from '@/components/ui/button';

export default function SignIn() {
  const [inputType, setInputType] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (inputType === 'phone') {
      const fullPhone = `${selectedCountry.dial_code}${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
      });
      if (!error) {
        router.push({
          pathname: '/(auth)/verify',
          params: { input: fullPhone, type: 'phone' },
        });
      } else {
        console.error('Phone OTP error:', error.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (!error) {
        router.push({
          pathname: '/(auth)/verify',
          params: { input: email, type: 'email' },
        });
      } else {
        console.error('Email OTP error:', error.message);
      }
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  return (
    <Layout onPress={handleSignIn} buttonText="Continue">
      <SafeAreaView style={styles.container}>
        <VStack style={styles.content}>
          <Text style={styles.title}>Sign in with {inputType === 'phone' ? 'Phone' : 'Email'}</Text>

          <HStack style={styles.toggleContainer}>
            <Button
              onPress={() => setInputType('phone')}
              style={[styles.toggleButton, inputType === 'phone' && styles.activeToggle]}
            >
              <ButtonText>Phone</ButtonText>
            </Button>
            <Button
              onPress={() => setInputType('email')}
              style={[styles.toggleButton, inputType === 'email' && styles.activeToggle]}
            >
              <ButtonText>Email</ButtonText>
            </Button>
          </HStack>

          {inputType === 'phone' ? (
            <VStack style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <HStack style={styles.phoneInput}>
                <Pressable
                  style={styles.countrySelector}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <HStack space="sm" alignItems="center">
                    <View style={styles.symbolContainer}>
                      <Text style={styles.countrySymbol}>{selectedCountry.symbol}</Text>
                    </View>
                    <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </HStack>
                </Pressable>

                <Input variant="outline" size="md" style={[styles.input]}>
                  <InputField
                  
                    placeholder="300 1234567"
                    style={styles.inputField}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#6B7280"
                    autoFocus={true}
                    
                  />
                </Input>
              </HStack>
            </VStack>
          ) : (
            <VStack style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                placeholder="example@domain.com"
                style={[styles.inputField, { color: 'white', borderRadius: 18, backgroundColor: '#1F2937' }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#6B7280"
                autoFocus={true}
                autoCorrect={false}
                returnKeyType="done"
              />
            </VStack>
          )}

          <Text style={styles.note}>
            We'll send you a verification code via {inputType === 'phone' ? 'SMS' : 'email'}
          </Text>
        </VStack>

        <Modal visible={showCountryPicker} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <Minus color={'#FF4500'} size={24} strokeWidth={5} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={countries}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.countryItem}
                    onPress={() => selectCountry(item)}
                  >
                    <View style={styles.symbolContainer}>
                      <Text style={styles.countrySymbol}>{item.symbol}</Text>
                    </View>
                    <Text style={styles.countryName}>{item.name}</Text>
                    <Text style={styles.dialCodeText}>{item.dial_code}</Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign:'center',
    marginBottom: '7%',
  },
  toggleContainer: {
    marginBottom: 16,
    justifyContent: 'center',
    gap: 8,
  },
  toggleButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#3B82F6',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  phoneInput: {
    alignItems: 'center',
    color:'white',
    gap: 8,
  },
  countrySelector: {
    backgroundColor: '#1F2937',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  symbolContainer: {
    backgroundColor: '#374151',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countrySymbol: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  dialCode: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    flex: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
    borderRadius: 12,
  },
  inputField: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color:'white',
    backgroundColor: '#1F2937',
  },
  note: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#010118',
    maxHeight: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  countryName: {
    color: 'white',
    flex: 1,
    fontSize: 14,
  },
  dialCodeText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});