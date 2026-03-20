import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import React, { useState } from "react";
import { View, StyleSheet, Text, Keyboard, Alert } from "react-native";
import Layout from "./_layout";
import { useAuth } from "@/providers/AuthProviders";
import { useRouter } from "expo-router";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";

export default function VerifyScreen() {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createUser, setuser } = useAuth();
  const router = useRouter();

  const handleUsername = async () => {
    Keyboard.dismiss();
    if (!username.trim()) {
      setErrorMessage("Username cannot be empty");
      return;
    }
    if (username.includes(" ")) {
      setErrorMessage("Username cannot contain spaces");
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setErrorMessage("Username must be 4-20 characters long");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setErrorMessage("Username can only contain letters and numbers");
      return;
    }

    setIsLoading(true);
    let result = await createUser(username);
    if (!result.error && !result.success) {
      result = await createUserDirect(username);
    }
    setIsLoading(false);

    if (result.success) {
      router.push("/(tabs)");
    } else {
      const err = result.error || "Username is already taken";
      setErrorMessage(err);
      Alert.alert("Error", err);
    }
  };

  async function createUserDirect(username: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: "No session. Please sign in again." };
    const normalized = username.trim().toLowerCase();

    const { data: taken, error: takenErr } = await supabase.from("User").select("id").ilike("username", normalized).neq("id", session.user.id).maybeSingle();
    if (takenErr) return { success: false, error: takenErr.message };
    if (taken) return { success: false, error: "Username taken by another user" };
    const { data: existing } = await supabase.from("User").select("id").eq("id", session.user.id).maybeSingle();

    if (existing) {
      const { data, error } = await supabase.from("User").update({ username: normalized }).eq("id", session.user.id).select().single();
      if (error) return { success: false, error: error.message };
      setuser?.(data);
      return { success: true };
    }
    const { data, error } = await supabase.from("User").insert({ id: session.user.id, username: normalized }).select().single();
    if (error) return { success: false, error: error.message };
    setuser?.(data);
    await supabase.auth.refreshSession();
    return { success: true };
  }

  return (
    <Layout
      onPress={handleUsername}
      buttonText={isLoading ? <Spinner color="white" /> : "Create Account"}
      buttonDisabled={isLoading}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Your Username</Text>
          <Text style={styles.subtitle}>This will be your unique identity</Text>

          <View style={styles.inputContainer}>
            <Input variant="outline" size="md" style={styles.input}>
              <InputField
                placeholder="Enter username here..."
                placeholderTextColor="#6B7280"
                style={styles.inputField}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrorMessage("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Input>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : (
              <Text style={styles.note}>
                4-20 characters, letters and numbers only, no spaces
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#010118",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
    borderWidth: 1,
    borderRadius: 12,
  },
  inputField: {
    color: "white",
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  note: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 4,
    textAlign: "left",
  },
});