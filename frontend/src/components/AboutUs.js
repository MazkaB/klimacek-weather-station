import React from 'react';
import { 
  UserGroupIcon, 
  StarIcon, 
  LightBulbIcon,
  ChartBarIcon,
  PaintBrushIcon,
  CogIcon,
  CurrencyDollarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Aditya Wisnu Yudha Marsudi",
      role: "Business & Marketing Hustler",
      icon: ChartBarIcon,
      description: "As a hustler, Aditya leads the team with a strategic role in driving business and marketing. Wisnu integrates his expertise in technical decision-making with the ability to build networks and design market strategies. His organizational experience in UNS Student Executive Board and experience as a Public Relation further strengthens his leadership in coordinating activities, driving innovation, and ensuring the right business direction.",
      color: "bg-blue-500",
      skills: ["Business Strategy", "Marketing", "Leadership", "Network Building", "Public Relations"]
    },
    {
      name: "Mazka Buana Hidayat",
      role: "Technologist & Product Developer",
      icon: CogIcon,
      description: "Mazka is responsible for developing the team's applications and websites with programming expertise. Her experience in data analysis competitions, hackathons, and deep understanding of machine learning and deep learning provide innovative digital solutions. Mazka's achievements in the Statistical Project for Smart Students as well as making it to the final stage of the Hackathon, prove her capability of creating practical solutions, skills that are highly relevant in the development of Klimatani.",
      color: "bg-green-500",
      skills: ["Programming", "Machine Learning", "Deep Learning", "Data Analysis", "Web Development"]
    },
    {
      name: "Desnia Anindy Irni Hareva",
      role: "Designer & Branding",
      icon: PaintBrushIcon,
      description: "As a hipster, Desnia focuses on the creative and aesthetic aspects of the team. Desnia designs the UI/UX of apps and websites, manages publications, and devises engaging digital marketing strategies. Her experience as Manager Social Media Specialist and achievements in infographic poster competitions demonstrate her ability to communicate complex information through attractive visual design, a key skill in Klimatani's branding strategy.",
      color: "bg-purple-500",
      skills: ["UI/UX Design", "Branding", "Social Media", "Digital Marketing", "Visual Communication"]
    },
    {
      name: "Pramudya Jesril Pratama",
      role: "Operations & Process Management",
      icon: LightBulbIcon,
      description: "In his operator role, Pramudya ensures that operational and production processes run smoothly. Armed with expertise in toolmaking and instrumentation as a physics student, Jesril coordinates technical activities. His participation in various instrumentation trainings has given him an in-depth understanding of operational tools for modern agriculture, making him highly competent in implementing Klimatani's efficient and quality production processes.",
      color: "bg-orange-500",
      skills: ["Operations Management", "Instrumentation", "Physics", "Process Optimization", "Technical Coordination"]
    },
    {
      name: "Divya Zahranika",
      role: "Financial & Administrative Manager",
      icon: CurrencyDollarIcon,
      description: "Divya is in charge of managing the financial and administrative aspects of the team, from RAB creation, budget management, to internal administrative checks. Divya ensures transparent and efficient management of financial resources, supporting the team's stability and sustainable growth. Her experience as Secretary and Treasurer Coordinator and Sponsorship Staff provides a strong foundation in financial management and project administration, skills that are highly relevant in her role managing the financial aspects of Klimatani.",
      color: "bg-indigo-500",
      skills: ["Financial Management", "Budget Planning", "Administration", "Resource Management", "Project Coordination"]
    }
  ];

  const achievements = [
    {
      title: "Weather Monitoring Excellence",
      description: "Advanced 8-sensor weather station with real-time monitoring capabilities",
      icon: StarIcon
    },
    {
      title: "AI-Powered Predictions",
      description: "LSTM neural network models for accurate weather forecasting up to 30 days",
      icon: AcademicCapIcon
    },
    {
      title: "User-Friendly Interface",
      description: "Intuitive dashboard design for easy weather data visualization and analysis",
      icon: LightBulbIcon
    },
    {
      title: "Sustainable Technology",
      description: "Solar-powered monitoring system with eco-friendly design principles",
      icon: CogIcon
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          👥 Meet the KlimaStation Team
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          We are a passionate team of students and professionals dedicated to revolutionizing 
          weather monitoring through innovative technology and AI-powered solutions.
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="h-5 w-5" />
            <span>5 Team Members</span>
          </div>
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="h-5 w-5" />
            <span>Universitas Sebelas Maret</span>
          </div>
          <div className="flex items-center space-x-2">
            <StarIcon className="h-5 w-5" />
            <span>Award-Winning Project</span>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">🎯 Our Mission</h2>
            <p className="text-lg opacity-90">
              To democratize weather monitoring technology by providing accurate, 
              real-time weather data and AI-powered predictions that help communities 
              make informed decisions about agriculture, safety, and daily activities.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">🔮 Our Vision</h2>
            <p className="text-lg opacity-90">
              To become the leading provider of smart weather monitoring solutions 
              in Southeast Asia, empowering farmers, researchers, and communities 
              with cutting-edge meteorological intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Our Amazing Team</h2>
        
        <div className="space-y-8">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-lg p-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex flex-col md:flex items-center space-y-6 md:space-y-0 md:space-x-8`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-24 h-24 ${member.color} rounded-full flex items-center justify-center text-white`}>
                    <Icon className="h-12 w-12" />
                  </div>
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className={`text-lg font-medium mb-4`} style={{ color: member.color.replace('bg-', '#').replace('-500', '') }}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {member.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">🏆 Our Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">🛠️ Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CogIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Frontend</h3>
            <ul className="text-gray-600 space-y-1">
              <li>React.js</li>
              <li>Tailwind CSS</li>
              <li>Recharts</li>
              <li>Heroicons</li>
            </ul>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LightBulbIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Backend</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Flask (Python)</li>
              <li>TensorFlow/Keras</li>
              <li>NumPy & Pandas</li>
              <li>LSTM Models</li>
            </ul>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Database</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Supabase</li>
              <li>PostgreSQL</li>
              <li>Real-time Updates</li>
              <li>Authentication</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl text-white p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">📞 Get in Touch</h2>
        <p className="text-lg opacity-90 mb-6">
          Interested in collaborating or learning more about our weather monitoring solutions?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Email</strong><br />
            klimastation@uns.ac.id
          </div>
          <div>
            <strong>Location</strong><br />
            Surakarta, Central Java, Indonesia
          </div>
          <div>
            <strong>Institution</strong><br />
            Universitas Sebelas Maret
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;