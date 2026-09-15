document.addEventListener("DOMContentLoaded", () => {
    
    // 1. TEMA CLARO/OSCURO
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const currentTheme = localStorage.getItem("theme") || "dark";
    
    const iconMoon = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`; 
    const iconSun = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`; 
  
    if (themeIcon) {
        if (currentTheme === "light") {
            document.body.classList.add("light-theme");
            themeIcon.innerHTML = iconSun;
        } else {
            themeIcon.innerHTML = iconMoon;
        }
    
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            let theme = "dark";
            if (document.body.classList.contains("light-theme")) {
                theme = "light";
                themeIcon.innerHTML = iconSun;
            } else {
                themeIcon.innerHTML = iconMoon;
            }
            localStorage.setItem("theme", theme);
        });
    }

    // 2. IDIOMA
    const langBtn = document.getElementById("lang-toggle");
    let currentLang = localStorage.getItem("lang") || "es";
    
    const translations = {
        es: {
            nav_about: "Sobre mí", nav_stack: "Stack", nav_exp: "Experiencia", nav_edu: "Formación", nav_projects: "Proyectos", nav_services: "Servicios", nav_contact: "Contactar",
            hero_badge: "Disponible para trabajar",
            hero_title_html: "Soluciones digitales. <br> <span class='text-gradient'>Procesos optimizados.</span>",
            hero_desc: "Daniel Navas. Desarrollador Web Full Stack Junior & Power Platform Developer. Desarrollo aplicaciones web modernas y automatizaciones empresariales enfocadas en la eficiencia.",
            hero_btn_projects: "Ver Proyectos", hero_btn_about: "Conóceme",
            about_label: "Sobre mí", 
            about_title_html: "Transformando ideas en <span class='text-gradient'>soluciones</span>", 
            about_p1_title: "Desarrollo y Automatización",
            about_p1: "Soy Desarrollador de Aplicaciones Web con experiencia en tecnologías Frontend, Backend, Bases de Datos y automatización de procesos empresariales.",
            about_p2: "Durante mi formación y experiencia profesional he trabajado en proyectos web completos, aplicaciones corporativas y soluciones basadas en Microsoft Power Platform. Me apasiona el aprendizaje continuo y crear herramientas que aporten valor real.",
            stat_1: "Años de formación", stat_2: "Tecnologías", stat_3: "Proyectos Web", stat_4: "Soluciones Power Platform",
            stack_label: "Tecnologías", 
            stack_title_html: "Stack <span class='text-gradient'>Tecnológico.</span>",
            stack_cat1: "Frontend", stack_cat2: "Backend", stack_cat3: "Bases de Datos", stack_cat4: "Power Platform", stack_cat5: "Herramientas & Otros",
            exp_label: "Trayectoria", 
            exp_title_html: "Experiencia <span class='text-gradient'>Profesional.</span>",
            exp1_role: "Prácticas · Transformación Digital & Automatización",
            exp1_desc: "Prácticas profesionales orientadas a la transformación digital y automatización en uno de los operadores portuarios líderes mundiales.",
            exp1_t1: "Automatización de procesos internos con Power Automate", exp1_t2: "Desarrollo de aplicaciones corporativas con Power Apps", exp1_t3: "Creación de informes y dashboards con Power BI", exp1_t4: "Gestión documental empresarial con SharePoint", exp1_rec: "Ver Recomendación de APM Terminals",
            exp2_role: "Especialista Técnico y Coordinador de SAT",
            exp2_desc: "Sector: Telecomunicaciones y Reparación de Electrónica de Consumo",
            exp2_t1: "Liderazgo de Equipos: Dirección y coordinación de equipos de hasta 20 personas enfocados en objetivos comerciales.", exp2_t2: "Gestión Operativa: Responsable de cuenta de resultados de tienda, control de stock y análisis de KPIs.", exp2_t3: "Especialista Técnico: Diagnóstico avanzado y reparación hardware/software con microsoldadura.",
            edu_label: "Formación", 
            edu_title_html: "Estudios y <span class='text-gradient'>Certificaciones.</span>",
            edu1_title: "Técnico Superior DAW", edu2_title: "Analista Ciberseguridad Junior", edu_cv: "Currículum Vitae", edu_cv_desc: "Descarga el PDF completo con toda mi trayectoria profesional.", edu_cv_btn: "Descargar CV",
            projects_title_html: "Trabajos <span class='text-gradient'>Destacados.</span>", status_done: "Completado", status_dev: "En desarrollo",
            proj1_desc: "Desarrollo de Super App de Operaciones para gestión de incidencias, formularios y flujos automáticos legales, y sistema de notificaciones de seguridad.", proj1_btn: "Ver Galería",
            proj2_desc: "Aplicación enfocada a la gestión de negocios de hostelería, incluyendo control de productos y procesos internos.",
            proj3_desc: "Aplicación web enfocada a la gestión de ligas y torneos de tenis/padel en clubs locales.", proj3_btn: "Servidor de Pruebas ↗",
            proj4_desc: "Proyecto ganador del concurso de postales de la Escuela Oficial de Idiomas Algeciras.",
            serv_title_html: "¿En qué puedo <span class='text-gradient'>ayudarte?</span>",
            serv1_title: "Desarrollo Web", serv1_desc: "Creación de aplicaciones web personalizadas, modernas y optimizadas para rendimiento. Full Stack con HTML, CSS, JS, PHP y bases de datos.",
            serv2_title: "Automatización Empresarial", serv2_desc: "Digitalización de procesos mediante Microsoft Power Platform (Power Apps, Power Automate, SharePoint) para maximizar la eficiencia operativa.",
            serv3_title: "Bases de Datos", serv3_desc: "Diseño, gestión y optimización de bases de datos relacionales con MySQL y SQL. Arquitecturas escalables y consultas eficientes.",
            serv4_title: "Análisis de Datos", serv4_desc: "Creación de dashboards e informes interactivos con Power BI para la toma de decisiones basada en datos.",
            contact_label: "Contacto", 
            contact_title_html: "Hablemos de tu <span class='text-gradient'>proyecto.</span>", contact_p: "Estoy disponible para nuevas oportunidades laborales, proyectos freelance y colaboraciones. No dudes en escribirme.",
            contact_avail: "Disponible para trabajar", contact_btn: "Enviar mensaje", footer_copy: "Todos los derechos reservados."
        },
        en: {
            nav_about: "About", nav_stack: "Stack", nav_exp: "Experience", nav_edu: "Education", nav_projects: "Projects", nav_services: "Services", nav_contact: "Contact",
            hero_badge: "Available for work",
            hero_title_html: "Digital solutions. <br> <span class='text-gradient'>Optimized processes.</span>",
            hero_desc: "Daniel Navas. Junior Full Stack Web Developer & Power Platform Developer. I develop modern web applications and business automations focused on efficiency.",
            hero_btn_projects: "View Projects", hero_btn_about: "Get to know me",
            about_label: "About Me", 
            about_title_html: "Transforming ideas into <span class='text-gradient'>solutions</span>", 
            about_p1_title: "Development & Automation",
            about_p1: "I am a Web Application Developer with experience in Frontend, Backend, Databases, and business process automation.",
            about_p2: "During my studies and professional background, I have worked on full web projects, corporate apps, and Microsoft Power Platform solutions. I am passionate about continuous learning and creating tools that provide real value.",
            stat_1: "Years of training", stat_2: "Technologies", stat_3: "Web Projects", stat_4: "Power Platform Solutions",
            stack_label: "Technologies", 
            stack_title_html: "Tech <span class='text-gradient'>Stack.</span>",
            stack_cat1: "Frontend", stack_cat2: "Backend", stack_cat3: "Databases", stack_cat4: "Power Platform", stack_cat5: "Tools & Others",
            exp_label: "Career", 
            exp_title_html: "Professional <span class='text-gradient'>Experience.</span>",
            exp1_role: "Internship · Digital Transformation & Automation",
            exp1_desc: "Professional internship focused on digital transformation and automation in one of the world's leading port operators.",
            exp1_t1: "Internal process automation with Power Automate", exp1_t2: "Corporate app development with Power Apps", exp1_t3: "Reporting and dashboards with Power BI", exp1_t4: "Enterprise document management with SharePoint", exp1_rec: "View APM Terminals Recommendation",
            exp2_role: "Technical Specialist and SAT Coordinator",
            exp2_desc: "Sector: Telecommunications and Consumer Electronics Repair",
            exp2_t1: "Team Leadership: Direction and coordination of teams up to 20 people focused on commercial goals.", exp2_t2: "Operational Management: Responsible for store P&L, stock control, and KPI analysis.", exp2_t3: "Technical Specialist: Advanced diagnostics and hardware/software repair with microsoldering.",
            edu_label: "Education", 
            edu_title_html: "Studies and <span class='text-gradient'>Certifications.</span>",
            edu1_title: "Higher Tech. in Web Dev.", edu2_title: "Junior Cybersecurity Analyst", edu_cv: "Resume", edu_cv_desc: "Download full PDF with my complete professional trajectory.", edu_cv_btn: "Download CV",
            projects_title_html: "Featured <span class='text-gradient'>Works.</span>", status_done: "Completed", status_dev: "In Development",
            proj1_desc: "Operations Super App development for incident management, automatic legal workflows, and security notification system.", proj1_btn: "View Gallery",
            proj2_desc: "Application focused on the management of hospitality businesses, including product control and internal processes.",
            proj3_desc: "Web application focused on the management of tennis/padel leagues and tournaments in local clubs.", proj3_btn: "Test Server ↗",
            proj4_desc: "Winning project of the digital postcard contest at the Official Language School of Algeciras.",
            serv_title_html: "How can I <span class='text-gradient'>help you?</span>",
            serv1_title: "Web Development", serv1_desc: "Creation of custom, modern, and performance-optimized web applications. Full Stack with HTML, CSS, JS, PHP, and databases.",
            serv2_title: "Business Automation", serv2_desc: "Process digitalization via Microsoft Power Platform (Power Apps, Power Automate, SharePoint) to maximize operational efficiency.",
            serv3_title: "Databases", serv3_desc: "Design, management, and optimization of relational databases with MySQL and SQL. Scalable architectures and efficient queries.",
            serv4_title: "Data Analysis", serv4_desc: "Creation of interactive dashboards and reports with Power BI for data-driven decision making.",
            contact_label: "Contact", 
            contact_title_html: "Let's talk about your <span class='text-gradient'>project.</span>", contact_p: "I am available for new job opportunities, freelance projects, and collaborations. Feel free to reach out.",
            contact_avail: "Available for work", contact_btn: "Send message", footer_copy: "All rights reserved."
        }
    };
  
    function setLanguage(lang) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key]; 
            }
        });
        if (langBtn) langBtn.innerText = lang === "es" ? "EN" : "ES";
        localStorage.setItem("lang", lang);
    }
  
    setLanguage(currentLang);
  
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = currentLang === "es" ? "en" : "es";
            setLanguage(currentLang);
        });
    }

    // 3. MENU MÓVIL
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // 4. GSAP ANIMATIONS & EXPLODED VIEW (NUEVO EFECTO TIPO APPLE)
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // --- ENTRADA DE TEXTO HERO ---
        gsap.fromTo(".hero-fade-up", 
            { y: 40, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 }
        );

        // --- LOGICA DE ENSAMBLAJE 3D EN HERO ---
        
        // Estado disperso (posiciones iniciales 3D)
        const scatterData = [
            { x: -50, y: 100, z: -100, rotationX: 10, rotationY: -15, rotationZ: -5 }, // Base Editor
            { x: 150, y: -50, z: 200, rotationX: 15, rotationY: -25, rotationZ: 10 },  // Widget
            { x: -100, y: -80, z: 150, rotationX: -20, rotationY: 20, rotationZ: 15 }, // DB Icon
            { x: 120, y: 120, z: 100, rotationX: -10, rotationY: 10, rotationZ: -20 }  // Tag
        ];

        const pieces = document.querySelectorAll('.assemble-piece');
        
        // Setear posiciones dispersas al instante
        pieces.forEach((piece, i) => {
            if(scatterData[i]) gsap.set(piece, scatterData[i]);
        });

        // Entrar con un pequeño salto para que se vean aparecer
        gsap.from(".assemble-piece", {
            opacity: 0, scale: 0.5, duration: 1.5, stagger: 0.1, ease: "back.out(1.2)"
        });

        // Al hacer scroll, todo vuelve a su posición perfecta (x:0, y:0, z:0, rotaciones 0)
        let mm = gsap.matchMedia();
        
        // En escritorio ensamblamos de forma progresiva según el scroll general de la sección Hero
        mm.add("(min-width: 769px)", () => {
            gsap.to('.assemble-piece', {
                x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1,
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top", // Empieza al hacer scroll
                    end: "bottom top", // Termina cuando salimos del hero
                    scrub: 1.5 // Suavidad extrema
                }
            });
        });

        // En móvil lo hacemos un poco antes porque la sección se alarga más
        mm.add("(max-width: 768px)", () => {
            gsap.to('.assemble-piece', {
                x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1,
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top 30%",
                    end: "bottom 80%",
                    scrub: 1
                }
            });
        });

        // --- ANIMACIONES DEL RESTO DE LA PÁGINA ---
        gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
            gsap.fromTo(elem, 
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                  scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }
                }
            );
        });

        gsap.utils.toArray(".gsap-zoom-in").forEach(elem => {
            gsap.fromTo(elem, 
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out",
                  scrollTrigger: { trigger: elem, start: "top 88%", toggleActions: "play none none none" }
                }
            );
        });
    }

    // 5. ENVÍO DE FORMULARIO
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value || 'Contacto desde Portfolio';
            const mensaje = document.getElementById('mensaje').value;
            
            const cuerpo = `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`;
            window.location.href = `mailto:danielnavas711900@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
            
            const btn = contactForm.querySelector('button');
            if(btn) {
                const originalText = btn.innerHTML;
                btn.textContent = 'Abriendo correo...';
                setTimeout(() => { btn.innerHTML = originalText; contactForm.reset(); }, 3000);
            }
        });
    }
});

// 6. MODAL GALERÍA
window.openGallery = function(projectId) {
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;
    const modalContent = modal.querySelector('.modal-content');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
  
    if (typeof gsap !== "undefined") {
      gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(modalContent, { y: 30, scale: 0.95 }, { y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
    }
};
  
window.closeGallery = function() {
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;
    const modalContent = modal.querySelector('.modal-content');
  
    if (typeof gsap !== "undefined") {
      gsap.to(modalContent, { y: 20, scale: 0.95, duration: 0.3, ease: 'power2.in' });
      gsap.to(modal, { opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => { modal.classList.remove('active'); document.body.style.overflow = ''; }
      });
    } else {
      modal.classList.remove('active'); document.body.style.overflow = '';
    }
};
