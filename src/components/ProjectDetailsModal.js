import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "../scss/light-slider.scss";
import AwesomeSliderStyles2 from "../scss/dark-slider.scss";
import "react-awesome-slider/dist/custom-animations/scale-out-animation.css";
class ProjectDetailsModal extends Component {
  render() {
    if (this.props.data) {
      const technologies = this.props.data.technologies;
      const images = this.props.data.images;
      var title = this.props.data.title;
      var description = this.props.data.description;
      var url = this.props.data.url;
      if (this.props.data.technologies) {
        var tech = technologies.map((icons, i) => {
          return (
            <li className="list-inline-item mx-3" key={i}>
              <span>
                <div className="text-center">
                  <i className={icons.class} style={{ fontSize: "300%" }}>
                    <p className="text-center" style={{ fontSize: "30%" }}>
                      {icons.name}
                    </p>
                  </i>
                </div>
              </span>
            </li>
          );
        });
        if (this.props.data.images) {
          var img = images.map((elem, i) => {
            return <div key={i} data-src={elem} />;
          });
        }
      }
    }
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-inside"
      >
        <span onClick={this.props.onHide} className="modal-close">
          <i className="fas fa-times fa-3x close-icon"></i>
        </span>
        <div className="col-md-12">
          <div className="col-md-10 mx-auto" style={{ paddingBottom: "50px" }}>
            <div className="slider-tab">
              <span
                className="iconify slider-iconfiy"
                data-icon="emojione:red-circle"
                data-inline="false"
                style={{ marginLeft: "5px" }}
              ></span>{" "}
              &nbsp;{" "}
              <span
                className="iconify slider-iconfiy"
                data-icon="twemoji:yellow-circle"
                data-inline="false"
              ></span>{" "}
              &nbsp;{" "}
              <span
                className="iconify slider-iconfiy"
                data-icon="twemoji:green-circle"
                data-inline="false"
              ></span>
            </div>
            <AwesomeSlider
              cssModule={[AwesomeSliderStyles, AwesomeSliderStyles2]}
              animation="scaleOutAnimation"
              className="slider-image"
            >
              {img}
            </AwesomeSlider>
          </div>
          <div className="col-md-10 mx-auto">
            <h3 style={{ padding: "5px 5px 0 5px" }}>
              {title}
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-href"
                >
                  <i
                    className="fas fa-external-link-alt"
                    style={{ marginLeft: "10px" }}
                  ></i>
                </a>
              ) : null}
            </h3>
            <div className="modal-description">
              {description &&
                description.split("\n").map((paragraph, index) => {
                  // Check if it's an achievements section
                  if (
                    paragraph.includes("🏆") ||
                    paragraph.includes("ACHIEVEMENTS")
                  ) {
                    return (
                      <div key={index} className="achievements-section">
                        <h5 className="section-subtitle">{paragraph}</h5>
                      </div>
                    );
                  }
                  // Check if it's a media coverage section
                  else if (
                    paragraph.includes("📰") ||
                    paragraph.includes("Media Coverage") ||
                    paragraph.includes("傳媒報導")
                  ) {
                    const parts = paragraph.split(":");
                    if (parts.length > 1) {
                      return (
                        <div key={index} className="media-section">
                          <h5 className="section-subtitle">{parts[0]}:</h5>
                          <a
                            href={parts[1].trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="media-link"
                          >
                            {parts[1].trim()}
                          </a>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="media-section">
                        {paragraph}
                      </div>
                    );
                  }
                  // Check if it's a participation history section
                  else if (
                    paragraph.includes("💡") ||
                    paragraph.includes("參賽歷程")
                  ) {
                    return (
                      <div key={index} className="history-section">
                        <h5 className="section-subtitle">{paragraph}</h5>
                      </div>
                    );
                  }
                  // Check if it's a bullet point
                  else if (paragraph.trim().startsWith("•")) {
                    return (
                      <div key={index} className="achievement-item">
                        {paragraph}
                      </div>
                    );
                  }
                  // Regular paragraph
                  else if (paragraph.trim()) {
                    return (
                      <p key={index} className="description-paragraph">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
            </div>
            <div className="col-md-12 text-center">
              <ul className="list-inline mx-auto">{tech}</ul>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ProjectDetailsModal;
