import "../global.css";
import { Text, View, StatusBar, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";


export default function Detail_Rute() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { width } = useWindowDimensions();
  const isWide = width >= 768; // md breakpoint
  const locations = [
    {
      code: "A",
      name: "Kantor Pos Cabang Utama Cirebon (Titik Awal)",
      distance: "0 (titik awal)",
      duration: "0",
      lat: -6.717536968419976,
      lon: 108.57236909901103,
    },
    {
      code: "B",
      name: "KCP Pos Palimanan",
      distance: "16,8 KM",
      duration: "29 menit",
      lat: -6.708013117842422,
      lon: 108.43293809413487,
    },
    {
      code: "C",
      name: "KCP Pos Plered",
      distance: "8,4 KM",
      duration: "18 menit",
      lat: -6.707377394653071,
      lon: 108.50652054016354,
    },
    {
      code: "D",
      name: "KCP Pos Plumbon",
      distance: "12,0 KM",
      duration: "23 menit",
      lat: -6.707260185199267,
      lon: 108.50648835365638,
    },
    {
      code: "E",
      name: "KCP Pos Kapetakan",
      distance: "9,8 KM",
      duration: "16 menit",
      lat: -6.701733827266138,
      lon: 108.47273829413469,
    },
    {
      code: "F",
      name: "KCP Pos Sumber",
      distance: "12,5 KM",
      duration: "25 menit",
      lat: -6.648239194442055,
      lon: 108.53224954141758,
    },
    {
      code: "G",
      name: "KCP Pos Arjawinangun",
      distance: "24,5 KM",
      duration: "40 menit",
      lat: -6.758706328871375,
      lon: 108.47948508844247,
    },
    {
      code: "H",
      name: "KCP Pos Indonesia Kesambi",
      distance: "5,7 KM",
      duration: "15 menit",
      lat: -6.6474979431297845,
      lon: 108.40711799575655,
    },
    {
      code: "I",
      name: "KCP Pos Karanggetas",
      distance: "1,5 KM",
      duration: "4 menit",
      lat: -6.735204590531749,
      lon: 108.535001421121,
    },
    {
      code: "J",
      name: "KCP Pos Cirebon Selatan",
      distance: "6,1 KM",
      duration: "11 menit",
      lat: -6.715880396319488,
      lon: 108.56325908249215,
    },
    {
      code: "K",
      name: "KCP Pos Ciledug",
      distance: "35,4 KM",
      duration: "40 menit",
      lat: -6.745342665376114,
      lon: 108.56059801366833,
    },
    {
      code: "L",
      name: "KCP Pos Babakan",
      distance: "28,9 KM",
      duration: "42 menit",
      lat: -6.905934103823299,
      lon: 108.73991994374944,
    },
    {
      code: "M",
      name: "KCP Pos Pabedilan",
      distance: "28,6 KM",
      duration: "37 menit",
      lat: -6.876575992090446,
      lon: 108.72226005550668,
    },
    {
      code: "N",
      name: "KCP Pos Losari",
      distance: "31,5 KM",
      duration: "39 menit",
      lat: -6.849198440724173,
      lon: 108.75808743787108,
    },
    {
      code: "O",
      name: "KCP Pos Dukupuntang",
      distance: "20,5 KM",
      duration: "38 menit",
      lat: -6.846968485198199,
      lon: 108.82651733789261,
    },
    {
      code: "P",
      name: "KCP Pos Aja Drop Point",
      distance: "23,0 KM",
      duration: "39 menit",
      lat: -6.768032295888456,
      lon: 108.41664725833272,
    },
    {
      code: "Q",
      name: "Kantor Pos Siliwangi",
      distance: "4,2 KM",
      duration: "9 menit",
      lat: -6.768032295888456,
      lon: 108.41664725833272,
    },
  ];

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
            <Text className="text-base text-gray-700">🔙</Text>
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
          {/* Algorithm selection buttons */}
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity className="flex-1 bg-green-500 py-3 px-4 rounded-lg">
              <Text className="text-white text-center font-medium">Rute Algoritma Genetika</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-500 py-3 px-4 rounded-lg">
              <Text className="text-white text-center font-medium">Rute Nearest Neighbor</Text>
            </TouchableOpacity>
          </View>

          {/* Destination heading with location pin */}
          <View className="items-center mb-4">
            <Text className="text-xl font-bold text-black mb-2">Kantor Pos Cirebon</Text>
            <View className="w-6 h-6 bg-black rounded-full items-center justify-center">
              <Text className="text-white text-xs">📍</Text>
            </View>
          </View>

          {/* Distance comparison results */}
          <View className="space-y-3 mb-4">
            <View className="flex-col justify-start items-start">
              <Text className="text-base text-black">Algoritma Genetika</Text>
              <View className="flex-row justify-between w-full">
                <Text className="text-base text-black font-medium">Total Jarak</Text>
                <Text className="text-base text-black font-medium">77.2 km</Text>
              </View>
              <Text className="text-base text-black font-medium">
                A → C → F → H → K → M → N → P → Q → O → L → J → G → D → B → E → I → A
              </Text>
            </View>
            <View className="flex-col justify-start items-start">
              <Text className="text-base text-black">Nearest Neighbor</Text>
              <View className="flex-row justify-between w-full">
                <Text className="text-base text-black font-medium">Total Jarak</Text>
                <Text className="text-base text-black font-medium">81.0 km</Text>
              </View>
              <Text className="text-base text-black font-medium">
                A → B → D → G → J → L → O → Q → P → N → M → K → H → F → C → E → I → A
              </Text>
            </View>
          </View>

          {/* Conclusion statement */}
          <Text className="text-base text-black text-center">
            Rute AG lebih optimal dengan selisih 3.8 km lebih pendek.
          </Text>
        </View>

        {/* Locations table (responsive) */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-900">Daftar Lokasi</Text>
            <Text className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{locations.length} lokasi</Text>
          </View>

          {isWide ? (
            <View className="border border-gray-200 rounded-lg overflow-hidden">
              <View className="flex-row bg-gray-50 border-b border-gray-200">
                <Text className="w-16 px-3 py-2 text-xs font-semibold text-gray-700">Kode</Text>
                <Text className="flex-1 px-3 py-2 text-xs font-semibold text-gray-700">Nama Lokasi</Text>
                <Text className="w-28 px-3 py-2 text-xs font-semibold text-gray-700">Jarak</Text>
                <Text className="w-32 px-3 py-2 text-xs font-semibold text-gray-700">Waktu Tempuh</Text>
                <Text className="w-36 px-3 py-2 text-xs font-semibold text-gray-700">LAT</Text>
                <Text className="w-36 px-3 py-2 text-xs font-semibold text-gray-700">LOT</Text>
              </View>
              {locations.map((loc, index) => (
                <View
                  key={loc.code}
                  className={`flex-row border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <Text className="w-16 px-3 py-2 text-xs text-gray-800">{loc.code}</Text>
                  <Text className="flex-1 px-3 py-2 text-xs text-gray-800">{loc.name}</Text>
                  <Text className="w-28 px-3 py-2 text-[11px] text-gray-700">{loc.distance}</Text>
                  <Text className="w-32 px-3 py-2 text-[11px] text-gray-700">{loc.duration}</Text>
                  <Text className="w-36 px-3 py-2 text-[11px] text-gray-700">{loc.lat}</Text>
                  <Text className="w-36 px-3 py-2 text-[11px] text-gray-700">{loc.lon}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="gap-3">
              {locations.map((loc) => (
                <View key={loc.code} className="border border-gray-200 rounded-xl p-3 bg-white shadow-xs">
                  <View className="flex-row items-center mb-1">
                    <Text className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px] font-semibold mr-2">
                      {loc.code}
                    </Text>
                    <Text className="flex-1 text-sm font-medium text-gray-900">{loc.name}</Text>
                  </View>
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-[11px] text-gray-600">Jarak: <Text className="text-gray-800">{loc.distance}</Text></Text>
                    <Text className="text-[11px] text-gray-600">•</Text>
                    <Text className="text-[11px] text-gray-600">Waktu: <Text className="text-gray-800">{loc.duration}</Text></Text>
                  </View>
                  <Text className="text-[11px] text-gray-600">LAT: <Text className="text-gray-800">{loc.lat}</Text>   LOT: <Text className="text-gray-800">{loc.lon}</Text></Text>
                </View>
              ))}
            </View>
          )}
        </View>

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