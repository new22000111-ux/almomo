import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          <Text className="text-2xl font-bold text-foreground">الإعدادات</Text>

          {/* Theme Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">المظهر</Text>
            <View className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-foreground font-semibold">الوضع الليلي</Text>
                <Text className="text-muted text-sm">استخدام المظهر الداكن</Text>
              </View>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
          </View>

          {/* Camera Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">الكاميرا</Text>
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <View className="gap-1">
                  <Text className="text-foreground font-semibold">الاهتزاز</Text>
                  <Text className="text-muted text-sm">تنبيهات اهتزاز عند المسح</Text>
                </View>
                <Switch value={vibration} onValueChange={setVibration} />
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row items-center justify-between">
                <View className="gap-1">
                  <Text className="text-foreground font-semibold">الصوت</Text>
                  <Text className="text-muted text-sm">تصوت عند المسح الناجح</Text>
                </View>
                <Switch value={sound} onValueChange={setSound} />
              </View>
            </View>
          </View>

          {/* History Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">السجل</Text>
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <View className="gap-1">
                  <Text className="text-foreground font-semibold">حفظ تلقائي</Text>
                  <Text className="text-muted text-sm">حفظ رموز QR تلقائياً</Text>
                </View>
                <Switch value={autoSave} onValueChange={setAutoSave} />
              </View>
              <View className="h-px bg-border" />
              <TouchableOpacity className="py-2 active:opacity-80">
                <Text className="text-primary font-semibold">مسح السجل</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Data Management */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">إدارة البيانات</Text>
            <View className="bg-surface border border-border rounded-lg p-4 gap-2">
              <TouchableOpacity className="py-3 active:opacity-80">
                <Text className="text-primary font-semibold">تصدير السجل</Text>
              </TouchableOpacity>
              <View className="h-px bg-border" />
              <TouchableOpacity className="py-3 active:opacity-80">
                <Text className="text-primary font-semibold">استيراد السجل</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* About */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">حول التطبيق</Text>
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="flex-row justify-between">
                <Text className="text-muted">الإصدار</Text>
                <Text className="text-foreground font-semibold">1.0.0</Text>
              </View>
              <View className="h-px bg-border" />
              <TouchableOpacity className="py-2 active:opacity-80">
                <Text className="text-primary font-semibold">سياسة الخصوصية</Text>
              </TouchableOpacity>
              <View className="h-px bg-border" />
              <TouchableOpacity className="py-2 active:opacity-80">
                <Text className="text-primary font-semibold">شروط الخدمة</Text>
              </TouchableOpacity>
              <View className="h-px bg-border" />
              <TouchableOpacity className="py-2 active:opacity-80">
                <Text className="text-primary font-semibold">تقديم ملاحظات</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
