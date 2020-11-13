import './App.css';
import SynchronizedVideo from './components/SynchronizedVideo';

import 'bootstrap/dist/css/bootstrap.min.css';

const { Component } = require("react");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: '00:00:00,000',
      thumbnailData: [],
      subtitleData: [],
    }
  }

  componentDidMount() {
    // Load data where we need it
    console.log("Fetching thumbnails")
    fetch(process.env.PUBLIC_URL + '/thumbnails.json')
      .then(res => {
        return res.json()})
      .then((result) => {
        console.log("Done thumbnails");
        this.setState(
          {
            thumbnailData: result.map((x, i) => {
              x.img = process.env.PUBLIC_URL + '/' + x.img;
              return x;
            })
          }
        );
        return fetch(process.env.PUBLIC_URL + '/subtitles.json')
      })
      .then(res => res.json())
      .then((result) => {
        console.log("Done subtitles");
        this.setState(
          {
            subtitleData: result
          }
        )
      });
  }
  

  render() {
    return <div className="App">
      <SynchronizedVideo 
        videoId="zrKf90xm-54" 
        subtitles={this.state.subtitleData}
        thumbnails={this.state.thumbnailData}
        header="Talk: Preparatory eye movements reveal prior knowledge and intended interaction in VR">
      </SynchronizedVideo>
    </div>
  };
}

export default App;
