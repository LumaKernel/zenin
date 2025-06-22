"use client";

import { ActionIcon, Menu, Text, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="outline" size="lg">
          {colorScheme === "dark" ? (
            <IconMoon size={18} />
          ) : colorScheme === "light" ? (
            <IconSun size={18} />
          ) : (
            <IconDeviceDesktop size={18} />
          )}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>テーマを選択</Menu.Label>

        <Menu.Item
          leftSection={<IconSun size={14} />}
          onClick={() => setColorScheme("light")}
        >
          <Text size="sm">ライト</Text>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconMoon size={14} />}
          onClick={() => setColorScheme("dark")}
        >
          <Text size="sm">ダーク</Text>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconDeviceDesktop size={14} />}
          onClick={() => setColorScheme("auto")}
        >
          <Text size="sm">システム</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
