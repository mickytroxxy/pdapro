import { GradientBackground } from "@/components/GradientBackground";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { setStoreMessages } from "@/src/state/slices/messages";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useDispatch } from "react-redux";

export default function Onboarding() {
    const router = useRouter();
    const dispatch = useDispatch();
    return (
        <GradientBackground>
            <Stack.Screen options={{ headerShadowVisible: false }} />
            <View style={styles.container}>

                <View style={{marginTop:50}}>
                    <Text style={styles.heading}>Thanks for sharing.</Text>
                    <Text style={styles.heading}>Your profile is ready!</Text>
                </View>

                <Animatable.View animation="zoomIn" duration={1000} useNativeDriver={true} style={{marginTop:30,alignItems:'center'}}>
                    <Image
                        source={require('@/assets/icons/search.png')}
                        style={{width:160, height:160}}
                    />
                </Animatable.View>

                <View style={{gap:10,paddingHorizontal:30,marginTop:30}}>
                    <Text style={{fontFamily:'fontBold',fontSize:12, color:Colors.light?.white, textAlign:'center'}}>
                        From here, we’ve designed a quick session where you can discuss with an expert who understands PDA.
                    </Text>
                    <Text style={{fontFamily:'fontBold',fontSize:12, color:Colors.dark.lightBlue, textAlign:'center'}}>
                        Based on what you’ve shared, we’ll try to find a new practical solution to your current biggest issue.
                    </Text>
                </View>

                <Animatable.View animation="fadeInUpBig" duration={1000} useNativeDriver={true} style={{flex:1, justifyContent:'flex-end', marginBottom:30,paddingHorizontal:30, gap:10}}>
                    <Button
                        text="Start session"
                        shadow
                        variant="secondary"
                        onPress={() => {
                            router.push('/dashboard');
                            dispatch(setStoreMessages([]))
                        }}
                    />
                    <Button
                        text="Skip for now"
                        shadow
                        variant="primary"
                        onPress={() => router.push('/dashboard')}
                    />
                </Animatable.View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding:20,
    },
    heading: {
      fontSize: 20,
      color: Colors.dark.lightBlue,
      marginBottom: 4,
      fontFamily:'fontBold',
      textAlign:'center'
    }
  });