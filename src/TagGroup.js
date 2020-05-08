/**
 * Created by aJIEw on 20/5/6.
 */

import React, {Component} from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ViewPropTypes } from "react-native";

import PropTypes from 'prop-types';


export default class TagGroup extends Component {

  static propTypes = {
    // source array, usually a string array.
    source: PropTypes.arrayOf(PropTypes.string),
    // only allow select one Tag at one time.
    singleChoiceMode: PropTypes.bool,
    // callback after Tag(s) pressed, the parameter is a string array,
    // or (string, index) when set singleChoiceMode to true.
    onSelectedTagChange: PropTypes.func.isRequired,

    // start: props for Tag
    tintColor: PropTypes.string,
    tagStyle: ViewPropTypes.style,
    activeTagStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    activeTextStyle: Text.propTypes.style,
    touchableOpacity: PropTypes.bool,
    // end: props for Tag
  };

  static defaultProps = {
    onSelectedTagChange: () => console.log('TagGroup onSelectedTagChange not set.'),
    singleChoiceMode: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      tagFlags: props.source.map(value => false),
    };

    this._tags = []
  }

  shouldComponentUpdate(nextProps) {
    // clear state when source array size changed
    if (nextProps.source.length !== this.props.source.length) {
      this.setState({tagFlags: nextProps.source.map(value => false)});
      for (let i = 0; i < nextProps.source.length; i++) {
        this._tags[i] && this._tags[i].clearState();
      }
      return false;
    }
    return true;
  }

  render() {
    return <View style={[styles.tagContainer].concat(this.props.style)}>
      {
        this.props.source.map((value, index) => 
          <Tag key={index}
               ref={ref => this._tags[index] = ref}
               text={value} {...this.props}
               tagStyle={[styles.tag, this.props.tagStyle]}
               allowUnselect={this.props.singleChoiceMode && this.state.tagFlags[index]}
               onSelectStateChange={() => this._onTagPress(index)}/>)
      }
    </View>
  }

  _onTagPress(index) {
    this.setState(state => {
      if (this.props.singleChoiceMode) {
        this._tags.forEach((tag, tagIndex) => {
          if (tag && (index !== tagIndex)) {
            tag.clearState();
          }
        });

        let selected = this.getSelectedIndex();
        if (selected === -1 || selected[0] !== index) {
          this.props.onSelectedTagChange(this.props.source[index], index);
        }
        return {tagFlags: state.tagFlags.map((value, tagFlagIndex) => index === tagFlagIndex)}
      }

      let copy = state.tagFlags;
      copy[index] = !copy[index];
      let selectedTags = this.props.source.filter((value, index) => copy[index]);
      this.props.onSelectedTagChange(selectedTags);
      return {tagFlags: copy}
    })
  }

  /**
   * Make tag selected, this WON'T invoke onSelectedTagChange callback.
   * */
  select(index) {
    if (index < this._tags.length) {
      // the size of _tags may change as the source array changes,
      // so the item at {index} might not exists anymore.
      this._tags[index] && this._tags[index].setSelected();

      this.setState(state => {
        let copy = state.tagFlags;
        copy[index] = true;
        return {tagFlags: copy}
      });
    }
  }

  /**
   * Make tag unselected, this WON'T invoke onSelectedTagChange callback.
   * */
  unselect(index) {
    if (index < this._tags.length) {
      this._tags[index] && this._tags[index].clearState();

      this.setState(state => {
        let copy = state.tagFlags;
        copy[index] = false;
        return {tagFlags: copy}
      });
    }
  }

  /**
   * Get the index array of the selected Tag(s), return -1 if no Tag is selected.
   * */
  getSelectedIndex() {
    let selected = this.state.tagFlags.map((item, index) => {
      if (item) return index;
      else return -1;
    }).filter(item => item > -1);

    if (selected.length) {
      return selected;
    }
    return -1;
  }

}


/** 
 * Tag component, you can also use it as a Button.
 * */
export class Tag extends Component {

  static propTypes = {
    // text to display
    text: PropTypes.string.isRequired,
    // callback function to invoke after Tag pressed
    onSelectStateChange: PropTypes.func,
    // whether to allow unselect
    allowUnselect: PropTypes.bool,
    // use TouchableOpacity instead of TouchableWithoutFeedback
    touchableOpacity: PropTypes.bool,
    // callback function when Tag is used as a button
    onPress: PropTypes.func,
  };

  static defaultProps = {
    text: 'Tag',
    onSelectStateChange: () => console.log('Tag onSelectStateChange not set.'),
    allowUnselect: false,
    tintColor: '#FCDB29',
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  render() {
    const {
      tintColor,
      tagStyle,
      activeTagStyle,
      textStyle,
      activeTextStyle,
      onPress,
      touchableOpacity
    } = this.props;

    const textComponent = 
      <Text style={[styles.textStyle, textStyle].concat(
              this.state.selected ? (activeTextStyle || styles.selectedTextStyle) : null)}>
        {this.props.text}
      </Text>;
    
    const content = 
      <View style={[styles.tagBackground, {borderColor: tintColor}, tagStyle].concat(
              this.state.selected ? (activeTagStyle || {backgroundColor: tintColor}) : null)}>
        {
          tagStyle && activeTagStyle ? <View>{textComponent}</View> : textComponent
        }
      </View>
    if (touchableOpacity) {
      return <TouchableOpacity onPress={onPress || this._onTagPress}>{content}</TouchableOpacity>
    }
    return <TouchableWithoutFeedback onPress={onPress || this._onTagPress}>{content}</TouchableWithoutFeedback>
  }

  _onTagPress = () => {
    this.setState(state => {

      this.props.onSelectStateChange();

      if (this.props.allowUnselect) {
        return {selected: true};
      }
      return {selected: !state.selected};
    })
  }

  clearState() {
    this.state.selected && this.setState({selected: false});
  }

  setSelected() {
    !this.state.selected && this.setState({selected: true});
  }
}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },

  tagBackground: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  textStyle: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  selectedTextStyle: {
    color: '#333',
  },
});