import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { centerStyle } from './styles';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';

type ICenterProps = ViewProps & VariantProps<typeof centerStyle>;

const Center = React.forwardRef<React.ElementRef<typeof View>, ICenterProps>(
  ({ className, style, ...props }, ref) => (
    <View
      className={centerStyle({ class: className })}
      style={[styles.base, style]}
      {...props}
      ref={ref}
    />
  )
);

Center.displayName = 'Center';

const styles = StyleSheet.create({
  base: { justifyContent: 'center', alignItems: 'center' },
});

export { Center };
