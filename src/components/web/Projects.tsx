'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Reveal } from '../Reveal';
import '../../styles/projects-grid.css';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  project_link: string | null;
}

const WEB_PROJECTS: Project[] = [
  {
    id: 4,
    title: 'HH mart dashboard',
    description: 'HH Mart Dashboard is a retail analytics interface that provides real-time insights into sales, profit, bills, and inventory performance with clean visual reports.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775375350/mart-dashboard_xl6cw4.jpg',
    project_link: null,
  },
  {
    id: 7,
    title: 'PRIZZ0',
    description: 'This is a mobile grocery and delivery app interface that allows users to search and order daily essentials like groceries, food, medicines, and electronics. It features categorized browsing, personalized suggestions, location-based services, and quick access to offers like "Biryani Special" for a seamless shopping experience.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775376686/Screenshot_2026-04-05_133835_kezrfe.png',
    project_link: 'https://prizzo-five.vercel.app',
  },
  {
    id: 5,
    title: 'HH Mart Billing system',
    description: 'HH Mart Billing System is a fast and efficient POS interface for managing billing, barcode scanning, customer details, and seamless checkout operations.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775375747/billing_system_cv1mw8.jpg',
    project_link: null,
  },
  {
    id: 6,
    title: 'GOODS GAADI',
    description: 'GoodsGaadi is an online platform for buying and selling trusted used commercial vehicles. It connects buyers and sellers with a simple interface, allowing users to list vehicles, browse listings, and find reliable transport options quickly. The platform focuses on ease of use, trust, and efficient vehicle discovery.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775376095/Screenshot_2026-04-05_133019_zqycty.png',
    project_link: 'https://goodsgaadi.com',
  },
  {
    id: 8,
    title: 'TETCYEE',
    description: 'This is a modern e-commerce landing page for a shoe brand, showcasing trendy footwear with a clean and stylish UI. It highlights featured products, includes a strong call-to-action, and provides easy navigation for browsing and shopping.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775376861/Screenshot_2026-04-05_134326_itpt1j.png',
    project_link: 'https://www.tetcyee.com/',
  },
  {
    id: 9,
    title: 'No Due Certificate Generator(PESIAMS)',
    description: 'No Due Certificate Generator is a digital system designed for PESIAMS to manage and approve student clearance efficiently. It allows admins and HODs to track student eligibility, verify records, and generate no due certificates through a simple and organized interface.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775381185/nodue_tj0xfh.jpg',
    project_link: null,
  },
  {
    id: 11,
    title: 'Personal Portfolio',
    description: 'This is a personal portfolio website showcasing a full-stack developer\'s profile, skills, projects, and achievements. It features a modern design with interactive elements and provides easy access to resume download and contact information.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775383206/Screenshot_2026-04-05_152748_tpkwpw.png',
    project_link: 'https://rihan27.vercel.app/',
  },
  {
    id: 10,
    title: 'TETCYEE Billing Software',
    description: 'This is a mobile billing interface for a shoe shop that enables quick item entry, real-time bill calculation, and instant bill preview. It includes features like quantity and price input, discount application, and print-ready invoice generation for efficient checkout.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775381414/tetcyee_billing_lyxfqw.jpg',
    project_link: null,
  },
  {
    id: 12,
    title: 'Time Table PWA(PESIAMS)',
    description: 'MyClassSchedule is a smart timetable app that helps students manage and view daily classes with a clean and intuitive interface. It supports offline access, highlights upcoming schedules, and provides an organized view of subjects, timings, and sessions.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775384032/Screenshot_2026-04-05_154301_qxysfp.png',
    project_link: 'https://myclassschedule.vercel.app/',
  },
];

const ProjectCard = ({ project, i }: { project: Project; i: number }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.article
      className={`proj-item ${isMobile && isInView ? 'mobile-hover' : ''}`}
      id={`project-${project.id}`}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      viewport={{ once: false, amount: 0.5 }}
      whileInView={{ 
        y: [0, -8, 0],
        boxShadow: [
          "0 2px 12px rgba(0, 0, 0, 0.04)", 
          "0 15px 35px rgba(128, 0, 0, 0.06)", 
          "0 2px 12px rgba(0, 0, 0, 0.04)"
        ]
      }}
      transition={{
        duration: 2,
        delay: (i % 3) * 0.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <div className="proj-item__img-wrap">
        <span className="proj-item__number">
          {String(i + 1).padStart(2, '0')}
        </span>
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
          className="proj-item__img"
          unoptimized={true}
        />
      </div>

      <div className="proj-item__info">
        <h3 className="proj-item__title">{project.title}</h3>
        <p className="proj-item__desc">{project.description}</p>

        {project.project_link && (
          <a
            href={project.project_link}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-item__link"
          >
            View Live Site <span className="proj-item__arrow">↗</span>
          </a>
        )}
      </div>
    </motion.article>
  );
};

export function Projects() {
  return (
    <section id="projects" className="w-services" aria-label="Projects">
      <div className="w-services__inner">
        <Reveal>
          <p className="w-services__eyebrow">Our Work</p>
          <p className="w-services__desc">
            A showcase of real-world projects we&apos;ve built — from dashboards and billing systems to e-commerce platforms and PWAs.
          </p>
        </Reveal>

        <div className="proj-grid">
          {WEB_PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
