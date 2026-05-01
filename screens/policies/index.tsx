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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { policyStyles } from "./index.styles";

const AnimatedChevron = Animated.createAnimatedComponent(ChevronDown);

const PrivacyPolicy = () => {
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      title: "1. Information Collection",
      content:
        "We collect information you provide directly to enhance your Minoqtopus experience...",
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

  const animations = useRef(
    sections.reduce((acc, section) => {
      acc[section.title] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
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
      style={policyStyles.scroll}
      contentContainerStyle={[
        policyStyles.content,
        { paddingTop: insets.top + 12 },
      ]}
    >
      <View style={policyStyles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={policyStyles.headerTitle}>Privacy Policy</Text>
      </View>

      {sections.map((section) => {
        const rotate = animations[section.title].interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        });
        return (
          <View key={section.title} style={policyStyles.sectionCard}>
            <TouchableOpacity
              onPress={() => toggleSection(section.title)}
              style={policyStyles.sectionHeaderRow}
            >
              <Text
                style={[
                  policyStyles.sectionTitle,
                  activeSection === section.title && policyStyles.sectionTitleActive,
                ]}
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
              <Text style={policyStyles.sectionBody}>{section.content}</Text>
            </Collapsible>
          </View>
        );
      })}

      <View style={policyStyles.contactCard}>
        <Text style={policyStyles.contactTitle}>Contact Us</Text>
        <Text style={policyStyles.contactBody}>
          If you have any questions about this Privacy Policy, reach out to us at
          muhammadhasaanwork@gmail.com.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;
