import { Modal, Pressable, Text, TextInput, View } from 'react-native';

type TaskEditorModalProps = {
  isVisible: boolean;
  mode: 'create' | 'edit';
  titleValue: string;
  dueLabelValue: string;
  errorMessage: string | null;
  onChangeTitle: (value: string) => void;
  onChangeDueLabel: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function TaskEditorModal({
  isVisible,
  mode,
  titleValue,
  dueLabelValue,
  errorMessage,
  onChangeTitle,
  onChangeDueLabel,
  onClose,
  onSubmit,
}: TaskEditorModalProps) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={isVisible}>
      <View className="flex-1 items-center justify-center bg-black/35 px-6">
        <View className="w-full rounded-3xl bg-white px-5 pb-5 pt-4">
          <Text className="text-xl font-bold text-slate-900">
            {mode === 'create' ? 'Ajouter une tache' : 'Modifier la tache'}
          </Text>
          <Text className="mt-1 text-xs text-slate-500">
            Renseigne un titre clair et une heure/etiquette de rappel.
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
            <Text className="mb-2 text-sm font-semibold text-slate-700">Heure / Label</Text>
            <TextInput
              autoCapitalize="sentences"
              className="h-12 rounded-xl border border-slate-200 px-4 text-base text-slate-900"
              maxLength={24}
              onChangeText={onChangeDueLabel}
              placeholder="Ex: 18h00 ou Aujourd'hui"
              placeholderTextColor="#94a3b8"
              value={dueLabelValue}
            />
          </View>

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
