import { Image } from 'expo-image';
import { Text, View } from 'react-native';

type UserAvatarProps = {
  name: string;
  imageUri?: string;
  size?: number;
  className?: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function UserAvatar({ name, imageUri, size = 110, className = '' }: UserAvatarProps) {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (imageUri) {
    return (
      <Image
        className={`border-2 border-white/80 ${className}`}
        contentFit="cover"
        source={{ uri: imageUri }}
        style={avatarStyle}
      />
    );
  }

  return (
    <View
      className={`items-center justify-center border-2 border-white/80 bg-brand-700 ${className}`}
      style={avatarStyle}>
      <Text className="text-3xl font-bold text-white">{getInitials(name)}</Text>
    </View>
  );
}
