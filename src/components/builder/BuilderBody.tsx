import { Box, Group, Stack, Title } from '@mantine/core';
import { CanvasPanel } from './CanvasPanel';
import { PalettePanel } from './PalettePanel';
import { PropertiesPanel } from './PropertiesPanel';

export const BuilderBody = () => {
  return (
    <Stack gap="md">
      <Title order={3} fw={600}>
        Form canvas
      </Title>
      <Group align="flex-start" gap="md" wrap="nowrap">
        <Box w={250}>
          <PalettePanel />
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <CanvasPanel />
        </Box>
        <Box w={300}>
          <PropertiesPanel />
        </Box>
      </Group>
    </Stack>
  );
};
