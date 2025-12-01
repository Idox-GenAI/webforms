import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useFormBuilder } from '../../context/FormBuilderContext';

interface BuilderHeaderProps {
  onPreview: () => void;
}

export const BuilderHeader = ({ onPreview }: BuilderHeaderProps) => {
  const { schema, updateForm } = useFormBuilder();

  const handleSave = () => {
    try {
      localStorage.setItem('form-builder-schema', JSON.stringify(schema));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save schema', error);
    }
  };

  return (
    <Group
      justify="space-between"
      align="center"
      px="md"
      py="sm"
      style={{
        backdropFilter: 'blur(6px)',
      }}
    >
      <Stack gap={4} style={{ flex: 1 }}>
        <TextInput
          label="Form name"
          placeholder="Untitled form"
          value={schema.name}
          onChange={(event) => updateForm({ name: event.currentTarget.value })}
        />
        <Text size="sm" c="dimmed">
          Build your sections and fields, then preview before saving.
        </Text>
      </Stack>
      <Group gap="sm">
        <Button variant="default" onClick={handleSave}>
          Save
        </Button>
        <Button onClick={onPreview}>Preview</Button>
      </Group>
    </Group>
  );
};
