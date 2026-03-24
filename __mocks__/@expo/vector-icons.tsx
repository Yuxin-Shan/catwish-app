// Mock for @expo/vector-icons
export const Ionicons = ({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) => {
  // Return a simple component that renders the icon name
  return `Ionicons: ${name}`;
};

export const MaterialIcons = ({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) => {
  return `MaterialIcons: ${name}`;
};

export default {
  Ionicons,
  MaterialIcons,
};
