import { Component } from "react";
import PropTypes from 'prop-types';
import './ThumbnailSelector.css';

class ThumbnailSelector extends Component {
  handleClick(payload) {
    if(this.props.onChange != null) {
        this.props.onChange({target: payload});
    }
  }

  render() {
    if(this.props.thumbnails != null) {
      return <ol class="thumbnail-selector">
        {this.props.thumbnails.map((x, i) => {
          return <li class="thumbnail" key={i} onClick={() => this.handleClick(x)}>
                  <img class="thumbnail-img" src={x.img} alt="thumbnail" />
                  <span class="timing">
                      {x.ts_start.substr(0, 8)}
                  </span>
                  </li>
        })}
      </ol>
    }
    else {
      return <ol></ol>
    }
  }
}

ThumbnailSelector.propTypes = {
  thumbnails: PropTypes.array,
  onChange: PropTypes.func
}

export default ThumbnailSelector;