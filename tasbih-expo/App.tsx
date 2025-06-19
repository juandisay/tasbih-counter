import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from './models/Todo';
import TodoList from './components/TodoList';
import TodoCounter from './components/TodoCounter';
import TodoModal from './components/TodoModal';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  
  // Get screen dimensions for responsive layout
  const windowHeight = Dimensions.get('window').height;
  const todoListHeight = windowHeight * 0.4; // 40% of screen height

  // Load todos from AsyncStorage on component mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem('todos');
        if (savedTodos) {
          setTodos(JSON.parse(savedTodos));
        }
      } catch (error) {
        console.error('Failed to load todos from storage', error);
      }
    };
    
    loadTodos();
  }, []);

  // Save todos to AsyncStorage whenever todos change
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error('Failed to save todos to storage', error);
      }
    };
    
    saveTodos();
  }, [todos]);

  const addTodo = (name: string, targetCount: number) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      name,
      targetCount,
      currentCount: 0,
    };
    setTodos((prev) => [...prev, newTodo]);
    setIsModalVisible(false);
  };

  const updateTodoCount = (id: string, newCount: number) => {
    const clampedCount = Math.max(0, newCount);
    setTodos((prev) => 
      prev.map((todo) => 
        todo.id === id ? { ...todo, currentCount: clampedCount } : todo
      )
    );

    // Update selectedTodo if it's the one being modified
    if (selectedTodo?.id === id) {
      setSelectedTodo((prev) => (prev ? { ...prev, currentCount: clampedCount } : null));
    }
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
  };

  const selectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  // Move todo up one position
  const moveTodoUp = (id: string) => {
    setTodos((prev) => {
      const index = prev.findIndex(todo => todo.id === id);
      if (index <= 0) return prev; // Already at the top or not found
      
      const newArray = [...prev];
      // Swap with the previous item
      const temp = newArray[index];
      newArray[index] = newArray[index - 1];
      newArray[index - 1] = temp;
      
      return newArray;
    });
  };

  // Move todo down one position
  const moveTodoDown = (id: string) => {
    setTodos((prev) => {
      const index = prev.findIndex(todo => todo.id === id);
      if (index === -1 || index === prev.length - 1) return prev; // Not found or already at the bottom
      
      const newArray = [...prev];
      // Swap with the next item
      const temp = newArray[index];
      newArray[index] = newArray[index + 1];
      newArray[index + 1] = temp;
      
      return newArray;
    });
  };

  // Keep selectedTodo in sync with todos array
  useEffect(() => {
    if (selectedTodo) {
      const updatedTodo = todos.find((todo) => todo.id === selectedTodo.id);
      if (updatedTodo) {
        setSelectedTodo(updatedTodo);
      }
    }
  }, [todos, selectedTodo]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasbih Counter</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Feather name="plus" size={20} color="white" />
          <Text style={styles.addButtonText}>New To Do</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Todo List Section - With fixed height */}
        <View style={[styles.section, { height: todoListHeight }]}>
          <Text style={styles.sectionTitle}>Your Todos</Text>
          <View style={styles.listContainer}>
            <TodoList 
              todos={todos} 
              selectedTodo={selectedTodo} 
              onSelectTodo={selectTodo} 
              onDeleteTodo={deleteTodo}
              onMoveUp={moveTodoUp}
              onMoveDown={moveTodoDown}
            />
          </View>
        </View>

        {/* Counter Section - Takes remaining space */}
        <View style={[styles.section, styles.counterSection]}>
          <View style={styles.counterHeader}>
            <Text style={styles.sectionTitle}>Counter</Text>
            {selectedTodo && (
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedTodo(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {selectedTodo ? (
            <TodoCounter 
              todo={selectedTodo} 
              onUpdateCount={updateTodoCount}
              allTodos={todos}
              onSelectTodo={selectTodo}
            />
          ) : (
            <View style={styles.emptyCounter}>
              <Text style={styles.emptyCounterText}>Select a todo to start counting</Text>
              <Text style={styles.emptyCounterSubtext}>Tap on any todo from the list above</Text>
            </View>
          )}
        </View>
      </View>

      {/* Modal */}
      <TodoModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onSubmit={addTodo} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  counterSection: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  counterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
  },
  closeButtonText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyCounter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCounterText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyCounterSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
