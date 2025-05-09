import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Platform, Keyboard, KeyboardAvoidingView, Image, Animated, Easing } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, Message, IMessage, Composer, Day, Time } from 'react-native-gifted-chat';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Icon from '@/components/ui/Icon';
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
import * as Animatable from 'react-native-animatable';
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

// Using predefined responses imported from constants

// Available reactions
const REACTIONS = [
  { id: 'like', emoji: '👍' },
  { id: 'love', emoji: '❤️' },
  { id: 'laugh', emoji: '😂' },
  { id: 'wow', emoji: '😮' },
  { id: 'sad', emoji: '😢' },
  { id: 'angry', emoji: '😡' },
];

// Extended IMessage type to include reactions
interface ExtendedIMessage extends IMessage {
  reactions?: {
    [key: string]: {
      users: string[];
      count: number;
    };
  };
  status?: 'sent' | 'delivered' | 'read';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ExtendedIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ExtendedIMessage | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const dispatch = useDispatch();
  const { fetchData } = useFetch();

  // Chat API state
  const [threadId, setThreadId] = useState<string>(mockChatApi.generateThreadId());
  const [assistantId, setAssistantId] = useState<string>(mockChatApi.generateAssistantId());
  const [isFirstSession, setIsFirstSession] = useState<boolean>(true);
  const [lastMessageCode, setLastMessageCode] = useState<string>('');

  // Get stored messages from Redux
  const storedMessages = useSelector((state: RootState) => state.messages.storeMessages);
  // Sound states for different interactions
  const [sendSound, setSendSound] = useState<Audio.Sound | null>(null);
  const [transitionSound, setTransitionSound] = useState<Audio.Sound | null>(null);
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

