import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Todo } from '../models/Todo';
import { Feather } from '@expo/vector-icons';

interface TodoListProps {
  todos: Todo[];
  selectedTodo: Todo | null;
  onSelectTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export default function TodoList({
  todos,
  selectedTodo,
  onSelectTodo,
  onDeleteTodo,
  onMoveUp,
  onMoveDown
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="target" size={48} color="#d1d5db" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>No todos yet</Text>
        <Text style={styles.emptySubtext}>Tap "New To Do" to create your first task</Text>
      </View>
    );
  }

  // Debug function to log button presses
  const handleMoveUp = (id: string, event: any) => {
    // Stop event propagation
    event.stopPropagation?.();
    console.log('Move Up pressed for id:', id);
    onMoveUp(id);
  };

  const handleMoveDown = (id: string, event: any) => {
    // Stop event propagation
    event.stopPropagation?.();
    console.log('Move Down pressed for id:', id);
    onMoveDown(id);
  };

  const handleDelete = (id: string, event: any) => {
    // Stop event propagation
    event.stopPropagation?.();
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => onDeleteTodo(id),
          style: "destructive"
        }
      ]
    );
  };

  const renderTodoItem = ({ item, index }: { item: Todo; index: number }) => {
    const progressPercentage = Math.min((item.currentCount / item.targetCount) * 100, 100);
    const isSelected = selectedTodo?.id === item.id;
    const isCompleted = item.currentCount >= item.targetCount;
    const isFirst = index === 0;
    const isLast = index === todos.length - 1;

    return (
      <View style={[
        styles.todoItem,
        isSelected && styles.selectedItem,
        isCompleted && styles.completedItem
      ]}>
        <View style={styles.todoItemInner}>
          {/* Main Todo Content */}
          <TouchableOpacity 
            style={styles.todoContent}
            onPress={() => onSelectTodo(item)}
            activeOpacity={0.7}
          >
            <View style={styles.todoHeader}>
              <View style={styles.todoTitleContainer}>
                <Text 
                  style={[
                    styles.todoTitle, 
                    isCompleted && styles.completedText
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>

            <Text style={styles.todoSubtitle}>
              Target: {item.targetCount} | Current: {item.currentCount}
            </Text>

            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  isCompleted ? styles.completedProgressBar : styles.activeProgressBar,
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressText, isCompleted && styles.completedProgressText]}>
                {Math.round(progressPercentage)}% complete
              </Text>
              <Text style={styles.progressText}>
                {item.currentCount}/{item.targetCount}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Action Buttons - Separated from the main content */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.moveButtonsContainer}>
              <TouchableOpacity
                style={[styles.moveButton, isFirst && styles.disabledButton]}
                onPress={(e) => handleMoveUp(item.id, e)}
                disabled={isFirst}
                activeOpacity={0.7}
              >
                <Feather name="chevron-up" size={24} color={isFirst ? "#d1d5db" : "#3b82f6"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.moveButton, isLast && styles.disabledButton]}
                onPress={(e) => handleMoveDown(item.id, e)}
                disabled={isLast}
                activeOpacity={0.7}
              >
                <Feather name="chevron-down" size={24} color={isLast ? "#d1d5db" : "#3b82f6"} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => handleDelete(item.id, e)}
              activeOpacity={0.7}
            >
              <Feather name="trash-2" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={todos}
      renderItem={renderTodoItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={true}
      scrollEnabled={true}
      bounces={true}
      overScrollMode="always"
      style={styles.flatList}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    paddingBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  todoItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  todoItemInner: {
    backgroundColor: 'white',
  },
  todoContent: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f5f3ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  completedItem: {
    borderColor: '#10b981',
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  todoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  completedText: {
    color: '#047857',
  },
  checkmark: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  todoSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  // Action buttons styles
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 8,
    backgroundColor: '#f9fafb',
  },
  moveButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#f9fafb',
  },
  deleteButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#fee2e2',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  activeProgressBar: {
    backgroundColor: '#8b5cf6',
  },
  completedProgressBar: {
    backgroundColor: '#10b981',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  completedProgressText: {
    color: '#10b981',
    fontWeight: '600',
  },
}); 