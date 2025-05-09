import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Send } from 'react-native-gifted-chat';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';

interface ChatSendButtonProps {
  props: any;
}

const ChatSendButton = memo(({ props }: ChatSendButtonProps) => {
  return (
    <Send
      {...props}
      containerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 5,
        marginTop: 5,
      }}
      disabled={!props.text}
    >
      <View style={[styles.sendButton, !props.text ? styles.sendButtonDisabled : {}]}>
        <Icon type="Ionicons" name="send" size={20} color="#fff" />
      </View>
    </Send>
  );
});

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: Colors.dark.lightBlue,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatSendButton;
