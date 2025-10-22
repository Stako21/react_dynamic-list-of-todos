import { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export const useTodoFilter = (initialTodos: Todo[]) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTodos = useMemo(() => {
    let result = todos;

    switch (filter) {
      case 'completed':
        result = result.filter(todo => todo.completed);
        break;
      case 'active':
        result = result.filter(todo => !todo.completed);
        break;
      case 'all':
      default:
        break;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter(todo => todo.title.toLowerCase().includes(query));
    }

    return result;
  }, [todos, filter, searchQuery]);

  const handleFilterChange = (
    newFilter: FilterType,
    newSearchQuery: string,
  ) => {
    setFilter(newFilter);
    setSearchQuery(newSearchQuery);
  };

  return {
    todos: filteredTodos,
    filter,
    searchQuery,
    setTodos,
    onFilterChange: handleFilterChange,
  };
};