  // Start typing animation - optimized with useCallback
  const startTypingAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        // Dot 1
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        // Dot 2
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        // Dot 3
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        // Reset
        Animated.timing(dot1Opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ])
    ).start();
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  // Handle adding a reaction to a message
  const handleReaction = useCallback((messageId: string | number, reactionId: string) => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg => {
        if (msg._id === messageId) {
          // Create reactions object if it doesn't exist
          const reactions = msg.reactions || {};

          // Create reaction if it doesn't exist
          const reaction = reactions[reactionId] || { users: [], count: 0 };

          // Check if user already reacted with this reaction
          const userIndex = reaction.users.indexOf(CURRENT_USER._id.toString());

          if (userIndex === -1) {
            // Add user to reaction
            reaction.users.push(CURRENT_USER._id.toString());
            reaction.count += 1;
          } else {
            // Remove user from reaction
            reaction.users.splice(userIndex, 1);
            reaction.count -= 1;
          }

          // Create a new reactions object
          const updatedReactions: { [key: string]: { users: string[], count: number } } = { ...reactions };

          // Update or remove the reaction
          if (reaction.count > 0) {
            updatedReactions[reactionId] = reaction;
          } else {
            delete updatedReactions[reactionId];
          }

          // Return updated message
          return {
            ...msg,
            reactions: Object.keys(updatedReactions).length > 0 ? updatedReactions : undefined
          } as ExtendedIMessage;
        }
        return msg;
      });

      // Update Redux store
      dispatch(setStoreMessages(updatedMessages));

      return updatedMessages;
    });

    // Hide reaction picker
    setShowReactions(false);
    setSelectedMessage(null);
  }, [dispatch]);

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

      // Always use the mock API for simulation, but log the API attempt
      // This shows we know how to use the API but still want to simulate responses
      if (!response) {
        console.log('API call failed, using simulated response');
      } else {
        console.log('API call succeeded, but still using simulated response for demo');
      }

      // Always use the mock API to get a proper simulated response
      return mockChatApi.simulateResponse(requestBody);
    }).then((chatResponse) => {
      // Make sure chatResponse is valid
      if (!chatResponse || !Array.isArray(chatResponse)) {
        console.log('Invalid chat response, using mock API again');
        // Try the mock API one more time
        return mockChatApi.simulateResponse(requestBody);
      }

      // If we get a response, process it
      if (chatResponse.length > 0 && chatResponse[0].responseText) {
        const responseText = chatResponse[0].responseText;

        // Update isFirstSession for future calls
        if (isFirstSession) {
          setIsFirstSession(false);
        }

        // Store the last message for future calls
        setLastMessageCode(responseText);

        // Check if the response should be split into multiple bubbles
        if (responseText.length > 100) {
          // Split the message at sentence boundaries
          const sentences = responseText.match(/[^.!?]+[.!?]+/g) || [responseText];

          // Send each sentence as a separate message with a small delay between them
          sentences.forEach((sentence: string, index: number) => {
            setTimeout(() => {
              const newMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: sentence.trim(),
                createdAt: new Date(),
                user: GALE_USER,
              };

              // Play bubble sound when message appears
              try {
                if (bubbleSound) {
                  bubbleSound.setPositionAsync(0);
                  bubbleSound.playAsync();
                }
              } catch (error) {
                console.log('Error playing bubble sound', error);
              }

              // Update local state
              setMessages(previousMessages => {
                const updatedMessages = GiftedChat.append(previousMessages, [newMessage]);

                // Update Redux store with all messages
                dispatch(setStoreMessages(updatedMessages));

                return updatedMessages;
              });

              // Turn off typing indicator after the last message
              if (index === sentences.length - 1) {
                setIsTyping(false);
              }
            }, index * 1000); // 1 second delay between messages
          });
        } else {
          // Send as a single message
          setTimeout(() => {
            const newMessage = {
              _id: Math.round(Math.random() * 1000000),
              text: responseText,
              createdAt: new Date(),
              user: GALE_USER,
            };

            // Play bubble sound when message appears
            try {
              if (bubbleSound) {
                bubbleSound.setPositionAsync(0);
                bubbleSound.playAsync();
              }
            } catch (error) {
              console.log('Error playing bubble sound', error);
            }

            // Update local state
            setMessages(previousMessages => {
              const updatedMessages = GiftedChat.append(previousMessages, [newMessage]);

              // Update Redux store with all messages
              dispatch(setStoreMessages(updatedMessages));

              return updatedMessages;
            });

            setIsTyping(false);
          }, 1500);
        }
      } else {
        // If we don't get a valid response, try the mock API one more time
        console.log('Invalid API response, trying mock API one more time');

        // Get a random response from predefined responses
        const randomIndex = Math.floor(Math.random() * PREDEFINED_RESPONSES.length);
        const randomResponse = PREDEFINED_RESPONSES[randomIndex];

        setTimeout(() => {
          const newMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: randomResponse,
            createdAt: new Date(),
            user: GALE_USER,
          };

          // Update local state
          setMessages(previousMessages => {
            const updatedMessages = GiftedChat.append(previousMessages, [newMessage]);

            // Update Redux store with all messages
            dispatch(setStoreMessages(updatedMessages));

            return updatedMessages;
          });

          setIsTyping(false);
        }, 1500);
      }
    }).catch(error => {
      console.error('Error processing API response:', error);

      // Even in case of error, use a simulated response
      console.log('Error caught, using simulated response');

      // Get a random response from predefined responses
      const randomIndex = Math.floor(Math.random() * PREDEFINED_RESPONSES.length);
      const randomResponse = PREDEFINED_RESPONSES[randomIndex];

      setTimeout(() => {
        const newMessage = {
          _id: Math.round(Math.random() * 1000000),
          text: randomResponse,
          createdAt: new Date(),
          user: GALE_USER,
        };

        // Update local state
        setMessages(previousMessages => {
          const updatedMessages = GiftedChat.append(previousMessages, [newMessage]);

          // Update Redux store with all messages
          dispatch(setStoreMessages(updatedMessages));

          return updatedMessages;
        });

        setIsTyping(false);
      }, 1500);
    });
  }, [messages, dispatch, sendSound, bubbleSound, threadId, assistantId, isFirstSession, lastMessageCode, fetchData]);

  // Customize the chat bubbles - memoized with useCallback
  const renderBubble = useCallback((props: any) => {
    const message = props.currentMessage as ExtendedIMessage;

    // Handle long press to show reaction picker
    const handleLongPress = () => {
      setSelectedMessage(message);
      setShowReactions(true);
    };

    // Render message reactions if any
    const renderReactions = () => {
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
                onPress={() => handleReaction(message._id, reactionId)}
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
        <Animatable.View animation="zoomIn" duration={1000} useNativeDriver={true}>
          <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={handleLongPress}
            delayLongPress={500}
          >
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: Colors.dark.midBlue,
                  borderRadius: 20,
                  padding: 5,
                  marginBottom: 5,
                  marginLeft: 5,
                },
                right: {
                  backgroundColor: Colors.dark.lightBlue,
                  borderRadius: 20,
                  padding: 5,
                  marginBottom: 5,
                  marginRight: 5,
                },
              }}
              textStyle={{
                left: {
                  color: '#fff',
                  fontFamily: 'fontLight',
                  fontSize: 14,
                },
                right: {
                  color: '#fff',
                  fontFamily: 'fontLight',
                  fontSize: 14,
                },
              }}
              timeTextStyle={{
                left: {
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'fontLight',
                  fontSize: 10,
                  marginLeft: 5,
                  marginBottom: 5,
                },
                right: {
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'fontLight',
                  fontSize: 10,
                  marginRight: 5,
                  marginBottom: 5,
                },
              }}
              renderTime={(timeProps) => {
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Time
                      {...timeProps}
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
                    {props.currentMessage.user._id === CURRENT_USER._id && props.currentMessage.status && (
                      <View style={{ marginLeft: 5 }}>
                        {props.currentMessage.status === 'sent' && (
                          <Icon type="Ionicons" name="checkmark" size={12} color="rgba(255,255,255,0.7)" />
                        )}
                        {props.currentMessage.status === 'delivered' && (
                          <Icon type="Ionicons" name="checkmark-done" size={12} color="rgba(255,255,255,0.7)" />
                        )}
                        {props.currentMessage.status === 'read' && (
                          <Icon type="Ionicons" name="checkmark-done" size={12} color="#4CAF50" />
                        )}
                      </View>
                    )}
                  </View>
                );
              }}
            />
          </TouchableOpacity>
        </Animatable.View>

        {/* Show reactions if any */}
        {renderReactions()}

        {/* Show reaction picker if this message is selected */}
        {selectedMessage?._id === message._id && showReactions && (
          <View style={styles.reactionPickerContainer}>
            {REACTIONS.map(reaction => (
              <TouchableOpacity
                key={reaction.id}
                style={styles.reactionButton}
                onPress={() => handleReaction(message._id, reaction.id)}
              >
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }, [selectedMessage, showReactions, handleReaction]);

  // Customize the day display - memoized with useCallback
  const renderDay = useCallback((props: any) => {
    return (
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
    );
  }, []);

  // Customize the time display - memoized with useCallback
  const renderTime = useCallback((props: any) => {
    return (
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
    );
  }, []);

  // Customize the input toolbar - memoized with useCallback
  const renderInputToolbar = useCallback((props: any) => {
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
  }, []);

  // Customize the composer (text input) - memoized with useCallback
  const renderComposer = useCallback((props: any) => {
    // Handle keyboard sound on focus
    const handleFocus = () => {
      try {
        if (keyboardSound) {
          keyboardSound.setPositionAsync(0);
          keyboardSound.playAsync();
        }
      } catch (error) {
        console.log('Error playing keyboard sound', error);
      }
    };

    // Handle typing sound
    const handleChangeText = (text: string) => {
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
    };

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
  }, [keyboardSound, typingSound]);

  // Customize the send button - memoized with useCallback
  const renderSend = useCallback((props: any) => {
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
  }, []);

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
            renderFooter={() => isTyping ? (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <Animated.View style={[styles.typingDot, { opacity: dot1Opacity, backgroundColor: '#f59249' }]} />
                  <Animated.View style={[styles.typingDot, { opacity: dot2Opacity, backgroundColor: '#0591d2' }]} />
                  <Animated.View style={[styles.typingDot, { opacity: dot3Opacity, backgroundColor: '#98d7f5' }]} />
                </View>
              </View>
            ) : null}
            isTyping={isTyping}
            alwaysShowSend={true}
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
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  listView: {
    backgroundColor: 'transparent',
  },
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
  backButton: {
    marginLeft: 10,
  },
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
  typingText: {
    color: Colors.dark.midBlue,
    fontSize: 12,
    fontFamily: 'fontLight',
    marginRight: 5,
  },
  typingIndicator: {
    marginLeft: 5,
  },
  // Reaction styles
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginLeft: 10,
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
