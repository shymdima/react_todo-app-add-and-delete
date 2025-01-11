import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (updater: ((todos: Todo[]) => Todo[]) | Todo[]) => void;
  filter: string;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  setError: (value: string) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  filter,
  setFilter,
  setError,
}) => {
  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const updatedTodos: Todo[] = [...todos];
    let hasErrors = false;

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        const index = updatedTodos.findIndex(t => t.id === todo.id);

        if (index !== -1) {
          updatedTodos.splice(index, 1);
        }
      } catch {
        hasErrors = true;
        setError(`Unable to delete a todo`);
      }
    }

    setTodos(updatedTodos);

    if (hasErrors) {
      setError('Unable to delete a todo');
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!todos.some(todo => todo.completed)}
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
