# RNElementFaceSDKExamplePublic

This repository contains a React Native app that shows how to use the Element `react-native-element-face-sdk` for user enrollment and authentication.

The module is imported in [package.json](./package.json) file:
```
"dependencies": {
    "@elementinc/react-native-element-face-sdk": "1.0.2",
    ...
  }
```

Once you install the `@elementinc/react-native-element-face-sdk` module, you can read its `README.md` in `./node_modules/@elementinc/react-native-element-face-sdk/README.md`.

## Installing

The module is private (and hosted on https://www.npmjs.com/); to download and install it, you will need to get an access token (ACCESS_TOKEN) from Element.  Follow these steps to install the module:
* Go to your app's repository / folder
* Log in to your NPMJS account: $ npm login
* Set your access token: $ npm config set //registry.npmjs.org/:_authToken=ACCESS_TOKEN
* Install the latest version of the module: $ npm i @elementinc/react-native-element-face-sdk

## Running 

Download and install all the dependencies:

`$ yarn`

### iOS

In the iOS folder, setup the project files:

`$ cd ios`

`$ pod install`

The app's Xcode project requires the Element SDK and the theme files to be available in `./ios/RNElementFaceSDKExamplePublic/Frameworks` (copy the files from the `./node_modules/@elementinc/react-native-element-face-sdk/ios/Frameworks` directory).

To run the app, open the Xcode workspace (`./ios/RNElementFaceSDKExamplePublic.xcworkspace`); on the `General` tab, update the `Bundle Identifier` (use your company prefix), choose your Team in the `Signing` panel and click `Run`.

### Android

See integration guide on the README of `@elementinc/react-native-element-face-sdk`

## Notes when integrating into an existing app

### iOS

* Bitcode needs to be disabled for your app.

* The Element SDK requires access to the camera to enroll / authenticate users so your app's Info.plist must contain an `NSCameraUsageDescription` key with a string value explaining why.

* You need to embed the `ElementSDK.framework` into your app (by clicking on your app's project then your target and under "Embedded Binaries", click the "+" and chose the `ElementSDK.framework`) and include the theme bundle you would like your app to use.

## Upgrading

* Bump the version in [package.json](./package.json) file.
* `yarn` to download the new version

### iOS upgrade
* `$ cd ios`
* `$ pod install`
* Update the app's Xcode project to include the newest framework / files (from: `./node_modules/@elementinc/react-native-element-face-sdk/ios/Frameworks`)
