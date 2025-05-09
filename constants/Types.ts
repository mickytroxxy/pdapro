import { KeyboardTypeOptions, StyleProp, TouchableOpacityProps, ViewStyle } from "react-native"

export type UserRole = 'patron' | 'dj' | 'admin';
export interface PlayMyJamProfile {
  role?: UserRole;
  userId?: string;
  djName?: string;
  experience?: string;
  genres?: string;
  clubId?: string;
  clubName?: string;
  operatingHours?: string;
  code?: number | string;
  acceptTerms?: boolean;
  password?: string;
  referredBy?: string;
  photos?:string[];
  about?:string;
  rates?:string[];
  balance?:number;
  deleted?:boolean;
  address?:LocationType;
  geoHash?:string;
  fname?:string;
  phoneNumber?:string;
  avatar?:string;
  isVerified?:boolean;
  date?:number;
  
}
export type IconType = {
    size?:number,
    color:string,
    type:string,
    name:string,
    min?:number
}
export interface TextAreaProps {
  attr: {
    icon: IconType;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
    field: string;
    value?: string;
    color?:string;
    height?:any;
    multiline?:boolean;
    isSendInput?:boolean;
    borderRadius?:number;
    onSendClicked?: () => any;
    onFocus?: () => any;
    editable?: boolean;
    handleChange: (field: string, value: string) => any;
  };
  style?: StyleProp<ViewStyle>;
}
export interface ButtonProps extends TouchableOpacityProps {
    btnInfo?: {
      styles?: StyleProp<ViewStyle>;
    };
    textInfo?: {
      text?: string;
      color?: string;
    };
    iconInfo: IconType;
    handleBtnClick: () => void;
}
export interface IconButtonProps {
  iconInfo: IconType;
  handleBtnClick: () => void;
}
export interface AddressButtonProps {
  handleBtnClick: (value:LocationType) => void;
  placeholder?:string;
}
export type LocationType = {
  latitude:number;
  longitude:number;
  text?:string;
  short_name?:string;
  long_name?:string
}
export interface DateButtonProps {
  handleBtnClick: (value:string) => void;
  placeholder?:string;
  mode: 'date' | 'time'
}
export type CountryDataType = {
  dialCode:string;
  name:string;
  flag:string;
}
export type ConfirmDialogType = {
  isVisible: boolean,
  text: string,
  okayBtn: string,
  cancelBtn: string,
  hasHideModal:boolean,
  isSuccess?: boolean,
  response?:any,
  severity?:boolean
}
export type LocationInputProps = {
  handleChange: (field: string, value: object) => void;
  field: string;
  placeHolder: string;
};