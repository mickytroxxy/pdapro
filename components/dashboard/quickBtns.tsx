import { Colors } from "@/constants/Colors"
import { LinearGradient } from "expo-linear-gradient"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { useRouter } from "expo-router"
import * as Animatable from 'react-native-animatable';

const CARD_IMAGE_SIZE = 120;
const actionBtns = [
  {
    header:'Chat to Gale',
    subText:'Get support and guidance from your PDA expert',
    backgroundColors:['#f4bf68', '#ea9813'],
    icon: () => <Image source={require('@/assets/icons/heart.png')} style={{width:CARD_IMAGE_SIZE, height:CARD_IMAGE_SIZE}}/>
  },
  {
    header:'Translator',
    subText:'Turn requests into non-demand language',
    backgroundColors:['#f7b379','#fa6607'],
    icon: () => <Image source={require('@/assets/icons/chats.png')} style={{width:CARD_IMAGE_SIZE, height:CARD_IMAGE_SIZE}}/>
  }
]

export const QuickBtns = () => {
    const router = useRouter();

    const handleButtonPress = (index: number) => {
      if (index === 0) {
        // Navigate to chat screen when "Chat to Gale" is pressed
        router.push('/chat' as any);
      } else if (index === 1) {
        // Handle translator button press (to be implemented)
        console.log('Translator button pressed');
      }
    };

    return(
        <View style={{flex:1,marginTop:50,paddingHorizontal:20}}>
          <View style={{flexDirection:'row'}}>
            {actionBtns.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={{flex:1, alignItems:'center'}}
                onPress={() => handleButtonPress(index)}
              >
                <Animatable.View animation="zoomIn" duration={1000} useNativeDriver={true} style={{alignItems:'center', justifyContent:'center',position:'absolute', top: 0, width:'100%',zIndex:1,marginTop:-50}}>
                  {btn.icon()}
                </Animatable.View>
                <LinearGradient
                  colors={btn.backgroundColors as any}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                  style={{flex:1, padding:20, borderRadius:10, minHeight:200,paddingTop:60,elevation:10,width:'90%',alignSelf:'center'}}
                >
                  <View style={{}}>
                    <Text style={{fontFamily:'fontBold',fontSize:18, color:Colors.light?.white, textAlign:'center',marginTop:10}}>{btn.header}</Text>
                    <Text style={{fontFamily:'fontBold',fontSize:12, color:Colors.light?.white, textAlign:'center',marginTop:10}}>{btn.subText}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
    )
}