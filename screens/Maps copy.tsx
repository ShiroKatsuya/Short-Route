import "../global.css";
import { Text, View, Pressable, StatusBar, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker as MapMarker, Polyline } from "react-native-maps";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { assignAlphabetLabels, formatHhMmFromDistance, optimizeRouteGenetic, type LatLng } from "../utils/geneticTSP";

type RoutePoint = { label: string; latitude: number; longitude: number };

const DEFAULT_REGION = {
  latitude: -6.95,
  longitude: 109.1,
  latitudeDelta: 4.0,
  longitudeDelta: 4.0,
};

const CITY_DB: Record<string, LatLng> = {
  // Keep a few big cities so the default demo values still work
  jakarta: { latitude: -6.2088, longitude: 106.8456, name: "Jakarta" },
  surabaya: { latitude: -7.2458, longitude: 112.7378, name: "Surabaya" },
  bandung: { latitude: -6.9175, longitude: 107.6191, name: "Bandung" },
  semarang: { latitude: -6.9932, longitude: 110.4203, name: "Semarang" },
  yogyakarta: { latitude: -7.7972, longitude: 110.3688, name: "Yogyakarta" },

  // Cirebon area (post offices and related points)
  cirebon: { latitude: -6.732, longitude: 108.5523, name: "Cirebon" },
  "kantor pos cabang utama cirebon": {
    latitude: -6.7069,
    longitude: 108.558,
    name: "Kantor Pos Cabang Utama Cirebon",
  },
  "kcp pos palimanan": { latitude: -6.7117, longitude: 108.4665, name: "KCP Pos Palimanan" },
  "kcp pos plered": { latitude: -6.737, longitude: 108.472, name: "KCP Pos Plered" },
  "kcp pos plumbon": { latitude: -6.725, longitude: 108.5125, name: "KCP Pos Plumbon" },
  "kcp pos kapetakan": { latitude: -6.67, longitude: 108.499, name: "KCP Pos Kapetakan" },
  "kcp pos sumber": { latitude: -6.745, longitude: 108.474, name: "KCP Pos Sumber" },
  "kcp pos arjawinangun": { latitude: -6.65, longitude: 108.415, name: "KCP Pos Arjawinangun" },
  "kcp pos indonesia kesambi": { latitude: -6.723, longitude: 108.539, name: "KCP Pos Indonesia Kesambi" },
  "kcp pos karanggetas": { latitude: -6.7255, longitude: 108.566, name: "KCP Pos Karanggetas" },
  "kcp pos cirebon selatan": { latitude: -6.76, longitude: 108.561, name: "KCP Pos Cirebon Selatan" },
  "kcp pos ciledug": { latitude: -6.915, longitude: 108.722, name: "KCP Pos Ciledug" },
  "kcp pos babakan": { latitude: -6.884, longitude: 108.656, name: "KCP Pos Babakan" },
  "kcp pos pabedilan": { latitude: -6.843, longitude: 108.732, name: "KCP Pos Pabedilan" },
  "kcp pos losari": { latitude: -6.823, longitude: 108.807, name: "KCP Pos Losari" },
  "kcp pos dukupuntang": { latitude: -6.717, longitude: 108.39, name: "KCP Pos Dukupuntang" },
  "kcp pos aja drop point": { latitude: -6.735, longitude: 108.55, name: "KCP Pos Aja Drop Point" },
  "kantor pos siliwangi": { latitude: -6.7068, longitude: 108.5572, name: "Kantor Pos Siliwangi" },
};

