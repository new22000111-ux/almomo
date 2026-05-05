import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";

export default function EditorScreen() {
  const [hasScannedQR, setHasScannedQR] = useState(false);
  const [editContent, setEditContent] = useState("");

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          <Text className="text-2xl font-bold text-foreground">تعديل رمز QR</Text>

          {!hasScannedQR ? (
            <View className="flex-1 items-center justify-center gap-4">
              <View className="bg-surface border border-border rounded-lg p-8 items-center gap-3">
                <Text className="text-4xl">📱</Text>
                <Text className="text-foreground font-semibold text-center">لم يتم مسح أي رمز QR</Text>
                <Text className="text-muted text-center text-sm">
                  يرجى مسح رمز QR أولاً من تبويب "مسح" ثم عودة هنا لتعديله
                </Text>
              </View>

              <TouchableOpacity className="bg-primary px-6 py-3 rounded-lg items-center active:opacity-80">
                <Text className="text-background font-semibold">الذهاب إلى المسح</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-4">
              <View className="bg-surface border border-border rounded-lg p-4">
                <Text className="text-sm font-semibold text-muted mb-2">المحتوى الحالي</Text>
                <TextInput
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline
                  numberOfLines={4}
                  className="bg-background border border-border rounded-lg p-3 text-foreground"
                  placeholderTextColor="#9ba1a6"
                />
              </View>

              <TouchableOpacity className="bg-primary py-3 rounded-lg items-center active:opacity-80">
                <Text className="text-background font-semibold">إنشاء رمز QR محدث</Text>
              </TouchableOpacity>

              <View className="flex-row gap-2">
                <TouchableOpacity className="flex-1 bg-secondary py-2 rounded-lg items-center active:opacity-80">
                  <Text className="text-background font-semibold">حفظ</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-surface border border-border py-2 rounded-lg items-center active:opacity-80">
                  <Text className="text-foreground font-semibold">مشاركة</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
