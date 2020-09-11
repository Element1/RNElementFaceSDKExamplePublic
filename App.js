/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Button, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { 
  configure, remoteEnrollment, remoteAuthentication, localEnrollment, localAuthentication, deleteAccount, getElementUsers, listAccounts, extractFrames, downloadAccount, uploadAccount, createAccount
} from '@elementinc/react-native-element-face-sdk';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    // TODO: replace YOUR_EAK with your own EAK
    this.eakString = 'YOUR_EAK';
    this.theme = 'selfieDot';
    this.antispoofingType = 'gaze';
    this.state = {
      userId: 'lg',
      firstName: '',
      lastName: '',
      configured: false,
      message: ''
    };
  }

  _configureSDK = () => {
    // TODO: replace YOUR_EAK with your own EAK
    const sdkConfigured = configure({
      ios: { 
        eakString: this.eakString, 
        theme: this.theme, 
        antispoofingType: this.antispoofingType 
      },
      android: {
        baseUrl: 'YOUR_BASE_URL',
        apiKey: 'YOUR_API_KEY',
        withAntiSpoofing: true,
        withPreTutorial: true,
        withAntiSpoofingTutorial: true
      }
    });
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
    const { userId, firstName, lastName } = this.state;
    
    remoteEnrollment({userId:userId, firstName:firstName, lastName:lastName})
      .then(({ enrolled }) => {
        this.setState((prevState) => ({
          ...prevState,
          message: `enrolled: ${enrolled}`
        }));
      })
      .catch((error) => {
        this.setState((prevState) => ({
          ...prevState,
          message: error.code + ' | ' + error.message
        }));
      });
  };

  _startRemoteVerification = async () => {
    const { userId } = this.state;
    try {
      const { authenticated, message, confidenceScore } = await remoteAuthentication({userId:userId, use_matching_v2_1:true, additionalParameters:{cardId:userId}});
      this.setState((prevState) => ({
        ...prevState,
        message: `confidenceScore: ${confidenceScore} authenticated: ${authenticated}`
      }));
    } catch (error) {
      this.setState((prevState) => ({
        ...prevState,
        message: error.code + ' | ' + error.message
      }));
    }
  };

  _startLocalEnrollment = () => {
    const { userId, firstName, lastName } = this.state;
    
    localEnrollment({userId:userId, firstName:firstName, lastName:lastName /*, uploadAccountUponEnrollmentCompletion:false */})
      .then(({ enrolled }) => {
        this.setState((prevState) => ({
          ...prevState,
          message: `enrolled: ${enrolled}`
        }));
      })
      .catch((message) => {
        this.setState((prevState) => ({
          ...prevState,
          message: ""
        }));
        alert(message.toString());
      });
  };

  _startLocalVerification = async () => {
    const { userId } = this.state;
    
    try {
      const { authenticated, confidenceScore } = await localAuthentication({userId:userId});
      this.setState((prevState) => ({
        ...prevState,
        message: `confidenceScore: ${confidenceScore} - authenticated: ${authenticated}`
      }));
    } catch (message) {
      this.setState((prevState) => ({
        ...prevState,
        message: ""
      }));
      alert(message.toString());
    }
  
  };

  _listAccounts = () => {
    listAccounts()
      .then(( accounts ) => {
        var acc = "accounts: " + accounts.map(u => u.userId).join(',');
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
  };

  _deleteAccount = async () => {
    const { userId } = this.state;
    try {
      const { deleted } = await deleteAccount(userId);
      this.setState((prevState) => ({
        ...prevState,
        message: `account deleted - ${deleted}`
      }));
    } catch (message) {
      this.setState((prevState) => ({
        ...prevState,
        message: message.toString()
      }));
    }
  };

  _createAccount = async () => {
    const { userId } = this.state;
    try {
      const { accountCreated } = await createAccount({userId: userId});
      this.setState((prevState) => ({
        ...prevState,
        message: `accountCreated - ${accountCreated}`
      }));
    } catch (message) {
      this.setState((prevState) => ({
        ...prevState,
        message: message.toString()
      }));
    }
  };

  _generateUserId = () => {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 16; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    this.setState({
      ['userId']: result
    })
  };

  _updateTextState = (fieldName) => (text) => {
    this.setState({
      [fieldName]: text
    })
  };

  _extractEnrollment = async () => {
    const { userId } = this.state;
    try {
      const images = await extractFrames({flow:'enrollment', theme:'selfieDot', filter:['tr','tl']});
      var msg = images.length + ' image(s)';
      images.forEach(img => msg += ' ' + img.cornerId); 
      this.setState((prevState) => ({
        ...prevState,
        message: msg
      }));
    } catch (message) {
      this.setState((prevState) => ({
        ...prevState,
        message: ""
      }));
      alert(message.toString());
    }
  };

  _extractAuth = async () => {
    const { userId } = this.state;
    try {
      const images = await extractFrames({flow:'authentication', theme:'selfieDot', filter:['tr','tl']});
      var msg = images.length + ' image(s)';
      images.forEach(img => msg += ' ' + img.cornerId); 
      this.setState((prevState) => ({
        ...prevState,
        message: msg
      }));
    } catch (message) {
      this.setState((prevState) => ({
        ...prevState,
        message: ""
      }));
      alert(message.toString());
    }
  };

  _downloadAccount = async () => {
    const { userId } = this.state;
    try {
      const { downloaded } = await downloadAccount(userId);
      this.setState((prevState) => ({
        ...prevState,
        message: `downloaded: ${downloaded}`
      }));
    } catch (message) {
      this.setState((prevState) => ({
        ...prevState,
        message: ""
      }));
      alert(message.toString());
    }
  };

  _uploadAccount = async () => {
    const { userId } = this.state;
    try {
      const { uploaded } = await uploadAccount(userId);
      this.setState((prevState) => ({
        ...prevState,
        message: `uploaded: ${uploaded}`
      }));
    } catch (message) {
      this.setState((prevState) => ({
        ...prevState,
        message: ""
      }));
      alert(message.toString());
    }
  };

  _renderHeader = () => (
    <>
      <StatusBar barStyle="dark-content" />
      <Text style={{height: 20, margin: 20}}>Element, Welcome to React Native!</Text>
      <Text style={styles.instructions}>{this.state.message}</Text>
    </>
  )

  _renderTextInput = () => (
    <>

      <View style={{ flexDirection: 'row', margin: 0 }}>
        <TextInput
          style={{height: 40, margin: 10, borderColor: 'gray', borderWidth: 1, width: '60%'}}
          onChangeText={this._updateTextState('userId')}
          value={this.state.userId}
          placeholder={'User ID'}
        />
        <Button style={{height: 40, margin: 0, width:'30%'}} title={'Generate'} onPress={this._generateUserId}/>
      </View>
      <View style={{ flexDirection: 'row', margin: 0 }}>
        <TextInput
          style={{height: 40, margin: 10, borderColor: 'gray', borderWidth: 1, width: '40%'}}
          onChangeText={this._updateTextState('firstName')}
          value={this.state.firstName}
          placeholder={'First Name (enroll only)'}
        />
        <TextInput
          style={{height: 40, margin: 10, borderColor: 'gray', borderWidth: 1, width: '40%'}}
          onChangeText={this._updateTextState('lastName')}
          value={this.state.lastName}
          placeholder={'Last Name (enroll only)'}
        />
      </View>
    </>
  );

  _renderButtonGroup = () => (
    <>
      <View style={{ flexDirection: 'row', margin: 0 }}>
        <Button style={{ flex: 1, margin: 10 }} title={'Remote Enrollment'} onPress={this._startRemoteEnrollment}/>
        <Button style={{ flex: 1, margin: 10 }} title={'Remote Verification'} onPress={this._startRemoteVerification}/>
      </View>
      <View style={{ flexDirection: 'row', margin: 0 }}>
        <Button style={{ flex: 1, margin: 10 }} title={'Local Enrollment'} onPress={this._startLocalEnrollment}/>
        <Button style={{ flex: 1, margin: 10 }} title={'Local Verification'} onPress={this._startLocalVerification}/>
      </View> 

      <View style={{ flexDirection: 'row', margin: 0 }}>
        <Button style={{ flex: 1, margin: 10 }} title={'List Accounts'} onPress={this._listAccounts}/>
      </View>

      <View style={{ flexDirection: 'row', margin: 0 }}>
        <Button style={{ flex: 1, margin: 10 }} title={'Create Account'} onPress={this._createAccount}/>
        <Button style={{ flex: 1, margin: 10 }} title={'Delete Account'} onPress={this._deleteAccount}/>
      </View>

      <View style={{ flexDirection: 'row', margin: 0 }}>
        <Button style={{ flex: 1, margin: 10 }} title={'Download Account'} onPress={this._downloadAccount}/>
        <Button style={{ flex: 1, margin: 10 }} title={'Upload Account'} onPress={this._uploadAccount}/>
      </View>

      <View style={{ flexDirection: 'row', margin: 0 }}>
        <Button title={'Extract (Enroll)'} onPress={this._extractEnrollment}/>
        <Button style={{ flex: 1, margin: 10}} title={'Extract (Auth)'} onPress={this._extractAuth}/>
      </View>

    </>
  );

  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <Button style={{ flex: 1, margin: 10 }} title={'Configure SDK'} onPress={this._configureSDK}/>
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
