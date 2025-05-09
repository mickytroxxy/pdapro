import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

interface ChatSoundManagerProps {
  children: (sounds: {
    sendSound: Audio.Sound | null;
    transitionSound: Audio.Sound | null;
    keyboardSound: Audio.Sound | null;
    typingSound: Audio.Sound | null;
    bubbleSound: Audio.Sound | null;
  }) => React.ReactNode;
}

const ChatSoundManager: React.FC<ChatSoundManagerProps> = ({ children }) => {
  const [sendSound, setSendSound] = useState<Audio.Sound | null>(null);
  const [transitionSound, setTransitionSound] = useState<Audio.Sound | null>(null);
  const [keyboardSound, setKeyboardSound] = useState<Audio.Sound | null>(null);
  const [typingSound, setTypingSound] = useState<Audio.Sound | null>(null);
  const [bubbleSound, setBubbleSound] = useState<Audio.Sound | null>(null);

  // Load all sound effects
  useEffect(() => {
    // Initialize Audio
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(error => {
      console.log('Error setting audio mode:', error);
    });

    // Create a single sound for all effects to simplify
    const createSound = async () => {
      try {
        // Try to load the send sound which we know exists
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/SendMessage_SFX.mp3'),
          { shouldPlay: false }
        );
        
        // Use the same sound for all effects
        setSendSound(sound);
        setTransitionSound(sound);
        setKeyboardSound(sound);
        setTypingSound(sound);
        setBubbleSound(sound);
        
        // Play the sound once to indicate chat is loaded
        try {
          await sound.playAsync();
        } catch (e) {
          console.log('Error playing initial sound:', e);
        }
        
        return sound;
      } catch (error) {
        console.log('Error creating sound:', error);
        return null;
      }
    };

    // Create the sound
    const soundPromise = createSound();
    
    // Clean up
    return () => {
      soundPromise.then(sound => {
        if (sound) {
          sound.unloadAsync().catch(error => {
            console.log('Error unloading sound:', error);
          });
        }
      });
    };
  }, []);

  return (
    <>
      {children({
        sendSound,
        transitionSound,
        keyboardSound,
        typingSound,
        bubbleSound
      })}
    </>
  );
};

export default ChatSoundManager;
