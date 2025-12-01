import React from 'react';
import { ActionIcon, Card, Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormBuilder } from '../../context/FormBuilderContext';
import type { ColumnSchema, FieldSchema, RowSchema, SectionSchema } from '../../types/formSchema';

const DragHandle = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      style={{
        cursor: 'grab',
        padding: '2px 6px',
        borderRadius: 6,
        background: '#f1f5f9',
        fontSize: 12,
        userSelect: 'none',
        ...props.style,
      }}
    >
      ⋮⋮
    </div>
  );
};

interface FieldItemProps {
  field: FieldSchema;
  columnId: string;
}

const FieldItem = ({ field, columnId }: FieldItemProps) => {
  const { selection, selectElement, removeField } = useFormBuilder();
  const sortable = useSortable({
    id: field.id,
    data: { type: 'field', columnId },
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: selection?.id === field.id ? '1px solid #228be6' : '1px solid #e2e8f0',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      padding="sm"
      radius="md"
      withBorder
      style={style}
      onClick={(event) => {
        event.stopPropagation();
        selectElement({ type: 'field', id: field.id });
      }}
    >
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <DragHandle {...attributes} {...listeners} />
          <Stack gap={2}>
            <Text size="sm" fw={600}>
              {field.label || field.name}
            </Text>
            <Text size="xs" c="dimmed">
              {field.type}
            </Text>
          </Stack>
        </Group>
        <ActionIcon
          variant="subtle"
          color="red"
          aria-label="Remove field"
          onClick={(event) => {
            event.stopPropagation();
            removeField(field.id);
          }}
        >
          ✕
        </ActionIcon>
      </Group>
    </Card>
  );
};

interface ColumnEditorProps {
  column: ColumnSchema;
}

const ColumnEditor = ({ column }: ColumnEditorProps) => {
  return (
    <Stack gap="xs">
      <SortableContext items={column.fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
        {column.fields.map((field) => (
          <FieldItem key={field.id} field={field} columnId={column.id} />
        ))}
      </SortableContext>
    </Stack>
  );
};

interface RowEditorProps {
  row: RowSchema;
  sectionId: string;
}

const RowEditor = ({ row, sectionId }: RowEditorProps) => {
  const { selection, selectElement, removeRow } = useFormBuilder();
  const sortable = useSortable({
    id: row.id,
    data: { type: 'row', sectionId },
  });

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: selection?.id === row.id ? '1px solid #228be6' : '1px solid #e2e8f0',
    backgroundColor: '#fff',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
  };

  return (
    <Card
      ref={setNodeRef}
      padding="sm"
      radius="md"
      withBorder
      style={style}
      onClick={(event) => {
        event.stopPropagation();
        selectElement({ type: 'row', id: row.id });
      }}
    >
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <DragHandle {...attributes} {...listeners} />
          <Text size="sm" fw={600}>
            Row
          </Text>
        </Group>
        <ActionIcon
          variant="subtle"
          color="red"
          aria-label="Remove row"
          onClick={(event) => {
            event.stopPropagation();
            removeRow(row.id);
          }}
        >
          ✕
        </ActionIcon>
      </Group>
      <Group align="flex-start" gap="sm">
        {row.columns.map((column) => (
          <Paper
            key={column.id}
            style={{ flex: column.span / 4 }}
            p="xs"
            bg="#f8fafc"
            radius="md"
            withBorder
          >
            <ColumnEditor column={column} />
          </Paper>
        ))}
      </Group>
    </Card>
  );
};

interface SectionEditorProps {
  section: SectionSchema;
}

const SectionEditor = ({ section }: SectionEditorProps) => {
  const { selection, selectElement, addRow, removeSection } = useFormBuilder();

  return (
    <Card
      padding="md"
      radius="md"
      withBorder
      bg={selection?.id === section.id ? '#eef2ff' : 'white'}
      style={{ border: selection?.id === section.id ? '1px solid #228be6' : undefined }}
      onClick={() => selectElement({ type: 'section', id: section.id })}
    >
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <ThemeIcon color="blue" variant="light" size="sm">
            #
          </ThemeIcon>
          <Text fw={700}>{section.title}</Text>
        </Group>
        <ActionIcon
          variant="subtle"
          color="red"
          aria-label="Remove section"
          onClick={(event) => {
            event.stopPropagation();
            removeSection(section.id);
          }}
        >
          ✕
        </ActionIcon>
      </Group>

      <SortableContext
        items={section.rows.map((row) => row.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack gap="sm">
          {section.rows.map((row) => (
            <RowEditor key={row.id} row={row} sectionId={section.id} />
          ))}
        </Stack>
      </SortableContext>

      <Card
        mt="sm"
        padding="sm"
        radius="md"
        withBorder
        style={{ cursor: 'pointer' }}
        onClick={(event) => {
          event.stopPropagation();
          addRow(section.id);
        }}
      >
        <Text size="sm" fw={600}>
          + Add row
        </Text>
      </Card>
    </Card>
  );
};

export const CanvasPanel = () => {
  const { schema, reorderRows, reorderFields, selectElement, selection } = useFormBuilder();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'row' && overType === 'row') {
      const sectionId = active.data.current?.sectionId;
      const overSectionId = over.data.current?.sectionId;
      if (sectionId && sectionId === overSectionId) {
        const section = schema.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const oldIndex = section.rows.findIndex((row) => row.id === active.id);
        const newIndex = section.rows.findIndex((row) => row.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderRows(sectionId, oldIndex, newIndex);
        }
      }
    }

    if (activeType === 'field' && overType === 'field') {
      const columnId = active.data.current?.columnId;
      const overColumnId = over.data.current?.columnId;
      if (columnId && columnId === overColumnId) {
        const column = schema.sections
          .flatMap((section) => section.rows)
          .flatMap((row) => row.columns)
          .find((col) => col.id === columnId);
        if (!column) return;
        const oldIndex = column.fields.findIndex((field) => field.id === active.id);
        const newIndex = column.fields.findIndex((field) => field.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderFields(columnId, oldIndex, newIndex);
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Stack gap="md">
        <Card
          withBorder
          padding="md"
          radius="md"
          bg={selection?.type === 'form' ? '#eef2ff' : 'white'}
          style={{ border: selection?.type === 'form' ? '1px solid #228be6' : undefined, cursor: 'pointer' }}
          onClick={() => selectElement({ type: 'form', id: schema.id })}
        >
          <Text fw={700}>{schema.name}</Text>
          <Text size="sm" c="dimmed">
            {schema.description || 'Click to edit form properties.'}
          </Text>
        </Card>
        {schema.sections.map((section) => (
          <SectionEditor key={section.id} section={section} />
        ))}
        {schema.sections.length === 0 && (
          <Card withBorder>
            <Text c="dimmed">No sections yet. Add one from the palette.</Text>
          </Card>
        )}
      </Stack>
    </DndContext>
  );
};
