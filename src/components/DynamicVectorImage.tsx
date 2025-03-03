'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDocker, faPhp, faGithub, faSymfony, faReact, faNodeJs, faAws,
    faPython, faLaravel, faJs, faGit, faVuejs, faCss3Alt, faAndroid,
    faApple, faYarn, faNpm, faNode, faAirbnb, faBitcoin, faYoutube,
    faXbox, faWordpress, faWhatsapp, faBitbucket, faBlogger,
    faBluetooth, faChrome, faCreativeCommons, faJava, faPlaystation, 
    faUnity, faTiktok, faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import '@/styles/DynamicVectorImage.css';


const techIcons = [
    { icon: faDocker, name: 'Docker' },
    { icon: faReact, name: 'Next.js' },
    { icon: faSymfony, name: 'Symfony' },
    { icon: faPhp, name: 'PHP' },
    { icon: faGithub, name: 'GitHub' },
    { icon: faNodeJs, name: 'Node.js' },
    { icon: faAws, name: 'AWS' },
    { icon: faPython, name: 'Python' },
    { icon: faLaravel, name: 'Laravel' },
    { icon: faJs, name: 'JavaScript' },
    { icon: faGit, name: 'Git' },
    { icon: faVuejs, name: 'Vue.js' },
    { icon: faCss3Alt, name: 'CSS3' },
    { icon: faAndroid, name: 'Android' },
    { icon: faApple, name: 'Apple' },
    { icon: faYarn, name: 'Yarn' },
    { icon: faNpm, name: 'NPM' },
    { icon: faNode, name: 'Node.js' },
    { icon: faAirbnb, name: 'Airbnb' },
    { icon: faBitcoin, name: 'Bitcoin' },
    { icon: faYoutube, name: 'YouTube' },
    { icon: faXbox, name: 'Xbox' },
    { icon: faWordpress, name: 'WordPress' },
    { icon: faWhatsapp, name: 'WhatsApp' },
    { icon: faBitbucket, name: 'Bitbucket' },
    { icon: faBlogger, name: 'Blogger' },
    { icon: faBluetooth, name: 'Bluetooth' },
    { icon: faChrome, name: 'Chrome' },
    { icon: faCreativeCommons, name: 'Creative Commons' },
    { icon: faJava, name: 'Java' },
    { icon: faPlaystation, name: 'PlayStation' },
    { icon: faUnity, name: 'Unity' },
    { icon: faTiktok, name: 'TikTok' },
    { icon: faLinkedin, name: 'LinkedIn' }
];

export default function DynamicVectorImage() {
    return (
        <div className="vector-container">
            <div className="vector-content">
                <h2 className="vector-title">Prácticas en CodeArts Solutions</h2>
                <p className="vector-subtitle">Consigue un perfil profesional atractivo integrándote en un equipo que se preocupa por ti</p>
            </div>
            <div className="floating-logos-container">
                <div className="floating-logos">
                    {techIcons.map((tech, index) => (
                        <motion.div
                            key={index}
                            className="floating-logo"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: [
                                    Math.random() * 400 - 200,
                                    Math.random() * 600 - 300,
                                    Math.random() * 400 - 200,
                                    Math.random() * 300 - 150
                                ],
                                y: [
                                    Math.random() * 250 - 125,
                                    Math.random() * 400 - 200,
                                    Math.random() * 500 - 250,
                                    Math.random() * 300 - 150
                                ]
                            }}
                            transition={{ duration: Math.random() * 8 + 5, repeat: Infinity, ease: 'linear' }}
                        >
                            <FontAwesomeIcon icon={tech.icon} size="3x" title={tech.name} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
