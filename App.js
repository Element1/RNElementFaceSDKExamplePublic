/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  configure,
  getElementUsers,
  remoteAuthentication,
  remoteEnrollment,
} from '@elementinc/react-native-element-face-sdk';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.eakString = 'YOUR_EAK_STRING';
    this.state = {
      userId: 'lg',
      firstName: '',
      lastName: '',
      configured: false,
      message: '',
    };
  }

  _configureSDK = () => {
    // TODO: replace YOUR_EAK with your own EAK
    const sdkConfigured = configure({
      ios: {eakString: this.eakString},
      android: {
        baseUrl: 'YOUR_BASE_URL',
        apiKey: 'YOUR_API_KEY',
        withAntiSpoofing: true,
        withPreTutorial: true,
        withAntiSpoofingTutorial: true,
      },
    });
    if (sdkConfigured) {
      this.setState(prevState => ({
        ...prevState,
        configured: true,
        message: 'SDK Configured',
      }));
    } else {
      alert('SDK not initialized');
    }
  };

  _startRemoteEnrollment = () => {
    const {userId, firstName, lastName} = this.state;
    const sdkConfigured = this.state.configured;
    if (sdkConfigured) {
      remoteEnrollment(userId, firstName, lastName)
        .then(({isEnrolled}) => {
          this.setState(prevState => ({
            ...prevState,
            message: `isEnrolled: ${isEnrolled}`,
          }));
        })
        .catch(message => {
          this.setState(prevState => ({
            ...prevState,
            message: message.toString(),
          }));
        });
    } else {
      alert('SDK not initialized');
    }
  };

  _startRemoteVerification = async () => {
    const {userId} = this.state;
    const sdkConfigured = this.state.configured;
    if (sdkConfigured) {
      try {
        const {
          isSuccess,
          message,
          confidenceScore,
        } = await remoteAuthentication(userId);
        this.setState(prevState => ({
          ...prevState,
          message: `${message}\nconfidenceScore: ${confidenceScore}`,
        }));
      } catch (message) {
        this.setState(prevState => ({
          ...prevState,
          message: message.toString(),
        }));
      }
    } else {
      alert('SDK not initialized');
    }
  };

  _getUsers = () => {
    const sdkConfigured = this.state.configured;
    if (sdkConfigured) {
      getElementUsers()
        .then(({accounts}) => {
          const acc = 'accounts: ' + accounts.join(',');
          this.setState(prevState => ({
            ...prevState,
            message: acc,
          }));
        })
        .catch(message => {
          this.setState(prevState => ({
            ...prevState,
            message: message.toString(),
          }));
        });
    } else {
      alert('SDK not initialized');
    }
  };

  _updateTextState = fieldName => text => {
    this.setState({
      [fieldName]: text,
    });
  };

  _renderHeader = () => (
    <>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.welcome}>Element, Welcome to React Native!</Text>
      <Text style={styles.instructions}>{this.state.message}</Text>
    </>
  );

  _renderTextInput = () => (
    <>
      <TextInput
        style={{
          height: 40,
          margin: 10,
          borderColor: 'gray',
          borderWidth: 1,
          width: '90%',
        }}
        onChangeText={this._updateTextState('userId')}
        value={this.state.userId}
        placeholder={'Enter User ID'}
      />
      <TextInput
        style={{
          height: 40,
          margin: 10,
          borderColor: 'gray',
          borderWidth: 1,
          width: '90%',
        }}
        onChangeText={this._updateTextState('firstName')}
        value={this.state.firstName}
        placeholder={'Enter First Name (enroll only)'}
      />
      <TextInput
        style={{
          height: 40,
          margin: 10,
          borderColor: 'gray',
          borderWidth: 1,
          width: '90%',
        }}
        onChangeText={this._updateTextState('lastName')}
        value={this.state.lastName}
        placeholder={'Enter Last Name (enroll only)'}
      />
    </>
  );

  _renderButtonGroup = () => (
    <>
      <Button
        style={{flex: 1, margin: 10}}
        title={'Start Remote Enrollment'}
        onPress={this._startRemoteEnrollment}
      />
      <Button
        style={{flex: 1, margin: 10}}
        title={'Start Remote Verification'}
        onPress={this._startRemoteVerification}
      />
      <Button
        style={{flex: 1, margin: 10}}
        title={'Get Users'}
        onPress={this._getUsers}
      />
    </>
  );

  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <Button
          style={{flex: 1, margin: 10}}
          title={'Configure SDK'}
          onPress={this._configureSDK}
        />
        {this._renderTextInput()}
        {this._renderButtonGroup()}
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
