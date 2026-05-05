import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import QRCode from "qrcode";
import { Image } from "expo-image";
import { useQRHistory } from "@/lib/qr-context";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";

type QRType = "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";

function getQRTypeLabel(type: QRType): string {
  const labels: Record<QRType, string> = {
    url: "رابط",
    text: "نص",
    wifi: "WiFi",
    vcard: "جهة اتصال",
    email: "بريد إلكتروني",
    phone: "رقم هاتف",
    sms: "رسالة نصية",
  };
  return labels[type];
}

export default function CreatorScreen() {
  const [qrType, setQrType] = useState<QRType>("url");
  const [qrCode, setQrCode] = useState<string>("");
  const { addToHistory } = useQRHistory();
  const [formData, setFormData] = useState({
    url: "",
    text: "",
    wifiSsid: "",
    wifiPassword: "",
    wifiSecurity: "WPA",
    vCardName: "",
    vCardPhone: "",
    vCardEmail: "",
    emailTo: "",
    emailSubject: "",
    emailBody: "",
    phoneNumber: "",
    smsNumber: "",
    smsMessage: "",
  });

  const generateQR = async () => {
    try {
      let qrContent = "";

      switch (qrType) {
        case "url":
          if (!formData.url) {
            Alert.alert("خطأ", "يرجى إدخال رابط URL");
            return;
          }
          qrContent = formData.url;
          break;
        case "text":
          if (!formData.text) {
            Alert.alert("خطأ", "يرجى إدخال النص");
            return;
          }
          qrContent = formData.text;
          break;
        case "wifi":
          if (!formData.wifiSsid) {
            Alert.alert("خطأ", "يرجى إدخال اسم الشبكة");
            return;
          }
          qrContent = `WIFI:T:${formData.wifiSecurity};S:${formData.wifiSsid};P:${formData.wifiPassword};;`;
          break;
        case "email":
          if (!formData.emailTo) {
            Alert.alert("خطأ", "يرجى إدخال البريد الإلكتروني");
            return;
          }
          qrContent = `mailto:${formData.emailTo}?subject=${formData.emailSubject}&body=${formData.emailBody}`;
          break;
        case "phone":
          if (!formData.phoneNumber) {
            Alert.alert("خطأ", "يرجى إدخال رقم الهاتف");
            return;
          }
          qrContent = `tel:${formData.phoneNumber}`;
          break;
        case "sms":
          if (!formData.smsNumber) {
            Alert.alert("خطأ", "يرجى إدخال رقم الهاتف");
            return;
          }
          qrContent = `smsto:${formData.smsNumber}:${formData.smsMessage}`;
          break;
        case "vcard":
          if (!formData.vCardName) {
            Alert.alert("خطأ", "يرجى إدخال الاسم");
            return;
          }
          qrContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.vCardName}\nTEL:${formData.vCardPhone}\nEMAIL:${formData.vCardEmail}\nEND:VCARD`;
          break;
      }

      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 2,
        color: { dark: "#9d4edd", light: "#0a0e27" },
      });
      setQrCode(qrDataUrl);
      // Auto-save to history
      addToHistory({
        type: getQRTypeLabel(qrType),
        content: qrContent,
        isFavorite: false,
      });
    } catch (error) {
      Alert.alert("خطأ", "فشل في إنشاء رمز QR");
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          <Text className="text-2xl font-bold text-foreground">إنشاء رمز QR</Text>

          {/* Type Selector */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-muted">نوع البيانات</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {(["url", "text", "wifi", "vcard", "email", "phone", "sms"] as QRType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setQrType(type);
                    setQrCode("");
                  }}
                  className={`px-4 py-2 rounded-full ${
                    qrType === type ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text className={qrType === type ? "text-background font-semibold" : "text-foreground"}>
                    {type === "url" && "رابط"}
                    {type === "text" && "نص"}
                    {type === "wifi" && "WiFi"}
                    {type === "vcard" && "جهة اتصال"}
                    {type === "email" && "بريد"}
                    {type === "phone" && "هاتف"}
                    {type === "sms" && "رسالة"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Dynamic Form */}
          <View className="gap-3">
            {qrType === "url" && (
              <TextInput
                placeholder="أدخل رابط URL"
                placeholderTextColor="#9ba1a6"
                value={formData.url}
                onChangeText={(text) => setFormData({ ...formData, url: text })}
                className="bg-surface border border-border rounded-lg p-3 text-foreground"
              />
            )}
            {qrType === "text" && (
              <TextInput
                placeholder="أدخل النص"
                placeholderTextColor="#9ba1a6"
                value={formData.text}
                onChangeText={(text) => setFormData({ ...formData, text })}
                multiline
                numberOfLines={4}
                className="bg-surface border border-border rounded-lg p-3 text-foreground"
              />
            )}
            {qrType === "wifi" && (
              <>
                <TextInput
                  placeholder="اسم الشبكة (SSID)"
                  placeholderTextColor="#9ba1a6"
                  value={formData.wifiSsid}
                  onChangeText={(text) => setFormData({ ...formData, wifiSsid: text })}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
                <TextInput
                  placeholder="كلمة المرور"
                  placeholderTextColor="#9ba1a6"
                  value={formData.wifiPassword}
                  onChangeText={(text) => setFormData({ ...formData, wifiPassword: text })}
                  secureTextEntry
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
              </>
            )}
            {qrType === "email" && (
              <>
                <TextInput
                  placeholder="البريد الإلكتروني"
                  placeholderTextColor="#9ba1a6"
                  value={formData.emailTo}
                  onChangeText={(text) => setFormData({ ...formData, emailTo: text })}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
                <TextInput
                  placeholder="الموضوع"
                  placeholderTextColor="#9ba1a6"
                  value={formData.emailSubject}
                  onChangeText={(text) => setFormData({ ...formData, emailSubject: text })}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
                <TextInput
                  placeholder="الرسالة"
                  placeholderTextColor="#9ba1a6"
                  value={formData.emailBody}
                  onChangeText={(text) => setFormData({ ...formData, emailBody: text })}
                  multiline
                  numberOfLines={3}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
              </>
            )}
            {qrType === "phone" && (
              <TextInput
                placeholder="رقم الهاتف"
                placeholderTextColor="#9ba1a6"
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                keyboardType="phone-pad"
                className="bg-surface border border-border rounded-lg p-3 text-foreground"
              />
            )}
            {qrType === "sms" && (
              <>
                <TextInput
                  placeholder="رقم الهاتف"
                  placeholderTextColor="#9ba1a6"
                  value={formData.smsNumber}
                  onChangeText={(text) => setFormData({ ...formData, smsNumber: text })}
                  keyboardType="phone-pad"
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
                <TextInput
                  placeholder="نص الرسالة"
                  placeholderTextColor="#9ba1a6"
                  value={formData.smsMessage}
                  onChangeText={(text) => setFormData({ ...formData, smsMessage: text })}
                  multiline
                  numberOfLines={3}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
              </>
            )}
            {qrType === "vcard" && (
              <>
                <TextInput
                  placeholder="الاسم"
                  placeholderTextColor="#9ba1a6"
                  value={formData.vCardName}
                  onChangeText={(text) => setFormData({ ...formData, vCardName: text })}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
                <TextInput
                  placeholder="رقم الهاتف"
                  placeholderTextColor="#9ba1a6"
                  value={formData.vCardPhone}
                  onChangeText={(text) => setFormData({ ...formData, vCardPhone: text })}
                  keyboardType="phone-pad"
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
                <TextInput
                  placeholder="البريد الإلكتروني"
                  placeholderTextColor="#9ba1a6"
                  value={formData.vCardEmail}
                  onChangeText={(text) => setFormData({ ...formData, vCardEmail: text })}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
              </>
            )}
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={generateQR}
            className="bg-primary py-3 rounded-lg items-center active:opacity-80"
          >
            <Text className="text-background font-semibold text-base">إنشاء رمز QR</Text>
          </TouchableOpacity>

          {/* QR Preview */}
          {qrCode && (
            <View className="items-center gap-3">
              <Text className="text-sm font-semibold text-muted">معاينة رمز QR</Text>
              <View className="bg-surface border border-border rounded-lg p-4">
                <Image source={{ uri: qrCode }} style={{ width: 200, height: 200 }} />
              </View>
              <View className="flex-row gap-2 w-full">
                <TouchableOpacity
                  onPress={async () => {
                    if (qrCode) {
                      await Clipboard.setStringAsync(qrCode);
                      Alert.alert("نجح", "تم نسخ رمز QR");
                    }
                  }}
                  className="flex-1 bg-primary py-2 rounded-lg items-center active:opacity-80"
                >
                  <Text className="text-background font-semibold">نسخ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (qrCode) {
                      try {
                        await Sharing.shareAsync(qrCode);
                      } catch (error) {
                        Alert.alert("خطأ", "فشل في المشاركة");
                      }
                    }
                  }}
                  className="flex-1 bg-secondary py-2 rounded-lg items-center active:opacity-80"
                >
                  <Text className="text-background font-semibold">مشاركة</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
