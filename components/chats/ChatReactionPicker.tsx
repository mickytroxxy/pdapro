import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Available reactions
export const REACTIONS = [
  { id: 'like', emoji: '👍' },
  { id: 'love', emoji: '❤️' },
  { id: 'laugh', emoji: '😂' },
  { id: 'wow', emoji: '😮' },
  { id: 'sad', emoji: '😢' },
  { id: 'angry', emoji: '😡' },
];

interface ChatReactionPickerProps {
  messageId: string | number;
  onReaction: (messageId: string | number, reactionId: string) => void;
}

const ChatReactionPicker = memo(({ messageId, onReaction }: ChatReactionPickerProps) => {
  return (
    <View style={styles.reactionPickerContainer}>
      {REACTIONS.map(reaction => (
        <TouchableOpacity
          key={reaction.id}
          style={styles.reactionButton}
          onPress={() => onReaction(messageId, reaction.id)}
        >
          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  reactionPickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
  },
  reactionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  reactionEmoji: {
    fontSize: 18,
  },
});

export default ChatReactionPicker;
