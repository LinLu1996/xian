import './index.less';
import { Component } from 'react';

class Stretching extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isdrawing: 0,
      coordinate: {
        x: 0
      },
      change: {
        x: 0
      },
      width: props.minWidth
    };
  }
  width() {
    const { minWidth, maxWidth } = this.props;
    const { width, change } = this.state;
    let nwidth = width + change.x;
    if (nwidth < minWidth) {
      nwidth = minWidth;
    }else if (nwidth > maxWidth) {
      nwidth = maxWidth;
    }
    return nwidth;
  }
  componentDidMount() {
    document.body.onmousemove = (event) => {
      const {isdrawing, coordinate} = this.state;
      if(isdrawing) {
        this.setState({
          change:{
            x: event.clientX - coordinate.x
          }
        });
      }
    };
    document.body.onmouseup = () => {
      document.body.classList.remove("user-select-none");
      this.setState({
        isdrawing: 0,
        width: this.width(),
        change: {
          x: 0
        }
      });
    };
  }
  onMouseDown(event) {
    document.body.classList.add("user-select-none");
    this.setState({
      isdrawing: 1,
      coordinate: {
        x: event.clientX
      }
    });
  }
  render() {
    const { minWidth, maxWidth } = this.props;
    const option = {
      className: "stretching",
      style: {
        minWidth: minWidth,
        maxWidth: maxWidth,
        padding: "0 2px 0 0",
        width: this.width()
      },
      ref: (self) => {this.box = self;}
    };
    return <div {...option}>
      <div style={{width:"100%",height:"100%",padding: 10}}>
        {this.props.children}
      </div>
      <div className="right-bar" onMouseDown={this.onMouseDown.bind(this)}></div>
    </div>;
  }
}

export default Stretching;