import { Colors } from "@/constants/Colors"
import { LinearGradient } from "expo-linear-gradient"
import { Text, TouchableOpacity, View } from "react-native"
import Icon from "../ui/Icon"

export const Footer = () => {
    return(
        <View style={{padding:20}}>
          <View>
            <Text style={{fontFamily:'fontBold',fontSize:10, color:Colors.dark.lightBlue}}>Vote on the Next Feature!</Text>
          </View>
          <View style={{backgroundColor:'#103043' ,flexDirection:'row',elevation:1, borderRadius:10, padding:20,marginTop:10}}>
            <View style={{flex:1,justifyContent:'center',gap:10}}>
              <Text style={{fontFamily:'fontBold',fontSize:12, color:Colors.light?.white}}>Venting Space</Text>
              <View>
                <Text style={{fontFamily:'fontLight',fontSize:12, color:Colors.light?.white}}>Share freely, receive empathy.</Text>
                <Text style={{fontFamily:'fontLight',fontSize:12, color:Colors.light?.white}}>No judgement - Just support.</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity style={{position:'absolute',bottom:50,right:0}}>
                <LinearGradient
                  colors={[Colors.dark.lightBlue, Colors.dark.darkBlue]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding:5, 
                    borderRadius:100,
                    alignItems:'center', 
                    justifyContent:'center',
                    
                  }}
                >

                  <LinearGradient
                    colors={['#fae19c', '#ea9813']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                    style={{padding:5, borderRadius:100,alignItems:'center', justifyContent:'center'}}
                  >
                    <Icon type="MaterialIcons" name="thumb-up" size={30} color={Colors.dark.darkBlue} />
                  </LinearGradient>

                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={{position:'absolute',top:50,right:0}}>
                <LinearGradient
                  colors={['#f7b379','#fa6607']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                  style={{padding:5, borderRadius:100,alignItems:'center', justifyContent:'center'}}
                >

                  <LinearGradient
                    colors={[Colors.dark.lightBlue, '#ea9813']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                    style={{padding:5, borderRadius:100,alignItems:'center', justifyContent:'center'}}
                  >
                    <Icon type="MaterialIcons" name="thumb-down" size={30} color="#fa6607" />
                  </LinearGradient>

                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    )
}