import React, { memo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ChatTypingIndicatorProps {
  dot1Opacity: Animated.Value;
  dot2Opacity: Animated.Value;
  dot3Opacity: Animated.Value;
}

const ChatTypingIndicator = memo(({ dot1Opacity, dot2Opacity, dot3Opacity }: ChatTypingIndicatorProps) => {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, { opacity: dot1Opacity, backgroundColor: '#f59249' }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot2Opacity, backgroundColor: '#0591d2' }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot3Opacity, backgroundColor: '#98d7f5' }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  typingContainer: {
    padding: 10,
    marginLeft: 10,
  },
  typingBubble: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default ChatTypingIndicator;
