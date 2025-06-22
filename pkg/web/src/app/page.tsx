"use client";

import { AppShell, Burger, Group, Title, Container, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { TodoList } from "../components/todo-list";

const ThemeToggle = dynamic(
  () =>
    import("../components/theme-toggle").then((mod) => ({
      default: mod.ThemeToggle,
    })),
  {
    ssr: false,
  },
);

export default function Home() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={2}>Zenin Todo</Title>
          </Group>
          <ThemeToggle />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text fw={500}>ナビゲーション</Text>
        <Text size="sm" c="dimmed">
          Todo管理アプリ
        </Text>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          <TodoList />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
