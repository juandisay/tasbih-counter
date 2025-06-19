import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Todo } from '../models/Todo';
import Svg, { Circle } from 'react-native-svg';
import CounterButtons from './CounterButtons';
import { Feather } from '@expo/vector-icons';

interface TodoCounterProps {
  todo: Todo;
  onUpdateCount: (id: string, newCount: number) => void;
  allTodos?: Todo[]; // Add all todos for navigation
  onSelectTodo?: (todo: Todo) => void; // Add callback to select another todo
}

export default function TodoCounter({ todo, onUpdateCount, allTodos = [], onSelectTodo }: TodoCounterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const progressPercentage = (todo.currentCount / todo.targetCount) * 100;
  const isCompleted = todo.currentCount >= todo.targetCount;

  // Find current todo index for navigation
  const currentIndex = allTodos.findIndex(t => t.id === todo.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allTodos.length - 1 && currentIndex !== -1;

  const handleDecrease = () => {
    if (todo.currentCount > 0 && !isUpdating) {
      setIsUpdating(true);
      onUpdateCount(todo.id, todo.currentCount - 1);
      setTimeout(() => setIsUpdating(false), 100);
    }
  };

  const handleIncrease = () => {
    if (!isUpdating) {
      setIsUpdating(true);
      onUpdateCount(todo.id, todo.currentCount + 1);
      setTimeout(() => setIsUpdating(false), 100);
    }
  };

  const handleReset = () => {
    onUpdateCount(todo.id, 0);
  };

  const handleComplete = () => {
    onUpdateCount(todo.id, todo.targetCount);
  };

  const goToNextTodo = () => {
    if (hasNext && onSelectTodo) {
      onSelectTodo(allTodos[currentIndex + 1]);
    }
  };

  const goToPreviousTodo = () => {
    if (hasPrevious && onSelectTodo) {
      onSelectTodo(allTodos[currentIndex - 1]);
    }
  };

  // Calculate circle properties for progress indicator
  const getCircleSize = () => {
    return isFullScreen 
      ? Dimensions.get('window').width * 0.5 
      : Dimensions.get('window').width * 0.25;
  };
  
  const size = getCircleSize();
  const strokeWidth = isFullScreen ? 12 : 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const renderCounterContent = () => {
    return (
      <View style={[styles.container, isFullScreen && styles.fullScreenContainer]}>
        {/* Navigation Header - Only in full screen mode */}
        {isFullScreen && (
          <View style={styles.navigationHeader}>
            <TouchableOpacity 
              style={[styles.navButton, !hasPrevious && styles.disabledNavButton]} 
              onPress={goToPreviousTodo}
              disabled={!hasPrevious}
            >
              <Feather name="chevron-left" size={24} color={hasPrevious ? "#5b21b6" : "#d1d5db"} />
              <Text style={[styles.navButtonText, !hasPrevious && styles.disabledText]}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeFullScreenButton} 
              onPress={() => setIsFullScreen(false)}
            >
              <Feather name="minimize-2" size={20} color="#6b7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navButton, !hasNext && styles.disabledNavButton]} 
              onPress={goToNextTodo}
              disabled={!hasNext}
            >
              <Text style={[styles.navButtonText, !hasNext && styles.disabledText]}>Next</Text>
              <Feather name="chevron-right" size={24} color={hasNext ? "#5b21b6" : "#d1d5db"} />
            </TouchableOpacity>
          </View>
        )}

        {/* Todo Info */}
        <View style={[styles.infoContainer, isFullScreen && styles.fullScreenInfoContainer]}>
          <Text 
            style={[styles.todoName, isFullScreen && styles.fullScreenTodoName]} 
            numberOfLines={isFullScreen ? 3 : 2}
          >
            {todo.name}
          </Text>
          <Text style={[styles.todoTarget, isFullScreen && styles.fullScreenTodoTarget]}>
            Target: {todo.targetCount}
          </Text>
        </View>

        <View style={[styles.mainContent, isFullScreen && styles.fullScreenMainContent]}>
          {/* Progress Circle */}
          <View style={styles.progressCircleContainer}>
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={isCompleted ? "#10b981" : "#8b5cf6"}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
              />
            </Svg>
            <Text style={[styles.progressText, isFullScreen && styles.fullScreenProgressText]}>
              {Math.round(Math.min(progressPercentage, 100))}%
            </Text>
          </View>

          {/* Current Count Display */}
          <View style={styles.countDisplayContainer}>
            <Text style={[styles.countLabel, isFullScreen && styles.fullScreenLabel]}>
              Current Progress
            </Text>
            <Text style={[
              styles.countValue,
              isFullScreen && styles.fullScreenCountValue,
              isUpdating && styles.countUpdating
            ]}>
              {todo.currentCount}
            </Text>
          </View>
        </View>

        {/* Counter Buttons */}
        <CounterButtons
          currentCount={todo.currentCount}
          targetCount={todo.targetCount}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onReset={handleReset}
          onComplete={handleComplete}
          isUpdating={isUpdating}
        />

        {/* Progress Details */}
        <View style={[styles.detailsContainer, isFullScreen && styles.fullScreenDetailsContainer]}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isFullScreen && styles.fullScreenLabel]}>
                Remaining
              </Text>
              <Text style={[styles.detailValue, isFullScreen && styles.fullScreenDetailValue]}>
                {Math.max(0, todo.targetCount - todo.currentCount)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isFullScreen && styles.fullScreenLabel]}>
                Progress
              </Text>
              <Text style={[styles.detailValue, isFullScreen && styles.fullScreenDetailValue]}>
                {todo.currentCount}/{todo.targetCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Completion Status */}
        {isCompleted && (
          <View style={[styles.completionContainer, isFullScreen && styles.fullScreenCompletionContainer]}>
            <Text style={[styles.completionTitle, isFullScreen && styles.fullScreenCompletionTitle]}>
              🎉 Congratulations!
            </Text>
            <Text style={[styles.completionSubtitle, isFullScreen && styles.fullScreenCompletionSubtitle]}>
              You've reached your target count!
            </Text>
          </View>
        )}

        {/* Motivational Messages */}
        {!isCompleted && progressPercentage > 0 && (
          <View style={styles.motivationContainer}>
            {progressPercentage >= 75 && (
              <Text style={[styles.motivationText, isFullScreen && styles.fullScreenMotivationText]}>
                Almost there! Keep going! 💪
              </Text>
            )}
            {progressPercentage >= 50 && progressPercentage < 75 && (
              <Text style={[styles.motivationText, isFullScreen && styles.fullScreenMotivationText]}>
                Great progress! You're halfway there! 🚀
              </Text>
            )}
            {progressPercentage < 50 && progressPercentage > 0 && (
              <Text style={[styles.motivationText, isFullScreen && styles.fullScreenMotivationText]}>
                Good start! Keep it up! ⭐
              </Text>
            )}
          </View>
        )}

        {/* Full Screen Toggle Button - Only in normal mode */}
        {!isFullScreen && (
          <TouchableOpacity 
            style={styles.fullScreenButton} 
            onPress={() => setIsFullScreen(true)}
          >
            <Feather name="maximize-2" size={16} color="#6b7280" />
            <Text style={styles.fullScreenButtonText}>Full Screen</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render full screen mode in a Modal
  if (isFullScreen) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isFullScreen}
        onRequestClose={() => setIsFullScreen(false)}
      >
        <SafeAreaView style={styles.fullScreenModalContainer}>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {renderCounterContent()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }

  // Normal mode
  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {renderCounterContent()}
    </ScrollView>
  );
}

