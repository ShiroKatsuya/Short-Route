import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import "./global.css"
import Maps from './screens/Maps';
import Login from './screens/Login';
import Detail_Rute from './screens/Detail_Rute';


LogBox.ignoreLogs([
  'Warning: Failed prop type',
  'Non-serializable values were found in the navigation state',
]);

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Maps" component={Maps} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Detail_Rute" component={Detail_Rute} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}