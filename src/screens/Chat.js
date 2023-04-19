import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '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';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {message: 'Hello, I am chatbot', isSender: false},
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem('messages');
      if (data) {        
        var jsonObject =await JSON.parse(data);
        setMessages(prevMessages => jsonObject['messages']);    
      }
    };
    fetchData();
  }, []);

  const [isReceivedUserResponse, setIsReceivedUserResponse] = useState(true);
  
  const handleSendMessage = async () => {
    setIsReceivedUserResponse(false);

    setMessages(prevMessages => [
      ...prevMessages,
      {message: message, isSender: true},
    ]);

    var incomingMessage = message;

    setMessage('');

    setMessages(prevMessages => [
      ...prevMessages,
      {message: 'typing....', isSender: false},
    ]);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: incomingMessage}],
      }),
    });

    if (response.status === 200) {
      const data = await response.json();

      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1), // Copy previous messages except the last one
        {
          message: data.choices[0].text.trim(),
          isSender: false,
        }, // Update the last message
      ]);
    } else {
      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1), // Copy previous messages except the last one
        {message: 'Rate Limit exceeded', isSender: false}, // Update the last message
      ]);
    }

    setIsReceivedUserResponse(true);

    await AsyncStorage.setItem('messages', JSON.stringify({messages}));
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={ref => {this.scrollView = ref}}
    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
        <FlatList
          data={messages}
          scrollEnabled={false} // disable scroll on flatlist
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={[
                styles.messageContainer,
                item.isSender === false ? styles.botMessage : styles.userMessage,
              ]}>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          )}
        />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />
        {isReceivedUserResponse ? (
          <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.buttonText}>...</Text>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3e3e3',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#cadefc',
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#0084FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 50,
    height: 20,
    borderRadius: 25,
    backgroundColor: '#0084FF',
    overflow: 'hidden',
    // padding: 10,
    marginRight: 10,
  },
});

export default Chat;
