import { IconType } from '@/constants/Types';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import React, { memo } from 'react';

const Icon = memo((props: IconType) => {
  const { name, type, size, color } = props;

  let IconComponent;

  switch (type) {
    case "FontAwesome":
      IconComponent = FontAwesome;
      break;
    case "MaterialIcons":
      IconComponent = MaterialIcons;
      break;
    case "Ionicons":
      IconComponent = Ionicons;
      break;
    case "Feather":
      IconComponent = Feather;
      break;
    case "FontAwesome5":
      IconComponent = FontAwesome5;
      break;
    case "AntDesign":
      IconComponent = AntDesign;
      break;
    case "MaterialCommunityIcons":
      IconComponent = MaterialCommunityIcons;
      break;
    case "EvilIcons":
      IconComponent = EvilIcons;
      break;
    case "Foundation":
      IconComponent = Foundation;
      break;
    case "SimpleLineIcons":
      IconComponent = SimpleLineIcons;
      break;
    case "FontAwesome6":
      IconComponent = FontAwesome6;
      break;
    default:
      return null;
  }

  return <IconComponent name={name} size={size} color={color} />;
});

export default Icon;
