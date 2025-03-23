import username from "@/app/(auth)/username";
import { Share, Alert } from "react-native";

export const onShareProfile = async (username: string) => {
  try {
    // Construct the profile link (modify the URL as required)
    const profileLink = `https://yourdomain.com/user/${username}`;
    const shareMessage = `Check out this profile: ${profileLink}`;

    const result = await Share.share({
      message: shareMessage,
    });

    if (result.action === Share.sharedAction) {
      // Optionally handle share success
      if (result.activityType) {
        // Shared with activity type of result.activityType
      }
    } else if (result.action === Share.dismissedAction) {
      // Share dismissed
    }
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};
