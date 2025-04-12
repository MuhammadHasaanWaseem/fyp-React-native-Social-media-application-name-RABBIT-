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
  import React, { useState, useRef, useEffect } from "react";
  import Collapsible from "react-native-collapsible";
  import { HStack } from "@/components/ui/hstack";
  import { router } from "expo-router";
  
  // Create an animated version of the Chevron icon
  const AnimatedChevron = Animated.createAnimatedComponent(ChevronDown);
  
  export default function WhatsNewScreen() {
    const [activeSection, setActiveSection] = useState(null);
  
    // Define the feature sections with updated names and detailed descriptions
    const sections = [
      {
        title: "Spoiler-Protected Posts",
        content:
          "Keep sensitive content hidden until the user chooses to view it. This feature allows you to mark posts as spoilers, protecting details until intentionally revealed.",
      },
      {
        title: "Global Chat Rooms",
        content:
          "Engage in community-wide conversations by joining global chat rooms. Connect with users worldwide, exchange ideas, and stay updated on trending topics in real time.",
      },
      {
        title: "Voice Message Upload",
        content:
          "Record and upload voice messages seamlessly. This personal touch enhances communication by allowing you to share quick audio notes directly within your posts.",
      },
      {
        title: "Animated GIF Sharing",
        content:
          "Share and enjoy animated GIFs to express reactions and add visual flair to your conversations. Enjoy a more lively and engaging user experience.",
      },
      {
        title: "Contextual Privacy Controls",
        content:
          "Customize the visibility of each post with tailored privacy settings. Decide who sees your content based on context, ensuring your posts reach the intended audience.",
      },
      {
        title: "Premium Posts",
        content:
          "Offer exclusive content reserved for subscribed users. Premium posts let you reward your most dedicated followers with special access and extended features.",
      },
      {
        title: "Time Capsule",
        content:
          "Schedule posts for future publication. Capture moments and set them to go live later, ensuring your content makes an impact at the perfect time.",
      },
      {
        title: "Intelligent Chatbot",
        content:
          "Interact with our AI-powered chatbot designed to assist with content discovery, navigation, and answering frequently asked questions, making your experience smoother.",
      },
    ];
  
    // Initialize animated values for rotating the chevrons on each section
    const animations = useRef(
      sections.reduce((acc, section) => {
        acc[section.title] = new Animated.Value(0);
        return acc;
      }, {})
    ).current;
  
    // Enable layout animation on Android
    useEffect(() => {
      if (Platform.OS === "android") {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }, []);
  
    // Toggle the open/closed state of a section and animate the chevron rotation accordingly
    const toggleSection = (sectionTitle) => {
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
        style={{ backgroundColor: "#010118" }}
        className="flex-1 p-5"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <HStack space="lg" className="items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "#FF4500" }} className="text-3xl font-bold">
            What's New
          </Text>
        </HStack>
  
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
                <Text
                  style={{ color: "white" }}
                  className={`text-lg ${
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
                <Text
                  style={{ color: "white" }}
                  className="mt-4 text-gray-300 leading-6"
                >
                  {section.content}
                </Text>
              </Collapsible>
            </View>
          );
        })}
  
        <View
          style={{ backgroundColor: "#010118" }}
          className="mt-8 bg-neutral-800 rounded-xl p-5 shadow-md"
        >
          <Text
            style={{ color: "white" }}
            className="text-lg font-semibold text-white mb-4"
          >
            Legal Contact
          </Text>
          <Text style={{ color: "white" }} className="text-gray-300 leading-6">
            For legal inquiries: legal@rabbitsocial.com
          </Text>
        </View>
      </ScrollView>
    );
  }
  