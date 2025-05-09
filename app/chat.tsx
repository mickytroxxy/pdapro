import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Platform, KeyboardAvoidingView, Image, Animated, Easing } from 'react-native';
import { GiftedChat, Day, Time, IMessage } from 'react-native-gifted-chat';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { setStoreMessages } from '@/src/state/slices/messages';
import { RootState } from '@/src/state/store';
import useFetch from '@/src/hooks/useFetch';
import { mockChatApi, ChatRequest } from '@/src/services/mockChatApi';
import { PREDEFINED_RESPONSES } from '@/src/constants/predefinedResponses';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import ChatBubble from '@/components/chats/ChatBubble';
import ChatComposer from '@/components/chats/ChatComposer';
import ChatSendButton from '@/components/chats/ChatSendButton';
import ChatInputToolbar from '@/components/chats/ChatInputToolbar';
import ChatTypingIndicator from '@/components/chats/ChatTypingIndicator';
// Mock data for Gale (the AI assistant)
const GALE_USER = {
  _id: 2,
  name: 'Gale',
  avatar: 'https://placehold.co/100x100/048a96/white?text=G',
};

// Mock data for the current user
const CURRENT_USER = {
  _id: 1,
  name: 'You',
};

// Extended IMessage type to include message status
interface ExtendedIMessage extends IMessage {
  status?: 'sent' | 'delivered' | 'read';
}

