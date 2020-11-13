import PropTypes from 'prop-types';

import './SubtitleScrubber.css'

import React from 'react';

const { Component } = require("react");


class SubtitleScrubber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0
    }
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.resetInt = setInterval(() => this.resetScroll(), 2000);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.currentTime !== prevProps.currentTime) {
      let newCurrentIndex = this.findCurrentSubtitle(this.props.currentTime);
      if(newCurrentIndex !== this.state.currentIndex) {
        this.setState({currentIndex: newCurrentIndex});
      }
    }
  }

  handleClick(currentIndex) {
    this.setState({currentIndex: currentIndex});
    if(this.props.onChange) {
      this.props.onChange({target: this.props.subtitles[currentIndex]});
    }
  }

  findCurrentSubtitle(time) {
    // This is O(N) but could be O(1) with a hashmap.
    let found = -1;
    for(var i = 0; i < this.props.subtitles.length; i++) {
      if(time >= this.props.subtitles[i].ts_start && 
         time < this.props.subtitles[i].ts_end) {
        found = i;
      }
    }
    return found;
  }

  resetScroll() {
    // Check when it's time to reset the scroll
    if(this.locked) {
      return;
    }    

    let currentSelection = this.ref.current.querySelector('.subtitle-current');
    if(currentSelection != null) {
      let scrollTop = currentSelection.offsetTop;
      this.ref.current.scrollTop = Math.max(scrollTop - 50);
    }
  }

  setLocked() {
    this.locked = true;
    clearTimeout(this.lockTimeout);
    this.lockTimeout = setTimeout(() => {this.locked = false}, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.lockTimeout);
    clearInterval(this.resetInt);
  }

  render() {
    return <ol class="subtitle-scrubber" onScroll={() => this.setLocked()} ref={this.ref}>
      {this.props.subtitles.map((value, index) => {
        return (
          <span>
          <li key={index} 
              className={index === this.state.currentIndex ? 'subtitle subtitle-current' : 'subtitle'}
              onClick={() => this.handleClick(index)}
              >
              {value.text}
              </li>
              {index < this.props.subtitles.length - 1 ? "·": ""}
          </span>
        )
      })}
    </ol>
  }
}

SubtitleScrubber.propTypes = {
  subtitles: PropTypes.array,
  currentTime: PropTypes.string,
  onChange: PropTypes.func
}

export default SubtitleScrubber;