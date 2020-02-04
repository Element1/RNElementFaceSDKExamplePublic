/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, 
  Button, 
  TextInput
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { configure, remoteEnrollment, remoteAuthentication, getElementUsers } from '@elementinc/react-native-element-face-sdk';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      userId: 'lg',
      configured: false,
      message: ''
    };
  }

  _configureSDK = () => {
    // TODO: replace YOUR_EAK with your own EAK
    const sdkConfigured = configure('YOUR_EAK');
    if (sdkConfigured) {
      this.setState((prevState) => ({
        ...prevState,
        configured: true,
        message: "SDK Configured"
      }));
    } else {
      alert('SDK not initialized')
    }
  };

  _startRemoteEnrollment = () => { 
    const { userId } = this.state;   
    const sdkConfigured = this.state.configured;
    if (sdkConfigured) {
      remoteEnrollment(userId)
        .then(({ isEnrolled }) => {
          this.setState((prevState) => ({
            ...prevState,
            message: `isEnrolled: ${isEnrolled}`
          }));
        })
        .catch((message) => {
          this.setState((prevState) => ({
            ...prevState,
            message: message.toString()
          }));
        });
    } else {
      alert('SDK not initialized')
    }
  };

  _startRemoteVerification = () => {
    const { userId } = this.state;
    const sdkConfigured = this.state.configured;
    if (sdkConfigured) {
      remoteAuthentication(userId)
        .then(({ isSuccess, message, confidenceScore }) => {
          this.setState((prevState) => ({
            ...prevState,
            message: `${message}\nconfidenceScore: ${confidenceScore}`
          }));
        })
        .catch((message) => {
          this.setState((prevState) => ({
            ...prevState,
            message: message.toString()
          }));
        });
    } else {
      alert('SDK not initialized')
    }
  };

  _getUsers = () => {
    const sdkConfigured = this.state.configured;
    if (sdkConfigured) {
      getElementUsers()
        .then(({ accounts }) => {
          var acc = "accounts: " + accounts.join(',');
          this.setState((prevState) => ({
            ...prevState,
            message: acc
          }));
        })
        .catch((message) => {
          this.setState((prevState) => ({
            ...prevState,
            message: message.toString()
          }));
        });
    } else {
      alert('SDK not initialized')
    }
  };

  _updateTextState = (fieldName) => (text) => {
    this.setState({
      [fieldName]: text
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.welcome}>Element, Welcome to React Native!</Text>
        <Text style={styles.instructions}>{this.state.message}</Text>
        <Button style={{ flex: 1, margin: 10 }} title={'Configure SDK'} onPress={this._configureSDK}/>
        <TextInput
            style={{height: 40, margin: 10, borderColor: 'gray', borderWidth: 1, width: '90%'}}
            onChangeText={this._updateTextState('userId')}
            value={this.state.userId}
            placeholder={'Enter User ID'}
        />

        <Button style={{ flex: 1, margin: 10 }} title={'Start Remote Enrollment'} onPress={this._startRemoteEnrollment}/>

        <Button style={{ flex: 1, margin: 10 }} title={'Start Remote Verification'} onPress={this._startRemoteVerification}/>

        <Button style={{ flex: 1, margin: 10 }} title={'Get Users'} onPress={this._getUsers}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
