
import React, { useRef, useEffect, useCallback } from 'react';
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  Easing,
  Dimensions,
} from 'react-native';
import SearchBarComponent from './SearchBarComponent';
import LocationContainer from './LocationContainer';
import SearchableItems from './SearchableItems';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_HEIGHT = SCREEN_HEIGHT * 0.7;
const MIN_HEIGHT = 100;

const SearchDraggable = ({ onSearch, customStyles }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT - MIN_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dy) > Math.abs(dx);
      },
      onPanResponderMove: (_, gestureState) => {
        const newTranslateY = Math.min(
          Math.max(gestureState.dy + translateY._value, SCREEN_HEIGHT - MAX_HEIGHT),
          SCREEN_HEIGHT - MIN_HEIGHT
        );
        translateY.setValue(newTranslateY);
      },
      onPanResponderRelease: useCallback(
        (_, gestureState) => {
          const { dy } = gestureState;
          const currentY = translateY._value;

          const snapThreshold = (MAX_HEIGHT - MIN_HEIGHT) / 2;

          let targetPosition;

          if (dy < 0 && Math.abs(dy) > snapThreshold) {
            targetPosition = SCREEN_HEIGHT - MAX_HEIGHT;
          } else if (dy > 0 && Math.abs(dy) > snapThreshold) {
            targetPosition = SCREEN_HEIGHT - MIN_HEIGHT;
          } else {
            targetPosition =
              currentY > (SCREEN_HEIGHT - MAX_HEIGHT + SCREEN_HEIGHT - MIN_HEIGHT) / 2
                ? SCREEN_HEIGHT - MIN_HEIGHT
                : SCREEN_HEIGHT - MAX_HEIGHT;
          }

          Animated.timing(translateY, {
            toValue: targetPosition,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        },
        [translateY]
      ),
    })
  ).current;

  return (
    <Animated.View
      style={[styles.draggableContent, { transform: [{ translateY }] }, customStyles]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handleBar} />
      <SearchBarComponent onSearch={onSearch} />
      <LocationContainer />
      <SearchableItems />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  draggableContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default SearchDraggable;

