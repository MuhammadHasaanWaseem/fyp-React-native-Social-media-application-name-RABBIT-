import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { postSkeletonStyles } from './PostSkeleton.styles';

export function PostSkeletonItem() {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[postSkeletonStyles.card, { opacity }]}>
      <View style={postSkeletonStyles.header}>
        <View style={postSkeletonStyles.avatar} />
        <View style={postSkeletonStyles.headerText}>
          <View style={postSkeletonStyles.line1} />
          <View style={postSkeletonStyles.line2} />
        </View>
      </View>
      <View style={postSkeletonStyles.content}>
        <View style={postSkeletonStyles.contentLine1} />
        <View style={postSkeletonStyles.contentLine2} />
      </View>
      <View style={postSkeletonStyles.media} />
      <View style={postSkeletonStyles.actions}>
        <View style={postSkeletonStyles.actionBtn} />
        <View style={postSkeletonStyles.actionBtn} />
        <View style={postSkeletonStyles.actionBtn} />
      </View>
    </Animated.View>
  );
}

export function PostSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={postSkeletonStyles.listContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeletonItem key={i} />
      ))}
    </View>
  );
}

export function PostSkeletonFooter() {
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 500, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <Animated.View style={[postSkeletonStyles.card, postSkeletonStyles.footerCard, { opacity }]}>
      <View style={postSkeletonStyles.header}>
        <View style={postSkeletonStyles.avatar} />
        <View style={postSkeletonStyles.headerText}>
          <View style={postSkeletonStyles.line1} />
          <View style={postSkeletonStyles.line2} />
        </View>
      </View>
      <View style={[postSkeletonStyles.media, postSkeletonStyles.footerMedia]} />
    </Animated.View>
  );
}

export default PostSkeletonList;
