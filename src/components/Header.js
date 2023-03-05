import React from "react";

// reactstrap components
import {
  NavbarBrand,
  Navbar,
  Container,
  Row,
  Col,
} from "reactstrap";

// Core Components

function Header() {
  return (
    <>
      <header className="header-4 skew-separator">
        <div className="header-wrapper">
          <Navbar className="navbar-transparent" expand="lg">
            <Container>
              <div className="navbar-translate">
                <NavbarBrand
                  className="text-white"
                  onClick={(e) => e.preventDefault()}
                >
                  <img src="https://www.mweb.co.za/_next/image?url=https%3A%2F%2Fwww.mweb.co.za%2Fmedia%2Fimages%2Fmweb-logo-2020-white.png&w=1920&q=75" alt="MWEB"/>
                </NavbarBrand>
             
              </div>
            
            </Container>
          </Navbar>
          <div className="page-header header-video">
            <div className="overlay"></div>
            <video
              autoPlay="autoPlay"
              loop="loop"
              muted="muted"
              playsInline="playsInline"
            >
              <source
                src={require("../assets/videos/Lights - 26607.mp4")}
                type="video/mp4"
              ></source>
            </video>
            <Container className="text-center">
              <Row>
                <Col className="mx-auto" lg="7">
                  <h1 className="video-text">MWEB Reimagined</h1>
                  <h1 className="display-3 text-orange">
                    The time is now
                  </h1>
                  
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
