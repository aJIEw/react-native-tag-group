## react-native-tag-group

[![](https://img.shields.io/npm/v/react-native-tag-group)](https://www.npmjs.com/package/react-native-tag-group) [![](https://img.shields.io/npm/l/react-native-tag-group)](https://github.com/aJIEw/react-native-tag-group/blob/master/LICENSE)

A simple Tag component that supports both single and multiple selection.

<a href="https://raw.githubusercontent.com/aJIEw/react-native-tag-group/master/assets/screenshot_ios.png" target="_blank"><img src='https://github.com/aJIEw/react-native-tag-group/blob/master/assets/screenshot_ios.png' width='30%'/></a><a href="https://raw.githubusercontent.com/aJIEw/react-native-tag-group/master/assets/screenshot_android.png" target="_blank"><img src='https://github.com/aJIEw/react-native-tag-group/blob/master/assets/screenshot_android.png' width='30%'/></a>

## Get Started

### Installation

```sh
npm i react-native-tag-group --save
```

### TagGroup Usage

```js
import TagGroup from 'react-native-tag-group';

// ...

render() {
  return (
    <TagGroup 
      ref={ref => this.tagGroup = ref}
      source={['One', 'Two', 'Three']}
      onSelectedTagChange={(selected) => { this.setState({selected}); }}
    />
  );
}
```

### TagGroup Props

| Props               | Type       | Description                                                  |
| :------------------ | :---------------- | ------------------------------------------------------------ |
| style               | View style | container's style                                            |
| source              | array      | source array, usually a string array.                       |
| singleChoiceMode    | bool       | only allow select one Tag at one time. Default `false`.     |
| onSelectedTagChange | function   | callback after Tag(s) pressed, the parameter is a string array[], or (`stringValue`, `selectedIndex`) when set `singleChoiceMode` to true. |
| tintColor | string | set the border color and background color when Tag is selected. |
| tagStyle/activeTagStyle | View style | set the Tag's style before and after selected. |
| textStyle/activeTextStyle | Text style | set the Tag's text style before and after selected. |
| touchableOpacity | bool | use TouchableOpacity instead of TouchableWithoutFeedback. |

### Methods

#### select(index)

Select Tag at the index, this WON'T invoke `onSelectedTagChange` callback.

#### unselect(index)

Unselect Tag at the index, this WON'T invoke `onSelectedTagChange` callback.

#### getSelectedIndex()

Get the index array of the selected Tag(s), return -1 if no Tag is selected.

### Tag Usage

`Tag` can also be used as a simple button, for example:

```js
import {Tag} from 'react-native-tag-group';

// ...

<Tag 
  text={'Button Text'}
  tagStyle={styles.buttonContainer}
  textStyle={styles.buttonText}
  onPress={this.onTagPress}
  touchableOpacity
/>

// ...

onTagPress = () => {
 console.log('Hello world!')
}
```

### Tag Props

| Props               | Type       | Description                                                  |
| :------------------ | :---------------- | ------------------------------------------------------------ |
| tintColor | string | Tag's border color, you can also cusotomize it with `tagStyle` prop. |
| tagStyle | View style | Tag style. |
| textStyle | Text style | Tag's text style. |
| onPress | function | callback function when Tag is pressed. |
| touchableOpacity | bool | use TouchableOpacity instead of TouchableWithoutFeedback. |

For more information please check the [example](https://github.com/aJIEw/react-native-tag-group/tree/master/example).
