import React from 'react';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { View, StyleSheet } from 'react-native';
import { vstackStyle } from './styles';

const GAP_MAP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 28, '4xl': 32 } as const;

type IVStackProps = React.ComponentProps<typeof View> & VariantProps<typeof vstackStyle>;

const VStack = React.forwardRef<React.ElementRef<typeof View>, IVStackProps>(
  ({ className, space, reversed, style, ...props }, ref) => {
    const gap = space && space in GAP_MAP ? GAP_MAP[space as keyof typeof GAP_MAP] : 0;
    const layoutStyle = [
      styles.base,
      reversed && styles.reversed,
      gap > 0 && { gap },
    ];
    return (
      <View
        className={vstackStyle({ space, reversed, class: className })}
        style={[layoutStyle, style]}
        {...props}
        ref={ref}
      />
    );
  }
);

VStack.displayName = 'VStack';

const styles = StyleSheet.create({
  base: { flexDirection: 'column', alignItems: 'stretch' },
  reversed: { flexDirection: 'column-reverse' },
});

export { VStack };