// Add SafeAreaView import at the top
import { SafeAreaView } from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 8,
  },
  fullScreenContainer: {
    padding: 16,
    paddingTop: 0,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    color: '#5b21b6',
    fontWeight: '500',
  },
  disabledText: {
    color: '#d1d5db',
  },
  closeFullScreenButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  infoContainer: {
    backgroundColor: '#f5f3ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  fullScreenInfoContainer: {
    padding: 16,
    marginBottom: 24,
  },
  todoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5b21b6',
    marginBottom: 4,
  },
  fullScreenTodoName: {
    fontSize: 22,
    marginBottom: 8,
  },
  todoTarget: {
    fontSize: 13,
    color: '#7c3aed',
  },
  fullScreenTodoTarget: {
    fontSize: 16,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fullScreenMainContent: {
    flexDirection: 'column',
    marginBottom: 24,
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  progressText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  fullScreenProgressText: {
    fontSize: 24,
  },
  countDisplayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  fullScreenLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  countValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  fullScreenCountValue: {
    fontSize: 48,
    marginTop: 16,
    marginBottom: 16,
  },
  countUpdating: {
    color: '#7c3aed',
    transform: [{ scale: 1.1 }],
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  fullScreenDetailsContainer: {
    padding: 16,
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  fullScreenDetailValue: {
    fontSize: 20,
  },
  completionContainer: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  fullScreenCompletionContainer: {
    padding: 20,
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 4,
  },
  fullScreenCompletionTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 13,
    color: '#047857',
  },
  fullScreenCompletionSubtitle: {
    fontSize: 16,
  },
  motivationContainer: {
    alignItems: 'center',
    padding: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  fullScreenMotivationText: {
    fontSize: 18,
  },
  fullScreenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 8,
  },
  fullScreenButtonText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  }
}); 