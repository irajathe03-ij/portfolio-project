import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
    const [about, setAbout] = useState(null);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);

    // Experience states
    const [experience, setExperience] = useState([]);
    const [experienceLoading, setExperienceLoading] = useState(true);
    const [experienceError, setExperienceError] = useState("");

    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [blogs, setBlogs] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [messageStatus, setMessageStatus] = useState("");

    // =========================
    // FETCH ABOUT
    // =========================
    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await api.get("/about");
                setAbout(response.data.data[0]);
            } catch (error) {
                console.error("Error fetching about:", error);
            }
        };

        fetchAbout();
    }, []);

    // =========================
    // FETCH SERVICES
    // =========================
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get("/services");
                setServices(response.data.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);

    // =========================
    // FETCH SKILLS
    // =========================
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get("/skills");
                setSkills(response.data.data);
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };

        fetchSkills();
    }, []);

    // =========================
    // FETCH TESTIMONIALS
    // =========================
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get("/testimonials");
                setTestimonials(response.data.data);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            }
        };

        fetchTestimonials();
    }, []);

    // =========================
    // FETCH BLOGS
    // =========================
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get("/blogs");
                setBlogs(response.data.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    // =========================
    // FETCH PROJECTS
    // =========================
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/projects");
                setProjects(response.data.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    // =========================
    // FETCH EXPERIENCE
    // =========================
    useEffect(() => {
        const fetchExperience = async () => {
            try {
                setExperienceLoading(true);
                setExperienceError("");

                const response = await api.get("/experience");

                console.log(
                    "Experience API response:",
                    response.data
                );

                if (
                    response.data?.success &&
                    Array.isArray(response.data.data)
                ) {
                    setExperience(response.data.data);
                } else {
                    setExperience([]);
                    setExperienceError(
                        "Unable to load experience data."
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching experience:",
                    error
                );

                setExperience([]);
                setExperienceError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load experience."
                );
            } finally {
                setExperienceLoading(false);
            }
        };

        fetchExperience();
    }, []);

    // =========================
    // CONTACT FORM
    // =========================
    const handleContactSubmit = async (event) => {
        event.preventDefault();

        try {
            await api.post("/messages", formData);

            setMessageStatus(
                "Message sent successfully! ❤️"
            );

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error(
                "Error sending message:",
                error
            );

            setMessageStatus(
                "Unable to send message. Please try again."
            );
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #fce7f3, #ede9fe, #dbeafe)",
            }}
        >
            {/* =========================
                NAVBAR
            ========================= */}
            <nav
                style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: "#7c3aed",
                    }}
                >
                    Ira Jathe
                </h2>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#skills">Skills</a>
                    <a href="#projects">Projects</a>
                    <a href="#experience">
                        Experience
                    </a>
                    <a href="#services">Services</a>
                    <a href="#testimonials">
                        Testimonials
                    </a>
                    <a href="#blogs">Blogs</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>

            {/* =========================
                HERO
            ========================= */}
            <section
                id="home"
                style={{
                    minHeight: "80vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "60px 20px",
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: "20px",
                            color: "#7c3aed",
                        }}
                    >
                        Hello, I'm
                    </p>

                    <h1
                        style={{
                            fontSize:
                                "clamp(40px, 10vw, 60px)",
                            color: "#1e293b",
                            margin: "10px 0",
                        }}
                    >
                        Ira Jathe
                    </h1>

                    <h2
                        style={{
                            fontSize:
                                "clamp(22px, 6vw, 30px)",
                            color: "#7c3aed",
                        }}
                    >
                        Computer Science Engineer
                    </h2>

                    <p
                        style={{
                            fontSize: "18px",
                            color: "#475569",
                            maxWidth: "650px",
                            margin: "20px auto",
                            lineHeight: "1.7",
                        }}
                    >
                        I build modern web applications using
                        React, Java, Spring Boot, Node.js,
                        Express.js and MySQL.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px",
                            marginTop: "30px",
                            flexWrap: "wrap",
                        }}
                    >
                        <a
                            href="#projects"
                            style={buttonStyle}
                        >
                            View My Projects
                        </a>

                        <a
                            href="#contact"
                            style={{
                                ...buttonStyle,
                                background: "white",
                                color: "#7c3aed",
                                border:
                                    "2px solid #7c3aed",
                            }}
                        >
                            Contact Me
                        </a>

                        <a
                            href="/resume/Ira-Jathe-Resume.pdf"
                            download
                            style={{
                                ...buttonStyle,
                                background: "#dbeafe",
                                color: "#2563eb",
                            }}
                        >
                            Download CV
                        </a>
                    </div>
                </div>
            </section>

            {/* =========================
                ABOUT
            ========================= */}
            <section
                id="about"
                style={{
                    background:
                        "rgba(255, 255, 255, 0.75)",
                    padding: "80px 20px",
                }}
            >
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto",
                        textAlign: "center",
                    }}
                >
                    <h2 style={sectionTitleStyle}>
                        About Me
                    </h2>

                    {about ? (
                        <>
                            <h3
                                style={{
                                    color: "#7c3aed",
                                    fontSize: "26px",
                                    marginBottom: "20px",
                                }}
                            >
                                {about.title}
                            </h3>

                            <p style={paragraphStyle}>
                                {about.description}
                            </p>
                        </>
                    ) : (
                        <p style={paragraphStyle}>
                            Loading about information...
                        </p>
                    )}
                </div>
            </section>

            {/* =========================
                SKILLS
            ========================= */}
            <section
                id="skills"
                style={{
                    padding: "80px 20px",
                    textAlign: "center",
                }}
            >
                <h2 style={sectionTitleStyle}>
                    My Skills
                </h2>

                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "20px",
                    }}
                >
                    {skills.length > 0 ? (
                        skills.map((skill) => (
                            <div
                                key={skill.id}
                                style={skillStyle}
                            >
                                {skill.name}
                            </div>
                        ))
                    ) : (
                        <p style={paragraphStyle}>
                            Loading skills...
                        </p>
                    )}
                </div>
            </section>

            {/* =========================
                PROJECTS
            ========================= */}
            <section
                id="projects"
                style={{
                    background:
                        "rgba(255, 255, 255, 0.75)",
                    padding: "80px 20px",
                }}
            >
                <h2
                    style={{
                        ...sectionTitleStyle,
                        textAlign: "center",
                    }}
                >
                    My Projects
                </h2>

                <div
                    style={{
                        maxWidth: "1000px",
                        margin: "40px auto 0",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "30px",
                    }}
                >
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                style={projectCardStyle}
                            >
                                <h3
                                    style={projectTitleStyle}
                                >
                                    {project.title}
                                </h3>

                                <p
                                    style={
                                        projectDescriptionStyle
                                    }
                                >
                                    {project.description}
                                </p>

                                <p
                                    style={
                                        technologyStyle
                                    }
                                >
                                    <strong>
                                        Technologies:
                                    </strong>{" "}
                                    {project.technologies}
                                </p>

                                {project.github_url && (
                                    <a
                                        href={
                                            project.github_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={
                                            projectButtonStyle
                                        }
                                    >
                                        GitHub
                                    </a>
                                )}

                                {project.live_url && (
                                    <a
                                        href={
                                            project.live_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            ...projectButtonStyle,
                                            marginLeft:
                                                "10px",
                                            marginTop:
                                                "10px",
                                        }}
                                    >
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={paragraphStyle}>
                            Loading projects...
                        </p>
                    )}
                </div>
            </section>

            {/* =========================
                EXPERIENCE
            ========================= */}
            <section
                id="experience"
                style={{
                    padding: "80px 20px",
                    textAlign: "center",
                }}
            >
                <h2 style={sectionTitleStyle}>
                    Experience
                </h2>

                <div
                    style={{
                        maxWidth: "900px",
                        margin: "40px auto 0",
                    }}
                >
                    {experienceLoading ? (
                        <p style={paragraphStyle}>
                            Loading experience...
                        </p>
                    ) : experienceError ? (
                        <p
                            style={{
                                ...paragraphStyle,
                                color: "#dc2626",
                            }}
                        >
                            {experienceError}
                        </p>
                    ) : experience.length > 0 ? (
                        experience.map((item) => (
                            <div
                                key={item.id}
                                style={experienceCardStyle}
                            >
                                <h3
                                    style={
                                        experienceTitleStyle
                                    }
                                >
                                    {item.title}
                                </h3>

                                <h4
                                    style={
                                        experienceCompanyStyle
                                    }
                                >
                                    {item.company}
                                </h4>

                                <p
                                    style={
                                        experienceDateStyle
                                    }
                                >
                                    {item.start_date
                                        ? new Date(
                                              item.start_date
                                          ).toLocaleDateString(
                                              "en-IN"
                                          )
                                        : ""}
                                    {" - "}
                                    {item.end_date
                                        ? new Date(
                                              item.end_date
                                          ).toLocaleDateString(
                                              "en-IN"
                                          )
                                        : "Present"}
                                </p>

                                <p
                                    style={
                                        experienceDescriptionStyle
                                    }
                                >
                                    {item.description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p style={paragraphStyle}>
                            No experience added yet.
                        </p>
                    )}
                </div>
            </section>

            {/* =========================
                SERVICES
            ========================= */}
            <section
                id="services"
                style={{
                    background:
                        "rgba(255, 255, 255, 0.75)",
                    padding: "80px 20px",
                    textAlign: "center",
                }}
            >
                <h2 style={sectionTitleStyle}>
                    My Services
                </h2>

                <p
                    style={{
                        color: "#475569",
                        fontSize: "18px",
                        marginBottom: "40px",
                    }}
                >
                    What I can build and help with
                </p>

                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "25px",
                    }}
                >
                    {services.length > 0 ? (
                        services.map((service) => (
                            <div
                                key={service.id}
                                style={serviceCardStyle}
                            >
                                <div
                                    style={serviceIconStyle}
                                >
                                    {service.icon || "💻"}
                                </div>

                                <h3
                                    style={
                                        serviceTitleStyle
                                    }
                                >
                                    {service.title}
                                </h3>

                                <p
                                    style={
                                        serviceDescriptionStyle
                                    }
                                >
                                    {service.description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p style={paragraphStyle}>
                            Loading services...
                        </p>
                    )}
                </div>
            </section>

            {/* =========================
                TESTIMONIALS
            ========================= */}
            <section
                id="testimonials"
                style={{
                    padding: "80px 20px",
                    textAlign: "center",
                }}
            >
                <h2 style={sectionTitleStyle}>
                    Testimonials
                </h2>

                <p
                    style={{
                        color: "#475569",
                        fontSize: "18px",
                        marginBottom: "40px",
                    }}
                >
                    What people say about my work
                </p>

                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "25px",
                    }}
                >
                    {testimonials.length > 0 ? (
                        testimonials.map(
                            (testimonial) => (
                                <div
                                    key={testimonial.id}
                                    style={
                                        testimonialCardStyle
                                    }
                                >
                                    <p
                                        style={
                                            testimonialMessageStyle
                                        }
                                    >
                                        "
                                        {
                                            testimonial.message
                                        }
                                        "
                                    </p>

                                    <h3
                                        style={
                                            testimonialNameStyle
                                        }
                                    >
                                        {testimonial.name}
                                    </h3>

                                    <p
                                        style={
                                            testimonialRoleStyle
                                        }
                                    >
                                        {testimonial.role}
                                    </p>
                                </div>
                            )
                        )
                    ) : (
                        <p style={paragraphStyle}>
                            Loading testimonials...
                        </p>
                    )}
                </div>
            </section>

            {/* =========================
                BLOGS
            ========================= */}
            <section
                id="blogs"
                style={{
                    background:
                        "rgba(255, 255, 255, 0.75)",
                    padding: "80px 20px",
                    textAlign: "center",
                }}
            >
                <h2 style={sectionTitleStyle}>
                    My Blogs
                </h2>

                <p
                    style={{
                        color: "#475569",
                        fontSize: "18px",
                        marginBottom: "40px",
                    }}
                >
                    Articles and things I have learned
                </p>

                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "25px",
                    }}
                >
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div
                                key={blog.id}
                                style={blogCardStyle}
                            >
                                <h3 style={blogTitleStyle}>
                                    {blog.title}
                                </h3>

                                <p
                                    style={
                                        blogDescriptionStyle
                                    }
                                >
                                    {blog.excerpt ||
                                        blog.content}
                                </p>

                                <span
                                    style={blogTagStyle}
                                >
                                    Blog
                                </span>
                            </div>
                        ))
                    ) : (
                        <p style={paragraphStyle}>
                            Loading blogs...
                        </p>
                    )}
                </div>
            </section>

            {/* =========================
                CONTACT
            ========================= */}
            <section
                id="contact"
                style={{
                    padding: "80px 20px",
                    textAlign: "center",
                }}
            >
                <h2 style={sectionTitleStyle}>
                    Contact Me
                </h2>

                <p
                    style={{
                        color: "#475569",
                        fontSize: "18px",
                        marginBottom: "40px",
                    }}
                >
                    Have a project or opportunity? Let's
                    connect.
                </p>

                <div style={contactContainerStyle}>
                    <form
                        style={contactFormStyle}
                        onSubmit={handleContactSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    name: event.target.value,
                                })
                            }
                            style={inputStyle}
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    email: event.target.value,
                                })
                            }
                            style={inputStyle}
                        />

                        <input
                            type="text"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    subject:
                                        event.target.value,
                                })
                            }
                            style={inputStyle}
                        />

                        <textarea
                            placeholder="Your Message"
                            rows="6"
                            value={formData.message}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    message:
                                        event.target.value,
                                })
                            }
                            style={inputStyle}
                        ></textarea>

                        <button
                            type="submit"
                            style={contactButtonStyle}
                        >
                            Send Message
                        </button>

                        {messageStatus && (
                            <p
                                style={{
                                    marginTop: "15px",
                                    color: "#475569",
                                }}
                            >
                                {messageStatus}
                            </p>
                        )}
                    </form>

                    <div style={contactInfoStyle}>
                        <h3
                            style={contactInfoTitleStyle}
                        >
                            Let's Connect
                        </h3>

                        <p>
                            📧 Email:
                            ira.jathe@example.com
                        </p>

                        <p>
                            💻 GitHub:
                            irajathe03-ij
                        </p>

                        <p>
                            🔗 LinkedIn:
                            Ira Jathe
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================
                FOOTER
            ========================= */}
            <footer
                style={{
                    background: "#312e81",
                    color: "white",
                    padding: "40px 20px",
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        margin: "0 0 10px",
                        fontSize: "28px",
                    }}
                >
                    Ira Jathe
                </h2>

                <p
                    style={{
                        margin: "0 0 20px",
                        color: "#e0e7ff",
                        fontSize: "16px",
                    }}
                >
                    Computer Science Engineer | Full Stack
                    Developer
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginBottom: "25px",
                    }}
                >
                    <a
                        href="https://github.com/irajathe03-ij"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        GitHub
                    </a>

                    <a
                        href="https://linkedin.com/in/ira-jathe-797391320"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        LinkedIn
                    </a>
                </div>

                <p
                    style={{
                        margin: 0,
                        color: "#c7d2fe",
                        fontSize: "14px",
                    }}
                >
                    © 2026 Ira Jathe. All rights reserved.
                </p>

                <p
                    style={{
                        margin: "10px 0 0",
                        color: "#c7d2fe",
                        fontSize: "14px",
                    }}
                >
                    Built with React.js
                </p>
            </footer>
        </div>
    );
}

