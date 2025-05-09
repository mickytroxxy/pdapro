import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';
import Icon from '@/components/ui/Icon';
import ChatBubble from './ChatBubble';
import ChatReactionPicker, { REACTIONS } from './ChatReactionPicker';

// Extended IMessage type to include reactions
export interface ExtendedIMessage extends IMessage {
  reactions?: {
    [key: string]: {
      users: string[];
      count: number;
    };
  };
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatBubbleWithReactionsProps {
  props: any;
  onReaction: (messageId: string | number, reactionId: string) => void;
}

const ChatBubbleWithReactions = memo(({ props, onReaction }: ChatBubbleWithReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const message = props.currentMessage as ExtendedIMessage;

  // Render message reactions
  const renderMessageReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) {
      return null;
    }

    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(message.reactions).map(([reactionId, reaction]) => {
          const emoji = REACTIONS.find(r => r.id === reactionId)?.emoji || '👍';
          return (
            <TouchableOpacity
              key={reactionId}
              style={styles.reactionBadge}
              onPress={() => onReaction(message._id, reactionId)}
            >
              <Text>{emoji}</Text>
              <Text style={styles.reactionBadgeText}>{reaction.count}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <ChatBubble props={props} />
      
      {/* Reaction button */}
      <TouchableOpacity
        style={styles.reactionButtonContainer}
        onPress={() => setShowReactions(!showReactions)}
      >
        <Icon type="Ionicons" name="add-outline" size={16} color="#666" />
      </TouchableOpacity>
      
      {/* Show reactions if any */}
      {renderMessageReactions()}
      
      {/* Show reaction picker if this message is selected */}
      {showReactions && (
        <ChatReactionPicker messageId={message._id} onReaction={onReaction} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  reactionBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
    alignItems: 'center',
  },
  reactionBadgeText: {
    fontSize: 12,
    marginLeft: 2,
    color: '#666',
  },
  reactionButtonContainer: {
    position: 'absolute',
    right: 10,
    bottom: -15,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
});

export default ChatBubbleWithReactions;
