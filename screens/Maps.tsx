import "../global.css";
import { Text, View, Pressable, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useMemo } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import mapTemplate from "./map-template";

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

const INITIAL_CENTER = [108.57236909901103, -6.717536968419976];

export default function Maps() {
  const navigation = useNavigation<NavigationProp<any>>();
  const webRef = useRef<WebView>(null);

  const html = useMemo(() => {
    return mapTemplate({
      routePoints: ROUTE_POINTS,
      initialCenter: INITIAL_CENTER,
      initialZoom: 9,
    });
  }, []);

  const handleMapEvent = (event: WebViewMessageEvent) => {
    // Example: handle center updates from the map if needed
    // const data = JSON.parse(event.nativeEvent.data);
    // console.log('Map event:', data);
  };

  const handleZoomIn = () => {
    webRef.current?.injectJavaScript("window.mapApi && window.mapApi.zoomIn && window.mapApi.zoomIn(); true;");
  };
  const handleZoomOut = () => {
    webRef.current?.injectJavaScript("window.mapApi && window.mapApi.zoomOut && window.mapApi.zoomOut(); true;");
  };

  return (
    <SafeAreaView className="flex-1 ]">
      <StatusBar barStyle="light-content" backgroundColor="#F37021" />
      <View className="bg-[#F37021] px-5 py-3 flex-row items-center justify-between">
        <Text className="text-white font-extrabold text-[24px]">
          Optimasi Rute Distribusi
        </Text>
        <View className="w-7 h-7 rounded-full border border-white items-center justify-center">
          <Text className="text-white text-[16px] font-semibold">i</Text>
        </View>
      </View>

      <View className="relative flex-1 ">
        <WebView
          ref={webRef}
          onMessage={handleMapEvent}
          originWhitelist={["*"]}
          javaScriptEnabled
          scalesPageToFit={false}
          automaticallyAdjustContentInsets={false}
          source={{ html }}
          style={{ flex: 1, height: "100%" }}
          onLoadEnd={() => {
            webRef.current?.injectJavaScript("window.mapApi && window.mapApi.fitToRoute && window.mapApi.fitToRoute(); true;");
          }}
        />

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
        <Pressable 
          className="mt-3 rounded-lg bg-neutral-100 py-3 items-center"
          onPress={() => { navigation.navigate("Detail_Rute" as never); }}
        >
          <Text className="text-[16px] text-neutral-800 font-semibold">
            Lihat Detail Rute
          </Text>
        </Pressable>
      </View>

      <View className="flex-row items-center justify-around border-t border-neutral-200 py-2 bg-white">
        <TouchableOpacity
          className="items-center"
          onPress={() => { navigation.navigate("Login" as never); }}
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