import React from 'react';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { hstackStyle } from './styles';

const GAP_MAP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 28, '4xl': 32 } as const;

type IHStackProps = ViewProps & VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ElementRef<typeof View>, IHStackProps>(
  ({ className, space, reversed, style, ...props }, ref) => {
    const gap = space && space in GAP_MAP ? GAP_MAP[space as keyof typeof GAP_MAP] : 0;
    const layoutStyle = [
      styles.base,
      reversed && styles.reversed,
      gap > 0 && { gap },
    ];
    return (
      <View
        className={hstackStyle({ space, reversed, class: className })}
        style={[layoutStyle, style]}
        {...props}
        ref={ref}
      />
    );
  }
);

HStack.displayName = 'HStack';

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center' },
  reversed: { flexDirection: 'row-reverse' },
});

export { HStack };
