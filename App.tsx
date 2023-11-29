import {useRef,useCallback} from 'react';
import {View, StyleSheet, Button, Alert,Text,Platform,SafeAreaView,StatusBar,Animated,PanResponder,useColorScheme,Linking,Easing,SectionList,TouchableOpacity, ScrollView, Share,} from 'react-native';
import type { EasingFunction } from 'react-native';

const supportedUrl= "https://reactnative.dev/";
  const unsupportedURL = 'slack://open?team=123456';
  type OpenURLButtonProps = {
    url: string;
    children: string;
  };
  const OpenURLButton = ({url, children}: OpenURLButtonProps) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);
  
    return <Button title={children} onPress={handlePress} />;
  };
const App = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const VisibleOn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const VisibleOff = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  const createThreeButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    const createFourButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Edit',
        onPress: () => console.log('Edit pressed'),
      },
      {
        text: 'Update',
        onPress: () => console.log('Update Pressed'),
        // style: 'cancel',
      },
      {
        text: 'Delete', 
        onPress: () => console.log('Delete Pressed')
      },
      { 
        text: 'Cancel', 
        onPress: () => console.log('Cancelled')
      },
    ]);
    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = PanResponder.create({  
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x, // x,y are Animated.Value
        dy: pan.y,
      },
    ]),
    onPanResponderRelease: () => {
      Animated.spring(
        pan, // Auto-multiplexed
        {toValue: {x: 0, y: 0}, useNativeDriver: false}, // Back to zero
      ).start();
    },
  });
  const theme=useColorScheme();
  const isDarkTheme=theme==='light';
  let opacity = new Animated.Value(0);
  const animate = (easing: EasingFunction) => {
    opacity.setValue(0);
    Animated.timing(opacity, {
    toValue: 1,
    duration: 1200,
    easing,
    useNativeDriver: false,
    }).start();
  };
  const size = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });
  const animatedStyles = [
                            styles.EassingBox,
                            {
                              opacity,
                              width: size,
                              height: size,
                            },
                          ];
  const sharebutton = async() => {
    try {
          const result = await Share.share( {
            message:'React Native | A framework for building native apps using React',
          });
          if(result.action === Share.sharedAction) 
          {
            if (result.activityType) 
            {
            } 
            else 
            {
            }
          } 
          else if (result.action === Share.dismissedAction) 
          {
          }
        } 
        catch (error: any) 
        {
          Alert.alert(error.message);
      }
  };
  return (
    <SafeAreaView style={styles.container2}>
      <ScrollView showsVerticalScrollIndicator='false'>
        <View style={{backgroundColor:'ivory'}}>
                  {/* Alert API  */}
                  <View style={styles.container}>
                      <Button title={'2-Tab Button Alert'} onPress={createTwoButtonAlert} />
                      <Button title={'3-Tab Button Alert'} onPress={createThreeButtonAlert} />
                      <Button title={'4-Tab Button Alert'} onPress={createFourButtonAlert} />
                  </View>
                  {/* Animated API */}
                  <Animated.View
                    style={[
                      styles.fadingContainer,
                      {
                        opacity: fadeAnim,
                      },
                    ]}>
                    <Text style={styles.fadingText}>Fading View!</Text>
                  </Animated.View>
                  <View style={styles.buttonRow}>
                    <Button title="Visible View On" onPress={VisibleOn} />
                    <Button title="Visible View Off" onPress={VisibleOff} />
                  </View>
                  {/* Animated Value XY */}
                  <View style={{alignItems:'center'}}>
                          <Animated.View
                          {...panResponder.panHandlers}
                          style={[pan.getLayout(), styles.box]}
                        />
                  </View>
                  {/* Appearance */}
                  <View
                      style={[
                        {
                          padding:10,
                          margin:5,
                        },
                        isDarkTheme
                          ? { backgroundColor: 'grey' }
                          : { backgroundColor: 'yellow' },
                      ]}>
                      <Text style={[isDarkTheme ? { color: 'white' } : { color: 'black' }]}>
                        Demo of default dark/light theme using appearance.{' '}
                      </Text>
                </View>
                {/* Easing API */}
                <View style={styles.EassingContainer}>
                        <StatusBar hidden={true} />
                        <Text style={styles.EassingTitle}>Press rows below to preview the Easing!</Text>
                        <View style={styles.EassingBoxContainer}>
                          <Animated.View style={animatedStyles} />
                        </View>
                  <SectionList
                    style={styles.EassingList}
                    sections={DATA}
                    keyExtractor={item => item.title}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => animate(item.easing)}
                        style={styles.EassingListRow}>
                        <Text style={{fontFamily:'times new roman'}}>{item.title}</Text>
                      </TouchableOpacity>
                    )}
                    renderSectionHeader={({section: {title}}) => (
                      <Text style={styles.EassingListHeader}>{title}</Text>
                    )}
                  />
                </View>

                {/* Linking API */}
                <View style={styles.LinkingUrlContainer}>
                  <OpenURLButton url={supportedUrl}>Supported URL</OpenURLButton>
                  {/* <OpenURLButton url={unsupportedURL}>Open Unsupported URL</OpenURLButton> */}
                </View>
                <Text style={{fontSize:20,textAlign:'center'}}>OS Display Using Platform API : {Platform.OS}</Text>
                <Text style={{fontSize:20,textAlign:'center'}}>OS Display Using Platform API : {Platform.Version}</Text>
                <View style={{marginTop: 50}}>
              <Button onPress={sharebutton} title="Share" />
            </View>
          </View>
        </ScrollView>
  </SafeAreaView>
  );
};
const DATA = [
  {
    title: 'Predefined animations',
    data: [
      {title: 'Bounce', easing: Easing.bounce},
      {title: 'Ease', easing: Easing.ease},
      {title: 'Elastic', easing: Easing.elastic(4)},
    ],
  },
  {
    title: 'Standard functions',
    data: [
      {title: 'Linear', easing: Easing.linear},
      {title: 'Quad', easing: Easing.quad},
      {title: 'Cubic', easing: Easing.cubic},
    ],
  },
  {
    title: 'Additional functions',
    data: [
      {
        title: 'Bezier',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: 'Circle', easing: Easing.circle},
      {title: 'Sin', easing: Easing.sin},
      {title: 'Exp', easing: Easing.exp},
    ],
  },
  {
    title: 'Combinations',
    data: [
      {
        title: 'In + Bounce',
        easing: Easing.in(Easing.bounce),
      },
      {
        title: 'Out + Exp',
        easing: Easing.out(Easing.exp),
      },
      {
        title: 'InOut + Elastic',
        easing: Easing.inOut(Easing.elastic(1)),
      },
    ],
  },
];
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    marginHorizontal: 1,
    height:20,
    backgroundColor:'white',
  },
  fadingContainer: {
    padding: 10,
    backgroundColor: 'red',
  },
  fadingText: {
    fontSize: 28,
    alignSelf:'center',
    fontFamily:'times new roman'
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 1,
  },
  box: {
    backgroundColor: '#61dafb',
    width: 80,
    height: 80,
    borderRadius: 24,
  },
  EassingContainer: {
    flex: 1,
    backgroundColor: '#20232a',
  },
  EassingTitle: {
    marginTop: 15,
    textAlign: 'center',
    color: '#61dafb',
    fontFamily:'times new roman',
  },
  EassingBoxContainer: {
    height: 150,
    alignItems: 'center',
  },
  EassingBox: {
    marginTop: 32,
    borderRadius: 48,
    backgroundColor: 'white',
  },
  EassingList: {
    backgroundColor: '#fff',
    height:250,
  },
  EassingListHeader: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f4f4f4',
    color: '#999',
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily:'Times new roman'
  },
  EassingListRow: {
    padding: 8,
  },
  LinkingUrlContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;