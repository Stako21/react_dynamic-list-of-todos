/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos, getUser } from './api';
import { useTodoFilter } from './hooks/useTodoFilter';
import { User } from './types/User';

export const App: React.FC = () => {
  const [initialTodos, setInitialTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [todo, setTodo] = useState<Todo>();
  const [modalIsActive, setModalIsActive] = useState<boolean>(false);

  const { todos: filteredTodos, onFilterChange } = useTodoFilter(initialTodos);

  // useTodoFilter now derives its state from the passed todos array

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(fetchedTodos => {
        setInitialTodos(fetchedTodos);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!todo) {
      return;
    }

    setModalIsActive(true);
    setLoading(true);
    setUser(undefined);

    getUser(todo.userId)
      .then(choicedUser => {
        setUser(choicedUser);
      })
      .finally(() => setLoading(false));
  }, [todo]);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter onFilterChange={onFilterChange} />
            </div>

            <div className="block">
              {loading && <Loader />}
              <TodoList
                todos={filteredTodos}
                onSelectTodo={setTodo}
                selectedTodo={todo}
              />
            </div>
          </div>
        </div>
      </div>

      {modalIsActive && todo && (
        <TodoModal
          user={user}
          todo={todo}
          loading={loading}
          onClose={() => {
            setModalIsActive(false);
            setTodo(undefined);
            setUser(undefined);
          }}
        />
      )}
    </>
  );
};