/* =========================
   STYLES
========================= */

const sectionTitleStyle = {
    fontSize: "clamp(30px, 7vw, 40px)",
    color: "#7c3aed",
    marginBottom: "30px",
};

const paragraphStyle = {
    fontSize: "18px",
    color: "#475569",
    lineHeight: "1.8",
    marginBottom: "20px",
};

const skillStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "18px 28px",
    borderRadius: "30px",
    color: "#7c3aed",
    fontSize: "17px",
    fontWeight: "bold",
    boxShadow:
        "0 5px 15px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e9d5ff",
};

const buttonStyle = {
    background: "#7c3aed",
    color: "white",
    padding: "14px 28px",
    borderRadius: "30px",
    textDecoration: "none",
    fontWeight: "bold",
};

const projectCardStyle = {
    background: "white",
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
        "0 8px 25px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
};

const projectTitleStyle = {
    fontSize: "28px",
    color: "#7c3aed",
    marginTop: 0,
};

const projectDescriptionStyle = {
    fontSize: "17px",
    color: "#475569",
    lineHeight: "1.7",
};

const technologyStyle = {
    fontSize: "15px",
    color: "#64748b",
    margin: "20px 0",
};

const projectButtonStyle = {
    display: "inline-block",
    background: "#ede9fe",
    color: "#7c3aed",
    padding: "10px 18px",
    borderRadius: "20px",
    textDecoration: "none",
    fontWeight: "bold",
};

const experienceCardStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "clamp(20px, 5vw, 30px)",
    borderRadius: "20px",
    marginBottom: "25px",
    textAlign: "left",
    boxShadow:
        "0 8px 25px rgba(0, 0, 0, 0.08)",
};

const experienceTitleStyle = {
    color: "#7c3aed",
    fontSize: "25px",
    marginTop: 0,
};

const experienceCompanyStyle = {
    color: "#334155",
    fontSize: "18px",
};

const experienceDateStyle = {
    color: "#64748b",
    fontSize: "15px",
};

const experienceDescriptionStyle = {
    color: "#475569",
    lineHeight: "1.7",
    fontSize: "17px",
};

const serviceCardStyle = {
    background: "white",
    width: "100%",
    maxWidth: "300px",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
        "0 8px 25px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
};

const serviceIconStyle = {
    fontSize: "45px",
    marginBottom: "15px",
};

const serviceTitleStyle = {
    color: "#7c3aed",
    fontSize: "22px",
    marginBottom: "15px",
};

const serviceDescriptionStyle = {
    color: "#475569",
    fontSize: "16px",
    lineHeight: "1.7",
};

const testimonialCardStyle = {
    background: "white",
    width: "100%",
    maxWidth: "300px",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
        "0 8px 25px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
};

