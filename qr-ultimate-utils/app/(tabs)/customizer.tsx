import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import QRCode from "qrcode";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";

export default function CustomizerScreen() {
  const [qrContent, setQrContent] = useState("");
  const [qrCode, setQrCode] = useState<string>("");
  const [darkColor, setDarkColor] = useState("#9d4edd");
  const [lightColor, setLightColor] = useState("#0a0e27");
  const [selectedPreset, setSelectedPreset] = useState<string>("default");

  const colorPresets = [
    { name: "default", label: "افتراضي", dark: "#9d4edd", light: "#0a0e27" },
    { name: "blue", label: "أزرق", dark: "#3b82f6", light: "#0a0e27" },
    { name: "green", label: "أخضر", dark: "#10b981", light: "#0a0e27" },
    { name: "red", label: "أحمر", dark: "#ef4444", light: "#0a0e27" },
    { name: "orange", label: "برتقالي", dark: "#f97316", light: "#0a0e27" },
  ];

  const generateCustomQR = async () => {
    if (!qrContent) {
      Alert.alert("خطأ", "يرجى إدخال محتوى QR أولاً");
      return;
    }

    try {
      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 2,
        color: { dark: darkColor, light: lightColor },
      });
      setQrCode(qrDataUrl);
      Alert.alert("نجح", "تم إنشاء رمز QR مخصص");
    } catch (error) {
      Alert.alert("خطأ", "فشل في إنشاء رمز QR");
    }
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setSelectedPreset(preset.name);
    setDarkColor(preset.dark);
    setLightColor(preset.light);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          <Text className="text-2xl font-bold text-foreground">تخصيص QR</Text>

          {/* Content Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-muted">محتوى QR</Text>
            <TouchableOpacity className="bg-surface border border-border rounded-lg p-3 active:opacity-80">
              <Text className="text-primary">اختر من السجل أو أدخل محتوى جديد</Text>
            </TouchableOpacity>
          </View>

          {/* Color Presets */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-muted">ألوان مسبقة</Text>
            <View className="flex-row flex-wrap gap-2">
              {colorPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  onPress={() => applyPreset(preset)}
                  className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg items-center ${
                    selectedPreset === preset.name
                      ? "bg-primary border-2 border-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <View className="flex-row gap-1 items-center">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: preset.dark }}
                    />
                    <Text
                      className={
                        selectedPreset === preset.name
                          ? "text-background text-xs font-semibold"
                          : "text-foreground text-xs"
                      }
                    >
                      {preset.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Colors */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-muted">ألوان مخصصة</Text>
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">لون النمط (QR)</Text>
                <TouchableOpacity
                  className="w-12 h-12 rounded-lg border-2 border-border"
                  style={{ backgroundColor: darkColor }}
                >
                  <Text className="text-xs text-center pt-2">{darkColor}</Text>
                </TouchableOpacity>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">لون الخلفية</Text>
                <TouchableOpacity
                  className="w-12 h-12 rounded-lg border-2 border-border"
                  style={{ backgroundColor: lightColor }}
                >
                  <Text className="text-xs text-center pt-2">{lightColor}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={generateCustomQR}
            className="bg-primary py-3 rounded-lg items-center active:opacity-80"
          >
            <Text className="text-background font-semibold">إنشاء QR مخصص</Text>
          </TouchableOpacity>

          {/* QR Preview */}
          {qrCode && (
            <View className="items-center gap-3">
              <Text className="text-sm font-semibold text-muted">معاينة</Text>
              <View className="bg-surface border border-border rounded-lg p-4">
                <Image source={{ uri: qrCode }} style={{ width: 200, height: 200 }} />
              </View>
              <View className="flex-row gap-2 w-full">
                <TouchableOpacity className="flex-1 bg-primary py-2 rounded-lg items-center active:opacity-80">
                  <Text className="text-background font-semibold text-sm">تحميل</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await Sharing.shareAsync(qrCode);
                    } catch (error) {
                      Alert.alert("خطأ", "فشل في المشاركة");
                    }
                  }}
                  className="flex-1 bg-secondary py-2 rounded-lg items-center active:opacity-80"
                >
                  <Text className="text-background font-semibold text-sm">مشاركة</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
