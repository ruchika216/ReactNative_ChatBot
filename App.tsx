import {Platform, Pressable} from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Chat from './src/screens/Chat';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import auth from '@react-native-firebase/auth';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';

const Stack = createNativeStackNavigator();

function ChatStack() {
  const [authenticated, setAuthenticated] = useState(false);

  auth().onAuthStateChanged(user => {
    if (user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  });

  if (authenticated) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            title: 'AI ChatBot',
            headerRight: props => (
              <Pressable
                android_ripple={{
                  color: '#666666',
                  foreground: true,
                  borderless: true,
                }}
                onPress={() => {
                  auth().signOut();
                }}>
                <Ionicon
                  style={{paddingLeft: 10}}
                  name={Platform.OS === 'ios' ? 'ios-menu' : 'log-out-outline'}
                  size={25}
                />
              </Pressable>
            ),
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{title: 'AI ChatBot', headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{title: 'AI ChatBot', headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer>
      <ChatStack />
    </NavigationContainer>
  );
}

export default function App() {
  return <RootNavigator />;
}
