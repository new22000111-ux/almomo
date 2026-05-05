import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import { useQRHistory } from "@/lib/qr-context";

export default function HistoryScreen() {
  const { history, removeFromHistory, toggleFavorite } = useQRHistory();
  const [searchText, setSearchText] = useState("");

  const filteredHistory = history.filter((item) =>
    item.content.toLowerCase().includes(searchText.toLowerCase()) ||
    item.type.toLowerCase().includes(searchText.toLowerCase())
  );

  const emptyHistory = history.length === 0;

  return (
    <ScreenContainer className="p-4">
      <View className="gap-4 flex-1">
        <Text className="text-2xl font-bold text-foreground">السجل</Text>

        {!emptyHistory && (
          <TextInput
            placeholder="ابحث عن رموز QR..."
            placeholderTextColor="#9ba1a6"
            value={searchText}
            onChangeText={setSearchText}
            className="bg-surface border border-border rounded-lg p-3 text-foreground"
          />
        )}

        {emptyHistory ? (
          <View className="flex-1 items-center justify-center gap-4">
            <View className="bg-surface border border-border rounded-lg p-8 items-center gap-3">
              <Text className="text-4xl">📋</Text>
              <Text className="text-foreground font-semibold text-center">لا توجد رموز QR محفوظة</Text>
              <Text className="text-muted text-center text-sm">
                سيظهر هنا كل رموز QR التي تقوم بمسحها أو إنشاؤها
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-3 flex-1">
            <Text className="text-sm font-semibold text-muted">
              {filteredHistory.length} من {history.length} رمز QR
            </Text>
            <FlatList
              data={filteredHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onLongPress={() => {
                    Alert.alert("خيارات", "", [
                      {
                        text: item.isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة",
                        onPress: () => toggleFavorite(item.id),
                      },
                      {
                        text: "نسخ",
                        onPress: async () => {
                          const Clipboard = require("expo-clipboard");
                          await Clipboard.setStringAsync(item.content);
                          Alert.alert("نجح", "تم نسخ البيانات");
                        },
                      },
                      {
                        text: "حذف",
                        onPress: () => removeFromHistory(item.id),
                        style: "destructive",
                      },
                      { text: "إلغاء", style: "cancel" },
                    ]);
                  }}
                  className="bg-surface border border-border rounded-lg p-3 mb-2 active:opacity-80"
                >
                  <View className="flex-row gap-3">
                    <View
                      className={`w-12 h-12 rounded-lg items-center justify-center ${
                        item.isFavorite ? "bg-primary" : "bg-surface border border-border"
                      }`}
                    >
                      <Text className="text-lg">{item.isFavorite ? "⭐" : "📄"}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold text-sm">{item.type}</Text>
                      <Text className="text-muted text-xs mt-1" numberOfLines={1}>
                        {item.content}
                      </Text>
                      <Text className="text-muted text-xs mt-1">
                        {item.date} - {item.timestamp}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
