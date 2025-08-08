import "../global.css";
import { Text, View, Pressable, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker as MapMarker, Polyline, Region } from "react-native-maps";
import { useRef, useState, useCallback } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RoutePoint = { label: string; latitude: number; longitude: number };


const ROUTE_POINTS: RoutePoint[] = [
  { label: "A", latitude: -6.717536968419976, longitude: 108.57236909901103 },
  { label: "B", latitude: -6.708013117842422, longitude: 108.43293809413487 },
  { label: "C", latitude: -6.707377394653071, longitude: 108.50652054016354 },
  { label: "D", latitude: -6.707260185199267, longitude: 108.50648835365638 },
  { label: "E", latitude: -6.701733827266138, longitude: 108.47273829413469 },
  { label: "F", latitude: -6.648239194442055, longitude: 108.53224954141758 },
  { label: "G", latitude: -6.758706328871375, longitude: 108.47948508844247 },
  { label: "H", latitude: -6.6474979431297845, longitude: 108.40711799575655 },
  { label: "I", latitude: -6.735204590531749, longitude: 108.535001421121 },
  { label: "J", latitude: -6.715880396319488, longitude: 108.56325908249215 },
  { label: "K", latitude: -6.745342665376114, longitude: 108.56059801366833 },
  { label: "L", latitude: -6.905934103823299, longitude: 108.73991994374944 },
  { label: "M", latitude: -6.876575992090446, longitude: 108.72226005550668 },
  { label: "N", latitude: -6.849198440724173, longitude: 108.75808743787108 },
  { label: "O", latitude: -6.846968485198199, longitude: 108.82651733789261 },
  { label: "P", latitude: -6.768032295888456, longitude: 108.41664725833272 },
  { label: "Q", latitude: -6.768032295888456, longitude: 108.41664725833272 },
];

const INITIAL_REGION = {
  latitude: -6.717536968419976,
  longitude: 108.57236909901103,
  latitudeDelta: 1.0,
  longitudeDelta: 1.0
};

function LabeledMarker({ label, latitude, longitude }: RoutePoint) {
  return (
    <MapMarker coordinate={{ latitude, longitude }} anchor={{ x: 0.5, y: 0.5 }}>
      <View
        className="items-center justify-center rounded-full border-2"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "#F37021",
          borderColor: "#ffffff"
        }}
      >
        <Text className="text-white font-bold text-[13px]">{label}</Text>
      </View>
    </MapMarker>
  );
}

export default function Maps() {
  // If you have a RootStackParamList, use it here for type safety
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const navigation = useNavigation<NavigationProp<any>>();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);

  const MIN_DELTA = 0.005;
  const MAX_DELTA = 100;

  const animateTo = useCallback((nextRegion: Region) => {
    mapRef.current?.animateToRegion(nextRegion, 200);
    setRegion(nextRegion);
  }, []);

  const handleZoomIn = useCallback(() => {
    const newLatDelta = Math.max(region.latitudeDelta * 0.5, MIN_DELTA);
    const newLongDelta = Math.max(region.longitudeDelta * 0.5, MIN_DELTA);
    animateTo({ ...region, latitudeDelta: newLatDelta, longitudeDelta: newLongDelta });
  }, [region, animateTo]);

  const handleZoomOut = useCallback(() => {
    const newLatDelta = Math.min(region.latitudeDelta * 2, MAX_DELTA);
    const newLongDelta = Math.min(region.longitudeDelta * 2, MAX_DELTA);
    animateTo({ ...region, latitudeDelta: newLatDelta, longitudeDelta: newLongDelta });
  }, [region, animateTo]);

  return (
    <SafeAreaView className="flex-1 ]">
      <StatusBar barStyle="light-content" backgroundColor="#F37021" />
      {/* Header */}
      <View className="bg-[#F37021] px-5 py-3 flex-row items-center justify-between">
        
        <Text className="text-white font-extrabold text-[24px]">
          Optimasi Rute Distribusi
        </Text>
        <View className="w-7 h-7 rounded-full border border-white items-center justify-center">
          <Text className="text-white text-[16px] font-semibold">i</Text>
        </View>
      </View>

      {/* Title band */}
  

      {/* Map canvas */}
      <View className="relative flex-1 ">
        <MapView
          ref={mapRef}
          style={{ flex: 1, height: '100%' }}
          region={region}
          onRegionChangeComplete={setRegion}
          zoomEnabled
          zoomControlEnabled
        >
          <Polyline
            coordinates={ROUTE_POINTS.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude
            }))}
            strokeColor="#1E5EF3"
            strokeWidth={5}
          />

          {ROUTE_POINTS.map((p, idx) => (
            <LabeledMarker key={`${p.label}-${idx}`} {...p} />
          ))}
        </MapView>

        {/* Zoom controls */}
        <View style={{ position: "absolute", right: 12, bottom: 140 }}>
          <View
            className="rounded-xl bg-white overflow-hidden"
            style={{ elevation: 6, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}
          >
            <TouchableOpacity onPress={handleZoomIn} className="w-12 h-12 items-center justify-center border-b border-neutral-200">
              <Text className="text-2xl">+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomOut} className="w-12 h-12 items-center justify-center">
              <Text className="text-2xl">−</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Info card (outside map) */}
      <View
        className="mx-4 my-2 rounded-2xl bg-white px-5 py-4"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6
        }}
      >

        <TouchableOpacity 
        className="mt-3 rounded-lg bg-neutral-100 py-3 items-center"
        onPress={() => {
            navigation.navigate("Detail_Rute" as never);
          }}
        >
          <Text className="text-[16px] text-neutral-800 font-semibold">
            Lihat Detail Rute
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom tab bar */}
      <View className="flex-row items-center justify-around border-t border-neutral-200 py-2 bg-white">
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            navigation.navigate("Login" as never);
          }}
        >
          <Text className="text-[22px]">ⓘ</Text>
          <Text className="text-neutral-500 text-xs mt-0.5">Back</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-[22px] text-[#1E5EF3]">⬤</Text>
          <Text className="text-[#1E5EF3] text-xs mt-0.5">Maps</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}