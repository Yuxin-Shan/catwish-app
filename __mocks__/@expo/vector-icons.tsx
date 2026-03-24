// Mock for @expo/vector-icons
import React from 'react';

export const Ionicons = ({
  name,
  size,
  color,
  testID,
}: {
  name: string;
  size: number;
  color: string;
  testID?: string;
}) => {
  // Return a simple component that renders the icon name
  return React.createElement('Text', { testID }, `Ionicons: ${name}`);
};

export const MaterialIcons = ({
  name,
  size,
  color,
  testID,
}: {
  name: string;
  size: number;
  color: string;
  testID?: string;
}) => {
  return React.createElement('Text', { testID }, `MaterialIcons: ${name}`);
};

export default {
  Ionicons,
  MaterialIcons,
};
