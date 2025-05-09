import React, { memo, useCallback } from 'react';
import { Composer } from 'react-native-gifted-chat';
import { Audio } from 'expo-av';

interface ChatComposerProps {
  props: any;
  keyboardSound: Audio.Sound | null;
  typingSound: Audio.Sound | null;
}

const ChatComposer = memo(({ props, keyboardSound, typingSound }: ChatComposerProps) => {
  // Handle keyboard sound on focus
  const handleFocus = useCallback(() => {
    // Skip audio if not available
    if (!keyboardSound) return;

    try {
      keyboardSound.setPositionAsync(0)
        .then(() => keyboardSound.playAsync())
        .catch(error => {
          console.log('Error playing keyboard sound', error);
        });
    } catch (error) {
      console.log('Error playing keyboard sound', error);
    }
  }, [keyboardSound]);

  // Handle typing sound
  const handleChangeText = useCallback((text: string) => {
    // Call the original onChangeText first to ensure UI responsiveness
    if (props.onChangeText) {
      props.onChangeText(text);
    }

    // Skip audio if not available or if text is being deleted
    if (!typingSound || text.length <= (props.text || '').length) return;

    try {
      typingSound.setPositionAsync(0)
        .then(() => typingSound.playAsync())
        .catch(error => {
          console.log('Error playing typing sound', error);
        });
    } catch (error) {
      console.log('Error playing typing sound', error);
    }
  }, [props, typingSound]);

  return (
    <Composer
      {...props}
      textInputStyle={{
        color: '#333',
        fontFamily: 'fontLight',
        fontSize: 14,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 8,
        marginBottom: 8,
      }}
      placeholderTextColor="#999"
      onFocus={() => {
        handleFocus();
        if (props.onFocus) props.onFocus();
      }}
      onChangeText={handleChangeText}
    />
  );
});

export default ChatComposer;
