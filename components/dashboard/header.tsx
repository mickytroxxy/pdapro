import { Text, View } from "react-native"
import { Button } from "../ui/Button"
import { Colors } from "@/constants/Colors"

export const Header = () => {
    return(
        <View style={{borderBottomLeftRadius:180,borderBottomRightRadius:180,backgroundColor:Colors.dark.midBlue}}>
          <View style={{padding:60,gap:12}}>
            <Text style={{fontFamily:'fontBold',fontSize:24, color:Colors.light?.white, textAlign:'center'}}>Mornings ARE hard!</Text>
            <Text style={{fontFamily:'fontBold',fontSize:12, color:Colors.light?.white, textAlign:'center',marginTop:10}}>42% of parents are reporting that they also find mornings the most challenging part of the day.</Text>
          </View>
          <View style={{justifyContent:'flex-end',padding:20}}>
            <Button onPress={() => {}} text="Read more" variant="secondary"/>
          </View>
        </View>
    )
}