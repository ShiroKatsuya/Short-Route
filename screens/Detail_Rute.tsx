import "../global.css";
import { Text, View, StatusBar, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";


export default function Detail_Rute() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 pt-2 pb-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back to map"
            onPress={() => navigation.navigate("Maps")}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            {/* <Text className="text-xl text-gray-700">←</Text> */}
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-semibold text-gray-900">Detail Rute</Text>
            <Text className="text-xs text-gray-500">Genetic Algorithm vs Nearest Neighbor</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Summary card */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-base text-gray-800 leading-6">
            Dari 4 kelompok uji, Algoritma Genetika (AG) menang di 2 kelompok (A–E & K–O), Nearest Neighbor (NN)
            menang di 1 kelompok (F–J), dan 1 kelompok (P–Q) hasilnya sama.
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-3">
            AG lebih unggul ketika jumlah lokasi lebih banyak atau kompleks karena mampu menjelajahi lebih banyak kemungkinan
            rute. 
            
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-3">
            NN cenderung lebih cepat, tetapi tidak selalu menghasilkan rute terpendek.
          </Text>

          <View className="flex-row flex-wrap gap-2 mt-4">
            <View className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <Text className="text-emerald-700 text-xs font-medium">AG menang: 2 kelompok</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
              <Text className="text-indigo-700 text-xs font-medium">NN menang: 1 kelompok</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
              <Text className="text-amber-700 text-xs font-medium">Seri: 1 kelompok</Text>
            </View>
          </View>
        </View>

        {/* Key takeaways */}
        {/* <View className="mt-4 bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Ringkasan utama</Text>
          <View className="gap-2">
            <Text className="text-gray-700 text-sm">AG menjelajahi lebih banyak kemungkinan, cocok untuk dataset kompleks.</Text>
            <Text className="text-gray-700 text-sm">NN lebih cepat, namun bisa menghasilkan rute yang kurang optimal.</Text>
          </View>
        </View> */}

        {/* Back CTA */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Maps")}
          className="mt-6 bg-blue-600 rounded-xl h-12 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Back to map"
        >
          <Text className="text-white font-semibold">Kembali ke Peta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}