import React, { memo } from 'react';
import { InputToolbar } from 'react-native-gifted-chat';

interface ChatInputToolbarProps {
  props: any;
}

const ChatInputToolbar = memo(({ props }: ChatInputToolbarProps) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#fff',
        borderTopWidth: 0,
        borderRadius: 30,
        marginHorizontal: 10,
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      primaryStyle={{
        alignItems: 'center',
      }}
    />
  );
});

export default ChatInputToolbar;
