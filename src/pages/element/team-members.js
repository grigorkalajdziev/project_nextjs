import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SectionTitleTwo } from "../../components/SectionTitle";
import { FaFacebookF, FaGooglePlusG, FaTwitter } from "react-icons/fa";
import teamData from "../../data/team-members/team-one.json";

const TeamMembers = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Team Members"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>Team Members</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <SectionTitleTwo title="Creative team" subtitle="STYLE 01" />
        <div className="team-member-area space-mb--r100">
          <Container>
            <Row className="space-mb--m30">
              {teamData &&
                teamData.map((single, i) => {
                  return (
                    <Col lg={3} md={4} className="space-mb--30" key={i}>
                      <div className="single-team-member text-center">
                        <div className="member-image">
                          <img
                            src={process.env.PUBLIC_URL + single.image}
                            className="img-fluid"
                            alt=""
                          />
                          <div className="social-inside">
                            <ul className="social-list">
                              <li className="social-list__item">
                                <a href={single.facebookUrl} target="_blank">
                                  <FaFacebookF />
                                </a>
                              </li>
                              <li className="social-list__item">
                                <a href={single.googlePlusUrl} target="_blank">
                                  <FaGooglePlusG />
                                </a>
                              </li>
                              <li className="social-list__item">
                                <a href={single.twitterUrl} target="_blank">
                                  <FaTwitter />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="member-caption">
                          <h2 className="name">{single.name}</h2>
                          <span className="subtext">{single.designation}</span>
                        </div>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </Container>
        </div>
        <SectionTitleTwo title="Creative team" subtitle="STYLE 02" />
        <div className="team-member-area">
          <Container className="wide">
            <Row className="space-mb--m30">
              {teamData &&
                teamData.map((single, i) => {
                  return (
                    <Col lg={3} md={4} className="space-mb--30" key={i}>
                      <div className="single-team-member single-team-member--style-square">
                        <div className="member-image">
                          <img
                            src={process.env.PUBLIC_URL + single.image}
                            className="img-fluid"
                            alt=""
                          />
                          <div className="social-inside">
                            <ul className="social-list">
                              <li className="social-list__item">
                                <a href={single.facebookUrl} target="_blank">
                                  <FaFacebookF />
                                </a>
                              </li>
                              <li className="social-list__item">
                                <a href={single.googlePlusUrl} target="_blank">
                                  <FaGooglePlusG />
                                </a>
                              </li>
                              <li className="social-list__item">
                                <a href={single.twitterUrl} target="_blank">
                                  <FaTwitter />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="member-caption">
                          <h2 className="name">{single.name}</h2>
                          <span className="subtext">{single.designation}</span>
                        </div>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default TeamMembers;
