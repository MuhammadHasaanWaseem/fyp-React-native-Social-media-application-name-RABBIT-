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
    
    // Initialize animation values for each section using useRef
    const sections = [
      {
        title: "1. Information Collection",
        content: "We collect information you provide directly to enhance your Rabbit experience...",
      },
      {
        title: "2. Use of Information",
        content: "We use the information to personalize your feed and ensure privacy...",
      },
      {
        title: "3. Data Sharing",
        content: "We may share your information with trusted partners under strict privacy controls...",
      },
      {
        title: "4. Security",
        content: "We implemented Context based privacy for securing your data...",
      },
      {
        title: "5. Your Choices",
        content: "You have full control over your privacy settings and content visibility...",
      },
    ];
  
    const animations = useRef(
      sections.reduce((acc, section) => {
        acc[section.title] = new Animated.Value(0);
        return acc;
      }, {})
    ).current;
  
    // Enable LayoutAnimation on Android
    useEffect(() => {
      if (Platform.OS === "android") {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }, []);
  
    const toggleSection = (sectionTitle: string) => {
      // Configure layout animation for smooth content expansion/collapse
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  
      if (activeSection === sectionTitle) {
        // Collapse the current section
        Animated.timing(animations[sectionTitle], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setActiveSection(null);
      } else {
        // Collapse the previous section if any
        if (activeSection) {
          Animated.timing(animations[activeSection], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
        // Expand the new section
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
          Privacy Policy
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
            Contact Us
          </Text>
          <Text style={{color:'white'}}className="text-gray-300 leading-6">
            If you have any questions about this Privacy Policy, reach out to us at support@rabbitsocial.com.
          </Text>
        </View>
      </ScrollView>
    );
  };