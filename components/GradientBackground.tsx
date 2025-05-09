import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
export function GradientBackground({children}: {children: React.ReactNode}) {
  return(
    <LinearGradient
        colors={[Colors.dark.darkBlue,Colors.dark.darkBlue, Colors.dark.lightBlue,Colors.dark.darkBlue]}
        start={{ x: 1, y: 0 }}
        end={{ x: 2.5, y: 1 }}
        style={{flex:1}}
    >
        {children}
    </LinearGradient>
  );
}
