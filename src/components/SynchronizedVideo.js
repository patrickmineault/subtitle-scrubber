import { Component } from 'react';
import YouTube from 'react-youtube';
import PropTypes from 'prop-types';
import SubtitleScrubber from './SubtitleScrubber';
import { Container, Row, Col } from 'react-bootstrap';
import ThumbnailSelector from './ThumbnailSelector';

const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time / 60) % 60);
    const secs = Math.floor(time % 60);

    return (String(hours).padStart(2, '0') + ':' +
        String(mins).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0') + ',' + 
        String(Math.floor((time * 1000) % 1000)).padStart(3, '0'));
}

const parseTime = (time) => {
    return (Number(time.substr(0, 2)) * 3600 + 
            Number(time.substr(3, 2)) * 60 +
            Number(time.substr(6, 2)) +
            Number(time.substr(9, 3)) / 1000);
}

class SynchronizedVideo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0.0
        }
    }

    startMonitoring(evt) {
      clearInterval(this.watch);
      this.watch = setInterval(
          () => {
              console.log("Setting time")
              this.setState(
                  { currentTime: this.videoPlayer.getCurrentTime() })
          }, 300)
    }

    stopMonitoring() {
        clearInterval(this.watch);
    }

    componentWillUnmount() {
        this.stopMonitoring();
    }

    handleScrub(evt) {
      console.log("Handle scrub");
      this.videoPlayer.seekTo(
          parseTime(evt.target.ts_start), true
      );
    }

    handleVideoReady(e) {
      this.videoPlayer = e.target;
    }

    render() {
        return <Container fluid>
                <Row>
                  <Col>
                  <h2>{this.props.header}</h2>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <YouTube
                      videoId={this.props.videoId}
                      onPlay={(evt) => this.startMonitoring(evt)}
                      onPause={this.stopMonitoring}
                      onStop={this.stopMonitoring}
                      onReady={(e) => this.handleVideoReady(e)}
                      opts={{playerVars: {rel: 0}}}
                    >
                    </YouTube>
                  </Col>
                  <Col>
                  <SubtitleScrubber 
                    subtitles={this.props.subtitles} 
                    currentTime={formatTime(this.state.currentTime)}
                    onChange={(evt) => this.handleScrub(evt)}
                        />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div>&nbsp;</div>
                    <ThumbnailSelector 
                      thumbnails={this.props.thumbnails} 
                      onChange={(evt) => this.handleScrub(evt)}
                  />
                  </Col>
                </Row>
              </Container>
    }
}

SynchronizedVideo.propTypes = {
    header: PropTypes.string,
    subtitles: PropTypes.array,
    thumbnails: PropTypes.array,
    videoId: PropTypes.string,
}

export default SynchronizedVideo;