export default function ChatScreen() {
  // UI state
  const [messages, setMessages] = useState<ExtendedIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Redux
  const dispatch = useDispatch();
  const storedMessages = useSelector((state: RootState) => state.messages.storeMessages);

  // API
  const { fetchData } = useFetch();
  const threadId = mockChatApi.generateThreadId();
  const assistantId = mockChatApi.generateAssistantId();
  const [isFirstSession, setIsFirstSession] = useState<boolean>(true);
  const [lastMessageCode, setLastMessageCode] = useState<string>('');

  // Sound effects
  const [sendSound, setSendSound] = useState<Audio.Sound | null>(null);
  const [keyboardSound, setKeyboardSound] = useState<Audio.Sound | null>(null);
  const [typingSound, setTypingSound] = useState<Audio.Sound | null>(null);
  const [bubbleSound, setBubbleSound] = useState<Audio.Sound | null>(null);

  // Animation values for typing indicator dots
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  // Load all sound effects - simplified approach
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

  // Start typing animation - optimized with useCallback
  const startTypingAnimation = useCallback(() => {
    // Create animation for a single dot
    const createDotAnimation = (dot: Animated.Value) => [
      Animated.timing(dot, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(dot, {
        toValue: 0.3,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.ease,
      })
    ];

    // Create the animation sequence with staggered timing
    Animated.loop(
      Animated.stagger(150, [
        ...createDotAnimation(dot1Opacity),
        ...createDotAnimation(dot2Opacity),
        ...createDotAnimation(dot3Opacity)
      ])
    ).start();
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);


  // Load messages from Redux store or show welcome message if no messages exist
  useEffect(() => {
    //dispatch(setStoreMessages([]))
    if (storedMessages && storedMessages.length > 0) {
      // If we have stored messages, use them
      setMessages(storedMessages);
    } else {
      // Otherwise, show the welcome message
      setMessages([
        {
          _id: 1,
          text: "Hello! I'm Gale, your PDA expert. How can I help you today?",
          createdAt: new Date(),
          user: GALE_USER,
        },
      ]);

      // Store the welcome message in Redux
      dispatch(setStoreMessages([
        {
          _id: 1,
          text: "Hello! I'm Gale, your PDA expert. How can I help you today?",
          createdAt: new Date(),
          user: GALE_USER,
        },
      ]));
      setIsActive(false);
    }
  }, [storedMessages, dispatch]);

  // Function to handle sending messages
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    // Add haptic feedback when sending a message
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Play send sound
    try {
      if (sendSound) {
        await sendSound.setPositionAsync(0); // Reset sound position
        await sendSound.playAsync();
      }
    } catch (error) {
      console.log('Error playing send sound', error);
    }

    // Add the new message to the chat with initial 'sent' status
    const messagesWithStatus = newMessages.map(msg => ({
      ...msg,
      status: 'sent' as const, // Initial status is 'sent'
    })) as ExtendedIMessage[];

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messagesWithStatus)
    );

    // Store all messages in Redux
    const updatedMessages = GiftedChat.append(messages, messagesWithStatus);
    dispatch(setStoreMessages(updatedMessages));

    // Simulate Gale typing
    setIsTyping(true);
    startTypingAnimation(); // Start the typing animation

    // Simulate message status progression (sent -> delivered -> read)
    // First update to 'delivered' after a short delay
    setTimeout(() => {
      setMessages(previousMessages => {
        const updatedMessages = previousMessages.map(msg => {
          if (msg._id === messagesWithStatus[0]._id) {
            return { ...msg, status: 'delivered' as const };
          }
          return msg;
        });

        // Update Redux store
        dispatch(setStoreMessages(updatedMessages));

        return updatedMessages;
      });

      // Then update to 'read' after Gale starts typing
      setTimeout(() => {
        setMessages(previousMessages => {
          const updatedMessages = previousMessages.map(msg => {
            if (msg._id === messagesWithStatus[0]._id) {
              return { ...msg, status: 'read' as const };
            }
            return msg;
          });

          // Update Redux store
          dispatch(setStoreMessages(updatedMessages));

          return updatedMessages;
        });
      }, 1000);
      setIsActive(false);
    }, 2000);

    // Call the mock API to get a response
    const userMessage = messagesWithStatus[0].text;

    // Prepare the request body
    const requestBody: ChatRequest = {
      message: userMessage,
      threadId: threadId,
      assistantId: assistantId,
      firstSession: isFirstSession,
      code: lastMessageCode,
      contextAction: lastMessageCode ? "last_message" : ""
    };

    console.log('Sending API request:', requestBody);

    // Call the API using useFetch
    fetchData({
      endPoint: '/text-conversation',
      method: 'POST',
      data: requestBody
    }).then(response => {
      console.log('API response:', response);

      // For demo purposes, always use the mock API
      return mockChatApi.simulateResponse(requestBody);
    }).then((chatResponse) => {
      if (!chatResponse || !Array.isArray(chatResponse) || !chatResponse[0]?.responseText) {
        throw new Error('Invalid response format');
      }

      const responseText = chatResponse[0].responseText;

      // Update API state
      if (isFirstSession) setIsFirstSession(false);
      setLastMessageCode(responseText);

      // Helper function to add a message
      const addMessage = (text: string, isLast: boolean) => {
        setTimeout(() => {
          // Create new message
          const newMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: text.trim(),
            createdAt: new Date(),
            user: GALE_USER,
          };

          // Play bubble sound
          try {
            if (bubbleSound) {
              bubbleSound.setPositionAsync(0);
              bubbleSound.playAsync();
            }
          } catch (error) {
            console.log('Error playing bubble sound', error);
          }

          // Update messages
          setMessages(previousMessages => {
            const updatedMessages = GiftedChat.append(previousMessages, [newMessage]);
            dispatch(setStoreMessages(updatedMessages));
            return updatedMessages;
          });

          // Turn off typing indicator after the last message
          if (isLast) setIsTyping(false);
        }, 1500);
      };

      // Check if the response should be split into multiple bubbles
      if (responseText.length > 100) {
        // Split the message at sentence boundaries
        const sentences = responseText.match(/[^.!?]+[.!?]+/g) || [responseText];

        // Send each sentence as a separate message
        sentences.forEach((sentence: string, index: number) => {
          setTimeout(() => {
            addMessage(sentence, index === sentences.length - 1);
          }, index * 1000); // 1 second delay between messages
        });
      } else {
        // Send as a single message
        addMessage(responseText, true);
      }
    }).catch(error => {
      console.error('Error processing response:', error);

      // Fallback to a random response
      const randomResponse = PREDEFINED_RESPONSES[Math.floor(Math.random() * PREDEFINED_RESPONSES.length)];

      setTimeout(() => {
        const newMessage = {
          _id: Math.round(Math.random() * 1000000),
          text: randomResponse,
          createdAt: new Date(),
          user: GALE_USER,
        };

        setMessages(previousMessages => {
          const updatedMessages = GiftedChat.append(previousMessages, [newMessage]);
          dispatch(setStoreMessages(updatedMessages));
          return updatedMessages;
        });

        setIsTyping(false);
      }, 1500);
    });
  }, [messages, dispatch, sendSound, bubbleSound, assistantId, isFirstSession, lastMessageCode, fetchData]);

  // Memoized render functions for GiftedChat
  const renderBubble = useCallback((props: any) => <ChatBubble props={props} />, []);

  const renderDay = useCallback((props: any) => (
    <Day
      {...props}
      textStyle={{
        color: Colors.dark.midBlue,
        fontFamily: 'fontLight',
        fontSize: 12,
      }}
      containerStyle={{
        marginTop: 15,
        marginBottom: 10,
      }}
    />
  ), []);

  const renderTime = useCallback((props: any) => (
    <Time
      {...props}
      timeTextStyle={{
        left: {
          color: 'rgba(255,255,255,0.7)',
          fontFamily: 'fontLight',
          fontSize: 10,
        },
        right: {
          color: 'rgba(255,255,255,0.7)',
          fontFamily: 'fontLight',
          fontSize: 10,
        },
      }}
    />
  ), []);

  const renderInputToolbar = useCallback((props: any) => <ChatInputToolbar props={props} />, []);

  const renderComposer = useCallback((props: any) => (
    <ChatComposer props={props} keyboardSound={keyboardSound} typingSound={typingSound} />
  ), [keyboardSound, typingSound]);

  const renderSend = useCallback((props: any) => <ChatSendButton props={props} />, []);

  // Effect to start typing animation when isTyping changes
  useEffect(() => {
    if (isTyping) {
      startTypingAnimation();
    }
  }, [isTyping, startTypingAnimation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.dark.darkBlue} />
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('@/assets/icons/Chat-Female_Icon_Img.png')}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.headerTitle}>Gale</Text>
                <View style={styles.onlineContainer}>
                  <View style={[styles.onlineIndicator, { backgroundColor: isActive ? '#f59249' : '#4CAF50' }]} />
                  <Text style={styles.onlineText}>{isTyping ? 'Typing...' : isActive ? 'Active' : 'Online'}</Text>
                </View>
              </View>
            </View>
          ),
          headerStyle: {
            backgroundColor: Colors.dark.darkBlue,
          },
          headerTintColor: '#fff',
        }}
      />
      <LinearGradient
        colors={['#f5f5f5', '#e5e5e5']}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 90}
        >
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={CURRENT_USER}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            renderSend={renderSend}
            renderDay={renderDay}
            renderTime={renderTime}
            renderFooter={() => isTyping ? <ChatTypingIndicator dot1Opacity={dot1Opacity} dot2Opacity={dot2Opacity} dot3Opacity={dot3Opacity} /> : null}
            isTyping={isTyping}
            alwaysShowSend={false}
            scrollToBottom
            infiniteScroll
            showUserAvatar={false}
            showAvatarForEveryMessage={false}
            renderAvatarOnTop
            placeholder="Type a message..."
            timeFormat="h:mm A"
            dateFormat="MMMM D, YYYY"
            maxInputLength={1000}
            bottomOffset={Platform.OS === 'ios' ? 30 : 0}
            listViewProps={{
              style: styles.listView,
              showsVerticalScrollIndicator: true,
            }}
          />
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  listView: {
    backgroundColor: 'transparent',
  },

  // Header
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
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  onlineText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'fontLight',
  },

  // Typing indicator
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
  }
});
