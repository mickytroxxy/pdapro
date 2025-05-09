import React, { memo } from 'react';
import { View } from 'react-native';
import { Bubble, Time, IMessage } from 'react-native-gifted-chat';
import * as Animatable from 'react-native-animatable';
import { Colors } from '@/constants/Colors';
import Icon from '@/components/ui/Icon';

// Mock data for the current user
const CURRENT_USER = {
  _id: 1,
  name: 'You',
};

interface ChatBubbleProps {
  props: any;
}

const ChatBubble = memo(({ props }: ChatBubbleProps) => {
  return (
    <Animatable.View animation="zoomIn" duration={1000} useNativeDriver={true}>
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
    </Animatable.View>
  );
});

export default ChatBubble;
