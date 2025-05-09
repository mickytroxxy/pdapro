import { Footer } from "@/components/dashboard/footer";
import { Header } from "@/components/dashboard/header";
import { QuickBtns } from "@/components/dashboard/quickBtns";
import { GradientBackground } from "@/components/GradientBackground";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { colors, Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";



export default function Dashboard() {

  return (
    <GradientBackground>
      <Stack.Screen options={{ 
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.dark.midBlue,
        },
        headerRight: () => <TouchableOpacity><Icon type="MaterialIcons" name="settings" size={30} color="white" /></TouchableOpacity>
      }} /> 
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar style="light" backgroundColor={Colors.dark.midBlue} />
        <Header/>
        <QuickBtns/>
        <Footer/>
      </ScrollView>
    </GradientBackground>
  );
}
