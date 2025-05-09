import { Colors } from "@/constants/Colors"
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native"

export const Button = (
    {text,textStyle, onPress, variant, disabled, btnStyle, shadow}:
    {
        text:string,
        textStyle?:StyleProp<TextStyle>, 
        onPress:() => void,
        variant:'primary' | 'secondary',
        disabled?:boolean,
        btnStyle?:StyleProp<ViewStyle>,
        shadow?:boolean
    }
) => {
    return(
        <TouchableOpacity onPress={onPress} style={[{backgroundColor:variant === 'primary' ? Colors.dark.darkBlue : Colors.dark.lightBlue, elevation:shadow ? 3 : 0, paddingVertical:20,alignItems:'center', paddingHorizontal:20, borderRadius:30, opacity:disabled ? 0.5 : 1}, btnStyle]} disabled={disabled}>
            <Text style={[{color:Colors.light?.white, fontFamily:'fontBold'}, textStyle]}>{text}</Text>
        </TouchableOpacity>
    )   
}