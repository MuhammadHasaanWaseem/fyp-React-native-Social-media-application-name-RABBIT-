import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { ArrowLeft, EditIcon, Globe, LogOut, LucideAward, MessageSquare } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { useAuth } from '@/providers/AuthProviders';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Rabbiticon from '@/assets/logo/Rabbitlogo';

const Drawer = () => {
    const { logOut, user } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <HStack style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#FFFFFF" size={24} />
                </Pressable>
                <Text style={styles.headerTitle}>Explore</Text>
            </HStack>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Avatar size="xl">
                    <AvatarImage
                        source={{ uri: `${user?.avatar}?t=${new Date().getTime()}` }}
                        style={styles.avatar}
                    />
                </Avatar>
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.infoText}>ID: {user?.id}</Text>
                <Text style={styles.infoText}>
                    Account created in {user?.created_at ? new Date(user.created_at).getFullYear() : 'Unknown'}
                </Text>
            </View>

            <Divider style={styles.divider} />

            {/* Menu Items */}
            <View style={styles.menuItems}>
                <Pressable
                    style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed,
                    ]}
                    onPress={() => router.push('/worldchat')}
                >
                    <HStack space="md" alignItems="center">
                        <Globe color="#FF4500" size={24} style={{ marginRight: 10 }} />
                        <Text style={styles.menuText}>World Chat</Text>
                    </HStack>
                </Pressable>
                <Divider style={styles.divider} />
                <Pressable
                    style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed,
                    ]}
                    onPress={logOut}
                >
                    <HStack space="md" alignItems="center">
                        <LogOut color="#FF4500" size={24} style={{ marginRight: 10 }} />
                        <Text style={styles.menuText}>Log Out</Text>
                    </HStack>
                </Pressable>
                <Divider style={styles.divider} />
                <Pressable
                    style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed,
                    ]}
                    onPress={() => router.push('/chatbot')}
                >
                    <HStack space="md" alignItems="center">
                        <MessageSquare color="#FF4500" size={24} style={{ marginRight: 10 }} />
                        <Text style={styles.menuText}>Chat Bot</Text>
                    </HStack>
                </Pressable>
                <Divider style={styles.divider} />
                <Pressable
                    style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed,
                    ]}
                    onPress={() => router.push('/useterms')}
                >
                    <HStack space="md" alignItems="center">
                        <EditIcon color="#FF4500" size={24} style={{ marginRight: 10 }} />
                        <Text style={styles.menuText}>Terms of use</Text>
                    </HStack>
                </Pressable><Divider style={styles.divider} />
                <Pressable
                    style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed,
                    ]}
                    onPress={() => router.push('/policies')}
                >
                    <HStack space="md" alignItems="center">
                        <LucideAward color="#FF4500" size={24} style={{ marginRight: 10 }} />
                        <Text style={styles.menuText}>Privacy Policies</Text>
                    </HStack>
                </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.bottomBranding}>
                <View className="justify-center items-center">
                    <Rabbiticon size={24} />
                </View>
                <Text style={styles.brandText}>Contact on Instagram @im_hasaan_</Text>
            </View>
        </SafeAreaView>
    );
};

export default Drawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#1E1E1E',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
        marginLeft: 10, // Reduced from 20 to 10
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '', // Added background for card effect
        borderRadius: 10,
        padding: 20,
    },
    avatar: {
        borderWidth: 2,
        borderColor: '#BB86FC', // Theme accent color
    },
    username: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 14, // Increased from 12 to 14
        marginTop: 8,
    },
    divider: {
        marginVertical: 10,
        backgroundColor: '#333333',
        height: 1,
    },
    menuItems: {
        marginTop: 20,
    },
    menuItem: {
        backgroundColor: '#1E1E1E',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, // Reduced for subtler shadow
        shadowRadius: 4,
        elevation: 2, // Reduced from 3 to 2
    },
    menuItemPressed: {
        backgroundColor: '#2E2E2E', // Changed to background color instead of opacity
    },
    menuText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    bottomBranding: {
        position: 'absolute',
        bottom: '3%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    brandText: {
        fontSize: 12,
        color: '#E0E0E0', // Changed to lighter color for visibility
        fontWeight: '500',
    },
});