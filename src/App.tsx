import React, { useRef } from 'react';
import { Download, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useResumeData } from './hooks/useResumeData';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { EducationForm } from './components/EducationForm';
import { ExperienceForm } from './components/ExperienceForm';
import { SkillsForm } from './components/SkillsForm';
import { ProjectsForm } from './components/ProjectsForm';
import { ResumePreview } from './components/ResumePreview';

function App() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const {
    resumeData,
    updatePersonalInfo,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    updateSkills,
    addProject,
    updateProject,
    removeProject
  } = useResumeData();

  const handleDownloadPDF = () => {
    if (resumeRef.current) {
      const element = resumeRef.current;
      const opt = {
        margin: 0.5,
        filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Resume Generator</h1>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Forms Column */}
          <div className="space-y-6">
            <PersonalInfoForm
              personalInfo={resumeData.personalInfo}
              onUpdate={updatePersonalInfo}
            />
            
            <EducationForm
              education={resumeData.education}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onRemove={removeEducation}
            />
            
            <ExperienceForm
              experience={resumeData.experience}
              onAdd={addExperience}
              onUpdate={updateExperience}
              onRemove={removeExperience}
            />
            
            <SkillsForm
              skills={resumeData.skills}
              onUpdate={updateSkills}
            />
            
            <ProjectsForm
              projects={resumeData.projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onRemove={removeProject}
            />
          </div>

          {/* Preview Column */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Resume Preview
              </h3>
              <div className="overflow-auto max-h-[800px] border border-gray-200 rounded">
                <ResumePreview ref={resumeRef} resumeData={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;