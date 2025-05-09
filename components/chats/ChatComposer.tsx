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
    try {
      if (keyboardSound) {
        keyboardSound.setPositionAsync(0);
        keyboardSound.playAsync();
      }
    } catch (error) {
      console.log('Error playing keyboard sound', error);
    }
  }, [keyboardSound]);

  // Handle typing sound
  const handleChangeText = useCallback((text: string) => {
    // Only play typing sound if text is being added (not deleted)
    if (text.length > (props.text || '').length && typingSound) {
      try {
        typingSound.setPositionAsync(0);
        typingSound.playAsync();
      } catch (error) {
        console.log('Error playing typing sound', error);
      }
    }

    // Call the original onChangeText
    if (props.onChangeText) {
      props.onChangeText(text);
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
