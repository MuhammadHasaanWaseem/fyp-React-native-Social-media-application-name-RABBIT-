import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import React, { useState } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Keyboard, Pressable, FlatList, Modal } from 'react-native';
import Layout from './_layout';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ChevronDown } from 'lucide-react-native';
//countries code array
const countries = [
  { name: 'Pakistan', code: 'PK', dial_code: '+92', symbol: '🇵🇰' },
  { name: 'China', code: 'CN', dial_code: '+86', symbol: '🇨🇳' },
  { name: 'Canada', code: 'CA', dial_code: '+1', symbol: '🇨🇦' },
  { name: 'Germany', code: 'DE', dial_code: '+49', symbol: '🇩🇪' },
  { name: 'France', code: 'FR', dial_code: '+33', symbol: '🇫🇷' },
  { name: 'Brazil', code: 'BR', dial_code: '+55', symbol: '🇧🇷' },
  { name: 'Japan', code: 'JP', dial_code: '+81', symbol: '🇯🇵' },
  { name: 'South Korea', code: 'KR', dial_code: '+82', symbol: '🇰🇷' },
  { name: 'Spain', code: 'ES', dial_code: '+34', symbol: '🇪🇸' },
  { name: 'Italy', code: 'IT', dial_code: '+39', symbol: '🇮🇹' },
  { name: 'Australia', code: 'AU', dial_code: '+61', symbol: '🇦🇺' },
  { name: 'Russia', code: 'RU', dial_code: '+7', symbol: '🇷🇺' },
  { name: 'Mexico', code: 'MX', dial_code: '+52', symbol: '🇲🇽' },
  { name: 'Indonesia', code: 'ID', dial_code: '+62', symbol: '🇮🇩' },
  { name: 'Turkey', code: 'TR', dial_code: '+90', symbol: '🇹🇷' },
  { name: 'Saudi Arabia', code: 'SA', dial_code: '+966', symbol: '🇸🇦' },
  { name: 'Argentina', code: 'AR', dial_code: '+54', symbol: '🇦🇷' },
  { name: 'South Africa', code: 'ZA', dial_code: '+27', symbol: '🇿🇦' },
  { name: 'Egypt', code: 'EG', dial_code: '+20', symbol: '🇪🇬' },
  { name: 'Nigeria', code: 'NG', dial_code: '+234', symbol: '🇳🇬' },
  { name: 'Sweden', code: 'SE', dial_code: '+46', symbol: '🇸🇪' },
  { name: 'Norway', code: 'NO', dial_code: '+47', symbol: '🇳🇴' },
  { name: 'Netherlands', code: 'NL', dial_code: '+31', symbol: '🇳🇱' },
  { name: 'Switzerland', code: 'CH', dial_code: '+41', symbol: '🇨🇭' },
  { name: 'Belgium', code: 'BE', dial_code: '+32', symbol: '🇧🇪' },
  { name: 'Thailand', code: 'TH', dial_code: '+66', symbol: '🇹🇭' },
  { name: 'Philippines', code: 'PH', dial_code: '+63', symbol: '🇵🇭' },
  { name: 'Malaysia', code: 'MY', dial_code: '+60', symbol: '🇲🇾' },
  { name: 'Vietnam', code: 'VN', dial_code: '+84', symbol: '🇻🇳' },
  { name: 'Chile', code: 'CL', dial_code: '+56', symbol: '🇨🇱' },
  { name: 'Colombia', code: 'CO', dial_code: '+57', symbol: '🇨🇴' },
  { name: 'Peru', code: 'PE', dial_code: '+51', symbol: '🇵🇪' },
  { name: 'Greece', code: 'GR', dial_code: '+30', symbol: '🇬🇷' },
  { name: 'Ukraine', code: 'UA', dial_code: '+380', symbol: '🇺🇦' },
  { name: 'Poland', code: 'PL', dial_code: '+48', symbol: '🇵🇱' },
  { name: 'Portugal', code: 'PT', dial_code: '+351', symbol: '🇵🇹' },
  { name: 'New Zealand', code: 'NZ', dial_code: '+64', symbol: '🇳🇿' },
  { name: 'Singapore', code: 'SG', dial_code: '+65', symbol: '🇸🇬' },
  { name: 'Bangladesh', code: 'BD', dial_code: '+880', symbol: '🇧🇩' },
  { name: 'Sri Lanka', code: 'LK', dial_code: '+94', symbol: '🇱🇰' },
  { name: 'Nepal', code: 'NP', dial_code: '+977', symbol: '🇳🇵' },
  { name: 'Kenya', code: 'KE', dial_code: '+254', symbol: '🇰🇪' },
  { name: 'Ghana', code: 'GH', dial_code: '+233', symbol: '🇬🇭' },
  { name: 'Morocco', code: 'MA', dial_code: '+212', symbol: '🇲🇦' },
  { name: 'Algeria', code: 'DZ', dial_code: '+213', symbol: '🇩🇿' },
  { name: 'Qatar', code: 'QA', dial_code: '+974', symbol: '🇶🇦' },
  { name: 'United Arab Emirates', code: 'AE', dial_code: '+971', symbol: '🇦🇪' }
];
// contry code array ends here

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    Keyboard.dismiss();
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `${selectedCountry.dial_code}${phone}`
    });
    if (!error) {
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: `${selectedCountry.dial_code}${phone}` },
      });
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  return (
    <Layout onPress={handleSignIn} buttonText='Continue'>
      <SafeAreaView style={styles.container}>
        <VStack style={styles.content}>
          <Text style={styles.title}>Enter your phone number</Text>

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

              <Input variant="outline" size="md" style={styles.input}>
                <InputField
                  placeholder="300 1234567"
                  style={styles.inputField}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#6B7280"
                />
              </Input>
            </HStack>
          </VStack>

          <Text style={styles.note}>
            We'll send you a verification code via SMS
          </Text>
        </VStack>

        {/* Country Picker Modal */}
        <Modal
          visible={showCountryPicker}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
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
    marginBottom: 32,
  },
  inputContainer: {
    
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  phoneInput: {
    alignItems: 'center',
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
    paddingVertical: 2
  },
  countrySymbol: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14
  },
  dialCode: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#010118',
    maxHeight: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12
  },
  countryName: {
    color: 'white',
    flex: 1,
    fontSize: 14
  },
  dialCodeText: {
    color: '#9CA3AF',
    fontSize: 14
  },
  input: {
    flex: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },
  inputField: {
    color: 'white',
    fontSize: 16,
  },
  note: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 12,
  },
});