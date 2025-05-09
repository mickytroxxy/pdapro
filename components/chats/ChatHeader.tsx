import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';

interface ChatHeaderProps {
  isTyping: boolean;
  isActive: boolean;
}

const ChatHeader = memo(({ isTyping, isActive }: ChatHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon type="Ionicons" name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Image source={require('@/assets/images/gale-avatar.png')} style={styles.avatar} />
      <View>
        <Text style={styles.headerTitle}>Gale</Text>
        <View style={styles.onlineContainer}>
          <View style={[
            styles.onlineIndicator, 
            isActive ? styles.activeIndicator : styles.onlineIndicator
          ]} />
          <Text style={styles.onlineText}>
            {isTyping ? 'Typing...' : isActive ? 'Active' : 'Online'}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'fontBold',
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50', // Green for Online
    marginRight: 5,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFA500', // Orange for Active
    marginRight: 5,
  },
  onlineText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'fontLight',
  },
  backButton: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default ChatHeader;
