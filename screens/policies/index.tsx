import React, { useState, useRef, useEffect } from "react";
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
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import Collapsible from "react-native-collapsible";
import { router } from "expo-router";

// Create an Animated version of the Chevron icon
const AnimatedChevron = Animated.createAnimatedComponent(ChevronDown);

// Simple HStack component for horizontal layout using a native View
const HStack = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: object;
}) => {
  return (
    <View
      style={[{ flexDirection: "row", alignItems: "center",gap:6,marginBottom:30 }, style]}
      {...props}
    >
      {children}
    </View>
  );
};

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Define the sections for the privacy policy
  const sections = [
    {
      title: "1. Information Collection",
      content:
        "We collect information you provide directly to enhance your Rabbit experience...",
    },
    {
      title: "2. Use of Information",
      content: "We use the information to personalize your feed and ensure privacy...",
    },
    {
      title: "3. Data Sharing",
      content:
        "We may share your information with trusted partners under strict privacy controls...",
    },
    {
      title: "4. Security",
      content: "We implemented context-based privacy for securing your data...",
    },
    {
      title: "5. Your Choices",
      content: "You have full control over your privacy settings and content visibility...",
    },
  ];

  // Create an Animated.Value for each section using useRef
  const animations = useRef(
    sections.reduce((acc, section) => {
      acc[section.title] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Toggle the expansion of a section
  const toggleSection = (sectionTitle: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (activeSection === sectionTitle) {
      // Collapse the active section
      Animated.timing(animations[sectionTitle], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setActiveSection(null);
    } else {
      // If there is an active section, collapse it first
      if (activeSection) {
        Animated.timing(animations[activeSection], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      // Expand the selected section
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
      style={{ backgroundColor: "#010118" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
    >
      <HStack >
       
       <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text
          style={{
            color: "#FF4500",
            fontSize: 24,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Privacy Policy
        </Text>
       
      </HStack>

      {sections.map((section) => {
        // Rotate the chevron based on the animation value for the section
        const rotate = animations[section.title].interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        });
        return (
          <View
            key={section.title}
            style={{
              backgroundColor: "#010118",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleSection(section.title)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight:
                    activeSection === section.title ? "bold" : "600",
                }}
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
              <Text style={{ color: "#FF4500", marginTop: 10, lineHeight: 22 }}>
                {section.content}
              </Text>
            </Collapsible>
          </View>
        );
      })}

      <View
        style={{
          backgroundColor: "#010118",
          borderRadius: 10,
          padding: 15,
          marginTop: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 10,
            marginTop:'80%',
            textAlign:'center'
          }}
        >
          Contact Us
        </Text>
        <Text style={{ color: "white", lineHeight: 22,textAlign:'center' }}>
          If you have any questions about this Privacy Policy, reach out to us at
          support@rabbitsocial.com.
        </Text>
      </View>
    </ScrollView>
  ); 
};

export default PrivacyPolicy;