const testimonialMessageStyle = {
    color: "#475569",
    fontSize: "17px",
    lineHeight: "1.7",
    fontStyle: "italic",
};

const testimonialNameStyle = {
    color: "#7c3aed",
    fontSize: "20px",
    marginTop: "25px",
    marginBottom: "5px",
};

const testimonialRoleStyle = {
    color: "#64748b",
    fontSize: "15px",
    margin: 0,
};

const blogCardStyle = {
    background: "white",
    width: "100%",
    maxWidth: "300px",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
        "0 8px 25px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
    textAlign: "left",
};

const blogTitleStyle = {
    color: "#7c3aed",
    fontSize: "22px",
    lineHeight: "1.4",
    marginTop: 0,
};

const blogDescriptionStyle = {
    color: "#475569",
    fontSize: "16px",
    lineHeight: "1.7",
};

const blogTagStyle = {
    display: "inline-block",
    background: "#fce7f3",
    color: "#7c3aed",
    padding: "7px 14px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "10px",
};

const contactContainerStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "40px",
    alignItems: "flex-start",
};

const contactFormStyle = {
    background: "white",
    width: "100%",
    maxWidth: "500px",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
        "0 8px 25px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
};

const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid #ddd6fe",
    boxSizing: "border-box",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
};

const contactButtonStyle = {
    background: "#7c3aed",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "30px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
};

const contactInfoStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    width: "300px",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
        "0 8px 25px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
    textAlign: "left",
    color: "#475569",
    lineHeight: "1.8",
};

const contactInfoTitleStyle = {
    color: "#7c3aed",
    fontSize: "24px",
    marginTop: 0,
};

export default App;