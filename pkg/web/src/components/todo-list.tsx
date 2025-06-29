"use client";

import {
  Stack,
  Text,
  Card,
  Group,
  ActionIcon,
  TextInput,
  Button,
  Checkbox,
  Alert,
  Loader,
} from "@mantine/core";
import { IconTrash, IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useEffectQuery, useEffectMutation } from "../hooks/use-effect-query";
import { useApi } from "../contexts/api-context";
import { Todo, TodoId } from "@domain/TodosApi";

export function TodoList() {
  const [newTodoText, setNewTodoText] = useState("");
  const { todosApi } = useApi();

  const {
    data: todos,
    isLoading,
    error,
  } = useEffectQuery(["todos"], todosApi.getAllTodos());

  const createTodoMutation = useEffectMutation(
    (text: string) => todosApi.createTodo(text),
    {
      onSuccess: () => {
        setNewTodoText("");
      },
      invalidateQueries: [["todos"]],
    },
  );

  const completeTodoMutation = useEffectMutation(
    (id: TodoId) => todosApi.completeTodo(id),
    {
      invalidateQueries: [["todos"]],
    },
  );

  const removeTodoMutation = useEffectMutation(
    (id: TodoId) => todosApi.removeTodo(id),
    {
      invalidateQueries: [["todos"]],
    },
  );

  const handleCreateTodo = () => {
    if (newTodoText.trim()) {
      createTodoMutation.mutate(newTodoText.trim());
    }
  };

  const handleToggleTodo = (todo: Todo) => {
    if (!todo.done) {
      completeTodoMutation.mutate(todo.id);
    }
  };

  const handleRemoveTodo = (id: TodoId) => {
    removeTodoMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Stack align="center" p="xl">
        <Loader />
        <Text>Todoを読み込み中...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="エラー" color="red">
        Todoの取得に失敗しました: {String(error)}
      </Alert>
    );
  }

  return (
    <Stack>
      <Text size="xl" fw={700}>
        Todo一覧
      </Text>

      <Card p="md">
        <Group>
          <TextInput
            placeholder="新しいTodoを入力"
            value={newTodoText}
            onChange={(event) => setNewTodoText(event.currentTarget.value)}
            style={{ flex: 1 }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleCreateTodo();
              }
            }}
          />
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={handleCreateTodo}
            loading={createTodoMutation.isPending}
            disabled={!newTodoText.trim()}
          >
            追加
          </Button>
        </Group>
      </Card>

      <Stack gap="xs">
        {todos?.map((todo) => (
          <Card key={todo.id} p="md">
            <Group justify="space-between">
              <Group>
                <Checkbox
                  checked={todo.done}
                  onChange={() => handleToggleTodo(todo)}
                  disabled={completeTodoMutation.isPending}
                />
                <Text
                  style={{
                    textDecoration: todo.done ? "line-through" : "none",
                    opacity: todo.done ? 0.6 : 1,
                  }}
                >
                  {todo.text}
                </Text>
              </Group>
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => handleRemoveTodo(todo.id)}
                loading={removeTodoMutation.isPending}
              >
                <IconTrash size="1rem" />
              </ActionIcon>
            </Group>
          </Card>
        ))}
        {todos?.length === 0 && (
          <Text c="dimmed" ta="center" p="xl">
            Todoはありません
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
