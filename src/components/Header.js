import React, { Component } from "react";
import Typical from "react-typical";
import ParticleBackground from "./ParticleBackground";

class Header extends Component {
  titles = [];

  render() {
    if (this.props.sharedData) {
      var name = this.props.sharedData.name;
      this.titles = this.props.sharedData.titles
        .map((x) => [x.toUpperCase(), 1500])
        .flat();
    }

    const HeaderTitleTypeAnimation = React.memo(
      () => {
        return (
          <Typical className="title-styles" steps={this.titles} loop={50} />
        );
      },
      (props, prevProp) => true
    );

    return (
      <header
        id="home"
        style={{ height: window.innerHeight - 140, display: "block", position: "relative" }}
      >
        <ParticleBackground />
        <div className="row aligner" style={{ height: "100%", position: "relative", zIndex: 2 }}>
          <div className="col-md-12">
            <div>
              <span
                className="iconify header-icon"
                data-icon="noto:rocket"
                data-inline="false"
                style={{ animation: "bounce 2s ease-in-out infinite" }}
              ></span>
              <br />
              <h1
                className="mb-0"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                }}
              >
                <Typical steps={[name]} wrapper="p" />
              </h1>
              <div className="title-container">
                <HeaderTitleTypeAnimation />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