function geocodeCity(name: string): LatLng | undefined {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  return CITY_DB[key];
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function generateWaypointsBetween(a: LatLng, b: LatLng, count: number): LatLng[] {
  // Generate waypoints around the corridor from a to b with slight random offsets
  const latMin = Math.min(a.latitude, b.latitude);
  const latMax = Math.max(a.latitude, b.latitude);
  const lonMin = Math.min(a.longitude, b.longitude);
  const lonMax = Math.max(a.longitude, b.longitude);

  const latSpan = Math.max(0.05, (latMax - latMin));
  const lonSpan = Math.max(0.05, (lonMax - lonMin));

  const waypoints: LatLng[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    const baseLat = a.latitude + t * (b.latitude - a.latitude);
    const baseLon = a.longitude + t * (b.longitude - a.longitude);
    // Add small random offset to make it realistic
    const offsetLat = (Math.random() - 0.5) * latSpan * 0.4;
    const offsetLon = (Math.random() - 0.5) * lonSpan * 0.4;
    waypoints.push({ latitude: baseLat + offsetLat, longitude: baseLon + offsetLon });
  }
  return waypoints;
}

function computeRegionForPoints(points: LatLng[] | undefined) {
  if (!points || points.length === 0) return DEFAULT_REGION;
  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLon = points[0].longitude;
  let maxLon = points[0].longitude;
  for (const p of points) {
    minLat = Math.min(minLat, p.latitude);
    maxLat = Math.max(maxLat, p.latitude);
    minLon = Math.min(minLon, p.longitude);
    maxLon = Math.max(maxLon, p.longitude);
  }
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLon + maxLon) / 2;
  const pad = 0.3;
  const latitudeDelta = Math.max((maxLat - minLat) * 1.6 + pad, 0.5);
  const longitudeDelta = Math.max((maxLon - minLon) * 1.6 + pad, 0.5);
  return { latitude, longitude, latitudeDelta, longitudeDelta };
}

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
  const [originName, setOriginName] = useState<string>("Jakarta");
  const [destinationName, setDestinationName] = useState<string>("Surabaya");
  const [numStops, setNumStops] = useState<number>(8);
  const [isClosedLoop, setIsClosedLoop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [routePoints, setRoutePoints] = useState<RoutePoint[] | null>(null);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number>(0);

  const handleGenerate = useCallback(() => {
    const start = geocodeCity(originName);
    const end = geocodeCity(destinationName);
    if (!start || !end) {
      // Simple fallback: clear route if invalid
      setRoutePoints(null);
      setTotalDistanceKm(0);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        const waypoints = generateWaypointsBetween(start, end, Math.max(0, Math.min(30, Math.floor(numStops))));
        const result = optimizeRouteGenetic(start, end, waypoints, {
          populationSize: 200,
          generations: 350,
          mutationRate: 0.12,
          elitismCount: 3,
          isClosedLoop,
        });
        const labeled = assignAlphabetLabels(result.orderedPoints).map((p) => ({
          label: p.label ?? "",
          latitude: p.latitude,
          longitude: p.longitude,
        }));
        setRoutePoints(labeled);
        setTotalDistanceKm(result.totalDistanceKm);
      } finally {
        setLoading(false);
      }
    }, 0);
  }, [originName, destinationName, numStops, isClosedLoop]);

  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);
  const computedRegion = useMemo(() => computeRegionForPoints(routePoints ?? undefined), [routePoints]);
  const timeEst = useMemo(() => formatHhMmFromDistance(totalDistanceKm, 40), [totalDistanceKm]);

  useEffect(() => {
    // Auto-generate on first load using defaults
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Fit to points whenever route changes
    setMapRegion(computedRegion);
  }, [computedRegion]);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const zoomBy = (factor: number) => {
    setMapRegion((r) => ({
      ...r,
      latitude: r.latitude,
      longitude: r.longitude,
      latitudeDelta: clamp(r.latitudeDelta * factor, 0.005, 50),
      longitudeDelta: clamp(r.longitudeDelta * factor, 0.005, 50),
    }));
  };
  const zoomIn = () => zoomBy(0.7);
  const zoomOut = () => zoomBy(1.3);

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
      <View className="px-4 py-3 bg-white border-b border-neutral-200">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-neutral-500 mb-1">Asal</Text>
            <TextInput
              value={originName}
              onChangeText={setOriginName}
              placeholder="Jakarta"
              className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-[16px] text-black"
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
          <View className="flex-1">
            <Text className="text-neutral-500 mb-1">Tujuan</Text>
            <TextInput
              value={destinationName}
              onChangeText={setDestinationName}
              placeholder="Surabaya"
              className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-[16px] text-black"
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
        </View>
        <View className="flex-row items-end gap-3 mt-3">
          <View className="w-[110px]">
            <Text className="text-neutral-500 mb-1">Jumlah Stop</Text>
            <TextInput
              value={String(numStops)}
              onChangeText={(t) => setNumStops(Number(t.replace(/[^0-9]/g, "")) || 0)}
              keyboardType="number-pad"
              className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-[16px] text-black"
            />
          </View>
          <Pressable
            onPress={() => setIsClosedLoop((v) => !v)}
            className="flex-row items-center gap-2 px-3 py-3 rounded-xl bg-neutral-100"
          >
            <View className={`w-5 h-5 rounded border ${isClosedLoop ? 'bg-[#1E5EF3] border-[#1E5EF3]' : 'bg-white border-neutral-300'}`} />
            <Text className="text-[14px] text-black">Loop ke asal</Text>
          </Pressable>
          <Pressable
            onPress={handleGenerate}
            className="flex-1 rounded-xl bg-[#1E5EF3] px-4 py-3 items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#fff" />
                <Text className="text-white text-[16px] font-semibold">Menghitung…</Text>
              </View>
            ) : (
              <Text className="text-white text-[16px] font-semibold">Buat Rute Optimal</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Map canvas */}
      <View className="relative flex-1 ">
        <MapView
          style={{ flex: 1, height: '100%' }}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
        >
          {routePoints && routePoints.length > 1 && (
            <Polyline
              coordinates={routePoints.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))}
              strokeColor="#1E5EF3"
              strokeWidth={5}
            />
          )}

          {routePoints?.map((p, idx) => (
            <LabeledMarker key={`${p.label}-${idx}`} {...p} />
          ))}
        </MapView>

        {/* Zoom controls */}
        <View className="absolute right-3 top-3 flex-col">
          <Pressable onPress={zoomIn} className="mb-2 items-center justify-center w-11 h-11 rounded-xl bg-white" style={{
            shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 5
          }}>
            <Text className="text-[20px] text-black">＋</Text>
          </Pressable>
          <Pressable onPress={zoomOut} className="items-center justify-center w-11 h-11 rounded-xl bg-white" style={{
            shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 5
          }}>
            <Text className="text-[24px] text-black" style={{ lineHeight: 24 }}>−</Text>
          </Pressable>
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
        <Text className="text-[16px] text-black">
          <Text className="font-bold">Rute Optimal:</Text>{" "}
          {routePoints && routePoints.length > 0
            ? routePoints.map((p) => p.label).join(" → ")
            : "(belum tersedia)"}
        </Text>
        <Text className="text-[16px] text-black mt-1">
          <Text className="font-bold">Jarak Total:</Text>{" "}
          {totalDistanceKm > 0 ? `${totalDistanceKm.toFixed(1)} km` : "-"}
        </Text>
        <Text className="text-[16px] text-black mt-1">
          <Text className="font-bold">Estimasi Waktu:</Text>{" "}
          {totalDistanceKm > 0 ? timeEst.text : "-"}
        </Text>
        <Text className="text-[16px] text-black mt-1">
          <Text className="font-bold">Metode:</Text>  Algoritma Genetika
        </Text>

        <Pressable className="mt-3 rounded-lg bg-neutral-100 py-3 items-center">
          <Text className="text-[16px] text-neutral-800 font-semibold">
            Lihat Detail Rute
          </Text>
        </Pressable>
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