import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';

type TaskEditorModalProps = {
  isVisible: boolean;
  mode: 'create' | 'edit';
  titleValue: string;
  dueAtValue: Date;
  errorMessage: string | null;
  onChangeTitle: (value: string) => void;
  onChangeDueAt: (value: Date) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function TaskEditorModal({
  isVisible,
  mode,
  titleValue,
  dueAtValue,
  errorMessage,
  onChangeTitle,
  onChangeDueAt,
  onClose,
  onSubmit,
}: TaskEditorModalProps) {
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dueAtValue),
    [dueAtValue]
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(dueAtValue),
    [dueAtValue]
  );

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentMode = pickerMode;
    if (Platform.OS === 'android') {
      setPickerMode(null);
    }
    if (!selectedDate || event.type === 'dismissed' || !currentMode) {
      return;
    }

    const next = new Date(dueAtValue);
    if (currentMode === 'date') {
      next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    } else {
      next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
    }
    onChangeDueAt(next);
  };

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={isVisible}>
      <View className="flex-1 items-center justify-center bg-black/35 px-6">
        <View className="w-full rounded-3xl bg-white px-5 pb-5 pt-4">
          <Text className="text-xl font-bold text-slate-900">
            {mode === 'create' ? 'Ajouter une tache' : 'Modifier la tache'}
          </Text>
          <Text className="mt-1 text-xs text-slate-500">
            Renseigne un titre puis choisis une date et une heure via le calendrier.
          </Text>

          <View className="mt-4">
            <Text className="mb-2 text-sm font-semibold text-slate-700">Titre</Text>
            <TextInput
              autoCapitalize="sentences"
              className="h-12 rounded-xl border border-slate-200 px-4 text-base text-slate-900"
              maxLength={80}
              onChangeText={onChangeTitle}
              placeholder="Ex: Acheter du pain"
              placeholderTextColor="#94a3b8"
              value={titleValue}
            />
          </View>

          <View className="mt-3">
            <Text className="mb-2 text-sm font-semibold text-slate-700">Echeance</Text>
            <View className="flex-row">
              <Pressable
                className="mr-2 flex-1 rounded-xl border border-slate-200 px-4 py-3"
                onPress={() => setPickerMode('date')}>
                <Text className="text-xs text-slate-500">Date</Text>
                <Text className="mt-1 text-sm font-semibold text-slate-800">{formattedDate}</Text>
              </Pressable>
              <Pressable
                className="ml-2 flex-1 rounded-xl border border-slate-200 px-4 py-3"
                onPress={() => setPickerMode('time')}>
                <Text className="text-xs text-slate-500">Heure</Text>
                <Text className="mt-1 text-sm font-semibold text-slate-800">{formattedTime}</Text>
              </Pressable>
            </View>
          </View>

          {pickerMode ? (
            <View className="mt-3 rounded-xl border border-slate-200 px-2 py-1">
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                mode={pickerMode}
                onChange={handlePickerChange}
                value={dueAtValue}
              />
              {Platform.OS === 'ios' ? (
                <Pressable className="items-center pb-1 pt-2" onPress={() => setPickerMode(null)}>
                  <Text className="text-sm font-semibold text-brand-700">Valider la selection</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {errorMessage ? <Text className="mt-2 text-sm text-red-600">{errorMessage}</Text> : null}

          <View className="mt-5 flex-row">
            <Pressable
              className="mr-2 flex-1 items-center justify-center rounded-xl border border-slate-200 py-3"
              onPress={onClose}>
              <Text className="text-base font-semibold text-slate-700">Annuler</Text>
            </Pressable>
            <Pressable
              className="ml-2 flex-1 items-center justify-center rounded-xl bg-brand-500 py-3"
              onPress={onSubmit}>
              <Text className="text-base font-bold text-white">
                {mode === 'create' ? 'Ajouter' : 'Enregistrer'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
