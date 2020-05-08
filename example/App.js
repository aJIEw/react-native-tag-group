import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Switch, SafeAreaView} from 'react-native';

import TagGroup, {Tag} from 'react-native-tag-group';

console.disableYellowBox = true;

const tags = ['Flutter', 'React Native', 'Ionic', 'Cordova', 'Weex', 'Taro', 'VasSonic', 'WeChat Mini Program'];

const languages = ['Kotlin', 'Java', 'JavaScript', 'Python', 'Dart', 'Golang', 'Rust', 'Ruby', 'C'];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      singleChoiceMode: false,
      consoleText: '',
    };
  }

  render() {
    return <SafeAreaView style={styles.container}>

      <TagGroup ref={ref => this.tagGroup = ref}
                style={styles.tagGroup}
                source={tags}
                singleChoiceMode={this.state.singleChoiceMode}
                onSelectedTagChange={this.onTagPress}/>

      <View style={styles.controller}>
        <View style={styles.modeSwitcher}>
          <Text style={styles.modeText}>{'singleChoiceMode'}</Text>
          <Switch style={styles.switcher}
                  value={this.state.singleChoiceMode}
                  onValueChange={this.onSwitchChange}/>
          {
            this.state.singleChoiceMode ?
              <Tag onPress={this.randomlySelect}
                   text={'Randomly Select'} touchableOpacity
                   tagStyle={styles.buttonContainer}
                   textStyle={styles.buttonText}/> : null
          }
        </View>

        {/* Using <Tag/> as a button */}
        <View style={styles.btnConstroller}>
          <Tag onPress={this.getSelectedTags}
               text={'Get Selected Tag(s)'} touchableOpacity
               tagStyle={styles.buttonContainer}
               textStyle={styles.buttonText}/>

          <Tag onPress={this.unselectAll}
               text={'Unselect All'} touchableOpacity
               tagStyle={styles.buttonContainer}
               textStyle={styles.buttonText}/>
        </View>
      </View>

      <ScrollView style={styles.console}
                  ref={ref => this.scrollView = ref}
                  directionalLockEnabled={false}
                  onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
        <Text style={styles.consoleText}>{this.state.consoleText}</Text>
      </ScrollView>

      {/* region Custom Tags */}
      <View style={styles.customTags}>
        <Text style={styles.title}>{'Custom Tag Style'}</Text>
        <TagGroup ref={ref => this.customTagGroup = ref}
                  style={styles.tagGroup}
                  source={languages}
                  tagStyle={styles.tagStyle}
                  activeTagStyle={{
                    backgroundColor: '#333',
                  }}
                  textStyle={styles.textStyle}
                  activeTextStyle={{
                    color: 'white',
                  }}/>
      </View>
      {/* endregion */}
    </SafeAreaView>
  }

  componentDidMount() {
    this.customTagGroup.select(0);
  }

  onTagPress = (selected, selectedIndex) => {
    // For safety, check params before using them.
    if (!this.state.singleChoiceMode && Array.isArray(selected)) {
      this.console(`selected tags = [${selected.join(', ')}]`);
    } else {
      this.console(`selected tag (value, index) = (${selected}, ${selectedIndex})`);
    }
  }

  onSwitchChange = (value) => {
    if (value) {
      for (let i = 0; i < tags.length; i++) {
        this.tagGroup.unselect(i);
      }
    }

    this.setState({singleChoiceMode: value});
    this.console(`singleChoiceMode = ${value ? 'on' : 'off'}`, 2);
  }

  randomlySelect = async () => {
    for (let i = 0; i < tags.length; i++) {
      // We have to make sure the state of Tags 
      // are all updated before selecting it again.
      await this.tagGroup.unselect(i);
    }
    const r = this.getRandomInt(tags.length);
    this.tagGroup.select(r);
    this.console(`Randomly selected = [${r}]`, 2);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getSelectedTags = () => {
    let selectedIndex = this.tagGroup.getSelectedIndex();
    if (selectedIndex != -1) {
      this.console(`getSelectedIndex = [${selectedIndex.join(', ')}]`, 2);
    } else {
      this.console(`getSelectedIndex = ${selectedIndex}`, 2);
    }
  }

  unselectAll = () => {
    if (this.tagGroup.getSelectedIndex() === -1) {
      this.console('There is no Tag selected!', 2);
      return;
    }

    for (let i = 0; i < tags.length; i++) {
      this.tagGroup.unselect(i);
    }
    this.console('All tags unseleted!', 2);
  }

  console(text, numberOfLinefeed = 1) {
    let linefeed = '';
    for (let index = 0; index < numberOfLinefeed; index++) {
      linefeed += '\n';
    }
    this.setState(state => {
      return {
        consoleText: (state.consoleText && (state.consoleText + linefeed)) + text
      }
    });
  }

}


const styles = StyleSheet.create({
  container: {},

  title: {
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },

  tagGroup: {
    marginTop: 16,
    marginHorizontal: 10,
    marginBottom: 8,
  },

  controller: {
    borderTopColor: '#ddd',
    borderTopWidth: 0.8,
    paddingTop: 10,
    marginHorizontal: 12,
  },
  modeSwitcher: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeText: {
    color: '#333',
    fontSize: 18,
  },
  switcher: {
    marginHorizontal: 8,
  },
  buttonContainer: {
    height: 30,
    alignSelf: 'center',
    marginRight: 8,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  btnConstroller: {
    flexDirection: 'row',
  },

  console: {
    flex: 1,
    backgroundColor: '#ddd',
    minHeight: 250,
    marginHorizontal: 10,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  consoleText: {
    color: '#333',
    fontSize: 16,
  },

  customTags: {
    borderTopColor: '#ddd',
    borderTopWidth: 0.8,
    paddingTop: 10,
  },
  tagStyle: {
    marginTop: 4,
    marginHorizontal: 8,
    backgroundColor: '#eee',
    borderWidth: 0,
    marginRight: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  textStyle: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;
