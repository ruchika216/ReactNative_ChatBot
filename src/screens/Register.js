import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import backImage from '../../assets/lo.png';
import img from '../../assets/logo1.png';
import auth from '@react-native-firebase/auth';

export default function Register({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const createUser = async (email, password) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message.split(error.code + ']')[1]);
    }
  };

  const onHandleRegister = async() => {
    if (email !== '' && password !== '') {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) != true) {
          alert('Invalid Email!');
          return;
        }
        setIsLoading(true);
        await createUser(email, password);
        setIsLoading(false);
      } else {
        alert('Please fill the required fields');
      }
  };

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} resizeMode="cover" />
      <Image source={img} style={styles.logImage} resizeMode="cover" />
      <View style={styles.whiteSheet}>
        <SafeAreaView style={styles.form}>
          {/* <Image source={img} style={styles.logImage} resizeMode='cover'/> */}
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
            autoCapitalize="none"
            textContentType="password"
            autoFocus={true}
          />
         {isLoading ? (
            <ActivityIndicator />
          ) : (
          <TouchableOpacity style={styles.button} onPress={onHandleRegister}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
              Register
            </Text>
          </TouchableOpacity>)}
          <View
            style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#000', fontSize: 16}}>
              Already Registered?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{color: '#09a5ed', fontSize: 16, fontWeight: 'bold'}}>
                {' '}
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#09a5ed',
    alignSelf: 'center',
    paddingBottom: 30,
  },
  input: {
    height: 40,
    backgroundColor: '#f6f7f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  backImage: {
    width: '100%',
    height: 340,
    position: 'absolute',
    top: 0,
  },
  logImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 25,
  },
  whiteSheet: {
    backgroundColor: '#fff',
    height: '75%',
    borderTopLeftRadius: 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
    marginBottom: 90,
  },
  button: {
    backgroundColor: '#09a5ed',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
