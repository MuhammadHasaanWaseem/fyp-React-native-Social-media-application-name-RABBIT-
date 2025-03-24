import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
  } from "react-native";
  import { ChevronDown } from "lucide-react-native";
  import React, { useState, useRef, useEffect } from "react";
  import Collapsible from "react-native-collapsible";
  import { useColorScheme } from "nativewind";
  
  const AnimatedChevron = Animated.createAnimatedComponent(ChevronDown);
  
  export default () => {
    const { colorScheme } = useColorScheme();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    
    const sections = [
      {
        title: "1. Acceptance of Terms",
        content: "By using Rabbit, you agree to these Terms and our Privacy Policy...",
      },
      {
        title: "2. Service Description",
        content: "Rabbit is a social media platform offering content sharing, messaging...",
      },
      {
        title: "3. User Responsibilities",
        content: "You must be at least 13 years old. You're responsible for account security...",
      },
      {
        title: "4. Content Ownership",
        content: "You retain ownership but grant Rabbit a license to use your content...",
      },
      {
        title: "5. Prohibited Conduct",
        content: "No illegal activities, harassment, spam, or intellectual property violations...",
      },
      {
        title: "6. Privacy & Data",
        content: "Data collection and usage outlined in our Privacy Policy...",
      },
      {
        title: "7. Account Termination",
        content: "We may suspend accounts violating terms. You can delete account anytime...",
      },
      {
        title: "8. Disclaimers",
        content: "Service provided 'as-is'. We don't guarantee uninterrupted or error-free service...",
      },
      {
        title: "9. Limitation of Liability",
        content: "Rabbit not liable for indirect damages arising from service use...",
      },
      {
        title: "10. Modifications",
        content: "We may update these Terms. Continued use constitutes acceptance...",
      }
    ];
  
    const animations = useRef(
      sections.reduce((acc, section) => {
        acc[section.title] = new Animated.Value(0);
        return acc;
      }, {})
    ).current;
  
    useEffect(() => {
      if (Platform.OS === "android") {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }, []);
  
    const toggleSection = (sectionTitle: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  
      if (activeSection === sectionTitle) {
        Animated.timing(animations[sectionTitle], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setActiveSection(null);
      } else {
        if (activeSection) {
          Animated.timing(animations[activeSection], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
        Animated.timing(animations[sectionTitle], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setActiveSection(sectionTitle);
      }
    };
  
    return (
      <ScrollView
        style={{ backgroundColor: "#0A0A0A" }}
        className="flex-1 p-5"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text style={{marginTop:30}} className="text-3xl font-bold text-white mb-6">
          Terms of Service
        </Text>
  
  
        {sections.map((section) => {
          const rotate = animations[section.title].interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"],
          });
  
          return (
            <View
              key={section.title}
              className="mb-5 bg-neutral-800 rounded-xl p-5 shadow-md"
            >
              <TouchableOpacity
                onPress={() => toggleSection(section.title)}
                className="flex-row justify-between items-center"
              >
                <Text style={{color:'white'}}
                  className={`text-lg text-white ${
                    activeSection === section.title ? "font-bold" : "font-semibold"
                  }`}
                >
                  {section.title}
                </Text>
                <AnimatedChevron
                  size={24}
                  color="white"
                  style={{ transform: [{ rotate }] }}
                />
              </TouchableOpacity>
  
              <Collapsible collapsed={activeSection !== section.title}>
                <Text style={{color:'white'}} className="mt-4 text-gray-300 leading-6">
                  {section.content}
                </Text>
              </Collapsible>
            </View>
          );
        })}
  
        <View className="mt-8 bg-neutral-800 rounded-xl p-5 shadow-md">
          <Text style={{color:'white'}} className="text-lg font-semibold text-white mb-4">
            Legal Contact
          </Text>
          <Text style={{color:'white'}}className="text-gray-300 leading-6">
            For legal inquiries: legal@rabbitsocial.com
          </Text>
        </View>
      </ScrollView>
    );
  };