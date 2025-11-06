

import React from "react";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";

const ProjectViewDetails = () => {
      return (
            <div className="container mt-4 mb-5">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold text-primary mb-0">Smart Education Transformation</h4>
                        <span className="badge bg-warning text-dark fs-6">In Progress</span>
                  </div>

                  {/* Single Project Details Card */}
                  <Card className="shadow-sm p-3">
                        {/* Top Info */}
                        <Row className="mb-3">
                              <Col md={4}>
                                    <p><strong>Project Code:</strong> PRJ-2025-002</p>
                                    <p><strong>Client:</strong> Ministry of Education</p>
                              </Col>
                              <Col md={4}>
                                    <p><strong>Start Date:</strong> 01/11/2025</p>
                                    <p><strong>End Date:</strong> 31/03/2026</p>
                              </Col>
                              <Col md={4}>
                                    <p><strong>Status:</strong> In Progress</p>
                                    <p><strong>Progress:</strong></p>
                                    <ProgressBar now={70} label="70%" />
                              </Col>
                        </Row>

                        <hr />

                        {/* Project Content */}
                        <div className="px-2">
                              <h6 className="fw-semibold text-primary mt-3">Introduction</h6>
                              <p>
                                    The *Shikshak Bharti 2025* initiative at **Kilbil School Satpur** represents a visionary step toward transforming the educational landscape of Maharashtra. Rooted in the belief that quality education begins with quality teachers, the project aims to establish a sustainable framework for **teacher recruitment, training, and professional development**. Kilbil School Satpur has long been recognized for its commitment to holistic learning, and this initiative reaffirms its role as a model institution in adopting digital governance, inclusive education, and modern pedagogy.

                                    Education today is not merely about literacy; it is about preparing learners for a rapidly evolving world shaped by technology, globalization, and environmental consciousness. Recognizing this paradigm shift, Kilbil School Satpur, under the Shikshak Bharti 2025 framework, seeks to **bridge the gap between traditional teaching practices and modern educational demands**. Through digital innovation, transparent recruitment, and continuous teacher capacity building, the initiative ensures that every student in Satpur receives not just education, but empowerment.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Vision and Objectives</h6>
                              <p>
                                    The vision of *Shikshak Bharti 2025 – Kilbil School Satpur* is to **build an ecosystem of competent, digitally empowered, and socially responsible educators.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Key Objectives</h6>
                              <ul>
                                    <li>Transparent teacher recruitment using a digital merit-based system.</li>
                                    <li>Continuous professional development through workshops and mentorship.
                                    </li>
                                    <li>Integration of NEP 2020 principles into classroom teaching.
                                    </li>
                                    <li>Strengthening school-community engagement in Satpur.</li>
                                    <li>Promoting inclusive and gender-sensitive education.</li>
                              </ul>

                              <h6 className="fw-semibold text-primary mt-3">Student-Centric Learning</h6>
                              <p>
                                    The focus is on experiential, interactive, and project-based learning methods
                                    encouraging creativity and problem-solving skills.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Teacher Training and Development</h6>
                              <p>
                                    Continuous professional training ensures teachers are well-equipped with
                                    modern tools, methodologies, and technological competence.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Infrastructure and Technology</h6>
                              <p>
                                    Development of smart classrooms, digital labs, and cloud-based systems to
                                    enhance accessibility, connectivity, and resource management.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Digital Recruitment System</h6>
                              <p>
                                    The school has implemented a **fully digital recruitment portal**, which includes: <br />
                                    - Online applications with document upload. <br />
                                    - AI-assisted screening for eligibility and credentials. <br />
                                    - Real-time updates for candidates. <br />
                                    - Video-based interviews. <br />
                                    - Digital merit list generation and appointment letters. <br />
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Inclusivity and Equal Opportunity</h6>
                              <p>
                                    Ensuring equal access to education regardless of background or ability through
                                    adaptive learning platforms and inclusive infrastructure.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Community and Parental Engagement</h6>
                              <p>
                                    Engaging parents and communities in student development through digital
                                    feedback systems and collaborative education events.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Monitoring and Evaluation</h6>
                              <p>
                                    Real-time tracking, analytics, and regular reviews to assess progress,
                                    improve delivery, and ensure data-driven decision-making.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Achievements</h6>
                              <ul>
                                    <li>100+ smart classrooms established across pilot schools.</li>
                                    <li>Digital attendance and progress tracking successfully implemented.</li>
                                    <li>50+ teacher upskilling workshops conducted.</li>
                              </ul>

                              <h6 className="fw-semibold text-primary mt-3">Future Plans</h6>
                              <p>
                                    Expansion to 500 schools nationwide, introduction of adaptive AI learning
                                    analytics, and collaborations with global education innovators.
                              </p>

                              <h6 className="fw-semibold text-primary mt-3">Conclusion</h6>
                              <p>
                                    This project represents a major step toward a modern, inclusive, and
                                    technology-driven education system, empowering both teachers and learners
                                    for the digital future.
                              </p>
                        </div>
                  </Card>
            </div>
      );
};

export default ProjectViewDetails;
