import { Card, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import type { FieldType } from '../../types/formSchema';
import { useFormBuilder } from '../../context/FormBuilderContext';

const fieldTypes: { label: string; type: FieldType }[] = [
  { label: 'Text', type: 'text' },
  { label: 'Textarea', type: 'textarea' },
  { label: 'Number', type: 'number' },
  { label: 'Date', type: 'date' },
  { label: 'Select', type: 'select' },
  { label: 'Checkbox', type: 'checkbox' },
  { label: 'Radio', type: 'radio' },
];

export const PalettePanel = () => {
  const { schema, selection, addField, addRow, addSection } = useFormBuilder();

  const targetSectionId =
    selection?.type === 'section'
      ? selection.id
      : selection?.type === 'row'
        ? schema.sections.find((section) =>
            section.rows.some((row) => row.id === selection.id),
          )?.id
        : schema.sections[0]?.id;

  const targetColumnId = (() => {
    if (selection?.type === 'field') {
      return schema.sections
        .flatMap((section) => section.rows)
        .flatMap((row) => row.columns)
        .find((column) => column.fields.some((field) => field.id === selection.id))
        ?.id;
    }

    if (selection?.type === 'row') {
      return schema.sections
        .flatMap((section) => section.rows)
        .find((row) => row.id === selection.id)
        ?.columns[0]?.id;
    }

    if (selection?.type === 'section') {
      const section = schema.sections.find((item) => item.id === selection.id);
      return section?.rows[0]?.columns[0]?.id;
    }

    return schema.sections[0]?.rows[0]?.columns[0]?.id;
  })();

  const handleAddField = (type: FieldType) => {
    if (targetColumnId) {
      addField(targetColumnId, type);
    }
  };

  const handleAddRow = () => {
    if (targetSectionId) {
      addRow(targetSectionId);
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="sm">
        <Text fw={600}>Palette</Text>
        <Text size="sm" c="dimmed">
          Choose a field type to add it to the current column.
        </Text>
        <SimpleGrid cols={2} spacing="xs">
          {fieldTypes.map((item) => (
            <Card
              key={item.type}
              padding="sm"
              withBorder
              radius="md"
              shadow="xs"
              onClick={() => handleAddField(item.type)}
              style={{ cursor: targetColumnId ? 'pointer' : 'not-allowed' }}
            >
              <Text size="sm" fw={600}>
                {item.label}
              </Text>
              <Text size="xs" c="dimmed">
                Click to add
              </Text>
            </Card>
          ))}
        </SimpleGrid>
        <Group grow>
          <Card
            padding="sm"
            withBorder
            radius="md"
            shadow="xs"
            style={{ cursor: 'pointer' }}
            onClick={() => addSection('New section')}
          >
            <Text size="sm" fw={600}>
              Add section
            </Text>
          </Card>
          <Card
            padding="sm"
            withBorder
            radius="md"
            shadow="xs"
            style={{ cursor: targetSectionId ? 'pointer' : 'not-allowed' }}
            onClick={handleAddRow}
          >
            <Text size="sm" fw={600}>
              Add row
            </Text>
          </Card>
        </Group>
      </Stack>
    </Card>
  );
};
