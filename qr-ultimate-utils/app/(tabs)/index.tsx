import { ScrollView, Text, View, TouchableOpacity, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { analyzeQRCode, formatQRData } from "@/lib/qr-analyzer";
import { useQRHistory } from "@/lib/qr-context";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedType, setScannedType] = useState<string>("");
  const { addToHistory } = useQRHistory();

  useEffect(() => {
    if (scannedData) {
      const analysis = analyzeQRCode(scannedData);
      setScannedType(analysis.displayName);
      // Add to history
      addToHistory({
        type: analysis.displayName,
        content: scannedData,
        isFavorite: false,
      });
    }
  }, [scannedData]);

  const handleCopy = async () => {
    if (scannedData) {
      await Clipboard.setStringAsync(scannedData);
      Alert.alert("نجح", "تم نسخ البيانات إلى الحافظة");
    }
  };

  const handleShare = async () => {
    if (scannedData) {
      try {
        await Sharing.shareAsync(scannedData);
      } catch (error) {
        Alert.alert("خطأ", "فشل في المشاركة");
      }
    }
  };

  if (!permission) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-bold text-foreground">مسح رموز QR</Text>
          <Text className="text-muted text-center">يتم طلب إذن الكاميرا...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center gap-4">
          <View className="bg-surface border border-border rounded-lg p-6 items-center gap-3">
            <Text className="text-4xl">📷</Text>
            <Text className="text-foreground font-semibold text-center">إذن الكاميرا مطلوب</Text>
            <Text className="text-muted text-center text-sm">
              يرجى السماح بالوصول إلى الكاميرا لمسح رموز QR
            </Text>
          </View>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-primary px-6 py-3 rounded-lg items-center active:opacity-80"
          >
            <Text className="text-background font-semibold">منح الإذن</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0" edges={["top"]}>
      {scannedData ? (
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-4 p-4">
            <TouchableOpacity
              onPress={() => {
                setScannedData(null);
                setScannedType("");
              }}
              className="flex-row items-center gap-2 mb-2"
            >
              <Text className="text-primary text-lg">←</Text>
              <Text className="text-primary font-semibold">عودة</Text>
            </TouchableOpacity>

            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-muted">نوع البيانات</Text>
                <View className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-background text-xs font-semibold">{scannedType}</Text>
                </View>
              </View>
              <Text className="text-foreground text-base leading-relaxed" selectable>
                {scannedData}
              </Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleCopy}
                className="flex-1 bg-primary py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-background font-semibold">نسخ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                className="flex-1 bg-secondary py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-background font-semibold">مشاركة</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-surface border border-border py-3 rounded-lg items-center active:opacity-80">
                <Text className="text-foreground font-semibold">⭐</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 gap-4 p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold text-foreground">مسح QR</Text>
            <TouchableOpacity
              onPress={() => setTorchOn(!torchOn)}
              className="bg-surface border border-border rounded-lg p-2 active:opacity-80"
            >
              <Text className="text-lg">{torchOn ? "💡" : "🔦"}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 rounded-lg overflow-hidden border border-border">
            <CameraView
              facing="back"
              enableTorch={torchOn}
              onBarcodeScanned={(result: any) => {
                setScannedData(result.data);
              }}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              style={{ flex: 1 }}
            />
          </View>

          <View className="bg-surface border border-border rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-muted">نصائح</Text>
            <Text className="text-foreground text-sm leading-relaxed">
              • وجّه الكاميرا نحو رمز QR{"\n"}• تأكد من الإضاءة الكافية{"\n"}• ابق ثابتاً حتى يتم المسح
            </Text>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
